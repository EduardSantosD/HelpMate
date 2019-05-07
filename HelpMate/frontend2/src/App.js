import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import ProtectedRoute from "./components/common/protectedRoute";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import RegisterForm from "./components/registerForm";
import NavBar from "./components/navBar";
import PokeDeck from "./components/pokeDeck";
import PokeList from "./components/pokeList";
import PokeView from "./components/pokeView";
import NotFound from "./components/notFound";
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
            <ProtectedRoute path="/pokemon/:number" component={PokeView} />
            <Route path="/pokemon" component={PokeList} />
            <Route path="/not-found" component={NotFound} />
            <Route path="/" component={PokeDeck} exact />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
