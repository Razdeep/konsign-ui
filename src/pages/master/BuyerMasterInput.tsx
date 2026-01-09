import { Add, Refresh } from "@mui/icons-material"
import { Alert, Button, ButtonGroup, FormControl, Snackbar, Stack, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react"
import Buyer from "../../model/Buyer"
import { useAuth } from "../../context/AuthProvider"
import Config from "../../util/config"
import React from 'react';
import { addBuyer } from "../../services/BuyerServices"

interface ParentProps {
    syncBuyers: () => void
}

const BuyerMasterInput: React.FC<ParentProps> = ({ syncBuyers }: any) => {

    const auth = useAuth()
    const [buyer, setBuyer] = useState<Buyer>({
        buyerId: '',
        buyerName: ''
    })

    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [snackbarVisibility, setSnackbarVisibility] = useState<number>(0)

    const handleBuyerMasterInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setBuyer({ ...buyer, [e.target.name]: e.target.value })
    }

    

    return <>
        <Stack direction={'row'} spacing={2}>
            <TextField value={buyer.buyerId} type="text" name="buyerId" label="Buyer ID" size="small" onChange={handleBuyerMasterInputChange}></TextField>
            <TextField value={buyer.buyerName} type="text" name="buyerName" label="Buyer Name" size="small" onChange={handleBuyerMasterInputChange}></TextField>
            <ButtonGroup>
                <Button color={'success'} variant={'contained'} onClick={() => addBuyer(buyer, auth, setSnackbarMessage, setSnackbarVisibility)} startIcon={<Add/>}>Add Buyer</Button>
                <Button color={'info'} variant={'contained'} onClick={syncBuyers} startIcon={<Refresh/>}>Sync</Button>
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

export default BuyerMasterInput;