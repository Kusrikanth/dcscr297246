import { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { Input, FormGroup, Label, FormFeedback, FormText } from "reactstrap";
import DPSLogoSM from "../../assets/imagesdps/mastersetup/dps_logo.png";
import DefaultUserImg from "../../assets/imagesdps/default-upload-img.png";
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Attachment02StrokeStandard,
} from "@hugeicons-pro/core-stroke-standard";
import { twMerge } from "tailwind-merge";
import Button from "./Button";

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
  uploadHandler?: any;
  /** Passed to the hidden file input, so the picker offers only these types. */
  acceptFileFormat?: string;
}

export const UploadFileCommunication: React.FC<ITextInput> = (props) => {
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
    <div className={props.formgroupClassName || "tw-mb-3"}>
      <>
        <div className="tw-flex tw-flex-col">
          {props.labelText && (
            <Label className={twMerge("tw-font-medium tw-text-[15px] tw-mb-2 upload_input_label", props.labelClass)}>
              {props.labelText}
            </Label>
          )}

          <div className="tw-flex tw-items-center tw-flex-wrap">
            <Label
              className={twMerge(
                "tw-flex tw-items-center tw-justify-center tw-rounded-md tw-self-start tw-py-2 tw-px-4 tw-bg-[#F3F4F6] tw-mr-3",
                "tw-border tw-border-[#ced4da]",
                "tw-transition-colors tw-duration-200 hover:tw-bg-gray-200 !tw-mb-0",
                props.isDisabled
                  ? "tw-opacity-50 tw-cursor-not-allowed tw-pointer-events-none"
                  : "tw-cursor-pointer"
              )}
              htmlFor={props.name}
            >
              <HugeiconsIcon
                size={20}
                className="tw-rotate-45"
                icon={Attachment02StrokeStandard}
              />
              <span className="tw-ml-2">Attach File</span>
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
              accept={props.acceptFileFormat}
              // value={props.value || ""}
              readOnly={props.isReadOnly || false}
              disabled={props.isDisabled || false}
              hidden
            />
            <div className="tw-flex tw-items-center">
              <h6 className="tw-text-gray-500 tw-mb-0 tw-font-medium" id={props.name}>
                {props.value ? props.value : "No file chosen"}
              </h6>
              {props.canRemove && props.value &&
                <i title="Remove" onClick={removeHandler} className="ri-close-line tw-flex-shrink-0 tw-ms-2 tw-text-red-500 tw-text-xs tw-cursor-pointer"></i>}

            </div>
            {!props.hideUploadBtn && (
              <Button
                type="button"
                variant="info"
                className="tw-ml-auto"
                // htmlFor={props.name}
                onClick={props.uploadHandler}
              >
                Upload
              </Button>
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

