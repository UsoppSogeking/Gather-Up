const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Gather-up',
            version: '1.0.0',
            description: 'API de gerenciamento de eventos.',
        },
        servers: [
            {
                url: 'https://gather-up.onrender.com',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app, port) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Documentação da API disponível em https://gather-up.onrender.com/docs`);
}

module.exports = { swaggerDocs };
