import React, { Children } from "react";
import classnames from "classnames";
import { Input, FormGroup, Label, FormFeedback } from "reactstrap";

export interface IInputCheckboxProps {
    // eslint-disable-next-line no-restricted-globals
    name: string;
    formgroupClassName?: (string | undefined);
    labelName?: string;
    onChange?: any;
    value: boolean;
    isDisabled?: boolean;
    dataId?: any;
    labelClassName?: string;
}
export const InputCheckbox: React.FC<IInputCheckboxProps> = (props) => {
    return (
        <div className={classnames("form-check", (props.formgroupClassName || "tw-mb-2"))} >
            <Input className="form-check-input border-primary" type="checkbox"
                onChange={props.onChange}
                checked={props.value || false}
                id={props.name}
                name={props.name}
                data-id={props.dataId || ""}
                disabled={props.isDisabled || false}
            />
            {(props.labelName) && <Label style={{ fontSize: "10px !important" }}
                className={classnames("form-check-label", props.labelClassName)} htmlFor={props.name}>
                {props.labelName}
            </Label>}
        </div >
    )
}

export const InputCheckboxUpdated: React.FC<any> = (props) => {
    return (
        <div className="tw-flex tw-flex-column">
            <div
                className={classnames(
                    "form-check",
                    props.formgroupClassName || "tw-mb-2"
                )}
            >
                <Input
                    className={classnames("form-check-input", props.inputClassName || '')}
                    type="checkbox"
                    onChange={props.onChange}
                    checked={props.value || false}
                    id={props.name}
                    name={props.name}
                    data-id={props.dataId || ""}
                    disabled={props.isDisabled || false}
                />
                {(props.labelName) && <Label
                    className="form-check-label" htmlFor={props.name}>
                    {props.labelName}
                </Label>}
                {props.children && (
                    <span className="tw-ms-1">{props.children}</span>
                )}
            </div>
            {props.error && props.invalid && (
                <FormFeedback type="invalid" className="tw-block">
                    {props.error}
                </FormFeedback>
            )}
        </div>
    );
};
