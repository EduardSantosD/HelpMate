var React = require('react');

function DefaultLayout(props){
    return(
        <html lang="en">
        <head>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
            <title>{props.title}</title>
        </head>
        <body>{props.children}</body>
        </html>
    );
}

module.exports = DefaultLayout;