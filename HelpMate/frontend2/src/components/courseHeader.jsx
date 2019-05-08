import React from "react";

const CourseHeader = ({ name, id, term, year }) => {
    return (

        <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-primary border-bottom shadow-sm">
            <nav className="my-2 my-md-0 mr-md-3 text-white font-weight-bold"> {name} </nav>
            <nav className="my-2 my-md-0 mr-md-3 text-white"> {id} </nav>
            <nav className="my-2 my-md-0 mr-md-3 text-white"> {term.toUpperCase()} </nav>
            <nav className="my-2 my-md-0 mr-md-3 text-white"> {year} </nav>
        </div>
    );
};

export default CourseHeader;
