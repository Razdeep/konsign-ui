import Buyer from "../model/Buyer";
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

    const response = await fetch(Config.GET_ALL_BUYERS, requestOptions).catch(e => {
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