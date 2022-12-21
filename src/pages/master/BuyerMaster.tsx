import { Delete, Refresh } from '@mui/icons-material';
import { Alert, Button, Slide, Snackbar, Table, TableCell, TableHead, TableRow } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import Buyer from '../../model/Buyer';
import { fetchAllBuyersFromApi } from '../../services/BuyerServices';
import Config from '../../util/config';
import BuyerMasterInput from './BuyerMasterInput';

const BuyerMaster: React.FC = () => {

    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [snackbarVisibility, setSnackbarVisibility] = useState<number>(0)
    const [buyers, setBuyers] = useState<Buyer[]>([])
    const auth = useAuth();

    const syncBuyers = useCallback(async () => {
        const fetchedBuyers = await fetchAllBuyersFromApi(auth)

        if (fetchedBuyers === null) {
            setSnackbarMessage('Something went wrong while trying to fetch the buyers')
            setSnackbarVisibility(1)
            return
        }

        setBuyers(fetchedBuyers)
    }, [auth])

    const deleteBuyer = async(buyerId: string) => {
        const requestOptions = {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.user?.jwt}`
            }),
            json: true
        }

        const response = await fetch(`${Config.DELETE_BUYER}/${buyerId}`, requestOptions).catch(e => {
            setSnackbarMessage('Something went wrong while trying to delete the buyer')
            setSnackbarVisibility(1)
            return
        })
        
        if (response == null || response?.status !== 200) {
            setSnackbarMessage('Something went wrong while trying to fetch the buyer')
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
            await syncBuyers()
        })()
    }, [syncBuyers])

    return (
        <>
            <BuyerMasterInput></BuyerMasterInput>
            <Button onClick={syncBuyers}><Refresh/>Sync</Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Buyer ID</TableCell>
                        <TableCell>Buyer name</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                {
                    buyers?.map((buyer: Buyer) => (
                        <TableRow>
                            <TableCell>{buyer.buyerId}</TableCell>
                            <TableCell>{buyer.buyerName}</TableCell>
                            <TableCell><Button onClick={()=>{deleteBuyer(buyer.buyerId)}}><Delete></Delete></Button></TableCell>
                        </TableRow>
                    ))
                }
            </Table>
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
        </>
    )

}

export default BuyerMaster;