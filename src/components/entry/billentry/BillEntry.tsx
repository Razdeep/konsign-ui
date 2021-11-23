import { Delete, Edit, Label, Save, Send } from '@mui/icons-material';
import { Button, Grid, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React from 'react'

function BillEntry() {

    const rows = [
        1, 2, 3
    ];
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
                                            <TableCell>Sample LR</TableCell>
                                            <TableCell align="right">Sample PM</TableCell>
                                            <TableCell align="right">
                                                <Edit></Edit>
                                                <Delete></Delete>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item lg={6}>
                        <TextField label="Amount" size="small"></TextField>
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
