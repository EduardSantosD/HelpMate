// import configuration of enviroment
require('dotenv').config({path: '../.env'});

// Import classes and validators
const { validate_student, validate_professor } = require('../classes/validators');
const User = require('../classes/User');
const Student = require('../classes/Student')
const Joi = require('joi');

// Cloudant configuration
const Cloudant = require('@cloudant/cloudant');
const url_cloudant = process.env.cloudant_url;
const port_cloudant = process.env.cloudant_port;
const cloudant = Cloudant({ url: url_cloudant + ':' + port_cloudant }, async (err, cloudant, pong) => {
    if (err) return console.log('Error connecting to Cloudant: ', err.message);
    console.log(pong);
    const list_db = await cloudant.db.list();
    list_db.forEach((db) => {
        console.log(db);
    })
});


const alex_student = new Student('haenrqz', 'ha.enrqz@gmail.com', '123', 'Hector', 'Alejandro', 'Enriquez', 22, 'male', 'isdr', 8);
// const alex_professor = new Professor('haenrqz_p', 'ha.enrqz@gmail.com', '123', 'Hector', 'Alejandro', 'Enriquez', '22', 'male', 'engineering');
const validation = validate_student(alex_student);
if (validation.error) {
    console.log('Joi error at', validation.error.details[0].context, ' : ', validation.error.details[0].message, '\r\n');
} else{
    console.log('inserting to database... \r\n')
    const users_db = cloudant.db.use('users')
    users_db.insert(alex_student);
}
// validation = validate_professor(alex_professor);
// if (validation.error) console.log('Joi error at', validation.error.details[0].context, ' : ', validation.error.details[0].message, '\r\n');


