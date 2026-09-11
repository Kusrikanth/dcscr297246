import React, { useState } from "react";
import Dropzone from "react-dropzone";

interface UploadStudentProps {
  containerClass?: string;
  bodyClass?: string;
  // footerClass?: string;
  uploadBtnText?: string;
  hideUploadBtn?:boolean
}
export default function UploadStudent(props: UploadStudentProps) {
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
      <div className={props.containerClass}>
        <div className={props.bodyClass}>
          <Dropzone
            onDrop={(acceptedFiles) => {
              handleAcceptedFiles(acceptedFiles);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div className="dropzone dz-clickable tw-mb-3">
                <div className="dz-message needsclick" {...getRootProps()}>
                  <div className="tw-mb-1">
                    <i className="display-4 tw-text-gray-500 ri-upload-cloud-2-fill" />
                  </div>
                  <h6 className="tw-text-gray-500 tw-font-normal">
                    Drag & Drop the Excel file <br />
                    OR <br />
                    Select File.
                  </h6>
                </div>
              </div>
            )}
          </Dropzone>
          {!props.hideUploadBtn&&<button onClick={() => {}} className="btn btn-primary">
            {props.uploadBtnText}{" "}
            <i className="align-middle ms-1 ri-download-2-fill"></i>
          </button>}
        </div>
        {/* <div className={props.footerClass}>
          <button type="submit" className="btn btn-soft-success me-2">
            Cancel
          </button>
          <button onClick={() => {}} className="btn btn-success">
            Proceed
          </button>
        </div> */}
      </div>
    </React.Fragment>
  );
}
