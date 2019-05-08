import React, { Component } from "react";
import Joi from "joi-browser"
import auth from "../services/authService";
import courses from "../services/courses";
import "./home.css"

class Course extends Component {
    state = {
        course_id: '',
        user: {},
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

    async componentWillMount() {
        const course_id = window.location.href.split('/').pop();
        //this.setState({ course_id })
        const user = auth.getCurrentUser();
        console.log(user)
        this.setState({ user })
        console.log(this.state.user )

        try {
            await courses.getCourse(this.state.course_id, this.state.user.jwt);

        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = { ...this.state.errors };
                errors.email = ex.response.data;
                this.setState({ errors });
            }
        }
    }

    render() {
        return (
            <div id="container" className="mb-4 shadow card">
                Hola
            </div>
        );
    }
}

export default Course;
