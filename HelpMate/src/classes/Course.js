/* ------------------------------------------------------------------
This class represent a Course.
------------------------------------------------------------------ */

class Course {
    constructor(name, key, tags){
        this.name = name;                  // This represents the name of the course.
        this.key = key;                    // This represents the key of the course.
        this.tags = tags;                  // This are the tags allowed for the questions of the course.
        this.users = new Array();          // This represent the set of users members of a course.
        this.admins = new Array();         // This represent the set of admins members of a course.
    }
}

module.exports = Course;