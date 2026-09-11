import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from "classnames";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { generateColumns, hasStateChanged, sendNotificationDisabled } from './helper';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { IPaginationState } from '../../../../Components/Common/Pagination';
import { getInstAcademicYearAct } from '../../../../store/mastersettings/instacademics/instacademicactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { exportPanIntResListAct, getPanelInterviewResultListAct, resetEditPanIntResAct, sendNotifiPanIntResAct } from '../../../../store/FrontDesk/Interview/interviewactions';
import { toast } from 'react-toastify';
import { resetPanelEmployeesListAct } from '../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityslice';
import { getApplicationRemarksById, getStatasticResp } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { setRegistrationTabIdAct } from '../../../../store/global/globalslice';
import ConfirmationModalIntRes from './ConfirmationModal';
import AdvanceFilterModal from './AdvancedFilterModal';
import PaymentDetailsModal from './PaymentDetailsModal';
import { useModal } from '../../../../hooks/modalhook';
import ExportModal from '../../../Directory/StudentManagement/ExportModal';
import { downloadExcelFile } from '../../../../utility/commonutility';
import { jodoRegistrationAct } from '../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction';
import { HugeiconsIcon } from "@hugeicons/react";
import {  CancelCircleIcon, Invoice04Icon, PencilEdit02Icon, PrinterIcon, RegisterIcon} from "@hugeicons-pro/core-stroke-standard";
import Button from '../../../../Components/Common/Button';
import ReviewRemarksModal from '../ApplicationSale/ReviewRemarksModal';
import { MessagePreview01Icon } from '@hugeicons-pro/core-solid-standard';


const initalFilter = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    searchString: "",
    feePaymentPaidStatus: "",
    endDate: "",
    startDate: "",
    registrationType: "",
    jodoStudentId: "",
    admissionSource: null,
    employeeIds: null,
    admissionType: null,
    admissionCancel: null,
    recentFollowupRemarksStartDate: null,
    recentFollowupRemarksEndDate: null,
    nextFollowupRemarksStartDate: null,
    nextFollowupRemarksEndDate: null,
    mainApplicationStatus: null,
}

const PanelInterviewResult = ({ tabId }: any) => {
    const history = useHistory()
    const dispatch = useAppDispatch()
    const [showClearFilterState, setShowClearFilterState] = useState(false);
    const [count, setCount] = useState<any>(null);
    const { closeModal: closeRegisterModalHndlr,
        openModal: openRegisterModalHndlr,
        modalState: registerModalState } = useModal();

    const { closeModal: closePaymentDetailsModal, modalState: paymentDetailsModalState, openModal: openPaymentDetailsModal } = useModal();
    const { openModal: reviewRemarksOpenModal, closeModal: reviewRemarksCloseModal, modalState: reviewRemarksModalState } = useModal()
    const [selectedReviewRemarksId, setSelectedReviewRemarksId] = useState<any>(null);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, currentInstCodeResp: instituteCode, academicYearListResp, brchCurriculumResp, branchClassResp,
        panelInterviewResultListResp, interviewErrorResp, sendNotifiPanIntResResp,
        exportPanIntResListResp, showApiLoader, jodoRegistrationResp, panIntResCancelAdmissionResp, saveApplicationRemarksByIdResp } =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, admissionRegistration, interview, globalData, applicationSale }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentInstCodeResp: appData.currentInstCodeResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                showApiLoader: globalData.showApiLoader,
                sendNotifiPanIntResResp: interview.sendNotifiPanIntResResp,
                exportPanIntResListResp: interview.exportPanIntResListResp,
                panIntResCancelAdmissionResp: interview.panIntResCancelAdmissionResp,
                panelInterviewResultListResp: interview.panelInterviewResultListResp,
                jodoRegistrationResp: admissionRegistration.jodoRegistrationResp,
                interviewErrorResp: interview.interviewErrorResp,
                saveApplicationRemarksByIdResp: applicationSale.saveApplicationRemarksByIdResp,
            }),
            shallowEqual
        );

    const [panelInterviewResultListFilter, setPanelInterviewResultListFilter] = useState(initalFilter);
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    const [panelIntResData, setpanelIntResData] = useState<any[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const paginationRef = useRef({ pageNo: 0, pageSize: 10 })

    const PanIntResultRef = useRef({
        prevInterviewErrorResp: interviewErrorResp,
        prevSendNotifiPanIntResResp: sendNotifiPanIntResResp,
        prevExportPanIntResListResp: exportPanIntResListResp,
        prevJodoRegistrationResp: jodoRegistrationResp,
        prevPanIntResCancelAdmissionResp: panIntResCancelAdmissionResp,
        prevSaveApplicationRemarksByIdResp: saveApplicationRemarksByIdResp
    })
    useEffect(() => {
        const { prevInterviewErrorResp, prevSendNotifiPanIntResResp, prevPanIntResCancelAdmissionResp,
            prevJodoRegistrationResp, prevExportPanIntResListResp, prevSaveApplicationRemarksByIdResp } = PanIntResultRef.current;
        if (sendNotifiPanIntResResp && prevSendNotifiPanIntResResp !== sendNotifiPanIntResResp) {
            toast.success('Notification sended successfully')

            toggleNotificationModal()
            PanelInterviewResultListFunc()
        }
        else if (panIntResCancelAdmissionResp && prevPanIntResCancelAdmissionResp !== panIntResCancelAdmissionResp) {
            toast.success('Admission Canceled Successfully.')
            toggleConfirmationModal()
            PanelInterviewResultListFunc()
        }
        else if (exportPanIntResListResp && prevExportPanIntResListResp !== exportPanIntResListResp) {
            toast.success('Interview Result Data Downloaded Successfully.')
            toggleExportExcelModal()
            downloadExcelFile(exportPanIntResListResp,'Interview_Result')
        }
        else if (interviewErrorResp && prevInterviewErrorResp !== interviewErrorResp) {
            const { details } = interviewErrorResp;
            toast.error(details)
        }
        else if (saveApplicationRemarksByIdResp && saveApplicationRemarksByIdResp !== prevSaveApplicationRemarksByIdResp) {
            toast.success('Remarks saved successfully.');
            refreshReviewRemarks(selectedReviewRemarksId);
            PanelInterviewResultListFunc();
        } else if (jodoRegistrationResp && jodoRegistrationResp !== prevJodoRegistrationResp) {
            toast.success('Jodo registered successfully.');
            PanelInterviewResultListFunc();
        }
        PanIntResultRef.current.prevSendNotifiPanIntResResp = sendNotifiPanIntResResp;
        PanIntResultRef.current.prevPanIntResCancelAdmissionResp = panIntResCancelAdmissionResp;
        PanIntResultRef.current.prevExportPanIntResListResp = exportPanIntResListResp;
        PanIntResultRef.current.prevJodoRegistrationResp = jodoRegistrationResp;
        PanIntResultRef.current.prevInterviewErrorResp = interviewErrorResp;
        PanIntResultRef.current.prevSaveApplicationRemarksByIdResp = saveApplicationRemarksByIdResp;
    }, [interviewErrorResp, sendNotifiPanIntResResp, panIntResCancelAdmissionResp, exportPanIntResListResp,
        jodoRegistrationResp, saveApplicationRemarksByIdResp
    ])
    const [confirmationModalState, setConfirmationModalState] =
        useState({
            showModal: false,
            resultId: "",
        });

    const toggleConfirmationModal = (id?: any) => {
        setConfirmationModalState((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            resultId: id,
        }));
    };


    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18}/>,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    let id = event.currentTarget.getAttribute('data-id');
                    //   toggleApproveRejectModal("REJECTED",itFormId);
                    if (id) {
                        dispatch(setRegistrationTabIdAct(tabId));
                        history.push('/admission-management/panel-interview-result', { pirId: id })
                    }
                },
            },
            {
                id: "payment-details",
                actionIcon: <HugeiconsIcon icon={Invoice04Icon} className="me-2 text-muted" size={18}/>,
                actionName: "Payment Details",
                onClickHndlr: (event: any) => {
                    let interviewId = event.currentTarget.getAttribute('data-id');
                    if (interviewId && Array.isArray(panelInterviewResultList)) {
                        const interviewInfo = panelInterviewResultList?.find((item: any) => item.id?.toString() === interviewId);
                        if (interviewInfo) {
                            openPaymentDetailsModal(interviewInfo)
                        }
                    }
                },
            },
            {
                id: "jodo-register",
                actionIcon: <HugeiconsIcon icon={RegisterIcon} className="me-2 text-muted" size={18}/>,
                actionName: "Jodo Register",
                onClickHndlr: (event: any) => {
                    let interviewId = event.currentTarget.getAttribute('data-id');
                    if (interviewId && Array.isArray(panelInterviewResultList)) {
                        const interviewInfo = panelInterviewResultList?.find((item: any) => item.id?.toString() === interviewId);
                        openRegisterModalHndlr(interviewInfo);
                    }
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="me-2 text-danger" size={18} />,
                actionName: "Cancel Admission",
                onClickHndlr: (event: any) => {
                    let id = event.currentTarget.getAttribute('data-id');
                    toggleConfirmationModal(id)
                },
            },

        ],
        [panelIntResData]
    );

    const PanelInterviewResultListFunc = (otherProps?: any) => {
        let payload = { ...panelInterviewResultListFilter, ...paginationRef.current, branchId: branchId, ...otherProps, instituteId }
        if (payload?.curriculumId === "") {
            payload = { ...payload, classId: "" }
        }
        if (payload.admissionType?.length > 0) {
            payload = { ...payload, admissionType: payload.admissionType?.map((i: any) => i.value).join(",") }
        }
        if (payload?.employeeIds?.length > 0) {
            payload.employeeIds = payload.employeeIds.map((i: any) => i?.employeeId).join(",")
        }

        // payload.employeeIds = payload?.employeeIds?.id || null
        dispatch(getPanelInterviewResultListAct(generateActionPayload('get_panel_interview_result_list', undefined, payload)))
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationRef.current = paginationInfo;
        PanelInterviewResultListFunc(paginationInfo);
    }

    const getClassApiCall = (otherProps?:any)=>{
        const payload = { branchId: branchId, academicYearId : panelInterviewResultListFilter?.academicYearId, curriculumId: panelInterviewResultListFilter?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: panelInterviewResultListFilter.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const ChangeHandler = (event: any) => {
        setpanelIntResData([])
        const { name, value } = event.target;
        paginationRef.current.pageNo = 0;
        let stateChanged = hasStateChanged({ ...panelInterviewResultListFilter, [name]: value, academicYearId: "" });
        if (name === "academicYearId") {
            !(value === "") && dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId: +value, branchId })))
                getCurriculumApiCall({ academicYearId: value });
                dispatch(resetBrchClassAct(undefined));
                setPanelInterviewResultListFilter((prev:any) => ({ ...prev, [name]: value , classId : null }));
                stateChanged = hasStateChanged({ ...panelInterviewResultListFilter, academicYearId: "",classId : null });
                PanelInterviewResultListFunc({ [name]: value, classId: null,curriculumId : "" });
        }
        else if (name === "curriculumId") {
            if (value) {
                getClassApiCall({ curriculumId: value,academicYearId:panelInterviewResultListFilter.academicYearId});
            }
            else {
                dispatch(resetBrchClassAct(undefined));
            }
            PanelInterviewResultListFunc({ [name]: value, classId: null  });
            setPanelInterviewResultListFilter((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
        } else {
            PanelInterviewResultListFunc({ [name]: value, });
            setPanelInterviewResultListFilter((prevState: any) => ({ ...prevState, [name]: value }));
        }
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    }

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetEditPanIntResAct(undefined));
            dispatch(resetPanelEmployeesListAct(undefined));
        }
    }, []);
    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
            setPanelInterviewResultListFilter((prev: any) => ({ ...prev, academicYearId: yearId }))
            PanelInterviewResultListFunc({ academicYearId: yearId })
            getCurriculumApiCall({ academicYearId : yearId });
            dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId : yearId, branchId })))
        }
    }, [academicYearListResp]);

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...panelIntResData];
        updateStudentState.forEach((item: any) => {
            item.isSelected = checked;
        });
        setpanelIntResData(updateStudentState);
    }, [panelIntResData]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            registrationNumber = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = panelIntResData.findIndex((item: any) => +item.studentRegId === Number(registrationNumber));
        if (studentRowIndex > -1) {
            const studentDetails: any = panelIntResData[studentRowIndex];
            let updateStudentState: any = [...panelIntResData];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails, isSelected: checked,
            });
            setpanelIntResData(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [panelIntResData]);

    useEffect(() => {
        if (panelInterviewResultListResp?.content?.length) {
            setpanelIntResData(panelInterviewResultListResp?.content?.map((item: any) => {
                return { ...item, isSelected: false }
            }))
        } else {
            setpanelIntResData([])
        }
    }, [panelInterviewResultListResp])

    const refreshReviewRemarks = useCallback((applicationSaleId: any) => {
        if (!applicationSaleId) return;

        dispatch(
            getApplicationRemarksById(
                generateActionPayload(
                    "get_application_remarks_by_id",
                    { applicationSaleId },
                    // { screen: "INTERVIEW_RESULT" }
                )
            )
        );
    }, [dispatch]);
    
    const handleReviewRemarks = useCallback((registrationId: any) => {
        const selectedStudent = panelIntResData?.find(
            (item: any) =>
                String(item?.registrationId || item?.studentRegId || item?.id).trim() ===
                String(registrationId).trim()
        );
        const applicationSaleId = selectedStudent?.applicationSaleId;
        if (!applicationSaleId) return;
        setSelectedReviewRemarksId(applicationSaleId);
        refreshReviewRemarks(applicationSaleId);
        reviewRemarksOpenModal();
    }, [panelIntResData, refreshReviewRemarks, reviewRemarksOpenModal]);

    const roleColumns = useMemo(() => {
        const list = ["interviewdBy", "recommendedBy", "referenceBy"];
        const pmsActions = ["jodo-register","delete"]
        let filterActions = menuOptions;
        if (instituteCode === "PMS") {
            filterActions = menuOptions?.filter(item => pmsActions.includes(item.id));
        }
        return generateColumns(filterActions, allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState, handleReviewRemarks).filter((item: any) => instituteCode === "PMS" ? !list.includes(item.accessor) : true)
    }, [panelIntResData, handleReviewRemarks]);

    const sendNotificationHndler = () => {
        let newArray: any = [];
        panelIntResData?.map((item: any) => {
            if (item?.isSelected) {
                newArray = [...newArray, item?.id]
            }
        })

        dispatch(sendNotifiPanIntResAct(generateActionPayload("send_notifi_pan_int_res", undefined, { ids: newArray.join(',') })));
    }


    const [sendNotification, setSendNotification] = useState({
        showModal: false,
        scrutinyId: undefined
    })

    const toggleNotificationModal = (id?: any) => {
        setSendNotification((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            scrutinyId: id || "",
        }));
    };

    const resetBtnHndler = () => {
        if (academicYearListResp) {

            let { academicYearId }: any = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            setPanelInterviewResultListFilter({ ...initalFilter, academicYearId })
            PanelInterviewResultListFunc({ ...initalFilter, academicYearId });
        }

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
        dispatch(exportPanIntResListAct(generateActionPayload("export_pan_int_res_list", undefined, { ...panelInterviewResultListFilter, branchId, instituteId }, {
            responseType: 'blob'
        })));
    }
    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        paginationRef.current = { ...paginationRef.current, pageNo: 0 }
        const stateChanged = hasStateChanged({ ...panelInterviewResultListFilter, ...appliedFilters, academicYearId: "" });
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
        setPanelInterviewResultListFilter((prevState: any) => ({ ...prevState, ...appliedFilters }));
        PanelInterviewResultListFunc(appliedFilters)
    }

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }

    useEffect(() => {
        if (panelInterviewResultListResp) {
            setOpen(false);
        }
    }, [panelInterviewResultListResp])

    const clearFilterHndlr = () => {
        if (academicYearListResp) {
            paginationRef.current = { ...paginationRef.current, pageNo: 0 }
            let { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            dispatch(resetBrchClassAct(undefined));
            setCount(null)
            setPanelInterviewResultListFilter({ ...initalFilter, academicYearId })
            PanelInterviewResultListFunc({ ...initalFilter, academicYearId })
            setShowClearFilterState(false)
        }
    }

    function onSubmitJodoRegisterHndlr() {
        const { modalData } = registerModalState;
        const payload = [{
            registrationNo: modalData?.registrationNo,
            branchId
        }]
        dispatch(jodoRegistrationAct(generateActionPayload("jodo_registration", undefined, payload)));
    }

    const submitButtonError = useMemo(() => sendNotificationDisabled(panelIntResData), [panelIntResData]);
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};
    const { content: panelInterviewResultList, totalElements, totalPages, pageable } = panelInterviewResultListResp || {};
    return (<>
        <div className="tw-inline-block tw-w-full tw-bg-white tw-rounded tw-shadow">
            <div className="tw-flex tw-items-center tw-p-2 tw-px-3 tw-border-b">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    {instituteCode === "DPS" ? "Panel Interview Result" : "Admission Result"}
                </h4>

                <div className="tw-ml-auto tw-text-center tw-flex tw-gap-2">
                    {instituteCode === "DPS" && (
                        <Button
                        variant='primary'
                            onClick={() => {
                                dispatch(setRegistrationTabIdAct(tabId));
                                history.push('/admission-management/panel-interview-result');
                            }}
                        >
                            <div className="tw-flex tw-items-center">
                                <span><i className="ri-add-line tw-mr-1" /></span>
                                <span>Add New</span>
                            </div>
                        </Button>
                    )}

                    <Button
                        variant='info'
                        onClick={toggleExportExcelModal}
                    >
                        <div className="tw-flex tw-items-center tw-text-white">
                            <span><i className="ri-add-line tw-mr-1" /></span>
                            <span>Export</span>
                        </div>
                    </Button>

                    {!submitButtonError && (
                        <Button
                            variant='warning'
                            onClick={toggleNotificationModal}
                        >
                            <div className="tw-flex tw-items-center tw-text-white">
                                <span><i className="ri-add-line tw-mr-2" /></span>
                                <span>Send Notification</span>
                            </div>
                        </Button>
                    )}
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-py-3">
                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                    <div className="tw-relative search-box">
                        <TextInput
                            name="searchString"
                            value={panelInterviewResultListFilter?.searchString}
                            onChange={ChangeHandler}
                            formgroupClassName="tw-mb-0"
                            placeHolder="Search..."
                            labelText="Search"
                            floatingLabel
                        />
                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2"></i>
                    </div>
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="academicYearId"
                        value={panelInterviewResultListFilter?.academicYearId}
                        onChange={ChangeHandler}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        labelText="Academic Year"
                        floatingLabel
                        formgroupClassName="tw-mb-0"
                    />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="curriculumId"
                        value={panelInterviewResultListFilter?.curriculumId}
                        onChange={ChangeHandler}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        labelText="Curriculum"
                        floatingLabel
                        formgroupClassName="tw-mb-0"
                    />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="classId"
                        value={panelInterviewResultListFilter?.classId}
                        onChange={ChangeHandler}
                        menuItems={classTypes || []}
                        valueKey="id"
                        textKey="shortName"
                        labelText="Class"
                        floatingLabel
                        formgroupClassName="tw-mb-0"
                    />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-1 tw-relative">
                    <div
                        onClick={toggleAdvanceFilter}
                        className="tw-flex tw-items-center tw-gap-2 tw-bg-[#F4F7FA] tw-p-2 tw-rounded"
                    >
                        <FilterSvg height="18px" width="18px" />
                        <span>Filters</span>
                    </div>
                    <span className="badge tw-align-middle rounded-pill ms-1 " style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "78px", background: "#0ab39c" }}>
                        {count}
                    </span>
                </div>

                <div className="tw-col-auto tw-ml-auto tw-flex">
                    {showClearFilterState && (
                        <Button
                            type="button"
                            onClick={clearFilterHndlr}
                            variant='wrong'
                            className="tw-whitespace-nowrap !tw-px-2 !tw-py-1"
                        >
                            Clear filter
                        </Button>
                    )}
                </div>

            </div>
            {/* </form> */}
            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="panel-interview-result-advance-filter"
            >
                <AdvanceFilterModal
                    getClassApiCall={PanelInterviewResultListFunc}
                    appliedFilter={panelInterviewResultListFilter}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                />

            </OffCanvasContainer>
            <TableContainer
                columns={roleColumns || []}
                data={panelIntResData || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber || 0}
            />
        </div>
        <ModalContainerUpdated
            id="panel-interview-result-export"
            isOpen={exportExcel.showModal}
            toggle={toggleExportExcelModal}
            modalTitle="Export Interviewer Results Data"
            modalSize="md"
        >
            <ExportModal
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                instituteId={instituteId}
                branchId={branchId}
                submitHndlr={exportExcelHndler}
                feature="admission"
                subFeature="interview_result"
                remarksText="Enter remarks to export interview results data?"
            />
        </ModalContainerUpdated>
        <ConfirmationModal
            id="delete-inst-academic-terms"
            isOpen={sendNotification.showModal}
            confirmMessage="Are you sure you want to send notification ?"
            cancelHndlr={toggleNotificationModal}
            confirmHndlr={sendNotificationHndler}
            isDisble={showApiLoader}
            showImgIcon={true}
            iconType='approve'
            btnClassName='btn w-sm btn-success'
        />
        <ModalContainerUpdated
            id="interview-result-cancel-admission"
            isOpen={confirmationModalState.showModal}
            toggle={toggleConfirmationModal}
            hideHeader={true}
            modalSize="md"
        >
            <ConfirmationModalIntRes
                isOpen={confirmationModalState.showModal}
                resultId={confirmationModalState.resultId}
                toggle={toggleConfirmationModal}
                modalTitle=""
                instituteId={instituteId}
                instituteName={"Assign Subjects"}
                branchId={branchId}
                selectedAcademicyearId= {panelInterviewResultListFilter.academicYearId}
            />
        </ModalContainerUpdated>
        <ModalContainerUpdated
            id="paymentdetails-modal"
            isOpen={paymentDetailsModalState.showModal}
            toggle={closePaymentDetailsModal}
            modalTitle="Payment Details"
            modalSize="md"
        >
            <PaymentDetailsModal
                toggleModal={closePaymentDetailsModal}
                modalInfo={paymentDetailsModalState.modalData}
            />
        </ModalContainerUpdated>

        <ModalContainerUpdated
            id="export-student-management-modal"
            isOpen={registerModalState.showModal}
            toggle={closeRegisterModalHndlr}
            modalTitle="Jodo Register"
            modalSize="md"
        >
            <ExportModal
                isOpen={registerModalState.showModal}
                toggle={closeRegisterModalHndlr}
                instituteId={instituteId}
                hideEnterRemarks
                branchId={branchId}
                submitHndlr={onSubmitJodoRegisterHndlr}
                feature="fee"
                subFeature="jodo_updates"
            />
        </ModalContainerUpdated>
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
    </>
    );
}

export default PanelInterviewResult
