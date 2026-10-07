CREATE TABLE users(
   id_user VARCHAR(10),
   nom_user VARCHAR(20) NOT NULL,
   role VARCHAR(10) NOT NULL,
   telephone_user VARCHAR(25) NOT NULL,
   mot_de_passe_user VARCHAR(255) NOT NULL,
   PRIMARY KEY(id_user)
);

CREATE TABLE balle(
   id_balle VARCHAR(20),
   designation VARCHAR(50) NOT NULL,
   date_update DATETIME,
   PRIMARY KEY(id_balle)
);

CREATE TABLE registre_journalier(
   id_registre INT,
   date_registre DATETIME NOT NULL,
   solde_initial INT,
   solde_vente INT,
   solde_total INT,
   statut VARCHAR(15) NOT NULL,
   id_user VARCHAR(10) NOT NULL,
   PRIMARY KEY(id_registre),
   FOREIGN KEY(id_user) REFERENCES users(id_user)
);

CREATE TABLE reservation(
   id_reservation INT,
   nom_client VARCHAR(20),
   telephone VARCHAR(15) NOT NULL,
   designation VARCHAR(100),
   montant INT NOT NULL,
   avance INT,
   statut VARCHAR(15) NOT NULL,
   date_reservation DATETIME,
   id_user VARCHAR(10) NOT NULL,
   PRIMARY KEY(id_reservation),
   FOREIGN KEY(id_user) REFERENCES users(id_user)
);

CREATE TABLE Vente_detail(
   id_vente INT,
   description_vente VARCHAR(100),
   montant_vente INT NOT NULL,
   date_vente DATETIME,
   id_registre INT NOT NULL,
   id_user VARCHAR(10) NOT NULL,
   PRIMARY KEY(id_vente),
   FOREIGN KEY(id_registre) REFERENCES registre_journalier(id_registre),
   FOREIGN KEY(id_user) REFERENCES users(id_user)
);

CREATE TABLE flux_stock(
   id_flux INT,
   type_flux VARCHAR(10) NOT NULL,
   nombre_balle INT NOT NULL,
   date_flux DATETIME NOT NULL,
   id_balle VARCHAR(20) NOT NULL,
   id_user VARCHAR(10) NOT NULL,
   PRIMARY KEY(id_flux),
   FOREIGN KEY(id_balle) REFERENCES balle(id_balle),
   FOREIGN KEY(id_user) REFERENCES users(id_user)
);

CREATE TABLE depense(
   id_depense INT,
   date_depense DATETIME NOT NULL,
   motif VARCHAR(100) NOT NULL,
   montant INT NOT NULL,
   id_registre INT NOT NULL,
   PRIMARY KEY(id_depense),
   FOREIGN KEY(id_registre) REFERENCES registre_journalier(id_registre)
);

CREATE TABLE saisir_depense(
   id_user VARCHAR(10),
   id_depense INT,
   PRIMARY KEY(id_user, id_depense),
   FOREIGN KEY(id_user) REFERENCES users(id_user),
   FOREIGN KEY(id_depense) REFERENCES depense(id_depense)
);
