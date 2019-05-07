import React, { Component } from "react";
import Joi from "joi-browser";
import SideNavPage from "./common/sidenavpage";

class Home extends Component {
    state = {
        data: { email: "", password: "" },
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

    render() {
        return (
            <div>
                <SideNavPage />
                <h1>Saludo</h1>
                Hola
            </div>
        );
    }
}

export default Home;
