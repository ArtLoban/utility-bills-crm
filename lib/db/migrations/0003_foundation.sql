-- Required for exclusion constraints that combine equality operators (service_id WITH =)
-- with range overlap operators (tstzrange WITH &&).
-- Used across contracts, tariffs, account_numbers, payment_details, meters (Step 4+).
CREATE EXTENSION IF NOT EXISTS btree_gist;