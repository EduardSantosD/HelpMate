'use strict'

class Question{
    constructor(title, content, author, creation_date, solved, no_answers, answers, resolution_date, labels, views, approved, parent_class){
        this.title = title;                             // [String] Title of the question.
        this.content = content;                         // [String] Text containing the actual question.
        this.author = author;                           // [String] Author of the question.
        this.creation_date = creation_date;             // [Date] Timestamp with creation date of the question.
        this.solved = solved;                           // [Boolean] Tells if the question has been answered correctly.
        this.no_answers = no_answers;                   // [Boolean] Tells if the question still has no answers.
        this.answers = undefined;                       // [Array] Array contaning the ids of the answers to this question as strings.
        this.resolution_date = undefined;               // [Date] Timestamp indicating the resolution date for the question.
        this.labels = labels;                           // [Array] Array of strings containing the labels that relate to this question.
        this.views = views;                             // [Number] Counter of how many times the question has been seen.
        this.approved = approved;                       // [Number] Counter of how many people think this is a good question.
        this.parent_class = parent_class;               // [String] Id of the class to which this question belongs.
    }
}

module.exports = Question;