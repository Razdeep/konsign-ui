import type KonsignResponse from '../model/KonsignResponse'
import type Supplier from '../model/Supplier'
import Config from '../util/config'
import { ToastService } from './toast.service'

export const fetchAllSuppliersFromApi = async (auth: any): Promise<Supplier[] | null> => {
  const requestOptions = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    json: true,
  }

  const response = await fetch(Config.SUPPLIERS_ENDPOINT, requestOptions).catch((err) => {
    console.error(err)
    ToastService.error(err)
    return null
  })

  if (response == null || response?.status !== 200) {
    ToastService.error('Error fetching suppliers')
    return null
  }

  const master: KonsignResponse<Supplier[]> = await response.json()
  ToastService.success('Successfully fetched suppliers')
  return master?.data
}

export const addSupplierToApi = async (supplier: Supplier, auth: any): Promise<void> => {
  const serializedData = JSON.stringify(supplier)
  const requestOptions = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    body: serializedData,
    json: true,
  }

  const response = await fetch(Config.SUPPLIERS_ENDPOINT, requestOptions).catch((err) => {
    console.error(err)
    ToastService.error(err)
    return null
  })

  if (response === null || response?.status !== 200) {
    ToastService.error(`Error saving supplier ${supplier.supplierName}`)
  }

  ToastService.success(`Successfully saved supplier ${supplier.supplierName}`)
}

export const deleteSupplierFromApi = async (supplierId: String, auth: any): Promise<void> => {
  const requestOptions = {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    json: true,
  }

  const response = await fetch(`${Config.SUPPLIERS_ENDPOINT}/${supplierId}`, requestOptions).catch(
    (err) => {
      console.error(err)
      ToastService.error(err)
      return null
    },
  )

  if (response === null || response?.status !== 200) {
    ToastService.error(`Failed deleting the supplier ${supplierId}`)
    return
  }

  ToastService.success(`Successfully delete supplier ${supplierId}`)
}
