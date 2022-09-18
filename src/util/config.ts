// Configure this variable
const active_profile: string = 'dev';

class LocalConfig {
    static BACKEND_BASE_URL: string = 'http://localhost:8080/';
    static BILL_ENTRY_URL = this.BACKEND_BASE_URL + 'billentry';
    static LOGIN_URL = this.BACKEND_BASE_URL + 'authenticate';
    static GET_ALL_SUPPLIERS: string = this.BACKEND_BASE_URL + 'suppliers';
    static DELETE_SUPPLIER: string = this.BACKEND_BASE_URL + 'supplier';
};

class DevConfig {
    static BACKEND_BASE_URL: string = 'https://konsign-api.herokuapp.com/';
    static BILL_ENTRY_URL = this.BACKEND_BASE_URL + 'billentry';
    static LOGIN_URL = this.BACKEND_BASE_URL + 'authenticate';
    static GET_ALL_SUPPLIERS: string = this.BACKEND_BASE_URL + 'suppliers';
    static DELETE_SUPPLIER: string = this.BACKEND_BASE_URL + 'supplier';
};

const Config = active_profile === 'dev' ? DevConfig : LocalConfig;

export default Config;