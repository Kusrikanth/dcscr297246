import React from "react";
import classnames from "classnames";
import {  Label, FormFeedback, FormText } from "reactstrap";
import 'react-quill/dist/quill.snow.css';
// import ReactQuill from "react-quill";
const ReactQuill = React.lazy(() => import("react-quill"));

interface IQuillEditor {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    formgroupClassName?: (string | undefined),
    labelText?: string,
    inputClassName?: string,
    value?: any,
    placeHolder?: string,
    onChange?: any,
    onBlur?: any,
    invalid?: boolean,
    error?: any,
    isReadOnly?: boolean,
    helperText?: string,
    labelClass?: string;
}

export const QuillEditor: React.FC<IQuillEditor> = (props) => {

    return (
        <div className={props.formgroupClassName || "tw-mb-3"}>
            {props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
             <ReactQuill
               value={props.value || ""}
               onChange={props.onChange}
            //    modules={modules}
            //    formats={formats}
            //    className={`${props.invalid && props.error && "border border-danger rounded quill-border"} ${props.inputClassName}`}
               className={classnames(props.inputClassName)}
               id={props.name}
               placeholder={props.placeHolder}
               onBlur={props.onBlur}
               readOnly={props.isReadOnly}
             />
            {props.helperText && <FormText>
                {props.helperText}
            </FormText>}
            {props.error && <FormFeedback type="invalid">
                {props.error}
            </FormFeedback>}

        </div>
    )
}
