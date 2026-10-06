
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const secretJWT = process.env.JWT_SECRET;

module.exports = async (req, res) => {
  try {
    // déjà connecté
    if (req.cookies["token"]) return res.json({
      message: "Vous êtes déjà connecté"
    });


    const { telephone_user, mot_de_passe_user } = req.body;
    const type = (!telephone_user || !mot_de_passe_user ||
      typeof telephone_user !== "string" || typeof mot_de_passe_user !== "string");

    if (type) return res.status(400).json({
      message: "Erreur données fournies"
    });
    

    // model User
    const user = await User.login(telephone_user, mot_de_passe_user);

    const token = jwt.sign(
      {
        id_user: user.id_user,
        nom_user: user.nom_user,
        role: user.role
      },
      secretJWT,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000, // 1h en ms
      path: "/"
    });

    return res.status(200).json({
      message: "connecté"
    });

  } catch (error) {
    console.error(error.message);
    if(error.message === "Identifiants incorrects") {
      return res.status(401).json({
        message: "Identifiants incorrects"
      })
    }
    res.status(500).json({ message: "Erreur serveur" });
  }
};   