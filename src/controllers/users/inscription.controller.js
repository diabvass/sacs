const User = require("../../models/user.model");
module.exports = async (req, res) => {
  try {
    const { nom_user, role, telephone_user, mot_de_passe_user } = req.body;

    const type = (!nom_user || !role || !telephone_user || !mot_de_passe_user ||
      typeof nom_user !== "string" || typeof role !== "string" ||
      typeof telephone_user !== "string" || typeof mot_de_passe_user !== "string");

    if (type) return res.status(400).json({
      message: "Erreur données fournies"
    });

    await User.sign(nom_user, role, telephone_user, mot_de_passe_user)
    return res.status(201).json({ message: "Utilisateur créé avec succès" });

  } catch (error) {
    console.error(error.message);
    if(error.code === 'ER_DUP_ENTRY'){
      res.status(400).json({
        message: "Ce numéro existe déjà."
      })
    }
    res.status(500).json({ message: "Erreur serveur" });
  }
};   