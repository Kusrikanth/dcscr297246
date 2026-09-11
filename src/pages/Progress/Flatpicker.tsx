import React, { useRef, useState } from "react";
import { Label, FormFeedback } from "reactstrap";
import classNames from "classnames";
import Flatpickr from "react-flatpickr"

export interface IFlatPicker {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    formgroupClassName?: (string | undefined),
    labelText?: string,
    inputClassName?: string,
    value?: (string | number | Date),
    dateMode?: any,
    dateFormat?: any,
    callbackDateFormat?: ("yyyy-MM-dd" | "dd-MM-yyyy" | "MM-dd-yyyy"),
    enableTime?: boolean,
    noCalendar?: boolean,
    placeHolder?: string,
    onChange?: any,
    onBlur?: any,
    invalid?: boolean,
    error?: any,
    isReadOnly?: boolean,
    labelClass?: string;
    minDate?: string;
    maxDate?: string;
}

export default function FlatPicker({ enableTime = false, noCalendar = false,
    dateMode = "single", dateFormat = "d-m-Y", placeHolder = "dd-mm-yyyy", ...otherProps
}: IFlatPicker) {
    const [startDate, setStartDate] = useState<Date | string | number>("");
    const flatPickerInstanceRef = useRef<any>(null);
    function onChangeHndlr(date: any, info: any) {
        // setStartDate(dateSelected);
        // if (dateSelected) {
        //     const returnDateFormat = getParticularFormatDate(dateSelected, callbackDateFormat);
        //     selectedDateFormat.current = returnDateFormat;
        //     onChange(name, returnDateFormat, event);
        // }
    }

    function openCalendarHndlr() {
        if (flatPickerInstanceRef.current)
            flatPickerInstanceRef?.current?.flatpickr.open()
    }

    function clearCalendarHndlr() {
        if (flatPickerInstanceRef.current)
            flatPickerInstanceRef?.current?.flatpickr.clear();
    }

    function valueUpdateHndlr(inputDate: any) {
    }

    function onKeyDownHndlr() {
    }

    function onBlurHndlr() {
    }
    function onTimeUpdateHndlr() {
    }
    return (
        <div className={classNames("form-group flatpicker-calendar-wrapper", otherProps.formgroupClassName)}>
            {otherProps.labelText && <Label htmlFor={otherProps.name}>{otherProps.labelText}</Label>}
            {/* <Input type="email"  id="contactPersonNumber" /> */}
            <div className="input-group tw-mb-3">
                <Flatpickr
                    ref={flatPickerInstanceRef}
                    className="form-control tw-pe-4"
                    value={startDate}
                    onChange={onChangeHndlr}
                    onBlur={onBlurHndlr}
                    onTimeUpdate={onTimeUpdateHndlr}
                    placeholder={placeHolder}
                    onKeyDown={onKeyDownHndlr}

                    options={{
                        onValueUpdate: valueUpdateHndlr,
                        mode: dateMode,
                        allowInput: true,
                        dateFormat: dateFormat,
                        enableTime: enableTime,
                        noCalendar: noCalendar,
                    }}
                />
                {startDate && <span className="clear-calendar-date" onClick={clearCalendarHndlr} id="basic-addon1">
                    <i className="ri-close-circle-fill text-primary tw-cursor-pointer"></i>
                </span>}
                <span className="input-group-text" onClick={openCalendarHndlr} id="basic-addon1">
                    {noCalendar ? <i className="ri-time-line tw-cursor-pointer"></i> :
                        <i className="ri-calendar-2-line tw-cursor-pointer"></i>
                    }
                </span>
            </div>

            {otherProps.error && otherProps.invalid && <FormFeedback type="invalid" className="tw-block">
                {otherProps.error}
            </FormFeedback>}
        </div>

    )
}