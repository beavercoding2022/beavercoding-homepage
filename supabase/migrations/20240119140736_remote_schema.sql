drop policy "Enable update for users based on user_id" on "public"."post_comments";

drop policy "Enable delete for users based on user_id" on "public"."post_sections";

drop policy "Enable insert for users based on post user id" on "public"."post_sections";

drop policy "Enable update for users based on post user id" on "public"."post_sections";

create table "public"."products" (
    "id" uuid not null,
    "active" boolean,
    "name" text,
    "description" text,
    "image" text,
    "metadata" jsonb
);


alter table "public"."products" enable row level security;

alter table "public"."prices" alter column "product_id" set not null;

alter table "public"."prices" alter column "product_id" set data type uuid using "product_id"::uuid;

CREATE UNIQUE INDEX products_id_key ON public.products USING btree (id);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."prices" add constraint "prices_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) not valid;

alter table "public"."prices" validate constraint "prices_product_id_fkey";

alter table "public"."products" add constraint "products_id_key" UNIQUE using index "products_id_key";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

create policy "Enable read access for all users"
on "public"."products"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on user_id"
on "public"."post_comments"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable delete for users based on user_id"
on "public"."post_sections"
as permissive
for delete
to public
using ((EXISTS ( SELECT
   FROM posts
  WHERE ((posts.id = post_sections.post_id) AND (posts.user_id = post_sections.user_id) AND (post_sections.user_id = auth.uid())))));


create policy "Enable insert for users based on post user id"
on "public"."post_sections"
as permissive
for insert
to public
with check ((EXISTS ( SELECT
   FROM posts
  WHERE ((posts.id = post_sections.post_id) AND (posts.user_id = post_sections.user_id) AND (post_sections.user_id = auth.uid())))));


create policy "Enable update for users based on post user id"
on "public"."post_sections"
as permissive
for update
to public
using ((EXISTS ( SELECT
   FROM posts
  WHERE ((posts.id = post_sections.post_id) AND (posts.user_id = post_sections.user_id) AND (post_sections.user_id = auth.uid())))))
with check ((EXISTS ( SELECT
   FROM posts
  WHERE ((posts.id = post_sections.post_id) AND (posts.user_id = post_sections.user_id) AND (post_sections.user_id = auth.uid())))));



