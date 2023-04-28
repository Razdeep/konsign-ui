import { Delete, Edit, Refresh } from '@mui/icons-material';
import { Alert, Box, Button, ButtonGroup, Slide, Snackbar, Stack, Table, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import Transport from '../../model/Transport';
import { fetchAllTransportsFromApi } from '../../services/TransportServices';
import Config from '../../util/config';
import TransportMasterInput from './TransportMasterInput';
import { KonsignSpinner } from '../../components/KonsignSpinner';

const TransportMaster: React.FC = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [snackbarVisibility, setSnackbarVisibility] = useState<number>(0)
    const [transports, setTransports] = useState<Transport[]>([])
    const auth = useAuth();

    const syncTransports = useCallback(async () => {
        setIsLoading(true)
        const fetchedTransports = await fetchAllTransportsFromApi(auth)

        if (fetchedTransports === null) {
            setSnackbarMessage('Something went wrong while trying to fetch the transports')
            setSnackbarVisibility(1)
            return
        }

        setTransports(fetchedTransports)
        setIsLoading(false)
    }, [auth])

    const deleteTransport = async(transportId: string) => {
        const requestOptions = {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.user?.jwt}`
            }),
            json: true
        }

        const response = await fetch(`${Config.DELETE_TRANSPORT}/${transportId}`, requestOptions).catch(e => {
            setSnackbarMessage('Something went wrong while trying to delete the transport')
            setSnackbarVisibility(1)
            return
        })
        
        if (response == null || response?.status !== 200) {
            setSnackbarMessage('Something went wrong while trying to delete the transport')
            setSnackbarVisibility(1)
            return
        }

        const responseJson = await response.json()
        setSnackbarMessage(responseJson?.message)
        setSnackbarVisibility(2)
    }

    function TransitionDown(props: any) {
        return <Slide {...props} direction="right" />;
    }

    useEffect(() => {
        (async () => {
            await syncTransports()
        })()
    }, [syncTransports])

    return (
        <Stack spacing={2}>
            <Box justifyContent="center" alignItems="center" sx={{display: 'flex'}}>
                <Typography align='center' variant='h4'>Transport master</Typography>
            </Box>
            <TransportMasterInput syncTransports={syncTransports}></TransportMasterInput>
            {isLoading ?
                <Box justifyContent="center" alignItems="center" sx={{display: 'flex'}}>
                    <KonsignSpinner />
                </Box> :
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Transport ID</TableCell>
                            <TableCell>Transport name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    {
                        transports?.map((transport: Transport) => (
                            <TableRow>
                                <TableCell>{transport.transportId}</TableCell>
                                <TableCell>{transport.transportName}</TableCell>
                                <TableCell>
                                    <ButtonGroup>
                                        <Button><Edit/></Button>
                                        <Button onClick={() => { deleteTransport(transport.transportId) }} color={'error'}><Delete></Delete></Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </Table>
            }
            <Snackbar open={snackbarVisibility === 2} autoHideDuration={6000} onClose={()=>setSnackbarVisibility(0)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} TransitionComponent={TransitionDown}>
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
        </Stack>
    )

}

export default TransportMaster;