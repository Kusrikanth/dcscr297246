import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
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
import PanelMemberModal from "./PanelMemberModal";
import { exportPanelMemberListAct, panelMembersListAct } from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    search: "",
    academicYearId: "",
    curriculumId: "",
    type: "",
};

const PanelMember = () => {

    const dispatch = useAppDispatch();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })
    const sortingRef = useRef({
        orderBy: "asc",
        sortBy: "classNames"
    })
    const [panelMemberModalState, setPanelMemberModalState] = useState({
        showModal: false,
        applicationId: undefined
    })

    const togglePanelMemberModal = (apiCall?: any) => {
        setPanelMemberModalState((prev: any) => ({ ...prev, showModal: !prev.showModal, applicationId: null }))

        if (typeof (apiCall) && apiCall) {
            getPanelMembers()
        }
    }

    const [studentConcessionFilterState, setStudentConcessionFilterState] = useState(initialValues);

    const {
        academicYearListResp,
        brchCurriculumResp,
        panelMembersListResp,
        addPanelMemberResp,
        editPanelMemberResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        academicAvailabilityErrorResp,
        exportPanelMemberListResp,
        showApiLoader,
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, admissionAvailabilityRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            panelMembersListResp: admissionAvailabilityRequest.panelMembersListResp,
            addPanelMemberResp: admissionAvailabilityRequest.addPanelMemberResp,
            editPanelMemberResp: admissionAvailabilityRequest.editPanelMemberResp,
            exportPanelMemberListResp: admissionAvailabilityRequest.exportPanelMemberListResp,
            academicAvailabilityErrorResp: admissionAvailabilityRequest.academicAvailabilityErrorResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    const PanelMemberListPagination = (paramsProps?: any, otherProps?: any) => {
        const { academicYearId, curriculumId, type } = studentConcessionFilterState;
        const params = { ...paramsProps, ...pagination.current }
        let payload = {
            branchId,
            instituteId: instituteId,
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            ...otherProps,
            ...params
        };
        dispatch(panelMembersListAct(generateActionPayload('panel_members_list', undefined, payload)))
    }

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    setPanelMemberModalState((prev: any) => ({ ...prev, showModal: true, applicationId: id }))

                    // moveToNewStudentConcessionHandler(id);
                },
            },
        ],
        []
    );

    const getPanelMembers = (otherProps?: any) => {

        const params = { branchId: branchId, instituteId: instituteId, academicYearId: studentConcessionFilterState.academicYearId, curriculumId: studentConcessionFilterState.curriculumId, ...pagination.current, ...sortingRef.current, ...otherProps }
        if (params.academicYearId) {

            dispatch(panelMembersListAct(generateActionPayload('panel_members_list', undefined, params)))
        }
    }
    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        if (academicYearListResp) {
            let yearId = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault)?.academicYearId
            getPanelMembers({ academicYearId: yearId });
            getCurriculumApiCall({ academicYearId: yearId });
            setStudentConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        }

    }, [academicYearListResp]);

    const PanelMemberRef = useRef({
        prevAddPanelMemberResp: addPanelMemberResp,
        prevEditPanelMemberResp: editPanelMemberResp,
        prevExportPanelMemberListResp: exportPanelMemberListResp,
        prevAcademicAvailabilityErrorRef: academicAvailabilityErrorResp,
    })
    useEffect(() => {
        const { prevAddPanelMemberResp, prevEditPanelMemberResp, prevAcademicAvailabilityErrorRef, prevExportPanelMemberListResp } = PanelMemberRef.current;
        if (addPanelMemberResp && prevAddPanelMemberResp !== addPanelMemberResp) {
            toast.success('Panel Member added Successfully.')
            togglePanelMemberModal(true);
        }
        if (editPanelMemberResp && prevEditPanelMemberResp !== editPanelMemberResp) {
            toast.success('Panel Member Edited Successfully')
            togglePanelMemberModal(true);
        }
        if (exportPanelMemberListResp && prevExportPanelMemberListResp !== exportPanelMemberListResp) {
            toast.success('Panel Member Data Downloaded Successfully.')
            downloadExcelFile(exportPanelMemberListResp, "Panel_Member_Details")
            toggleExportExcelModal()
        }
        if (academicAvailabilityErrorResp && prevAcademicAvailabilityErrorRef !== academicAvailabilityErrorResp) {
            const { details } = academicAvailabilityErrorResp;
            toast.error(details)
        }
        PanelMemberRef.current.prevAddPanelMemberResp = addPanelMemberResp;
        PanelMemberRef.current.prevEditPanelMemberResp = editPanelMemberResp;
        PanelMemberRef.current.prevExportPanelMemberListResp = exportPanelMemberListResp;
        PanelMemberRef.current.prevAcademicAvailabilityErrorRef = academicAvailabilityErrorResp;

    }, [addPanelMemberResp, editPanelMemberResp, academicAvailabilityErrorResp, exportPanelMemberListResp])

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: studentConcessionFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0
        if (name === 'academicYearId') {
            setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "" }))
            getCurriculumApiCall({ [name]: value })
            getPanelMembers({ [name]: value, curriculumId: "" })
        } else {
            getPanelMembers({ [name]: value })
            setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        PanelMemberListPagination(paginationInfo)
    }

    const [exportExcel, setExportExcel] = useState({
        showModal: false,
        scrutinyId: undefined
    })

    const toggleExportExcelModal = (id?: any) => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            scrutinyId: id || "",
        }));
    };

    const exportExcelHndler = () => {

        dispatch(exportPanelMemberListAct(generateActionPayload("export_panel_members_list", undefined, { ...studentConcessionFilterState, branchId, instituteId }, {
            responseType: 'blob'
        })));
    }
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: panelMembers, totalPages, totalElements: totalRecords, pageble } = panelMembersListResp || {};



    const roleColumns = useMemo(() => generateColumns(menuOptions), []);
    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Student Concessions" pageTitle="Admissions" />

                    <div className="tw-bg-white tw-shadow tw-rounded-lg tw-overflow-hidden">
                        {/* Card Header */}
                        <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3 tw-border-b tw-border-gray-200">
                            <h4 className="tw-text-lg tw-font-semibold tw-m-0">
                                Panel Member Detail List
                            </h4>
                            <Button
                                variant="primary"
                                onClick={() => togglePanelMemberModal()}
                            >
                                <i className="ri-add-line" />
                                Add New
                            </Button>
                        </div>

                        {/* Card Body / Filters */}
                        <div className="tw-p-4">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-end">
                                {/* Search */}
                                <div className="tw-col-span-12 sm:tw-col-span-4 lg:tw-col-span-3 xl:tw-col-span-3">
                                    <div className="tw-relative search-box">
                                        <TextInput
                                            name="search"
                                            value={studentConcessionFilterState.search}
                                            onChange={filterHandler}
                                            inputClassName="tw-bg-gray-100"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search..."
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line tw-absolute tw-left-2 tw-top-1/2 tw-translate-y-[-50%] tw-text-gray-400"></i>
                                    </div>
                                </div>

                                {/* Academic Year */}
                                <div className="tw-col-span-12 sm:tw-col-span-4 lg:tw-col-span-3 xl:tw-col-span-2">
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
                                <div className="tw-col-span-12 sm:tw-col-span-4 lg:tw-col-span-3 xl:tw-col-span-2">
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

                                <div className="tw-col-span-5 tw-ml-auto">
                                    <Button
                                        variant="info"
                                        onClick={toggleExportExcelModal}
                                    >
                                        <i className="ri-add-line tw-mr-2" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="tw-overflow-x-auto tw-px-4 tw-pb-4">
                            <TableContainer
                                columns={roleColumns || []}
                                data={panelMembers || []}
                                divClass="tw-min-w-full"
                                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                                showPagination={true}
                                totalPages={totalPages}
                                totalRecords={totalRecords}
                                callbackPaginationHndlr={paginationHndlr}
                                currentPageNumber={pageble?.pageNumber}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="avc"
                isOpen={panelMemberModalState.showModal}
                toggle={togglePanelMemberModal}
                modalTitle={panelMemberModalState.applicationId ? "Edit Panel Members" : "Assign Panel Members"}
                modalSize="lg"
            >
                <PanelMemberModal toggle={togglePanelMemberModal} id={panelMemberModalState.applicationId} />

            </ModalContainerUpdated>

            <ConfirmationModal
                id="panel-members-export"
                isOpen={exportExcel.showModal}
                confirmMessage="Are you sure you want Download excel file ?"
                cancelHndlr={toggleExportExcelModal}
                confirmHndlr={exportExcelHndler}
                isDisble={showApiLoader}
                btnClassName='btn w-sm btn-success'
            />

        </>
    );
};

export default PanelMember;
