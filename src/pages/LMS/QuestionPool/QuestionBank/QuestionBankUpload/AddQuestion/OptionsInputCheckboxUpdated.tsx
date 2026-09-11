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
}
export const InputCheckbox: React.FC<IInputCheckboxProps> = (props) => {
    return (
        <div className={classnames("form-check", (props.formgroupClassName || "mb-2"))} >
            <Input className="form-check-input border-primary" type="checkbox"
                onChange={props.onChange}
                checked={props.value || false}
                id={props.name}
                name={props.name}
                data-id={props.dataId || ""}
                disabled={props.isDisabled || false}
            />
            {(props.labelName) && <Label style={{ fontSize: "10px !important" }}
                className="form-check-label" htmlFor={props.name}>
                {props.labelName}
            </Label>}
        </div >
    )
}

export const InputCheckboxUpdated: React.FC<any> = (props) => {
    const checkboxId = props.name;

    return (
        <div className={classnames("form-check lms_radio", props.formgroupClassName || "mb-2")}>
            <div className="option-check-container">
                <Input
                    type="checkbox"
                    className="option-check-hidden"
                    id={checkboxId}
                    name={props.name}
                    checked={props.value || false}
                    onChange={props.onChange}
                    disabled={props.isDisabled || false}
                />
                <Label
                    htmlFor={checkboxId}
                    className="option-check-label"
                >
                    {props.labelName}
                </Label>
            </div>
        </div>
    );
};
