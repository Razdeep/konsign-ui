import { Add } from "@mui/icons-material"
import { Alert, Button, FormControl, Snackbar, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react"
import Supplier from "../../model/Supplier"
import { useAuth } from "../../context/AuthProvider"
import Config from "../../util/config"
import React from 'react';

const SupplierMasterInput: React.FC = () => {

    const auth = useAuth()
    const [supplier, setSupplier] = useState<Supplier>({
        supplierId: '',
        supplierName: ''
    })

    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [snackbarVisibility, setSnackbarVisibility] = useState<number>(0)

    const handleSupplierMasterInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setSupplier({ ...supplier, [e.target.name]: e.target.value })
    }

    const addSupplier = async () => {
        const serializedData = JSON.stringify(supplier);
        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.user?.jwt}`
            }),
            body: serializedData,
            json: true
        }

        const response = await fetch(Config.ADD_SUPPLIER, requestOptions)

        if (response.status !== 200) {
            setSnackbarMessage('Failed to add supplier')
            setSnackbarVisibility(1)
            return
        }

        setSnackbarMessage((await response?.json())?.message)
        setSnackbarVisibility(2)
    }

    return <>
        <FormControl>
            <TextField value={supplier.supplierId} type="text" name="supplierId" label="Supplier ID" size="small" onChange={handleSupplierMasterInputChange}></TextField>
            <TextField value={supplier.supplierName} type="text" name="supplierName" label="Supplier Name" size="small" onChange={handleSupplierMasterInputChange}></TextField>
        </FormControl>
        <Button onClick={addSupplier}><Add></Add>Add Supplier</Button>
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

export default SupplierMasterInput;