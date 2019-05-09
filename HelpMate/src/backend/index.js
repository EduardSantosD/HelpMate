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
const cors = require('cors');

// Express router imports
const root_router = require('./routes/root');
const register_router = require('./routes/register');
const login_router = require('./routes/login');
const courses_router = require('./routes/courses');
const api_router = require('./routes/usersAPI');

// Express app configuration
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// Set up view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

// Routes redirects
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/register', register_router);
app.use('/login', login_router);
app.use('/courses', courses_router);
app.use('/api', api_router);
app.use('/', root_router);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Escuchando en puerto ${port}...`));
