import type Transport from '../model/Transport'
import Config from '../util/config'
import type KonsignResponse from '../model/KonsignResponse'
import { ToastService } from './toast.service'

export const fetchAllTransportsFromApi = async (auth: any): Promise<Transport[] | null> => {
  const requestOptions = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    json: true,
  }

  const response = await fetch(Config.TRANSPORTS_ENDPOINT, requestOptions).catch((err) => {
    console.error(err)
    ToastService.error(err.message)
    return null
  })

  if (response == null || response?.status !== 200) {
    ToastService.error('error fetching all transport')
    return null
  }

  try {
    const res: KonsignResponse<Transport[]> = await response.json()
    ToastService.success('successfully fetched all transports')
    return res?.data
  } catch (e) {
    console.log(e)
    return []
  }
}

export const addTransport = async (transport: Transport, auth: any): Promise<void> => {
  const serializedData = JSON.stringify(transport)
  const requestOptions = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    body: serializedData,
    json: true,
  }

  const response = await fetch(Config.TRANSPORTS_ENDPOINT, requestOptions).catch((err) => {
    console.error(err)
    ToastService.error(err.message)
    return null
  })

  if (response === null || response.status !== 200) {
    ToastService.error(`Failed saving transport ${transport.transportName}`)
    return
  }

  ToastService.success(`Successfully saved ${transport.transportName}`)
}

export const deleteTransportFromApi = async (transport: String, auth: any): Promise<void> => {
  const requestOptions = {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth?.user?.accessToken}`,
    }),
    json: true,
  }

  const response = await fetch(`${Config.TRANSPORTS_ENDPOINT}/${transport}`, requestOptions).catch(
    (err) => {
      console.error(err)
      ToastService.error(err)
      return null
    },
  )

  if (response === null || response?.status !== 200) {
    ToastService.error(`failed deleting transport ${transport}`)
  }

  ToastService.success(`Successfully deleted transport ${transport}`)
}
