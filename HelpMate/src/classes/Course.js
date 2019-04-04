/* ------------------------------------------------------------------
This class represent a Course.
------------------------------------------------------------------ */

class Course {

    constructor(){
        //Atributtes
        this.users = undefined; // This represent the set of users members of a course
        this.admins = undefined; // This represent the set of admins members of a course
        this.name = undefined; // This represents the name of the course
        this.key = undefined; // This represents the key of the course
        this.tags = undefined; // This are the tags allowed for the questions of the course
    }

    // Sets and gets

    get users() { return this.users; }

    get admins() { return this.admins; }

    get name() { return this.name; }

    get key() { return this.key; }

    get tags() { return this.tags; }

    set users( input ) { this.users = input ; }

    set admins( input ) { this.admins = input ; }

    set name( input ) { this.name = input ; }

    set key( input ) { this.key = input ; }

    set tags( input ) { this.tags = input ; }
}

exports.Course = Course;