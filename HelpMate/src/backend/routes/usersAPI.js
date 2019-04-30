require('dotenv').config({ path: '../.env' })
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Cloudant = require('@cloudant/cloudant');
const nanoid = require('nanoid');

const { validate_student, validate_professor, validate_login, validate_course,
        validate_enroll, validate_pending_admin, validate_question } = require('../classes/validators');
const Student = require('../classes/Student');
const Professor = require('../classes/Professor');
const Course = require('../classes/Course');
const Question = require('../classes/Question');
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

    res.status(200).send( { xauthtoken: token } );
});

router.post('/new_course', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find( { selector: { _id: { "$eq": req.user } } } );
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];
    if(!user.department) return res.status(401).send('Error: this user is not authorized to create new courses');

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
    if(query_response.docs[0]) return res.status(400).send('Error: user has already defined a course with the specified name, term and year');

    query_response = await courses_db.find({
        selector: {
            key: {"$eq": course.key},
            admins: { "$elemMatch": { "$eq": user._id } }
        }
    });
    // Avoid key collision
    if(query_response.docs[0]) course.key = nanoid(16); 

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

// Look up method, can be more complex
router.get('/enroll/:course', auth, async(req, res) =>{
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
        const temp_course =  courses[i];
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

router.post('/enroll', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } } );
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];
    if (!user.courses) return res.status(401).send('Error: this user is not able to enroll to courses.');

    const { error } = validate_enroll(req.body);
    if(error) return res.status(400).send(error.details[0].message);

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
    if(user.courses.includes(course._id)) return res.status(400).send('Error: The user has already enrolled to this course.');

    course.users.push(req.user);
    await courses_db.insert(course);
    user.courses.push(course._id);
    await users_db.insert(user);
    
    for (let i = 0; i < user.courses.length; i++) {
        query_response = await courses_db.find( {selector: { _id: { "$eq": user.courses[i]} } } );
        user.courses[i] = query_response.docs[0].name;
    }

    res.status(200).send( { email: user.email, 
                            first_name: user.first_name, 
                            middle_name: user.middle_name, 
                            last_name: user.last_name,
                            major: user.major,
                            courses: user.courses});
});

router.delete('/leave/:course', auth, async(req, res) =>{
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
    if(!query_response.docs[0]) return res.status(400).send('Error: user is not enrolled to the selected course.')
    const course = query_response.docs[0];

    var index = course.users.indexOf(user._id);
    course.users.splice(index, 1);
    await courses_db.insert(course);
    index = user.courses.indexOf(course._id);
    user.courses.splice(index, 1);
    await users_db.insert(user);

    res.status(200).send({
        message: 'User left the course.',
        course:{
            name: course.name,
            id: course.id,
            term: course.term,
            year: course.year
        }
    });
});

router.post('/enroll_admin', auth,  async(req, res) =>{
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
    if(course.pending_admins.includes(user._id)) return res.status(400).send('Error: This user has already submitted an application.')

    course.pending_admins.push(user._id);
    await courses_db.insert(course);

    res.status(200).send({
        status: 'Application sent. An administrator must approve your application',
        email: user.email,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        major: user.major,
        course: req.body
    });
})

router.get('/pending_admins', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const professor = query_response.docs[0];
    if (!professor.department) return res.status(401).send('Error: this user is not able to authorize course administration.');

    const list = new Array();

    for (let i = 0; i < professor.admin_courses.length; i++) {
        query_response = await courses_db.find({
            selector: { _id: { "$eq": professor.admin_courses[i] } },
            fields: ["name", "id", "key", "term", "year", "pending_admins"]
        });
        const temp_course = query_response.docs[0];
        if(temp_course.pending_admins.length != 0){
            var temp_info = {
                key: temp_course.key,
                name: temp_course.name,
                id: temp_course.id,
                term: temp_course.term,
                year: temp_course.year,
                pending_admins: []
            };
            for (let j = 0; j < temp_course.pending_admins.length; j++) {
                const pending_user = temp_course.pending_admins[j];
                const query_response_2 = await users_db.find({
                    selector: { _id: pending_user },
                    fields: ["first_name", "middle_name", "last_name", "email"]
                });
                const temp_user = query_response_2.docs[0]
                temp_info.pending_admins.push(temp_user);
                list.push(temp_info);
            }
        }  
    }

    res.status(200).send(list);
});

router.post('/pending_admins/:course', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const professor = query_response.docs[0];
    if (!professor.department) return res.status(401).send('Error: this user is not able to authorize course administration.');

    const { error } = validate_pending_admin(req.body);
    if(error) return res.status(400).send(error.details[0].message);

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

    if(!course.pending_admins.includes(new_admin._id)) return res.status(400).send('Error: user does not have a pending application to become administrator of the selected course.')
    
    const pending_index = course.pending_admins.indexOf(new_admin._id);
    course.pending_admins.splice(pending_index, 1);
    var status = '';

    // If professor approves request
    if(req.body.verdict){
        course.admins.push(new_admin._id);
        await courses_db.insert(course);
        new_admin.admin_courses.push(course._id);
        await users_db.insert(new_admin);
        status = 'Request for new administrator has been approved.'
    } else{
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

router.delete('/leave_admin/:course', auth, async (req, res) => {
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
        fields: ["name", "id", "key", "term", "year", "tags", "questions"]
    });
    if(!query_response.docs[0]) return res.status(400).send('Error: user is not enrolled in the selected course.');
    const course = query_response.docs[0];

    const questions = new Array();
    for (let i = 0; i < course.questions.length; i++) {
        query_response = await questions_db.find({
            selector: {
                _id: course.questions[i]
            }
        });
        const question = query_response.docs[0];
        query_response = await users_db.find({
            selector: {
                _id: question.author
            }
        });
        const user = query_response.docs[0];
        questions.push({
            title: question.title,
            content: question.content,
            author: user.first_name + ' ' + user.last_name,
            id: question.id,
            creation_date: question.creation_date,
            solved: question.solved,
            tags: question.tags,
            no_answers: question.no_answers,
            views: question.views
        });
    }
    
    course.questions = questions;
    res.status(200).send(course);
});

// Missing anonymous posting
router.post('/course/:course/new_question', auth, async(req, res) =>{
    const cloudant = await Cloudant({ url: process.env.cloudant_url + ':' + process.env.cloudant_port });
    const users_db = await cloudant.db.use('users');
    const courses_db = await cloudant.use('courses');
    const questions_db = await cloudant.use('questions');

    var query_response = await users_db.find({ selector: { _id: { "$eq": req.user } } });
    if (!query_response.docs[0]) return res.status(400).send('Error: incorrect username.');

    const user = query_response.docs[0];
    if(!user.semester) return res.status(401).send('Error: user is not allowed to post questions.');

    query_response = await courses_db.find({
        selector: {
            key: { "$eq": req.params.course },
            users: { "$elemMatch": { "$eq": user._id } }
        }
    });
    if(!query_response.docs[0]) return res.status(400).send('Error: user is not registered in the indicated course');

    const course = query_response.docs[0];
    
    var question = new Question(req.body.title, req.body.content, user._id, req.body.tags, course._id);
    
    const { error } = validate_question(question);
    if (error) return res.status(400).send(error.details[0].message);

    for (let i = 0; i < question.tags.length; i++) {
        if (!course.tags.includes(question.tags[i])) return res.status(400).send('Error: tag \'' + question.tags[i] + '\' is not a valid tag for the course.')
        
    }

    await questions_db.insert(question);
    query_response = await questions_db.find({
        selector: {
            title: {"$eq": question.title},
            content: { "$eq": question.content },
            author: { "$eq": question.author }
        }
    });
    question = query_response.docs[0];

    course.questions.push(question._id);
    await courses_db.insert(course);

    res.status(200).send({
        id: question.id,
        title: question.title,
        content: question.content,
        author: user.first_name + ' ' + user.last_name,
        tags: question.tags,
        creation_date: question.creation_date,
        course: {
            name: course.name,
            id: course.id,
            term: course.term,
            year: course.year
        }
    })
});



module.exports = router;