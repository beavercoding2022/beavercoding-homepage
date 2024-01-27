revoke delete on table "public"."postsecion_tags" from "anon";

revoke insert on table "public"."postsecion_tags" from "anon";

revoke references on table "public"."postsecion_tags" from "anon";

revoke select on table "public"."postsecion_tags" from "anon";

revoke trigger on table "public"."postsecion_tags" from "anon";

revoke truncate on table "public"."postsecion_tags" from "anon";

revoke update on table "public"."postsecion_tags" from "anon";

revoke delete on table "public"."postsecion_tags" from "authenticated";

revoke insert on table "public"."postsecion_tags" from "authenticated";

revoke references on table "public"."postsecion_tags" from "authenticated";

revoke select on table "public"."postsecion_tags" from "authenticated";

revoke trigger on table "public"."postsecion_tags" from "authenticated";

revoke truncate on table "public"."postsecion_tags" from "authenticated";

revoke update on table "public"."postsecion_tags" from "authenticated";

revoke delete on table "public"."postsecion_tags" from "service_role";

revoke insert on table "public"."postsecion_tags" from "service_role";

revoke references on table "public"."postsecion_tags" from "service_role";

revoke select on table "public"."postsecion_tags" from "service_role";

revoke trigger on table "public"."postsecion_tags" from "service_role";

revoke truncate on table "public"."postsecion_tags" from "service_role";

revoke update on table "public"."postsecion_tags" from "service_role";

alter table "public"."postsecion_tags" drop constraint "postsecion_tags_post_section_id_fkey";

alter table "public"."postsecion_tags" drop constraint "postsecion_tags_tag_id_fkey";

alter table "public"."category_relations" drop constraint "category_relations_child_category_id_fkey";

alter table "public"."category_relations" drop constraint "category-relations_pkey";

alter table "public"."postsecion_tags" drop constraint "postsecion_tags_pkey";

alter table "public"."post_categories" drop constraint "post_categories_pkey1";

alter table "public"."post_section_categories" drop constraint "post_section_categories_pkey";

alter table "public"."post_section_references" drop constraint "post_section_references_pkey";

drop index if exists "public"."category-relations_pkey";

drop index if exists "public"."postsecion_tags_pkey";

drop index if exists "public"."post_categories_pkey1";

drop index if exists "public"."post_section_categories_pkey";

drop index if exists "public"."post_section_references_pkey";

drop table "public"."postsecion_tags";

create table "public"."post_secion_tags" (
    "post_section_id" bigint not null,
    "tag_id" bigint not null
);


alter table "public"."post_secion_tags" enable row level security;

alter table "public"."category_relations" drop column "created_at";

alter table "public"."category_relations" drop column "id";

alter table "public"."category_relations" alter column "child_category_id" set not null;

alter table "public"."category_relations" alter column "parent_category_id" set not null;

alter table "public"."post_categories" drop column "created_at";

alter table "public"."post_categories" drop column "id";

alter table "public"."post_categories" alter column "category_id" set not null;

alter table "public"."post_categories" alter column "post_id" set not null;

alter table "public"."post_section_categories" drop column "created_at";

alter table "public"."post_section_categories" drop column "id";

alter table "public"."post_section_categories" alter column "category_id" set not null;

alter table "public"."post_section_categories" alter column "post_section_id" set not null;

alter table "public"."post_section_references" drop column "created_at";

alter table "public"."post_section_references" drop column "id";

alter table "public"."post_section_references" alter column "destination_post_section_id" set not null;

alter table "public"."post_section_references" alter column "source_post_section_id" set not null;

CREATE UNIQUE INDEX category_relations_pkey ON public.category_relations USING btree (parent_category_id, child_category_id);

CREATE UNIQUE INDEX post_secion_tags_pkey ON public.post_secion_tags USING btree (post_section_id, tag_id);

CREATE UNIQUE INDEX post_categories_pkey1 ON public.post_categories USING btree (category_id, post_id);

CREATE UNIQUE INDEX post_section_categories_pkey ON public.post_section_categories USING btree (category_id, post_section_id);

CREATE UNIQUE INDEX post_section_references_pkey ON public.post_section_references USING btree (source_post_section_id, destination_post_section_id);

alter table "public"."category_relations" add constraint "category_relations_pkey" PRIMARY KEY using index "category_relations_pkey";

alter table "public"."post_secion_tags" add constraint "post_secion_tags_pkey" PRIMARY KEY using index "post_secion_tags_pkey";

alter table "public"."post_categories" add constraint "post_categories_pkey1" PRIMARY KEY using index "post_categories_pkey1";

alter table "public"."post_section_categories" add constraint "post_section_categories_pkey" PRIMARY KEY using index "post_section_categories_pkey";

alter table "public"."post_section_references" add constraint "post_section_references_pkey" PRIMARY KEY using index "post_section_references_pkey";

alter table "public"."post_secion_tags" add constraint "post_secion_tags_post_section_id_fkey" FOREIGN KEY (post_section_id) REFERENCES post_sections(id) not valid;

alter table "public"."post_secion_tags" validate constraint "post_secion_tags_post_section_id_fkey";

alter table "public"."post_secion_tags" add constraint "post_secion_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) not valid;

alter table "public"."post_secion_tags" validate constraint "post_secion_tags_tag_id_fkey";

alter table "public"."category_relations" add constraint "category_relations_child_category_id_fkey" FOREIGN KEY (child_category_id) REFERENCES posts(id) not valid;

alter table "public"."category_relations" validate constraint "category_relations_child_category_id_fkey";

grant delete on table "public"."post_secion_tags" to "anon";

grant insert on table "public"."post_secion_tags" to "anon";

grant references on table "public"."post_secion_tags" to "anon";

grant select on table "public"."post_secion_tags" to "anon";

grant trigger on table "public"."post_secion_tags" to "anon";

grant truncate on table "public"."post_secion_tags" to "anon";

grant update on table "public"."post_secion_tags" to "anon";

grant delete on table "public"."post_secion_tags" to "authenticated";

grant insert on table "public"."post_secion_tags" to "authenticated";

grant references on table "public"."post_secion_tags" to "authenticated";

grant select on table "public"."post_secion_tags" to "authenticated";

grant trigger on table "public"."post_secion_tags" to "authenticated";

grant truncate on table "public"."post_secion_tags" to "authenticated";

grant update on table "public"."post_secion_tags" to "authenticated";

grant delete on table "public"."post_secion_tags" to "service_role";

grant insert on table "public"."post_secion_tags" to "service_role";

grant references on table "public"."post_secion_tags" to "service_role";

grant select on table "public"."post_secion_tags" to "service_role";

grant trigger on table "public"."post_secion_tags" to "service_role";

grant truncate on table "public"."post_secion_tags" to "service_role";

grant update on table "public"."post_secion_tags" to "service_role";


