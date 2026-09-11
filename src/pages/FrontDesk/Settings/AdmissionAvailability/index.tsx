
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
    generateColumns
} from "./helper";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import AdmissionAvailabilityModal from "./AdmissionAvailabilityModal";
import { admissionAvailabilityListAct } from "../../../../store/FrontDesk/AdmissionSettings/admissionsettingaction";
import { toast } from "react-toastify";
import { useModal } from "../../../../hooks/modalhook";
import { HugeiconsIcon } from "@hugeicons/react";
import {PencilEdit02Icon} from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    search: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    type: "",
};

const AdmissionAvailability = () => {

    const dispatch = useAppDispatch();
    const { closeModal: closeChangesStudentModal, modalState: changesStudentModalState, openModal: openChangesStudentModal } = useModal();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const getAdmissionAvailabilityList = (otherProps?: any) => {
        const payload = {
            curriculumId: admissionAvailabilityFilterState.curriculumId, branchId,
            academicYearId: admissionAvailabilityFilterState.academicYearId, startDate: "",
            endDate: "", availability: "", sortBy: "branchClass.classSequence",
            orderType: "asc", ...pagination.current, ...otherProps,
        }
        if (payload.academicYearId) {
            dispatch(
                admissionAvailabilityListAct(
                    generateActionPayload("get_admission_availability", undefined, payload)
                )
            );
        }
    }

    const [admissionAvailabilityFilterState, setAdmissionAvailabilityFilterState] = useState(initialValues);

    const {
        academicYearListResp,
        brchCurriculumResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        admissionAvailabilityListResp,
        addadmissionAvailabilityResp,
        editadmissionAvailabilityResp,
        academicAvailabilityErrorResp
    } = useAppSelector(
        ({ instAcademics, branchAcademics, appData, admissionAvailabilityRequest, admissionSettingRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            admissionAvailabilityListResp: admissionSettingRequest.admissionAvailabilityListResp,
            addadmissionAvailabilityResp: admissionAvailabilityRequest.addadmissionAvailabilityResp,
            editadmissionAvailabilityResp: admissionAvailabilityRequest.editadmissionAvailabilityResp,
            academicAvailabilityErrorResp: admissionAvailabilityRequest.academicAvailabilityErrorResp,
        }),
        shallowEqual
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18}/>,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openChangesStudentModal(id);
                },
            },
        ],
        []
    );

    const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    useEffect(() => {

        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year?.isAdmissionDefault)?.academicYearId
        if (yearId) {
            getAdmissionAvailabilityList({ academicYearId: yearId });
            getCurriculumApiCall({academicYearId:yearId});
        }
        setAdmissionAvailabilityFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    }, [academicYearListResp]);

    const admissionAvailabilityRef = useRef({
        prevAddadmissionAvailabilityResp: addadmissionAvailabilityResp,
        prevEditAdmissionAvailabilityRef: editadmissionAvailabilityResp,
        prevAcademicAvailabilityErrorRef: academicAvailabilityErrorResp,
    });
    useEffect(() => {
        const { prevAddadmissionAvailabilityResp, prevEditAdmissionAvailabilityRef, prevAcademicAvailabilityErrorRef } = admissionAvailabilityRef.current;
        if (addadmissionAvailabilityResp && prevAddadmissionAvailabilityResp !== addadmissionAvailabilityResp) {
            toast.success('Added Admission Availability Successfully.')
            closeChangesStudentModal();
            getAdmissionAvailabilityList()
        }
        if (editadmissionAvailabilityResp && prevEditAdmissionAvailabilityRef !== editadmissionAvailabilityResp) {
            toast.success('Admission Availability Edited Successfully.')
            closeChangesStudentModal();
            getAdmissionAvailabilityList()
        }
        if (academicAvailabilityErrorResp && prevAcademicAvailabilityErrorRef !== academicAvailabilityErrorResp) {
            const { details } = academicAvailabilityErrorResp;
            toast.error(details)
        }
        admissionAvailabilityRef.current.prevAddadmissionAvailabilityResp = addadmissionAvailabilityResp;
        admissionAvailabilityRef.current.prevEditAdmissionAvailabilityRef = editadmissionAvailabilityResp;
        admissionAvailabilityRef.current.prevAcademicAvailabilityErrorRef = academicAvailabilityErrorResp;

    }, [addadmissionAvailabilityResp, editadmissionAvailabilityResp, academicAvailabilityErrorResp])

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: admissionAvailabilityFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAdmissionAvailabilityFilterState((prev) => ({ ...prev, [name]: value }))
        pagination.current.pageNo = 0
        getAdmissionAvailabilityList({[name]: value})
        if(name === "academicYearId") {
            getCurriculumApiCall({academicYearId:value});
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        getAdmissionAvailabilityList(paginationInfo);
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const {  pageable, totalElements, totalPages } = admissionAvailabilityListResp || {}

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Student Concessions" pageTitle="Admissions" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow">

                        {/* Card Header */}
                        <div className="tw-border-b tw-px-6 tw-py-3">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <h4 className="card-title !tw-mb-0 tw-flex-grow tw-justify-center">
                                    Admission Availability
                                </h4>

                                <Button
                                variant="primary"
                                    onClick={() => openChangesStudentModal()}
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
                                        value={admissionAvailabilityFilterState.academicYearId}
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
                                        value={admissionAvailabilityFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>

                            </div>
                        </div>

                        <TableContainer
                            columns={roleColumns || []}
                            data={admissionAvailabilityListResp?.content || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages}
                            totalRecords={totalElements}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageable?.pageNumber}
                        />
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="admission-availability"
                isOpen={changesStudentModalState.showModal}
                toggle={closeChangesStudentModal}
                modalTitle="Admission Availability"
                modalSize="lg"
            >
                <AdmissionAvailabilityModal
                    isOpen={changesStudentModalState.showModal}
                    toggle={closeChangesStudentModal}
                    modalTitle="Admission Availability"
                    modalId={changesStudentModalState.modalData} />
            </ModalContainerUpdated>

        </>
    );
};

export default AdmissionAvailability;