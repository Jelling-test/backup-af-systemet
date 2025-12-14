-- =====================================================
-- ATTRACTIONS SEED DATA
-- Eksporteret: 14. december 2025
-- =====================================================

INSERT INTO attractions (name, name_en, description, description_en, distance_km, category, main_url, highlight, sort_order, is_active) VALUES
('Kongernes Jelling', NULL, 'UNESCO verdensarv - vikingemonumenter', NULL, '0.5', 'museum', 'https://natmus.dk/kongernes-jelling', true, 3, true),
('Bindeballe Købmandsgaard', 'Bindeballe Købmandsgaard', 'Oplev hvordan det var i gamle dage. Hyg jer med kaffe og kage i kaffehuset og gå på opdagelse i den gamle købmandsgaard.', NULL, '20.0', 'family', 'http://www.bindeballekoebmandsgaard.dk', false, 1, true),
('Økolariet', NULL, 'Videns- og oplevelsescenter om klima', NULL, '12.0', 'museum', 'https://okolariet.dk', false, 2, true),
('GIVSKUD ZOO', NULL, 'Zoo, safari og dinosaurpark', NULL, '20.0', 'zoo', 'https://givskudzoo.dk', false, 4, true),
('Haughus Gods', 'Haughus Estate', 'Antik & Kræmmermarked', NULL, '3.0', 'other', 'https://www.haughus.dk', false, 5, true),
('LEGOLAND Billund', NULL, 'Familieforlystelsespark', NULL, '25.0', 'family', 'https://legoland.dk', false, 6, true),
('Gorilla Park Vejle', NULL, 'Trætopklatring for hele familien', NULL, '15.0', 'adventure', 'https://gorillapark.dk', false, 7, true),
('Skov legeplads', 'Forest playground', 'Pakerings adresse: Jelling Skovvej 2, 7300 Jelling', NULL, '3.0', 'nature', NULL, false, 8, true),
('Jelling golfklub', 'Jelling golf club', 'Golf bane, der er muligt at spille efter betaling af "Greenfee"', NULL, '3.0', 'other', NULL, false, 9, true),
('Vejle Fodboldgolf', 'Vejle Football Golf', 'Fodboldgolf er perfekt til en sjov, social og skærmfri udendørsaktivitet for venner eller familie.', NULL, '10.0', 'family', 'https://vejlefodboldgolf.dk', false, 10, true),
('Kulturmuseet', 'Cultural Museum', 'Alle museets udstillinger har sjove aktiviteter for børn. Den indendørs baggård indbyder til leg.', NULL, '13.0', 'museum', 'https://www.kulturmuseet.dk', false, 11, true),
('WOW PARK', 'WOW PARK', 'Lege og forlystelsespark i skoven. Har Skandinaviens højeste fritfalds-rutsjetårn.', NULL, '22.0', 'adventure', 'https://wowpark.dk', false, 12, true)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  main_url = EXCLUDED.main_url;
