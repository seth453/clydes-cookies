import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(
  Deno.env.get("STRIPE_SECRET_KEY")!,
  {
    apiVersion: "2025-06-30.basil",
  }
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export default {
  fetch: withSupabase(
    { auth: "none" },
    async (req, ctx) => {
      if (req.method === "OPTIONS") {
        return new Response("ok", {
          headers: corsHeaders,
        });
      }

      try {
        const { cart, customerInfo } = await req.json();

        if (!cart || cart.length === 0) {
          throw new Error("Cart is empty.");
        }

        const line_items = [];

        for (const item of cart) {
          const { data: product, error } = await ctx.supabase
            .from("products")
            .select("id, name, price")
            .eq("id", item.id)
            .single();

          if (error || !product) {
            throw new Error(`Product not found: ${item.id}`);
          }

          line_items.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
              },
              unit_amount: Math.round(Number(product.price) * 100),
            },
            quantity: item.quantity,
          });
        }

        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          line_items,

          metadata: {
            customer_name: customerInfo?.name || "",
            customer_email: customerInfo?.email || "",
            pickup_time: customerInfo?.pickupTime || "",
            cart: JSON.stringify(
              cart.map((item) => ({
                id: item.id,
                quantity: item.quantity,
              }))
            ),
          },

          success_url: "https://clydescookies.com",
          cancel_url: "https://clydescookies.com",
        });

        return new Response(
          JSON.stringify({ url: session.url }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        console.error("Checkout error:", err);

        return new Response(
          JSON.stringify({
            error: err instanceof Error ? err.message : "Unknown error",
          }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }
  ),
};