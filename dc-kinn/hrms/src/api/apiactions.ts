import axios, { Axios, AxiosError, AxiosResponse } from "axios"
import { requestInterceptor, responseInterceptor, responseInterceptorSuccess } from "./interceptor";
import store from "../store";
import { IUserList } from "../store/login/logintypes";
import { setAuthenticatedUserAct, setCurrentInstIdAct, cleanAppDataStateAct } from "../store/appdata/appdataslice";
import { accessTokenKey, instituteIdKey } from "../Components/constants/storageconstants";
import { removeLocalStorage } from "../utility/storageUtility";

// axios.defaults.baseURL = "http://43.204.50.176:8081"

// axios.defaults.headers.post['Content-Type'] = "application/json";
// axios.defaults.headers.put['Content-Type'] = "application/json";

// axios.defaults.baseURL = "https://dev-api.digitalcaampus.com";
// axios.defaults.baseURL = "https://test-api.digitalcaampus.com";
// axios.defaults.baseURL = "https://dev-api.digitalcaampus.com";
axios.defaults.baseURL = import.meta.env.VITE_API_URL;


axios.interceptors.request.use(
    requestInterceptor
)

axios.interceptors.response.use(responseInterceptorSuccess, responseInterceptor);

const checkErrorResponse = (error: any, optionalConfig: any) => {
    const ignoreErrorCodes = [401], // these errors are not sent to requesting method
        { errorHandler } = optionalConfig || {};
    // const ignoreErrorCodes = [500, 405, 404, 401], // these errors are not sent to requesting method
    //     { errorHandler } = optionalConfig || {};
    if (ignoreErrorCodes.includes(error?.response?.status)) {
        removeLocalStorage(accessTokenKey);
        removeLocalStorage(instituteIdKey);
        store.dispatch(cleanAppDataStateAct(undefined));
        return { error: error.response.data };
    } else if (error?.response?.status === 500) {
        return { error: { details: `Error with satus code:${error?.response?.status}` } };
    } else if (error.response && error.response.data) {
        return { error: error.response.data };
    } else {
        return { error: { details: `Error with satus code:${error?.response?.status}` } };
    }

    // }
}

export async function getData(apiUrl: string, params = {}, optionalConfig = {}, payload = {}) {
    try {
        return await axios.get(apiUrl, { data: payload, params, ...optionalConfig })
    }
    catch (error) {
        return checkErrorResponse(error, optionalConfig);
    }
}

export async function postData(apiUrl: string, payload = {}, optionalConfig = {}) {
    try {
        return await axios.post(apiUrl, payload, optionalConfig);
    }
    catch (error) {
        return checkErrorResponse(error, optionalConfig);
    }
}

export async function putData(apiUrl: string, payload = {}, optionalConfig = {}) {
    try {
        return await axios.put(apiUrl, payload, optionalConfig);
    }
    catch (error) {
        return checkErrorResponse(error, optionalConfig);
    }
}

export async function deleteData(apiUrl: string, payload = {}, optionalConfig = {}) {
    try {
        return await axios.delete(apiUrl, { data: payload });
    }
    catch (error) {
        return checkErrorResponse(error, optionalConfig);
    }
}