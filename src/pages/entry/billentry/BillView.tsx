import { ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import Bill from "../../../model/Bill";
import { deleteBillFromApi, fetchAllBillsFromApi } from "../../../services/BillServices";
import { Alert, Button, ButtonGroup, Container, InputLabel, MenuItem, Pagination, Paper, Select, SelectChangeEvent, Slide, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { KonsignSpinner } from "../../../components/KonsignSpinner";
import { Delete, Edit, Refresh } from "@mui/icons-material";

export const BillView: React.FC = () => {
    const auth = useAuth()

    const [snackbarVisibility, setSnackbarVisibility] = useState<number>(0)
    const [snackbarMessage, setSnackbarMessage] = useState<string>('')

    const [bills, setBills] = useState<Bill[]>([])
    const [totalPages, setTotalPages] = useState<number>(0)
    const [billsPerPage, setBillsPerPage] = useState<number>(5)
    const [pageOffset, setPageOffset] = useState<number>(0)

    const [isLoading, setIsLoading] = useState<boolean>(true)

    const fetchData = async () => {
        setIsLoading(true)
        const fetchedPage = await fetchAllBillsFromApi(auth, pageOffset, billsPerPage)

        if (fetchedPage === undefined || fetchedPage === null) return

        setBills(fetchedPage.content)
        setTotalPages(fetchedPage.totalPages)
        setIsLoading(false)
    }

    const handleOffsetChange = async (e: ChangeEvent<unknown>, value: number) => {
        setPageOffset(value)
        console.log(value)
        await fetchData()
    }

    const handleBillsPerPageChange = async (e: SelectChangeEvent) => {
        setBillsPerPage(e.target.value as unknown as number)
        await fetchData()
    }

    const deleteBill = async (billNo: string) => {
        const response = await deleteBillFromApi(auth, billNo)
        if (response === null || response === undefined) {
            setSnackbarMessage('Could not delete bill. Please try again')
            setSnackbarVisibility(1)
            return
        }

        const responseMessage = (await response?.json()).message

        if (response.status === 200) {
            setSnackbarMessage(responseMessage ?? `Successfully deleted bill ${billNo}`)
            setSnackbarVisibility(2)
        } else {
            setSnackbarMessage(responseMessage ?? `Could not delete bill ${billNo}`)
            setSnackbarVisibility(1)
        }
    }

    useEffect(() => {
        const fetchDataWrapperFunc = async () => {
            return await fetchData()
        }
        fetchDataWrapperFunc()
    }, [billsPerPage])

    function TransitionDown(props: any) {
        return <Slide {...props} direction="right" />;
    }

    function showNotYetImplemented(): void {
        setSnackbarMessage("Not yet implemented")
        setSnackbarVisibility(1)
    }

    const tableCellStyle = { minWidth: 100, padding: 0.5 }

    return <Stack spacing={1}>
        <Stack direction="row">
            <Container sx={{display: 'flex'}}>
                <InputLabel>Items per page</InputLabel>
                <Select value={billsPerPage.toString()} 
                    size="small" onChange={handleBillsPerPageChange}>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>
            </Container>
            <Button sx={{marginLeft: 'auto'}} variant="contained" onClick={fetchData} startIcon={<Refresh/>}>Refresh</Button>
        </Stack>

        {isLoading ?
            <Container sx={{ margin: "auto", height: 200, width: 250, textAlign: "center" }}><KonsignSpinner /></Container> :
            <>
                <Pagination page={pageOffset} onChange={handleOffsetChange} count={totalPages} variant="outlined" shape="rounded" />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Bill No</TableCell>
                                <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Bill Date</TableCell>
                                <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Supplier</TableCell>
                                <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Buyer</TableCell>
                                <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Transport</TableCell>
                                <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">LR Date</TableCell>
                                <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Amount</TableCell>
                                <TableCell sx={{backgroundColor: (theme) => theme.palette.primary.main, color: (theme) => theme.palette.secondary.main }} variant="head" align="center">Operations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bills.map((bill, i) => (
                                <TableRow
                                    key={i}
                                >
                                    <TableCell sx={tableCellStyle} align="center">{bill.billNo}</TableCell>
                                    <TableCell sx={tableCellStyle} align="center">{bill.billDate}</TableCell>
                                    <TableCell sx={tableCellStyle} align="center">{bill.supplierName}</TableCell>
                                    <TableCell sx={tableCellStyle} align="center">{bill.buyerName}</TableCell>
                                    <TableCell sx={tableCellStyle} align="center">{bill.transportName}</TableCell>
                                    <TableCell sx={tableCellStyle} align="center">{bill.lrDate}</TableCell>
                                    <TableCell sx={tableCellStyle} align="center">{bill.billAmount}</TableCell>
                                    <TableCell sx={tableCellStyle} align="center">
                                        <ButtonGroup>
                                            <Button onClick={() => showNotYetImplemented()}>
                                                <Edit></Edit>
                                            </Button>
                                            <Button onClick={() => deleteBill(bill.billNo)}>
                                                <Delete color={"error"}></Delete>
                                            </Button>
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination page={pageOffset} onChange={handleOffsetChange} count={totalPages} variant="outlined" shape="rounded" />
            </>
        }
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
    </Stack>
}