import React from 'react';
import Config from '../../util/config';
import { useState } from 'react';
import { Alert, Button, Snackbar, Table, TableCell, TableHead, TableRow } from '@mui/material';
import { useAuth } from '../../util/auth';

const SupplierMaster: React.FC<React.ReactNode> = () => {

    const [errorMessage, setErrorMessage] = useState<String>('')
    const [errorVisibility, setErrorVisibility] = useState<boolean>(false)
    const [suppliers, setSuppliers] = useState<String[] | null>(null)
    const auth = useAuth();

    const fetchSupplier = async () => {
        const requestOptions = {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + auth?.user?.jwt
            }),
        };

        const response = await fetch(Config.GET_ALL_SUPPLIERS, requestOptions).catch(e => {
                setErrorMessage('Something went wrong while trying to fetch the suppliers')
                return
            })
        if (response?.status !== 200) {
            setErrorMessage('Something went wrong while trying to fetch the suppliers')
            return
        }
        
        const responseJsonStr = await response.text()
        const responseJson = await JSON.parse(responseJsonStr)
        const refreshedSuppliers: String[] = []
        responseJson.suppliers.map((supplier: { [x: string]: String; }) => {
            refreshedSuppliers.push(supplier['supplierName'])
            return null
        })
        setSuppliers(refreshedSuppliers)
    }

    return (
        <>
            <Button onClick={fetchSupplier}>Refresh</Button>
            <Table>
                <TableRow>
                    <TableHead>Supplier name</TableHead>
                </TableRow>
                {
                    suppliers?.map(inp => (
                        <TableRow>
                            <TableCell>{inp}</TableCell>
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