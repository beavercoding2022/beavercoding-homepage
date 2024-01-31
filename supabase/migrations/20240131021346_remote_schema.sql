alter table "public"."posts" alter column "image_paths" set default '{}'::text[];

alter table "public"."posts" alter column "image_paths" set not null;


