import React from "react";
import { FileUpload } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";

export const Documents: React.FC<any> = (props) => {
    return (
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12">
                <h5 className="tw-mb-3">{props.titleName || "Upload Documents"}</h5>
            </div>
            <div className="tw-col-span-7">
                <FileUpload
                    labelText="Bonafide Certificate"
                    name="bonafide-cerficate"
                    containerClassName="tw-mb-3"
                />
            </div>
            <div className="tw-col-span-7">
                <FileUpload
                    labelText="DOB Certificate"
                    name="dob-certificate"
                    containerClassName="tw-mb-3"
                />
            </div>
            <div className="tw-col-span-7">
                <FileUpload
                    labelText="Report Card of Term ( Current Year )"
                    name="report_current_term"
                    containerClassName="tw-mb-3"
                />
            </div>
            <div className="tw-col-span-7">
                <FileUpload
                    labelText="Final Report Card ( Last Year )"
                    name="final-report-card"
                    containerClassName="tw-mb-3"
                />
            </div>
            <div className="tw-col-span-7">
                <FileUpload
                    labelText="Aadhar Card / Passport"
                    name="addhar-card"
                    containerClassName="tw-mb-3"
                />
            </div>
            <div className="tw-col-span-7">
                <FileUpload
                    labelText="Residence Address Copy"
                    name="address-copy"
                    containerClassName="tw-mb-3"
                />
            </div>
            <div className="tw-col-span-12 tw-text-right tw-mt-2">
                <Button type="submit" variant="secondary" className="tw-me-2">
                    Cancel
                </Button>
                <Button type="submit" variant="primary">
                    Proceed
                </Button>
            </div>
        </div>
    )
}