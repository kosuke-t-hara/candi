-- Add new enum values for application stages and event kinds

-- application_events.kind に新しい種別を追加
ALTER TYPE "public"."application_event_kind" ADD VALUE 'aptitude_test';
ALTER TYPE "public"."application_event_kind" ADD VALUE 'offer_accepted';

-- applications.stage に 'accepted' を追加
ALTER TYPE "public"."application_stage" ADD VALUE 'accepted';
