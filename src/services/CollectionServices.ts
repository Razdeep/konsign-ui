import CollectionVoucher from "../model/CollectionVoucher";
import CollectionVoucherItem from "../model/CollectionVoucherItem";
import PendingBill from "../model/PendingBill";
import Config from "../util/config";

export const fetchAllPendingBillNumbersFromApi = async (auth: any, buyerName: string) => {

    class Response {
        pendingBills: PendingBill[] = []
    }

    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth?.user?.accessToken
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
    const pendingBillNumbers: PendingBill[] = res.pendingBills
    return pendingBillNumbers
}

export const submitCollectionToApi = async (auth: any, 
        collectionVoucher: CollectionVoucher, 
        collectionVoucherItemList: CollectionVoucherItem[]) => {

    class RequestBody {
        voucherNo: string = '';
        voucherDate: string = '';
        buyerName: string = '';
        collectionVoucherItemList: CollectionVoucherItem[] = []
    }

    const requestBody = new RequestBody()
    requestBody.voucherNo = collectionVoucher.voucherNo
    requestBody.voucherDate = collectionVoucher.voucherDate
    requestBody.buyerName = collectionVoucher.buyerName
    requestBody.collectionVoucherItemList = collectionVoucherItemList
    
    const serializedData = JSON.stringify(requestBody)

    const requestOptions = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth?.user?.accessToken
        }),
        body: serializedData,
        json: true
    };

    const response = await fetch(Config.ADD_COLLECTION, requestOptions).catch(e => {
        console.error(e)
        return null
    })

    return response
}

export const deleteCollectionFromApi = async (auth: any, voucherNo: string) => {
    const requestOptions = {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        json: true
    }

    const response = await fetch(`${Config.DELETE_COLLECTION}/${voucherNo}`, requestOptions).catch(e => {
        console.error('Something went wrong while trying to delete the collection voucher')
    })
    
    if (response == null || response?.status !== 200) {
        console.error('Something went wrong while trying to fetch the collection voucher')
    }

    return await response
}

export const fetchCollectionVoucherFromApi = async (auth: any, voucherNo: string, setSnackbarMessage: any, setSnackbarVisibility: any) => {

    const requestOptions = {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth?.user?.accessToken}`
        }),
        json: true
    };

    const response = await fetch(Config.GET_COLLECTION_URL + `?voucherNo=${voucherNo}`, requestOptions).catch(e => {
        return null
    })

    if (response == null || response?.status !== 200) {
        return null
    }
    
    const collectionVoucher: CollectionVoucher = JSON.parse(await response?.text())
    return await collectionVoucher
}