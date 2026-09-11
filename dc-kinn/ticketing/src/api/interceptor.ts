import { getLocalStorage } from "../utility/storageUtility";
import { accessTokenKey, instituteIdKey, branchIdKey } from "../Components/constants/storageconstants";
import { setShowGlobalLoaderAct } from "../store/global/globalactions";
import store from "../store";
const apiCallSet = new Set();

export function requestInterceptor(request: any) {
    const { url, tokenNotRequired = false, version, instituteIdNotRequired = false } = request || {};
    const instituteIdValue = getLocalStorage(instituteIdKey);
    const branchIdValue = getLocalStorage(branchIdKey);
    if (!request.hideLoader) {
        apiCallSet.add(url);
    }
    if (!tokenNotRequired) {
        const tokenKey = getLocalStorage(accessTokenKey);
        request.headers["Authorization"] = `Bearer ${tokenKey}`;
    }
    if (!instituteIdNotRequired) {

        if (instituteIdValue) {
            request.headers["instituteId"] = instituteIdValue;
        }
    }
    if (instituteIdValue) {
        request.headers["X-Institute-ID"] = instituteIdValue;
    }
    if (branchIdValue) {
        request.headers["X-Branch-ID"] = branchIdValue;
    }
    if ((apiCallSet.size === 1)) {
        store.dispatch(setShowGlobalLoaderAct(true));
    }
    return request
}

export function responseInterceptorSuccess(response: any) {
    const { config } = response;
    apiCallSet.delete(config.url);
    if (apiCallSet.size === 0) {
        setTimeout(() => {
            if (apiCallSet.size === 0) {
                store.dispatch(setShowGlobalLoaderAct(false));
            }
        }, 500);
    }
    return response;
}

export function responseInterceptor(error: any) {
    apiCallSet.clear();
    store.dispatch(setShowGlobalLoaderAct(false));
    return error.isAxiosError ? Promise.reject(error) : error;
}