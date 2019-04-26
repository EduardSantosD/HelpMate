var React = require('react');

function DefaultLayout(props){
    return(
        <html lang="en">
        <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"/>
            <title>{props.title}</title>
        </head>
        <body>{props.children}</body>
        </html>
    );
}

module.exports = DefaultLayout;