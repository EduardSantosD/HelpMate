import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import trainerService from "../services/register";
import auth from "../services/authService";
import _ from "lodash";

class RegisterForm extends Form {
  state = {
    data: {
      email: "",
      password: "",
      first_name: "",
      gender: "",
      last_name: "",
      age: 0,
      major : "",
      semester :0
    },
    genders: [{ _id: "male", name: "Male" }, { _id: "female", name: "Female" }],
    isGymLeader: [{ _id: true, name: "True" }, { _id: false, name: "False" }],
    types: [],
    teams: [],
    errors: {}
  };

  schema = {
    email: Joi.string().email().required(),
    password: Joi.string().trim().required(),
    first_name: Joi.string().trim().required(),
    middle_name: Joi.string().trim().allow(''),
    last_name: Joi.string().trim().required(),
    age: Joi.number().min(1).required(),
    gender: Joi.string().regex(/^male|female|other^/).required(),
    questions: Joi.array().items(Joi.string().trim()),
    major: Joi.string().trim().required(),
    semester: Joi.number().integer().min(1).required(),
    admin_courses: Joi.array().items(Joi.string().trim()),
    courses: Joi.array().items(Joi.string().trim())
  }

  doSubmit = async () => {
    try {
      console.log("registrando: ", this.state.data)
      const { data: response } = await trainerService.register(this.state.data);
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
        <div className="row bg-light">
          <a href="/register" className="col">STUDENT</a>
          <a href="/registerprofessor" className="col">PROFESSOR</a>
        </div>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("email", "Email")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("first_name", "First Name")}
          {this.renderInput("last_name", "Last Name")}
          {this.renderInput("age", "Age", "number")}
          {this.renderSelect("gender", "Gender", this.state.genders)}
          {this.renderInput("major", "Major")}
          {this.renderInput("semester", "Semester", "number")}
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
