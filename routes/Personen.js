const express = require('express');
const router = express.Router();
const { query } = require('../Db');

// GET /personen – alle Personen mit aktuellem Beruf & Arbeitgeber
router.get('/', async function (req, res) {
    try {
        const sql = `
            SELECT
                p.id, p.vorname, p.nachname, p.plz, p.strasse, p.ort, p.telefonnummer, p.email,
                b.bezeichnung  AS beruf,
                b.branche,
                ag.firmenname,
                ag.ort         AS arbeitgeber_ort,
                a.startdatum
            FROM personen p
            LEFT JOIN anstellungen  a  ON p.id = a.person_id
            LEFT JOIN berufe        b  ON a.beruf_id = b.id
            LEFT JOIN arbeitgeber   ag ON a.arbeitgeber_id = ag.id
            ORDER BY p.nachname, p.vorname
        `;
        const personen = await query(sql);
        res.status(200).json({
            status: 200,
            personen,
            row: personen.length
        });
    } catch (err) {
        res.status(500).json({ status: 500, message: err });
    }
});

// GET /personen/:id – eine Person per ID
router.get('/:id', async function (req, res) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({
                status: 400,
                message: "ID muss eine Zahl sein"
            });
        }
        const sql = "SELECT * FROM personen WHERE id = ?";
        const personen = await query(sql, [id]);
        if (personen.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "keine Personen gefunden"
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