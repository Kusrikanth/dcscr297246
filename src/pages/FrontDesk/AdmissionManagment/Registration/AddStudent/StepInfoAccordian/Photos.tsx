import React from "react";
import { FileUpload } from "../../../../../../Components/Common";

export const Photos: React.FC<any> = (props) => {
    return (
        <div className="row">
            <div className="col-12">
                <h5 className="mb-3 d-inline-block text-underline-blue">Photos</h5>
            </div>
            <div className="col-7">
                <FileUpload
                    labelText="Student Photo"
                    name="Student Photo"
                    containerClassName="mb-3"
                    showPreview={true}
                />
            </div>
            <div className="col-7">
                <FileUpload
                    labelText="Father Photo"
                    name="dob-certificate"
                    containerClassName="mb-3"
                    showPreview={true}
                />
            </div>
            <div className="col-7">
                <FileUpload
                    labelText="Mother Photo"
                    name="Mother Photo"
                    containerClassName="mb-3"
                    showPreview={true}
                />
            </div>
            <div className="col-7">
                <FileUpload
                    labelText="Guardian Photo"
                    name="final-report-card"
                    containerClassName="mb-3"
                    showPreview={true}
                />
            </div>
        </div>
    )
}