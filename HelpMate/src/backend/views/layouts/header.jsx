var React = require('react');

function DefaultHeader(props) {
    return (
        <div className='w3-row'>
            <a href="/"><i className="fa fa-home w3-align-left"></i></a>
        </div>
    );
}

module.exports = DefaultHeader;