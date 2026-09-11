export interface IUserList {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

export interface IUserError {
    errors: string[]
}
export interface ISignupError {
    listError: string[]
}

export type TLoginError =
    undefined |
    IUserError |
    ISignupError | string;


interface IInstitutes {
    id: string
    instituteName: string,
    instituteCode: string,
    afflicationNo: string,
    trustName: string | null,
    institutionEmail: string,
    institutionPhoneNo: number | null,
    address: string,
    city: string,
    area: string,
    pinCode: string,
    contactPersonName: string,
    contactPersonPhoneNo: string,
    contactPersonEmail: string,
    licenceType: string,
    expiryDate: string,
    websiteUrl: string,
    active: string
}

export interface IInistituteList {
    headers: any,
    body: Array<IInstitutes>,
    statusCode: string,
    statusCodeValue: number
}