import Bill from "../model/Bill";
import Config from "../util/config";

export const fetchBillFromApi = async (auth: any, billNo: String): Promise<Bill|undefined> => {
    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.jwt}`
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
        const responseJson: Bill = await response.json()
        return responseJson
    }

    console.error('Something went wrong')
}

export const deleteBillFromApi = async (auth: any, billNo: string) => {

    const requestOptions = {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.jwt}`
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