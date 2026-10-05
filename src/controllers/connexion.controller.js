const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretJWT = process.env.JWT_SECRET;

module.exports = async (req, res) => {
  try {
    const { telephone_user, mot_de_passe_user } = req.body;

    const type = (!telephone_user || !mot_de_passe_user ||
      typeof telephone_user !== "string" || typeof mot_de_passe_user !== "string");

    if (type) return res.status(400).json({
      message: "Erreur données fournies"
    });

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE telephone_user = ?",
      [telephone_user]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(mot_de_passe_user, user.mot_de_passe_user);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

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

    return res.json({
      message: "connecté"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};   