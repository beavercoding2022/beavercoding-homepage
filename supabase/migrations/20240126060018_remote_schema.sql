drop policy "Enable insert for authenticated users only" on "public"."posts";

create policy "Enable insert for admin users only"
on "public"."category_relations"
as permissive
for insert
to authenticated
with check ((auth.uid() = 'e979672e-8d67-447b-9abc-ef13bbfe588d'::uuid));


create policy "Enable read access for all users"
on "public"."category_relations"
as permissive
for select
to public
using (true);


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


create policy "Enable delete for users based on user_id"
on "public"."post_section_categories"
as permissive
for delete
to public
using ((auth.uid() = 'e979672e-8d67-447b-9abc-ef13bbfe588d'::uuid));


create policy "Enable insert for authenticated users only"
on "public"."post_section_categories"
as permissive
for insert
to authenticated
with check ((auth.uid() = 'e979672e-8d67-447b-9abc-ef13bbfe588d'::uuid));


create policy "Enable read access for all users"
on "public"."post_section_categories"
as permissive
for select
to public
using (true);


create policy "Enable insert for authenticated users only"
on "public"."post_section_references"
as permissive
for insert
to authenticated
with check ((auth.uid() = 'e979672e-8d67-447b-9abc-ef13bbfe588d'::uuid));


create policy "Enable read access for all users"
on "public"."post_section_references"
as permissive
for select
to public
using (true);


create policy "Enable insert for admin users only"
on "public"."posts"
as permissive
for insert
to authenticated
with check ((auth.uid() = 'e979672e-8d67-447b-9abc-ef13bbfe588d'::uuid));



