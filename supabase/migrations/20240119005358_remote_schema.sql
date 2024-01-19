
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "next_auth";

ALTER SCHEMA "next_auth" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

CREATE SCHEMA IF NOT EXISTS "supabase_migrations";

ALTER SCHEMA "supabase_migrations" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."pricing_plan_interval" AS ENUM (
    'day',
    'week',
    'month',
    'year'
);

ALTER TYPE "public"."pricing_plan_interval" OWNER TO "postgres";

CREATE TYPE "public"."pricing_type" AS ENUM (
    'one_time',
    'recurring'
);

ALTER TYPE "public"."pricing_type" OWNER TO "postgres";

CREATE TYPE "public"."subscription_status" AS ENUM (
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid',
    'paused'
);

ALTER TYPE "public"."subscription_status" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "next_auth"."uid"() RETURNS uuid
    LANGUAGE "sql" STABLE
    AS $$
  select
    coalesce(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;

ALTER FUNCTION "next_auth"."uid"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS trigger
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "next_auth"."accounts" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "type" text NOT NULL,
    "provider" text NOT NULL,
    "providerAccountId" text NOT NULL,
    "refresh_token" text,
    "access_token" text,
    "expires_at" bigint,
    "token_type" text,
    "scope" text,
    "id_token" text,
    "session_state" text,
    "oauth_token_secret" text,
    "oauth_token" text,
    "userId" uuid
);

ALTER TABLE "next_auth"."accounts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "next_auth"."sessions" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "expires" timestamp with time zone NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" uuid
);

ALTER TABLE "next_auth"."sessions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "next_auth"."users" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "name" text,
    "email" text,
    "emailVerified" timestamp with time zone,
    "image" text
);

ALTER TABLE "next_auth"."users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "next_auth"."verification_tokens" (
    "identifier" text,
    "token" text NOT NULL,
    "expires" timestamp with time zone NOT NULL
);

ALTER TABLE "next_auth"."verification_tokens" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" uuid NOT NULL,
    "stripe_customer_id" text
);

ALTER TABLE "public"."customers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."prices" (
    "id" text NOT NULL,
    "product_id" text,
    "active" boolean,
    "description" text,
    "unit_amount" bigint,
    "currency" text,
    "type" public.pricing_type,
    "interval" public.pricing_plan_interval,
    "interval_count" integer,
    "trial_period_days" integer,
    "metadata" jsonb,
    CONSTRAINT "prices_currency_check" CHECK ((char_length(currency) = 3))
);

ALTER TABLE "public"."prices" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" text NOT NULL,
    "active" boolean,
    "name" text,
    "description" text,
    "image" text,
    "metadata" jsonb
);

ALTER TABLE "public"."products" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" text NOT NULL,
    "user_id" uuid NOT NULL,
    "status" public.subscription_status,
    "metadata" jsonb,
    "price_id" text,
    "quantity" integer,
    "cancel_at_period_end" boolean,
    "created" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "current_period_start" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "current_period_end" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "ended_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
    "cancel_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
    "canceled_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
    "trial_start" timestamp with time zone DEFAULT timezone('utc'::text, now()),
    "trial_end" timestamp with time zone DEFAULT timezone('utc'::text, now())
);

ALTER TABLE "public"."subscriptions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" uuid NOT NULL,
    "full_name" text,
    "avatar_url" text,
    "billing_address" jsonb,
    "payment_method" jsonb
);

ALTER TABLE "public"."users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "supabase_migrations"."schema_migrations" (
    "version" text NOT NULL,
    "statements" text[],
    "name" text
);

ALTER TABLE "supabase_migrations"."schema_migrations" OWNER TO "postgres";

ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."users"
    ADD CONSTRAINT "email_unique" UNIQUE ("email");

ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "provider_unique" UNIQUE ("provider", "providerAccountId");

ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessiontoken_unique" UNIQUE ("sessionToken");

ALTER TABLE ONLY "next_auth"."verification_tokens"
    ADD CONSTRAINT "token_identifier_unique" UNIQUE ("token", "identifier");

ALTER TABLE ONLY "next_auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."verification_tokens"
    ADD CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("token");

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."prices"
    ADD CONSTRAINT "prices_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "supabase_migrations"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");

ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES next_auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES next_auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id);

ALTER TABLE ONLY "public"."prices"
    ADD CONSTRAINT "prices_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id);

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_price_id_fkey" FOREIGN KEY (price_id) REFERENCES public.prices(id);

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id);

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id);

CREATE POLICY "Allow public read-only access." ON "public"."prices" FOR SELECT USING (true);

CREATE POLICY "Allow public read-only access." ON "public"."products" FOR SELECT USING (true);

CREATE POLICY "Can only view own subs data." ON "public"."subscriptions" FOR SELECT USING ((auth.uid() = user_id));

CREATE POLICY "Can update own user data." ON "public"."users" FOR UPDATE USING ((auth.uid() = id));

CREATE POLICY "Can view own user data." ON "public"."users" FOR SELECT USING ((auth.uid() = id));

ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."prices" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "next_auth" TO "service_role";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON TABLE "next_auth"."accounts" TO "service_role";

GRANT ALL ON TABLE "next_auth"."sessions" TO "service_role";

GRANT ALL ON TABLE "next_auth"."users" TO "service_role";

GRANT ALL ON TABLE "next_auth"."verification_tokens" TO "service_role";

GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";

GRANT ALL ON TABLE "public"."prices" TO "anon";
GRANT ALL ON TABLE "public"."prices" TO "authenticated";
GRANT ALL ON TABLE "public"."prices" TO "service_role";

GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";

GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
