-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 18 juil. 2025 à 15:18
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion-badges-aeroport`
--

-- --------------------------------------------------------

--
-- Structure de la table `badge_requests`
--

CREATE TABLE `badge_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `requested_zones` text NOT NULL,
  `valid_from` date NOT NULL,
  `valid_until` date NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `admin_comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `badge_requests`
--

INSERT INTO `badge_requests` (`id`, `user_id`, `type`, `requested_zones`, `valid_from`, `valid_until`, `status`, `admin_comment`, `created_at`, `updated_at`) VALUES
(5, 1, '1_year', 'terminal,cargo,airside,maintenance', '2025-07-17', '2026-07-17', 'approved', 'Yes', '2025-07-17 14:01:21', '2025-07-17 14:55:41'),
(6, 2, '1_week', 'terminal', '2025-07-17', '2025-07-24', 'rejected', 'nO', '2025-07-17 14:43:01', '2025-07-17 14:56:55');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `badge_requests`
--
ALTER TABLE `badge_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `badge_requests_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `badge_requests`
--
ALTER TABLE `badge_requests`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `badge_requests`
--
ALTER TABLE `badge_requests`
  ADD CONSTRAINT `badge_requests_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
