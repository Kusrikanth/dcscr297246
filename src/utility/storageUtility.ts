
export function getLocalStorage(itemKey: string) {
    const itemData: any = window.localStorage.getItem(itemKey);
    return JSON.parse(itemData)
}

export function setLocalStorage(itemKey: string, payload: any) {
    window.localStorage.setItem(itemKey, JSON.stringify(payload))
}
export function removeLocalStorage(itemKey:string) {
    window.localStorage.removeItem(itemKey);
}

export function getSessionStorage(itemKey:string) {
    const itemData:any = window.sessionStorage.getItem(itemKey)
    return JSON.parse(itemData);
}

export function setSessionStorage(itemKey:string, payload:any) {
    window.sessionStorage.setItem(itemKey, JSON.stringify(payload))
}
