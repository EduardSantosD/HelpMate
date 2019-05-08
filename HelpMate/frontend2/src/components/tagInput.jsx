import React, { Component } from "react";

class TagInput extends Component {
    state = {
        input_array : []
    };

    randomClassColor(){
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

    getBadged(inp) {
        const input = inp.target;
        const container = document.getElementById("tagContainer")
        container.innerHTML = ""
        let input_str = input.value;
        let input_array = input_str.split(',');
        this.setState({ input_array});
        for(let i = 0 ; i < input_array.length; i++){
            let a = document.createElement('A');
            let separator = document.createElement('SPAN')
            separator.innerHTML = " ";
            a.innerHTML = input_array[i];
            a.className = this.randomClassColor();
            container.appendChild(a);
            container.appendChild(separator);
        }
    }

    render() {
        return (
            <div>
                <div className="col-sm-50">
                    <input type="text" onChangeCapture={this.getBadged.bind(this)} className="form-control" id="tags" placeholder="Tags" />
                </div>
                <div id="tagContainer">
                </div>

            </div>
        );
    }
}

export default TagInput;
