# Secrets & Environment Variables Template

**Eksporteret:** 14. december 2025

## ⚠️ VIGTIGT
Denne fil indeholder IKKE faktiske secrets - kun en template.
Hent de rigtige værdier fra Supabase Dashboard og andre tjenester.

---

## 1. Supabase Credentials

```env
# Supabase Project
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]

# Database Connection (for lokal Supabase)
POSTGRES_PASSWORD=[DATABASE_PASSWORD]
JWT_SECRET=[JWT_SECRET]
```

**Hvor finder du dem:**
- Supabase Dashboard → Settings → API
- Project URL, anon key, service_role key

---

## 2. Stripe Integration

```env
STRIPE_SECRET_KEY=sk_live_[...]
STRIPE_WEBHOOK_SECRET=whsec_[...]
STRIPE_PUBLISHABLE_KEY=pk_live_[...]
```

**Stripe Dashboard → Developers → API keys**

### Stripe Produkter (skal oprettes i ny Stripe)
- Dagspakker: 10-210 enheder
- Tillægspakker: kørende og sæson
- Webhook endpoint: `/functions/v1/stripe-webhook`

---

## 3. Brevo (Email Service)

```env
BREVO_API_KEY=xkeysib-[...]
```

**Brevo Dashboard → SMTP & API → API Keys**

### Brevo Webhooks
- Endpoint: `/functions/v1/brevo-webhook`
- Events: delivered, opened, clicked, bounced

---

## 4. Sirvoy Integration

```env
# Sirvoy webhook sender data til:
# /functions/v1/webhook
```

**Sirvoy Dashboard → Integrations → Webhooks**

---

## 5. MQTT Broker (NAS)

```env
MQTT_BROKER_HOST=192.168.9.61
MQTT_BROKER_PORT=1890
MQTT_USERNAME=homeassistant
MQTT_PASSWORD=7200Grindsted!
```

---

## 6. Gate Control (Axis ANPR)

```env
GATE_CONTROL_IP=152.115.191.134
GATE_CONTROL_PORT=65471
```

---

## 7. Vercel Deployments

### test.af.system (Admin/Staff)
```env
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[ANON_KEY]
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_[...]
```

### implentering-af-personligside (Gæsteportal)
```env
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[ANON_KEY]
```

---

## 8. Edge Functions Secrets (Supabase)

Disse secrets skal sættes i Supabase Dashboard → Edge Functions → Secrets:

| Secret Name | Beskrivelse |
|-------------|-------------|
| `STRIPE_SECRET_KEY` | Stripe API nøgle |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `BREVO_API_KEY` | Brevo email API nøgle |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role for admin operationer |

---

## 9. Lokal Supabase Setup

For at køre Supabase lokalt:

```bash
# Installer Supabase CLI
npm install -g supabase

# Start lokal Supabase
supabase start

# Kør migrations
supabase db push

# Deploy Edge Functions
supabase functions deploy
```

### Lokal Supabase URLs
- API: http://localhost:54321
- Studio: http://localhost:54323
- Database: postgresql://postgres:postgres@localhost:54322/postgres

---

## 10. Checklist ved Reetablering

- [ ] Opret nyt Supabase projekt (eller kør lokalt)
- [ ] Kør alle migrations
- [ ] Indsæt seed data (organizations, roles, pakke_typer, etc.)
- [ ] Opret CRON jobs
- [ ] Deploy Edge Functions
- [ ] Sæt secrets i Edge Functions
- [ ] Opret Stripe produkter og webhook
- [ ] Konfigurer Brevo webhook
- [ ] Konfigurer Sirvoy webhook
- [ ] Deploy frontend apps
- [ ] Test MQTT forbindelse til NAS
