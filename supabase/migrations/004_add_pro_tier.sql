-- Must run alone first (PostgreSQL commits new enum values separately)
ALTER TYPE subscription_tier ADD VALUE IF NOT EXISTS 'pro';
