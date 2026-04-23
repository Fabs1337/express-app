const express = require('express');
const router = express.Router();
const { query } = require('../Db');

/**
 * GET /personensuche
 *
 * Sucht Personen anhand beliebiger Kombination von Query-Parametern.
 * Alle 10 Tabellen werden per JOIN einbezogen.
 *
 * Query-Parameter (alle optional):
 *   vorname, nachname, ort        – Felder der Tabelle personen
 *   beruf                         – berufe.bezeichnung
 *   branche                       – berufe.branche
 *   arbeitgeber                   – arbeitgeber.firmenname
 *   hobby                         – hobbys.hobby_name
 *   sprache                       – sprachen.name
 *   sprachniveau                  – personen_sprachen.niveau
 *   ausbildung                    – ausbildungen.fachrichtung
 *   abschluss                     – ausbildungen.abschluss
 *
 * Beispiel:
 *   GET /personensuche?beruf=Softwareentwickler&sprache=Englisch&hobby=Joggen
 */
router.get('/', async function (req, res) {
    try {
        const {
            vorname, nachname, ort,
            beruf, branche, arbeitgeber,
            hobby,
            sprache, sprachniveau,
            ausbildung, abschluss
        } = req.query;

        // Basis-Query – joined alle 10 Tabellen
        // DISTINCT, da durch mehrere LEFT JOINs Duplikate entstehen können
        let sql = `
            SELECT DISTINCT
                p.id,
                p.vorname,
                p.nachname,
                p.ort,
                p.plz,
                p.strasse,
                p.telefonnummer,
                p.email,
                b.bezeichnung  AS beruf,
                b.branche,
                ag.firmenname,
                ag.ort         AS arbeitgeber_ort,
                a.startdatum
            FROM personen p
            LEFT JOIN anstellungen        a   ON p.id           = a.person_id
            LEFT JOIN berufe              b   ON a.beruf_id      = b.id
            LEFT JOIN arbeitgeber         ag  ON a.arbeitgeber_id = ag.id
            LEFT JOIN personen_hobbys     ph  ON p.id           = ph.person_id
            LEFT JOIN hobbys              h   ON ph.hobby_id     = h.id
            LEFT JOIN personen_ausbildungen pau ON p.id         = pau.person_id
            LEFT JOIN ausbildungen        au  ON pau.ausbildung_id = au.id
            LEFT JOIN personen_sprachen   ps  ON p.id           = ps.person_id
            LEFT JOIN sprachen            s   ON ps.sprache_id   = s.id
            WHERE 1=1
        `;

        const params = [];

        // --- Filter dynamisch aufbauen ---
        if (vorname) {
            sql += ' AND p.vorname LIKE ?';
            params.push(`%${vorname}%`);
        }
        if (nachname) {
            sql += ' AND p.nachname LIKE ?';
            params.push(`%${nachname}%`);
        }
        if (ort) {
            sql += ' AND p.ort LIKE ?';
            params.push(`%${ort}%`);
        }
        if (beruf) {
            sql += ' AND b.bezeichnung LIKE ?';
            params.push(`%${beruf}%`);
        }
        if (branche) {
            sql += ' AND b.branche LIKE ?';
            params.push(`%${branche}%`);
        }
        if (arbeitgeber) {
            sql += ' AND ag.firmenname LIKE ?';
            params.push(`%${arbeitgeber}%`);
        }
        if (hobby) {
            sql += ' AND h.hobby_name LIKE ?';
            params.push(`%${hobby}%`);
        }
        if (sprache) {
            sql += ' AND s.name LIKE ?';
            params.push(`%${sprache}%`);
        }
        if (sprachniveau) {
            sql += ' AND ps.niveau = ?';
            params.push(sprachniveau);
        }
        if (ausbildung) {
            sql += ' AND au.fachrichtung LIKE ?';
            params.push(`%${ausbildung}%`);
        }
        if (abschluss) {
            sql += ' AND au.abschluss LIKE ?';
            params.push(`%${abschluss}%`);
        }

        sql += ' ORDER BY p.nachname, p.vorname';

        const personen = await query(sql, params);

        if (personen.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Keine Personen gefunden"
            });
        }

        res.status(200).json({
            status: 200,
            personen,
            row: personen.length
        });
    } catch (err) {
        res.status(500).json({ status: 500, message: err });
    }
});

module.exports = router;