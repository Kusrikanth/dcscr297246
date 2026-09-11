import classnames from "classnames";
import React from "react";
import { Input, FormGroup, Label, FormFeedback } from "reactstrap";

interface IRadioInput {
  // eslint-disable-next-line no-restricted-globals
  name: string;
  formgroupClassName?: string | undefined;
  labelText?: string;
  inputClassName?: string;
  value: string | number | undefined | null;
  placeHolder?: string;
  onChange: any;
  invalid?: boolean;
  error?: string;
  isReadOnly?: boolean;
  children?: React.ReactNode;
  menuItems: any[] | undefined;
  labelClass?: string;
}

export const RadioInput: React.FC<IRadioInput> = (props) => {
  return (
    <div className={props.formgroupClassName || "mb-3"}>
      <FormGroup tag="fieldset" className="d-flex flex-wrap align-items-center">
        {props.labelText && (
          <Label className={props.labelClass} htmlFor={props.name}>
            {props.labelText}
          </Label>
        )}

        {props?.menuItems &&
          props?.menuItems.map((item, index) => (
            <FormGroup check key={index} className="">
              <Input
                type="radio"
                name={props.name}
                id={props.name}
                className={classnames(props.inputClassName)}
                onChange={props.onChange}
                value={props.value || ""}
              />
              <Label check>{item?.value}</Label>
            </FormGroup>
          ))}

        {props.error && (
          <FormFeedback type="invalid">{props.error}</FormFeedback>
        )}
      </FormGroup>
    </div>
  );
};

interface IRadioOptions {
  id: string;
  name: string;
  itemDisabled?: boolean;
}

interface IRadioInputContainer {
  // eslint-disable-next-line no-restricted-globals
  name: string;
  formgroupClassName?: string;
  containerClassName?: string;
  radioClassName?: string;
  labelClassName?: string;
  inputContainerClassName?: string;
  radioOptions: Array<IRadioOptions>;
  labelText?: string;
  value?: string;
  onChange?: any;
  invalid?: boolean;
  error?: any;
  isDisabled?: boolean
}

export const RadioInputContainer: React.FC<IRadioInputContainer> = (props) => {
  return (
    <React.Fragment>
      <div className={props.formgroupClassName || "mb-3"}>
        <div className={props.containerClassName}>
          {props.labelText && <Label htmlFor={props.name} className={classnames("form-label", props.labelClassName)}>{props.labelText}</Label>}
          <div className={classnames("d-flex lg-align-items-center lms_radio", props.inputContainerClassName)}>
            {Array.isArray(props.radioOptions) &&
  props.radioOptions.map((item: any, index: any) => (
    <div
      key={`${item.id}-${index}`}
      className={classnames("form-check ", props.radioClassName || "form-radio-primary")}
    >
      <Input
        className="form-check-input d-none" // hide default input
        type="radio"
        name={props.name}
        id={`${props.name}-${item.id}`}
        value={item.id}
        onChange={props.onChange}
        checked={String(item.id) === String(props.value)}
        disabled={item.itemDisabled || props.isDisabled || false}
      />
      <Label
        className={classnames(
          "option-label-circle",
          String(item.id) === String(props.value) ? "checked" : ""
        )}
        htmlFor={`${props.name}-${item.id}`}
      >
        {item.name}
      </Label>
    </div>
))}

                  </div>
        </div>
        {
          props.error && props.invalid && <FormFeedback type="invalid" className="d-block">
            {props.error}
          </FormFeedback>
        }
      </div >


    </React.Fragment >
  )
}
