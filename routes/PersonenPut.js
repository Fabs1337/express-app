const express = require('express');
const router = express.Router();
const { query } = require('../Db');
const { validatePerson } = require('../schemes/PersonenSchema');

// PUT /personenput/:id – alle Felder einer Person aktualisieren
router.put('/:id', async function (req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                status: 400,
                message: "ID muss eine Zahl sein"
            });
        }

        const valid = validatePerson(req.body);
        if (!valid) {
            return res.status(400).json({
                status: 400,
                message: "Ungültige Daten",
                errors: validatePerson.errors
            });
        }

        const { vorname, nachname, plz, strasse, ort, telefonnummer, email } = req.body;

        const sql = `
            UPDATE personen
            SET vorname = ?, nachname = ?, plz = ?, strasse = ?, ort = ?, telefonnummer = ?, email = ?
            WHERE id = ?
        `;
        const result = await query(sql, [vorname, nachname, plz, strasse, ort, telefonnummer, email, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Person nicht gefunden"
            });
        }

        res.status(200).json({
            status: 200,
            message: "Person aktualisiert"
        });
    } catch (err) {
        res.status(500).json({ status: 500, message: err });
    }
});

module.exports = router;