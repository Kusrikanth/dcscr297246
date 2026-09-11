import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ConfirmationModal, MultiSelectCheckbox, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput, SearchInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { applicationData, mainApplicationStatus, completionStatus, generateColumns, hasStateChanged, isShowSendNotificationButton, modeOptions, paymentStatus, searchInputOptions } from './helper';
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import ApplicationSaleModal from './ApplicationSaleModal';
import { shallowEqual, useDispatch } from 'react-redux';
import { activeLinkAppSaleAct, cancelApplicationSaleById, exportAppSaleDataAct, getApplicationRemarksById, getApplicationSaleActList, getApplicationSaleById, getStatasticResp, resetApplicationSaleListAct, sendEmailNotificationStatus, sendPaymentLinkApplicationSaleStatus, sendSMSNotificationStatus } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { useAppSelector } from '../../../../hooks/storehook';
import { getInstAcademicYearAct } from '../../../../store/mastersettings/instacademics/instacademicactions';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { toast } from 'react-toastify';
import PreviewModal from './PreviewModal';
import PaymentDetails from './PaymentDetails';
import { setShowGlobalLoaderAct } from '../../../../store/global/globalslice';
import AdvanceFilterModal from './AdvancedFilterModal';
import { debounce, downloadExcelFile } from '../../../../utility/commonutility';
import CancelAdmissionModal from '../CancelAdmissionModal';
import ExportModal from '../../../Directory/StudentManagement/ExportModal';
import { HugeiconsIcon } from '@hugeicons/react';
import { CancelCircleIcon, Mail01Icon, MessagePreview01Icon, OnlineLearning02Icon, PencilEdit02Icon, PrinterIcon, SentIcon } from "@hugeicons-pro/core-stroke-standard";
import { sendRegistrationInCompleteFormAct } from '../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction';
import { useModal } from '../../../../hooks/modalhook';
import Button from '../../../../Components/Common/Button';
import ReviewRemarksModal from './ReviewRemarksModal';

const initialState = {
    search: null,
    academicYearId: null,
    curriculumId: null,
    classId: null,
    startDate: null,
    endDate: null,
    recentFollowupRemarksStartDate: null,
    recentFollowupRemarksEndDate: null,
    nextFollowupRemarksStartDate: null,
    nextFollowupRemarksEndDate: null,
    completionStatus: null,
    paymentStatus: null,
    mainApplicationStatus: null,
    currentStatus: null,
    admissionType: null,
    admissionSource: null,
    mode: null,
    genderId: null,
}

const ApplicationSale = ({ tabId }: any) => {
    const dispatch = useDispatch();
    const [allStudentsSelectedState, setAllStudentsSelectedState] = useState(false);
    const [applicationSaleState, setApplicationSaleState] = useState<any>([])

    const [applicationSaleFilter, setApplicationSaleFilter] = useState(initialState);
    const [open, setOpen] = useState<boolean>(false);
    const [showClearFilterState, setShowClearFilterState] = useState(false);
    const [count, setCount] = useState<any>(null);
    const [academicYearStatus, setAcademicYearStatus] = useState('CURRENT');
    const [searchStudentState, setSearchStudentState] = useState("global");

    const {
        openModal: sendInCompleteStdntNotifOpenModal,
        closeModal: sendInCompleteStdntNotifCloseModal,
        modalState: sendInCompleteStdntNotifModalState,
    } = useModal()
    const { openModal: reviewRemarksOpenModal, closeModal: reviewRemarksCloseModal, modalState: reviewRemarksModalState } = useModal()
    const [selectedReviewRemarksId, setSelectedReviewRemarksId] = useState<any>(null);

    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 10,
    })

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        applicationSaleListResp,
        sendPaymentLinkApplicationSaleStatusResp,
        sendEmailNotificationStatusResp,
        sendSMSNotificationStatusResp,
        cancelApplicationSaleByIdResp,
        downloadApplicationSaleByIdResp,
        generateFeeReceiptResp,
        showApiLoader,
        activeLinkAppSaleResp,
        applicationSaleError,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        exportRegistrationDataResp,
        exportAppSaleResp,
        loggedInUserRole,
        registrationInCompleteFormResp,
        saveApplicationRemarksByIdResp
    }: any = useAppSelector(
        ({ classroomManagmentInfo, assignGroupInfo, instAcademics, branchAcademics, appData, feeConcession, feeCollections, applicationSale, globalData, admissionRegistration }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            applicationSaleListResp: applicationSale.applicationSaleListResp,
            sendPaymentLinkApplicationSaleStatusResp: applicationSale.sendPaymentLinkApplicationSaleStatusResp,
            sendEmailNotificationStatusResp: applicationSale.sendEmailNotificationStatusResp,
            sendSMSNotificationStatusResp: applicationSale.sendSMSNotificationStatusResp,
            cancelApplicationSaleByIdResp: applicationSale.cancelApplicationSaleByIdResp,
            downloadApplicationSaleByIdResp: applicationSale.downloadApplicationSaleByIdResp,
            activeLinkAppSaleResp: applicationSale.activeLinkAppSaleResp,
            generateFeeReceiptResp: applicationSale.generateFeeReceiptResp,
            exportAppSaleResp: applicationSale.exportAppSaleResp,
            exportRegistrationDataResp: applicationSale.exportRegistrationDataResp,
            showApiLoader: globalData.showApiLoader,
            applicationSaleError: applicationSale.applicationSaleError,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            loggedInUserRole: appData.loggedInUserRole,
            registrationInCompleteFormResp: admissionRegistration.registrationInCompleteFormResp,
            saveApplicationRemarksByIdResp: applicationSale.saveApplicationRemarksByIdResp,
        }),
        shallowEqual
    );

    const canCreateAndUpdate = useMemo(() => {
        return loggedInUserRole !== 'ACCOUNT_HEAD' && loggedInUserRole !== 'PRINCIPAL'
            && loggedInUserRole !== 'VICE_PRINCIPAL' && loggedInUserRole !== 'HOD' && loggedInUserRole !== 'PA'
    }, [loggedInUserRole]);

    const menuOptions = useMemo(
        () => {
            const actions = [
                {
                    id: "edit",
                    actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
                    actionName: "Edit",
                    onClickHndlr: (event: any) => {
                        let itFormId = event.currentTarget.getAttribute('data-id');
                        toggleApplicationSaleModal(itFormId)
                    },
                },
                {
                    id: "sendNotification",
                    actionIcon: <HugeiconsIcon icon={Mail01Icon} className="me-2 text-muted" size={18} />,
                    actionName: "Reset Password",
                    onClickHndlr: (event: any) => {
                        let itFormId = event.currentTarget.getAttribute('data-id');
                        toggleSendNotificationModal(itFormId);
                    },
                },
                {
                    id: "activateLink",
                    actionIcon: <HugeiconsIcon icon={OnlineLearning02Icon} className="me-2 text-muted" size={18} />,
                    actionName: "Activate link",
                    onClickHndlr: (event: any) => {
                        let id = event.currentTarget.getAttribute('data-id');
                        toggleActivationConfirmationModal(id)
                    },
                },
                {
                    id: "print",
                    actionIcon: <HugeiconsIcon icon={PrinterIcon} className="me-2 text-muted" size={18} />,
                    actionName: "Print",
                    onClickHndlr: (event: any) => {
                        let itFormId = event.currentTarget.getAttribute('data-id');
                        togglePreviewApplicationSaleModal(itFormId)
                    },
                },
                {
                    id: "generateReceipt",
                    actionIcon: <HugeiconsIcon icon={Mail01Icon} className="me-2 text-muted" size={18} />,
                    actionName: "Generate Receipt",
                    onClickHndlr: (event: any) => {
                        let itFormId = event.currentTarget.getAttribute('data-id');
                        toggleGenerateReceiptModal(itFormId)
                        setPreviewApplicationSale((prev: any) => ({ ...prev, applicationId: itFormId }))
                    },
                },
                {
                    id: "sendPaymentLink",
                    actionIcon: <HugeiconsIcon icon={Mail01Icon} className="me-2 text-muted" size={18} />,
                    actionName: "Send Payment Link",
                    onClickHndlr: (event: any) => {
                        let itFormId = event.currentTarget.getAttribute('data-id');
                        toggleSendPaymentLinkConfirmationModal(itFormId);
                    },
                },
                {
                    id: "cancelAdmission",
                    actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="me-2 text-danger" size={18} />,
                    actionName: "Cancel Admission",
                    onClickHndlr: (event: any) => {
                        let itFormId = event.currentTarget.getAttribute('data-id');
                        toggleCancelAdmissionModal(itFormId)
                    },
                },
            ]
            if (loggedInUserRole === "ADM_HEAD" || loggedInUserRole === "ADM_CONS") {
                return actions.filter(item => item.id !== 'generateReceipt');
            }
            return actions;
        },
        [loggedInUserRole, applicationSaleState]
    );

    const canExport = useMemo(() => {
        return loggedInUserRole !== 'ACCOUNT'
    }, [loggedInUserRole]);

    const [applicationSaleModal, setApplicationSaleModal] = useState<any>({
        showModal: false,
        applicationId: undefined
    })
    const [previewApplicationSale, setPreviewApplicationSale] = useState<any>({
        showModal: false,
        applicationId: undefined
    })
    const [generateReceiptModal, setGenerateReceiptModal] = useState<any>({
        showModal: false,
        applicationId: undefined
    })
    const [sendPaymentLinkConfirmationModal, setSendPaymentLinkConfirmationModal] = useState<any>({
        showModal: false,
        applicationId: undefined
    })
    const [sendNotificationModal, setSendNotificationModal] = useState<any>({
        showModal: false,
        applicationId: undefined
    })
    const [cancelAdmissionModal, setCancelAdmissionModal] = useState<any>({
        showModal: false,
        applicationId: undefined
    })

    const ApplicationSaleList = (otherProps?: any) => {
        let payload = { orderBy: "DESC", sortBy: "createdAt", ...applicationSaleFilter, ...paginationDetailRef.current, ...otherProps, branchId: branchId }
        let { classId, currentStatus } = payload;
        if (Array.isArray(classId)) {
            const classIds = classId.map(item => item.id);
            payload.classId = classIds;
        }
        if (Array.isArray(currentStatus)) {
            const currentStatusIds = currentStatus.map(item => item.id);
            payload.currentStatus = currentStatusIds;
        }
        if (payload.academicYearId) {
            dispatch(getApplicationSaleActList(generateActionPayload('get_application_sale_list', undefined, payload)))
        }
        else {
            dispatch(resetApplicationSaleListAct(undefined));
        }
    }

    const toggleApplicationSaleModal = (applicationId?: any, apiCall?: any) => {
        setApplicationSaleModal((prev: any) => ({ ...prev, showModal: !prev.showModal, applicationId: typeof (applicationId) === "string" ? applicationId : undefined }));

        if (typeof (apiCall) === 'boolean' && apiCall) {
            ApplicationSaleList()
        }
    }
    const togglePreviewApplicationSaleModal = (applicationId?: any) => {
        setPreviewApplicationSale((prev: any) => ({ ...prev, showModal: !prev.showModal, applicationId: typeof (applicationId) === "string" ? applicationId : undefined }));
    }
    const toggleGenerateReceiptModal = (applicationId?: any, apiCall?: any) => {
        setGenerateReceiptModal((prev: any) => ({ ...prev, showModal: !prev.showModal, applicationId: typeof (applicationId) === "string" ? applicationId : undefined }));


        if (typeof (apiCall) === 'boolean' && apiCall) {
            ApplicationSaleList()
        }
    }
    const toggleSendPaymentLinkConfirmationModal = (applicationId?: any) => {
        setSendPaymentLinkConfirmationModal((prev: any) => ({ ...prev, showModal: !prev.showModal, applicationId: typeof (applicationId) === "string" ? applicationId : undefined }));
    }
    const toggleSendNotificationModal = (applicationId?: any) => {
        setSendNotificationModal((prev: any) => ({ ...prev, showModal: !prev.showModal, applicationId: typeof (applicationId) === "string" ? applicationId : undefined }));
    }
    const toggleCancelAdmissionModal = (applicationId?: any, apiCall?: any) => {
        setCancelAdmissionModal((prev: any) => ({ ...prev, showModal: !prev.showModal, applicationId: typeof (applicationId) === "string" ? applicationId : undefined }));

        if (typeof (apiCall) === 'boolean' && apiCall) {
            ApplicationSaleList();
        }
    }

    const ConfirmSendPaymentLink = () => {
        dispatch(setShowGlobalLoaderAct(true));
        dispatch(sendPaymentLinkApplicationSaleStatus(generateActionPayload('send_payment_link_application_sell', { applicationSaleId: sendPaymentLinkConfirmationModal.applicationId })));
    }
    const ConfirmSendNotification = () => {
        dispatch(setShowGlobalLoaderAct(true));
        dispatch(sendEmailNotificationStatus(generateActionPayload('send_email_notification_application_sell', { applicationSaleId: sendNotificationModal.applicationId })));
        dispatch(sendSMSNotificationStatus(generateActionPayload('send_sms_notification_application_sell', { applicationSaleId: sendNotificationModal.applicationId })));
    }
    const ConfirmCancelAdmission = (reason?: any, recommendedCampusId?: any, curriculumId?: any, classId?: any) => {
        dispatch(setShowGlobalLoaderAct(true));
        dispatch(cancelApplicationSaleById(generateActionPayload('cancel_admission_application_sell', { applicationSaleId: cancelAdmissionModal.applicationId }, { reason, recommendedCampusId, curriculumId, recommendedClassId: classId })));
    }

    const ChangeHandler = (event: any) => {
        const { name, value } = event.target;
        paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
        let stateChanged = hasStateChanged({ ...applicationSaleFilter, [name]: value, academicYearId: "" });
        if (name === "academicYearId") {
            let year = academicYearListResp && academicYearListResp.data.find((year: any) => year.academicYearId === +value);
            !(value === "") && dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId: +value, branchId })))
            setAcademicYearStatus(year?.yearStatus);
            dispatch(resetBrchClassAct(undefined));
            getCurriculumApiCall({ academicYearId: value });
            setApplicationSaleFilter((prev: any) => ({ ...prev, [name]: value, classId: null, curriculumId: null }));
            stateChanged = hasStateChanged({ ...applicationSaleFilter, academicYearId: "", classId: null, curriculumId: null });
        }
        else {
            setApplicationSaleFilter((prev: any) => ({ ...prev, [name]: value }));
        }
        if ((name === "paymentStatus" && !value) || (name === "completionStatus" && !value)) {
            ApplicationSaleList({ [name]: null });
        } else if (name === "academicYearId") {
            ApplicationSaleList({ [name]: value, classId: null, curriculumId: null });
        } else {
            ApplicationSaleList({ [name]: value });
        }

        setShowClearFilterState(stateChanged.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged.count)
    }
    function search(value: any) {
        ApplicationSaleList({ "search": value });
    }

    const debounceFun = useCallback(debounce(search, 200), [applicationSaleListResp]);
    const searchHandler = (event: any) => {
        const { name, value } = event.target;
        const stateChanged = hasStateChanged({ ...applicationSaleFilter, [name]: value, academicYearId: "" });
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
        setApplicationSaleFilter((prev: any) => ({ ...prev, [name]: value }));
        paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 };
        debounceFun(value)
    }

    function getClassApiCall(curriculumId: string, academicYearId?: string) {
        // sortBy: "className", orderBy: "asc"
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId, academicYearId: academicYearId || applicationSaleFilter.academicYearId };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        ApplicationSaleList(paginationInfo);
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: applicationSaleFilter.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(
            getInstAcademicYearAct(
                generateActionPayload("get_inst_academic_year", undefined, payload)
            )
        );

        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let { academicYearId } = data.find((year: any) => year.isAdmissionDefault) || {};
            if (academicYearId) {
                // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
                setApplicationSaleFilter((prev: any) => ({ ...prev, academicYearId }));
                ApplicationSaleList({ academicYearId });
                getCurriculumApiCall({ academicYearId });
            }
        }
    }, [academicYearListResp]);

    const applicationSaleRef = useRef({
        prevSendPaymentLinkApplicationSaleStatusResp: sendPaymentLinkApplicationSaleStatusResp,
        prevSendEmailNotificationStatusResp: sendEmailNotificationStatusResp,
        prevSendSMSNotificationStatusResp: sendSMSNotificationStatusResp,
        prevCancelApplicationSaleByIdResp: cancelApplicationSaleByIdResp,
        prevGenerateFeeReceiptResp: generateFeeReceiptResp,
        prevActiveLinkAppSaleResp: activeLinkAppSaleResp,
        prevExportAppSaleResp: exportAppSaleResp,
        prevRegistrationInCompleteFormResp: registrationInCompleteFormResp,
        prevApplicationSaleError: applicationSaleError,
        prevSaveApplicationRemarksByIdResp: saveApplicationRemarksByIdResp
    })


    useEffect(() => {
        const { prevSendPaymentLinkApplicationSaleStatusResp, prevSendEmailNotificationStatusResp, prevActiveLinkAppSaleResp, prevSendSMSNotificationStatusResp, prevCancelApplicationSaleByIdResp, prevExportAppSaleResp,
            prevRegistrationInCompleteFormResp, prevApplicationSaleError, prevSaveApplicationRemarksByIdResp } = applicationSaleRef.current;

        if (sendPaymentLinkApplicationSaleStatusResp && sendPaymentLinkApplicationSaleStatusResp !== prevSendPaymentLinkApplicationSaleStatusResp) {
            dispatch(setShowGlobalLoaderAct(false));
            toast.success('Payment Link Sent Successfully.');
            toggleSendPaymentLinkConfirmationModal();
        }
        else if (sendEmailNotificationStatusResp && sendEmailNotificationStatusResp !== prevSendEmailNotificationStatusResp) {
            dispatch(setShowGlobalLoaderAct(false));
            toast.success('Notification Sent Successfully.');
            toggleSendNotificationModal();
        }
        else if (registrationInCompleteFormResp && registrationInCompleteFormResp !== prevRegistrationInCompleteFormResp) {
            toast.success('Notification sent successfully');
            sendInCompleteStdntNotifCloseModal();
            setAllStudentsSelectedState(false)
            ApplicationSaleList()
        }
        else if (cancelApplicationSaleByIdResp && cancelApplicationSaleByIdResp !== prevCancelApplicationSaleByIdResp) {
            dispatch(setShowGlobalLoaderAct(false));
            toast.success('Admission Canceled Successfully.');
            toggleCancelAdmissionModal(undefined, true);
        }
        else if (activeLinkAppSaleResp && activeLinkAppSaleResp !== prevActiveLinkAppSaleResp) {
            toast.success('Login Details sent Successfully.');
            toggleActivationConfirmationModal()
        }
        else if (exportAppSaleResp && exportAppSaleResp !== prevExportAppSaleResp) {
            downloadExcelFile(exportAppSaleResp, 'application_sale')
            toast.success(' Excel file Successfully Download .');
            toggleExportConfirmationModal()
        }
        else if (saveApplicationRemarksByIdResp && saveApplicationRemarksByIdResp !== prevSaveApplicationRemarksByIdResp) {
            toast.success('Remarks saved successfully.');
            handleReviewRemarks(selectedReviewRemarksId);
            ApplicationSaleList();
        }
        else if (applicationSaleError && applicationSaleError !== prevApplicationSaleError) {
            const { details } = applicationSaleError || {}
            toast.error(details);
        }

        applicationSaleRef.current.prevSendPaymentLinkApplicationSaleStatusResp = sendPaymentLinkApplicationSaleStatusResp;
        applicationSaleRef.current.prevSendEmailNotificationStatusResp = sendEmailNotificationStatusResp;
        applicationSaleRef.current.prevSendSMSNotificationStatusResp = sendSMSNotificationStatusResp;
        applicationSaleRef.current.prevCancelApplicationSaleByIdResp = cancelApplicationSaleByIdResp;
        applicationSaleRef.current.prevActiveLinkAppSaleResp = activeLinkAppSaleResp;
        applicationSaleRef.current.prevExportAppSaleResp = exportAppSaleResp;
        applicationSaleRef.current.prevRegistrationInCompleteFormResp = registrationInCompleteFormResp;
        applicationSaleRef.current.prevApplicationSaleError = applicationSaleError;
        applicationSaleRef.current.prevSaveApplicationRemarksByIdResp = saveApplicationRemarksByIdResp;
    }, [sendPaymentLinkApplicationSaleStatusResp, sendEmailNotificationStatusResp, sendSMSNotificationStatusResp, cancelApplicationSaleByIdResp, applicationSaleError, activeLinkAppSaleResp, exportAppSaleResp, registrationInCompleteFormResp, saveApplicationRemarksByIdResp])

    useEffect(() => {
        const { prevGenerateFeeReceiptResp } = applicationSaleRef.current
        if (generateFeeReceiptResp && generateFeeReceiptResp !== prevGenerateFeeReceiptResp) {
            setPreviewApplicationSale((prev: any) => ({ ...prev, showModal: !prev.showModal }))
            toggleGenerateReceiptModal(undefined, true);
            toast.success('Payment Status Updated Successfully.')
            dispatch(setShowGlobalLoaderAct(false));
        }
        applicationSaleRef.current.prevGenerateFeeReceiptResp = generateFeeReceiptResp;
    }, [generateFeeReceiptResp])

    const [activationConfirmationModalState, setActivationConfirmationModalState] =
        useState<any>({
            showModal: false,
            resultId: "",
        });
    const [exportConfirmationModal, setExportConfirmationModal] =
        useState<any>({
            showModal: false,
            resultId: "",
        });

    const toggleActivationConfirmationModal = (id?: any) => {
        setActivationConfirmationModalState((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            resultId: id || "",
        }));
    };
    const toggleExportConfirmationModal = (id?: any) => {
        setExportConfirmationModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            resultId: id || "",
        }));
    };

    const resetBtnHndler = () => {
        if (academicYearListResp) {

            let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            setApplicationSaleFilter({ ...initialState, academicYearId })
            ApplicationSaleList({ ...initialState, academicYearId });
        }

    }

    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        paginationDetailRef.current.pageNo = 0;
        setApplicationSaleFilter((prevState: any) => ({ ...prevState, ...appliedFilters }));
        const stateChanged = hasStateChanged({ ...applicationSaleFilter, ...appliedFilters, academicYearId: "" });
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
        setShowClearFilterState(stateChanged?.stateChange)
        ApplicationSaleList(appliedFilters)
    }

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }

    useEffect(() => {
        if (applicationSaleListResp) {
            setOpen(false);
        }
    }, [applicationSaleListResp])

    const clearFilterHndlr = () => {
        if (academicYearListResp) {
            paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
            let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            dispatch(resetBrchClassAct(undefined));
            setCount(null)
            setApplicationSaleFilter({ ...initialState, academicYearId })
            ApplicationSaleList({ ...initialState, academicYearId })
            setShowClearFilterState(false)
        }
    }

    const activationLinkModalHndler = () => {
        dispatch(activeLinkAppSaleAct(generateActionPayload('app_sale_active_link', { id: activationConfirmationModalState?.resultId }
        )))
    }

    const exportModalHndler = () => {
        const payload: any = { branchId, ...applicationSaleFilter, orderBy: "DESC", sortBy: "createdAt" }
        let { classId, currentStatus } = payload;
        if (Array.isArray(classId)) {
            const classIds = classId.map(item => item.id);
            payload.classId = classIds;
        }
        if (Array.isArray(currentStatus)) {
            const currentStatusIds = currentStatus.map(item => item.id);
            payload.currentStatus = currentStatusIds;
        }

        dispatch(exportAppSaleDataAct(generateActionPayload('export_app_sale_data', undefined, payload, {
            responseType: 'blob'
        })))
    }

    function onSearchHandler(name: string, value: any) {
        paginationDetailRef.current.pageNo = 0;
        setSearchStudentState((prev) => {
            const updatedFilterType = prev;
            setApplicationSaleFilter((prevState) => {
                const updatedState = {
                    ...prevState,
                    search: value,
                    filterTypeName: updatedFilterType
                };
                ApplicationSaleList(updatedState);
                return updatedState;
            });
            return updatedFilterType;
        });
    }

    function onChangeHandler(name: string, id: any, item: any) {
        setSearchStudentState(id);
        paginationDetailRef.current.pageNo = 0;
        setApplicationSaleFilter((prevState) => {
            const updatedState = {
                ...prevState,
                filterTypeName: id,
                searchString: ""
            };
            ApplicationSaleList(updatedState);
            return updatedState;
        });
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classList } = branchClassResp || {};
    const { data: applicationSaleData, totalElements, totalPages, pageSize, pageNumber } = applicationSaleListResp || {};

    // const allStudentsCheckHndlr = useCallback((event:any) => {
    //         const {checked} = event.target;
    //         setAllStudentsSelectedState(checked)
    //         let updateStudentState = [...applicationSaleState];
    //         updateStudentState.forEach((item:any) => {
    //             item.isSelected = checked
    //         })
    //         console.log(updateStudentState)
    //         setApplicationSaleState(updateStudentState)
    //     },[applicationSaleState])

    const allStudentsCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentsSelectedState(checked);

        let updateStudentState = applicationSaleState.map((item: any) => {
            const shouldForceFalse = applicationData?.includes(item?.admissionProcess) || item?.admissionCancel?.toLowerCase() === "yes";

            return {
                ...item,
                isSelected: shouldForceFalse ? false : checked
            };
        })
        setApplicationSaleState(updateStudentState);
    }, [applicationSaleState, applicationData])

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget;
        const id = event.currentTarget.getAttribute("data-id")
        const rowIndex = applicationSaleState.findIndex((item: any) => +item.id === Number(id))
        if (rowIndex > -1) {
            const studentDetails: any = applicationSaleState[rowIndex]
            let updateStudentState: any = [...applicationSaleState];
            updateStudentState.splice(rowIndex, 1, { ...studentDetails, isSelected: checked })
            setApplicationSaleState(updateStudentState)
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected)
            setAllStudentsSelectedState(isAllSelected)
        }
    }, [applicationSaleState])

    useEffect(() => {
        if (applicationSaleListResp?.data?.length > 0) {
            setApplicationSaleState(applicationSaleListResp?.data?.map((item: any) => {
                return { ...item, isSelected: false }
            }))
        }
        else {
            setApplicationSaleState([])
        }
    }, [applicationSaleListResp])

    const sendInCompleteStndNotificationHndler = () => {
        const sendInCompleteStndsList = applicationSaleState
            ?.filter((item: any) => item?.isSelected)
            .map((item: any) => item?.applicationSaleId) || [];

        dispatch(sendRegistrationInCompleteFormAct(generateActionPayload('send_reg_incomplete_form', { instituteId, branchId, ids: sendInCompleteStndsList.join(","), isRegistrationScreen: tabId === "registration" }, undefined)))
    }

    const showSendNotificationBtn = useMemo(() => isShowSendNotificationButton(applicationSaleState), [applicationSaleState])
    
    const handleReviewRemarks = useCallback((id: any) => {
        setSelectedReviewRemarksId(id);
        dispatch(
            getApplicationRemarksById(
                generateActionPayload(
                    "get_application_remarks_by_id",
                    { applicationSaleId: id },
                    // { screen: "APPLICATION_SALE" }
                )
            )
        );

        reviewRemarksOpenModal({ id });
    }, [dispatch, reviewRemarksOpenModal]);

    const roleColumns = useMemo(() => {
        const columns = generateColumns(menuOptions, academicYearStatus,
            allStudentsSelectedState,
            allStudentsCheckHndlr,
            singleStudentCheckHndlr,
            applicationSaleFilter.completionStatus,
        handleReviewRemarks);
        if (loggedInUserRole === 'PRINCIPAL' ||
            loggedInUserRole === 'VICE_PRINCIPAL' ||
            loggedInUserRole === 'HOD' ||
            loggedInUserRole === 'PA'
        ) {
            return columns.filter(item => item.accessor !== 'actions');
        }
        return columns;
    }, [academicYearStatus, loggedInUserRole, allStudentsSelectedState, allStudentsCheckHndlr, singleStudentCheckHndlr, applicationSaleFilter.completionStatus, applicationSaleState, generateColumns]);

    return (<>
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-inline-block tw-w-full">
            <div className="tw-flex tw-items-center tw-p-2 tw-px-3 tw-border-b tw-border-gray-200">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Application List
                </h4>
                <div className="tw-ml-auto tw-text-center tw-flex tw-gap-3">
                    {canCreateAndUpdate && (
                        <Button
                        variant='primary'
                            onClick={toggleApplicationSaleModal}
                        >
                            <div className="tw-flex tw-items-center">
                                <span><i className="ri-add-line tw-mr-1" /></span>
                                <span>Add Request</span>
                            </div>
                        </Button>
                    )}
                    {canExport && (
                        <Button
                        variant='info'
                            onClick={toggleExportConfirmationModal}
                        >
                            <div className="tw-flex tw-items-center tw-text-white">
                                <span><i className="ri-add-line tw-mr-1" /></span>
                                <span>Export</span>
                            </div>
                        </Button>
                    )}
                    {!showSendNotificationBtn && (
                        <button
                            className="tw-inline-flex tw-items-center tw-px-3 tw-py-2 tw-text-sm tw-font-medium tw-text-white tw-rounded tw-ml-3 tw-transition-colors tw-duration-150"
                            style={{ background: "#299CDB", border: "none" }}
                            onClick={sendInCompleteStdntNotifOpenModal}
                        >
                            <div className="tw-flex tw-items-center tw-text-white">
                                <HugeiconsIcon icon={SentIcon} className="tw-mr-2" size={18} />
                                <span>Send Notification</span>
                            </div>
                        </button>
                    )}
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-12 tw-px-3 tw-gap-3 tw-py-3">
                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-4">
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

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="academicYearId"
                        value={applicationSaleFilter?.academicYearId}
                        onChange={ChangeHandler}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        labelText="Academic Year"
                        floatingLabel
                    />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2 2xl:tw-col-span-2">
                    <SelectInput
                        name="paymentStatus"
                        value={applicationSaleFilter?.paymentStatus}
                        onChange={ChangeHandler}
                        menuItems={paymentStatus || []}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        labelText="Payment Status"
                        floatingLabel
                    />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2 2xl:tw-col-span-2">
                    <SelectInput
                        name="mainApplicationStatus"
                        value={applicationSaleFilter?.mainApplicationStatus}
                        onChange={ChangeHandler}
                        menuItems={mainApplicationStatus || []}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        labelText="Application Status"
                        floatingLabel
                    />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-1 tw-relative">
                    <button
                        onClick={toggleAdvanceFilter}
                        className="tw-flex tw-items-center tw-gap-2 tw-bg-[#F4F7FA] tw-p-2 tw-rounded"
                    >
                        <FilterSvg height="18px" width="18px" />
                        <span>Filters</span>
                    </button>
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
                            className="tw-whitespace-nowrap"
                        >
                            Clear filter
                        </Button>
                    )}
                </div>
            </div>

            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="application-sale-advance-filter"
            >
                <AdvanceFilterModal
                    getClassApiCall={getClassApiCall}
                    appliedFilter={applicationSaleFilter}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                    getCurriculumApiCall={getCurriculumApiCall}
                />
            </OffCanvasContainer>

            <TableContainer
                columns={roleColumns}
                data={applicationSaleState || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
            />
        </div>
        <ModalContainerUpdated
            id="add-specialfee-modal"
            isOpen={applicationSaleModal.showModal}
            toggle={toggleApplicationSaleModal}
            modalTitle="Application Form"
            modalSize="lg"
        >
            <ApplicationSaleModal isOpen={applicationSaleModal.showModal} applicationId={applicationSaleModal.applicationId} toggle={toggleApplicationSaleModal} />
        </ModalContainerUpdated>
        <ConfirmationModal
            id="application-sale-send-apyment-link"
            isOpen={sendPaymentLinkConfirmationModal.showModal}
            confirmMessage="Are you sure you want to send payment link?"
            cancelHndlr={toggleSendPaymentLinkConfirmationModal}
            confirmHndlr={ConfirmSendPaymentLink}
            isDisble={showApiLoader}
            showImgIcon={true}
            iconType='approve'
            btnClassName='btn w-sm btn-success'
        />
        <ConfirmationModal
            id="application-sale-sen-notification"
            isOpen={sendNotificationModal.showModal}
            confirmMessage="Are you sure you want to send notification?"
            cancelHndlr={toggleSendNotificationModal}
            confirmHndlr={ConfirmSendNotification}
            isDisble={showApiLoader}
            showImgIcon={true}
            iconType='approve'
            btnClassName='btn w-sm btn-success'
        />

        <ModalContainerUpdated
            id="show-receipt-preview"
            isOpen={previewApplicationSale.showModal}
            toggle={togglePreviewApplicationSaleModal}
            modalTitle="Preview Receipt"
            modalSize="lg"
        >
            <PreviewModal isOpen={previewApplicationSale.showModal} applicationId={previewApplicationSale.applicationId} />
        </ModalContainerUpdated>
        <ModalContainerUpdated
            id="show-receipt-preview"
            isOpen={generateReceiptModal.showModal}
            toggle={toggleGenerateReceiptModal}
            modalTitle="Generate Receipt"
            modalSize="lg"
        >
            <PaymentDetails isOpen={generateReceiptModal.showModal} applicationSaleId={generateReceiptModal.applicationId} toggle={toggleGenerateReceiptModal} />
        </ModalContainerUpdated>
        <ConfirmationModal
            id="application-sale-coonfirm-modal"
            isOpen={activationConfirmationModalState.showModal}
            confirmMessage="You want to send Login Details ?"
            cancelHndlr={toggleActivationConfirmationModal}
            confirmHndlr={activationLinkModalHndler}
            isDisble={showApiLoader}
            showImgIcon={true}
            iconType='approve'
            btnClassName='btn w-sm btn-success'
        />
        <ModalContainerUpdated
            id="application-sale-export-modal"
            isOpen={exportConfirmationModal.showModal}
            toggle={toggleExportConfirmationModal}
            modalTitle="Export Application Sale Data"
            modalSize="md"
        >
            <ExportModal
                isOpen={exportConfirmationModal.showModal}
                toggle={toggleExportConfirmationModal}
                instituteId={instituteId}
                branchId={branchId}
                submitHndlr={exportModalHndler}
                feature="admission"
                subFeature="application_sale"
                remarksText="Enter remarks to export application sale data?"
            />
        </ModalContainerUpdated>
        <ModalContainerUpdated
            id="application-sale-cancel-admission"
            isOpen={cancelAdmissionModal.showModal}
            toggle={toggleCancelAdmissionModal}
            modalSize="md"
            hideHeader={true}
        >
            <CancelAdmissionModal
                isOpen={cancelAdmissionModal.showModal}
                toggle={toggleCancelAdmissionModal}
                modalTitle=""
                showApiLoader={showApiLoader}
                submitHandler={ConfirmCancelAdmission}
                selectedAcademicyearId={applicationSaleFilter.academicYearId}
            />
        </ModalContainerUpdated>
        <ConfirmationModal
            id="send-incomplete-notifications"
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
    </>
    );
}

export default ApplicationSale
