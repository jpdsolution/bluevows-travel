-- BlueVows Future Admin-Ready Architecture
-- Additive migration only. Does not create an Admin Panel and does not drop/replace existing data.
-- Run AFTER destination_system.sql.

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Shared helpers
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

-- -----------------------------------------------------------------------------
-- Global website settings: one row is the future source of truth for branding,
-- contact details, social links and default SEO.
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key text not null unique default 'default',
  website_name text not null default 'BlueVows',
  logo_url text default '',
  favicon_url text default '',
  contact_email text default '',
  phone text default '',
  whatsapp text default '',
  address text default '',
  social_links jsonb not null default '{}'::jsonb,
  default_seo_title text default '',
  default_seo_description text default '',
  analytics_settings jsonb not null default '{}'::jsonb,
  status text not null default 'published' check (status in ('published','draft','hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Repeatable homepage/site content.
-- -----------------------------------------------------------------------------
create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  badge text default '', heading text default '', accent text default '',
  subheading text default '', description text default '',
  image_url text default '', video_url text default '',
  primary_cta_label text default '', primary_cta_link text default '',
  secondary_cta_label text default '', secondary_cta_link text default '',
  overlay jsonb not null default '{}'::jsonb,
  status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon text default 'Waves',
  image_url text default '',
  description text default '',
  details text default '',
  price text default '',
  duration text default '',
  destination_id uuid references public.destinations(id) on delete set null,
  cta_label text default 'View details',
  cta_link text default '',
  status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon text default 'CheckCircle2',
  image_url text default '',
  description text default '',
  price text default '',
  cta_label text default '',
  cta_link text default '',
  status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  title text default '',
  review text not null,
  rating numeric(2,1) not null default 5,
  photo_url text default '',
  review_date date,
  status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text default '',
  category text default '',
  featured boolean not null default false,
  status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content text default '',
  excerpt text default '',
  image_url text default '',
  category text default '',
  author text default '',
  published_at timestamptz,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('published','unpublished','draft','hidden')),
  display_order integer not null default 0,
  seo_title text default '',
  seo_description text default '',
  og_image_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.special_offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text default '',
  description text default '',
  discount_text text default '',
  price numeric(12,2),
  valid_from date,
  valid_until date,
  cta_label text default '',
  cta_link text default '',
  status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text default '',
  website_url text default '',
  status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

-- -----------------------------------------------------------------------------
-- Navigation and footer are data, not component constants.
-- -----------------------------------------------------------------------------
create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.navigation_items(id) on delete set null,
  title text not null,
  link text default '',
  icon text default '',
  target text default '_self',
  status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.footer_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.footer_links (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references public.footer_sections(id) on delete cascade,
  label text not null,
  link text default '',
  icon text default '',
  status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

-- Generic keyed content for section copy/labels that may grow over time without
-- forcing a frontend rebuild. Examples: home.trust, home.why, home.cta, video, etc.
create table if not exists public.site_content_blocks (
  id uuid primary key default gen_random_uuid(),
  content_key text unique not null,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

-- -----------------------------------------------------------------------------
-- Extend existing destination/package tables rather than replacing them.
-- -----------------------------------------------------------------------------
alter table public.destinations add column if not exists seo_title text default '';
alter table public.destinations add column if not exists seo_description text default '';
alter table public.destinations add column if not exists seo_keywords text default '';
alter table public.destinations add column if not exists og_image_url text default '';
alter table public.destinations add column if not exists archived_at timestamptz;

alter table public.packages add column if not exists inclusions text[] default '{}';
alter table public.packages add column if not exists exclusions text[] default '{}';
alter table public.packages add column if not exists cta_label text default 'View Package';
alter table public.packages add column if not exists cta_link text default '';
alter table public.packages add column if not exists seo_title text default '';
alter table public.packages add column if not exists seo_description text default '';
alter table public.packages add column if not exists seo_keywords text default '';
alter table public.packages add column if not exists og_image_url text default '';
alter table public.packages add column if not exists archived_at timestamptz;

create table if not exists public.package_itineraries (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.packages(id) on delete cascade,
  day_label text not null,
  title text not null,
  description text default '',
  display_order integer not null default 0,
  status text not null default 'published' check (status in ('published','hidden','draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

-- Future hotel CMS source; the existing public page can continue unchanged until
-- hotel content is actually moved into this table.
create table if not exists public.hotels (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  destination_id uuid references public.destinations(id) on delete set null,
  image_url text default '',
  description text default '',
  room_info text default '',
  starting_price numeric(12,2),
  rating numeric(2,1),
  amenities jsonb not null default '[]'::jsonb,
  cta_label text default 'View Hotel',
  cta_link text default '',
  status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

-- -----------------------------------------------------------------------------
-- Soft-delete/order/status indexes.
-- -----------------------------------------------------------------------------
create index if not exists hero_slides_order_idx on public.hero_slides(display_order);
create index if not exists activities_order_idx on public.activities(display_order);
create index if not exists services_order_idx on public.services(display_order);
create index if not exists testimonials_order_idx on public.testimonials(display_order);
create index if not exists gallery_items_order_idx on public.gallery_items(display_order);
create index if not exists blog_posts_order_idx on public.blog_posts(display_order);
create index if not exists special_offers_order_idx on public.special_offers(display_order);
create index if not exists partners_order_idx on public.partners(display_order);
create index if not exists navigation_items_order_idx on public.navigation_items(display_order);
create index if not exists footer_sections_order_idx on public.footer_sections(display_order);
create index if not exists footer_links_order_idx on public.footer_links(display_order);
create index if not exists site_content_blocks_order_idx on public.site_content_blocks(display_order);
create index if not exists package_itineraries_order_idx on public.package_itineraries(package_id,display_order);
create index if not exists hotels_order_idx on public.hotels(display_order);

-- Add archived_at to existing nested destination tables for recoverable deletes.
alter table public.destination_places add column if not exists archived_at timestamptz;
alter table public.destination_experiences add column if not exists archived_at timestamptz;
alter table public.destination_faqs add column if not exists archived_at timestamptz;
alter table public.destination_gallery add column if not exists archived_at timestamptz;
alter table public.destination_tips add column if not exists archived_at timestamptz;
alter table public.destination_packages add column if not exists archived_at timestamptz;

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------
do $$ declare t text; begin
  foreach t in array array['site_settings','hero_slides','activities','services','testimonials','gallery_items','blog_posts','special_offers','partners','navigation_items','footer_sections','footer_links','site_content_blocks','package_itineraries','hotels'] loop
    execute format('drop trigger if exists %I_updated_at on public.%I', t, t);
    execute format('create trigger %I_updated_at before update on public.%I for each row execute function public.touch_updated_at()', t, t);
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- Public read / authenticated write policies.
-- No admin UI is created here; authenticated users are the future CMS writers.
-- -----------------------------------------------------------------------------
do $$ declare t text; begin
  foreach t in array array['site_settings','hero_slides','activities','services','testimonials','gallery_items','blog_posts','special_offers','partners','navigation_items','footer_sections','footer_links','site_content_blocks','package_itineraries','hotels'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Public policies use only published/non-archived rows.
do $$ begin
  create policy site_settings_public_read on public.site_settings for select using (status='published');
  create policy site_settings_admin_all on public.site_settings for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy hero_slides_public_read on public.hero_slides for select using (status='published' and archived_at is null);
  create policy hero_slides_admin_all on public.hero_slides for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy activities_public_read on public.activities for select using (status='published' and archived_at is null);
  create policy activities_admin_all on public.activities for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy services_public_read on public.services for select using (status='published' and archived_at is null);
  create policy services_admin_all on public.services for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy testimonials_public_read on public.testimonials for select using (status='published' and archived_at is null);
  create policy testimonials_admin_all on public.testimonials for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy gallery_items_public_read on public.gallery_items for select using (status='published' and archived_at is null);
  create policy gallery_items_admin_all on public.gallery_items for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy blog_posts_public_read on public.blog_posts for select using (status='published' and archived_at is null);
  create policy blog_posts_admin_all on public.blog_posts for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy special_offers_public_read on public.special_offers for select using (status='published' and archived_at is null);
  create policy special_offers_admin_all on public.special_offers for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy partners_public_read on public.partners for select using (status='published' and archived_at is null);
  create policy partners_admin_all on public.partners for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy navigation_items_public_read on public.navigation_items for select using (status='published' and archived_at is null);
  create policy navigation_items_admin_all on public.navigation_items for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy footer_sections_public_read on public.footer_sections for select using (status='published' and archived_at is null);
  create policy footer_sections_admin_all on public.footer_sections for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy footer_links_public_read on public.footer_links for select using (status='published' and archived_at is null);
  create policy footer_links_admin_all on public.footer_links for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy site_content_blocks_public_read on public.site_content_blocks for select using (status='published' and archived_at is null);
  create policy site_content_blocks_admin_all on public.site_content_blocks for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy package_itineraries_public_read on public.package_itineraries for select using (status='published' and archived_at is null);
  create policy package_itineraries_admin_all on public.package_itineraries for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy hotels_public_read on public.hotels for select using (status='published' and archived_at is null);
  create policy hotels_admin_all on public.hotels for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;

-- Seed current hard-coded content only if the tables are empty. This preserves the
-- current website while moving the source of truth into the database.
insert into public.site_settings (singleton_key,website_name,logo_url,contact_email,phone,address,default_seo_title,default_seo_description)
select 'default','BlueVows','/bluevows-logo.png','hello@example.com','+91 XXXXX XXXXX','Port Blair, Andaman & Nicobar Islands, India','BlueVows | Andaman Travel','Thoughtfully planned island holidays in the Andaman Islands.'
where not exists (select 1 from public.site_settings where singleton_key='default');

insert into public.hero_slides (badge,heading,accent,description,image_url,primary_cta_label,primary_cta_link,secondary_cta_label,secondary_cta_link,display_order)
select * from (values
('YOUR ISLAND JOURNEY STARTS HERE','Experience the','Andaman','Beautiful islands, handpicked stays and experiences planned around the way you want to travel.','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=100','Explore Packages','/packages','Make Your Trip Memorable','/experiences',0),
('YOUR ISLAND JOURNEY STARTS HERE','Dive into','Island Life','Beautiful islands, handpicked stays and experiences planned around the way you want to travel.','https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2400&q=100','Explore Packages','/packages','Make Your Trip Memorable','/experiences',1),
('YOUR ISLAND JOURNEY STARTS HERE','Escape to','Paradise','Beautiful islands, handpicked stays and experiences planned around the way you want to travel.','https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2400&q=100','Explore Packages','/packages','Make Your Trip Memorable','/experiences',2)
) v(badge,heading,accent,description,image_url,primary_cta_label,primary_cta_link,secondary_cta_label,secondary_cta_link,display_order)
where not exists (select 1 from public.hero_slides);

insert into public.activities (slug,name,icon,description,details,price,cta_label,display_order)
select * from (values
('scuba-diving','Scuba Diving','Waves','Discover vibrant coral reefs and marine life.','Guided beginner-friendly dive with equipment, instructor support and reef exploration.','From ₹3,500','View details',0),
('sea-walk','Sea Walk','Compass','Walk beneath the sea and experience the reef.','Helmeted underwater walk with trained guides and a close-up view of colourful marine life.','From ₹3,000','View details',1),
('island-transfers','Island Transfers','MapPin','Comfortable transfers planned around your itinerary.','Comfortable point-to-point transfers arranged around ferry, hotel and sightseeing timings.','From ₹1,500','View details',2),
('kayaking','Kayaking','Waves','Explore calm tropical waters at your own pace.','A relaxed guided paddle through calm tropical waters, subject to weather and sea conditions.','From ₹1,800','View details',3)
) v(slug,name,icon,description,details,price,cta_label,display_order)
where not exists (select 1 from public.activities);

insert into public.testimonials (guest_name,title,review,rating,photo_url,display_order)
select * from (values
('Priya S.','A wonderful trip','Everything was well planned and the communication was easy from start to finish.',5,'https://i.pravatar.cc/120?img=47',0),
('Rahul M.','Smooth and comfortable','The itinerary was flexible and the hotel choices were exactly what we wanted.',5,'https://i.pravatar.cc/120?img=12',1),
('Neha K.','Highly recommended','Great support, clear quotation and a memorable island experience.',5,'https://i.pravatar.cc/120?img=32',2)
) v(guest_name,title,review,rating,photo_url,display_order)
where not exists (select 1 from public.testimonials);

insert into public.partners (name,display_order)
select x.name,x.ord from (values
('ISLAND STAYS',0),('OCEAN EXPERIENCES',1),('TRAVEL PARTNER',2),('ANDAMAN HOSTS',3),('DISCOVER INDIA',4),('ISLAND ADVENTURES',5),('TRAVEL PARTNER',6),('OCEAN EXPERIENCES',7)
) x(name,ord) where not exists (select 1 from public.partners);

insert into public.site_content_blocks(content_key,content,display_order)
select * from (values
('home.trust','{"items":[{"title":"Local Island Experts","text":"Real Andaman knowledge","icon":"ShieldCheck"},{"title":"Handpicked Stays","text":"Comfort & value checked","icon":"Hotel"},{"title":"Clear Quotations","text":"No confusing pricing","icon":"CreditCard"},{"title":"Human Support","text":"Help before your trip","icon":"MessageCircle"}]}',0),
('home.why','{"eyebrow":"WHY TRAVEL WITH US","title":"Local knowledge. Thoughtful planning.","description":"From your first enquiry to the day you return home, we keep your island journey clear, comfortable and personal.","items":[{"title":"Local expertise","text":"Practical advice from people who know the islands.","icon":"CheckCircle2"},{"title":"Handpicked stays","text":"Hotels selected for location, comfort and value.","icon":"CheckCircle2"},{"title":"Easy quotations","text":"Clear pricing with a simple advance-payment QR.","icon":"CheckCircle2"},{"title":"Human support","text":"Real help before and during your trip.","icon":"CheckCircle2"}]}',1),
('home.cta','{"eyebrow":"READY TO GO?","title":"Let''s plan your island escape.","description":"Tell us your dates and what you want to experience. We''ll help shape the trip.","button":"Get a Free Quotation","link":"/contact"}',2),
('home.video','{"eyebrow":"SEE THE ISLANDS","title":"Watch Andaman before you go","description":"Get a real look at the islands, beaches and experiences that can be part of your BlueVows journey.","video_url":"https://www.youtube.com/embed/oXPJxnVqJ6w?rel=0","subscribe_url":"https://www.youtube.com/@NomadicSoulmates?sub_confirmation=1"}',3),
('footer','{"description":"Thoughtfully planned island holidays in the Andaman Islands.","phone":"+91 XXXXX XXXXX","email":"hello@example.com","address":"Port Blair, Andaman & Nicobar Islands, India","copyright":"© 2026 BlueVows. All rights reserved.","tagline":"Made for island journeys."}',4)
) v(content_key,content,display_order)
where not exists (select 1 from public.site_content_blocks);

-- Additional current homepage blocks moved into the same future-editable content source.
insert into public.site_content_blocks(content_key,content,display_order)
select * from (values
('home.parallax','{"eyebrow":"THE ANDAMAN FEELING","title":"Sea breeze. Island time. Memories that stay.","description":"Let the water, beaches and open skies become part of your journey.","button":"Explore the islands","link":"/destinations"}',5),
('home.route','{"eyebrow":"YOUR ISLAND ROUTE","title":"Fly in. Island hop. Explore.","description":"A simple visual route from Port Blair to the islands you can discover with BlueVows.","port_blair":"Port Blair","havelock":"Havelock","neil":"Neil Island"}',6),
('home.map','{"eyebrow":"ISLAND GUIDE","title":"Explore the islands on the map","description":"Tap an island to highlight it. The map animation cycles automatically too.","islands":[["Port Blair","Gateway to Andaman",18,68],["Havelock","Beaches & adventures",54,39],["Neil Island","Peaceful island escape",70,68]]}',7),
('home.counter','{"items":[[500,"Happy Guests","guests"],[50,"Tour Packages","packages"],[10,"Years Experience","years"]]}',8)
) v(content_key,content,display_order)
where not exists (select 1 from public.site_content_blocks where content_key=v.content_key);

-- Seed package itineraries from the current frontend content only when missing.
insert into public.package_itineraries(package_id,day_label,title,description,display_order)
select p.id,x.day_label,x.title,x.description,x.ord
from public.packages p
cross join lateral (values
('andaman-escape','Day 1','Arrival in Port Blair','Airport pickup, hotel check-in and a relaxed coastal evening.',0),
('andaman-escape','Day 2','Port Blair & Cellular Jail','Explore local history and enjoy the evening light & sound experience.',1),
('andaman-escape','Day 3','Havelock Island','Ferry transfer, hotel check-in and sunset at Radhanagar Beach.',2),
('andaman-escape','Day 4','Island Adventure','Choose scuba, sea walk or a relaxed beach day.',3),
('andaman-escape','Day 5','Neil Island','Ferry transfer, natural bridge and island sightseeing.',4),
('andaman-escape','Day 6','Departure','Breakfast, transfer and departure assistance.',5),
('island-discovery','Day 1','Port Blair Arrival','Airport transfer, check-in and free evening.',0),
('island-discovery','Day 2','North Bay & Ross Island','Boat excursion and island exploration.',1),
('island-discovery','Day 3','Havelock','Ferry transfer and beach time.',2),
('island-discovery','Day 4','Havelock Experience','Water activity or leisure day.',3),
('island-discovery','Day 5','Departure','Return transfer and onward journey.',4),
('honeymoon-islands','Day 1','Romantic Arrival','Private transfer, hotel check-in and couple time.',0),
('honeymoon-islands','Day 2','Port Blair','Relaxed sightseeing and sunset together.',1),
('honeymoon-islands','Day 3','Havelock','Ferry transfer and Radhanagar Beach.',2),
('honeymoon-islands','Day 4','Couple Experience','Scuba, sea walk or a private island experience.',3),
('honeymoon-islands','Day 5','Leisure Day','Slow morning, beach time and optional dinner setup.',4),
('honeymoon-islands','Day 6','Neil Island','Natural Bridge and peaceful island escape.',5),
('honeymoon-islands','Day 7','Departure','Breakfast and airport/jetty transfer.',6)
) x(package_slug,day_label,title,description,ord)
where p.slug=x.package_slug
and not exists(select 1 from public.package_itineraries pi where pi.package_id=p.id);

-- Preserve current social links as editable settings.
update public.site_settings
set social_links = coalesce(social_links,'{}'::jsonb) || '{"instagram":"https://www.instagram.com/","facebook":"https://www.facebook.com/","x":"https://x.com/","youtube":"https://www.youtube.com/","whatsapp":"https://wa.me/"}'::jsonb
where singleton_key='default';

-- Tighten existing public reads so archived records stay recoverable but invisible.
drop policy if exists destinations_public_read on public.destinations;
create policy destinations_public_read on public.destinations for select using (status='published' and archived_at is null);
drop policy if exists places_public_read on public.destination_places;
create policy places_public_read on public.destination_places for select using (status='published' and archived_at is null);
drop policy if exists experiences_public_read on public.destination_experiences;
create policy experiences_public_read on public.destination_experiences for select using (status='published' and archived_at is null);
drop policy if exists faqs_public_read on public.destination_faqs;
create policy faqs_public_read on public.destination_faqs for select using (status='published' and archived_at is null);
drop policy if exists gallery_public_read on public.destination_gallery;
create policy gallery_public_read on public.destination_gallery for select using (status='published' and archived_at is null);
drop policy if exists tips_public_read on public.destination_tips;
create policy tips_public_read on public.destination_tips for select using (status='published' and archived_at is null);
drop policy if exists packages_public_read on public.packages;
create policy packages_public_read on public.packages for select using (status='published' and archived_at is null);
drop policy if exists destination_packages_public_read on public.destination_packages;
create policy destination_packages_public_read on public.destination_packages for select using (status='published' and archived_at is null);

-- Destination-specific section copy and labels. This lets a future Admin Panel
-- edit page sections without creating separate React pages.
create table if not exists public.destination_content_blocks (
  id uuid primary key default gen_random_uuid(),
  destination_id uuid not null references public.destinations(id) on delete cascade,
  content_key text not null,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'published' check (status in ('published','hidden','draft')),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique(destination_id,content_key)
);
create index if not exists destination_content_blocks_idx on public.destination_content_blocks(destination_id,display_order);
alter table public.destination_content_blocks enable row level security;
do $$ begin
  create policy destination_content_blocks_public_read on public.destination_content_blocks for select using (status='published' and archived_at is null);
  create policy destination_content_blocks_admin_all on public.destination_content_blocks for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
drop trigger if exists destination_content_blocks_updated_at on public.destination_content_blocks;
create trigger destination_content_blocks_updated_at before update on public.destination_content_blocks for each row execute function public.touch_updated_at();

insert into public.destination_content_blocks(destination_id,content_key,content,display_order)
select d.id,x.content_key,x.content,x.ord
from public.destinations d
cross join lateral (values
('hero','{"eyebrow":"DESTINATION GUIDE","primary_cta":"Explore Packages","secondary_cta":"Send Inquiry"}',0),
('about','{"eyebrow":"ABOUT","heading_prefix":"Discover","image_alt":"Destination"}',1),
('places','{"eyebrow":"TOP PLACES TO VISIT","heading":"Places to explore","description":"Handpicked places you can add to your itinerary."}',2),
('experiences','{"eyebrow":"THINGS TO DO","heading":"Experiences worth adding"}',3),
('packages','{"eyebrow":"RECOMMENDED PACKAGES","heading":"Packages for"}',4),
('reach','{"eyebrow":"HOW TO REACH","heading_prefix":"Getting to"}',5),
('tips','{"eyebrow":"TRAVEL TIPS","heading":"Useful before you go"}',6),
('gallery','{"eyebrow":"DESTINATION GALLERY","heading":"See"}',7),
('faq','{"eyebrow":"FAQ","heading":"Questions about"}',8),
('final_cta','{"eyebrow":"READY TO EXPLORE?","heading":"Ready to Explore","description":"Tell us your dates and we'll help build the right island plan.","packages_button":"View Packages","inquiry_button":"Send Inquiry"}',9)
) x(content_key,content,ord)
where not exists(select 1 from public.destination_content_blocks b where b.destination_id=d.id and b.content_key=x.content_key);

-- Page-level copy for non-destination pages. Existing UI uses fallbacks when rows are absent.
insert into public.site_content_blocks(content_key,content,display_order)
select * from (values
('page.about','{"eyebrow":"OUR STORY","title":"About BlueVows","description":"A modern travel platform focused on simple planning, clear quotations and memorable Andaman experiences."}',20),
('page.hotels','{"eyebrow":"STAY COMFORTABLY","title":"Hotels & Resorts","description":"A clean hotel directory will be connected to Supabase in the next setup stage."}',21),
('page.contact','{"eyebrow":"GET IN TOUCH","title":"Plan your trip","description":"Share your travel plans and our team will prepare a quotation for you."}',22)
) v(content_key,content,display_order)
where not exists(select 1 from public.site_content_blocks where content_key=v.content_key);

-- Shared site media bucket for future logo, hero, partner, gallery and blog uploads.
insert into storage.buckets (id,name,public) values ('site-media','site-media',true) on conflict (id) do nothing;
do $$ begin
  create policy site_media_public_read on storage.objects for select using (bucket_id='site-media');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy site_media_auth_write on storage.objects for insert to authenticated with check (bucket_id='site-media');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy site_media_auth_update on storage.objects for update to authenticated using (bucket_id='site-media') with check (bucket_id='site-media');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy site_media_auth_delete on storage.objects for delete to authenticated using (bucket_id='site-media');
exception when duplicate_object then null; end $$;

insert into public.site_content_blocks(content_key,content,display_order)
select 'footer.highlight','{"eyebrow":"LET''S PLAN","title":"Your island escape starts with one message.","description":"Share your dates and we''ll prepare a clear quotation for you."}',9
where not exists(select 1 from public.site_content_blocks where content_key='footer.highlight');
