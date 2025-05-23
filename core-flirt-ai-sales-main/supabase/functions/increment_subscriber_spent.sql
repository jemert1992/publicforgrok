
-- Function to increment a subscriber's total spent amount
CREATE OR REPLACE FUNCTION public.increment_subscriber_spent(
  subscriber_id UUID,
  amount NUMERIC
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.subscribers
  SET 
    total_spent = total_spent + amount,
    last_purchase = NOW(),
    updated_at = NOW()
  WHERE id = subscriber_id;
END;
$$ LANGUAGE plpgsql;
