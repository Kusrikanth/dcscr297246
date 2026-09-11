import React, { useEffect, useMemo, useRef } from "react";
import { shallowEqual } from "react-redux";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { setClassByBranchStatusStudentsAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { getTopTenDepartmentsModelAct } from "../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction";
import { generateStudentModalColumns } from "./helper";
import { Button } from "../../../../Components/Common";

export default function TopTenDepartmentsModel({
    toggle, isOpen, filterValues,filterState
}: any) {
  
    const dispatch = useAppDispatch();
    const paginationRef = useRef({
        pageNo: 0, pageSize: 10
    })

    const {
        getTopTenDepartmentsModelResp,
        currentInstIdResp: instituteId
    } = useAppSelector(
        ({ concernsFeedback, appData }) => ({
            getTopTenDepartmentsModelResp: concernsFeedback.getTopTenDepartmentsModelResp,
            currentInstIdResp: appData.currentInstIdResp,
        }),
        shallowEqual
    );

    const getStudentsList = (paginationInfo?: any) => {
        const payload = {
         instituteId, academicYearId: filterState?.academicYearId, branchId: filterState?.branchId,departmentName: filterValues?.departmentName,  ...paginationRef.current
        }
        if (payload.academicYearId) {
            dispatch(getTopTenDepartmentsModelAct(generateActionPayload("get_top_ten_departments_model", undefined, payload)));
        }
    }

    useEffect(() => {
        if (filterValues) {
            getStudentsList()
        }
        return () => {
            dispatch(setClassByBranchStatusStudentsAct(undefined))
        }
    }, [])

   

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationRef.current = paginationInfo;
        getStudentsList(paginationInfo)
    }

    const { totalElements, totalPages, pageble } = getTopTenDepartmentsModelResp || {}
    const studentColumns = useMemo(() => generateStudentModalColumns(), []);

    return (
        <div className="container-fluid">
            <div className="tw-grid tw-grid-cols-12 tw-gap-y-3 tw-items-center tw-justify-between">
                <div className="tw-col-span-12 tw-p-3 tw-text-center">
                    <TableContainer
                        columns={studentColumns}
                        data={Array.isArray(getTopTenDepartmentsModelResp?.data) ? getTopTenDepartmentsModelResp?.data : []}
                        divClass="table-responsive tw-mb-3"
                        tableClass="table-nowrap"
                        theadClass="table-light text-muted align-middle"
                        showPagination={true}
                        totalPages={totalPages || 0}
                        totalRecords={totalElements || 0}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageble?.pageNumber || 0}
                    />
                </div>
                <div className="tw-col-span-12 tw-pb-3 tw-px-3 tw-flex tw-justify-end">
                    <Button
                        type="button"
                        onClick={toggle}
                        variant="secondary"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>

    )
}