import { AxiosResponse } from "axios";

export interface IActionType {
    payload?: string,
    type: string,
    endpoint?: string,
    optionalConfig: (object | undefined | null)
}

export interface ICreatedActionType {
    type: string,
    payload: INewActionType
}

export interface INewActionType {
    endpoint: string,
    payload?: any,
    optionalConfig?: any
}

export interface ITestActionType<T> {
    endpoint: string,
    payload?: T,
    optionalConfig?: any
}


export interface IResponseActionType {
    successAction: string,
    failAction: string,
}



export interface IApiResponse<T, E> extends AxiosResponse<T> {
    error?: E
}


export interface IActionType {
    payload?: string,
    type: string,
    endpoint?: string,
    optionalConfig: (object | undefined | null)
}


export interface IResponseErrorModel {
    errorCode: string,
    errorMessage: string,
    details: any;
    errorMessages: string | null | undefined
}

export interface IModelWithPagination<T> {
    data: T[],
    totalPages: number,
    totalRecords: number,
    recordCount: number,
    recordOffset: number,
    pageNumber: number,
    requestedCount: number,
    filter: string | null,
    totalElements: any;
    first: boolean,
    last: boolean
}