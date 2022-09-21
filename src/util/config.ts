class Config {
    static BACKEND_BASE_URL: string = process.env.BASE_URL || 'https://konsign-api.herokuapp.com/';
    static BILL_ENTRY_URL = this.BACKEND_BASE_URL + 'billentry';
    static LOGIN_URL = this.BACKEND_BASE_URL + 'authenticate';
    static GET_ALL_SUPPLIERS: string = this.BACKEND_BASE_URL + 'suppliers';
    static DELETE_SUPPLIER: string = this.BACKEND_BASE_URL + 'supplier';
    static ADD_SUPPLIER: string = this.BACKEND_BASE_URL + 'addSupplier';
};

export default Config;