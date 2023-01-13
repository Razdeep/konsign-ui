import { ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import Bill from "../../../model/Bill";
import { fetchAllBillsFromApi } from "../../../services/BillServices";
import { Button, Container, MenuItem, Pagination, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { KonsignSpinner } from "../../../components/KonsignSpinner";
import { Refresh } from "@mui/icons-material";


export const BillView: React.FC = () => {
    const auth = useAuth()

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

    useEffect(() => {
        const fetchDataWrapperFunc = async () => {
            return await fetchData()
        }
        fetchDataWrapperFunc()
    }, [])

    return <>
        <Button onClick={fetchData}><Refresh></Refresh>Refresh</Button>
        <Select value={billsPerPage.toString()} onChange={handleBillsPerPageChange}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
        </Select>

        {isLoading ?
            <Container sx={{ margin: "auto", height: 200, width: 250, textAlign: "center" }}><KonsignSpinner /></Container> :
            <>
                <Pagination page={pageOffset} onChange={handleOffsetChange} count={totalPages} variant="outlined" shape="rounded" />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ minWidth: 100 }} variant="head" align="center">Bill No</TableCell>
                                <TableCell sx={{ minWidth: 100 }} variant="head" align="center">Bill Date</TableCell>
                                <TableCell sx={{ minWidth: 100 }} variant="head" align="center">Supplier</TableCell>
                                <TableCell sx={{ minWidth: 100 }} variant="head" align="center">Buyer</TableCell>
                                <TableCell sx={{ minWidth: 100 }} variant="head" align="center">Transport</TableCell>
                                <TableCell sx={{ minWidth: 100 }} variant="head" align="center">LR Date</TableCell>
                                <TableCell sx={{ minWidth: 100 }} variant="head" align="center">Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bills.map((bill, i) => (
                                <TableRow
                                    key={i}
                                // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{bill.billNo}</TableCell>
                                    <TableCell>{bill.billDate}</TableCell>
                                    <TableCell>{bill.supplierName}</TableCell>
                                    <TableCell>{bill.buyerName}</TableCell>
                                    <TableCell>{bill.transportName}</TableCell>
                                    <TableCell>{bill.lrDate}</TableCell>
                                    <TableCell>{bill.billAmount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination page={pageOffset} onChange={handleOffsetChange} count={totalPages} variant="outlined" shape="rounded" />
            </>
        }
    </>
}