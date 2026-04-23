const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hallo von Express in Docker!');
});

module.exports = router;