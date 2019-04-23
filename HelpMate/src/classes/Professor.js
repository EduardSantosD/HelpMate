'use strict';
const User = require('./User');

class Professor extends User{
    constructor(email, password, first_name, middle_name, last_name, age, gender, department){
        super(email, password, first_name, middle_name, last_name, age, gender);
        this.admin_courses = undefined;         // [Array] Array of the ids for the courses the professor is administrator.
        this.department = department;           // [String] Department to which the professor belongs.
    }
}

module.exports = Professor;