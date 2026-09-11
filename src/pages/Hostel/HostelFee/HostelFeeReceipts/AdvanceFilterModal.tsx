import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import {
    DateInput,
    CustomSelect,
} from "../../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

import {  paymentModeOptions } from "./helper";

import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import Button from "../../../../Components/Common/Button";

export default function AdvanceFilterModal(props: any) {
    const [filterState, setFilterState] = useState<any>({
        academicYearId: "",
        curriculumId: "",
        classId: "",
        studentName: "",
        startDate: "",
        endDate: "",
        paymentMode:null,
        searchString:"", ...props.appliedFilter
    });
    // const [receiptOptionState, setReceiptOptionState] = useState(receiptTypeOptions);
    // const [paymentModeState, setPaymentModeState] = useState(paymentModeOptions);
    const dispatch = useAppDispatch();
    const {
         classListForAdvanceFilter, currentBranchIdResp: branchId,showApiLoader } =
        useAppSelector(({ appData, globalData, branchAcademics, masterFeeSettings, instAcademics, feeCollections }) => ({
            classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,

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
        props.toggle()
        // setFilterState((prev: any) => ({ ...prev, }))
        props.applyFilterCallback({ ...filterState, });
    }
    //test

    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
    }, [props.isOpen])

    useEffect(() => {
        if (props.appliedFilter) {
            const { branchCurriculumId } = props.appliedFilter;
            setFilterState({ ...props.appliedFilter });
            if (branchCurriculumId) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: branchCurriculumId, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }, [props.appliedFilter])

    function renderValue(selectedItems: any) {
        return `${selectedItems?.name}`;
    }

    function renderOptions(item: any) {
        return item?.name;
    }
    

    function onSelectOptionHandler(selectedOptions: any, config?: any) {
        const { name } = config;
        if (selectedOptions) {
            setFilterState((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            setFilterState((prevState: any) => ({ ...prevState, [name]: null }));
        }
    }

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
            setFilterState((prev:any) => ({ ...prev, startDate,endDate }));
        }
    }

    return (
        <React.Fragment>
            <div className="offcanvas-body">
             
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
                {/* <div className="mb-3">
                    <label className="mb-2">Receipt Type</label>
                    <div className="d-flex">
                        {
                            receiptOptionState.map(item => (
                                <React.Fragment key={item.id}>
                                    <InputCheckbox
                                        name={item.id}
                                        labelName={item.name}
                                        formgroupClassName="me-3 mb-0"
                                        value={item.selected}
                                        dataId={item.id}
                                        onChange={onChangeReceiptTypeHndlr}
                                    />
                                </React.Fragment>
                            ))
                        }
                    </div>
                </div> */}
                <div className="tw-mb-3">
                    <CustomDatePicker
                        name="dateRange"
                        startDate={filterState.startDate}
                        endDate={filterState.endDate}
                        onChange={handleDateChange}
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Date Range"
                        portalId={"hostel-fee-receipts-advance-filter"}
                    />
                </div>
                <div>
                    {/* <label className="mb-2">Payment Mode</label> */}
                    <div className="">
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
                        <CustomSelect
                            name="paymentMode"
                            idKey="id"
                            labelText="Payment Mode"
                            value={filterState?.paymentMode}
                            renderValue={renderValue}
                            renderOptions={renderOptions}
                            onChange={onSelectOptionHandler}
                            searchKey="name"
                            options={paymentModeOptions || []}
                        />
                    </div>
                </div>
            </div>
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                        variant="primary"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </React.Fragment>

    )
}