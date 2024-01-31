create extension if not exists "postgis" with schema "extensions";

create extension if not exists "vector" with schema "extensions";


alter table "public"."post_sections" add column "image_paths" text[] not null default '{}'::text[];

alter table "public"."posts" add column "image_paths" text[];


