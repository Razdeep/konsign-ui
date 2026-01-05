class Config {
    // static BACKEND_BASE_URL: string = process.env.BASE_URL || 'https://konsign-api-production.up.railway.app';
    static BACKEND_BASE_URL: string = 'https://konsign-api.koyeb.app/api/v1'
    // static BACKEND_BASE_URL: string = 'http://192.168.1.12:8080/api/v1'
    static BILL_ENTRY_URL = `${this.BACKEND_BASE_URL}/bills`;
    static GET_BILL_URL = `${this.BACKEND_BASE_URL}/bills`;
    static DELETE_BILL_URL = `${this.BACKEND_BASE_URL}/bills`;
    static GET_ALL_BILLS_URL = `${this.BACKEND_BASE_URL}/bills`;
    static LOGIN_URL = `${this.BACKEND_BASE_URL}/authenticate`;
    static GET_ALL_SUPPLIERS: string = `${this.BACKEND_BASE_URL}/suppliers`;
    static DELETE_SUPPLIER: string = `${this.BACKEND_BASE_URL}/suppliers`;
    static ADD_SUPPLIER: string = `${this.BACKEND_BASE_URL}/suppliers`;
    static GET_ALL_BUYERS: string = `${this.BACKEND_BASE_URL}/buyers`;
    static ADD_BUYER: string = `${this.BACKEND_BASE_URL}/buyers`;
    static DELETE_BUYER: string = `${this.BACKEND_BASE_URL}/buyers`;
    static GET_ALL_TRANSPORTS: string = `${this.BACKEND_BASE_URL}/transports`;
    static ADD_TRANSPORT: string = `${this.BACKEND_BASE_URL}/transports`;
    static DELETE_TRANSPORT: string = `${this.BACKEND_BASE_URL}/transports`;
    static GET_PENDING_BILLS_FOR_COLLECTION: string = `${this.BACKEND_BASE_URL}/collection-vouchers/pending-bills`;
    static ADD_COLLECTION: string = `${this.BACKEND_BASE_URL}/collection-vouchers`;
    static DELETE_COLLECTION: string = `${this.BACKEND_BASE_URL}/collection-vouchers`;
    static GET_COLLECTION_URL: string = `${this.BACKEND_BASE_URL}/collection-vouchers`;
    
};

export default Config;