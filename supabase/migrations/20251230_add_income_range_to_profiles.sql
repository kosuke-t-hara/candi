-- Add income range columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS desired_annual_income_min integer,
ADD COLUMN IF NOT EXISTS desired_annual_income_max integer;

-- Update existing data if needed (optional, assuming current desired_annual_income can be min)
UPDATE public.profiles 
SET desired_annual_income_min = desired_annual_income 
WHERE desired_annual_income IS NOT NULL AND desired_annual_income_min IS NULL;
