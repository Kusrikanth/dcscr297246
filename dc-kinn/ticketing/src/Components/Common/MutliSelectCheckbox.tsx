import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import classNames from "classnames";
import { Label } from 'reactstrap';
import { FormFeedback } from "reactstrap";
import { debounce, searhWithTextInList } from "../../utility/commonutility";
import { useTable } from "react-table";
interface IMultiSelectCheckbox {
    containerClassName?: string,
    // eslint-disable-next-line no-restricted-globals
    name: string,
    idKey: string,
    labelText?: string,
    labelClass?: string,
    value: any,
    renderValue: any,
    renderOptions: any
    onChange: any
    searchKey?: string,
    options: Array<any>,
    error?: any,
    invalid?: boolean,
    defaultSelect?: string,
    onSearchHandler?: any,
    isDisabled?: boolean,
    floatingLabel?: boolean,
    shouldDisableOption?: (item: any) => boolean;
}

export const MultiSelectCheckbox: React.FC<IMultiSelectCheckbox> = (props) => {
    const [isOpenState, setIsOpenState] = useState(false);
    const [availableOptionsState, setAvailableOptionsState] = useState<any>([]);
    const [searchInputTextState, setSearchInputTextState] = useState("");
    const [menuPositionState, setMenuPositionState] = useState<any>(null);
    const inputRef = useRef<any>(undefined);
    const multiSelectContainerRef = useRef<any>(null);
    const buttonWithOptionRef = useRef<any>(null);
    const menuOptionContainerRef = useRef<any>(null);
    const dropdownButtonRef = useRef<any>(null);
    const totalElementRef = useRef<any>(0);

    useEffect(() => {
        if (Array.isArray(props?.options)) {
            setAvailableOptionsState(props?.options);
        } else {
            setAvailableOptionsState([]);
        }
    }, [props.options]);

    function onSelectOptionHndlr(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
        const selectedOptionId = event.currentTarget.getAttribute("data-id"),
            { value: selectedOption } = props,
            indexOfSelectedOptions = Array.isArray(selectedOption) ? selectedOption.findIndex((item: any) => item[props.idKey]?.toString() == selectedOptionId) : -1,
            updatedSelectedOptions = Array.isArray(selectedOption) ? [...selectedOption] : [];
        if (indexOfSelectedOptions > -1) {
            const removedItem = selectedOption[indexOfSelectedOptions];
            updatedSelectedOptions.splice(indexOfSelectedOptions, 1);
            props.onChange(updatedSelectedOptions, {
                actionItem: removedItem,
                actionType: "remove",
                name: props?.name
            });
        } else {
            const selectedOption = availableOptionsState.find((item: any) => item[props.idKey]?.toString() == selectedOptionId);
            if (selectedOption) {
                updatedSelectedOptions.push(selectedOption);
                props.onChange(updatedSelectedOptions, {
                    actionItem: selectedOption,
                    actionType: "added",
                    name: props?.name
                });
            }
        }
    }

    function onClickCheckboxHandler(event: React.ChangeEvent<HTMLInputElement>) {
        event.stopPropagation();
        const { name, checked } = event.target,
            itemId = event.currentTarget.getAttribute("data-id"),
            { value: selectedOption } = props,
            updatedSelectedOptions = Array.isArray(selectedOption) ? [...selectedOption] : [];
        if (checked) {
            const addedItem = availableOptionsState.find((item: any) => item[props.idKey]?.toString() == itemId);
            if (addedItem) {
                updatedSelectedOptions.push(addedItem);
                props.onChange(updatedSelectedOptions, {
                    actionItem: addedItem,
                    actionType: "added",
                    name: props?.name
                });
            }
        } else {
            const indexOfSelectedOptions = Array.isArray(selectedOption) ? selectedOption.findIndex((item: any) => item[props.idKey]?.toString() == itemId) : -1,
                removedItem = selectedOption[indexOfSelectedOptions];
            updatedSelectedOptions.splice(indexOfSelectedOptions, 1);
            props.onChange(updatedSelectedOptions, {
                actionItem: removedItem,
                actionType: "remove",
                name: props?.name
            });
        }
    }

    function searchCallbackHandler(event: any) {
        const { value } = event.target;
        if (props.onSearchHandler) {
            props.onSearchHandler(props.name, value);
        } else {
            const searchedItems = searhWithTextInList(props.options, props.searchKey, value);
            setAvailableOptionsState(searchedItems);
        }
    }
    const debouncedHandler = useCallback(debounce(searchCallbackHandler, 200), [props.options]);

    function onSearchHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setSearchInputTextState(value);
        debouncedHandler(event);
    }

    function selecteAllHandler() {
        props.onChange(props.options, {
            actionItem: props.options,
            actionType: "added",
            name: props?.name
        });
    }

    function clearAllHandler() {
        props.onChange([], {
            actionItem: [],
            actionType: "removed",
            name: props?.name
        });
    }

    useLayoutEffect(() => {
        function mouseDownEventListenerMenu(event: MouseEvent) {
            if (buttonWithOptionRef.current && !buttonWithOptionRef.current.contains(event.target)) {
                setIsOpenState(false);
            }
        }

        if (isOpenState) {
            inputRef.current.focus();
            document.addEventListener("mousedown", mouseDownEventListenerMenu);
        }
        return () => {
            document.removeEventListener("mousedown", mouseDownEventListenerMenu);
        }
    }, [isOpenState, multiSelectContainerRef.current]);


    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            setIsOpenState(!isOpenState);
        }
    };

    function dropdownBtnHandler() {
        if (props.isDisabled) {
            return;
        }
        setIsOpenState(!isOpenState);
    }

    function removeItemHandler(event: any) {
        event.stopPropagation();
        const { value: selectedOption } = props,
            updatedSelectedOptions = Array.isArray(selectedOption) ? [...selectedOption] : [];
        const dataId = event.currentTarget.getAttribute("data-id");
        if (dataId) {
            const indexOfSelectedOptions = Array.isArray(selectedOption) ?
                selectedOption.findIndex((item: any) => item[props.idKey]?.toString() == dataId) : -1,
                removedItem = selectedOption[indexOfSelectedOptions];
            updatedSelectedOptions.splice(indexOfSelectedOptions, 1);
            props.onChange(updatedSelectedOptions, {
                actionItem: removedItem,
                actionType: "remove",
                name: props?.name
            });
        }

    }

    const { value, idKey } = props;
    const selectedItemIds = Array.isArray(value) && value.map(item => item?.[idKey]?.toString()) || [];
    totalElementRef.current = availableOptionsState?.length;
    return (
        <div
            ref={multiSelectContainerRef}
            className={classNames(
                "multiselect-checkbox",
                { "form-floating": props.floatingLabel },
                props.containerClassName
            )}
        >

            <div className="!tw-flex !tw-flex-col lms_flex_multiselect">
                {!props.floatingLabel && props.labelText && (
                    <Label className={props.labelClass} htmlFor={props.name}>
                        {props.labelText}
                    </Label>
                )}

                <div ref={buttonWithOptionRef}
                    className="!tw-flex !tw-relative lms_multiselect"
                >

                    <div
                        tabIndex={0}
                        ref={dropdownButtonRef}
                        role="button"
                        className={classNames(
                            "dropdown-btn",
                            {
                                "disabled": props.isDisabled,
                                "is-invalid": props.invalid
                            }
                        )}
                        onClick={dropdownBtnHandler}
                        onKeyDown={handleKeyDown}
                    >
                        {selectedItemIds.length > 0
                            ? props.renderValue(props.value, removeItemHandler)
                            : (props.defaultSelect || "Select")}
                    </div>

                    {/* Floating label only when floatingLabel = true */}
                    {props.floatingLabel && props.labelText && (
                        <Label className={props.labelClass} htmlFor={props.name}>
                            {props.labelText}
                        </Label>
                    )}

                    {isOpenState && (
                        <div className="options-container" style={menuPositionState}>
                            <div className="tw-p-2 search-container">
                                <input
                                    id={`search-${props.name}`}
                                    name={`search-${props.name}`}
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                    ref={inputRef}
                                    value={searchInputTextState}
                                    onChange={onSearchHandler}
                                    autoComplete="off"
                                />
                            </div>

                            <div ref={menuOptionContainerRef}
                                className="options-list"
                            >
                                {availableOptionsState.length === 0 && (
                                    <li className="no-options">No Options Available</li>
                                )}

                                {availableOptionsState.map((item, index) => {
                                    const isDisabledOption =
                                        props.shouldDisableOption?.(item) ?? false;
                                    const isSelected =
                                        selectedItemIds.includes(
                                            item[props.idKey]?.toString()
                                        );

                                    return (
                                        <div
                                            key={`options-${item[props.idKey]}`}
                                            className={classNames(
                                                "optionitem-container",
                                                isSelected ? "active" : ""
                                            )}
                                        >
                                            <div
                                                data-id={item[props.idKey]}
                                                data-index={index}
                                                onClick={!isDisabledOption ? onSelectOptionHndlr : undefined}
                                                className={classNames(
                                                    "option-item",
                                                    isDisabledOption && "disabled-option"
                                                )}
                                            >
                                                <div className="form-check">
                                                        <input
                                                            id={`checkbox-${item[props.idKey]}`}
                                                            name={`checkbox-${item[props.idKey]}`}
                                                            type="checkbox"
                                                            data-id={item[props.idKey]}
                                                            checked={isSelected}
                                                            disabled={isDisabledOption}
                                                            onChange={!isDisabledOption ? onClickCheckboxHandler : undefined}
                                                            className="form-check-input !tw-me-1"
                                                        />
                                                </div>
                                                {props.renderOptions(item)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="action-container !tw-flex !tw-justify-end !tw-gap-2 !tw-px-2 !tw-py-1 tw-text-sm">
                                <input type="button" onClick={selecteAllHandler} value="Select All" className="btn btn-text tw-p-0 text-secondary" />
                                <input type="button" onClick={clearAllHandler} value="Clear All" className="btn btn-text tw-p-0 text-danger" />
                            </div>
                        </div>
                    )}

                </div>

                {props.error && props.invalid && (
                    <FormFeedback type="invalid" className="d-block">
                        {props.error}
                    </FormFeedback>
                )}
            </div>
        </div>
    );

}