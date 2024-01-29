create table "public"."post_linked_list" (
    "prev_post_id" bigint not null,
    "next_post_id" bigint not null
);


alter table "public"."post_linked_list" enable row level security;

alter table "public"."categories" add column "thumbnail_url" text;

alter table "public"."posts" add column "viewcount" bigint not null default '0'::bigint;

CREATE UNIQUE INDEX post_linked_list_pkey ON public.post_linked_list USING btree (prev_post_id, next_post_id);

alter table "public"."post_linked_list" add constraint "post_linked_list_pkey" PRIMARY KEY using index "post_linked_list_pkey";

alter table "public"."post_linked_list" add constraint "post_linked_list_next_post_id_fkey" FOREIGN KEY (next_post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."post_linked_list" validate constraint "post_linked_list_next_post_id_fkey";

alter table "public"."post_linked_list" add constraint "post_linked_list_prev_post_id_fkey" FOREIGN KEY (prev_post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."post_linked_list" validate constraint "post_linked_list_prev_post_id_fkey";

grant delete on table "public"."post_linked_list" to "anon";

grant insert on table "public"."post_linked_list" to "anon";

grant references on table "public"."post_linked_list" to "anon";

grant select on table "public"."post_linked_list" to "anon";

grant trigger on table "public"."post_linked_list" to "anon";

grant truncate on table "public"."post_linked_list" to "anon";

grant update on table "public"."post_linked_list" to "anon";

grant delete on table "public"."post_linked_list" to "authenticated";

grant insert on table "public"."post_linked_list" to "authenticated";

grant references on table "public"."post_linked_list" to "authenticated";

grant select on table "public"."post_linked_list" to "authenticated";

grant trigger on table "public"."post_linked_list" to "authenticated";

grant truncate on table "public"."post_linked_list" to "authenticated";

grant update on table "public"."post_linked_list" to "authenticated";

grant delete on table "public"."post_linked_list" to "service_role";

grant insert on table "public"."post_linked_list" to "service_role";

grant references on table "public"."post_linked_list" to "service_role";

grant select on table "public"."post_linked_list" to "service_role";

grant trigger on table "public"."post_linked_list" to "service_role";

grant truncate on table "public"."post_linked_list" to "service_role";

grant update on table "public"."post_linked_list" to "service_role";


