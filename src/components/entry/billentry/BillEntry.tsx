import { Add, Delete, Done, Edit, Save } from '@mui/icons-material';
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import LrPm from '../../../model/LrPm';
import React, { useState } from 'react'

function BillEntry() {

    const [rows, setRows] = useState<LrPm[]>([]);
    const [idxAtEditMode, setIdxAtEditMode] = useState<Number>(-1);

    const addRow = () => {
        let lrpm = new LrPm()
        setRows([...rows, lrpm]);
    }

    const deleteRow = (i: Number) => {
        setRows(rows.filter((x, j) => j !== i))
    }

    return (
        <div>
            <Typography variant="h3" align="center">Input Entry</Typography>
            <form>
                <Grid container spacing={3}>
                    <Grid item md={6}>
                        <TextField label="Supplier Name" size="small" fullWidth></TextField>
                    </Grid>
                    <Grid item md={6}>
                        <TextField label="Buyer Name" size="small" fullWidth></TextField>
                    </Grid>
                    <Grid item md={6}>
                        <TextField label="Bill Number" size="small" fullWidth></TextField>
                    </Grid>
                    <Grid item lg={6}>
                        <TextField type="date" defaultValue={(new Date()).toISOString().substring(0, 10)} label="Bill Date" size="small" fullWidth></TextField>
                    </Grid>
                    <Grid item lg={6}>
                        <TextField label="Transport" size="small" fullWidth></TextField>
                    </Grid>
                    <Grid item lg={6}>
                        <TextField type="date" defaultValue={(new Date()).toISOString().substring(0, 10)} label="LR Date" size="small" fullWidth></TextField>
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
                                    {rows.map((row, i) => (
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{idxAtEditMode === i ? <TextField variant="standard" size="small"></TextField> : row.lr}</TableCell>
                                            <TableCell align="right">{idxAtEditMode === i ? <TextField variant="standard" size="small"></TextField> : row.pm}</TableCell>
                                            <TableCell align="right">
                                                {idxAtEditMode === i ? <Button onClick={() => setIdxAtEditMode(-1)}><Done></Done></Button> :
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
                        <TextField label="Amount" size="small"></TextField>
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
