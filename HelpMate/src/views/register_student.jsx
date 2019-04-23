var React = require('react');
var DefaultLayout = require('./layouts/default');
var DefaultHeader = require('./layouts/header');

function RegisterForm(props) {
    return (
        <DefaultLayout title={props.title}>
            <div className='w3-container w3-third'></div>
            <div className='w3-container w3-third w3-animate-top'>
                <br />
                <DefaultHeader></DefaultHeader>
                <h3 className='w3-teal w3-center w3-round'>Student registration form</h3>
                <form className='w3-container w3-light-grey w3-round' action="/register/professor" method="post">
                    <p>
                        <label htmlFor="email">Email</label>
                        <input className='w3-input w3-border w3-round' type="email" name="email" id="email" email />
                        <label htmlFor="password">Password</label>
                        <input className='w3-input w3-border w3-round' type="password" name="password" id="password" />
                    </p>
                    <br/>
                    <p>
                        <label htmlFor="first_name">First name</label>
                        <input className='w3-input w3-border w3-round' type="text" name="first_name" id="first_name" />
                        <label htmlFor="middle_name">Middle name</label>
                        <input className='w3-input w3-border w3-round' type="text" name="middle_name" id="middle_name" />
                        <label htmlFor="last_name">Last name</label>
                        <input className='w3-input w3-border w3-round' type="text" name="middle_name" id="middle_name" />
                    </p>
                    <br/>
                    <p>
                        <label htmlFor="age">Age</label>
                        <input className='w3-input w3-border w3-round' type="number" name="age" id="age" min='0'/>
                        <label htmlFor="gender">Gender</label>
                        <select className='w3-select w3-border' name="gender" id="gender">Choose your gender
                            <option value="" disabled selected>Choose your gender</option>
                            <option value="0">Male</option>
                            <option value="1">Female</option>
                            <option value="2">Other</option>
                        </select>
                    </p>
                    <br/>
                    <p>
                        <label htmlFor="major">Major</label>
                        <input className='w3-input w3-border w3-round' type="text" name="major" id="major"/>
                        <label htmlFor="semester">Semester</label>
                        <input className='w3-input w3-border w3-round' type="number" name="semester" id="semester" min='0'/>
                    </p>
                    <div className='w3-container w3-center'>
                        <button className='w3-button w3-border w3-round'>Submit</button>
                    </div>
                    <br />
                </form>
                <br />
            </div>
            <div className='w3-container w3-third'></div>
        </DefaultLayout>
    );
}

module.exports = RegisterForm;