class Config {
    static BACKEND_BASE_URL: string = process.env.BASE_URL || 'https://konsign-api.herokuapp.com';
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
};

export default Config;