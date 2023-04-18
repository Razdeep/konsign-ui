import { ChangeEvent, useState } from 'react'
import Config from '../../util/config';
import { useAuth } from '../../context/AuthProvider';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import React from 'react';
import { Backdrop, Button, DialogActions, DialogContent, DialogContentText, FormControl, Grid, Paper, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoginSharp } from '@mui/icons-material';
import { KonsignSpinner } from '../../components/KonsignSpinner';

const Login: React.FC = () => {

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

    const paperStyle = {
        height: '30vh', width: '35vh', margin: "auto", textalign: "center",
        background: "#00FFCA", display: "flex", padding: '3vh', center: 1
    }

    const renderForm = (
        <Grid style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#0A4D68' }}>
            <Paper sx={paperStyle}>
                <FormControl fullWidth>
                    <Stack spacing={3}>
                        <TextField label="username" name="username" onChange={handleCredentialChange} variant="standard" required fullWidth/>
                        <TextField label="password" type="password" name="password" onChange={handleCredentialChange} variant="standard" required fullWidth/>
                        <Button onClick={handleSubmit} style={{ color: "#00FFCA", background: "#0A4D68" }} fullWidth><LoginSharp />Login</Button>
                    </Stack>
                </FormControl>
            </Paper>
            {
                !isLoading ? <></> :
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={isLoading}
                        onClick={handleClose}
                    >
                        <KonsignSpinner/>
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