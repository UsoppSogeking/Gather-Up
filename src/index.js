const express = require('express');
const cors = require('cors');
const sequelize = require('./database/config');

const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const eventRoutes = require('./routes/eventsRoutes');

const app = express();
app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

app.use("/", authRoutes);
// app.use("/", userRoutes);
// app.use("/", eventRoutes);

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}

module.exports = { app };
