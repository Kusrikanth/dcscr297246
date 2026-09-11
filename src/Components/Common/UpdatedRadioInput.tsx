import classnames from "classnames";
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
}

export const UpdatedRadioInput: React.FC<IRadioInput> = (props) => {
  return (
    <div className={props.formgroupClassName || "tw-mb-3"}>
      <FormGroup tag="fieldset" className="tw-flex-wrap tw-items-center">
        {props.labelText && (
          <Label htmlFor={props.name} className="tw-mb-3 tw-block">
            {props.labelText}
          </Label>
        )}

        {props?.menuItems &&
          props?.menuItems.map((item, index) => (
            <FormGroup check key={index} className="tw-inline-block tw-me-3">
              <Input
                type="radio"
                name={props.name}
                id={props.name}
                className={classnames(props.inputClassName)}
                onChange={props.onChange}
                value={props.value || ""}
                readOnly={props.isReadOnly}
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
