class LocalStorageController {
  setBankStorage(key: string, content: string) {
    window.localStorage.setItem(key, content);
  }

  getBankStorage(key: string): string {
    return window.localStorage.getItem(key)!;
  }
}
export const localStorageController = new LocalStorageController();
