import { Add, Refresh } from "@mui/icons-material"
import { Alert, Button, ButtonGroup, Snackbar, Stack, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react"
import Transport from "../../model/Transport"
import { useAuth } from "../../context/AuthProvider"
import React from 'react';
import { addTransport } from "../../services/TransportServices"

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

    

    return <>
        <Stack direction={'row'} spacing={2}>
            <TextField value={transport.transportId} type="text" name="transportId" label="Transport ID" size="small" onChange={handleTransportMasterInputChange}></TextField>
            <TextField value={transport.transportName} type="text" name="transportName" label="Transport Name" size="small" onChange={handleTransportMasterInputChange}></TextField>
            <ButtonGroup>
                <Button variant={'contained'} onClick={() => addTransport(transport, auth, setSnackbarMessage, setSnackbarVisibility)} startIcon={<Add/>} color={"success"}>Add Transport</Button>
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