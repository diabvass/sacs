const db = require("../../config/database");

module.exports = {
    stockActuel: async () => {
        const [find] = await db.execute(
            `SELECT
                BA.id_balle,
                BA.designation,
                DATE_FORMAT(NOW(), '%a %d %b %Y - %Hh:%i ') as date,
                SUM(
                    CASE
                        WHEN FS.type_flux = 'entree' THEN FS.nombre_balle
                        WHEN FS.type_flux = 'sortie' THEN - FS.nombre_balle
                        ELSE 0
                    END
                ) AS stock
            FROM balle BA
            LEFT JOIN flux_stock FS
                ON FS.id_balle = BA.id_balle
            GROUP BY
                BA.id_balle,
                BA.designation;`
        );

        if (!find) throw new Error("Erreur lors de la requête.")
        return find;
    },

    stockActuelOne: async (id_balle) => {
        const [find] = await db.execute(
            `SELECT
                BA.id_balle,
                BA.designation,
                DATE_FORMAT(NOW(), '%a %d %b %Y - %Hh:%i ') as date,
                SUM(
                    CASE
                        WHEN FS.type_flux = 'entree' THEN FS.nombre_balle
                        WHEN FS.type_flux = 'sortie' THEN - FS.nombre_balle
                        ELSE 0
                    END
                ) AS stock
            FROM balle BA
            LEFT JOIN flux_stock FS
                ON FS.id_balle = BA.id_balle
            WHERE FS.id_balle = ?
            GROUP BY
                BA.id_balle,
                BA.designation;`,
            [id_balle]);

        if (!find) throw new Error("Erreur lors de la requête.");
        if(find.length === 0) throw new Error("Aucune information.")
        return find;
    }
};