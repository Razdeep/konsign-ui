import Transport from "../model/Transport";
import Config from "../util/config";
import ResponseVerdict from "../model/ResponseVerdict";

interface Master {
    data: Transport[];
}

export const fetchAllTransportsFromApi = async (auth: any): Promise<Transport[] | null> => {
    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        json: true
    };

    const response = await fetch(Config.TRANSPORTS_ENDPOINT, requestOptions).catch(e => {
        return null
    })

    if (response == null || response?.status !== 200) {
        return null
    }
    
    try {
        const master: Master = JSON.parse(await response?.text())
        return master?.data
    } catch (e) {
        console.log(e)
        return []
    }
    
}

export const addTransport = async (transport: Transport, auth: any, 
    // remove below args somehow
    setSnackbarMessage: any, setSnackbarVisibility: any) => {
    const serializedData = JSON.stringify(transport);
    const requestOptions = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        body: serializedData,
        json: true
    }

    const response = await fetch(Config.TRANSPORTS_ENDPOINT, requestOptions)

    if (response.status !== 200) {
        setSnackbarMessage('Failed to add transport')
        setSnackbarVisibility(1)
        return
    }

    setSnackbarMessage((await response?.json())?.message)
    setSnackbarVisibility(2)
}

export const deleteTransportFromApi = async (transport: String, auth: any): Promise<ResponseVerdict> => {
    const requestOptions = {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        json: true
    }

    const response = await fetch(`${Config.TRANSPORTS_ENDPOINT}/${transport}`, requestOptions).catch(e => {
        throw e
    })

    if (response.status !== 200) {
        const errorMessage = 'Something went wrong while deleting transport'
        console.error(errorMessage)
        throw new Error(errorMessage)
    }

    return response.json()
}