const db = require("../config/database");

const Balle = {
    stockActuel: async () => {
        const [find] = await db.execute(
            `SELECT
                BA.id_balle,
                BA.designation,
                DATE_FORMAT(NOW(), '%d/%m/%Y %H:%i:%s') as date,
                SUM(
                    CASE
                        WHEN FS.type_flux = 'ENTREE' THEN FS.nombre_balle
                        WHEN FS.type_flux = 'SORTIE' THEN - FS.nombre_balle
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
}

module.exports = Balle;