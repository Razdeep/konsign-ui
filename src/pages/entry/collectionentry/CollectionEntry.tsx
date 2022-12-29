import { Add, Clear, Delete, Done, Edit, Save } from "@mui/icons-material";
import { Alert, Autocomplete, Button, Grid, Paper, Slide, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import CollectionVoucher from "../../../model/CollectionVoucher";
import { fetchAllBuyersFromApi } from "../../../services/BuyerServices";
import { deleteCollectionFromApi, fetchAllPendingBillNumbersFromApi, fetchCollectionVoucherFromApi, submitCollectionToApi } from "../../../services/CollectionServices";
import { fetchBillFromApi } from "../../../services/BillServices";
import Bill from "../../../model/Bill";
import PendingBill from "../../../model/PendingBill";
import { PresentableCollectionVoucherItem } from "../../../model/PresentableVoucherItem";

const CollectionEntry: React.FC = () => {

    const auth = useAuth();
    const [buyers, setBuyers] = useState<String[]>([])

    const [snackbarVisibility, setSnackbarVisibility] = useState<number>(0)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')

    const [collectionVoucher, setCollectionVoucher] = useState<CollectionVoucher>({
        voucherNo: '0',
        voucherDate: (new Date()).toISOString().substring(0, 10),
        buyerName: '',
        collectionVoucherItemList: []
    })

    const [collectionVoucherItemList, setCollectionVoucherItemList] = useState<PresentableCollectionVoucherItem[]>([])

    const [idxAtEditMode, setIdxAtEditMode] = useState<number>(-1)

    const [curCollectionVoucherItem, setCurCollectionVoucherItem] = useState<PresentableCollectionVoucherItem>(
        new PresentableCollectionVoucherItem()
    )

    const [pendingBills, setPendingBills] = useState<PendingBill[]>()
    const [pendingBillNos, setPendingBillNos] = useState<string[]>([])

    const handleBuyerNameChange = async (event: React.SyntheticEvent<Element, Event>, newValue: String | null) => {
        event.preventDefault()
        const newBuyerNameValue = newValue?.toString() ?? ''
        setCollectionVoucher({...collectionVoucher, buyerName: newBuyerNameValue})
        let fetchedPendingBills: PendingBill[] | null = await fetchAllPendingBillNumbersFromApi(auth, newBuyerNameValue)
        if (fetchedPendingBills != null) {
            setPendingBills(fetchedPendingBills)
            const newPendingBillNos = fetchedPendingBills.map(pendingBill => pendingBill.billNo)
            setPendingBillNos(newPendingBillNos)
        }
    }

    const handleBillNoChange = (selectedBillNo: string, selectedIndex: number) => {
        let targetSupplierName = '---'
        let targetBillAmount = 0
        let targetPendingAmount = 0

        if (pendingBills === null || pendingBills === undefined) return

        pendingBills.forEach((pendingBill: PendingBill, idx: number) => {
            if (pendingBill.billNo === selectedBillNo) {
                targetSupplierName = pendingBill.supplierName
                targetBillAmount = pendingBill.billAmount
                targetPendingAmount = pendingBill.pendingAmount
            }
        })

        const newCollectionVoucherItemList = collectionVoucherItemList.map((collectionVoucherItem: PresentableCollectionVoucherItem, idx) => {
            return idx === selectedIndex ?
                {
                    ...collectionVoucherItem,
                    billNo: selectedBillNo,
                    supplierName: targetSupplierName,
                    billAmount: targetBillAmount,
                    pendingAmount: targetPendingAmount
                } : {...collectionVoucherItem}
        })

        setCurCollectionVoucherItem({
            ...curCollectionVoucherItem,
            billNo: selectedBillNo,
            supplierName: targetSupplierName,
            billAmount: targetBillAmount,
            pendingAmount: targetPendingAmount
        })

        setCollectionVoucherItemList([...newCollectionVoucherItemList])

    }

    const handleVoucherChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setCollectionVoucher({ ...collectionVoucher, [e.target.name]: e.target.value });

        if (e.target.name !== 'voucherNo') return

        await fetchCollectionVoucher(e.target.value)
    }

    const fetchCollectionVoucher = async (voucherNo: string) => {
        const fetchedCollectionVoucher: CollectionVoucher | null 
            = await fetchCollectionVoucherFromApi(auth, voucherNo, setSnackbarMessage, setSnackbarVisibility)

        if (fetchedCollectionVoucher === null) return

        setCollectionVoucher(fetchedCollectionVoucher)

        if (fetchedCollectionVoucher.collectionVoucherItemList === null) return

        setCollectionVoucherItemList(fetchedCollectionVoucher.collectionVoucherItemList as PresentableCollectionVoucherItem[])
    }

    function TransitionDown(props: any) {
        return <Slide {...props} direction="right" />;
    }

    const addNewCollectionVoucherItem = () => {
        setCollectionVoucherItemList([...collectionVoucherItemList, new PresentableCollectionVoucherItem()])
    }

    const updateCollectionVoucherItemRow = (index: number) => {
        const newCollectionVoucherItemList = collectionVoucherItemList.map((collectionVoucherItem, j) => 
            j === index ? curCollectionVoucherItem : collectionVoucherItem
        )
        if (newCollectionVoucherItemList !== undefined) {
            setCollectionVoucherItemList(newCollectionVoucherItemList as PresentableCollectionVoucherItem[])
        }
        setIdxAtEditMode(-1)
        setCurCollectionVoucherItem(new PresentableCollectionVoucherItem())
    }

    const startEditingCollectionVoucherRow = (index: number) => {
        setIdxAtEditMode(index)
        curCollectionVoucherItem.billNo = collectionVoucherItemList[index].billNo
        curCollectionVoucherItem.supplierName = collectionVoucherItemList[index].supplierName
        curCollectionVoucherItem.billAmount = collectionVoucherItemList[index].billAmount
        curCollectionVoucherItem.pendingAmount = collectionVoucherItemList[index].pendingAmount
        curCollectionVoucherItem.amountCollected = collectionVoucherItemList[index].amountCollected
        curCollectionVoucherItem.ddNo = collectionVoucherItemList[index].ddNo
        curCollectionVoucherItem.ddDate = collectionVoucherItemList[index].ddDate
        curCollectionVoucherItem.bank = collectionVoucherItemList[index].bank
        setCurCollectionVoucherItem(curCollectionVoucherItem)
    }

    const deleteRow = (index: number) => {
        let newCollectionVoucherItemList = collectionVoucherItemList.filter((x, j) => j !== index)
        setCollectionVoucherItemList(newCollectionVoucherItemList)
    }

    const handleCollectionVoucherItemChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setCurCollectionVoucherItem({ ...curCollectionVoucherItem, [e.target.name]: e.target.value });

        if (e.target.name === 'billNo') {
            const billResponse: Bill | undefined = await fetchBillFromApi(auth, e.target.value)
            
            const newCurCollectionVoucherItem = new PresentableCollectionVoucherItem()
            newCurCollectionVoucherItem.billNo = e.target.value
            
            if (billResponse !== undefined) {
                newCurCollectionVoucherItem.supplierName = billResponse.supplierName
                newCurCollectionVoucherItem.billAmount = billResponse.billAmount
            } else {
                newCurCollectionVoucherItem.supplierName = '---'
                newCurCollectionVoucherItem.billAmount = 0
            }
            
            newCurCollectionVoucherItem.amountCollected = curCollectionVoucherItem.amountCollected
            newCurCollectionVoucherItem.ddNo = curCollectionVoucherItem.ddNo
            newCurCollectionVoucherItem.ddDate = curCollectionVoucherItem.ddDate
            setCurCollectionVoucherItem(newCurCollectionVoucherItem)
        }
    }

    const submitCollection = async () => {
        const response = await submitCollectionToApi(auth, collectionVoucher, collectionVoucherItemList)
        if (response === null || response === undefined) {
            setSnackbarMessage('Could not save collection. Please try again')
            setSnackbarVisibility(1)
            return
        }

        const responseBodyText = await response?.text()
        const responseMessage = JSON.parse(responseBodyText)?.message
        
        if (response.status === 200) {
            setSnackbarMessage(responseMessage ?? `Successfully saved collection voucher`)
            setSnackbarVisibility(2)
        } else {
            setSnackbarMessage(responseMessage ?? `Could not save collection voucher ${collectionVoucher.voucherNo}`)
            setSnackbarVisibility(1)
        }
    }

    const deleteCollection = async () => {
        const response = await deleteCollectionFromApi(auth, collectionVoucher.voucherNo)
        if (response === null || response === undefined) {
            setSnackbarMessage('Could not delete collection. Please try again')
            setSnackbarVisibility(1)
            return
        }

        const responseMessage = (await response?.json()).message
        
        if (response.status === 200) {
            setSnackbarMessage(responseMessage ?? `Successfully deleted collection voucher`)
            setSnackbarVisibility(2)
        } else {
            setSnackbarMessage(responseMessage ?? `Could not delete collection voucher ${collectionVoucher.voucherNo}`)
            setSnackbarVisibility(1)
        }
    }

    const clearCollection = async () => {
        setCollectionVoucher(new CollectionVoucher())
        setCollectionVoucherItemList([])
        setCurCollectionVoucherItem(new PresentableCollectionVoucherItem())
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
                <Grid item lg={12}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ minWidth: 70 }} variant="head" align="center">Bill No.</TableCell>
                                    <TableCell sx={{ minWidth: 70 }} variant="head" align="center">Supplier name</TableCell>
                                    <TableCell sx={{ minWidth: 70 }} variant="head" align="center">Bill Amount</TableCell>
                                    <TableCell sx={{ minWidth: 70 }} variant="head" align="center">Pending Amount</TableCell>
                                    <TableCell sx={{ minWidth: 70 }} variant="head" align="center">Amount Collected</TableCell>
                                    <TableCell sx={{ minWidth: 70 }} variant="head" align="center">DD No.</TableCell>
                                    <TableCell sx={{ minWidth: 70 }} variant="head" align="center">DD Date</TableCell>
                                    <TableCell sx={{ minWidth: 70 }} variant="head" align="center">Bank</TableCell>
                                    <TableCell sx={{ minWidth: 70 }} variant="head" align="center">Operations</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    collectionVoucherItemList && collectionVoucherItemList.map((collectionVoucherItem, i) => 
                                        <TableRow>
                                            <TableCell sx={{ minWidth: 70 }} variant="head" align="center">
                                                {idxAtEditMode === i ?
                                                <Autocomplete
                                                    disablePortal
                                                    id="billNoAutocomplete"
                                                    options={pendingBillNos}
                                                    sx={{ width: 300 }}
                                                    value={collectionVoucherItem.billNo}
                                                    onChange={(event, newValue) => handleBillNoChange(newValue!, i)}
                                                    renderInput={(params) => <TextField {...params} name="billNo" label="Bill No" />}
                                                />
                                                : collectionVoucherItem.billNo} 
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 70 }} variant="head" align="center">
                                                {idxAtEditMode === i ?
                                                <Typography color={'green'}>{curCollectionVoucherItem.supplierName}</Typography>
                                                : collectionVoucherItem.supplierName} 
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 70 }} variant="head" align="center">
                                                {idxAtEditMode === i ?
                                                <Typography color={'green'}>{curCollectionVoucherItem.billAmount}</Typography>
                                                : collectionVoucherItem.billAmount} 
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 70 }} variant="head" align="center">
                                                {idxAtEditMode === i ?
                                                <Typography color={'green'}>{curCollectionVoucherItem.pendingAmount}</Typography>
                                                : collectionVoucherItem.pendingAmount} 
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 70 }} variant="head" align="center">
                                                {idxAtEditMode === i ?
                                                    <input name="amountCollected" value={curCollectionVoucherItem.amountCollected} onChange={handleCollectionVoucherItemChange}></input>
                                                    : collectionVoucherItem.amountCollected
                                                }
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 70 }} variant="head" align="center">
                                                {idxAtEditMode === i ?
                                                    <input name="ddNo" value={curCollectionVoucherItem.ddNo} onChange={handleCollectionVoucherItemChange}></input>
                                                    : collectionVoucherItem.ddNo
                                                }
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 70 }} variant="head" align="center">
                                                {idxAtEditMode === i ?
                                                    <input name="ddDate" value={curCollectionVoucherItem.ddDate} onChange={handleCollectionVoucherItemChange}></input>
                                                    : collectionVoucherItem.ddDate
                                                }
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 70 }} variant="head" align="center">
                                                {idxAtEditMode === i ?
                                                    <input name="bank" value={curCollectionVoucherItem.bank} onChange={handleCollectionVoucherItemChange}></input>
                                                    : collectionVoucherItem.bank
                                                }
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 70 }} variant="head" align="center">
                                            {idxAtEditMode === i ? <Button onClick={() => updateCollectionVoucherItemRow(i)}><Done></Done></Button> :
                                                    <Button onClick={() => startEditingCollectionVoucherRow(i)}><Edit></Edit></Button>}
                                                <Button onClick={() => deleteRow(i)}><Delete></Delete></Button>
                                            </TableCell>
                                        </TableRow>
                                        )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item lg={2}>
                    <Button onClick={addNewCollectionVoucherItem}><Add></Add>Add row</Button>
                </Grid>
                <Grid item lg={2}>
                    <Button onClick={clearCollection} variant="contained" type="button" fullWidth>
                        <Clear></Clear>
                        Clear
                    </Button>
                </Grid>
                <Grid item lg={2}>
                    <Button onClick={submitCollection} variant="contained" className="bg-yellow-600" type="button" fullWidth>
                        <Save></Save>
                        Save
                    </Button>
                </Grid>
                <Grid item lg={2}>
                    <Button onClick={deleteCollection} variant="contained" className="bg-yellow-600" type="button" fullWidth>
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