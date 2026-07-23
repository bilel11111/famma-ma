
-- Outages: anonymous water outage reports
CREATE TYPE public.problem_type AS ENUM ('water_cut', 'low_pressure', 'contamination', 'leak');

CREATE TABLE public.outages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  governorate_id TEXT NOT NULL,
  delegation_id TEXT NOT NULL,
  problem_type public.problem_type NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  reporter_device TEXT NOT NULL,
  confirmations_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX outages_governorate_idx ON public.outages(governorate_id);
CREATE INDEX outages_created_idx ON public.outages(created_at DESC);

GRANT SELECT, INSERT ON public.outages TO anon;
GRANT SELECT, INSERT ON public.outages TO authenticated;
GRANT ALL ON public.outages TO service_role;

ALTER TABLE public.outages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read outages" ON public.outages FOR SELECT USING (true);
CREATE POLICY "Anyone can report outages" ON public.outages FOR INSERT WITH CHECK (true);

-- Confirmations (device-based dedup)
CREATE TABLE public.confirmations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outage_id UUID NOT NULL REFERENCES public.outages(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(outage_id, device_id)
);

CREATE INDEX confirmations_outage_idx ON public.confirmations(outage_id);

GRANT SELECT, INSERT, DELETE ON public.confirmations TO anon;
GRANT SELECT, INSERT, DELETE ON public.confirmations TO authenticated;
GRANT ALL ON public.confirmations TO service_role;

ALTER TABLE public.confirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read confirmations" ON public.confirmations FOR SELECT USING (true);
CREATE POLICY "Anyone can add confirmations" ON public.confirmations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can remove confirmations" ON public.confirmations FOR DELETE USING (true);

-- Trigger: maintain confirmations_count on outages
CREATE OR REPLACE FUNCTION public.update_confirmations_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.outages SET confirmations_count = confirmations_count + 1 WHERE id = NEW.outage_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.outages SET confirmations_count = GREATEST(confirmations_count - 1, 0) WHERE id = OLD.outage_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER confirmations_count_trigger
AFTER INSERT OR DELETE ON public.confirmations
FOR EACH ROW EXECUTE FUNCTION public.update_confirmations_count();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.outages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.confirmations;
