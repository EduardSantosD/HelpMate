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
    genders: [{ _id: "Male", name: "Male" }, { _id: "Female", name: "Female" }],
    isGymLeader: [{ _id: true, name: "True" }, { _id: false, name: "False" }],
    types: [],
    teams: [],
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .min(5)
      .required()
      .label("Password"),
    birthday: Joi.date()
      .required()
      .label("Birthday"),
    gender: Joi.string()
      .required()
      .label("Gender"),
    team: Joi.string()
      .required()
      .label("Team"),
    isGymLeader: Joi.boolean()
      .required()
      .label("Gym leader")
  };

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
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderInput("birthday", "Birthday", "date")}
          {this.renderSelect("team", "Team", this.state.teams)}
          {this.renderSelect("gender", "Gender", this.state.genders)}
          {this.renderSelect(
            "isGymLeader",
            "Gym leader",
            this.state.isGymLeader
          )}
          {this.renderButton("Register")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
