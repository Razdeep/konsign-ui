import Supplier from "../model/Supplier";
import Config from "../util/config";

interface Master {
    suppliers: Supplier[];
}

export const fetchAllSuppliersFromApi = async (auth: any) => {
    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth?.user?.jwt
        }),
        json: true
    };

    const response = await fetch(Config.GET_ALL_SUPPLIERS, requestOptions).catch(e => {
        return null
    })

    if (response == null || response?.status !== 200) {
        return null
    }
    
    const master: Master = JSON.parse(await response?.text())
    return master?.suppliers
}