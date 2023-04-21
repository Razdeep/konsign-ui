import Transport from "../model/Transport";
import Config from "../util/config";

interface Master {
    transports: Transport[];
}

export const fetchAllTransportsFromApi = async (auth: any) => {
    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        json: true
    };

    const response = await fetch(Config.GET_ALL_TRANSPORTS, requestOptions).catch(e => {
        return null
    })

    if (response == null || response?.status !== 200) {
        return null
    }
    
    try {
        const master: Master = JSON.parse(await response?.text())
        return master?.transports
    } catch (e) {
        console.log(e)
        return []
    }
    
}