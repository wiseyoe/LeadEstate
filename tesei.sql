-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 06, 2026 at 04:58 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `leadestate`
--

-- --------------------------------------------------------

--
-- Table structure for table `follow_ups`
--

CREATE TABLE `follow_ups` (
  `id` int(11) NOT NULL,
  `lead_id` int(11) NOT NULL,
  `sales_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `followup_date` datetime DEFAULT NULL,
  `status` enum('pending','done','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `follow_ups`
--

INSERT INTO `follow_ups` (`id`, `lead_id`, `sales_id`, `notes`, `followup_date`, `status`, `created_at`) VALUES
(1, 1, 2, 'Follow up pertama', '2026-04-07 14:08:37', 'pending', '2026-04-06 14:08:37'),
(2, 2, 2, 'Sudah direspon', '2026-04-05 14:08:37', 'done', '2026-04-06 14:08:37'),
(3, 3, 4, 'Tanya detail rumah', '2026-04-06 14:08:37', 'pending', '2026-04-06 14:08:37'),
(4, 4, 4, 'Sedang nego', '2026-04-04 14:08:37', 'pending', '2026-04-06 14:08:37'),
(5, 5, 2, 'Lost contact', '2026-04-08 14:08:37', 'cancelled', '2026-04-06 14:08:37'),
(6, 6, 6, 'Client minta brosur via email', '2026-04-09 10:00:00', 'pending', '2026-04-06 14:51:54'),
(7, 7, 7, 'Sudah deal, tinggal proses DP', '2026-04-06 16:30:00', 'done', '2026-04-06 14:51:54'),
(8, 8, 8, 'Menunggu keputusan keluarga', '2026-04-10 13:15:00', 'pending', '2026-04-06 14:51:54'),
(9, 9, 9, 'Harga masih dinegosiasikan', '2026-04-07 11:45:00', 'pending', '2026-04-06 14:51:54'),
(10, 10, 10, 'Tidak tertarik dengan lokasi', '2026-04-06 09:20:00', 'cancelled', '2026-04-06 14:51:54');

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `property_id` int(11) DEFAULT NULL,
  `sales_id` int(11) DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `source` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`id`, `name`, `phone`, `email`, `property_id`, `sales_id`, `status_id`, `source`, `created_at`) VALUES
(1, 'Jane Doe', '0811111', 'jane@mail.com', 1, 2, 1, 'Instagram', '2026-04-06 14:08:37'),
(2, 'Neps', '0822222', 'neps@mail.com', 2, 2, 2, 'Website', '2026-04-06 14:08:37'),
(3, 'Mydeimos', '0833333', 'mydei@mail.com', 3, 4, 3, 'Whatsapp', '2026-04-06 14:08:37'),
(4, 'Cyrene', '0844444', 'cyrene@mail.com', 5, 4, 4, 'Facebook', '2026-04-06 14:08:37'),
(5, 'Growy', '0855555', 'growy@mail.com', 4, 2, 6, 'Referral', '2026-04-06 14:08:37'),
(6, 'Aditya Syachputra', '0822222234', 'AdityaShadowKilerz@gmail.com', 9, 6, 1, 'Facebook', '2026-04-06 14:42:04'),
(7, 'Leon', '081298765431', 'leonskenedy@mail.com', 7, 7, 1, 'Instagram', '2026-04-06 14:42:58'),
(8, 'Kael ', '083176543219', 'kael.vortigan@mail.com', 8, 8, 3, 'Website', '2026-04-06 14:42:58'),
(9, 'Nayra ', '084165432198', 'nayra.elowen@mail.com', 6, 9, 4, 'Facebook', '2026-04-06 14:42:58'),
(10, 'Damarion ', '085154321987', 'damarion.z@mail.com', 10, 10, 5, 'Referral', '2026-04-06 14:42:58');

-- --------------------------------------------------------

--
-- Table structure for table `lead_status`
--

CREATE TABLE `lead_status` (
  `id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lead_status`
--

INSERT INTO `lead_status` (`id`, `status_name`) VALUES
(1, 'New Lead'),
(2, 'Contacted'),
(3, 'Follow Up'),
(4, 'Negotiation'),
(5, 'Closed'),
(6, 'Lost');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`) VALUES
(1, 'view_all', 'Bisa melihat semua data'),
(2, 'create_data', 'Bisa menambah data baru'),
(3, 'edit_data', 'Bisa mengubah data'),
(4, 'delete_data', 'Bisa menghapus data'),
(5, 'manage_users', 'Bisa mengelola akun staff');

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `location` varchar(200) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`id`, `name`, `location`, `price`, `created_at`) VALUES
(1, 'Mansion AHA', 'Bandung', 5000000000.00, '2026-04-06 14:08:37'),
(2, 'Penthouse Kai', 'Jakarta', 3000000000.00, '2026-04-06 14:08:37'),
(3, 'Malfoy Manor', 'Bogor', 10000000000.00, '2026-04-06 14:08:37'),
(4, 'The Burrow', 'Depok', 2000000000.00, '2026-04-06 14:08:37'),
(5, 'Batcave', 'Gotham', 15000000000.00, '2026-04-06 14:08:37'),
(6, 'Okhema', 'Amphoreus', 3355033600.00, '2026-04-06 14:35:34'),
(7, 'Game House', 'Tangerang', 6000000000.00, '2026-04-06 14:35:34'),
(8, 'Linebell', 'katapang', 4206900000.00, '2026-04-06 14:35:34'),
(9, 'Restodikopo', 'kopo', 10000.00, '2026-04-06 14:35:34'),
(10, 'Avenger Tower', 'New york city', 7889612942830.00, '2026-04-06 14:35:34');

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

CREATE TABLE `reminders` (
  `id` int(11) NOT NULL,
  `followup_id` int(11) NOT NULL,
  `reminder_date` datetime DEFAULT NULL,
  `status` enum('pending','done') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reminders`
--

INSERT INTO `reminders` (`id`, `followup_id`, `reminder_date`, `status`) VALUES
(1, 1, '2026-04-07 14:08:37', 'pending'),
(2, 2, '2026-04-05 14:08:37', 'done'),
(3, 3, '2026-04-11 14:08:37', 'pending'),
(4, 4, '2026-04-04 14:08:37', 'pending'),
(5, 5, '2026-04-09 14:08:37', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `description`) VALUES
(1, 'Admin', 'Full access to all features'),
(2, 'Supervisor', 'Manage leads and view reports'),
(3, 'Sales', 'Input and follow up own leads');

-- --------------------------------------------------------

--
-- Table structure for table `role_permission`
--

CREATE TABLE `role_permission` (
  `role_id` int(11) NOT NULL,
  `perm_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role_permission`
--

INSERT INTO `role_permission` (`role_id`, `perm_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 1),
(2, 2),
(2, 3),
(3, 1),
(3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role_id`, `created_at`) VALUES
(1, 'Kepin', 'kepin@gmail.com', '12345', 1, '2026-04-06 14:08:37'),
(2, 'Fathan', 'fathan@gmail.com', '12345', 3, '2026-04-06 14:08:37'),
(3, 'Firasy', 'firasy@gmail.com', '12345', 1, '2026-04-06 14:08:37'),
(4, 'Rafi', 'rafi@gmail.com', '12345', 3, '2026-04-06 14:08:37'),
(5, 'John', 'john@gmail.com', '12345', 2, '2026-04-06 14:08:37'),
(6, 'Jane Juliet', 'JaneImpal@gmail.com', '12345', 2, '2026-04-06 14:20:26'),
(7, 'Bezos', 'JeffAsli@gmail.com', '12345', 1, '2026-04-06 14:20:26'),
(8, 'Ilania', 'Ilania@gmail.com', '12345', 2, '2026-04-06 14:20:26'),
(9, 'Nicole', 'NicoleReeyn@gmail.com', '12345', 3, '2026-04-06 14:20:26'),
(10, 'Socrates', 'Socratesril@gmail.com', '12345', 1, '2026-04-06 14:20:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `follow_ups`
--
ALTER TABLE `follow_ups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lead_id` (`lead_id`),
  ADD KEY `sales_id` (`sales_id`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_id` (`property_id`),
  ADD KEY `sales_id` (`sales_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `lead_status`
--
ALTER TABLE `lead_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `followup_id` (`followup_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD PRIMARY KEY (`role_id`,`perm_id`),
  ADD KEY `perm_id` (`perm_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `follow_ups`
--
ALTER TABLE `follow_ups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `leads`
--
ALTER TABLE `leads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `lead_status`
--
ALTER TABLE `lead_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `reminders`
--
ALTER TABLE `reminders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `follow_ups`
--
ALTER TABLE `follow_ups`
  ADD CONSTRAINT `follow_ups_ibfk_1` FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `follow_ups_ibfk_2` FOREIGN KEY (`sales_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `leads`
--
ALTER TABLE `leads`
  ADD CONSTRAINT `leads_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `leads_ibfk_2` FOREIGN KEY (`sales_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `leads_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `lead_status` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `reminders`
--
ALTER TABLE `reminders`
  ADD CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`followup_id`) REFERENCES `follow_ups` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD CONSTRAINT `role_permission_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permission_ibfk_2` FOREIGN KEY (`perm_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
