ALTER TABLE public.outages
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS source_url text;

CREATE UNIQUE INDEX IF NOT EXISTS outages_source_url_unique
  ON public.outages (source_url)
  WHERE source_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS outages_source_idx ON public.outages (source);