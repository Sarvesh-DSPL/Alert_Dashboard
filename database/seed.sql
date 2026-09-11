USE smart_facility_monitoring;

-- =========================================================
-- FACILITIES
-- =========================================================
INSERT INTO facilities (name, location, area_count, camera_count, areas) VALUES
  ('Northgate Warehouse',   'Pune',       6, 24, '["Loading Dock","Storage A","Storage B","Office","Server Room","Parking Lot"]'),
  ('Southside Data Center', 'Mumbai',        5, 40, '["Server Hall A","Server Hall B","Control Room","Cooling Plant","Reception"]'),
  ('Eastfield Factory',     'Banglore',       7, 32, '["Assembly Line 1","Assembly Line 2","Quality Control","Raw Materials","Finished Goods","Break Room","Security Booth"]'),
  ('Westpark Office',       'Hyderabad',       4, 16, '["Floor 1","Floor 2","Rooftop","Basement Parking"]'),
  ('Central Hub',           'Chennai',        5, 20, '["Main Hall","East Wing","West Wing","Cafeteria","IT Room"]');

-- =========================================================
-- ALERTS  (spread over the last 30 days)
-- =========================================================
INSERT INTO alerts (type, facility_id, area, severity, status, description, created_at, updated_at) VALUES

-- Northgate Warehouse (facility 1)
('Motion Detection',    1, 'Loading Dock',  'Critical', 'Active',
 'Unexpected motion detected in the loading dock after business hours. Security team notified.',
 NOW() - INTERVAL 1 HOUR,   NOW() - INTERVAL 1 HOUR),

('Unauthorized Access', 1, 'Server Room',   'High',     'Acknowledged',
 'Badge-access attempt from an unregistered credential recorded at the server room door.',
 NOW() - INTERVAL 6 HOUR,   NOW() - INTERVAL 4 HOUR),

('Camera Offline',      1, 'Parking Lot',   'Medium',   'Active',
 'Camera unit CAM-04 in the parking lot has lost connection. Last heartbeat 35 minutes ago.',
 NOW() - INTERVAL 3 DAY,    NOW() - INTERVAL 3 DAY),

('Fire Detection',      1, 'Storage A',     'Critical', 'Resolved',
 'Smoke sensor triggered in Storage A. Fire crew responded; false alarm confirmed after inspection.',
 NOW() - INTERVAL 10 DAY,   NOW() - INTERVAL 9 DAY),

('Equipment Failure',   1, 'Office',        'Low',      'Resolved',
 'HVAC unit in the main office reported a minor fault code. Maintenance reset the unit.',
 NOW() - INTERVAL 20 DAY,   NOW() - INTERVAL 19 DAY),

-- Southside Data Center (facility 2)
('Temperature Alert',   2, 'Server Hall A', 'Critical', 'Active',
 'Ambient temperature in Server Hall A exceeded 85°F threshold. Cooling system investigation underway.',
 NOW() - INTERVAL 30 MINUTE, NOW() - INTERVAL 30 MINUTE),

('Intrusion Detection', 2, 'Control Room',  'High',     'Active',
 'Motion sensor triggered in the control room during a scheduled maintenance window.',
 NOW() - INTERVAL 2 HOUR,   NOW() - INTERVAL 2 HOUR),

('Camera Offline',      2, 'Reception',     'Low',      'Resolved',
 'Reception camera went offline briefly due to a network switch reboot. Service restored.',
 NOW() - INTERVAL 5 DAY,    NOW() - INTERVAL 5 DAY),

('Unauthorized Access', 2, 'Server Hall B', 'High',     'Acknowledged',
 'Three consecutive failed access attempts recorded at Server Hall B entry point.',
 NOW() - INTERVAL 8 DAY,    NOW() - INTERVAL 7 DAY),

('Equipment Failure',   2, 'Cooling Plant', 'Critical', 'Resolved',
 'Primary cooling unit failed, triggering automatic failover to backup. Root cause: compressor fault.',
 NOW() - INTERVAL 15 DAY,   NOW() - INTERVAL 14 DAY),

-- Eastfield Factory (facility 3)
('Equipment Failure',   3, 'Assembly Line 1','High',    'Active',
 'Conveyor belt motor on Assembly Line 1 stalled. Production halted pending technician arrival.',
 NOW() - INTERVAL 45 MINUTE, NOW() - INTERVAL 45 MINUTE),

('Fire Detection',      3, 'Raw Materials', 'Critical', 'Acknowledged',
 'Heat sensor in raw materials storage exceeded safe threshold. Fire suppression system armed.',
 NOW() - INTERVAL 3 HOUR,   NOW() - INTERVAL 2 HOUR),

('Motion Detection',    3, 'Security Booth','Medium',   'Resolved',
 'Motion detected in the unoccupied security booth at 02:00. Reviewed footage—cat entered through gap.',
 NOW() - INTERVAL 7 DAY,    NOW() - INTERVAL 7 DAY),

('Camera Offline',      3, 'Finished Goods','Medium',   'Active',
 'Two cameras in the finished-goods area are offline. Network team investigating.',
 NOW() - INTERVAL 2 DAY,    NOW() - INTERVAL 2 DAY),

('Unauthorized Access', 3, 'Quality Control','Low',     'Resolved',
 'Contractor swiped badge in wrong zone; escorted back to approved area. Badge permissions updated.',
 NOW() - INTERVAL 12 DAY,   NOW() - INTERVAL 12 DAY),

('Intrusion Detection', 3, 'Assembly Line 2','High',    'Resolved',
 'Perimeter sensor on Assembly Line 2 triggered during shift change. Confirmed as false positive.',
 NOW() - INTERVAL 25 DAY,   NOW() - INTERVAL 24 DAY),

-- Westpark Office (facility 4)
('Motion Detection',    4, 'Basement Parking','Medium', 'Active',
 'Unexpected motion in basement parking outside operating hours. Guard dispatched to investigate.',
 NOW() - INTERVAL 4 HOUR,   NOW() - INTERVAL 4 HOUR),

('Camera Offline',      4, 'Rooftop',       'Low',      'Acknowledged',
 'Rooftop camera offline since last night. Likely wind damage to cable. Facilities team scheduled.',
 NOW() - INTERVAL 18 HOUR,  NOW() - INTERVAL 12 HOUR),

('Unauthorized Access', 4, 'Floor 2',       'High',     'Resolved',
 'After-hours access on Floor 2 by an employee whose access was recently revoked. IT security notified.',
 NOW() - INTERVAL 6 DAY,    NOW() - INTERVAL 6 DAY),

('Equipment Failure',   4, 'Floor 1',       'Low',      'Resolved',
 'UPS battery on Floor 1 reported low charge. Battery replaced during scheduled maintenance.',
 NOW() - INTERVAL 22 DAY,   NOW() - INTERVAL 21 DAY),

-- Central Hub (facility 5)
('Fire Detection',      5, 'East Wing',     'Critical', 'Active',
 'Smoke detector activated in East Wing kitchen area. Suppression system deployed. Evacuation in progress.',
 NOW() - INTERVAL 15 MINUTE, NOW() - INTERVAL 15 MINUTE),

('Intrusion Detection', 5, 'Main Hall',     'High',     'Active',
 'Glass-break sensor triggered in the main hall after closing hours. Police notified.',
 NOW() - INTERVAL 1 HOUR,   NOW() - INTERVAL 1 HOUR),

('Temperature Alert',   5, 'IT Room',       'Medium',   'Acknowledged',
 'IT room temperature rose above 78°F. Additional portable cooling unit deployed.',
 NOW() - INTERVAL 5 HOUR,   NOW() - INTERVAL 3 HOUR),

('Camera Offline',      5, 'West Wing',     'Low',      'Resolved',
 'West Wing corridor camera offline for 2 hours due to firmware update. Now back online.',
 NOW() - INTERVAL 4 DAY,    NOW() - INTERVAL 4 DAY),

('Motion Detection',    5, 'Cafeteria',     'Low',      'Resolved',
 'Motion in the cafeteria triggered by a cleaning robot operating on its scheduled run.',
 NOW() - INTERVAL 9 DAY,    NOW() - INTERVAL 9 DAY),

('Unauthorized Access', 5, 'East Wing',     'Medium',   'Resolved',
 'Visitor badge used to access a restricted corridor. Visitor policy reminder issued.',
 NOW() - INTERVAL 18 DAY,   NOW() - INTERVAL 17 DAY),

-- Extra variety
('Equipment Failure',   2, 'Server Hall A', 'Medium',   'Acknowledged',
 'Disk array in rack R-07 reporting SMART errors on two drives. Replacement drives ordered.',
 NOW() - INTERVAL 11 DAY,   NOW() - INTERVAL 10 DAY),

('Temperature Alert',   3, 'Assembly Line 2','Low',     'Resolved',
 'Ambient temperature near Assembly Line 2 slightly elevated during summer peak. Ventilation improved.',
 NOW() - INTERVAL 28 DAY,   NOW() - INTERVAL 27 DAY),

('Intrusion Detection', 1, 'Storage B',     'Medium',   'Active',
 'Door sensor on Storage B fire exit triggered. Exit appeared propped open for delivery.',
 NOW() - INTERVAL 7 HOUR,   NOW() - INTERVAL 7 HOUR),

('Fire Detection',      4, 'Floor 2',       'High',     'Resolved',
 'Electrical short caused brief smoke on Floor 2. IT isolated the faulty PDU. No injuries.',
 NOW() - INTERVAL 29 DAY,   NOW() - INTERVAL 28 DAY);
