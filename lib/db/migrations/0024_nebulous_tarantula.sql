DROP INDEX "services_property_service_type_unique_idx";--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "name" text;--> statement-breakpoint
INSERT INTO "service_types" ("id", "code", "measurement_type", "unit", "supports_zones", "sort_order", "is_active", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'other', 'fixed', NULL, false, 1000, true, now(), now())
ON CONFLICT (code) DO NOTHING;