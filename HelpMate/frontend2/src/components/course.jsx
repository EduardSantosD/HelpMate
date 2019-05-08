import React, { Component } from "react";
import Joi from "joi-browser"
import auth from "../services/authService";
import courses from "../services/courses";
import CourseHeader from "./courseHeader"
import QuestionBoard from "./questionBoard"
import IOForm from "./IOForm"
import "./home.css"

class Course extends Component {
    state = {
        course_id: '',
        // Null for avoid 0 when load 
        course_info : {'name' : '', 'id' : '', 'term' : '', year : null},
        course_questions : [],
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
        this.setState({ course_id })
        console.log(course_id)
        const user = auth.getCurrentUser();
        console.log(user)
        this.setState({ user })
        console.log(this.state.user )

        try {
            await courses.getCourse(course_id, user.jwt).then( (course) => {
                let course_info = course[0];
                let course_questions = course[1];
                this.setState({course_info})
                this.setState({ course_questions })
                console.log("info: ", this.state.course_questions)

            })

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
                <CourseHeader name={this.state.course_info.name}
                    id={this.state.course_info.id}
                    term={this.state.course_info.term}
                    year={this.state.course_info.year}
                />
                <IOForm course_id={this.state.course_info.key} title="How to Ask" message="Fill the next fields correctly and be polite!"
                    image={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/VisualEditor_-_Icon_-_Help.svg/1024px-VisualEditor_-_Icon_-_Help.svg.png"}
                />
                <QuestionBoard questions= {this.state.course_questions} course_key = {this.state.course_id} />
            </div>
        );
    }
}

export default Course;
