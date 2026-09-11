import React, { useEffect, useRef, useState, forwardRef, ReactText } from "react";
import { registerLocale, setDefaultLocale } from "react-datepicker";
// import es from 'date-fns/locale/en-IN';
import ReactDatePicker from "react-datepicker";
import { getParticularFormatDate, getValidDate } from "../../utility/dateutility";
import "react-datepicker/dist/react-datepicker.css";

// registerLocale('es', es);

interface IDatePicker {
    // eslint-disable-next-line no-restricted-globals
    name: string,
    formgroupClassName?: (string | undefined),
    labelText?: string,
    inputClassName?: string,
    value?: (string | undefined | null),
    callbackDateFormat?: ("yyyy-MM-dd" | "dd-MM-yyyy" | "MM-dd-yyyy"),
    placeHolder?: string,
    // eslint-disable-next-line no-restricted-globals
    onChange: (name: string, returnDateFormat: string | undefined, event: React.ChangeEvent<HTMLInputElement>) => void,
    onBlur?: any,
    invalid?: boolean,
    error?: any,
    isReadOnly?: boolean,
    children?: React.ReactNode;
    labelClass?: string;
    minDate?: string;
    maxDate?: string;
}

export const Datepicker = ({ name, value, onChange, onBlur, callbackDateFormat = "yyyy-MM-dd" }: IDatePicker) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const selectedDateFormat = useRef<string | undefined | null>("");

    useEffect(() => {
        if (value !== selectedDateFormat.current) {
            const validDate = getValidDate(value);
            setStartDate(validDate);
        }
        selectedDateFormat.current = value;
    }, [value]);

    function onChangeDateHndlr(dateSelected: Date | null, event: React.ChangeEvent<HTMLInputElement>) {
        setStartDate(dateSelected);
        if (dateSelected) {
            const returnDateFormat = getParticularFormatDate(dateSelected, callbackDateFormat);
            selectedDateFormat.current = returnDateFormat;
            onChange(name, returnDateFormat, event);
        }
    }

    // const ExampleCustomInput = forwardRef(({ value, onChange, onClick }: any, ref: any) => {
    //     return (
    //         <input type="text"
    //             defaultValue={value}
    //             onClick={onClick} ref={ref}
    //         />
    //     )
    // });


    function onClickOutHndlr() {
    }

    function onKeyDownHndlr(event: React.KeyboardEvent<HTMLInputElement>) {
        const { code, key } = event;
        if (code === "Tab" && datePickerRef.current) {
            datePickerRef?.current.setOpen(false);
        }
    }

    const datePickerRef = useRef<any>(null);

    function clickHndlr(){
    }
    return (
        <>
            <ReactDatePicker
                key="testing"
                ref={datePickerRef}
                showIcon
                id={name}
                name={name}
                selected={startDate}
                onChange={onChangeDateHndlr}
                dateFormat="dd-MM-yyyy hh:mm aa"
                className="form-control"
                // onBlur={onBlur}
                enableTabLoop={false}
                showTimeSelect={true}
                onKeyDown={onKeyDownHndlr}
                isClearable
                autoComplete="off"
                timeIntervals={15}
                todayButton="Today"
                shouldCloseOnSelect={true}
                showPopperArrow={false}
                // showFourColumnMonthYearPicker

                // showYearPicker={true}
                // showMonthYearPicker={true}
                // onClickOutside={onClickOutHndlr}
                // customInput={<ExampleCustomInput />}
                placeholderText="View blur callbacks in console"
            />
            <input type="button" value="click me" onClick={clickHndlr}/>
        </>
    )
}