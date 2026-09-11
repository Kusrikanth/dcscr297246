import React, { useEffect, useState } from "react";
//Custom Hooks
import { useAppDispatch } from "../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    chequeAdvanceFilterClassAct, setChequeAdvanceFilterClassAct
} from "../../../../store/fee/feeapprovals/feeapprovalactions";
//Helper
import { initialFilterState } from "./helper";
import { Current_Date_YYYYMMDD } from "../../../../utility/dateutility";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import Button from "../../../../Components/Common/Button";

export default function AdvanceFilterModal(props: any) {
    const [filterState, setFilterState] = useState<any>({ ...initialFilterState,...props.appliedFilter });
    const dispatch = useAppDispatch();

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === "curriculumId") {
            if (value) {
                getChequeClassApiCall(value);
            }
            dispatch(setChequeAdvanceFilterClassAct(undefined));
            setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
        } else {
            setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        }
    }

    function applyFilterHndlr() {
        if(filterState?.examStartDate && !filterState?.examEndDate){
            props.applyFilterCallback({...filterState , examEndDate : Current_Date_YYYYMMDD});
        }else{
            props.applyFilterCallback(filterState);
        }
    }

    function getChequeClassApiCall(curriculumId: string,academicYearId?:any) {
        const payload = {academicYearId:academicYearId?academicYearId:filterState.academicYearId,curriculumId, evaluationCode:"EXAM"};
        if(payload.academicYearId&&payload.curriculumId){
            dispatch(chequeAdvanceFilterClassAct(generateActionPayload("get_evaluation_class_list", undefined, payload)));
        }
    }

    useEffect(() => {
        if (props.appliedFilter) {
            setFilterState({ ...props.appliedFilter });
        }
    }, [props.appliedFilter])

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
            setFilterState((prev:any) => ({ ...prev, examStartDate:startDate, examEndDate:endDate }));
        }
    } 

    return (
        <React.Fragment>
            <div className="offcanvas-body">
            <div className='tw-mb-3'>
                <CustomDatePicker
                    name="dateRange"
                    startDate={filterState.examStartDate}
                    endDate={filterState.examEndDate}
                    onChange={handleDateChange}
                    placeholder="Select a Date Range"
                    monthsShown={2}
                    formgroupClassName="tw-mb-0"
                    labelText='Date Range'
                    portalId={"examination-filter-modal"}
                />
                </div>
            </div>
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="hstack tw-gap-2 tw-justify-end">
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