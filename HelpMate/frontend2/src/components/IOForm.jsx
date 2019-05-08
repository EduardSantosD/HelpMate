import React from "react";
import AskCard from "./common/askCard"
import TagInput from "./tagInput";

const IOForm = ({ name, id, term, year }) => {
    
    return (

        <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-light border-bottom shadow-sm">
            <form>
                <div className="row">
                    <div className="col-md-5">
                        <div className="form-group">
                            <AskCard image={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/VisualEditor_-_Icon_-_Help.svg/1024px-VisualEditor_-_Icon_-_Help.svg.png"}/>
                        </div>
                    </div>
                        <div className="col">
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <div className="col-sm-50">
                                <input type="text" className="form-control" id="title" placeholder="Question Title"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">Content</label>
                            <textarea className="form-control" id="content" rows="3"></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="tags">Tags</label>
                            <TagInput />
                        </div>
                        <div>
                        <button type="submit" class="btn btn-primary mb-2">Ask</button>

                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default IOForm;
