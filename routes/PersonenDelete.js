const express = require('express');
const router = express.Router();
const { query } = require('../Db');

router.delete('/:id', async function (req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({
                status: 400,
                message: "ID muss eine Zahl sein"
            });
        }

        const sql = "DELETE FROM Personen WHERE id = ?";
        const result = await query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 404,
                message: "Person nicht gefunden"
            });
        }

        res.status(200).json({
            status: 200,
            message: "Person gelöscht"
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        });
    }
});

module.exports = router;