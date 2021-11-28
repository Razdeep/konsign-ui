import LrPm from "./LrPm";

class Bill {
    supplierName: String = '';
    buyerName: String = '';
    billNo: String = '';
    date: String = '';
    transport: String = '';
    lrDate: String = '';
    lrPm: LrPm[] = [];
}

export default Bill;