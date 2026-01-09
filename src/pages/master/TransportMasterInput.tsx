import { Add, Refresh } from "@mui/icons-material"
import { Alert, Button, ButtonGroup, FormControl, Snackbar, Stack, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react"
import Transport from "../../model/Transport"
import { useAuth } from "../../context/AuthProvider"
import Config from "../../util/config"
import React from 'react';

interface ParentProps {
    syncTransports: () => void
}

const TransportMasterInput: React.FC<ParentProps> = ({ syncTransports } : any) => {

    const auth = useAuth()
    const [transport, setTransport] = useState<Transport>({
        transportId: '',
        transportName: ''
    })

    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [snackbarVisibility, setSnackbarVisibility] = useState<number>(0)

    const handleTransportMasterInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setTransport({ ...transport, [e.target.name]: e.target.value })
    }

    const addTransport = async () => {
        const serializedData = JSON.stringify(transport);
        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.user?.accessToken}`
            }),
            body: serializedData,
            json: true
        }

        const response = await fetch(Config.TRANSPORTS_ENDPOINT, requestOptions)

        if (response.status !== 200) {
            setSnackbarMessage('Failed to add transport')
            setSnackbarVisibility(1)
            return
        }

        setSnackbarMessage((await response?.json())?.message)
        setSnackbarVisibility(2)
    }

    return <>
        <Stack direction={'row'} spacing={2}>
            <TextField value={transport.transportId} type="text" name="transportId" label="Transport ID" size="small" onChange={handleTransportMasterInputChange}></TextField>
            <TextField value={transport.transportName} type="text" name="transportName" label="Transport Name" size="small" onChange={handleTransportMasterInputChange}></TextField>
            <ButtonGroup>
                <Button variant={'contained'} onClick={addTransport} startIcon={<Add/>} color={"success"}>Add Transport</Button>
                <Button color={'info'} variant={'contained'} onClick={syncTransports} startIcon={<Refresh/>}>Sync</Button>
            </ButtonGroup>
        </Stack>
        <Snackbar open={snackbarVisibility === 2} autoHideDuration={6000} onClose={()=>setSnackbarVisibility(0)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={()=>setSnackbarVisibility(0)} severity='success' sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
        <Snackbar open={snackbarVisibility === 1} autoHideDuration={6000} onClose={()=>setSnackbarVisibility(0)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={()=>setSnackbarVisibility(0)} severity='error' sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
    </>
}

export default TransportMasterInput;