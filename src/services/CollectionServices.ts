import type CollectionVoucher from '../model/CollectionVoucher'
import type CollectionVoucherItem from '../model/CollectionVoucherItem'
import type PendingBill from '../model/PendingBill'
import Config from '../util/config'
import { ToastService } from './toast.service'

export const fetchAllPendingBillNumbersFromApi = async (
  auth: any,
  buyerName: string,
): Promise<PendingBill[]> => {
  class Response {
    pendingBills: PendingBill[] = []
  }

  const requestOptions = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + auth?.user?.accessToken,
    }),
    json: true,
  }

  const response = await fetch(
    Config.COLLECTIONS_PENDING_BILLS_ENDPOINT + `?buyerName=${buyerName}`,
    requestOptions,
  ).catch((err) => {
    console.error(err)
    ToastService.error('failed fetching pending bill number')
    return null
  })

  if (response == null || response?.status !== 200) {
    return []
  }

  const res: Response = JSON.parse(await response?.text())
  const pendingBillNumbers: PendingBill[] = res.pendingBills
  return pendingBillNumbers
}

export const submitCollectionToApi = async (
  auth: any,
  collectionVoucher: CollectionVoucher,
  collectionVoucherItemList: CollectionVoucherItem[],
): Promise<void> => {
  class RequestBody {
    voucherNo: string = ''
    voucherDate: string = ''
    buyerName: string = ''
    collectionVoucherItemList: CollectionVoucherItem[] = []
  }

  const requestBody = new RequestBody()
  requestBody.voucherNo = collectionVoucher.voucherNo
  requestBody.voucherDate = collectionVoucher.voucherDate
  requestBody.buyerName = collectionVoucher.buyerName
  requestBody.collectionVoucherItemList = collectionVoucherItemList

  const serializedData = JSON.stringify(requestBody)

  const requestOptions = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + auth?.user?.accessToken,
    }),
    body: serializedData,
    json: true,
  }

  const response = await fetch(Config.COLLECTIONS_ENDPOINT, requestOptions).catch((e) => {
    console.error(e)
    ToastService.error(e.message)
  })

  if (response == null || response?.status !== 200) {
    ToastService.error(`Failed inserting ${collectionVoucher.voucherNo}`)
  }

  ToastService.success(`Successfully inserted ${collectionVoucher.voucherNo}`)
}

export const deleteCollectionFromApi = async (auth: any, voucherNo: string): Promise<void> => {
  const requestOptions = {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    json: true,
  }

  const response = await fetch(`${Config.COLLECTIONS_ENDPOINT}/${voucherNo}`, requestOptions).catch(
    (err) => {
      console.error(err)
      ToastService.error(`Failed deleting ${voucherNo}`)
    },
  )

  if (response == null || response?.status !== 200) {
    ToastService.error(`Failed deleting ${voucherNo}`)
  }

  ToastService.success(`Successfully deleted ${voucherNo}`)
}

export const fetchCollectionVoucherFromApi = async (
  auth: any,
  voucherNo: string,
): Promise<CollectionVoucher | null> => {
  const requestOptions = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    json: true,
  }

  const response = await fetch(`${Config.COLLECTIONS_ENDPOINT}/${voucherNo}`, requestOptions).catch(
    (e) => {
      console.error(e)
    },
  )

  if (response == null || response?.status !== 200) {
    console.log(`Collection voucher with id: ${voucherNo} not found`)
    return null
  }

  const collectionVoucher: CollectionVoucher = JSON.parse(await response?.text())
  ToastService.success(`Collection voucher ${voucherNo} fetched successfully`)
  return collectionVoucher
}
