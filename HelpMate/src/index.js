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

// Cloudant configuration
const Cloudant = require('@cloudant/cloudant');
const username_cloudant = process.env.cloudant_username;
const password_cloudant = process.env.cloudant_passoword;
const url_cloudant = process.env.cloudant_url;
const port_cloudant = process.env.cloudant_port;
const cloudant = Cloudant({url: url_cloudant+':'+port_cloudant}, async (err, cloudant, pong) => {
    if(err) return console.log('Error connecting to Cloudant: ', err.message);
    console.log(pong);
    const list_db = await cloudant.db.list();
    list_db.forEach( (db) =>{
        console.log(db);
    })
});


// Set up view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

// Routes redirects
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', root_router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Escuchando en puerto ${port}...`));
