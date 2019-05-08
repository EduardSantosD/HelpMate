// import configuration of enviroment
require('dotenv').config();

// Express imports
const express = require('express');
const app = express();
const path = require('path');

// Express router imports
const root_router = require('./routes/root');
const register_router = require('./routes/register');
const login_router = require('./routes/login');
const courses_router = require('./routes/courses');
const api_router = require('./routes/usersAPI');

// Express app configuration
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

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
