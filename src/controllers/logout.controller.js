
// deconnecte
module.exports = async (__req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });

  res.json({
    message: "Déconnexion réussie"
  });
};
