CREATE TABLE "tariffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"rate_t1" numeric(12, 4),
	"rate_t2" numeric(12, 4),
	"rate_t3" numeric(12, 4),
	"fixed_amount" numeric(12, 2),
	"valid_from" timestamp with time zone NOT NULL,
	"valid_to" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "tariffs_valid_to_check" CHECK ("tariffs"."valid_to" IS NULL OR "tariffs"."valid_to" > "tariffs"."valid_from"),
	CONSTRAINT "tariffs_metered_xor_fixed_check" CHECK (("tariffs"."rate_t1" IS NOT NULL AND "tariffs"."fixed_amount" IS NULL) OR ("tariffs"."fixed_amount" IS NOT NULL AND "tariffs"."rate_t1" IS NULL)),
	CONSTRAINT "tariffs_rates_positive_check" CHECK (("tariffs"."rate_t1" IS NULL OR "tariffs"."rate_t1" > 0) AND ("tariffs"."rate_t2" IS NULL OR "tariffs"."rate_t2" > 0) AND ("tariffs"."rate_t3" IS NULL OR "tariffs"."rate_t3" > 0)),
	CONSTRAINT "tariffs_fixed_nonneg_check" CHECK ("tariffs"."fixed_amount" IS NULL OR "tariffs"."fixed_amount" >= 0)
);
--> statement-breakpoint
CREATE TABLE "account_numbers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"value" text NOT NULL,
	"valid_from" timestamp with time zone NOT NULL,
	"valid_to" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "account_numbers_valid_to_check" CHECK ("account_numbers"."valid_to" IS NULL OR "account_numbers"."valid_to" > "account_numbers"."valid_from")
);
--> statement-breakpoint
CREATE TABLE "payment_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"details" text NOT NULL,
	"valid_from" timestamp with time zone NOT NULL,
	"valid_to" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "payment_details_valid_to_check" CHECK ("payment_details"."valid_to" IS NULL OR "payment_details"."valid_to" > "payment_details"."valid_from")
);
--> statement-breakpoint
ALTER TABLE "tariffs" ADD CONSTRAINT "tariffs_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_numbers" ADD CONSTRAINT "account_numbers_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_details" ADD CONSTRAINT "payment_details_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tariffs_contract_id_valid_from_idx" ON "tariffs" USING btree ("contract_id","valid_from");--> statement-breakpoint
CREATE INDEX "tariffs_deleted_at_idx" ON "tariffs" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "account_numbers_contract_id_valid_from_idx" ON "account_numbers" USING btree ("contract_id","valid_from");--> statement-breakpoint
CREATE INDEX "account_numbers_deleted_at_idx" ON "account_numbers" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "payment_details_contract_id_valid_from_idx" ON "payment_details" USING btree ("contract_id","valid_from");--> statement-breakpoint
CREATE INDEX "payment_details_deleted_at_idx" ON "payment_details" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "tariffs" ADD CONSTRAINT "tariffs_no_overlap_excl" EXCLUDE USING gist (contract_id WITH =, tstzrange(valid_from, valid_to, '[)') WITH &&) WHERE (deleted_at IS NULL);--> statement-breakpoint
ALTER TABLE "account_numbers" ADD CONSTRAINT "account_numbers_no_overlap_excl" EXCLUDE USING gist (contract_id WITH =, tstzrange(valid_from, valid_to, '[)') WITH &&) WHERE (deleted_at IS NULL);--> statement-breakpoint
ALTER TABLE "payment_details" ADD CONSTRAINT "payment_details_no_overlap_excl" EXCLUDE USING gist (contract_id WITH =, tstzrange(valid_from, valid_to, '[)') WITH &&) WHERE (deleted_at IS NULL);