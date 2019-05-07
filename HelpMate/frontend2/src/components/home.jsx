import React, { Component } from "react";
import Joi from "joi-browser";
import CourseCard from "./common/courseCard";
import auth from "../services/authService";
import courses from "../services/courses";

class Home extends Component {
    state = {
        user: auth.getCurrentUser(),
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

    async componentDidMount(){
        const user = auth.getCurrentUser();
        this.setState({ user })

        try {
            const response = await courses.getCourses(this.state.user.jwt);
            console.log("response: ", response)

        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = { ...this.state.errors };
                errors.email = ex.response.data;
                this.setState({ errors });
            }
        }
    }

    render() {
        console.log(this.state.user);
        return (
            <div>
                <CourseCard title={"Microcontroladores"} description={"Use of chips..."} area={"Digital Systems"}
                    image= "http://fundacioncarlosslim.org/wp-content/uploads/2017/12/microcontroladores_.jpg" />
                <h1>Saludo</h1>
                Hola
            </div>
        );
    }
}

export default Home;
