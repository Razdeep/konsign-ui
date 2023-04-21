import Bill from "../model/Bill";
import ResponseVerdict from "../model/ResponseVerdict";
import Config from "../util/config";

export const fetchBillFromApi = async (auth: any, billNo: String): Promise<Bill|undefined> => {
    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        json: true
    };

    const response: Response | null = await fetch(`${Config.GET_BILL_URL}?billNo=${billNo}`, requestOptions)
                                                .catch(e => {
                                                    console.error(e);
                                                    throw new Error('Error while fetching bill')
                                                })
    
    if (!response) {
        throw new Error('Getting bill failed')
    }

    if (response.status === 200) {
        const responseJson: ResponseVerdict = await response.json()
        return responseJson.data
    }

    console.error('Something went wrong')
}

export const deleteBillFromApi = async (auth: any, billNo: string) => {

    const requestOptions = {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        json: true
    }

    const response = await fetch(`${Config.DELETE_BILL_URL}?billNo=${billNo}`, requestOptions).catch(e => {
        console.error('Something went wrong while trying to delete the bill')
    })
    
    if (response == null || response?.status !== 200) {
        console.error('Something went wrong while trying to delete the bill')
    }

    return await response
}

export const fetchAllBillsFromApi = async (auth: any, offset: number, pageSize: number): Promise<any> => {
    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        json: true
    };

    const response: Response | null = await fetch(`${Config.GET_ALL_BILLS_URL}/${offset}/${pageSize}`, requestOptions)
                                                .catch(e => {
                                                    console.error(e);
                                                    throw new Error('Error while fetching all bills')
                                                })
    
    if (!response) {
        throw new Error('Getting bills failed')
    }

    if (response.status === 200) {
        const responseJson: ResponseVerdict = await response.json()
        return responseJson.data
    }

    console.error('Something went wrong')
}