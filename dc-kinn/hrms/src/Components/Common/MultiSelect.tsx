import React from "react";
import Select, { ActionMeta, OnChangeValue } from "react-select";
import { Label, FormFeedback } from "reactstrap";

interface IMultiSelect {
  // eslint-disable-next-line no-restricted-globals
  name: string;
  /** react-select works on option objects, so the selected list is passed through as-is. */
  value?: string | string[] | object[];
  formgroupClassName?: string | undefined;
  labelText?: string;
  inputClassName?: string;
  //   value: string | undefined | null;
  onChange: any;
  onBlur?: any;
  //   invalid?: boolean;
  error?: string | any;
  textKey: string;
  valueKey: string;
  menuItems: any[] | undefined;
  defaultValue?: any[];
  labelClass?: string;
  isDisabled?: boolean;
  closeMenuOnSelect?: boolean;
}

export const MultiSelect: React.FC<IMultiSelect> = (props) => {
  const onChange = (
    newValue: OnChangeValue<any, true>,
    actionMeta: ActionMeta<any>
  ) => {
    props.onChange(newValue);
  };

  return (
    <>
      <div className={props.formgroupClassName || "tw-mb-3"}>
        {props.labelText && (
          <Label className={props.labelClass} htmlFor={props.name}>
            {props.labelText}
          </Label>
        )}

        <Select
          name={props.name}
          id={props.name}
          className={`${props.inputClassName} multi_select border-danger`}
          isMulti
          value={props.value}
          defaultValue={props?.defaultValue}
          onChange={onChange}
          onBlur={props.onBlur}
          options={props?.menuItems}
          getOptionLabel={(option) => option[props?.textKey]}
          getOptionValue={(option) => option[props?.valueKey]}
          isDisabled={props.isDisabled || false}
          closeMenuOnSelect={typeof (props.closeMenuOnSelect) === 'boolean' ? (props.closeMenuOnSelect) : true}
          styles={{
            option: (styles) => ({
              ...styles,
              backgroundColor: "white",
              ":hover": {
                ...styles[":hover"],
                backgroundColor: "#405189",
                color: "white",
              },
            }),
          }}
        />

        {props.error && (
          <FormFeedback type="invalid" className="tw-block">{props.error}</FormFeedback>
        )}
      </div>
    </>
  );
};
