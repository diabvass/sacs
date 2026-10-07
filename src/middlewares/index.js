const jwt = require("jsonwebtoken");
const secretJWT = process.env.JWT_SECRET;

function auth(roles = []) {
  return (req, res, next) => {
    const token = req.cookies["token"];
    if (!token) return res.json({
      message: "connexion requis"
    });

    jwt.verify(token, secretJWT, (err, decoded) => {
      if (err) return res.json({
        message: "connexion échouée"
      });

      if (roles.length && !roles.includes(decoded.role)) {
        return res.json({
          message: "Accès interdit"
        });
      }
      req.user = decoded;
      next();
    });
  }
}
module.exports = auth;