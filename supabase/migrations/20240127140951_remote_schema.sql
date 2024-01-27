alter table "public"."category_relations" drop constraint "category_relations_child_category_id_fkey";

alter table "public"."category_relations" add constraint "category_relations_child_category_id_fkey" FOREIGN KEY (child_category_id) REFERENCES categories(id) not valid;

alter table "public"."category_relations" validate constraint "category_relations_child_category_id_fkey";


