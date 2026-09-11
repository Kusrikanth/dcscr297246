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
    <div className={props.formgroupClassName || "tw-mb-3"}>
      <FormGroup tag="fieldset" className="tw-flex tw-flex-wrap tw-items-center">
        {props.labelText && (
          <Label className={props.labelClass} htmlFor={props.name}>
            {props.labelText}
          </Label>
        )}

        {props?.menuItems &&
          props?.menuItems.map((item, index) => (
            <FormGroup check key={index} className="tw-me-3">
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
  // eslint-disable-next-line no-restricted-globals
  name: string | React.ReactNode;
  itemDisabled ?: boolean;
  /** Optional line of context rendered under the option label. */
  description?: string;
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
      <div className={props.formgroupClassName || "tw-mb-3"}>
        <div className={props.containerClassName}>
          {props.labelText && <Label htmlFor={props.name} className={classnames("form-label", props.labelClassName)}>{props.labelText}</Label>}
          <div className={classnames("tw-flex lg:tw-items-center", props.inputContainerClassName)}>
            {
              Array.isArray(props.radioOptions) && props.radioOptions.map((item: any, index: any) => (
                <div key={`${item.id}-${item.index}`}
                  className={classnames("form-check tw-me-2", (props.radioClassName || "form-radio-primary"))}>
                  <Input className="form-check-input" type="radio"
                    name={props.name}
                    id={`${props.name}-${item.id}`}
                    value={item.id}
                    onChange={props.onChange}
                    checked={item.id === props.value}
                    disabled={item.itemDisabled || props.isDisabled || false}
                  />
                  <Label className="form-check-label tw-ms-1" htmlFor={`${props.name}-${item.id}`}>
                    <div >{item.name}</div>
                    {item.description && (
                      <div className="text-muted small">{item.description}</div>
                    )}
                  </Label>
                </div>
              ))
            }
          </div>
        </div>
        {
          props.error && props.invalid && <FormFeedback type="invalid" className="tw-block">
            {props.error}
          </FormFeedback>
        }
      </div >


    </React.Fragment >
  )
}
