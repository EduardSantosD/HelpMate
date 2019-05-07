require('dotenv').config({ path: '../.env' })
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Cloudant = require('@cloudant/cloudant');
const nanoid = require('nanoid');

const { validate_student, validate_professor, validate_login, validate_course,
        validate_enroll, validate_pending_admin, validate_question, validate_answer } = require('../classes/validators');
const Student = require('../classes/Student');
const Professor = require('../classes/Professor');
const Course = require('../classes/Course');
const Question = require('../classes/Question');
const Answer = require('../classes/Answer');
const auth = require('../middleware/auth_api');
const sleep = require('../helpers/sleep');

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
    return res.status(201).send({
        email: professor.email,
        first_name: professor.first_name,
        middle_name: professor.middle_name,
        last_name: professor.last_name,
        age: professor.age,
        gender: professor.gender,
        department: professor.department
    });
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
    return res.status(201).send({
        email: student.email,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        age: student.age,
        gender: student.gender,
        major: student.major,
        semester: student.semester
    });
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
    user.jwt = token;
    ['_id', '_rev', 'password'].forEach(value => delete user[value]);

    res.status(200).send(user);
});

router.get('/courses', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];
    const admin_courses = new Array();

    for (let i = 0; i < user.admin_courses.length; i++) {
        query_response = await courses_db.find({
            selector: {
                _id: { "$eq": user.admin_courses[i] }
            },
            fields: ["name", "id", "key", "term", "year"]
        });
        admin_courses.push(query_response.docs[0]);
    }

    if (user.courses) {
        const courses = new Array();
        for (let i = 0; i < user.courses.length; i++) {
            query_response = await courses_db.find({
                selector: {
                    _id: { "$eq": user.courses[i] }
                },
                fields: ["name", "id", "key", "term", "year"]
            });
            courses.push(query_response.docs[0]);
        }
        return res.status(200).send({ admin_courses: admin_courses, courses: courses });
    }

    res.status(200).send({ admin_courses: admin_courses });
});

// Look up method, can be more complex
router.get('/courses/search/:course', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];
    if (!user.semester) return res.status(401).send('Error: this user is not able to enroll to courses.');

    const limit = req.query.limit || 10;
    const regex = new RegExp(req.params.course);
    query_response = await courses_db.find({
        selector: {
            name: { "$regex": regex.source }
        },
        fields: ["name", "id", "term", "year", "admins"],
        limit: limit
    });
    courses = query_response.docs;

    for (let i = 0; i < courses.length; i++) {
        const temp_course = courses[i];
        query_response = await users_db.find({
            selector: { _id: { "$eq": temp_course.admins[0] } },
            fields: ["first_name", "last_name", "department"]
        });

        // First admin of each course is the one who created the course,
        // therefore it must be a professor. This is used to identify a 
        // course when students enroll.
        const temp_user = query_response.docs[0];
        temp_course.admins = new Array(temp_user);
    }

    res.status(200).send(courses);
});

router.get('/courses/pending_admins', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const professor = query_response.docs[0];
    if (!professor.department) return res.status(401).send('Error: this user is not able to authorize course administration.');

    query_response = await courses_db.find({
        selector: {
            admins: {
                "$elemMatch": { "$eq": professor._id }
            },
            "$not": {
                pending_admins: {"$size": 0}
            }
        },
        fields: ["name", "id", "key", "term", "year", "pending_admins"]
    }); 
    if(!query_response.docs[0]) return res.status(200).send([]);
    var courses = query_response.docs;
    const pending_query = new Array();
    for (let i = 0; i < courses.length; i++) {
        const temp_course = courses[i];
        for (let j = 0; j < temp_course.pending_admins.length; j++) {
            pending_query.push({ _id: { "$eq": temp_course.pending_admins[j] } }); 
        }
    }

    query_response = await users_db.find({
        selector: {
            "$or": pending_query
        }, fields: ["_id", "first_name", "middle_name", "last_name", "email"]
    });
    const pending_users = query_response.docs;
    
    for (let i = 0; i < courses.length; i++) {
        for (let j = 0; j < courses[i].pending_admins.length; j++) {
            var index = pending_users.findIndex(student => student._id === courses[i].pending_admins[j]);
            courses[i].pending_admins[j] = {
                first_name: pending_users[index].first_name,
                middle_name: pending_users[index].middle_name,
                last_name: pending_users[index].last_name,
                email: pending_users[index].email
            }   
        }
    }

    res.status(200).send(courses);
});

router.get('/courses/:course', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');
    const questions_db = await cloudant.use('questions');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];

    query_response = await courses_db.find({
        selector: {
            key: { "$eq": req.params.course },
            "$or": [
                { users: { "$elemMatch": { "$eq": user._id } } },
                { admins: { "$elemMatch": { "$eq": user._id } } }
            ]
        },
        fields: ["_id", "name", "id", "key", "term", "year", "tags", "questions", "instructor"]
    });
    if(!query_response.docs[0]) return res.status(400).send('Error: user is not enrolled in the selected course.');
    
    const course = query_response.docs[0];
    var page_num = parseInt(req.query.page_num) || 1;
    var page_size = parseInt(req.query.page_size) || 5;
    if(page_num < 1) page_num = 1;
    if(page_size < 1) page_size = 1;
    const skip = (page_num-1)*page_size;
    var questions_ids = course.questions.reverse().splice(skip, page_size);
    for (let i = 0; i < questions_ids.length; i++) {
        questions_ids[i] = { "_id": { "$eq": questions_ids[i] } }
    }
    query_response = await questions_db.find({
        selector: {
            course: { "$eq": course._id},
            "$or": questions_ids
        },
        fields: ["id", "title", "content", "creation_date", "solved", "tags", "no_answers", "views", "instructor"],
    });
    var questions = query_response.docs;
    questions.sort( (a, b)=>{
        return new Date(b.creation_date) - new Date(a.creation_date)
    });
    delete course._id;
    delete course.questions;
    
    res.status(200).send([course, questions]);
});

router.get('/courses/:course/users', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await courses_db.find({
        selector:{
            key: { "$eq": req.params.course},
            "$or": [
                { users: {"$elemMatch": { "$eq": req.user } } },
                { admins: { "$elemMatch": { "$eq": req.user } } }
            ]
        }, fields: ["users", "admins"]
    });
    if(!query_response.docs[0]) return res.status(400).send('Error: user is not enrolled in this course');
    const course = query_response.docs[0];
    var users = course.users;
    var admins = course.admins;

    for (let i = 0; i < users.length; i++) {
        users[i] = { _id: { "$eq": users[i] } };
    }
    for (let i = 0; i < admins.length; i++) {
        admins[i] = { _id: { "$eq": admins[i] } };
    }

    query_response = await users_db.find({
        selector: {
            "$or": users
        }, fields: ["first_name", "middle_name", "last_name", "email"]
    });
    users = query_response.docs;

    query_response = await users_db.find({
        selector: {
            "$or": admins
        }, fields: ["first_name", "middle_name", "last_name", "email"]
    });
    admins = query_response.docs;

    res.status(200).send([admins, users]);
});

router.get('/courses/:course/pending_admins', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];
    if (!user.department) return res.status(401).send('Error: this user is not able to authorize course administration.');

    query_response = await courses_db.find({
        selector: {
            key: req.params.course,
            admins: { "$elemMatch": { "$eq": user._id } }
        },
        fields: ["key", "name", "id", "term", "year", "pending_admins"]
    });
    if(!query_response.docs[0]) return res.status(400).send('Error: user is not enrolled in the course.');
    const course = query_response.docs[0];
    var pending = course.pending_admins;
    for (let i = 0; i < pending.length; i++) {
        pending[i] = { _id:  { "$eq": pending[i] } };
    }

    query_response = await users_db.find({
        selector: {
            "$or": pending
        },
        fields: ["first_name", "middle_name", "last_name", "email"]
    });
    pending = query_response.docs;
    delete course.pending_admins;

    res.status(200).send([course, pending]);
});

router.get('/courses/:course/q/:question', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');
    const questions_db = await cloudant.use('questions');
    const answers_db = await cloudant.use('answers');

    query_response = await courses_db.find({
        selector: {
            key: { "$eq": req.params.course },
            "$or": [
                { users: { "$elemMatch": { "$eq": req.user } } },
                { admins: { "$elemMatch": { "$eq": req.user } } }
            ]
        },
        fields: ["_id", "key"]
    });
    if (!query_response.docs[0]) return res.status(401).send('Error: user is not enrolled in the selected course.');
    const course = query_response.docs[0];

    query_response = await questions_db.find({
        selector: {
            course: { "$eq": course._id },
            id: { "$eq": req.params.question }
        },
        // fields: ["id", "title", "content", "author", "anonymous", "creation_date", "solved", "resolution_date", "tags", "no_answers", "views", "approved", "answers"] 
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: could not find question.')
    var question = query_response.docs[0];
    question.views = question.views + 1;
    await questions_db.insert(question)
    question.course_id = course.key;

    if (!question.anonymous) {
        query_response = await users_db.find({
            selector: {
                _id: { "$eq": question.author }
            }, fields: ["first_name", "last_name"]
        });
        if (!query_response.docs[0]) return res.status(400).send('Error: could not find author for the question');
        question.author = query_response.docs[0].first_name + ' ' + query_response.docs[0].last_name;
    }

    var page_num = parseInt(req.query.page_num) || 1;
    var page_size = parseInt(req.query.page_size) || 5;
    if (page_num < 1) page_num = 1;
    if (page_size < 1) page_size = 1;
    const skip = (page_num - 1) * page_size;
    var answers_ids = question.answers.reverse().splice(skip, page_size);
    for (let i = 0; i < answers_ids.length; i++) {
        answers_ids[i] = { "_id": { "$eq": answers_ids[i] } }
    }  
    sleep(300);
    query_response = await answers_db.find({
        selector: {
            question: { "$eq": question._id },
            "$or": answers_ids
        },
        fields: ["id", "content", "author", "anonymous", "instructor", "creation_date", "correct", "comments", "no_comments", "approved"]
    });
    var answers = query_response.docs;
    if (!answers) answers = new Array();
    
    var temp_users = new Array();
    for (let i = 0; i < answers.length; i++) {
        temp_users[i] = { "_id": { "$eq": answers[i].author } }
    }
    query_response = await users_db.find({
        selector: {
            "$or": temp_users
        }, fields: ["_id", "first_name", "last_name"]
    });
    temp_users = query_response.docs;
    for (let i = 0; i < answers.length; i++) {
        if(!answers[i].anonymous){
            var index = temp_users.findIndex(student => student._id === answers[i].author);
            answers[i].author = temp_users[index].first_name + ' ' + temp_users[index].last_name;
        } else{
            answers[i].author = 'anonymous';
        }        
    }

    ['answers', '_id', '_rev', 'answers', 'course', 'approved_users'].forEach(value => delete question[value]);

    answers.sort((a, b) => {
        return new Date(b.creation_date) - new Date(a.creation_date)
    });

    res.status(200).send([question, answers])
});

router.post('/courses/new_course', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];
    if (!user.department) return res.status(401).send('Error: this user is not authorized to create new courses');

    var course = new Course(req.body.name, req.body.id, req.body.tags, req.body.term, req.body.year);
    course.admins.push(user._id);

    const { error } = validate_course(course);
    if (error) return res.status(400).send(error.details[0].message);

    query_response = await courses_db.find({
        selector: {
            name: { "$eq": course.name },
            term: { "$eq": course.term },
            year: { "$eq": course.year },
            admins: { "$elemMatch": { "$eq": user._id } }
        }
    });
    if (query_response.docs[0]) return res.status(400).send('Error: user has already defined a course with the specified name, term and year');

    query_response = await courses_db.find({
        selector: {
            key: { "$eq": course.key },
            admins: { "$elemMatch": { "$eq": user._id } }
        }
    });
    // Avoid key collision
    if (query_response.docs[0]) course.key = nanoid(16);

    await courses_db.insert(course);
    query_response = await courses_db.find({ selector: { name: { "$eq": course.name }, admins: { "$elemMatch": { "$eq": user._id } } } });
    course = query_response.docs[0];

    user.admin_courses.push(course._id);
    await users_db.insert(user);

    res.status(201).send([{
        name: course.name,
        id: course.id,
        key: course.key,
        tags: course.tags,
        term: course.term,
        year: course.year
    }]);
});

router.post('/courses/enroll', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];
    if (!user.courses) return res.status(401).send('Error: this user is not able to enroll to courses.');

    const { error } = validate_enroll(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    query_response = await courses_db.find({
        selector: {
            name: { "$eq": req.body.name },
            id: { "$eq": req.body.id },
            key: { "$eq": req.body.key },
            term: { "$eq": req.body.term },
            year: { "$eq": req.body.year }
        }
    });

    if (!query_response.docs[0]) return res.status(400).send('Error: Incorrect course information or it does not exist.');

    const course = query_response.docs[0];
    if (user.courses.includes(course._id)) return res.status(400).send('Error: The user has already enrolled to this course.');

    course.users.push(req.user);
    await courses_db.insert(course);
    user.courses.push(course._id);
    await users_db.insert(user);

    res.status(200).send({
        message: 'User enrolled to the course.',
        course: course.key,
        email: user.email,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        major: user.major,
    });
});

router.post('/courses/enroll_admin', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];
    if (!user.courses) return res.status(401).send('Error: this user is not able to enroll to courses.');

    const { error } = validate_enroll(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    query_response = await courses_db.find({
        selector: {
            name: { "$eq": req.body.name },
            id: { "$eq": req.body.id },
            key: { "$eq": req.body.key },
            term: { "$eq": req.body.term },
            year: { "$eq": req.body.year }
        }
    });

    if (!query_response.docs[0]) return res.status(400).send('Error: Incorrect course information or it does not exist.');

    const course = query_response.docs[0];
    if (user.admin_courses.includes(course._id)) return res.status(400).send('Error: The is already administrator of this course.');
    if (course.pending_admins.includes(user._id)) return res.status(400).send('Error: This user has already submitted an application.')

    course.pending_admins.push(user._id);
    await courses_db.insert(course);

    res.status(200).send({
        status: 'Application sent. An administrator must approve your application',
        email: user.email,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        major: user.major,
        course: course.key
    });
})

router.post('/courses/:course/pending_admins', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const professor = query_response.docs[0];
    if (!professor.department) return res.status(401).send('Error: this user is not able to authorize course administration.');

    const { error } = validate_pending_admin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    query_response = await courses_db.find({
        selector: {
            key: { "$eq": req.params.course },
            admins: { "$elemMatch": { "$eq": professor._id } }
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: Course does not exist.');

    const course = query_response.docs[0];

    query_response = await users_db.find({
        selector: {
            email: { "$eq": req.body.email }
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: Could not find user with given email.');

    const new_admin = query_response.docs[0];

    if (!course.pending_admins.includes(new_admin._id)) return res.status(400).send('Error: user does not have a pending application to become administrator of the selected course.')

    const pending_index = course.pending_admins.indexOf(new_admin._id);
    course.pending_admins.splice(pending_index, 1);
    var status = '';

    // If professor approves request
    if (req.body.verdict) {
        course.admins.push(new_admin._id);
        await courses_db.insert(course);
        new_admin.admin_courses.push(course._id);
        await users_db.insert(new_admin);
        status = 'Request for new administrator has been approved.'
    } else {
        await courses_db.insert(course);
        status = 'Request for new administrator has been denied.'
    }

    var admin_list = new Array();
    for (let i = 0; i < course.admins.length; i++) {
        query_response = await users_db.find({
            selector: {
                _id: { "$eq": course.admins[i] }
            },
            fields: ["first_name", "middle_name", "last_name", "email"]
        });
        admin_list.push(query_response.docs[0]);
    }

    const response = {
        status: status,
        name: course.name,
        id: course.id,
        term: course.term,
        year: course.year,
        admins: admin_list
    }

    res.status(200).send(response);
});

router.post('/courses/:course/new_question', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');
    const questions_db = await cloudant.use('questions');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];

    query_response = await courses_db.find({
        selector: {
            key: { "$eq": req.params.course },
            "$or": [
                { users: { "$elemMatch": { "$eq": user._id } } },
                { admins: { "$elemMatch": { "$eq": user._id } } }
            ]
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: user is not registered in the indicated course');

    const course = query_response.docs[0];
    var instructor = false;
    if(course.admins.includes(user._id)) instructor = true;
    var question = new Question(req.body.title, req.body.content, user._id, req.body.anonymous, req.body.tags, course._id, instructor);

    const { error } = validate_question(question);
    if (error) return res.status(400).send(error.details[0].message);

    for (let i = 0; i < question.tags.length; i++) {
        if (!course.tags.includes(question.tags[i])) return res.status(400).send('Error: tag \'' + question.tags[i] + '\' is not a valid tag for the course.')

    }

    query_response = await questions_db.find({
        selector: {
            id: { "$eq": question.id },
            course: { "$eq": course._id }
        }
    });
    // Avoid collision of ids for questions of a same course
    if (query_response.docs[0]) question.id = nanoid(16);

    await questions_db.insert(question);
    query_response = await questions_db.find({
        selector: {
            title: { "$eq": question.title },
            content: { "$eq": question.content },
            author: { "$eq": question.author }
        }
    });
    question = query_response.docs[0];

    course.questions.push(question._id);
    await courses_db.insert(course);

    var author = user.first_name + ' ' + user.last_name;
    if (question.anonymous) author = 'anonymous';

    res.status(200).send({
        id: question.id,
        title: question.title,
        author: author,
        content: question.content,
        tags: question.tags,
        creation_date: question.creation_date,
        instructor: question.instructor,
        course: {
            name: course.name,
            id: course.id,
            term: course.term,
            year: course.year
        }
    })
});

router.post('/courses/:course/q/:question/good_question', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');
    const questions_db = await cloudant.use('questions');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');
    const user = query_response.docs[0];

    query_response = await courses_db.find({
        selector: {
            key: { "$eq": req.params.course },
            "$or": [
                { users: { "$elemMatch": { "$eq": user._id } } },
                { admins: { "$elemMatch": { "$eq": user._id } } }
            ]
        },
        fields: ["_id", "key"]
    });
    if (!query_response.docs[0]) return res.status(401).send('Error: user is not enrolled in the selected course.');
    const course = query_response.docs[0];

    query_response = await questions_db.find({
        selector: {
            course: { "$eq": course._id},
            id: { "$eq": req.params.question}
        }
    });
    if(!query_response.docs[0]) return res.status(400).send('Error: could not find question.')
    var question = query_response.docs[0];
    var message = '';

    if(question.approved_users.includes(user._id)){
        question.approved--;
        var index = question.approved_users.indexOf(user._id);
        question.approved_users.splice(index, 1);
        message = 'User no longer approves this question.';
    }else{
        question.approved++;
        question.approved_users.push(user._id);
        message = 'User approves this question.';
    }
    sleep(300);
    await questions_db.insert(question);
    
    res.status(200).send({message: message, id: question.id, course: course.key, approved: question.approved});
});

router.post('/courses/:course/q/:question/solved', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');
    const questions_db = await cloudant.use('questions');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');
    const user = query_response.docs[0];

    query_response = await courses_db.find({
        selector: {
            key: { "$eq": req.params.course },
            "$or": [
                { users: { "$elemMatch": { "$eq": user._id } } },
                { admins: { "$elemMatch": { "$eq": user._id } } }
            ]
        },
        fields: ["_id", "key", "admins"]
    });
    if (!query_response.docs[0]) return res.status(401).send('Error: user is not enrolled in the selected course.');
    const course = query_response.docs[0];

    if(!course.admins.includes(user._id)) return res.status(401).send('Error: user is not authorized to mark a question as being solved.')

    query_response = await questions_db.find({
        selector: {
            course: { "$eq": course._id },
            id: { "$eq": req.params.question }
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: could not find question.')
    var question = query_response.docs[0]; query_response.docs[0];
    var message = '';

    if (question.solved) {
        question.solved = false;
        question.resolution_date = undefined;
        message = 'User has marked question as not solved.';
    } else {
        question.solved = true;
        question.resolution_date = new Date();
        message = 'User has marked question as solved.';
    }
    sleep(300);
    await questions_db.insert(question);

    res.status(200).send({
        message: message,
        id: question.id,
        course: course.key,
        solved: question.solved,
        resolution_date: question.resolution_date
    });
});

//** new */
router.post('/courses/:course/q/:question/new_answer', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');
    const questions_db = await cloudant.use('questions');
    const answers_db = await cloudant.use('answers');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');
    const user = query_response.docs[0];

    query_response = await courses_db.find({
        selector: {
            key: { "$eq": req.params.course },
            "$or": [
                { users: { "$elemMatch": { "$eq": user._id } } },
                { admins: { "$elemMatch": { "$eq": user._id } } }
            ]
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: user is not registered in the indicated course');
    const course = query_response.docs[0];

    query_response = await questions_db.find({
        selector: {
            id: { "$eq": req.params.question},
            course: { "$eq": course._id}
        }
    });
    if(!query_response.docs[0]) return res.status(400).send('Error: could not find question for the selected course.');
    const question = query_response.docs[0];
    var instructor = false;
    if(course.admins.includes(user._id)) instructor = true;
    var answer = new Answer(req.body.content, user._id, req.body.anonymous, question._id, instructor);

    query_response = await answers_db.find({
        selector: {
            id: { "$eq": answer.id},
            question: { "$eq": question._id}
        }
    });
    if(query_response.docs[0]) answer.id = nanoid(16);

    const { error } = validate_answer(answer);
    if(error) return res.status(400).send(error.details[0].message);

    await answers_db.insert(answer);
    query_response = await answers_db.find({
        selector: {
            id: {"$eq": answer.id},
            question: {"$eq": question._id},
            author: { "$eq": user._id}
        }
    });
    answer = query_response.docs[0];
    if(question.answers.length === 0) question.no_answers = false;
    question.answers.push(answer._id);
    await questions_db.insert(question);

    var author = user.first_name + ' ' + user.last_name;
    if (answer.anonymous) author = 'anonymous';

    res.status(200).send({
        id: answer.id,
        author: author,
        content: answer.content,
        creation_date: answer.creation_date,
        instructor: answer.instructor,
        question: question.id
    })
});

//** new */
router.post('/courses/:course/q/:question/a/:answer/good_answer', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const courses_db = await cloudant.use('courses');
    const questions_db = await cloudant.use('questions');
    const answers_db = await cloudant.use('answers');

    query_response = await courses_db.find({
        selector: {
            key: { "$eq": req.params.course },
            "$or": [
                { users: { "$elemMatch": { "$eq": req.user } } },
                { admins: { "$elemMatch": { "$eq": req.user } } }
            ]
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: user is not registered in the indicated course');
    const course = query_response.docs[0];

    query_response = await questions_db.find({
        selector: {
            id: { "$eq": req.params.question },
            course: { "$eq": course._id }
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: could not find question for the selected course.');
    const question = query_response.docs[0];

    query_response = await answers_db.find({
        selector: {
            id: { "$eq": req.params.answer},
            question: { "$eq": question._id}
        }
    });
    if(!query_response.docs[0]) return res.status(400).send('Error: could not find answer for the selected course');
    const answer = query_response.docs[0];
    var message = '';

    if (answer.approved_users.includes(req.user)) {
        answer.approved--;
        var index = answer.approved_users.indexOf(req.user);
        answer.approved_users.splice(index, 1);
        message = 'User no longer approves this answer.';
    } else {
        answer.approved++;
        answer.approved_users.push(req.user);
        message = 'User approves this answer.';
    }
    sleep(300);
    await answers_db.insert(answer);

    res.status(200).send({ message: message, id: answer.id, question: question.id, approved: answer.approved });
});

//** new */
router.post('/courses/:course/q/:question/a/:answer/correct_answer', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const courses_db = await cloudant.use('courses');
    const questions_db = await cloudant.use('questions');
    const answers_db = await cloudant.use('answers');

    query_response = await courses_db.find({
        selector: {
            key: { "$eq": req.params.course },
            "$or": [
                { users: { "$elemMatch": { "$eq": req.user } } },
                { admins: { "$elemMatch": { "$eq": req.user } } }
            ]
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: user is not registered in the indicated course');
    const course = query_response.docs[0];

    if (!course.admins.includes(req.user)) return res.status(401).send('Error: user is not allowed to verify this answer.')

    query_response = await questions_db.find({
        selector: {
            id: { "$eq": req.params.question },
            course: { "$eq": course._id }
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: could not find question for the selected course.');
    const question = query_response.docs[0];

    sleep(300);
    query_response = await answers_db.find({
        selector: {
            id: { "$eq": req.params.answer },
            question: { "$eq": question._id }
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: could not find answers for the selected course');
    const answer = query_response.docs[0];
    var message = '';

    if (answer.correct) {
        answer.correct = false;
        message = 'User has unmarked this answer as correct.';
    } else {
        answer.correct = true;
        message = 'User has marked this answer as correct.';
    }
    await answers_db.insert(answer);
    await questions_db.insert(question);

    res.status(200).send({ message: message, id: answer.id, question: question.id, correct: answer.correct });
});

router.delete('/courses/:course/leave', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');
    const user = query_response.docs[0];

    query_response = await courses_db.find({
        selector: {
            key: req.params.course,
            users: { "$elemMatch": { "$eq": user._id } }
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: user is not enrolled to the selected course.')
    const course = query_response.docs[0];

    var index = course.users.indexOf(user._id);
    course.users.splice(index, 1);
    await courses_db.insert(course);
    index = user.courses.indexOf(course._id);
    user.courses.splice(index, 1);
    await users_db.insert(user);

    res.status(200).send({
        message: 'User left the course.',
        course: {
            name: course.name,
            id: course.id,
            term: course.term,
            year: course.year
        }
    });
});

router.delete('/courses/:course/leave_admin', auth, async (req, res) => {
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');
    const user = query_response.docs[0];

    query_response = await courses_db.find({
        selector: {
            key: req.params.course,
            admins: { "$elemMatch": { "$eq": user._id } }
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: user is not administrator of the selected course.')
    const course = query_response.docs[0];

    var index = course.admins.indexOf(user._id);
    course.admins.splice(index, 1);
    await courses_db.insert(course);
    index = user.admin_courses.indexOf(course._id);
    user.admin_courses.splice(index, 1);
    await users_db.insert(user);

    res.status(200).send({
        message: 'User left administration for the course.',
        course: {
            name: course.name,
            id: course.id,
            term: course.term,
            year: course.year
        }
    });
});

router.delete('/courses/:course/q/:question', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');
    const questions_db = await cloudant.use('questions');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');
    const user = query_response.docs[0];

    query_response = await courses_db.find({
        selector: {
            key: req.params.course,
            $or:[
                { admins: { "$elemMatch": { "$eq": user._id } } },
                { users: { "$elemMatch": { "$eq": user._id} } }
            ]
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: user is enrolled in the selected course.')
    const course = query_response.docs[0];

    query_response = await questions_db.find({
        selector: {
            id: req.params.question,
            course: course._id
        }
    });
    if(!query_response.docs[0]) return res.status(404).send('Error: could not find question for the selected course.')
    const question = query_response.docs[0];
    if(question.author !== user._id) return res.status(401).send('Error: user is not the author of the question.')
    var index = course.questions.indexOf(question._id);
    course.questions.splice(index, 1);
    await courses_db.insert(course);
    await questions_db.destroy(question._id, question._rev);
    
    res.status(200).send({ message: 'Question deleted.' });
});

//** new */
router.delete('/courses/:course/q/:question/a/:answer', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const courses_db = await cloudant.use('courses');
    const questions_db = await cloudant.use('questions');
    const answers_db = await cloudant.use('answers');

    query_response = await courses_db.find({
        selector: {
            key: { "$eq": req.params.course },
            "$or": [
                { users: { "$elemMatch": { "$eq": req.user } } },
                { admins: { "$elemMatch": { "$eq": req.user } } }
            ]
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: user is not registered in the indicated course');
    const course = query_response.docs[0];

    query_response = await questions_db.find({
        selector: {
            id: { "$eq": req.params.question },
            course: { "$eq": course._id }
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: could not find question for the selected course.');
    const question = query_response.docs[0];

    query_response = await answers_db.find({
        selector: {
            id: { "$eq": req.params.answer },
            question: { "$eq": question._id }
        }
    });
    if (!query_response.docs[0]) return res.status(400).send('Error: could not find the answer for the selected course');
    const answer = query_response.docs[0];
    
    if(answer.author !== req.user) return res.status(401).send('Error: user is not authorized to delete this answer.');
    sleep(300);
    var index = question.answers.indexOf(answer._id);
    question.answers.splice(index, 1);
    await questions_db.insert(question);
    await answers_db.destroy(answer._id, answer._rev);

    res.status(200).send({ message: 'Answer deleted.' });
});

module.exports = router;