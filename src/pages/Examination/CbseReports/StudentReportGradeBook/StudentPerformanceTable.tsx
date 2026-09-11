import { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, OffCanvasContainer, SelectInput, TableExpandable, TextInput, } from "../../../../Components/Common";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { generateColumns, ignoredKeys } from "./helper";
import { useFormik } from "formik";
import AdvanceFilterModal from "./AdvanceFilter";
import { useFilterState } from "../../../../hooks/filterhook";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { resetAssignedClassSubjectsListAct } from "../../../../store/academic/classSubjects/classsubjectsslice";
import { toast } from "react-toastify";
import { exportStudentGradeReportBookAct, getStudentGradeReportBookAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { setCbseExaminationListAct } from "../../../../store/examination/examinationsettings/examinationsettingsslice";
import { getCbseExaminationListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useModal } from "../../../../hooks/modalhook";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../../utility/commonutility";
import * as Yup from "yup";

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    section: "",
    classId: "",
    examinationId: "",
    data: "",
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    curriculumId: Yup.string().required("Curriculum is required."),
    classId: Yup.string().required("Class is required.").nullable(),
    examinationId: Yup.string().required("Examination is required.").nullable(),

});

const StudentPerformanceTable = () => {

    const dispatch = useAppDispatch();
    const [open, setOpen] = useState<boolean>(false);
    const { showClearFilterState, count, advanceFilterChange } = useFilterState()
    const { closeModal: closeExportExcelModal, modalState: exportExcelState, openModal: openExportExcelModal } = useModal();
    const classApiCalled = useRef(false);
    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const studentReportGradeBookForm = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => { },
    });

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }

    const getStudentGradeBook = (otherProps?: any) => {
        const payload = {
            branchId,
            ...studentReportGradeBookForm.values,
            ...otherProps,
        };
        dispatch(getStudentGradeReportBookAct(
            generateActionPayload("get_student_grade_report_book", undefined, payload)
        ));
    }

    const exportExcelHndler = () => {

        dispatch(exportStudentGradeReportBookAct(generateActionPayload("export_student_grade_report_book", undefined, { ...studentReportGradeBookForm.values, branchId, instituteId }, {
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
        getStudentGradeReportBookListResp,
        exportStudentGradeReportBookResp,
        getCbseExaminationRequestListResp,
        examinationManagementErrorResp
    } = useAppSelector(
        ({ instAcademics, branchAcademics, examinationSettings, examinationManagement, appData, globalData, }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            showApiLoader: globalData.showApiLoader,
            getStudentGradeReportBookListResp: examinationManagement.getStudentGradeReportBookListResp,
            branchClassResp: branchAcademics.branchClassResp,
            exportStudentGradeReportBookResp: examinationManagement.exportStudentGradeReportBookResp,
            getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
            examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
        }),
        shallowEqual
    );

    const studentReportGradeBookRef = useRef({
        prevExportStudentGradeBookResp: exportStudentGradeReportBookResp,
        prevCbseExaminationErrorResp: examinationManagementErrorResp,
    })

    useEffect(() => {
        const { academicYearId, curriculumId, classId, examinationId } = studentReportGradeBookForm.values;
        if (academicYearId && curriculumId && classId && examinationId) {
            getStudentGradeBook({ curriculumId, academicYearId, classId, examinationId });
        }
    }, [studentReportGradeBookForm.values.academicYearId, studentReportGradeBookForm.values.curriculumId, studentReportGradeBookForm.values.classId, studentReportGradeBookForm.values.examinationId,]);

    useEffect(() => {
        const { prevExportStudentGradeBookResp, prevCbseExaminationErrorResp } = studentReportGradeBookRef.current;
        if (examinationManagementErrorResp && prevCbseExaminationErrorResp !== examinationManagementErrorResp) {
            const { details, error } = examinationManagementErrorResp || {};
            toast.error(details || error || "Something went wrong.");
        }
        else if (exportStudentGradeReportBookResp && prevExportStudentGradeBookResp !== exportStudentGradeReportBookResp) {
            toast.success("Data Download Successfully.");
            closeExportExcelModal();
            downloadExcelFile(exportStudentGradeReportBookResp, 'garde_book.xlsx')
        }
        studentReportGradeBookRef.current.prevExportStudentGradeBookResp = exportStudentGradeReportBookResp;
        studentReportGradeBookRef.current.prevCbseExaminationErrorResp = examinationManagementErrorResp;
    }, [exportStudentGradeReportBookResp, examinationManagementErrorResp]);

    const cbseExaminationList = (classId: string, academicYearId: string) => {
        const payload = {
            academicYearId,
            classId,
            curriculumId: studentReportGradeBookForm.values.curriculumId,
            branchId,
            pageNo: 0,
            pageSize: 100,
        };
        dispatch(getCbseExaminationListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
    };
    useEffect(() => {
        const { academicYearId, curriculumId, classId } = studentReportGradeBookForm.values;

        if (academicYearId && curriculumId && classId) {
            cbseExaminationList(classId, academicYearId);
        }
    }, [
        studentReportGradeBookForm.values.academicYearId,
        studentReportGradeBookForm.values.curriculumId,
        studentReportGradeBookForm.values.classId
    ]);
    useEffect(() => {
        const data = getCbseExaminationRequestListResp?.data;
        if (Array.isArray(data) && data.length > 0) {
            studentReportGradeBookForm.setFieldValue("examinationId", data[0].id);
        }
    }, [getCbseExaminationRequestListResp]);

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
            classApiCalled.current = false;
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

    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content) && content.length > 0) {
            studentReportGradeBookForm.setFieldValue("classId", content[0].id);
        }
    }, [branchClassResp])

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
                classApiCalled.current = false;
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
                classApiCalled.current = false;
                updatedState.classId = "";
            } else if (name === "classId") {
                if (!value) {
                    dispatch(setCbseExaminationListAct(undefined));
                } else {
                    cbseExaminationList(updatedState.classId, studentReportGradeBookForm.values.academicYearId);
                }
                updatedState.examinationId = "";
            }

            advanceFilterChange({
                keys: { ...studentReportGradeBookForm.values, [name]: value },
                ignoredKeys
            });

            return updatedState;
        });
    };


    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        pagination.current = { ...pagination.current, pageNo: 0 }
        advanceFilterChange({ keys: { ...initialValues, ...appliedFilters }, ignoredKeys })
        studentReportGradeBookForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
        getStudentGradeBook(appliedFilters);
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        getStudentGradeBook(paginationInfo);
    }

function transformStudentData(rawData: any[]) {
  const grouped: Record<string, any> = {};
  rawData.forEach((student) => {
    const studentKey = student.studentDetailId;
    grouped[studentKey] = {
      studentName: student.studentName?.trim(),
      rollNo: student.rollNo,
      studentCode: student.studentCode,
      sectionName: student.sectionName,
      totalMarks: student.totalMarks ?? "-",
      averageMarks: student.averageMarks ?? "-",
      totalGrade: student.totalGrade ?? "-",
      result: student.result ?? "-",
      passMarks: Math.min(...(student.subjects?.map((s: any) => s.passMarks ?? 0).filter((m: number) => m > 0) || [100]),100),
      studentImageBase64: student.studentImageBase64 ?? null,
    };
    [...(student.subjects ?? [])].sort((a, b) => (a.gradeBookOrder ?? 0) - (b.gradeBookOrder ?? 0)).forEach((subject: any) => {
        const subjectKey = subject.subjectName?.trim().toLowerCase().replace(/\s+/g, "_");
        if (subjectKey) {
          grouped[studentKey][`${subjectKey}_marks`] = subject.marks ?? "-";
          grouped[studentKey][`${subjectKey}_grade`] = subject.grade ?? "-";
          grouped[studentKey][`${subjectKey}_order`] = subject.gradeBookOrder ?? 999;
        }
      });
  });

  return Object.values(grouped).sort((a: any, b: any) => a.rollNo - b.rollNo);
}

  const rawData = Array.isArray(getStudentGradeReportBookListResp?.content) 
    ? getStudentGradeReportBookListResp.content 
    : [];
  
  const data = useMemo(() => transformStudentData(rawData), [rawData]);
   const columns = useMemo(() => generateColumns(data, rawData), [data, rawData]); 
  
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { data: cbseExaminationSubjectsResp, totalElements, totalPages, pageable } = getStudentGradeReportBookListResp || {};
    const { content: classTypes } = branchClassResp || {};

    return (
        <>

            <div className="card-header">
                <div className="row align-items-center">
                    <div className="col-6">
                        <h4 className="card-title mb-0 flex-grow-1">Students Performance Metrics</h4>
                    </div>
                    <div className="col-auto ms-auto">
                        <div className="d-flex">
                            <button
                                id="export-btn"
                                className="btn btn-icon btn-rounded btn-soft-info p-2"
                                onClick={() => openExportExcelModal()}
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
                <div className="row bg-light m-3 pb-1 px-2 g-3 examination">
                    <div className="col-xs-12 col-md-12 col-lg-3 py-2 mt-2">
                        <div className="search-box">
                            <TextInput
                                name="searchString"
                                formgroupClassName="mb-0"
                                placeHolder="Search"
                                labelText="Search"
                                floatingLabel
                                inputClassName="bg-light"
                                value={studentReportGradeBookForm.values.searchString}
                                onChange={onChangeFilterHndlr}
                            />
                            <i className="ri-search-line search-icon"></i>
                        </div>
                    </div>
                    <div className="col-12 col-lg-2 py-2 mt-2">
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
                            floatingLabel
                            inputClassName="bg-light"
                            invalid={(studentReportGradeBookForm.touched.academicYearId && studentReportGradeBookForm.errors.academicYearId) ? true : false}
                            error={(studentReportGradeBookForm.touched.academicYearId && studentReportGradeBookForm.errors.academicYearId) ? studentReportGradeBookForm.errors.academicYearId : ""}
                        />
                    </div>
                    <div className="col-12 col-lg-2 py-2 mt-2">
                        <SelectInput
                            name="curriculumId"
                            value={studentReportGradeBookForm.values.curriculumId}
                            onChange={onChangeFilterHndlr}
                            menuItems={curriculumTypes}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            formgroupClassName="mb-0"
                            defaultSelect="Select"
                            inputClassName="bg-light"
                            labelText="Curriculum"
                            labelClass="required"
                            floatingLabel
                            invalid={(studentReportGradeBookForm.touched.curriculumId && studentReportGradeBookForm.errors.curriculumId) ? true : false}
                            error={(studentReportGradeBookForm.touched.curriculumId && studentReportGradeBookForm.errors.curriculumId) ? studentReportGradeBookForm.errors.curriculumId : ""}
                        />
                    </div>
                    <div className="col-12 col-lg-2 py-2 mt-2">
                        <SelectInput
                            name="classId"
                            value={studentReportGradeBookForm.values.classId}
                            onChange={onChangeFilterHndlr}
                            menuItems={classTypes}
                            valueKey="id"
                            textKey="shortName"
                            formgroupClassName="mb-0"
                            defaultSelect="Select"
                            inputClassName="bg-light"
                            labelText="Class"
                            labelClass="required"
                            floatingLabel
                            invalid={(studentReportGradeBookForm.touched.classId && studentReportGradeBookForm.errors.classId) ? true : false}
                            error={(studentReportGradeBookForm.touched.classId && studentReportGradeBookForm.errors.classId) ? studentReportGradeBookForm.errors.classId : ""}
                        />
                    </div>
                    <div className="col-12 col-lg-2 py-2 mt-2">
                        <SelectInput
                            name="examinationId"
                            value={studentReportGradeBookForm.values.examinationId}
                            onChange={onChangeFilterHndlr}
                            menuItems={getCbseExaminationRequestListResp?.data}
                            valueKey="id"
                            textKey="examinationName"
                            formgroupClassName="mb-0"
                            inputClassName="bg-light"
                            labelText="Examination"
                            labelClass="required"
                            floatingLabel
                            invalid={(studentReportGradeBookForm.touched.examinationId && studentReportGradeBookForm.errors.examinationId) ? true : false}
                            error={(studentReportGradeBookForm.touched.examinationId && studentReportGradeBookForm.errors.examinationId) ? studentReportGradeBookForm.errors.examinationId : ""}
                        />
                    </div>
                    <div className="col-1 py-2 mt-2">
                        <button
                            style={{
                                backgroundColor: "#F4F7FA",
                                border: "1px solid #ced4da",
                            }}
                            onClick={toggleAdvanceFilter}
                            className="p-2 btn d-flex"
                        >
                            <FilterSvg height={"18px"} width={"18px"} />
                            <span className='ms-2'>Filters</span>
                        </button>
                        <span className="badge align-middle rounded-pill ms-1 " style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "78px", background: "#0ab39c" }}>
                            {count}
                        </span>
                    </div>

                </div>
                <div className="row px-3 g-3 my-2 align-items-center">
                    <div className="col-12 mt-0">
                        <p
                            className="mb-0 d-flex flex-wrap fs-12 text-muted"
                            style={{ columnGap: "4px" }}
                        >
                            <span className="">A1 - Top 1/8 of the passed candidates</span>|
                            <span className="">A2 - Next 1/8 of the passed candidates</span>
                            |
                            <span className="">D1 - Next 1/8 of the passed candidates</span>
                            |
                            <span className="">D2 - Last 1/8 of the passed candidates</span>
                            |<span className="">E - Failed candidates ABT - ABSENT</span> |
                            <span className="">G - GRADE</span> |<span>H - HIGHEST</span> |
                            <span className="">M - MARK</span>
                        </p>
                    </div>
                </div>
                <TableExpandable
                    columns={columns}
                    data={data}
                    divClass="table-responsive mb-2 student-log-book"
                    theadClass="table-light text-muted align-middle"
                    tableClass="table-bordered table-nowrap"
                    showCheckbox={false}
                    showPagination={true}
                    totalPages={totalPages || 0}
                    totalRecords={totalElements || 0}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={pageable?.pageNumber || 0}
                ></TableExpandable>
            </div>

            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="advance-filter-book-issuance"
            >
                <AdvanceFilterModal
                    appliedFilter={studentReportGradeBookForm.values}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                />
            </OffCanvasContainer>
            <ModalContainerUpdated
                id="students-performance-data"
                isOpen={exportExcelState.showModal}
                toggle={closeExportExcelModal}
                modalTitle="Export Students Performance Metrics"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcelState.showModal}
                    toggle={closeExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="examination"
                    subFeature="students_performance_data"
                    remarksText="Enter remarks to export Students Performance Metrics?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default StudentPerformanceTable;
