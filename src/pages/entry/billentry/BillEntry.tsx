import { Add, Delete, Done, Edit, Save } from '@mui/icons-material';
import { Alert, Button, Grid, Paper, Slide, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import LrPm from '../../../model/LrPm';
import React, { ChangeEvent, useState, useEffect } from 'react'
import Bill from '../../../model/Bill';
import Config from '../../../util/config';
import { useAuth } from '../../../util/auth';

const BillEntry: React.FC<React.ReactNode> = () => {

    const auth = useAuth();

    const [bill, setBill] = useState<Bill>({
        supplierName: '',
        buyerName: '',
        billNo: '',
        billDate: (new Date()).toISOString().substring(0, 10),
        transport: '',
        lrDate: (new Date()).toISOString().substring(0, 10),
        lrPm: [],
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
        bill.lrPm = lrPmList;
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
        bill.lrPm = lrPmList;
        setBill(bill);
    }

    const startEditingLrPmRow = (targetIndex: number) => {
        setIdxAtEditMode(targetIndex);
        currentLrPm.lr = lrPmList[targetIndex].lr;
        currentLrPm.pm = lrPmList[targetIndex].pm;
        setCurrentLrPm(currentLrPm);
    }

    const handleBillChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        if (e.target.name === 'billAmount') {
            setBill({ ...bill, [e.target.name]: parseInt(e.target.value) });
            return
        }
        setBill({ ...bill, [e.target.name]: e.target.value });
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
                'Authorization': 'Bearer ' + auth?.user?.jwt
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

    function TransitionDown(props: any) {
        return <Slide {...props} direction="right" />;
    }

    useEffect(() => {
        console.log(currentLrPm);
    }, [currentLrPm]);

    return (
        <div>
            <Typography variant="h3" align="center">Input Entry</Typography>
            <form>
                <Grid container spacing={3}>
                    <Grid item md={6}>
                        <TextField name="supplierName" label="Supplier Name" size="small" onChange={handleBillChange} fullWidth></TextField>
                    </Grid>
                    <Grid item md={6}>
                        <TextField name="buyerName" label="Buyer Name" size="small" onChange={handleBillChange} fullWidth></TextField>
                    </Grid>
                    <Grid item md={6}>
                        <TextField name="billNo" label="Bill Number" size="small" onChange={handleBillChange} fullWidth></TextField>
                    </Grid>
                    <Grid item lg={6}>
                        <TextField name="billDate" type="date" defaultValue={(new Date()).toISOString().substring(0, 10)} label="Bill Date" size="small" onChange={handleBillChange} fullWidth></TextField>
                    </Grid>
                    <Grid item lg={6}>
                        <TextField name="transport" label="Transport" size="small" onChange={handleBillChange} fullWidth></TextField>
                    </Grid>
                    <Grid item lg={6}>
                        <TextField name="lrDate" type="date" onChange={handleBillChange} defaultValue={(new Date()).toISOString().substring(0, 10)} label="LR Date" size="small" fullWidth></TextField>
                    </Grid>
                    <Grid item lg={12}>
                        {/* <TextField type="date" label="LR Date" size="small" fullWidth></TextField> */}
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
                                            <TableCell>{idxAtEditMode === i ? <TextField name="lr" value={currentLrPm.lr} onChange={handleLrPmChange} variant="standard" size="small"></TextField> : row.lr}</TableCell>
                                            <TableCell align="right">{idxAtEditMode === i ? <TextField name="pm" value={currentLrPm.pm} variant="standard" onChange={handleLrPmChange} size="small"></TextField> : row.pm}</TableCell>
                                            <TableCell align="right">
                                                {idxAtEditMode === i ? <Button onClick={() => updateLrRow(i)}><Done></Done></Button> :
                                                    <Button onClick={() => startEditingLrPmRow(i)}><Edit></Edit></Button>}
                                                <Button onClick={() => deleteRow(i)}><Delete></Delete></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item lg={4}>
                        <TextField name="billAmount" type="number" label="Amount" onChange={handleBillChange} size="small"></TextField>
                    </Grid>
                    <Grid item lg={2}>
                        <Button onClick={addRow}><Add></Add>Add row</Button>
                    </Grid>
                    <Grid item lg={6}>
                        <Button onClick={submitBill} variant="contained" className="bg-yellow-600" type="button" fullWidth>
                            <Save></Save>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </form>
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
        </div>
    )
}

export default BillEntry
