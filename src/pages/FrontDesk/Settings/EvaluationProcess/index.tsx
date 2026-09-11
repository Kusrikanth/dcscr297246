import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
    generateColumns
} from "./helper";
import { useHistory } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import EvaluationProcessModal from "./EvaluationProcessModal";
import { getEvaluationProcessList } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { toast } from "react-toastify";

import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    search: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    type: "",
};

const EvaluationProcess = () => {
    const dispatch = useAppDispatch();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const [changesEvaluationProcessState, setChangesEvaluationProcessState] = useState({
        showModal: false,
        applicationId: undefined
    })

    const toggleChangeEvaluationProcessModal = (id?: any) => {
        setChangesEvaluationProcessState((prev: any) => ({ ...prev, showModal: !prev.showModal, applicationId: null }))
    };

    const EvaluationProcessList = (otherProps?: any) => {
        const { academicYearId, curriculumId } = studentConcessionFilterState;
        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            classId: "",
            sortBy: "",
            orderBy: "",
            branchId,
            ...pagination.current,
            ...otherProps
        };
        if (payload.academicYearId) {
            dispatch(getEvaluationProcessList(generateActionPayload('evaluation_process_list', undefined, payload)))
        }
    }

    const [studentConcessionFilterState, setStudentConcessionFilterState] = useState(initialValues);

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getEvaluationProcessListResp,
        addEvaluationProcessResp,
        editEvaluationProcessByIdResp,
        academicAvailabilityErrorResp
    } = useAppSelector(
        ({ admissionAvailabilityRequest, instAcademics, branchAcademics, appData }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getEvaluationProcessListResp: admissionAvailabilityRequest.getEvaluationProcessListResp,
            addEvaluationProcessResp: admissionAvailabilityRequest.addEvaluationProcessResp,
            editEvaluationProcessByIdResp: admissionAvailabilityRequest.editEvaluationProcessByIdResp,
            academicAvailabilityErrorResp: admissionAvailabilityRequest.academicAvailabilityErrorResp,
        }),
        shallowEqual
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon}
                    className="me-2 text-muted" size={18} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    setChangesEvaluationProcessState((prev: any) => ({ ...prev, showModal: !prev.showModal, applicationId: id }))
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

    const EvaluationProcessRef = useRef({
        prevAddEvaluationProcess: addEvaluationProcessResp,
        prevEditEvaluationProcessRef: editEvaluationProcessByIdResp,
        prevAcademicAvailabilityErrorRef: academicAvailabilityErrorResp,
    })
    useEffect(() => {
        const { prevAddEvaluationProcess, prevEditEvaluationProcessRef, prevAcademicAvailabilityErrorRef } = EvaluationProcessRef.current;
        if (addEvaluationProcessResp && prevAddEvaluationProcess !== addEvaluationProcessResp) {
            toast.success('Evaluation Process Assign Successfully')
            toggleChangeEvaluationProcessModal(true);
            EvaluationProcessList()
        }
        if (editEvaluationProcessByIdResp && prevEditEvaluationProcessRef !== editEvaluationProcessByIdResp) {
            toast.success('Evaluation Process Edit Successfully')
            toggleChangeEvaluationProcessModal(true);
            EvaluationProcessList()
        }
        if (academicAvailabilityErrorResp && prevAcademicAvailabilityErrorRef !== academicAvailabilityErrorResp) {
            const { details } = academicAvailabilityErrorResp;
            toast.error(details)
        }
        EvaluationProcessRef.current.prevAddEvaluationProcess = addEvaluationProcessResp;
        EvaluationProcessRef.current.prevEditEvaluationProcessRef = editEvaluationProcessByIdResp;
        EvaluationProcessRef.current.prevAcademicAvailabilityErrorRef = academicAvailabilityErrorResp;

    }, [addEvaluationProcessResp, editEvaluationProcessByIdResp, academicAvailabilityErrorResp])

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
        setStudentConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        getCurriculumApiCall({ academicYearId: yearId })
        EvaluationProcessList({ academicYearId: yearId })
    }, [academicYearListResp]);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: studentConcessionFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        if (payload1.academicYearId) {
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        }
    }

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0
        if (name === 'academicYearId') {
            getCurriculumApiCall({ academicYearId: value })
            setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "" }))
            EvaluationProcessList({ [name]: value, curriculumId: "" })
        } else {
            setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value }))
            EvaluationProcessList({ [name]: value })
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        EvaluationProcessList(paginationInfo)
        // getSectionListResp(paginationInfo);
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { content: EvaluationProcessData, pageble, totalPages, totalElements } = getEvaluationProcessListResp || {};
    // const { data: SectionList,totalPages,totalElements,pageNumber } = sectionListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    // const { ledgers: LedgerList } = ledgerDetails || {};


    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Student Concessions" pageTitle="Admissions" />

                    <div className="tw-bg-white tw-shadow tw-rounded">
                        {/* Card Header */}
                        <div className="tw-flex tw-justify-between tw-items-center tw-px-4 tw-py-3 tw-border-b">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">Evaluation Process</h4>
                            <Button
                                variant='primary'
                                onClick={() => toggleChangeEvaluationProcessModal()}
                            >
                                <i className="ri-add-line" />
                                Add New
                            </Button>
                        </div>

                        {/* Card Body */}
                        <div className="tw-p-4">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                {/* Academic Year */}
                                <div className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={studentConcessionFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                                {/* Curriculum */}
                                <div className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={studentConcessionFilterState.curriculumId}
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

                        {/* Table */}
                        <div className="tw-overflow-x-auto  tw-pb-4">
                            <TableContainer
                                columns={roleColumns || []}
                                data={EvaluationProcessData || []}
                                divClass="tw-w-full"
                                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-font-medium tw-align-middle"
                                showPagination={true}
                                totalPages={totalPages || 0}
                                totalRecords={totalElements || 0}
                                callbackPaginationHndlr={paginationHndlr}
                                currentPageNumber={pageble?.pageNumber}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="avc"
                isOpen={changesEvaluationProcessState.showModal}
                toggle={toggleChangeEvaluationProcessModal}
                modalTitle="Evaluation Process"

                modalSize="lg"
            >
                <EvaluationProcessModal modalId={changesEvaluationProcessState.applicationId} toggle={toggleChangeEvaluationProcessModal} />
            </ModalContainerUpdated>

        </>
    );
};

export default EvaluationProcess;
