const Ajv = require("ajv");
const ajv = new Ajv();

const personenSchema = {
    type: "object",
    properties: {
        id: { type: "integer" },
        vorname: { type: "string", minLength: 1 },
        nachname: { type: "string", minLength: 1 },
        plz: { type: "string", minLength: 1 },
        strasse: { type: "string", minLength: 1 },
        ort: { type: "string", minLength: 1 },
        telefonnummer: { type: "string", minLength: 1 },
        email: {
            type: "string",
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
        }
    },
    required: ["vorname", "nachname", "plz", "strasse", "ort", "telefonnummer", "email"],
    additionalProperties: false
};

const validatePerson = ajv.compile(personenSchema);

module.exports = { validatePerson };