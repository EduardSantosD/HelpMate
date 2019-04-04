// import configuration of enviroment
require('dotenv').config();

// React imports
const react = require('react');
const reactDOM = require('react-dom');
const reactEngine = require('express-react-views').createEngine();

// Express imports
const express = require('express');
const app = express();
const path = require('path');

// Express router imports
const rootRouter = require('./routes/root');

// Cloudant configuration
const Cloudant = require('@cloudant/cloudant');
const dbUsername = process.env.cloudant_username;
const dbPassword = process.env.cloudant_passoword;
const cloudant = Cloudant({ account: dbUsername, password: dbPassword});

// Set up view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

// Routes redirects
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', rootRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Escuchando en puerto ${port}...`));
