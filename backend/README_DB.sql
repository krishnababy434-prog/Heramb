-- SQL DDL reference for MySQL (herambdb)
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 09, 2025 at 03:33 AM
-- Server version: 8.0.42-0ubuntu0.24.04.2
-- PHP Version: 8.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `herambdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `combo_items`
--

CREATE TABLE `combo_items` (
  `id` int NOT NULL,
  `combo_id` int NOT NULL,
  `menu_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `combo_items`
--

INSERT INTO `combo_items` (`id`, `combo_id`, `menu_id`, `quantity`) VALUES
(1, 1, 2, 1),
(2, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `combo_menus`
--

CREATE TABLE `combo_menus` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `combo_menus`
--

INSERT INTO `combo_menus` (`id`, `name`, `price`, `photo_url`, `created_at`) VALUES
(1, 'combo ', 35.00, NULL, '2025-08-08 10:21:23');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` bigint NOT NULL,
  `code` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('percentage','fixed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'percentage',
  `value` decimal(10,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `usage_limit` int DEFAULT NULL,
  `used_count` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `note` text,
  `employee_id` int NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT '0.00',
  `threshold_alert` decimal(10,2) DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `name`, `unit`, `quantity`, `threshold_alert`, `updated_at`) VALUES
(1, 'Cheese (kg)', 'kg', 10.00, 2.00, '2025-08-08 16:02:10'),
(2, 'Buns (pcs)', 'pcs', 200.00, 20.00, '2025-08-08 16:02:10');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `name`, `description`, `price`, `photo_url`, `is_available`, `created_at`) VALUES
(1, 'Vadapav', 'vada and Pav', 20.00, '/uploads/1754648390226-884408600.jpeg', 1, '2025-08-08 10:19:50'),
(2, 'Samosa', 'stuffed bread', 20.00, '/uploads/1754648462664-842279159.jpeg', 1, '2025-08-08 10:21:02'),
(3, 'Margherita Pizza', 'Classic cheese pizza', 249.00, NULL, 1, '2025-08-08 16:02:10'),
(4, 'Veg Burger', 'Veg patty burger', 129.00, NULL, 1, '2025-08-08 16:02:10');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `mobile` varchar(50) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_by` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('draft','submitted','cancelled') NOT NULL DEFAULT 'draft',
  `discount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `coupon_code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_name`, `mobile`, `subtotal`, `tax`, `total`, `created_by`, `created_at`, `status`, `discount`, `coupon_code`) VALUES
(1, 'Walk-in', NULL, 0.00, 0.00, 0.00, 3, '2025-08-09 03:32:11', 'draft', 0.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `menu_id` int DEFAULT NULL,
  `combo_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `SequelizeMeta`
--

INSERT INTO `SequelizeMeta` (`name`) VALUES
('20250101000000-create-users.js'),
('20250101000010-create-menus.js'),
('20250101000020-create-combos.js'),
('20250101000030-create-orders-expenses-inventory.js'),
('20250101000040-create-coupons.js');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(50) DEFAULT NULL,
  `role` enum('admin','seller','manager') NOT NULL DEFAULT 'seller',
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `mobile`, `role`, `password_hash`, `created_at`) VALUES
(1, 'Admin', 'admin@example.com', '9999999999', 'admin', '$2b$10$DIJyHFY5sK0e14Dmnlhiau4/HFJwEarDBBfetZuepuiAK.JHxzJye', '2025-08-08 10:15:28'),
(2, 'Hemant', 'hemant@heramb.com', NULL, 'seller', '$2b$10$oTsnm9v7blH9BlanTAjyoOHx2PV4Exkc1o7RuAkREQiG3mIYaCvV2', '2025-08-08 10:17:43'),
(3, 'hemant', 'hemant@heramb.in', NULL, 'seller', '$2b$10$Twg9UHjE3n8K6ppPA.dMXeU08ejGzFlMikUBYsv66Y.AEgMVHI1xW', '2025-08-08 10:23:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `combo_items`
--
ALTER TABLE `combo_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `combo_id` (`combo_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexes for table `combo_menus`
--
ALTER TABLE `combo_menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `uq_coupon_code` (`code`),
  ADD KEY `fk_coupons_created_by` (`created_by`),
  ADD KEY `coupons_code` (`code`),
  ADD KEY `coupons_is_active` (`is_active`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_expenses_employee_id` (`employee_id`),
  ADD KEY `idx_expenses_created_at` (`created_at`),
  ADD KEY `expenses_employee_id` (`employee_id`),
  ADD KEY `expenses_created_at` (`created_at`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_inventory_name` (`name`),
  ADD KEY `idx_inventory_updated_at` (`updated_at`),
  ADD KEY `inventory_name` (`name`),
  ADD KEY `inventory_updated_at` (`updated_at`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_menus_created_at` (`created_at`),
  ADD KEY `menus_created_at` (`created_at`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_orders_created_by` (`created_by`),
  ADD KEY `idx_orders_created_at` (`created_at`),
  ADD KEY `idx_orders_mobile` (`mobile`),
  ADD KEY `orders_created_by` (`created_by`),
  ADD KEY `orders_created_at` (`created_at`),
  ADD KEY `orders_mobile` (`mobile`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `menu_id` (`menu_id`),
  ADD KEY `combo_id` (`combo_id`);

--
-- Indexes for table `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_created_at` (`created_at`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `users_email` (`email`),
  ADD KEY `users_role` (`role`),
  ADD KEY `users_created_at` (`created_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `combo_items`
--
ALTER TABLE `combo_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `combo_menus`
--
ALTER TABLE `combo_menus`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `combo_items`
--
ALTER TABLE `combo_items`
  ADD CONSTRAINT `combo_items_ibfk_1` FOREIGN KEY (`combo_id`) REFERENCES `combo_menus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `combo_items_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coupons`
--
ALTER TABLE `coupons`
  ADD CONSTRAINT `fk_coupons_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`combo_id`) REFERENCES `combo_menus` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;