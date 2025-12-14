-- =====================================================
-- PAKKE TYPER SEED DATA
-- Eksporteret: 14. december 2025
-- =====================================================

-- Kørende dagspakker (10-210 enheder)
INSERT INTO plugin_data (organization_id, module, ref_id, key, scope, data) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-10-enh', 'pakke_typer:koerende-10-enh', 'organization',
 '{"navn": "10 enheder (1 dag)", "pris": 80, "aktiv": true, "enheder": 10, "type_id": "koerende-10-enh", "pris_dkk": 45, "kunde_type": "kørende", "display_order": 10, "pakke_kategori": "dagspakke", "varighed_timer": 24}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-20-enh', 'pakke_typer:koerende-20-enh', 'organization',
 '{"navn": "20 enheder (2 dage)", "pris": 160, "aktiv": true, "enheder": 20, "type_id": "koerende-20-enh", "pris_dkk": 90, "kunde_type": "kørende", "display_order": 20, "pakke_kategori": "dagspakke", "varighed_timer": 48}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-30-enh', 'pakke_typer:koerende-30-enh', 'organization',
 '{"navn": "30 enheder (3 dage)", "pris": 240, "aktiv": true, "enheder": 30, "type_id": "koerende-30-enh", "pris_dkk": 135, "kunde_type": "kørende", "display_order": 30, "pakke_kategori": "dagspakke", "varighed_timer": 72}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-40-enh', 'pakke_typer:koerende-40-enh', 'organization',
 '{"navn": "40 enheder (4 dage)", "pris": 320, "aktiv": true, "enheder": 40, "type_id": "koerende-40-enh", "pris_dkk": 180, "kunde_type": "kørende", "display_order": 40, "pakke_kategori": "dagspakke", "varighed_timer": 96}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-50-enh', 'pakke_typer:koerende-50-enh', 'organization',
 '{"navn": "50 enheder (5 dage)", "pris": 400, "aktiv": true, "enheder": 50, "type_id": "koerende-50-enh", "pris_dkk": 225, "kunde_type": "kørende", "display_order": 50, "pakke_kategori": "dagspakke", "varighed_timer": 120}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-60-enh', 'pakke_typer:koerende-60-enh', 'organization',
 '{"navn": "60 enheder (6 dage)", "pris": 480, "aktiv": true, "enheder": 60, "type_id": "koerende-60-enh", "pris_dkk": 270, "kunde_type": "kørende", "display_order": 60, "pakke_kategori": "dagspakke", "varighed_timer": 144}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-70-enh', 'pakke_typer:koerende-70-enh', 'organization',
 '{"navn": "70 enheder (7 dage)", "pris": 560, "aktiv": true, "enheder": 70, "type_id": "koerende-70-enh", "pris_dkk": 315, "kunde_type": "kørende", "display_order": 70, "pakke_kategori": "dagspakke", "varighed_timer": 168}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-80-enh', 'pakke_typer:koerende-80-enh', 'organization',
 '{"navn": "80 enheder (8 dage)", "pris": 640, "aktiv": true, "enheder": 80, "type_id": "koerende-80-enh", "pris_dkk": 360, "kunde_type": "kørende", "display_order": 80, "pakke_kategori": "dagspakke", "varighed_timer": 192}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-90-enh', 'pakke_typer:koerende-90-enh', 'organization',
 '{"navn": "90 enheder (9 dage)", "pris": 720, "aktiv": true, "enheder": 90, "type_id": "koerende-90-enh", "pris_dkk": 405, "kunde_type": "kørende", "display_order": 90, "pakke_kategori": "dagspakke", "varighed_timer": 216}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-100-enh', 'pakke_typer:koerende-100-enh', 'organization',
 '{"navn": "100 enheder (10 dage)", "pris": 800, "aktiv": true, "enheder": 100, "type_id": "koerende-100-enh", "pris_dkk": 450, "kunde_type": "kørende", "display_order": 100, "pakke_kategori": "dagspakke", "varighed_timer": 240}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-110-enh', 'pakke_typer:koerende-110-enh', 'organization',
 '{"navn": "110 enheder (11 dage)", "pris": 880, "aktiv": true, "enheder": 110, "type_id": "koerende-110-enh", "pris_dkk": 495, "kunde_type": "kørende", "display_order": 110, "pakke_kategori": "dagspakke", "varighed_timer": 264}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-120-enh', 'pakke_typer:koerende-120-enh', 'organization',
 '{"navn": "120 enheder (12 dage)", "pris": 960, "aktiv": true, "enheder": 120, "type_id": "koerende-120-enh", "pris_dkk": 540, "kunde_type": "kørende", "display_order": 120, "pakke_kategori": "dagspakke", "varighed_timer": 288}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-130-enh', 'pakke_typer:koerende-130-enh', 'organization',
 '{"navn": "130 enheder (13 dage)", "pris": 1040, "aktiv": true, "enheder": 130, "type_id": "koerende-130-enh", "pris_dkk": 585, "kunde_type": "kørende", "display_order": 130, "pakke_kategori": "dagspakke", "varighed_timer": 312}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-140-enh', 'pakke_typer:koerende-140-enh', 'organization',
 '{"navn": "140 enheder (14 dage)", "pris": 1120, "aktiv": true, "enheder": 140, "type_id": "koerende-140-enh", "pris_dkk": 630, "kunde_type": "kørende", "display_order": 140, "pakke_kategori": "dagspakke", "varighed_timer": 336}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-150-enh', 'pakke_typer:koerende-150-enh', 'organization',
 '{"navn": "150 enheder (15 dage)", "pris": 1200, "aktiv": true, "enheder": 150, "type_id": "koerende-150-enh", "pris_dkk": 675, "kunde_type": "kørende", "display_order": 150, "pakke_kategori": "dagspakke", "varighed_timer": 360}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-160-enh', 'pakke_typer:koerende-160-enh', 'organization',
 '{"navn": "160 enheder (16 dage)", "pris": 1280, "aktiv": true, "enheder": 160, "type_id": "koerende-160-enh", "pris_dkk": 720, "kunde_type": "kørende", "display_order": 160, "pakke_kategori": "dagspakke", "varighed_timer": 384}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-170-enh', 'pakke_typer:koerende-170-enh', 'organization',
 '{"navn": "170 enheder (17 dage)", "pris": 1360, "aktiv": true, "enheder": 170, "type_id": "koerende-170-enh", "pris_dkk": 765, "kunde_type": "kørende", "display_order": 170, "pakke_kategori": "dagspakke", "varighed_timer": 408}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-180-enh', 'pakke_typer:koerende-180-enh', 'organization',
 '{"navn": "180 enheder (18 dage)", "pris": 1440, "aktiv": true, "enheder": 180, "type_id": "koerende-180-enh", "pris_dkk": 810, "kunde_type": "kørende", "display_order": 180, "pakke_kategori": "dagspakke", "varighed_timer": 432}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-190-enh', 'pakke_typer:koerende-190-enh', 'organization',
 '{"navn": "190 enheder (19 dage)", "pris": 1520, "aktiv": true, "enheder": 190, "type_id": "koerende-190-enh", "pris_dkk": 855, "kunde_type": "kørende", "display_order": 190, "pakke_kategori": "dagspakke", "varighed_timer": 456}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-200-enh', 'pakke_typer:koerende-200-enh', 'organization',
 '{"navn": "200 enheder (20 dage)", "pris": 1600, "aktiv": true, "enheder": 200, "type_id": "koerende-200-enh", "pris_dkk": 900, "kunde_type": "kørende", "display_order": 200, "pakke_kategori": "dagspakke", "varighed_timer": 480}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-210-enh', 'pakke_typer:koerende-210-enh', 'organization',
 '{"navn": "210 enheder (21 dage)", "pris": 1680, "aktiv": true, "enheder": 210, "type_id": "koerende-210-enh", "pris_dkk": 945, "kunde_type": "kørende", "display_order": 210, "pakke_kategori": "dagspakke", "varighed_timer": 504}'::jsonb),

-- Kørende tillæg
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-tillaeg-10', 'pakke_typer:koerende-tillaeg-10', 'organization',
 '{"navn": "10 enheder tillæg", "pris": 80, "aktiv": true, "enheder": 10, "type_id": "koerende-tillaeg-10", "pris_dkk": 45, "kunde_type": "kørende", "display_order": 1, "pakke_kategori": "tillæg", "varighed_timer": null}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'koerende-tillaeg-20', 'pakke_typer:koerende-tillaeg-20', 'organization',
 '{"navn": "20 enheder tillæg", "pris": 160, "aktiv": true, "enheder": 20, "type_id": "koerende-tillaeg-20", "pris_dkk": 90, "kunde_type": "kørende", "display_order": 2, "pakke_kategori": "tillæg", "varighed_timer": null}'::jsonb),

-- Sæson pakker
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'saeson-100', 'pakke_typer:saeson-100', 'organization',
 '{"navn": "100 enheder (sæson)", "pris": 800, "aktiv": true, "enheder": 100, "type_id": "saeson-100", "pris_dkk": 450, "kunde_type": "sæson", "display_order": 1, "pakke_kategori": "startpakke", "varighed_timer": null}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'saeson-tillaeg-10', 'pakke_typer:saeson-tillaeg-10', 'organization',
 '{"navn": "10 enheder (tillæg)", "pris": 80, "aktiv": true, "enheder": 10, "type_id": "saeson-tillaeg-10", "pris_dkk": 45, "kunde_type": "sæson", "display_order": 1, "pakke_kategori": "tillæg", "varighed_timer": null}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'saeson-tillaeg-25', 'pakke_typer:saeson-tillaeg-25', 'organization',
 '{"navn": "25 enheder (tillæg)", "pris": 200, "aktiv": true, "enheder": 25, "type_id": "saeson-tillaeg-25", "pris_dkk": 112.5, "kunde_type": "sæson", "display_order": 2, "pakke_kategori": "tillæg", "varighed_timer": null}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'saeson-tillaeg-50', 'pakke_typer:saeson-tillaeg-50', 'organization',
 '{"navn": "50 enheder (tillæg)", "pris": 400, "aktiv": true, "enheder": 50, "type_id": "saeson-tillaeg-50", "pris_dkk": 225, "kunde_type": "sæson", "display_order": 3, "pakke_kategori": "tillæg", "varighed_timer": null}'::jsonb),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'pakke_typer', 'saeson-tillaeg-100', 'pakke_typer:saeson-tillaeg-100', 'organization',
 '{"navn": "100 enheder (tillæg)", "pris": 800, "aktiv": true, "enheder": 100, "type_id": "saeson-tillaeg-100", "pris_dkk": 450, "kunde_type": "sæson", "display_order": 4, "pakke_kategori": "tillæg", "varighed_timer": null}'::jsonb)
ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;
