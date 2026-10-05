const db = require("../config/database");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  try {
    const { nom_user, role, telephone_user, mot_de_passe_user } = req.body;

    const type = (!nom_user || !role || !telephone_user || !mot_de_passe_user ||
      typeof nom_user !== "string" || typeof role !== "string" ||
      typeof telephone_user !== "string" || typeof mot_de_passe_user !== "string");

    if (type) return res.status(400).json({
      message: "Erreur données fournies"
    });

    const id = "U" + Date.now();
    const hash = await bcrypt.hash(mot_de_passe_user, 10);

    await db.execute(
      "INSERT INTO users (id_user, nom_user, role, telephone_user, mot_de_passe_user) VALUES (?, ?, ?, ?, ?)",
      [id, nom_user, role, telephone_user, hash]
    );

    res.status(201).json({ message: "Utilisateur créé avec succès" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};   