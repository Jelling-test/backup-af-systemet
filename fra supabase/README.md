# Supabase Backup - Jelling Camping Strømstyring

**Eksporteret:** 14. december 2025

## Indhold

| Fil | Beskrivelse |
|-----|-------------|
| `01_cron_jobs.sql` | 13 CRON jobs (8 Edge Function + 5 SQL) |
| `02_organizations.sql` | Jelling Camping organization |
| `03_roles_permissions.sql` | 4 roles + 35 permissions |
| `04_pakke_typer.sql` | 28 strømpakker (kørende + sæson) |
| `05_email_templates.sql` | 3 email templates |
| `06_settings.sql` | Bakery, portal info, dashboard settings |
| `07_attractions.sql` | 12 attraktioner |
| `08_cabins.sql` | 17 hytter med map koordinater |
| `09_migrations_liste.md` | Liste over 136+ migrations |
| `10_secrets_template.md` | Template for API keys og secrets |

## Rækkefølge ved Restore

```sql
-- 1. Kør migrations først (via Supabase CLI eller manuelt)
-- 2. Derefter seed data i denne rækkefølge:

\i 02_organizations.sql
\i 03_roles_permissions.sql
\i 04_pakke_typer.sql
\i 05_email_templates.sql
\i 06_settings.sql
\i 07_attractions.sql
\i 08_cabins.sql
\i 01_cron_jobs.sql  -- sidst, da de refererer til Edge Functions
```

## Vigtige Noter

1. **Migrations** er IKKE inkluderet som SQL filer - de findes i repo'erne:
   - `test.af.system-main/supabase/migrations/`
   - Brug `supabase db push` for at køre dem

2. **Edge Functions** findes i:
   - `hvad gør de forskellige funktioner/edge-functions/`
   - Deploy med `supabase functions deploy`

3. **Secrets** skal hentes manuelt fra:
   - Supabase Dashboard
   - Stripe Dashboard
   - Brevo Dashboard

4. **CRON jobs** skal have opdaterede URLs og API keys før de aktiveres

## Systemkomponenter

```
┌─────────────────────────────────────────────────────────────┐
│                    JELLING CAMPING SYSTEM                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Vercel     │  │   Vercel     │  │   Supabase   │       │
│  │  Admin/Staff │  │  Gæsteportal │  │   Database   │       │
│  │              │  │              │  │   + Edge Fn  │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                 │                │
│         └────────────────┼─────────────────┘                │
│                          │                                   │
│  ┌───────────────────────┼───────────────────────┐          │
│  │                    NAS Server                  │          │
│  │  ┌─────────────┐  ┌─────────────┐             │          │
│  │  │ Zigbee2MQTT │  │ MQTT Broker │             │          │
│  │  │  (7 areas)  │  │             │             │          │
│  │  └─────────────┘  └─────────────┘             │          │
│  │                                                │          │
│  │  ┌─────────────┐  ┌─────────────┐             │          │
│  │  │ device-sync │  │ Node-RED    │             │          │
│  │  │  Python     │  │             │             │          │
│  │  └─────────────┘  └─────────────┘             │          │
│  └────────────────────────────────────────────────┘          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │    Stripe    │  │    Brevo     │  │   Sirvoy     │       │
│  │   Betaling   │  │    Email     │  │   Booking    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
