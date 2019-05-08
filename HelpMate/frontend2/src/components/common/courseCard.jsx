import React from "react";
import "./courseCard.css"

const CourseCard = ({ title, image, last_mod, path, description, area }) => {
    return (

        <div className="col-md-7 courseCard ">
                <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative ">
                    <div className="col p-4 d-flex flex-column position-static">
                        <strong className="d-inline-block mb-2 text-success">{area}</strong>
                        <h3 className="mb-0">{title}</h3>
                        <div className="mb-1 text-muted">{last_mod}</div>
                        <p className="mb-auto">{description}</p>
                        <a href={path} className="stretched-link">Go to the course</a>
                    </div>
                    <div className="col-auto d-none d-lg-block">
                    <img className="bd-placeholder-img" src={image} width="300" height="250"/>
                    </div>
                </div>
            </div>
    );
};

export default CourseCard;
