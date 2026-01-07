import { Delete, Edit, Refresh } from '@mui/icons-material';
import { Alert, Box, Button, ButtonGroup, Slide, Snackbar, Stack, Table, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import Buyer from '../../model/Buyer';
import { deleteBuyerFromApi, fetchAllBuyersFromApi } from '../../services/BuyerServices';
import Config from '../../util/config';
import BuyerMasterInput from './BuyerMasterInput';
import { KonsignSpinner } from '../../components/KonsignSpinner';
import ResponseVerdict from '../../model/ResponseVerdict';

const BuyerMaster: React.FC = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [snackbarVisibility, setSnackbarVisibility] = useState<number>(0)
    const [buyers, setBuyers] = useState<Buyer[]>([])
    const auth = useAuth();

    const syncBuyers = useCallback(async () => {
        setIsLoading(true)
        const fetchedBuyers = await fetchAllBuyersFromApi(auth)

        if (fetchedBuyers === null) {
            setSnackbarMessage('Something went wrong while trying to fetch the buyers')
            setSnackbarVisibility(1)
            return
        }

        setBuyers(fetchedBuyers)
        setIsLoading(false)
    }, [auth])

    const deleteBuyer = async(buyerId: string) => {
        deleteBuyerFromApi(buyerId, auth).then((response: ResponseVerdict) => {
            setSnackbarMessage(response.message)
            setSnackbarVisibility(2)
        }).catch((err: Error) => {
            setSnackbarMessage('Something went wrong while trying to delete the buyer')
            setSnackbarVisibility(1)
        })
    }

    function TransitionDown(props: any) {
        return <Slide {...props} direction="right" />;
    }

    useEffect(() => {
        (async () => {
            await syncBuyers()
        })()
    }, [syncBuyers])

    return (
        <Stack spacing={2}>
            <Box justifyContent="center" alignItems="center" sx={{display: 'flex'}}>
                <Typography align='center' variant='h4'>Buyer master</Typography>
            </Box>
            <BuyerMasterInput syncBuyers={syncBuyers}></BuyerMasterInput>
            {isLoading ?
                <Box justifyContent="center" alignItems="center" sx={{display: 'flex'}}>
                    <KonsignSpinner />
                </Box> :
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Buyer ID</TableCell>
                            <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Buyer name</TableCell>
                            <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    {
                        buyers?.map((buyer: Buyer) => (
                            <TableRow>
                                <TableCell>{buyer.buyerId}</TableCell>
                                <TableCell>{buyer.buyerName}</TableCell>
                                <TableCell>
                                    <ButtonGroup>
                                        <Button><Edit></Edit></Button>
                                        <Button onClick={() => { deleteBuyer(buyer.buyerId) }} color={'error'}><Delete/></Button>
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

export default BuyerMaster;