import React, { Component } from "react";
import Joi from "joi-browser"
import auth from "../services/authService";
import questions from "../services/questionService";
import QuestionInfo from "./questionInfo"
import AnswersBoard from "./answerBoard"
import IOForm from "./IOForm"
import "./home.css"

class Question extends Component {
    state = {
        answers: [],
        // Null for avoid 0 when load 
        question_info: []
    };

    schema = {
        email: Joi.string()
            .required()
            .label("Email"),
        password: Joi.string()
            .required()
            .label("Password")
    };

    async componentWillMount() {
        let url = window.location.href.split('/')
        const question_id = url.pop();
        this.setState({ question_id })
        console.log(question_id)
        url.pop()
        const course_id = url.pop();
        this.setState({ question_id })
        console.log(question_id)
        const user = auth.getCurrentUser();
        console.log(user)
        this.setState({ user })
        console.log(this.state.user)

        try {
            await questions.getQuestion(user.jwt, question_id, course_id).then((question) => {
                let question_info = question[0];
                console.log("hey" , question_info)
                let answers = question[1];
                this.setState({answers});
                this.setState({ question_info});
            })

        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = { ...this.state.errors };
                errors.email = ex.response.data;
                this.setState({ errors });
            }
        }
    }
    

    render() {
        return (
            <div id="container" className="mb-4 shadow card">
                
                <QuestionInfo 
                    title = {this.state.question_info.title}
                    author={this.state.question_info.author}
                    course = {this.state.question_info.course_id}
                    date = {this.state.question_info.creation_date}
                    solved = {this.state.question_info.solved}
                    views = {this.state.question_info.views}
                    content = {this.state.question_info.content}
                    tags = {this.state.question_info.tags}/>


                <IOForm question_id={this.state.question_info.id} title="How to Answer" message="Be sure about your answer, do not forget to vote!"
                    image="https://www.daylong.co.uk/info/content/uploads/2017/11/qa.png" answer={true} />
                
                <AnswersBoard answers={this.state.answers} />
            
            </div>
        );
    }
}

export default Question;
