-- task-56 (2026-09-21): The Great Repositioning — remap old onboarding
-- vocabulary to the new question set (Max's call: one vocabulary for
-- analytics rather than two coexisting).
--
-- New vocab (app/(auth)/onboard/OnboardFlow.tsx):
--   framing (now "what drew you here"): understand_beliefs | learn_pray |
--     something_missing | carrying_something | invited
--   emotional_state (now "what would a good outcome look like"):
--     understand_faith | prayer_life | peace_with_past |
--     back_to_sacraments | dont_know
-- Old→new mapping is necessarily interpretive; it errs toward the
-- gentlest true reading. populations, faith_role, duration, discovery
-- values are UNCHANGED by design. support_level is no longer asked
-- (new accounts store self_guided); old values are left as history.
--
-- Idempotent: re-running matches no old values and changes nothing.

update user_profiles set framing = case framing
  when 'intrusive_thoughts' then 'carrying_something'
  when 'pattern'            then 'carrying_something'
  when 'starting'           then 'something_missing'
  else framing end
where framing in ('intrusive_thoughts', 'pattern', 'starting');

update user_profiles set emotional_state = case emotional_state
  when 'heavy'  then 'peace_with_past'
  when 'afraid' then 'peace_with_past'
  when 'tired'  then 'dont_know'
  when 'ready'  then 'prayer_life'
  else emotional_state end
where emotional_state in ('heavy', 'afraid', 'tired', 'ready');
