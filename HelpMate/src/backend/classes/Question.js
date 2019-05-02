/* ------------------------------------------------------------------
This class represent a Question.
------------------------------------------------------------------ */

const nanoid = require('nanoid');

class Question {

    constructor(title, content, author, anonymous, tags, course, instructor){
        this.title  = title;                // Indicates the question title.
        this.content = content;             // Question description.
        this.author = author;               // Author of the question.
        this.anonymous = anonymous;         // Indicates if the question should be posted as anonymous. Nevertheless, the author
                                            // is still saved to look for specific student questions. 
        this.id = nanoid(16);               // Identifier of the question. Randomly generated.
        this.creation_date = new Date();    // Timestamp of question creation.
        this.solved = false;                // Indicates wheter the question has a solution or not. Default is false.
        this.answers = new Array();         // Answers Array.
        this.resolution_date = undefined;   // Date when the question is solved.
        this.tags = tags;                   // Array of tags that give context to the question. Eg. hw1, exam1, midterm. 
        this.no_answers = true;             // Indicates if there is at least one answer.
        this.views = 0;                     // Views counter.
        this.approved = 0;                  // Approved indicator. Increases each time a person thinks it is a good question.
        this.approved_users = new Array();  // Array of users that have approved this question. A user should be able to use this once.
        this.course = course;               // Id of the course where the question has been posted.
        this.instructor = instructor;       // Boolean that tells if the instructor has posted this question.
    }
}

module.exports = Question;