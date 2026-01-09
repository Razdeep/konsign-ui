import { Delete, Edit } from '@mui/icons-material';
import { Alert, Box, Button, ButtonGroup, Slide, Snackbar, Stack, Table, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { KonsignSpinner } from '../../components/KonsignSpinner';
import { useAuth } from '../../context/AuthProvider';
import ResponseVerdict from '../../model/ResponseVerdict';
import Supplier from '../../model/Supplier';
import { deleteSupplierFromApi, fetchAllSuppliersFromApi } from '../../services/SupplierServices';
import SupplierMasterInput from './SupplierMasterInput';

const SupplierMaster: React.FC = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')
    const [snackbarVisibility, setSnackbarVisibility] = useState<number>(0)
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const auth = useAuth();

    const syncSuppliers = useCallback(async () => {
        setIsLoading(true)
        const fetchedSuppliers = await fetchAllSuppliersFromApi(auth)

        if (fetchedSuppliers === null) {
            setSnackbarMessage('Something went wrong while trying to fetch the suppliers')
            setSnackbarVisibility(1)
            return
        }

        setSuppliers(fetchedSuppliers)
        setIsLoading(false)
    }, [auth])

    const deleteSupplier = async(supplierId: string) => {
        deleteSupplierFromApi(supplierId, auth).then((response: ResponseVerdict) => {
            setSnackbarMessage(response.message)
            setSnackbarVisibility(2)
        }).catch((err: Error) => {
            setSnackbarMessage('Something went wrong while trying to fetch the suppliers')
            setSnackbarVisibility(1)
        })
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
        <Stack spacing={2}>
            <SupplierMasterInput syncSuppliers={syncSuppliers}></SupplierMasterInput>
            {isLoading ?
                <Box justifyContent="center" alignItems="center" sx={{display: 'flex'}}>
                    <KonsignSpinner />
                </Box> :
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Supplier ID</TableCell>
                            <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Supplier name</TableCell>
                            <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    {
                        suppliers?.map((supplier: Supplier) => (
                            <TableRow>
                                <TableCell>{supplier.supplierId}</TableCell>
                                <TableCell>{supplier.supplierName}</TableCell>
                                <TableCell>
                                    <ButtonGroup>
                                        <Button><Edit></Edit></Button>
                                        <Button color={'error'} onClick={() => { deleteSupplier(supplier.supplierId) }}><Delete></Delete></Button>
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

export default SupplierMaster;