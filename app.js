const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TOKEN = process.env.JWT_TOKEN;

if (!JWT_SECRET || !JWT_TOKEN) {
    throw new Error("JWT_SECRET und JWT_TOKEN müssen in der .env Datei gesetzt sein");
}

const { checkConnection } = require('./Db');
checkConnection();

const setupSwagger = require('./swagger');
setupSwagger(app);

const authenticateToken = require('./middleware/Auth');
app.use(authenticateToken);

app.use('/personen',         require('./routes/Personen'));
app.use('/personenpost',     require('./routes/PersonenPost'));
app.use('/personenput',      require('./routes/PersonenPut'));
app.use('/personendelete',   require('./routes/PersonenDelete'));
app.use('/hello',            require('./routes/Hello'));
app.use('/personenprofil',   require('./routes/Personenprofil'));
app.use('/personensuche',    require('./routes/Personensuche'));
app.use('/',                 require('./routes/Index'));

app.listen(PORT, () => {
    console.log(`Server läuft nur auf Port ${PORT}`);
});