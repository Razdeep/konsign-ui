import Config from "../util/config";

export const fetchAllPendingBillNumbersFromApi = async (auth: any, buyerName: string) => {

    class Response {
        pendingBillNumbers: string[] = []
    }

    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth?.user?.jwt
        }),
        json: true
    };

    const response = await fetch(Config.GET_PENDING_BILLS_FOR_COLLECTION + `?buyerName=${buyerName}`, requestOptions).catch(e => {
        return null
    })

    if (response == null || response?.status !== 200) {
        return null
    }
    
    const res: Response = JSON.parse(await response?.text())
    const pendingBillNumbers: string[] = res.pendingBillNumbers
    return pendingBillNumbers
}