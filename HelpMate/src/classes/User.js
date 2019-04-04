'use strict'

class User{
    constructor(name, password, email, courses, major, semester, gender, age, questions, type){
        this.name = name;                           // [String] Name of the use. 
        this.password = password;                   // [String] Hashed password of the user.
        this.email = email;                         // [String] Email of the user.
        this.courses = undefined;                   // [Array] Array of the ids to which the user is enrrolled or it is administrator.
        this.major = major;                         // [String] Name of the user major.
        this.semester = semester;                   // [Number] Semester of the user.
        this.gender = gender;                       // [String] Male, female or other.
        this.age = age;                             // [Number] Age of the user.
        this.questions = undefined;                 // [Array] Array containing ids of the questions the user has posted.
        this.type = type;                           // [String] Type of the user: 'student' or 'proffesor'.
    }
}

module.exports = User;