import DPSLogo from "../../assets/imagesdps/mastersetup/dps_logo.png";
import Button from "../../Components/Common/Button";
import { getDdMmYyyyWithMonthNameFormat } from "../../utility/dateutility";


export default function ViewInstituteDetailsCard({ instituteDetailsArray, id, toggle }: any) {    
    const instituteDetails = instituteDetailsArray?.find((institute: any) => +institute?.id === +id);    
     
    return (
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-0" id="contact-view-detail">
            <div className="tw-p-5 tw-text-center">
                <div className="tw-relative tw-inline-block">
                    <img
                        src={instituteDetails?.logo || DPSLogo}
                        alt=""
                        className="tw-w-[80px] tw-h-[80px] tw-rounded-full tw-border tw-p-1 tw-bg-white tw-object-contain"
                    />
                    <span className="tw-absolute tw-bottom-1 tw-right-1 tw-w-3 tw-h-3 tw-rounded-full tw-bg-green-500 tw-border-2 tw-border-white">
                        <span className="tw-sr-only">Active</span>
                    </span>
                </div>
                <h5 className="tw-mt-4 tw-mb-1 tw-text-lg tw-font-semibold">{instituteDetails?.instituteName || ""}</h5>
                <p className="tw-text-gray-500 tw-mb-0">{instituteDetails?.shortName || ""}</p>
            </div>
            <div className="tw-p-5 tw-pt-0">
                <h6 className="tw-text-gray-500 tw-uppercase tw-font-semibold tw-text-xs tw-mb-2">
                    Information
                </h6>
                <p className="tw-text-gray-500 tw-text-sm tw-mb-4">
                    Description of the school here need to be added.
                </p>
                <div className="tw-overflow-hidden">
                    <table className="tw-w-full tw-text-sm">
                        <tbody>
                            <tr className="tw-border-b tw-border-gray-50 last:tw-border-0">
                                <td className="tw-py-2 tw-font-bold tw-text-gray-700 tw-w-1/3">
                                    Location
                                </td>
                                <td className="tw-py-2 tw-text-gray-600">{instituteDetails?.address}</td>
                            </tr>
                            <tr className="tw-border-b tw-border-gray-50 last:tw-border-0">
                                <td className="tw-py-2 tw-font-bold tw-text-gray-700">
                                    Contact Person
                                </td>
                                <td className="tw-py-2 tw-text-gray-600">{instituteDetails?.contactPersonFirstName} {instituteDetails?.contactPersonLastName}</td>
                            </tr>
                            <tr className="tw-border-b tw-border-gray-50 last:tw-border-0">
                                <td className="tw-py-2 tw-font-bold tw-text-gray-700">
                                    Phone No
                                </td>
                                <td className="tw-py-2 tw-text-gray-600">{instituteDetails?.contactPersonPhoneNo}</td>
                            </tr>
                            <tr className="tw-border-b tw-border-gray-50 last:tw-border-0">
                                <td className="tw-py-2 tw-font-bold tw-text-gray-700">
                                    Contact Email
                                </td>
                                <td className="tw-py-2 tw-text-primary">{instituteDetails?.contactPerEmailId}</td>
                            </tr>
                            <tr className="tw-border-b tw-border-gray-50 last:tw-border-0">
                                <td className="tw-py-2 tw-font-bold tw-text-gray-700">
                                    Licence Expiry Date
                                </td>
                                <td className="tw-py-2 tw-text-gray-600">
                                    {getDdMmYyyyWithMonthNameFormat(instituteDetails?.licenseExpiryDate)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="tw-flex tw-justify-end tw-p-5 tw-pt-0">
                <Button variant="secondary" onClick={toggle}>
                    Cancel
                </Button>
            </div>
        </div>
    )
}