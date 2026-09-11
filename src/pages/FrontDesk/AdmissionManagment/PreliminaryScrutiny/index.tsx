import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ConfirmationModal, ModalContainer, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { default as ApproveSvg } from "../../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { AdmissionTypeMenuOptions, ScrutinyStatus, generateColumns, hasStateChanged } from './helper';
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as EyeSvg } from "../../../../assets/imagesdps/academics/EyeSvg.svg?react";
import { default as DocumentSvg } from "../../../../assets/imagesdps/directory/step-icons/documents.svg?react";
import PreliminaryScrutinyModal from './PreliminaryScrutinyModal';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { getInstAcademicYearAct } from '../../../../store/mastersettings/instacademics/instacademicactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { cancelAdmissionInPreliminaryAct, exportScrutinyDataAct, generateAdmissionFormPdfAct, getPreliminaryScrutiny, getPreliminaryScrutinyById, getStatasticResp, resetPreliminaryScrutinyList, sendReminderDocResubmissionAct } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { IPaginationState } from '../../../../Components/Common/Pagination';
import { toast } from 'react-toastify';
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import ShowDocumentModal from './ShowDocumentModal';
import { IAssignGroupOpenModal } from './PreliminaryScrutinyTypes';
import ConfirmationModalPreliminaryScrutinty from './ConfirmationModalPreliminaryScrutinty';
import { setShowGlobalLoaderAct } from '../../../../store/global/globalslice';
import { default as CrossSvg } from "../../../../assets/imagesdps/academics/CrossSvg.svg?react";
import AdvanceFilterModal from './AdvancedFilterModal';
import { debounce, downloadExcelFile } from '../../../../utility/commonutility';
import CancelAdmissionModal from '../CancelAdmissionModal';
import ExportModal from '../../../Directory/StudentManagement/ExportModal';
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkBadge02StrokeStandard, DocumentValidationIcon, Monocle01Icon, ReminderIcon, UserIdVerificationIcon } from "@hugeicons-pro/core-stroke-standard";
import Button from '../../../../Components/Common/Button';


const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    searchString: "",
    scrutinyStatus: null,
    admissionType: null,
    startDate: "",
    endDate: "",
    admissionSource: null,
}

const PreliminaryScrutiny = () => {

    const dispatch = useDispatch();

    const [initialState, setInitialState] = useState(initialValues);
    const [open, setOpen] = useState<boolean>(false);
    const [count, setCount] = useState<any>();
    const [showClearFilterState, setShowClearFilterState] = useState(false);
    const paginationInfoDetails = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const [confirmationModalState, setConfirmationModalState] =
        useState<IAssignGroupOpenModal>({
            showModal: false,
            branchId: "",
            scrutinyId: "",
            studentRegId: ""
        });


    const {
        academicYearListResp,
        preliminaryScrutinyList,
        statusOfPreliminaryScrutiny,
        updatePreliminaryScrutinyDocumentStatusResp,
        generateAdmissionFormPdfResp,
        brchCurriculumResp,
        branchClassResp,
        applicationSaleError,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        currentInstCodeResp: instituteCode,
        acceptAdmissionApprovalResp,
        cancelAdmissionInPreliminaryResp,
        exportScrutinyDataResp,
        sendReminderDocResubmissionResp,
        showApiLoader,
    } = useAppSelector(
        ({ classroomManagmentInfo, assignGroupInfo, instAcademics, globalData, branchAcademics, appData, feeConcession, feeCollections, applicationSale }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            cancelAdmissionInPreliminaryResp: applicationSale.cancelAdmissionInPreliminaryResp,
            preliminaryScrutinyList: applicationSale.preliminaryScrutinyList,
            showApiLoader: globalData.showApiLoader,
            acceptAdmissionApprovalResp: applicationSale.acceptAdmissionApprovalResp,
            statusOfPreliminaryScrutiny: applicationSale.statusOfPreliminaryScrutiny,
            sendReminderDocResubmissionResp: applicationSale.sendReminderDocResubmissionResp,
            exportScrutinyDataResp: applicationSale.exportScrutinyDataResp,
            updatePreliminaryScrutinyDocumentStatusResp: applicationSale.updatePreliminaryScrutinyDocumentStatusResp,
            generateAdmissionFormPdfResp: applicationSale.generateAdmissionFormPdfResp,
            applicationSaleError: applicationSale.applicationSaleError,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentInstCodeResp: appData.currentInstCodeResp,
        }),
        shallowEqual
    );

    const PreliminaryScrutinyList = (otherProps?: any) => {
        const payload = { ...initialState, ...paginationInfoDetails.current, ...otherProps, branchId: branchId };
        if (payload.academicYearId) {
            dispatch(getPreliminaryScrutiny(generateActionPayload('get_priliminary_scrutiny_list', undefined, payload)))
        }
        else {
            dispatch(resetPreliminaryScrutinyList(undefined));
        }
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: initialState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const ChangeHandler = (event: any) => {

        const { name, value } = event.target;
        paginationInfoDetails.current = { ...paginationInfoDetails.current, pageNo: 0 }
        let stateChanged = hasStateChanged({ ...initialState, [name]: value, academicYearId: "" });
        if (name === "academicYearId") {
            !(value === "") && dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId: +value, branchId })))
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetBrchClassAct(undefined));
            setInitialState((prev: any) => ({ ...prev, [name]: value, classId: null, curriculumId: "" }));
            stateChanged = hasStateChanged({ ...initialState, academicYearId: "", classId: null, curriculumId: "" });
        }
        else {
            setInitialState((prev: any) => ({ ...prev, [name]: value }));
        }
        if ((name === "scrutinyStatus" && !value) || (name === "admissionType" && !value)) {
            PreliminaryScrutinyList({ [name]: null });
        } else if (name === "academicYearId") {
            PreliminaryScrutinyList({ [name]: value, classId: null, curriculumId: "" });
        } else {
            PreliminaryScrutinyList({ [name]: value });
        }

        setShowClearFilterState(stateChanged.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged.count)
    }


    function search(value: any) {
        PreliminaryScrutinyList({ "searchString": value });
    }

    const debounceFun = useCallback(debounce(search, 200), [preliminaryScrutinyList]);
    const searchHandler = (event: any) => {
        const { name, value } = event.target;
        const stateChanged = hasStateChanged({ ...initialState, [name]: value, academicYearId: "" });
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
        setInitialState((prev: any) => ({ ...prev, [name]: value }));
        paginationInfoDetails.current = { ...paginationInfoDetails.current, pageNo: 0 };
        debounceFun(value)
    }
    function downloadPdfFile(blobStream: any, fileName: any) {
        const url = window.URL.createObjectURL(new Blob([(blobStream)], { type: "application/pdf" }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
            getCurriculumApiCall({ academicYearId: yearId });
            setInitialState((prev: any) => ({ ...prev, academicYearId: yearId }))
            PreliminaryScrutinyList({ academicYearId: yearId })
        }
    }, [academicYearListResp]);
    const preliminaryScrutinyModalRef = useRef({
        prevGenerateAdmissionFormPdfResp: generateAdmissionFormPdfResp
    })

    useEffect(() => {
        const { prevGenerateAdmissionFormPdfResp } = preliminaryScrutinyModalRef.current;
        if (generateAdmissionFormPdfResp && generateAdmissionFormPdfResp !== prevGenerateAdmissionFormPdfResp) {
            toggleConsolidatedViewConfomationModal(undefined);
            downloadPdfFile(generateAdmissionFormPdfResp, "ConsolidatedView.pdf")
        }

        preliminaryScrutinyModalRef.current.prevGenerateAdmissionFormPdfResp = generateAdmissionFormPdfResp;
    }, [generateAdmissionFormPdfResp])

    const preliminaryScrutinyRef = useRef({
        prevStatusOfPreliminaryScrutiny: statusOfPreliminaryScrutiny,
        prevUpdatePreliminaryScrutinyDocumentStatusResp: updatePreliminaryScrutinyDocumentStatusResp,
        prevAcceptAdmissionApprovalResp: acceptAdmissionApprovalResp,
        prevCancelAdmissionInPreliminaryResp: cancelAdmissionInPreliminaryResp,
        prevExportScrutinyDataResp: exportScrutinyDataResp,
        prevSendReminderDocResubmissionResp: sendReminderDocResubmissionResp,
        prevPreliminaryScrutinyList: preliminaryScrutinyList,
        prevApplicationSaleError: applicationSaleError,
    })

    useEffect(() => {
        const { prevStatusOfPreliminaryScrutiny, prevUpdatePreliminaryScrutinyDocumentStatusResp, prevAcceptAdmissionApprovalResp, prevApplicationSaleError, prevCancelAdmissionInPreliminaryResp, prevExportScrutinyDataResp, prevSendReminderDocResubmissionResp, prevPreliminaryScrutinyList } = preliminaryScrutinyRef.current;

        if (statusOfPreliminaryScrutiny && statusOfPreliminaryScrutiny !== prevStatusOfPreliminaryScrutiny) {
            toast.success('Preliminary is updated successfully.');
            togglePreliminaryScrutinyModal(undefined, undefined, true);
        }
        else if (updatePreliminaryScrutinyDocumentStatusResp && updatePreliminaryScrutinyDocumentStatusResp !== prevUpdatePreliminaryScrutinyDocumentStatusResp) {
            toast.success('Documents status updated successfully !');
            toggleShowDocumentModal(undefined, undefined, true)
            dispatch(setShowGlobalLoaderAct(false));
        }
        else if (acceptAdmissionApprovalResp && acceptAdmissionApprovalResp !== prevAcceptAdmissionApprovalResp) {
            toast.success('Head Department Approved Successfully !');
            toggleConfirmationModal()
            PreliminaryScrutinyList()
        }
        else if (cancelAdmissionInPreliminaryResp && cancelAdmissionInPreliminaryResp !== prevCancelAdmissionInPreliminaryResp) {
            toast.success('Admission Canceled Successfully !');
            toggleCancelAdmissionModal()
            PreliminaryScrutinyList()
        }
        else if (exportScrutinyDataResp && exportScrutinyDataResp !== prevExportScrutinyDataResp) {
            toast.success('File successfully Downloaded !');
            downloadExcelFile(exportScrutinyDataResp, "Preliminary_Scrutiny")
            toggleExportConfirmationModal()
        }
        else if (sendReminderDocResubmissionResp && sendReminderDocResubmissionResp !== prevSendReminderDocResubmissionResp) {
            toast.success('Remider Sent Successfully.');
            toggleReminderModal()
        }
        else if (preliminaryScrutinyList && preliminaryScrutinyList !== prevPreliminaryScrutinyList) {
            setOpen(false)
        }
        else if (applicationSaleError && applicationSaleError !== prevApplicationSaleError) {
            const { details } = applicationSaleError;
            toast.error(details);
        }

        preliminaryScrutinyRef.current.prevStatusOfPreliminaryScrutiny = statusOfPreliminaryScrutiny;
        preliminaryScrutinyRef.current.prevCancelAdmissionInPreliminaryResp = cancelAdmissionInPreliminaryResp;
        preliminaryScrutinyRef.current.prevAcceptAdmissionApprovalResp = acceptAdmissionApprovalResp;
        preliminaryScrutinyRef.current.prevUpdatePreliminaryScrutinyDocumentStatusResp = updatePreliminaryScrutinyDocumentStatusResp;
        preliminaryScrutinyRef.current.prevExportScrutinyDataResp = exportScrutinyDataResp;
        preliminaryScrutinyRef.current.prevSendReminderDocResubmissionResp = sendReminderDocResubmissionResp;
        preliminaryScrutinyRef.current.prevPreliminaryScrutinyList = preliminaryScrutinyList;
        preliminaryScrutinyRef.current.prevApplicationSaleError = applicationSaleError;

    }, [statusOfPreliminaryScrutiny, updatePreliminaryScrutinyDocumentStatusResp, acceptAdmissionApprovalResp, applicationSaleError, cancelAdmissionInPreliminaryResp, exportScrutinyDataResp, sendReminderDocResubmissionResp, preliminaryScrutinyList])

    const menuOptions = useMemo(
        () => [
            {
                id: "consolidated view",
                actionIcon: <HugeiconsIcon icon={Monocle01Icon} className="me-2 text-muted" size={18} />,
                actionName: "Consolidated View",
                onClickHndlr: (event: any) => {
                    let studentRegId = event.currentTarget.getAttribute('data-id').split(',')[0];
                    toggleConsolidatedViewConfomationModal(studentRegId);
                },
            },
            {
                id: "send reminder",
                actionIcon: <HugeiconsIcon icon={ReminderIcon} className="me-2 text-muted" size={18} />,
                actionName: "Send Reminder",
                onClickHndlr: (event: any) => {
                    let scrutinyId = event.currentTarget.getAttribute('data-id').split(',')[1];
                    toggleReminderModal(scrutinyId);
                },
            },
            {
                id: "cancel admission",
                actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="me-2 text-danger" size={18} />,
                actionName: "Cancel Admission",
                onClickHndlr: (event: any) => {

                    const id = event.currentTarget.getAttribute("data-id");
                    toggleCancelAdmissionModal(id)
                },
            },
            {
                id: "document verification",
                actionIcon: <HugeiconsIcon icon={DocumentValidationIcon} className="me-2 text-muted" size={18} />,
                actionName: "Document Verification",
                onClickHndlr: (event: any) => {
                    let studentRegId = event.currentTarget.getAttribute('data-id').split(',')[0];
                    let scrutinyId = event.currentTarget.getAttribute('data-id').split(',')[1];
                    toggleShowDocumentModal(studentRegId, scrutinyId)
                },
            },
            {
                id: "profile verification",
                actionIcon: <HugeiconsIcon icon={UserIdVerificationIcon} className="me-2 text-muted" size={18} />,
                actionName: "Profile Verification",
                onClickHndlr: (event: any) => {
                    let studentRegId = event.currentTarget.getAttribute('data-id').split(',')[0];
                    let scrutinyId = event.currentTarget.getAttribute('data-id').split(',')[1];
                    togglePreliminaryScrutinyModal(scrutinyId, studentRegId)
                    //   toggleApproveRejectModal("REJECTED",itFormId);
                },
            },
            {
                id: "admission verification",
                actionIcon: <HugeiconsIcon icon={CheckmarkBadge02StrokeStandard} className="me-2 text-muted" size={18} />,
                actionName: "Scrutiny Verification",
                onClickHndlr: (event: any) => {
                    let studentRegId = event.currentTarget.getAttribute('data-id').split(',')[0];
                    const id = event.currentTarget.getAttribute("data-id").split(',')[1];
                    toggleConfirmationModal(id, studentRegId);
                    // setActionId(id)
                    // moveToNewStudentConcessionHandler(id);
                    // setActionStatus("APPROVED")
                    // toggleConfirmationModal();
                },
            },
        ],
        [preliminaryScrutinyList]
    );
    const roleColumns = useMemo(() => generateColumns(menuOptions, instituteCode), [preliminaryScrutinyList, instituteCode]);

    const [preliminaryScrutinyModal, setPreliminaryScrutinyModal] = useState<any>({
        showModal: false,
        scrutinyId: undefined,
        studentRegId: undefined
    })
    const [showDocumentModal, setShowDocumentModal] = useState<any>({
        showModal: false,
        regId: undefined,
        scrutinyId: undefined
    })
    const [consolidatedViewConformationModal, setConsolidatedViewConformationModal] = useState<any>({
        showModal: false,
        regId: undefined
    })
    const [cancelAdmissionModal, setCancelAdmissionModal] = useState<any>({
        showModal: false,
        id: undefined,
    })

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationInfoDetails.current = paginationInfo;
        PreliminaryScrutinyList(paginationInfo);
    }

    const togglePreliminaryScrutinyModal = (scrutinyId?: any, studentRegId?: any, apiCall?: any) => {

        setPreliminaryScrutinyModal((prev: any) => ({ ...prev, showModal: !prev.showModal, scrutinyId: scrutinyId, studentRegId: studentRegId }));

        if (typeof (apiCall) === 'boolean' && apiCall) {
            PreliminaryScrutinyList();
        }
    }
    const toggleCancelAdmissionModal = (id?: any) => {

        setCancelAdmissionModal((prev: any) => ({ ...prev, showModal: !prev.showModal, id: id, }));

    }
    const toggleShowDocumentModal = (regId?: any, scrutinyId?: any, apiCall?: any) => {
        setShowDocumentModal((prev: any) => ({ ...prev, showModal: !prev.showModal, regId: regId, scrutinyId: scrutinyId }));

        if (typeof (apiCall) === 'boolean' && apiCall) {
            PreliminaryScrutinyList();
        }
    }
    const toggleConsolidatedViewConfomationModal = (regId?: any) => {
        setConsolidatedViewConformationModal((prev: any) => ({ ...prev, showModal: !prev.showModal, studentRegId: regId }));
    }
    const toggleConfirmationModal = (id?: any, studentRegId?: any) => {
        if (!confirmationModalState?.showModal) {
            dispatch(getPreliminaryScrutinyById(generateActionPayload('priliminary_scrutiny_by_id', undefined, { scrutinyId: id, studentRegId: studentRegId })))
        }
        setConfirmationModalState((prevState) => ({
            ...prevState,
            showModal: !prevState.showModal,
            scrutinyId: id,
            studentRegId: studentRegId
        }));

    };
    const exportDataHandler = () => {
        dispatch(exportScrutinyDataAct(generateActionPayload('export_scrutiny_data', undefined, { ...initialState, branchId }, {
            responseType: 'blob'
        })))
    }


    const statusChangingHandler = () => {
        // dispatch(approveFeeCashFormAct(generateActionPayload('approve_fee_cash_payments', { actionId: actionId ,actionStatus : actionStatus})))
    }
    const cancelAdmissionHandler = (reason?: any, recommendedCampusId?: any,curriculumId?:any,classId?:any) => {
        const studentRegId = cancelAdmissionModal.id.split(',')[0]
        dispatch(cancelAdmissionInPreliminaryAct(generateActionPayload('cancel_admission_in_preliminary', { id: studentRegId }, { reason, recommendedCampusId, isAdmissionScreen: false,curriculumId,recommendedClassId:classId })))
    }
    const consolidateViewSubmitHandler = () => {
        dispatch(generateAdmissionFormPdfAct(generateActionPayload('generate_admission_form_pdf', { id: consolidatedViewConformationModal.studentRegId }, undefined, {
            responseType: 'blob'
        })))
    }

    const [exportConfirmationModal, setExportConfirmationModal] =
        useState({
            showModal: false,
            resultId: "",
        });

    const toggleExportConfirmationModal = (id?: any) => {
        setExportConfirmationModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            resultId: id || "",
        }));
    };

    const [sendRemiderModal, setSendRemiderModal] = useState<any>({
        showModal: false,
        scrutinyId: undefined
    })

    const toggleReminderModal = (id?: any) => {
        setSendRemiderModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            scrutinyId: id || "",
        }));
    };

    const ConfirmSendReminder = () => {
        dispatch(sendReminderDocResubmissionAct(generateActionPayload('send_reminder_for_doc_resubmission', undefined, { scrutinyId: sendRemiderModal?.scrutinyId })))
    }

    const resetBtnHndler = () => {
        if (academicYearListResp) {

            let { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            setInitialState({ ...initialValues, academicYearId })
            PreliminaryScrutinyList({ ...initialValues, academicYearId });
        }

    }

    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        paginationInfoDetails.current.pageNo = 0;
        const stateChanged = hasStateChanged({ ...initialState, ...appliedFilters, academicYearId: "" });
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
        setInitialState((prevState: any) => ({ ...prevState, ...appliedFilters }));
        PreliminaryScrutinyList(appliedFilters)
    }

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }

    function getClassApiCall(curriculumId: string, academicYearId?: string) {
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId, academicYearId: academicYearId || initialState.academicYearId };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    const clearFilterHndlr = () => {
        if (academicYearListResp) {
            paginationInfoDetails.current = { ...paginationInfoDetails.current, pageNo: 0 }
            let { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            dispatch(resetBrchClassAct(undefined));
            setCount(null)
            setInitialState({ ...initialValues, academicYearId: academicYearId })
            PreliminaryScrutinyList({ ...initialValues, academicYearId })
            setShowClearFilterState(false)
        }
    }

    const updatedScrutinyStatus = useMemo(() => {
        const list = ["DOCUMENT_APPROVED", "DOCUMENT_RESUBMISSION_PENDING", "DOCUMENTS_RESUBMITTED", "ACCEPTED", "INPROGRESS", "PROFILE_APPROVAL_REJECTED", "PROFILE_APPROVAL_ON_HOLD",]
        return ScrutinyStatus.filter((item) => instituteCode === "PMS" ? list.includes(item.id) : true)
    }, [instituteCode])

    const { data: academiYearList } = academicYearListResp || {}
    const { data: curriculumList } = brchCurriculumResp || {}
    const { content: PreliminaryScrutinyData, totalElements, totalPages, pageable } = preliminaryScrutinyList || {};
    const { content: classTypes } = branchClassResp || {};

    return (<>
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-inline-block tw-w-full">
            <div className="tw-flex tw-items-center tw-p-2 tw-px-3 tw-border-b tw-border-gray-200">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Application List
                </h4>
                <div className="tw-ml-auto tw-text-center">
                    <Button
                        variant='info'
                        onClick={toggleExportConfirmationModal}
                    >
                        <div className="tw-flex tw-items-center tw-text-white">
                            <span><i className="ri-add-line tw-mr-1" /></span>
                            <span>Export</span>
                        </div>
                    </Button>
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-12 tw-px-3 tw-gap-3 tw-py-3">
                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-5">
                    <div className="tw-relative search-box">
                        <TextInput
                            name="searchString"
                            value={initialState.searchString}
                            onChange={searchHandler}
                            formgroupClassName="tw-mb-0"
                            placeHolder="Search..."
                            labelText="Search"
                            floatingLabel
                        />
                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="academicYearId"
                        value={initialState.academicYearId}
                        onChange={ChangeHandler}
                        menuItems={academiYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        labelText="Academic Year"
                        floatingLabel
                    />
                </div>

                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                    <SelectInput
                        name="scrutinyStatus"
                        value={initialState.scrutinyStatus}
                        onChange={ChangeHandler}
                        menuItems={updatedScrutinyStatus}
                        valueKey="id"
                        textKey="value"
                        formgroupClassName="tw-mb-0"
                        labelText="Scrutiny Status"
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
                        <button
                            type="button"
                            onClick={clearFilterHndlr}
                            className="tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-red-600 tw-bg-transparent tw-border tw-border-transparent tw-rounded hover:tw-bg-red-50 hover:tw-border-red-200 tw-transition-colors tw-duration-150"
                        >
                            Clear filter
                        </button>
                    )}
                </div>
            </div>

            <TableContainer
                columns={roleColumns || []}
                data={PreliminaryScrutinyData || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber}
            />
        </div>
        <ConfirmationModal
            id="preliminary-scrutiny-notification"
            isOpen={sendRemiderModal.showModal}
            confirmMessage="Are you sure you want to send notification?"
            cancelHndlr={toggleReminderModal}
            confirmHndlr={ConfirmSendReminder}
            isDisble={showApiLoader}
            showImgIcon={true}
            iconType='approve'
            btnClassName='btn w-sm btn-success'
        />
        <ModalContainerUpdated
            id="preliminary-scrutiny-confirmation"
            isOpen={confirmationModalState.showModal}
            toggle={toggleConfirmationModal}
            modalTitle=""
            modalSize="xl"
        >
            <ConfirmationModalPreliminaryScrutinty
                isOpen={confirmationModalState.showModal}
                scrutinyId={confirmationModalState.scrutinyId}
                studentRegId={confirmationModalState.studentRegId}
                toggle={toggleConfirmationModal}
                instituteId={instituteId}
                instituteName={"Assign Subjects"}
                branchId={branchId}
                submitHandler={statusChangingHandler}
            />
        </ModalContainerUpdated>
        <ModalContainerUpdated
            id="preliminary-scrutiny-cancel-admission"
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
                submitHandler={cancelAdmissionHandler}
                selectedAcademicyearId= {initialState.academicYearId}
            />
        </ModalContainerUpdated>

        <ConfirmationModal
            id="delete-inst-academic-terms"
            isOpen={consolidatedViewConformationModal.showModal}
            confirmMessage="Are you sure you want to download consolidated report ?"
            cancelHndlr={toggleConsolidatedViewConfomationModal}
            confirmHndlr={consolidateViewSubmitHandler}
            showImgIcon={true}
            iconType='approve'
            btnClassName='btn w-sm btn-success'
        />
        <OffCanvasContainer
            isOpen={open}
            headerTitle="Advance Filters"
            closeHndlr={toggleAdvanceFilter}
            id="preliminary-scrutiny-advance-filter"
        >
            <AdvanceFilterModal
                getClassApiCall={getClassApiCall}
                appliedFilter={initialState}
                applyFilterCallback={advanceFilterCallbckHndlr}
                toggleAdvanceFilter={toggleAdvanceFilter}
                isOpen={open}
            />

        </OffCanvasContainer>
        <ModalContainerUpdated
            id="preliminary-registration-details"
            isOpen={preliminaryScrutinyModal.showModal}
            toggle={togglePreliminaryScrutinyModal}
            modalTitle="Registration Details"
            modalSize="lg"
        >
            <PreliminaryScrutinyModal scrutinyId={preliminaryScrutinyModal.scrutinyId} studentRegId={preliminaryScrutinyModal.studentRegId} toggle={togglePreliminaryScrutinyModal} isOpen={preliminaryScrutinyModal.showModal} />
        </ModalContainerUpdated>
        <ModalContainerUpdated
            id="preliminary-approve-documents"
            isOpen={showDocumentModal.showModal}
            toggle={() => toggleShowDocumentModal(undefined, undefined)}
            modalTitle={`Approve Documents`}
            modalSize="lg"
        >
            <ShowDocumentModal regId={showDocumentModal.regId} scrutinyId={showDocumentModal.scrutinyId} toggle={toggleShowDocumentModal} toggleConsolidatedViewConfomationModal={toggleConsolidatedViewConfomationModal} />
        </ModalContainerUpdated>
        <ModalContainerUpdated
            id="application-sale-export-modal"
            isOpen={exportConfirmationModal.showModal}
            toggle={toggleExportConfirmationModal}
            modalTitle="Export Preliminary Scrutiny Data"
            modalSize="md"
        >
            <ExportModal
                isOpen={exportConfirmationModal.showModal}
                toggle={toggleExportConfirmationModal}
                instituteId={instituteId}
                branchId={branchId}
                submitHndlr={exportDataHandler}
                feature="admission"
                subFeature="preliminary_scrutiny"
                remarksText="Enter remarks to export preliminary scrutiny data?"
            />
        </ModalContainerUpdated>
    </>
    );
}

export default PreliminaryScrutiny
