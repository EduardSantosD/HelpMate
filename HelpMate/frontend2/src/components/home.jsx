import React, { Component } from "react";
import Joi from "joi-browser";
import CourseCard from "./common/courseCard";
import auth from "../services/authService";
import courses from "../services/courses";
import "./home.css"

class Home extends Component {
    state = {
        user: auth.getCurrentUser(),
        courses_array: { 'admin_courses': [] ,  'courses': [] } ,
        errors: {}
    };

    schema = {
        email: Joi.string()
            .required()
            .label("Email"),
        password: Joi.string()
            .required()
            .label("Password")
    };

    async componentWillMount(){
        let user = auth.getCurrentUser();
        console.log("hey")
        console.log(user)
        this.setState({ user })
        console.log(this.state.user)
        try {
            await courses.getCourses(this.state.user.jwt);
            user = auth.getCurrentUser();
            this.setState({ user })
            const courses_array = this.state.user.courses
            console.log("the array",courses_array)
            if (courses_array)
                this.setState({ courses_array })

        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = { ...this.state.errors };
                errors.email = ex.response.data;
                this.setState({ errors });
            }
        }
    }

    render() {
        console.log(this.state)
        return (
            <div id="container" className="mb-4 shadow card">
                
                <div>
                    <h3>Admin Courses</h3>
                    {
                        this.state.courses_array.admin_courses.map(course => 
                            <CourseCard key={course.name} title={"Microcontroladores"} description={"Use of chips..."} area={"Digital Systems"}
                                path={"/courses/"+course.key} image="http://fundacioncarlosslim.org/wp-content/uploads/2017/12/microcontroladores_.jpg" />
                        )
                    }
                </div>
                <div>
                    <h3>Student Courses </h3>
                    {
                        this.state.courses_array.courses && this.state.courses_array.courses.map(course =>
                            <CourseCard key={course.name} title={course.name} description={course.term.toUpperCase() + ' ' + course.year} area={course.id}
                                path={"/courses/"+course.key} image="http://fundacioncarlosslim.org/wp-content/uploads/2017/12/microcontroladores_.jpg" />
                        )
                    }
                </div>
            </div>
        );
    }
}

export default Home;
