import Stripe from "npm:stripe@22.3.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2025-02-24.acacia",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

export default {
  async fetch(req: Request) {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    try {
      const body = await req.json();
      const { cart, customerInfo, successUrl, cancelUrl } = body;

      if (!Array.isArray(cart) || cart.length === 0) {
        return jsonResponse({ error: "Cart is empty" }, 400);
      }

      const origin = req.headers.get("origin") ?? "http://localhost:5173";
      const siteUrl = Deno.env.get("SITE_URL") ?? origin;

      const lineItems = cart.map((item: any) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        success_url: successUrl ?? `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl ?? `${siteUrl}/`,
        customer_email: customerInfo?.email,
        metadata: {
          customer_name: customerInfo?.name ?? "",
          pickup_time: customerInfo?.pickupTime ?? "",
        },
      });

      return jsonResponse({ url: session.url });
    } catch (error) {
      console.error("Stripe checkout error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      return jsonResponse({ error: message }, 500);
    }
  },
};
