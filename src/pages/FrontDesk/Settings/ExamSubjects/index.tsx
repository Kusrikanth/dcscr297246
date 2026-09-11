import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
    generateColumns
} from "./helper";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import ExamSubjectsModal from "./ExamSubjectsModal";
import { examSubjectsListAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { toast } from "react-toastify";
import { useModal } from "../../../../hooks/modalhook";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
};

const ExamSubjects = () => {

    const dispatch = useAppDispatch();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })
    const [examSubjectFilterState, setExamSubjectFilterState] = useState(initialValues);

    const { closeModal: closeAddExamSubjectModal, modalState: addExamSubjectModalState, openModal: openAddExamSubjectModal } = useModal()

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        examSubjectsListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        addExamSubjectsListResp,
        editExamSubjectsListResp,
        academicAvailabilityErrorResp,
    } = useAppSelector(
        ({ instAcademics, branchAcademics, appData, admissionAvailabilityRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            examSubjectsListResp: admissionAvailabilityRequest.examSubjectsListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            addExamSubjectsListResp: admissionAvailabilityRequest.addExamSubjectsListResp,
            editExamSubjectsListResp: admissionAvailabilityRequest.editExamSubjectsListResp,
            academicAvailabilityErrorResp: admissionAvailabilityRequest.academicAvailabilityErrorResp,
        }),
        shallowEqual
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openAddExamSubjectModal(id)

                },
            },
        ],
        []
    );

    const examSubjectsApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, instituteId: instituteId, ...examSubjectFilterState, ...pagination.current, ...otherProps }
        if (payload.academicYearId) {
            dispatch(examSubjectsListAct(generateActionPayload('exam_subjects_list', undefined, payload)))
        }
    }

    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    const ExamSubjectsRef = useRef({
        prevAddExamSubjectsRef: addExamSubjectsListResp,
        prevEditExamSubjectsRef: editExamSubjectsListResp,
        prevAcademicAvailabilityErrorRef: academicAvailabilityErrorResp,
    })
    useEffect(() => {
        const { prevAddExamSubjectsRef, prevEditExamSubjectsRef, prevAcademicAvailabilityErrorRef } = ExamSubjectsRef.current;
        if (addExamSubjectsListResp && prevAddExamSubjectsRef !== addExamSubjectsListResp) {
            toast.success('Exam subject added successfully')
            closeAddExamSubjectModal();
            examSubjectsApiCall();
        }
        if (editExamSubjectsListResp && prevEditExamSubjectsRef !== editExamSubjectsListResp) {
            toast.success('Exam subject updated successfully')
            closeAddExamSubjectModal();
            examSubjectsApiCall();
        }
        if (academicAvailabilityErrorResp && prevAcademicAvailabilityErrorRef !== academicAvailabilityErrorResp) {
            const { details } = academicAvailabilityErrorResp;
            toast.error(details)
        }
        ExamSubjectsRef.current.prevAddExamSubjectsRef = addExamSubjectsListResp;
        ExamSubjectsRef.current.prevEditExamSubjectsRef = editExamSubjectsListResp;
        ExamSubjectsRef.current.prevAcademicAvailabilityErrorRef = academicAvailabilityErrorResp;

    }, [addExamSubjectsListResp, editExamSubjectsListResp, academicAvailabilityErrorResp])

    useEffect(() => {

        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        if (academicYearListResp) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
            setExamSubjectFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
            getCurriculumApiCall({ academicYearId: yearId })
        }
    }, [academicYearListResp]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};

        if (Array.isArray(data) && data.length > 0) {
            setExamSubjectFilterState((prev: any) => {
                if (prev.curriculumId) {
                    return prev;
                }
                const firstCurriculumId = data[0].branchCurriculumId;
                getClassApiCall({ curriculumId: firstCurriculumId });
                examSubjectsApiCall({ curriculumId: firstCurriculumId });

                return { ...prev, curriculumId: firstCurriculumId };
            });
        }
    }, [brchCurriculumResp]);

    const getClassApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, academicYearId: examSubjectFilterState.academicYearId, curriculumId: examSubjectFilterState.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: examSubjectFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setExamSubjectFilterState((prev: any) => ({ ...prev, [name]: value }))
        pagination.current.pageNo = 0
        if (name === 'academicYearId') {
            setExamSubjectFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "" }))
            getCurriculumApiCall({ academicYearId: value })
        }
        else if (name === 'curriculumId') {
            if (!value) {
                dispatch(resetBrchClassAct(undefined));
            } else {
                getClassApiCall({ curriculumId: value })
            }
            examSubjectsApiCall({ curriculumId: value })
            setExamSubjectFilterState((prev: any) => ({ ...prev, [name]: value, classId: "" }))
        }
        else {
            setExamSubjectFilterState((prev: any) => ({ ...prev, [name]: value }))
            examSubjectsApiCall({ [name]: value })
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        examSubjectsApiCall(paginationInfo)
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { content: examSubjects, totalPages, totalElements, pageable } = examSubjectsListResp || {};

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Student Concessions" pageTitle="Admissions" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow">

                        {/* Card Header */}
                        <div className="tw-border-b tw-px-6 tw-py-4">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <h4 className="card-title !tw-mb-0 tw-flex-grow tw-justify-center">
                                    Exam Subjects
                                </h4>

                                <Button
                                variant="primary"
                                    onClick={() => openAddExamSubjectModal()}
                                >
                                    <i className="ri-add-line" />
                                    Add New
                                </Button>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="tw-px-6 tw-py-4">
                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4">

                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={examSubjectFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={examSubjectFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>

                                <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="classId"
                                        value={examSubjectFilterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Class"
                                        floatingLabel
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Table */}
                        <TableContainer
                            columns={roleColumns || []}
                            data={examSubjects || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageable?.pageNumber}
                        />
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="exam-subject"
                isOpen={addExamSubjectModalState.showModal}
                toggle={closeAddExamSubjectModal}
                modalTitle="Exam Subjects"
                modalSize="lg"
            >
                <ExamSubjectsModal
                    toggle={closeAddExamSubjectModal}
                    applicationId={addExamSubjectModalState.modalData}
                    details={examSubjectFilterState}
                />
            </ModalContainerUpdated>

        </>
    );
};

export default ExamSubjects;
