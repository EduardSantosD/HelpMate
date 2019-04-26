/* ------------------------------------------------------------------
This class represent a Question.
------------------------------------------------------------------ */

class Question {

    constructor(title, content, author, tags){
        this.title  = title;                // Indicates the question title.
        this.content = content;             // Question description.
        this.author = author;               // Author of the question.
        this.creation_date = new Date();    // Date which question is created.
        this.solved = false;                // Indicates wheter the question has a solution or not. Default is false.
        this.answers = undefined;           // Answers Array.
        this.resolution_date = undefined;   // Date when the question is solved.
        this.tags = tags;                   // Array of tags that give context to the question. Eg. hw1, exam1, midterm. 
        this.no_answers = true;             // Indicates if there is at least one answer.
        this.views = 0;                     // Views counter.
        this.approved = 0;                  // Approved indicator. Increases each time a person thinks it is a good question.
        this.course_id = undefined;         // Id of the course where the question has been posted.
    }
}

module.exports = Question;