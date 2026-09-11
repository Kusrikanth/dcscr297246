import React, { useState, useRef, useEffect, useCallback } from "react";
import useDropdownPosition from "../../hooks/usedropdownposition";
import { debounce } from "../../utility/commonutility";
import classNames from "classnames";
import { createPortal } from "react-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Tick02Icon } from "@hugeicons-pro/core-stroke-standard";
import { AutoSearchInput, AutoSearchInputUpdated } from "./AutoSearchInput";

export const SearchInputWithAutoSearch: React.FC<any> = ({
    className = null, labelName, inputClassName, invalid, value,
    renderOptions = () => { },
    hideDefaultSelect = false, labelClassName = "", defaultSelect = "", idKey = "", menuItems,
    isDisabled = false, renderSelectedValue = () => { },
    name, onBlur, onChange, error, searchHandler = () => { },
    searchOptions = [], labelHeaderName = "", labelKey = "", subLabelHeaderName = "", subLabelKey = "", valueKey = "",
    selected,
    selectedOptionCallbck = () => { }
}) => {
    const [filterState, setFilterState] = useState<any>([]);
    const [searchInputTextState, setSearchInputTextState] = useState("");
    const dropdownBtnRef = useRef<any>(null);
    const dropdownContainerRef = useRef(null);
    const dropdownMenuRef = useRef(null);
    const menuBtnContainerRef = useRef(null);
    const selectedValueId = useRef(undefined);
    const [selectedValueState, setSelectedValueState] = useState<any>(undefined);

    const { isOpen: showMenuState, transformOrigin, setIsOpen: setShowMenuState, menuPositionState } =
        useDropdownPosition(dropdownBtnRef, dropdownMenuRef);

    useEffect(() => {
        if (!selected) {
            setSearchInputTextState("");
        }
    }, [selected]);

    useEffect(() => {
        if (Array.isArray(menuItems)) {
            setFilterState(menuItems);
        } else {
            setFilterState([]);
        }
    }, [menuItems]);

    useEffect(() => {
        if (value !== selectedValueId?.current && Array.isArray(menuItems)) {
            const selectedItem = menuItems.find(item => item?.[idKey]?.toString() === value?.toString());
            setSelectedValueState(selectedItem);
            selectedValueId.current = value;
        }
    }, [value, menuItems]);

    const debouncedSearch = useCallback(debounce((searchText: string) => {
        if (typeof searchHandler === "function") {
            searchHandler(name, searchText);
        }
    }, 300), [name, searchHandler]);

    function onSearchHandler(inputValue: string) {
        setSearchInputTextState(inputValue);
        if (selected) {
            selectedOptionCallbck(undefined);
        }
        debouncedSearch(inputValue);
    }

    function onClickItemHndlr(event: any) {
        event.preventDefault();
        dropdownBtnRef.current.focus();
        const dataId = event.currentTarget.getAttribute("data-id");
        const selectedItem = filterState.find((item: any) => item?.[idKey]?.toString() === dataId);
        setShowMenuState(!showMenuState);
        if (typeof onChange === "function") {
            selectedValueId.current = dataId;
            setSelectedValueState(selectedItem);
            setSearchInputTextState("");
            onChange(name, dataId, selectedItem);
        }
    }

    function blurHandler() {
        if (!showMenuState && typeof (onBlur) === 'function') {
            onBlur();
        }
    }

    function onClickSelectContainerHndlr() {
        setShowMenuState(!showMenuState);
    }

    const selectedValue = value ? renderSelectedValue(selectedValueState) :
        (defaultSelect || "Select");

    return (
        <div ref={dropdownContainerRef} className={classNames("searchinput-container", className)}>
            <div className="searchinput-content position-relative" ref={menuBtnContainerRef}>
                <label className="form-label floating-label">
                    {labelName}
                </label>
                <button type="button" name={name} title={selectedValue}
                    id={name} onClick={onClickSelectContainerHndlr}
                    disabled={isDisabled}
                    onBlur={blurHandler}
                    ref={dropdownBtnRef}
                    className={classNames(`buttonwrapper`,
                        inputClassName, invalid ? "invalid" : "")}
                >
                    <span className="btntext">
                        {selectedValue}</span>
                    <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        className="flex-shrink-0"
                        size={16}
                    />
                </button>
                <div className="tw-w-full">
                    <AutoSearchInput
                        formgroupClassName="tw-mb-0"
                        inputClassName="!tw-border-none form-control-icon"
                        placeholder="Search..."
                        defaultSelect={defaultSelect}
                        value={searchInputTextState}
                        options={searchOptions}
                        labelHeader={labelHeaderName}
                        labelKey={labelKey}
                        subLabelHeader={subLabelHeaderName}
                        subLabelKey={subLabelKey}
                        valueKey={valueKey}
                        onBlur={onBlur}
                        onChange={onSearchHandler}
                        selected={selected}
                        selectedOptionCallbck={selectedOptionCallbck}
                        isDisabled={isDisabled}
                    >
                        <i className="ri-search-line search-icon"></i>
                    </AutoSearchInput>
                </div>
                {typeof document !== "undefined" &&
                    createPortal(<div
                        style={{ ...menuPositionState, zIndex: 10000 }}
                        className={classNames(`searchinput-options`, (
                            showMenuState ? ''
                                : ''
                        ))}
                        ref={dropdownMenuRef}>
                        <div
                            style={{
                                transformOrigin,
                            }}
                            className={classNames(`dropdown-content`, (
                                showMenuState ? 'open'
                                    : 'close'
                            ))}
                        >
                            {showMenuState &&
                                <ul className="dropdown-list">
                                    {filterState.length > 0 && <>
                                        {!hideDefaultSelect && <li key="default-select"
                                            data-id=""
                                            data-text={defaultSelect || "Select"}
                                            onClick={onClickItemHndlr}
                                            className={classNames(`tw-cursor-pointer tw-text-[#A3A3A3] last:tw-border-b-0 tw-py-2 tw-border-b tw-border-[#575757]`, !selectedValueState?.[idKey] ? "" : "")}>
                                            <div
                                                className="tw-flex tw-justify-between tw-items-center">
                                                <>{defaultSelect || "Select"}</>
                                            </div>
                                        </li>}
                                        {
                                            filterState.map((item: any, index: number) => {
                                                const itemValueKey = item[idKey] || "",
                                                    isSelected = (itemValueKey.toString() === selectedValueState?.[idKey]?.toString());
                                                return (<li
                                                    key={`item-${item?.[idKey]}-${index}`}
                                                    data-id={item[idKey]}
                                                    onClick={onClickItemHndlr}
                                                    className={classNames(``, isSelected ? "" : "")}>
                                                    <span className="tw-text-nowrap tw-flex-grow">
                                                        {renderOptions(item)}
                                                    </span>

                                                    <span className="tw-flex-shrink-0 tw-h-[16px] tw-w-[16px]">
                                                        {isSelected &&
                                                            <HugeiconsIcon
                                                                icon={Tick02Icon}
                                                                size={16}
                                                            />}
                                                    </span>
                                                </li>)
                                            })
                                        }
                                    </>}
                                    {
                                        filterState.length === 0 && <div className="tw-py-3 tw-text-[#A3A3A3]" onClick={() => {
                                            setShowMenuState(false)
                                        }}>
                                            <span>No Result Found.</span>
                                        </div>
                                    }
                                </ul>
                            }
                        </div>

                    </div>, document.getElementById("select-portal")!)}
            </div>
            {error && invalid && <div className="tw-mt-0.5 tw-text-sm tw-text-[#FF0022]">
                {error}
            </div>}
        </div>
    );
};