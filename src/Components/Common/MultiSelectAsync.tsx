
import React from 'react';
import AsyncSelect from 'react-select/async';
import { ActionMeta,OnChangeValue  } from 'react-select';
import { Label, FormFeedback } from 'reactstrap';

interface IMultiSelectAsync {
  // eslint-disable-next-line no-restricted-globals
  name?: string;
  value?: string | string[];
  formgroupClassName?: string | undefined;
  labelText?: string;
  inputClassName?: string;
  onChange: any;
  onBlur?: any;
  menuItems: any[];
  error?: string | any;
  textKey: any;
  onSearchHndler?:any;
  valueKey: any;
}

export const MultiSelectAsync: React.FC<IMultiSelectAsync> = (props) => {

    const filterColorsAsync = async (inputValue: string) => {
        // Simulate an asynchronous call, e.g., API request
        props.onSearchHndler(inputValue)
        const filteredOptions = props.menuItems.filter((i: any) =>
          i.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        return [{ options: filteredOptions }];
      };

  const onChangeAsync = async (
    newValue: OnChangeValue<any, true>,
    actionMeta: ActionMeta<any>
  ) => {
    props.onChange(newValue);
  };

  return (
    <>
      <div className={props.formgroupClassName || '!tw-mb-3'}>
        {props.labelText && (
          <Label htmlFor={props.name}>{props.labelText}</Label>
        )}

        <AsyncSelect
          name={props.name}
          id={props.name}
          className={`${props.inputClassName} multi_select border-danger`}
          isMulti
          value={props.value}
          onChange={onChangeAsync}
          onBlur={props.onBlur}
          options={props.menuItems}
          loadOptions={filterColorsAsync}
          getOptionLabel={(option) => option[props.textKey]}
          getOptionValue={(option) => option[props.valueKey]}
          styles={{
            option: (styles) => ({
              ...styles,
              backgroundColor: 'white',
              ':hover': {
                ...styles[':hover'],
                backgroundColor: '#405189',
                color: 'white',
              },
            }),
          }}
        />

        {props.error && (
          <FormFeedback type="invalid" className="tw-block">
            {props.error}
          </FormFeedback>
        )}
      </div>
    </>
  );
};
