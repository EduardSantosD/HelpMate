/* ------------------------------------------------------------------
This class represent a Question.
------------------------------------------------------------------ */

// Used for better encapsualtion. Reference: https://codete.com/blog/private-state-javascript/
// Map was used instead of WeakMap for make items iterable.
const wm = new Map(); 

class Question {

    constructor(){

        // Avoid new properties being added
        Object.preventExtensions(this);

        //Atributtes
        title  = undefined; // Indicates the question title
        content = undefined; // Question description
        creation_date = new Date(); //Date which question is created
        solved = undefined; // indicates wheter the question has a solution or not
        answers = undefined; // Answers Array 
        close_date = undefined; // Date when the question is close
        tags = undefined; // Words releated to the question
        answered = false; // Indicate if there is at least one answer
        views = 0; // Views counter
        approveds = 0; // Appreves
        course_id = undefined; // ID for releated a question with a course
    }
    
}

module.exports = Question;