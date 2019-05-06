import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import trainerService from "../services/trainerService";
import teamService from "../services/teamService";
import auth from "../services/authService";
import _ from "lodash";

class RegisterForm extends Form {
  state = {
    data: {
      username: "",
      password: "",
      birthday: "",
      gender: "",
      team: "",
      isGymLeader: ""
    },
    genders: [{ _id: "Male", name: "male" }, { _id: "Female", name: "female" }],
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

  async populateTeams() {
    let { data: teams } = await teamService.getTeams();
    teams = teams.sort();
    teams = teams.map(team => ({ _id: team, name: _.capitalize(team) }));
    this.setState({ teams });
  }

  async componentDidMount() {
    await this.populateTeams();
  }

  doSubmit = async () => {
    try {
      const { data: response } = await trainerService.register(this.state.data);
      auth.loginWithJwt(response.token);
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
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("Email", "Email")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("First Name", "Name")}
          {this.renderInput("Last Name", "Last Name")}
          {this.renderInput("Age", "Age", "number")}
          {this.renderSelect("gender", "Gender", this.state.genders)}
          {this.renderInput("Major", "Major")}
          {this.renderInput("Semester", "Semester", "number")}
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
