-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: charityevents_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `charitable_organisations`
--

DROP TABLE IF EXISTS `charitable_organisations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `charitable_organisations` (
  `organisation_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `contact_email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`organisation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charitable_organisations`
--

LOCK TABLES `charitable_organisations` WRITE;
/*!40000 ALTER TABLE `charitable_organisations` DISABLE KEYS */;
INSERT INTO `charitable_organisations` VALUES (1,'Red Cross Charitable Foundation','Commitment to medical charity organization','contact@redcross.org','123456789','https://www.redcross.org','2025-10-04 04:06:04'),(2,'Green Earth Environmental Protection Organization','A non-profit organization dedicated to environmental protection and sustainable development','info@greenearth.org','123478432','https://www.greenearth.org','2025-10-04 04:06:04'),(3,'Love Aid Association','Charitable organizations that provide assistance to the elderly and disadvantaged groups in society','support@loveaid.org','123467888','https://www.loveaid.org','2025-10-04 04:06:04'),(4,'China Children\'s Fund','National public welfare organization focusing on children\'s education and health; founded for 30 years, has helped over 1 million children','ccf@ccf.org.cn','010-12345678',NULL,'2025-10-02 09:11:19'),(5,'Urban Charity Alliance','Local public welfare organization focusing on urban stray animal rescue and community support, covering 20 first-tier cities','city-charity@example.com','021-87654321',NULL,'2025-10-02 09:11:19'),(6,'Green Environmental Fund','Focus on \"ecological environment protection\"; carry out public welfare activities such as afforestation and waste classification promotion, advocating sustainable development','green-fund@example.org','020-98765432',NULL,'2025-10-02 09:11:19'),(7,'Rural Education Association','Dedicated to improving rural education resources; donate teaching aids and train teachers for schools in remote areas, covering 500 rural schools','rural-edu@example.com','0731-23456789',NULL,'2025-10-02 09:11:19'),(8,'Elderly Care Charity Center','Focus on the quality of life of the elderly; provide free medical check-ups and community elderly care services, and regularly organize elderly cultural activities','elderly-care@example.com','022-34567890',NULL,'2025-10-02 09:11:19');
/*!40000 ALTER TABLE `charitable_organisations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-02 17:21:23
