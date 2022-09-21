import { Add } from "@mui/icons-material"
import { Alert, Button, FormControl, Snackbar, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react"
import Buyer from "../../model/Buyer"
import { useAuth } from "../../context/AuthProvider"
import Config from "../../util/config"
import React from 'react';

const BuyerMasterInput: React.FC<React.ReactNode> = () => {

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

    const addBuyer = async () => {
        const serializedData = JSON.stringify(buyer);
        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.user?.jwt}`
            }),
            body: serializedData,
            json: true
        }

        const response = await fetch(Config.ADD_BUYER, requestOptions)

        if (response.status !== 200) {
            setSnackbarMessage('Failed to add buyer')
            setSnackbarVisibility(1)
            return
        }

        setSnackbarMessage((await response?.json())?.message)
        setSnackbarVisibility(2)
    }

    return <>
        <FormControl>
            <TextField value={buyer.buyerId} type="text" name="buyerId" label="Buyer ID" size="small" onChange={handleBuyerMasterInputChange}></TextField>
            <TextField value={buyer.buyerName} type="text" name="buyerName" label="Buyer Name" size="small" onChange={handleBuyerMasterInputChange}></TextField>
        </FormControl>
        <Button onClick={addBuyer}><Add></Add>Add Buyer</Button>
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