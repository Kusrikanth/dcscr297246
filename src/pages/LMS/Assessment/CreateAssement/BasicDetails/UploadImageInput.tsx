import { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { Input, FormGroup, Label, FormFeedback, FormText } from "reactstrap";

interface ITextInput {
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
export const UploadImageInput: React.FC<ITextInput> = (props) => {
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
  <div className="d-flex align-items-center gap-3">
    {props.labelText && (
      <label className={`${props.labelClass} form-label mb-0`} htmlFor={props.name}>
        {props.labelText}
      </label>
    )}

    <div>
      <label
        htmlFor={props.name}
        className="btn btn-outline-primary mb-0"
        style={{
          fontWeight: 500,
          fontSize: "14px",
          cursor: props.isDisabled ? "not-allowed" : "pointer",
          opacity: props.isDisabled ? 0.6 : 1
        }}
      >
        Select File
      </label>
      <input
        type="file"
        name={props.name}
        id={props.name}
        ref={inputFileRef}
        onClick={onClick}
        onChange={props.onChange}
        className="d-none"
        disabled={props.isDisabled || false}
        readOnly={props.isReadOnly || false}
      />
    </div>
  </div>

  {props.error && (
    <FormFeedback type="invalid" className="d-block">
      {props.error}
    </FormFeedback>
  )}

  {props.helperText && <FormText>{props.helperText}</FormText>}
</div>

  );
};