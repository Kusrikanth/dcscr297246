
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, DateInput, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { assignStatusOptions, checkFitlersApplied, generateColumns } from "./helper";
import { getSectionList, setSectionListAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import CopyAssignLanguageModal from "./CopyAssignLanguageModal";
import AllocateStudentSubjectModal from "./AllocateStudentSubjectModal";
import { deleteStudentSubjectAllocationAct, getStudentAllocatedSubjectsAct } from "../../../store/academic/classSubjects/classsubjectsactions";
import { useModal } from "../../../hooks/modalhook";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
    studentSubjectStatus: "",
};
const StudentSubjectAllocation = () => {
    const dispatch = useDispatch();
    const paginationRef = useRef({
        pageNo: 0,
        pageSize: 10
    })
    const [clearFilterState, setClearFilterState] = useState(false);

    const { modalState: subjectAllocateModalState, openModal:
        openSubjectAllocateModalHndlr, closeModal: closeSubjectAllocateModalHndlr } = useModal();
    const { modalState: copyModalState, openModal:
        openCopyModalHndlr, closeModal: closeCopyModalHndlr } = useModal();
    const { modalState: delSubjectAllocation, closeModal: closeDelSubjectAllocationModalHndlr,
        openModal: openDelSubjectAllocationModalHndlr
    } = useModal();

    const [studentSubjectFilterState, setStudentSubjectFilterState] = useState(initialValues);
    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        sectionListResp,
        deleteStudentSubjectAllocationResp,
        studentAllocatedSubjectResp, classSubjectErrorResp
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, classSubjectsInfo }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            studentAllocatedSubjectResp: classSubjectsInfo.studentAllocatedSubjectResp,
            deleteStudentSubjectAllocationResp: classSubjectsInfo.deleteStudentSubjectAllocationResp,
            classSubjectErrorResp: classSubjectsInfo.classSubjectErrorResp
        }),
        shallowEqual
    );

    const subjectAllocationRespRef = useRef({
        prevClassSubjectErrorResp: classSubjectErrorResp,
        prevDeleteStudentSubjectAllocationResp: deleteStudentSubjectAllocationResp
    });


    useEffect(() => {
        const { prevClassSubjectErrorResp, prevDeleteStudentSubjectAllocationResp } = subjectAllocationRespRef.current;
        if (classSubjectErrorResp && prevClassSubjectErrorResp !== classSubjectErrorResp) {
            const { details } = classSubjectErrorResp;
            toast.error(details || "Something went wrong.");
        } else if (deleteStudentSubjectAllocationResp && prevDeleteStudentSubjectAllocationResp !== deleteStudentSubjectAllocationResp) {
            toast.success('Student subject allocation deleted successfully.');
            closeDelSubjectAllocationModalHndlr();
            getStudentAllocatedSubjectApiCall();
        }
        subjectAllocationRespRef.current.prevClassSubjectErrorResp = classSubjectErrorResp;
        subjectAllocationRespRef.current.prevDeleteStudentSubjectAllocationResp = deleteStudentSubjectAllocationResp;
    }, [classSubjectErrorResp, deleteStudentSubjectAllocationResp]);

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    const getClassApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, academicYearId: studentSubjectFilterState?.academicYearId, curriculumId: studentSubjectFilterState?.curriculumId, sortBy: "classSequence",requestType:"SUBJECT_ALLOCATION", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: studentSubjectFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function getStudentAllocatedSubjectApiCall(otherProps?: any) {
        // const payload = { branchId, ...feeDetailState, ...otherProps, ...paginationDetailRef.current };
        const payload = {
            branchId, ...studentSubjectFilterState, ...otherProps, ...paginationRef.current
        }
        setClearFilterState(checkFitlersApplied(payload));
        dispatch(getStudentAllocatedSubjectsAct(generateActionPayload("get_student_allocatedsubjects", undefined, payload)));
    }


    useEffect(() => {
        if (academicYearListResp) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
            setStudentSubjectFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
            getStudentAllocatedSubjectApiCall({ academicYearId: yearId });
            getCurriculumApiCall({ academicYearId: yearId });
        }
    }, [academicYearListResp]);

    const getSectionListResp = (otherProps?: any) => {
        let payload = { branchClassId: studentSubjectFilterState.classId || null, masterAcademicYearId: studentSubjectFilterState.academicYearId, curriculumId: studentSubjectFilterState.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(getSectionList(generateActionPayload("get_section_list", undefined, payload)));
        }
    }


    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        paginationRef.current.pageNo = 0;
        if (name === 'academicYearId') {
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(setSectionListAct(undefined));
            setStudentSubjectFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "", sectionId: "" }))
            getStudentAllocatedSubjectApiCall({ academicYearId: value, curriculumId: "", classId: null, sectionId: null });
        }
        else if (name === 'curriculumId') {
            if (value) {
                getClassApiCall({ curriculumId: value, academicYearId: studentSubjectFilterState.academicYearId });
                setStudentSubjectFilterState((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "" }))
                getStudentAllocatedSubjectApiCall({ curriculumId: value, classId: "", sectionId: "" });
            }
            else {
                dispatch(resetBrchClassAct(undefined));
                dispatch(setSectionListAct(undefined));

            }
        } else if (name === 'classId') {
            if (value) {
                getSectionListResp({ branchClassId: value })
            }
            dispatch(setSectionListAct(undefined));
            setStudentSubjectFilterState((prev: any) => ({ ...prev, [name]: value, sectionId: "" }))
            getStudentAllocatedSubjectApiCall({ classId: value, sectionId: "" });
        } else {
            setStudentSubjectFilterState((prev: any) => ({ ...prev, [name]: value }))
            getStudentAllocatedSubjectApiCall({ [name]: value });
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationRef.current = paginationInfo;
        getStudentAllocatedSubjectApiCall();
    }


    const menuOptions = useMemo(() => [
        {
            id: "edit",
            actionIcon: <HugeiconsIcon icon={PencilEdit02StrokeStandard} className="me-2 tw-text-gray-500" size={18} />,
            actionName: "Edit",
            onClickHndlr: (event: any) => {
                const academicStudentId = event.currentTarget.getAttribute("data-id");
                const { content } = studentAllocatedSubjectResp;
                if (Array.isArray(content)) {
                    const studentSubjectInfo = content.find(item => item.academicStudentId?.toString() === academicStudentId);
                    if (studentSubjectInfo) {
                        openSubjectAllocateModalHndlr(studentSubjectInfo);
                    } else {
                        toast.error("Student subject is not allocated.");
                    }
                }
            },
        },
        {
            id: "delete",
            actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />,
            actionName: "Delete",
            onClickHndlr: (event: any) => {
                const academicStudentId = event.currentTarget.getAttribute("data-id");
                const { content } = studentAllocatedSubjectResp;
                if (Array.isArray(content)) {
                    const { id } = content.find(item => item.academicStudentId?.toString() === academicStudentId);
                    openDelSubjectAllocationModalHndlr(id);
                }

            },
        },
    ], [studentAllocatedSubjectResp]);

    const availableClassList = useMemo(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content)) {
            return content?.filter(item => Number(item.classSequence) > 13);
        }
        return [];
    }, [branchClassResp]);

    function clearFilterHandler() {
        setStudentSubjectFilterState(prevState => ({ ...initialValues, academicYearId: prevState.academicYearId }));
        getStudentAllocatedSubjectApiCall({ ...initialValues, academicYearId: studentSubjectFilterState.academicYearId });
        dispatch(resetBrchClassAct(undefined));
        dispatch(setSectionListAct(undefined));
    }

    function toggleAllocateStudentModalHndlr(apiCall?: boolean) {
        if (typeof apiCall === 'boolean' && apiCall) {
            getStudentAllocatedSubjectApiCall();
        }
        closeSubjectAllocateModalHndlr();
    }

    function confirmDeleteTransporEmpHandler() {
        const { modalData } = delSubjectAllocation;
        dispatch(deleteStudentSubjectAllocationAct(generateActionPayload("delete_student_allocatedsubjects",
            { allocationId: modalData })));
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: studentList, totalPages, totalElements, pageNumber }: any = studentAllocatedSubjectResp || {};
    const roleColumns = useMemo(() => generateColumns(menuOptions), [studentAllocatedSubjectResp]);
    const filteredCurriculumTypes = useMemo(() => {
        if (Array.isArray(curriculumTypes)) {
            return curriculumTypes.filter(item => item.branchCurriculumId !== 18);
        }
        return [];
    }, [curriculumTypes]);
    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Academics" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">
                        <div className="tw-border-b tw-px-4 tw-py-3 tw-flex tw-items-center tw-justify-between">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Student Subject Allocation
                            </h4>
                            <Button
                                type="button"
                                variant="info"
                                onClick={openCopyModalHndlr}
                            >
                                Copy
                            </Button>
                        </div>
                        <div className="tw-border-b tw-px-4 tw-py-4">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-end">
                                <div className="tw-col-span-12 md:tw-col-span-2">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={studentSubjectFilterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="bg-soft-light"
                                            formgroupClassName="mb-0"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel

                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={studentSubjectFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={studentSubjectFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={filteredCurriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-2">
                                    <SelectInput
                                        name="classId"
                                        value={studentSubjectFilterState.classId}
                                        onChange={filterHandler}
                                        menuItems={branchClassResp?.content}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Class"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-2">
                                    <SelectInput
                                        name="sectionId"
                                        value={studentSubjectFilterState.sectionId}
                                        onChange={filterHandler}
                                        menuItems={sectionListResp?.data}
                                        valueKey="sectionId"
                                        textKey="sectionName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Section"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-2">
                                    <SelectInput
                                        name="studentSubjectStatus"
                                        value={studentSubjectFilterState.studentSubjectStatus}
                                        onChange={filterHandler}
                                        menuItems={assignStatusOptions}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Status"
                                        floatingLabel
                                    />
                                </div>
                                {clearFilterState && (
                                    <div className="tw-col-span-12 tw-flex tw-justify-end">
                                        <Button
                                            type="button"
                                            variant="wrong"
                                            onClick={clearFilterHandler}
                                        >
                                            Clear Filter
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="tw-p-0">
                            <TableContainer
                                columns={roleColumns || []}
                                data={Array.isArray(studentList) ? studentList : []}
                                divClass="table-responsive tw-mb-3"
                                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                                showPagination={true}
                                totalPages={totalPages || 0}
                                totalRecords={totalElements || 0}
                                callbackPaginationHndlr={paginationHndlr}
                                currentPageNumber={pageNumber || 0}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="edit-student-subject-allocation-modal"
                isOpen={subjectAllocateModalState.showModal}
                toggle={closeSubjectAllocateModalHndlr}
                modalTitle="Subject Allocation to"
                modalSize="md"
            >
                <AllocateStudentSubjectModal
                    branchId={branchId}
                    closeModalHndlr={toggleAllocateStudentModalHndlr}
                    allocatedSubjectInfo={subjectAllocateModalState.modalData}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="student-subject-allocation-Model"
                isOpen={copyModalState.showModal}
                toggle={closeCopyModalHndlr}
                modalTitle="Student Subject Allocation"
                modalSize="lg"
            >
                <CopyAssignLanguageModal
                    closeModalHndlr={closeCopyModalHndlr}
                    branchId={branchId}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-driver-modal"
                isOpen={delSubjectAllocation.showModal}
                confirmMessage="Are you sure you want to delete this student subject allocation?"
                cancelHndlr={closeDelSubjectAllocationModalHndlr}
                confirmHndlr={confirmDeleteTransporEmpHandler}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
        </>
    );
};

export default StudentSubjectAllocation;
