class Config {
    static BACKEND_BASE_URL: string = process.env.BASE_URL || 'https://konsign-api-production.up.railway.app';
    // static BACKEND_BASE_URL: string = 'http://localhost:8080'
    static BILL_ENTRY_URL = `${this.BACKEND_BASE_URL}/billentry`;
    static GET_BILL_URL = `${this.BACKEND_BASE_URL}/getBill`;
    static LOGIN_URL = `${this.BACKEND_BASE_URL}/authenticate`;
    static GET_ALL_SUPPLIERS: string = `${this.BACKEND_BASE_URL}/suppliers`;
    static DELETE_SUPPLIER: string = `${this.BACKEND_BASE_URL}/supplier`;
    static ADD_SUPPLIER: string = `${this.BACKEND_BASE_URL}/addSupplier`;
    static GET_ALL_BUYERS: string = `${this.BACKEND_BASE_URL}/buyers`;
    static ADD_BUYER: string = `${this.BACKEND_BASE_URL}/addBuyer`;
    static DELETE_BUYER: string = `${this.BACKEND_BASE_URL}/buyer`;
    static GET_ALL_TRANSPORTS: string = `${this.BACKEND_BASE_URL}/transports`;
    static ADD_TRANSPORT: string = `${this.BACKEND_BASE_URL}/transport`;
    static DELETE_TRANSPORT: string = `${this.BACKEND_BASE_URL}/tranport`;
    static GET_PENDING_BILLS_FOR_COLLECTION: string = `${this.BACKEND_BASE_URL}/get-pending-bill-numbers-to-be-collected`;
};

export default Config;