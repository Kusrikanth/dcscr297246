import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
//Common Component
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { TextIconInput, SelectInput, ModalComponent, ConfirmationModal, ModalContainerUpdated, SearchInput, } from "../../../Components/Common";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Helper
import { generateColumns, searchInputOptions, sendNotificationDisabled, statusFilter } from "./helper";
import classnames from "classnames";

//Images & icons

import Statistics from "./Statistics";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    exportParentListAct,
    getAllParentsListAct, getParentsStatsAct, sendCredentialsParentAct
} from "../../../store/directory/studentmanagement/studentmanagementactions";
import { useLocation } from "react-router-dom";
import {
    getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import {
    getOccupationAct,
} from "../../../store/masterdata/masterdataactions";
import { getSortingKeys } from "../../../utility/commonutility";

//Modal Component
import GetParentStudentModal from "./GetParentStudentModal";
import ViewparentModal from "./ViewParentModal";

//Interface & Types
import { IPaginationState } from "../../../Components/Common/Pagination";

import ExportModal from "../StudentManagement/ExportModal";
import { UncontrolledTooltip } from "reactstrap";
//Icon
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { downloadExcelFile, } from "../../../utility/commonutility";
import { EyeIcon } from "@hugeicons-pro/core-stroke-standard"
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../Components/Common/Button";

const initialFilterState = {
    branchId: undefined,
    academicYearId: undefined,
    status: undefined,
    isEmployee: undefined,
};

const ParentManagement: React.FC<any> = () => {
    const history = useHistory();
    const [showClearFilterState, setShowClearFilterState] = useState(false);
    const [studentModalState, setStudentModalState] = useState({
        showModal: false,
        parentId: ""
    });
    const [parentModalState, setParentModalState] = useState({
        showModal: false,
        parentId: ""
    });
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    const [allParentList, setAllParentList] = useState([]);
    const [exportExcel, setExportExcel] = useState<any>({
        showModal: false,
    })
    const [sendNotification, setSendNotification] = useState<any>({
        showModal: false,
        id: undefined
    })

    const [exportModal, setExportModal] = useState({
        showModal: false,
    });
    const [searchStudentState, setSearchStudentState] = useState("global");


    const paginationDetailRef = useRef<IPaginationState>({
        pageNo: 0,
        pageSize: 10,
    });
    const sortingDetailRef = useRef<any>(undefined);
    const { pathname } = useLocation();
    const pageTitleName = useMemo(() => {
        if (pathname.includes("parent-management")) {
            return "Directory";
        }
        return "Front Desk";
    }, [pathname]);
    const dispatch = useAppDispatch();
    const { allParentsListResp,
        parentsStatsResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        loggedInUserRole, virtualRoleResp, branchListResp,
        academicYearListResp, showApiLoader, sendCredentialsParentResp,
        studentManagementErrorResp, exportParentListResp } =
        useAppSelector(({ appData, branch, masterData, instAcademics, directoryStudent, globalData }) => ({
            studentsStatsResp: directoryStudent.studentsStatsResp,
            occupationResp: masterData.occupationResp,
            allParentsListResp: directoryStudent.allParentsListResp,
            parentsStatsResp: directoryStudent.parentsStatsResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            loggedInUserRole: appData.loggedInUserRole,
            virtualRoleResp: appData.virtualRoleResp,
            academicYearListResp: instAcademics.academicYearListResp,
            studentManagementErrorResp: directoryStudent.studentManagementErrorResp,
            exportParentListResp: directoryStudent.exportParentListResp,
            sendCredentialsParentResp: directoryStudent.sendCredentialsParentResp,
            showApiLoader: globalData.showApiLoader,
            branchListResp: branch.branchListResp,
            masterDataErrorResp: masterData.masterDataErrorResp
        }), shallowEqual);

    const canCreateAndUpdate = useMemo(() => {
        if (loggedInUserRole === 'INSTITUTE_ADMIN') {
            return !!virtualRoleResp;
        }
        return (loggedInUserRole !== 'LIBRARY');
    }, [loggedInUserRole]);

    const canExport = useMemo(() => {
        return (loggedInUserRole !== 'LIBRARY' && loggedInUserRole !== 'EY_PA');
    }, [loggedInUserRole]);

    const [filterState, setFilterState] = useState({ ...initialFilterState, branchId: branchId ? branchId?.toString() : '' });
    const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;
    const studentRespRef = useRef<any>({
        prevAcademicYearListResp: academicYearListResp,
        prevExportParentListResp: exportParentListResp,
        prevAllParentsListResp: allParentsListResp,
        prevSendCredentialsParentResp: sendCredentialsParentResp,
        prevStudentManagementErrorResp: studentManagementErrorResp
    });
    useEffect(() => {
        const { prevAcademicYearListResp, prevStudentManagementErrorResp, prevExportParentListResp, prevAllParentsListResp, prevSendCredentialsParentResp } = studentRespRef.current;
        if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            if (Array.isArray(academicYearListResp?.data)) {
                const { academicYearId }: any = academicYearListResp?.data.find((item: any) => item.yearStatus === "CURRENT") || {};
                if (academicYearId) {

                    setFilterState((prevState: any) => ({ ...prevState, academicYearId }))
                    getParentsApiCall({ academicYearId });
                    if (!showInstituteAdminUI) {
                        const parentStatsPayload = { branchId: filterState.branchId, academicYearId };
                        dispatch(getParentsStatsAct(generateActionPayload("get_parents_stats", undefined, parentStatsPayload)));
                    }
                }
            }
        }
        else if (studentManagementErrorResp && prevStudentManagementErrorResp !== studentManagementErrorResp) {
            const { details } = studentManagementErrorResp;
            toast.error(details);
        }
        else if (exportParentListResp && prevExportParentListResp !== exportParentListResp) {
            toast.success("Parent List Exported successfully");
            toggleExportModalHandler();
            downloadExcelFile(exportParentListResp, "parent_list")
        }
        if (allParentsListResp && prevAllParentsListResp !== allParentsListResp) {
            setAllStudentSelectedState(false)
            setAllParentList(allParentsListResp?.data?.map((item: any) => ({ ...item, isSelected: false })))
        }
        if (sendCredentialsParentResp && prevSendCredentialsParentResp !== sendCredentialsParentResp) {
            toast.success("Credentials has been sent successfully");
            toggleNotificationModal()
            getParentsApiCall();
        }

        studentRespRef.current.prevAcademicYearListResp = academicYearListResp;
        studentRespRef.current.prevExportParentListResp = exportParentListResp;
        studentRespRef.current.prevAllParentsListResp = allParentsListResp;
        studentRespRef.current.prevSendCredentialsParentResp = sendCredentialsParentResp;
        studentRespRef.current.prevStudentManagementErrorResp = studentManagementErrorResp;
    }, [loggedInUserRole, academicYearListResp, studentManagementErrorResp, exportParentListResp, allParentsListResp, sendCredentialsParentResp]);


    useEffect(() => {
        return () => {
            dispatch({ type: "RESET_STUDENTMANGEMENT_STORE" });
        }
    }, [dispatch]);

    useEffect(() => {
        if (instituteId) {
            const payload = { instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc", };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
        }
    }, [instituteId]);

    useEffect(() => {
        const payload = { categoryName: "occupation", pageNo: 0, pageSize: 400 };
        dispatch(getOccupationAct(generateActionPayload("get_inst_global_records", undefined, payload)));
        // getParentsApiCall();
    }, []);

    function onSearchHandler(name: string, value: any) {
        paginationDetailRef.current.pageNo = 0;
        setSearchStudentState((prev) => {
            const updatedFilterType = prev;
            setFilterState((prevState) => {
                const updatedState = {
                    ...prevState,
                    searchString: value,
                    nameFilterType: updatedFilterType
                };
                getParentsApiCall(updatedState);
                return updatedState;
            });
            return updatedFilterType;
        });
    }

    function onChangeHandler(name: string, id: any, item: any) {
        setSearchStudentState(id);
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState) => {
            const updatedState = {
                ...prevState,
                nameFilterType: id,
                searchString: ""
            };
            getParentsApiCall(updatedState);
            return updatedState;
        });
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        paginationDetailRef.current.pageNo = 0;
        const updateFilterState = { ...filterState, [name]: value };
        setFilterState((prevState: any) => ({ ...prevState, ...updateFilterState }));
        getParentsApiCall({ [name]: value });
        showFilterHandler(updateFilterState);
        if (name === "academicYearId" && value && !showInstituteAdminUI) {
            const parentStatsPayload = { branchId: filterState.branchId, academicYearId: value };
            dispatch(getParentsStatsAct(generateActionPayload("get_parents_stats", undefined, parentStatsPayload)));
        }
    }

    function showFilterHandler(updateFilterInfo: any) {
        const { academicYearId, ...otherFilterInfo } = updateFilterInfo;
        const anyFilterApplied = Object.values(otherFilterInfo).some((item: any) => item);
        if (anyFilterApplied) {
            setShowClearFilterState(true);
        } else {
            setShowClearFilterState(false);
        }
    }

    function viewParentHandler(event: any) {
        const parentId = event.currentTarget.getAttribute("data-id");
        if (parentId) {
            setParentModalState((prevState: any) => ({ ...prevState, showModal: true, parentId }));
        }
    }

    const menuOptions = useMemo((): any[] => {
        return ([{
            id: "view",
            actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
            actionName: "View Parent Info",
            onClickHndlr: viewParentHandler,
        }])
    }, [allParentsListResp]);

    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getParentsApiCall();
    }

    function viewParentChildHandler(event: any) {
        const parentId = event.currentTarget.getAttribute("data-id");
        if (parentId) {
            setStudentModalState((prevState: any) => ({ ...prevState, showModal: true, parentId }));
        }
    }

    function toggleModalHndlr() {
        setStudentModalState((prevState: any) => ({ ...prevState, showModal: false }));
    }
    function toggleParentModalHndlr() {
        setParentModalState((prevState: any) => ({ ...prevState, showModal: false }));
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
            sortingDetailRef.current = sortingKeys;
            getParentsApiCall();
            //Testing
        } else {
            sortingDetailRef.current = sortingKeys;
        }
    }

    function getParentsApiCall(otherProps?: any) {
        const sortingParams = getSortingKeys(sortingDetailRef.current);
        const params = {
            instituteId,
            ...filterState,
            ...otherProps, ...paginationDetailRef.current, ...sortingParams
        };
        dispatch(getAllParentsListAct(generateActionPayload("get_all_parents", undefined, params)));
    }


    function clearFilterHndlr() {
        const updatedFilterState = {
            ...filterState,
            branchId: showInstituteAdminUI ? '' : filterState.branchId,
            searchString: undefined,
            status: undefined, isEmployee: undefined
        };
        setFilterState(updatedFilterState);
        //Resest page number to 0 if filters are applied
        paginationDetailRef.current.pageNo = 0;
        getParentsApiCall(updatedFilterState);
        setShowClearFilterState(false);
    }
    const toggleExportExcelModal = () => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
        }));
    };

    const toggleNotificationModal = (id?: any) => {
        setSendNotification((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            id: id || "",
        }));
    };


    const exportModalHndler = () => {
        dispatch(exportParentListAct(generateActionPayload("export_all_parents", undefined, { ...filterState, branchId: filterState.branchId, instituteId }, {
            responseType: 'blob'
        })));
    }

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...allParentList];
        updateStudentState.forEach((item: any) => {
            item.isSelected = checked;
        });
        setAllParentList(updateStudentState);
    }, [allParentList]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            id = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = allParentList.findIndex((item: any) => +item.id === Number(id));
        if (studentRowIndex > -1) {
            const studentDetails: any = allParentList[studentRowIndex];
            let updateStudentState: any = [...allParentList];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails, isSelected: checked,
            });
            setAllParentList(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [allParentList]);

    const sendNotificationHndler = () => {
        let newArray: any = [];
        allParentList?.map((item: any) => {
            if (item?.isSelected) {
                newArray = [...newArray, item?.id]
            }
        })
        dispatch(sendCredentialsParentAct(generateActionPayload("send_credentials_parent", undefined, { parentIds: newArray })));
    }

    const toggleExportModalHandler = () => {
        setExportModal((prev: any) => ({ ...prev, showModal: !prev.showModal }))
    }

    function submitHndlr(password: any) {
        dispatch(exportParentListAct(generateActionPayload("export_all_parents", undefined, { ...filterState, branchId, instituteId }, {
            responseType: 'blob'
        })));
    }

    const submitButtonError = useMemo(() => sendNotificationDisabled(allParentList), [allParentList]);

    const studentColumns = useMemo(() => {
        const columns = generateColumns(menuOptions,
            viewParentChildHandler, allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState)
        if (showInstituteAdminUI) {
            return columns.filter((item: any) => item.accessor !== 'isStudentChecked')
        } else if (!canCreateAndUpdate) {
            return columns.filter((item: any) => item?.accessor !== "isStudentChecked" && item?.accessor !== "branchName")
        }
        return columns.filter(item => item.accessor !== 'branchName')
    }, [allParentList, showInstituteAdminUI, canCreateAndUpdate]);

    const { pageNumber, totalPages, totalElements } = allParentsListResp || {};
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Parent Management" pageTitle={pageTitleName} />
                    {(!showInstituteAdminUI) && <Statistics statsInfo={parentsStatsResp} />}

                    <div className="tw-mt-4">
                        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-3" id="tasksList">

                            {/* Header */}
                            <div className="tw-px-4 tw-py-2 tw-border-b">
                                <div className="tw-flex tw-items-center tw-justify-between">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        Parent Directories
                                    </h4>

                                    <div className="tw-flex tw-items-center tw-gap-2">
                                        {!submitButtonError && (
                                            <Button
                                                variant="secondary"
                                                onClick={toggleNotificationModal}
                                                disabled={showApiLoader}
                                            >
                                                Password Reset
                                            </Button>
                                        )}


                                        {canExport && <Button
                                            onClick={toggleExportModalHandler}
                                            variant="info"
                                        >
                                            <i className="ri-add-line"></i>
                                            <span>Export</span>
                                        </Button>}
                                    </div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="tw-px-4 tw-py-3">
                                <div className="tw-grid tw-grid-cols-1 xl:tw-grid-cols-12 tw-gap-3">

                                    <div className="xl:tw-col-span-5">
                                        <SearchInput
                                            hideDefaultSelect
                                            name="searchString"
                                            value={searchStudentState}
                                            menuItems={searchInputOptions}
                                            idKey="id"
                                            labelName="Search With"
                                            searchHandler={onSearchHandler}
                                            onChange={onChangeHandler}
                                            renderSelectedValue={(item) => item?.name}
                                            renderOptions={(item) => item?.name}
                                        />
                                    </div>

                                    <div className="xl:tw-col-span-2">
                                        <SelectInput
                                            name="academicYearId"
                                            value={filterState.academicYearId}
                                            onChange={onChangeFilterHndlr}
                                            menuItems={academicYearListResp?.data}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            labelText="Academic Year"
                                            floatingLabel
                                        />
                                    </div>

                                    {showInstituteAdminUI && (
                                        <div className="xl:tw-col-span-2">
                                            <SelectInput
                                                name="branchId"
                                                value={filterState.branchId}
                                                onChange={onChangeFilterHndlr}
                                                menuItems={branchListResp?.data}
                                                valueKey="branchId"
                                                textKey="branchName"
                                                labelText="Branch"
                                                floatingLabel
                                            />
                                        </div>
                                    )}

                                    <div className="xl:tw-col-span-2">
                                        <SelectInput
                                            name="status"
                                            value={filterState.status}
                                            onChange={onChangeFilterHndlr}
                                            menuItems={statusFilter}
                                            valueKey="id"
                                            textKey="name"
                                            labelText="Status"
                                            floatingLabel
                                        />
                                    </div>

                                    <div className="xl:tw-col-span-2">
                                        <SelectInput
                                            name="isEmployee"
                                            value={filterState.isEmployee}
                                            onChange={onChangeFilterHndlr}
                                            menuItems={[
                                                { id: true, name: "Yes" },
                                                { id: false, name: "No" },
                                            ]}
                                            valueKey="id"
                                            textKey="name"
                                            labelText="Is Employee"
                                            floatingLabel
                                        />
                                    </div>

                                    {showClearFilterState && (
                                        <div className="tw-flex tw-items-center tw-col-span-auto tw-justify-end">
                                            <Button
                                                type="button"
                                                variant="wrong"
                                                onClick={clearFilterHndlr}
                                            >
                                                Clear filter
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="tw-border-t">
                                <TableContainer
                                    columns={studentColumns}
                                    data={Array.isArray(allParentList) ? allParentList : []}
                                    divClass="table-responsive tw-mb-3"
                                    theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                                    showPagination={true}
                                    totalPages={totalPages}
                                    totalRecords={totalElements}
                                    callbackPaginationHndlr={paginationHndlr}
                                    currentPageNumber={pageNumber}
                                    manualSorting={true}
                                    sortingHandler={sortingHandler}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <ModalComponent
                isOpen={studentModalState.showModal}
                modalTitle="Students"
                toggle={toggleModalHndlr}
                hideFooter={true}
                id="parent-students-modal"
                modalBodyClass="tw-p-0"
            >
                <GetParentStudentModal
                    branchId={branchId}
                    instituteId={instituteId}
                    parentId={studentModalState.parentId}
                    academicYearId={filterState.academicYearId}
                    closeModalHndlr={toggleModalHndlr}
                    dispatch={dispatch}
                />
            </ModalComponent>
            <ModalComponent
                isOpen={parentModalState.showModal}
                modalTitle="Parent Details"
                toggle={toggleParentModalHndlr}
                hideFooter={true}
                id="parent-details-modal"
                modalBodyClass="tw-p-2"
            >
                <ViewparentModal
                    parentId={parentModalState.parentId}
                    closeModalHndlr={toggleParentModalHndlr}
                />
            </ModalComponent>
            <ConfirmationModal
                id="manage-vehicles-export-modal"
                isOpen={exportExcel.showModal}
                confirmMessage="You want to Export the list ?"
                cancelHndlr={() => toggleExportExcelModal()}
                confirmHndlr={exportModalHndler}
                isDisble={showApiLoader}
                iconType='approve'
                btnClassName='btn w-sm btn-success'
            />
            <ConfirmationModal
                id="send-credentials-parent-modal-"
                isOpen={sendNotification.showModal}
                confirmMessage="Are you sure you want to reset password ?"
                cancelHndlr={() => toggleNotificationModal()}
                confirmHndlr={sendNotificationHndler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType='approve'
                btnClassName='btn w-sm btn-success'
            />

            <ModalContainerUpdated
                id="employee-export-modal"
                isOpen={exportModal.showModal}
                toggle={toggleExportModalHandler}
                modalTitle="Export Parents Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportModal.showModal}
                    toggle={toggleExportModalHandler}
                    instituteId={instituteId}
                    branchId={filterState.branchId}
                    submitHndlr={submitHndlr}
                    feature="directory"
                    subFeature={!showInstituteAdminUI ? "parent_management" : ""}
                    remarksText="Enter remarks to export parents data?"
                />
            </ModalContainerUpdated>
        </React.Fragment>
    )
}

export default ParentManagement;