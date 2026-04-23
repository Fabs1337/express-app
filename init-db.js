const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await connection.beginTransaction();

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS personen (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vorname VARCHAR(100) NOT NULL,
        nachname VARCHAR(100) NOT NULL,
        plz VARCHAR(20) NOT NULL,
        strasse VARCHAR(255) NOT NULL,
        ort VARCHAR(100) NOT NULL,
        telefonnummer VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS berufe (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bezeichnung VARCHAR(100) NOT NULL,
        branche VARCHAR(100) NOT NULL
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS arbeitgeber (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firmenname VARCHAR(150) NOT NULL,
        ort VARCHAR(100) NOT NULL
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS anstellungen (
        id INT AUTO_INCREMENT PRIMARY KEY,
        person_id INT NOT NULL,
        beruf_id INT NOT NULL,
        arbeitgeber_id INT NOT NULL,
        startdatum DATE,
        FOREIGN KEY (person_id) REFERENCES personen(id),
        FOREIGN KEY (beruf_id) REFERENCES berufe(id),
        FOREIGN KEY (arbeitgeber_id) REFERENCES arbeitgeber(id)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS hobbys (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hobby_name VARCHAR(100) NOT NULL
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS personen_hobbys (
        person_id INT NOT NULL,
        hobby_id INT NOT NULL,
        PRIMARY KEY (person_id, hobby_id),
        FOREIGN KEY (person_id) REFERENCES personen(id),
        FOREIGN KEY (hobby_id) REFERENCES hobbys(id)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ausbildungen (
        id INT AUTO_INCREMENT PRIMARY KEY,
        abschluss VARCHAR(100) NOT NULL,
        fachrichtung VARCHAR(100) NOT NULL,
        einrichtung VARCHAR(150) NOT NULL
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS personen_ausbildungen (
        id INT AUTO_INCREMENT PRIMARY KEY,
        person_id INT NOT NULL,
        ausbildung_id INT NOT NULL,
        jahr_von INT,
        jahr_bis INT,
        FOREIGN KEY (person_id) REFERENCES personen(id),
        FOREIGN KEY (ausbildung_id) REFERENCES ausbildungen(id)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sprachen (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS personen_sprachen (
        person_id INT NOT NULL,
        sprache_id INT NOT NULL,
        niveau VARCHAR(50),
        PRIMARY KEY (person_id, sprache_id),
        FOREIGN KEY (person_id) REFERENCES personen(id),
        FOREIGN KEY (sprache_id) REFERENCES sprachen(id)
      )
    `);

    await connection.execute(`
      INSERT IGNORE INTO personen (id, vorname, nachname, plz, strasse, ort, telefonnummer, email) VALUES
      (1, 'Anna', 'Schneider', '10115', 'Hauptstrasse 12', 'Berlin', '015111111111', 'anna.schneider@example.com'),
      (2, 'Lukas', 'Meyer', '20095', 'Bahnhofstrasse 8', 'Hamburg', '015122222222', 'lukas.meyer@example.com'),
      (3, 'Sofia', 'Weber', '80331', 'Gartenweg 21', 'Muenchen', '015133333333', 'sofia.weber@example.com'),
      (4, 'Jonas', 'Fischer', '50667', 'Schulstrasse 4', 'Koeln', '015144444444', 'jonas.fischer@example.com'),
      (5, 'Mila', 'Wagner', '04109', 'Parkallee 17', 'Leipzig', '015155555555', 'mila.wagner@example.com')
    `);

    await connection.execute(`
      INSERT IGNORE INTO berufe (id, bezeichnung, branche) VALUES
      (1, 'Softwareentwickler', 'IT'),
      (2, 'Lehrer', 'Bildung'),
      (3, 'Krankenpfleger', 'Gesundheit'),
      (4, 'Architekt', 'Bauwesen'),
      (5, 'Marketing Manager', 'Marketing')
    `);

    await connection.execute(`
      INSERT IGNORE INTO arbeitgeber (id, firmenname, ort) VALUES
      (1, 'TechSoft GmbH', 'Berlin'),
      (2, 'Stadtgymnasium Koeln', 'Koeln'),
      (3, 'Klinik Leipzig', 'Leipzig'),
      (4, 'Planbau AG', 'Muenchen'),
      (5, 'MediaWerbung GmbH', 'Hamburg')
    `);

    await connection.execute(`
      INSERT IGNORE INTO anstellungen (id, person_id, beruf_id, arbeitgeber_id, startdatum) VALUES
      (1, 1, 1, 1, '2021-03-01'),
      (2, 2, 5, 5, '2020-06-15'),
      (3, 3, 4, 4, '2019-09-01'),
      (4, 4, 2, 2, '2018-08-20'),
      (5, 5, 3, 3, '2022-01-10')
    `);

    await connection.execute(`
      INSERT IGNORE INTO hobbys (id, hobby_name) VALUES
      (1, 'Lesen'),
      (2, 'Joggen'),
      (3, 'Fotografie'),
      (4, 'Kochen'),
      (5, 'Reisen'),
      (6, 'Schach')
    `);

    await connection.execute(`
      INSERT IGNORE INTO personen_hobbys (person_id, hobby_id) VALUES
      (1, 1),
      (1, 2),
      (2, 5),
      (2, 6),
      (3, 3),
      (3, 4),
      (4, 1),
      (4, 6),
      (5, 2),
      (5, 4)
    `);

    await connection.execute(`
      INSERT IGNORE INTO ausbildungen (id, abschluss, fachrichtung, einrichtung) VALUES
      (1, 'Bachelor', 'Informatik', 'TU Berlin'),
      (2, 'Master', 'Marketing', 'Uni Hamburg'),
      (3, 'Master', 'Architektur', 'TU Muenchen'),
      (4, 'Staatsexamen', 'Lehramt', 'Uni Koeln'),
      (5, 'Berufsausbildung', 'Pflege', 'Berufsschule Leipzig')
    `);

    await connection.execute(`
      INSERT IGNORE INTO personen_ausbildungen (id, person_id, ausbildung_id, jahr_von, jahr_bis) VALUES
      (1, 1, 1, 2015, 2018),
      (2, 2, 2, 2016, 2020),
      (3, 3, 3, 2013, 2019),
      (4, 4, 4, 2012, 2018),
      (5, 5, 5, 2017, 2020)
    `);

    await connection.execute(`
      INSERT IGNORE INTO sprachen (id, name) VALUES
      (1, 'Deutsch'),
      (2, 'Englisch'),
      (3, 'Franzoesisch'),
      (4, 'Spanisch')
    `);

    await connection.execute(`
      INSERT IGNORE INTO personen_sprachen (person_id, sprache_id, niveau) VALUES
      (1, 1, 'Muttersprache'),
      (1, 2, 'C1'),
      (2, 1, 'Muttersprache'),
      (2, 2, 'B2'),
      (3, 1, 'Muttersprache'),
      (3, 4, 'A2'),
      (4, 1, 'Muttersprache'),
      (4, 3, 'B1'),
      (5, 1, 'Muttersprache'),
      (5, 2, 'B1')
    `);

    await connection.commit();
    console.log('Tabellen erstellt und Daten eingefügt.');
  } catch (error) {
    await connection.rollback();
    console.error('Fehler:', error);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('Verbindungsfehler:', error);
  process.exit(1);
});
