# NAS FUNKTIONER - DOCKER SERVICES
## Jelling Camping Strømstyringssystem
### Opdateret: 14. december 2025

Dette dokument beskriver alle Docker services der kører på NAS'en (192.168.9.61).

**Kildekode backup:** `C:\Users\peter\OneDrive\Skrivebord\12.12.2024\flytning af system\kopi af nas 14.12\jelling-power-system`

---

# 📊 OVERSIGT

| Container | Formål | Port | Kritisk |
|-----------|--------|------|---------|
| `mosquitto` | MQTT Broker | 1890 | ✅ JA |
| `zigbee2mqtt` | Zigbee controller (Område 100) | 8082 | ✅ JA |
| `zigbee2mqtt_area2` | Zigbee controller (Hytter/500) | 8083 | ✅ JA |
| `zigbee2mqtt_area3` | Zigbee controller (Område 200) | 8084 | ✅ JA |
| `zigbee2mqtt_area4` | Zigbee controller (Område 400) | 8085 | ✅ JA |
| `zigbee2mqtt_area5` | Zigbee controller (Område 300) | 8086 | ✅ JA |
| `zigbee2mqtt_area6` | Zigbee controller (Område 6) | 8087 | ⚠️ Fremtidig |
| `zigbee2mqtt_3p` | Zigbee controller (3-fase) | 8088 | ✅ JA |
| `device-sync` | Synk devices → Supabase | - | ✅ JA |
| `mqtt-command-processor` | Kommandoer fra Supabase | - | ✅ JA |
| `telegraf` | Målerdata → Supabase | - | ✅ JA |
| `mqtt-config-service` | Pairing API | 3001 | ⚠️ Opsætning |
| `power-monitor-backend` | IoT Monitor API + WebSocket | 3010, 8090 | ⚠️ Test/Debug |
| `power-monitor-frontend` | IoT Monitor Web UI | 3002 | ⚠️ Test/Debug |
| `homeassistant` | Langtidsstatistik | 8124 | ⚠️ Valgfri |

**Start rækkefølge:** mosquitto → zigbee2mqtt* → device-sync + command-processor + telegraf → resten

---

# 🔌 NIVEAU 1: INFRASTRUKTUR

## mosquitto (MQTT Broker)

### Hvad gør den?
Central message broker for al MQTT kommunikation. Alle services kommunikerer gennem denne.

### Hvor kører den?
```
Container: mosquitto
Image: eclipse-mosquitto:2
Port: 192.168.9.61:1890 → 1883 (intern)
Data: ./mosquitto/config, ./mosquitto/data, ./mosquitto/log
```

### Afhængigheder
- **Ingen** - dette er den første service der starter

### Hvem afhænger af den?
- ALLE andre services
- Zigbee2MQTT instanser
- device-sync
- command-processor
- telegraf
- Home Assistant

### Genetablering
```bash
cd /volume1/docker/jelling-power-system
docker-compose up -d mosquitto
```

### Fejlsøgning
```bash
# Tjek status
docker logs mosquitto --tail 50

# Tjek om porten er åben
telnet 192.168.9.61 1890

# Test forbindelse
mosquitto_pub -h 192.168.9.61 -p 1890 \
  -u homeassistant -P "7200Grindsted!" \
  -t "test/topic" -m "hello"

# Se alle beskeder (debug)
mosquitto_sub -h 192.168.9.61 -p 1890 \
  -u homeassistant -P "7200Grindsted!" \
  -t "#" -v
```

---

# 📡 NIVEAU 2: ZIGBEE CONTROLLERS

## zigbee2mqtt (Område 100 - Hoved)

### Hvad gør den?
Oversætter Zigbee protokol til MQTT. Styrer alle målere i område 100 (100-serien).

### Hvor kører den?
```
Container: zigbee2mqtt
Image: koenkk/zigbee2mqtt:latest
Web UI: http://192.168.9.61:8082
MQTT Topic: zigbee2mqtt/#
Data: ./zigbee2mqtt/data/
Coordinator: tcp://192.168.0.254:6638
```

### Afhængigheder
- `mosquitto` - MQTT broker
- Zigbee coordinator hardware (192.168.0.254:6638)
- Network key i `configuration.yaml`

### Genetablering
```bash
# 1. Start container
docker-compose up -d zigbee2mqtt

# 2. Tjek logs
docker logs zigbee2mqtt --tail 100

# 3. Åbn Web UI for at verificere
# http://192.168.9.61:8082
```

### Fejlsøgning
```bash
# Logs
docker logs zigbee2mqtt -f

# Restart
docker restart zigbee2mqtt

# Tjek coordinator forbindelse
docker exec zigbee2mqtt cat /app/data/state.json | jq .coordinator

# Force re-interview af en enhed
# I Web UI: Devices → [enhed] → Reconfigure
```

### Kritiske filer
| Fil | Indhold |
|-----|---------|
| `configuration.yaml` | Network key, MQTT config, IEEE→Navn mapping |
| `database.db` | Device pairing database |
| `coordinator_backup.json` | Coordinator state |

---

## zigbee2mqtt_area2 (Hytter og 500 området)

### Hvad gør den?
Oversætter Zigbee protokol til MQTT. Styrer alle målere i hytteområdet og 500-serien.

### Hvor kører den?
```
Container: zigbee2mqtt_area2
Image: koenkk/zigbee2mqtt:latest
Web UI: http://192.168.9.61:8083
MQTT Topic: zigbee2mqtt_area2/#
Data: ./zigbee2mqtt_area2/data/
Coordinator: tcp://192.168.1.35:6638
```

### Afhængigheder
- `mosquitto` - MQTT broker
- Zigbee coordinator hardware (192.168.1.35:6638)
- Network key i `configuration.yaml`

### Genetablering
```bash
docker-compose up -d zigbee2mqtt_area2
```

### Fejlsøgning
```bash
# Logs
docker logs zigbee2mqtt_area2 -f

# Restart
docker restart zigbee2mqtt_area2

# Web UI
# http://192.168.9.61:8083
```

---

## zigbee2mqtt_area3 (Område 200)

### Hvad gør den?
Oversætter Zigbee protokol til MQTT. Styrer alle målere i område 200 (200-serien).

### Hvor kører den?
```
Container: zigbee2mqtt_area3
Image: koenkk/zigbee2mqtt:latest
Web UI: http://192.168.9.61:8084
MQTT Topic: zigbee2mqtt_area3/#
Data: ./zigbee2mqtt_area3/data/
Coordinator: tcp://192.168.1.36:6638
```

### Afhængigheder
- `mosquitto` - MQTT broker
- Zigbee coordinator hardware (192.168.1.36:6638)
- Network key i `configuration.yaml`

### Genetablering
```bash
docker-compose up -d zigbee2mqtt_area3
```

### Fejlsøgning
```bash
# Logs
docker logs zigbee2mqtt_area3 -f

# Restart
docker restart zigbee2mqtt_area3

# Web UI
# http://192.168.9.61:8084
```

---

## zigbee2mqtt_3p (3-fase målere)

### Hvad gør den?
Oversætter Zigbee protokol til MQTT. Styrer 3-fase målere (typisk større forbrugere).

### Hvor kører den?
```
Container: zigbee2mqtt_3p
Image: koenkk/zigbee2mqtt:latest
Web UI: http://192.168.9.61:8088
MQTT Topic: zigbee2mqtt_3p/#
Data: ./zigbee2mqtt_3p/data/
Coordinator: Separat 3-fase coordinator
```

### Afhængigheder
- `mosquitto` - MQTT broker
- Zigbee coordinator hardware
- Network key i `configuration.yaml`

### Genetablering
```bash
docker-compose up -d zigbee2mqtt_3p
```

### Fejlsøgning
```bash
# Logs
docker logs zigbee2mqtt_3p -f

# Restart
docker restart zigbee2mqtt_3p

# Web UI
# http://192.168.9.61:8088
```

---

## zigbee2mqtt_area4 (Område 400)

### Hvad gør den?
Oversætter Zigbee protokol til MQTT. Styrer alle målere i område 400 (400-serien).

### Hvor kører den?
```
Container: zigbee2mqtt_area4
Image: koenkk/zigbee2mqtt:latest
Web UI: http://192.168.9.61:8085
MQTT Topic: zigbee2mqtt_area4/#
Data: ./zigbee2mqtt_area4/data/
Coordinator: tcp://192.168.1.37:6638
```

### Afhængigheder
- `mosquitto` - MQTT broker
- Zigbee coordinator hardware (192.168.1.37:6638)
- Network key i `configuration.yaml`

### Genetablering
```bash
docker-compose up -d zigbee2mqtt_area4
```

### Fejlsøgning
```bash
# Logs
docker logs zigbee2mqtt_area4 -f

# Restart
docker restart zigbee2mqtt_area4

# Web UI
# http://192.168.9.61:8085
```

---

## zigbee2mqtt_area5 (Område 300)

### Hvad gør den?
Oversætter Zigbee protokol til MQTT. Styrer alle målere i område 300 (300-serien).

### Hvor kører den?
```
Container: zigbee2mqtt_area5
Image: koenkk/zigbee2mqtt:latest
Web UI: http://192.168.9.61:8086
MQTT Topic: zigbee2mqtt_area5/#
Data: ./zigbee2mqtt_area5/data/
Coordinator: tcp://192.168.1.38:6638
```

### Afhængigheder
- `mosquitto` - MQTT broker
- Zigbee coordinator hardware (192.168.1.38:6638)
- Network key i `configuration.yaml`

### Genetablering
```bash
docker-compose up -d zigbee2mqtt_area5
```

### Fejlsøgning
```bash
# Logs
docker logs zigbee2mqtt_area5 -f

# Restart
docker restart zigbee2mqtt_area5

# Web UI
# http://192.168.9.61:8086
```

---

## zigbee2mqtt_area6 (Område 6) - FREMTIDIG

### Hvad gør den?
Oversætter Zigbee protokol til MQTT. Styrer alle målere i område 6.

### Hvor kører den?
```
Container: zigbee2mqtt_area6
Image: koenkk/zigbee2mqtt:latest
Web UI: http://192.168.9.61:8087
MQTT Topic: zigbee2mqtt_area6/#
Data: ./zigbee2mqtt_area6/data/
Coordinator: tcp://192.168.1.39:6638
Status: ⚠️ IKKE AKTIV - mangler antenne
Profile: future (starter IKKE automatisk)
```

### Afhængigheder
- `mosquitto` - MQTT broker
- Zigbee coordinator hardware (192.168.1.39:6638) - IKKE INSTALLERET
- Network key i `configuration.yaml`

### Genetablering
```bash
docker-compose --profile future up -d zigbee2mqtt_area6
```

### Fejlsøgning
```bash
docker logs zigbee2mqtt_area6 -f
```

---

# 🔄 NIVEAU 3: DATA SERVICES

## device-sync

### Hvad gør den?
1. Lytter på MQTT beskeder fra alle Z2M instanser
2. Synkroniserer device info til Supabase (`power_meters`, `meter_identity`)
3. Opdaterer `is_online` status baseret på availability
4. **Power Security:** Tjekker om måler må være tændt, slukker uautoriserede

### Hvor kører den?
```
Container: device-sync
Build: ./device-sync/Dockerfile
Kode: device_sync.py (v2.3)
Env: .env fil (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, MQTT_*)
```

### Afhængigheder
- `mosquitto` - MQTT broker
- Supabase database (internet forbindelse)
- `.env` fil med credentials

### Database tabeller den skriver til
- `power_meters` - meter_number, mqtt_topic, is_online, is_available
- `meter_identity` - ieee_address, meter_number, base_topic
- `unauthorized_power_attempts` - logs af uautoriserede tænd-forsøg

### Genetablering
```bash
# 1. Sørg for .env fil findes med:
#    SUPABASE_URL=https://jkmqliztlhmfyejhmuil.supabase.co
#    SUPABASE_SERVICE_ROLE_KEY=eyJ...
#    MQTT_HOST=mosquitto
#    MQTT_PORT=1883
#    MQTT_USER=homeassistant
#    MQTT_PASSWORD=7200Grindsted!

# 2. Build og start
docker-compose build device-sync
docker-compose up -d device-sync
```

### Fejlsøgning
```bash
# Se logs (vigtigst!)
docker logs device-sync -f --tail 100

# Tjek MQTT forbindelse
docker logs device-sync 2>&1 | grep -i "mqtt\|connect"

# Tjek Supabase forbindelse
docker logs device-sync 2>&1 | grep -i "supabase\|error"

# Restart
docker restart device-sync

# Tjek om is_online opdateres
# I Supabase: SELECT meter_number, is_online, updated_at FROM power_meters ORDER BY updated_at DESC LIMIT 10;
```

### Kendt adfærd
- Logger "Health check" hvert 5. minut
- Ved MQTT disconnect: auto-reconnect med exponential backoff (1-30 sek)
- Power Security kan slås fra: `ENABLE_POWER_SECURITY=false`

---

## mqtt-command-processor

### Hvad gør den?
1. Poller Supabase `meter_commands` tabel hvert 0.2 sekund
2. Finder kommandoer med status `pending`
3. Slår MQTT topic op i `power_meters`
4. Sender MQTT kommando til måler
5. Opdaterer status til `executed` eller `failed`

### Hvor kører den?
```
Container: mqtt-command-processor
Build: ./command-processor/Dockerfile
Kode: command_processor.py (v2.0)
Env: .env fil
```

### Afhængigheder
- `mosquitto` - MQTT broker
- Supabase database
- `power_meters` tabel (for mqtt_topic lookup)

### Genetablering
```bash
docker-compose build mqtt-command-processor
docker-compose up -d mqtt-command-processor
```

### Fejlsøgning
```bash
# Logs
docker logs mqtt-command-processor -f

# Tjek pending kommandoer i database
# SQL: SELECT * FROM meter_commands WHERE status = 'pending';

# Test manuel kommando
# SQL: INSERT INTO meter_commands (meter_id, command, value, status)
#      VALUES ('100', 'set_state', 'ON', 'pending');

# Tjek om den behandles
docker logs mqtt-command-processor --tail 20
```

---

## telegraf

### Hvad gør den?
1. Subscriber til MQTT topics fra alle Z2M instanser
2. Parser JSON data (energy, power, current, voltage, state)
3. Skriver direkte til Supabase PostgreSQL (`meter_readings` tabel)

### Hvor kører den?
```
Container: telegraf
Image: telegraf:1.30
Config: ./telegraf/telegraf.conf
Output: Supabase PostgreSQL (port 5432)
```

### Afhængigheder
- `mosquitto` - MQTT broker
- Supabase PostgreSQL (direkte database forbindelse)

### Data der indsamles
| Felt | Type | Beskrivelse |
|------|------|-------------|
| energy | float | Total kWh |
| power | float | Aktuel watt |
| current | float | Ampere |
| voltage | float | Volt |
| state | string | ON/OFF |
| linkquality | int | Zigbee signal |

### Genetablering
```bash
docker-compose up -d telegraf
```

### Fejlsøgning
```bash
# Logs
docker logs telegraf -f

# Tjek MQTT subscription
docker logs telegraf 2>&1 | grep -i "subscribe\|mqtt"

# Tjek PostgreSQL output
docker logs telegraf 2>&1 | grep -i "postgresql\|write"

# Verificer data i database
# SQL: SELECT * FROM meter_readings ORDER BY time DESC LIMIT 10;
```

---

# 🛠️ NIVEAU 4: APPLICATION SERVICES

## mqtt-config-service (Pairing Service)

### Hvad gør den?
REST API til at:
1. Starte/stoppe pairing mode på Z2M instanser
2. Rename devices efter pairing
3. Auto-konfigurere nye målere (power_outage_memory, indicator_mode)
4. Bulk-konfigurere alle målere

### Hvor kører den?
```
Container: mqtt-config-service
Build: ./maaler-opsaetning/Dockerfile
Kode: server.js (Express)
Port: 3001
```

### API Endpoints
| Endpoint | Metode | Beskrivelse |
|----------|--------|-------------|
| `/health` | GET | Service status |
| `/pairing/areas` | GET | Liste over Z2M områder |
| `/pairing/events` | GET | SSE event stream |
| `/pairing/start` | POST | Start pairing mode |
| `/pairing/stop` | POST | Stop pairing mode |
| `/pairing/rename` | POST | Rename device |
| `/pairing/remove` | POST | Fjern device |
| `/configure-meters` | POST | Konfigurer alle målere |

### Afhængigheder
- `mosquitto` - MQTT broker

### Genetablering
```bash
docker-compose build mqtt-config-service
docker-compose up -d mqtt-config-service
```

### Fejlsøgning
```bash
# Logs
docker logs mqtt-config-service -f

# Test health
curl http://192.168.9.61:3001/health

# Test areas
curl http://192.168.9.61:3001/pairing/areas
```

---

## power-monitor-backend (IoT Power Monitor API)

### Hvad gør den?
1. REST API til test og monitoring af Zigbee netværk
2. WebSocket server til real-time data
3. 10-minutters tests af målere (LQI, state changes, gaps)
4. Monitoring sessions for fejlsøgning

### Hvor kører den?
```
Container: power-monitor-backend
Build: ./power-monitor/backend/Dockerfile
Kode: server.js (Express + WebSocket)
Port HTTP: 3010 (API)
Port WS: 8090 (WebSocket)
Config: ./power-monitor/backend/config.json
```

### API Endpoints
| Endpoint | Metode | Beskrivelse |
|----------|--------|-------------|
| `/api/health` | GET | Service status |
| `/api/areas` | GET | Liste over områder |
| `/api/test/start` | POST | Start 10-min test |
| `/api/test/stop` | POST | Stop test |
| `/api/monitoring/start` | POST | Start monitoring session |

### Afhængigheder
- `mosquitto` - MQTT broker
- `config.json` - Area konfiguration

### config.json indhold
```json
{
  "areas": [
    { "id": "1", "name": "Område 1", "mqtt_topic": "zigbee2mqtt", "web_port": 8082 },
    { "id": "2", "name": "Område 2", "mqtt_topic": "zigbee2mqtt_area2", "web_port": 8083 },
    // ... alle 6 områder
  ],
  "mqtt": {
    "broker": "192.168.9.61:1890",
    "username": "homeassistant",
    "password": "7200Grindsted!"
  }
}
```

### Genetablering
```bash
docker-compose build power-monitor-backend
docker-compose up -d power-monitor-backend
```

### Fejlsøgning
```bash
# Logs
docker logs power-monitor-backend -f

# Test health
curl http://192.168.9.61:3010/api/health

# Test WebSocket (i browser console)
# new WebSocket('ws://192.168.9.61:8090')
```

---

## power-monitor-frontend (IoT Power Monitor Web UI)

### Hvad gør den?
- Web interface til at teste og overvåge Zigbee netværk
- Viser real-time data via WebSocket
- 10-minutters test visualisering
- Bruges primært til fejlsøgning og opsætning

### Hvor kører den?
```
Container: power-monitor-frontend
Build: ./power-monitor/frontend/Dockerfile
Web UI: http://192.168.9.61:3002
Stack: React + Vite + TailwindCSS
```

### Afhængigheder
- `power-monitor-backend` - API + WebSocket

### Genetablering
```bash
docker-compose build power-monitor-frontend
docker-compose up -d power-monitor-frontend
```

### Fejlsøgning
```bash
# Logs
docker logs power-monitor-frontend -f

# Test at siden loader
curl -I http://192.168.9.61:3002
```

---

## homeassistant

### Hvad gør den?
- Modtager MQTT data fra alle målere via MQTT integration
- Gemmer langtidsstatistik (historik) i SQLite database
- Bruges KUN til statistik - **IKKE til styring**
- Viser historiske grafer og trends

### Hvor kører den?
```
Container: homeassistant
Image: ghcr.io/home-assistant/home-assistant:stable
Web UI: http://192.168.9.61:8124
Config: ./homeassistant/config/
Database: ./homeassistant/config/home-assistant_v2.db
```

### Afhængigheder
- `mosquitto` - MQTT broker
- MQTT integration konfigureret i HA

### Genetablering
```bash
docker-compose up -d homeassistant
```

### Fejlsøgning
```bash
# Logs
docker logs homeassistant -f --tail 100

# Restart
docker restart homeassistant

# Tjek MQTT forbindelse i HA
# Web UI → Settings → Devices & Services → MQTT

# Tjek database størrelse
ls -lh ./homeassistant/config/home-assistant_v2.db

# Ryd gammel historik (hvis database er for stor)
# Web UI → Developer Tools → Services → recorder.purge
```

---

# 🔐 MOSQUITTO KONFIGURATION

## Config filer

### mosquitto.conf
```conf
persistence true
persistence_location /mosquitto/data/
listener 1883 0.0.0.0
allow_anonymous false
password_file /mosquitto/config/passwords
acl_file /mosquitto/config/acl
log_dest stdout
```

### ACL (Access Control List)
```
# Zigbee2MQTT
user z2m
topic write zigbee2mqtt/#
topic read homeassistant/#

# Home Assistant (fuld adgang)
user homeassistant
topic read #
topic write #

# Kamera ANPR
user camera_pub
topic write axis/+/event/tns:axis/CameraApplicationPlatform/ALPV.AllPlates

# Gate agent (bomstyring)
user gate_agent
topic read gate/jelling/cmd/#
topic write gate/jelling/state/#
topic read axis/+/event/...
```

### Brugere (passwords fil)
| Bruger | Formål |
|--------|--------|
| `homeassistant` | Hovedbruger - fuld adgang |
| `z2m` | Zigbee2MQTT instances |
| `camera_pub` | ANPR kamera |
| `gate_agent` | Bomstyring |
| `admin_readonly` | Kun læseadgang |

### Tilføj ny bruger
```bash
docker exec -it mosquitto mosquitto_passwd -c /mosquitto/config/passwords brugernavn
docker restart mosquitto
```

---

# 🚀 KOMPLET GENETABLERING

## Fra scratch på ny server

```bash
# 1. Installer Docker + Docker Compose
curl -fsSL https://get.docker.com | sh

# 2. Kopier projekt mappe
scp -r jelling-power-system/ user@ny-server:/volume1/docker/

# 3. Opret .env fil
cat > /volume1/docker/jelling-power-system/.env << 'EOF'
SUPABASE_URL=https://jkmqliztlhmfyejhmuil.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
MQTT_HOST=mosquitto
MQTT_PORT=1883
MQTT_USER=homeassistant
MQTT_PASSWORD=7200Grindsted!
EOF

# 4. Restore Z2M configs fra backup
# (Kopier configuration.yaml, database.db, coordinator_backup.json til hver Z2M mappe)

# 5. Start alle services
cd /volume1/docker/jelling-power-system
docker-compose up -d

# 6. Verificer
docker ps
docker logs device-sync --tail 20
```

---

# 🔍 SAMLET FEJLSØGNING

## Tjek alle containers
```bash
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## Se logs fra alle
```bash
docker-compose logs -f --tail 50
```

## Restart alt
```bash
docker-compose down
docker-compose up -d
```

## Tjek netværk
```bash
docker network inspect jelling-power_jelling-net
```

## Tjek disk plads
```bash
docker system df
```

---

# 📋 CREDENTIALS OVERSIGT

| Service | Bruger | Password | Bemærkning |
|---------|--------|----------|------------|
| MQTT (eksternt) | homeassistant | 7200Grindsted! | Port 1890 |
| MQTT (internt) | homeassistant | 7200Grindsted! | Port 1883 |
| Supabase | service_role | I .env fil | Hemmelig |
| PostgreSQL | postgres | 7200Grindsted! | I telegraf.conf |

---

# 📁 MAPPE STRUKTUR

```
/volume1/docker/jelling-power-system/
├── .env                          # Credentials (HEMMELIG)
├── docker-compose.yml            # Service definitioner
├── backup-pairing.sh             # Backup script
│
├── mosquitto/
│   ├── config/mosquitto.conf
│   ├── data/
│   └── log/
│
├── zigbee2mqtt/data/
│   ├── configuration.yaml        # ⚠️ KRITISK - network key + device names
│   ├── database.db               # ⚠️ KRITISK - pairing info
│   └── coordinator_backup.json   # ⚠️ KRITISK - coordinator state
│
├── zigbee2mqtt_area2/data/       # Samme struktur
├── zigbee2mqtt_area3/data/
├── zigbee2mqtt_3p/data/
│
├── device-sync/
│   ├── Dockerfile
│   ├── device_sync.py
│   └── requirements.txt
│
├── command-processor/
│   ├── Dockerfile
│   ├── command_processor.py
│   └── requirements.txt
│
├── telegraf/
│   └── telegraf.conf
│
├── maaler-opsaetning/
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
│
└── homeassistant/config/
    └── configuration.yaml
```
