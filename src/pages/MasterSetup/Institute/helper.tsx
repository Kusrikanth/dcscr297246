import { ITabItem } from "../../../Components/Common/Tabs";
//Utility
import { getYyyyMmDdFormat } from "../../../utility/dateutility";
import { validateNumber } from "../../../utility/validationutility";

export const tabsOptions: Array<ITabItem> = [
    {
        tabId: "basic-info",
        tabName: "Basic Info"
    },
    {
        tabId: "contactperson-info",
        tabName: "Contact Person Info"
    }
]

export function getInstituteDetails(instiuteDetails?: any): any {
    return ({
        address: instiuteDetails?.address || undefined,
        affiliationNo: validateNumber(instiuteDetails?.affiliationNo) ? instiuteDetails?.affiliationNo : undefined,
        contactPersonFirstName: instiuteDetails?.contactPersonFirstName || undefined,
        contactPersonLastName: instiuteDetails?.contactPersonLastName || undefined,
        contactPersonPhoneNo: instiuteDetails?.contactPersonPhoneNo || undefined,
        contactPerEmailId: instiuteDetails?.contactPerEmailId || undefined,
        countryId: instiuteDetails?.countryId || undefined,
        emailId: instiuteDetails?.emailId || undefined,
        instituteGroupId: instiuteDetails?.instituteGroupId || undefined,
        id: instiuteDetails?.id || undefined,
        instituteName: instiuteDetails?.instituteName || undefined,
        institutionPhoneNo: instiuteDetails?.institutionPhoneNo || undefined,
        latitude: instiuteDetails?.latitude || undefined,
        licenceType: instiuteDetails?.licenceType || undefined,
        licenseExpiryDate: (instiuteDetails?.licenseExpiryDate) ? getYyyyMmDdFormat(instiuteDetails.licenseExpiryDate) : undefined,
        longitude: instiuteDetails?.longitude || undefined,
        pincode: instiuteDetails?.pincode || undefined,
        shortName: instiuteDetails?.shortName || undefined,
        stateId: instiuteDetails?.stateId || undefined,
        trustId: instiuteDetails?.trustId || undefined,
        websiteUrl: instiuteDetails?.websiteUrl || undefined
    })
}