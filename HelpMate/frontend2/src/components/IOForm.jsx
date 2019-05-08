import React from "react";
import AskCard from "./common/askCard"
import TagInput from "./tagInput";

const IOForm = ({ title, message, image, answer }) => {
    
    return (

        <div className="card d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-light border-bottom shadow-sm">
            <form>
                <div className="row">
                    <div className="col-md-5">
                        <div className="form-group">
                            <AskCard title={title} message={message}
                            image={image}/>
                        </div>
                    </div>
                        <div className="col">
                        {
                            !answer &&
                            <div>
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
                        }
                        {
                            answer && 
                            <div>
                                <div className="form-group">
                                    <label htmlFor="content">Answer</label>
                                    <textarea className="form-control" id="content" rows="3"></textarea>
                                </div>
                                <div>
                                    <button type="submit" class="btn btn-primary mb-2">Submit</button>
                                </div>
                            </div>

                        }
                    </div>
                </div>
            </form>
        </div>
    );
};

export default IOForm;
