import React from "react";
import { Link, NavLink } from "react-router-dom";

const formatDate = (date) => {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

const solvedFun = (solved) => {
    if(solved){
        return "YES"
    }
    return "NO"
}


const QuestionCard = ({ title, date, solved, tags, views, key, course_key, question_key }) => {
    return (
        <div className="card col-md-10 ml-5 m-3">
            <div className="row d-flex justify-content-center">
                <h3> <a href={"/question/" +  course_key + "/q/" + question_key}> {title} </a></h3>
            </div>
            <div className="row d-flex justify-content-center m-1">
                <span className="">{formatDate(new Date(date))}</span>
                <span className="p-1"></span>
                <span>Solved: </span>
                <span className="">{solvedFun(solved)}</span>
                <span className="p-1"></span>
                <span>Tags: </span>
                <span className="">{tags}</span>
                <span className="p-1"></span>
                <span>Views: </span>
                <span className=" badge badge-primary badge-pill mt-1 ml-1">{views}</span>
            </div>
        </div>
    );
};

export default QuestionCard;
