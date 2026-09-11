import { IActionType, INewActionType } from "../store/types";
import { generateApiUrl } from "../api/apihelper";

export function generateActionPayload<T>(
  apiKey: string,
  apiParams?: any,
  payload?: T,
  optionalConfig?: any
) {
  const apiUrl: string = generateApiUrl(apiKey, apiParams);
  return {
    endpoint: apiUrl,
    payload: payload,
    optionalConfig,
  };
}

// import { AxiosResponse } from "axios";
// import { put } from "redux-saga/effects";
// import { IActionType, IResponseActionType } from "../store/types";
// import { IUserList } from "../store/login/logintypes";

// export function* handleApiResponse(response: AxiosResponse, action: IResponseActionType) {
//     const { successAction, failAction } = action || {};
//     try {
//         if (response && response.error) {
//             yield put({
//                 type: failAction,
//                 payload: response.error
//             });
//         } else {
//             yield put({
//                 type: successAction,
//                 payload: response.data
//             });
//         }
//     } catch (e) {
//         console.error("Error occuered", e);
//     }
// }
