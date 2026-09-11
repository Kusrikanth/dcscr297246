import React, { useState } from "react";
import { Label, FormFeedback } from "reactstrap";
import ImgPreview from "../../assets/imagesdps/directory/image_preview.png";
import classnames from "classnames";
import Button from "./Button";

interface IFileUpload {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    containerClassName?: string,
    labelText?: string,
    onChange?: any,
    showPreview?: boolean,
    uploadHndlr?: any,
}

export const FileUpload: React.FC<IFileUpload> = (props) => {
    const [fileState, setFileState] = useState<any>(undefined),
        [fileNameState, setFileNameState] = useState<any>(undefined);
    function onChangeFileUpload(event: any) {
        const file = event?.target?.files[0];
        if (props.showPreview) {
            setFileState(URL.createObjectURL(file));
        }
        setFileNameState(file.name);
        // props.onChange(event);
    }
    return (
        <div className={classnames("tw-flex tw-justify-between file-upload-container", props.containerClassName)} >
            <div className="tw-py-3 tw-px-4 tw-bg-light tw-rounded tw-flex-grow-1" >
                <Label className="form-label">
                    {props.labelText}
                </Label>
                <div className="tw-flex tw-justify-between tw-items-center">
                    <div className="tw-flex tw-items-center">
                        <label htmlFor={props.name} className="btn tw-bg-white tw-text-[#405189] tw-font-normal tw-mb-0 tw-me-2 tw-text-nowrap">Choose File</label>
                        <span className="fs-8">{fileNameState || "No file choosen"}</span>
                        <input id={props.name} hidden type="file" onChange={onChangeFileUpload} />
                    </div>
                    <Button disabled={!fileNameState} variant="info" onClick={props.uploadHndlr}>Upload</Button>
                </div>
            </div >
            {
                props.showPreview && <div className="tw-flex-shrink-0 tw-ms-5 preview-img">
                    <img src={fileState || ImgPreview} className="img-fluid w-100 h-100" />
                </div>
            }
        </div >

    )
}


interface IBrowseFile {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    fileName?: any,
    uploadFileId?: any,
    containerClassName?: string,
    labelText?: string,
    labelClass?:string,
    onChangeFileHndlr?: any,
    showPreview?: boolean,
    uploadHndlr?: any,
    isUploaded?: any,
    uploadedFile?: any,
    invalid?: boolean,
    isDisabled?: boolean,
    error?: string,
    hideLabel?: boolean;
}

export const BrowseFile: React.FC<IBrowseFile> = (props) => {
    return (
        <div className={classnames("", props.containerClassName)} >
        {!props.hideLabel && (
            <Label className={`form-label ${props.labelClass}`}>
                {props.labelText}
            </Label>
        )}
            <div className={`tw-flex tw-items-center tw-relative ${props.isDisabled && "cursor-not-allowed"}`}>
                <div className={classnames("tw-py-2 tw-px-2 tw-rounded tw-flex-grow-1 tw-border tw-w-full ", { "border-danger": props.invalid })}>
                    <div className="tw-flex tw-justify-between tw-items-center">
                        <div className="tw-flex tw-items-center tw-w-full">
                            {/* <label htmlFor={props.name} className="btn bg-white border text-primary fw-normal mb-0 me-2 text-nowrap">Choose File</label> */}
                            <label htmlFor={props.name} className={`tw-cursor-pointer tw-bg-gray-100 tw-px-3 tw-py-1.5 tw-rounded tw-text-gray-500 tw-mb-0 tw-me-2 ${props.isDisabled && "cursor-not-allowed"}`}>Browse</label>
                            <span className="tw-text-gray-500 tw-text-truncate" title={props?.fileName}>{props?.fileName || "No file choosen"}</span>
                            <input disabled={props.isDisabled} name={props.name} id={props.name} hidden type="file" onChange={props.onChangeFileHndlr} />
                        </div>
                        {(props.uploadedFile) && <Button type="button" variant="info" data-id={props.uploadFileId}
                            onClick={props.uploadHndlr}>Upload</Button>}
                        {/* {(props.isUploaded) && <span className="text-success">Uploaded</span>} */}
                    </div>
                </div>
                <span style={{ right: "-26px" }} className="tw-absolute tw-text-[#405189] tw-text-lg tw-block">
                    {(props.isUploaded) && <i className="ri-checkbox-circle-line"></i>}
                </span>
            </div>
            {props.error && props.invalid && <FormFeedback type="invalid" className="tw-block">
                {props.error}
            </FormFeedback>}

        </div >

    )
}
// export const BrowseFile: React.FC<IBrowseFile> = (props) => {
    // const [fileState, setFileState] = useState<any>(undefined),
    //     [fileNameState, setFileNameState] = useState<any>(props?.fileName);
    // function onChangeFileUpload(event: any) {
    //     const file = event?.target?.files[0];
    //     if (props.showPreview) {
    //         setFileState(URL.createObjectURL(file));
    //     }
    //     setFileNameState(file.name);
    //     props.onChange(event);
    // }
//     return (
//         <div className={classnames("", props.containerClassName)} >
//             <Label className="form-label">
//                 {props.labelText}
//             </Label>
//             <div className="py-2 px-2 rounded flex-grow-1 border" >
//                 <div className="d-flex justify-content-between align-items-center">
//                     <div className="d-flex align-items-center">
//                         {/* <label htmlFor={props.name} className="btn bg-white border text-primary fw-normal mb-0 me-2 text-nowrap">Choose File</label> */}
//                         <label htmlFor={props.name} className="btn btn-light text-muted mb-0 me-2">Browse</label>
//                         <span className="text-muted">{fileNameState || "No file choosen"}</span>
//                         <input id={props.name} hidden type="file" onChange={onChangeFileUpload} />
//                     </div>
//                 </div>
//             </div>
//         </div >

//     )
// }
