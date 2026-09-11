import { Input, Label, FormFeedback } from "reactstrap";
import classnames from "classnames";
import { Tooltip } from "reactstrap";
import { useState } from "react";

interface IRadioOptions {
    id: string;
    name: string;
    itemDisabled?: boolean;
}

interface IRadioInputContainer {
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
    isDisabled?: boolean;
    showTooltipIcon?: boolean;
    tooltipText?: string;
}

export const RadioInputContainer: React.FC<IRadioInputContainer> = (props) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const tooltipId = `tooltip-${props.name}`;

    return (
        <div className={props.formgroupClassName || "mb-3"}>
            <div className={classnames("d-flex align-items-center", props.containerClassName)}>
                {/* Label + Tooltip */}
                <div className={classnames("d-flex align-items-center me-4 min-w-150px",props.labelClassName)}>
                    <Label htmlFor={props.name} className="form-label mb-0">
                        {props.labelText}
                    </Label>
                    {props.showTooltipIcon && (
                        <>
                            <i

                                id={tooltipId}
                                className="ms-2 ri-information-line text-muted fs-18"
                                style={{ cursor: "pointer" }}
                            />
                            <Tooltip
                                placement="right"
                                isOpen={tooltipOpen}
                                target={tooltipId}
                                toggle={() => setTooltipOpen(!tooltipOpen)}
                                className="custom-tooltip"
                            >
                                <div dangerouslySetInnerHTML={{ __html: props.tooltipText || "" }} />
                            </Tooltip>
                        </>
                    )}
                </div>

                {/* Radio Buttons */}
                <div className={classnames("d-flex", props.inputContainerClassName)}>
                    {props.radioOptions.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className={classnames("form-check me-3", props.radioClassName || "form-radio-primary")}
                        >
                            <Input
                                className="form-check-input"
                                type="radio"
                                name={props.name}
                                id={`${props.name}-${item.id}`}
                                value={item.id}
                                onChange={props.onChange}
                                checked={item.id === props.value}
                                disabled={item.itemDisabled || props.isDisabled}
                            />
                            <Label className="form-check-label ms-1" htmlFor={`${props.name}-${item.id}`}>
                                {item.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {props.error && props.invalid && (
                <FormFeedback type="invalid" className="d-block">
                    {props.error}
                </FormFeedback>
            )}
        </div>

    );
};
