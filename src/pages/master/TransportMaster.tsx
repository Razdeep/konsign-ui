import { Delete, Edit, Refresh } from '@mui/icons-material';
import { Alert, Box, Button, ButtonGroup, Slide, Snackbar, Stack, Table, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import Transport from '../../model/Transport';
import { deleteTransportFromApi, fetchAllTransportsFromApi } from '../../services/TransportServices';
import Config from '../../util/config';
import TransportMasterInput from './TransportMasterInput';
import { KonsignSpinner } from '../../components/KonsignSpinner';
import ResponseVerdict from '../../model/ResponseVerdict';

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
        deleteTransportFromApi(transportId, auth).then((response: ResponseVerdict) => {
            setSnackbarMessage(response.message)
            setSnackbarVisibility(2)
        }).catch((err: Error) => {
            setSnackbarMessage('Something went wrong while trying to delete transport')
            setSnackbarVisibility(1)
        })
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
                            <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Transport ID</TableCell>
                            <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Transport name</TableCell>
                            <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Actions</TableCell>
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