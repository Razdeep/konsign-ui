import Buyer from "../model/Buyer";
import ResponseVerdict from "../model/ResponseVerdict";
import Config from "../util/config";

interface Master {
    data: Buyer[];
}

export const fetchAllBuyersFromApi = async (auth: any): Promise<Buyer[] | null> => {
    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        json: true
    };

    const response = await fetch(Config.BUYERS_ENDPOINT, requestOptions).catch(e => {
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

export const addBuyer = async (buyer: Buyer, auth: any,
    // TODO remove below args somehow
    setSnackbarMessage: any, setSnackbarVisibility: any
) => {
    const serializedData = JSON.stringify(buyer);
    const requestOptions = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        body: serializedData,
        json: true
    }

    const response = await fetch(Config.BUYERS_ENDPOINT, requestOptions)

    if (response.status !== 200) {
        setSnackbarMessage('Failed to add buyer')
        setSnackbarVisibility(1)
        return
    }

    setSnackbarMessage((await response?.json())?.message)
    setSnackbarVisibility(2)
}

export const deleteBuyerFromApi = async (buyerId: String, auth: any): Promise<ResponseVerdict> => {
    const requestOptions = {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        json: true
    }

    const response = await fetch(`${Config.BUYERS_ENDPOINT}/${buyerId}`, requestOptions).catch(e => {
        throw e
    })

    if (response.status !== 200) {
        const errorMessage = 'Something went wrong while deleting buyer'
        console.error(errorMessage)
        throw new Error(errorMessage)
    }

    return response.json()
}

export const generateBuyerLedger = async (buyerId: String, auth: any) => {
    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/pdf',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        json: true
    };

    const url = new URL(Config.REPORTS_ENDPOINT);
    url.search = new URLSearchParams({
        buyerId: String(buyerId),
    }).toString();

    const response = await fetch(url, requestOptions).catch(e => {
        return null
    })

    if (response == null || response?.status !== 200) {
        return null
    }
    
    try {
        const blob = await response?.blob()

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report.pdf";
        a.click();

        window.URL.revokeObjectURL(url);
    } catch (e) {
        console.log(e)
        return []
    }
}