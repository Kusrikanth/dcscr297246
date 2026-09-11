import React, { useEffect, useRef, useState } from "react";
import DatePicker, { CalendarContainer } from "react-datepicker";
import classnames from "classnames";
import { getDdMmYyyyFormat, getFormYyyyMmDdFormat } from "../../utility/dateutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Portal } from "react-overlays";
import { format, getMonth, getYear, subDays, startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { Calendar03Icon, ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons-pro/core-stroke-standard";

type Iplacement = "top" | "right" | "bottom" | "left" | "top-start" | "top-end" | "right-start" | "right-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end"

type Ifilters = "TODAY" | "YESTERDAY" | "THIS_WEEK" | "LAST_WEEK" | "LAST_30_DAYS" | "LAST_90_DAYS"

interface ICustomDatePicker {
    // eslint-disable-next-line no-restricted-globals
    name: string;
    onChange?: any;
    onBlur?: () => void;
    placeholder?: string;
    isDisabled?: boolean;
    monthsShown?: number;
    formgroupClassName?: string;
    labelText?: string;
    labelClass?: string;
    invalid?: boolean;
    error?: any;
    floatingLabel?: boolean,
    startDate?: string | null,
    endDate?: string | null,
    portalId?: string,
    placement?: Iplacement,
}

const startYear = 1990;
const endYear = getYear(new Date()) + 5;

const years = Array.from({ length: endYear - startYear }, (_, i) => startYear + i);

const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
];

const CalendarContainerWrapper = ({ children, portalId }: any) => {
    const el = document.getElementById(String(portalId))

    return (
        <Portal container={el}>
            {children}
        </Portal>
    )
}

const advanceFilterArr: Array<{ name: string, key: Ifilters }> = [
    { name: "Today", key: "TODAY" },
    { name: "Yesterday", key: "YESTERDAY" },
    { name: "This Week", key: "THIS_WEEK" },
    { name: "Last Week", key: "LAST_WEEK" },
    { name: "Last 30 Days", key: "LAST_30_DAYS" },
    { name: "Last 90 Days", key: "LAST_90_DAYS" },
]

const getStartAndEndDates = (name: Ifilters) => {
    let startDate;
    let endDate;
    switch (name) {
        case "TODAY":
            startDate = endDate = format(new Date(), "yyyy-MM-dd");
            break;
        case "YESTERDAY":
            startDate = endDate = format(subDays(new Date(), 1), "yyyy-MM-dd");
            break;
        case "THIS_WEEK":
            startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
            endDate = format(new Date(), "yyyy-MM-dd");
            break;
        case "LAST_WEEK":
            startDate = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 0 });
            endDate = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 0 });
            break;
        case "LAST_30_DAYS":
            startDate = format(subDays(new Date(), 30), "yyyy-MM-dd");
            endDate = format(new Date(), "yyyy-MM-dd");
            break;
        case "LAST_90_DAYS":
            startDate = format(subDays(new Date(), 90), "yyyy-MM-dd");
            endDate = format(new Date(), "yyyy-MM-dd");
            break;
        default:
            break;
    }
    return { updatedStartDate: startDate, updatedEndDate: endDate }
}

export const CustomDatePicker: React.FC<ICustomDatePicker> = ({
    name,
    onChange,
    onBlur,
    placeholder,
    isDisabled = false,
    monthsShown = 2,
    formgroupClassName,
    labelText,
    labelClass,
    invalid,
    error,
    floatingLabel,
    startDate = null,
    endDate = null,
    portalId,
    placement = "bottom",
}) => {

    const [dateState, setDateState] = useState<any>({ startDate: startDate || "", endDate: endDate || "" });
    const datepickerRef = useRef<any>(null);
    const prevPropsRef = useRef<{ startDate: any, endDate: any }>({ startDate: startDate || null, endDate: endDate || null });

    useEffect(() => {
        if (prevPropsRef.current.startDate !== startDate || prevPropsRef.current.endDate !== endDate) {
            const newStartDate = startDate || "";
            const newEndDate = endDate || "";
            setDateState({ startDate: newStartDate, endDate: newEndDate });
            prevPropsRef.current = { startDate: startDate || null, endDate: endDate || null };
        }
    }, [startDate, endDate])

    const openDatePicker = () => {
        if (datepickerRef.current) {
            datepickerRef.current.setOpen(true);
        }
    };

    const closeDatePicker = () => {
        if (datepickerRef.current) {
            datepickerRef.current.setOpen(false);
        }
    };

    const handleChange = (dates: any) => {
        const [start, end] = dates;
        setDateState({
            startDate: start,
            endDate: end
        })

        if (onChange && typeof onChange === "function" && start && end) {
            onChange({ startDate: getFormYyyyMmDdFormat(start), endDate: getFormYyyyMmDdFormat(end) });
        }
    };

    const MyContainer = ({ className, children }: any) => {
        const filterHndler = (name: Ifilters) => {
            const { updatedEndDate, updatedStartDate } = getStartAndEndDates(name)
            setDateState({ startDate: updatedStartDate, endDate: updatedEndDate })
            if (onChange && typeof onChange === "function") {
                onChange({ startDate: getFormYyyyMmDdFormat(updatedStartDate), endDate: getFormYyyyMmDdFormat(updatedEndDate) });
            }
            closeDatePicker()
        }
        return (
            <CalendarContainer className={classnames(className)}>
                <div id={portalId} className="filter-container">
                    <div className="fs-14 text-center p-2 tw-font-semibold period-container ">
                        Choose a Period
                    </div>
                    <div>
                        {advanceFilterArr.map((item, index) => (
                            <div key={item.key + index} className={`filter-btn`} onClick={() => filterHndler(item.key)}>
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="d-flex">{children}</div>
            </CalendarContainer>
        );
    };

    return (
        <div className={classnames(formgroupClassName || "tw-mb-3")}>
            <div className="custom-range-date-picker-new">
                <div className="floating-label-wrapper">
                    {labelText && (
                        <label
                            className={classnames(labelClass, floatingLabel && "tw-text-[11px] tw-absolute tw--top-2 tw-left-2 tw-bg-white tw-px-1 tw-text-gray-500 tw-transition-all tw-z-10")}
                            htmlFor={name}
                        >
                            {labelText}
                        </label>
                    )}
                    <div className="input-with-icon">
                        <HugeiconsIcon
                            icon={Calendar03Icon}
                            size={18} className="tw-text-gray-500 calendar-icon"
                        />
                        <DatePicker
                            renderCustomHeader={({
                                date,
                                changeYear,
                                changeMonth,
                                decreaseMonth,
                                increaseMonth,
                                prevMonthButtonDisabled,
                                nextMonthButtonDisabled,
                                customHeaderCount,
                            }) => {
                                return (
                                    customHeaderCount === 0 ?
                                        (<div
                                            className="tw-m-2 tw-flex tw-justify-between tw-mb-0"
                                        >
                                            <div className="arrow-btn-container">
                                                <button className="arrow-btn" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                                    <HugeiconsIcon
                                                        icon={ArrowLeft01Icon}
                                                        size={15} className="tw-text-gray-800"
                                                    />
                                                </button>
                                            </div>
                                            <div className="tw-flex tw-w-[60%] tw-justify-center tw-mr-[15%]">
                                                <select
                                                    value={getYear(date)}
                                                    className="tw-me-2 tw-text-[12px] tw-text-black"
                                                    onChange={({ target: { value } }) => changeYear(+value)}
                                                >
                                                    {years.map((option: any) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={months[getMonth(date)]}
                                                    onChange={({ target: { value } }) =>
                                                        changeMonth(months.indexOf(value))
                                                    }
                                                    className="tw-text-[12px] tw-text-black"
                                                >
                                                    {months.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>)
                                        :
                                        (<div
                                            className="tw-m-2 tw-flex tw-justify-between tw-mb-0"
                                        >
                                            <div className="tw-flex tw-w-[60%] tw-justify-center tw-ml-[15%]">
                                                <select
                                                    value={getMonth(date) === 11 ? getYear(date) + 1 : getYear(date)}
                                                    className="tw-me-2 tw-text-[12px] tw-text-black"
                                                    onChange={({ target: { value } }) => {
                                                        if (getMonth(date) === 11) {
                                                            changeYear(+value - 1)
                                                        } else {
                                                            changeYear(+value)
                                                        }
                                                    }}
                                                >
                                                    {years.map((option: any) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={months[getMonth(date) === 11 ? 0 : getMonth(date) + 1]}
                                                    onChange={({ target: { value } }) => {
                                                        const selectedMonth = months.indexOf(value);
                                                        changeMonth(selectedMonth - 1);
                                                    }}
                                                    className="tw-text-[12px] tw-text-black"
                                                >
                                                    {months.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="arrow-btn-container">
                                                <button className="arrow-btn" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                                    <HugeiconsIcon
                                                        icon={ArrowRight01Icon}
                                                        size={15} className="tw-text-gray-800"
                                                    />
                                                </button></div>
                                        </div>)
                                )
                            }}
                            ref={datepickerRef}
                            onChange={handleChange}
                            startDate={dateState.startDate && new Date(dateState.startDate)}
                            endDate={dateState.endDate && new Date(dateState.endDate)}
                            onSelect={(date: Date | null) => {
                                if (date) {
                                    if (!dateState.startDate || (dateState.startDate && dateState.endDate)) {
                                        setDateState({ startDate: date, endDate: null })
                                    } else if (dateState.startDate && !dateState.endDate && date > dateState.startDate) {
                                        closeDatePicker()
                                        setDateState((prev: any) => ({ ...prev, endDate: date }));
                                    } else {
                                        setDateState((prev: any) => ({ ...prev, startDate: date }));
                                    }
                                }
                            }}
                            selectsRange
                            monthsShown={monthsShown}
                            placeholderText={placeholder || "Select a date range"}
                            disabled={isDisabled}
                            onBlur={onBlur}
                            name={name}
                            onKeyDown={(e) => e.preventDefault()}
                            autoComplete="off"
                            className={classnames(invalid && error && " invalid-date-error")}
                            dateFormat={"dd-MM-yyyy"}
                            popperContainer={(props) => <CalendarContainerWrapper  {...props} portalId={portalId} />}
                            value={dateState.startDate && dateState.endDate ? `${getDdMmYyyyFormat(dateState.startDate)} to ${getDdMmYyyyFormat(dateState.endDate)}` : dateState.startDate && !dateState.endDate ? `${getDdMmYyyyFormat(dateState.startDate)} to ` : (dateState.startDate ? getDdMmYyyyFormat(dateState.startDate) : "")}
                            calendarContainer={MyContainer}
                            popperPlacement={placement || "bottom"}
                        />
                    </div>
                </div>
                {
                    invalid && error && <p className="tw-text-red-500 tw-text-xs tw-mt-1">{error}</p>
                }
            </div>
        </div >

    );
};


