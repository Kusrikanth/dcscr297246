import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    TextInput,
} from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateColumns } from "./helper";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { useFilterState } from "../../../hooks/filterhook";
import { getScheduleLogListAct } from "../../../store/StudentAttendance/ScheduleLog/scheduleLogaction";
import Button from "../../../Components/Common/Button";

const initialValues = {
    searchString: "",
    branchId: "",
};

const ScheduleLogs = () => {
    const dispatch = useAppDispatch();
    const { showClearFilterState, advanceFilterChange } = useFilterState();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10,
    });
    const ScheduleLogListApi = (otherProps?: any) => {
        const { searchString } = scheduleLogFilterState;
        let payload = {
            instituteId: instituteId,
            branchId,
            searchString,
            module: "ATTENDANCE",
            ...otherProps,
            ...pagination.current,
        };
        if (payload.instituteId) {
            dispatch(getScheduleLogListAct(generateActionPayload("get_schedule_logs", undefined, payload)));
        }
    };

    const [scheduleLogFilterState, setScheduleLogFilterState] =useState(initialValues);

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getScheduleLogListResp,
    } = useAppSelector(
        ({  appData, scheduleLog }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getScheduleLogListResp: scheduleLog.getScheduleLogListResp,
        }),
        shallowEqual
    );

    useEffect(() => {
        ScheduleLogListApi();
    }, [branchId, instituteId]);
    

    const roleColumns = useMemo(() => generateColumns(),[getScheduleLogListResp]);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setScheduleLogFilterState((prev: any) => ({ ...prev, [name]: value }));
        pagination.current.pageNo = 0;
        ScheduleLogListApi({ [name]: value });
        advanceFilterChange({keys: { ...scheduleLogFilterState, [name]: value },ignoredKeys: [],});
    };


    const clearFilterHndlr = () => {
        setScheduleLogFilterState({ ...initialValues });
        ScheduleLogListApi({ ...initialValues, branchId });
        advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
    };

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        ScheduleLogListApi(paginationInfo);
    }
    const { totalElements, totalPages, pageble } = getScheduleLogListResp || {};

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Schedule Logs" pageTitle="Student Attendance" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Schedule Logs
                                </h4>
                            </div>
                        </div>

                        <div className="tw-p-4">
                            <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3">
                                <div className="tw-w-1/6">
                                    <div className="tw-relative search-box">
                                        <TextInput
                                            name="searchString"
                                            value={scheduleLogFilterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="bg-soft-light"
                                            formgroupClassName="mb-0"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2"></i>
                                    </div>
                                </div>

                                {showClearFilterState && (
                                    <div className="tw-ml-auto">
                                        <Button
                                            type="button"
                                            onClick={clearFilterHndlr}
                                            variant="wrong"
                                        >
                                            Clear filter
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <TableContainer
                            columns={roleColumns || []}
                            data={
                                Array.isArray(getScheduleLogListResp?.content)
                                    ? getScheduleLogListResp?.content
                                    : []
                            }
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageble?.pageNumber || 0}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ScheduleLogs;
