CREATE EXTENSION IF NOT EXISTS btree_gist;
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"valid_from" timestamp with time zone NOT NULL,
	"valid_to" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "contracts_valid_to_check" CHECK ("contracts"."valid_to" IS NULL OR "contracts"."valid_to" > "contracts"."valid_from")
);
--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "contracts_service_id_valid_from_idx" ON "contracts" USING btree ("service_id","valid_from");--> statement-breakpoint
CREATE INDEX "contracts_provider_id_idx" ON "contracts" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "contracts_deleted_at_idx" ON "contracts" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_no_overlap_excl"
  EXCLUDE USING gist (
    service_id WITH =,
    tstzrange(valid_from, valid_to, '[)') WITH &&
  ) WHERE (deleted_at IS NULL);