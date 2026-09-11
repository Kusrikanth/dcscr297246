import React, { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import {
    DateInput,
} from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    chequeAdvanceFilterClassAct, setChequeAdvanceFilterClassAct
} from "../../../store/fee/feeapprovals/feeapprovalactions";
//Helper
import { initialFilterState } from "./helper";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import Button from "../../../Components/Common/Button";

export default function AdvanceFilterModal(props: any) {
    const [filterState, setFilterState] = useState<any>({ ...initialFilterState,...props.appliedFilter });
    const dispatch = useAppDispatch();
    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp,
        chequeAdvanceFilterClassResp
    } = useAppSelector(({ appData, branchAcademics, masterFeeSettings, feeApprovals, instAcademics }) => ({
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        academicYearListResp: instAcademics.academicYearListResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        chequeAdvanceFilterClassResp: feeApprovals.chequeAdvanceFilterClassResp,
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
            if (curriculumId) {
                getChequeClassApiCall(curriculumId);
            }
            setFilterState({ ...props.appliedFilter });
        }
    }, [props.appliedFilter])

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
            setFilterState((prev:any) => ({ ...prev, startDate,endDate }));
        }
    }

    return (
        <React.Fragment>
            <div className="offcanvas-body">
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
                        portalId={"hostel-cheque-advance-filter-modal"}
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