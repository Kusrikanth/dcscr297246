import { useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from '../../../Components/Common';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { IPaginationState } from '../../../Components/Common/Pagination';
import TableContainer from '../../../Components/Common/TableContainer';
import { useFilterState } from '../../../hooks/filterhook';
import { useAppSelector } from '../../../hooks/storehook';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from '../../../store/branchsettings/branchacademics/branchacademicsactions';
import { deleteEnquiryAct, exportEnquiryListAct, getEnquiryListAct, getEnquiryStatsAct, getStatasticResp, sendAppSaleFormLinkAct, sendPaymentLinkApplicationSaleStatus } from '../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { generateActionPayload } from '../../../utility/reduxutility';
import AdvanceFilterModal from './AdvanceFilterModal';
import EnquiryFormModal from './EnquiryFormModal';
import EnquiryModal from './EnquiryModal';
import { generateColumns, ignoredKeys, newStatusOptions } from './helper';
import Statistics from './Statistics';
import { useModal } from '../../../hooks/modalhook';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard, EyeIcon, Mail01Icon } from '@hugeicons-pro/core-stroke-standard';
import { downloadExcelFile } from '../../../utility/commonutility';
import ExportModal from '../../Directory/StudentManagement/ExportModal';
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import Button from '../../../Components/Common/Button';

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    startDate: "",
    endDate: "",
    isAdmissionEligible: "",
    enquiryStatus: "",
}

const Enquiry = () => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] = useState(initialValues);
    const [open, setOpen] = useState<boolean>(false);
    const { showClearFilterState, count, advanceFilterChange } = useFilterState();
    const { closeModal: closeSendPaymentModal, modalState: sendPaymentModalState, openModal: openSendPaymentModal } = useModal()
    const { closeModal: closeAppSaleFormLinkModal, modalState: appSaleFormLinkModalState, openModal: openAppSaleFormLinkModal } = useModal()
    const { closeModal: closeExportConfirmationModal, modalState: exportConfirmationModalState, openModal: openExportConfirmationModal } = useModal()

    const [enquiryModalState, setEnquiryModalState] = useState({
        showModal: false,
        enquiryId: undefined
    });
    const [enquiryStatusModalState, setEnquiryStatusModalState] = useState({
        showModal: false,
        enquiryId: undefined
    });
    const [deleteEnquiryConfirmationState, setDeleteEnquiryConfirmationState] = useState({
        showModal: false,
        enquiryId: undefined
    });

    const toggleEnquiryModal = (enquiryId?: any, apiCall?: any) => {
        setEnquiryModalState((prev: any) => ({ ...prev, showModal: !prev.showModal, enquiryId: typeof (enquiryId) === 'string' && enquiryId }));

        if (typeof (apiCall) && apiCall) {
            EnquiryList();
        }
    }
    const toggleUpdateEnquiryStatusModal = (enquiryId?: any, apiCall?: any) => {
        setEnquiryStatusModalState((prev: any) => ({ ...prev, showModal: !prev.showModal, enquiryId: typeof (enquiryId) === 'string' && enquiryId }));

        if (typeof (apiCall) && apiCall) {
            EnquiryList();
        }
    }
    const toggleDeleteEnquiryConfirmationModal = (enquiryId?: any, apiCall?: any) => {
        setDeleteEnquiryConfirmationState((prev: any) => ({ ...prev, showModal: !prev.showModal, enquiryId: typeof (enquiryId) === 'string' && enquiryId }));

        if (typeof (apiCall) && apiCall) {
            EnquiryList();
        }
    }

    const DeleteEnquiryHandler = () => {
        dispatch(deleteEnquiryAct(generateActionPayload('delete_enquiry_by_id', { enquiryId: deleteEnquiryConfirmationState.enquiryId })))
    }

    const exportModalHndler = () => {
        let payload = {
            branchId,
            ...enquiryFilterState,
        };
        dispatch(exportEnquiryListAct(generateActionPayload('export_enquiry_list', undefined, { ...payload }, {
            responseType: 'blob'
        })))
    }

    const getStatsApiCall = (academicYearId: string) => {
        dispatch(getEnquiryStatsAct(generateActionPayload('get_enquiry_stats', undefined, { academicYearId, branchId })))
    }

    const getClassApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, academicYearId: enquiryFilterState.academicYearId, curriculumId: enquiryFilterState.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload = { academicYearId: enquiryFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
    }

    const ChangeHandler = (event: any) => {
        const { name, value } = event.target;
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            getStatsApiCall(value);
            dispatch(resetBrchClassAct(undefined));
            EnquiryList({ [name]: value, curriculumId: "", classId: "" });
            setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "" }));
        }
        else if (name === "curriculumId") {
            EnquiryList({ [name]: value, classId: "" });
            if (value) {
                getClassApiCall({ curriculumId: value, academicYearId: enquiryFilterState.academicYearId });
            }
            else {
                dispatch(resetBrchClassAct(undefined));
            }
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
        } else {
            EnquiryList({ [name]: value, });
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        }
        advanceFilterChange({ keys: { ...enquiryFilterState, [name]: value, academicYearId: "" }, ignoredKeys })
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        addNewEnquiry,
        enquiryListResp,
        exportEnquiryListResp,
        deleteEnquiry,
        updateEnquiry,
        updateEnquiryStatus,
        getEnquiryStatsResp,
        sendAppSaleFormLinkResp,
        applicationSaleError,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        sendPaymentLinkApplicationSaleStatusResp,
    } = useAppSelector(
        ({ instAcademics, branchAcademics, appData, applicationSale, globalData }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            addNewEnquiry: applicationSale.addNewEnquiry,
            enquiryListResp: applicationSale.enquiryListResp,
            exportEnquiryListResp: applicationSale.exportEnquiryListResp,
            deleteEnquiry: applicationSale.deleteEnquiry,
            updateEnquiry: applicationSale.updateEnquiry,
            updateEnquiryStatus: applicationSale.updateEnquiryStatus,
            getEnquiryStatsResp: applicationSale.getEnquiryStatsResp,
            sendAppSaleFormLinkResp: applicationSale.sendAppSaleFormLinkResp,
            sendPaymentLinkApplicationSaleStatusResp: applicationSale.sendPaymentLinkApplicationSaleStatusResp,
            applicationSaleError: applicationSale.applicationSaleError,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    const EnquiryRef = useRef({
        prevAddNewEnquiry: addNewEnquiry,
        prevExportEnquiryListResp: exportEnquiryListResp,
        prevDeleteEnquiry: deleteEnquiry,
        prevUpdateEnquiry: updateEnquiry,
        prevUpdateEnquiryStatus: updateEnquiryStatus,
        prevSendPaymentLinkApplicationSaleStatusResp: sendPaymentLinkApplicationSaleStatusResp,
        prevSendAppSaleFormLinkResp: sendAppSaleFormLinkResp,
        prevApplicationSaleError: applicationSaleError,
    });
    const paginationRef = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const EnquiryList = (otherProps?: any) => {
        let payload = {
            branchId: branchId,
            ...enquiryFilterState,
            ...paginationRef.current,
            ...otherProps
        }
        if (!payload.enquiryStatus) {
            delete payload.enquiryStatus
        }
        dispatch(getEnquiryListAct(generateActionPayload('get_enquiry_list', undefined, payload)))
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationRef.current = paginationInfo;
        EnquiryList(paginationInfo)
    }


    const menuOptions = useMemo(
        () => [
            // {
            //     id: "edit",
            //     actionIcon: <EditSvg fill='#878A99' className="me-2 d-inline-block" />,
            //     actionName: "Edit",
            //     onClickHndlr: (event: any) => {
            //         const id = event.currentTarget.getAttribute("data-id");
            //         toggleEnquiryModal(id);
            //         // moveToNewStudentConcessionHandler(id);
            //     },
            // },
            {
                id: "view",
                actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
                actionName: "View",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    toggleUpdateEnquiryStatusModal(id)
                    // moveToNewStudentConcessionHandler(id);
                },
            },
            {
                id: "sendPaymentLink",
                actionIcon: <HugeiconsIcon icon={Mail01Icon} className="me-2 text-muted" size={18} />,
                actionName: "Send Payment Link",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    const applicationSaleId = enquiryListResp?.content?.find((item: any) => +item.enquiryId === +id)?.applicationSaleId
                    openSendPaymentModal(applicationSaleId)
                },
            },
            {
                id: "sendAppSaleFormLink",
                actionIcon: <HugeiconsIcon icon={Mail01Icon} className="me-2 text-muted" size={18} />,
                actionName: "Send App Sale Form Link",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openAppSaleFormLinkModal(id)
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    toggleDeleteEnquiryConfirmationModal(id)
                    // dispatch(deleteEnquiryAct(generateActionPayload('delete_enquiry_by_id', { enquiryId: id })))
                },
            },
        ],
        [enquiryListResp]
    );

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        const { prevExportEnquiryListResp, prevAddNewEnquiry, prevDeleteEnquiry, prevUpdateEnquiry, prevUpdateEnquiryStatus, prevSendPaymentLinkApplicationSaleStatusResp, prevSendAppSaleFormLinkResp, prevApplicationSaleError } = EnquiryRef.current || {};

        if (addNewEnquiry && addNewEnquiry !== prevAddNewEnquiry) {
            toast.success('New Enquiry Added Successfully.');
            toggleEnquiryModal(undefined, true);
        }
        else if (deleteEnquiry && deleteEnquiry !== prevDeleteEnquiry) {
            toast.success('Enquiry deleted Successfully.');
            toggleDeleteEnquiryConfirmationModal(undefined, true);
        }
        else if (updateEnquiry && updateEnquiry !== prevUpdateEnquiry) {
            toast.success('Enquiry updated Successfully.');
            toggleEnquiryModal(undefined, true);
        }
        else if (updateEnquiryStatus && updateEnquiryStatus !== prevUpdateEnquiryStatus) {
            toast.success('Enquiry status updated Successfully.');
            toggleUpdateEnquiryStatusModal(undefined, true);
        }
        else if (sendPaymentLinkApplicationSaleStatusResp && sendPaymentLinkApplicationSaleStatusResp !== prevSendPaymentLinkApplicationSaleStatusResp) {
            toast.success('Payment Link Sent Successfully.');
            closeSendPaymentModal()
        }
        else if (sendAppSaleFormLinkResp && sendAppSaleFormLinkResp !== prevSendAppSaleFormLinkResp) {
            toast.success('App Sale Form Link Sent Successfully.');
            closeAppSaleFormLinkModal()
        }
        else if (exportEnquiryListResp && exportEnquiryListResp !== prevExportEnquiryListResp) {
            downloadExcelFile(exportEnquiryListResp, "enquiry_details")
            toast.success("Enquiry Details Downloaded Successfully.")
            closeExportConfirmationModal();
        }
        else if (applicationSaleError && applicationSaleError !== prevApplicationSaleError) {
            const { details } = applicationSaleError;
            toast.error(details);
            // toggleUpdateEnquiryStatusModal(undefined, true);
        }

        EnquiryRef.current.prevAddNewEnquiry = addNewEnquiry;
        EnquiryRef.current.prevExportEnquiryListResp = exportEnquiryListResp;
        EnquiryRef.current.prevDeleteEnquiry = deleteEnquiry;
        EnquiryRef.current.prevUpdateEnquiry = updateEnquiry;
        EnquiryRef.current.prevUpdateEnquiryStatus = updateEnquiryStatus;
        EnquiryRef.current.prevSendPaymentLinkApplicationSaleStatusResp = sendPaymentLinkApplicationSaleStatusResp;
        EnquiryRef.current.prevSendAppSaleFormLinkResp = sendAppSaleFormLinkResp;
        EnquiryRef.current.prevApplicationSaleError = applicationSaleError;
    }, [exportEnquiryListResp, addNewEnquiry, deleteEnquiry, updateEnquiry, updateEnquiryStatus, sendPaymentLinkApplicationSaleStatusResp, sendAppSaleFormLinkResp, applicationSaleError])

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            const yearId: string = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId || ""
            getCurriculumApiCall({ academicYearId: yearId });
            getStatsApiCall(yearId);
            setEnquiryFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
            EnquiryList({ academicYearId: yearId })
        }
    }, [academicYearListResp]);

    function advanceFilterCallbckHndlr(appliedFilters: any) {
        setEnquiryFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
        advanceFilterChange({ keys: { ...enquiryFilterState, ...appliedFilters, academicYearId: "" }, ignoredKeys })
        EnquiryList(appliedFilters)
    }

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }

    useEffect(() => {
        if (enquiryListResp) {
            setOpen(false);
        }
    }, [enquiryListResp])

    const sendPaymentLinkConfirmHndler = () => {
        dispatch(sendPaymentLinkApplicationSaleStatus(generateActionPayload('send_payment_link_application_sell', { applicationSaleId: sendPaymentModalState.modalData })));
    }

    const sendAppSaleFormLinkConfirmHndler = () => {
        dispatch(sendAppSaleFormLinkAct(generateActionPayload('send_app_sale_form_link', { applicationSaleId: appSaleFormLinkModalState.modalData })));
    }

    const clearFilterHndlr = () => {
        if (academicYearListResp) {
            const academicYearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
            paginationRef.current = { pageNo: 0, pageSize: 10 };
            dispatch(resetBrchClassAct(undefined));
            getCurriculumApiCall({ academicYearId });
            setEnquiryFilterState({ ...initialValues, academicYearId: academicYearId || "" });
            EnquiryList({ ...initialValues, academicYearId, })
            advanceFilterChange({ keys: { ...initialValues }, ignoredKeys })
        }
    }

    const roleColumns = useMemo(() => generateColumns(menuOptions), [enquiryListResp]);

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { content: EnquiryDataList, totalElements, pageable, totalPages } = enquiryListResp || {};

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Students Manage" pageTitle="Admissions" />
                    <Statistics statsInfo={getEnquiryStatsResp} />

                    <div className="tw-bg-white tw-rounded tw-shadow tw-mt-4 tw-mb-4">
                        {/* Header */}
                        <div className="tw-border-b tw-p-4">
                            <div className="tw-flex tw-flex-wrap tw-items-center">
                                <div className="tw-w-1/2">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        All Enquiries
                                    </h4>
                                </div>

                                <div className="tw-ml-auto">
                                    <div className="tw-flex tw-items-center tw-gap-2">
                                        <Button
                                            variant='primary'
                                            onClick={toggleEnquiryModal}
                                        >
                                            <i className="ri-add-line tw-mr-2" />
                                            Add New
                                        </Button>

                                        <Button
                                            variant='exportBtn'
                                            id="export-btn"
                                            onClick={openExportConfirmationModal}
                                        >
                                            <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                                            <UncontrolledTooltip placement="bottom" target="export-btn">
                                                Export
                                            </UncontrolledTooltip>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="tw-p-4">
                            <div className="tw-flex tw-flex-wrap tw-gap-3">
                                <div className="tw-w-full lg:tw-w-1/3 xl:tw-w-1/4">
                                    <div className="tw-relative search-box">
                                        <TextInput
                                            name="searchString"
                                            value={enquiryFilterState.searchString}
                                            onChange={ChangeHandler}
                                            inputClassName="tw-bg-gray-100"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search..."
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-2" />
                                    </div>
                                </div>

                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/6">
                                    <SelectInput
                                        name="academicYearId"
                                        value={enquiryFilterState.academicYearId}
                                        onChange={ChangeHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/6">
                                    <SelectInput
                                        name="curriculumId"
                                        value={enquiryFilterState.curriculumId}
                                        onChange={ChangeHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-w-full lg:tw-w-1/6 xl:tw-w-1/12">
                                    <SelectInput
                                        name="classId"
                                        value={enquiryFilterState.classId}
                                        onChange={ChangeHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Class"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/6">
                                    <SelectInput
                                        name="enquiryStatus"
                                        value={enquiryFilterState.enquiryStatus}
                                        onChange={ChangeHandler}
                                        menuItems={newStatusOptions}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Status"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-relative">
                                    <div
                                        onClick={toggleAdvanceFilter}
                                        className="tw-cursor-pointer tw-bg-gray-100 tw-p-2 tw-rounded tw-flex tw-items-center"
                                    >
                                        <FilterSvg height="18px" width="18px" />
                                        <span className="tw-ml-2">Filters</span>
                                    </div>

                                        <span
                                            className="tw-absolute tw--top-2 tw--right-2 tw-bg-emerald-500 tw-text-white tw-text-xs tw-rounded-full tw-px-2"
                                        >
                                            {count}
                                        </span>
                                </div>

                                <div className="tw-ml-auto tw-flex">
                                    {showClearFilterState && (
                                        <Button
                                            onClick={clearFilterHndlr}
                                            variant='wrong'
                                        >
                                            Clear filter
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Advance Filter */}
                        <OffCanvasContainer
                            isOpen={open}
                            headerTitle="Advance Filters"
                            closeHndlr={toggleAdvanceFilter}
                            id="enquiry-advance-filter"
                        >
                            <AdvanceFilterModal
                                getClassApiCall={getClassApiCall}
                                appliedFilter={enquiryFilterState}
                                applyFilterCallback={advanceFilterCallbckHndlr}
                                toggleAdvanceFilter={toggleAdvanceFilter}
                                isOpen={open}
                            />
                        </OffCanvasContainer>

                        {/* Table */}
                        <TableContainer
                            columns={roleColumns || []}
                            data={EnquiryDataList || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
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
                id=""
                isOpen={enquiryModalState.showModal}
                toggle={toggleEnquiryModal}
                modalTitle="Enquiry Details"
                modalSize="lg"
            >
                <EnquiryFormModal isOpen={enquiryModalState.showModal} enquiryId={enquiryModalState.enquiryId} toggle={toggleEnquiryModal} />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id=""
                isOpen={enquiryStatusModalState.showModal}
                toggle={toggleUpdateEnquiryStatusModal}
                modalTitle="Enquiry Details"
                modalSize="lg"
            >
                <EnquiryModal enquiryId={enquiryStatusModalState.enquiryId} toggle={toggleUpdateEnquiryStatusModal} />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="delete-inst-academic-terms"
                isOpen={deleteEnquiryConfirmationState.showModal}
                confirmMessage="Are you sure you want to delete an Enquiry ?"
                cancelHndlr={toggleDeleteEnquiryConfirmationModal}
                confirmHndlr={DeleteEnquiryHandler}
                showImgIcon={true}
                iconType='reject'
            />
            <ConfirmationModal
                id="send-payment-link-confirm-modal"
                isOpen={sendPaymentModalState.showModal}
                confirmMessage="You want to Send Payment Link ?"
                cancelHndlr={closeSendPaymentModal}
                confirmHndlr={sendPaymentLinkConfirmHndler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType='approve'
                btnClassName='btn w-sm btn-success'
            />
            <ConfirmationModal
                id="send-app-sale-form-link-confirm-modal"
                isOpen={appSaleFormLinkModalState.showModal}
                confirmMessage="You want to Application Sale Form Link ?"
                cancelHndlr={closeAppSaleFormLinkModal}
                confirmHndlr={sendAppSaleFormLinkConfirmHndler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType='approve'
                btnClassName='btn w-sm btn-success'
            />
            <ModalContainerUpdated
                id="student-concession-export-modal"
                isOpen={exportConfirmationModalState.showModal}
                toggle={closeExportConfirmationModal}
                modalTitle="Export Enquiry Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportConfirmationModalState.showModal}
                    toggle={closeExportConfirmationModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportModalHndler}
                    feature="admission"
                    subFeature="application_sale"
                    remarksText="Enter remarks to export Enquiry Data?"
                />
            </ModalContainerUpdated>
        </>
    )
}

export default Enquiry
