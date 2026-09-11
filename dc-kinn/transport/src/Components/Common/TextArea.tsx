import classnames from "classnames";
import { FormFeedback, FormText, Input, Label } from "reactstrap";

interface ITextInput {
  // eslint-disable-next-line no-restricted-globals
  name: string;
  formgroupClassName?: string | undefined;
  labelText?: string;
  inputClassName?: string;
  value: string | number | undefined | null;
  placeHolder?: string;
  onChange: any;
  onBlur?: any;
  invalid?: boolean;
  error?: any;
  showRemainingChars?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  children?: React.ReactNode;
  height?: string;
  labelClass?: string;
  helperText?: string;
  maxLength?: number;
}

export const TextArea: React.FC<ITextInput> = (props) => {
  return (
    <div className={props.formgroupClassName || "tw-mb-3"}>
      {props.labelText && (
        <Label className={props.labelClass} htmlFor={props.name}>
          {props.labelText}
        </Label>
      )}
      <Input
        name={props.name}
        id={props.name}
        className={classnames(
          props.inputClassName,
          props.isReadOnly && "common_text_input"
        )}
        placeholder={props.placeHolder}
        type="textarea"
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value || ""}
        invalid={props.invalid}
        readOnly={props.isReadOnly || false}
        disabled={props.isDisabled || false}
        maxLength={props.maxLength || 1000}
        style={{ height: props.height }}
      />
      {props.helperText && <FormText>{props.helperText}</FormText>}
      {props.error && <FormFeedback type="invalid">{props.error}</FormFeedback>}
      {props.showRemainingChars && props.maxLength && (
        <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
          {props.value?.toString().length || 0}/{props.maxLength} Characters
        </p>
      )}
    </div>
  );
};
