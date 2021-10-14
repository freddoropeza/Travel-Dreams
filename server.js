// Req. Dependencies
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const methodOverride = require("method-override")
const indexController = require('./controllers/index');
const usersController = require('./controllers/users');
const postsController = require('./controllers/posts');

const expressSession = require('express-session');

const app = express();

// Configure Settings
require('dotenv').config();
const PORT = process.env.PORT;

// Database 
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);
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
app.use(express.static('public'))
app.use(methodOverride("_method"))

// Routes
app.use('/', indexController);
app.use('/', usersController);
app.use('/', postsController);

// Listen
app.listen(PORT, () => {console.log(`Express is listening on port:${PORT}`)});

console.log(MONGODB_URI)