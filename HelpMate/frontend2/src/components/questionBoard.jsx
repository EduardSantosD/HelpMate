import React, { Component } from "react";
import QuestionCard from './questionCard'

class QuestionBoard extends Component {
    state = {
        questions : []
    };

    componentWillMount() {
        let questions = this.props.questions
        this.setState({questions})
    }

    render() {
        console.log("las quuestions", this.props.questions)
        return (
            <div className="bg-light border-bottom shadow-sm">
                    <div className="row">
                        <div className="col">
                        {
                            this.props.questions.slice(0, Math.floor(this.props.questions.length/2)).map(question =>
                                <QuestionCard key={question.id} title={question.title} date={question.creation_date} 
                                solved={question.solved} tags={question.tags} views={question.views} />
                            )
                        }
                        </div>
                        <div className="col">
                            {
                            this.props.questions.slice(Math.floor(this.props.questions.length / 2), this.props.questions.length).map(question =>
                                <QuestionCard key={question.id} title={question.title} date={question.creation_date} 
                                solved={question.solved} tags={question.tags} views={question.views} />
                            )
                        }
                        </div>
                    </div>
                </div>
        );
    }
}

export default QuestionBoard;
