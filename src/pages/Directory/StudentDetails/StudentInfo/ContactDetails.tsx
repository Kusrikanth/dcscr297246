import React from "react";

export default function ContactDetails() {
    return (
        <div className="tw-bg-white tw-shadow tw-rounded-lg">
            <div className="tw-border-b tw-px-4 tw-py-2">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">Contact Details</h4>
            </div>
            <div className="tw-p-4">
                <div className="tw-grid tw-grid-cols-2 tw-gap-y-2 tw-gap-x-4">
                    <div className="tw-grid tw-grid-cols-3">
                        <div className="tw-font-medium">Phone No</div>
                        <div className="tw-col-span-2">+919852124585</div>
                    </div>
                    <div className="tw-grid tw-grid-cols-3">
                        <div className="tw-font-medium">Emergency Contact No</div>
                        <div className="tw-col-span-2">+919852124585</div>
                    </div>
                    <div className="tw-grid tw-grid-cols-3">
                        <div className="tw-font-medium">Email ID</div>
                        <div className="tw-col-span-2">askumar1972@gmail.com</div>
                    </div>
                    <div className="tw-grid tw-grid-cols-3">
                        <div className="tw-font-medium">Address</div>
                        <div className="tw-col-span-2">Almasguda, Almasguda, Hyderabad, Telangana 50004, India</div>
                    </div>
                </div>
            </div>
        </div>
    )
}