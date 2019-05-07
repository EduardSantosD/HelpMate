import React from "react";
import "./courseCard.css"

const CourseCard = ({ title, image, last_mod, path, description, area }) => {
    return (

        <div class="col-md-7 courseCard">
                <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative ">
                    <div class="col p-4 d-flex flex-column position-static">
                        <strong class="d-inline-block mb-2 text-success">{area}</strong>
                        <h3 class="mb-0">{title}</h3>
                        <div class="mb-1 text-muted">{last_mod}</div>
                        <p class="mb-auto">{description}</p>
                        <a href='#' class="stretched-link">Go to the course</a>
                    </div>
                    <div class="col-auto d-none d-lg-block">
                    <img class="bd-placeholder-img" src={image} width="300" height="250"/>
                    </div>
                </div>
            </div>
    );
};

export default CourseCard;
