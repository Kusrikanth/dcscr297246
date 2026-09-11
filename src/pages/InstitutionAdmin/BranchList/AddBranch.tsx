import React from "react";
import { Form, Label, Input } from "reactstrap";
import ReactPhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

//Images
import DPSLogoSM from "../../../assets/imagesdps/mastersetup/dps_logo.png";

const AddBranch: React.FC<any> = () => {
    return (
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4 tw-gap-y-3">
            <div className="md:tw-col-span-2 tw-flex tw-justify-center tw-mb-4">
                <div className="tw-relative tw-inline-block">
                    <div className="tw-absolute tw-bottom-0 tw-right-0 tw-z-10">
                        <Label htmlFor="customer-image-input" className="tw-mb-0">
                            <div className="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-cursor-pointer">
                                <div className="tw-w-full tw-h-full tw-bg-white tw-border tw-rounded-full tw-text-gray-500 tw-flex tw-items-center tw-justify-center tw-shadow-sm">
                                    <i className="ri-image-fill"></i>
                                </div>
                            </div>
                        </Label>
                        <Input className="form-control d-none" id="customer-image-input" type="file"
                            accept="image/png, image/gif, image/jpeg"
                        />
                    </div>
                    <div className="tw-w-24 tw-h-24 tw-p-1">
                        <div className="tw-w-full tw-h-full tw-bg-gray-100 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                            <img src={DPSLogoSM} alt="logo" id="customer-img" className="tw-w-20 tw-h-20 tw-rounded-full tw-object-cover" />
                        </div>
                    </div>
                </div>

            </div>
            <div className="tw-col-span-1">
                <div className="tw-mb-3">
                    <Label htmlFor="instituteName" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Institute Name</Label>
                    <Input type="text" placeholder="" id="instituteName" className="tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-[#1bb3a6] focus:tw-ring-[#1bb3a6] tw-text-sm" />
                </div>
            </div>
            <div className="tw-col-span-1">
                <div className="tw-mb-3">
                    <Label htmlFor="shortCode" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Short Code</Label>
                    <Input type="text" id="shortCode" className="tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-[#1bb3a6] focus:tw-ring-[#1bb3a6] tw-text-sm" />
                </div>
            </div>
            <div className="tw-col-span-1">
                <div className="tw-mb-3">
                    <Label htmlFor="affliationNo" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Affliation No</Label>
                    <Input type="text" placeholder="" id="affliationNo" className="tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-[#1bb3a6] focus:tw-ring-[#1bb3a6] tw-text-sm" />
                </div>
            </div>
            <div className="tw-col-span-1">
                <div className="tw-mb-3">
                    <Label htmlFor="trustName" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Trust Name</Label>
                    {/* <Input type="text" id="branchType" /> */}
                    <Input type="text" placeholder="" id="trustName" className="tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-[#1bb3a6] focus:tw-ring-[#1bb3a6] tw-text-sm" />
                </div>
            </div>
            <div className="tw-col-span-1">
                <div className="tw-mb-3">
                    <Label htmlFor="contactName" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Contact Name</Label>
                    <Input type="text" placeholder="" id="contactName" className="tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-[#1bb3a6] focus:tw-ring-[#1bb3a6] tw-text-sm" />
                </div>
            </div>
            <div className="tw-col-span-1">
                <div className="tw-mb-3">
                    <Label htmlFor="emailId" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Email ID</Label>
                    <div className="tw-relative">
                        <Input type="email" className="tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-pl-10 tw-py-2 tw-text-sm focus:tw-border-[#1bb3a6] focus:tw-ring-[#1bb3a6]" id="emailId" />
                        <i className="ri-mail-unread-line tw-absolute tw-left-3 tw-top-1/2 tw-transform tw-translate-y-[-50%] tw-text-gray-500"></i>
                    </div>
                </div>
            </div>
            <div className="tw-col-span-1">
                <div className="tw-mb-3">
                    <Label htmlFor="contactPersonNumber" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Phone No.</Label>
                    {/* <Input type="email"  id="contactPersonNumber" /> */}
                    <ReactPhoneInput
                        placeholder="Enter phone number"
                        inputClass="tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-shadow-sm focus:tw-border-[#1bb3a6] focus:tw-ring-[#1bb3a6] tw-text-sm tw-pl-12"
                        containerClass="tw-w-full"
                        country={'in'}
                        countryCodeEditable={false}
                        inputProps={{
                            name: "phone",
                            id: "phone",
                        }}
                    />
                </div>
            </div>
            <div className="tw-col-span-1">
                <div className="tw-mb-3">
                    <Label htmlFor="location" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Location</Label>
                    <div className="tw-relative">
                        <Input type="text" className="tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-pl-10 tw-py-2 tw-text-sm focus:tw-border-[#1bb3a6] focus:tw-ring-[#1bb3a6]" id="location" />
                        <i className="ri-map-pin-line tw-absolute tw-left-3 tw-top-1/2 tw-transform tw-translate-y-[-50%] tw-text-gray-500"></i>
                    </div>
                </div>
            </div>
            <div className="tw-col-span-1">
                <div className="tw-mb-3">
                    <Label htmlFor="subDomain" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">URL / Subdomain</Label>
                    <Input readOnly value="https://www.dps-hyd.digitalcaampus.com" type="email" id="subDomain" className="tw-block tw-w-full tw-rounded-md tw-border-gray-300 tw-bg-gray-50 tw-text-gray-500 tw-text-sm tw-px-3 tw-py-2" />
                </div>
            </div>
            <div className="tw-col-span-1">
                <div className="tw-mb-3">
                    <Label htmlFor="institute-status" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Status</Label>
                    <select className="tw-block tw-w-full tw-rounded-md tw-border tw-border-gray-300 tw-bg-white tw-px-3 tw-py-2 tw-text-sm focus:tw-border-[#1bb3a6] focus:tw-outline-none" id="institute-status">
                        <option >Select</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

export default AddBranch;