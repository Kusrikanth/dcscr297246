import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { TextIconInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
    exportAdmissionProcessReportAct,
    setExportAdmissionProcessReportAct, setConsolidatedNewAdmissionAct,
    getConsolidateNewAdmissionProcessAct
} from "../../../../store/FrontDesk/Reports/reportsactions";
import { generateReportDetailsColumns } from "./helper";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppSelector } from "../../../../hooks/storehook";
import { debounce } from "../../../../utility/commonutility";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";

export default function DetailReportModal({ branchId, dispatch, admissionProcess, appliedFilters }: any) {
    const [reportFilterState, setReportFilterState] = useState({ searchString: "" });
    const paginationRef = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const { showApiLoader, consolidatedNewAdmissionResp, exportAdmissionProcessReportResp }: any = useAppSelector(
        ({ globalData, reports }) => ({
            showApiLoader: globalData.showApiLoader,
            consolidatedNewAdmissionResp: reports.consolidatedNewAdmissionResp,
            exportAdmissionProcessReportResp: reports.exportAdmissionProcessReportResp,
        }), shallowEqual);

    useEffect(() => {
        if (exportAdmissionProcessReportResp) {
            // exportCsvFile("", admissionConsolidateReportResp);
            const url = window.URL.createObjectURL(new Blob([(exportAdmissionProcessReportResp)]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report_data.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Report downloaded successfully.");
        }
    }, [exportAdmissionProcessReportResp]);

    function paginationHndlr(paginationInfo: any) {
        paginationRef.current = paginationInfo;
        getDetailReportApiCall();
    }

    function search(value: any) {
        getDetailReportApiCall({ "searchString": value });
    }

    const debounceFun = useCallback(debounce(search, 200), [consolidatedNewAdmissionResp]);
    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setReportFilterState(prevState => ({ ...prevState, [name]: value }));
        paginationRef.current = { ...paginationRef.current, pageNo: 0 };
        debounceFun(value);
    }

    useEffect(() => {
        getDetailReportApiCall();
        return () => {
            dispatch(setExportAdmissionProcessReportAct(null));
            dispatch(setConsolidatedNewAdmissionAct(null));
        }
    }, [admissionProcess, appliedFilters]);


    function getDetailReportApiCall(otherProps?: any) {
        const { toDate, ...rest } = appliedFilters;
        delete rest.feePaidType;
        const payload = {
            branchId, ...rest,
            toDate: toDate ? toDate : rest?.fromDate,
            status: admissionProcess, ...reportFilterState, ...otherProps,
            ...paginationRef.current
        };
        dispatch(getConsolidateNewAdmissionProcessAct(generateActionPayload("consolidated_newreport_admission", undefined, payload)));
    }
    const reportColumns = useMemo(() => {
        const allReportColumns = generateReportDetailsColumns(admissionProcess);
        let filterColumns: any = [];
        if (admissionProcess === "totalApplications" || admissionProcess === "cancelledApplications" ||
            admissionProcess === "yetToRegister") {
            filterColumns = ["academicYear", "branch", "curriculum", "classShortName", "applicationNo",
                "studentName", "parentName", "email", "contactNo", "applicationSaleDate", "admissionProcessReg"];
        } else if (admissionProcess === "admissionConfirmedUnpaid") {
            filterColumns = ["academicYear", "branch", "curriculum", "classShortName",
                "registrationNo", "studentName", "email", "contactNo", "examDate", "scheduleMode", "admissionProcessReg"];
        } else if (admissionProcess === "Paid" || admissionProcess === "admissionConfirmedPaid") {
            filterColumns = ["academicYear", "branch", "curriculum", "classShortName",
                "studentName", "studentId", "email", "contactNo", "admissionProcessReg"];
        } else {
            filterColumns = ["academicYear", "branch", "curriculum", "classShortName", "registrationNo",
                "studentName", "email", "contactNo", "applicationSaleDate", "admissionProcessReg"];
        }
        return allReportColumns.filter(item => filterColumns.includes(item?.id));
    }, [admissionProcess]);

    function exportHandler() {
        const { toDate, ...rest } = appliedFilters;
        delete rest.feePaidType;
        const payload = {
            branchId, ...rest,
            toDate: toDate ? toDate : rest?.fromDate,
            status: admissionProcess, ...reportFilterState,
            pageNo: 0, pageSize: 5000
        };
        dispatch(exportAdmissionProcessReportAct(generateActionPayload("download_process_newreports", payload, undefined, {
            responseType: 'blob'
        })));
    }


    const { data: reportData, pageNumber, totalPages, totalElements } = consolidatedNewAdmissionResp || {};
    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded-lg tw-shadow">
                <div className="tw-p-3 tw-grid tw-gap-3 tw-grid-cols-1 lg:tw-grid-cols-2 tw-items-center">

                    {/* Search Input */}
                    <div className="tw-col-span-1 lg:tw-col-span-1">
                        <TextIconInput
                            formgroupClassName="tw-relative tw-search-box"
                            name="searchString"
                            value={reportFilterState.searchString}
                            placeHolder="Search"
                            onChange={onChangeHandler}
                        >
                            <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-text-gray-400 tw-pointer-events-none"></i>
                        </TextIconInput>
                    </div>

                    {/* Export Button (conditional) */}
                    {Array.isArray(reportData) && reportData.length > 0 && (
                        <div className="tw-col-span-1 tw-flex tw-justify-end">
                            <Button
                                disabled={showApiLoader}
                                type="button"
                                variant="info"
                                onClick={exportHandler}
                            >
                                <i className="ri-add-line tw-mr-2" />
                                Export
                            </Button>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="tw-overflow-x-auto tw-mb-2">
                    <TableContainer
                        columns={reportColumns}
                        data={Array.isArray(reportData) ? reportData : []}
                        tableClass="tw-mb-0"
                        divClass="tw-overflow-x-auto tw-mb-2"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        paginationContainerClass="tw-px-3 tw-pt-0 tw-pb-2"
                        showPagination={true}
                        totalPages={totalPages}
                        totalRecords={totalElements}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageNumber}
                    />
                </div>
            </div>
            <div className="card-footer">

            </div>
        </React.Fragment>
    )
}