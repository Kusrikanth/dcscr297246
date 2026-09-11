import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SelectInput, TextInput } from "../../../Components/Common";
import TableContainer from "../../../Components/Common/TableContainer";
import {
    generateColumns,
} from "../../FreeModules/TransferRequestApprovals/TCApprovalList/helper";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import TcFilters, { initialFilterValues } from "../../FreeModules/TransferRequestApprovals/TcFilters";
import { getTcRequestList, setTcRequestAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../Components/Common/Pagination";

const TCApprovalList = () => {
    const paginationDetails = useRef({
        pageNo: 0,
        pageSize: 10
    })
    const filterRef = useRef(initialFilterValues);
    const dispatch = useDispatch();

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
        tcRequestList,
        classroomManagmentErrorResp }: any =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                tcRequestList: classroomManagmentInfo.tcRequestList,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp
            }), shallowEqual);

    const tcRequestRespRef = useRef({
        prevClassroomManagmentErrorResp: classroomManagmentErrorResp
    })

    useEffect(() => {
        const { prevClassroomManagmentErrorResp } = tcRequestRespRef.current;
        if (classroomManagmentErrorResp && prevClassroomManagmentErrorResp !== classroomManagmentErrorResp) {
            const { message, details }: any = classroomManagmentErrorResp;
            toast.error(message || details || "Something went wrong.");
        }
        tcRequestRespRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;
    }, [classroomManagmentErrorResp]);

    useEffect(() => {
        return () => {
            dispatch(setTcRequestAct(undefined));
        }
    }, []);

    const getTcRequestListResponse = (otherProps?: any) => {
        const params = {
            branchId,
            ...filterRef.current,
            ...otherProps,
            departmentName: "TRANSPORT",
            approvedStatus: "APPROVED",
            ...paginationDetails.current,
        }
        dispatch(getTcRequestList(generateActionPayload('tc_request_bydept', undefined, params)))
    }

    function updateFilterHandler(appliedFilter: any) {
        paginationDetails.current.pageNo = 0;
        filterRef.current = appliedFilter;
        getTcRequestListResponse();
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetails.current = paginationInfo;
        getTcRequestListResponse(paginationInfo)
    }

    const roleColumns = useMemo(() => generateColumns(), []);
    const { content: TcRequestList = [], totalElements, totalPages, number: pageNumber } = tcRequestList || {}; 
    return (
        <div className="tw-inline-block tw-w-full tw-mt-2">

            <TcFilters
                branchId={branchId}
                instituteId={instituteId}
                dispatch={dispatch}
                filterValues={filterRef.current}
                updateFilterHandler={updateFilterHandler}
            />
            <TableContainer
                columns={roleColumns || []}
                data={TcRequestList}
                divClass="tw-overflow-x-auto tw-mb-4"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
            />
        </div>
    );
};

export default TCApprovalList;
