CREATE DATABASE  IF NOT EXISTS `bamazon_db` 

USE `bamazon_db`;


CREATE TABLE `products` (
  `id` int(11) INT AUTO_INCREMENT,
  `product_name` varchar(100) NOT NULL,
  `department_name` varchar(100),
  `price` DECIMAL (10,2) NOT NULL,
  `stock_quanity` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) 
INSERT INTO `products` VALUES (1,'soap','Housing',2,100),(2,'tissue','Housing',7,100),(3,'socks','Clothing',10,100),(4,'juice','Food',3,100),(5,'soil','Planting',9,100),(6,'strawberries','Food',5,100),(7,'birthday cards','Arts and Craft',4,100),(8,'pizza','Food',10,100),(9,'boots','Clothing',200,100),(10,'computer','Technology',1000,100);