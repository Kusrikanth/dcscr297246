import { Input, Label } from "reactstrap";
import classnames from "classnames";

interface ISwitchProps {
    className?: string;
    labelName?: string;
    labelClass?: string;
    dataId?: string;
    attributeId: string;
    checked?: boolean;
    onChangeHndlr?: any;
    isDisabled?: any
}

export const Switch: React.FC<ISwitchProps> = ({
    dataId, attributeId, className, checked, labelName, onChangeHndlr, isDisabled, labelClass
}) => {
    return (
        <div
            className={classnames("form-check form-switch form-switch-success", className)}>
            <Input data-id={dataId} type="checkbox" checked={checked} onChange={onChangeHndlr} className="form-check-input"
                id={attributeId} name={attributeId} disabled={isDisabled} />
            <Label className={`${labelClass ? labelClass : "form-check-label tw-me-1"}`} htmlFor={attributeId}>{labelName}</Label>
        </div>

    )
}

{/*  */ }