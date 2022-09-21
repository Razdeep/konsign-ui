import { Delete, Refresh } from '@mui/icons-material';
import { Alert, Button, Slide, Snackbar, Table, TableCell, TableHead, TableRow } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import Supplier from '../../model/Supplier';
import { fetchAllSuppliersFromApi } from '../../services/SupplierServices';
import Config from '../../util/config';
import SupplierMasterInput from './SupplierMasterInput';

const SupplierMaster: React.FC<React.ReactNode> = () => {

    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [snackbarVisibility, setSnackbarVisibility] = useState<number>(0)
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const auth = useAuth();

    const syncSuppliers = useCallback(async () => {
        const fetchedSuppliers = await fetchAllSuppliersFromApi(auth)

        if (fetchedSuppliers === null) {
            setSnackbarMessage('Something went wrong while trying to fetch the suppliers')
            setSnackbarVisibility(1)
            return
        }

        setSuppliers(fetchedSuppliers)
    }, [auth])

    const deleteSupplier = async(supplierId: string) => {
        const requestOptions = {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth?.user?.jwt
            }),
            json: true
        }

        const response = await fetch(Config.DELETE_SUPPLIER + "/" + supplierId, requestOptions).catch(e => {
            setSnackbarMessage('Something went wrong while trying to delete the suppliers')
            setSnackbarVisibility(1)
            return
        })
        
        if (response == null || response?.status !== 200) {
            setSnackbarMessage('Something went wrong while trying to fetch the suppliers')
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
            await syncSuppliers()
        })()
    }, [syncSuppliers])

    return (
        <>
            <SupplierMasterInput></SupplierMasterInput>
            <Button onClick={syncSuppliers}><Refresh/>Sync</Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Supplier ID</TableCell>
                        <TableCell>Supplier name</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                {
                    suppliers?.map((supplier: Supplier) => (
                        <TableRow>
                            <TableCell>{supplier.supplierId}</TableCell>
                            <TableCell>{supplier.supplierName}</TableCell>
                            <TableCell><Button onClick={()=>{deleteSupplier(supplier.supplierId)}}><Delete></Delete></Button></TableCell>
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

export default SupplierMaster;