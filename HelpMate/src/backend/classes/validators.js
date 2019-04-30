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
        id: Joi.string().trim().required(),
        key: Joi.string().trim(),
        tags: Joi.array().items(Joi.string().trim()).required(),
        term: Joi.string().regex(/^spring$|^fall$/).required(),
        year: Joi.number().integer().min(new Date().getFullYear()),
        users: Joi.array().items(Joi.string().trim()),
        admins: Joi.array().items(Joi.string().trim()),
        pending_admins: Joi.array().items(Joi.string().trim()),
        questions: Joi.array().items(Joi.string().trim())
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
        content: Joi.string().required(),
        author: Joi.string().trim().required(),
        id: Joi.string().trim().required(),
        creation_date: Joi.date().timestamp().required(),
        solved: Joi.boolean().required(),
        answers: Joi.array().items(Joi.string().trim()),
        resolution_date: Joi.date(),
        tags: Joi.array().items(Joi.string().trim()).required(),
        no_answers: Joi.boolean().required().required(),
        views: Joi.number().min(0).required(),
        approved: Joi.number().min(0).required(),
        course: Joi.string().trim()
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

function validate_enroll(course){
    const schema = {
        name: Joi.string().trim().required(),
        id: Joi.string().trim().required(),
        key: Joi.string().trim().required(),
        term: Joi.string().regex(/spring|fall/).required(),
        year: Joi.number().integer().min(new Date().getFullYear()).required()
        // admins: Joi.array().items(Joi.string().trim().required(), Joi.string().trim().required())
    }
    return Joi.validate(course, schema);
}

function validate_pending_admin(pending){
    const schema = {
        email: Joi.string().email().required(),
        verdict: Joi.boolean().required()
    }
    return Joi.validate(pending, schema);
}

exports.validate_student = validate_student;
exports.validate_professor = validate_professor;
exports.validate_login = validate_login;
exports.validate_course = validate_course;
exports.validate_enroll = validate_enroll;
exports.validate_pending_admin = validate_pending_admin;
exports.validate_question = validate_question;