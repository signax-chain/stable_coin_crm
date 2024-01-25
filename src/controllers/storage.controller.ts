class LocalStorageController {
  setData(key: string, content: string) {
    window.localStorage.setItem(key, content);
    window.dispatchEvent(new Event(key));
  }

  getData(key: string): string {
    return window.localStorage.getItem(key)!;
  }
}
export const localStorageController = new LocalStorageController();
