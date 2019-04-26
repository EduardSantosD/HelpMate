require('dotenv').config({ path: '../.env' })
const express = require('express');
const router = express.Router();
const Cloudant = require('@cloudant/cloudant');
const { validate_student, validate_professor } = require('../classes/validators');
const Student = require('../classes/Student');
const Professor = require('../classes/Professor');

router.get('/professor', (req, res) =>{
    res.render('register_professor');
})

router.get('/student', (req, res) =>{
    res.render('register_student');
})

router.post('/professor', async (req, res) =>{
    if( '0'.localeCompare(req.body.gender) ) req.body.gender = 'male';
    else if( '1'.localeCompare(req.body.gender) ) req.body.gender = 'female';
    else req.body.gender = 'other';
    req.body.age = parseInt(req.body.age)

    const { error } = validate_professor(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');

    query_response = await users_db.find({ selector: { email: {"$eq" : req.body.email } } } );
    if(query_response.docs[0]) return res.status(404).send('email already in use');

    professor = new Professor(req.body.email, req.body.password, req.body.first_name, 
                                    req.body.middle_name, req.body.last_name, req.body.age, req.body.gender, req.body.department);
                                    
    await users_db.insert(professor);
    return res.status(201).redirect('/');
})

module.exports = router;