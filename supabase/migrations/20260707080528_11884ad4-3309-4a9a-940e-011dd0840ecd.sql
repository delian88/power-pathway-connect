
-- Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

-- Tighten always-true applications INSERT policy: only allow applying to published events
DROP POLICY IF EXISTS "Anyone can apply" ON public.applications;
CREATE POLICY "Anyone can apply for published events"
ON public.applications
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events
    WHERE events.id = applications.event_id
      AND events.is_published = true
  )
);
