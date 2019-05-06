import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
  return (
    <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-dark border-bottom shadow-sm">
      <Link to="/" className="my-0 mr-md-auto font-weight-normal">
        <h3 className="my-0 mr-md-auto font-weight-normal">HelpMate</h3>
      </Link>
      <nav className="my-2 my-md-0 mr-md-3">
        {!user && (
          <NavLink className="btn btn-outline-primary" to="/login">
            Login
          </NavLink>
        )}
      </nav>
      {!user && (
        <NavLink className="btn btn-outline-primary" to="/register">
          Sign up
        </NavLink>
      )}
      {user && (
        <React.Fragment>
          <NavLink className="nav-item nav-link" to="/profile">
            {user.username}
          </NavLink>
          <NavLink className="nav-item nav-link" to="/logout">
            Logout
          </NavLink>
        </React.Fragment>
      )}
      <form className="form-inline mt-2 mt-md-0 ml-2">
        <input
          className="form-control mr-sm-2"
          type="text"
          placeholder="Search"
          aria-label="Search"
        />
        <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default NavBar;
