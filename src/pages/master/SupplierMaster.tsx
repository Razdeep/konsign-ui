import React from 'react';
import Config from '../../util/config';
import { useState } from 'react';
import { Alert, Button, Snackbar, Table, TableCell, TableHead, TableRow } from '@mui/material';
import { useAuth } from '../../util/auth';
import { Refresh } from '@mui/icons-material';

const SupplierMaster: React.FC<React.ReactNode> = () => {

    class Supplier {
        supplierId: string = '';
        supplierName: string = '';
    }

    interface Master {
        suppliers: Supplier[];
    }

    const [errorMessage, setErrorMessage] = useState<String>('')
    const [errorVisibility, setErrorVisibility] = useState<boolean>(false)
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const auth = useAuth();

    const fetchSupplier = async () => {
        const requestOptions = {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth?.user?.jwt
            }),
            json: true
        };

        const response = await fetch(Config.GET_ALL_SUPPLIERS, requestOptions).catch(e => {
            setErrorMessage('Something went wrong while trying to fetch the suppliers')
            return
        })

        if (response == null || response?.status !== 200) {
            setErrorMessage('Something went wrong while trying to fetch the suppliers')
            return
        }
        
        const master: Master = JSON.parse(await response?.text())
        setSuppliers(master?.suppliers)
    }

    return (
        <>
            <Button onClick={fetchSupplier}><Refresh/>Refresh</Button>
            <Table>
                <TableHead>
                    <TableCell>Supplier ID</TableCell>
                    <TableCell>Supplier name</TableCell>
                </TableHead>
                {
                    suppliers?.map((supplier: Supplier) => (
                        <TableRow>
                            <TableCell>{supplier.supplierId}</TableCell>
                            <TableCell>{supplier.supplierName}</TableCell>
                        </TableRow>
                    ))
                }
            </Table>
            <Snackbar open={errorVisibility} autoHideDuration={6000} onClose={ ()=>setErrorVisibility(false) }
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={()=>setErrorVisibility(false)} severity='error' sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    )

}

export default SupplierMaster;