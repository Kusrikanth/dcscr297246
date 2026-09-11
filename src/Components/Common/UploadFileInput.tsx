import { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { Input, FormGroup, Label, FormFeedback, FormText } from "reactstrap";
import DPSLogoSM from "../../assets/imagesdps/mastersetup/dps_logo.png";
import DefaultUserImg from "../../assets/imagesdps/default-upload-img.png";

interface ITextInput {
  // eslint-disable-next-line no-restricted-globals
  name: string;
  formgroupClassName?: string | undefined;
  wrapperClassName?: string;
  labelText?: string;
  inputClassName?: string;
  value: any;
  placeHolder?: string;
  onChange: any;
  invalid?: boolean;
  error?: any;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  children?: React.ReactNode;
  hideUploadBtn?: boolean;
  labelClass?: string;
  helperText?: string;
  canRemove?: boolean;
  removeFileHandler?: any;
}

export const UploadFileInput: React.FC<ITextInput> = (props) => {
  const inputFileRef = useRef<any>(null);

  function onClick() {
    if (inputFileRef?.current && inputFileRef?.current?.value) {
      inputFileRef.current.value = null;
    }
  }

  function removeHandler() {
    if (typeof props.removeFileHandler === 'function') {
      inputFileRef.current.value = null;
      props.removeFileHandler(props.name);
    }
  }
  return (
    <div className={props.formgroupClassName || "mb-3"}>
      <>
        <div className={classnames("tw-flex tw-flex-col tw-p-3 upload_form_group_wrapper")}>
          {props.labelText && (
            <Label className={`${props.labelClass} upload_input_label`}>
              {props.labelText}
            </Label>
          )}

          <div className="tw-flex tw-items-center tw-flex-wrap">
            <Label className="choose_file_botton" style={{
              border: "1px solid #ced4da",
              opacity: props.isDisabled ? 0.5 : 1,
              cursor: props.isDisabled ? 'not-allowed' : ''
            }} htmlFor={props.name}>
              Choose File
            </Label>
            <input
              type="file"
              name={props.name}
              id={props.name}
              ref={inputFileRef}
              onClick={onClick}
              className={classnames(props.inputClassName)}
              placeholder={props.placeHolder}
              onChange={props.onChange}
              // value={props.value || ""}
              readOnly={props.isReadOnly || false}
              disabled={props.isDisabled || false}
              hidden
            />
            <div className="tw-flex tw-items-center">
              <h6 className="!tw-text-gray-500 tw-mb-0 tw-font-medium" id={props.name}>
                {props.value ? props.value : "No file chosen"}
              </h6>
              {props.canRemove && props.value &&
                <i title="Remove" onClick={removeHandler} className="ri-close-line tw-flex-shrink-0 tw-ms-2 tw-text-red-500 tw-text-xs tw-cursor-pointer"></i>}

            </div>
            {!props.hideUploadBtn && (
              <Label className="upload_botton" htmlFor={props.name}>
                Upload
              </Label>
            )}
          </div>

          {props.error && (
            <FormFeedback type="invalid" className="tw-block">{props.error}</FormFeedback>
          )}

          {props.helperText && <FormText>
            {props.helperText}
          </FormText>}
        </div>
      </>
    </div>
  );
};



export const SingleFileUploadInput: React.FC<any> = (props) => {

  const isFileExist = !!props.uploadedFile;
  return (
    <div className={props.formgroupClassName || "tw-mb-3"}>
      {props.labelText && (
        <Label className={`${props.labelClass}`} id={props.name}>
          {props.labelText}
        </Label>
      )}
      <input className="form-control" name={props.name} id={props.name} onChange={props.onChangeFileHndlr} type="file" />
      {props.isUploaded && <div className="tw-flex tw-justify-end tw-mt-1">
        <span className="text-success">Uploaded.</span>
      </div>}
      {props.error && (
        <FormFeedback type="invalid" className="tw-block">{props.error}</FormFeedback>
      )}
      {!props.isUploaded && isFileExist && <div className="tw-flex tw-justify-end tw-mt-1">
        <button type="button"
          data-id={props.dataId}
          className="btn btn-primary"
          onClick={props.uploadHndlr}>Upload</button>
      </div>}

    </div>
  );
};


export const NgFileUploader: React.FC<any> = (props) => {
  const inputFileRef = useRef<any>(null);

  function onClick() {
    if (inputFileRef?.current && inputFileRef?.current?.value) {
      inputFileRef.current.value = null;
    }
  }
  return (
    <div className={classnames("ngfile-uploader", props.formgroupClassName)}>
      <div className="upload-max-width">
        {props.labelText && (
          <Label className={`${props.labelClass}`}>
            {props.labelText}
          </Label>
        )}
        <div className={classnames("upload-container tw-overflow-hidden", props.uploaderClassName)}>
          <div className="file-info">
            <input type="file"
              id={props.name}
              ref={inputFileRef}
              onClick={onClick}
              name={props.name}
              className="d-none"
              onChange={props.onChangeFileHndlr}
            />
            <label htmlFor={props.name} className={classnames("upload-btn-label", {
              "isDisabled": props.isDisabled || false
            })}>
              <div className={classnames("upload-label-btn", props.uploadBtnClassName, { "error-upload": !!props.error })}>
                <div className="file-name">{props.fileName || "No file selected."}</div>
                <i className="plus-icon ri-add-circle-line"></i>
              </div>
            </label>
            {props.isUploaded && <div className="uploaded-text">
              Uploaded.
            </div>}
            {props.error && (
              <FormFeedback type="invalid" className="tw-block">{props.error}</FormFeedback>
            )}
          </div>
          {!props.isUploaded && <div className="uploadbtn-container">
            <button
              data-id={props.dataId}
              type="button" onClick={props.uploadHndlr}
              disabled={props.isDisabled || !props.uploadedFile}
              className="btn btn-orange btn-dc">
              Upload
            </button>
          </div>}
          {props.downloadLink && <div className="uploadbtn-container">
            <a href={props.downloadLink} target="_blank">
              <button
                data-id={props.dataId}
                type="button"
                className="btn btn-light tw-flex tw-items-center">
                <i className="tw-text-gray-500 ri-download-2-line tw-me-1 tw-text-base"></i> Download
              </button>
            </a>
          </div>}
        </div>
      </div>

      {props.previewUrl && <div className="preview-container">
        <img src={props.previewUrl} className="preview-img" />
      </div>}
    </div>

  )
}