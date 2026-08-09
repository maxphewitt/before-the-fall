-- task-50: national parish directory (Parish Finder)
-- Idempotent. Run in Supabase Studio SQL editor.
--
-- Privacy: this table stores PARISH facts only. User locations (browser
-- geolocation or typed ZIPs) are used per-request to sort results and are
-- NEVER written anywhere — no location columns exist on any user table.
--
-- Seed rows below are well-known cathedrals to make the finder useful on
-- day one. verified=false on all of them: confirm address/phone/website
-- against each parish's site before public launch, and grow the directory
-- via CSV import or the CMS during beta.

create table if not exists parishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  state text not null,
  zip text not null,
  phone text,
  website text,
  mass_times text,
  confession_times text,
  lat double precision not null,
  lng double precision not null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists parishes_name_zip_key on parishes (name, zip);
create index if not exists parishes_state_idx on parishes (state);

alter table parishes enable row level security;
-- No public policies: reads go through the service-role server client,
-- same as the other facts tables.

insert into parishes (name, address, city, state, zip, website, lat, lng) values
  ('St. Patrick''s Cathedral', '5th Avenue between 50th/51st St', 'New York', 'NY', '10022', 'https://saintpatrickscathedral.org', 40.7585, -73.9760),
  ('Basilica of the National Shrine of the Immaculate Conception', '400 Michigan Ave NE', 'Washington', 'DC', '20017', 'https://nationalshrine.org', 38.9333, -76.9994),
  ('Cathedral of Our Lady of the Angels', '555 W Temple St', 'Los Angeles', 'CA', '90012', 'https://olacathedral.org', 34.0576, -118.2468),
  ('Holy Name Cathedral', '735 N State St', 'Chicago', 'IL', '60654', 'https://holynamecathedral.org', 41.8963, -87.6284),
  ('Cathedral Basilica of Saint Louis', '4431 Lindell Blvd', 'St. Louis', 'MO', '63108', 'https://cathedralstl.org', 38.6413, -90.2618),
  ('Cathedral of Saint Paul', '239 Selby Ave', 'St. Paul', 'MN', '55102', 'https://cathedralsaintpaul.org', 44.9467, -93.1091),
  ('Cathedral of St. Mary of the Assumption', '1111 Gough St', 'San Francisco', 'CA', '94109', 'https://smcsf.org', 37.7846, -122.4258),
  ('Cathedral Basilica of the Sacred Heart', '89 Ridge St', 'Newark', 'NJ', '07104', null, 40.7686, -74.1776),
  ('Cathedral of St. Matthew the Apostle', '1725 Rhode Island Ave NW', 'Washington', 'DC', '20036', 'https://stmatthewscathedral.org', 38.9060, -77.0402),
  ('Cathedral Basilica of St. Augustine', '38 Cathedral Pl', 'St. Augustine', 'FL', '32084', null, 29.8925, -81.3130),
  ('Cathedral Basilica of the Immaculate Conception', '1530 Logan St', 'Denver', 'CO', '80203', 'https://denvercathedral.org', 39.7402, -104.9847),
  ('Co-Cathedral of the Sacred Heart', '1111 St Joseph Pkwy', 'Houston', 'TX', '77002', 'https://sacredhearthouston.org', 29.7520, -95.3630),
  ('Cathedral of Christ the King', '2699 Peachtree Rd NE', 'Atlanta', 'GA', '30305', 'https://cathedralctk.com', 33.8410, -84.3800),
  ('St. James Cathedral', '804 9th Ave', 'Seattle', 'WA', '98104', 'https://stjames-cathedral.org', 47.6076, -122.3247)
on conflict (name, zip) do nothing;
