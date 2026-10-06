-- BlueVows Destination Management System
-- Run this in Supabase SQL Editor. It adds destination CMS tables without replacing existing tables.
create extension if not exists pgcrypto;

create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text default '',
  short_description text default '',
  long_description text default '',
  hero_image text default '',
  hero_video text default '',
  featured_image text default '',
  location text default '',
  best_time text default '',
  recommended_stay text default '',
  main_experiences text default '',
  starting_price numeric(12,2),
  how_to_reach text default '',
  how_to_reach_details text default '',
  map_location text default '',
  latitude numeric(10,7),
  longitude numeric(10,7),
  status text not null default 'published' check (status in ('published','draft','hidden')),
  display_order integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.destination_places (
  id uuid primary key default gen_random_uuid(), destination_id uuid not null references public.destinations(id) on delete cascade,
  name text not null, description text default '', image text default '', location text default '', entry_information text default '',
  status text not null default 'published' check (status in ('published','hidden')), display_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.destination_experiences (
  id uuid primary key default gen_random_uuid(), destination_id uuid not null references public.destinations(id) on delete cascade,
  name text not null, description text default '', icon text default 'Waves', image text default '', price text default '', duration text default '', cta text default '',
  status text not null default 'published' check (status in ('published','hidden')), display_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.destination_faqs (
  id uuid primary key default gen_random_uuid(), destination_id uuid not null references public.destinations(id) on delete cascade,
  question text not null, answer text default '', status text not null default 'published' check (status in ('published','hidden')), display_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.destination_gallery (
  id uuid primary key default gen_random_uuid(), destination_id uuid not null references public.destinations(id) on delete cascade,
  image text not null, caption text default '', status text not null default 'published' check (status in ('published','hidden')), display_order integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.destination_tips (
  id uuid primary key default gen_random_uuid(), destination_id uuid not null references public.destinations(id) on delete cascade,
  title text not null, description text default '', icon text default 'Info', status text not null default 'published' check (status in ('published','hidden')), display_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, duration text default '', description text default '',
  image text default '', starting_price numeric(12,2), actual_price numeric(12,2), tag text default 'Package', highlights text[] default '{}', status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.packages add column if not exists actual_price numeric(12,2);
alter table public.packages add column if not exists tag text default 'Package';

create table if not exists public.destination_packages (
  id uuid primary key default gen_random_uuid(), destination_id uuid not null references public.destinations(id) on delete cascade,
  package_id uuid not null references public.packages(id) on delete cascade, status text not null default 'published' check (status in ('published','hidden')), display_order integer not null default 0,
  unique(destination_id, package_id)
);

create index if not exists destinations_order_idx on public.destinations(display_order);
create index if not exists destination_places_dest_idx on public.destination_places(destination_id, display_order);
create index if not exists destination_experiences_dest_idx on public.destination_experiences(destination_id, display_order);
create index if not exists destination_faqs_dest_idx on public.destination_faqs(destination_id, display_order);
create index if not exists destination_gallery_dest_idx on public.destination_gallery(destination_id, display_order);
create index if not exists destination_tips_dest_idx on public.destination_tips(destination_id, display_order);
create index if not exists destination_packages_dest_idx on public.destination_packages(destination_id, display_order);

create or replace function public.set_destination_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists destinations_updated_at on public.destinations;
create trigger destinations_updated_at before update on public.destinations for each row execute function public.set_destination_updated_at();

-- Public visitors can read published content. Admin writes require a logged-in Supabase user.
alter table public.destinations enable row level security;
alter table public.destination_places enable row level security;
alter table public.destination_experiences enable row level security;
alter table public.destination_faqs enable row level security;
alter table public.destination_gallery enable row level security;
alter table public.destination_tips enable row level security;
alter table public.packages enable row level security;
alter table public.destination_packages enable row level security;

do $$ begin
  create policy destinations_public_read on public.destinations for select using (status='published');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy destinations_admin_all on public.destinations for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy places_public_read on public.destination_places for select using (status='published');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy places_admin_all on public.destination_places for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy experiences_public_read on public.destination_experiences for select using (status='published');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy experiences_admin_all on public.destination_experiences for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy faqs_public_read on public.destination_faqs for select using (status='published');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy faqs_admin_all on public.destination_faqs for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy gallery_public_read on public.destination_gallery for select using (status='published');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy gallery_admin_all on public.destination_gallery for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy tips_public_read on public.destination_tips for select using (status='published');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy tips_admin_all on public.destination_tips for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy packages_public_read on public.packages for select using (status='published');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy packages_admin_all on public.packages for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy destination_packages_public_read on public.destination_packages for select using (status='published');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy destination_packages_admin_all on public.destination_packages for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;

insert into public.destinations (slug,name,tagline,short_description,long_description,hero_image,featured_image,location,best_time,recommended_stay,main_experiences,starting_price,how_to_reach,how_to_reach_details,map_location,latitude,longitude,display_order,featured)
values
('havelock-island','Havelock Island','Beaches, reefs and slow island days.','White-sand beaches, clear water and unforgettable island experiences.','Havelock is the classic Andaman escape, combining beautiful beaches with diving, snorkelling and relaxed island stays.','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=100','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=100','Swaraj Dweep, Andaman','October to May','3–4 nights','Scuba Diving, Snorkelling, Kayaking, Beach sunsets',12000,'Port Blair to Havelock by ferry','Government/private ferries operate from Port Blair; allow check-in time at the jetty.','Havelock Island, Andaman',11.9760,92.9876,1,true),
('neil-island','Neil Island','Quiet beaches and a slower island escape.','Quiet beaches, coral reefs and a slower island escape.','Neil Island is ideal for travellers looking for peaceful beaches, natural bridges and a relaxed pace.','https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2400&q=100','https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2400&q=100','Shaheed Dweep, Andaman','October to May','2–3 nights','Natural Bridge, Snorkelling, Kayaking, Sunset',9000,'Ferry from Port Blair or Havelock','Plan ferry connections carefully when combining islands.','Neil Island, Andaman',11.8300,93.0000,2,false),
('port-blair','Port Blair','Your gateway to the islands.','Your gateway to the islands, history and coastal experiences.','Port Blair blends island history, harbour views and easy access to the rest of the archipelago.','https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2400&q=100','https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2400&q=100','South Andaman','October to May','1–2 nights','Cellular Jail, Ross Island, North Bay, Museums',7000,'Veer Savarkar International Airport','Daily flights connect Port Blair with major Indian cities; ferries depart from the harbour.','Port Blair, Andaman',11.6234,92.7265,3,false),
('baratang-island','Baratang Island','Mangroves, caves and wild island landscapes.','Mangroves, limestone caves and a memorable island day trip.','Baratang is known for mangrove creeks, limestone caves and a more adventurous island route.','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=100','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=100','Middle Andaman','November to March','1 night/day trip','Limestone Caves, Mangrove Boat Ride, Mud Volcano',6500,'Road trip from Port Blair','Start early; permits, ferry crossings and local timings can affect the route.','Baratang Island, Andaman',12.2200,92.7800,4,false),
('ross-island','Ross Island','History wrapped in tropical greenery.','Historic ruins, tropical greenery and a peaceful island atmosphere.','A short boat ride from Port Blair leads to atmospheric colonial ruins and deer-filled paths.','https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=2400&q=100','https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=2400&q=100','Near Port Blair','October to May','Half day','Historic Ruins, Light Walks, Photography',4500,'Boat from Port Blair','Combine Ross Island with North Bay for a full-day boat excursion.','Ross Island, Andaman',11.6739,92.7450,5,false),
('north-bay-island','North Bay Island','Clear water and classic water adventures.','Coral reefs, clear water and classic Andaman water adventures.','North Bay is a popular day-trip island for coral viewing, snorkelling and underwater activities.','https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=2400&q=100','https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=2400&q=100','Near Port Blair','October to May','Half day','Snorkelling, Glass-bottom Boat, Sea Walk',5000,'Boat from Port Blair','Sea conditions can affect boat schedules and activity availability.','North Bay Island, Andaman',11.7020,92.7250,6,false),
('long-island','Long Island','Offbeat island calm and local charm.','A quieter Andaman escape with forest, beaches and a local island feel.','Long Island suits travellers who want fewer crowds, forest paths and a slower community-focused experience.','https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2400&q=100','https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2400&q=100','Middle Andaman','November to April','2 nights','Lalaji Bay, Kayaking, Forest Walks',8500,'Ferry/boat connections from Middle Andaman','Connections are less frequent; confirm the latest local boat schedule before travel.','Long Island, Andaman',12.9000,92.9300,7,false)
on conflict (slug) do update set name=excluded.name, tagline=excluded.tagline, short_description=excluded.short_description, long_description=excluded.long_description, hero_image=excluded.hero_image, featured_image=excluded.featured_image, location=excluded.location, best_time=excluded.best_time, recommended_stay=excluded.recommended_stay, main_experiences=excluded.main_experiences, starting_price=excluded.starting_price, how_to_reach=excluded.how_to_reach, how_to_reach_details=excluded.how_to_reach_details, map_location=excluded.map_location, latitude=excluded.latitude, longitude=excluded.longitude, display_order=excluded.display_order, featured=excluded.featured;

insert into public.destination_experiences(destination_id,name,description,icon,price,duration,display_order)
select d.id, x.name, x.description, x.icon, x.price, x.duration, x.ord from public.destinations d cross join lateral (values
('Scuba Diving','Explore coral reefs with a trained instructor.','Waves','From ₹3,500','2–3 hours',1),('Snorkelling','See tropical marine life in clear shallow water.','Waves','From ₹1,500','1–2 hours',2),('Kayaking','Paddle calm tropical waters with a local guide.','Ship','From ₹1,800','1–2 hours',3),('Sunset Experience','Slow down for a memorable island sunset.','Sun','From ₹800','1 hour',4)
) x(name,description,icon,price,duration,ord) where d.slug='havelock-island' and not exists(select 1 from public.destination_experiences e where e.destination_id=d.id);

insert into public.destination_tips(destination_id,title,description,icon,display_order)
select d.id, x.title, x.description, x.icon, x.ord from public.destinations d cross join lateral (values
('Best season','October to May is the usual preferred travel window.','CalendarDays',1),('What to carry','Carry sunscreen, light clothing, swimwear and a reusable water bottle.','Backpack',2),('Ferry tips','Keep a buffer for jetty check-in and weather-related schedule changes.','Ship',3),('Local transport','Pre-book transfers on busy dates, especially for early ferries.','MapPin',4)
) x(title,description,icon,ord) where d.slug='havelock-island' and not exists(select 1 from public.destination_tips t where t.destination_id=d.id);

insert into public.destination_faqs(destination_id,question,answer,display_order)
select d.id, x.question, x.answer, x.ord from public.destinations d cross join lateral (values
('How many days should I stay?','Three to four nights gives enough time for beaches and activities without rushing.',1),('Can I combine Havelock with Neil Island?','Yes. Many itineraries combine the two islands with Port Blair depending on ferry timings.',2),('Is advance booking recommended?','Yes, especially during peak months and around long weekends.',3)
) x(question,answer,ord) where d.slug='havelock-island' and not exists(select 1 from public.destination_faqs f where f.destination_id=d.id);

insert into public.packages(slug,name,duration,description,image,starting_price,highlights,display_order)
values
('andaman-escape','Andaman Escape','5 Nights / 6 Days','A balanced first-time island itinerary.','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=100',35000,array['Port Blair','Havelock','Neil Island'],1),
('island-discovery','Island Discovery','4 Nights / 5 Days','A compact island-hopping holiday.','https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2400&q=100',29500,array['North Bay','Havelock','Water activities'],2),
('honeymoon-islands','Honeymoon Islands','6 Nights / 7 Days','A relaxed romantic Andaman journey.','https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2400&q=100',46000,array['Havelock','Neil Island','Couple experiences'],3)
on conflict (slug) do update set name=excluded.name,duration=excluded.duration,description=excluded.description,image=excluded.image,starting_price=excluded.starting_price,highlights=excluded.highlights;
update public.packages set actual_price=41000, tag='Popular' where slug='andaman-escape';
update public.packages set actual_price=35000, tag='Best Seller' where slug='island-discovery';
update public.packages set actual_price=54000, tag='Couples' where slug='honeymoon-islands';

insert into public.destination_packages(destination_id,package_id,display_order)
select d.id,p.id,1 from public.destinations d join public.packages p on p.slug='andaman-escape' where d.slug in ('havelock-island','port-blair','neil-island')
on conflict(destination_id,package_id) do nothing;
insert into public.destination_packages(destination_id,package_id,display_order)
select d.id,p.id,2 from public.destinations d join public.packages p on p.slug='island-discovery' where d.slug in ('havelock-island','port-blair','ross-island','north-bay-island')
on conflict(destination_id,package_id) do nothing;
insert into public.destination_packages(destination_id,package_id,display_order)
select d.id,p.id,3 from public.destinations d join public.packages p on p.slug='honeymoon-islands' where d.slug in ('havelock-island','neil-island','port-blair')
on conflict(destination_id,package_id) do nothing;

-- Storage bucket for destination media. Admin uploads are governed by storage policies below.
insert into storage.buckets (id,name,public) values ('destination-media','destination-media',true) on conflict (id) do nothing;
do $$ begin
  create policy destination_media_public_read on storage.objects for select using (bucket_id='destination-media');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy destination_media_auth_write on storage.objects for insert to authenticated with check (bucket_id='destination-media');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy destination_media_auth_update on storage.objects for update to authenticated using (bucket_id='destination-media') with check (bucket_id='destination-media');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy destination_media_auth_delete on storage.objects for delete to authenticated using (bucket_id='destination-media');
exception when duplicate_object then null; end $$;
