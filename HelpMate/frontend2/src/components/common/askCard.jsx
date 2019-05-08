import React from "react";
import "./courseCard.css"

const AskCard = ({ title, image, last_mod, path, description, area }) => {
    return (

        <div className="col-md-10 courseCard ">
            <div className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative ">
                <div className="col p-4 d-flex flex-column position-static bg-dark">
                    <strong className="d-inline-block mb-2 text-success">{area}</strong>
                    <h3 className="mb-0 text-primary">How to Ask</h3>
                    <p className="mb-auto text-white">Fill the next fields correctly and be polite!</p>
                </div>
                <div className="col-auto d-none d-lg-block">
                    <img className="bd-placeholder-img" src={image} width="250" height="250" />
                </div>
            </div>
        </div>
    );
};

export default AskCard;
