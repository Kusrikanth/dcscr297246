import React from "react";
import { FileUpload } from "../../../../Components/Common";

export const Documents: React.FC<any> = (props) => {
    return (
        <div className="row">
            <div className="col-12">
                <h5 className="mb-3 d-inline-block text-underline-blue">Upload Documents</h5>
            </div>
            <div className="col-7">
                <FileUpload
                    labelText="Bonafide Certificate"
                    name="bonafide-cerficate"
                    containerClassName="mb-3"
                />
            </div>
            <div className="col-7">
                <FileUpload
                    labelText="DOB Certificate"
                    name="dob-certificate"
                    containerClassName="mb-3"
                />
            </div>
            <div className="col-7">
                <FileUpload
                    labelText="Report Card of Term ( Current Year )"
                    name="report_current_term"
                    containerClassName="mb-3"
                />
            </div>
            <div className="col-7">
                <FileUpload
                    labelText="Final Report Card ( Last Year )"
                    name="final-report-card"
                    containerClassName="mb-3"
                />
            </div>
            <div className="col-7">
                <FileUpload
                    labelText="Aadhar Card / Passport"
                    name="addhar-card"
                    containerClassName="mb-3"
                />
            </div>
            <div className="col-7">
                <FileUpload
                    labelText="Residence Address Copy"
                    name="address-copy"
                    containerClassName="mb-3"
                />
            </div>
            <div className="col-12 text-end mt-2">
                <button type="submit" className="btn btn-soft-success me-2">
                    Cancel
                </button>
                <button type="submit" className="btn btn-success">
                    Proceed
                </button>
            </div>
        </div>
    )
}