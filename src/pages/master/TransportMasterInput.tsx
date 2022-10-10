import { Add } from "@mui/icons-material"
import { Alert, Button, FormControl, Snackbar, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react"
import Transport from "../../model/Transport"
import { useAuth } from "../../context/AuthProvider"
import Config from "../../util/config"
import React from 'react';

const TransportMasterInput: React.FC<React.ReactNode> = () => {

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
                'Authorization': `Bearer ${auth?.user?.jwt}`
            }),
            body: serializedData,
            json: true
        }

        const response = await fetch(Config.ADD_TRANSPORT, requestOptions)

        if (response.status !== 200) {
            setSnackbarMessage('Failed to add transport')
            setSnackbarVisibility(1)
            return
        }

        setSnackbarMessage((await response?.json())?.message)
        setSnackbarVisibility(2)
    }

    return <>
        <FormControl>
            <TextField value={transport.transportId} type="text" name="transportId" label="Transport ID" size="small" onChange={handleTransportMasterInputChange}></TextField>
            <TextField value={transport.transportName} type="text" name="transportName" label="Transport Name" size="small" onChange={handleTransportMasterInputChange}></TextField>
        </FormControl>
        <Button onClick={addTransport}><Add></Add>Add Transport</Button>
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