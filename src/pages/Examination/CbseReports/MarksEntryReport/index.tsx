import { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, MultiSelectCheckbox, OffCanvasContainer, SelectInput, TableExpandable, TextInput, } from "../../../../Components/Common";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { generateColumns, ignoredKeys } from "./helper";
import { useFormik } from "formik";
import { useFilterState } from "../../../../hooks/filterhook";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { resetAssignedClassSubjectsListAct } from "../../../../store/academic/classSubjects/classsubjectsslice";
import { toast } from "react-toastify";
import { exportMarksEntryReportAct, getMarksEntryReportListAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useModal } from "../../../../hooks/modalhook";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../../utility/commonutility";
import * as Yup from "yup";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classIds: [] as any[],
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    curriculumId: Yup.string().required("Curriculum is required."),
    classIds: Yup.array().min(1, "Class is required."),
});

const MarksEntryReport = () => {

    const dispatch = useAppDispatch();
    const { closeModal: closeExportExcelModal, modalState: exportExcelState, openModal: openExportExcelModal } = useModal();
    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const studentReportGradeBookForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => { },
    });

    const getStudentGradeBook = (otherProps?: any) => {
        const payload: any = {
            branchId,
            academicYearId: studentReportGradeBookForm.values.academicYearId,
            branchCurriculumId: studentReportGradeBookForm.values.curriculumId,
            branchClassIds: studentReportGradeBookForm.values.classIds,
            ...otherProps,
        };
        if(payload.branchClassIds){
            payload.branchClassIds = payload.branchClassIds?.map((item: any) => item.id).join(",");
        }
        dispatch(getMarksEntryReportListAct(
            generateActionPayload("get_marks_entry_report_list", undefined, payload)
        ));
    }

    const exportExcelHndler = () => {
        const payload: any = { branchId, academicYearId: studentReportGradeBookForm.values.academicYearId, branchCurriculumId: studentReportGradeBookForm.values.curriculumId, classIds: studentReportGradeBookForm.values.classIds }
        if(payload.classIds){
            payload.classIds = payload.classIds?.map((item: any) => item.id).join(",");
        }
        dispatch(exportMarksEntryReportAct(generateActionPayload("export_marks_entry_report", undefined, payload, {
            responseType: 'blob'
        })));
    }
    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        brchCurriculumResp,
        branchClassResp,
        showApiLoader,
        getMarksEntryReportListResp,
        exportMarksEntryReportResp,
        getCbseExaminationRequestListResp,
        examinationManagementErrorResp
    } = useAppSelector(
        ({ instAcademics, branchAcademics, examinationSettings, examinationManagement, appData, globalData, }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            showApiLoader: globalData.showApiLoader,
            getMarksEntryReportListResp: examinationManagement.getMarksEntryReportListResp,
            branchClassResp: branchAcademics.branchClassResp,
            exportMarksEntryReportResp: examinationManagement.exportMarksEntryReportResp,
            getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
            examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
        }),
        shallowEqual
    );

    const studentReportGradeBookRef = useRef({
        prevExportMarksEntryReportResp: exportMarksEntryReportResp,
        prevCbseExaminationErrorResp: examinationManagementErrorResp,
    })


    useEffect(() => {
        const { prevExportMarksEntryReportResp, prevCbseExaminationErrorResp } = studentReportGradeBookRef.current;
        if (examinationManagementErrorResp && prevCbseExaminationErrorResp !== examinationManagementErrorResp) {
            const { details, error } = examinationManagementErrorResp || {};
            toast.error(details || error || "Something went wrong.");
        }
        else if (exportMarksEntryReportResp && prevExportMarksEntryReportResp !== exportMarksEntryReportResp) {
            toast.success("Data Download Successfully.");
            closeExportExcelModal();
            downloadExcelFile(exportMarksEntryReportResp, 'garde_book.xlsx')
        }
        studentReportGradeBookRef.current.prevExportMarksEntryReportResp = exportMarksEntryReportResp;
        studentReportGradeBookRef.current.prevCbseExaminationErrorResp = examinationManagementErrorResp;
    }, [exportMarksEntryReportResp, examinationManagementErrorResp]);


    useEffect(() => {
        let yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
        if (yearId && branchId) {
            studentReportGradeBookForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
            const payload1 = {
                academicYearId: yearId,
                branchId: branchId,
                pageNo: 0,
                pageSize: 100,
                sortBy: "curriculumName",
                orderBy: "asc",
            };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        }
    }, [academicYearListResp]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        if (Array.isArray(data) && data.length > 0 && studentReportGradeBookForm.values.academicYearId) {
            const selectedCurriculum = data.find(
                (item) => item.curriculumName === "CBSE"
            );
            if (!selectedCurriculum) {
                dispatch(resetAssignedClassSubjectsListAct(undefined));
                dispatch(resetBrchClassAct(undefined));
                studentReportGradeBookForm.setFieldValue("curriculumId", undefined)
                return;
            }
            const payload = {
                branchId,
                curriculumId: selectedCurriculum.branchCurriculumId,
                academicYearId: studentReportGradeBookForm.values.academicYearId,
                sortBy: "classSequence",
                orderBy: "asc",
                pageNo: 0,
                pageSize: 100,
            };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            studentReportGradeBookForm.setFieldValue("curriculumId", selectedCurriculum.branchCurriculumId);
        }
    }, [brchCurriculumResp]);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: studentReportGradeBookForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const getClassApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, academicYearId: studentReportGradeBookForm.values?.academicYearId, curriculumId: studentReportGradeBookForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;

        studentReportGradeBookForm.setValues((prev: any) => {
            const updatedState = { ...prev, [name]: value };

            if (name === "academicYearId") {
                if (!value) {
                    dispatch(resetBrchCurriculumAct(undefined));
                    dispatch(resetBrchClassAct(undefined));
                } else {
                    getCurriculumApiCall({ academicYearId: value });
                    updatedState.classId = "";
                }
            } else if (name === "curriculumId") {
                if (!value) {
                    dispatch(resetBrchClassAct(undefined));
                } else {
                    getClassApiCall({ curriculumId: value, academicYearId: studentReportGradeBookForm.values.academicYearId });
                }
                updatedState.classId = "";
            } 

            return updatedState;
        });
    };

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        getStudentGradeBook(paginationInfo);
    }

    function renderSelectedClass(selectedItems: Array<{classId: string, shortName: string}>): JSX.Element | null {
        if (Array.isArray(selectedItems)) {
            return (<div className="text-truncate">
                {
                    selectedItems.map((item, index) => {
                        return item?.shortName + (index !== (selectedItems.length - 1) ? ', ' : '')
                    })
                }
            </div>)
        }
        return null;
    }

     function renderOptionClass(item: { shortName: string }): string {
        return item.shortName;
    }

    function onSelectClassHndlr(selectedOptions: { classId: string; shortName: string }[], config?: { name: string }) {
        const { name } = config || {};
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            studentReportGradeBookForm.setFieldValue(name!, selectedOptions);
            getStudentGradeBook({ branchClassIds: selectedOptions });
        } else {
            studentReportGradeBookForm.setFieldValue(name!, null);
            getStudentGradeBook({ branchClassIds: [] });
        }
    }

    const handleGenerateClick = async () => {
        const errors = await studentReportGradeBookForm.validateForm();
    
        studentReportGradeBookForm.setTouched({
          academicYearId: true,
          curriculumId: true,
          classIds: true,
        }); 
    
        if (Object.keys(errors).length === 0) {
          openExportExcelModal();
        }
      };
    
 
   const columns = useMemo(() => generateColumns(), [getMarksEntryReportListResp]); 
  
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: marksEntryReportList, totalElements, totalPages, pageable } = getMarksEntryReportListResp || {};
    const { content: classTypes } = branchClassResp || {};

    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Examination" pageTitle="Examination" />
                    <div
                        className="card overflow-hidden"
                        style={{ borderTopRightRadius: "0px", borderTopLeftRadius: "0px" }}
                    >
                        <div className="card-header">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <h4 className="card-title mb-0 flex-grow-1">Marks Entry Report</h4>
                                </div>
                                <div className="col-auto ms-auto">
                                    <div className="d-flex">
                                        <button
                                            id="export-btn"
                                            className="btn btn-icon btn-rounded btn-soft-info p-2"
                                            onClick={handleGenerateClick}
                                        >
                                            <img src={ExportIcon} className="img-fluid h-100"></img>
                                            <UncontrolledTooltip placement="bottom" target="export-btn">
                                                Export
                                            </UncontrolledTooltip>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="row m-3 pb-1 g-3 examination">
                                <div className="col-12 col-lg-2 mt-0">
                                    <SelectInput
                                        name="academicYearId"
                                        value={studentReportGradeBookForm.values.academicYearId}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="mb-0"
                                        labelText='Academic Year'
                                        labelClass="required"
                                        invalid={(studentReportGradeBookForm.touched.academicYearId && studentReportGradeBookForm.errors.academicYearId) ? true : false}
                                        error={(studentReportGradeBookForm.touched.academicYearId && studentReportGradeBookForm.errors.academicYearId) ? studentReportGradeBookForm.errors.academicYearId : ""}
                                    />
                                </div>
                                <div className="col-12 col-lg-2 mt-0">
                                    <SelectInput
                                        name="curriculumId"
                                        value={studentReportGradeBookForm.values.curriculumId}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={curriculumTypes}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="mb-0"
                                        defaultSelect="Select"
                                        labelText="Curriculum"
                                        labelClass="required"
                                        invalid={(studentReportGradeBookForm.touched.curriculumId && studentReportGradeBookForm.errors.curriculumId) ? true : false}
                                        error={(studentReportGradeBookForm.touched.curriculumId && studentReportGradeBookForm.errors.curriculumId) ? studentReportGradeBookForm.errors.curriculumId : ""}
                                    />
                                </div>
                                <div className="col-12 col-lg-2 mt-0">
                                    <MultiSelectCheckbox
                                        name="classIds"
                                        idKey="id"
                                        labelText='Classes'
                                        labelClass='required'
                                        value={studentReportGradeBookForm.values.classIds}
                                        renderValue={renderSelectedClass}
                                        renderOptions={renderOptionClass}
                                        onChange={onSelectClassHndlr}
                                        searchKey="shortName"
                                        options={classTypes || []}
                                        invalid={(studentReportGradeBookForm.touched.classIds && studentReportGradeBookForm.errors.classIds) ? true : false}
                                        error={(studentReportGradeBookForm.touched.classIds && studentReportGradeBookForm.errors.classIds) ? studentReportGradeBookForm.errors.classIds : ""}
                                    />
                                </div>
                                

                            </div>
                         
                            <TableContainer
                                columns={columns}
                                data={Array.isArray(marksEntryReportList) ? marksEntryReportList : []}
                                tableClass="mb-0"
                                divClass="table-responsive mb-3"
                                theadClass="table-light text-muted align-middle"
                                showCheckbox={false}
                                showPagination={true}
                                totalPages={totalPages || 0}
                                totalRecords={totalElements || 0}
                                callbackPaginationHndlr={paginationHndlr}
                                currentPageNumber={pageable?.pageNumber || 0}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="students-performance-data"
                isOpen={exportExcelState.showModal}
                toggle={closeExportExcelModal}
                modalTitle="Export Marks Entry Report"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcelState.showModal}
                    toggle={closeExportExcelModal}
                    instituteId={instituteId}
                    // branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="examination"
                    subFeature="marks_entry_status_report"
                    remarksText="Enter remarks to export Marks Entry Report?"
                />
            </ModalContainerUpdated>
            
        </>
    );
};

export default MarksEntryReport;
