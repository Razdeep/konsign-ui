import type Bill from '../model/Bill'
import type KonsignResponse from '../model/KonsignResponse'
import type PaginatedResponse from '../model/PaginatedResponse'
import Config from '../util/config'
import { ToastService } from './toast.service'

export const fetchBillFromApi = async (auth: any, billNo: String): Promise<Bill | null> => {
  const requestOptions = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    json: true,
  }

  const response: Response | null = await fetch(
    `${Config.BILLS_ENDPOINT}/${billNo}`,
    requestOptions,
  ).catch((e) => {
    console.error(e)
    return null
  })

  if (response == null || response?.status !== 200) {
    console.error(`Getting bill failed ${billNo}`)
    return null
  }

  const responseJson: KonsignResponse<Bill> = await response.json()
  ToastService.success(`Successfully fetched ${billNo}`)
  return responseJson.data
}

export const deleteBillFromApi = async (auth: any, billNo: string) => {
  const requestOptions = {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    json: true,
  }

  const response: Response | null = await fetch(
    `${Config.BILLS_ENDPOINT}/${billNo}`,
    requestOptions,
  ).catch((e) => {
    console.error(e)
    ToastService.error(e.message)
    return null
  })

  if (response == null || response?.status !== 200) {
    ToastService.error(`Error delete the bill ${billNo}`)
  }

  ToastService.success(`Successfully deleted ${billNo}`)
  return response
}

export const fetchAllBillsFromApi = async (
  auth: any,
  offset: number,
  pageSize: number,
): Promise<PaginatedResponse<Bill> | null> => {
  const requestOptions = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    json: true,
  }

  const url = new URL(Config.BILLS_ENDPOINT)
  url.search = new URLSearchParams({
    offset: String(offset),
    pageSize: String(pageSize),
  }).toString()

  const response: Response | null = await fetch(url.toString(), requestOptions).catch((e) => {
    console.error(e)
    ToastService.error(e)
    return null
  })

  if (response == null || response?.status !== 200) {
    ToastService.error('Fetching all bills failed')
    return null
  }

  const responseJson: KonsignResponse = await response.json()
  ToastService.success('Successfully fetched all bills')
  return responseJson.data
}

export const saveBillToApi = async (bill: Bill, auth: any): Promise<void> => {
  const serializedData = JSON.stringify(bill)
  const requestOptions = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    body: serializedData,
    json: true,
  }
  const response: Response | null = await fetch(Config.BILLS_ENDPOINT, requestOptions).catch(
    (e) => {
      console.error(e)
      ToastService.error(e.message)
      return null
    },
  )

  if (response == null || response?.status !== 200) {
    ToastService.error('Saving bill failed')
    return
  }

  ToastService.success(`Successfully saved ${bill.billNo}`)
}
