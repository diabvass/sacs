const db = require("../config/database"); 

const Reservation = {
  liste: async(statut) => {
    const [reserver] = await db.execute(`
      SELECT RE.id_reservation,
      RE.nom_client AS client,
      RE.telephone, RE.designation, 
      RE.montant, RE.avance, (RE.montant - RE.avance) AS reste, 
      DATE_FORMAT(RE.date_reservation, '%a %b %Y - %H:%m') AS date, US.nom_user 
      FROM reservation RE 
      JOIN users US ON RE.id_user = US.id_user 
      WHERE RE.statut =? 
      ORDER BY RE.date_reservation DESC;
    `, [statut]);
    return reserver;
  },

  reserver: async(nom_client, telephone, designation, montant, avance, id_user) => {
    const [ajouter] = await db.execute(`
      INSERT INTO reservation (nom_client, telephone, designation, montant, avance, id_user, statut) 
      VALUES(?,?,?,?,?,'attente')`,
      [nom_client, telephone, designation, montant, avance, id_user]
    );
    return ajouter.insertId;
  },

  reste: async(id_reservation) => {
    const [reste] = await db.execute(`
      SELECT RE.montant - RE.avance - SUM(RG.montant) AS reste 
      FROM reservation RE 
      LEFT JOIN regler RG
      ON RE.id_reservation = RG.id_reservation 
      WHERE RE.id_reservation =? 
      GROUP BY RE.id_reservation, RE.montant, RE.avance
    `, [id_reservation]);
    return reste[0];
  },

  regler: async(montant, id_reservation, id_user) => {
    const [regler] = await db.execute(`
      INSERT INTO regler (montant, id_reservation, id_user) 
      VALUES(?,?,?)
    `, [montant, id_reservation, id_user]);
    return regler.insertId;
  },

  solde: async(id_reservation) => {
    await db.execute(`
    UPDATE reservation SET statut = 'regler' 
    WHERE id_reservation =?`,[id_reservation])
  }
}
module.exports = Reservation