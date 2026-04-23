const express = require('express');
const router = express.Router();
const { query } = require('../Db');
const { validatePerson } = require('../schemes/PersonenSchema');

router.post('/', async function (req, res) {
    try {
        const valid = validatePerson(req.body);

        if (!valid) {
            return res.status(400).json({
                status: 400,
                message: "Ungültige Daten",
                errors: validatePerson.errors
            });
        }

        const { vorname, nachname, plz, strasse, ort, telefonnummer, email } = req.body;

        const sql = "INSERT INTO Personen (vorname, nachname, plz, strasse, ort, telefonnummer, email) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const result = await query(sql, [vorname, nachname, plz, strasse, ort, telefonnummer, email]);

        res.status(201).json({
            status: 201,
            message: "Person erstellt",
            insertId: result.insertId
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        });
    }
});

module.exports = router;