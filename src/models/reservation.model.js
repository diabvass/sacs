const db = require("../config/database");

const Reservation = {
  liste : async(statut) => {
    const [reserver] = await db.execute(`
      SELECT 
        RE.nom_client AS client, 
        RE.telephone, 
        RE.designation, 
        RE.montant, 
        RE.avance, 
        (RE.montant - RE.avance) AS reste,
        RE.date_reservation AS date, 
        US.nom_user
      FROM reservation RE
      JOIN users US ON RE.id_user = US.id_user
      WHERE RE.statut = ?
      ORDER BY RE.date_reservation DESC;
    `, [statut]);
    
    if(!reserver) throw new Error("Erreur lors de la requête");
    return reserver;
  },
  
}

module.exports = Reservation