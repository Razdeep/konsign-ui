import { Add, Clear, Delete, Done, Edit, Save } from '@mui/icons-material'
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import Typography from '@mui/material/Typography'
import type { ChangeEvent, FC, SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'

import { useAuth } from '../../../context/AuthProvider'
import CollectionVoucher from '../../../model/CollectionVoucher'
import { fetchAllBuyersFromApi } from '../../../services/BuyerServices'
import {
  deleteCollectionFromApi,
  fetchAllPendingBillNumbersFromApi,
  fetchCollectionVoucherFromApi,
  submitCollectionToApi,
} from '../../../services/CollectionServices'
import { fetchBillFromApi } from '../../../services/BillServices'
import type Bill from '../../../model/Bill'
import type PendingBill from '../../../model/PendingBill'
import { PresentableCollectionVoucherItem } from '../../../model/PresentableVoucherItem'

const CollectionEntry: FC = () => {
  const auth = useAuth()
  const [buyers, setBuyers] = useState<String[]>([])

  const [collectionVoucher, setCollectionVoucher] = useState<CollectionVoucher>({
    voucherNo: '0',
    voucherDate: new Date().toISOString().substring(0, 10),
    buyerName: '',
    collectionVoucherItemList: [],
  })

  const [collectionVoucherItemList, setCollectionVoucherItemList] = useState<
    PresentableCollectionVoucherItem[]
  >([])

  const [idxAtEditMode, setIdxAtEditMode] = useState<number>(-1)

  const [curCollectionVoucherItem, setCurCollectionVoucherItem] =
    useState<PresentableCollectionVoucherItem>(new PresentableCollectionVoucherItem())

  const [pendingBills, setPendingBills] = useState<PendingBill[]>()
  const [pendingBillNos, setPendingBillNos] = useState<string[]>([])

  const handleBuyerNameChange = async (
    event: SyntheticEvent<Element, Event>,
    newValue: String | null,
  ) => {
    event.preventDefault()
    const newBuyerNameValue = newValue?.toString() ?? ''
    setCollectionVoucher({ ...collectionVoucher, buyerName: newBuyerNameValue })
    await fetchPendingBills()
  }

  const fetchPendingBills = async () => {
    let fetchedPendingBills: PendingBill[] | null = await fetchAllPendingBillNumbersFromApi(
      auth,
      collectionVoucher.buyerName,
    )
    if (fetchedPendingBills != null) {
      setPendingBills(fetchedPendingBills)
      const newPendingBillNos = fetchedPendingBills.map((pendingBill) => pendingBill.billNo)
      setPendingBillNos(newPendingBillNos)
    }
  }

  const handleBillNoChange = (selectedBillNo: string, selectedIndex: number) => {
    let targetSupplierName = '---'
    let targetBillAmount = 0
    let targetPendingAmount = 0

    if (pendingBills === null || pendingBills === undefined) return

    pendingBills.forEach((pendingBill: PendingBill) => {
      if (pendingBill.billNo === selectedBillNo) {
        targetSupplierName = pendingBill.supplierName
        targetBillAmount = pendingBill.billAmount
        targetPendingAmount = pendingBill.pendingAmount
      }
    })

    const newCollectionVoucherItemList = collectionVoucherItemList.map(
      (collectionVoucherItem: PresentableCollectionVoucherItem, idx) => {
        return idx === selectedIndex
          ? {
              ...collectionVoucherItem,
              billNo: selectedBillNo,
              supplierName: targetSupplierName,
              billAmount: targetBillAmount,
              pendingAmount: targetPendingAmount,
            }
          : { ...collectionVoucherItem }
      },
    )

    setCurCollectionVoucherItem({
      ...curCollectionVoucherItem,
      billNo: selectedBillNo,
      supplierName: targetSupplierName,
      billAmount: targetBillAmount,
      pendingAmount: targetPendingAmount,
    })

    setCollectionVoucherItemList([...newCollectionVoucherItemList])
  }

  const handleVoucherChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault()
    setCollectionVoucher({ ...collectionVoucher, [e.target.name]: e.target.value })

    if (e.target.name !== 'voucherNo') return

    await fetchCollectionVoucher(e.target.value)
  }

  const fetchCollectionVoucher = async (voucherNo: string) => {
    const fetchedCollectionVoucher: CollectionVoucher | null = await fetchCollectionVoucherFromApi(
      auth,
      voucherNo,
    )

    if (fetchedCollectionVoucher === null) return

    setCollectionVoucher(fetchedCollectionVoucher)

    if (fetchedCollectionVoucher.collectionVoucherItemList === null) return

    setCollectionVoucherItemList(
      fetchedCollectionVoucher.collectionVoucherItemList as PresentableCollectionVoucherItem[],
    )
  }

  const addNewCollectionVoucherItem = async () => {
    setCollectionVoucherItemList([
      ...collectionVoucherItemList,
      new PresentableCollectionVoucherItem(),
    ])
    await fetchPendingBills()
  }

  const updateCollectionVoucherItemRow = (index: number) => {
    const newCollectionVoucherItemList = collectionVoucherItemList.map(
      (collectionVoucherItem, j) =>
        j === index ? curCollectionVoucherItem : collectionVoucherItem,
    )
    if (newCollectionVoucherItemList !== undefined) {
      setCollectionVoucherItemList(
        newCollectionVoucherItemList as PresentableCollectionVoucherItem[],
      )
    }
    setIdxAtEditMode(-1)
    setCurCollectionVoucherItem(new PresentableCollectionVoucherItem())
  }

  const startEditingCollectionVoucherRow = (index: number) => {
    setIdxAtEditMode(index)
    curCollectionVoucherItem.billNo = collectionVoucherItemList[index]?.billNo ?? ''
    curCollectionVoucherItem.supplierName = collectionVoucherItemList[index]?.supplierName ?? ''
    curCollectionVoucherItem.billAmount = collectionVoucherItemList[index]?.billAmount ?? 0
    curCollectionVoucherItem.pendingAmount = collectionVoucherItemList[index]?.pendingAmount ?? 0
    curCollectionVoucherItem.amountCollected =
      collectionVoucherItemList[index]?.amountCollected ?? 0
    curCollectionVoucherItem.ddNo = collectionVoucherItemList[index]?.ddNo ?? ''
    curCollectionVoucherItem.ddDate = collectionVoucherItemList[index]?.ddDate ?? ''
    curCollectionVoucherItem.bank = collectionVoucherItemList[index]?.bank ?? ''
    setCurCollectionVoucherItem(curCollectionVoucherItem)
  }

  const deleteRow = (index: number) => {
    let newCollectionVoucherItemList = collectionVoucherItemList.filter((x, j) => j !== index)
    setCollectionVoucherItemList(newCollectionVoucherItemList)
  }

  const handleCollectionVoucherItemChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.preventDefault()
    setCurCollectionVoucherItem({ ...curCollectionVoucherItem, [e.target.name]: e.target.value })

    if (e.target.name === 'billNo') {
      const billResponse: Bill | null = await fetchBillFromApi(auth, e.target.value)

      const newCurCollectionVoucherItem = new PresentableCollectionVoucherItem()
      newCurCollectionVoucherItem.billNo = e.target.value

      if (billResponse !== null) {
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
    await submitCollectionToApi(auth, collectionVoucher, collectionVoucherItemList)
  }

  const deleteCollection = async () => {
    await deleteCollectionFromApi(auth, collectionVoucher.voucherNo)
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
    fetchedBuyersPromise.then((fetchedBuyers) => {
      if (fetchedBuyers == null) return
      const buyernames = fetchedBuyers.map((fetchedBuyer) => fetchedBuyer.buyerName)
      setBuyers(buyernames)
    })
  }, [auth])

  const tableCellStyle = (isHeading: boolean = false) => ({
    minWidth: 70,
    padding: 0.5,
    ...(isHeading && { color: 'secondary.main', bgcolor: 'primary.main' }),
  })

  return (
    <div>
      <form>
        <Grid container spacing={3}>
          <Grid size={{ lg: 2 }}>
            <TextField
              name="voucherNo"
              label="Voucher no."
              size="small"
              value={collectionVoucher.voucherNo}
              onChange={handleVoucherChange}
              fullWidth
            ></TextField>
          </Grid>
          <Grid size={{ lg: 3 }}>
            <TextField
              name="voucherDate"
              type="date"
              defaultValue={new Date().toISOString().substring(0, 10)}
              label="Voucher Date"
              value={collectionVoucher.voucherDate}
              size="small"
              onChange={handleVoucherChange}
              fullWidth
            ></TextField>
          </Grid>
          <Grid size={{ lg: 7 }}>
            <Autocomplete
              disablePortal
              id="buyerNameAutocomplete"
              options={buyers}
              sx={{ width: 300 }}
              value={collectionVoucher.buyerName}
              onChange={handleBuyerNameChange}
              renderInput={(params) => (
                <TextField {...params} size="small" name="buyerName" label="Buyer name" />
              )}
            />
          </Grid>
          <Grid size={{ lg: 12 }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={tableCellStyle(true)} variant="head" align="center">
                      Bill No.
                    </TableCell>
                    <TableCell sx={tableCellStyle(true)} variant="head" align="center">
                      Supplier name
                    </TableCell>
                    <TableCell sx={tableCellStyle(true)} variant="head" align="center">
                      Bill Amount
                    </TableCell>
                    <TableCell sx={tableCellStyle(true)} variant="head" align="center">
                      Pending Amount
                    </TableCell>
                    <TableCell sx={tableCellStyle(true)} variant="head" align="center">
                      Amount Collected
                    </TableCell>
                    <TableCell sx={tableCellStyle(true)} variant="head" align="center">
                      DD No.
                    </TableCell>
                    <TableCell sx={tableCellStyle(true)} variant="head" align="center">
                      DD Date
                    </TableCell>
                    <TableCell sx={tableCellStyle(true)} variant="head" align="center">
                      Bank
                    </TableCell>
                    <TableCell sx={tableCellStyle(true)} variant="head" align="center">
                      Operations
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {collectionVoucherItemList &&
                    collectionVoucherItemList.map((collectionVoucherItem, i) => (
                      <TableRow>
                        <TableCell sx={tableCellStyle()} align="center">
                          {idxAtEditMode === i ? (
                            <Autocomplete
                              disablePortal
                              id="billNoAutocomplete"
                              options={pendingBillNos}
                              sx={{ width: 150, padding: 0 }}
                              value={collectionVoucherItem.billNo}
                              onChange={(event, newValue) => handleBillNoChange(newValue!, i)}
                              renderInput={(params) => (
                                <TextField {...params} size="small" name="billNo" label="Bill No" />
                              )}
                            />
                          ) : (
                            collectionVoucherItem.billNo
                          )}
                        </TableCell>
                        <TableCell sx={tableCellStyle()} align="center">
                          {idxAtEditMode === i ? (
                            <Typography color={'green'}>
                              {curCollectionVoucherItem.supplierName}
                            </Typography>
                          ) : (
                            collectionVoucherItem.supplierName
                          )}
                        </TableCell>
                        <TableCell sx={tableCellStyle()} align="center">
                          {idxAtEditMode === i ? (
                            <Typography color={'green'}>
                              {curCollectionVoucherItem.billAmount}
                            </Typography>
                          ) : (
                            collectionVoucherItem.billAmount
                          )}
                        </TableCell>
                        <TableCell sx={tableCellStyle()} align="center">
                          {idxAtEditMode === i ? (
                            <Typography color={'green'}>
                              {curCollectionVoucherItem.pendingAmount}
                            </Typography>
                          ) : (
                            collectionVoucherItem.pendingAmount
                          )}
                        </TableCell>
                        <TableCell sx={tableCellStyle()} align="center">
                          {idxAtEditMode === i ? (
                            <TextField
                              size="small"
                              name="amountCollected"
                              value={curCollectionVoucherItem.amountCollected}
                              onChange={handleCollectionVoucherItemChange}
                            ></TextField>
                          ) : (
                            collectionVoucherItem.amountCollected
                          )}
                        </TableCell>
                        <TableCell sx={tableCellStyle()} align="center">
                          {idxAtEditMode === i ? (
                            <TextField
                              size="small"
                              name="ddNo"
                              value={curCollectionVoucherItem.ddNo}
                              onChange={handleCollectionVoucherItemChange}
                            ></TextField>
                          ) : (
                            collectionVoucherItem.ddNo
                          )}
                        </TableCell>
                        <TableCell sx={tableCellStyle()} align="center">
                          {idxAtEditMode === i ? (
                            <TextField
                              size="small"
                              type="date"
                              name="ddDate"
                              value={curCollectionVoucherItem.ddDate}
                              onChange={handleCollectionVoucherItemChange}
                            ></TextField>
                          ) : (
                            collectionVoucherItem.ddDate
                          )}
                        </TableCell>
                        <TableCell sx={tableCellStyle()} align="center">
                          {idxAtEditMode === i ? (
                            <TextField
                              size="small"
                              name="bank"
                              value={curCollectionVoucherItem.bank}
                              onChange={handleCollectionVoucherItemChange}
                            ></TextField>
                          ) : (
                            collectionVoucherItem.bank
                          )}
                        </TableCell>
                        <TableCell sx={tableCellStyle()} align="center">
                          <ButtonGroup>
                            {idxAtEditMode === i ? (
                              <Button
                                onClick={() => updateCollectionVoucherItemRow(i)}
                                startIcon={<Done />}
                              />
                            ) : (
                              <Button
                                onClick={() => startEditingCollectionVoucherRow(i)}
                                startIcon={<Edit />}
                              />
                            )}
                            <Button
                              onClick={() => deleteRow(i)}
                              startIcon={<Delete />}
                              color={'error'}
                            />
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {/* <Grid item lg={2}> */}
          <Grid size={{ lg: 2 }}>
            <Button onClick={addNewCollectionVoucherItem} startIcon={<Add />}>
              Add row
            </Button>
          </Grid>
          {/* <Grid item lg={8}> */}
          <Grid size={{ lg: 8 }}>
            <ButtonGroup>
              <Button
                onClick={clearCollection}
                variant="contained"
                type="button"
                fullWidth
                startIcon={<Clear />}
              >
                Clear
              </Button>
              <Button
                onClick={submitCollection}
                variant="contained"
                className="bg-yellow-600"
                type="button"
                fullWidth
                startIcon={<Save />}
                color="success"
              >
                Save
              </Button>
              <Button
                onClick={deleteCollection}
                variant="contained"
                className="bg-yellow-600"
                type="button"
                fullWidth
                startIcon={<Delete />}
                color="error"
              >
                Delete
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default CollectionEntry
