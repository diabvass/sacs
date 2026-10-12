const Reservation = require("../../models/reservation.model");

module.exports = {
  liste: async(req,res) => {
    try {
      const statut = req.params.statut;
      if(!statut) return res.status(400).json({ message: "Statut requis" })
      
      const autorise = ["regler", "attente"];
      if(!autorise.includes(statut.toLowerCase()))
        return res.status(400).json({ 
          message: "Statut invalide" 
        })
      
      const liste = await Reservation.liste(statut);
      return res.status(200).json({
        message: "liste des reservations.", 
        data: liste 
      })
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "Erreur serveur" 
      });
    }
  },

  reserver: async(req, res) => {
    try {
      const { nom_client, designation, telephone, montant, avance = 0} = req.body;
      const id_user = req.user.id_user;
      const type = (!nom_client ||!telephone ||!montant ||
        typeof(nom_client) !== "string" || typeof(telephone) !== "string" || typeof(montant) !== "number" || typeof(avance) !== "number");
      
      if(type) return res.status(400).json({
        message: "Données invalides" 
      })
      
      const id = await Reservation.reserver(nom_client, telephone, designation, montant, avance, id_user);
      return res.status(201).json({ 
        message: "Reservation ajoutée"
      })
    } catch (err) {
      console.error(err);
      return res.status(500).json({ 
        message: "Erreur du serveur" 
      })
    }
  },

  regler: async(req, res) => {
    try{
      const {id_reservation, montant} = req.body;
      const id_user = req.user.id_user;
      if(!montant ||!id_reservation || typeof(montant)!== "number") 
        return res.status(400).json({
          message: "Données invalides" 
        })
      
      const mtpayer = await Reservation.reste(id_reservation); // montant à payer
      if (!mtpayer) return res.status(404).json({ 
        message: "Reservation introuvable" 
      });
      
      if (montant > mtpayer.reste) return res.status(400).json({ 
        message: `La somme à payer est ${mtpayer.reste}` 
      })

      // regler
      await Reservation.regler(montant, id_reservation, id_user);
      
      if(montant === mtpayer.reste) {
        await Reservation.solde(id_reservation);
      }
      return res.status(200).json({ 
        message: "Reglement effectué", 
        data: {
          verse: montant, 
          dette: mtpayer.reste, 
          reste: mtpayer.reste - montant 
        } 
      })
    } catch (err) {
      console.error(err);
      return res.status(500).json({ 
        message: "Erreur du serveur" 
      })
    }
  }
}