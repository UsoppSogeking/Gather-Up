const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GatherUp',
            version: '1.0.0',
            description: 'API de gerenciamento de eventos.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app, port) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Documentação da API disponível em http://localhost:${port}/docs`);
}

module.exports = { swaggerDocs, swaggerSpec };
