# Supabase Migrations Liste

**Eksporteret:** 14. december 2025  
**Antal migrations:** 136

## Migrations (kronologisk)

| # | Version | Navn |
|---|---------|------|
| 1 | 20251026143319 | create_organizations_table |
| 2 | 20251026143329 | create_plugin_data_table |
| 3 | 20251026143337 | create_timestamp_triggers |
| 4 | 20251026143342 | create_profiles_table |
| 5 | 20251026143349 | create_roles_table |
| 6 | 20251026143354 | create_permissions_table |
| 7 | 20251026143359 | create_role_permissions_table |
| 8 | 20251026143404 | create_user_memberships_table |
| 9 | 20251026143414 | add_rls_policies |
| 10 | 20251026143420 | seed_system_roles |
| 11 | 20251026143437 | seed_permissions |
| 12 | 20251026143443 | link_superadmin_permissions |
| 13 | 20251026143450 | link_admin_permissions |
| 14 | 20251026143456 | link_staff_permissions |
| 15 | 20251026143501 | link_guest_permissions |
| 16 | 20251026143513 | create_helper_functions |
| 17 | 20251026143522 | seed_jelling_camping_organization |
| 18 | 20251026143529 | seed_system_settings |
| 19 | 20251026143539 | seed_koerende_hovedpakker |
| 20 | 20251026143547 | seed_koerende_tillaeg |
| 21 | 20251026143601 | seed_saeson_pakker |
| 22 | 20251026143609 | create_cleanup_function |
| 23 | 20251031181623 | create_webhook_data_table |
| 24 | 20251031185931 | create_plate_detections_table |
| 25 | 20251031204009 | create_customers_and_meters_tables |
| 26 | 20251031204410 | split_customers_into_seasonal_and_regular |
| 27 | 20251101114300 | create_approved_plates_and_gate_log |
| 28 | 20251101115320 | create_auto_sync_triggers_for_approved_plates |
| 29 | 20251101115330 | create_cleanup_triggers_for_approved_plates |
| 30 | 20251101120718 | add_license_plate_cleanup_and_normalization |
| 31 | 20251101120728 | change_triggers_to_before_for_cleanup |
| 32 | 20251102062206 | create_live_gate_view |
| 33 | 20251102062227 | update_live_gate_view_with_openings |
| 34 | 20251102062412 | update_live_gate_view_exclude_outgoing |
| 35 | 20251102062734 | fix_timezone_in_live_gate_view |
| 36 | 20251102071550 | add_rls_policies_for_customers |
| 37 | 20251102075106 | add_rls_policy_approved_plates_for_staff |
| 38 | 20251102132040 | create_webhook_cleanup_function |
| 39 | 20251102132850 | sync_manual_customers_to_approved_plates |
| 40 | 20251102133510 | fix_sync_trigger_null_notes |
| 41 | 20251102133651 | fix_trigger_security_definer |
| 42 | 20251104074023 | add_state_column_to_meter_readings |
| 43 | 20251104074605 | add_missing_columns_to_meter_readings |
| 44 | 20251104082503 | create_meter_commands_table |
| 45 | 20251104161226 | update_plugin_data_rls_policy |
| 46 | 20251104161352 | fix_plugin_data_rls_with_enum |
| 47 | 20251104161503 | temporarily_allow_all_plugin_data |
| 48 | 20251105074138 | add_meter_start_readings |
| 49 | 20251105074551 | fix_meter_id_type |
| 50 | 20251105075030 | add_staff_admin_policies_approved_plates |
| 51 | 20251105081950 | update_cleanup_expired_customers |
| 52 | 20251105082008 | setup_cron_jobs |
| 53 | 20251105113817 | process_sirvoy_webhooks |
| 54 | 20251105131658 | enable_power_meters_access |
| 55 | 20251105135235 | create_email_subscribers_table |
| 56 | 20251105140050 | create_email_subscriber_trigger |
| 57 | 20251105140349 | fix_email_subscriber_trigger |
| 58 | 20251105150141 | allow_anon_customer_login |
| 59 | 20251105160041 | add_power_status_to_meters |
| 60 | 20251106065542 | fix_meter_id_uuid_to_meter_number |
| 61 | 20251107071740 | create_meter_readings_history_table |
| 62 | 20251107071916 | create_cron_for_meter_archive_and_cleanup |
| 63 | 20251107095302 | create_email_logs_table |
| 64 | 20251107125906 | allow_anon_read_packages |
| 65 | 20251107144710 | create_consumption_snapshots_tables |
| 66 | 20251108063204 | auto_free_meters_on_customer_delete |
| 67 | 20251108104122 | enable_pg_net_extension |
| 68 | 20251108111943 | auto_shutoff_meters_without_active_package |
| 69 | 20251108153355 | create_daily_package_stats |
| 70 | 20251108154034 | drop_old_consumption_snapshots |
| 71 | 20251108162017 | create_increment_package_stats_function |
| 72 | 20251111162236 | add_base_topic_to_meter_readings |
| 73 | 20251111174736 | auto_create_power_meters_from_readings |
| 74 | 20251116100900 | create_monitoring_tables |
| 75 | 20251116104242 | create_system_settings_and_alerts |
| 76 | 20251117100614 | update_auto_create_power_meter_set_mqtt_topic |
| 77 | 20251122201332 | unify_meter_identifier_stage2_20251122 |
| 78 | 20251124113838 | create_meter_identity_citext |
| 79 | 20251124113849 | create_meter_online_status_view |
| 80 | 20251125171043 | create_cabins_table |
| 81 | 20251125171051 | create_cabin_cleaning_schedule_table |
| 82 | 20251126072917 | create_meter_identity_snapshots |
| 83 | 20251126072925 | create_meter_replacement_log |
| 84 | 20251126072936 | create_snapshot_function |
| 85 | 20251126073001 | create_protect_friendly_name_trigger |
| 86 | 20251126073017 | create_handle_meter_replacement_trigger |
| 87 | 20251126073056 | create_auto_restore_trigger |
| 88 | 20251126073116 | create_restore_functions |
| 89 | 20251127192406 | add_is_online_to_power_meters |
| 90 | 20251130152818 | create_kort_modul_tables |
| 91 | 20251130160011 | add_map_columns_cabins_and_repeaters |
| 92 | 20251130161303 | add_update_policy_power_meters |
| 93 | 20251130190634 | add_winter_storage_to_seasonal |
| 94 | 20251201133328 | add_power_security_system |
| 95 | 20251201150030 | add_check_meter_power_allowed_function |
| 96 | 20251201151549 | fix_check_meter_power_allowed_priority |
| 97 | 20251201151638 | fix_check_meter_power_allowed_v2 |
| 98 | 20251203064338 | add_checked_in_to_email_subscribers |
| 99 | 20251203064748 | update_email_subscribers_customer_type_check |
| 100 | 20251203083735 | fix_user_roles_access |
| 101 | 20251203102131 | create_electrical_infrastructure_tables |
| 102 | 20251203124258 | create_board_connections |
| 103 | 20251203131922 | add_distribution_board_to_cabins |
| 104 | 20251203161955 | create_booking_extra_meters |
| 105 | 20251203170008 | update_check_meter_power_allowed_for_extra_meters |
| 106 | 20251204065206 | pre_multiple_spots_restore_point |
| 107 | 20251204065215 | add_spot_numbers_array |
| 108 | 20251204103344 | create_email_provider_config |
| 109 | 20251204123754 | create_latest_meter_readings_view |
| 110 | 20251204124244 | add_index_for_latest_readings |
| 111 | 20251204133852 | fix_duplicate_index |
| 112 | 20251204133901 | create_materialized_view_latest_readings |
| 113 | 20251204133915 | create_refresh_latest_readings_function |
| 114 | 20251204134024 | add_meter_commands_index |
| 115 | 20251204134050 | optimize_check_meter_power_allowed |
| 116 | 20251204134100 | add_optimization_indexes |
| 117 | 20251205083056 | create_camp_events_table |
| 118 | 20251205085149 | create_external_events_table |
| 119 | 20251209081422 | add_image_url_to_camp_events |
| 120 | 20251209082500 | create_event_feed_sources_table |
| 121 | 20251209112041 | add_magic_token_to_customers |
| 122 | 20251209112049 | add_magic_token_unique_constraints |
| 123 | 20251209112113 | create_email_templates_table |
| 124 | 20251209112124 | create_bakery_tables |
| 125 | 20251209112136 | create_portal_info_table |
| 126 | 20251209142354 | add_portal_box_to_email_templates |
| 127 | 20251209144955 | create_bakery_settings |
| 128 | 20251209210407 | create_images_storage_bucket |
| 129 | 20251209210416 | images_storage_policies |
| 130 | 20251209210436 | camp_events_authenticated_policies |
| 131 | 20251209210854 | fix_camp_events_anon_read |
| 132 | 20251209212801 | create_attractions_table |
| 133 | 20251209213958 | create_cafe_tables |
| 134 | 20251210063301 | add_anon_select_cafe_orders |
| 135 | 20251210064053 | create_practical_info_table |
| 136 | 20251210070524 | create_pool_settings_table |
| 137 | 20251210071415 | create_playground_settings_table |
| 138 | 20251210074222 | create_cabin_settings_table |
| 139 | 20251210091607 | create_dashboard_settings |
| 140 | 20251212072506 | brevo_email_events |
| 141 | 20251212090354 | add_scheduled_emails_cron_job |
| 142 | 20251212100712 | add_template_name_to_email_logs |
| 143 | 20251213075840 | add_cafe_capacity_and_timeslot_columns |

## Vigtige kategorier

### Core System (1-22)
- Organizations, profiles, roles, permissions
- Plugin data system
- Cleanup funktioner

### Gate/ANPR System (23-41)
- Webhook data, plate detections
- Customers (seasonal + regular)
- Approved plates, gate log
- Live gate view

### Strømstyring (42-77)
- Meter readings, commands
- Power meters
- CRON jobs
- Email subscribers
- Monitoring

### Meter Identity (78-88)
- Snapshots, replacement log
- Protect/restore funktioner

### Kort Modul (89-93)
- Map coordinates
- Winter storage

### Power Security (94-97)
- check_meter_power_allowed

### Booking/Extra (98-107)
- Email subscribers
- Electrical infrastructure
- Extra meters

### Performance (108-116)
- Materialized views
- Indexes

### Portal Features (117-143)
- Events, bakery, cafe
- Magic links
- Email templates
- Attractions, pool, playground
- Cabin settings
