import { Add, Clear, Delete, Save } from "@mui/icons-material";
import { Alert, Autocomplete, Button, Grid, Paper, Slide, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import CollectionVoucher from "../../../model/Collection";
import { fetchAllBuyersFromApi } from "../../../services/BuyerServices";
import { fetchAllPendingBillNumbersFromApi } from "../../../services/CollectionServices";

const CollectionEntry: React.FC = () => {

    const auth = useAuth();
    const [buyers, setBuyers] = useState<String[]>([])

    const [snackbarVisibility, setSnackbarVisibility] = useState<number>(0)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')

    const [collectionVoucher, setCollectionVoucher] = useState<CollectionVoucher>({
        voucherNo: '0',
        voucherDate: (new Date()).toISOString().substring(0, 10),
        buyerName: ''
    })

    const [pendingBillNumbers, setPendingBillNumbers] = useState<string[]>()

    const handleBuyerNameChange = async (event: React.SyntheticEvent<Element, Event>, newValue: any) => {
        event.preventDefault()
        setCollectionVoucher({...collectionVoucher, buyerName: newValue})
        let fetchedPendingBillNumbers: string[] | null = await fetchAllPendingBillNumbersFromApi(auth, newValue)
        if (fetchedPendingBillNumbers != null) {
            setPendingBillNumbers(fetchedPendingBillNumbers)
        }
        setSnackbarMessage("buyerName Changed")
    }

    const handleVoucherChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setCollectionVoucher({ ...collectionVoucher, [e.target.name]: e.target.value });
    }

    function TransitionDown(props: any) {
        return <Slide {...props} direction="right" />;
    }

    useEffect(() => {

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
        
    }, [auth]);

    return <div>
        <Typography variant="h3" align="center">Collection Entry</Typography>
        <form>
            <Grid container spacing={3}>
                <Grid item md={6}>
                    <TextField name="voucherNo" label="Voucher number" size="small" value={collectionVoucher.voucherNo} onChange={handleVoucherChange} fullWidth></TextField>
                </Grid>
                <Grid item lg={6}>
                    <TextField name="voucherDate" type="date" defaultValue={(new Date()).toISOString().substring(0, 10)} label="Voucher Date" size="small" onChange={handleVoucherChange} fullWidth></TextField>
                </Grid>
                <Grid item md={6}>
                    <Autocomplete
                        disablePortal
                        id="buyerNameAutocomplete"
                        options={buyers}
                        sx={{ width: 300 }}
                        value={collectionVoucher.buyerName}
                        onChange={handleBuyerNameChange}
                        renderInput={(params) => <TextField {...params} name="buyerName" label="Buyer name" />}
                    />
                </Grid>

                <Grid item md={6}>
                    <table>
                        {
                            pendingBillNumbers && pendingBillNumbers.map((billNumber, i) => 
                                <tr>
                                    <td>{billNumber}</td>
                                </tr>
                            )
                        }
                    </table>
                </Grid>
                
                <Grid item lg={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ minWidth: 250 }} variant="head" align="center">LR</TableCell>
                                    <TableCell sx={{ minWidth: 250 }} variant="head" align="center">PM</TableCell>
                                    <TableCell sx={{ minWidth: 150 }} variant="head" align="center">Operations</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item lg={2}>
                    <Button onClick={() => {}}><Add></Add>Add row</Button>
                </Grid>
                <Grid item lg={2}>
                    <Button onClick={() => {}} variant="contained" type="button" fullWidth>
                        <Clear></Clear>
                        Clear
                    </Button>
                </Grid>
                <Grid item lg={2}>
                    <Button onClick={() => {}} variant="contained" className="bg-yellow-600" type="button" fullWidth>
                        <Save></Save>
                        Save
                    </Button>
                </Grid>
                <Grid item lg={2}>
                    <Button onClick={() => {}} variant="contained" className="bg-yellow-600" type="button" fullWidth>
                        <Delete></Delete>
                        Delete
                    </Button>
                </Grid>
            </Grid>
        </form>
        <Snackbar open={snackbarVisibility === 2} autoHideDuration={6000} onClose={() => setSnackbarVisibility(0)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} TransitionComponent={TransitionDown}>
            <Alert onClose={() => setSnackbarVisibility(0)} severity='success' sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
        <Snackbar open={snackbarVisibility === 1} autoHideDuration={6000} onClose={() => setSnackbarVisibility(0)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={() => setSnackbarVisibility(0)} severity='error' sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
    </div>
}

export default CollectionEntry;