//Types

import { IInstituteDetails } from "../../../store/mastersettings/instituteinfo/instituteinfotypes";
import { IResponseErrorModel } from "../../../store/types";

export interface IInstituteProps {
    instituteName: string,
    instituteId: string,
}

export interface IInistuteInfoResp {
    prevInstDetailsResp: (IInstituteDetails | undefined),
    prevUpdateInstResp: any,
    prevInstInfoError: (IResponseErrorModel | undefined)
}