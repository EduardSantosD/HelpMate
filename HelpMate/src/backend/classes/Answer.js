'use strict'
const nanoid = require('nanoid')

class Answer{
    constructor(content, author, anonymous, question, instructor){
        this.content = content;                     // [String] Text containing the answer.
        this.author = author;                       // [String] Author of the question.
        this.id = nanoid(16);                       // [String] Identifier for the answer with unique randomly generated id.
        this.anonymous = anonymous;                 // [Boolean] Boolean to tell if the author wants to be anonymous.
        this.question = question;                   // [String] _id of the question to which the answer belongs.
        this.creation_date = new Date();            // [Date] Timestamp of the creation date.
        this.correct = false;                       // [Boolean] Tells if this answer is correct one for its question.
        this.comments = new Array();                // [Array] Array of comments ids that have been posted to the answer.
        this.no_comments = true;                    // [Boolean] Tells if no one has commented this answer.
        this.approved = 0;                          // [Number] Counter of people that approve this as a correct answer.
        this.approved_users = new Array();          // Array of users that have approved this question. A user should be able to use this once.
        this.instructor = instructor;               // [Boolean] Tell if the answer has been posted by the instructor. 
    }
}

module.exports = Answer;