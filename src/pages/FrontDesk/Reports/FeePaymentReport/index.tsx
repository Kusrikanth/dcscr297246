import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import {
    OffCanvasContainer, SelectInput, TextInput, DateInput, ModalContainerUpdated
} from "../../../../Components/Common";

import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { getAppliedFilterCount } from "./helper";
import StatusCard from "./StatusCard";
import { useFormik } from "formik";

import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { resetBrchClassAct, resetBrchCurriculumAct, setBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { toast } from "react-toastify";
import * as Yup from 'yup';
import { generateColumns, generateColumnsForFeeCollection } from "./helper";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { getFeeSumAmountListAct, getFeeTypeWiseListAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { resetFeeSumAmountListAct, resetFeeTypeWiseListAct } from "../../../../store/FrontDesk/Reports/reportsslice";
import { debounce, sanitizeUrlParams } from "../../../../utility/commonutility";
import { exportFeeCollectionAct, getFeeCollectionAct } from "../../../../store/fee/feereport/feereportactions";
import { Current_Date_YYYYMMDD, getYyyyMmDdFormat } from "../../../../utility/dateutility";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { useModal } from "../../../../hooks/modalhook";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    startDate: Current_Date_YYYYMMDD,
    endDate: Current_Date_YYYYMMDD,
    dateType: "RECEIPT_DATE",
};

const validationSchema = Yup.object().shape({
    // academicYearId: Yup.string().required("Academic Year is Required").nullable(),
    // curriculumId: Yup.string().required("Curriculum is Required").nullable()
})

export default function FeePaymentReport() {
    const dispatch = useDispatch();
    const [advanceFilterState, setShowAdvanceFilterState] = useState<boolean>(false);
    const { modalState: exportModalState, openModal: openExportModalHndlr,
        closeModal: closeExportModalHndlr } = useModal();
    const [feeTypeWiseSum, setFeeTypeWiseSum] = useState<any>([])
    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getFeeSumAmountListResp,
        getFeeTypeWiseListResp,
        feeReceiptsResp,
        feeCollectionResp,
        feeReportErrorResp,
        exportFeeCollectionResp,
        feeCollectionErrorResp
    } = useAppSelector(
        ({ globalData, instAcademics, appData,
            feeCollections, reports, feeReport }) => ({
                academicYearListResp: instAcademics.academicYearListResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                showApiLoader: globalData.showApiLoader,
                getFeeSumAmountListResp: reports.getFeeSumAmountListResp,
                getFeeTypeWiseListResp: reports.getFeeTypeWiseListResp,
                feeCollectionResp: feeReport.feeCollectionResp,
                exportFeeCollectionResp: feeReport.exportFeeCollectionResp,
                feeReceiptsResp: feeCollections.feeReceiptsResp,
                feeReportErrorResp: feeReport.feeReportErrorResp,
                feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
            }),
        shallowEqual
    );
    const [receiptFilterState, setReceiptFilterState] = useState({
        searchString: ""
    });

    const advanceFilterRef = useRef<any>(null);
    const paginationRef = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const feePaymentReportRef = useRef({
        prevAcademicYearListResp: academicYearListResp,
        prevGetFeeTypeWiseListResp: getFeeTypeWiseListResp,
        prevFeeReceiptsResp: feeReceiptsResp,
        prevFeeReportErrorResp: feeReportErrorResp,
        prevExportFeeCollectionResp: exportFeeCollectionResp,
        prevFeeCollectionErrorResp: feeCollectionErrorResp
    });
    useEffect(() => {
        if (instituteId && branchId) {
            const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
            getFeeSumAmoutApiCall();
            getFeeTypeSummaryApiCall();
            getFeeCollectionApiCall();
            return () => {
                dispatch(resetBrchCurriculumAct(undefined));
                dispatch(resetBrchClassAct(undefined));
                dispatch(resetFeeTypeWiseListAct(undefined));
                dispatch(resetFeeSumAmountListAct(undefined));
            }
        }
    }, [instituteId, branchId]);

    useEffect(() => {
        const { prevGetFeeTypeWiseListResp,
            prevExportFeeCollectionResp,
            prevFeeReportErrorResp, prevFeeCollectionErrorResp
        } = feePaymentReportRef.current;
        if (getFeeTypeWiseListResp && prevGetFeeTypeWiseListResp !== getFeeTypeWiseListResp) {
            const array: any = [];
            getFeeTypeWiseListResp?.map((item: any) => {
                if (!(array?.includes(item?.feeDetails))) {
                    array.push(item?.feeDetails)
                }
            })
            const newArray = array?.map((item: any) => {
                const abc: any = [];
                let totalAmount = 0;

                getFeeTypeWiseListResp?.map((i: any) => {
                    if (i?.feeDetails === item) {
                        return abc.push(i)
                    }
                })
                const resultObject: any = {};
                abc?.forEach((acc: any) => {
                    const key = `${acc.paymentMode?.toLowerCase()}`;
                    resultObject[key] = acc.sumOfAmountsPaid;
                    if (!isNaN(acc.sumOfAmountsPaid)) {
                        totalAmount += Number(acc.sumOfAmountsPaid);
                    }
                });
                return { feeDetails: item, ...resultObject, total_amount: totalAmount };
            })
            setFeeTypeWiseSum(newArray);
        } else if (exportFeeCollectionResp && prevExportFeeCollectionResp !== exportFeeCollectionResp) {
            // exportCsvFile("", exportFeeCollectionResp);
            const url = window.URL.createObjectURL(new Blob([(exportFeeCollectionResp)]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'fee_cash_report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            closeExportModalHndlr();
            toast.success("Report downloaded successfully.");
        } else if (feeReportErrorResp && feeReportErrorResp !== prevFeeReportErrorResp) {
            const { details, message } = feeReportErrorResp;
            toast.error(details || message || "Something went wrong.");
        } else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
            const { details, message } = feeCollectionErrorResp;
            toast.error(details || message || "Something went wrong.");
        }
        feePaymentReportRef.current.prevGetFeeTypeWiseListResp = getFeeTypeWiseListResp;
        feePaymentReportRef.current.prevExportFeeCollectionResp = exportFeeCollectionResp;
        feePaymentReportRef.current.prevFeeReportErrorResp = feeReportErrorResp;
        feePaymentReportRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
    }, [getFeeTypeWiseListResp, exportFeeCollectionResp, feeReportErrorResp, feeCollectionErrorResp])

    const feeReportFilterForm = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            paginationRef.current.pageNo = 0;
            setReceiptFilterState(prevState => ({ ...prevState, searchString: "" }));
            getFeeSumAmoutApiCall(feeReportFilterForm.values);
            getFeeTypeSummaryApiCall(feeReportFilterForm.values);
            getFeeCollectionApiCall(feeReportFilterForm.values);
        },
    });

    function downloadExcelFile(blobStream: any) {
        const url = window.URL.createObjectURL(new Blob([(blobStream)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Student_Change_Details.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    const toggleAdvanceFilter = () => {
        setShowAdvanceFilterState(prev => !prev);
    }


    function getFeeSumAmoutApiCall(otherProps?: any) {
        const payload = {
            branchId, ...feeReportFilterForm.values,
            ...advanceFilterRef.current,
            ...otherProps
        }, { feeNames, terms, classIds, feeTypes, paymentModes, paidAt } = payload;
        payload.feeNames = Array.isArray(feeNames) ? feeNames.map(item => item.feeName).join(",") : "";
        payload.terms = Array.isArray(terms) ? terms.map(item => item.termId).join(",") : "";
        payload.classIds = Array.isArray(classIds) ? classIds.map(item => item.id).join(",") : "";
        payload.feeTypes = Array.isArray(feeTypes) ? feeTypes.map(item => item.feeType).join(",") : "";
        payload.paymentModes = Array.isArray(paymentModes) ? paymentModes.map(item => item.id).join(",") : "";
        payload.paidAt = Array.isArray(paidAt) ? paidAt.map(item => item.id).join(",") : "";
        const sanitizedPayload = sanitizeUrlParams(payload);
        dispatch(getFeeSumAmountListAct(generateActionPayload("get_fee_sum_amount", undefined, sanitizedPayload)));
    }

    function getFeeTypeSummaryApiCall(otherProps?: any) {
        const payload = {
            branchId, ...feeReportFilterForm.values,
            ...advanceFilterRef.current, ...otherProps
        }, { feeNames, terms, classIds, feeTypes, paymentModes, paidAt } = payload;
        payload.feeNames = Array.isArray(feeNames) ? feeNames.map(item => item.feeName).join(",") : "";
        payload.terms = Array.isArray(terms) ? terms.map(item => item.termId).join(",") : "";
        payload.classIds = Array.isArray(classIds) ? classIds.map(item => item.id).join(",") : "";
        payload.feeTypes = Array.isArray(feeTypes) ? feeTypes.map(item => item.feeType).join(",") : "";
        payload.paymentModes = Array.isArray(paymentModes) ? paymentModes.map(item => item.id).join(",") : "";
        payload.paidAt = Array.isArray(paidAt) ? paidAt.map(item => item.id).join(",") : "";
        const sanitizedPayload = sanitizeUrlParams(payload);
        dispatch(getFeeTypeWiseListAct(generateActionPayload("get_fee_type_wise_sum", undefined, sanitizedPayload)));
    }

    function getFeeCollectionApiCall(otherProps?: any) {
        const payload = {
            branchId, ...feeReportFilterForm.values,
            ...advanceFilterRef.current, ...receiptFilterState, ...otherProps,
            ...paginationRef.current, orderBy: "", sortBy: ""
        }, { feeNames, terms, classIds, feeTypes, paymentModes, paidAt } = payload;
        payload.feeNames = Array.isArray(feeNames) ? feeNames.map(item => item.feeName).join(",") : "";
        payload.terms = Array.isArray(terms) ? terms.map(item => item.termId).join(",") : "";
        payload.classIds = Array.isArray(classIds) ? classIds.map(item => item.id).join(",") : "";
        payload.feeTypes = Array.isArray(feeTypes) ? feeTypes.map(item => item.feeType).join(",") : "";
        payload.paymentModes = Array.isArray(paymentModes) ? paymentModes.map(item => item.id).join(",") : "";
        payload.paidAt = Array.isArray(paidAt) ? paidAt.map(item => item.id).join(",") : "";
        const sanitizedPayload = sanitizeUrlParams(payload);
        dispatch(getFeeCollectionAct(generateActionPayload("get_feecollection", undefined, sanitizedPayload)));
    }

    function showAdvanceFilterHandler() {
        if (feeReportFilterForm.isValid) {
            setShowAdvanceFilterState(true);
        } else {
            feeReportFilterForm.handleSubmit();
        }
    }
    function advanceFilterCallbckHndlr(appliedFilters: any) {
        advanceFilterRef.current = appliedFilters;
        setShowAdvanceFilterState(false);
        getFeeSumAmoutApiCall();
        getFeeTypeSummaryApiCall();
        getFeeCollectionApiCall();
    }

    function paginationHndlr(paginationInfo: any) {
        paginationRef.current = paginationInfo;
        getFeeCollectionApiCall();
    }

    function search(value: any) {
        getFeeCollectionApiCall({ "searchString": value });
    }
    const debounceFun = debounce(search, 200);
    function onSearchReceiptHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        paginationRef.current.pageNo = 0;
        setReceiptFilterState(prevState => ({ ...prevState, [name]: value }));
        paginationRef.current = { ...paginationRef.current, pageNo: 0 };
        debounceFun(value);
    }

    function clearFilterHndlr() {
        feeReportFilterForm.resetForm({
            values: { ...initialValues, academicYearId: feeReportFilterForm.values.academicYearId }
        })
        advanceFilterRef.current = null;
        dispatch(setBrchClassAct(undefined));
        getFeeSumAmoutApiCall({ ...initialValues, academicYearId: feeReportFilterForm.values.academicYearId });
        getFeeTypeSummaryApiCall({ ...initialValues, academicYearId: feeReportFilterForm.values.academicYearId });
        getFeeCollectionApiCall({ ...initialValues, academicYearId: feeReportFilterForm.values.academicYearId });
    }

    function exportHandler() {
        const payload = {
            branchId, ...feeReportFilterForm.values,
            ...advanceFilterRef.current, ...receiptFilterState,
        }, { feeNames, terms, classIds, feeTypes, paymentModes, paidAt } = payload;
        payload.feeNames = Array.isArray(feeNames) ? feeNames.map(item => item.feeName).join(",") : "";
        payload.terms = Array.isArray(terms) ? terms.map(item => item.termId).join(",") : "";
        payload.classIds = Array.isArray(classIds) ? classIds.map(item => item.id).join(",") : "";
        payload.feeTypes = Array.isArray(feeTypes) ? feeTypes.map(item => item.feeType).join(",") : "";
        payload.paymentModes = Array.isArray(paymentModes) ? paymentModes.map(item => item.id).join(",") : "";
        payload.paidAt = Array.isArray(paidAt) ? paidAt.map(item => item.id).join(",") : "";
        const sanitizedPayload = sanitizeUrlParams(payload);
        dispatch(exportFeeCollectionAct(generateActionPayload("export_feecollection", undefined, sanitizedPayload, {
            responseType: 'blob'
        })));
    }

    function onchangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === "dateType") {
            feeReportFilterForm.setValues(prevValues => ({ ...prevValues, [name]: value }));
        } else {
            feeReportFilterForm.setValues(prevValues => ({ ...prevValues, [name]: value, endDate: "" }));
        }
    }
    const handleDateChange = ({ startDate, endDate }: any) => {
        if (startDate && endDate) {
            feeReportFilterForm.setValues((prev) => ({ ...prev, startDate, endDate }));
        }
    }
    const feeTypeWiseColumns = useMemo(() => generateColumns(), []);
    const feeCollectionColumns = useMemo(() => generateColumnsForFeeCollection(), [feeCollectionResp]);
    const { data: feeCollectionList, pageNumber, totalPages, totalElements } = feeCollectionResp || {};
    const filterCount = getAppliedFilterCount({ ...advanceFilterRef.current });
    return (
        <React.Fragment>
            <div className="page-content fee-payment-reports">
                <div className="container-fluid">
                    <BreadCrumb title="Students Management" pageTitle="Fee" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                                Fee Payment Reports
                            </h4>
                        </div>

                        <div className="tw-p-4">
                            <form onSubmit={feeReportFilterForm.handleSubmit}>
                                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-12 tw-gap-4">

                                    <div className="lg:tw-col-span-2">
                                        <SelectInput
                                            name="academicYearId"
                                            formgroupClassName="tw-mb-0"
                                            value={feeReportFilterForm.values.academicYearId}
                                            onChange={feeReportFilterForm.handleChange}
                                            menuItems={academicYearListResp?.data}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            defaultSelect="Academic Year"
                                            invalid={!!(feeReportFilterForm.touched.academicYearId && feeReportFilterForm.errors.academicYearId)}
                                            error={feeReportFilterForm.touched.academicYearId ? feeReportFilterForm.errors.academicYearId : ""}
                                        />
                                    </div>

                                    <div className="lg:tw-col-span-2">
                                        <SelectInput
                                            name="dateType"
                                            formgroupClassName="tw-mb-0"
                                            value={feeReportFilterForm.values.dateType}
                                            onChange={onchangeHandler}
                                            menuItems={[
                                                { value: "Receipt Date", id: "RECEIPT_DATE" },
                                                { value: "Transaction Date", id: "TRANSACTION_DATE" },
                                                { value: "Created Date", id: "CREATED_DATE" },
                                            ]}
                                            valueKey="id"
                                            textKey="value"
                                            hideSelectOption
                                        />
                                    </div>

                                    <div className="lg:tw-col-span-3">
                                        <CustomDatePicker
                                            name="dateRange"
                                            startDate={feeReportFilterForm.values.startDate}
                                            endDate={feeReportFilterForm.values.endDate}
                                            onChange={handleDateChange}
                                            placeholder="Select a date range"
                                            monthsShown={2}
                                            formgroupClassName="tw-mb-0"
                                            labelText="Date Range"
                                            floatingLabel
                                        />
                                    </div>

                                    {filterCount > 0 && (
                                        <div className="lg:tw-col-span-1 tw-flex tw-items-end">
                                            <Button
                                                type="button"
                                                variant="wrong"
                                                className="tw-text-nowrap"
                                                onClick={clearFilterHndlr}
                                            >
                                                Clear filter
                                            </Button>
                                        </div>
                                    )}

                                    <div className="lg:tw-col-span-4 tw-flex tw-justify-end tw-items-end tw-gap-3">
                                        <div className="tw-relative">
                                            <div
                                                onClick={showAdvanceFilterHandler}
                                                className="tw-flex tw-items-center tw-gap-2
                             tw-bg-gray-100 hover:tw-bg-gray-200
                             tw-px-3 tw-py-2 tw-rounded-md tw-cursor-pointer"
                                            >
                                                <FilterSvg height="18px" width="18px" />
                                                <span>Filters</span>
                                            </div>

                                            {Number(filterCount) > 0 && (
                                                <span className="tw-absolute -tw-top-2 -tw-right-2
                                   tw-bg-emerald-500 tw-text-white
                                   tw-text-xs tw-rounded-full tw-px-2">
                                                    {filterCount}
                                                </span>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={showApiLoader}
                                          
                                        >
                                            Get Report
                                        </Button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>

                    <StatusCard paymentModeAmount={getFeeSumAmountListResp} />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">Fee Type Wise Summary</h4>
                        </div>
                        <TableContainer
                            columns={feeTypeWiseColumns}
                            data={feeTypeWiseSum}
                            tableClass="tw-mb-0"
                            divClass="tw-overflow-x-auto"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            showPagination={false}
                            showFooter
                        />
                    </div>

                    <div className="tw-bg-white tw-rounded-lg tw-shadow">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">Fee Collection Report</h4>
                        </div>

                        <div className="tw-p-4 tw-flex tw-gap-4">
                            <div className="tw-w-full lg:tw-w-1/4">
                                <TextInput
                                    name="searchString"
                                    value={receiptFilterState?.searchString}
                                    onChange={onSearchReceiptHandler}
                                    inputClassName="tw-bg-gray-100"
                                    formgroupClassName="tw-mb-0"
                                    placeHolder="Search Student Name..."
                                />
                            </div>

                            <div className="tw-ml-auto">
                                <Button
                                    disabled={!feeCollectionList?.length || showApiLoader}
                                    onClick={openExportModalHndlr}
                                    className="!tw-bg-[#405189] tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center tw-gap-2"
                                >
                                    <i className="ri-add-line" />
                                    Export
                                </Button>
                            </div>
                        </div>

                        <TableContainer
                            columns={feeCollectionColumns || []}
                            data={Array.isArray(feeCollectionList) ? feeCollectionList : []}
                            tableClass="tw-mb-0"
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            showPagination
                            totalPages={totalPages}
                            totalRecords={totalElements}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageNumber}
                        />
                    </div>
                </div>
            </div>

            <OffCanvasContainer
                isOpen={advanceFilterState}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="feereceipt-advance-filter"
            >
                <AdvanceFilterModal
                    appliedFilter={advanceFilterRef.current}
                    dispatch={dispatch}
                    instituteId={instituteId}
                    branchId={branchId}
                    curriculumId={feeReportFilterForm.values.curriculumId}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    academicYearId={feeReportFilterForm.values.academicYearId}
                />
            </OffCanvasContainer>

            <ModalContainerUpdated
                id="fee-collection-export-modal"
                isOpen={exportModalState.showModal}
                toggle={closeExportModalHndlr}
                modalTitle='Export Fee Collection Data'
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportModalState.showModal}
                    toggle={closeExportModalHndlr}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportHandler}
                    feature="fee"
                    subFeature="fee_collection_report"
                    remarksText="Enter remarks to export fee collection data?"
                />
            </ModalContainerUpdated>
        </React.Fragment >


    )
}