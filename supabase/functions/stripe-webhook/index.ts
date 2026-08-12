import Stripe from "npm:stripe@^22";
import { withSupabase } from "npm:@supabase/server@^1";

const stripe = new Stripe(
  Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
  {
    apiVersion: "2025-06-30.basil",
  }
);

const cryptoProvider = Stripe.createSubtleCryptoProvider();

export default {
  fetch: withSupabase(
    { auth: "none" },
    async (req, ctx) => {
      const signature = req.headers.get("Stripe-Signature");

      if (!signature) {
        return new Response("Missing Stripe signature", {
          status: 400,
        });
      }

      const body = await req.text();

      let event: Stripe.Event;

      try {
        event = await stripe.webhooks.constructEventAsync(
          body,
          signature,
          Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET")!,
          undefined,
          cryptoProvider
        );
      } catch (err) {
        console.error("Webhook signature verification failed:", err);

        return new Response("Invalid signature", {
          status: 400,
        });
      }

      console.log("Stripe event:", event.type);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        // Prevent duplicate orders
        const { data: existingOrder } = await ctx.supabaseAdmin
          .from("orders")
          .select("id")
          .eq("stripe_session_id", session.id)
          .maybeSingle();

        if (existingOrder) {
          return Response.json({ received: true });
        }

        const metadata = session.metadata || {};

        const customerName = metadata.customer_name || "";
        const customerEmail = metadata.customer_email || "";
        const pickupTime = metadata.pickup_time || "";

        const cart = JSON.parse(metadata.cart || "[]");

        // Create order
        const { data: order, error: orderError } =
          await ctx.supabaseAdmin
            .from("orders")
            .insert({
              customer_name: customerName,
              customer_email: customerEmail,
              pickup_time: pickupTime,
              total: (session.amount_total || 0) / 100,
              stripe_session_id: session.id,
            })
            .select()
            .single();

        if (orderError) {
          console.error("Order insert failed:", orderError);

          return new Response("Failed to create order", {
            status: 500,
          });
        }

        // Get REAL prices from Supabase
        const orderItems = [];

        for (const item of cart) {
          const { data: product, error: productError } =
            await ctx.supabaseAdmin
              .from("products")
              .select("id, price")
              .eq("id", item.id)
              .single();

          if (productError || !product) {
            console.error("Product not found:", item.id);

            return new Response("Product not found", {
              status: 500,
            });
          }

          orderItems.push({
            order_id: order.id,
            product_id: product.id,
            quantity: item.quantity,
            price: product.price,
          });
        }

        const { error: itemsError } =
          await ctx.supabaseAdmin
            .from("order_items")
            .insert(orderItems);

        if (itemsError) {
          console.error("Order items insert failed:", itemsError);

          return new Response("Failed to create order items", {
            status: 500,
          });
        }

        console.log(`Order ${order.id} created successfully.`);
      }

      return Response.json({ received: true });
    }
  ),
};