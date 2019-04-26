require('dotenv').config({ path: '../.env' })
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Cloudant = require('@cloudant/cloudant');

const { validate_student, validate_professor, validate_login, validate_course } = require('../classes/validators');
const Student = require('../classes/Student');
const Professor = require('../classes/Professor');
const Course = require('../classes/Course');
const auth = require('../middleware/auth_api');

router.post('/register/professor', async(req, res) =>{
    if ('0'.localeCompare(req.body.gender)) req.body.gender = 'male';
    else if ('1'.localeCompare(req.body.gender)) req.body.gender = 'female';
    else req.body.gender = 'other';
    req.body.age = parseInt(req.body.age)

    const { error } = validate_professor(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');

    query_response = await users_db.find({ selector: { email: { "$eq": req.body.email } } });
    if (query_response.docs[0]) return res.status(404).send('Error: email already in use');

    const professor = new Professor(req.body.email, req.body.password, req.body.first_name,
        req.body.middle_name, req.body.last_name, req.body.age, req.body.gender, req.body.department);

    const salt = await bcrypt.genSalt(10);
    professor.password = await bcrypt.hash(professor.password, salt);

    await users_db.insert(professor);
    return res.status(201).send(professor);
});

router.post('/register/student', async(req, res) =>{
    if ('0'.localeCompare(req.body.gender)) req.body.gender = 'male';
    else if ('1'.localeCompare(req.body.gender)) req.body.gender = 'female';
    else req.body.gender = 'other';
    req.body.age = parseInt(req.body.age);
    req.body.semester = parseInt(req.body.semester);

    const { error } = validate_student(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');

    const query_response = await users_db.find({ selector: { email: { "$eq": req.body.email } } });
    if (query_response.docs[0]) return res.status(400).send('Error: email already in use');

    const student = new Student(req.body.email, req.body.password, req.body.first_name,
        req.body.middle_name, req.body.last_name, req.body.age, req.body.gender, req.body.major, req.body.semester);

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(student.password, salt);

    await users_db.insert(student);
    return res.status(201).send(student);
});

router.post('/login', async(req, res) =>{
    const { error } = validate_login(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');

    const query_response = await users_db.find({ selector: { email: { "$eq": req.body.email } } } );
    if (!query_response.docs[0]) return res.status(404).send('Error: incorrect username or password.');

    const user = query_response.docs[0];
    const valid = await bcrypt.compare(req.body.password, user.password);
    if(!valid) return res.status(400).send('Error: incorrect username or password.');

    const token = await jwt.sign({_id: user._id}, process.env.SECRET);

    res.status(200).send( { xauthtoken: token } );
});

router.post('/new_course', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find( { selector: { _id: { "$eq": req.user } } } );
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];
    if(!user.department) return res.status(400).send('Error: this user is not authorized to create new courses');

    var course = new Course(req.body.name, req.body.id, req.body.tags, req.body.term, req.body.year);
    course.admins.push(user._id);

    const { error } = validate_course(course);
    if (error) return res.status(400).send(error.details[0].message);

    query_response = await courses_db.find({ selector: {name: { "$eq" : course.name}, admins: { "$elemMatch": { "$eq": user._id } } } } );
    if(query_response.docs[0]) return res.status(400).send('Error: user has already defined a course with that name');

    await courses_db.insert(course);
    query_response = await courses_db.find({ selector: { name: { "$eq": course.name }, admins: { "$elemMatch": { "$eq": user._id } } } });
    course = query_response.docs[0];
    
    user.admin_courses.push(course._id);
    await users_db.insert(user);

    res.status(201).send([course, user]);
});

router.get('/enroll/:course', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];
    if (!user.semester) return res.status(400).send('Error: this user is not able to enroll to courses.');

    const limit = req.query.limit || 10;
    query_response = await courses_db.find({ selector: { name: { "$eq": req.params.course } }, 
                                             fields: ["name", "id", "term", "year", "admins"],
                                             limit: limit } );
    courses = query_response.docs;
    
    for (let i = 0; i < courses.length; i++) {
        const temp_course =  courses[i];
        console.log(temp_course);
        for (let j = 0; j < temp_course.admins.length; j++) {
            query_response = await users_db.find({
                selector: { _id: { "$eq": temp_course.admins[j] } },
                fields: ["first_name", "last_name", "department"]
            });   
            const temp_user = query_response.docs[0];
            temp_course.admins[j] = temp_user;
            console.log(temp_course.admins[j]);
        }
    }
    
    res.status(200).send(courses);
});

router.post('/enroll', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];
    if (!user.semester) return res.status(400).send('Error: this user is not able to enroll to courses.');

    const { error } = Joi.validate(req.body, {name: Joi.string().trim().required(), key: Joi.string().trim().required() } );
    if(error) return res.status(400).send(error.details[0].message);

    query_response = await courses_db.find( {selector: { name: { "$eq": req.body.name}, key: { "$eq": req.body.key} } } );
    if (!query_response.docs[0]) return res.status(400).send('Error: The course does not exist.');

    const course = query_response.docs[0];

});

module.exports = router;