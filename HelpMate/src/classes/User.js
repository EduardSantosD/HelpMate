'use strict'

class User{
    constructor(email, password, first_name, middle_name, last_name, age, gender){
        this.email = email;                         // [String] Email of the user.
        this.password = password;                   // [String] Hashed password of the user.
        this.first_name = first_name;                // [String] Name of the use. 
        this.middle_name = middle_name;             // [String] Middle name of the user.
        this.last_name = last_name;                 // [String] Last name of the user.
        this.age = age;                             // [Number] Age of the user.
        this.gender = gender;                       // [String] Male, female or other.
        this.questions = undefined;                 // [Array] Array containing ids of the questions the user has posted.
    }
}

module.exports = User;