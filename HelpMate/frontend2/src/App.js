import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import ProtectedRoute from "./components/common/protectedRoute";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import RegisterForm from "./components/registerForm";
import RegisterFormProfessor from "./components/registerFormProfessor";
import NavBar from "./components/navBar";
import PokeDeck from "./components/pokeDeck";
import NotFound from "./components/notFound";
import Home from "./components/home";
import Course from "./components/course";
import Question from "./components/question";
import CreateCourse from "./components/createCourse"
import auth from "./services/authService";
import "./App.css";

class App extends Component {
  state = {};
  componentDidMount() {
    const user = auth.getCurrentUser();
    console.log("tthis" , (user))
    this.setState({ user });
  }
  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <NavBar user={user} />
        <main className="container">
          <Switch>
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/registerprofessor" component={RegisterFormProfessor} />
            <Route path="/not-found" component={NotFound} />
            <Route path="/home" component={Home} />
            <Route path="/create_course" component={CreateCourse} />
            <Route path="/courses/" component={Course} />
            <Route path="/question/:course_key/q/:question_key" component={Question} />
            <Route path="/" component={PokeDeck} exact />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
