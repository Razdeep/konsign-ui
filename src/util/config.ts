class Config {
  // static BACKEND_BASE_URL: string = process.env.BASE_URL || 'https://konsign-api-production.up.railway.app';
  static BACKEND_BASE_URL: string = 'https://konsign-api.koyeb.app/api/v1'
  // static BACKEND_BASE_URL: string = 'https://192.168.1.12:8443/api/v1'
  static BILLS_ENDPOINT = `${this.BACKEND_BASE_URL}/bills`
  static LOGIN_URL = `${this.BACKEND_BASE_URL}/auth/login`
  static AUTH_REFRESH_URL = `${this.BACKEND_BASE_URL}/auth/refresh`
  static SUPPLIERS_ENDPOINT: string = `${this.BACKEND_BASE_URL}/suppliers`
  static BUYERS_ENDPOINT: string = `${this.BACKEND_BASE_URL}/buyers`
  static TRANSPORTS_ENDPOINT: string = `${this.BACKEND_BASE_URL}/transports`
  static COLLECTIONS_PENDING_BILLS_ENDPOINT: string = `${this.BACKEND_BASE_URL}/collection-vouchers/pending-bills`
  static COLLECTIONS_ENDPOINT: string = `${this.BACKEND_BASE_URL}/collection-vouchers`
  static REPORTS_ENDPOINT: string = `${this.BACKEND_BASE_URL}/report/buyer`
}

export default Config
