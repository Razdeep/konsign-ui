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

    const response: Response | null = await fetch(`${Config.BILLS_ENDPOINT}/${billNo}`, requestOptions)
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

    const response = await fetch(`${Config.BILLS_ENDPOINT}/${billNo}`, requestOptions).catch(e => {
        console.error('Something went wrong while trying to delete the bill')
    })
    
    if (response == null || response?.status !== 200) {
        console.error('Something went wrong while trying to delete the bill')
    }

    return response
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

    const url = new URL(Config.BILLS_ENDPOINT);
    url.search = new URLSearchParams({
        offset: String(offset),
        pageSize: String(pageSize),
    }).toString();

    const response: Response | null = await fetch(url.toString(), requestOptions)
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

export const saveBillToApi = async (bill: Bill, auth: any): Promise<ResponseVerdict> => {
    const serializedData = JSON.stringify(bill);
        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.user?.accessToken}`
            }),
            body: serializedData,
            json: true
        };
        const response: Response | void = await fetch(Config.BILLS_ENDPOINT, requestOptions)
                                                    .catch(e => {
                                                        console.log(e);
                                                        throw e;
                                                    })
        
        if (!response) {
            throw new Error('No response found')
        }

        if (response.status !== 200) {
            throw new Error('Internal server error')
        }

        return response.json()
}