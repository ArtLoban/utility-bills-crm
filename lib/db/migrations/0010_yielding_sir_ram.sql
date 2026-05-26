CREATE TABLE "meters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"service_type_id" uuid NOT NULL,
	"serial_number" text,
	"zone_count" smallint DEFAULT 1 NOT NULL,
	"installed_at" timestamp with time zone,
	"removed_at" timestamp with time zone,
	"valid_from" timestamp with time zone NOT NULL,
	"valid_to" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "meters_zone_count_check" CHECK ("meters"."zone_count" IN (1, 2, 3)),
	CONSTRAINT "meters_valid_to_check" CHECK ("meters"."valid_to" IS NULL OR "meters"."valid_to" > "meters"."valid_from"),
	CONSTRAINT "meters_removed_at_check" CHECK ("meters"."removed_at" IS NULL OR "meters"."installed_at" IS NULL OR "meters"."removed_at" > "meters"."installed_at")
);
--> statement-breakpoint
ALTER TABLE "meters" ADD CONSTRAINT "meters_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meters" ADD CONSTRAINT "meters_service_type_id_service_types_id_fk" FOREIGN KEY ("service_type_id") REFERENCES "public"."service_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "meters_property_id_service_type_id_valid_from_idx" ON "meters" USING btree ("property_id","service_type_id","valid_from");--> statement-breakpoint
CREATE INDEX "meters_deleted_at_idx" ON "meters" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "meters" ADD CONSTRAINT "meters_no_overlap_excl"
  EXCLUDE USING gist (
    property_id     WITH =,
    service_type_id WITH =,
    tstzrange(valid_from, valid_to, '[)') WITH &&
  ) WHERE (deleted_at IS NULL);