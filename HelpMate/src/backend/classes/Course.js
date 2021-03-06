/* ------------------------------------------------------------------
This class represent a Course.
------------------------------------------------------------------ */
const nanoid = require('nanoid');

class Course {
    constructor(name, id, tags, term, year){
        this.name = name;                   // This represents the name of the course.
        this.id = id;                       // This represents the id of the course.
        this.key = nanoid(16);              // This represents the key of the course. It is randomly generated.
        this.tags = tags;                   // This are the tags allowed for the questions of the course.
        this.term = term;                   // Term of the course (spring or fall).
        this.year = year;                   // Year of the course. It must be an integer.
        this.users = new Array();           // This represent the set of users members of a course.
        this.admins = new Array();          // This represent the set of admins members of a course.
        this.pending_admins = new Array();  // This represents the set of students that want to be administrators of the course.
                                            // They must be approved by the professor.
        this.questions = new Array();       // This represents the set of questions asked in the course. It is an array of ids.
    }
}

module.exports = Course;