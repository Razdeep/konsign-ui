import LrPm from "./LrPm";

class Bill {
    supplierName: String = '';
    buyerName: String = '';
    billNo: String = '';
    billDate: String = '';
    transport: String = '';
    lrDate: String = '';
    lrPmList: LrPm[] = [];
    billAmount: number = 0;
}

export default Bill;