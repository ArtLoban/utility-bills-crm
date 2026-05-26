CREATE TABLE "bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" uuid NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"period_month" date NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"notes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "bills_amount_check" CHECK ("bills"."amount" >= 0),
	CONSTRAINT "bills_period_end_check" CHECK ("bills"."period_end" >= "bills"."period_start"),
	CONSTRAINT "bills_period_month_trunc_check" CHECK ("bills"."period_month" = date_trunc('month', "bills"."period_month")::date),
	CONSTRAINT "bills_period_month_overlap_check" CHECK ("bills"."period_month" >= date_trunc('month', "bills"."period_start")::date AND "bills"."period_month" <= date_trunc('month', "bills"."period_end")::date)
);
--> statement-breakpoint
ALTER TABLE "bills" ADD CONSTRAINT "bills_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bills" ADD CONSTRAINT "bills_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bills_service_id_period_month_idx" ON "bills" USING btree ("service_id","period_month");--> statement-breakpoint
CREATE INDEX "bills_service_id_period_range_idx" ON "bills" USING btree ("service_id","period_start","period_end");--> statement-breakpoint
CREATE INDEX "bills_created_by_idx" ON "bills" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "bills_deleted_at_idx" ON "bills" USING btree ("deleted_at");