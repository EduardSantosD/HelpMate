'use strict'

const Joi = require('joi');
const Answer = require('./Answer');
const Question = require('./Question');
const User = require('./User');

function validateAnswer(answer){
    const schema = {
        content: Joi.string().trim(),
        author: Joi.string().trim(),
        creation_date: Joi.date(),
        correct: Joi.boolean,
        comments: Joi.array().items(Joi.string().trim()),
        no_comments: Joi.boolean(),
        approved: Joi.boolean()
    }
    return Joi.validate(answer, schema);
}

function validateQuestion(question){
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
    return Joi.validate(question, schema);
}

function validateUser(user) {
    const schema = {
        name: Joi.string().trim(),
        password: Joi.string().trim(),
        email: Joi.string().email(),
        courses: Joi.array().items(Joi.string().trim()),
        major: Joi.string().trim(),
        semester: Joi.number().integer().min(1),
        gender: Joi.array().items(Joi.string().regex(/^male|female|other^/)),
        age: Joi.number().min(1),
        questions: Joi.array().items(Joi.string().trim()),
        type: Joi.string().regex(/^proffesor|student^/)
    }
    return Joi.validate(user, schema);
}


const q1 = new Question(1, '¿Pueden ver esta pregunta?', 'alex', Date.now(), false, true, null, null, ['hw1'], 0, 0, 'uid123456');
const q2 = new Question('Test', '¿Pueden ver esta pregunta?', 'alex', Date.now(), false, true, null, null, ['hw1'], 0, 0, 'uid123456');
const {error} = validateQuestion(q1);
if(error) console.log('Joi error: ', error.details[0].message, '\r\n');
const { error2 } = validateQuestion(q2);
if (error2) console.log('Joi error: ', error2.details[0].message);
console.log(q2);