import React from "react";
import "./common/courseCard.css"

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

const getRandomClass = () => {
    let arr = [
        "badge badge-pill badge-primary",
        "badge badge-pill badge-secondary",
        "badge badge-pill badge-success",
        "badge badge-pill badge-danger",
        "badge badge-pill badge-warning",
        "badge badge-pill badge-info",
        "badge badge-pill badge-dark"
    ]
    let r = Math.floor((Math.random() * arr.length));
    return arr[r]
}

const solvedFun = (solved) => {
    if (solved) {
        return <span className="badge badge-pill badge-success ">SOLVED</span>
    }
    return <span className="badge badge-pill badge-danger ">UNSOLVED</span>
}

const processComments = (comments) => {
    if (comments) {
        return <span className={getRandomClass()} >{comments}</span>
    }
    return <span className="badge badge-pill badge-danger ">0</span>
}


const AnswerCard = ({ content, author, date, correct, coment_count}) => {
    return (
        <div className="card col-md-10 ml-5 m-3">
            <div className="row d-flex justify-content-center p-3">
                <h3 className="titleCards">  {content} </h3>
            </div>
            <div className="row d-flex justify-content-center m-1">
                <span className="">{formatDate(new Date(date))}</span>
                <span className="p-1"></span>
                <span>Solved: </span>
                <span className="">{solvedFun(correct)}</span>
                <span className="p-1"></span>
                <span>Author: </span>
                <span className="">{author}</span>
                <span className="p-1"></span>
                <span>Comments: </span>
                <span className=" badge badge-primary badge-pill mt-1 ml-1">{processComments(coment_count)}</span>
            </div>
        </div>
    );
};

export default AnswerCard;
