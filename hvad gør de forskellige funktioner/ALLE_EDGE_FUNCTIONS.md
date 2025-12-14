# ALLE EDGE FUNCTIONS - KOMPLET DOKUMENTATION
## Jelling Camping Strømstyringssystem
### 36 Edge Functions i Supabase
### Opdateret: 14. december 2025

---

# INDHOLDSFORTEGNELSE

1. [admin-bypass-meter](#1-admin-bypass-meter)
2. [archive-meter-readings](#2-archive-meter-readings)
3. [assign-meter](#3-assign-meter)
4. [axis-anpr-webhook](#4-axis-anpr-webhook)
5. [bakery-api](#5-bakery-api)
6. [bakery-daily-summary](#6-bakery-daily-summary)
7. [brevo-webhook](#7-brevo-webhook)
8. [camera-snapshot](#8-camera-snapshot)
9. [check-low-power](#9-check-low-power)
10. [cleanup-expired-customers](#10-cleanup-expired-customers)
11. [cleanup-old-readings](#11-cleanup-old-readings)
12. [create-checkout](#12-create-checkout)
13. [daily-accounting-report](#13-daily-accounting-report)
14. [daily-package-snapshot](#14-daily-package-snapshot)
15. [delete-meter](#15-delete-meter)
16. [end-cleaning-power](#16-end-cleaning-power)
17. [gate-open](#17-gate-open)
18. [generate-magic-token](#18-generate-magic-token)
19. [get-guest-portal-data](#19-get-guest-portal-data)
20. [get-guest-power-data](#20-get-guest-power-data)
21. [get-guest-status](#21-get-guest-status)
22. [get-live-data](#22-get-live-data)
23. [monitor-power-usage](#23-monitor-power-usage)
24. [portal-api](#24-portal-api)
25. [rename-meter](#25-rename-meter)
26. [scheduled-emails](#26-scheduled-emails)
27. [send-email](#27-send-email)
28. [send-email-brevo](#28-send-email-brevo)
29. [send-low-power-warning](#29-send-low-power-warning)
30. [send-warning-email](#30-send-warning-email)
31. [send-welcome-email](#31-send-welcome-email)
32. [start-cleaning-power](#32-start-cleaning-power)
33. [stripe-webhook](#33-stripe-webhook)
34. [toggle-power](#34-toggle-power)
35. [validate-magic-link](#35-validate-magic-link)
36. [webhook](#36-webhook)

---

# FUNKTIONER

---

## 1. admin-bypass-meter
**Type:** API | **JWT:** Krævet

### Formål
Tillader admin/staff at aktivere bypass på en måler, så strømmen kan tændes uden aktiv pakke.

### Input
```json
{
  "meter_id": "F43",
  "action": "enable" | "disable",
  "reason": "Teknisk test"
}
```

### Funktionalitet
1. Verificerer bruger er admin/staff via `user_roles`
2. Aktiverer/deaktiverer `admin_bypass` på måler
3. Logger handling til `admin_bypass_log`

### Database
- `power_meters` - Opdaterer bypass status
- `admin_bypass_log` - Audit trail
- `user_roles` - Autorisering

---

## 2. archive-meter-readings
**Type:** CRON | **JWT:** Nej

### Formål
Arkiverer daglige snapshots af måleraflæsninger og sletter gamle data.

### Schedule
Kører hver time. Arkiverer kun kl. 23:00 dansk tid.

### Funktionalitet
1. **Kl. 23:00:** Arkiverer seneste reading for hver måler til `meter_readings_history`
2. **Altid:** Sletter readings ældre end 1 time i batches af 10.000

### Database
- `power_meters` - Henter alle målere
- `meter_readings` - Sletter gamle
- `meter_readings_history` - Gemmer snapshots

---

## 3. assign-meter
**Type:** API | **JWT:** Krævet

### Formål
Tildeler en måler til en kunde ved check-in eller målervalg.

### Input
```json
{
  "booking_nummer": 12345,
  "meter_number": "F43"
}
```

### Funktionalitet
1. Tjekker måler er ledig (`is_available`)
2. Finder kunde i `regular_customers` eller `seasonal_customers`
3. Henter seneste meter reading som `meter_start_energy`
4. Opdaterer kunde med måler-info
5. Markerer måler som optaget

### Database
- `power_meters` - Låser måler
- `regular_customers` / `seasonal_customers` - Opdaterer
- `meter_readings` - Henter start energy

---

## 4. axis-anpr-webhook
**Type:** Webhook | **JWT:** Nej

### Formål
Modtager nummerplade-genkendelse fra Axis ANPR kamera og åbner bom automatisk.

### Input
Multipart form-data eller JSON fra Axis kamera med:
- `plateText` - Nummerplade
- `carState` - "new" eller "lost"
- `ImageArray` - Billeder

### Funktionalitet
1. Parser payload fra kamera
2. Gemmer detektion i `plate_detections`
3. **Automatisk bom-åbning:**
   - Tjekker mod `approved_plates` whitelist
   - Manuel whitelist = 24/7 adgang
   - Sirvoy booking = kl. 07-23 + checked_in
4. Rate limit: 15 sekunder mellem åbninger
5. Logger alle åbninger i `gate_openings`

### Gate Control
- IP: `152.115.191.134:65471`
- Puls: ON → 700ms → OFF

### Database
- `plate_detections` - Gemmer alle detektioner
- `approved_plates` - Whitelist
- `gate_openings` - Åbnings-log

---

## 5. bakery-api
**Type:** API | **JWT:** Nej

### Formål
Håndterer alle bageri operationer: produkter, bestillinger, indstillinger.

### Actions
| Action | Beskrivelse |
|--------|-------------|
| `get-settings` | Hent bageri indstillinger |
| `save-settings` | Gem indstillinger (admin) |
| `get-products` | Hent aktive produkter |
| `admin-get-products` | Hent alle produkter |
| `admin-save-product` | Opret/opdater produkt |
| `admin-delete-product` | Slet produkt |
| `get-orders` | Hent ordrer for booking |
| `create-order` | Opret bestilling |
| `admin-orders` | Hent alle ordrer |
| `update-status` | Opdater ordre status |
| `cancel-order` | Annuller ordre |

### Database
- `bakery_settings`
- `bakery_products`
- `bakery_orders`

---

## 6. bakery-daily-summary
**Type:** CRON | **JWT:** Nej

### Formål
Sender daglig bageri oversigt med bage-liste og kundeliste til reception.

### Schedule
Dagligt efter lukketid (eller manuelt fra admin)

### Funktionalitet
1. Henter alle pending ordrer for i morgen
2. Beregner bage-liste (sum per produkt)
3. Genererer HTML email med:
   - Bage-liste med antal
   - Kundeliste med booking + varer
4. Sender via `send-email` function
5. Logger i `plugin_data` (bakery_email_log)

### Email til
`notification_email` fra settings (default: reception@jellingcamping.dk)

---

## 7. brevo-webhook
**Type:** Webhook | **JWT:** Nej

### Formål
Modtager email events fra Brevo (bounce, delivered, opened, clicked, etc.)

### Input
Array af events fra Brevo med:
- `email` - Modtager
- `event` - Type (delivered, opened, bounce, etc.)
- `message_id` - Email ID
- `subject` - Emne

### Funktionalitet
1. Parser events fra payload
2. Normaliserer data
3. Gemmer i `brevo_email_events`

### Database
- `brevo_email_events` - Email tracking

---

## 8. camera-snapshot
**Type:** API | **JWT:** Krævet

### Formål
Henter live snapshot fra bom-kameraet.

### Output
JPEG billede (image/jpeg)

### Funktionalitet
Henter billede fra: `http://152.115.191.134:65471/axis-cgi/jpg/image.cgi`

---

## 9. check-low-power
**Type:** CRON | **JWT:** Nej

### Formål
Tjekker alle aktive pakker for lav strøm og sender advarsler.

### Schedule
Hver 30 minut

### Funktionalitet
1. Henter thresholds fra `email_templates`:
   - `advarsel_koerende` - Threshold for kørende
   - `advarsel_saeson` - Threshold for sæson
2. Henter alle aktive pakker
3. For hver pakke:
   - Beregner forbrug vs. købt
   - Hvis under threshold og ikke allerede advaret → sender email
4. Markerer `advarsel_sendt: true` på pakken

### Database
- `plugin_data` (pakker, email_templates)
- `regular_customers` / `seasonal_customers`
- `meter_readings`

---

## 10. cleanup-expired-customers
**Type:** CRON | **JWT:** Nej

### Formål
Rydder op i kunder med udløbet departure_date.

### Funktionalitet
Kalder PostgreSQL RPC funktion `cleanup_expired_customers()` som sletter gamle kundedata.

---

## 11. cleanup-old-readings
**Type:** CRON | **JWT:** Nej

### Formål
Sletter meter readings ældre end 48 timer.

### Funktionalitet
Simpel delete query på `meter_readings` hvor `time < now() - 48 hours`

---

## 12. create-checkout
**Type:** API | **JWT:** Krævet

### Formål
Opretter Stripe checkout session for strømpakke køb.

### Input
```json
{
  "organization_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "booking_nummer": 12345,
  "pakke_type_id": "dagspakke-5kwh",
  "maaler_id": "F43"
}
```

### Funktionalitet
1. Henter pakke detaljer fra `plugin_data` (pakke_typer)
2. Opretter Stripe checkout session med metadata
3. Returnerer checkout URL

### Miljøvariabler
- `STRIPE_SECRET_KEY`

---

## 13. daily-accounting-report
**Type:** CRON | **JWT:** Nej

### Formål
Sender daglig salgsrapport til bogholderi.

### Schedule
Dagligt kl. 07:00 dansk tid

### Funktionalitet
1. Henter alle betalinger fra i går fra `plugin_data` (betalinger)
2. Beregner totaler og pakke-opdeling
3. Genererer CSV og HTML rapport
4. Sender via Brevo API

### Modtagere
- bogholderi@jellingcamping.dk
- peter@jellingcamping.dk

---

## 14. daily-package-snapshot
**Type:** CRON | **JWT:** Nej

### Formål
Gemmer dagligt snapshot af pakke-forbrug til statistik.

### Schedule
Dagligt kl. 00:00 dansk tid

### Funktionalitet
1. Henter alle aktive pakker
2. Grupperer per booking_nummer
3. Beregner forbrug fra meter_readings
4. Aggregerer per kunde_type og betalings_metode
5. Gemmer til `daily_package_stats`
6. Beregner drift-forbrug

### Database
- `plugin_data` (pakker)
- `regular_customers` / `seasonal_customers`
- `meter_readings`
- `daily_package_stats`

---

## 15. delete-meter
**Type:** API | **JWT:** Krævet

### Formål
Sletter en måler permanent fra systemet.

### Input
```json
{
  "meter_id": "F43"
}
```

### Funktionalitet
1. Finder måler i `power_meters`
2. Sletter fra `meter_readings_history`
3. Sletter fra `meter_readings`
4. Sletter fra `power_meters`

---

## 16. end-cleaning-power
**Type:** CRON | **JWT:** Nej

### Formål
Slukker strøm på hytter efter rengøring.

### Schedule
Dagligt kl. 15:00 dansk tid

### Funktionalitet
1. Finder alle aktive rengørings-sessions (`status: 'active'`)
2. Indsætter OFF kommando i `meter_commands`
3. Opdaterer status til 'completed'

### Database
- `cabin_cleaning_schedule`
- `cabins`
- `meter_commands`

---

## 17. gate-open
**Type:** API | **JWT:** Krævet

### Formål
Åbner bommen manuelt fra admin/staff panel.

### Input
```json
{
  "camera_serial": "CAMERA001",
  "source": "manual_button"
}
```

### Funktionalitet
1. Verificerer bruger er admin/staff
2. Opretter `control_request` i `access` schema
3. Sender pulse til bom:
   - ON signal via `http://152.115.191.134:65471/axis-cgi/io/port.cgi?action=2%3A%2F`
   - Vent 700ms
   - OFF signal via `http://152.115.191.134:65471/axis-cgi/io/port.cgi?action=2%3A%5C`
4. Failsafe: Sender ekstra OFF efter 5 sekunder

### Database
- `access.control_requests`
- `user_roles`

---

## 18. generate-magic-token
**Type:** API | **JWT:** Nej

### Formål
Genererer unik 32-tegns token for kunde portal adgang.

### Input
```json
{
  "booking_id": 12345
}
```

### Output
```json
{
  "success": true,
  "token": "abc123...",
  "magic_link": "https://jelling.vercel.app/m/12345/abc123...",
  "customer_name": "Peter Hansen"
}
```

### Funktionalitet
1. Finder kunde i `regular_customers` eller `seasonal_customers`
2. Genererer 32-tegns alfanumerisk token
3. Sikrer unikhed
4. Gemmer token på kunden
5. Returnerer magic link

### Portal URL
`https://jelling.vercel.app`

---

## 19. get-guest-portal-data
**Type:** API | **JWT:** Nej

### Formål
Henter komplet portal data for en gæst.

### Input
```json
{
  "booking_id": 12345,
  "data_type": "all" | "power" | "events" | "bakery" | "info"
}
```

### Output
Komplet data inkl:
- Kunde info
- Måler data + readings
- Aktive pakker
- Camp events
- Bageri produkter/ordrer
- Praktisk info

### Database
- `regular_customers` / `seasonal_customers`
- `meter_readings`
- `booking_extra_meters`
- `plugin_data` (pakker)
- `camp_events` / `external_events`
- `bakery_products` / `bakery_orders`
- `portal_info`

---

## 20. get-guest-power-data
**Type:** API | **JWT:** Nej

### Formål
Henter detaljeret strømdata for en gæst.

### Input
Query param `?booking_id=12345` eller JSON body

### Output
```json
{
  "meters": [...],
  "packages": [...],
  "summary": {
    "totalBought": 50,
    "totalConsumed": 23.5,
    "totalRemaining": 26.5
  }
}
```

### Funktionalitet
1. Finder kunde
2. Henter alle aktive pakker
3. Beregner forbrug fra meter_readings
4. Inkluderer `accumulated_usage` (fra tidligere målere ved flytning)

### KRITISK
Bruger `meter_start_energy` fra kunde-record (ikke pakke) som reference.

---

## 21. get-guest-status
**Type:** API | **JWT:** Nej

### Formål
Henter frisk gæstestatus baseret på booking_id.

### Input
```json
{
  "booking_id": 12345
}
```

### Output
GuestData format med:
- firstName, lastName, email, phone
- language, country
- arrivalDate, departureDate
- checkedIn, checkedOut
- meterId, spotNumber
- bookingId

---

## 22. get-live-data
**Type:** API | **JWT:** Krævet

### Formål
Henter gæstedata med fallback til webhook_data for udcheckede gæster.

### Input
```json
{
  "bookingId": 12345
}
```

### Funktionalitet
1. Søger i `regular_customers`
2. Søger i `seasonal_customers`
3. **Fallback:** Søger i `webhook_data` for udcheckede

---

## 23. monitor-power-usage
**Type:** CRON | **JWT:** Nej

### Formål
Overvåger strømforbrug og slukker ved overforbrug/udløb.

### Schedule
Hver 5. minut

### Funktionalitet
1. Henter alle checked-in kunder med målere
2. For hver kunde:
   - Beregner forbrug vs. pakke enheder
   - Hvis forbrug >= enheder → Slukker måler
   - For kørende: Tjekker også `varighed_timer` udløb
3. Markerer dagspakke som 'opbrugt' eller 'udløbet'

### VIGTIGT
Kun dagspakke markeres - tillægspakker forbliver aktive.

### Database
- `regular_customers` / `seasonal_customers`
- `plugin_data` (pakker)
- `meter_readings`
- `meter_commands`

---

## 24. portal-api
**Type:** API | **JWT:** Nej

### Formål
Generel API for gæsteportalen.

### Actions
| Action | Beskrivelse |
|--------|-------------|
| `events` | Hent kommende camp events |
| `info` | Hent praktisk info |
| `search-meters` | Søg ledige målere |
| `all` | Hent events + info |

### Database
- `camp_events`
- `portal_info`
- `power_meters`
- `cabins`
- `booking_extra_meters`

---

## 25. rename-meter
**Type:** API | **JWT:** Krævet

### Formål
Omdøber en måler i Zigbee2MQTT.

### Input
```json
{
  "ieee_address": "0x00158d0001234567",
  "new_name": "F43",
  "base_topic": "zigbee2mqtt"
}
```

### Funktionalitet
1. Gemmer rename-kommando i `meter_commands`
2. Node-RED henter og udfører via MQTT

### MQTT Topic
`{base_topic}/bridge/request/device/rename`

---

## 26. scheduled-emails
**Type:** CRON | **JWT:** Nej

### Formål
Sender planlagte emails baseret på triggers.

### Schedule
Dagligt (KUN manuelt for nu)

### Funktionalitet
1. Henter aktive templates med `trigger_days_before`
2. For hver template:
   - Finder kunder med ankomst på target dato
   - Tjekker om email allerede sendt via `email_logs`
3. Kalder `send-welcome-email` for nye

### Database
- `email_templates`
- `regular_customers` / `seasonal_customers`
- `email_logs`

---

## 27. send-email
**Type:** API | **JWT:** Nej

### Formål
Multi-provider email sending med dynamisk provider valg.

### Input
```json
{
  "to": "guest@example.com",
  "to_name": "Gæst Navn",
  "subject": "Emne",
  "html": "<p>Indhold</p>"
}
```

### Understøttede Providers
| Type | Provider |
|------|----------|
| SMTP | Gmail, Simply, custom |
| REST | Brevo, Mailgun, Resend |

### Funktionalitet
1. Henter aktiv provider fra `email_provider_config`
2. Bygger payload baseret på provider type
3. Sender via SMTP (nodemailer) eller REST (fetch)

---

## 28. send-email-brevo
**Type:** API | **JWT:** Nej

### Formål
Simpel Brevo-specifik email sender (legacy).

### Input
```json
{
  "to": "guest@example.com",
  "subject": "Emne",
  "html": "<p>Indhold</p>",
  "from_name": "Jelling Camping",
  "from_email": "noreply@jellingcamping.dk",
  "reply_to": "reception@jellingcamping.dk"
}
```

### Note
Dette er en simpel version. Brug `send-email` for multi-provider support.

---

## 29. send-low-power-warning
**Type:** API | **JWT:** Nej

### Formål
Sender advarsels-email om lav strøm til kunde.

### Input
```json
{
  "pakke_id": "uuid",
  "booking_nummer": "12345",
  "enheder_tilbage": 1.5,
  "kunde_type": "kørende"
}
```

### Funktionalitet
1. Henter kunde info
2. Henter email template (advarsel_koerende/advarsel_saeson)
3. Erstatter placeholders: `#navn#`, `#enheder_tilbage#`, etc.
4. Sender via Brevo API
5. Logger i `plugin_data` (email_log)

---

## 30. send-warning-email
**Type:** API | **JWT:** Krævet

### Formål
Behandler email-kø og sender advarsler.

### Funktionalitet
1. Henter pending emails fra `plugin_data` (email_queue)
2. For hver:
   - Henter template
   - Erstatter placeholders
   - Sender via Brevo
3. Opdaterer status til 'sent' eller 'failed'

---

## 31. send-welcome-email
**Type:** API | **JWT:** Nej

### Formål
Sender velkomst email med magic link til gæster.

### Input
```json
{
  "booking_id": 12345,
  "force_send": false
}
```

### Funktionalitet
1. Finder kunde
2. Genererer magic token hvis ikke eksisterer
3. Henter email template fra `email_templates`
4. Genererer QR kode URL
5. Erstatter placeholders med gæstedata
6. Sender via `send-email` function
7. Logger i `email_logs`

### Placeholders
`#fornavn#`, `#efternavn#`, `#ankomst#`, `#afrejse#`, `#magic_link#`, `#qr_code_url#`

---

## 32. start-cleaning-power
**Type:** CRON | **JWT:** Nej

### Formål
Tænder strøm på hytter for rengøring.

### Schedule
Dagligt kl. 10:00 dansk tid

### Funktionalitet
1. Finder alle scheduled rengørings-sessions for i dag
2. Indsætter ON kommando i `meter_commands`
3. Opdaterer status til 'active'

### Database
- `cabin_cleaning_schedule`
- `cabins`
- `meter_commands`

---

## 33. stripe-webhook
**Type:** Webhook | **JWT:** Nej

### Formål
Modtager Stripe webhook events efter betaling.

### Events
| Event | Handling |
|-------|----------|
| `checkout.session.completed` | Opretter pakke, logger betaling |
| `payment_intent.payment_failed` | Logger fejlet betaling |

### Ved gennemført betaling
1. Validerer måler tilhører kunden
2. Henter nuværende meter reading for start energy
3. Opretter pakke i `plugin_data`
4. Opdaterer `daily_package_stats`
5. Logger betaling i `plugin_data` (betalinger)
6. Låser måler til kunden
7. Nulstiller `payment_failed_attempts`

### Miljøvariabler
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

---

## 34. toggle-power
**Type:** API | **JWT:** Krævet

### Formål
Tænder/slukker strøm for en kunde.

### Input
```json
{
  "maaler_id": "F43",
  "action": "on" | "off",
  "booking_nummer": 12345
}
```

### Validering ved 'on'
**Kørende gæster:**
1. Har aktiv dagspakke
2. Dagspakke ikke udløbet på tid (`varighed_timer`)
3. Enheder tilbage

**Sæson gæster:**
1. Enheder tilbage

### Funktionalitet
Indsætter kommando i `meter_commands`:
```json
{
  "meter_id": "F43",
  "command": "set_state",
  "value": "ON" | "OFF",
  "status": "pending"
}
```

---

## 35. validate-magic-link
**Type:** API | **JWT:** Nej

### Formål
Validerer magic link og returnerer gæstedata.

### Input
```json
{
  "booking_id": 12345,
  "token": "abc123..."
}
```

### Output
```json
{
  "valid": true,
  "guest": {
    "firstName": "Peter",
    "lastName": "Hansen",
    "email": "peter@example.com",
    "language": "da",
    "arrivalDate": "2025-06-01",
    "departureDate": "2025-06-08",
    "checkedIn": true,
    "checkedOut": false,
    "bookingType": "camping",
    "guestStatus": "checked_in",
    ...
  }
}
```

### Booking Types
- `camping` - Standard camping
- `seasonal` - Sæson gæst
- `cabin` - Hytte (spot 26-42)

### Guest Status
- `upcoming` - Kommende
- `checked_in` - Indlogeret
- `departed` - Afrejst

---

## 36. webhook
**Type:** Webhook | **JWT:** Nej

### Formål
Modtager webhooks fra Sirvoy booking system.

### Input
Sirvoy booking payload med:
- bookingId, guest info, datoer
- rooms (pladsnummer)
- customFields (nummerplader)
- bookingIsCheckedIn, bookingIsCheckedOut, cancelled

### Funktionalitet

**1. Gem webhook data**
- Gemmer i `webhook_data` tabel

**2. Bestem kunde type**
- numberOfPersons = 0 → sæson
- numberOfPersons > 0 → kørende

**3. Hytte-logik**
- Identificerer hytte-bookinger via `cabins` tabel
- Ved checkout: Opretter rengørings-schedule
- Ved check-in på hytte: Tænder strøm, tilføjer hytte-enheder
- Ved flytning: Akkumulerer forbrug

**4. Checkout/Annulleret**
- Sletter kunde fra database
- Frigør måler
- Slukker strøm
- Logger checkout statistik
- Sletter pakker og nummerplader

**5. Opret/Opdater**
- Upsert til `regular_customers` eller `seasonal_customers`
- Bevarer eksisterende måler-data
- Auto-sender velkomst email hvis inden for trigger-dage

**6. Nummerplader**
- Synkroniserer med `approved_plates`

---

# CRON JOBS OVERSIGT

## Edge Function CRON Jobs (8 aktive)

| Job Navn | Schedule (UTC) | Dansk tid | Edge Function | Beskrivelse |
|----------|----------------|-----------|---------------|-------------|
| `archive-and-cleanup-hourly` | `0 * * * *` | Hver time | `archive-meter-readings` | Arkiver + slet gamle readings |
| `check-low-power-every-5min` | `*/5 * * * *` | Hvert 5. min | `check-low-power` | Send advarsler om lav strøm |
| `cleanup-expired-customers` | `0 * * * *` | Hver time | `cleanup-expired-customers` | Ryd udløbne kunder |
| `daily-accounting-report` | `59 23 * * *` | 00:59 DK | `daily-accounting-report` | Salgsrapport til bogholderi |
| `daily-package-snapshot-job` | `59 23 * * *` | 00:59 DK | `daily-package-snapshot` | Pakke-statistik snapshot |
| `end-cleaning-power-daily` | `0 14 * * *` | 15:00 DK | `end-cleaning-power` | Sluk rengørings-strøm |
| `scheduled-emails-daily` | `0 8 * * *` | 09:00 DK | `scheduled-emails` | Planlagte velkomst-emails |
| `start-cleaning-power-daily` | `0 9 * * *` | 10:00 DK | `start-cleaning-power` | Tænd rengørings-strøm |

## SQL Function CRON Jobs (5 aktive)

| Job Navn | Schedule (UTC) | Dansk tid | SQL Funktion | Beskrivelse |
|----------|----------------|-----------|--------------|-------------|
| `auto-shutoff-meters-every-5min` | `*/5 * * * *` | Hvert 5. min | `auto_shutoff_meters_without_package()` | Sluk målere uden pakke |
| `cleanup-checked-out-webhooks-weekly` | `0 3 * * 0` | Søn 04:00 DK | `cleanup_checked_out_webhooks()` | Ryd gamle webhook data |
| `cleanup-expired-customers-daily` | `0 16 * * *` | 17:00 DK | `manual.cleanup_expired_customers()` | Ryd udløbne manual kunder |
| `daily-meter-identity-snapshot` | `0 3 * * *` | 04:00 DK | `take_meter_identity_snapshot()` | Gem måler-identiteter |
| `refresh-latest-readings-every-minute` | `* * * * *` | Hvert minut | `refresh_latest_meter_readings()` | Opdater materialized view |

## Edge Functions UDEN aktiv CRON

| Edge Function | Status | Note |
|---------------|--------|------|
| `bakery-daily-summary` | ❌ Ikke opsat | Kan kaldes manuelt eller opsættes |
| `cleanup-old-readings` | ❌ Ikke opsat | Håndteres af `archive-meter-readings` |
| `monitor-power-usage` | ❌ Ikke opsat | Erstattet af SQL `auto_shutoff_meters_without_package()` |

**Total: 13 aktive CRON jobs** (8 Edge Functions + 5 SQL funktioner)

---

# MILJØVARIABLER

```env
# Supabase
SUPABASE_URL=https://jkmqliztlhmfyejhmuil.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
BREVO_API_KEY=xkeysib-...

# Sikkerhed
EDGE_SHARED_TOKEN=custom-token-for-verify-plate
```

---

# DATABASE TABELLER

## Kunder
- `regular_customers` - Kørende gæster
- `seasonal_customers` - Sæsongæster

## Strøm
- `power_meters` - Målere
- `meter_readings` - Live målinger
- `meter_readings_history` - Historik
- `meter_commands` - Kommandoer (ON/OFF)
- `booking_extra_meters` - Ekstra målere

## Pakker
- `plugin_data` (module: 'pakker')
- `plugin_data` (module: 'pakke_typer')
- `plugin_data` (module: 'betalinger')
- `daily_package_stats`

## Hytter
- `cabins`
- `cabin_cleaning_schedule`

## Email
- `email_templates`
- `email_logs`
- `email_provider_config`
- `brevo_email_events`

## Bageri
- `bakery_settings`
- `bakery_products`
- `bakery_orders`

## Events
- `camp_events`
- `external_events`
- `portal_info`

## Adgang (Bom)
- `plate_detections`
- `approved_plates`
- `gate_openings`
- `access.barrier_logs`
- `access.control_requests`
- `manual.customers`

## System
- `webhook_data`
- `user_roles`
- `admin_bypass_log`

---

# POSTGRESQL FUNKTIONER

## Strøm & Målere
| Funktion | Formål |
|----------|--------|
| `auto_create_power_meter()` | Opretter automatisk måler ved første reading |
| `auto_shutoff_meters_without_package()` | Slukker målere uden aktiv pakke (CRON) |
| `check_meter_power_allowed()` | Tjekker om strøm må tændes |
| `insert_meter_reading()` | Indsætter meter reading |
| `refresh_latest_meter_readings()` | Opdaterer materialized view (CRON) |
| `get_latest_meter_readings()` | Henter seneste readings |
| `get_total_power_consumption()` | Beregner total forbrug |

## Måler Identitet & Navne
| Funktion | Formål |
|----------|--------|
| `auto_restore_meter_name()` | Genopretter målernavne automatisk |
| `protect_friendly_name()` | Beskytter friendly_name mod overskrivning |
| `take_meter_identity_snapshot()` | Gemmer dagligt snapshot af måler-navne (CRON) |
| `restore_meter_names_from_snapshot()` | Gendan navne fra snapshot |
| `get_available_restore_dates()` | Liste over tilgængelige restore-datoer |
| `preview_restore_from_snapshot()` | Forhåndsvis restore |
| `handle_meter_replacement()` | Håndterer måler-udskiftning |

## Kunder & Nummerplader
| Funktion | Formål |
|----------|--------|
| `cleanup_expired_customers()` | Ryder udløbne kunder (CRON) |
| `free_meter_on_customer_delete()` | Frigør måler når kunde slettes |
| `sync_regular_customer_plates()` | Synk nummerplader for regular |
| `sync_seasonal_customer_plates()` | Synk nummerplader for seasonal |
| `cleanup_regular_customer_plates()` | Ryd gamle nummerplader |
| `cleanup_seasonal_customer_plates()` | Ryd gamle nummerplader |
| `cleanup_license_plates()` | Generel plade-oprydning |
| `save_email_on_checkin()` | Gem email ved check-in |

## Pakker & Statistik
| Funktion | Formål |
|----------|--------|
| `increment_package_stats()` | Opdaterer daglig pakke-statistik |

## System & Brugerroller
| Funktion | Formål |
|----------|--------|
| `get_user_role()` | Henter brugerrolle |
| `get_user_permissions()` | Henter bruger-permissions |
| `is_staff_or_admin()` | Tjekker staff/admin rolle |
| `user_has_permission()` | Tjekker specifik permission |
| `get_user_last_login()` | Henter sidste login |

## Email
| Funktion | Formål |
|----------|--------|
| `ensure_single_active_email_provider()` | Sikrer kun én aktiv provider |
| `update_email_provider_timestamp()` | Opdaterer timestamp ved ændring |

## Cleanup
| Funktion | Formål |
|----------|--------|
| `cleanup_checked_out_webhooks()` | Ryder gamle webhook data (CRON) |
| `cleanup_old_forbrug_historik()` | Ryder gammel forbrugshistorik |
| `manual.cleanup_expired_customers()` | Ryder manual kunder (CRON) |
| `manual.sync_to_approved_plates()` | Synk manual → approved_plates |

---

# DATABASE TRIGGERS

## Kunde Triggers
| Trigger | Tabel | Event | Funktion |
|---------|-------|-------|----------|
| `free_meter_on_regular_delete` | `regular_customers` | DELETE | Frigør måler |
| `free_meter_on_seasonal_delete` | `seasonal_customers` | DELETE | Frigør måler |
| `sync_regular_plates_on_insert` | `regular_customers` | INSERT | Synk nummerplader |
| `sync_regular_plates_on_update` | `regular_customers` | UPDATE | Synk nummerplader |
| `sync_seasonal_plates_on_insert` | `seasonal_customers` | INSERT | Synk nummerplader |
| `sync_seasonal_plates_on_update` | `seasonal_customers` | UPDATE | Synk nummerplader |
| `regular_customers_checkin_email` | `regular_customers` | INSERT/UPDATE | Gem email |
| `seasonal_customers_checkin_email` | `seasonal_customers` | INSERT/UPDATE | Gem email |

## Måler Triggers
| Trigger | Tabel | Event | Funktion |
|---------|-------|-------|----------|
| `auto_create_meter_trigger` | `meter_readings` | INSERT | Auto-opret måler |
| `auto_restore_meter_name_trigger` | `meter_identity` | INSERT/UPDATE | Gendan navn |
| `handle_meter_replacement_trigger` | `meter_identity` | INSERT | Håndter udskiftning |
| `protect_meter_friendly_name` | `meter_identity` | UPDATE | Beskyt navn |
| `meter_identity_set_updated_at` | `meter_identity` | UPDATE | Opdater timestamp |

## Email Triggers
| Trigger | Tabel | Event | Funktion |
|---------|-------|-------|----------|
| `trg_single_active_email_provider` | `email_provider_config` | INSERT/UPDATE | Sikr én aktiv |
| `trg_email_provider_updated` | `email_provider_config` | UPDATE | Opdater timestamp |

## Andre Triggers
| Trigger | Tabel | Event | Funktion |
|---------|-------|-------|----------|
| `update_approved_plates_updated_at` | `approved_plates` | UPDATE | Opdater timestamp |
| `update_organizations_updated_at` | `organizations` | UPDATE | Opdater timestamp |
| `update_plugin_data_updated_at` | `plugin_data` | UPDATE | Opdater timestamp |

---

# EKSTERNE SYSTEMER

## Node-RED (192.168.9.61)
| Flow | Formål |
|------|--------|
| **MQTT → Supabase** | Modtager meter readings fra MQTT og indsætter i Supabase |
| **meter_commands handler** | Henter pending commands fra Supabase, sender til MQTT |
| **Meter state sync** | Synkroniserer ON/OFF state mellem MQTT og database |
| **Zigbee rename** | Håndterer rename-kommandoer til Zigbee2MQTT |

## Zigbee2MQTT (192.168.9.61:8082)
| Funktion | Formål |
|----------|--------|
| **Device management** | Administrerer 300+ strømmålere |
| **Firmware** | OpenBeken på BK7231N enheder |
| **Topics** | `zigbee2mqtt/{meter_id}/state`, `/energy`, etc. |

## MQTT Broker (192.168.9.61:1890)
| Emne | Værdi |
|------|-------|
| **Broker** | Mosquitto |
| **Port** | 1890 (ekstern), 1883 (intern Docker) |
| **Bruger** | homeassistant / 7200Grindsted! |

## Axis Kamera & Bom
| Komponent | IP/URL |
|-----------|--------|
| **ANPR Kamera** | Sender til `axis-anpr-webhook` |
| **Bom Controller** | 152.115.191.134:65471 |
| **I/O Control** | `/axis-cgi/io/port.cgi?action=2%3A%2F` (ON) |

## Stripe
| Emne | Værdi |
|------|-------|
| **Checkout** | `create-checkout` Edge Function |
| **Webhook** | `stripe-webhook` Edge Function |
| **Events** | `checkout.session.completed`, `payment_intent.payment_failed` |

## Brevo (Email)
| Emne | Værdi |
|------|-------|
| **API** | Transactional emails via REST |
| **Webhook** | `brevo-webhook` for tracking |
| **Events** | delivered, opened, clicked, bounce |

## Sirvoy (Booking)
| Emne | Værdi |
|------|-------|
| **Webhook** | `webhook` Edge Function |
| **Events** | Booking create, update, check-in, check-out, cancel |

---

# SYSTEMDIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EKSTERNE SYSTEMER                           │
├─────────────────────────────────────────────────────────────────────┤
│  Sirvoy ─────────► webhook ─────────► Supabase (customers)          │
│  Stripe ─────────► stripe-webhook ──► Supabase (pakker)             │
│  Brevo ──────────► brevo-webhook ───► Supabase (email_events)       │
│  Axis ANPR ──────► axis-anpr-webhook ► Bom Controller               │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SUPABASE                                    │
├─────────────────────────────────────────────────────────────────────┤
│  36 Edge Functions    │    PostgreSQL Functions    │    Triggers    │
│  13 CRON Jobs         │    Materialized Views      │    RLS         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NODE-RED (192.168.9.61)                        │
├─────────────────────────────────────────────────────────────────────┤
│  meter_commands ◄───► MQTT Broker ◄───► Zigbee2MQTT ◄───► Målere   │
│  meter_readings ◄────────────────────────────────────────────────── │
└─────────────────────────────────────────────────────────────────────┘
```

---

*Dokumentation opdateret: 14. december 2025*
*Supabase Projekt: jkmqliztlhmfyejhmuil*
*Antal Edge Functions: 36 (verificeret mod Supabase)*
*Antal CRON Jobs: 13 (8 Edge + 5 SQL)*
*Antal PostgreSQL Funktioner: ~30 custom*
*Antal Database Triggers: 18*
