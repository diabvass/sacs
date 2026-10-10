const db = require("../../config/database");

const Flux = {
    ES: async (type_flux, nombre_balle, id_balle, id_user) => {
        const [result] = await db.execute(`
            INSERT INTO flux_stock (type_flux, nombre_balle, id_balle, id_user)
            VALUES (?,?,?,?)
            `, [type_flux, nombre_balle, id_balle, id_user]);

        return result;
    },

    stock: async (id_balle) => {
        const [niveau] = await db.execute(`
            SELECT 
            SUM(
                CASE
                    WHEN FS.type_flux = 'ENTREE' THEN FS.nombre_balle
                    WHEN FS.type_flux = 'SORTIE' THEN - FS.nombre_balle
                    ELSE 0
                END ) AS stock
            FROM flux_stock FS
            WHERE id_balle = ?`, [id_balle]);
            
        return niveau;
    }
}

module.exports = Flux;