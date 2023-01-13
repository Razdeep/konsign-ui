import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthProvider";
import Bill from "../../../model/Bill";
import { fetchAllBillsFromApi } from "../../../services/BillServices";
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { KonsignSpinner } from "../../../components/KonsignSpinner";
import { Refresh } from "@mui/icons-material";


export const BillView: React.FC = () => {
    const auth = useAuth();

    const [bills, setBills] = useState<Bill[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true)

    const fetchData = async (auth: any) => {
        setIsLoading(true)
        const fetchedPage = await fetchAllBillsFromApi(auth, 0, 10)

        if (fetchedPage === undefined || fetchedPage === null) return

        setBills(fetchedPage.content)
        setIsLoading(false)
    }

    useEffect(() => {
        const fetchDataWrapperFunc = async () => {
            return await fetchData(auth)
        }
        fetchDataWrapperFunc()
    }, [auth])

    return <>
        <Button onClick={() => fetchData(auth) }><Refresh></Refresh>Refresh</Button>
        {isLoading ?
            <Container sx={{ margin: "auto", height: 200, width: 250, textAlign: "center" }}><KonsignSpinner /></Container> :
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
        }
    </>
}