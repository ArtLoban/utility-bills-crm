CREATE TABLE "meter_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meter_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "meter_services" ADD CONSTRAINT "meter_services_meter_id_meters_id_fk" FOREIGN KEY ("meter_id") REFERENCES "public"."meters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meter_services" ADD CONSTRAINT "meter_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "meter_services_meter_id_service_id_unique_idx" ON "meter_services" USING btree ("meter_id","service_id") WHERE "meter_services"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "meter_services_meter_id_idx" ON "meter_services" USING btree ("meter_id");--> statement-breakpoint
CREATE INDEX "meter_services_service_id_idx" ON "meter_services" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "meter_services_deleted_at_idx" ON "meter_services" USING btree ("deleted_at");--> statement-breakpoint
-- Backfill: link every active meter to every active service that shares its
-- (property, service type) — reproducing exactly today's implicit by-type matching.
INSERT INTO "meter_services" ("meter_id", "service_id")
SELECT m."id", s."id"
FROM "meters" m
JOIN "services" s
  ON s."property_id" = m."property_id"
 AND s."service_type_id" = m."service_type_id"
WHERE m."deleted_at" IS NULL
  AND s."deleted_at" IS NULL;--> statement-breakpoint
-- Remove the temporal exclusion constraint (added manually in 0010, not tracked by Drizzle):
-- multiple active meters per (property, service type) are now allowed at the DB level.
ALTER TABLE "meters" DROP CONSTRAINT "meters_no_overlap_excl";