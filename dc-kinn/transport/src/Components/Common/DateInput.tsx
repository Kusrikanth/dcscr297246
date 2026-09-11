import React, { Children, ReactNode } from "react";
import classnames from "classnames";
import { Input, FormGroup, Label, FormFeedback } from "reactstrap";
import { MinDate_Calendar, MaxDate_Calendar, MinDateEmployee_Calendar } from "../../utility/dateutility";

interface IDateInput {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    formgroupClassName?: (string | undefined),
    labelText?: string | ReactNode,
    inputClassName?: string,
    floatingLabel?: boolean,
    value?: (string | number | undefined | null),
    placeHolder?: string,
    onChange?: any,
    onBlur?: any,
    invalid?: boolean,
    error?: any,
    isReadOnly?: boolean,
    isDisabled?: boolean,
    children?: React.ReactNode;
    labelClass?: string;
    minDate?: string;
    maxDate?: string;
    inputType?: ("date" | "datetime-local");
    isEmployee?: boolean;
}

export const DateInput: React.FC<IDateInput> = (props) => {
    const minDate = props.isEmployee ? MinDateEmployee_Calendar : MinDate_Calendar;
    return (
        <div className={classnames(props.formgroupClassName || "tw-mb-3", { "form-floating": props.floatingLabel })}>
            {!props.floatingLabel && props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText} </Label>}
            <Input
                name={props.name}
                id={props.name}
                className={classnames("tw-text-start", props.inputClassName)}
                placeholder={props.placeHolder}
                type={props.inputType || "date" }
                onChange={props.onChange}
                onBlur={props.onBlur}
                disabled={props.isDisabled || false}
                value={props.value || ""}
                invalid={props.invalid}
                readOnly={props.isReadOnly || false}
                min={props.minDate || minDate}
                max={props.maxDate || MaxDate_Calendar}
            />
            {props.floatingLabel && props.labelText && (
                <Label className={props.labelClass} htmlFor={props.name}>
                    {props.labelText}
                </Label>
            )}
            {props.error && <FormFeedback type="invalid">
                {props.error}
            </FormFeedback>}
        </div>
    )
}