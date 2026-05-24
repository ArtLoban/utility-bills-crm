CREATE TABLE "service_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"measurement_type" text NOT NULL,
	"unit" text,
	"supports_zones" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "service_types_measurement_type_check" CHECK ("service_types"."measurement_type" IN ('metered', 'fixed')),
	CONSTRAINT "service_types_unit_check" CHECK ("service_types"."unit" IN ('kwh', 'm3', 'gcal') OR "service_types"."unit" IS NULL),
	CONSTRAINT "service_types_metered_unit_check" CHECK (("service_types"."measurement_type" = 'metered') = ("service_types"."unit" IS NOT NULL))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "service_types_code_unique_idx" ON "service_types" USING btree ("code");--> statement-breakpoint
CREATE INDEX "service_types_active_sort_idx" ON "service_types" USING btree ("is_active","sort_order");--> statement-breakpoint
INSERT INTO "service_types" ("id", "code", "measurement_type", "unit", "supports_zones", "sort_order", "is_active", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'electricity',          'metered', 'kwh', true,  10,  true, now(), now()),
  (gen_random_uuid(), 'gas',                  'metered', 'm3',  false, 20,  true, now(), now()),
  (gen_random_uuid(), 'cold_water',           'metered', 'm3',  false, 30,  true, now(), now()),
  (gen_random_uuid(), 'hot_water',            'metered', 'm3',  false, 40,  true, now(), now()),
  (gen_random_uuid(), 'gas_delivery',         'fixed',   NULL,  false, 50,  true, now(), now()),
  (gen_random_uuid(), 'heating',              'fixed',   NULL,  false, 60,  true, now(), now()),
  (gen_random_uuid(), 'building_maintenance', 'fixed',   NULL,  false, 70,  true, now(), now()),
  (gen_random_uuid(), 'garbage_collection',   'fixed',   NULL,  false, 80,  true, now(), now()),
  (gen_random_uuid(), 'internet',             'fixed',   NULL,  false, 90,  true, now(), now()),
  (gen_random_uuid(), 'intercom',             'fixed',   NULL,  false, 100, true, now(), now()),
  (gen_random_uuid(), 'hoa_fees',             'fixed',   NULL,  false, 110, true, now(), now())
ON CONFLICT (code) DO NOTHING;