-- Add job change related fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS job_change_priority text,
ADD COLUMN IF NOT EXISTS job_change_reason text,
ADD COLUMN IF NOT EXISTS job_change_avoid text;
