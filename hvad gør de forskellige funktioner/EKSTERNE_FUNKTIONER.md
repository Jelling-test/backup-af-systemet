# EKSTERNE FUNKTIONER
## Jelling Camping Strømstyringssystem
### Opdateret: 14. december 2025

Dette dokument beskriver alle funktioner der kører **uden for** selve applikationskoden - altså planlagte jobs, backups, og eksterne services.

---

# 📍 OVERSIGT

| Placering | Antal | Formål |
|-----------|-------|--------|
| Synology NAS | 1 job | Zigbee backup til Dropbox |
| Supabase Cron | 13 jobs | Automatisering + vedligeholdelse |
| Dropbox Cloud Sync | 1 sync | Offsite backup storage |

---

# 🖥️ SYNOLOGY NAS

## Zigbee Backup Job

**Placering:** Kontrolpanel → Opgaveplanlægning  
**Navn:** `zigbee backup`  
**Schedule:** Dagligt kl. 02:00  
**Script:** `/volume1/docker/jelling-power-system/backup-pairing.sh`

### Hvad den gør:
1. Kopierer config filer fra alle 7 Z2M instanser
2. Kopierer `.env` og `docker-compose.yml`
3. Pakker alt til `zigbee-pairing-YYYY-MM-DD.tar.gz`
4. Gemmer i `/volume1/docker/backup-dropbox/jelling-zigbee-backup/`
5. Sletter backups ældre end 30 dage

### Filer der backupes per Z2M instans:
| Fil | Indhold |
|-----|---------|
| `configuration.yaml` | IEEE→Navn mapping, network key, MQTT config |
| `database.db` | Zigbee device pairing database |
| `coordinator_backup.json` | Coordinator state backup |
| `state.json` | Sidste kendte device states |

### Z2M Instanser:
| Container | Web UI Port | Område |
|-----------|-------------|--------|
| `zigbee2mqtt` | 8082 | Område 100 (hoved) |
| `zigbee2mqtt_area2` | 8083 | Område 2 |
| `zigbee2mqtt_area3` | 8084 | Område 3 |
| `zigbee2mqtt_area4` | 8085 | Område 4 |
| `zigbee2mqtt_area5` | 8086 | Område 5 |
| `zigbee2mqtt_area6` | 8087 | Område 6 |
| `zigbee2mqtt_3p` | 8088 | 3-fase målere |

### Adgang til Task Scheduler:
```
Synology DSM → Kontrolpanel → Opgaveplanlægning
```

### Manuel kørsel:
```bash
ssh admin@192.168.9.61
sudo /volume1/docker/jelling-power-system/backup-pairing.sh
```

---

# ☁️ DROPBOX CLOUD SYNC

**Placering:** Synology → Cloud Sync  
**Forbindelse:** Dropbox konto  
**Lokal mappe:** `/volume1/docker/backup-dropbox/`  
**Sync retning:** Upload only (NAS → Dropbox)

### Formål:
- Offsite backup af Zigbee configs
- Tilgængelig fra enhver enhed med Dropbox
- Beskyttelse mod NAS hardware-fejl

### Backup lokation i Dropbox:
```
Dropbox/jelling-zigbee-backup/
├── zigbee-pairing-2025-12-14.tar.gz
├── zigbee-pairing-2025-12-13.tar.gz
├── zigbee-pairing-2025-12-12.tar.gz
└── ... (30 dages historik)
```

---

# ⏰ SUPABASE CRON JOBS

**Projekt:** `jkmqliztlhmfyejhmuil`  
**Tidzone:** UTC (dansk tid = UTC+1 vinter, UTC+2 sommer)

## Hvert Minut

### refresh-latest-readings-every-minute
| | |
|---|---|
| **Schedule** | `* * * * *` (hvert minut) |
| **Type** | Database Function |
| **Funktion** | `refresh_latest_readings_view()` |
| **Formål** | Opdaterer materialized view med seneste måleraflæsninger |

---

## Hvert 5. Minut

### auto-shutoff-meters-every-5min
| | |
|---|---|
| **Schedule** | `*/5 * * * *` |
| **Type** | Database Function |
| **Funktion** | `auto_shutoff_expired_meters()` |
| **Formål** | Slukker målere for udløbne kunder automatisk |

### check-low-power-every-5min
| | |
|---|---|
| **Schedule** | `*/5 * * * *` |
| **Type** | Edge Function |
| **Kalder** | `check-low-power` |
| **Formål** | Tjekker for målere med lavt forbrug (mulig fejl) |

---

## Hver Time

### archive-and-cleanup-hourly
| | |
|---|---|
| **Schedule** | `0 * * * *` (hver time, minut 0) |
| **Type** | Edge Function |
| **Kalder** | `archive-meter-readings` |
| **Formål** | Arkiverer daglige snapshots + sletter readings ældre end 1 time |

### cleanup-expired-customers
| | |
|---|---|
| **Schedule** | `0 * * * *` |
| **Type** | Edge Function |
| **Kalder** | `cleanup-expired-customers` |
| **Formål** | Rydder op i udløbne kundedata |

---

## Daglige Jobs

### daily-meter-identity-snapshot (kl. 03:00 UTC = 04:00 DK)
| | |
|---|---|
| **Schedule** | `0 3 * * *` |
| **Type** | Database Function |
| **Funktion** | `take_meter_identity_snapshot()` |
| **Formål** | Gemmer dagligt snapshot af IEEE→Navn mappings til `meter_identity_snapshots` |
| **Retention** | 7 dage |

### scheduled-emails-daily (kl. 08:00 UTC = 09:00 DK)
| | |
|---|---|
| **Schedule** | `0 8 * * *` |
| **Type** | Edge Function |
| **Kalder** | `scheduled-emails` |
| **Formål** | Sender planlagte emails (velkomst, påmindelser) |

### start-cleaning-power-daily (kl. 09:00 UTC = 10:00 DK)
| | |
|---|---|
| **Schedule** | `0 9 * * *` |
| **Type** | Edge Function |
| **Kalder** | `start-cleaning-power` |
| **Formål** | Tænder strøm på hytter til rengøring |

### end-cleaning-power-daily (kl. 14:00 UTC = 15:00 DK)
| | |
|---|---|
| **Schedule** | `0 14 * * *` |
| **Type** | Edge Function |
| **Kalder** | `end-cleaning-power` |
| **Formål** | Slukker rengørings-strøm på hytter |

### cleanup-expired-customers-daily (kl. 16:00 UTC = 17:00 DK)
| | |
|---|---|
| **Schedule** | `0 16 * * *` |
| **Type** | Database Function |
| **Funktion** | `manual.cleanup_expired_customers()` |
| **Formål** | Ekstra daglig oprydning af udløbne kunder |

### daily-package-snapshot-job (kl. 23:59 UTC = 00:59 DK)
| | |
|---|---|
| **Schedule** | `59 23 * * *` |
| **Type** | Edge Function |
| **Kalder** | `daily-package-snapshot` |
| **Formål** | Gemmer dagligt snapshot af pakke-salg |

### daily-accounting-report (kl. 23:59 UTC = 00:59 DK)
| | |
|---|---|
| **Schedule** | `59 23 * * *` |
| **Type** | Edge Function |
| **Kalder** | `daily-accounting-report` |
| **Formål** | Genererer daglig regnskabsrapport |

---

## Ugentlige Jobs

### cleanup-checked-out-webhooks-weekly (Søndag kl. 03:00 UTC)
| | |
|---|---|
| **Schedule** | `0 3 * * 0` |
| **Type** | Database Function |
| **Funktion** | `cleanup_checked_out_webhooks()` |
| **Formål** | Rydder gamle webhook-data fra udcheckede bookinger |

---

# 🔧 ADMINISTRATION

## Se alle cron jobs (SQL)
```sql
SELECT jobname, schedule, active 
FROM cron.job 
ORDER BY jobname;
```

## Pause et job
```sql
UPDATE cron.job SET active = false WHERE jobname = 'job-navn';
```

## Genaktiver et job
```sql
UPDATE cron.job SET active = true WHERE jobname = 'job-navn';
```

## Se job historik
```sql
SELECT * FROM cron.job_run_details 
WHERE job_name = 'archive-and-cleanup-hourly'
ORDER BY start_time DESC 
LIMIT 10;
```

---

# 🔄 RESTORE PROCEDURES

## Restore Zigbee configs fra Dropbox

1. Download seneste backup fra Dropbox
2. Udpak: `tar -xzf zigbee-pairing-YYYY-MM-DD.tar.gz`
3. Stop Z2M: `docker-compose stop zigbee2mqtt`
4. Kopier filer til `/volume1/docker/jelling-power-system/zigbee2mqtt/data/`
5. Start Z2M: `docker-compose start zigbee2mqtt`

## Restore IEEE→Navn fra Supabase

```sql
-- Hent alle mappings
SELECT ieee_address, meter_number, base_topic 
FROM meter_identity 
WHERE meter_number NOT LIKE '0x%'
ORDER BY base_topic, meter_number;
```

Rename i Z2M via MQTT:
```bash
mosquitto_pub -h 192.168.9.61 -p 1890 \
  -u homeassistant -P "7200Grindsted!" \
  -t "zigbee2mqtt/bridge/request/device/rename" \
  -m '{"from": "0xbc8d7efffe14c42b", "to": "100"}'
```

---

# 📊 TIDSLINJE - HVAD KØRER HVORNÅR (Dansk tid)

| Tid | Job |
|-----|-----|
| **Hvert minut** | refresh-latest-readings |
| **Hvert 5. min** | auto-shutoff + check-low-power |
| **Hver time :00** | archive-cleanup + cleanup-expired |
| **02:00** | Synology: Zigbee backup → Dropbox |
| **04:00** | meter-identity-snapshot |
| **09:00** | scheduled-emails |
| **10:00** | start-cleaning-power |
| **15:00** | end-cleaning-power |
| **17:00** | cleanup-expired-customers (daily) |
| **00:59** | daily-package-snapshot + accounting-report |
| **Søndag 04:00** | cleanup-checked-out-webhooks |
