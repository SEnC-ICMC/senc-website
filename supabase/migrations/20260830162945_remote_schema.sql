set local check_function_bodies = off;

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "anon";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "authenticated";

alter default privileges for role "postgres" in schema "public" revoke all on sequences from "service_role";

create table "public"."attendance" (
  "id"             uuid                     not null default gen_random_uuid(),
  "participant_id" uuid                     not null,
  "event_id"       bigint                   not null,
  "checked_in_at"  timestamp with time zone default now(),
  constraint "attendance_event_participant_unique" unique (event_id, participant_id),
  constraint "attendance_participant_id_event_id_key" unique (participant_id, event_id),
  constraint "attendance_pkey" primary key (id)
);

alter table "public"."attendance"
  enable row level security;

create table "public"."events" (
  "id"           bigint                   generated always as identity not null,
  "title"        text                     not null,
  "speaker"      text,
  "event_type"   text                     not null,
  "location"     text                     not null,
  "event_day"    text                     not null,
  "time_display" text                     not null,
  "color_theme"  text                     not null,
  "starts_at"    timestamp with time zone,
  "ends_at"      timestamp with time zone,
  constraint "events_pkey" primary key (id)
);

alter table "public"."events"
  enable row level security;

create table "public"."participants" (
  "created_at" timestamp with time zone not null default now(),
  "name"       text                     not null,
  "email"      text                     not null,
  "is_admin"   boolean                  not null default false,
  "id"         uuid                     not null default auth.uid(),
  constraint "participants_pkey" primary key (id)
);

alter table "public"."participants"
  enable row level security;

create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  AS $function$
begin
  insert into public.participants (id, email, name)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name' -- Grabs the name from Google
  );
  return new;
end;
$function$;

create or replace function public.is_admin()
  returns boolean
  language sql
  stable
  security definer
  AS $function$
  select exists (
    select 1 from public.participants
    where participants.id = auth.uid() and is_admin = true
  )
$function$;

alter table "public"."attendance"
  add constraint "attendance_event_id_fkey" foreign key (event_id) references public.events(id) on delete cascade;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create policy "Admins can delete attendance" on "public"."attendance"
  for delete
  to PUBLIC
  using (public.is_admin());

create policy "Admins can insert attendance" on "public"."attendance"
  for insert
  to PUBLIC
  with check (public.is_admin());

create policy "Admins can view all attendance" on "public"."attendance"
  for select
  to PUBLIC
  using (public.is_admin());

create policy "Participantes veem propria presenca" on "public"."attendance"
  for select
  to PUBLIC
  using ((auth.uid() = participant_id));

create policy "Eventos públicos para leitura" on "public"."events"
  for select
  to PUBLIC
  using (true);

create policy "Admins can view all participants" on "public"."participants"
  for select
  to PUBLIC
  using (public.is_admin());

comment on table "public"."participants" is 'Armazena dados dos participantes inscritos na SEnC';

grant execute on function "public"."handle_new_user"() to public, "postgres";

grant execute on function "public"."is_admin"() to public, "postgres";

grant maintain, references, trigger, truncate on table "public"."attendance" to "anon";

grant maintain, references, select, trigger, truncate on table "public"."attendance" to "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."attendance" to "postgres";

grant maintain, references, trigger, truncate on table "public"."attendance" to "service_role";

grant maintain, references, select, trigger, truncate on table "public"."events" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."events" to "postgres";

grant maintain, references, trigger, truncate on table "public"."events" to "service_role";

grant maintain, references, trigger, truncate on table "public"."participants" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."participants" to "postgres";

grant maintain, references, trigger, truncate on table "public"."participants" to "service_role";

alter table "public"."participants"
  add constraint "participants_id_fkey" foreign key (id) references auth.users(id);

alter table "public"."attendance"
  add constraint "attendance_participant_id_fkey" foreign key (participant_id) references public.participants(id) on delete cascade;

create view "public"."relatorio_aprovados" AS  WITH total_eventos AS (
         SELECT (count(*))::numeric AS total
           FROM public.events
        )
 SELECT p.name AS "Nome",
    p.email AS "Email USP",
    count(a.event_id) AS "Total de Presenças",
    (round((((count(a.event_id))::numeric / max(t.total)) * (100)::numeric)))::integer AS "Frequência (%)"
   FROM ((public.participants p
     LEFT JOIN public.attendance a ON ((p.id = a.participant_id)))
     CROSS JOIN total_eventos t)
  GROUP BY p.id, p.name, p.email
 HAVING (round((((count(a.event_id))::numeric / max(t.total)) * (100)::numeric)) >= (70)::numeric);

create policy "user can read own row" on "public"."participants"
  for select
  to PUBLIC
  using ((auth.uid() = id));

grant maintain, references, trigger, truncate on table "public"."relatorio_aprovados" to "anon", "authenticated";

grant delete, insert, maintain, references, select, trigger, truncate, update on table "public"."relatorio_aprovados" to "postgres";

grant maintain, references, trigger, truncate on table "public"."relatorio_aprovados" to "service_role";

