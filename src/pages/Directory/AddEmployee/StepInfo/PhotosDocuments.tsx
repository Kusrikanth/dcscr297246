import React from "react";
import { FileUpload } from "../../../../Components/Common";

export const PhotosDocuments: React.FC<any> = (props) => {
    return (
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12">
                <h5 className="tw-mb-3 tw-inline-block tw-border-b-2 tw-border-blue-500">
                    Photo & Document
                </h5>
            </div>
            <div className="tw-col-span-7">
                <FileUpload
                    labelText="Employee Photo"
                    name="employee-documents"
                    containerClassName="tw-mb-3"
                    showPreview={true}
                />
            </div>
            <div className="tw-col-span-7">
                <FileUpload
                    labelText="PAN Card"
                    name="pan-card"
                    containerClassName="tw-mb-3"
                    showPreview={true}
                />
            </div>
        </div>
    )
}