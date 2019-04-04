var React = require('react');
var DefaultLayout = require('./layouts/default');

function HelloWorld(props){
    return (
        <DefaultLayout title={props.title}>
            <div className="w3-center w3-blue">
                <h1>Hello, {props.name}</h1>
            </div>
        </DefaultLayout>
    );
}

module.exports = HelloWorld;