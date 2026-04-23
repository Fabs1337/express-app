const express = require('express');
const router = express.Router();
const { query } = require('../Db');

/**
 * GET /personenprofil/:id
 * Vollständiges Profil einer Person – nutzt alle 10 Tabellen:
 *   personen, anstellungen, berufe, arbeitgeber,
 *   personen_hobbys, hobbys,
 *   personen_ausbildungen, ausbildungen,
 *   personen_sprachen, sprachen
 */
router.get('/:id', async function (req, res) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({
                status: 400,
                message: "ID muss eine Zahl sein"
            });
        }

        // 1) Basisdaten der Person
        const personen = await query(
            'SELECT * FROM personen WHERE id = ?',
            [id]
        );
        if (personen.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Person nicht gefunden"
            });
        }
        const person = personen[0];

        // 2) Anstellung → verknüpft: anstellungen + berufe + arbeitgeber (3 Tabellen)
        const anstellungen = await query(`
            SELECT
                a.startdatum,
                b.bezeichnung  AS beruf,
                b.branche,
                ag.firmenname,
                ag.ort         AS arbeitgeber_ort
            FROM anstellungen a
            JOIN berufe      b  ON a.beruf_id        = b.id
            JOIN arbeitgeber ag ON a.arbeitgeber_id   = ag.id
            WHERE a.person_id = ?
        `, [id]);

        // 3) Hobbys → verknüpft: personen_hobbys + hobbys (2 Tabellen)
        const hobbyRows = await query(`
            SELECT h.hobby_name
            FROM personen_hobbys ph
            JOIN hobbys h ON ph.hobby_id = h.id
            WHERE ph.person_id = ?
        `, [id]);

        // 4) Ausbildungen → verknüpft: personen_ausbildungen + ausbildungen (2 Tabellen)
        const ausbildungen = await query(`
            SELECT
                au.abschluss,
                au.fachrichtung,
                au.einrichtung,
                pau.jahr_von,
                pau.jahr_bis
            FROM personen_ausbildungen pau
            JOIN ausbildungen au ON pau.ausbildung_id = au.id
            WHERE pau.person_id = ?
            ORDER BY pau.jahr_von
        `, [id]);

        // 5) Sprachen → verknüpft: personen_sprachen + sprachen (2 Tabellen)
        const sprachen = await query(`
            SELECT
                s.name    AS sprache,
                ps.niveau
            FROM personen_sprachen ps
            JOIN sprachen s ON ps.sprache_id = s.id
            WHERE ps.person_id = ?
        `, [id]);

        res.status(200).json({
            status: 200,
            profil: {
                ...person,
                anstellungen,
                hobbys:      hobbyRows.map(h => h.hobby_name),
                ausbildungen,
                sprachen
            }
        });
    } catch (err) {
        res.status(500).json({ status: 500, message: err });
    }
});

module.exports = router;