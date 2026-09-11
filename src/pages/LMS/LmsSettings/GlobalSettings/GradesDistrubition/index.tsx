import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { deleteGradesDistributionAct, getGradesDistributionAct, getGradesDistributionByIdAct } from "../../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { useModal } from "../../../../../hooks/modalhook";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated } from "../../../../../Components/Common";
import { generateColumns } from "./helper";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import AddGradeDistributionModal from "./AddGradeDistributionModal";

const GradesDistrubition = () => {
    const { closeModal: closeGradeDistributionModalModal, modalState: gradeDistributionUploadModalState, openModal: gradeDistributionUploadModal } = useModal();
    const { closeModal: closeDelGradeDistributionModal, modalState: delGradeDistributionModalState, openModal: openDelGradeDistributionModal } = useModal();

    const dispatch = useAppDispatch();

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getGradeDistrubutionResp,
        lmsAssessmentErrorAct,
        saveGradeDistrubutionResp,
        deleteGradeDistrubutionResp,
        updateGradeDistrubutionResp,

    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, lmsAssessment }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getGradeDistrubutionResp: lmsAssessment.getGradeDistrubutionResp,
            lmsAssessmentErrorAct: lmsAssessment.lmsAssessmentErrorAct,
            saveGradeDistrubutionResp: lmsAssessment.saveGradeDistrubutionResp,
            deleteGradeDistrubutionResp: lmsAssessment.deleteGradeDistrubutionResp,
            updateGradeDistrubutionResp: lmsAssessment.updateGradeDistrubutionResp,
        }),
        shallowEqual
    );

    const GradeDistributionRef = useRef({
        prevLmsAssessmentErrorAct: lmsAssessmentErrorAct,
        prevSaveGradeDistrubutionResp: saveGradeDistrubutionResp,
        prevDeleteGradeDistrubutionResp: deleteGradeDistrubutionResp,
        prevUpdateGradeDistrubutionResp: updateGradeDistrubutionResp,
    })

    useEffect(() => {
        const { prevLmsAssessmentErrorAct, prevSaveGradeDistrubutionResp, prevDeleteGradeDistrubutionResp, prevUpdateGradeDistrubutionResp } = GradeDistributionRef.current || {}

        if (lmsAssessmentErrorAct && prevLmsAssessmentErrorAct !== lmsAssessmentErrorAct) {
            const { details } = lmsAssessmentErrorAct || {}
            toast.error(details || "Something went wrong")
        }
        else if (saveGradeDistrubutionResp && prevSaveGradeDistrubutionResp !== saveGradeDistrubutionResp) {
            toast.success("Grade Added successfully")
            getGradeDistributionApiCall();
            closeGradeDistributionModalModal();
        }
        else if (deleteGradeDistrubutionResp && prevDeleteGradeDistrubutionResp !== deleteGradeDistrubutionResp) {
            toast.success("Grade Deleted successfully")
            getGradeDistributionApiCall();
            closeDelGradeDistributionModal();
        }
        else if (updateGradeDistrubutionResp && prevUpdateGradeDistrubutionResp !== updateGradeDistrubutionResp) {
            toast.success("Grade Updated successfully")
            getGradeDistributionApiCall();
            closeGradeDistributionModalModal();
        }
        GradeDistributionRef.current.prevLmsAssessmentErrorAct = lmsAssessmentErrorAct;
        GradeDistributionRef.current.prevSaveGradeDistrubutionResp = saveGradeDistrubutionResp;
        GradeDistributionRef.current.prevDeleteGradeDistrubutionResp = deleteGradeDistrubutionResp;
        GradeDistributionRef.current.prevUpdateGradeDistrubutionResp = updateGradeDistrubutionResp;
    }, [lmsAssessmentErrorAct, saveGradeDistrubutionResp, deleteGradeDistrubutionResp, updateGradeDistrubutionResp])


    function editScheduleTaskModalHndlr(event: React.MouseEvent<HTMLElement>) {
        const id = event.currentTarget.getAttribute("data-id");
        dispatch(getGradesDistributionByIdAct(generateActionPayload('get_grades_distribution_by_id', { id })));
        gradeDistributionUploadModal(id);
    }

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
                actionName: "Edit",
                onClickHndlr: editScheduleTaskModalHndlr,
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon
                    icon={Delete02StrokeStandard}
                    className="me-2 text-danger"
                    size={18}
                />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDelGradeDistributionModal(id)
                },
            },
        ],
        []
    );

    const getGradeDistributionApiCall = (otherProps?: any) => {
        const payload = {
            branchId,
            ...otherProps,
        }
        dispatch(getGradesDistributionAct(generateActionPayload("get_grades_distribution", undefined, payload)));
    }
    useEffect(() => {
        getGradeDistributionApiCall();
    }, [])
    function delModalSubmitHndlr() {
        dispatch(deleteGradesDistributionAct(generateActionPayload("delete_grades_distribution", { id: delGradeDistributionModalState.modalData })));
    }

    const columns = useMemo(() => generateColumns(menuOptions), []);

    const { content: gradeDistributionData, totalElements, totalPages, pageable } = getGradeDistrubutionResp || {}

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <div className="row align-items-center">
                        <div className="col-6">
                            <h4 className="card-title mb-0 flex-grow-1">Grades Distribution</h4>
                        </div>
                        <div className="col-auto ms-auto">
                            <button
                                className="btn btn-success float-end d-flex align-items-center"
                                onClick={() => gradeDistributionUploadModal()}
                            >
                                <i className="ri-add-line me-2" />
                                Add New
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body p-0">
                    <TableContainer
                        columns={columns || []}
                          data={Array.isArray(getGradeDistrubutionResp) ? getGradeDistrubutionResp : []}
                        tableClass="mb-0"
                        divClass="table-responsive mb-3"
                        theadClass="table-light text-muted align-middle"
                        showPagination={false}
                    />
                </div>
            </div>
            <ModalContainerUpdated
        id="add-examination"
        isOpen={gradeDistributionUploadModalState.showModal}
        toggle={() => closeGradeDistributionModalModal()}
        modalTitle={gradeDistributionUploadModalState.modalData ? "Edit Grade Distribution" : "Add Grade Distribution"}
        modalSize="lg"
      >
        <AddGradeDistributionModal
          id={gradeDistributionUploadModalState.modalData}
          isOpen={false}
          toggle={() => closeGradeDistributionModalModal()}
          modalTitle="Create Detail"
          modalData1={gradeDistributionUploadModalState.modalData}
        />
      </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-grade-distribution"
                isOpen={delGradeDistributionModalState.showModal}
                confirmMessage="Are you sure you want to delete this Grade Distribution ?"
                cancelHndlr={closeDelGradeDistributionModal}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
        </>
    );
};

export default GradesDistrubition;
