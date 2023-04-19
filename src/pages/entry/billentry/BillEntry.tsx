import { Add, Clear, CurrencyRupeeSharp, Delete, Done, Edit, Save } from '@mui/icons-material';
import { Alert, Autocomplete, Box, Button, ButtonGroup, FilledInput, FormControl, Grid, InputAdornment, InputLabel, Paper, Slide, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import LrPm from '../../../model/LrPm';
import React, { ChangeEvent, useState, useEffect } from 'react'
import Bill from '../../../model/Bill';
import Config from '../../../util/config';
import { useAuth } from '../../../context/AuthProvider';
import { fetchAllSuppliersFromApi } from '../../../services/SupplierServices';
import { fetchAllBuyersFromApi } from '../../../services/BuyerServices';
import { fetchAllTransportsFromApi } from '../../../services/TransportServices';
import { deleteBillFromApi, fetchBillFromApi } from '../../../services/BillServices';

const BillEntry: React.FC = () => {

    const auth = useAuth();

    const [bill, setBill] = useState<Bill>({
        supplierName: '',
        buyerName: '',
        billNo: '',
        billDate: (new Date()).toISOString().substring(0, 10),
        transportName: '',
        lrDate: (new Date()).toISOString().substring(0, 10),
        lrPmList: [],
        billAmount: 0
    });

    const [lrPmList, setLrPmList] = useState<LrPm[]>([]);
    const [idxAtEditMode, setIdxAtEditMode] = useState<Number>(-1);
    const [currentLrPm, setCurrentLrPm] = useState<LrPm>({
        lr: '',
        pm: ''
    });
    
    const [snackbarVisibility, setSnackbarVisibility] = useState<number>(0)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')

    const addRow = () => {
        let lrpm = new LrPm()
        setLrPmList([...lrPmList, lrpm]);
    }

    const deleteRow = (i: Number) => {
        let newLrPmList = lrPmList.filter((x, j) => j !== i);
        setLrPmList([]);
        setLrPmList(newLrPmList);
        bill.lrPmList = lrPmList;
        setBill(bill);
    }

    const updateLrRow = (targetIndex: Number) => {
        setIdxAtEditMode(-1)
        lrPmList.map((x, i) => {
            if (i === targetIndex) {
                x.lr = currentLrPm.lr;
                x.pm = currentLrPm.pm;
            }
            return x;
        })
        setLrPmList(lrPmList);
        bill.lrPmList = lrPmList;
        setBill(bill);
    }

    const startEditingLrPmRow = (targetIndex: number) => {
        setIdxAtEditMode(targetIndex);
        currentLrPm.lr = lrPmList[targetIndex].lr;
        currentLrPm.pm = lrPmList[targetIndex].pm;
        setCurrentLrPm(currentLrPm);
    }

    const handleBillChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        if (e.target.name === 'billAmount') {
            setBill({ ...bill, [e.target.name]: e.target.value === '' ? 0 : parseInt(e.target.value) });
            return
        }
        setBill({ ...bill, [e.target.name]: e.target.value });

        if (e.target.name === 'billNo') {
            await getBill(e.target.value)
        }
    }

    const getBill = async (billNo: String) => {
        try {
            const responseBill: Bill | undefined = await fetchBillFromApi(auth, billNo)
            if (responseBill !== undefined) {
                setBill(responseBill)
                setLrPmList(responseBill.lrPmList)
                const message = `Autofilled values for ${billNo} as it already exists in database`;
                setSnackbarMessage(message)
                setSnackbarVisibility(2)
            }
        } catch (e) {
            console.error(e)
            if (e instanceof Error) {
                setSnackbarMessage(e.message)
            } else {
                setSnackbarMessage('Error while getting bill')
            }
            setSnackbarVisibility(1)
        }
    }

    const deleteBill = async () => {
        const response = await deleteBillFromApi(auth, bill.billNo)
        if (response === null || response === undefined) {
            setSnackbarMessage('Could not delete bill. Please try again')
            setSnackbarVisibility(1)
            return
        }

        const responseMessage = (await response?.json()).message
        
        if (response.status === 200) {
            setSnackbarMessage(responseMessage ?? `Successfully deleted bill ${bill.billNo}`)
            setSnackbarVisibility(2)
        } else {
            setSnackbarMessage(responseMessage ?? `Could not delete bill ${bill.billNo}`)
            setSnackbarVisibility(1)
        }
    }

    const handleSupplierNameChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
        event.preventDefault()
        setBill({...bill, supplierName: newValue})
    }

    const handleBuyerNameChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
        event.preventDefault()
        setBill({...bill, buyerName: newValue})
    }

    const handleTransportNameChange = (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
        event.preventDefault()
        setBill({...bill, transportName: newValue})
    }

    const handleLrPmChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setCurrentLrPm({...currentLrPm, [e.target.name]: e.target.value});
    }

    const submitBill = async () => {
        const serializedData = JSON.stringify(bill);
        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.user?.jwt}`
            }),
            body: serializedData,
            json: true
        };
        const response: Response | void = await fetch(Config.BILL_ENTRY_URL, requestOptions)
                                                    .catch(e => {
                                                        console.log(e);
                                                        setSnackbarMessage('Error while fetching response')
                                                        setSnackbarVisibility(1)
                                                        return
                                                    })
        
        if (!response) {
            setSnackbarMessage('No response found')
            setSnackbarVisibility(1)
            return
        }

        if (response.status === 200) {
            const responseJson = await response.json()
            const message = responseJson.message;
            setSnackbarMessage(message)
            setSnackbarVisibility(2)
            return
        }
    }

    const clearBill = () => {
        setBill({
            supplierName: '',
            buyerName: '',
            billNo: '',
            billDate: (new Date()).toISOString().substring(0, 10),
            transportName: '',
            lrDate: (new Date()).toISOString().substring(0, 10),
            lrPmList: [],
            billAmount: 0
        })
    }

    function TransitionDown(props: any) {
        return <Slide {...props} direction="right" />;
    }

    useEffect(() => {
        console.log(currentLrPm);
        const fetchSuppliersWrapperFunc = async () => {
            return await fetchAllSuppliersFromApi(auth)
        }
        const fetchedSuppliersPromise = fetchSuppliersWrapperFunc()
        if (fetchedSuppliersPromise === null) {
            return
        }
        fetchedSuppliersPromise.then(fetchedSuppliers => {
            if (fetchedSuppliers == null) return
            const suppliernames = fetchedSuppliers.map(fetchedSupplier => fetchedSupplier.supplierName)
            setSuppliers(suppliernames)
        })

        const fetchBuyersWrapperFunc = async () => {
            return await fetchAllBuyersFromApi(auth)
        }

        const fetchedBuyersPromise = fetchBuyersWrapperFunc()
        if (fetchedBuyersPromise === null) {
            return
        }
        fetchedBuyersPromise.then(fetchedBuyers => {
            if (fetchedBuyers == null) return
            const buyernames = fetchedBuyers.map(fetchedBuyer => fetchedBuyer.buyerName)
            setBuyers(buyernames)
        })

        const fetchTransportsWrapperFunc = async () => {
            return await fetchAllTransportsFromApi(auth)
        }

        const fetchedTransportsPromise = fetchTransportsWrapperFunc()
        if (fetchedTransportsPromise === null) {
            return
        }
        fetchedTransportsPromise.then(fetchedTransports => {
            if (fetchedTransports == null) return
            const transportNames = fetchedTransports.map(fetchedTransport => fetchedTransport.transportName)
            setTransports(transportNames)
        })
        
    }, [currentLrPm, auth]);

    const [suppliers, setSuppliers] = useState<String[]>([])
    const [buyers, setBuyers] = useState<String[]>([])
    const [transports, setTransports] = useState<String[]>([])

    return (
        <Box>
            <Typography variant="h3" align="center">Input Entry</Typography>
            <FormControl>
                <Grid container spacing={3}>
                    <Grid item md={6}>
                        <TextField name="billNo" label="Bill Number" size="small" value={bill.billNo} onChange={handleBillChange} fullWidth></TextField>
                    </Grid>
                    <Grid item lg={6}>
                        <TextField name="billDate" type="date" value={bill.billDate} defaultValue={(new Date()).toISOString().substring(0, 10)} label="Bill Date" size="small" onChange={handleBillChange} fullWidth></TextField>
                    </Grid>
                    <Grid item md={6}>
                        <Autocomplete
                            disablePortal
                            id="supplierNameAutocomplete"
                            options={suppliers}
                            sx={{ width: 300 }}
                            value={bill.supplierName}
                            onChange={handleSupplierNameChange}
                            renderInput={(params) => <TextField {...params} name="supplierName" label="Supplier name" />}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <Autocomplete
                            disablePortal
                            id="buyerNameAutocomplete"
                            options={buyers}
                            sx={{ width: 300 }}
                            value={bill.buyerName}
                            onChange={handleBuyerNameChange}
                            renderInput={(params) => <TextField {...params} name="buyerName" label="Buyer name" />}
                        />
                    </Grid>
                    <Grid item lg={6}>
                        <Autocomplete
                            disablePortal
                            id="transportNameAutocomplete"
                            options={transports}
                            sx={{ width: 300 }}
                            value={bill.transportName}
                            onChange={handleTransportNameChange}
                            renderInput={(params) => <TextField {...params} name="transportName" label="Transport name" />}
                        />
                    </Grid>
                    <Grid item lg={6}>
                        <TextField name="lrDate" type="date" value={bill.lrDate} onChange={handleBillChange} defaultValue={(new Date()).toISOString().substring(0, 10)} label="LR Date" size="small" fullWidth></TextField>
                    </Grid>
                    <Grid item lg={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ minWidth: 250}} variant="head" align="center">LR</TableCell>
                                        <TableCell sx={{ minWidth: 250}} variant="head" align="center">PM</TableCell>
                                        <TableCell sx={{ minWidth: 150}} variant="head" align="center">Operations</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lrPmList.map((row, i) => (
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{idxAtEditMode === i ? <TextField sx={{width: 80}} name="lr" value={currentLrPm.lr} onChange={handleLrPmChange} variant="standard" size="small"></TextField> : row.lr}</TableCell>
                                            <TableCell align="center">{idxAtEditMode === i ? <TextField sx={{width: 80}} name="pm" value={currentLrPm.pm} variant="standard" onChange={handleLrPmChange} size="small"></TextField> : row.pm}</TableCell>
                                            <TableCell align="center">
                                                <ButtonGroup>
                                                    {idxAtEditMode === i ? <Button onClick={() => updateLrRow(i)}><Done></Done></Button> :
                                                        <Button onClick={() => startEditingLrPmRow(i)}><Edit></Edit></Button>}
                                                    <Button onClick={() => deleteRow(i)}><Delete></Delete></Button>
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item lg={4}>
                        <FilledInput name="billAmount" value={bill.billAmount} onChange={handleBillChange} size="small"
                            startAdornment={<InputAdornment position='start'><CurrencyRupeeSharp fontSize='small' /></InputAdornment>}
                            inputProps={{ min: 0, style: { textAlign: 'right' } }}
                        ></FilledInput>
                    </Grid>
                    <Grid item lg={2}>
                        <Button onClick={addRow} startIcon={<Add/>}>Add row</Button>
                    </Grid>
                    <Grid item lg={6}>
                        <ButtonGroup size='large'>
                            <Button onClick={clearBill} variant="contained" type="button" fullWidth startIcon={<Clear/>}>
                                Clear
                            </Button>
                            <Button onClick={submitBill} variant="contained" type="button" color="success" fullWidth startIcon={<Save/>}>
                                Save
                            </Button>
                            <Button onClick={(e) => deleteBill()} variant="contained" type="button" color="error" fullWidth startIcon={<Delete/>}>
                                Delete
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </FormControl>
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
        </Box>
    )
}

export default BillEntry
