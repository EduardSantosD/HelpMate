import React, { Component } from "react";
import Joi from "joi-browser";
import "./sidebar.css"

class SideBar extends Component {
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
                <div class="sidenav">
                    <a href="#">About</a>
                    <a href="#">Services</a>
                    <a href="#">Clients</a>
                    <a href="#">Contact</a>
                </div>
            </div>
        );
    }
}

export default SideBar;
