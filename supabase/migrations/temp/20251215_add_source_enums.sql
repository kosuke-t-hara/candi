-- Add 'self' and 'referral' to application_source enum
ALTER TYPE public.application_source ADD VALUE IF NOT EXISTS 'self';
ALTER TYPE public.application_source ADD VALUE IF NOT EXISTS 'referral';
