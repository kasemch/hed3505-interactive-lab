-- HED3505 staging hardening: recipient-linked peer feedback and immutable assessments.
-- Apply ONLY to the isolated Neon staging branch after reviewing current schema.
-- No production application, no data deletion.
create or replace function hed3505_final_class.validate_feedback_response_owner()
returns trigger
language plpgsql security definer
set search_path=pg_catalog,hed3505_final_class
as $$
begin
  if new.response_id is not null and not exists (
    select 1 from hed3505_final_class.responses r
    where r.id=new.response_id
      and r.session_id=new.session_id
      and r.participant_id=new.recipient_participant_id
  ) then
    raise exception 'Feedback response must belong to the recipient in this session';
  end if;
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgrelid='hed3505_final_class.peer_feedback'::regclass and tgname='peer_feedback_response_owner_guard') then
    create trigger peer_feedback_response_owner_guard before insert
    on hed3505_final_class.peer_feedback for each row
    execute function hed3505_final_class.validate_feedback_response_owner();
  end if;
  if not exists (select 1 from pg_trigger where tgrelid='hed3505_final_class.assessments'::regclass and tgname='assessments_immutable') then
    create trigger assessments_immutable before update or delete
    on hed3505_final_class.assessments for each row
    execute function hed3505_final_class.reject_immutable_changes();
  end if;
  if not exists (select 1 from pg_trigger where tgrelid='hed3505_final_class.peer_feedback'::regclass and tgname='peer_feedback_immutable') then
    create trigger peer_feedback_immutable before update or delete
    on hed3505_final_class.peer_feedback for each row
    execute function hed3505_final_class.reject_immutable_changes();
  end if;
end;
$$;
