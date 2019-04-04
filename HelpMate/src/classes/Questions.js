/* ------------------------------------------------------------------
This class represent a Question.
------------------------------------------------------------------ */

class Question {

    constructor(){
        //Atributtes
        this.title  = undefined; // Indicates the question title
        this.content = undefined; // Question description
        this.author = undefined; // Who creates the question
        this.creation_date = new Date(); //Date which question is created
        this.solved = undefined; // indicates wheter the question has a solution or not
        this.answers = undefined; // Answers Array 
        this.close_date = undefined; // Date when the question is close
        this.tags = undefined; // Words releated to the question
        this.any_answer = false; // Indicate if there is at least one answer
        this.views = 0; // Views counter
        this.approveds = 0; // Appreves
        this.course_id = undefined; // ID for releated a question with a course
    }

    // Sets and Gets

    get title() { return this.title; }

    get content() { return this.content; }

    get author() { return this.author; }

    get creation_date() { return this.creation_date; }

    get solved() { return this.solved; }

    get answers() { return this.answers; }

    get close_date() { return this.close_date; }

    get tags() { return this.tags; }

    get any_answer() { return this.any_answer; }

    get views() { return this.views; }

    get approveds() { return this.approveds; }

    get course_id() { return this.course_id; }

    set title(input) { this.title = input; }

    set content(input) { this.content = input; }

    set author(input) { this.author = input; }

    set creation_date(input) { this.creation_date = input; }

    set solved(input) { this.solved = input; }

    set answers(input) { this.answers = input; }

    set close_date(input) { this.close_date = input; }

    set tags(input) { this.tags = input; }

    set any_answer(input) { this.any_answer = input; }

    set views(input) { this.views = input; }

    set approveds(input) { this.approveds = input; }

    set course_id(input) { this.course_id = input; }
}

exports.Question = Question;