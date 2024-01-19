create type "public"."posting_type" as enum ('blog', 'docs', 'portfolio');

create type "public"."user_connection_status" as enum ('online', 'offline');

drop policy "Allow public read-only access." on "public"."products";

revoke delete on table "public"."products" from "anon";

revoke insert on table "public"."products" from "anon";

revoke references on table "public"."products" from "anon";

revoke select on table "public"."products" from "anon";

revoke trigger on table "public"."products" from "anon";

revoke truncate on table "public"."products" from "anon";

revoke update on table "public"."products" from "anon";

revoke delete on table "public"."products" from "authenticated";

revoke insert on table "public"."products" from "authenticated";

revoke references on table "public"."products" from "authenticated";

revoke select on table "public"."products" from "authenticated";

revoke trigger on table "public"."products" from "authenticated";

revoke truncate on table "public"."products" from "authenticated";

revoke update on table "public"."products" from "authenticated";

revoke delete on table "public"."products" from "service_role";

revoke insert on table "public"."products" from "service_role";

revoke references on table "public"."products" from "service_role";

revoke select on table "public"."products" from "service_role";

revoke trigger on table "public"."products" from "service_role";

revoke truncate on table "public"."products" from "service_role";

revoke update on table "public"."products" from "service_role";

alter table "public"."prices" drop constraint "prices_product_id_fkey";

alter table "public"."products" drop constraint "products_pkey";

drop index if exists "public"."products_pkey";

drop table "public"."products";

create table "public"."post_categories" (
    "id" bigint generated always as identity not null,
    "name" text not null,
    "post_id" bigint not null
);


alter table "public"."post_categories" enable row level security;

create table "public"."post_comments" (
    "id" bigint generated always as identity not null,
    "section_order" integer not null default 0,
    "content" text not null,
    "post_id" bigint not null,
    "parent_comment_id" bigint,
    "user_id" uuid not null
);


alter table "public"."post_comments" enable row level security;

create table "public"."post_sections" (
    "id" bigint generated always as identity not null,
    "section_order" integer not null default 0,
    "content" text not null,
    "post_id" bigint not null,
    "user_id" uuid not null
);


alter table "public"."post_sections" enable row level security;

create table "public"."post_tags" (
    "id" bigint generated always as identity not null,
    "post_id" bigint not null,
    "tag" text not null
);


alter table "public"."post_tags" enable row level security;

create table "public"."posts" (
    "id" bigint generated always as identity not null,
    "title" text not null,
    "slug" text not null,
    "posting_type" posting_type,
    "public" boolean not null,
    "user_id" uuid not null,
    "team_id" bigint
);


alter table "public"."posts" enable row level security;

create table "public"."teams" (
    "id" bigint generated always as identity not null,
    "name" text not null
);


alter table "public"."teams" enable row level security;

create table "public"."user_teams" (
    "user_id" uuid not null,
    "team_id" bigint not null
);


alter table "public"."user_teams" enable row level security;

alter table "public"."customers" drop column "stripe_customer_id";

alter table "public"."customers" add column "payment_service_customer_id" text;

alter table "public"."users" add column "connection_status" user_connection_status not null default 'online'::user_connection_status;

CREATE UNIQUE INDEX post_categories_pkey ON public.post_categories USING btree (id);

CREATE UNIQUE INDEX post_comments_pkey ON public.post_comments USING btree (id);

CREATE UNIQUE INDEX post_sections_pkey ON public.post_sections USING btree (id);

CREATE UNIQUE INDEX post_tags_pkey ON public.post_tags USING btree (id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX teams_name_key ON public.teams USING btree (name);

CREATE UNIQUE INDEX teams_pkey ON public.teams USING btree (id);

CREATE UNIQUE INDEX user_teams_pkey ON public.user_teams USING btree (user_id, team_id);

alter table "public"."post_categories" add constraint "post_categories_pkey" PRIMARY KEY using index "post_categories_pkey";

alter table "public"."post_comments" add constraint "post_comments_pkey" PRIMARY KEY using index "post_comments_pkey";

alter table "public"."post_sections" add constraint "post_sections_pkey" PRIMARY KEY using index "post_sections_pkey";

alter table "public"."post_tags" add constraint "post_tags_pkey" PRIMARY KEY using index "post_tags_pkey";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."teams" add constraint "teams_pkey" PRIMARY KEY using index "teams_pkey";

alter table "public"."user_teams" add constraint "user_teams_pkey" PRIMARY KEY using index "user_teams_pkey";

alter table "public"."post_categories" add constraint "post_categories_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) not valid;

alter table "public"."post_categories" validate constraint "post_categories_post_id_fkey";

alter table "public"."post_comments" add constraint "post_comments_parent_comment_id_fkey" FOREIGN KEY (parent_comment_id) REFERENCES post_comments(id) not valid;

alter table "public"."post_comments" validate constraint "post_comments_parent_comment_id_fkey";

alter table "public"."post_comments" add constraint "post_comments_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) not valid;

alter table "public"."post_comments" validate constraint "post_comments_post_id_fkey";

alter table "public"."post_comments" add constraint "post_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."post_comments" validate constraint "post_comments_user_id_fkey";

alter table "public"."post_sections" add constraint "post_sections_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) not valid;

alter table "public"."post_sections" validate constraint "post_sections_post_id_fkey";

alter table "public"."post_sections" add constraint "post_sections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."post_sections" validate constraint "post_sections_user_id_fkey";

alter table "public"."post_tags" add constraint "post_tags_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) not valid;

alter table "public"."post_tags" validate constraint "post_tags_post_id_fkey";

alter table "public"."posts" add constraint "posts_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) not valid;

alter table "public"."posts" validate constraint "posts_team_id_fkey";

alter table "public"."posts" add constraint "posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."posts" validate constraint "posts_user_id_fkey";

alter table "public"."teams" add constraint "teams_name_key" UNIQUE using index "teams_name_key";

alter table "public"."user_teams" add constraint "user_teams_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) not valid;

alter table "public"."user_teams" validate constraint "user_teams_team_id_fkey";

alter table "public"."user_teams" add constraint "user_teams_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."user_teams" validate constraint "user_teams_user_id_fkey";

grant delete on table "public"."post_categories" to "anon";

grant insert on table "public"."post_categories" to "anon";

grant references on table "public"."post_categories" to "anon";

grant select on table "public"."post_categories" to "anon";

grant trigger on table "public"."post_categories" to "anon";

grant truncate on table "public"."post_categories" to "anon";

grant update on table "public"."post_categories" to "anon";

grant delete on table "public"."post_categories" to "authenticated";

grant insert on table "public"."post_categories" to "authenticated";

grant references on table "public"."post_categories" to "authenticated";

grant select on table "public"."post_categories" to "authenticated";

grant trigger on table "public"."post_categories" to "authenticated";

grant truncate on table "public"."post_categories" to "authenticated";

grant update on table "public"."post_categories" to "authenticated";

grant delete on table "public"."post_categories" to "service_role";

grant insert on table "public"."post_categories" to "service_role";

grant references on table "public"."post_categories" to "service_role";

grant select on table "public"."post_categories" to "service_role";

grant trigger on table "public"."post_categories" to "service_role";

grant truncate on table "public"."post_categories" to "service_role";

grant update on table "public"."post_categories" to "service_role";

grant delete on table "public"."post_comments" to "anon";

grant insert on table "public"."post_comments" to "anon";

grant references on table "public"."post_comments" to "anon";

grant select on table "public"."post_comments" to "anon";

grant trigger on table "public"."post_comments" to "anon";

grant truncate on table "public"."post_comments" to "anon";

grant update on table "public"."post_comments" to "anon";

grant delete on table "public"."post_comments" to "authenticated";

grant insert on table "public"."post_comments" to "authenticated";

grant references on table "public"."post_comments" to "authenticated";

grant select on table "public"."post_comments" to "authenticated";

grant trigger on table "public"."post_comments" to "authenticated";

grant truncate on table "public"."post_comments" to "authenticated";

grant update on table "public"."post_comments" to "authenticated";

grant delete on table "public"."post_comments" to "service_role";

grant insert on table "public"."post_comments" to "service_role";

grant references on table "public"."post_comments" to "service_role";

grant select on table "public"."post_comments" to "service_role";

grant trigger on table "public"."post_comments" to "service_role";

grant truncate on table "public"."post_comments" to "service_role";

grant update on table "public"."post_comments" to "service_role";

grant delete on table "public"."post_sections" to "anon";

grant insert on table "public"."post_sections" to "anon";

grant references on table "public"."post_sections" to "anon";

grant select on table "public"."post_sections" to "anon";

grant trigger on table "public"."post_sections" to "anon";

grant truncate on table "public"."post_sections" to "anon";

grant update on table "public"."post_sections" to "anon";

grant delete on table "public"."post_sections" to "authenticated";

grant insert on table "public"."post_sections" to "authenticated";

grant references on table "public"."post_sections" to "authenticated";

grant select on table "public"."post_sections" to "authenticated";

grant trigger on table "public"."post_sections" to "authenticated";

grant truncate on table "public"."post_sections" to "authenticated";

grant update on table "public"."post_sections" to "authenticated";

grant delete on table "public"."post_sections" to "service_role";

grant insert on table "public"."post_sections" to "service_role";

grant references on table "public"."post_sections" to "service_role";

grant select on table "public"."post_sections" to "service_role";

grant trigger on table "public"."post_sections" to "service_role";

grant truncate on table "public"."post_sections" to "service_role";

grant update on table "public"."post_sections" to "service_role";

grant delete on table "public"."post_tags" to "anon";

grant insert on table "public"."post_tags" to "anon";

grant references on table "public"."post_tags" to "anon";

grant select on table "public"."post_tags" to "anon";

grant trigger on table "public"."post_tags" to "anon";

grant truncate on table "public"."post_tags" to "anon";

grant update on table "public"."post_tags" to "anon";

grant delete on table "public"."post_tags" to "authenticated";

grant insert on table "public"."post_tags" to "authenticated";

grant references on table "public"."post_tags" to "authenticated";

grant select on table "public"."post_tags" to "authenticated";

grant trigger on table "public"."post_tags" to "authenticated";

grant truncate on table "public"."post_tags" to "authenticated";

grant update on table "public"."post_tags" to "authenticated";

grant delete on table "public"."post_tags" to "service_role";

grant insert on table "public"."post_tags" to "service_role";

grant references on table "public"."post_tags" to "service_role";

grant select on table "public"."post_tags" to "service_role";

grant trigger on table "public"."post_tags" to "service_role";

grant truncate on table "public"."post_tags" to "service_role";

grant update on table "public"."post_tags" to "service_role";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";

grant delete on table "public"."teams" to "anon";

grant insert on table "public"."teams" to "anon";

grant references on table "public"."teams" to "anon";

grant select on table "public"."teams" to "anon";

grant trigger on table "public"."teams" to "anon";

grant truncate on table "public"."teams" to "anon";

grant update on table "public"."teams" to "anon";

grant delete on table "public"."teams" to "authenticated";

grant insert on table "public"."teams" to "authenticated";

grant references on table "public"."teams" to "authenticated";

grant select on table "public"."teams" to "authenticated";

grant trigger on table "public"."teams" to "authenticated";

grant truncate on table "public"."teams" to "authenticated";

grant update on table "public"."teams" to "authenticated";

grant delete on table "public"."teams" to "service_role";

grant insert on table "public"."teams" to "service_role";

grant references on table "public"."teams" to "service_role";

grant select on table "public"."teams" to "service_role";

grant trigger on table "public"."teams" to "service_role";

grant truncate on table "public"."teams" to "service_role";

grant update on table "public"."teams" to "service_role";

grant delete on table "public"."user_teams" to "anon";

grant insert on table "public"."user_teams" to "anon";

grant references on table "public"."user_teams" to "anon";

grant select on table "public"."user_teams" to "anon";

grant trigger on table "public"."user_teams" to "anon";

grant truncate on table "public"."user_teams" to "anon";

grant update on table "public"."user_teams" to "anon";

grant delete on table "public"."user_teams" to "authenticated";

grant insert on table "public"."user_teams" to "authenticated";

grant references on table "public"."user_teams" to "authenticated";

grant select on table "public"."user_teams" to "authenticated";

grant trigger on table "public"."user_teams" to "authenticated";

grant truncate on table "public"."user_teams" to "authenticated";

grant update on table "public"."user_teams" to "authenticated";

grant delete on table "public"."user_teams" to "service_role";

grant insert on table "public"."user_teams" to "service_role";

grant references on table "public"."user_teams" to "service_role";

grant select on table "public"."user_teams" to "service_role";

grant trigger on table "public"."user_teams" to "service_role";

grant truncate on table "public"."user_teams" to "service_role";

grant update on table "public"."user_teams" to "service_role";

create policy "Enable select for users based on user_id"
on "public"."customers"
as permissive
for select
to authenticated
using ((auth.uid() = id));


create policy "Enable insert for authenticated users only"
on "public"."post_categories"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."post_categories"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."post_categories"
as permissive
for update
to authenticated
with check (true);


create policy "Enable delete for users based on user_id"
on "public"."post_comments"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."post_comments"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."post_comments"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on user_id"
on "public"."post_comments"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Enable delete for users based on user_id"
on "public"."post_sections"
as permissive
for delete
to public
using ((( SELECT posts.user_id
   FROM posts
  WHERE (posts.id = post_sections.post_id)) = user_id));


create policy "Enable insert for users based on post user id"
on "public"."post_sections"
as permissive
for insert
to public
with check ((( SELECT posts.user_id
   FROM posts
  WHERE (posts.id = post_sections.post_id)) = user_id));


create policy "Enable read access for all users"
on "public"."post_sections"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on post user id"
on "public"."post_sections"
as permissive
for update
to public
using ((( SELECT posts.user_id
   FROM posts
  WHERE (posts.id = post_sections.post_id)) = user_id))
with check ((( SELECT posts.user_id
   FROM posts
  WHERE (posts.id = post_sections.post_id)) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."post_tags"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."post_tags"
as permissive
for select
to public
using (true);


create policy "Enable delete for users based on user_id"
on "public"."posts"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."posts"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."posts"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on user_id"
on "public"."posts"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



