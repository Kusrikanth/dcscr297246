import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import classNames from "classnames";
import { Label } from 'reactstrap';
import { FormFeedback } from "reactstrap";
import { debounce, searhWithTextInList } from "../../utility/commonutility";
interface ICustomSelect {
    containerClassName?: string,
    // eslint-disable-next-line no-restricted-globals
    name: string,
    idKey: string,
    labelText?: string,
    labelClass?: string,
    value: any,
    initialValue?: any,
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
    type?: string,
    isReadOnly?: boolean;
    inputClassName?: string;
}

export const CustomSelect: React.FC<ICustomSelect> = (props) => {
    const [isOpenState, setIsOpenState] = useState(false);
    const [availableOptionsState, setAvailableOptionsState] = useState<any>([]);
    const [searchInputTextState, setSearchInputTextState] = useState("");
    const [menuPositionState, setMenuPositionState] = useState<any>(null);
    const [selectedOptionState, setSelectedOptionState] = useState<any>(props?.initialValue || null);
    const selectedOptionIdRef = useRef<any>(() => {
        if (!props?.initialValue) {
            return "";
        }
        return props.initialValue[props?.idKey] || ""
    });
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

    useEffect(() => {
        if (props.value && Array.isArray(props.options)) {
            const selectedItem = props.options.find(
                (item: any) =>
                    item[props.idKey]?.toString() === props.value?.toString()
            );

            setSelectedOptionState(selectedItem || null);
            selectedOptionIdRef.current = props.value;
        } else {
            setSelectedOptionState(null);
        }
    }, [props.idKey, props.value, props.options, selectedOptionIdRef]);

    function onSelectOptionHndlr(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
        const selectedOptionId = event.currentTarget.getAttribute("data-id");
        if (!selectedOptionId) {
            setSelectedOptionState(null);
            selectedOptionIdRef.current = "";
            props.onChange("", {
                item: null,
                name: props?.name
            });
            setIsOpenState(false);
            return;
        }
        const selectedOption = availableOptionsState.find(
            (item: any) => item[props.idKey]?.toString() == selectedOptionId
        );

        if (selectedOption) {
            setSelectedOptionState(selectedOption);
            selectedOptionIdRef.current = selectedOptionId;
            props.onChange(selectedOptionId, {
                item: selectedOption,
                name: props?.name
            });
            setIsOpenState(false);
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
        if (props.isDisabled || props.isReadOnly) {
            return;
        }
        setIsOpenState(!isOpenState);
    }

    totalElementRef.current = availableOptionsState?.length;
    const { value, options } = props;
    return (
        <div ref={multiSelectContainerRef} className={classNames("multiselect-checkbox", props.containerClassName)}>
            <div className="tw-flex tw-flex-col">
                {props.labelText && <Label className={props.labelClass}>{props.labelText}</Label>}
                {/* <Input type="email"  id="contactPersonNumber" /> */}

                <div ref={buttonWithOptionRef} className="tw-flex tw-relative">
                    <div tabIndex={0}
                        ref={dropdownButtonRef}
                        role="button"
                        title={props.value && props.renderValue(selectedOptionState)}
                        className={classNames("dropdown-btn tw-overflow-hidden tw-whitespace-nowrap tw-text-ellipsis",
                            props.inputClassName,
                            {
                                "disabled": props.isDisabled || props.isReadOnly,
                                "is-invalid": props.invalid
                            })}
                        onKeyDown={handleKeyDown}
                        onClick={dropdownBtnHandler}
                    >{props.value && selectedOptionState ? props.renderValue(selectedOptionState)
                        : <span className="tw-text-gray-400">{props.defaultSelect || "Select"}</span>
                        }</div>

                    {isOpenState && <div className="options-container"
                        style={menuPositionState}
                    >
                        <div className="tw-p-3 search-container">
                            <input
                                id={`search-${props?.name}`}
                                name={`search-${props?.name}`}
                                type={props.type || "text"} className="form-control" placeholder="Search"
                                ref={inputRef}
                                value={searchInputTextState}
                                onChange={onSearchHandler}
                                autoComplete="off"
                            />
                        </div>
                        <div ref={menuOptionContainerRef}
                            className="options-list">
                            {availableOptionsState.length === 0 &&
                                <li className="no-options">No Options Available</li>}
                            {[
                                ...(props.defaultSelect ? [{ [props.idKey]: "", label: props.defaultSelect }] : []),
                                ...availableOptionsState
                            ].map((item: any, index: any) => {

                                const idKey = props.idKey;

                                const isSelected = item[idKey]?.toString() === selectedOptionState?.[idKey]?.toString();

                                return (
                                    <div
                                        key={`options-${item[idKey] || "default"}`}
                                        tabIndex={-1}
                                        className={classNames("optionitem-container", isSelected ? "active" : "")}
                                    >
                                        <div
                                            data-id={item[idKey] || ""}
                                            data-index={index}
                                            onClick={onSelectOptionHndlr}
                                            className="option-item"
                                        >
                                            {item.label || props.renderOptions(item)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>}

                </div>
                {props.error && props.invalid && <FormFeedback type="invalid" className="d-block">
                    {props.error}
                </FormFeedback>}
            </div>


        </div>
    )
}