import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import {
    DateInput,
    SelectInput,
} from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    chequeAdvanceFilterClassAct, setChequeAdvanceFilterClassAct
} from "../../../store/fee/feeapprovals/feeapprovalactions";
//Helper
import { chequeStatusOptions, initialFilterState } from "./helper";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import Button from "../../../Components/Common/Button";

export default function AdvanceFilterModal(props: any) {
    const [filterState, setFilterState] = useState<any>({ ...initialFilterState });
    const dispatch = useAppDispatch();
    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
    } = useAppSelector(({ appData, branchAcademics, masterFeeSettings, feeApprovals, instAcademics }) => ({
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp,
    }), shallowEqual);

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === "curriculumId") {
            if (value) {
                getChequeClassApiCall(value);
            }
            dispatch(setChequeAdvanceFilterClassAct(undefined));
            setFilterState((prevState: any) => ({ ...prevState, [name]: value, branchClassId: "" }));
        } else {
            setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        }
    }

    function applyFilterHndlr() {
        props.applyFilterCallback(filterState);
    }

    const resetHandler = () => {
        const { academicYearId } = filterState,
            resetFilterState = { ...initialFilterState, academicYearId };
        setFilterState(resetFilterState);
        props.applyFilterCallback(resetFilterState);
    }

    function getChequeClassApiCall(curriculumId: string) {
        const payload = {
            pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
            curriculumId, branchId
        };
        dispatch(chequeAdvanceFilterClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    useEffect(() => {
        if (props.appliedFilter) {
            const { curriculumId } = props.appliedFilter || {};
            setFilterState({ ...props.appliedFilter });
        }
    }, [props.appliedFilter])

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
            setFilterState((prev:any) => ({ ...prev, startDate, endDate }));
        }
    } 

    return (
        <React.Fragment>
            <div className="tw-p-4 offcanvas-body">
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
                        portalId="cheque-advance-filter-modal"
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="chequeStatus"
                        value={filterState?.chequeStatus}
                        onChange={onChangeFilterHndlr}
                        menuItems={chequeStatusOptions}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText="Cheque Status"
                    />
                </div>
            </div>

            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="button"
                        onClick={resetHandler}
                        variant="secondary"
                    >
                        Reset
                    </Button>

                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        variant="primary"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </React.Fragment>

    )
}