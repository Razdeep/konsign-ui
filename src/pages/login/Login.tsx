import { ChangeEvent, useState } from 'react'
import Config from '../../util/config';
import { useAuth } from '../../util/auth';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import React from 'react';
import { Backdrop, Button, CircularProgress, Container, DialogActions, DialogContent, DialogContentText, Grid, Paper, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoginSharp } from '@mui/icons-material';

const Login: React.FC<React.ReactNode> = () => {

    const auth = useAuth()

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isIncorrectCredential, setIncorrectCredential] = useState<boolean>(false);

    class Credential {
        username: String = "";
        password: String = "";
    }

    const [credential, setCredential] = useState<Credential>({
        username: '',
        password: ''
    });

    const handleClose = () => {
        setIncorrectCredential(false)
    }

    const handleCredentialChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setCredential({ ...credential, [e.target.name]: e.target.value });
    }

    const navigate = useNavigate()

    const handleSubmit = async (event: any) => {
        // Prevent page reload
        event.preventDefault()
        setIsLoading(true)
        const jsonified_credential = JSON.stringify(credential)
        console.log('sending message = ' + jsonified_credential)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: jsonified_credential,
        };
        const response: Response | void = await fetch(Config.LOGIN_URL, requestOptions).catch(e => {
            console.log("Error authenticating")
            setIsLoading(false)
            return
        })
        setIsLoading(false)
        if (response) {
            console.log('response status is ' + response.status)
            if (response.status === 200) {
                const user = await response.json()
                let response_json = JSON.stringify(user)
                console.log('response message is ' + response_json)
                auth.login(user)
                navigate("/dashboard", { replace: true });
            } else {
                setIncorrectCredential(true)
            }
        }
    };

    const paperStyle = { height: 200, width: 250, margin: "auto", textalign: "center", background: "rgb(195, 248, 255)", display: "block", padding: 2 }

    const renderForm = (
        <Grid style={{ minHeight:'100vh' }}>
            <Paper sx={paperStyle}>
                <form>
                    <Container style={{textAlign: "center"}}>
                        <TextField label="username" name="username" onChange={handleCredentialChange} variant="standard" required></TextField>
                        <TextField label="password" type="password" name="password" onChange={handleCredentialChange} variant="standard" required />
                        <Button onClick={handleSubmit} style={{ color: "lightgreen", background: "green", margin: "10 10 10 10" }} fullWidth><LoginSharp />Login</Button>
                    </Container>
                </form>
            </Paper>
            {
                !isLoading ? <></> :
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={isLoading}
                        onClick={handleClose}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
            }
            {
                !isIncorrectCredential ? <></> :
                    <Dialog
                        open={isIncorrectCredential}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Incorrect username/password"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                You have either typed incorrect username or password. Please try again.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Ok</Button>
                        </DialogActions>
                    </Dialog>
            }
        </Grid>
    );

    return renderForm;
}

export default Login;