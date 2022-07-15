import { ICachye } from "./type/ICache";

class SessionCache implements ICachye {
  setCache(key: string, value: any) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }
  getCache(key: string) {
    const value = window.sessionStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }
  deleteCache(key: string) {
    window.sessionStorage.removeItem(key);
  }
  clearCache() {
    window.sessionStorage.clear();
  }
}
const sessionCache = new SessionCache();
export default sessionCache;
