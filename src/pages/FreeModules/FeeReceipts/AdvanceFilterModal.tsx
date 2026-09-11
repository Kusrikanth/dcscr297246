import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import {
    DateInput,
    InputCheckbox,
    MultiSelectCheckbox,
} from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

import { receiptTypeOptions, paymentModeOptions } from "./helper";
import { getClassListAdvanceFilter, getFeeReceiptFeeNameAct, resetClassListForAdvanceFilterAct } from "../../../store/fee/feecollections/feecollectionactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import Button from "../../../Components/Common/Button";

export default function AdvanceFilterModal(props: any) {
    const [filterState, setFilterState] = useState<any>({
        // receiptTypes: receiptTypeOptions,
        startDate: "",
        endDate: "",
        branchClassId: "",
        branchCurriculumId: "",
        academicYearId: "",
        paymentModes: [],
        feeDetails: [],
    });
    const [receiptOptionState, setReceiptOptionState] = useState(receiptTypeOptions);
    const [paymentModeState, setPaymentModeState] = useState(paymentModeOptions);
    const dispatch = useAppDispatch();
    const {
         classListForAdvanceFilter, currentBranchIdResp: branchId,showApiLoader, getFeeReceiptsFeeNamesResp } =
        useAppSelector(({ appData, globalData, branchAcademics, masterFeeSettings, instAcademics, feeCollections }) => ({
            classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            getFeeReceiptsFeeNamesResp: feeCollections.getFeeReceiptsFeeNamesResp,

        }), shallowEqual);

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === "branchCurriculumId") {
            // dispatch(setBrchClassAct(undefined));
            if (value) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: value, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
            setFilterState((prevState: any) => ({ ...prevState, [name]: value, branchClassId: "" }));
        } else {
            setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        }
    }

    function applyFilterHndlr() {
 
        setFilterState((prev: any) => ({ ...prev, paymentModes: filterState.paymentModes, receiptTypes: receiptOptionState }))
        props.applyFilterCallback({ ...filterState, paymentModes: filterState.paymentModes, receiptTypes: receiptOptionState });
    }
    //test
    function onChangeReceiptTypeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = event.currentTarget,
            receiptId = event.currentTarget.getAttribute("data-id"),
            receiptIndex = receiptOptionState.findIndex((item) => item.id === receiptId);
        if (receiptIndex > -1) {
            const receiptDetails = receiptOptionState[receiptIndex],
                updateReceiptState = [...receiptOptionState];
            updateReceiptState.splice(receiptIndex, 1, { ...receiptDetails, selected: checked });
            setReceiptOptionState(updateReceiptState);
        }
    }

    function onChangePaymentModeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked } = event.currentTarget,
            paymentModeId = event.currentTarget.getAttribute("data-id"),
            paymentModeIndex = paymentModeState.findIndex((item) => item.id === paymentModeId);
        if (paymentModeIndex > -1) {
            const receiptDetails = paymentModeState[paymentModeIndex],
                updatePaymentMode = [...paymentModeState];
            updatePaymentMode.splice(paymentModeIndex, 1, { ...receiptDetails, selected: checked });
            setPaymentModeState(updatePaymentMode);
        }
    }

    const resetHandler = () => {
        const receiptMode = receiptOptionState.map((mode: any) => ({ ...mode, selected: false })), paymentMode = paymentModeOptions.map((mode: any) => mode.name);
        setReceiptOptionState(receiptMode);
        setPaymentModeState(paymentMode);
        props.applyFilterCallback({ ...filterState, startDate: "", endDate: "", branchClassId: "", branchCurriculumId: "" });
        props.toggle();
        setFilterState((prev: any) => ({ ...prev, startDate: "", endDate: "", branchClassId: "", branchCurriculumId: "" }))
    }
    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
    }, [props.isOpen])

    useEffect(() => {
        if (props.appliedFilter) {
            const { branchCurriculumId } = props.appliedFilter;
            setFilterState({ ...props.appliedFilter });
            setPaymentModeState(props.appliedFilter.paymentModes);
            setReceiptOptionState(props.appliedFilter.receiptTypes);
        }
    }, [props.appliedFilter])

    useEffect(() => {
        if (props.appliedFilter.academicYearId) {
            const { academicYearId, branchId } = props.appliedFilter;
            const payload = {
                branchId,
                academicYearId
            }
            dispatch(getFeeReceiptFeeNameAct(generateActionPayload("fee_receipts_fee_names", undefined, payload)));
        }
    }, [props.appliedFilter.academicYearId])

    function renderValue(selectedItems: any) {
        if (Array.isArray(selectedItems)) {
            return (<div className="text-truncate">
                {
                    selectedItems.map((item, index) => {
                        return item?.name + (index !== (selectedItems.length - 1) ? ', ' : '')
                    })
                }
            </div>)
        }
    }

    function renderOptions(item: any) {
        return item?.name;
    }

    const feeDetailsOptions = useMemo(() => {
        return (getFeeReceiptsFeeNamesResp || []).map((item: any) => ({
            id: item.feeName,
            name: item.feeName
        }));
    }, [getFeeReceiptsFeeNamesResp]);

    function onSelectOptionHandler(selectedOptions: any, config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            setFilterState((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            setFilterState((prevState: any) => ({ ...prevState, [name]: null }));
        }
    }

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
            setFilterState((prev:any) => ({ ...prev, startDate, endDate }));
        }
    } 

    const { content: ClassList } = classListForAdvanceFilter || {};
    return (
        <React.Fragment>
            <div className="offcanvas-body">
                {/* <SelectInput
                    name="academicYearId"
                    labelText="Academic Year"
                    value={filterState.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearListResp?.data}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    defaultSelect="Academic Year"
                />
                <SelectInput
                    name="branchCurriculumId"
                    labelText="Curriculum"
                    value={filterState.branchCurriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={brchCurriculumResp?.data}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    defaultSelect="Curriculum"
                />
                <SelectInput
                    name="branchClassId"
                    labelText="Class"
                    value={filterState.branchClassId}
                    onChange={onChangeFilterHndlr}
                    menuItems={ClassList || []}
                    valueKey="id"
                    textKey="shortName"
                    defaultSelect="Class"
                /> */}
                {/* <SelectInput
                    name="studentTypes"
                    labelText="Student Type"
                    value={filterState.studentTypes}
                    onChange={onChangeFilterHndlr}
                    menuItems={studentTypeOptions}
                    valueKey="id"
                    textKey="name"
                    defaultSelect="Student Type"
                /> */}
                <div className="tw-mb-3">
                    <label className="tw-mb-2">Receipt Type</label>
                    <div className="tw-flex">
                        {
                            receiptOptionState.map(item => (
                                <React.Fragment key={item.id}>
                                    <InputCheckbox
                                        name={item.id}
                                        labelName={item.name}
                                        formgroupClassName="tw-me-3 tw-mb-0"
                                        value={item.selected}
                                        dataId={item.id}
                                        onChange={onChangeReceiptTypeHndlr}
                                    />
                                </React.Fragment>
                            ))
                        }
                    </div>
                </div>
                <div className="tw-mb-3">
                    {/* <label className="mb-2">Date Range</label>
                    <div className="d-flex align-items-center">
                        <DateInput
                            name="startDate"
                            formgroupClassName="mb-0 flex-grow-1"
                            value={filterState.startDate}
                            onChange={onChangeFilterHndlr}
                        />
                        <span className="mx-2">To</span>
                        <DateInput
                            name="endDate"
                            formgroupClassName="mb-0 flex-grow-1"
                            value={filterState.endDate}
                            onChange={onChangeFilterHndlr}
                        />
                    </div> */}
                    <CustomDatePicker
                      name="dateRange"
                      startDate={filterState.startDate}
                      endDate={filterState.endDate}
                      onChange={handleDateChange}
                      placeholder="Select a Date Range"
                      monthsShown={2}
                      formgroupClassName="tw-mb-0"
                      labelText='Date Range'
                      portalId={"feereceipt-advance-filter"}
                    />
                </div>
                <div>
                    {/* <label className="mb-2">Payment Mode</label> */}
                    <div className="tw-mb-3">
                        {/* {
                            paymentModeState.map(item => (
                                <React.Fragment key={item.id}>
                                    <InputCheckbox
                                        name={item.id}
                                        labelName={item.name}
                                        formgroupClassName="me-3 mb-0"
                                        value={item.selected}
                                        dataId={item.id}
                                        onChange={onChangePaymentModeHndlr}
                                    />
                                </React.Fragment>
                            ))
                        } */}
                        <MultiSelectCheckbox
                        name="paymentModes"
                        idKey="id"
                        labelText="Payment Mode"
                        value={filterState?.paymentModes}
                        renderValue={renderValue}
                        renderOptions={renderOptions}
                        onChange={onSelectOptionHandler}
                        searchKey="name"
                        options={paymentModeOptions || []}
                    />
                    </div>
                </div>
                <div>
                    <MultiSelectCheckbox
                        name="feeDetails"
                        idKey="id"
                        labelText="Fee Name"
                        value={filterState?.feeDetails}
                        renderValue={renderValue}
                        renderOptions={renderOptions}
                        onChange={onSelectOptionHandler}
                        searchKey="name"
                        options={feeDetailsOptions || []}
                    />
                </div>
            </div>
            <div className="tw-border-t tw-p-3 tw-text-center">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={resetHandler}
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </React.Fragment>

    )
}