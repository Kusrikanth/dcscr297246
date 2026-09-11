import React, { Children, ReactNode, useEffect, useMemo } from "react";
import classnames from "classnames";
import { Input, FormGroup, Label, FormFeedback, FormText } from "reactstrap";


interface ITextInput {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    formgroupClassName?: (string | undefined),
    labelText?: string | ReactNode,
    floatingLabel?: boolean,
    inputClassName?: string,
    value?: (string | number | undefined | null),
    placeHolder?: string,
    onChange?: any,
    onBlur?: any,
    customWidth?: any,
    invalid?: boolean,
    error?: any,
    isReadOnly?: boolean,
    isDisabled?: boolean,
    children?: React.ReactNode,
    helperText?: string,
    labelClass?: string;
    maxLength?: number;
    autoComplete?: string;
    autoFocus?: boolean;
    inputType?: ("text" | "password" | "number");
    placeholder?: string;
}

export const TextInput: React.FC<ITextInput> = (props) => {
    return (
        <div className={classnames(props.formgroupClassName || "mb-3", { "form-floating": props.floatingLabel })}>
            {!props.floatingLabel && props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
            <Input
                name={props.name}
                id={props.name}
                className={classnames(props.inputClassName)}
                placeholder={props.placeHolder || ""}
                type={props.inputType || "text"}
                onChange={props.onChange}
                onBlur={props.onBlur}
                value={props.value || ""}
                invalid={props.invalid}
                style={props.customWidth && { minWidth: `${props.customWidth}` }}
                disabled={props.isDisabled || false}
                readOnly={props.isReadOnly || false}
                maxLength={props.maxLength || 45}
                autoComplete={props.autoComplete || "off"}
                autoFocus={props.autoFocus || false}
            />
            {props.floatingLabel && props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
            {props.helperText && <FormText>
                {props.helperText}
            </FormText>}
            {props.error && <FormFeedback type="invalid">
                {props.error}
            </FormFeedback>}

        </div>
    )
}


interface ITextIconInput {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    formgroupClassName?: (string | undefined),
    labelText?: string,
    floatingLabel?: boolean,
    inputClassName?: string,
    value?: (string | number | undefined | null),
    placeHolder?: string,
    onChange?: any,
    onBlur?: any,
    invalid?: boolean,
    error?: any,
    isReadOnly?: boolean,
    isDisabled?: boolean,
    children?: React.ReactNode,
    helperText?: string,
    iconPositionClassName?: string,
    inputType?: ("text" | "password" | "number"),
    labelClass?: string,
    maxLength?: number,
    autoComplete?: string,
}

export const TextIconInput: React.FC<ITextIconInput> = (props) => {
    return (
        <div className={props.formgroupClassName || "mb-3"}>
            {!props.floatingLabel && props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
            {/* <div className={`form-icon ${props.iconPositionClassName || ""}`}> */}
            <div className={classnames(props.iconPositionClassName || "", {"form-floating":props.floatingLabel},"form-icon")}>
                <Input
                    name={props.name}
                    id={props.name}
                    className={classnames("form-control-icon", props.inputClassName)}
                    placeholder={props.placeHolder || ""}
                    type={props.inputType || "text"}
                    onChange={props.onChange}
                    onBlur={props.onBlur}
                    value={props.value || ""}
                    invalid={props.invalid}
                    disabled={props.isDisabled || false}
                    readOnly={props.isReadOnly || false}
                    maxLength={props.maxLength || 45}
                    // autoComplete="off"
                    autoComplete={props.autoComplete || "off"}
                />
                {props.floatingLabel && props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
                {props.children}
            </div>
            {props.helperText && <FormText>
                {props.helperText}
            </FormText>}
            {props.error && props.invalid && <FormFeedback className="d-block" type="invalid">
                {props.error}
            </FormFeedback>}
        </div>
    )
}


interface ITextInputWithRegex {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    formgroupClassName?: (string | undefined),
    labelText?: string,
    inputClassName?: string,
    value?: (string | number | undefined | null),
    floatingLabel?: boolean,
    placeHolder?: string,
    onChange?: any,
    onBlur?: any,
    invalid?: boolean,
    error?: any,
    isReadOnly?: boolean,
    isDisabled?: boolean,
    children?: React.ReactNode,
    helperText?: string,
    labelClass?: string;
    allowedInputRegex?: string;
    maxLength?: number;
    iconPositionClassName?: string,
    autoFocus?: boolean;
}

export const TextInputWithRegex: React.FC<ITextInputWithRegex> = (props) => {
    const regexValue = useMemo(() => {
        if (props.allowedInputRegex) {
            return new RegExp(props.allowedInputRegex);
        } else {
            return undefined;
        }
    }, [props.allowedInputRegex]);
    function onChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        if (regexValue) {
            if (!value || regexValue.test(value)) {
                props.onChange(event);
            } else {
                return;
            }
        } else {
            props.onChange(event);
        }
    }

    return (
       <div className={classnames(props.formgroupClassName || "mb-3", { "form-floating": props.floatingLabel })}>
            {!props.floatingLabel && props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
            <Input
                name={props.name}
                id={props.name}
                className={classnames(props.inputClassName)}
                placeholder={props.placeHolder}
                type="text"
                onChange={onChangeHndlr}
                onBlur={props.onBlur}
                value={props.value || ""}
                invalid={props.invalid}
                maxLength={props.maxLength || 45}
                disabled={props.isDisabled || false}
                readOnly={props.isReadOnly || false}
                autoComplete="off"
                autoFocus={props.autoFocus || false}
            />
            {props.floatingLabel && props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
            {props.children}
            {props.helperText && <FormText>
                {props.helperText}
            </FormText>}
            {props.error && <FormFeedback type="invalid">
                {props.error}
            </FormFeedback>}
        </div>
    )
}


interface ITextInputGroup {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    formgroupClassName?: (string | undefined),
    inputgroupClassName?: (string | undefined),
    labelText?: string,
    inputClassName?: string,
    value?: (string | number | undefined | null),
    nullValue?: any;
    placeHolder?: string,
    onChange?: any,
    onBlur?: any,
    invalid?: boolean,
    error?: any,
    isReadOnly?: boolean,
    isDisabled?: boolean,
    children?: React.ReactNode,
    helperText?: string,
    groupClassName?: string,
    labelClass?: string;
    inputType?: "text";
    inputGroupStart?: boolean;
    allowedInputRegex?: string;
    maxLength?: number;
}

export const TextInputGroup: React.FC<ITextInputGroup> = (props) => {
    const regexValue = useMemo(() => {
        if (props.allowedInputRegex) {
            return new RegExp(props.allowedInputRegex);
        } else {
            return undefined;
        }
    }, [props.allowedInputRegex]);

    function onChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        if (regexValue) {
            if (!value || regexValue.test(value)) {
                props.onChange(event);
            } else {
                return;
            }
        } else {
            props.onChange(event);
        }
    }
    return (
        <div className={props.formgroupClassName || "tw-mb-3"}>
            {props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
            <div className={classnames("input-group", props.inputgroupClassName)}>
                {props.inputGroupStart && <span className="input-group-text" style={{height:`${props.groupClassName || ""}`}} id={`${props.name}-group`}>
                    {props.children}
                </span>}
                <Input name={props.name}
                    type={props.inputType}
                    maxLength={props.maxLength || 45}
                    value={props.value || ""}
                    onChange={onChangeHndlr}
                    onBlur={props.onBlur}
                    readOnly={props.isReadOnly}
                    disabled={props.isDisabled}
                    invalid={props.invalid}
                    className={classnames("form-control", props.inputClassName)}
                    placeholder={props.placeHolder}
                />
                {!props.inputGroupStart && <span className="input-group-text" id={`${props.name}-group`}>
                    {props.children}
                </span>}
                {props.error && props.invalid && <FormFeedback className="tw-block" type="invalid">
                    {props.error}
                </FormFeedback>}
            </div>
        </div>
    )
}