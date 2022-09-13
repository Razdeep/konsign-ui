import { ChangeEvent, useState } from 'react'
import Config from '../../util/config';
import { useAuth } from '../../util/auth';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import React from 'react';
import { Container, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {

    const auth = useAuth()

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

    class Credential {
        username: String = "";
        password: String = "";
    }
    
    const [credential, setCredential] = useState<Credential>({
        username: '',
        password: ''
    });

    const handleClose = () => {
        setIsSubmitted(false);
    }

    const handleCredentialChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setCredential({ ...credential, [e.target.name]: e.target.value });
    }

    const navigate = useNavigate()

    const handleSubmit = async (event: any) => {
        // Prevent page reload
        event.preventDefault();
        const jsonified_credential = JSON.stringify(credential)
        console.log('sending message = ' + jsonified_credential)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: jsonified_credential,
        };
        const response: Response | void = await fetch(Config.LOGIN_URL, requestOptions).catch(e => {
            console.log("Error authenticating");
            setErrorMessages({
                name: 'error',
                message: e.string
            });
            return;
        })
        if (response) {
            console.log('response status is ' +  response.status)
            if (response.status === 200) {
                const user = await response.json()
                let response_json = JSON.stringify(user)
                console.log('response message is ' + response_json)
                auth.login(user)
                navigate("/dashboard", { replace: true });
            } else {
                setErrorMessages({
                    name: 'error',
                    message: 'wrong username or pword'
                });
            }
        }
    };
    
    const renderForm = (
        <Container className="form">
            <form>
                <div className="input-container">
                    <label>Username </label>
                    <TextField name="username" onChange={handleCredentialChange}></TextField>
                    {renderErrorMessage("uname")}
                </div>
                <div className="input-container">
                    <label>Password </label>
                    <TextField type="password" name="password" onChange={handleCredentialChange} required />
                    {renderErrorMessage("pass")}
                </div>
                <div className="button-container">
                    <button type="button" onClick={handleSubmit}>Login</button>
                </div>
            </form>
            <Dialog onClose={handleClose} open={isSubmitted}>
                <DialogTitle>{errorMessages.name === '' ? <>Logged in Successfully</> : <>Login not successful</>}</DialogTitle>
            </Dialog>
        </Container>
    );
    
    return renderForm;
}

export default Login;