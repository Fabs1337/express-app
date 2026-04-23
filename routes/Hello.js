const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const name = req.query.name;
    const age = req.query.age;

    if (name === undefined || !isNaN(name)) {
        return res.send("Name muss vorhanden sein und darf keine Zahl sein.");
    }

    if (age === undefined || isNaN(age)) {
        return res.send("Alter muss eine Zahl sein.");
    }

    res.send("Name: " + name + " Alter: " + age);
});

module.exports = router;