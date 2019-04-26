var React = require('react');
var DefaultLayout = require('./layouts/default');

function Index(props){
    return (
        <DefaultLayout title={props.title}>
            <div className=' w3-container w3-third'></div>
            <div className="w3-container w3-third w3-animate-top">
                <br/>
                <h3 className='w3-teal w3-center w3-round'>Welcome to HelpMate!</h3>
                <br/>
                <div className='w3-center'>
                    <a className='w3-button w3-round w3-center w3-light-grey' href="/register/professor">Professor registration</a>
                </div>
                <br/>
                <div className='w3-center'>
                    <a className='w3-button w3-round w3-center w3-light-grey' href="/register/student">Student registration</a>
                </div>
            </div>
            <div className='w3-container w3-third'></div>
        </DefaultLayout>
    );
}

module.exports = Index;