'use strict'

const Joi = require('joi');
const Course = require('./Course');
const Answer = require('./Answer');
const Question = require('./Question');
const User = require('./User');
const Professor = require('./Professor');
const Student = require('./Student');

function validate_course(course){
    const schema = {
        name: Joi.string().trim().required(),
        key: Joi.string().trim().required(),
        tags: Joi.array().items(Joi.string().trim()).required(),
        users: Joi.array().items(Joi.string().trim()),
        admins: Joi.array().items(Joi.string().trim())
    }
    return Joi.validate(course, schema, {convert: false});
}

function validate_answer(answer){
    const schema = {
        content: Joi.string().trim().required(),
        author: Joi.string().trim().required(),
        creation_date: Joi.date(),
        correct: Joi.boolean(),
        comments: Joi.array().items(Joi.string().trim()),
        no_comments: Joi.boolean(),
        approved: Joi.number().min(0)
    }
    return Joi.validate(answer, schema, {convert: false});
}

function validate_question(question){
    const schema = {
        title: Joi.string().trim().required(),
        content: Joi.string().trim().required(),
        author: Joi.string().trim().required(),
        creation_date: Joi.date().timestamp().required(),
        solved: Joi.boolean().required(),
        answers: Joi.array().items(Joi.string().trim()),
        resolution_date: Joi.date(),
        tags: Joi.array().items(Joi.string().trim()).required(),
        no_answers: Joi.boolean().required().required(),
        views: Joi.number().min(0).required(),
        approved: Joi.number().min(0).required(),
        course_id: Joi.string().trim()
    }
    return Joi.validate(question, schema, {convert: false});
}

function validate_professor(professor) {
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().trim().required(),
        first_name: Joi.string().trim().required(),
        middle_name: Joi.string().trim().allow(''),
        last_name: Joi.string().trim().required(),
        age: Joi.number().min(1).required(),
        gender: Joi.string().regex(/^male|female|other^/).required(),
        questions: Joi.array().items(Joi.string().trim()),
        admin_courses: Joi.array().items(Joi.string().trim()),
        department: Joi.string().trim().required()
    }
    return Joi.validate(professor, schema, {convert: false});
}

function validate_student(student){
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().trim().required(),
        first_name: Joi.string().trim().required(),
        middle_name: Joi.string().trim().allow(''),
        last_name: Joi.string().trim().required(),
        age: Joi.number().min(1).required(),
        gender: Joi.string().regex(/^male|female|other^/).required(),
        questions: Joi.array().items(Joi.string().trim()),
        major: Joi.string().trim().required(),
        semester: Joi.number().integer().min(1).required(),
        admin_courses: Joi.array().items(Joi.string().trim()),
        courses: Joi.array().items(Joi.string().trim())
    }
    return Joi.validate(student, schema, {convert: false});
}

function validate_login(user){
    const schema = {
        email: Joi.string().email().trim().required(),
        password: Joi.string().trim().required()
    }
    return Joi.validate(user, schema, {convert: false});
}

// // Test Course
// const course1 = new Course('Microcontrollers', 'ME2010', ['general', 'hw1', 'hw2', 'lab']);
// const course2 = new Course('Microprocessors', 3010, ['general', 'hw1', 'hw2', 'lab']);
// let validation = validate_course(course1); 
// if (validation.error) console.log('Joi error at', validation.error.details[0].context, ' : ', validation.error.details[0].message, '\r\n');
// validation = validate_course(course2);
// if (validation.error) console.log('Joi error at', validation.error.details[0].context, ' : ', validation.error.details[0].message, '\r\n');

// // Test Answer
// const a1 = new Answer('It should be log(n), not n*log(n)', 'eduardo');
// const a2 = new Answer('It should be log(n), not n*log(n)', 12);
// validation = validate_answer(a1);
// if (validation.error) console.log('Joi error at', validation.error.details[0].context, ' : ', validation.error.details[0].message, '\r\n');
// validation = validate_answer(a2);
// if (validation.error) console.log('Joi error at', validation.error.details[0].context, ' : ', validation.error.details[0].message, '\r\n');

// // Test Questions
// const q1 = new Question(1, '¿Pueden ver esta pregunta?', 'alex', ['hw1']);
// const q2 = new Question('Test', '¿Pueden ver esta pregunta?', 'alex', ['hw1']);
// validation = validate_question(q1);
// if(validation.error) console.log('Joi error at', validation.error.details[0].context, ' : ', validation.error.details[0].message, '\r\n');
// validation = validate_question(q2);
// if (validation.error) console.log('Joi error at', validation.error.details[0].context, ' : ', validation.error.details[0].message, '\r\n');

// // Professor-Student testing
// const alex_student = new Student('haenrqz', 'ha.enrqz@gmail.com', 123, 'Hector', 'Alejandro', 'Enriquez', 22, 'male', 'isdr', 8);
// const alex_professor = new Professor('haenrqz_p', 'ha.enrqz@gmail.com', '123', 'Hector', 'Alejandro', 'Enriquez', '22', 'male', 'engineering');
// validation = validate_student(alex_student);
// if (validation.error) console.log('Joi error at', validation.error.details[0].context, ' : ', validation.error.details[0].message, '\r\n');
// validation = validate_professor(alex_professor);
// if (validation.error) console.log('Joi error at', validation.error.details[0].context, ' : ', validation.error.details[0].message, '\r\n');

exports.validate_student = validate_student;
exports.validate_professor = validate_professor;
exports.validate_login = validate_login;