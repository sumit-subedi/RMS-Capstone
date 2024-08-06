-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2024 at 08:51 PM
-- Server version: 11.4.2-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restaurant_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `active_orders`
--

CREATE TABLE `active_orders` (
  `active_order_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `table_id` int(11) DEFAULT NULL,
  `status` enum('in_progress','ready_to_finalize') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `active_order_items`
--

CREATE TABLE `active_order_items` (
  `active_order_item_id` int(11) NOT NULL,
  `active_order_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `expense_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `expense_type` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` date NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`expense_id`, `user_id`, `expense_type`, `amount`, `date`, `description`, `created_at`) VALUES
(1, 3, 'Inventory', 500.00, '2024-07-01', 'Weekly grocery purchase', '2024-07-01 21:30:19'),
(2, 3, 'Utilities', 200.00, '2024-07-01', 'Electricity bill', '2024-07-01 21:30:19');

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `item_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category` enum('Appetizer','Main Course','Dessert','Beverage','Other') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`item_id`, `name`, `description`, `price`, `is_available`, `created_at`, `updated_at`, `category`) VALUES
(1, 'Margherita Pizza', 'Classic tomato and mozzarella pizzassssss', 15.00, 1, '2024-07-01 21:30:19', '2024-07-07 18:35:08', 'Main Course'),
(2, 'Pepperoni Pizza', 'Pizza with tomato sauce, mozzarella, and pepperoni', 16.99, 1, '2024-07-01 21:30:19', '2024-08-04 03:40:18', 'Main Course'),
(3, 'Caesar Salad', 'Romaine lettuce with Caesar dressing and croutons', 8.99, 1, '2024-07-01 21:30:19', '2024-07-01 21:30:19', 'Appetizer'),
(4, 'Spaghetti Bolognese', 'Spaghetti with meat sauce', 13.99, 1, '2024-07-01 21:30:19', '2024-07-01 21:30:19', 'Appetizer'),
(5, 'Tiramisu', 'Classic Italian coffee-flavored dessert', 6.99, 1, '2024-07-01 21:30:19', '2024-07-08 03:14:39', 'Beverage'),
(9, 'Mo:Mo', 'It is a very tasty dumpling made in nepali style.', 12.99, 1, '2024-07-08 03:14:20', '2024-07-08 03:14:20', 'Main Course'),
(10, 'Soda', 'Refreshing drink. For something for your food.\n', 3.99, 1, '2024-07-08 03:15:19', '2024-07-08 03:15:19', 'Beverage');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `table_identifier` varchar(255) NOT NULL,
  `status` enum('completed','cancelled') NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT 0.00,
  `tax` decimal(10,2) DEFAULT 0.00,
  `grand_total` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_name`, `table_identifier`, `status`, `total_amount`, `created_at`, `completed_at`, `discount`, `tax`, `grand_total`) VALUES
(26, 'Uma Orange', 'V22', 'cancelled', 75.00, '2024-07-04 17:35:35', NULL, 0.00, 0.00, 0.00),
(32, 'Unknown', 'Lower Level Table 1', 'completed', 16.95, '2024-07-29 01:41:49', '2024-07-29 01:53:06', 0.00, 0.00, 16.95),
(33, 'Unknown', 'Table 2 - Lower Level', 'completed', 46.30, '2024-07-29 12:00:05', '2024-07-29 12:30:12', 0.00, 0.00, 46.30),
(34, 'Unknown', 'Table 2 - Lower Level', 'completed', 21.91, '2024-07-29 12:34:01', '2024-07-29 12:35:50', 10.00, 0.00, 31.91),
(35, 'Unknown', 'Lower Level Table 1', 'completed', 16.95, '2024-07-29 12:36:47', '2024-07-29 12:38:10', 0.00, 0.00, 16.95),
(36, 'Unknown', 'Lower Level Table 1', 'completed', 70.05, '2024-08-04 02:54:46', '2024-08-04 03:34:59', 0.00, 0.00, 70.05),
(37, 'waiter1', 'Lower Level Table 1', 'completed', 16.95, '2024-08-04 04:13:30', '2024-08-04 04:14:39', 0.00, 0.00, 16.95);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price_at_order` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `item_name`, `quantity`, `price_at_order`) VALUES
(19, 32, 'Margherita Pizza', 1, 15.00),
(20, 33, 'Mo:Mo', 1, 12.99),
(21, 33, 'Spaghetti Bolognese', 2, 13.99),
(23, 34, 'Pepperoni Pizza', 1, 16.99),
(24, 34, 'Spaghetti Bolognese', 1, 13.99),
(26, 35, 'Margherita Pizza', 1, 15.00),
(27, 36, 'Margherita Pizza', 3, 15.00),
(28, 36, 'Pepperoni Pizza', 1, 16.99),
(30, 37, 'Margherita Pizza', 1, 15.00);

-- --------------------------------------------------------

--
-- Table structure for table `sales_reports`
--

CREATE TABLE `sales_reports` (
  `report_id` int(11) NOT NULL,
  `report_date` date NOT NULL,
  `total_sales` decimal(10,2) NOT NULL,
  `total_orders` int(11) NOT NULL,
  `average_order_value` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `sales_reports`
--

INSERT INTO `sales_reports` (`report_id`, `report_date`, `total_sales`, `total_orders`, `average_order_value`, `created_at`) VALUES
(1, '2024-07-01', 35.97, 1, 35.97, '2024-07-01 21:30:19');

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `table_id` int(11) NOT NULL,
  `table_identifier` varchar(255) NOT NULL,
  `seats` int(11) NOT NULL,
  `status` enum('available','occupied','reserved') NOT NULL DEFAULT 'available',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`table_id`, `table_identifier`, `seats`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Lower Level Table 1', 5, 'available', '2024-07-07 20:09:14', '2024-08-04 04:14:39'),
(4, 'Table 2 - Lower Level', 4, 'available', '2024-07-29 02:57:03', '2024-07-29 12:35:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `role` enum('waiter','receptionist','admin') NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `email`, `full_name`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'waiter1', '$2b$10$3u.9j/oCsXudC2sbnIJRSeKtDN59gaCd1mK5SRVSgK7fVFgEX0zM6', 'john@example.com', 'John Doehhhh', 'waiter', 1, '2024-07-01 21:30:19', '2024-07-28 02:17:46'),
(2, 'reception', '$2b$10$Cn.0lKl8eB48fubbhB6Io.wfsF9Kqw9LYxnSt4rU0PRUFNTkSES62', 'sarah@example.comjj', 'Sarah Smith', 'receptionist', 1, '2024-07-01 21:30:19', '2024-07-28 02:25:54'),
(3, 'admin1', '$2a$12$JYChrMwkJYRJJ5lxZTirB.w0i.AdC.mD.kYvlhPjDkEMUyFFi.PVi', 'mike@example.com', 'Mike Johnsoning', 'admin', 1, '2024-07-01 21:30:19', '2024-07-08 01:09:11'),
(4, 'test', '$2b$10$fflrqoPrAoOPL9V8OgUgNuPfr/EQl4knQZc5WNi8u2tUmJvnkp2WG', 'test@gmail.com', 'test user', 'waiter', 0, '2024-07-08 01:04:24', '2024-07-08 01:04:29'),
(5, 'test1 test 2', '$2b$10$kfN6J9.8hKqDj9HTlMw4SuX3pypHmfmcCGaW7kPSWVVQWmSHPzYN6', 'test1test2@gmail.com', 'test user123', 'waiter', 1, '2024-07-08 12:32:38', '2024-07-08 12:33:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `active_orders`
--
ALTER TABLE `active_orders`
  ADD PRIMARY KEY (`active_order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `table_id` (`table_id`);

--
-- Indexes for table `active_order_items`
--
ALTER TABLE `active_order_items`
  ADD PRIMARY KEY (`active_order_item_id`),
  ADD KEY `active_order_id` (`active_order_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expense_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `sales_reports`
--
ALTER TABLE `sales_reports`
  ADD PRIMARY KEY (`report_id`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`table_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `active_orders`
--
ALTER TABLE `active_orders`
  MODIFY `active_order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `active_order_items`
--
ALTER TABLE `active_order_items`
  MODIFY `active_order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expense_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `sales_reports`
--
ALTER TABLE `sales_reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `table_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `active_orders`
--
ALTER TABLE `active_orders`
  ADD CONSTRAINT `active_orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `active_orders_ibfk_2` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_id`);

--
-- Constraints for table `active_order_items`
--
ALTER TABLE `active_order_items`
  ADD CONSTRAINT `active_order_items_ibfk_1` FOREIGN KEY (`active_order_id`) REFERENCES `active_orders` (`active_order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `active_order_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `menu_items` (`item_id`);

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
