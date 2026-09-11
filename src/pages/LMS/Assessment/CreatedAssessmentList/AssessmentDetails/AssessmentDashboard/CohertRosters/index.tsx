import { useEffect, useRef, useState } from "react";
import { ModalContainerUpdated, SearchInput, UserDetails } from "../../../../../../../Components/Common";
import { useFormik } from "formik";
import ChartPercentage, { searchInputOptions } from "./helper";
import { useModal } from "../../../../../../../hooks/modalhook";
import ExportModal from "../../../../../../Directory/StudentManagement/ExportModal";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../../../../utility/commonutility";
import { exportStudentResultListAct } from "../../../../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../../../../assets/imagesdps/common_icon/export_icon.svg";

const initialValues = {
    attemptStatus: "",
    resultStatus: "",
}

const CohertRosters = ({ getResultListResp, getResultListApiCall, getAssessmentByIdResp }) => {

    const [searchStudentState, setSearchStudentState] = useState("global");
    const { closeModal: closeExportStudentResultListHnldr, openModal: openExportLoginHistoryModalHnldr, modalState: exportStudentResultListModalState } = useModal();
    const dispatch = useAppDispatch();
    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 10,
    });

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        lmsAssessmentErrorAct,
        exportStudentResultListResp
    }: any = useAppSelector(
        ({ lmsAssessment, appData }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            lmsAssessmentErrorAct: lmsAssessment.lmsAssessmentErrorAct,
            exportStudentResultListResp: lmsAssessment.exportStudentResultListResp
        }),
        shallowEqual
    );

    const instituteRespRef = useRef<any>({
        prevLmsAssessmentErrorAct: lmsAssessmentErrorAct,
        prevExportStudentResultListResp: exportStudentResultListResp,
    });

    useEffect(() => {
        const { prevLmsAssessmentErrorAct, prevExportStudentResultListResp } = instituteRespRef.current;
        if (lmsAssessmentErrorAct && prevLmsAssessmentErrorAct !== lmsAssessmentErrorAct) {
            toast.error(lmsAssessmentErrorAct.details || "Something went wrong.");
        }
        else if (exportStudentResultListResp && prevExportStudentResultListResp !== exportStudentResultListResp) {
            toast.success("Data Download Successfully.");
            closeExportStudentResultListHnldr();
            downloadExcelFile(exportStudentResultListResp, 'student_result_list.xlsx')
        }
        instituteRespRef.current.prevLmsAssessmentErrorAct = lmsAssessmentErrorAct;
        instituteRespRef.current.prevExportStudentResultListResp = exportStudentResultListResp;
    }, [lmsAssessmentErrorAct, exportStudentResultListResp]);

    const submitExportHndlr = () => {
        dispatch(exportStudentResultListAct(
            generateActionPayload(
                "export_student_result_list",
                undefined,
                {
                    ...resultListForm.values,
                    branchId,
                    nameFilterType: searchStudentState,
                    assessmentId: getAssessmentByIdResp?.getAssessmentByIdResp?.id ?? "",
                    academicYearId: getAssessmentByIdResp?.getAssessmentByIdResp?.academicYearId ?? "",
                    curriculumId: getAssessmentByIdResp?.getAssessmentByIdResp?.branchCurriculumId ?? "",
                    classId: getAssessmentByIdResp?.getAssessmentByIdResp?.classId ?? "",
                },
                {
                    responseType: 'blob'
                }
            )
        ));
    };

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        resultListForm.setFieldValue(name, value);

        getResultListApiCall(
            undefined,
            name === "attemptStatus" ? value : resultListForm.values.attemptStatus,
            name === "resultStatus" ? value : resultListForm.values.resultStatus
        );
    };

    const resultListForm = useFormik({
        initialValues,
        onSubmit: (values) => { },
    });

    function onSearchHandler(name: string, value: any) {
        paginationDetailRef.current.pageNo = 0;
        setSearchStudentState((prev) => {
            const updatedFilterType = prev;
            resultListForm.setValues((prevState) => {
                const updatedState = {
                    ...prevState,
                    searchString: value,
                    nameFilterType: updatedFilterType,
                };
                getResultListApiCall(
                    undefined,
                    updatedState.attemptStatus,
                    updatedState.resultStatus,
                    {
                        searchString: updatedState.searchString,
                        nameFilterType: updatedState.nameFilterType,
                        ...paginationDetailRef.current,
                    }
                );
                return updatedState;
            });
            return updatedFilterType;
        });
    }

    function onChangeHandler(name: string, id: any, item: any) {
        setSearchStudentState(id);
        paginationDetailRef.current.pageNo = 0;
        resultListForm.setValues((prevState) => {
            const updatedState = {
                ...prevState,
                nameFilterType: id,
                searchString: "",
            };
            getResultListApiCall(
                undefined,
                updatedState.attemptStatus,
                updatedState.resultStatus,
                {
                    searchString: updatedState.searchString,
                    nameFilterType: updatedState.nameFilterType,
                    ...paginationDetailRef.current,
                }
            );
            return updatedState;
        });
    }

    return (
        <>
            <div className="card mb-3 lms-dashboardresult-summary">
                <div className="card-header">
                    <div className="row align-items-center w-100 mx-auto">
                        <div className="col-12 col-lg-auto px-0">
                            <h4 className="card-title mb-0 flex-grow-1 fs-15">
                                Result Summary
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="card-body p-0 h-100">
                    <div className="row g-3 p-3 pb-0">
                        <div className="col-12 col-lg-6">
                            <div className="search-box">
                                <SearchInput
                                    hideDefaultSelect
                                    name="searchString"
                                    value={searchStudentState}
                                    menuItems={searchInputOptions}
                                    idKey="id"
                                    labelName="Search With"
                                    searchHandler={onSearchHandler}
                                    onChange={onChangeHandler}
                                    renderSelectedValue={(item: any) => item?.name}
                                    renderOptions={(item: any) => item?.name}
                                />
                            </div>
                        </div>
                        <div className="col-auto ms-auto">
                            <button
                                id="export-btn"
                                className="btn ms-3 btn-icon btn-rounded btn-soft-info p-2"
                                onClick={() => openExportLoginHistoryModalHnldr()}
                            >
                                <img src={ExportIcon} className="img-fluid h-100" />
                                <UncontrolledTooltip placement="bottom" target="export-btn">
                                    Export
                                </UncontrolledTooltip>
                            </button>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap gap-3 p-3 justify-content-between">
                        <div className="flex-grow-1" style={{ minWidth: "45%" }}>
                            <div
                                className="card"
                                style={{ border: "1px solid #E0E0E0", borderRadius: "8px", height: "520px" }}
                            >
                                <div className="card-header p-2" style={{ backgroundColor: "#F1FDF7" }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center gap-2">
                                            <i className="ri-checkbox-circle-line text-success fs-20"></i>
                                            <h6 className="mb-0 fw-semibold text-success">Passed Students</h6>
                                        </div>
                                        <div
                                            className="d-flex justify-content-center align-items-center"
                                            style={{
                                                backgroundColor: "#D0FAE5",
                                                borderRadius: "20px",
                                                width: "25px",
                                                height: "25px",
                                            }}
                                        >
                                            <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2">
                                                {Array.isArray(getResultListResp?.content)
                                                    ? getResultListResp.content.filter(
                                                        (s: any) => s.result === "PASS"
                                                    ).length
                                                    : 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body px-1">
                                    <div
                                        className="px-3 d-flex flex-column justify-content-start"
                                        style={{ maxHeight: "440px", overflowY: "auto", minHeight: "440px" }}
                                    >
                                        {Array.isArray(getResultListResp?.content) &&
                                            getResultListResp.content.filter((s: any) => s.result === "PASS")
                                                .length > 0 ? (
                                            getResultListResp.content
                                                .filter((s: any) => s.result === "PASS")
                                                .map((student: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="d-flex justify-content-between align-items-center py-2 mb-2 bg-white rounded"
                                                    >
                                                        <UserDetails
                                                            displayName={student.studentName || "-"}
                                                            displayId={student.studentCode || student.sectionName}
                                                            size="xs"
                                                            defaultImgType="student"
                                                        />
                                                        <ChartPercentage
                                                            value={student.totalScore || 0}
                                                            total={student.totalQuestionMarks || 0}
                                                            result={student.result}
                                                            size={40}
                                                        />
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="text-center text-muted mt-5">No data available</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow-1" style={{ minWidth: "45%" }}>
                            <div
                                className="card"
                                style={{ border: "1px solid #E0E0E0", borderRadius: "8px", height: "520px" }}
                            >
                                <div className="card-header p-2" style={{ backgroundColor: "#FEF5F5" }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center gap-2">
                                            <i className="ri-close-circle-line text-danger fs-20"></i>
                                            <h6 className="mb-0 fw-semibold text-danger">Failed Students</h6>
                                        </div>
                                        <div
                                            className="d-flex justify-content-center align-items-center"
                                            style={{
                                                backgroundColor: "#FBD8D1",
                                                borderRadius: "20px",
                                                width: "25px",
                                                height: "25px",
                                            }}
                                        >
                                            <span className="badge bg-danger-subtle text-danger">
                                                {Array.isArray(getResultListResp?.content)
                                                    ? getResultListResp.content.filter(
                                                        (s: any) => s.result === "FAIL"
                                                    ).length
                                                    : 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body px-1">
                                    <div
                                        className="px-3 d-flex flex-column justify-content-start"
                                        style={{ maxHeight: "440px", overflowY: "auto", minHeight: "440px" }}
                                    >
                                        {Array.isArray(getResultListResp?.content) &&
                                            getResultListResp.content.filter((s: any) => s.result === "FAIL")
                                                .length > 0 ? (
                                            getResultListResp.content
                                                .filter((s: any) => s.result === "FAIL")
                                                .map((student: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className="d-flex justify-content-between align-items-center p-2 mb-2 bg-white rounded"
                                                    >
                                                        <UserDetails
                                                            displayName={student.studentName || "N/A"}
                                                            displayId={student.studentCode || student.sectionName}
                                                            size="xs"
                                                            defaultImgType="student"
                                                        />
                                                        <ChartPercentage
                                                            value={student.totalScore || 0}
                                                            total={student.totalQuestionMarks || 0}
                                                            result={student.result}
                                                            size={40}
                                                        />
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="text-center text-muted mt-5">No data available</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="export-login-history-modal"
                isOpen={exportStudentResultListModalState.showModal}
                toggle={closeExportStudentResultListHnldr}
                modalTitle="Export Student Resul List Details"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportStudentResultListModalState.showModal}
                    toggle={closeExportStudentResultListHnldr}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={submitExportHndlr}
                    feature="assessment"
                    subFeature="assessment_result_list"
                    remarksText="Enter remarks to export Student Resul List details?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default CohertRosters;