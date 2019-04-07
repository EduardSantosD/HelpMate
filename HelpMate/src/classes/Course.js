/* ------------------------------------------------------------------
This class represent a Course.
------------------------------------------------------------------ */

// Used for better encapsualtion. Reference: https://codete.com/blog/private-state-javascript/
// Map was used instead of WeakMap for make items iterable.
const wm = new Map(); 

class Course {

    constructor(){

        // Avoid new properties being added
        Object.preventExtensions(this);

        //Atributtes
        users = undefined; // This represent the set of users members of a course
        admins = undefined; // This represent the set of admins members of a course
        name = undefined; // This represents the name of the course
        key = undefined; // This represents the key of the course
        tags = undefined;// This are the tags allowed for the questions of the course
    }
}

exports.Course = new Course;