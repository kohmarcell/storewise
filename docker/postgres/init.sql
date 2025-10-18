-- Create additional extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || sku));

-- Create database views for reporting
CREATE OR REPLACE VIEW vw_product_stock_value AS
SELECT
  p.id,
  p.sku,
  p.name,
  p.stock_qty,
  p.cost_price,
  (p.stock_qty * p.cost_price) AS stock_value,
  c.name AS category_name,
  p.is_active
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.deleted_at IS NULL;

CREATE OR REPLACE VIEW vw_low_stock_products AS
SELECT
  p.id,
  p.sku,
  p.name,
  p.stock_qty,
  p.min_qty,
  (p.min_qty - p.stock_qty) AS shortage_qty,
  c.name AS category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.stock_qty < p.min_qty
  AND p.is_active = true
  AND p.deleted_at IS NULL
ORDER BY (p.min_qty - p.stock_qty) DESC;

-- Create function for generating invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  sequence_num INTEGER;
BEGIN
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');

  CREATE TEMPORARY SEQUENCE IF NOT EXISTS temp_invoice_seq;

  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 9) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM sales
  WHERE invoice_number LIKE 'INV-' || date_part || '-%';

  RETURN 'INV-' || date_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function for calculating customer tier
CREATE OR REPLACE FUNCTION calculate_customer_tier(total_purchase DECIMAL)
RETURNS UUID AS $$
DECLARE
  tier_id UUID;
BEGIN
  SELECT id INTO tier_id
  FROM customer_tiers
  WHERE total_purchase >= min_lifetime_purchase
  ORDER BY min_lifetime_purchase DESC
  LIMIT 1;

  RETURN COALESCE(tier_id, (SELECT id FROM customer_tiers WHERE name = 'Regular'));
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating customer tier
CREATE OR REPLACE FUNCTION update_customer_tier()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers
  SET tier_id = calculate_customer_tier(NEW.lifetime_purchase)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stock movement logging
CREATE OR REPLACE FUNCTION log_stock_movement()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products
    SET stock_qty = stock_qty + NEW.qty
    WHERE id = NEW.product_id;

    -- Log the movement
    INSERT INTO stock_movements (product_id, type, qty, qty_before, qty_after, ref_type, ref_id, created_at)
    VALUES (
      NEW.product_id,
      CASE
        WHEN NEW.qty > 0 THEN 'IN'
        ELSE 'OUT'
      END,
      NEW.qty,
      (SELECT stock_qty FROM products WHERE id = NEW.product_id) - NEW.qty,
      (SELECT stock_qty FROM products WHERE id = NEW.product_id),
      'stock_adjustments',
      NEW.id,
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sale stock reduction
CREATE OR REPLACE FUNCTION reduce_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock_qty = stock_qty - NEW.qty
  WHERE id = NEW.product_id;

  -- Log the movement
  INSERT INTO stock_movements (product_id, type, qty, qty_before, qty_after, ref_type, ref_id, created_at)
  VALUES (
    NEW.product_id,
    'SALE',
    -NEW.qty,
    (SELECT stock_qty FROM products WHERE id = NEW.product_id) + NEW.qty,
    (SELECT stock_qty FROM products WHERE id = NEW.product_id),
    'sales',
    NEW.sale_id,
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;