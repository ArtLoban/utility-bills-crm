CREATE TABLE "readings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meter_id" uuid NOT NULL,
	"read_at" timestamp with time zone NOT NULL,
	"value_t1" numeric(12, 3) NOT NULL,
	"value_t2" numeric(12, 3),
	"value_t3" numeric(12, 3),
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "readings_value_t1_check" CHECK ("readings"."value_t1" >= 0),
	CONSTRAINT "readings_value_t2_check" CHECK ("readings"."value_t2" IS NULL OR "readings"."value_t2" >= 0),
	CONSTRAINT "readings_value_t3_check" CHECK ("readings"."value_t3" IS NULL OR "readings"."value_t3" >= 0)
);
--> statement-breakpoint
ALTER TABLE "readings" ADD CONSTRAINT "readings_meter_id_meters_id_fk" FOREIGN KEY ("meter_id") REFERENCES "public"."meters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "readings" ADD CONSTRAINT "readings_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "readings_meter_id_read_at_idx" ON "readings" USING btree ("meter_id","read_at");--> statement-breakpoint
CREATE INDEX "readings_created_by_idx" ON "readings" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "readings_deleted_at_idx" ON "readings" USING btree ("deleted_at");