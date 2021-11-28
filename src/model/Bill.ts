import LrPm from "./LrPm";

class Bill {
    supplierName: String = '';
    buyerName: String = '';
    billNo: String = '';
    billDate: String = '';
    transport: String = '';
    lrDate: String = '';
    lrPm: LrPm[] = [];
    billAmount: String = '';
}

export default Bill;