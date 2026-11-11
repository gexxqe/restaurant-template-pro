-- Applied on 2026-11-11 to project vranjjsfxiygohaqyfxw.
-- Defense in depth: RLS policies already block these writes; table privileges now block them too.
revoke insert, update, delete, truncate, references, trigger on public.menu_items, public.opening_hours, public.restaurant_settings, public.admin_users from anon;
revoke update, delete, truncate, references, trigger on public.reservations from anon;
revoke truncate, references, trigger on public.menu_items, public.opening_hours, public.restaurant_settings, public.admin_users, public.reservations from authenticated;
revoke insert, update, delete on public.admin_users from authenticated;
