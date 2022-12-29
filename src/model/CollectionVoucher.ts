import CollectionVoucherItem from "./CollectionVoucherItem";

class CollectionVoucher {
    voucherNo: string = '';
    voucherDate: string = '';
    buyerName: string = '';
    collectionVoucherItemList: CollectionVoucherItem[] = [];
}

export default CollectionVoucher;