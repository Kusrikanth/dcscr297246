import React from "react";
import classnames from "classnames";
import Select from "react-select";

import { Input, FormGroup, Label, FormFeedback } from "reactstrap";

interface ISelectInput {
  // eslint-disable-next-line no-restricted-globals
  name: string;
  formgroupClassName?: string | undefined;
  labelText?: string;
  floatingLabel?: boolean,
  inputClassName?: string;
  value?: string | undefined | null;
  onChange?: any;
  onBlur?: any;
  invalid?: boolean;
  error?: any;
  customWidth?: any;
  valueKey: string;
  textKey: string;
  menuItems: any[] | undefined;
  hideSelectOption?: boolean;
  defaultSelect?: string;
  defaultValue?: string;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  labelClass?: string;
}

export const SelectInput: React.FC<ISelectInput> = (props) => {
  return (
    <div className={classnames(props.formgroupClassName || "tw-mb-3", { "form-floating": props.floatingLabel })}>
      {!props.floatingLabel && props.labelText && (
        <Label className={props.labelClass} htmlFor={props.name}>
          {props.labelText}
        </Label>
      )}
      <Input
        name={props.name}
        id={props.name}
        className={classnames(props.inputClassName)}
        type="select"
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value || ""}
        style={props.customWidth && { width: `${props.customWidth}` }}
        invalid={props.invalid}
        disabled={props.isDisabled || false}
      >
        {!props.hideSelectOption && (
          <option key={"select"} value={props.defaultValue || ""}>
            {props.defaultSelect || "Select"}
          </option>
        )}
        {Array.isArray(props.menuItems) &&
          props.menuItems.map((item) => (
            <option key={item[props.valueKey]} value={item[props.valueKey]}>
              {item[props.textKey]}
            </option>
          ))}
      </Input>
      {props.floatingLabel && props.labelText && (
        <Label className={props.labelClass} htmlFor={props.name}>
          {props.labelText}
        </Label>
      )}
      {props.error && <FormFeedback type="invalid">{props.error}</FormFeedback>}
    </div>
  );
};

export const MemoizedSelectInput = React.memo(SelectInput);

export const SelectWithTextInput: React.FC<any> = (props) => {
  return (
    <div className={props.formgroupClassName || "tw-mb-3"}>
      {props.labelText && (
        <Label className={props.labelClass} htmlFor={props.name}>
          {props.labelText}
        </Label>
      )}
      <Select
        name={props.name}
        value={props.value}
        onChange={props.handleSelect}
        onMenuOpen={() => props.menuOpenHndlr(props.dataIndex)}
        options={props.options}
        placeholder={props.placeHolder}
        onInputChange={props.handleInputChange}
        getOptionLabel={(option) => `${option[props.labelId]}`}
        getOptionValue={(option) => option[props.valueId]}
        isDisabled={props.isDisabled}
        isClearable={true}
      />
      {props.error && (
        <FormFeedback className="tw-block" type="invalid">
          {props.error}
        </FormFeedback>
      )}
    </div>
  );
};

