import { DashboardSquareEditIcon, Download04Icon, EyeIcon, GridViewIcon, LeftToRightListBulletIcon } from "@hugeicons-pro/core-stroke-standard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFilterState } from "../../../../../../hooks/filterhook";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { useFormik } from "formik";
import classnames from "classnames";
import { HugeiconsIcon } from "@hugeicons/react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../../../Components/Common";
import { shallowEqual } from "react-redux";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { assessmentTypes, generateColumns, ignoredKeys } from "./helper";
import { downloadResultReportCardAct, getAssessmentQuestionDetailsAct, getAssessmentResultSummaryDetailsAct, getStudentAssessmentsListAct } from "../../../../../../store/lms/studentAssessment/studentAssessmentActions";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { toast } from "react-toastify";
import { useModal } from "../../../../../../hooks/modalhook";
import InstantResults from "../../../../../ParentDetails/StudentLMS/StudentAssessments/InstantResultsModal";
import { CustomDatePicker } from "../../../../../DashBoardBranchSummary/CustomDatePicker";
import { getAssignedClassSubjectsList } from "../../../../../../store/academic/classSubjects/classsubjectsactions";
import StudentAssessmentCard from "./StudentAssessmentCard";
import { default as RejectSvg } from "../../../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import Pagination, { IPaginationState } from "../../../../../../Components/Common/Pagination";

const initialValues = {
    searchString: "",
    startDate: "",
    endDate: "",
    subjectId: "",
    assessmentType: "",
};

const StudentAssessmentHistory = () => {
    const { closeModal: closeGradeDistributionModalModal, modalState: gradeDistributionUploadModalState, openModal: gradeDistributionUploadModal } = useModal();
    const { closeModal: closeDownloadResultReportCardModal, modalState: downloadResultReportCardModalState, openModal: openDownloadResultReportCardModal } = useModal();
    const { showClearFilterState, advanceFilterChange } = useFilterState();
    const dispatch = useAppDispatch();
    const [coursePlannerView, setCoursePlannerView] = useState({
        isGridMode: true,
    });

    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 10,
    });
    const studentAssessmentHistoryFormik = useFormik({
        enableReinitialize: true,
        initialValues,
        onSubmit: () => { },
    });

    const {
        showApiLoader,
        parentChildrensResp,
        currentStudentId,
        getStudentAssessmentsListResp,
        getResultReportCardResp,
        assignedClassSubjectsListResp,
        studentAssessmentsErrorResp,
    }: any = useAppSelector(
        ({ globalData, studentAssessments, appData, directoryStudent, classSubjectsInfo }) => ({
            showApiLoader: globalData.showApiLoader,
            getStudentAssessmentsListResp: studentAssessments.getStudentAssessmentsListResp,
            currentStudentId: appData.currentStudentId,
            parentChildrensResp: directoryStudent.parentChildrensResp,
            getResultReportCardResp: studentAssessments.getResultReportCardResp,
            assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
            studentAssessmentsErrorResp: studentAssessments.studentAssessmentsErrorResp,
        }),
        shallowEqual
    );

    const studentAssessmentListRef = useRef({
        prevSaveEvaluateManualMarksResp: getResultReportCardResp,
        prevStudentAssessmentsListByIdErrorResp: studentAssessmentsErrorResp,
    });

    useEffect(() => {
        const { prevSaveEvaluateManualMarksResp, prevStudentAssessmentsListByIdErrorResp } = studentAssessmentListRef.current;
        if (getResultReportCardResp && prevSaveEvaluateManualMarksResp !== getResultReportCardResp) {
            getResultReportCardResp.text().then((text: string) => {
                const parsed = JSON.parse(text);
                const { fileName, pdfBase64 } = parsed || {};
                if (pdfBase64) {
                    const byteArray = Uint8Array.from(atob(pdfBase64), (char) => char.charCodeAt(0));
                    const blob = new Blob([byteArray], { type: "application/pdf" });
                    const fileURL = URL.createObjectURL(blob);
                    convertBlobToReceipt(blob, `${fileName || "Result Report"}.pdf`);
                    toast.success("Result Report Downloaded Successfully");
                    setTimeout(() => URL.revokeObjectURL(fileURL), 500);
                } else {
                    toast.error("No PDF data in response.");
                }
                closeDownloadResultReportCardModal();
            });
        }
        else if (studentAssessmentsErrorResp && prevStudentAssessmentsListByIdErrorResp !== studentAssessmentsErrorResp) {
            const { details } = studentAssessmentsErrorResp || {};
            toast.error(details || "Something went wrong");
        }
        studentAssessmentListRef.current.prevSaveEvaluateManualMarksResp = getResultReportCardResp;
        studentAssessmentListRef.current.prevStudentAssessmentsListByIdErrorResp = studentAssessmentsErrorResp;
    }, [getResultReportCardResp, studentAssessmentsErrorResp,]);

    function convertBlobToReceipt(blob: Blob, fileName: string) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }
    const currentStudent = parentChildrensResp?.find(
        (item: any) => +item.childId === +currentStudentId
    );

    const fetchStudentAssessmentsList = useCallback(
        (otherProps?: any) => {
            if (!currentStudent) return;

            const { childId, academicYearId } = currentStudent;

            const payload = {
                studentId: childId,
                academicYearId,
                ...studentAssessmentHistoryFormik.values,
                ...otherProps,
                ...paginationDetailRef.current,
            };
            dispatch(
                getStudentAssessmentsListAct(
                    generateActionPayload("get_student_assessments_list", undefined, payload)
                )
            );
        },
        [currentStudent, studentAssessmentHistoryFormik.values, dispatch]
    );

    const classSubjectListApicall = (otherProps?: any) => {
        const { academicYearId, classId, curriculumId } = currentStudent || {};
        const payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            branchClassId: classId,
            ...otherProps,
            pageNo: 0,
            pageSize: 100,
        };
        if (academicYearId && classId && curriculumId) {
            dispatch(
                getAssignedClassSubjectsList(
                    generateActionPayload(
                        "get_assigned_class_subject_list",
                        undefined,
                        payload
                    )
                )
            );
        }
    };

    const viewResultReportCardHndlr = (examData: any) => {
        const params = {
            attemptId: downloadResultReportCardModalState.modalData
        };
        dispatch(downloadResultReportCardAct(generateActionPayload("get_result_report_card", params, undefined, {
            responseType: 'blob'
        })));
    };

    useEffect(() => {
        if (currentStudent) {
            fetchStudentAssessmentsList();
            classSubjectListApicall();
        }
    }, [currentStudent, fetchStudentAssessmentsList]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        studentAssessmentHistoryFormik.setFieldValue(name, value);
        paginationDetailRef.current.pageNo = 0;
        fetchStudentAssessmentsList({ [name]: value });
    };

    const clearFilterHndlr = () => {
        if (currentStudent) {
            paginationDetailRef.current = { pageNo: 0, pageSize: 10 };
            studentAssessmentHistoryFormik.resetForm();
            advanceFilterChange({ keys: { ...initialValues }, ignoredKeys });
            fetchStudentAssessmentsList(initialValues);
        }
    };

    const paginationHndlr = useCallback(
        (paginationInfo: IPaginationState) => {
            if (
                paginationDetailRef.current.pageNo !== paginationInfo.pageNo ||
                paginationDetailRef.current.pageSize !== paginationInfo.pageSize
            ) {
                paginationDetailRef.current = paginationInfo;
                fetchStudentAssessmentsList(paginationInfo);
            }
        },
        [fetchStudentAssessmentsList]
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "viewDetails",
                actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
                actionName: "View",
                onClickHndlr: (event: any, attemptId: number) => {
                    if (!attemptId) {
                        toast.error("No attempt available");
                        return;
                    }
                    dispatch(getAssessmentResultSummaryDetailsAct(
                        generateActionPayload("get_assessment_result_summary_details", { attemptId })
                    ));
                    dispatch(getAssessmentQuestionDetailsAct(
                        generateActionPayload("get_assessment_question_details", { attemptId })
                    ));
                    gradeDistributionUploadModal(attemptId);
                },
            },
            {
                id: "downloadReport",
                actionIcon: <HugeiconsIcon icon={Download04Icon} size={18} className="me-2" />,
                actionName: "Download",
                onClickHndlr: (event: any, attemptId: number) => {
                    if (!attemptId) {
                        toast.error("No attempt available");
                        return;
                    }
                    openDownloadResultReportCardModal(attemptId);
                },
            },
        ],
        [getStudentAssessmentsListResp]
    );

    const handleDateChange = ({ startDate, endDate }: any) => {
        if (startDate && endDate) {
            const updatedFilters = {
                ...studentAssessmentHistoryFormik.values,
                startDate,
                endDate,
            };

            const { childId, academicYearId } = currentStudent;
            if (childId && academicYearId) {
                fetchStudentAssessmentsList(updatedFilters);
            }
        }
    };

    function handleCoursePlannerView(event: React.MouseEvent<HTMLElement>) {
        const viewMode = event.currentTarget.getAttribute("data-view");
        setCoursePlannerView((prev) => ({
            ...prev,
            isGridMode: viewMode === "grid",
        }));
    }

    const columns = useMemo(() => generateColumns(menuOptions), [getStudentAssessmentsListResp]);

    const { totalElements, pageNumber, totalPages, pageable, content: studentsAssessmentList } = getStudentAssessmentsListResp || {};
    function paginationHndlrCard(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo
        fetchStudentAssessmentsList(paginationInfo);
    }

    const StudentAssessmentsList = ({
        totalPages,
        totalRecords,
        callbackPaginationHndlr,
        currentPageNumber,
    }) => {
        const list = Array.isArray(getStudentAssessmentsListResp?.content)
            ? getStudentAssessmentsListResp.content
            : [];

        return (
            <>
                <div className="tw-grid tw-gap-5 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-mb-6">
                    {list.length > 0 ? (
                        list.map((item: any) => (
                            <StudentAssessmentCard
                                key={item.id}
                                getStudentAssessmentsListResp={item}
                            />
                        ))
                    ) : (
                        <div className="tw-flex tw-items-center tw-justify-center tw-min-h-[240px] tw-col-span-full">
                            <div className="tw-flex tw-flex-col tw-justify-center tw-items-center">
                                <div className="tw-mb-4">
                                    <RejectSvg
                                        fill="#f06548"
                                        width={"52px"}
                                        height="52px"
                                    />
                                </div>
                                <p className="tw-mb-0 tw-text-lg tw-font-semibold">
                                    No Assessments found
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <Pagination
                        paginationContainerClass="mb-4"
                        callbackPaginationHndlr={callbackPaginationHndlr}
                        totalPages={totalPages}
                        totalRecords={totalRecords || 0}
                        currentPageNumber={currentPageNumber}
                    />
                </div>
            </>
        );
    };

    return (
        <>

            <div className="card">
                <div className="card-header">
                    <div className="row align-items-center">
                        <div className="col-6">
                            <h4 className="card-title mb-0 flex-grow-1">Assessment History</h4>
                        </div>
                        <div className="col-auto ms-auto tw-flex tw-justify-between tw-items-center">
                            <div className="list-grid-nav hstack gap-1 tw-shrink-0 tw-ml-3">
                                <button
                                    data-view="grid"
                                    className={classnames(
                                        "btn btn-soft-info nav-link btn-icon fs-14 filter-button",
                                        { active: coursePlannerView.isGridMode }
                                    )}
                                    onClick={handleCoursePlannerView}
                                >
                                    <HugeiconsIcon icon={LeftToRightListBulletIcon} size={18} />
                                </button>
                                <button
                                    data-view="list"
                                    className={classnames(
                                        "btn btn-soft-info nav-link btn-icon fs-14 filter-button",
                                        { active: !coursePlannerView.isGridMode }
                                    )}
                                    onClick={handleCoursePlannerView}
                                >
                                    <HugeiconsIcon icon={GridViewIcon} size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-6 col-lg-4 col-xl-3">
                            <div className="search-box">
                                <TextInput
                                    name="searchString"
                                    value={studentAssessmentHistoryFormik.values.searchString}
                                    onChange={filterHandler}
                                    labelText="Search"
                                    floatingLabel
                                    formgroupClassName="mb-0"
                                />
                                <i className="ri-search-line search-icon"></i>
                            </div>
                        </div>
                        <div className="col-12 col-lg-3 col-xl-2">
                            <SelectInput
                                name="subjectId"
                                value={studentAssessmentHistoryFormik.values.subjectId}
                                onChange={filterHandler}
                                menuItems={assignedClassSubjectsListResp?.data || []}
                                valueKey="subjectId"
                                textKey="subjectName"
                                labelText="Subject"
                                floatingLabel
                                formgroupClassName="mb-0"
                            ></SelectInput>
                        </div>
                        <div className="col-12 col-lg-3 col-xl-2">
                            <SelectInput
                                name="assessmentType"
                                value={studentAssessmentHistoryFormik.values.assessmentType}
                                onChange={filterHandler}
                                menuItems={assessmentTypes || []}
                                valueKey="id"
                                textKey="shortName"
                                labelText="Assessment Type"
                                formgroupClassName="mb-0"
                                inputClassName="fs-12"
                                floatingLabel
                            />
                        </div>
                        <div className="col-12 col-lg-4 col-xl-3">
                            <CustomDatePicker
                                name="dateRange"
                                startDate={studentAssessmentHistoryFormik.values.startDate}
                                endDate={studentAssessmentHistoryFormik.values.endDate}
                                onChange={handleDateChange}
                                labelText="Date Range"
                                formgroupClassName="mb-0"
                                portalId=""
                                floatingLabel
                                monthsShown={2}
                            ></CustomDatePicker>
                        </div>
                        {showClearFilterState && (
                            <div className="col-auto">
                                <button
                                    type="button"
                                    onClick={clearFilterHndlr}
                                    className="btn btn-ghost-danger"
                                >
                                    Clear filter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {coursePlannerView?.isGridMode ? (
                    <TableContainer
                        divClass="table-responsive mb-2"
                        columns={columns || []}
                        data={Array.isArray(getStudentAssessmentsListResp?.content) ? getStudentAssessmentsListResp.content : []}
                        theadClass="table-light text-muted align-middle"
                        showPagination={true}
                        totalPages={totalPages || 0}
                        totalRecords={totalElements || 0}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageable?.pageNumber || 0}
                        showCheckbox={false}
                    />
                ) : (
                    <>
                        <div className="card-body py-0">
                            <StudentAssessmentsList
                                totalPages={totalPages}
                                totalRecords={totalElements}
                                callbackPaginationHndlr={paginationHndlrCard}
                                currentPageNumber={pageNumber}
                            ></StudentAssessmentsList></div></>
                )}
                <ModalContainerUpdated
                    id="dummy-success-modal"
                    isOpen={gradeDistributionUploadModalState.showModal}
                    toggle={() => closeGradeDistributionModalModal()}
                    modalTitle="Instant Results"
                    modalSize="xl"
                    headerClassName="py-2 tw-bg-gradient-to-r tw-from-[#FFB200] tw-to-[#27C26E]"
                >
                    <InstantResults
                        id={gradeDistributionUploadModalState.modalData}
                        isOpen={false}
                        toggle={() => closeGradeDistributionModalModal()}
                        scoreData={{
                            scoredMarks: 10,
                            condectedMarks: 30,
                        }}
                    ></InstantResults>
                </ModalContainerUpdated>
                <ConfirmationModal
                    id="download-report-card-modal"
                    isOpen={downloadResultReportCardModalState.showModal}
                    confirmMessage={`Are you sure you want to Result Report ?`}
                    cancelHndlr={closeDownloadResultReportCardModal}
                    confirmHndlr={viewResultReportCardHndlr}
                    isDisble={showApiLoader}
                    showImgIcon={true}
                    iconType="approve"
                    btnClassName="btn w-sm btn-success"
                />
            </div></>
    );
};

export default StudentAssessmentHistory;
