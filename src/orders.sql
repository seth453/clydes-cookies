CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  "desc" text,
  price numeric(10,2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  pickup_time timestamptz NOT NULL,
  total numeric(10,2) NOT NULL DEFAULT 0.00 CHECK (total >= 0),
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id),
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price numeric(10,2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_name ON public.products (name);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public reads for products" ON public.products;
DROP POLICY IF EXISTS "Allow public inserts for orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public reads for orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public inserts for order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public reads for order_items" ON public.order_items;

CREATE POLICY "Allow public reads for products" ON public.products
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public inserts for orders" ON public.orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public reads for orders" ON public.orders
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public inserts for order_items" ON public.order_items
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public reads for order_items" ON public.order_items
  FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.orders (customer_name, customer_email, pickup_time, total)
VALUES ('Test', 'test@example.com', now(), 10.00)
RETURNING id, customer_name, customer_email, total;

COMMIT;
