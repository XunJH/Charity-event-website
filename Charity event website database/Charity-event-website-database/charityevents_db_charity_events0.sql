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
-- Table structure for table `charity_events`
--

DROP TABLE IF EXISTS `charity_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `charity_events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `full_description` text,
  `event_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `location` varchar(500) NOT NULL,
  `venue_name` varchar(255) DEFAULT NULL,
  `organisation_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `ticket_price` decimal(10,2) DEFAULT '0.00',
  `max_attendees` int DEFAULT NULL,
  `current_attendees` int DEFAULT '0',
  `fundraising_goal` decimal(15,2) DEFAULT NULL,
  `current_funds` decimal(15,2) DEFAULT '0.00',
  `event_purpose` text,
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_suspended` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `organisation_id` (`organisation_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `charity_events_ibfk_1` FOREIGN KEY (`organisation_id`) REFERENCES `charitable_organisations` (`organisation_id`),
  CONSTRAINT `charity_events_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `event_categories` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `charity_events`
--

LOCK TABLES `charity_events` WRITE;
/*!40000 ALTER TABLE `charity_events` DISABLE KEYS */;
INSERT INTO `charity_events` VALUES (1,'Red Cross Annual Gala 2025','Annual Red Cross Charity Gala raising funds for medical assistance','Join us for an elegant evening of fine dining, live entertainment, and inspiring stories. All proceeds will support Red Cross medical assistance programs and emergency relief efforts worldwide.','2025-12-10 19:00:00','2025-12-10 23:30:00','Grand Convention Center, Sydney','Main Ballroom',1,1,200.00,250,0,75000.00,25000.00,'Supporting medical assistance and emergency relief programs','/images/redcross-gala.jpg',1,0,'2025-09-30 05:10:04','2025-09-30 05:10:04'),(2,'Green Earth Marathon 2025','City marathon for environmental protection awareness','Run for a greener future! Join thousands of participants in this annual marathon to raise awareness and funds for environmental protection initiatives. Includes full marathon, half marathon, and 5K fun run options.','2025-11-15 07:00:00','2025-11-15 14:00:00','City Center to Coastal Park','Start Line - City Square',2,2,35.00,2000,0,50000.00,18000.00,'Raising funds for environmental protection and conservation projects','/images/green-marathon.jpg',1,0,'2025-09-30 05:10:04','2025-09-30 05:10:04'),(3,'Love Aid Senior Care Workshop','Educational workshop on elderly care and support','Learn essential skills and knowledge for providing quality care to elderly family members and community seniors. Topics include health monitoring, emotional support, and daily assistance techniques.','2025-10-20 13:00:00','2025-10-20 17:00:00','Community Health Center','Training Room B',3,5,20.00,80,0,5000.00,1200.00,'Educating community members on proper elderly care techniques','/images/senior-workshop.jpg',1,0,'2025-09-30 05:10:04','2025-09-30 05:10:04'),(4,'Red Cross Emergency Relief Auction','Online auction for emergency relief funding','Bid on exclusive items and experiences donated by generous supporters. All funds raised will directly support Red Cross emergency relief operations and disaster response teams.','2025-11-01 09:00:00','2025-11-07 21:00:00','Online Event','Red Cross Auction Platform',1,3,0.00,NULL,0,30000.00,8500.00,'Funding emergency relief and disaster response operations','/images/relief-auction.jpg',1,0,'2025-09-30 05:10:04','2025-09-30 05:10:04'),(5,'Green Earth Recycling Awareness Concert','Live concert promoting recycling and sustainability','Enjoy performances by popular local artists while learning about recycling and sustainable living. The event features eco-friendly practices and educational booths.','2025-09-25 18:00:00','2025-09-25 22:00:00','Riverside Amphitheater','Main Stage',2,4,40.00,500,0,25000.00,9200.00,'Promoting recycling awareness and sustainable practices','/images/eco-concert.jpg',1,0,'2025-09-30 05:10:04','2025-09-30 05:10:04'),(6,'Love Aid Community Market Day','Community market supporting elderly services','Shop for handmade crafts, fresh produce, and delicious homemade foods. All vendors are local community members and all proceeds support Love Aid elderly assistance programs.','2025-12-05 08:00:00','2025-12-05 16:00:00','Local Community Park','Market Square',3,6,0.00,NULL,0,15000.00,4200.00,'Funding elderly assistance and community support programs','/images/community-market.jpg',1,0,'2025-09-30 05:10:04','2025-09-30 05:10:04'),(7,'Red Cross First Aid Training','Comprehensive first aid certification course','Learn life-saving first aid skills from certified Red Cross instructors. Course includes CPR, emergency response, and basic medical assistance. Certification valid for 2 years.','2025-10-08 09:00:00','2025-10-08 17:00:00','Red Cross Training Center','Training Hall A',1,5,80.00,30,0,4000.00,2800.00,'Providing essential first aid training to community members','/images/firstaid-training.jpg',1,0,'2025-09-30 05:10:04','2025-09-30 05:10:04'),(8,'Green Earth Tree Planting Festival','Community tree planting and environmental festival','Join us for a day of environmental action and community building. Plant native trees, learn about local ecosystems, and enjoy family-friendly environmental activities.','2025-09-30 10:00:00','2025-09-30 16:00:00','National Park Reserve','Visitor Center Area',2,2,0.00,300,0,10000.00,3500.00,'Reforestation and environmental education initiatives','/images/tree-planting.jpg',1,0,'2025-09-30 05:10:04','2025-09-30 05:10:04');
/*!40000 ALTER TABLE `charity_events` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-01 14:13:12
