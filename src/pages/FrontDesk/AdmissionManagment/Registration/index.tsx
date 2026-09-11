import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { Button, ConfirmationModal, DateInput, ModalContainerUpdated, OffCanvasContainer, SearchInput, SelectInput, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { AdmissionTypeMenuOptions, mainApplicationStatus, completionStatusData, generateColumns, hasStateChanged, isShowSendNotificationButton, searchInputOptions } from './helper';
import { useHistory } from 'react-router-dom';
// import ApplicationSaleModal from './ApplicationSaleModal';
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    getInstAcademicYearAct,
} from "../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getBranchCurriculumAct, getBranchClassAct,
    setBrchClassAct,
    resetBrchClassAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    studentRegistrationsAct, cancelAdmissionAct, rgistrationLinkActivateAct,
    sendRegistrationInCompleteFormAct
} from "../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import CancelAdmission from "./CancelAdmission";
import ConsolidatedView from "./ConsolidatedView";
import PrintApplication from "./PrintApplication";
import { debounce, downloadExcelFile, sanitizeUrlParams, searhWithTextInList } from "../../../../utility/commonutility";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { exportRegistrationDataAct, getApplicationRemarksById, getStatasticResp } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { setRegistrationTabIdAct } from "../../../../store/global/globalslice";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { useModal } from "../../../../hooks/modalhook";
import { exportStudentRegistrationDataAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle01Icon, PencilEdit02Icon, PrinterIcon, SentIcon } from "@hugeicons-pro/core-stroke-standard";
import ReviewRemarksModal from "../ApplicationSale/ReviewRemarksModal";
import { MessagePreview01Icon } from "@hugeicons-pro/core-solid-standard";

const initialFilterState = {
    academicYearId: "",
    curriculumId: "",
    // classId: "",
    startDate: "",
    recentFollowupRemarksStartDate: null,
    recentFollowupRemarksEndDate: null,
    nextFollowupRemarksStartDate: null,
    nextFollowupRemarksEndDate: null,
    enrollmentNumber: "",
    searchString: "",
    completionStatus: null,
    mainApplicationStatus: null,
    admissionType: null,
    classId: null,
    currentStatus: null,
    admissionSource: null,
}

const Registration = ({ tabId }: any) => {
    const [allStudentsSelectedState,setAllStudentsSelectedState] = useState(false);
    const [registrationsState, setRegistrationsState] = useState<any[]>([])
    const {
        openModal:sendInCompleteStdntNotifOpenModal,
        closeModal:sendInCompleteStdntNotifCloseModal,
        modalState:sendInCompleteStdntNotifModalState,
    } = useModal()
    const { closeModal: closeExportConfirmationModal, modalState: exportConfirmationModalState, openModal: openExportConfirmationModal } = useModal()
     const [cancelModalState, setCancelModalState] = useState({
        showModal: false,
        studentRegNo: ""
    });
    const [count, setCount] = useState<any>(null);
    const [consolidateModalState, setConsolidatedModalState] = useState({
        showModal: false,
        studentRegNo: ""
    });
    const [printModalState, setPrimarModalState] = useState({
        showModal: false,
        studentRegNo: ""
    });
    const [filterState, setFilterState] = useState(initialFilterState);
    const [open, setOpen] = useState<boolean>(false);
    const [showClearFilterState, setShowClearFilterState] = useState(false);
    const history = useHistory();
    const paginationRef = useRef({
        pageNo: 0,
        pageSize: 10
    })
    const [searchStudentState, setSearchStudentState] = useState("global");
    const { openModal: reviewRemarksOpenModal, closeModal: reviewRemarksCloseModal, modalState: reviewRemarksModalState } = useModal()
    const [selectedReviewRemarksId, setSelectedReviewRemarksId] = useState<any>(null);
     
    const dispatch = useAppDispatch();
    const {
        branchClassResp,
        academicYearListResp, brchCurriculumResp, currentInstIdResp: instituteId,
        currentBranchIdResp: branchId, showApiLoader, loggedInUserRole, virtualRoleResp,
        studentRegistrationResp, admissionRegistrationErrorResp, registrationLinkActivateResp, exportStudentDataRegistrationResp,registrationInCompleteFormResp,
        saveApplicationRemarksByIdResp } =
        useAppSelector(({ appData, branchAcademics, globalData,
            instAcademics, admissionRegistration, directoryStudent, applicationSale }) => ({
                branchClassResp: branchAcademics.branchClassResp,
                brchSectionsResp: branchAcademics.brchSectionsResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                academicYearListResp: instAcademics.academicYearListResp,
                instAcademicErrorResp: instAcademics.instAcademicErrorResp,
                currentInstIdResp: appData.currentInstIdResp,
                showApiLoader: globalData.showApiLoader,
                exportStudentDataRegistrationResp: directoryStudent.exportStudentDataRegistrationResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                loggedInUserRole: appData.loggedInUserRole,
                virtualRoleResp: appData.virtualRoleResp,
                studentRegistrationResp: admissionRegistration.studentRegistrationResp,
                registrationLinkActivateResp: admissionRegistration.registrationLinkActivateResp,
                registrationInCompleteFormResp: admissionRegistration.registrationInCompleteFormResp,
                admissionRegistrationErrorResp: admissionRegistration.admissionRegistrationErrorResp,
                saveApplicationRemarksByIdResp: applicationSale.saveApplicationRemarksByIdResp,
            }), shallowEqual);
            const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;
    
    useEffect(() => {
        if (instituteId) {
            const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
        }
    }, [instituteId]);

    const prevRegisterStudentRef = useRef({
        prevAcademicYearListResp: academicYearListResp,
        prevAdmissionRegistrationErrorResp: admissionRegistrationErrorResp,
        prevRegistrationLinkActivateResp: registrationLinkActivateResp,
        prevExportRegistrationDataResp: exportStudentDataRegistrationResp,
        prevRegistrationInCompleteFormResp : registrationInCompleteFormResp,
        prevSaveApplicationRemarksByIdResp: saveApplicationRemarksByIdResp
    });
    
    useEffect(() => {
        const { prevAcademicYearListResp, prevAdmissionRegistrationErrorResp, prevRegistrationLinkActivateResp, prevExportRegistrationDataResp,prevRegistrationInCompleteFormResp, prevSaveApplicationRemarksByIdResp } = prevRegisterStudentRef.current;
        if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            if (Array.isArray(academicYearListResp?.data)) {
                const { academicYearId } = academicYearListResp.data?.find((year: any) => year.isAdmissionDefault) || {};
                setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
                getCurriculumApiCall({ academicYearId });
                getRegistrationApiCall({ academicYearId });
            }
        }
        else if (registrationLinkActivateResp && registrationLinkActivateResp !== prevRegistrationLinkActivateResp) {
            toast.success("Activation Link has been sent");
        }
        else if (exportStudentDataRegistrationResp && exportStudentDataRegistrationResp !== prevExportRegistrationDataResp) {
            downloadExcelFile(exportStudentDataRegistrationResp,'student_registration_data')
            toast.success(' Excel file Successfully Download .');
            closeExportConfirmationModal();
        }
        else if( registrationInCompleteFormResp && registrationInCompleteFormResp !== prevRegistrationInCompleteFormResp){
            toast.success('Notification sent successfully');
            sendInCompleteStdntNotifCloseModal();
            getRegistrationApiCall()
            setAllStudentsSelectedState(false)
        }
        else if (saveApplicationRemarksByIdResp && saveApplicationRemarksByIdResp !== prevSaveApplicationRemarksByIdResp) {
            toast.success('Remarks saved successfully.');
            refreshReviewRemarks(selectedReviewRemarksId);
            getRegistrationApiCall();
        }
        else if (admissionRegistrationErrorResp && admissionRegistrationErrorResp !== prevAdmissionRegistrationErrorResp) {
            const { details , message } = admissionRegistrationErrorResp;
            toast.error(details || message || "Something went wrong.");
        }
        prevRegisterStudentRef.current.prevAdmissionRegistrationErrorResp = admissionRegistrationErrorResp;
        prevRegisterStudentRef.current.prevAcademicYearListResp = academicYearListResp;
        prevRegisterStudentRef.current.prevRegistrationLinkActivateResp = registrationLinkActivateResp;
        prevRegisterStudentRef.current.prevExportRegistrationDataResp = exportStudentDataRegistrationResp;
        prevRegisterStudentRef.current.prevRegistrationInCompleteFormResp = registrationInCompleteFormResp;
        prevRegisterStudentRef.current.prevSaveApplicationRemarksByIdResp = saveApplicationRemarksByIdResp;

    }, [academicYearListResp, admissionRegistrationErrorResp, registrationLinkActivateResp, exportStudentDataRegistrationResp,registrationInCompleteFormResp, saveApplicationRemarksByIdResp]);

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionName: "Edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
                onClickHndlr: (event: any) => {
                    let registrationId = event.currentTarget.getAttribute('data-id');
                    if (registrationId) {
                        dispatch(setRegistrationTabIdAct(tabId));
                        history.push(`/admission-management/edit-registration`, {
                            registrationId
                        });
                    }
                },
            },
            {
                id: "print",
                actionName: "Print",
                actionIcon: <HugeiconsIcon icon={PrinterIcon} className="me-2 text-muted" size={18} />,
                onClickHndlr: (event: any) => {
                    let registrationId = event.currentTarget.getAttribute('data-id');
                    setPrimarModalState(prevState => ({ ...prevState, showModal: true, studentRegNo: registrationId || "35754" }))
                },
            },
            {
                id: "consolidatedView",
                actionIcon: <HugeiconsIcon icon={PrinterIcon} className="me-2 text-muted" size={18} />,
                actionName: "Consolidated View",
                onClickHndlr: (event: any) => {
                    let registrationId = event.currentTarget.getAttribute('data-id');
                    setConsolidatedModalState(prevState => ({ ...prevState, showModal: true, studentRegNo: registrationId || "35754" }))
                },
            },
            {
                id: "activateLink",
                actionIcon: <HugeiconsIcon icon={CheckmarkCircle01Icon} className="me-2 text-muted" size={18} />,
                actionName: "Activate Link",
                onClickHndlr: (event: any) => {
                    let registrationId = event.currentTarget.getAttribute('data-id');
                    if (registrationId) {
                        let appId;
                        if (studentRegistrationResp.data.length) {
                            studentRegistrationResp?.data?.map((info: any) => {
                                if (+info?.registrationId === +registrationId) {
                                    appId = info?.applicationSaleId
                                }
                            })
                        }
                        dispatch(rgistrationLinkActivateAct(generateActionPayload("register_link_activate", { id: appId }, undefined)));
                    }
                },
            },
            {
                id: "cancelAdmission",
                actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="me-2 text-danger" size={18} />,
                actionName: "Cancel Admission",
                onClickHndlr: (event: any) => {
                    let registrationId = event.currentTarget.getAttribute('data-id');
                    if (registrationId) {
                        setCancelModalState(prevState => ({ ...prevState, showModal: true, studentRegNo: registrationId }))
                    }
                },
            },
        ], [registrationsState]);


    const [applicationSaleModal, setApplicationSaleModal] = useState<any>({
        showModal: false,
        applicationId: undefined
    })

    const addRegistrationHandler = () => {
        dispatch(setRegistrationTabIdAct(tabId));
        history.push("/admission-management/add-registration");
        // setApplicationSaleModal((prev: any) => ({ ...prev, showModal: !prev.showModal }));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {

        const { name, value } = event.target;
        paginationRef.current = { ...paginationRef.current, pageNo: 0 }
        let stateChanged = hasStateChanged({ ...filterState, [name]: value, academicYearId: "" });
        if (name === "academicYearId") {
            !(value === "") && dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId: +value, branchId })))
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetBrchClassAct(undefined));
            setFilterState((prev: any) => ({ ...prev, [name]: value , classId : null,curriculumId:"" }));
            stateChanged = hasStateChanged({ ...filterState, academicYearId: "",classId : null,curriculumId:"" });
        }
        else{
        setFilterState((prev: any) => ({ ...prev, [name]: value }));
        }
         if(name === "academicYearId") {
            getRegistrationApiCall({ [name]: value , classId : null , curriculumId : "" });
        }else{
            getRegistrationApiCall({ [name]: value });
        }
        
        setShowClearFilterState(stateChanged.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged.count)
    }

    function search(value: any) {
        getRegistrationApiCall({ "searchString": value });
    }

    const debounceFun = useCallback(debounce(search, 200), [studentRegistrationResp]);
    const searchHandler = (event: any) => {
        const { name, value } = event.target;
        const stateChanged = hasStateChanged({ ...filterState, [name]: value, academicYearId: "" });
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
        setShowClearFilterState(stateChanged?.stateChange)
        setFilterState((prev: any) => ({ ...prev, [name]: value }));
        paginationRef.current = { ...paginationRef.current, pageNo: 0 };
        debounceFun(value)
    }

    function getClassApiCall(curriculumId: string) {
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }


    function getRegistrationApiCall(otherProps?: any) {
        const filter = {
            branchId, ...filterState, ...otherProps, ...paginationRef.current, sortBy: "lastModifiedAt",
            orderBy: "desc"
        };
        const sanitizeFilter = sanitizeUrlParams(filter);
        const { classId, currentStatus } = sanitizeFilter;
        if (Array.isArray(classId)) {
            const classIds = classId.map(item => item.id);
            sanitizeFilter.classId = classIds;
        }
        if (Array.isArray(currentStatus)) {
            const currentStatusIds = currentStatus.map(item => item.id);
            sanitizeFilter.currentStatus = currentStatusIds;
        }
        dispatch(studentRegistrationsAct(generateActionPayload("get_register_students", undefined, sanitizeFilter)));
    }

    function paginationHndlr(paginationInfo: any) {
        paginationRef.current = paginationInfo;
        getRegistrationApiCall();
    }

    const toggleCancelModalHndlr = useCallback((apiCall?: boolean) => {
        setCancelModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getRegistrationApiCall();
        }
    }, [studentRegistrationResp]);
    const toggleConsolidatedModalHndlr = useCallback((apiCall?: boolean) => {
        setConsolidatedModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getRegistrationApiCall();
        }
    }, [studentRegistrationResp]);

    const togglePrintModalHandler = useCallback((apiCall?: boolean) => {
        setPrimarModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getRegistrationApiCall();
        }
    }, [studentRegistrationResp]);

    function redirectRegistrationDetails(event: React.MouseEvent<HTMLDivElement>) {
        let registrationId = event.currentTarget.getAttribute('data-id');
        if (registrationId) {
            dispatch(setRegistrationTabIdAct(tabId));
            history.push(`/admission-management/view-registration`, {
                registrationId
            });
        }
    }

    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        paginationRef.current.pageNo = 0;
        setFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
        const stateChanged = hasStateChanged({ ...filterState, ...appliedFilters, academicYearId: "" });
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
        setShowClearFilterState(stateChanged?.stateChange)
        getRegistrationApiCall(appliedFilters)
    }

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }

    useEffect(() => {                              
        if (studentRegistrationResp) {
            setOpen(false);
        }
    }, [studentRegistrationResp])
                                                           
    const clearFilterHndlr = () => {
        if (academicYearListResp) {
            paginationRef.current.pageNo = 0;
            let { academicYearId }: any = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            getCurriculumApiCall({ academicYearId })
            dispatch(resetBrchClassAct(undefined));
            setCount(null)
            setFilterState({ ...initialFilterState, academicYearId })
            getRegistrationApiCall({ ...initialFilterState, academicYearId })
            setShowClearFilterState(false)
        }
    }

    function onSearchHandler(name: string, value: any) {  
        paginationRef.current.pageNo = 0;
        setSearchStudentState((prev) => {
            const updatedFilterType = prev;
            setFilterState((prevState) => {
                const updatedState = { 
                    ...prevState, 
                    searchString: value, 
                    filterTypeName: updatedFilterType
                };
                getRegistrationApiCall(updatedState);
                return updatedState;
            });
            return updatedFilterType;
        });
    }
    
    function onChangeHandler(name: string, id: any, item: any) {
        setSearchStudentState(id);
        paginationRef.current.pageNo = 0;
        setFilterState((prevState) => {
            const updatedState = { 
                ...prevState, 
                filterTypeName: id,
                searchString: ""
            };
            getRegistrationApiCall(updatedState);
            return updatedState;
        });
    }

    const exportModalHndler = () => {
        const payload: any = { branchId, ...filterState }
        const { classId, currentStatus } = payload;
        if (Array.isArray(classId)) {
            const classIds = classId.map(item => item.id);
            payload.classId = classIds?.join(',');
        }
        if (Array.isArray(currentStatus)) {
            const currentStatusIds = currentStatus.map(item => item.id);
            payload.currentStatus = currentStatusIds?.join(',');
        }
        dispatch(exportStudentRegistrationDataAct(generateActionPayload('export_student_registration_data', undefined, { ...payload }, {
            responseType: 'blob'
          })))
    }

    const { data: registrationList, pageNumber, totalPages, totalElements } = studentRegistrationResp || {};
    const allStudentsCheckHndlr = useCallback((event:any) => {
        const {checked} = event.target;
        setAllStudentsSelectedState(checked)
        let updateStudentState = [...registrationsState];
        updateStudentState.forEach((item:any) => {
            item.isSelected = checked
        })
        setRegistrationsState(updateStudentState)
    },[registrationsState])

    const singleStudentCheckHndlr = useCallback((event:any) => {
        const {checked} = event.currentTarget;
        const registrationId = event.currentTarget.getAttribute("data-id")
        const rowIndex = registrationsState.findIndex((item:any) => +item.registrationId === Number(registrationId))
        if(rowIndex > -1){
            const studentDetails:any = registrationsState[rowIndex]
            let updateStudentState:any = [...registrationsState];
            updateStudentState.splice(rowIndex,1,{...studentDetails,isSelected:checked})
            setRegistrationsState(updateStudentState)
            const isAllSelected = updateStudentState.every((item:any) => item.isSelected)
            setAllStudentsSelectedState(isAllSelected)
        }
    },[registrationsState])

    useEffect(() => {
        if(studentRegistrationResp?.data?.length > 0){
            setRegistrationsState(studentRegistrationResp?.data?.map((item:any) => {
                return {...item, isSelected:false}
            }))
        }
        else {
            setRegistrationsState([])
        }
    },[studentRegistrationResp])

    const sendInCompleteStndNotificationHndler = () => {
        const sendInCompleteStndsList = registrationsState
        ?.filter((item: any) => item?.isSelected)
        .map((item: any) => item?.registrationId) || [];

        
        dispatch(sendRegistrationInCompleteFormAct(generateActionPayload('send_reg_incomplete_form', {instituteId,branchId,ids: sendInCompleteStndsList.join(","),isRegistrationScreen: tabId === "registration"},undefined)))
    }

    const showSendNotificationBtn = useMemo(() => isShowSendNotificationButton(registrationsState),[registrationsState])

    const refreshReviewRemarks = useCallback((applicationSaleId: any) => {
        if (!applicationSaleId) return;
        dispatch(
            getApplicationRemarksById(
                generateActionPayload(
                    "get_application_remarks_by_id",
                    { applicationSaleId },
                    // { screen: "REGISTRATION" }
                )
            )
        );
    }, [dispatch]);

    const handleReviewRemarks = useCallback((registrationId: any) => {
        const selectedStudent = registrationsState?.find(
            (item: any) =>
                String(item?.registrationId).trim() === String(registrationId).trim()
        );
        const applicationSaleId = selectedStudent?.applicationSaleId;
        if (!applicationSaleId) return;
        setSelectedReviewRemarksId(applicationSaleId);
        refreshReviewRemarks(applicationSaleId);
        reviewRemarksOpenModal();
    }, [registrationsState, refreshReviewRemarks, reviewRemarksOpenModal]);

    const registrationColumns = useMemo(
      () =>
        generateColumns(
          redirectRegistrationDetails,
          menuOptions,
          allStudentsSelectedState,
          allStudentsCheckHndlr,
          singleStudentCheckHndlr,
          filterState?.completionStatus,
          handleReviewRemarks
        ),
      [
        studentRegistrationResp,
        allStudentsSelectedState,
        allStudentsCheckHndlr,
        singleStudentCheckHndlr,
        filterState?.completionStatus,
        registrationsState,
        handleReviewRemarks
      ]
    );
    
    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded-md tw-shadow-md tw-inline-block tw-w-full">
                <div className='tw-border-b tw-py-2 tw-px-4 tw-flex tw-items-center'>
                    <h4 className="tw-text-[16px] tw-font-semibold tw-mb-0">
                        Registration Details List
                    </h4>
                     <div className="tw-ml-auto tw-text-center tw-flex tw-items-center tw-gap-3">
                        <Button variant="primary" onClick={addRegistrationHandler} >
                            <i className="ri-add-line tw-mr-1" />
                            <span>Add New</span>
                        </Button>
                        <Button variant="info" onClick={openExportConfirmationModal} >
                            <i className="ri-add-line tw-mr-1" />
                            <span>Export</span>
                        </Button>
                        {
                            !showSendNotificationBtn && <Button variant="soft" onClick={sendInCompleteStdntNotifOpenModal}>
                                <HugeiconsIcon icon={SentIcon} className="tw-mr-2" size={18} />
                                <span>Send Notification</span>
                            </Button>
                        }
                    </div>
                </div>
                <div className="tw-py-4 tw-px-6">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                        <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-4">
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

                         <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                            <SelectInput
                                name="academicYearId"
                                value={filterState.academicYearId}
                                onChange={onChangeFilterHndlr}
                                menuItems={academicYearListResp?.data}
                                formgroupClassName="tw-mb-0"
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                labelText="Academic Year"
                                floatingLabel
                            />
                        </div>

                         <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                            <SelectInput
                                name="completionStatus"
                                value={filterState?.completionStatus}
                                onChange={onChangeFilterHndlr}
                                menuItems={completionStatusData || []}
                                formgroupClassName="tw-mb-0"
                                valueKey="id"
                                textKey="name"
                                labelText="Status"
                                floatingLabel
                            />
                        </div>

                         <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                            <SelectInput
                                name="mainApplicationStatus"
                                value={filterState?.mainApplicationStatus}
                                onChange={onChangeFilterHndlr}
                                menuItems={mainApplicationStatus || []}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                labelText="Application Status"
                                floatingLabel
                            />
                        </div>
                        <div className="tw-relative tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-1">
                            <Button
                                variant="secondary"
                                style={{
                                    backgroundColor: "#F4F7FA",
                                }}
                                onClick={toggleAdvanceFilter}
                                className="p-2 btn d-flex"
                            >
                                <FilterSvg height={"18px"} width={"18px"} />
                                <span className='tw-ml-2'>Filters</span>
                            </Button>
                            <span className="badge align-middle rounded-pill ms-1 " style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "78px", background: "#0ab39c" }}>
                                {count}
                            </span>
                        </div>

                        {showClearFilterState && <div className='tw-col-auto tw-ml-auto tw-flex'>
                             <Button variant="wrong" onClick={clearFilterHndlr}>Clear filter</Button>
                        </div>}
                    </div>
                </div>

                <OffCanvasContainer
                    isOpen={open}
                    headerTitle="Advance Filters"
                    closeHndlr={toggleAdvanceFilter}
                    id="registration-advance-filter"
                >
                    <AdvanceFilterModal
                        getClassApiCall={getClassApiCall}
                        appliedFilter={filterState}
                        applyFilterCallback={advanceFilterCallbckHndlr}
                        toggleAdvanceFilter={toggleAdvanceFilter}
                        isOpen={open}
                    />

                </OffCanvasContainer>
                <TableContainer
                    columns={registrationColumns || []}
                    // data={Array.isArray(registrationList) ? registrationList : []}
                    data={registrationsState || []}
                    tableClass="tw-mb-0"
                    divClass="table-responsive tw-mb-3"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    showPagination={true}
                    totalPages={totalPages}
                    totalRecords={totalElements}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={pageNumber}
                />
            </div>
            <ModalContainerUpdated
                id="change-newPassword-modal"
                // modalTitle="Change Password"
                hideHeader={true}
                isOpen={cancelModalState.showModal}
                toggle={toggleCancelModalHndlr}
                modalSize="md"
            >
                <CancelAdmission
                    studentRegNo={cancelModalState.studentRegNo}
                    toggle={toggleCancelModalHndlr}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="consolidated-view"
                // modalTitle="Change Password"
                modalTitle="Consolidated View"
                isOpen={consolidateModalState.showModal}
                toggle={toggleConsolidatedModalHndlr}
                modalSize="xl"
            >
                <ConsolidatedView
                    studentRegNo={consolidateModalState.studentRegNo}
                    toggle={toggleConsolidatedModalHndlr}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="printform-view"
                // modalTitle="Change Password"
                modalTitle="Print Registration Form"
                isOpen={printModalState.showModal}
                toggle={togglePrintModalHandler}
                modalSize="xl"
            >
                <PrintApplication
                    studentRegNo={printModalState.studentRegNo}
                    toggle={togglePrintModalHandler}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="student-concession-export-modal"
                isOpen={exportConfirmationModalState.showModal}
                toggle={closeExportConfirmationModal}
                modalTitle="Export Student Registration Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportConfirmationModalState.showModal}
                    toggle={closeExportConfirmationModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportModalHndler}
                    feature="directory"
                    subFeature={!showInstituteAdminUI ? "student_management" : ""}
                    remarksText="Enter remarks to export Student Registration Data?"
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id = "send-incomplete-notifications"
                isOpen={sendInCompleteStdntNotifModalState.showModal}
                confirmMessage="Are you sure you want to send notification?"
                cancelHndlr={sendInCompleteStdntNotifCloseModal}
                confirmHndlr={sendInCompleteStndNotificationHndler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType="approve"
                btnClassName='btn w-sm btn-success'
            ></ConfirmationModal>
     
        <ModalContainerUpdated
            id="review-remarks-modal"
            isOpen={reviewRemarksModalState.showModal}
            toggle={reviewRemarksCloseModal}
            modalSize="xl"
            modalTitle='Review Remarks'
        >
            <ReviewRemarksModal
                isOpen={reviewRemarksModalState.showModal}
                toggle={reviewRemarksCloseModal}
                modalTitle=""
                showApiLoader={showApiLoader}
                tabId={tabId}
            />
        </ModalContainerUpdated>
        </React.Fragment >
    );
}

export default Registration
