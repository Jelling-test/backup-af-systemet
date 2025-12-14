# CRON JOBS - SUPABASE KONFIGURATION
## Jelling Camping Strømstyringssystem
### Genereret: 14. december 2025

---

## AKTIVE CRON JOBS

### 1. check-low-power
**Beskrivelse:** Tjekker alle aktive pakker og sender advarsler ved lav strøm

**Schedule:** `*/30 * * * *` (hver 30. minut)

**Alternativt:** `0 */2 * * *` (hver 2. time)

```toml
[functions.check-low-power]
schedule = "*/30 * * * *"
```

---

### 2. daily-accounting-report
**Beskrivelse:** Sender daglig salgsrapport til bogholderi@jellingcamping.dk

**Schedule:** `0 6 * * *` (kl. 06:00 UTC = 07:00 dansk tid)

```toml
[functions.daily-accounting-report]
schedule = "0 6 * * *"
```

---

### 3. daily-package-snapshot
**Beskrivelse:** Gemmer dagligt snapshot af alle pakkers forbrug til statistik

**Schedule:** `0 23 * * *` (kl. 23:00 UTC = 00:00 dansk tid)

```toml
[functions.daily-package-snapshot]
schedule = "0 23 * * *"
```

---

### 4. monitor-power-usage
**Beskrivelse:** Overvåger forbrug og slukker målere ved overforbrug/udløb

**Schedule:** `*/5 * * * *` (hver 5. minut)

```toml
[functions.monitor-power-usage]
schedule = "*/5 * * * *"
```

---

### 5. start-cleaning-power
**Beskrivelse:** Tænder strøm på hytter med checkout i dag for rengøring

**Schedule:** `0 9 * * *` (kl. 09:00 UTC = 10:00 dansk tid)

```toml
[functions.start-cleaning-power]
schedule = "0 9 * * *"
```

---

### 6. end-cleaning-power
**Beskrivelse:** Slukker strøm på hytter efter rengøring

**Schedule:** `0 14 * * *` (kl. 14:00 UTC = 15:00 dansk tid)

```toml
[functions.end-cleaning-power]
schedule = "0 14 * * *"
```

---

### 7. archive-meter-readings
**Beskrivelse:** Arkiverer daglige snapshots + sletter gamle readings

**Schedule:** `0 * * * *` (hver time)

**Funktionalitet:**
- Kl. 23:00 DK: Arkiverer snapshot til `meter_readings_history`
- Altid: Sletter readings ældre end 1 time

```toml
[functions.archive-meter-readings]
schedule = "0 * * * *"
```

---

### 8. cleanup-expired-customers
**Beskrivelse:** Rydder op i kunder med udløbet departure_date

**Schedule:** `0 3 * * *` (kl. 03:00 UTC = 04:00 dansk tid)

```toml
[functions.cleanup-expired-customers]
schedule = "0 3 * * *"
```

---

### 9. cleanup-old-readings
**Beskrivelse:** Sletter meter readings ældre end 48 timer

**Schedule:** `0 4 * * *` (kl. 04:00 UTC = 05:00 dansk tid)

```toml
[functions.cleanup-old-readings]
schedule = "0 4 * * *"
```

---

### 10. bakery-daily-summary
**Beskrivelse:** Sender daglig bageri oversigt med bage-liste til reception

**Schedule:** `0 18 * * *` (kl. 18:00 UTC = 19:00 dansk tid)

**Email til:** reception@jellingcamping.dk

```toml
[functions.bakery-daily-summary]
schedule = "0 18 * * *"
```

---

### 11. scheduled-emails (IKKE AKTIVERET)
**Beskrivelse:** Sender planlagte emails baseret på triggers

**Status:** Køres KUN manuelt - ikke sat op som cron endnu

**Potentiel schedule:** `0 8 * * *` (kl. 08:00 UTC = 09:00 dansk tid)

```toml
# UDKOMMENTERET - aktivér når klar
# [functions.scheduled-emails]
# schedule = "0 8 * * *"
```

---

## KOMPLET SUPABASE CONFIG.TOML

```toml
# ===========================================
# CRON JOBS - Jelling Camping Strømsystem
# ===========================================

# Tjek lav strøm og send advarsler (hver 30 min)
[functions.check-low-power]
schedule = "*/30 * * * *"

# Daglig salgsrapport til bogholderi (kl. 07:00 DK)
[functions.daily-accounting-report]
schedule = "0 6 * * *"

# Dagligt pakke-snapshot til statistik (kl. 00:00 DK)
[functions.daily-package-snapshot]
schedule = "0 23 * * *"

# Overvåg forbrug og sluk ved overforbrug (hver 5 min)
[functions.monitor-power-usage]
schedule = "*/5 * * * *"

# Tænd rengørings-strøm på hytter (kl. 10:00 DK)
[functions.start-cleaning-power]
schedule = "0 9 * * *"

# Sluk rengørings-strøm på hytter (kl. 15:00 DK)
[functions.end-cleaning-power]
schedule = "0 14 * * *"

# Arkiver snapshots + slet gamle readings (hver time)
[functions.archive-meter-readings]
schedule = "0 * * * *"

# Ryd udløbne kunder (kl. 04:00 DK)
[functions.cleanup-expired-customers]
schedule = "0 3 * * *"

# Slet gamle readings > 48 timer (kl. 05:00 DK)
[functions.cleanup-old-readings]
schedule = "0 4 * * *"

# Daglig bageri oversigt (kl. 19:00 DK)
[functions.bakery-daily-summary]
schedule = "0 18 * * *"
```

---

## CRON SYNTAX REFERENCE

```
* * * * *
│ │ │ │ │
│ │ │ │ └── Ugedag (0-7, 0 og 7 = søndag)
│ │ │ └──── Måned (1-12)
│ │ └────── Dag i måneden (1-31)
│ └──────── Time (0-23) - UTC!
└────────── Minut (0-59)
```

**Eksempler:**
- `*/5 * * * *` = Hver 5. minut
- `0 * * * *` = Hver time, ved minut 0
- `0 6 * * *` = Dagligt kl. 06:00 UTC
- `0 9 * * 1-5` = Hverdage kl. 09:00 UTC

---

## VIGTIGT: TIDSZONE

**Supabase cron kører i UTC!**

| Dansk tid | UTC |
|-----------|-----|
| 07:00 DK | 06:00 UTC |
| 10:00 DK | 09:00 UTC |
| 15:00 DK | 14:00 UTC |
| 00:00 DK | 23:00 UTC (dagen før) |

*Husk sommertid/vintertid - justér om nødvendigt*

---

## OPSÆTNING I SUPABASE DASHBOARD

1. Gå til **Database** → **Extensions** → Aktivér `pg_cron`
2. Gå til **Edge Functions** → Vælg funktion
3. Under **Schedules** → Tilføj cron expression
4. Eller brug SQL:

```sql
SELECT cron.schedule(
  'check-low-power-job',
  '*/30 * * * *',
  $$SELECT net.http_post(
    url := 'https://jkmqliztlhmfyejhmuil.supabase.co/functions/v1/check-low-power',
    headers := '{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb
  )$$
);
```

---

## OVERVÅGNING

**Se aktive jobs:**
```sql
SELECT * FROM cron.job;
```

**Se job historik:**
```sql
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 50;
```

**Stop et job:**
```sql
SELECT cron.unschedule('job-name');
```

---

*Dokumentation genereret automatisk - 14. december 2025*
