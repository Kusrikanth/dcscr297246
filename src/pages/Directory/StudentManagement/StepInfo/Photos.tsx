import React from "react";
import { FileUpload } from "../../../../Components/Common";

export const Photos: React.FC<any> = (props) => {
    return (
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12">
                <h5 className="tw-mb-3">Photos</h5>
            </div>
            <div className="tw-col-span-7">
                <FileUpload
                    labelText="Student Photo"
                    name="Student Photo"
                    containerClassName="tw-mb-3"
                    showPreview={true}
                />
            </div>
            <div className="tw-col-span-7">
                <FileUpload
                    labelText="Father Photo"
                    name="dob-certificate"
                    containerClassName="tw-mb-3"
                    showPreview={true}
                />
            </div>
            <div className="tw-col-span-7">
                <FileUpload
                    labelText="Mother Photo"
                    name="Mother Photo"
                    containerClassName="tw-mb-3"
                    showPreview={true}
                />
            </div>
            <div className="tw-col-span-7">
                <FileUpload
                    labelText="Guardian Photo"
                    name="final-report-card"
                    containerClassName="tw-mb-3"
                    showPreview={true}
                />
            </div>
        </div>
    )
}