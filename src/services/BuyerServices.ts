import type Buyer from '../model/Buyer'
import type KonsignResponse from '../model/KonsignResponse'
import Config from '../util/config'
import { ToastService } from './toast.service'

export const fetchAllBuyersFromApi = async (auth: any): Promise<Buyer[] | null> => {
  const requestOptions = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    json: true,
  }

  const response = await fetch(Config.BUYERS_ENDPOINT, requestOptions).catch((err) => {
    console.error(err)
    ToastService.error(err)
    return null
  })

  if (response == null || response?.status !== 200) {
    ToastService.error('error fetching all buyers')
    return null
  }

  try {
    const master: KonsignResponse<Buyer[]> = await response?.json()
    ToastService.success('Successfully fetched all buyers')
    return master?.data
  } catch (e) {
    console.log(e)
    ToastService.error('Failed to fetch all buyers')
    return []
  }
}

export const addBuyer = async (buyer: Buyer, auth: any): Promise<void> => {
  const serializedData = JSON.stringify(buyer)
  const requestOptions = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    body: serializedData,
    json: true,
  }

  const response = await fetch(Config.BUYERS_ENDPOINT, requestOptions)

  if (response.status !== 200) {
    ToastService.error(`Failed to add buyer ${buyer.buyerName}`)
    return
  }

  ToastService.success(`Successfully added buyer ${buyer.buyerName}`)
}

export const deleteBuyerFromApi = async (buyerId: String, auth: any): Promise<void> => {
  const requestOptions = {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    json: true,
  }

  const response = await fetch(`${Config.BUYERS_ENDPOINT}/${buyerId}`, requestOptions).catch(
    (err) => {
      console.error(err)
      ToastService.error(`Failed to delete buyer ${buyerId}`)
      return null
    },
  )

  if (response === null || response?.status !== 200) {
    ToastService.error(`Failed to delete buyer ${buyerId}`)
  }

  ToastService.success(`Successfully deleted buyer ${buyerId}`)
}

export const generateBuyerLedger = async (buyerId: String, auth: any): Promise<void> => {
  ToastService.info(`Generating buyer ledger for ${buyerId}`)
  const requestOptions = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/pdf',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    json: true,
  }

  const url = new URL(Config.REPORTS_ENDPOINT)
  url.search = new URLSearchParams({
    buyerId: String(buyerId),
  }).toString()

  const response = await fetch(url, requestOptions).catch((err) => {
    ToastService.error(err)
    return null
  })

  if (response == null || response?.status !== 200) {
    ToastService.error(`Failed to generate buyer ledger for ${buyerId}`)
    return
  }

  try {
    const blob = await response?.blob()

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${buyerId}.pdf`
    a.click()

    window.URL.revokeObjectURL(url)
    ToastService.success(`Successfully generated buyer ledger for ${buyerId}`)
  } catch (e) {
    console.error(e)
    ToastService.error(`Failed to generate buyer ledger for ${buyerId}`)
    return
  }
}
