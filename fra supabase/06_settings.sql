-- =====================================================
-- SETTINGS SEED DATA (bakery, portal_info, pool, playground, cabin, dashboard)
-- Eksporteret: 14. december 2025
-- =====================================================

-- BAKERY SETTINGS
INSERT INTO bakery_settings (id, order_open_time, order_close_time, pickup_start_time, pickup_end_time, is_closed, closed_message_da, closed_message_en, closed_message_de, pickup_location_da, pickup_location_en, pickup_location_de) VALUES
('default', '10:00:00', '22:00:00', '07:00:00', '09:00:00', false, 
 'Bageriet er lukket', 'Bakery is closed', 'Bäckerei geschlossen',
 'Receptionen', 'Reception', 'Rezeption')
ON CONFLICT (id) DO UPDATE SET
  order_open_time = EXCLUDED.order_open_time,
  order_close_time = EXCLUDED.order_close_time;

-- PORTAL INFO (praktisk information)
INSERT INTO portal_info (key, title, title_en, content, content_en, icon, sort_order, is_active) VALUES
('wifi', 'WiFi', 'WiFi', 
 'Netværk: JellingCamping\nAdgangskode: camping2025',
 'Network: JellingCamping\nPassword: camping2025',
 'wifi', 1, true),
('reception', 'Reception', 'Reception',
 'Åbningstider:\nMandag-Fredag: 08:00-20:00\nLørdag-Søndag: 09:00-18:00',
 'Opening hours:\nMonday-Friday: 08:00-20:00\nSaturday-Sunday: 09:00-18:00',
 'clock', 2, true),
('emergency', 'Nødsituationer', 'Emergency',
 'Brandudgang: Følg de grønne skilte\nFørstehjælp: Kontakt receptionen\nNødtelefon: 112',
 'Fire exit: Follow green signs\nFirst aid: Contact reception\nEmergency: 112',
 'alert-triangle', 3, true),
('rules', 'Ordensregler', 'Rules',
 'Stilletid: 23:00-07:00\nMax hastighed: 10 km/t\nHunde i snor\nAffald i containere',
 'Quiet hours: 23:00-07:00\nMax speed: 10 km/h\nDogs on leash\nWaste in containers',
 'scroll-text', 4, true),
('facilities', 'Faciliteter', 'Facilities',
 'Toiletter og bad: Åbent 24/7\nVaskeri: Møntvask 20kr\nKøkken: 07:00-22:00\nLegeplads: Altid åben',
 'Toilets and showers: Open 24/7\nLaundry: Coin wash 20kr\nKitchen: 07:00-22:00\nPlayground: Always open',
 'building-2', 5, true),
('checkout', 'Check-ud', 'Check-out',
 'Check-ud senest kl. 11:00\nAflevér nøgle/chip i receptionen\nTøm affald før afrejse',
 'Check-out by 11:00 AM\nReturn key/chip to reception\nEmpty waste before departure',
 'log-out', 6, true),
('contact', 'Kontakt', 'Contact',
 'Telefon: 75 87 13 44\nEmail: info@jellingcamping.dk\nAdresse: Mølvangvej 7, 7300 Jelling',
 'Phone: +45 75 87 13 44\nEmail: info@jellingcamping.dk\nAddress: Mølvangvej 7, 7300 Jelling',
 'phone', 7, true)
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  content_en = EXCLUDED.content_en;

-- DASHBOARD SETTINGS
INSERT INTO dashboard_settings (id) VALUES ('default')
ON CONFLICT (id) DO NOTHING;
