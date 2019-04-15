'use strict'

class Answer{
    constructor(content, author){
        this.content = content;                     // [String] Text containing the answer.
        this.author = author;                       // [String] Author of the question.
        this.creation_date = new Date();            // [Date] Timestamp of the creation date.
        this.correct = undefined;                   // [Boolean] Tells if this answer is correct one for its question.
        this.comments = undefined;                  // [Array] Array of comments ids that have been posted to the answer.
        this.no_comments = true;                    // [Boolean] Tells if no one has commented this answer.
        this.approved = 0;                          // [Number] Counter of people that approve this as a correct answer.
    }
}

module.exports = Answer;