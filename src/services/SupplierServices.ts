import ResponseVerdict from "../model/ResponseVerdict";
import Supplier from "../model/Supplier";
import Config from "../util/config";

interface Master {
    data: Supplier[];
}

export const fetchAllSuppliersFromApi = async (auth: any) => {
    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
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
    return master?.data
}

export const addSupplierToApi = async (supplier: Supplier, auth: any): Promise<ResponseVerdict> => {
    const serializedData = JSON.stringify(supplier);
    const requestOptions = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        body: serializedData,
        json: true
    }

    const response = await fetch(Config.ADD_SUPPLIER, requestOptions)

    return response.json()
}