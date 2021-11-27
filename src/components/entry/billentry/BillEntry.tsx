import { Add, Delete, Done, Edit, Save } from '@mui/icons-material';
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

function BillEntry() {

    const [isInEditMode, setIsInEditMode] = useState(false);
    const [rows, setRows] = useState<Number[]>([]);

    const toggleEditTable = () => {
        setIsInEditMode(!isInEditMode)
    }

    const addRow = () => {
        setRows([...rows, 4]);
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
                        <TextField type="date" label="Bill Date" size="small" fullWidth></TextField>
                    </Grid>
                    <Grid item lg={6}>
                        <TextField label="Transport" size="small" fullWidth></TextField>
                    </Grid>
                    <Grid item lg={6}>
                        <TextField type="date" label="LR Date" size="small" fullWidth></TextField>
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
                                    {rows.map((row) => (
                                        <TableRow
                                            // key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{isInEditMode ? <TextField size="small"></TextField> : <Typography></Typography>}</TableCell>
                                            <TableCell align="right">{isInEditMode ? <TextField size="small"></TextField> : <Typography></Typography>}</TableCell>
                                            <TableCell align="right">
                                                <Button onClick={toggleEditTable}>{isInEditMode ? <Done></Done> : <Edit></Edit>}</Button>
                                                <Button><Delete></Delete></Button>
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
