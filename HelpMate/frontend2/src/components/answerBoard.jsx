import React, { Component } from "react";
import AnswerCard from './answerCard'
import AnswerBoard from './answerBoard'

class AnswersBoard extends Component {
    state = {
        questions: []
    };

    componentWillMount() {
        let questions = this.props.questions
        this.setState({ questions })
    }

    render() {
        console.log("las quuestions", this.props.questions)
        return (
            <div className="bg-light border-bottom shadow-sm">
                <div className="row">
                    <div className="col">
                        {
                            this.props.answers.slice(0, Math.floor(this.props.answers.length / 2)).map(answer =>
                                <AnswerCard  content={answer.content} correct={answer.correct} date = {answer.creation_date} 
                                author={answer.author} comment_count={answer.comments.length} key={answer.content} />
                            )
                        }
                    </div>
                    <div className="col">
                        {
                            this.props.answers.slice(Math.floor(this.props.answers.length / 2), this.props.answers.length).map(answer =>
                                <AnswerCard  content={answer.content} correct={answer.correct} date = {answer.creation_date} 
                                author={answer.author} comment_count={answer.comments.length} key={answer.content} />
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default AnswersBoard;
