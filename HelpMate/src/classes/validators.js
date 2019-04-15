'use strict'

const Joi = require('joi');
const Answer = require('./Answer');
const Question = require('./Question');
const User = require('./User');
const Professor = require('./Professor');
const Student = require('./Student');

function validate_answer(answer){
    const schema = {
        content: Joi.string().trim(),
        author: Joi.string().trim(),
        creation_date: Joi.date(),
        correct: Joi.boolean,
        comments: Joi.array().items(Joi.string().trim()),
        no_comments: Joi.boolean(),
        approved: Joi.boolean()
    }
    return Joi.validate(answer, schema, {convert: false});
}

function validate_question(question){
    const schema = {
        title: Joi.string().trim(),
        content: Joi.string().trim(),
        author: Joi.string().trim(),
        creation_date: Joi.date().timestamp(),
        solved: Joi.boolean(),
        no_answers: Joi.boolean(),
        answers: Joi.array().items(Joi.string().trim()),
        resolution_date: Joi.date(),
        labels: Joi.array().items(Joi.string().trim()),
        views: Joi.number().min(0),
        approved: Joi.number().min(0),
        parent_class: Joi.string().trim()
    }
    return Joi.validate(question, schema, {convert: false});
}

function validate_professor(professor) {
    const schema = {
        username: Joi.string().trim().required(),
        email: Joi.string().email().required(),
        password: Joi.string().trim().required(),
        first_name: Joi.string().trim().required(),
        middle_name: Joi.string().trim().required(),
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
        username: Joi.string().trim().required(),
        email: Joi.string().email().required(),
        password: Joi.string().trim().required(),
        first_name: Joi.string().trim().required(),
        middle_name: Joi.string().trim().required(),
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

// Test Questions

// const q1 = new Question(1, '¿Pueden ver esta pregunta?', 'alex', Date.now(), false, true, null, null, ['hw1'], 0, 0, 'uid123456');
// const q2 = new Question('Test', '¿Pueden ver esta pregunta?', 'alex', Date.now(), false, true, null, null, ['hw1'], 0, 0, 'uid123456');
// let validation = validateQuestion(q1);
// if(validation.error) console.log('Joi error: ', validation.error.details[0].message, '\r\n');
// validation = validateQuestion(q2);
// if (validation.error) console.log('Joi error: ', validation.error.details[0].message);
// console.log(q2);

// Professor-Student testing

const alex_student = new Student('haenrqz', 'ha.enrqz@gmail.com', 123, 'Hector', 'Alejandro', 'Enriquez', 22, 'male', 'isdr', 8);
const alex_professor = new Professor('haenrqz_p', 'ha.enrqz@gmail.com', '123', 'Hector', 'Alejandro', 'Enriquez', '22', 'male', 'engineering');
validation = validate_student(alex_student);
if(validation.error) console.log('Joi error student:', validation.error.details[0].message);
// console.log(alex_student);
// console.log('\r\n');

validation = validate_professor(alex_professor);
if(validation.error) console.log('Joi error professor: ', validation.error.details[0].message);
// console.log(alex_professor);