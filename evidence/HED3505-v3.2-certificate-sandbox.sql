-- HED3505 v3.2 NON-PRODUCTION SPECIFICATION
-- Apply to sandbox only after current Neon schema is inspected and reconciled.
-- Do NOT apply to production.

create table if not exists hed3505.learning_completion (
  completion_id uuid primary key default gen_random_uuid(),
  learner_id uuid not null,
  module_version text not null default '3.2',
  mission_1_completed_at timestamptz,
  mission_2_completed_at timestamptz,
  mission_3_completed_at timestamptz,
  feedback_requirements_completed_at timestamptz,
  revision_requirements_completed_at timestamptz,
  final_review_completed_at timestamptz,
  practice_check_completed_at timestamptz,
  eligible_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (learner_id, module_version)
);

create table if not exists hed3505.certificate_issue (
  certificate_id uuid primary key default gen_random_uuid(),
  public_code text not null unique,
  learner_id uuid not null,
  module_version text not null,
  certificate_title text not null default 'HED3505 Independent Learning — Certificate of Completion',
  learner_display_name text not null,
  course_code text not null default 'HED3505',
  instructor text not null default 'ผู้ช่วยศาสตราจารย์ ดร.เกษม ชูรัตน์',
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  revoke_reason text,
  unique (learner_id, module_version)
);

alter table hed3505.learning_completion enable row level security;
alter table hed3505.certificate_issue enable row level security;

-- Intentionally no anonymous table grants or broad RLS policies here.
-- Existing auth mapping and course_staff authorization must be inspected before policies are installed.

create or replace function hed3505.verify_certificate(p_public_code text)
returns table (
  status text,
  certificate_title text,
  learner_display_name text,
  course text,
  completion_date date,
  instructor text,
  certificate_version text
)
language sql
security definer
set search_path = hed3505, pg_temp
as $$
  select
    case when c.revoked_at is null then 'VALID' else 'REVOKED' end,
    c.certificate_title,
    c.learner_display_name,
    c.course_code,
    c.issued_at::date,
    c.instructor,
    c.module_version
  from hed3505.certificate_issue c
  where c.public_code = p_public_code;
$$;

revoke all on function hed3505.verify_certificate(text) from public;
-- Grant EXECUTE only to the deliberately chosen Data API role after sandbox privacy tests.
-- NOT FOUND is represented by zero rows; the API/UI maps that to NOT FOUND.

-- Certificate issue MUST be performed by a server-authorized transaction only after all
-- completion requirements are recomputed from authoritative activity records.
-- Client-provided completion flags are never authoritative.
