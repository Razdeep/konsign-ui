import { Add, Delete, Done, Edit, Save } from '@mui/icons-material';
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import LrPm from '../../../model/LrPm';
import React, { ChangeEvent, useState, useEffect } from 'react'
import Bill from '../../../model/Bill';

function BillEntry() {

    const [bill, setBill] = useState<Bill>({
        supplierName: '',
        buyerName: '',
        billNo: '',
        billDate: '',
        transport: '',
        lrDate: '',
        lrPm: [],
        billAmount: ''
    });

    const [lrPmList, setLrPmList] = useState<LrPm[]>([]);
    const [idxAtEditMode, setIdxAtEditMode] = useState<Number>(-1);
    const [currentLrPm, setCurrentLrPm] = useState<LrPm>({
        lr: '',
        pm: ''
    });

    const addRow = () => {
        let lrpm = new LrPm()
        setLrPmList([...lrPmList, lrpm]);
    }

    const deleteRow = (i: Number) => {
        setLrPmList(lrPmList.filter((x, j) => j !== i))
    }

    const updateLrRow = (targetIndex: Number) => {
        setIdxAtEditMode(-1)
        const newRows: LrPm[] = [];
        lrPmList.map((x, i) => {
            if (i === targetIndex) {
                x.lr = currentLrPm.lr;
                x.pm = currentLrPm.pm;
            }
            newRows.push(x);
        })
        setLrPmList(newRows)
    }

    const handleBillChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setBill({ ...bill, [e.target.name]: e.target.value });
    }

    const handleLrPmChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setCurrentLrPm({...currentLrPm, [e.target.name]: e.target.value});
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
                                        <TableCell>LR</TableCell>
                                        <TableCell align="right">PM</TableCell>
                                        <TableCell align="right">Operations</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lrPmList.map((row, i) => (
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{idxAtEditMode === i ? <TextField name="lr" onChange={handleLrPmChange} variant="standard" size="small"></TextField> : row.lr}</TableCell>
                                            <TableCell align="right">{idxAtEditMode === i ? <TextField name="pm" variant="standard" onChange={handleLrPmChange} size="small"></TextField> : row.pm}</TableCell>
                                            <TableCell align="right">
                                                {idxAtEditMode === i ? <Button onClick={() => updateLrRow(i)}><Done></Done></Button> :
                                                    <Button onClick={() => setIdxAtEditMode(i)}><Edit></Edit></Button>}
                                                <Button><Delete onClick={() => deleteRow(i)}></Delete></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item lg={4}>
                        <TextField name="amount" label="Amount" onChange={handleBillChange} size="small"></TextField>
                    </Grid>
                    <Grid item lg={2}>
                        <Button onClick={addRow}><Add></Add>Add row</Button>
                    </Grid>
                    <Grid item lg={6}>
                        <Button variant="contained" type="submit" fullWidth>
                            <Save></Save>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default BillEntry
