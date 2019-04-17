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
const root_router = require('./routes/root');
const register_router = require('./routes/register');

// Cloudant configuration
// const Cloudant = require('@cloudant/cloudant');
// const url_cloudant = process.env.cloudant_url;
// const port_cloudant = process.env.cloudant_port;
// const cloudant = Cloudant({ url: url_cloudant + ':' + port_cloudant }, async (err, cloudant, pong) => {
//     if(err) return console.log('Error connecting to Cloudant: ', err.message);
//     console.log(pong);
//     const list_db = await cloudant.db.list();
//     list_db.forEach( (db) =>{
//         console.log(db);
//     })
// });

// Express app configuration
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Set up view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

// Routes redirects

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', root_router);
app.use('/register', register_router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Escuchando en puerto ${port}...`));

// exports.cloudant = cloudant;