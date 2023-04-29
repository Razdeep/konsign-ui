import { Add, Refresh } from "@mui/icons-material"
import { Alert, Button, ButtonGroup, Snackbar, Stack, TextField } from "@mui/material"
import React, { ChangeEvent, useState } from 'react'
import { useAuth } from "../../context/AuthProvider"
import Supplier from "../../model/Supplier"
import { addSupplierToApi } from "../../services/SupplierServices"

interface ParentProps {
    syncSuppliers: () => void
}

const SupplierMasterInput: React.FC<ParentProps> = ({ syncSuppliers }: any) => {

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
        addSupplierToApi(supplier, auth).then(data => {
            setSnackbarMessage(data?.message)
            setSnackbarVisibility(2)
        }).catch(err => {
            console.error(err)
            setSnackbarMessage('Failed to add supplier')
            setSnackbarVisibility(1)
        })        
    }

    return <>
        <Stack direction={'row'} spacing={2}>
            <TextField value={supplier.supplierId} type="text" name="supplierId" label="Supplier ID" size="small" onChange={handleSupplierMasterInputChange}></TextField>
            <TextField value={supplier.supplierName} type="text" name="supplierName" label="Supplier Name" size="small" onChange={handleSupplierMasterInputChange}></TextField>
            <ButtonGroup>
                <Button color={'success'} variant={'contained'} onClick={addSupplier} startIcon={<Add/>}>Add Supplier</Button>
                <Button color={'info'} variant={'contained'} onClick={syncSuppliers} startIcon={<Refresh/>}>Sync</Button>
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

export default SupplierMasterInput;