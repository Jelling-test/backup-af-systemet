-- =====================================================
-- CABINS SEED DATA
-- Eksporteret: 14. december 2025
-- =====================================================

INSERT INTO cabins (cabin_number, name, cabin_type, meter_id, is_active, map_x, map_y) VALUES
('26', 'Mobile Home 4 personers - nummer 26', 'Mobile Home 4 personer', 'Hytte 26', true, 2720.60, 1322.12),
('27', 'mobile home 4 personer - nummer 27', 'Mobile Home 4 personer', 'Hytte 27', true, 2719.46, 1132.36),
('28', 'mobile home 6 personer - nummer 28', 'mobile 6 personer', 'Hytte 28', true, 2700.96, 967.60),
('29', 'mobile home 4 personer - nummer 29', 'Mobile Home 4 personer', 'Hytte 29', true, 2764.15, 834.10),
('30', 'mobile home 4 personer - nummer 30', 'Mobile Home 4 personer', 'Hytte 30', true, 2883.75, 831.47),
('31', 'mobile home 4 personer - nummer 31', 'Mobile Home 4 personer', 'Hytte 31', true, 2915.65, 970.27),
('32', 'mobile home 6 personer - nummer 32', 'mobile 6 personer', 'Hytte 32', true, 2905.09, 1132.48),
('33', 'mobile home 6 personer - nummer 33', 'mobile 6 personer', 'Hytte 33', true, 2904.96, 1323.39),
('34', 'mobile home 6 personer - nummer 34', 'mobile 6 personer', 'Hytte 34', true, 3040.94, 1323.99),
('35', 'mobile home 4 personer - nummer 35', 'Mobile Home 4 personer', 'hytte 35', true, 3043.33, 1136.21),
('36', 'mobile home 6 personer - nummer 36', 'mobile 6 personer', 'Hytte 36', true, 3034.89, 971.23),
('37', 'mobile home 6 personer - nummer 37', 'mobile 6 personer', 'Hytte 37', true, 3050.57, 818.75),
('38', 'mobile home 6 personer - nummer 38', 'mobile 6 personer', 'Hytte 38', true, 3161.69, 779.53),
('39', 'mobile home 6 personer - nummer 39', 'mobile 6 personer', 'Hytte 39', true, 3273.81, 837.20),
('40', 'mobile home 6 personer - nummer 40', 'mobile 6 personer', 'Hytte 40', true, 3285.91, 971.30),
('41', 'mobile home 4 personer - nummer 41', 'Mobile Home 4 personer', 'Hytte 41', true, 3290.40, 1133.37),
('42', 'mobile home 6 personer - nummer 42', 'mobile 6 personer', 'Hytte 42', true, 3288.94, 1320.45)
ON CONFLICT (cabin_number) DO UPDATE SET
  name = EXCLUDED.name,
  meter_id = EXCLUDED.meter_id,
  map_x = EXCLUDED.map_x,
  map_y = EXCLUDED.map_y;
