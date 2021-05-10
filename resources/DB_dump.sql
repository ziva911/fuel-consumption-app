DROP DATABASE IF EXISTS `fuel_consumption_db`;
CREATE DATABASE `fuel_consumption_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `fuel_consumption_db`;
CREATE TABLE `brand` (
  `brand_id` bigint(20) unsigned NOT NULL,
  `brand_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`brand_id`),
  UNIQUE KEY `uq_brand_brand_name` (`brand_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `brand_model` (
  `brand_model_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `brand_id` bigint(20) unsigned NOT NULL,
  `model_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`brand_model_id`),
  KEY `fk_brand_model_brand_id` (`brand_id`),
  CONSTRAINT `fk_brand_model_brand_id` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`brand_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `fuel_type` (
  `fuel_type_id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `fuel_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`fuel_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `user` (
  `user_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_phone_number` (`phone_number`),
  UNIQUE KEY `uq_user_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `vehicle` (
  `vehicle_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `internal_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `manufacture_year` smallint(5) unsigned NOT NULL,
  `paint_color` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mileage_start` double NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fuel_type_id` tinyint(3) unsigned NOT NULL,
  `fuel_extra` double DEFAULT 0,
  `mileage_current` double NOT NULL,
  `brand_model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`vehicle_id`),
  KEY `fk_vehicle_fuel_type_id` (`fuel_type_id`),
  KEY `fk_vehicle_brand_model_id` (`brand_model_id`),
  CONSTRAINT `fk_vehicle_brand_model_id` FOREIGN KEY (`brand_model_id`) REFERENCES `brand_model` (`brand_model_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_vehicle_fuel_type_id` FOREIGN KEY (`fuel_type_id`) REFERENCES `fuel_type` (`fuel_type_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `user_vehicle` (
  `user_vehicle_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`user_vehicle_id`),
  UNIQUE KEY `uq_user_vehicle_vehicle_id` (`vehicle_id`),
  KEY `fk_user_vehicle_user_id` (`user_id`),
  CONSTRAINT `fk_user_vehicle_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_user_vehicle_vehicle_id` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `refuel_history` (
  `refuel_history_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `liters` double NOT NULL DEFAULT 0,
  `price_per_liter` double NOT NULL DEFAULT 0,
  `is_full` tinyint(1) NOT NULL,
  `mileage_current` double NOT NULL,
  `user_vehicle_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`refuel_history_id`),
  KEY `fk_refuel_history_user_vehicle_id` (`user_vehicle_id`),
  CONSTRAINT `fk_refuel_history_user_vehicle_id` FOREIGN KEY (`user_vehicle_id`) REFERENCES `user_vehicle` (`user_vehicle_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

