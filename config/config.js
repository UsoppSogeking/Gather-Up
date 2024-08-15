require('dotenv').config(); 

module.exports = {
    development: {
        username: process.env.DB_USER || 'defaultUsername',
        password: process.env.DB_PASSWORD || 'defaultPassword',
        database: process.env.DB_NAME || 'defaultDatabase',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    },
    test: {
        username: process.env.DB_USER || 'defaultUsername',
        password: process.env.DB_PASSWORD || 'defaultPassword',
        database: process.env.DB_NAME || 'defaultDatabase',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};

