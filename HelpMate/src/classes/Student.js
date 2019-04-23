'use strict';
const User = require('./User');

class Student extends User{
    constructor(email, password, first_name, middle_name, last_name, age, gender, major, semester){
        super(email, password, first_name, middle_name, last_name, age, gender);
        this.major = major;                     // [String] Major of the student.
        this.semester = semester;               // [Integer] Current semester of the student.
        this.admin_courses = undefined;         // [Array] Array of ids to which the student is admin (TA/GSI).
        this.courses = undefined;               // [Array] Array of the ids to which the student is enrolled as student.  
    }
}

module.exports = Student;