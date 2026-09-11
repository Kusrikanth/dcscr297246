import React, { useEffect, useMemo, useRef, useState, useCallback, useLayoutEffect } from "react";
import classnames from "classnames";
import { Input, FormGroup, Label, FormFeedback, FormText, Progress } from "reactstrap";

const debounce = (fn: any, delay: any) => {
    let timerId: any;
    return (...args: any) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn(...args), delay);
    }
};

export const AutoSearchInput = (props: any) => {
    const [availableOptionsState, setAvailableOptionsState] = useState<any>([]);
    const [searchInputTextState, setSearchInputTextState] = useState("");
    const [selectedOptionState, setSelectedOptionState] = useState<any>(undefined);
    const [isOpenState, setIsOpenState] = useState<boolean>(false);
    const selectedOptionRef = useRef<any>(undefined);
    const autoSearchInputContainerRef = useRef<any>(undefined);
    useEffect(() => {
        function hideMenuOptions(event: any) {
            if (autoSearchInputContainerRef.current && !autoSearchInputContainerRef.current.contains(event.target)) {
                if (!selectedOptionState) {
                    setSearchInputTextState("");
                }
                setIsOpenState(false);
            }
        }
        if (isOpenState) {
            document.addEventListener("mousedown", hideMenuOptions);
        } else {
            document.removeEventListener("mousedown", hideMenuOptions);
        }
        return () => {
            document.removeEventListener("mousedown", hideMenuOptions);
        };
    }, [isOpenState, selectedOptionState, autoSearchInputContainerRef.current]);

    useEffect(() => {
        if (Array.isArray(props.options)) {
            const { options, filterIds } = props;
            if (Array.isArray(filterIds)) {
                const filteredOptions = options.filter((item: any) => {
                    return !filterIds.includes(item[props.valueKey]);
                });
                setAvailableOptionsState(filteredOptions);
            } else {
                setAvailableOptionsState(options);
            }
        }
    }, [props.options, props.filterIds]);

    useEffect(() => {
        if (selectedOptionRef.current !== props.selected) {
            const { selected } = props;
            if (selected && Object.keys(selected).length > 0) {
                let labelName = selected[props.labelKey] || "",
                    subLabelName = selected[props.subLabelKey] ? ` - ${selected[props.subLabelKey]}` : "";
                const selectedText = `${labelName}${subLabelName}`;
                setSelectedOptionState(props.selected);
                setSearchInputTextState(selectedText);
            } else {
                setSearchInputTextState("");
                setSelectedOptionState(props.selected);
            }
            selectedOptionRef.current = props.selected;
        }
    }, [props.selected]);
    const debouncedHandler = useCallback(debounce(props.onChange, 200), [props.onChange]);
    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (!isOpenState) {
            setIsOpenState(true);
        }
        setSearchInputTextState(value);
        debouncedHandler(value);
        if (!value) {
            const meta = { name: props.name, removedValue: selectedOptionState };
            props.selectedOptionCallbck(null, meta);
        }
    }
    function onClickOptionHndlr(event: React.MouseEvent<HTMLLIElement>) {
        const optionDataId = event.currentTarget.getAttribute("data-id"),
            optionInfo = availableOptionsState.find((item: any) => item[props.valueKey] == optionDataId);
        if (optionInfo) {
            setSelectedOptionState(optionInfo);
            let labelName = optionInfo[props.labelKey] || "",
                subLabelName = optionInfo[props.subLabelKey] ? ` - ${optionInfo[props.subLabelKey]}` : "";
            const selectedText = `${labelName}${subLabelName}`;
            setSearchInputTextState(selectedText);
            setIsOpenState(false);
            selectedOptionRef.current = optionInfo;
            const meta = { name: props.name, removedValue: undefined };
            props.selectedOptionCallbck(optionInfo, meta);
        }
    }

    function onKeyUpHndlr(event: React.KeyboardEvent<HTMLInputElement>) {
        const { code, key } = event;
        if (code === "Enter") {
            if (!selectedOptionState) {
                setSearchInputTextState("");
            }
            setIsOpenState(false);
        }
    }

    function onBlurHandler() {
        const { onBlur } = props;
        if (!isOpenState && typeof (onBlur) === 'function') {
            props.onBlur();
        }
    }
    const isOptionsAvailable = (Array.isArray(availableOptionsState) && availableOptionsState.length > 0) || false;
    return (
        <div ref={autoSearchInputContainerRef} className={classnames("auto-search-input-container", (props.formgroupClassName || "tw-mb-3"))}>
            {!props.floatingLabel && props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
            {/* <div className={`form-icon ${props.iconPositionClassName || ""}`}> */}
            <div className={classnames(props.iconPositionClassName || "", {"form-floating":props.floatingLabel},"form-icon")}>
                <Input
                    name={props.name}
                    id={props.name}
                    className={classnames("form-control-icon", props.inputClassName)}
                    placeholder={props.placeHolder || ""}
                    type={props.inputType || "text"}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    value={searchInputTextState}
                    invalid={props.invalid}
                    disabled={props.isDisabled || false}
                    readOnly={props.isReadOnly || false}
                    maxLength={props.maxLength || 45}
                    onKeyUp={onKeyUpHndlr}
                    autoComplete="off"
                />
                {props.floatingLabel && props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
                {props.children}
                {isOpenState && <div className={classnames("options-container", props.alignRight ? "align-right" : "")}>
                    <div className="option-container-inner">
                        {isOptionsAvailable && <ul tabIndex={-1} className="option-container-ul">
                            <li className="options-li-header">
                                <div className="options-li-title-code">{props.labelHeader}</div>
                                <div className="options-li-title-name">{props.subLabelHeader}</div>
                                {props.subLabelKeyII && (
                                    <div className="options-li-title-name">{props.subLabelHeaderII}</div>
                                )}
                            </li>
                            {Array.isArray(availableOptionsState) && availableOptionsState.map((item: any) => {
                                return (<li
                                    key={item[props.valueKey]}
                                    data-id={item[props.valueKey]}
                                    onClick={onClickOptionHndlr}
                                    tabIndex={0}
                                    className={classnames("options-li", {
                                        "selected": item[props.valueKey] === selectedOptionState?.[props.valueKey]
                                    })}>
                                    <div className="options-li-label-code">{item[props.subLabelKey]}</div>
                                    <div className="options-li-label-name">{item[props.labelKey]}</div>
                                    {props.subLabelKeyII && (
                                        <div className="options-li-label-code">{item[props.subLabelKeyII]}</div>
                                    )}
                                </li>)
                            })}
                        </ul>}
                        {!isOptionsAvailable && <div className="no-option-container">
                            No options available
                        </div>}
                        {props.isLoading && <div className="loading-container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>}
                    </div>
                </div>}
            </div>
            {props.helperText && <FormText>
                {props.helperText}
            </FormText>}
            {props.error && props.invalid && <FormFeedback className="tw-block" type="invalid">
                {props.error}
            </FormFeedback>}

        </div>
    )
}

export const AutoSearchInputUpdated = (props: any) => {
    const [availableOptionsState, setAvailableOptionsState] = useState<any>([]);
    const [searchInputTextState, setSearchInputTextState] = useState("");
    const [selectedOptionState, setSelectedOptionState] = useState<any>(undefined);
    const [isOpenState, setIsOpenState] = useState<boolean>(false);
    const selectedOptionRef = useRef<any>(undefined);
    const autoSearchInputContainerRef = useRef<any>(undefined);
    const dropdownBtnRef = useRef<HTMLDivElement>(null);
    const dropdownMenuRef = useRef<HTMLDivElement>(null);
    const [menuPositionState, setMenuPositionState] = useState<any>(null);
    function updateDropdownMenuHndlr() {
        if (dropdownBtnRef.current) {
            const positionData = dropdownBtnRef.current.getBoundingClientRect(),
                windowHeight = window.innerHeight, { top } = positionData || {};
            if (top && dropdownMenuRef?.current) {
                const topDistance = Math.floor(top),
                    dropdownHeight = dropdownMenuRef?.current.offsetHeight;
                if ((Number(windowHeight) - Number(topDistance)) > Number(dropdownHeight)) {
                    setMenuPositionState({
                        transform: `translate(${positionData.x}px, ${positionData.y + 42}px)`,
                        minWidth: `${Math.floor(positionData.width)}px`,
                        maxWidth: `calc(${Math.floor(positionData.width)}px + 100px)`,
                        inset: '0px auto auto 0px',
                    })
                } else {
                    const verticalPos = Number(topDistance) - Number(dropdownHeight) - 5;
                    setMenuPositionState({
                        transform: `translate(${positionData.x}px, ${verticalPos}px)`,
                        minWidth: `${Math.floor(positionData.width)}px`,
                        maxWidth: `calc(${Math.floor(positionData.width)}px + 100px)`,
                        inset: '0px auto auto 0px'
                    })
                }
            }
        }
    }

    useEffect(() => {
        function hideMenuOptions(event: any) {
            if (autoSearchInputContainerRef.current && !autoSearchInputContainerRef.current.contains(event.target)) {
                if (!selectedOptionState) {
                    setSearchInputTextState("");
                }
                setIsOpenState(false);
            }
        }
        function scrollEventHndlr() {
            updateDropdownMenuHndlr();
        }

        if (isOpenState) {
            document.addEventListener("mousedown", hideMenuOptions);
            if (props.bodyContainer) {
                updateDropdownMenuHndlr();
                window.addEventListener("scroll", scrollEventHndlr);
            }
        } else {
            document.removeEventListener("mousedown", hideMenuOptions);
            window.removeEventListener("scroll", scrollEventHndlr);
        }
        return () => {
            document.removeEventListener("mousedown", hideMenuOptions);
            window.removeEventListener("scroll", scrollEventHndlr);
        };
    }, [isOpenState, props.bodyContainer, selectedOptionState, autoSearchInputContainerRef]);

    useEffect(() => {
        if (Array.isArray(props.options)) {
            const { options, filterIds } = props;
            if (Array.isArray(filterIds)) {
                const filteredOptions = options.filter((item: any) => {
                    return !filterIds.includes(item[props.valueKey]);
                });
                setAvailableOptionsState(filteredOptions);
            } else {
                setAvailableOptionsState(options);
            }
        } else {
            setAvailableOptionsState([]);
        }
    }, [props.options, props.filterIds]);

    useEffect(() => {
        if (selectedOptionRef.current !== props.selected) {
            const { selected } = props;
            if (selected) {
                let labelName = selected[props.labelKey] || "",
                    subLabelName = selected[props.subLabelKey] ? ` - ${selected[props.subLabelKey]}` : "";
                const selectedText = `${labelName}${subLabelName}`;
                setSelectedOptionState(props.selected);
                setSearchInputTextState(selectedText);
            } else {
                setSearchInputTextState("");
                setSelectedOptionState(props.selected);
            }
            selectedOptionRef.current = props.selected;
        }
    }, [props.selected]);

    const debouncedHandler = useCallback(debounce(props.onChange, 200), [props.onChange]);

    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (!isOpenState) {
            setIsOpenState(true);
        }
        setSearchInputTextState(value);
        debouncedHandler(value);
        if (!value) {
            const meta = { name: props.name, removedValue: selectedOptionState };
            props.selectedOptionCallbck(null, meta);
        }
    }

    function onClickOptionHndlr(event: React.MouseEvent<HTMLLIElement>) {
        const optionDataId = event.currentTarget.getAttribute("data-id"),
            optionInfo = availableOptionsState.find((item: any) => item[props.valueKey] == optionDataId);
        if (optionInfo) {
            setSelectedOptionState(optionInfo);
            let labelName = optionInfo[props.labelKey] || "",
                subLabelName = optionInfo[props.subLabelKey] ? ` - ${optionInfo[props.subLabelKey]}` : "";
            const selectedText = `${labelName}${subLabelName}`;
            setSearchInputTextState(selectedText);
            setIsOpenState(false);
            selectedOptionRef.current = optionInfo;
            const meta = { name: props.name, removedValue: undefined };
            props.selectedOptionCallbck(optionInfo, meta);
        }
    }

    function onKeyUpHndlr(event: React.KeyboardEvent<HTMLInputElement>) {
        const { code, key } = event;
        if (code === "Enter" && !props.notKeyUpHndler) {
            if (!selectedOptionState) {
                setSearchInputTextState("");
            }
            setIsOpenState(false);
        }
    }

    const isOptionsAvailable = (Array.isArray(availableOptionsState) && availableOptionsState.length > 0) || false;
    return (
        <div ref={autoSearchInputContainerRef} className={classnames("auto-search-updated-input-container", (props.formgroupClassName || "tw-mb-3"))}>
            {props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
            <div ref={dropdownBtnRef} className={`form-icon ${props.iconPositionClassName || ""}`}>
                <Input
                    name={props.name}
                    id={props.name}
                    className={classnames("form-control-icon", props.inputClassName)}
                    placeholder={props.placeHolder}
                    type={props.inputType || "text"}
                    onChange={onChangeHandler}
                    onBlur={props.onBlur}
                    value={searchInputTextState}
                    invalid={props.invalid}
                    disabled={props.isDisabled || false}
                    readOnly={props.isReadOnly || false}
                    maxLength={props.maxLength || 45}
                    onKeyUp={onKeyUpHndlr}
                    autoComplete="off"
                />
                {props.floatingLabel && props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
                {props.children}
                {isOpenState && <div
                    ref={dropdownMenuRef}
                    style={props.bodyContainer ? menuPositionState : null}
                    className={classnames("options-container",
                        props.bodyContainer ? 'containerbody' : '',
                        props.alignRight ? "align-right" : "")}>
                    <div className="option-container-inner">
                        {isOptionsAvailable && <ul tabIndex={-1} className={classnames("option-container-ul", props.containerClassName)}>
                            <li className="options-li-header">
                                <div className={classnames("options-li-title-code", props.labelHeaderClassName)}>{props.labelHeader}</div>
                                <div className={classnames("options-li-title-name", props.subLabelHeaderClassName)}>{props.subLabelHeader}</div>
                                {props.subLabelHeaderII && (
                                    <div className="options-li-title-name">{props.subLabelHeaderII}</div>
                                )}
                            </li>
                            {Array.isArray(availableOptionsState) && availableOptionsState.map((item: any) => {
                                return (<li
                                    key={item[props.valueKey]}
                                    data-id={item[props.valueKey]}
                                    onClick={onClickOptionHndlr}
                                    tabIndex={0}
                                    className={classnames("options-li", {
                                        "selected": item[props.valueKey] === selectedOptionState?.[props.valueKey]
                                    })}>
                                    <div title={item[props.labelKey] || ''} className={classnames("options-li-label-code", props.labelClassName)}>{item[props.labelKey]}</div>
                                    <div className={classnames("options-li-label-name", props.subLabelClassName)}>{item[props.subLabelKey]}</div>
                                    {props.subLabelHeaderII && (
                                        <div className="options-li-title-name">{props.subLabelHeaderII}</div>
                                    )}
                                </li>)
                            })}
                        </ul>}
                        {!isOptionsAvailable && <div className="no-option-container">
                            No options available
                        </div>}
                        {props.isLoading && <div className="loading-container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>}
                    </div>
                </div>}
            </div>
            {props.helperText && <FormText>
                {props.helperText}
            </FormText>}
            {props.error && props.invalid && <FormFeedback className={
                classnames("tw-block", {
                    "tw-mt-0": !!props.helperText
                })
            } type="invalid">
                {props.error}
            </FormFeedback>}

        </div >
    )
}



export const AutoSearchInputSingle = (props: any) => {
    const [availableOptionsState, setAvailableOptionsState] = useState<any>([]);
    const [searchInputTextState, setSearchInputTextState] = useState("");
    const [selectedOptionState, setSelectedOptionState] = useState<any>(undefined);
    const [isOpenState, setIsOpenState] = useState<boolean>(false);
    const selectedOptionRef = useRef<any>(undefined);
    const autoSearchInputContainerRef = useRef<any>(undefined);
    useEffect(() => {
        function hideMenuOptions(event: any) {
            if (autoSearchInputContainerRef.current && !autoSearchInputContainerRef.current.contains(event.target)) {
                if (!selectedOptionState) {
                    setSearchInputTextState("");
                }
                setIsOpenState(false);
            }
        }
        if (isOpenState) {
            document.addEventListener("mousedown", hideMenuOptions);
        } else {
            document.removeEventListener("mousedown", hideMenuOptions);
        }
        return () => {
            document.removeEventListener("mousedown", hideMenuOptions);
        };
    }, [isOpenState, selectedOptionState, autoSearchInputContainerRef.current]);

    useEffect(() => {
        if (Array.isArray(props.options)) {
            const { options, filterIds } = props;
            if (Array.isArray(filterIds)) {
                const filteredOptions = options.filter((item: any) => {
                    return !filterIds.includes(item[props.valueKey]);
                });
                setAvailableOptionsState(filteredOptions);
            } else {
                setAvailableOptionsState(options);
            }
        } else {
            setAvailableOptionsState([]);
        }
    }, [props.options, props.filterIds]);

    useEffect(() => {
        if (selectedOptionRef.current !== props.selected) {
            const { selected } = props;
            if (selected) {
                let labelName = selected[props.labelKey] || "";
                const selectedText = `${labelName}`;
                setSelectedOptionState(props.selected);
                setSearchInputTextState(selectedText);
            } else {
                setSearchInputTextState("");
                setSelectedOptionState(props.selected);
            }
            selectedOptionRef.current = props.selected;
        }
    }, [props.selected]);
    const debouncedHandler = useCallback(debounce(props.onChange, 200), [props.onChange]);

    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (!isOpenState) {
            setIsOpenState(true);
        }
        setSearchInputTextState(value);
        debouncedHandler(value);
        if (!value) {
            const meta = { name: props.name, removedValue: selectedOptionState };
            props.selectedOptionCallbck(null, meta);
        }
    }
    function onClickOptionHndlr(event: React.MouseEvent<HTMLLIElement>) {
        const optionDataId = event.currentTarget.getAttribute("data-id"),
            optionInfo = availableOptionsState.find((item: any) => item[props.valueKey] == optionDataId);
        if (optionInfo) {
            setSelectedOptionState(optionInfo);
            let labelName = optionInfo[props.labelKey] || "";
            const selectedText = `${labelName}`;
            setSearchInputTextState(selectedText);
            setIsOpenState(false);
            selectedOptionRef.current = optionInfo;
            const meta = { name: props.name, removedValue: undefined };
            props.selectedOptionCallbck(optionInfo, meta);
        }
    }

    function onKeyUpHndlr(event: React.KeyboardEvent<HTMLInputElement>) {
        const { code, key } = event;
        if (code === "Enter") {
            if (!selectedOptionState) {
                setSearchInputTextState("");
            }
            setIsOpenState(false);
        }
    }


    function onBlurHandler() {
        const { onBlur } = props;
        if (!isOpenState && typeof (onBlur) === 'function') {
            props.onBlur();
        }
    }

    const isOptionsAvailable = (Array.isArray(availableOptionsState) && availableOptionsState.length > 0) || false;
    return (
        <div ref={autoSearchInputContainerRef} className={classnames("auto-search-single-container", (props.formgroupClassName || "tw-mb-3"))}>
            {props.labelText && <Label className={props.labelClass} htmlFor={props.name}>{props.labelText}</Label>}
            <div className={`form-icon ${props.iconPositionClassName || ""}`}>
                <Input
                    name={props.name}
                    id={props.name}
                    className={classnames("form-control-icon", props.inputClassName)}
                    placeholder={props.placeHolder}
                    type={props.inputType || "text"}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    value={searchInputTextState}
                    invalid={props.invalid}
                    disabled={props.isDisabled || false}
                    readOnly={props.isReadOnly || false}
                    maxLength={props.maxLength || 45}
                    onKeyUp={onKeyUpHndlr}
                    autoComplete="off"
                />
                {props.children}
                {isOpenState && <div className={classnames("options-container", props.alignRight ? "align-right" : "")}>
                    <div className="option-container-inner">
                        {isOptionsAvailable && <ul tabIndex={-1} className="option-container-ul">
                            <li className="options-li-header">
                                <div className="options-li-title-code">{props.labelHeader}</div>
                            </li>
                            {Array.isArray(availableOptionsState) && availableOptionsState.map((item: any) => {
                                return (<li
                                    key={item[props.valueKey]}
                                    data-id={item[props.valueKey]}
                                    onClick={onClickOptionHndlr}
                                    tabIndex={0}
                                    className={classnames("options-li", {
                                        "selected": item[props.valueKey] === selectedOptionState?.[props.valueKey]
                                    })}>
                                    <div className="options-li-label-code">{item[props.labelKey]}</div>
                                </li>)
                            })}
                        </ul>}
                        {!isOptionsAvailable && <div className="no-option-container">
                            No options available
                        </div>}
                        {props.isLoading && <div className="loading-container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>}
                    </div>
                </div>}
            </div>
            {props.helperText && <FormText>
                {props.helperText}
            </FormText>}
            {props.error && props.invalid && <FormFeedback className="tw-block" type="invalid">
                {props.error}
            </FormFeedback>}

        </div>
    )
}
