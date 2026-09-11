import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { TextIconInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import Button from "../../../../Components/Common/Button";
import {
    exportAdmissionProcessReportAct, getAdmissionProcessReportAct,
    setExportAdmissionProcessReportAct, setAdmissionProcessReportAct
} from "../../../../store/FrontDesk/Reports/reportsactions";
import { generateReportDetailsColumns, visibleColumns } from "./helper";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppSelector } from "../../../../hooks/storehook";
import { debounce } from "../../../../utility/commonutility";
import { toast } from "react-toastify";

export default function DetailReportModal({ branchId, dispatch, admissionProcess, appliedFilters }: any) {
    const [reportFilterState, setReportFilterState] = useState({ searchString: "" });
    const paginationRef = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const { showApiLoader, admissionProcessReportResp, exportAdmissionProcessReportResp }: any = useAppSelector(
        ({ globalData, reports }) => ({
            showApiLoader: globalData.showApiLoader,
            admissionProcessReportResp: reports.admissionProcessReportResp,
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

    const debounceFun = useCallback(debounce(search, 200), [admissionProcessReportResp]);
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
            dispatch(setAdmissionProcessReportAct(null));
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
        dispatch(getAdmissionProcessReportAct(generateActionPayload("admission_process_reports", undefined, payload)));
    }
    const reportColumns = useMemo(() => {
        const allReportColumns = generateReportDetailsColumns(admissionProcess);
        if (Array.isArray(visibleColumns?.[admissionProcess])) {
            return allReportColumns.filter(item => visibleColumns[admissionProcess].includes(item?.id));
        }
        return allReportColumns;
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
        dispatch(exportAdmissionProcessReportAct(generateActionPayload("download_process_reports", payload, undefined, {
            responseType: 'blob'
        })));
    }


    const { data: reportData, pageNumber, totalPages, totalElements } = admissionProcessReportResp || {};
    return (
        <React.Fragment>
            <div className="tw-p-0">
                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-p-3 tw-gap-3">
                    <div className="tw-w-full md:tw-w-1/2 xl:tw-w-1/3">
                        <TextIconInput
                            formgroupClassName="search-box tw-mb-0"
                            name="searchString"
                            value={reportFilterState.searchString}
                            placeHolder="Search"
                            onChange={onChangeHandler}
                        ><i className="ri-search-line search-icon"></i></TextIconInput>
                    </div>
                    {Array.isArray(reportData) && reportData.length > 0 && <div className="tw-flex tw-justify-end">
                        <Button
                            disabled={showApiLoader}
                            type="button"
                            variant="primary"
                            onClick={exportHandler} >
                            <i className="ri-add-line tw-mr-2" />
                            Export
                        </Button>
                    </div>}
                </div>
                <TableContainer
                    columns={reportColumns}
                    data={Array.isArray(reportData) ? reportData : []}
                    tableClass="tw-mb-0"
                    divClass="table-responsive tw-mb-2"
                    theadClass="table-light tw-text-gray-500 tw-align-middle"
                    paginationContainerClass="tw-px-3 tw-pt-0 tw-pb-2"
                    showPagination={true}
                    totalPages={totalPages}
                    totalRecords={totalElements}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={pageNumber}
                />
            </div>
            <div className="tw-border-t tw-p-3">

            </div>
        </React.Fragment>
    )
}