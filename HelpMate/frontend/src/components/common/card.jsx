import React from "react";
import { Link } from "react-router-dom";

const Card = ({ image, path, button, description }) => {
  return (
    <div className="card mb-4 shadow">
      <img className="card-img-top" src={image} alt={button} />
      <div className="card-body">
        <h4>
          <small className="text-muted">{description}</small>
        </h4>
        <Link
          role="button"
          className="btn btn-lg btn-block btn-outline-primary"
          to={path}
        >
          {button}
        </Link>
      </div>
    </div>
  );
};

export default Card;
