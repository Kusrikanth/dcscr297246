import React, { Children } from "react";
import classnames from "classnames";
import { Input, FormGroup, Label, FormFeedback } from "reactstrap";
import { MinDate_Calendar, MaxDate_Calendar } from "../../utility/dateutility";

interface IDateInput {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    formgroupClassName?: (string | undefined),
    labelText?: string,
    inputClassName?: string,
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
}

export const TimeInput: React.FC<IDateInput> = (props) => {
    return (
        <div className={props.formgroupClassName || "mb-3"}>
            {props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
            <Input
                name={props.name}
                id={props.name}
                className={classnames(props.inputClassName)}
                placeholder={props.placeHolder}
                type="time"
                onChange={props.onChange}
                disabled={props.isDisabled || false}
                onBlur={props.onBlur}
                value={props.value || ""}
                invalid={props.invalid}
                readOnly={props.isReadOnly || false}
            />
            {props.error && <FormFeedback type="invalid">
                {props.error}
            </FormFeedback>}
        </div>
    )
}