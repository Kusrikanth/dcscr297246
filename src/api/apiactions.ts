import axios from "axios"
import { requestInterceptor, responseInterceptor, responseInterceptorSuccess } from "./interceptor";
import store from "../store";
import { cleanAppDataStateAct } from "../store/appdata/appdataslice";
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

type ApiErrorPayload = {
    message?: string;
    details?: string;
    [key: string]: unknown;
};

const checkErrorResponse = (error: unknown) => {
    const ignoreErrorCodes = [401], // these errors are not sent to requesting method
        response = axios.isAxiosError<ApiErrorPayload>(error) ? error.response : undefined;
    // const ignoreErrorCodes = [500, 405, 404, 401], // these errors are not sent to requesting method
    //     { errorHandler } = optionalConfig || {};
    if (ignoreErrorCodes.includes(response?.status)) {
        removeLocalStorage(accessTokenKey);
        removeLocalStorage(instituteIdKey);
        store.dispatch(cleanAppDataStateAct(undefined));
        return { error: response.data };
    } else if (response?.data) {
        // Keep the API's error payload for every status, including 500. Replacing
        // it with a generic status message hides the exception that callers need
        // to diagnose and display.
        return { error: response.data };
    } else {
        return {
            error: {
                details: response?.status
                    ? `Request failed with status code ${response.status}`
                    : "Unable to connect to the server",
            },
        };
    }

    // }
}

export async function getData(apiUrl: string, params = {}, optionalConfig = {}, payload = {}) {
    try {
        return await axios.get(apiUrl, { data: payload, params, ...optionalConfig })
    }
    catch (error) {
        return checkErrorResponse(error);
    }
}

export async function postData(apiUrl: string, payload = {}, optionalConfig = {}) {
    try {
        return await axios.post(apiUrl, payload, optionalConfig);
    }
    catch (error) {
        return checkErrorResponse(error);
    }
}

export async function putData(apiUrl: string, payload = {}, optionalConfig = {}) {
    try {
        return await axios.put(apiUrl, payload, optionalConfig);
    }
    catch (error) {
        return checkErrorResponse(error);
    }
}

export async function deleteData(apiUrl: string, payload = {}, optionalConfig = {}) {
    try {
        return await axios.delete(apiUrl, { data: payload, ...optionalConfig });
    }
    catch (error) {
        return checkErrorResponse(error);
    }
}
