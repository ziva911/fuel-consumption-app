-- MySQL dump 10.19  Distrib 10.3.29-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: fuel-consumption-db
-- ------------------------------------------------------
-- Server version	10.3.29-MariaDB-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrator`
--
DROP DATABASE IF EXISTS `fuel_consumption_db`;
CREATE DATABASE `fuel_consumption_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `fuel_consumption_db`;

DROP TABLE IF EXISTS `administrator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `administrator` (
  `administrator_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `administrator_email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_administrator_email` (`administrator_email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrator`
--

LOCK TABLES `administrator` WRITE;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` VALUES (2,'admin','$2b$12$AddT00BAtQgTiTcdF8zAwOdIeh/9NbHCtEidpylXVFmNEJnxD1erK');
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand`
--

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brand` (
  `brand_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand_logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`brand_id`),
  UNIQUE KEY `uq_brand_brand_name` (`brand_name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES (1,'BMW','https://brandslogo.net/wp-content/uploads/2015/09/bmw-flat-logo-vector-download.jpg'),(2,'Citroen','https://mpng.subpng.com/20180712/ueq/kisspng-citron-c3-jaguar-cars-land-rover-citroen-berlingo-5b476cce84a599.4014900315314075665433.jpg'),(3,'Audi','https://i.pinimg.com/originals/50/52/30/505230d66c8c8d44e4cb490958d1e280.png'),(6,'Opel','https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/082016/untitled-1_168.jpg');
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand_model`
--

DROP TABLE IF EXISTS `brand_model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brand_model` (
  `brand_model_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `brand_id` bigint(20) unsigned NOT NULL,
  `model_name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`brand_model_id`),
  KEY `fk_brand_model_brand_id` (`brand_id`),
  CONSTRAINT `fk_brand_model_brand_id` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`brand_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand_model`
--

LOCK TABLES `brand_model` WRITE;
/*!40000 ALTER TABLE `brand_model` DISABLE KEYS */;
INSERT INTO `brand_model` VALUES (1,1,'3 Series'),(2,2,'C4'),(3,1,'X6'),(4,3,'A8'),(8,6,'Astra'),(9,6,'Corsa');
/*!40000 ALTER TABLE `brand_model` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fuel_type`
--

DROP TABLE IF EXISTS `fuel_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fuel_type` (
  `fuel_type_id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`fuel_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fuel_type`
--

LOCK TABLES `fuel_type` WRITE;
/*!40000 ALTER TABLE `fuel_type` DISABLE KEYS */;
INSERT INTO `fuel_type` VALUES (1,'dizel'),(2,'benzin'),(3,'plin'),(9,'gas');
/*!40000 ALTER TABLE `fuel_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photo`
--

DROP TABLE IF EXISTS `photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photo` (
  `photo_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand_model_id` bigint(20) unsigned DEFAULT NULL,
  `manufacture_year` smallint(5) unsigned DEFAULT NULL,
  `paint_color` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'gray',
  `vehicle_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_vehicle_id` (`vehicle_id`),
  CONSTRAINT `fk_photo_vehicle_id` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photo`
--

LOCK TABLES `photo` WRITE;
/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` VALUES (57,'static/uploads/489c9575-56af-4ff3-9e18-2ad258327035-2021/06/489c9575-56af-4ff3-9e18-2ad258327035-audiA8.jpg',NULL,NULL,'gray',25),(58,'static/uploads/b22e6534-fa28-45d5-b6de-06be35687138-2021/06/b22e6534-fa28-45d5-b6de-06be35687138-redcitroenC4.jpg',2,2017,'red',NULL);
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refuel_history`
--

DROP TABLE IF EXISTS `refuel_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refuel_history` (
  `refuel_history_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `quantity` double NOT NULL DEFAULT 0,
  `total_cost` double NOT NULL DEFAULT 0,
  `is_full` tinyint(1) NOT NULL,
  `mileage_current` double NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `vehicle_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`refuel_history_id`),
  KEY `fk_refuel_history_vehicle_id` (`vehicle_id`),
  CONSTRAINT `fk_refuel_history_vehicle_id` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refuel_history`
--

LOCK TABLES `refuel_history` WRITE;
/*!40000 ALTER TABLE `refuel_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `refuel_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `modified_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `currency` enum('EUR','USD','RSD') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `language` enum('EN','SR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EN',
  `verified` tinyint(1) DEFAULT 0,
  `verification_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_user_user_email` (`user_email`),
  UNIQUE KEY `uq_user_phone_number` (`phone_number`),
  UNIQUE KEY `uq_user_verification_code` (`verification_code`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (32,'user1@localhost.com','Test ime','Test prezime','132456789','$2b$12$l.U8GWC2pjEnCF5ADOa9te6baPoagLImNd8jG5urb8PhA9QcYuL6m','2021-06-03 21:33:49','2021-06-03 21:28:50','USD','EN',1,'c71363f1-b224-45ae-8750-044d08adeb0f');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicle` (
  `vehicle_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `internal_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manufacture_year` smallint(5) unsigned NOT NULL,
  `paint_color` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mileage_start` double NOT NULL DEFAULT 0,
  `fuel_type_id` tinyint(3) unsigned NOT NULL,
  `brand_model_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `modifiead_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` bigint(20) unsigned NOT NULL,
  `last_refuel_date` date DEFAULT current_timestamp(),
  PRIMARY KEY (`vehicle_id`),
  KEY `fk_vehicle_fuel_type_id` (`fuel_type_id`),
  KEY `fk_vehicle_brand_model_brand_model_id` (`brand_model_id`),
  KEY `fk_vehicle_user_id` (`user_id`),
  CONSTRAINT `fk_vehicle_brand_model_brand_model_id` FOREIGN KEY (`brand_model_id`) REFERENCES `brand_model` (`brand_model_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_vehicle_fuel_type_id` FOREIGN KEY (`fuel_type_id`) REFERENCES `fuel_type` (`fuel_type_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_vehicle_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle`
--

LOCK TABLES `vehicle` WRITE;
/*!40000 ALTER TABLE `vehicle` DISABLE KEYS */;
INSERT INTO `vehicle` VALUES (25,'Moj mezimac',2018,'black',100000,2,4,'2021-06-03 21:38:47','2021-06-03 21:38:47',32,'2021-06-03');
/*!40000 ALTER TABLE `vehicle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'fuel-consumption-db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-03 23:54:10
