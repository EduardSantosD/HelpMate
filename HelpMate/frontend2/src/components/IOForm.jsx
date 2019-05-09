import React from "react";
import AskCard from "./common/askCard"
import TagInput from "./tagInput";
import questions from "../services/questionService"
import auth from "../services/authService"

var course_id_g = ""
var question_id_g = "";
const submitQuestion = async (e) => {
    let answer = e.currentTarget.value;
    let url = window.location.href.split('/')
    question_id_g = url.pop()
    url.pop()
    course_id_g = url.pop();
    if (answer === 'ask'){
        //get data
        let title = document.getElementById('title').value
        let content = document.getElementById('content').value
        let tags = document.getElementById('tags').value.split(',')
        let anonymous = false;
        const user = auth.getCurrentUser().jwt;
        await questions.setQuestion(user, title, content, tags, anonymous, course_id_g)
    }
    else if(answer === 'answer'){
        let content = document.getElementById('content').value
        let anony = document.getElementById('anonymous').checked
        const user = auth.getCurrentUser().jwt;
        console.log(content, anony, user, course_id_g)
        await questions.setAnswer(content, anony, user, course_id_g, question_id_g)
    }
}

const IOForm = ({ title, message, image, answer, course_id, question_id }) => {
    return (
        
        <div className="card d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-light border-bottom shadow-sm">
            <div>
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
                                    <button onClick={submitQuestion.bind(this)} value="ask" class="btn btn-primary mb-2">Ask</button>
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
                                    <label htmlFor="anonymous" className="p-2">Anonymous</label>
                                    <input type="checkbox" name="anonymous" id="anonymous"/>
                                </div>
                                <div>
                                    <button onClick={submitQuestion.bind(this)} value="answer" class="btn btn-primary mb-2">Submit</button>
                                </div>
                            </div>

                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IOForm;
