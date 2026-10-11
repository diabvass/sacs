-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 11 oct. 2026 à 23:58
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `friperie`
--

-- --------------------------------------------------------

--
-- Structure de la table `balle`
--

CREATE TABLE `balle` (
  `id_balle` int(2) NOT NULL,
  `designation` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `flux_stock`
--

CREATE TABLE `flux_stock` (
  `id_flux` int(4) NOT NULL,
  `type_flux` enum('entree','sortie') NOT NULL,
  `date_flux` timestamp NOT NULL DEFAULT current_timestamp(),
  `nombre_balle` int(11) NOT NULL,
  `id_balle` int(2) NOT NULL,
  `id_user` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `operation`
--

CREATE TABLE `operation` (
  `id_operation` int(4) NOT NULL,
  `type_operation` varchar(50) NOT NULL,
  `date_operation` datetime NOT NULL,
  `motif` varchar(100) NOT NULL,
  `montant` int(6) NOT NULL,
  `id_user` varchar(10) NOT NULL,
  `id_registre` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `registre`
--

CREATE TABLE `registre` (
  `id_registre` int(4) NOT NULL,
  `date_registre` timestamp NOT NULL DEFAULT current_timestamp(),
  `solde_initial` int(6) DEFAULT 0,
  `solde_vente` int(6) DEFAULT 0,
  `solde_total` int(6) DEFAULT 0,
  `statut` enum('ouvert','fermer') DEFAULT 'ouvert',
  `id_user` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `regler`
--

CREATE TABLE `regler` (
  `id_user` varchar(10) NOT NULL,
  `id_reservation` int(4) NOT NULL,
  `date_reglement` timestamp NOT NULL DEFAULT current_timestamp(),
  `montant` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `id_reservation` int(4) NOT NULL,
  `nom_client` varchar(30) DEFAULT NULL,
  `telephone` varchar(15) NOT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `montant` int(6) NOT NULL,
  `avance` int(6) DEFAULT 0,
  `statut` enum('attente','regler') DEFAULT 'attente',
  `date_reservation` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_user` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id_user` varchar(10) NOT NULL,
  `nom_user` varchar(25) NOT NULL,
  `role` enum('admin','gerant') DEFAULT 'admin',
  `mot_de_passe_user` text NOT NULL,
  `telephone_user` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `balle`
--
ALTER TABLE `balle`
  ADD PRIMARY KEY (`id_balle`);

--
-- Index pour la table `flux_stock`
--
ALTER TABLE `flux_stock`
  ADD PRIMARY KEY (`id_flux`),
  ADD KEY `id_balle` (`id_balle`),
  ADD KEY `id_user` (`id_user`);

--
-- Index pour la table `operation`
--
ALTER TABLE `operation`
  ADD PRIMARY KEY (`id_operation`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_registre` (`id_registre`);

--
-- Index pour la table `registre`
--
ALTER TABLE `registre`
  ADD PRIMARY KEY (`id_registre`),
  ADD KEY `id_user` (`id_user`);

--
-- Index pour la table `regler`
--
ALTER TABLE `regler`
  ADD PRIMARY KEY (`id_user`,`id_reservation`),
  ADD KEY `id_reservation` (`id_reservation`);

--
-- Index pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id_reservation`),
  ADD KEY `id_user` (`id_user`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `balle`
--
ALTER TABLE `balle`
  MODIFY `id_balle` int(2) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `flux_stock`
--
ALTER TABLE `flux_stock`
  MODIFY `id_flux` int(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `operation`
--
ALTER TABLE `operation`
  MODIFY `id_operation` int(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `registre`
--
ALTER TABLE `registre`
  MODIFY `id_registre` int(4) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `flux_stock`
--
ALTER TABLE `flux_stock`
  ADD CONSTRAINT `flux_stock_ibfk_1` FOREIGN KEY (`id_balle`) REFERENCES `balle` (`id_balle`),
  ADD CONSTRAINT `flux_stock_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Contraintes pour la table `operation`
--
ALTER TABLE `operation`
  ADD CONSTRAINT `operation_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `operation_ibfk_2` FOREIGN KEY (`id_registre`) REFERENCES `registre` (`id_registre`);

--
-- Contraintes pour la table `registre`
--
ALTER TABLE `registre`
  ADD CONSTRAINT `registre_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Contraintes pour la table `regler`
--
ALTER TABLE `regler`
  ADD CONSTRAINT `regler_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `regler_ibfk_2` FOREIGN KEY (`id_reservation`) REFERENCES `reservation` (`id_reservation`);

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
