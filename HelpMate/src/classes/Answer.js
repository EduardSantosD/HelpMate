'use strict'

class Answer{
    constructor(content, author, creation_date, correct, comments, no_comments, approved){
        this.content = content;                     // [String] Text containing the answer.
        this.author = author;                       // [String] Author of the question.
        this.creation_date = creation_date;         // [Date] Timestamp of the creation date.
        this.correct = correct;                     // [Boolean] Tells if this answer is correct one for its question.
        this.comments = undefined;                  // [Array] Array of comments ids that have been posted to the answer.
        this.no_comments = no_comments;             // [Boolean] Tells if no one has commented this answer.
        this.approved = approved;                   // [Number] Counter of people that approve this as a correct answer.
    }
}

module.exports = Answer;