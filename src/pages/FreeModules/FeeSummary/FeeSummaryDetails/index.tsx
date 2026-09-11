import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import { AutoSearchInputUpdated, ConfirmationModal, ModalContainerUpdated, SelectInput } from '../../../../Components/Common'
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";
import UncontrolledAccordionCard from '../../../../Components/Common/UncontrolledAccordionCard';
import AccordionCardItem from '../../../../Components/Common/AccordionCardItem';
import AccordionCardHeader from '../../../../Components/Common/AccordionCardHeader';
import AccordionCardBody from '../../../../Components/Common/AccordionCardBody';
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateConcessionColumns, generateFeeDetailsColumns, generateLedgerColumns, generateReceiptColumns, generateRefundsColumns, generateScheduledColumns } from './helper';
import { shallowEqual } from 'react-redux';
import { createJodoIdAct, deleteLedgerDetailAct, getFeeDetailsAct, getFeeReceiptsAct, getFeeSummaryDetailsAct, updateJodoDiscountAct, getLedgerDetailsAct, getScheduleDetailsAct, getStudentConcessionForFeeSummaryAct, resetJodoDiscountDetailsAct, updateErpToJodoReceiptAct, updateJodoPaymentToErpAct, printStudentLedgerDetailsAct, resetPrintStudentLedgerDetailsAct, getByIdFeeDueFollowUpRemarksAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { getFeeRefundsAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { toast } from 'react-toastify';
import { getDisplayAmountValue } from '../../../../utility/commonutility';
import { getCurrentTimezoneYyyyMmDdFormat, getDateMonthYearFormat } from '../../../../utility/dateutility';
import { getInstAcademicYearAct } from '../../../../store/mastersettings/instacademics/instacademicactions';
import { useFormik } from 'formik';
import { getStudentsListAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import FeeDetailsModal from '../../FeeReceipts/FeeDetailsModal';
import { useModal } from '../../../../hooks/modalhook';
import PreviousYearLedgerBalance from './PreviousYearLedgerBalance';
import ConsolidatedReportNew from '../../../FrontDesk/Reports/ConsolidatedViewNew';
import ViewDocumentModal from './ViewDocumentModal';
import ExportModal from '../../../Directory/StudentManagement/ExportModal';
import EliteParentIcon from "../../../../assets/imagesdps/directory/icons/elite_parents.svg";
import { UncontrolledTooltip } from "reactstrap";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, DownloadSquare02Icon, EyeIcon, MoneySendCircleIcon } from "@hugeicons-pro/core-stroke-standard";
import Button from '../../../../Components/Common/Button';
import PrintStudentFeeLedgerModal from './PrintStudentFeeLedgerModal';
import FeeDueFollowUpRemarks from './FeeDueFollowUpRemarks';

const FeeSummaryDetails = () => {
    const { modalState: previousLedgerModalState, closeModal: closePreviousLedgerModalHndlr,
        openModal: openPreviouseLedgerModalHndlr
    } = useModal();
    const { closeModal: closeViewDocumentModal, modalState: viewDocumentModalState, openModal: openViewDocumentModal } = useModal()
    const { closeModal: closeUpdateJodoModal, modalState: updateJodoModalState, openModal: openUpdateJodoModal } = useModal()
    const { closeModal: closeCreateJodoIdModal, modalState: createJodoIdModalState, openModal: openCreateJodoIdModal } = useModal()
    const { closeModal: closeUpdateReceiptToJodoModal, modalState: updateReceiptToJodoModalState, openModal: openUpdateReceiptToJodoModal } = useModal()
    const { closeModal: closeUpdateJodoDiscountModal, modalState: updateJodoDiscountModalState, openModal: openUpdateJodoDiscountModal } = useModal()
    const { modalState: printStudentFeeLedgerModalState, closeModal: closePrintStudentFeeLedgerModalHndlr, openModal: openPrintStudentFeeLedgerModalHndlr } = useModal();
    const { openModal: feeDueFollowUpRemarksOpenModal, closeModal: feeDueFollowUpRemarksCloseModal, modalState: feeDueFollowUpRemarksModalState } = useModal()
   
    const [viewReceiptModalState, setViewReceiptModalState] =
        useState({
            showModal: false,
            receiptId: "",
            modalData: undefined
        });
    const [deleteLedgerState, setDeleteLedgerState] = useState({
        showModal: false,
        id: undefined
    })
    const location = useLocation<any>();
    const routeState =
        location.state ||
        JSON.parse(sessionStorage.getItem("feeDetailsData") || "{}");
    const history = useHistory();
    const dispatch = useAppDispatch();

    const [selectedYear, setSelectedYear] = useState('');
    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const {
        academicYearListResp,
        ledgerDetails,
        feeSummaryDetails,
        feeDetails,
        feeReceiptsResp,
        feeRefundsResp,
        studentConcessionList,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        loggedInUserRole,
        virtualRoleResp,
        getStudentConcessionForFee,
        studentsListResp,
        deleteLedgerDetailResp,
        feeCollectionErrorResp,
        updateErpToJodoReceiptResp,
        updateJodoToErpPaymentResp,
        updateJodoDiscountResp,
        createJodoIdResp,
        showApiLoader,
        saveFeeDueFollowUpRemarksResp,
    } = useAppSelector(
        ({ directoryStudent, instAcademics, appData, feeCollections, feeConcession, globalData }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            ledgerDetails: feeCollections.ledgerDetails,
            feeSummaryDetails: feeCollections.feeSummaryDetails,
            feeDetails: feeCollections.feeDetails,
            feeReceiptsResp: feeCollections.feeReceiptsResp,
            updateErpToJodoReceiptResp: feeCollections.updateErpToJodoReceiptResp,
            updateJodoToErpPaymentResp: feeCollections.updateJodoToErpPaymentResp,
            updateJodoDiscountResp: feeCollections.updateJodoDiscountResp,
            createJodoIdResp: feeCollections.createJodoIdResp,
            deleteLedgerDetailResp: feeCollections.deleteLedgerDetailResp,
            feeRefundsResp: feeCollections.feeRefundsResp,
            studentConcessionList: feeConcession.studentConcessionList,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            loggedInUserRole: appData.loggedInUserRole,
            studentsListResp: directoryStudent.studentsListResp,
            getStudentConcessionForFee: feeCollections.getStudentConcessionForFee,
            feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
            showApiLoader: globalData.showApiLoader,
            virtualRoleResp: appData.virtualRoleResp,
            saveFeeDueFollowUpRemarksResp: feeCollections.saveFeeDueFollowUpRemarksResp
        }),
        shallowEqual
    );

    const canCreateAndUpdate = useMemo(() => {
        if (loggedInUserRole === 'INSTITUTE_ADMIN') {
            return !!virtualRoleResp;
        }
        return (loggedInUserRole !== 'PRINCIPAL'
            && loggedInUserRole !== 'VICE_PRINCIPAL' && loggedInUserRole !== 'HOD' && loggedInUserRole !== 'PA'
            && loggedInUserRole !== 'TRANSPORT'
            && loggedInUserRole !== 'ADM_HEAD'
            && loggedInUserRole !== 'TEACHER'
            && loggedInUserRole !== 'GRIEVANCE'
            && loggedInUserRole !== 'HR'
            && loggedInUserRole !== 'EXAMINATION'
        );
    }, [loggedInUserRole, virtualRoleResp]);

    const feeSummaryDetailsRespRef = useRef({
        prevDeleteLedgerDetailResp: deleteLedgerDetailResp,
        prevUpdateErpToJodoReceiptResp: updateErpToJodoReceiptResp,
        prevUpdateJodoToErpPaymentResp: updateJodoToErpPaymentResp,
        prevUpdateJodoDiscountResp: updateJodoDiscountResp,
        prevCreateJodoIdResp: createJodoIdResp,
        prevSaveFeeDueFollowUpRemarksResp: saveFeeDueFollowUpRemarksResp,
        prevFeeCollectionErrorResp: feeCollectionErrorResp,
    });

    useEffect(() => {
        const { prevDeleteLedgerDetailResp, prevUpdateErpToJodoReceiptResp,
            prevUpdateJodoToErpPaymentResp, prevUpdateJodoDiscountResp, prevCreateJodoIdResp,
            prevSaveFeeDueFollowUpRemarksResp, prevFeeCollectionErrorResp } = feeSummaryDetailsRespRef.current;

        if (deleteLedgerDetailResp && deleteLedgerDetailResp !== prevDeleteLedgerDetailResp) {
            toast.success("Selected Ledger Deleted Successfully.");
            getLedgerDetails(searchStudentState?.studentId || routeState.studentId, selectedYear);
            getStudentConcessionDetails(searchStudentState?.studentId || routeState.studentId, selectedYear, searchStudentState?.classId || routeState.classId);
            toggleDeleteLedgerModal();
        } else if (updateErpToJodoReceiptResp && prevUpdateErpToJodoReceiptResp !== updateErpToJodoReceiptResp) {
            toast.success("Reciept updated successfully to JODO.");
            closeUpdateReceiptToJodoModal()
            let studentId;
            if (searchStudentState) {
                studentId = searchStudentState?.studentId
            } else {
                studentId = routeState.studentId
            }
            getFeeReceiptDetails(studentId, selectedYear);
        } else if (updateJodoToErpPaymentResp && prevUpdateJodoToErpPaymentResp !== updateJodoToErpPaymentResp) {
            closeUpdateJodoModal()
            toast.success("Payment update successfully to ERP.");
            closeUpdateJodoModal()
        } else if (updateJodoDiscountResp && prevUpdateJodoDiscountResp !== updateJodoDiscountResp) {
            toast.success(updateJodoDiscountResp || "Discount updated successfully");
            closeUpdateJodoDiscountModal();
            dispatch(resetJodoDiscountDetailsAct(undefined))
        } else if (createJodoIdResp && prevCreateJodoIdResp !== createJodoIdResp) {
            toast.success("JODO Id Generated successfully");
            closeCreateJodoIdModal()
            const { studentId, academicYearId } = routeState;
            getLedgerDetails(studentId, academicYearId);
        } else if (saveFeeDueFollowUpRemarksResp && saveFeeDueFollowUpRemarksResp !== prevSaveFeeDueFollowUpRemarksResp) {
            toast.success("Follow-up remarks saved successfully.");
            dispatch(
                getByIdFeeDueFollowUpRemarksAct(
                    generateActionPayload(
                        "get_by_id_fee_due_follow_up_remarks",
                        undefined,
                        {
                            studentId:
                                searchStudentState?.studentId ||
                                routeState.studentId,
                            academicYearId:
                                selectedYear ||
                                routeState.academicYearId,
                        }
                    )
                )
            );
        } else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
            const { details } = feeCollectionErrorResp || {};
            toast.error(details)
        }

        feeSummaryDetailsRespRef.current.prevDeleteLedgerDetailResp = deleteLedgerDetailResp;
        feeSummaryDetailsRespRef.current.prevUpdateErpToJodoReceiptResp = updateErpToJodoReceiptResp;
        feeSummaryDetailsRespRef.current.prevUpdateJodoToErpPaymentResp = updateJodoToErpPaymentResp;
        feeSummaryDetailsRespRef.current.prevUpdateJodoDiscountResp = updateJodoDiscountResp;
        feeSummaryDetailsRespRef.current.prevCreateJodoIdResp = createJodoIdResp;
        feeSummaryDetailsRespRef.current.prevSaveFeeDueFollowUpRemarksResp = saveFeeDueFollowUpRemarksResp;
        feeSummaryDetailsRespRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;

    }, [searchStudentState, selectedYear, deleteLedgerDetailResp, updateErpToJodoReceiptResp,
        updateJodoToErpPaymentResp, updateJodoDiscountResp, createJodoIdResp, saveFeeDueFollowUpRemarksResp, feeCollectionErrorResp]);

    const handlePrintStudentLedger = () => {
        const payload = {
            academicYearId: routeState.academicYearId,
            instituteId,
            branchId,
        };
        dispatch(
            printStudentLedgerDetailsAct(
                generateActionPayload(
                    "print_student_ledger_details",
                    { studentId: routeState.studentId },
                    payload, { responseType: 'blob' }
                )
            )
        );
    };

    const printStudentLedgerBtnHndlr = () => {
        handlePrintStudentLedger();
        openPrintStudentFeeLedgerModalHndlr()
    }

    const closePrintModalHandler = () => {
        closePrintStudentFeeLedgerModalHndlr();
        dispatch(resetPrintStudentLedgerDetailsAct(undefined));
    };

    const feeSummaryForm = useFormik({
        enableReinitialize: true,
        initialValues: { studentId: "" },
        onSubmit: (values: any) => {
        },
    });
    const getLedgerDetails = (studentId: any, academicYearId: any) => {
        let payload = {
            studentId: studentId,
            instituteId,
            branchId: branchId,
            academicYearId: academicYearId,
            studentInfo: "studentInfo",
            allowStudentConcession: "",
            allowEmployeeConcession: "",
            allowRefund: "",
            feeType: [],
            // instituteDeptId: [1, 4],
            instituteDeptNames: ["ACADEMICS", "TRANSPORT"],
            paymentStatus: "",
        }
        dispatch(getLedgerDetailsAct(generateActionPayload('ledger_details', undefined, payload)));
    }
    const getFeeSummaryList = (studentId: any, academicYearId: any) => {
        let params1 = { instituteId, branchId: branchId, searchString: "", academicYearId: academicYearId, studentId: studentId };
        dispatch(getFeeSummaryDetailsAct(generateActionPayload('fee_summary_list', undefined, params1)));
    }
    const getStudentFeeDetails = (studentId: any, academicYearId: any) => {
        let params2 = { branchId: branchId, academicYearId: academicYearId };
        dispatch(getFeeDetailsAct(generateActionPayload('student_fee_details', { studentId: studentId }, params2)));
    }
    const getStudentScheduleDetails = (studentId: any, academicYearId: any) => {
        let params2 = { branchId: branchId, academicYearId: academicYearId };
        dispatch(getScheduleDetailsAct(generateActionPayload('student_schedule_details', { studentId: studentId }, params2)))
    }
    const getFeeReceiptDetails = (studentId: any, academicYearId: any) => {
        let payload1 = {
            studentId: studentId,
            studentName: null,
            // receiptTypes : ["SCHOOL","BANK"],
            // startDate: null,
            // endDate: null,
            // instituteId:instituteId,
            // branchClassId:classId,
            branchId: branchId,
            // branchCurriculumId: curriculumId,
            academicYearId: academicYearId,
            studentTypes: ["EXISTING_STUDENT", "NEW_STUDENT"]
            // paymentModes : ["CASH","ONLINE"]
        };
        dispatch(getFeeReceiptsAct(generateActionPayload('fee_receipt_details', undefined, payload1)))
    }
    const getStudentConcessionDetails = (studentId: any, academicYearId: any, classId: any) => {
        let payload2 = {
            studentId: studentId,
            academicYearId: academicYearId,
            // curriculumId: curriculumId,
            classId: classId,
            branchId: branchId,
            // studentName: null
        };
        dispatch(getStudentConcessionForFeeSummaryAct(generateActionPayload('stu_concession_list_v2', { pageNo: 0, pageSize: 100 }, payload2)))
    }
    const getFeeRefundDetails = (studentId: any, academicYearId: any, classId: any) => {
        let payload3 = {
            studentId: studentId,
            studentName: "",
            // instituteId: instituteId,
            branchId: branchId,
            academicYearId: academicYearId
        };
        dispatch(getFeeRefundsAct(generateActionPayload('fee_refund_details', { pageNo: 0, pageSize: 100 }, payload3)))
    }

    useEffect(() => {
        const { studentId, academicYearId, curriculumId, classId } = routeState;
        setSelectedYear(academicYearId)
        getLedgerDetails(studentId, academicYearId)
        getFeeSummaryList(studentId, academicYearId)
        getStudentFeeDetails(studentId, academicYearId)
        getStudentScheduleDetails(studentId, academicYearId)
        getFeeReceiptDetails(studentId, academicYearId)
        getStudentConcessionDetails(studentId, academicYearId, classId)
        getFeeRefundDetails(studentId, academicYearId, classId)
    }, [location])

    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(
            getInstAcademicYearAct(
                generateActionPayload("get_inst_academic_year", undefined, payload)
            )
        );
    }, [])

    const handlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedYear(event.target.value);
        if (event.target.value) {
            history.replace({
                ...location,
                state: {
                    ...routeState,
                    academicYearId: event.target.value
                },
            });
        }
        // if (searchStudentState) {
        //     studentId = searchStudentState?.studentId
        //     classId = searchStudentState?.classId
        // } else {
        //     studentId = routeState.studentId
        //     classId = routeState.classId
        // }
        // getLedgerDetails(studentId, event.target.value)
        // getFeeSummaryList(studentId, event.target.value)
        // getStudentFeeDetails(studentId, event.target.value)
        // getStudentScheduleDetails(studentId, event.target.value)
        // getFeeReceiptDetails(studentId, event.target.value)
        // getStudentConcessionDetails(studentId, event.target.value, classId)
        // getFeeRefundDetails(studentId, event.target.value, classId)

    }

    const toggleDeleteLedgerModal = (id?: any) => {
        setDeleteLedgerState((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            id: id || "",
        }));
    };

    function onInputSearchChange(inputString: any) {
        // const { academicYearId, curriculumId, classId } = feeSummaryForm.values;
        if (inputString && selectedYear) {

            // const params = { searchString: inputString };
            // dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId })));
            const params = {
                branchId, academicYearId: selectedYear,
                // classId: classId,
                // curriculumId: curriculumId, 
                searchString: inputString,
            };
            dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
        }
    }

    const selectedStudent = (student: any) => {
        if (student) {
            setSearchStudentState(student);
            feeSummaryForm.setFieldValue('studentId', student?.studentId);

            if (student?.studentId) {
                history.replace({
                    ...location,
                    state: {
                        ...routeState,
                        studentId: student?.studentId
                    },
                });
            }

            // getLedgerDetails(student?.studentId, selectedYear)
            // getFeeSummaryList(student?.studentId, selectedYear)
            // getStudentFeeDetails(student?.studentId, selectedYear)
            // getStudentScheduleDetails(student?.studentId, selectedYear)
            // getFeeReceiptDetails(student?.studentId, selectedYear)
            // getStudentConcessionDetails(student?.studentId, selectedYear, student?.classId)
            // getFeeRefundDetails(student?.studentId, selectedYear, student?.classId)
        }
    }


    const menuOptions = useMemo(
        () => [
            {
                id: "updateReceiptToJodo",
                actionIcon: <HugeiconsIcon icon={MoneySendCircleIcon} className="me-2 text-muted" size={18} />,
                actionName: "Update receipt to JODO",
                onClickHndlr: updateReceiptToJodoHndlr,
            },
            {
                id: "viewDetails",
                actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
                actionName: "View Details",
                onClickHndlr: viewReceiptDetailsHndlr,
            }
        ], [feeReceiptsResp]);

    const ledgerMenuOptions = useMemo(
        () => [
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: deleteLedgerHndlr,
            },
        ], [feeReceiptsResp]);

    const toggleViewDetailsModal = useCallback(() => {
        setViewReceiptModalState((prev: any) => ({
            ...prev,
            showModal: false
        }))
    }, [feeReceiptsResp]);

    function printReceiptHndlr(event: any) {
        const feeReceiptId = event.currentTarget.getAttribute("data-id");
        if (feeReceiptId)
            history.push(`/fee-receipts/preview-receipt/${feeReceiptId}`);
    }

    function viewReceiptDetailsHndlr(event: any) {
        const feeReceiptId = event.currentTarget.getAttribute("data-id"),
            modalData = feeReceiptsResp?.data?.find((item: any) => +item.id === Number(feeReceiptId));
        if (modalData) {
            setViewReceiptModalState((prev: any) => ({
                ...prev,
                feeReceiptId,
                showModal: true,
                modalData
            }))
        }
    }

    function updateReceiptToJodoHndlr(event: any) {
        const receiptId = event.currentTarget.getAttribute("data-id");
        openUpdateReceiptToJodoModal(receiptId)
    }

    const updateReceiptToJodoApiCall = () => {
        dispatch(updateErpToJodoReceiptAct(generateActionPayload('update_erpreceipt_tojodo', {
            receiptId: updateReceiptToJodoModalState.modalData
        })))
    }

    function deleteLedgerHndlr(event: any) {
        const id = event.currentTarget.getAttribute("data-id")
        if (id) {
            toggleDeleteLedgerModal(id)
        }
    }

    const deleteLedgerHndler = () => {
        dispatch(deleteLedgerDetailAct(generateActionPayload("delete_ledger_details", { id: deleteLedgerState?.id })));
    }

    function previousYearBalanceHndlr() {
        const { basicDetails } = ledgerDetails || {},
            { studentDetails, studentAcademicDetails } = basicDetails || {};
        if (studentDetails) {
            openPreviouseLedgerModalHndlr({
                id: studentDetails?.id,
                studentName: studentDetails?.studentName,
                studentCode: studentDetails?.studentCode,
                className: studentAcademicDetails?.classShortName,
                sectionName: studentAcademicDetails?.sectionName,
                contactNo: studentDetails?.contactNo,
                emailId: studentDetails?.emailId,
                studentImageBase64: studentDetails?.studentImageBase64
            });
        }
    }

    function updatePaymentToErpHndlr() {
        const { basicDetails } = ledgerDetails || {},
            { studentDetails } = basicDetails || {};
        const payload = {
            academicYearId: selectedYear,
            studentIds: [
                studentDetails?.id
            ]
        };
        dispatch(updateJodoPaymentToErpAct(generateActionPayload('update_jodopayment_toerp', undefined, payload)))
    }

    function updateJodoDiscountHndlr() {
        const { basicDetails } = ledgerDetails || {},
            { studentDetails } = basicDetails || {};
        const payload = {
            academicYearId: selectedYear,
            studentId: 
                studentDetails?.id
            
        };
        dispatch(updateJodoDiscountAct(generateActionPayload('update_jodo_discount', undefined, payload)))
    }

    function createJodoIdHndlr() {
        const { basicDetails } = ledgerDetails || {},
            { studentDetails } = basicDetails || {};
        const payload = {
            academicYearId: selectedYear,
            studentId:
                studentDetails?.id

        };
        dispatch(createJodoIdAct(generateActionPayload('create_jodo_id', undefined, payload)))
    }

    const concessionMenuOptions = useMemo(
        () => [
            {
                id: "view",
                actionIcon: <HugeiconsIcon icon={DownloadSquare02Icon} className="me-2 text-muted" size={18} />,
                actionName: "Download Documents",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    const findData = getStudentConcessionForFee?.data?.find((item: any) => +item.id === +id);
                    if (findData) {
                        openViewDocumentModal(findData?.fileInfo)
                    }
                },
            },
        ],
        [getStudentConcessionForFee]
    );

    const FeeDetailsColumns = useMemo(() => generateFeeDetailsColumns(), []);
    const SchedulesColumns = useMemo(() => generateScheduledColumns(), []);
    const LedgerColumns = useMemo(() => generateLedgerColumns(ledgerMenuOptions), [ledgerDetails]);
    const ReceiptColumns = useMemo(() => generateReceiptColumns(menuOptions), [feeReceiptsResp]);
    const ConcessionColumns = useMemo(() => generateConcessionColumns(concessionMenuOptions), [getStudentConcessionForFee]);
    const RefundColumns = useMemo(() => generateRefundsColumns(), []);

    const { ledgers: LedgerList, basicDetails: StudentDetails } = ledgerDetails || {};
    // TODO: remove once the ledger details API returns isEliteParent on parent records.
    const SHOW_ELITE_PARENT_SAMPLE = true;
    const isEliteParentKid = SHOW_ELITE_PARENT_SAMPLE || (Array.isArray(StudentDetails?.studentParentDetails)
        && StudentDetails.studentParentDetails.some((parent: any) => parent?.isEliteParent === true));
    const { data: FeeSummaryDetails } = feeSummaryDetails || {};
    const { data: FeeReceiptData } = feeReceiptsResp || {};
    const { data: StudentList } = studentsListResp || {};
    const { data: ConcessionList } = studentConcessionList || {};
    const { data: RefundDetails } = feeRefundsResp || {};
    const { data: academicYearList } = academicYearListResp || {};
    return (
        <div className="page-content fee-summary">
            <div className="container-fluid">
                <BreadCrumb title="Fee Summary > Fee Details" pageTitle="Fee" pageTitleUrl='/student-fee-ledger' />
                {/* <BackButtonText title="<< Back to Student Concessions List" /> */}
                <div className='card-body border border-bottom' style={{ background: "white" }}>

                    <div className='row g-3'>
                        <div className='col-xs-12 col-md-12 col-lg-3 col-xl-3'>
                            <AutoSearchInputUpdated
                                formgroupClassName="search-box"
                                name="studentId"
                                placeHolder="Search"
                                // onChange={(e: any) => setSearchInputState(e.target.value)}
                                onChange={(string: any) => {
                                    if (!string) feeSummaryForm.setFieldValue('studentId', "");
                                    onInputSearchChange(string)
                                }}
                                // onBlur={feeSummaryForm.handleBlur}
                                valueKey="studentId"
                                labelHeader="Student Code"
                                labelKey="studentCode"
                                subLabelHeader="Student Name"
                                subLabelKey="studentName"
                                options={StudentList}
                                selected={searchStudentState}
                                selectedOptionCallbck={selectedStudent}
                            // labelText = "Search"
                            // floatingLabel
                            ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                        </div>
                        <div className='col-xs-12 col-md-12 col-lg-3 col-xl-3 ms-auto'>
                            <SelectInput
                                name="academicYearId"
                                value={selectedYear}
                                onChange={handlerChange}
                                menuItems={academicYearList || []}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                // inputClassName="border-0"
                                formgroupClassName="mb-0"
                                labelText='Academic Year'
                                floatingLabel
                            // isDisabled={true}
                            // defaultSelect="2022-23"
                            />
                        </div>
                        <div className="col-xs-12 col-md-12 col-lg-auto col-xl-auto tw-flex tw-items-center tw-justify-center">
                            <Button
                                variant="info"
                                className='!tw-px-3 !tw-py-1.5'
                                type="button" onClick={printStudentLedgerBtnHndlr}
                            >
                                <span>Print Student Fee Ledger</span>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="row gx-2">
                    <div className="col-3">
                        <div className='card sticky-left-menucard'>
                            <div className='card-body'>
                                <div className='d-flex flex-column align-items-center mb-3'>
                                    <div
                                        className={
                                            `avatar-sm` +
                                            "flex-shrink-0 rounded-circle me-2"
                                        }
                                    >
                                        <img
                                            src={StudentDetails?.studentDetails?.studentImageBase64 ? `data:image/png;base64,${StudentDetails?.studentDetails?.studentImageBase64}` : DefaultStudentImage}
                                            className="img-fluid h-100 d-block rounded-circle"
                                            width={"72px"}
                                            height={"72px"}
                                        // onError={replaceBrokeImg}
                                        />
                                    </div>
                                    <p className='fs-16 m-0' style={{ fontFamily: "Poppins" }}>{StudentDetails?.studentDetails?.studentName}</p>
                                    <span className='px-3 py-2' style={{ backgroundColor: "#F7B84B2D", borderRadius: "5px", color: "black" }}>
                                        ID : {StudentDetails?.studentDetails?.studentCode}
                                    </span>
                                    {isEliteParentKid && (
                                        <span
                                            id="elite-parent-badge"
                                            className='d-inline-flex align-items-center gap-1 mt-2 px-3 py-1 fw-semibold'
                                            style={{ backgroundColor: "#FFF4D6", border: "1px solid #F7B84B", borderRadius: "999px", color: "#8A5A00", fontSize: "12px" }}
                                        >
                                            <img src={EliteParentIcon} alt="" width={16} height={16} />
                                            Elite Parent
                                        </span>
                                    )}
                                    {isEliteParentKid && (
                                        <UncontrolledTooltip target="elite-parent-badge" placement="bottom">
                                            This student's parent is marked as an Elite Parent
                                        </UncontrolledTooltip>
                                    )}
                                </div>
                                <div>
                                    {/* <div className='row'>
                                        <div className='col-5'>
                                            <p className='text-nowrap'>Admission No.</p>
                                        </div>
                                        <div className='col-7'>
                                            <p>{StudentDetails?.studentDetails?.admissionNo}</p>
                                        </div>
                                    </div> */}
                                    <div className='row'>
                                        <div className='col-5'>
                                            <p>Student Status</p>
                                        </div>
                                        <div className='col-7'>
                                            <p>{ledgerDetails?.studentStatus?.toUpperCase()}</p>
                                        </div>
                                    </div>
                                    {StudentDetails?.studentDetails?.parentEmployeeStatus && (<div className='row'>
                                        <div className='col-5'>
                                            <p>Parent is Staff</p>
                                        </div>
                                        <div className='col-7'>
                                            <p>{StudentDetails?.studentDetails?.parentEmployeeStatus?.toUpperCase()}</p>
                                        </div>
                                    </div>)}
                                    <div className='row'>
                                        <div className='col-5'>
                                            <p className=''>Admission No</p>
                                        </div>
                                        <div className='col-7'>
                                            <p>{ledgerDetails?.admissionNo || "-"}</p>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-5'>
                                            <p className='text-nowrap'>Curriculum</p>
                                        </div>
                                        <div className='col-7'>
                                            <p>{StudentDetails?.studentAcademicDetails?.curriculumName}</p>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-5'>
                                            <p className='text-nowrap'>Class</p>
                                        </div>
                                        <div className='col-7'>
                                            <p>{StudentDetails?.studentAcademicDetails?.classShortName}</p>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-5'>
                                            <p className='text-nowrap'>Section</p>
                                        </div>
                                        <div className='col-7'>
                                            <p>{StudentDetails?.studentAcademicDetails?.sectionName}</p>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-5'>
                                            <p className='text-nowrap'>Email</p>
                                        </div>
                                        <div className='col-7'>
                                            <p className='text-info'>{StudentDetails?.studentDetails?.emailId}</p>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-5'>
                                            <p className='text-nowrap'>Phone No.</p>
                                        </div>
                                        <div className='col-7'>
                                            <p>{StudentDetails?.studentDetails?.contactNo}</p>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-5'>
                                            <p className=''>Contact Person Name</p>
                                        </div>
                                        <div className='col-7'>
                                            <p>{Array.isArray(StudentDetails?.studentParentDetails) && StudentDetails?.studentParentDetails.length > 0 && StudentDetails?.studentParentDetails[0]?.name}</p>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-5'>
                                            <p className=''>Date Of Admission</p>
                                        </div>
                                        <div className='col-7'>
                                            <p>{getCurrentTimezoneYyyyMmDdFormat(StudentDetails?.studentDetails?.dateOfAdmission)}</p>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-5'>
                                            <p className=''>Jodo Opted Status</p>
                                        </div>
                                        <div className='col-7'>
                                            <p>{ledgerDetails?.jodoOptedStatus || "-"}</p>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-5'>
                                            <p className=''>JODO Student Id</p>
                                        </div>
                                        <div className='col-7'>
                                            <p>{ledgerDetails?.jodoStudentId || "-"}</p>
                                        </div>
                                    </div>
                                    <>{canCreateAndUpdate && ledgerDetails?.basicDetails?.studentAcademicDetails?.jodoStudentId === null && (
                                        <div className='row'>
                                            <div className='d-flex justify-content-center my-2'>
                                                <button className="btn btn-success float-end px-4" onClick={() => openCreateJodoIdModal()}>
                                                    <i className="ri-add-line" /> Generate JODO ID
                                                </button>
                                            </div>
                                        </div>
                                    )}</>
                                </div>
                                {canCreateAndUpdate && <>
                                    <div className='mb-3'>
                                        <div className='d-flex align-items-center my-4'>
                                            <hr style={{ flexGrow: 1, color: "#0AB39C" }} />
                                            <span className='text-center text-nowrap mx-2'>Fee Collection</span>
                                            <hr style={{ flexGrow: 1, color: "#0AB39C" }} /></div>
                                        <button
                                            className="btn btn-success w-100 mb-4"
                                            onClick={() => {
                                                if (StudentDetails) {
                                                    const { curriculumId, classId } = StudentDetails.studentAcademicDetails,
                                                        { studentCode, id, studentName } = StudentDetails.studentDetails;
                                                    history.push('/fee-receipts/create-receipt', {
                                                        curriculumId, classId,
                                                        studentCode, studentId: id, studentName,
                                                        academicYearId: routeState.academicYearId
                                                    })
                                                    // history.push('/new-fee-receipts', StudentDetails)
                                                }
                                                else {
                                                    toast.error('Sufficient Data is not there')
                                                }
                                            }}
                                        >
                                            <i className="ri-add-line me-2" />
                                            Collect Fee
                                        </button>
                                        <button
                                            className="btn btn-success w-100"
                                            onClick={() => {
                                                if (StudentDetails) {
                                                    const { curriculumId, classId } = StudentDetails.studentAcademicDetails,
                                                        { studentCode, id, studentName } = StudentDetails.studentDetails;
                                                    history.push('/fee-refunds/create-refund', {
                                                        curriculumId, classId,
                                                        studentCode, studentId: id, studentName,
                                                        academicYearId: selectedYear || routeState?.academicYearId
                                                    })
                                                }
                                                else {
                                                    toast.error('Sufficient Data is not there');
                                                }
                                            }}
                                        >
                                            <i className="ri-add-line me-2" />
                                            Refund Fee
                                        </button>
                                    </div>
                                    <div className='mb-5'>
                                        <div className='d-flex align-items-center my-4'>
                                            <hr style={{ color: "#0AB39C", flexGrow: 1 }} />
                                            <span className='text-center text-nowrap mx-2'>Concessions</span>
                                            <hr style={{ color: "#0AB39C", flexGrow: 1 }} /></div>
                                        <button
                                            className="btn btn-success w-100 mb-4"
                                            onClick={() => {
                                                if (StudentDetails) {
                                                    history.push('/academic-concessions/create-concession', { StudentDetails: { ...StudentDetails, academicYearId: selectedYear }, fromComponent: "Fee Summary" })
                                                }
                                                else {
                                                    toast.error('Sufficient Data is not there');
                                                }
                                            }}
                                        >
                                            <i className="ri-add-line me-2" />
                                            Fee Concession
                                        </button>
                                        {/* <button
                                        className="btn btn-success w-100"
                                        onClick={() => {
                                            // if (StudentDetails) {
                                            history.push('/tution-fee-concessions/create-concession', { StudentDetails: { ...StudentDetails, academicYearId: selectedYear }, fromComponent: "Fee Summary" })
                                            // }
                                            // else {
                                            //     toast.error('Sufficient Data is not there');
                                            // }
                                        }}
                                    >
                                        <i className="ri-add-line me-2" />
                                        Tution Fee Concession
                                    </button> */}
                                    </div>
                                </>}
                            </div>
                        </div>
                    </div>
                    <div className='col-9'>
                        <div className='card'>
                            <div className='card-body'>
                                <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "10px", marginTop: "20px" }}>
                                    <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Fee Summary</p>
                                    <div>
                                        <div className='row'>
                                            <div className='col-4'>
                                                <div className='d-flex fs-14'>
                                                    <p style={{ width: "50%" }} className='text-muted d-inline-block'>Total Fee :</p>
                                                    ₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].amountToPay)}</div>
                                            </div>
                                            <div className='col-4'>
                                                <div className='d-flex fs-14'><p style={{ width: "50%" }} className='text-muted d-inline-block pe-3'>Total Concession:</p>₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].totalConcession)}</div>
                                            </div>
                                            <div className='col-4'>
                                                <div className='d-flex fs-14'><p style={{ width: "50%" }} className='text-muted d-inline-block pe-3'>Total Payable :</p>₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].netAmount)}</div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-4'>
                                                <div className='d-flex fs-14'><p style={{ width: "50%" }} className='text-muted d-inline-block'>Paid Amount :</p>₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].amountPaid)}</div>
                                            </div>

                                            <div className='col-4'>
                                                <div className='d-flex fs-14'><p style={{ width: "50%" }} className='text-muted d-inline-block pe-3'>Previous Balance :</p>₹
                                                    {FeeSummaryDetails && FeeSummaryDetails.length > 0 &&
                                                        FeeSummaryDetails[0].previousYearBalance > 0
                                                        ? (<span
                                                            style={{ textDecoration: 'underline' }}
                                                            onClick={previousYearBalanceHndlr}
                                                            className='text-info ms-1 cursor-pointer'>{
                                                                getDisplayAmountValue(FeeSummaryDetails[0].previousYearBalance)}</span>) :
                                                        (
                                                            <span
                                                                onClick={previousYearBalanceHndlr}
                                                                className='ms-1'>{getDisplayAmountValue(FeeSummaryDetails?.[0]?.previousYearBalance)}</span>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            <div className='col-4'>
                                                <div className='row'>
                                                    <div className='d-flex fs-14'><p style={{ width: "50%" }} className='text-muted d-inline-block'>Total Refund :</p>₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].totalRefunds)}</div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-4'>
                                                <div className='d-flex fs-14'><p style={{ width: "50%" }} className='text-muted d-inline-block pe-3'>Balance on :<br /><span>({getDateMonthYearFormat(new Date())})</span></p>₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0]?.currentAmountToBePaid)}</div>
                                            </div>
                                            {(FeeSummaryDetails && FeeSummaryDetails.length > 0 && FeeSummaryDetails[0].totalAdmissionWithDrawlCharges) ? <div className='col-4'>
                                                <div className='d-flex fs-14'><p style={{ width: "50%" }} className='text-muted d-inline-block pe-3'>Admission Withdrawal Charges : </p>₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(+FeeSummaryDetails[0].totalAdmissionWithDrawlCharges)}</div>
                                            </div> : ""}
                                            <div className='col-4'>
                                                <div className='d-flex fs-14'><p style={{ width: "50%" }} className='text-muted d-inline-block pe-3'>Total Outstanding <br /> Amount :</p>₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0]?.amountToBePaid)}</div>
                                            </div>
                                            <div className="col-4 tw-flex tw-items-center tw-justify-center">
                                                <Button
                                                    variant="primary"
                                                    className="!tw-px-4 !tw-py-2 !tw-whitespace-nowrap"
                                                    type="button"
                                                    onClick={() => feeDueFollowUpRemarksOpenModal()}
                                                >
                                                    Fee Due Follow-Up Remarks
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <UncontrolledAccordionCard
                                        defaultOpen={[
                                            '1',
                                            '2',
                                            '3',
                                            '4',
                                            '5',
                                            '6'
                                        ]}
                                    >
                                        <AccordionCardItem>
                                            <AccordionCardHeader targetId="1" title="Fee Details" />
                                            <AccordionCardBody accordionId="1" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px", padding: "0px", border: "0px" }} >
                                                <div>
                                                    <TableContainer
                                                        columns={FeeDetailsColumns || []}
                                                        data={feeDetails || []}
                                                        divClass="table-responsive mb-1"
                                                        theadClass="align-middle"
                                                    // thClass="bg-light"
                                                    />
                                                </div>
                                            </AccordionCardBody>
                                        </AccordionCardItem>

                                        {/* <AccordionCardItem>
                                            <AccordionCardHeader targetId="2" title="Schedules" />

                                            <AccordionCardBody accordionId="2" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>
                                                <div>
                                                    <TableContainer
                                                        columns={SchedulesColumns || []}
                                                        data={scheduleDetails || []}
                                                        divClass="table-responsive mb-1"
                                                        theadClass="align-middle"
                                                    />
                                                </div>
                                            </AccordionCardBody>
                                        </AccordionCardItem> */}

                                        <AccordionCardItem>
                                            <AccordionCardHeader targetId="3" title="Ledger Details" />

                                            <AccordionCardBody accordionId="3" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>
                                                <div>
                                                    <TableContainer
                                                        columns={LedgerColumns || []}
                                                        data={LedgerList || []}
                                                        divClass="table-responsive mb-3"
                                                        theadClass="align-middle"
                                                    />
                                                </div>
                                            </AccordionCardBody>
                                        </AccordionCardItem>

                                        <AccordionCardItem>
                                            <AccordionCardHeader targetId="4" title="Receipts" />

                                            <AccordionCardBody accordionId="4" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>
                                                {canCreateAndUpdate && <div className='d-flex justify-content-end my-2'>
                                                    <button className="btn btn-success float-end px-4"
                                                        onClick={() => openUpdateJodoModal()}
                                                    >Update JODO payment to ERP</button>
                                                </div>}
                                                <div>
                                                    <TableContainer
                                                        columns={ReceiptColumns || []}
                                                        data={FeeReceiptData || []}
                                                        divClass="table-responsive mb-1"
                                                        theadClass="align-middle"
                                                    />
                                                </div>
                                            </AccordionCardBody>
                                        </AccordionCardItem>
                                        <AccordionCardItem>
                                            <AccordionCardHeader targetId="5" title="Concessions" />

                                            <AccordionCardBody accordionId="5" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>
                                                {canCreateAndUpdate && ledgerDetails?.basicDetails?.studentAcademicDetails?.jodoStudentId != null && <div className='d-flex justify-content-end my-2'>
                                                    <button className="btn btn-success float-end px-4"
                                                        onClick={() => openUpdateJodoDiscountModal()}
                                                    >Update Jodo Discount</button>
                                                </div>}
                                                <div>
                                                    <TableContainer
                                                        columns={ConcessionColumns}
                                                        data={Array.isArray(getStudentConcessionForFee?.data) ? getStudentConcessionForFee?.data : []}
                                                        divClass="table-responsive mb-1"
                                                        theadClass="align-middle"
                                                    />
                                                </div>
                                            </AccordionCardBody>
                                        </AccordionCardItem>
                                        <AccordionCardItem>
                                            <AccordionCardHeader targetId="6" title="Refunds" />

                                            <AccordionCardBody accordionId="6" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px" }}>
                                                <div>
                                                    <TableContainer
                                                        columns={RefundColumns || []}
                                                        data={RefundDetails || []}
                                                        divClass="table-responsive mb-1"
                                                        theadClass="align-middle"
                                                    />
                                                </div>
                                            </AccordionCardBody>
                                        </AccordionCardItem>

                                    </UncontrolledAccordionCard>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="add-specialfee-modal"
                isOpen={viewReceiptModalState.showModal}
                toggle={toggleViewDetailsModal}
                modalTitle="Receipt Details"
                modalSize="xl"
            >
                <FeeDetailsModal
                    toggle={toggleViewDetailsModal}
                    //   feeReceiptId={editFeeDetailsModalState.feeReceiptId}
                    modalTitle="Fee Details"
                    receiptDetails={viewReceiptModalState.modalData}
                    printReceiptHndlr={printReceiptHndlr}
                    from="feeSummary"
                //   editFeeDetailsHndlr={editFeeDetailsModalHndlr}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="previousyear-ledgerbalance-modal"
                isOpen={previousLedgerModalState.showModal}
                toggle={closePreviousLedgerModalHndlr}
                modalTitle="Previous Ledger Balance"
                modalSize="xl"
            >
                <PreviousYearLedgerBalance
                    branchId={branchId}
                    academicYearId={selectedYear}
                    studentData={previousLedgerModalState.modalData}
                    toggle={closePreviousLedgerModalHndlr}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-ledger-details"
                isOpen={deleteLedgerState.showModal}
                confirmMessage="Are you sure you want Delete Ledger ?"
                cancelHndlr={() => toggleDeleteLedgerModal()}
                confirmHndlr={deleteLedgerHndler}
                isDisble={showApiLoader}
                btnClassName='btn w-sm btn-danger'
                showImgIcon={true}
                iconType="reject"
            />
            <ModalContainerUpdated
                id="fee-summary-view-document-modal"
                isOpen={viewDocumentModalState.showModal}
                toggle={closeViewDocumentModal}
                modalTitle="Documnets"
                modalSize="md"
            >
                <ViewDocumentModal
                    toggle={closeViewDocumentModal}
                    data={viewDocumentModalState.modalData}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="update-jodo-payment-to-erp-modal"
                isOpen={updateJodoModalState.showModal}
                toggle={closeUpdateJodoModal}
                modalTitle="Update JODO payment to ERP"
                modalSize="md"
            >
                <ExportModal
                    isOpen={updateJodoModalState.showModal}
                    toggle={closeUpdateJodoModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={updatePaymentToErpHndlr}
                    feature="fee"
                    subFeature="jodo_updates"
                    remarksText=""
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="update-jodo-payment-to-erp-modal"
                isOpen={createJodoIdModalState.showModal}
                toggle={closeCreateJodoIdModal}
                modalTitle="Generate JODO ID"
                modalSize="md"
            >
                <ExportModal
                    isOpen={createJodoIdModalState.showModal}
                    toggle={closeCreateJodoIdModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={createJodoIdHndlr}
                    feature="fee"
                    subFeature="jodo_updates"
                    remarksText=""
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="update-jodo-payment-to-erp-action-modal"
                isOpen={updateReceiptToJodoModalState.showModal}
                toggle={closeUpdateReceiptToJodoModal}
                modalTitle="Update Receipt To JODO"
                modalSize="md"
            >
                <ExportModal
                    isOpen={updateReceiptToJodoModalState.showModal}
                    toggle={closeUpdateReceiptToJodoModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={updateReceiptToJodoApiCall}
                    feature="fee"
                    subFeature="jodo_updates"
                    remarksText=""
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="update-jodo-discount-modal"
                isOpen={updateJodoDiscountModalState.showModal}
                toggle={closeUpdateJodoDiscountModal}
                modalTitle="Update JODO Discount"
                modalSize="md"
            >
                <ExportModal
                    isOpen={updateJodoDiscountModalState.showModal}
                    toggle={closeUpdateJodoDiscountModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={updateJodoDiscountHndlr}
                    feature="fee"
                    subFeature="jodo_discount_update"
                    remarksText=""
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="print-student-fee-ledger-modal"
                isOpen={printStudentFeeLedgerModalState.showModal}
                toggle={closePrintModalHandler}
                modalTitle="Preview Student Fee Ledger"
                modaClassName="print-modal"
            >
                <PrintStudentFeeLedgerModal
                    isOpen={printStudentFeeLedgerModalState.showModal}
                    toggle={closePrintModalHandler}
                    modalTitle="Preview Student Fee Ledger"
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="fee-due-follow-up-remarks-modal"
                isOpen={feeDueFollowUpRemarksModalState.showModal}
                toggle={feeDueFollowUpRemarksCloseModal}
                modalSize="xl"
                modalTitle='Fee Due Follow-Up Remarks'
            >
                <FeeDueFollowUpRemarks
                    isOpen={feeDueFollowUpRemarksModalState.showModal}
                    toggle={feeDueFollowUpRemarksCloseModal}
                    modalTitle=""
                    showApiLoader={showApiLoader}
                    studentId={searchStudentState?.studentId || routeState.studentId}
                    academicYearId={selectedYear || routeState.academicYearId}
                />
            </ModalContainerUpdated>
        </div>
    )
}

export default FeeSummaryDetails
