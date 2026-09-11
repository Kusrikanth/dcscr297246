import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, hostelStatusData, studentStatusData } from "./helper";
import { useHistory } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { createCredentialsAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { default as EyeSvg } from "../../../../assets/imagesdps/academics/EyeSvg.svg?react";
import { toast } from "react-toastify";
import { exportHostelDueFeePaymentAct, exportHostelStuLedgerAct, getHostelStuLedgerListAct } from "../../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { EyeIcon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";
import { useModal } from "../../../../hooks/modalhook";
import { ConfirmSendsmsDuePassed } from "./ConfirmSendsmsDuePassed";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import ExportModalHostelFeeUnpaid from "./ExportModalHostelFeeUnpaid";

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    studentStatus: "",
    hostelStatus: "",
    type: "",
};

const HostelStudentLedger = () => {
    const history = useHistory();
    const dispatch = useAppDispatch();

    const [hostelStuLedgerListState, setHostelStuLedgerListState] = useState<any>([])
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    const [hostelStuLedgerFilterState, setHostelStuLedgerFilterState] = useState(initialValues);
    const { openModal: openCreateNewFolderModal, closeModal: closeCreateNewFolderModal, modalState: createNewFolderModalState } = useModal();
    const { closeModal: closeExportHostelUnpaidReportModalHnldr, openModal: openExportLoginHistoryModalHnldr, modalState: exportHostelUnpadiReportModalState } = useModal();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10,

    })

    const HostelStuLedgerList = (otherProps?: any) => {
        let params = { branchId: branchId, searchString: hostelStuLedgerFilterState.searchString, academicYearId: hostelStuLedgerFilterState.academicYearId, curriculumId: hostelStuLedgerFilterState.curriculumId, classId: hostelStuLedgerFilterState.classId, ...pagination.current, ...otherProps };
        if (params.academicYearId) {
            dispatch(getHostelStuLedgerListAct(generateActionPayload('get_hostel_stu_ledger', undefined, params)));
        }
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        getHostelStuLedgerListResp,
        hostelStuLedgerErrResp,
        ledgerDetails,
        classroomManagmentErrorResp,
        currentBranchIdResp: branchId,
        createCredentialsResp,
        currentInstIdResp: instituteId,
        exportHostelStuLedgerResp,
        exportHostelDueFeePaymentResp,
        showApiLoader,
    } = useAppSelector(
        ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, appData, feeCollections, hostelStuLedger }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
            getHostelStuLedgerListResp: hostelStuLedger.getHostelStuLedgerListResp,
            hostelStuLedgerErrResp: hostelStuLedger.hostelStuLedgerErrResp,
            createCredentialsResp: feeCollections.createCredentialsResp,
            ledgerDetails: feeCollections.ledgerDetails,
            exportHostelStuLedgerResp: hostelStuLedger.exportHostelStuLedgerResp,
            exportHostelDueFeePaymentResp: hostelStuLedger.exportHostelDueFeePaymentResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "view",
                actionIcon: <HugeiconsIcon icon={EyeIcon} className="text-muted" size={18} />,
                actionName: "View Details",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    history.push('/hostel-student-ledger/ledger-details', { ...hostelStuLedgerFilterState, studentId: id });
                },
            },
        ],
        [hostelStuLedgerFilterState, getHostelStuLedgerListResp]
    );

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...hostelStuLedgerListState];
        updateStudentState.forEach((item: any) => {
            item.isSelected = checked;
        });
        setHostelStuLedgerListState(updateStudentState);
    }, [hostelStuLedgerListState]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            registrationNumber = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = hostelStuLedgerListState.findIndex((item: any) => +item.studentId === Number(registrationNumber));
        if (studentRowIndex > -1) {
            const studentDetails: any = hostelStuLedgerListState[studentRowIndex];
            let updateStudentState: any = [...hostelStuLedgerListState];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails, isSelected: checked,
            });
            setHostelStuLedgerListState(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [hostelStuLedgerListState]);

    const roleColumns = useMemo(() => generateColumns(menuOptions, allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState), [hostelStuLedgerFilterState, hostelStuLedgerListState]);

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        getCurriculumApiCall({ academicYearId: yearId });
        HostelStuLedgerList({ academicYearId: yearId });
        setHostelStuLedgerFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    }, [academicYearListResp,branchId,instituteId]);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: hostelStuLedgerFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
      }
    
      function getClassApiCall(curriculumId: string) {
        const payload = {
          curriculumId, branchId,academicYearId : hostelStuLedgerFilterState.academicYearId, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
        };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;

        if (name === 'curriculumId') {
            setHostelStuLedgerFilterState((prev: any) => ({ ...prev, [name]: value,classId:"" }))
            HostelStuLedgerList({ curriculumId: value, classId: "" })
            if (value) {
                getClassApiCall(value)
            }
            else {
                dispatch(resetBrchClassAct(undefined));
            }
        }
        else if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value })
            setHostelStuLedgerFilterState((prev: any) => ({ ...prev, [name]: value, classId: "", curriculumId: "" }))
            HostelStuLedgerList({ academicYearId: value, classId: "", curriculumId: "" })
            dispatch(resetBrchClassAct(undefined));
        }
        else {
            setHostelStuLedgerFilterState((prev: any) => ({ ...prev, [name]: value }))
            HostelStuLedgerList({ [name]: value })
        }

    }
    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        setAllStudentSelectedState(false)
        HostelStuLedgerList(paginationInfo);
    }

    const hostelStuLedgerRef = useRef({
        prevExportHostelStuLedgerResp: exportHostelStuLedgerResp,
        prevExportHostelDueFeePaymentResp: exportHostelDueFeePaymentResp,
        prevCreateCredentialsResp: createCredentialsResp,
        prevFeeSummaryList: getHostelStuLedgerListResp,
        prevHostelStuLedgerErrResp: hostelStuLedgerErrResp,
    });

    useEffect(() => {
        const { prevExportHostelStuLedgerResp, prevExportHostelDueFeePaymentResp, prevFeeSummaryList, prevCreateCredentialsResp, prevHostelStuLedgerErrResp } = hostelStuLedgerRef.current;

        if (exportHostelStuLedgerResp && exportHostelStuLedgerResp !== prevExportHostelStuLedgerResp) {
            toast.success("Hostel Student Ledger Data Download Successfully.");
            toggleExportExcelModal();
            downloadExcelFile(exportHostelStuLedgerResp, 'Hostel_Student_Ledger')
        }
        else if (exportHostelDueFeePaymentResp && exportHostelDueFeePaymentResp !== prevExportHostelDueFeePaymentResp) {
            toast.success("Hostel Unpaid Report Download Successfully.");
            closeExportHostelUnpaidReportModalHnldr();
            downloadExcelFile(exportHostelDueFeePaymentResp, 'Hostel_Unpaid_Report')
        }
        else if (getHostelStuLedgerListResp && getHostelStuLedgerListResp !== prevFeeSummaryList) {
            const { data } = getHostelStuLedgerListResp || {};
            setAllStudentSelectedState(false)
            setHostelStuLedgerListState(data?.map((i: any) => ({ ...i, isSelected: false })) || [])
        }
        else if (createCredentialsResp && createCredentialsResp !== prevCreateCredentialsResp) {
            toast.success("Credentials Created Successfully.");
            HostelStuLedgerList()
            toggleSendCredentialsModal();
        }
        else if (hostelStuLedgerErrResp && hostelStuLedgerErrResp !== prevHostelStuLedgerErrResp) {
            const { details } = hostelStuLedgerErrResp || {}
            toast.error(details || "Something went wrong")
        }

        hostelStuLedgerRef.current.prevExportHostelStuLedgerResp = exportHostelStuLedgerResp;
        hostelStuLedgerRef.current.prevExportHostelDueFeePaymentResp = exportHostelDueFeePaymentResp;
        hostelStuLedgerRef.current.prevCreateCredentialsResp = createCredentialsResp;
        hostelStuLedgerRef.current.prevFeeSummaryList = getHostelStuLedgerListResp;
        hostelStuLedgerRef.current.prevHostelStuLedgerErrResp = hostelStuLedgerErrResp;

    }, [exportHostelStuLedgerResp, exportHostelDueFeePaymentResp, getHostelStuLedgerListResp, createCredentialsResp, hostelStuLedgerErrResp]);

    const [exportExcel, setExportExcel] = useState({
        showModal: false,
        scrutinyId: undefined
    })

    const [sendCredentials, setSendCredentials] = useState({
        showModal: false,
        id: undefined,
        type: undefined,
    })

    const toggleExportExcelModal = (id?: any) => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            scrutinyId: id || "",
        }));
    };

    const toggleSendCredentialsModal = (type?: any, id?: any) => {
        setSendCredentials((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            id: id || "",
            type: type || "",
        }));
    };

    const exportExcelHndler = () => {

        dispatch(exportHostelStuLedgerAct(generateActionPayload("export_hostel_stu_ledger", undefined, { ...hostelStuLedgerFilterState, branchId, instituteId }, {
            responseType: 'blob'
        })));
    }

    const exportExcelUnpaidReportHndler = (dueAmount?: string) => {
        dispatch(exportHostelDueFeePaymentAct(generateActionPayload("export_hostel_due_fee_payment", undefined, { ...hostelStuLedgerFilterState, branchId, instituteId, dueAmount }, {
            responseType: 'blob'
        })));
    }
    const sendCredentialsSubmitHndler = () => {
        if (sendCredentials.type === "multiple") {
            const studentIds = hostelStuLedgerListState?.filter((i: any) => i?.isSelected)?.map((i: any) => i?.studentId)
            dispatch(createCredentialsAct(generateActionPayload('create_credentials_stu_fee_ledger', undefined, { studentIds })));
        } else {
            dispatch(createCredentialsAct(generateActionPayload('create_credentials_stu_fee_ledger', undefined, { studentIds: [sendCredentials.id] })));
        }
    }

    function notifyStudentHndlr() {
        const studentIds = hostelStuLedgerListState?.filter((i: any) => i?.isSelected)?.map((i: any) => i?.studentId)
        openCreateNewFolderModal(studentIds.join(','));
    }
    const { data: academicYearList } = academicYearListResp || {};

    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { totalPages, totalElements, pageNumber } = getHostelStuLedgerListResp || {};

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Fee Summary" pageTitle="Hostel" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                        <div className="tw-border-b tw-p-4">
                            <div className="tw-flex tw-items-center">
                                <h4 className="tw-text-lg tw-font-semibold tw-flex-grow">
                                    Hostel Student Ledger
                                </h4>
                                {hostelStuLedgerListState?.some((i) => i?.isSelected) && (
                                    <Button
                                        type="button"
                                        onClick={notifyStudentHndlr}
                                        variant="secondary"
                                    >
                                        Notify Due Payment
                                    </Button>
                                )}
                                <UncontrolledDropdown direction="down">
                                    <DropdownToggle tag="a" id="action-rowId" role="button">
                                        <Button
                                            type="button"
                                            variant="info"
                                            disabled={showApiLoader}
                                            className="!tw-pl-4 !tw-pe-2 !tw-py-1 tw-ms-2"
                                        >
                                            <span>Export</span>
                                            <i className="ri-arrow-drop-down-line tw-text-lg"></i>
                                        </Button>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => toggleExportExcelModal()}>
                                            Hostel Student Ledger Export
                                        </DropdownItem>
                                        <DropdownItem onClick={() => openExportLoginHistoryModalHnldr()}>
                                            Unpaid Report
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <Button type="button" onClick={() => toggleSendCredentialsModal("multiple")} className="!tw-px-4 !tw-py-1.5 tw-ms-2">Send Credentials</Button>
                            </div>
                        </div>

                        <div className="tw-p-4">
                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-3">
                                <div className="md:tw-col-span-4 xl:tw-col-span-2">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={hostelStuLedgerFilterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="tw-bg-gray-100"
                                            formgroupClassName="tw-mb-0"
                                            labelText="Search"
                                            placeHolder="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line search-icon" />
                                    </div>
                                </div>

                                <div className="md:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={hostelStuLedgerFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                                <div className="md:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={hostelStuLedgerFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>

                                <div className="md:tw-col-span-2 xl:tw-col-span-2">
                                    <SelectInput
                                        name="classId"
                                        value={hostelStuLedgerFilterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Class"
                                        floatingLabel
                                    />
                                </div>
                                <div className="md:tw-col-span-2 xl:tw-col-span-2">
                                    <SelectInput
                                        name="studentStatus"
                                        value={hostelStuLedgerFilterState.studentStatus}
                                        onChange={filterHandler}
                                        menuItems={studentStatusData}
                                        valueKey="id"
                                        textKey="status"
                                        formgroupClassName="mb-0"
                                        labelText="Student Status"
                                        floatingLabel
                                    />
                                </div>
                                <div className="md:tw-col-span-2 xl:tw-col-span-2">
                                    <SelectInput
                                        name="hostelStatus"
                                        value={hostelStuLedgerFilterState.hostelStatus}
                                        onChange={filterHandler}
                                        menuItems={hostelStatusData}
                                        valueKey="id"
                                        textKey="status"
                                        formgroupClassName="mb-0"
                                        labelText="Hostel Status"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                        </div>
                        <TableContainer
                            columns={roleColumns || []}
                            data={hostelStuLedgerListState || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages}
                            totalRecords={totalElements}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageNumber}
                        />
                    </div>
                </div>
            </div>
            <ConfirmationModal
                id="create-credentials-student-fee-ledger"
                isOpen={sendCredentials.showModal}
                confirmMessage="you want create new credentials ?"
                cancelHndlr={() => toggleSendCredentialsModal()}
                confirmHndlr={sendCredentialsSubmitHndler}
                isDisble={showApiLoader}
                btnClassName='btn w-sm btn-success'
                showImgIcon={true}
                iconType="approve"
            />
            <ModalContainerUpdated
                id="export-fee-ledger-modal"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Student Fee Ledger Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="hostel"
                    subFeature="hostel_student_ledger"
                    remarksText="Enter remarks to export stuednt fee ledger data?"
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="sendsmsduepassed-modal"
                isOpen={createNewFolderModalState.showModal}
                toggle={closeCreateNewFolderModal}
                modalSize="md"
                hideHeader
            >
                <ConfirmSendsmsDuePassed
                    id={createNewFolderModalState.modalData}
                    toggle={closeCreateNewFolderModal}
                    academicYearId={hostelStuLedgerFilterState.academicYearId}
                    branchId={branchId}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="export-hostel-unpaid-report-modal"
                isOpen={exportHostelUnpadiReportModalState.showModal}
                toggle={closeExportHostelUnpaidReportModalHnldr}
                modalTitle="Export Hostel Unpaid Report"
                modalSize="md"
            >
                <ExportModalHostelFeeUnpaid
                    isOpen={exportHostelUnpadiReportModalState.showModal}
                    toggle={closeExportHostelUnpaidReportModalHnldr}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelUnpaidReportHndler}
                    feature="hostel"
                    subFeature="hostel_unpaid"
                    remarksText="Enter remarks to export hostel unpaid report?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default HostelStudentLedger;
