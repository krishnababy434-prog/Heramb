-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 08, 2025 at 11:20 AM
-- Server version: 8.0.42-0ubuntu0.24.04.2
-- PHP Version: 8.4.10

SET SQL_MODE = NO_AUTO_VALUE_ON_ZERO;
START TRANSACTION;
SET time_zone = +00:00;



--
-- Database: 
--

-- --------------------------------------------------------

--
-- Table structure for table 
--

CREATE TABLE  (
  uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL,
   int NOT NULL,
   int NOT NULL,
   int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table 
--

INSERT INTO  (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu), , , ) VALUES
(1, 1, 2, 1),
(2, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table 
--

CREATE TABLE  (
  uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL,
   varchar(255) NOT NULL,
   decimal(10,2) NOT NULL,
   varchar(500) DEFAULT NULL,
   datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table 
--

INSERT INTO  (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu), , , , ) VALUES
(1, 'combo ', 35.00, NULL, '2025-08-08 10:21:23');

-- --------------------------------------------------------

--
-- Table structure for table 
--

CREATE TABLE  (
  uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) bigint NOT NULL,
   varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
   enum('percentage','fixed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'percentage',
   decimal(10,2) NOT NULL,
   date NOT NULL,
   date NOT NULL,
   int DEFAULT NULL,
   int NOT NULL DEFAULT '0',
   tinyint(1) NOT NULL DEFAULT '1',
   int DEFAULT NULL,
   timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table 
--

CREATE TABLE  (
  uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL,
   varchar(255) NOT NULL,
   decimal(10,2) NOT NULL,
   text,
   int NOT NULL,
   varchar(255) DEFAULT NULL,
   datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table 
--

CREATE TABLE  (
  uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL,
   varchar(255) NOT NULL,
   varchar(50) NOT NULL,
   decimal(10,2) NOT NULL DEFAULT '0.00',
   decimal(10,2) DEFAULT NULL,
   datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table 
--

INSERT INTO  (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu), , , , , ) VALUES
(1, 'Cheese (kg)', 'kg', 10.00, 2.00, '2025-08-08 16:02:10'),
(2, 'Buns (pcs)', 'pcs', 200.00, 20.00, '2025-08-08 16:02:10');

-- --------------------------------------------------------

--
-- Table structure for table 
--

CREATE TABLE  (
  uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL,
   varchar(255) NOT NULL,
   text,
   decimal(10,2) NOT NULL,
   varchar(500) DEFAULT NULL,
   tinyint(1) NOT NULL DEFAULT '1',
   datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table 
--

INSERT INTO  (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu), , , , , , ) VALUES
(1, 'Vadapav', 'vada and Pav', 20.00, '/uploads/1754648390226-884408600.jpeg', 1, '2025-08-08 10:19:50'),
(2, 'Samosa', 'stuffed bread', 20.00, '/uploads/1754648462664-842279159.jpeg', 1, '2025-08-08 10:21:02'),
(3, 'Margherita Pizza', 'Classic cheese pizza', 249.00, NULL, 1, '2025-08-08 16:02:10'),
(4, 'Veg Burger', 'Veg patty burger', 129.00, NULL, 1, '2025-08-08 16:02:10');

-- --------------------------------------------------------

--
-- Table structure for table 
--

CREATE TABLE  (
  uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL,
   varchar(255) NOT NULL,
   varchar(50) DEFAULT NULL,
   decimal(10,2) NOT NULL,
   decimal(10,2) NOT NULL,
   decimal(10,2) NOT NULL,
   int NOT NULL,
   datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table 
--

CREATE TABLE  (
  uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL,
   int NOT NULL,
   int DEFAULT NULL,
   int DEFAULT NULL,
   int NOT NULL,
   decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table 
--

CREATE TABLE  (
   varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table 
--

INSERT INTO  () VALUES
('20250101000000-create-users.js'),
('20250101000010-create-menus.js'),
('20250101000020-create-combos.js'),
('20250101000030-create-orders-expenses-inventory.js');

-- --------------------------------------------------------

--
-- Table structure for table 
--

CREATE TABLE  (
  uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL,
   varchar(255) NOT NULL,
   varchar(255) NOT NULL,
   varchar(50) DEFAULT NULL,
   enum('admin','seller','manager') NOT NULL DEFAULT 'seller',
   varchar(255) NOT NULL,
   datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table 
--

INSERT INTO  (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu), , , , , , ) VALUES
(1, 'Admin', 'admin@example.com', '9999999999', 'admin', 'b0/HFJwEarDBBfetZuepuiAK.JHxzJye', '2025-08-08 10:15:28'),
(2, 'Hemant', 'hemant@heramb.com', NULL, 'seller', 'b0', '2025-08-08 10:17:43'),
(3, 'hemant', 'hemant@heramb.in', NULL, 'seller', 'b0.dMXeU08ejGzFlMikUBYsv66Y.AEgMVHI1xW', '2025-08-08 10:23:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table 
--
ALTER TABLE 
  ADD PRIMARY KEY (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)),
  ADD KEY  (),
  ADD KEY  ();

--
-- Indexes for table 
--
ALTER TABLE 
  ADD PRIMARY KEY (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu));

--
-- Indexes for table 
--
ALTER TABLE 
  ADD PRIMARY KEY (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)),
  ADD UNIQUE KEY  (),
  ADD UNIQUE KEY  (),
  ADD KEY  ();

--
-- Indexes for table 
--
ALTER TABLE 
  ADD PRIMARY KEY (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)),
  ADD KEY  (),
  ADD KEY  (),
  ADD KEY  (),
  ADD KEY  ();

--
-- Indexes for table 
--
ALTER TABLE 
  ADD PRIMARY KEY (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)),
  ADD KEY  (),
  ADD KEY  (),
  ADD KEY  (),
  ADD KEY  ();

--
-- Indexes for table 
--
ALTER TABLE 
  ADD PRIMARY KEY (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)),
  ADD KEY  (),
  ADD KEY  ();

--
-- Indexes for table 
--
ALTER TABLE 
  ADD PRIMARY KEY (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)),
  ADD KEY  (),
  ADD KEY  (),
  ADD KEY  (),
  ADD KEY  (),
  ADD KEY  (),
  ADD KEY  ();

--
-- Indexes for table 
--
ALTER TABLE 
  ADD PRIMARY KEY (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)),
  ADD KEY  (),
  ADD KEY  (),
  ADD KEY  ();

--
-- Indexes for table 
--
ALTER TABLE 
  ADD PRIMARY KEY (),
  ADD UNIQUE KEY  ();

--
-- Indexes for table 
--
ALTER TABLE 
  ADD PRIMARY KEY (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)),
  ADD UNIQUE KEY  (),
  ADD KEY  (),
  ADD KEY  (),
  ADD KEY  (),
  ADD KEY  (),
  ADD KEY  ();

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table 
--
ALTER TABLE 
  MODIFY uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table 
--
ALTER TABLE 
  MODIFY uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table 
--
ALTER TABLE 
  MODIFY uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table 
--
ALTER TABLE 
  MODIFY uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table 
--
ALTER TABLE 
  MODIFY uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table 
--
ALTER TABLE 
  MODIFY uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table 
--
ALTER TABLE 
  MODIFY uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table 
--
ALTER TABLE 
  MODIFY uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table 
--
ALTER TABLE 
  MODIFY uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu) int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table 
--
ALTER TABLE 
  ADD CONSTRAINT  FOREIGN KEY () REFERENCES  (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)) ON DELETE CASCADE,
  ADD CONSTRAINT  FOREIGN KEY () REFERENCES  (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)) ON DELETE CASCADE;

--
-- Constraints for table 
--
ALTER TABLE 
  ADD CONSTRAINT  FOREIGN KEY () REFERENCES  (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)) ON DELETE SET NULL;

--
-- Constraints for table 
--
ALTER TABLE 
  ADD CONSTRAINT  FOREIGN KEY () REFERENCES  (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu));

--
-- Constraints for table 
--
ALTER TABLE 
  ADD CONSTRAINT  FOREIGN KEY () REFERENCES  (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu));

--
-- Constraints for table 
--
ALTER TABLE 
  ADD CONSTRAINT  FOREIGN KEY () REFERENCES  (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)) ON DELETE CASCADE,
  ADD CONSTRAINT  FOREIGN KEY () REFERENCES  (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)) ON DELETE SET NULL,
  ADD CONSTRAINT  FOREIGN KEY () REFERENCES  (uid=1000(ubuntu) gid=1000(ubuntu) groups=1000(ubuntu)) ON DELETE SET NULL;
COMMIT;

