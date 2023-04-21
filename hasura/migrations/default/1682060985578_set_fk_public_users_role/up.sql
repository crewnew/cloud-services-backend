alter table "public"."users"
  add constraint "users_role_fkey"
  foreign key ("role")
  references "public"."roles_enum"
  ("role") on update cascade on delete restrict;
