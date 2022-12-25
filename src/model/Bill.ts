import LrPm from "./LrPm";

class Bill {
    supplierName: string = '';
    buyerName: string = '';
    billNo: string = '';
    billDate: string = '';
    transportName: string = '';
    lrDate: string = '';
    lrPmList: LrPm[] = [];
    billAmount: number = 0;
}

export default Bill;