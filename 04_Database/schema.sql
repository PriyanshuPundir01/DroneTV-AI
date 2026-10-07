-- ========================================================
-- DroneTV AI Support & Lead Assistant Database Schema (SQL)
-- Compatible with PostgreSQL (v13+) and MySQL (v8.0+)
-- ========================================================

-- Drop table if exists for clean migration runs
DROP TABLE IF EXISTS enquiries;

-- In PostgreSQL: Create ENUM types
-- CREATE TYPE user_type_enum AS ENUM ('Student', 'Customer', 'Other');
-- CREATE TYPE enquiry_status_enum AS ENUM ('New', 'Contacted', 'In Progress', 'Closed');

CREATE TABLE enquiries (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('Student', 'Customer', 'Other')),
    interest VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'In Progress', 'Closed')),
    admin_notes TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Performance Indexes for Search & Filter Operations
-- ========================================================
CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_user_type ON enquiries(user_type);
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX idx_enquiries_email ON enquiries(email);

-- Full-text / Trigram Index for Fast Lead Search (PostgreSQL)
-- CREATE INDEX idx_enquiries_search ON enquiries USING gin(to_tsvector('english', name || ' ' || email || ' ' || interest || ' ' || message));

-- ========================================================
-- Initial Sample Seed Records
-- ========================================================
INSERT INTO enquiries (id, name, email, phone, user_type, interest, message, status, admin_notes, created_at, updated_at)
VALUES
(
    '66f50001a1b2c3d4e5f60001',
    'Aarav Sharma',
    'aarav.sharma@example.com',
    '+91 98765 43210',
    'Student',
    'DGCA Certified Remote Pilot Training',
    'I am a final-year aerospace engineering student interested in getting certified as a drone pilot under DGCA guidelines. What are the batch start dates and scholarship options?',
    'New',
    'Follow up regarding upcoming weekend batch starting 15th.',
    '2026-10-04 10:15:00+00',
    '2026-10-04 10:15:00+00'
),
(
    '66f50002a1b2c3d4e5f60002',
    'Meera Patel',
    'meera.patel@agritechcorp.in',
    '+91 91234 56789',
    'Customer',
    'Agricultural Drone Spraying & Survey',
    'We have 250 acres of agricultural land in Gujarat requiring multispectral NDVI mapping and targeted nutrient spraying. Need a commercial quotation and pilot deployment schedule.',
    'In Progress',
    'Shared technical quotation. Commercial negotiation scheduled for Thursday.',
    '2026-10-03 14:30:00+00',
    '2026-10-05 11:00:00+00'
),
(
    '66f50003a1b2c3d4e5f60003',
    'Rohan Deshmukh',
    'rohan.films@studio.com',
    '+91 99887 76655',
    'Customer',
    'Aerial Cinematography & Live Broadcasting',
    'We are producing an outdoor sports documentary in Himachal Pradesh and need dual-operator heavy-lift cinema drones with RED Komodo integration for 5 shoot days.',
    'Contacted',
    'Contacted via phone. Verified equipment availability for shoot dates.',
    '2026-10-02 09:45:00+00',
    '2026-10-04 16:20:00+00'
),
(
    '66f50004a1b2c3d4e5f60004',
    'Ananya Nair',
    'ananya.nair@student.edu',
    '+91 97112 23344',
    'Student',
    'FPV Racing & Freestyle Masterclass',
    'I want to master manual acro mode and build my own 5-inch freestyle drone. Does the course include drone hardware kit assembly and flight simulator hours?',
    'Closed',
    'Enrolled in Batch 8 FPV Masterclass. Payment verified.',
    '2026-09-28 16:00:00+00',
    '2026-10-01 10:30:00+00'
),
(
    '66f50005a1b2c3d4e5f60005',
    'Vikramaditya Rao',
    'vikram.rao@infrasurvey.com',
    '+91 98450 12345',
    'Customer',
    'LiDAR Mapping & Topographical Surveying',
    'Need volumetric topographical surveying for a 45km highway expansion corridor. We require 3D point cloud and digital terrain models with high spatial accuracy.',
    'New',
    'Requires DGCA clearances and geodetic GCP benchmark plan.',
    '2026-10-05 08:20:00+00',
    '2026-10-05 08:20:00+00'
);
