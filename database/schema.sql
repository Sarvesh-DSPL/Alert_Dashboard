-- Smart Facility Monitoring Dashboard
-- Schema for MySQL / MariaDB

CREATE DATABASE IF NOT EXISTS smart_facility_monitoring
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_facility_monitoring;

-- =========================================================
-- FACILITIES
-- =========================================================
CREATE TABLE IF NOT EXISTS facilities (
  id           INT            NOT NULL AUTO_INCREMENT,
  name         VARCHAR(150)   NOT NULL,
  location     VARCHAR(255)   NOT NULL,
  area_count   INT            NOT NULL DEFAULT 0,
  camera_count INT            NOT NULL DEFAULT 0,
  areas        JSON           NOT NULL DEFAULT ('[]'),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- ALERTS
-- =========================================================
CREATE TABLE IF NOT EXISTS alerts (
  id          INT          NOT NULL AUTO_INCREMENT,
  type        VARCHAR(150) NOT NULL,
  facility_id INT          NOT NULL,
  area        VARCHAR(150) NOT NULL,
  severity    ENUM('Low','Medium','High','Critical') NOT NULL,
  status      ENUM('Active','Acknowledged','Resolved') NOT NULL DEFAULT 'Active',
  description TEXT         NOT NULL,
  created_at  DATETIME     NOT NULL,
  updated_at  DATETIME     NOT NULL,
  PRIMARY KEY (id),
  INDEX idx_facility_id (facility_id),
  INDEX idx_severity    (severity),
  INDEX idx_status      (status),
  INDEX idx_created_at  (created_at),
  CONSTRAINT fk_alerts_facility
    FOREIGN KEY (facility_id)
    REFERENCES facilities (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
