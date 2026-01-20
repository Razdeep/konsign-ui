import type { ChangeEvent, FC } from 'react'
import { useEffect, useState } from 'react'
import type { SelectChangeEvent } from '@mui/material'
import {
  Button,
  ButtonGroup,
  Container,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { Delete, Edit, Refresh } from '@mui/icons-material'

import { useAuth } from '../../../context/AuthContext'
import type Bill from '../../../model/Bill'
import { deleteBillFromApi, fetchAllBillsFromApi } from '../../../services/BillServices'
import { KonsignSpinner } from '../../../components/KonsignSpinner'
import { ToastService } from '../../../services/toast.service'

export const BillView: FC = () => {
  const auth = useAuth()

  const [bills, setBills] = useState<Bill[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [billsPerPage, setBillsPerPage] = useState<number>(5)
  const [pageOffset, setPageOffset] = useState<number>(0)

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchData = async () => {
    setIsLoading(true)
    const fetchedPage = await fetchAllBillsFromApi(auth, pageOffset, billsPerPage)

    if (fetchedPage === null) return

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
    await deleteBillFromApi(auth, billNo)
  }

  useEffect(() => {
    const fetchDataWrapperFunc = async () => {
      return await fetchData()
    }
    fetchDataWrapperFunc()
  }, [billsPerPage])

  function showNotYetImplemented(): void {
    ToastService.error('Not yet implemented')
  }

  const tableCellStyle = { minWidth: 100, padding: 0.5 }

  return (
    <Stack spacing={1}>
      <Stack direction="row">
        <Container sx={{ display: 'flex' }}>
          <InputLabel>Items per page</InputLabel>
          <Select value={billsPerPage.toString()} size="small" onChange={handleBillsPerPageChange}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </Container>
        <Button
          sx={{ marginLeft: 'auto' }}
          variant="contained"
          onClick={fetchData}
          startIcon={<Refresh />}
        >
          Refresh
        </Button>
      </Stack>

      {isLoading ? (
        <Container sx={{ margin: 'auto', height: 200, width: 250, textAlign: 'center' }}>
          <KonsignSpinner />
        </Container>
      ) : (
        <>
          <Pagination
            page={pageOffset}
            onChange={handleOffsetChange}
            count={totalPages}
            variant="outlined"
            shape="rounded"
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.secondary.main,
                    }}
                    variant="head"
                    align="center"
                  >
                    Bill No
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.secondary.main,
                    }}
                    variant="head"
                    align="center"
                  >
                    Bill Date
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.secondary.main,
                    }}
                    variant="head"
                    align="center"
                  >
                    Supplier
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.secondary.main,
                    }}
                    variant="head"
                    align="center"
                  >
                    Buyer
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.secondary.main,
                    }}
                    variant="head"
                    align="center"
                  >
                    Transport
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.secondary.main,
                    }}
                    variant="head"
                    align="center"
                  >
                    LR Date
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.secondary.main,
                    }}
                    variant="head"
                    align="center"
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.secondary.main,
                    }}
                    variant="head"
                    align="center"
                  >
                    Operations
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bills.map((bill, i) => (
                  <TableRow key={i}>
                    <TableCell sx={tableCellStyle} align="center">
                      {bill.billNo}
                    </TableCell>
                    <TableCell sx={tableCellStyle} align="center">
                      {bill.billDate}
                    </TableCell>
                    <TableCell sx={tableCellStyle} align="center">
                      {bill.supplierName}
                    </TableCell>
                    <TableCell sx={tableCellStyle} align="center">
                      {bill.buyerName}
                    </TableCell>
                    <TableCell sx={tableCellStyle} align="center">
                      {bill.transportName}
                    </TableCell>
                    <TableCell sx={tableCellStyle} align="center">
                      {bill.lrDate}
                    </TableCell>
                    <TableCell sx={tableCellStyle} align="center">
                      {bill.billAmount}
                    </TableCell>
                    <TableCell sx={tableCellStyle} align="center">
                      <ButtonGroup>
                        <Button onClick={() => showNotYetImplemented()}>
                          <Edit></Edit>
                        </Button>
                        <Button onClick={() => deleteBill(bill.billNo)}>
                          <Delete color={'error'}></Delete>
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            page={pageOffset}
            onChange={handleOffsetChange}
            count={totalPages}
            variant="outlined"
            shape="rounded"
          />
        </>
      )}
    </Stack>
  )
}
