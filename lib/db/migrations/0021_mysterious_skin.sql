CREATE TABLE "reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"anchor_type" text NOT NULL,
	"anchor_value" integer NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reminders_anchor_type_check" CHECK ("reminders"."anchor_type" IN ('day_of_month', 'days_before_end')),
	CONSTRAINT "reminders_anchor_value_range_check" CHECK (("reminders"."anchor_type" = 'day_of_month' AND "reminders"."anchor_value" BETWEEN 1 AND 31) OR ("reminders"."anchor_type" = 'days_before_end' AND "reminders"."anchor_value" BETWEEN 0 AND 27)),
	CONSTRAINT "reminders_text_len_check" CHECK (char_length(btrim("reminders"."text")) BETWEEN 1 AND 280)
);
--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reminders_user_id_idx" ON "reminders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reminders_service_id_idx" ON "reminders" USING btree ("service_id");