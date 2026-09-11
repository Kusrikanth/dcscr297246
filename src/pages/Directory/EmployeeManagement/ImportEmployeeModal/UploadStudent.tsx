import React, { useState } from "react";
import Dropzone from "react-dropzone";
import Button from "../../../../Components/Common/Button";

export default function UploadStudent() {
    const [selectedFiles, setselectedFiles] = useState([]);

    function formatBytes(bytes: any, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }
    function handleAcceptedFiles(files: any) {
        files.map((file: any) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        );
        setselectedFiles(files);
    }
    return (
        <React.Fragment>
            <div className="px-4">
                <Dropzone
                    onDrop={(acceptedFiles) => {
                        handleAcceptedFiles(acceptedFiles);
                    }}
                >
                    {({ getRootProps, getInputProps }) => (
                        <div className="dropzone dz-clickable tw-mb-3">
                            <div
                                className="dz-message needsclick"
                                {...getRootProps()}
                            >
                                <div className="tw-mb-1">
                                    <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                </div>
                                <h6 className="text-muted fw-normal">
                                    Drag & Drop the Excel file <br />
                                    OR <br />
                                    Select File.
                                </h6>
                            </div>
                        </div>
                    )}
                </Dropzone>
                <button onClick={() => { }} className="btn btn-primary">
                    Upload Template <i className="align-middle ms-1 ri-download-2-fill"></i>
                </button>
            </div>
            <div className="text-end tw-mt-2 tw-px-4 tw-py-4">
                <Button type="submit" variant="secondary">
                    Cancel
                </Button>
                <Button onClick={() => { }} variant="primary">
                    Proceed
                </Button>
            </div>
        </React.Fragment>
    )
}