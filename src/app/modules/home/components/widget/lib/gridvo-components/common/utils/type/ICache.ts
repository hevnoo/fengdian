export interface ICachye {
  setCache(key: string, value: any): void;
  getCache(key: string): void;
  deleteCache(key: string): void;
  clearCache(): void;
}
