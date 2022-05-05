import React, { ChangeEvent, useState, useEffect } from 'react'
import Config from '../../util/config';

function Login() {
    class ErrorMessage {
        name: string = '';
        message: string = '';
    }
    
    const [errorMessages, setErrorMessages] = useState<ErrorMessage>({
        name: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const renderErrorMessage = (name: string) => {
        return name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );
    }

    const handleSubmit = (event: any) => {
        // Prevent page reload
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Authorization': 'basic ' + btoa('rajdeep:rajdeep') },
        };
        fetch(Config.BILL_ENTRY_URL, requestOptions)
            .then((res) => {
                console.log("Response code is " + res.status);
            }).catch(e => {
                console.log("Error authenticating");
            })
    };
    
    const renderForm = (
        <div className="form">
            <form>
                <div className="input-container">
                    <label>Username </label>
                    <input type="text" name="username" required />
                    {renderErrorMessage("uname")}
                </div>
                <div className="input-container">
                    <label>Password </label>
                    <input type="password" name="password" required />
                    {renderErrorMessage("pass")}
                </div>
                <div className="button-container">
                    <button type="button" onClick={handleSubmit}>Login</button>
                </div>
            </form>
        </div>
    );
    
    return renderForm;
}

export default Login;