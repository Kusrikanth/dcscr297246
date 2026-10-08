import React from "react";
import classnames from "classnames";
import { Label, FormFeedback, FormText } from "reactstrap";
import 'react-quill/dist/quill.snow.css';
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
    /** Quill modules config (e.g. a custom toolbar). Defaults to Quill's full snow toolbar. */
    modules?: Record<string, unknown>;
    /** Whitelist of formats the editor accepts (typed or pasted). */
    formats?: string[];
    /** Minimum height of the editing area, e.g. "160px". */
    minHeight?: string;
}

export const QuillEditor: React.FC<IQuillEditor> = (props) => {
    const wrapperStyle = props.minHeight
        ? ({ "--ql-min-height": props.minHeight } as React.CSSProperties)
        : undefined;

    return (
        <div className={props.formgroupClassName || "tw-mb-3"}>
            {props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
            <div className={classnames(props.invalid && "quill-invalid")} style={wrapperStyle}>
                <ReactQuill
                    value={props.value || ""}
                    onChange={props.onChange}
                    modules={props.modules}
                    formats={props.formats}
                    className={classnames(props.inputClassName)}
                    id={props.name}
                    placeholder={props.placeHolder}
                    onBlur={props.onBlur}
                    readOnly={props.isReadOnly}
                />
            </div>
            {props.helperText && <FormText>
                {props.helperText}
            </FormText>}
            {props.error && <FormFeedback type="invalid" className="d-block">
                {props.error}
            </FormFeedback>}

        </div>
    )
}
