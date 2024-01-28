revoke delete on table "public"."post_secion_tags" from "anon";

revoke insert on table "public"."post_secion_tags" from "anon";

revoke references on table "public"."post_secion_tags" from "anon";

revoke select on table "public"."post_secion_tags" from "anon";

revoke trigger on table "public"."post_secion_tags" from "anon";

revoke truncate on table "public"."post_secion_tags" from "anon";

revoke update on table "public"."post_secion_tags" from "anon";

revoke delete on table "public"."post_secion_tags" from "authenticated";

revoke insert on table "public"."post_secion_tags" from "authenticated";

revoke references on table "public"."post_secion_tags" from "authenticated";

revoke select on table "public"."post_secion_tags" from "authenticated";

revoke trigger on table "public"."post_secion_tags" from "authenticated";

revoke truncate on table "public"."post_secion_tags" from "authenticated";

revoke update on table "public"."post_secion_tags" from "authenticated";

revoke delete on table "public"."post_secion_tags" from "service_role";

revoke insert on table "public"."post_secion_tags" from "service_role";

revoke references on table "public"."post_secion_tags" from "service_role";

revoke select on table "public"."post_secion_tags" from "service_role";

revoke trigger on table "public"."post_secion_tags" from "service_role";

revoke truncate on table "public"."post_secion_tags" from "service_role";

revoke update on table "public"."post_secion_tags" from "service_role";

alter table "public"."post_secion_tags" drop constraint "post_secion_tags_post_section_id_fkey";

alter table "public"."post_secion_tags" drop constraint "post_secion_tags_tag_id_fkey";

alter table "public"."category_relations" drop constraint "category_relations_child_category_id_fkey";

alter table "public"."category_relations" drop constraint "category_relations_parent_category_id_fkey";

alter table "public"."post_comments" drop constraint "post_comments_parent_comment_id_fkey";

alter table "public"."post_comments" drop constraint "post_comments_post_id_fkey";

alter table "public"."post_section_categories" drop constraint "post_section_categories_category_id_fkey";

alter table "public"."post_section_categories" drop constraint "post_section_categories_post_section_id_fkey";

alter table "public"."post_sections" drop constraint "post_sections_post_id_fkey";

alter table "public"."user_teams" drop constraint "user_teams_user_id_fkey";

alter table "public"."post_secion_tags" drop constraint "post_secion_tags_pkey";

drop index if exists "public"."post_secion_tags_pkey";

drop table "public"."post_secion_tags";

create table "public"."post_section_tags" (
    "post_section_id" bigint not null,
    "tag_id" bigint not null
);


alter table "public"."post_section_tags" enable row level security;

alter table "public"."post_comments" add column "is_deleted" boolean default false;

alter table "public"."post_comments" alter column "post_id" drop not null;

CREATE UNIQUE INDEX post_section_tags_pkey ON public.post_section_tags USING btree (post_section_id, tag_id);

alter table "public"."post_section_tags" add constraint "post_section_tags_pkey" PRIMARY KEY using index "post_section_tags_pkey";

alter table "public"."post_section_references" add constraint "post_section_references_destination_post_section_id_fkey" FOREIGN KEY (destination_post_section_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."post_section_references" validate constraint "post_section_references_destination_post_section_id_fkey";

alter table "public"."post_section_references" add constraint "post_section_references_source_post_section_id_fkey" FOREIGN KEY (source_post_section_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."post_section_references" validate constraint "post_section_references_source_post_section_id_fkey";

alter table "public"."post_section_tags" add constraint "post_section_tags_post_section_id_fkey" FOREIGN KEY (post_section_id) REFERENCES post_sections(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."post_section_tags" validate constraint "post_section_tags_post_section_id_fkey";

alter table "public"."post_section_tags" add constraint "post_section_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."post_section_tags" validate constraint "post_section_tags_tag_id_fkey";

alter table "public"."category_relations" add constraint "category_relations_child_category_id_fkey" FOREIGN KEY (child_category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."category_relations" validate constraint "category_relations_child_category_id_fkey";

alter table "public"."category_relations" add constraint "category_relations_parent_category_id_fkey" FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."category_relations" validate constraint "category_relations_parent_category_id_fkey";

alter table "public"."post_comments" add constraint "post_comments_parent_comment_id_fkey" FOREIGN KEY (parent_comment_id) REFERENCES post_comments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."post_comments" validate constraint "post_comments_parent_comment_id_fkey";

alter table "public"."post_comments" add constraint "post_comments_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL not valid;

alter table "public"."post_comments" validate constraint "post_comments_post_id_fkey";

alter table "public"."post_section_categories" add constraint "post_section_categories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."post_section_categories" validate constraint "post_section_categories_category_id_fkey";

alter table "public"."post_section_categories" add constraint "post_section_categories_post_section_id_fkey" FOREIGN KEY (post_section_id) REFERENCES post_sections(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."post_section_categories" validate constraint "post_section_categories_post_section_id_fkey";

alter table "public"."post_sections" add constraint "post_sections_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."post_sections" validate constraint "post_sections_post_id_fkey";

alter table "public"."user_teams" add constraint "user_teams_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_teams" validate constraint "user_teams_user_id_fkey";

grant delete on table "public"."post_section_tags" to "anon";

grant insert on table "public"."post_section_tags" to "anon";

grant references on table "public"."post_section_tags" to "anon";

grant select on table "public"."post_section_tags" to "anon";

grant trigger on table "public"."post_section_tags" to "anon";

grant truncate on table "public"."post_section_tags" to "anon";

grant update on table "public"."post_section_tags" to "anon";

grant delete on table "public"."post_section_tags" to "authenticated";

grant insert on table "public"."post_section_tags" to "authenticated";

grant references on table "public"."post_section_tags" to "authenticated";

grant select on table "public"."post_section_tags" to "authenticated";

grant trigger on table "public"."post_section_tags" to "authenticated";

grant truncate on table "public"."post_section_tags" to "authenticated";

grant update on table "public"."post_section_tags" to "authenticated";

grant delete on table "public"."post_section_tags" to "service_role";

grant insert on table "public"."post_section_tags" to "service_role";

grant references on table "public"."post_section_tags" to "service_role";

grant select on table "public"."post_section_tags" to "service_role";

grant trigger on table "public"."post_section_tags" to "service_role";

grant truncate on table "public"."post_section_tags" to "service_role";

grant update on table "public"."post_section_tags" to "service_role";


