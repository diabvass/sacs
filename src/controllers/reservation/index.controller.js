const Reservation = require("../../models/reservation.model");

module.exports = {
  liste: async (req, res) => {
    try {
      const { statut } = req.params;
      if (!statut) return res.status(400).json({ message: "Statut requis" });

      const statutClean = statut.toLowerCase();
      const autorise = ["regler", "attente"];
      if (!autorise.includes(statutClean)) {
        return res.status(400).json({ message: "Statut invalide" });
      }

      const liste = await Reservation.liste(statutClean);
      const mes = liste.length === 0 ? "Aucune reservation." : "Liste des reservations.";

      return res.status(200).json({
        message: mes,
        data: liste
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  },

  reserver: async (req, res) => {
    try {
      const { nom_client, designation, telephone, montant, avance = 0 } = req.body;
      const id_user = req.user.id_user;

      const numMontant = Number(montant);
      const numAvance = Number(avance);

      if (
        !nom_client || !telephone || isNaN(numMontant) || isNaN(numAvance) ||
        typeof(nom_client) !== "string"  || typeof(telephone) !== "string"
      ) {
        return res.status(400).json({ message: "Données invalides" });
      }


      const initialStatut = (numMontant - numAvance) <= 0 ? "regler" : "attente";

      const id = await Reservation.reserver(
        nom_client,
        telephone,
        designation,
        numMontant,
        numAvance,
        id_user,
        initialStatut
      );

      return res.status(201).json({
        message: "Reservation ajoutée",
        data: { id_reservation: id }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur du serveur" });
    }
  },

  regler: async (req, res) => {
    try {
      const { id_reservation, montant } = req.body;
      const id_user = req.user.id_user;

      const numMontant = Number(montant);
      const numIdResa = Number(id_reservation);

      if (!numIdResa || isNaN(numMontant) || numMontant <= 0) {
        return res.status(400).json({ message: "Données invalides" });
      }

      // Récupération du reste à payer
      const mtpayer = await Reservation.reste(numIdResa);

      if (!mtpayer) {
        return res.status(404).json({ message: "Reservation introuvable" });
      }

      const resteActuel = Number(mtpayer.reste);

      if (resteActuel <= 0.1) {
        return res.status(400).json({ message: "Cette réservation est déjà réglée" });
      }
      const nouveauReste = resteActuel - numMontant;

      if (nouveauReste < 0) {
        return res.status(400).json({ message: `Attention : Montant Restant à payer : ${resteActuel}` });
      }

      // Enregistrement du règlement
      await Reservation.regler(numMontant, numIdResa, id_user);
      // change statut
      if (nouveauReste <= 0) {
        await Reservation.solde(numIdResa);
      }

      return res.status(200).json({
        message: "Reglement effectué",
        data: {
          verse: numMontant,
          dette: resteActuel,
          reste: nouveauReste
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur du serveur" });
    }
  }
};