const db = require("../config/database");
const bcrypt = require("bcrypt")
const User = {
    login: async (telephone_user, mot_de_passe_user) => {
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE telephone_user = ?",
            [telephone_user]
        );

        if (rows.length === 0) throw new Error("Identifiants incorrects");

        const user = rows[0];

        const correct = await bcrypt.compare(mot_de_passe_user, user.mot_de_passe_user);
        if (!correct) throw new Error("Identifiants incorrects");

        return user;
    },

    sign: async (nom_user, role, telephone_user, mot_de_passe_user) => {

        const id = "U" + Date.now();
        const hash = await bcrypt.hash(mot_de_passe_user, 10);

        const creer = await db.execute(
            "INSERT INTO users (id_user, nom_user, role, telephone_user, mot_de_passe_user) VALUES (?, ?, ?, ?, ?)",
            [id, nom_user, role, telephone_user, hash]
        );

        if (!creer) throw new Error("Erreur lors de la création.")
    },

    findAll: async () => {
        const [find] = await db.execute(
            "SELECT id_user, nom_user, role, telephone_user FROM users"
        );

        if (!find) throw new Error("Erreur lors de la requête.")
        return find;
    },

    findOne: async (id) => {
        const [user] = await db.execute(
            "SELECT id_user, nom_user, role, telephone_user FROM users WHERE id_user=?",
            [id]
        );
        if (!user) throw new Error ("User non trouvé");
        return user;
    }
}

module.exports = User;