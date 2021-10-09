// Req. Dependencies
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const expressSession = require('express-session');

const app = express();

// Configure Settings
require('dotenv').config();
const PORT = process.env.PORT;

// Database 
const DATABASE_URL = process.env.DATABASE_URL;
mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on('connected', () => console.log('Connected to MongoDB'));
db.on('error', (error) => console.log('MongoDB Error ' + error.message));

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(expressSession({
    secret: 'fluxcapacitor', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000 // 24 hour session 
    } 
}));

// Routes
app.get('/', (req, res) => {
    res.render('home.ejs');
});

// Listen
app.listen(PORT, () => {console.log(`Express is listening on port:${PORT}`)});
