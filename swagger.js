const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

function setupSwagger(app) {
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'Personen API – Swagger UI',
    })
  );
}

module.exports = setupSwagger;