import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import courses from "../services/courses";
import auth from "../services/authService";
import _ from "lodash";

class CreateCourse extends Form {
    state = {
        data: {
            name: "",
            id: "",
            term: "",
            tags: "",
            year: 0,
        },
        errors: {}
    };

    schema = {
        name: Joi.string().trim().required(),
        id: Joi.string().trim().required(),
        term: Joi.string().trim().required(),
        year: Joi.number().min(1).required(),
        tags: Joi.string().trim().required() || Joi.Array().items(Joi.string().trim())
    }

    doSubmit = async () => {
        try {
            console.log("registrando creando: ", this.state.data)
            let user = auth.getCurrentUser().jwt;
            console.log(user)
            const { data: response } = await courses.createCourse(user, this.state.data);
            console.log("after:" , this.state.data)
            await auth.login(this.state.data.email, this.state.data.password);
            window.location = "/";
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = { ...this.state.errors };
                errors.username = ex.response.data;
                this.setState({ errors });
            }
        }
    };

    render() {
        return (
            <div>
                <h1>Create Course</h1>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput("name", "Name")}
                    {this.renderInput("id", "ID")}
                    {this.renderInput("tags", "Tags")}
                    {this.renderInput("term", "Term")}
                    {this.renderInput("year", "Year", "number")}
                    {this.renderButton("Register")}
                </form>
            </div>
        );
    }
}

export default CreateCourse;
