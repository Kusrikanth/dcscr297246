import * as React from "react";
import classnames from "classnames";
import { Input, Label, FormFeedback } from "reactstrap";

interface ISelectOptGrup {
  name: string;
  formgroupClassName?: string;
  labelText?: string;
  floatingLabel?: boolean;
  inputClassName?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  invalid?: boolean;
  error?: string | any;
  customWidth?: string | number;
  valueKey: string;
  textKey: string;
  menuItems: any[]; // consider typing this more strictly
  hideSelectOption?: boolean;
  defaultSelect?: string;
  defaultValue?: string | number;
  isDisabled?: boolean;
  labelClass?: string;
}


export const SelectOptGrup: React.FC<ISelectOptGrup> = (props) => {
  const {
    name,
    formgroupClassName,
    labelText,
    floatingLabel,
    inputClassName,
    value,
    onChange,
    onBlur,
    invalid,
    error,
    customWidth,
    valueKey,
    textKey,
    menuItems,
    hideSelectOption,
    defaultSelect,
    defaultValue,
    isDisabled,
    labelClass,
  } = props;

  return (
    <div
      className={classnames(formgroupClassName || "tw-mb-3", {
        "form-floating": floatingLabel,
      })}
    >
      {!floatingLabel && labelText && (
        <Label className={labelClass} htmlFor={name}>
          {labelText}
        </Label>
      )}

      <Input
        name={name}
        id={name}
        className={classnames(inputClassName)}
        type="select"
        onChange={onChange}
        onBlur={onBlur}
        value={value || ""}
        style={customWidth ? { width: customWidth } : undefined}
        invalid={invalid}
        disabled={isDisabled}
      >
        {!hideSelectOption && (
          <option key="select" value={defaultValue || ""}>
            {defaultSelect || "Select"}
          </option>
        )}

        {Array.isArray(menuItems) &&
          menuItems.map((group) => {
            if (Array.isArray(group.options)) {
              return (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((item: any) => (
                    <option key={item[valueKey]} value={item[valueKey]}>
                      {item[textKey]}
                    </option>
                  ))}
                </optgroup>
              );
            } else {
              return (
                <option key={group[valueKey]} value={group[valueKey]}>
                  {group[textKey]}
                </option>
              );
            }
          })}
      </Input>

      {floatingLabel && labelText && (
        <Label className={labelClass} htmlFor={name}>
          {labelText}
        </Label>
      )}

      {error && <FormFeedback type="invalid">{error}</FormFeedback>}
    </div>
  );
};

export const MemoizedSelectOptGrup = React.memo(SelectOptGrup);
