import React, { Children } from "react";
import classnames from "classnames";
import { Input, FormGroup, Label, FormFeedback } from "reactstrap";
import ReactPhoneInput from "react-phone-input-2";
// import 'react-phone-input-2/lib/plain.css'

interface IPhoneInput {
    // eslint-disable-next-line no-restricted-globals
    name: string;
    formgroupClassName?: (string | undefined);
    labelText?: string;
    inputClassName?: string;
    labelClass?:string;
    value: (string | undefined | null);
    placeHolder?: string;
    onChange: any;
    onBlur?: any;
    invalid?: boolean;
    error?: any;
    isDisabled?: boolean;
    children?: React.ReactNode
}

export const NewPhoneInput: React.FC<IPhoneInput> = (props) => {
    return (
        <div className={props.formgroupClassName || "tw-mb-0"}>
            {props.labelText && <Label className={props.labelClass||""} htmlFor={props.name}>{props.labelText}</Label>}
            {/* <Input type="email"  id="contactPersonNumber" /> */}
            <ReactPhoneInput
                placeholder={props.placeHolder}
                inputClass={classnames("!tw-w-full lh-base !tw-h-auto", (props.inputClassName || ""), {
                    "invalid-number": props.invalid
                })}
                country={'in'}
                onlyCountries={["in"]}
                disableDropdown={true}
                countryCodeEditable={false}
                inputProps={{
                    name: props.name,
                    id: props.name,
                    disabled: props.isDisabled || false
                }}
                value={`91${props.value}`}
                onChange={props.onChange}
                onBlur={props.onBlur}
            />
            {props.error && props.invalid && <FormFeedback type="invalid" className="tw-block">
                {props.error}
            </FormFeedback>}
        </div>
    )
}
