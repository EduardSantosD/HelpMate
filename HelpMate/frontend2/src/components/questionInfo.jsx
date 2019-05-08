import React from "react";

const getRandomClass = () =>{
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

const getBadged = (list) => {
    return (
        <div className="pt-2">
            {list.map(tag =>
                <span className={getRandomClass() + " t-2 m-2"}>{tag}</span>
            )}

        </div>
    )
}

const solvedFun = (solved) => {
    if (solved) {
        return <span className="badge badge-pill badge-success ">SOLVED</span>
    }
    return <span className="badge badge-pill badge-danger ">UNSOLVED</span>
}

const processViews = (views) => {
    if (views) {
        return <span className={getRandomClass()} >{views}</span>
    }
    return <span className="badge badge-pill badge-danger ">{views}</span>
}

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

const QuestionInfo = ({ title, course, author, date, solved, views, content, tags }) => {
    return (
        <div className="card p-3 px-md-4 mb-3 bg-light border-bottom shadow-sm">
            <div className="row d-flex justify-content-center">
                <h3>{title}</h3>
            </div>
            <div className="row d-flex justify-content-center">
                <span className=" px-3 blockquote-footer"><cite title="autor">By {author}</cite></span>
                <span className=" px-4"></span>
                <span className=" px-3">{course}</span>
                <span className=" px-4"></span>
                <span className=" px-3">{formatDate(new Date(date))}</span>
                <span className=" px-4"></span>
                <span className=" px-3">{solvedFun(solved)}</span>
                <span className=" px-4"></span>
                <span className=" px-3">{processViews(views)}</span>
            </div>
            <div>
                <p class="blockquote text-right p-4">
                    {content}
                </p>
            </div>
            <div className="row d-flex justify-content-center p-2 md-8">
                <button type="button" class="col-sm-2 btn btn-labeled btn-success m-2">Good Question!</button>
                <button type="button" class="col-sm-2 btn btn-labeled btn-danger m-2">Really?</button>
                <span className="pt-3">
                    Tags: 

                </span>
                {getBadged([tags])}
            </div>
        </div>
    );
};

export default QuestionInfo;
