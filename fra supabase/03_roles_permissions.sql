-- =====================================================
-- ROLES & PERMISSIONS SEED DATA
-- Eksporteret: 14. december 2025
-- =====================================================

-- ROLES
INSERT INTO roles (id, name, description, scope, is_system_role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'superadmin', 'Platform Administrator - Full access', 'platform', true),
  ('00000000-0000-0000-0000-000000000002', 'admin', 'Camping Manager - Full tenant access', 'tenant', true),
  ('00000000-0000-0000-0000-000000000003', 'staff', 'Receptionist/Staff - Limited access', 'tenant', true),
  ('00000000-0000-0000-0000-000000000004', 'guest', 'Campist/Guest - Self-service only', 'tenant', true)
ON CONFLICT (id) DO NOTHING;

-- PERMISSIONS (35 stk)
INSERT INTO permissions (key, name, description, category) VALUES
  -- Bookinger
  ('bookinger:create', 'Opret bookinger', 'Kan oprette nye bookinger', 'bookinger'),
  ('bookinger:read', 'Læs bookinger', 'Kan se alle bookinger', 'bookinger'),
  ('bookinger:read_own', 'Læs egne bookinger', 'Kan kun se egne bookinger', 'bookinger'),
  ('bookinger:update', 'Opdater bookinger', 'Kan redigere bookinger', 'bookinger'),
  ('bookinger:delete', 'Slet bookinger', 'Kan slette bookinger', 'bookinger'),
  ('bookinger:check_in', 'Check-in', 'Kan checke gæster ind', 'bookinger'),
  ('bookinger:check_out', 'Check-out', 'Kan checke gæster ud', 'bookinger'),
  -- Målere
  ('målere:create', 'Opret målere', 'Kan oprette nye målere', 'målere'),
  ('målere:read', 'Læs målere', 'Kan se alle målere', 'målere'),
  ('målere:read_own', 'Læs egen måler', 'Kan kun se egen måler', 'målere'),
  ('målere:update', 'Opdater målere', 'Kan redigere målere', 'målere'),
  ('målere:delete', 'Slet målere', 'Kan slette målere', 'målere'),
  ('målere:assign', 'Tildel målere', 'Kan tildele målere til gæster', 'målere'),
  ('målere:toggle', 'Tænd/sluk alle', 'Kan tænde/slukke alle målere', 'målere'),
  ('målere:toggle_own', 'Tænd/sluk egen', 'Kan tænde/slukke egen måler', 'målere'),
  -- Pakker
  ('pakker:create', 'Opret pakker', 'Kan oprette pakker (reception)', 'pakker'),
  ('pakker:create_own', 'Køb egne pakker', 'Kan købe pakker online', 'pakker'),
  ('pakker:read', 'Læs pakker', 'Kan se alle pakker', 'pakker'),
  ('pakker:read_own', 'Læs egne pakker', 'Kan kun se egne pakker', 'pakker'),
  ('pakker:update', 'Opdater pakker', 'Kan redigere pakker', 'pakker'),
  ('pakker:delete', 'Slet pakker', 'Kan slette pakker', 'pakker'),
  -- Pakke typer
  ('pakke_typer:create', 'Opret pakke typer', 'Kan oprette nye pakke typer', 'pakke_typer'),
  ('pakke_typer:read', 'Læs pakke typer', 'Kan se pakke typer', 'pakke_typer'),
  ('pakke_typer:update', 'Opdater pakke typer', 'Kan redigere pakke typer', 'pakke_typer'),
  ('pakke_typer:delete', 'Slet pakke typer', 'Kan slette pakke typer', 'pakke_typer'),
  -- Betalinger
  ('betalinger:read', 'Læs betalinger', 'Kan se betalinger', 'betalinger'),
  ('betalinger:read_own', 'Læs egne betalinger', 'Kan kun se egne betalinger', 'betalinger'),
  -- Forbrug
  ('forbrug:read', 'Læs forbrug', 'Kan se forbrug', 'forbrug'),
  ('forbrug:read_own', 'Læs eget forbrug', 'Kan kun se eget forbrug', 'forbrug'),
  -- System
  ('system:settings', 'System indstillinger', 'Kan ændre system indstillinger', 'system'),
  ('system:rapporter', 'Rapporter', 'Kan se rapporter', 'system'),
  ('system:audit_log', 'Audit log', 'Kan se audit log', 'system'),
  -- Staff
  ('staff:manage', 'Administrer personale', 'Kan administrere personale', 'staff'),
  ('staff:invite', 'Inviter personale', 'Kan invitere nye brugere', 'staff'),
  -- Dashboard
  ('dashboard:read', 'Læs dashboard', 'Kan se dashboards', 'dashboard')
ON CONFLICT (key) DO NOTHING;
