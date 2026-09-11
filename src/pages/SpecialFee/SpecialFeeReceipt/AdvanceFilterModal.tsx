import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import {
    DateInput,
    InputCheckbox,
    MultiSelectCheckbox,
    SelectInput,
} from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

import { receiptTypeOptions, paymentModeOptions } from "./helper";
import { getClassListAdvanceFilter, getSplFeeReceiptFeeNameAct, resetClassListForAdvanceFilterAct, resetSplFeeReceiptsFeeNamesAct } from "../../../store/fee/feecollections/feecollectionactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import Button from "../../../Components/Common/Button";

export default function AdvanceFilterModal(props: any) {
    const [filterState, setFilterState] = useState({
        startDate: "",
        endDate: "",
        branchClassId: "",
        branchCurriculumId: "",
        academicYearId: "",
        category : "",
        feeDetails : "",
        paymentModes: [],
    });
    const [receiptOptionState, setReceiptOptionState] = useState(receiptTypeOptions);
    const dispatch = useAppDispatch();
    const {
         classListForAdvanceFilter, currentBranchIdResp: branchId,showApiLoader,getSpecialFeeCategoryListResp, getSplFeeReceiptsFeeNamesResp } =
        useAppSelector(({ appData, globalData, branchAcademics, masterFeeSettings, instAcademics, feeCollections }) => ({
            classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            getSpecialFeeCategoryListResp: masterFeeSettings.getSpecialFeeCategoryListResp,
            getSplFeeReceiptsFeeNamesResp: feeCollections.getSplFeeReceiptsFeeNamesResp,
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

    const resetHandler = () => {
        const receiptMode = receiptOptionState.map((mode: any) => ({ ...mode, selected: false })), paymentMode = paymentModeOptions.map((mode: any) => mode.name);
        setReceiptOptionState(receiptMode);
        props.applyFilterCallback({ ...filterState, startDate: "", endDate: "", branchClassId: "", branchCurriculumId: "" });
        props.toggle();
        setFilterState((prev: any) => ({ ...prev, startDate: "", endDate: "", branchClassId: "", branchCurriculumId: "" }))
    }
    
    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
            dispatch(resetClassListForAdvanceFilterAct(undefined));
            dispatch(resetSplFeeReceiptsFeeNamesAct(undefined));
        }
    }, [props.isOpen])

    useEffect(() => {
        if (props.appliedFilter.academicYearId, filterState.category) {
            const { academicYearId } = props.appliedFilter;
            const selectedCategory = getSpecialFeeCategoryListResp?.find(
                (item: any) => item.categoryName === filterState.category
            );

            const payload = {
                branchId,
                academicYearId,
                categoryId: selectedCategory?.id || null
            }
            dispatch(getSplFeeReceiptFeeNameAct(generateActionPayload("spl_fee_receipts_fee_names", undefined, payload)));
        }
    }, [props.appliedFilter.academicYearId, filterState.category])

    useEffect(() => {
        if (props.appliedFilter) {
            const { branchCurriculumId } = props.appliedFilter;
            setFilterState({ ...props.appliedFilter });
            setReceiptOptionState(props.appliedFilter.receiptTypes);
            if (branchCurriculumId) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: branchCurriculumId, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }, [props.appliedFilter])

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
                <div className="tw-mb-4">
                    <label className="tw-mb-2 tw-block tw-font-medium">
                        Receipt Type
                    </label>

                    <div className="tw-flex tw-flex-wrap">
                        {receiptOptionState.map(item => (
                            <React.Fragment key={item.id}>
                                <InputCheckbox
                                    name={item.id}
                                    labelName={item.name}
                                    formgroupClassName="tw-mr-4 tw-mb-0"
                                    value={item.selected}
                                    dataId={item.id}
                                    onChange={onChangeReceiptTypeHndlr}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="tw-mb-4">
                    <CustomDatePicker
                        name="dateRange"
                        startDate={filterState.startDate}
                        endDate={filterState.endDate}
                        onChange={handleDateChange}
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Date Range"
                        portalId="special-fee-receipt-advance-filter"
                    />
                </div>

                <div className="tw-mb-4">
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

                <div className="tw-mb-4">
                    <SelectInput
                        name="category"
                        value={filterState.category}
                        onChange={onChangeFilterHndlr}
                        menuItems={getSpecialFeeCategoryListResp}
                        formgroupClassName="tw-mb-0"
                        valueKey="categoryName"
                        textKey="categoryName"
                        labelText="Category"
                    />
                </div>
                <div className="tw-mb-4">
                    <SelectInput
                        name="feeDetails"
                        value={filterState.feeDetails}
                        onChange={onChangeFilterHndlr}
                        menuItems={getSplFeeReceiptsFeeNamesResp}
                        formgroupClassName="tw-mb-0"
                        valueKey="feeName"
                        textKey="feeName"
                        labelText="Fee Name"
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
                        variant="primary"
                        type="submit"
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