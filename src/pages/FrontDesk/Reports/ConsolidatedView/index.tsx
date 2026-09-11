import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DateInput, ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import Button from "../../../../Components/Common/Button";
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
import { getConsolidatedMappingKeysAct, getConsolidatedListAct, admissionConsolidatedReportAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { getYyyyMmDdFormat } from "../../../../utility/dateutility";
import DetailReportModal from "./DetailReportModal";
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

const ConsolidatedReport = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [reportDetailsModalState, setReportDetailsModalState] = useState({
        showModal: false,
        modalTitle: "",
        admissionProcess: ""
    });
    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    });
    const {
        showApiLoader,
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        consolidatedListResp,
        consolidatedMappingKeysResp,
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
                consolidatedMappingKeysResp: reports.consolidatedMappingKeysResp,
                consolidatedListResp: reports.consolidatedListResp,
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
        dispatch(getConsolidatedMappingKeysAct(generateActionPayload("mapping_keys")));
        dispatch(resetBrchClassAct(undefined));
        if (branchId && instituteId) {
            const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
            const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        }
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, [branchId, instituteId]);

    useEffect(() => {
        const { prevAcademicYearListResp, prevAdmissionConsolidateReportResp, prevBrchCurriculumResp, prevReportsErrResp } = consolidatedReportRef.current;
        if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            if (academicYearId) {
                reportForm.setFieldValue("academicYearId", academicYearId);
            }
        }
        if (brchCurriculumResp && prevBrchCurriculumResp !== brchCurriculumResp) {
            if (Array.isArray(brchCurriculumResp?.data)) {
                const { branchCurriculumId } = brchCurriculumResp?.data?.find((item: any) => item.curriculumName?.toLowerCase() === 'cbse') || {};
                if (branchCurriculumId) {
                    reportForm.setFieldValue("curriculumId", branchCurriculumId);
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
            const params = {
                branchId,
                curriculumId: values?.curriculumId,
                academicYearId: values?.academicYearId,
                fromDate: values?.fromDate,
                toDate: values?.toDate ? values?.toDate : values?.fromDate,
            }
            if (values?.curriculumId) {
                getClassApiCall(values?.curriculumId);
            }
            dispatch(getConsolidatedListAct(generateActionPayload("consolidated_reports", undefined, params)));
        },
    });

    function getClassApiCall(curriculumId: string) {
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId };
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
        }
    }

    function exportHandler() {
        const excelData = reportsData.map(item => {
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
        formData.append("reportType", "oldReport");
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
        return generateReportsData(classTypes, consolidatedMappingKeysResp, consolidatedListResp);
    }, [classTypes, consolidatedMappingKeysResp, consolidatedListResp]);
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

                    <div className="tw-bg-white tw-shadow-sm tw-rounded-lg">
                        <div className="tw-border-b tw-px-4 tw-py-3 tw-flex tw-items-center">
                            <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-m-0">
                                Admission Strategy Consolidated Report
                            </h4>
                            <div className="tw-ml-auto tw-text-center">
                                <Button
                                    disabled={reportsData.length === 0 || showApiLoader}
                                    type="button" 
                                    variant="primary"
                                    onClick={exportHandler} >
                                    <i className="ri-add-line tw-mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>

                        <div className="tw-p-4">
                            <form onSubmit={reportForm.handleSubmit}>
                                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 xl:tw-grid-cols-6 tw-gap-4 tw-items-end">

                                    <div className="tw-col-span-1 xl:tw-col-span-1">
                                        <SelectInput
                                            name="academicYearId"
                                            value={reportForm.values.academicYearId}
                                            onChange={reportForm.handleChange}
                                            onBlur={reportForm.handleBlur}
                                            menuItems={academicYearList || []}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            // inputClassName="border-0"
                                            formgroupClassName="tw-mb-0"
                                            // isDisabled={true}
                                            defaultSelect="Academic Year"
                                            invalid={(reportForm.touched.academicYearId && reportForm.errors.academicYearId) ? true : false}
                                            error={(reportForm.touched.academicYearId && reportForm.errors.academicYearId) ? reportForm.errors.academicYearId : ""}
                                        />
                                    </div>

                                    <div className="tw-col-span-1 xl:tw-col-span-1">
                                        <SelectInput
                                            name="curriculumId"
                                            value={reportForm.values.curriculumId}
                                            onChange={onChangeHandler}
                                            onBlur={reportForm.handleBlur}
                                            menuItems={curriculumTypes || []}
                                            valueKey="branchCurriculumId"
                                            textKey="curriculumName"
                                            // inputClassName="bg-light border-0"
                                            formgroupClassName="tw-mb-0"
                                            defaultSelect="Curriculum"
                                            invalid={(reportForm.touched.curriculumId && reportForm.errors.curriculumId) ? true : false}
                                            error={(reportForm.touched.curriculumId && reportForm.errors.curriculumId) ? reportForm.errors.curriculumId : ""}

                                        />
                                    </div>
                                    <div className="tw-col-span-1 xl:tw-col-span-1">
                                        <SelectInput
                                            name="feePaidType"
                                            value={reportForm.values.feePaidType}
                                            onChange={onChangeHandler}
                                            onBlur={reportForm.handleBlur}
                                            menuItems={[{ id: "oneDate", value: "One Date" }, { id: "dateRange", value: "Date Range" }]}
                                            valueKey="id"
                                            textKey="value"
                                            defaultSelect="Select Fee Paid"
                                            // inputClassName="bg-light border-0"
                                            formgroupClassName="tw-mb-0"
                                            invalid={(reportForm.touched.feePaidType && reportForm.errors.feePaidType) ? true : false}
                                            error={(reportForm.touched.feePaidType && reportForm.errors.feePaidType) ? reportForm.errors.feePaidType : ""}

                                        />
                                    </div>
                                    <div className='tw-col-span-1 xl:tw-col-span-1'>
                                        <DateInput
                                            name="fromDate"
                                            value={reportForm.values.fromDate}
                                            onChange={onChangeHandler}
                                            onBlur={reportForm.handleBlur}
                                            formgroupClassName="tw-mb-0"
                                            invalid={(reportForm.touched.fromDate && reportForm.errors.fromDate) ? true : false}
                                            error={(reportForm.touched.fromDate && reportForm.errors.fromDate) ? reportForm.errors.fromDate : ""}
                                        // labelText="Start Date"
                                        />
                                    </div>
                                    <div className='tw-col-span-1 xl:tw-col-span-1'>
                                        {(reportForm.values.feePaidType === "dateRange") && <DateInput
                                            name="toDate"
                                            value={reportForm.values?.toDate}
                                            onChange={onChangeHandler}
                                            onBlur={reportForm.handleBlur}
                                            formgroupClassName="tw-mb-0"
                                            minDate={getYyyyMmDdFormat(reportForm.values.fromDate)}
                                            invalid={(reportForm.touched.toDate && reportForm.errors.toDate) ? true : false}
                                            error={(reportForm.touched.toDate && reportForm.errors.toDate) ? reportForm.errors.toDate : ""}
                                        />}
                                    </div>
                                    <div className="tw-col-span-1 md:tw-col-span-2 lg:tw-col-span-1 xl:tw-col-span-1 tw-flex tw-justify-end">
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

                        <TableContainer
                            columns={roleColumns}
                            data={reportsData}
                            divClass="table-responsive tw-mb-3"
                            tableClass="table-bordered"
                            theadClass="table-light tw-text-gray-500 tw-align-middle"
                            // showCheckbox={true}
                            showPagination={false}
                        />
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

        </>
    );
};

export default ConsolidatedReport;
