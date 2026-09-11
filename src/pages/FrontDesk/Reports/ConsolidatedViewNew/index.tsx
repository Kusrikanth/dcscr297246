import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DateInput, ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { shallowEqual, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { toast } from "react-toastify";
import { generateColumns, generateReportsData } from "./helper";
import {
    getConsolidatedReportNewAct,
    admissionConsolidatedReportAct, getConsolidatedReportNewKeyAct
} from "../../../../store/FrontDesk/Reports/reportsactions";
import { Current_Date_YYYYMMDD, getFormYyyyMmDdFormat, getYyyyMmDdFormat, subtractYearYyyyMmDdFormat } from "../../../../utility/dateutility";
import DetailReportModal from "./DetailReportModal";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { useModal } from "../../../../hooks/modalhook";
import Button from "../../../../Components/Common/Button";
const initialValues = {
    academicYearId: "",
    curriculumId: "",
    feePaidType: "dateRange",
    fromDate: "",
    toDate: "",
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic year required."),
    curriculumId: Yup.string().required("Curriculum required."),
    feePaidType: Yup.string().required("Fee paid type required."),
    fromDate: Yup.string().required("From date required."),
    toDate: Yup.string().when('feePaidType', {
        is: (feePaidType: any) => feePaidType === "dateRange",
        then: Yup.string()
            .required('To date required.')
    }),
});

const ConsolidatedReportNew = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { modalState: exportModalState, openModal: openExportModalHndlr,
        closeModal: closeExportModalHndlr
    } = useModal();
    const [reportDetailsModalState, setReportDetailsModalState] = useState({
        showModal: false,
        modalTitle: "",
        admissionProcess: ""
    });
    const [enableDateRangeState, setEnableDateRangeState] = useState({
        minDate: Current_Date_YYYYMMDD,
        maxDate: Current_Date_YYYYMMDD
    });
    const {
        showApiLoader,
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        consolidatedReportNewResp,
        conslidatedReportNewMappingKeysResp,
        admissionConsolidateReportResp,
        reportsErrResp
    }: any = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData,
            reports }) => ({
                showApiLoader: globalData.showApiLoader,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                conslidatedReportNewMappingKeysResp: reports.conslidatedReportNewMappingKeysResp,
                consolidatedReportNewResp: reports.consolidatedReportNewResp,
                admissionConsolidateReportResp: reports.admissionConsolidateReportResp,
                reportsErrResp: reports.reportsErrResp
            }), shallowEqual);

    const consolidatedReportRef = useRef({
        prevAcademicYearListResp: academicYearListResp,
        prevBrchCurriculumResp: brchCurriculumResp,
        prevAdmissionConsolidateReportResp: admissionConsolidateReportResp,
        prevReportsErrResp: reportsErrResp
    })

    useEffect(() => {
        dispatch(getConsolidatedReportNewKeyAct(generateActionPayload("consolidater_report_mappingkeys_new")));
        dispatch(resetBrchClassAct(undefined));
        if (branchId && instituteId) {
            const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
            // const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
            // dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        }
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, [branchId, instituteId]);

    useEffect(() => {
        const { prevAcademicYearListResp, prevAdmissionConsolidateReportResp, prevBrchCurriculumResp, prevReportsErrResp } = consolidatedReportRef.current;
        if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            const { academicYearId, startDate, endDate } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            if (academicYearId) {
                getCurriculumApiCall({ academicYearId })
                const updateFormFields = {
                    academicYearId,
                    fromDate: subtractYearYyyyMmDdFormat(startDate),
                    toDate: getFormYyyyMmDdFormat(endDate)
                }
                setEnableDateRangeState(prevState => ({
                    ...prevState,
                    minDate: subtractYearYyyyMmDdFormat(startDate),
                    maxDate: getFormYyyyMmDdFormat(endDate)
                }))
                reportForm.setValues((prevValues: any) => ({
                    ...prevValues, ...updateFormFields
                }));
            }
        }
        if (brchCurriculumResp && prevBrchCurriculumResp !== brchCurriculumResp) {
            if (Array.isArray(brchCurriculumResp?.data)) {
                const { branchCurriculumId } = brchCurriculumResp?.data?.find((item: any) => item.curriculumName?.toLowerCase() === 'cbse') || {};
                if (branchCurriculumId) {
                    reportForm.setFieldValue("curriculumId", branchCurriculumId);
                    if (reportForm.values.academicYearId) {
                        getReportApiCall({ curriculumId: branchCurriculumId });
                    }
                }
            }
        } else if (admissionConsolidateReportResp && prevAdmissionConsolidateReportResp !== admissionConsolidateReportResp) {
            // exportCsvFile("", admissionConsolidateReportResp);
            const url = window.URL.createObjectURL(new Blob([(admissionConsolidateReportResp)]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'consolidate_report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            closeExportModalHndlr();
            toast.success("Report downloaded successfully.");
        } else if (reportsErrResp && prevReportsErrResp !== reportsErrResp) {
            const { message, details }: any = reportsErrResp;
            toast.error(message || details || "Something went wrong.");
        }
        consolidatedReportRef.current.prevAcademicYearListResp = academicYearListResp;
        consolidatedReportRef.current.prevBrchCurriculumResp = brchCurriculumResp;
        consolidatedReportRef.current.prevAdmissionConsolidateReportResp = admissionConsolidateReportResp;
        consolidatedReportRef.current.prevReportsErrResp = reportsErrResp;
    }, [academicYearListResp, brchCurriculumResp, admissionConsolidateReportResp, reportsErrResp]);

    const reportForm = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            getReportApiCall();
        },
    });

    function getReportApiCall(otherProps?: any) {
        const values = reportForm.values;
        const params = {
            branchId,
            curriculumId: values?.curriculumId,
            academicYearId: values?.academicYearId,
            fromDate: values?.fromDate,
            toDate: values?.toDate ? values?.toDate : values?.fromDate,
            ...otherProps
        }
        if (params?.curriculumId) {
            getClassApiCall(params?.curriculumId);
        }
        dispatch(getConsolidatedReportNewAct(generateActionPayload("consolidated_report_new", undefined, params)));

    }


    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: reportForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function getClassApiCall(curriculumId: string) {
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, academicYearId: reportForm.values.academicYearId, branchId };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }


    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === "fromDate") {
            reportForm.setValues(prevValues => ({ ...prevValues, [name]: value, toDate: "" }));
        } else if (name === "toDate") {
            reportForm.setValues(prevValues => ({ ...prevValues, [name]: value }));
        } else if (name === "feePaidType") {
            reportForm.setValues(prevValues => ({ ...prevValues, [name]: value, toDate: "" }));
        } else if (name === "curriculumId") {
            const { name, value } = event.target;
            reportForm.setValues(prevValues => ({ ...prevValues, [name]: value }));
        } else if (name === "academicYearId") {
            if (value) {
                const { startDate, endDate } = academicYearListResp?.data?.find((year: any) => year.academicYearId.toString() === value) || {};
                setEnableDateRangeState(prevState => ({
                    ...prevState,
                    minDate: subtractYearYyyyMmDdFormat(startDate),
                    maxDate: getFormYyyyMmDdFormat(endDate)
                }))
                reportForm.setValues((prevValues: any) => ({
                    ...prevValues,
                    academicYearId: value,
                    fromDate: subtractYearYyyyMmDdFormat(startDate),
                    toDate: getFormYyyyMmDdFormat(endDate)
                }))
            } else {
                setEnableDateRangeState(prevState => ({
                    ...prevState,
                    minDate: "", maxDate: ""
                }))
                reportForm.setValues((prevValues: any) => ({
                    ...prevValues,
                    academicYearId: value,
                    fromDate: "",
                    toDate: ""
                }))
            }
        }
    }

    function exportHandler() {
        const excelData = reportsData.map((item: any) => {
            const { reportName, ...otherInfo } = item;
            return otherInfo
        })
        const headerData: any = {};
        roleColumns.forEach(item => {
            const { accessor, Header } = item;
            if (accessor === 'reportName') {
                headerData["admissionProcess"] = "Admission Process";
            }
            else if (accessor !== 'sNo') {
                headerData[accessor] = Header;
            }
        });
        const formData = new FormData();
        formData.append("headers", JSON.stringify(headerData));
        formData.append("excelData", JSON.stringify(excelData));
        formData.append("reportType", "newReport");
        dispatch(admissionConsolidatedReportAct(generateActionPayload("donwload_admission_consolidated_report", undefined, formData, {
            responseType: 'blob'
        })));

        // dispatch(downloadDocumentByIdAct(generateActionPayload('download_employee_document_by_id',{
        //     documentId:documentId
        // },undefined,{
        //     responseType: 'blob'
        // })))
    }

    function toggleDetailModal() {
        setReportDetailsModalState(prevState => ({
            ...prevState, showModal: false
        }))
    }



    const { content: classTypes } = branchClassResp || {};

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const reportsData: any = useMemo(() => {
        return generateReportsData(classTypes, conslidatedReportNewMappingKeysResp, consolidatedReportNewResp);
    }, [classTypes, conslidatedReportNewMappingKeysResp, consolidatedReportNewResp]);
    const viewDetailsModalHandler = useCallback((event: React.MouseEvent<HTMLSpanElement>) => {
        const admissionProcess = event.currentTarget.getAttribute("data-process");
        if (admissionProcess) {
            const { reportName } = reportsData.find((item: any) => item.admissionProcess === admissionProcess) || {};
            if (reportName) {
                setReportDetailsModalState(prevState => ({
                    ...prevState, showModal: true,
                    modalTitle: reportName,
                    admissionProcess
                }));
            }
        }
    }, [reportsData]);
    const roleColumns = useMemo(() => generateColumns(classTypes, viewDetailsModalHandler), [classTypes, viewDetailsModalHandler]);
    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb pageTitle="Admissions" />

                    <div className="tw-bg-white tw-shadow tw-rounded-lg">
                        {/* Card Header */}
                        <div className="tw-flex tw-items-center tw-px-4 tw-py-3 tw-border-b tw-border-gray-200">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Admission Strategy Consolidated Report New
                            </h4>
                            <div className="tw-ml-auto tw-text-center">
                                <Button
                                    disabled={reportsData.length === 0 || showApiLoader}
                                    type="button"
                                    variant="info"
                                    onClick={openExportModalHndlr}
                                >
                                    <i className="ri-add-line tw-mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>

                        {/* Card Body / Form */}
                        <div className="tw-p-4">
                            <form onSubmit={reportForm.handleSubmit}>
                                <div className="tw-grid tw-gap-3 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-6 xl:tw-grid-cols-6 tw-items-end">

                                    {/* Academic Year */}
                                    <div>
                                        <SelectInput
                                            name="academicYearId"
                                            value={reportForm.values.academicYearId}
                                            onChange={onChangeHandler}
                                            onBlur={reportForm.handleBlur}
                                            menuItems={academicYearList || []}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            formgroupClassName="tw-mb-0"
                                            labelText="Academic Year"
                                            floatingLabel
                                            invalid={(reportForm.touched.academicYearId && reportForm.errors.academicYearId) ? true : false}
                                            error={(reportForm.touched.academicYearId && reportForm.errors.academicYearId) ? reportForm.errors.academicYearId : ""}
                                        />
                                    </div>

                                    {/* Curriculum */}
                                    <div>
                                        <SelectInput
                                            name="curriculumId"
                                            value={reportForm.values.curriculumId}
                                            onChange={onChangeHandler}
                                            onBlur={reportForm.handleBlur}
                                            menuItems={curriculumTypes || []}
                                            valueKey="branchCurriculumId"
                                            textKey="curriculumName"
                                            formgroupClassName="tw-mb-0"
                                            labelText="Curriculum"
                                            floatingLabel
                                            invalid={(reportForm.touched.curriculumId && reportForm.errors.curriculumId) ? true : false}
                                            error={(reportForm.touched.curriculumId && reportForm.errors.curriculumId) ? reportForm.errors.curriculumId : ""}

                                        />
                                    </div>

                                    {/* Fee Paid Type */}
                                    <div>
                                        <SelectInput
                                            name="feePaidType"
                                            value={reportForm.values.feePaidType}
                                            onChange={onChangeHandler}
                                            onBlur={reportForm.handleBlur}
                                            menuItems={[
                                                { id: "oneDate", value: "One Date" },
                                                { id: "dateRange", value: "Date Range" }
                                            ]}
                                            valueKey="id"
                                            textKey="value"
                                            labelText="Select Fee Paid"
                                            floatingLabel
                                            // inputClassName="bg-light border-0"
                                            formgroupClassName="tw-mb-0"
                                            invalid={(reportForm.touched.feePaidType && reportForm.errors.feePaidType) ? true : false}
                                            error={(reportForm.touched.feePaidType && reportForm.errors.feePaidType) ? reportForm.errors.feePaidType : ""}

                                        />
                                    </div>

                                    {/* From Date */}
                                    <div>
                                        <DateInput
                                            name="fromDate"
                                            value={reportForm.values.fromDate}
                                            onChange={onChangeHandler}
                                            onBlur={reportForm.handleBlur}
                                            formgroupClassName="tw-mb-0"
                                            labelText="From Date"
                                            floatingLabel
                                            invalid={(reportForm.touched.fromDate && reportForm.errors.fromDate) ? true : false}
                                            error={(reportForm.touched.fromDate && reportForm.errors.fromDate) ? reportForm.errors.fromDate : ""}
                                        // labelText="Start Date"
                                        />
                                    </div>

                                    {/* To Date (conditional) */}
                                    <div>
                                        {reportForm.values.feePaidType === "dateRange" && (
                                            <DateInput
                                                name="toDate"
                                                value={reportForm.values.toDate}
                                                onChange={onChangeHandler}
                                                onBlur={reportForm.handleBlur}
                                                formgroupClassName="tw-mb-0"
                                                labelText="To Date"
                                                floatingLabel
                                                minDate={getYyyyMmDdFormat(reportForm.values.fromDate)}
                                                invalid={(reportForm.touched.toDate && reportForm.errors.toDate) ? true : false}
                                                error={(reportForm.touched.toDate && reportForm.errors.toDate) ? reportForm.errors.toDate : ""}
                                            />
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="tw-flex tw-ml-auto">
                                        <Button
                                            disabled={showApiLoader}
                                            type="submit"
                                            variant="primary"
                                        >
                                            Get Report
                                        </Button>
                                    </div>

                                </div>
                            </form>
                        </div>

                        {/* Table */}
                        <div className="tw-overflow-x-auto tw-mb-3">
                            <TableContainer
                                columns={roleColumns}
                                data={reportsData}
                                divClass="tw-overflow-x-auto"
                                tableClass="table-bordered"
                                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                                showPagination={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="printform-view"
                // modalTitle="Change Password"
                modalTitle={reportDetailsModalState.modalTitle}
                isOpen={reportDetailsModalState.showModal}
                toggle={toggleDetailModal}
                modalSize="xl"
            >
                <DetailReportModal
                    branchId={branchId}
                    admissionProcess={reportDetailsModalState?.admissionProcess}
                    appliedFilters={reportForm.values}
                    dispatch={dispatch}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="consolidate-view-modal"
                isOpen={exportModalState.showModal}
                toggle={closeExportModalHndlr}
                modalTitle='Export Admission Consolidated Report Data'
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportModalState.showModal}
                    toggle={closeExportModalHndlr}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportHandler}
                    feature="admission"
                    subFeature="consolidated_view_new"
                    remarksText="Enter remarks to export admission consolidated report data?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default ConsolidatedReportNew;
