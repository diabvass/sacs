const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const serveur = express();
const routes = require("./routes");
const port = process.env.PORT || 8000;
const hostname = process.env.HOSTNAME || "127.0.0.1";
const cors = require("cors");

serveur.use(cors({ 
  origin: true, 
  credentials: true 
}));

serveur.use(express.json());
serveur.use(cookieParser());

// routes principal
serveur.get("/", (__req, res) => {
  res.json({message: "Fekir developpeur"});
})

serveur.use("/api", routes);

// Erreur route inexistante
serveur.use((__req, res) => {
  return res.status(404).json({ 
    statut: false, 
    result: `Cette route n'existe pas` 
  });
});

// Erreur serveur
serveur.use((err, __req, res) => {
  console.error(err);
  return res.status(500).json({ 
    statut: false, 
    result: "Erreur du serveur" 
  });
});

serveur.listen(port, hostname, () => {
  console.log(`Serveur lancé sur ${hostname}:${port}`);
})