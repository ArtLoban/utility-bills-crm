CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"address" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "properties_type_check" CHECK ("properties"."type" IN ('apartment', 'house', 'cottage', 'other'))
);
--> statement-breakpoint
CREATE TABLE "property_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"property_role" text NOT NULL,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"granted_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "property_access_role_check" CHECK ("property_access"."property_role" IN ('owner', 'editor', 'viewer'))
);
--> statement-breakpoint
ALTER TABLE "property_access" ADD CONSTRAINT "property_access_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_access" ADD CONSTRAINT "property_access_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_access" ADD CONSTRAINT "property_access_granted_by_users_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "properties_deleted_at_idx" ON "properties" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "property_access_property_user_unique_idx" ON "property_access" USING btree ("property_id","user_id") WHERE "property_access"."deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX "property_access_user_id_idx" ON "property_access" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "property_access_property_id_idx" ON "property_access" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "property_access_deleted_at_idx" ON "property_access" USING btree ("deleted_at");