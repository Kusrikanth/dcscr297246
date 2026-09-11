import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BreadCrumb from '../../../../../Components/Common/BreadCrumb'
import { AutoSearchInputUpdated, ConfirmationModal, ModalContainerUpdated, SelectInput, StatusLabel } from '../../../../../Components/Common'
import DefaultStudentImage from "../../../../../assets/imagesdps/student-default-img.png";
import UncontrolledAccordionCard from '../../../../../Components/Common/UncontrolledAccordionCard';
import AccordionCardItem from '../../../../../Components/Common/AccordionCardItem';
import AccordionCardHeader from '../../../../../Components/Common/AccordionCardHeader';
import AccordionCardBody from '../../../../../Components/Common/AccordionCardBody';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { generateConcessionColumns, generateFeeDetailsColumns, generateLedgerColumns, generateReceiptColumns, generateRefundsColumns, generateScheduledColumns } from './helper';
import { shallowEqual, useDispatch } from 'react-redux';
import { deleteLedgerDetailAct, getFeeReceiptsAct, getFeeRefundsAct, getStudentConcessionForFeeSummaryAct, updateErpToJodoReceiptAct, updateJodoPaymentToErpAct } from '../../../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../../../hooks/storehook';
import { toast } from 'react-toastify';
import { getDisplayAmountValue } from '../../../../../utility/commonutility';
import { default as EyeSvg } from "../../../../../assets/imagesdps/academics/EyeSvg.svg?react";
import { useFormik } from 'formik';
import { getStudentsListAct } from '../../../../../store/directory/studentmanagement/studentmanagementactions';
import FeeDetailsModal from '../../../../FreeModules/FeeReceipts/FeeDetailsModal';
import { useModal } from '../../../../../hooks/modalhook';
import { getHostelStuLedgerDetailsAct } from '../../../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions';
import { getStudentConcessionListAct } from '../../../../../store/fee/feeconcessions/feeconcessionactions';
import { getDateMonthYearFormat, getDdMmYyyyFormat } from '../../../../../utility/dateutility';
import Button from '../../../../../Components/Common/Button';
import { HugeiconsIcon } from '@hugeicons/react';
import { DownloadSquare02Icon } from '@hugeicons-pro/core-stroke-standard';
import ViewDocumentModal from './ViewDocumentModal';

const StudentLedgerDetails = () => {
    const { modalState: previousLedgerModalState, closeModal: closePreviousLedgerModalHndlr,
        openModal: openPreviouseLedgerModalHndlr
    } = useModal();
    const { closeModal: closeViewDocumentModal, modalState: viewDocumentModalState, openModal: openViewDocumentModal } = useModal()
    
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

    const location: any = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    const [selectedYear, setSelectedYear] = useState('');
    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const {
        academicYearListResp,
        ledgerDetails,
        feeReceiptsResp,
        feeRefundsResp,
        studentConcessionList,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getStudentConcessionForFee,
        studentsListResp,
        deleteLedgerDetailResp,
        feeCollectionErrorResp,
        updateErpToJodoReceiptResp,
        updateJodoToErpPaymentResp,
        getHostelStuLedgerDetailsResp,
        showApiLoader,
        hostelStuLedgerErrResp,
    } = useAppSelector(
        ({ classroomManagmentInfo, directoryStudent, instAcademics, hostelStuLedger, appData, feeCollections, feeConcession, globalData }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            ledgerDetails: feeCollections.ledgerDetails,
            feeReceiptsResp: feeCollections.feeReceiptsResp,
            updateErpToJodoReceiptResp: feeCollections.updateErpToJodoReceiptResp,
            updateJodoToErpPaymentResp: feeCollections.updateJodoToErpPaymentResp,
            deleteLedgerDetailResp: feeCollections.deleteLedgerDetailResp,
            feeRefundsResp: feeCollections.feeRefundsResp,
            studentConcessionList: feeConcession.studentConcessionList,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            studentsListResp: directoryStudent.studentsListResp,
            getStudentConcessionForFee: feeCollections.getStudentConcessionForFee,
            feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
            showApiLoader: globalData.showApiLoader,
            getHostelStuLedgerDetailsResp: hostelStuLedger.getHostelStuLedgerDetailsResp,
            hostelStuLedgerErrResp: hostelStuLedger.hostelStuLedgerErrResp,
        }),
        shallowEqual
    );

    const feeSummaryDetailsRespRef = useRef({
        prevDeleteLedgerDetailResp: deleteLedgerDetailResp,
        prevUpdateErpToJodoReceiptResp: updateErpToJodoReceiptResp,
        prevUpdateJodoToErpPaymentResp: updateJodoToErpPaymentResp,
        prevFeeCollectionErrorResp: feeCollectionErrorResp,
        prevHostelStuLedgerErrResp: hostelStuLedgerErrResp,
    });

    useEffect(() => {
        const { prevDeleteLedgerDetailResp, prevUpdateErpToJodoReceiptResp,
            prevUpdateJodoToErpPaymentResp,
            prevFeeCollectionErrorResp, prevHostelStuLedgerErrResp } = feeSummaryDetailsRespRef.current;

        // if (deleteLedgerDetailResp && deleteLedgerDetailResp !== prevDeleteLedgerDetailResp) {
        //     toast.success("Selected Ledger Deleted Successfully.");
        //     // getLedgerDetails(searchStudentState?.studentId || location.state?.studentId, selectedYear);
        //     getStudentConcessionDetails(searchStudentState?.studentId || location.state?.studentId, selectedYear, searchStudentState?.classId || location.state?.classId);
        //     toggleDeleteLedgerModal();
        // } else if (updateErpToJodoReceiptResp && prevUpdateErpToJodoReceiptResp !== updateErpToJodoReceiptResp) {
        //     toast.success("Reciept updated successfully to JODO.");
        //     let studentId;
        //     if (searchStudentState) {
        //         studentId = searchStudentState?.studentId
        //     } else {
        //         studentId = location.state?.studentId
        //     }
        //     getFeeReceiptDetails(studentId, selectedYear);
        // } else if (updateJodoToErpPaymentResp && prevUpdateJodoToErpPaymentResp !== updateJodoToErpPaymentResp) {
        //     toast.success("Payment update successfully to ERP.");
        // }
        if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
            const { details } = feeCollectionErrorResp || {};
            toast.error(details)
        }
        else if (hostelStuLedgerErrResp && prevHostelStuLedgerErrResp !== hostelStuLedgerErrResp) {
            const { details } = hostelStuLedgerErrResp || {};
            toast.error(details)
        }

        feeSummaryDetailsRespRef.current.prevDeleteLedgerDetailResp = deleteLedgerDetailResp;
        feeSummaryDetailsRespRef.current.prevUpdateErpToJodoReceiptResp = updateErpToJodoReceiptResp;
        feeSummaryDetailsRespRef.current.prevUpdateJodoToErpPaymentResp = updateJodoToErpPaymentResp;
        feeSummaryDetailsRespRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
        feeSummaryDetailsRespRef.current.prevHostelStuLedgerErrResp = hostelStuLedgerErrResp;

    }, [searchStudentState, selectedYear, deleteLedgerDetailResp, updateErpToJodoReceiptResp,
        updateJodoToErpPaymentResp, feeCollectionErrorResp, hostelStuLedgerErrResp]);

    const feeSummaryForm = useFormik({
        enableReinitialize: true,
        initialValues: { studentId: "" },
        onSubmit: (values: any) => {
        },
    });

    const getHostelStuLedgerDetails = (studentId: any, academicYearId: any) => {
        let payload = {
            studentId: studentId,
            branchId: branchId,
            academicYearId: academicYearId,
            studentInfo: "studentInfo",
            allowStudentConcession: "",
            allowEmployeeConcession: "YES",
            allowRefund: "NO",
            // feeType: ["FEE STRUCTURE"],
            ledgerId: 1,
            sortBy: "id"
        }
        dispatch(getHostelStuLedgerDetailsAct(generateActionPayload('hostel_stu_ledger_details', undefined, payload)));
    }
    // const getStudentFeeDetails = (studentId: any, academicYearId: any) => {
    //     let params2 = { branchId: branchId, academicYearId: academicYearId };
    //     dispatch(getFeeDetailsAct(generateActionPayload('student_fee_details', { studentId: studentId }, params2)));
    // }
    // const getStudentScheduleDetails = (studentId: any, academicYearId: any) => {
    //     let params2 = { branchId: branchId, academicYearId: academicYearId };
    //     dispatch(getScheduleDetailsAct(generateActionPayload('student_schedule_details', { studentId: studentId }, params2)))
    // }
    const getFeeReceiptDetails = (studentId: any, academicYearId: any) => {
        let payload1 = {
            studentId: studentId,
            branchId: branchId,
            academicYearId: academicYearId,
        };
        dispatch(getFeeReceiptsAct(generateActionPayload('get_hostel_fee_receipts', undefined, payload1)))
    }
    const getStudentConcessionDetails = (studentId: any, academicYearId: any, classId: any) => {
        let payload2 = {
            studentId: studentId,
            academicYearId: academicYearId,
            classId: classId,
            branchId: branchId,
        };
        dispatch(getStudentConcessionListAct(generateActionPayload('get_hostel_concession', undefined, payload2)))
    }
    const getFeeRefundDetails = (studentId: any, academicYearId: any, classId: any) => {
        let payload3 = {
            studentId: studentId,
            studentName: "",
            // instituteId: instituteId,
            branchId: branchId,
            academicYearId: academicYearId,
            pageNo: 0, pageSize: 100
        };
        dispatch(getFeeRefundsAct(generateActionPayload('get_hostel_fee_refund_list', undefined, payload3)))
    }

    useEffect(() => {
        const { studentId, academicYearId, curriculumId, classId } = location.state || {};
        setSelectedYear(academicYearId)
        getHostelStuLedgerDetails(studentId, academicYearId)
        // getStudentFeeDetails(studentId, academicYearId)
        // getStudentScheduleDetails(studentId, academicYearId)
        getFeeReceiptDetails(studentId, academicYearId)
        getStudentConcessionDetails(studentId, academicYearId, classId)
        getFeeRefundDetails(studentId, academicYearId, classId)
    }, [location,branchId,instituteId])

    const handlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedYear(event.target.value);
        if (event.target.value) {
            history.replace({
                ...location,
                state: {
                    ...location.state,
                    academicYearId: event.target.value
                },
            });
        }
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
                        ...location.state,
                        studentId: student?.studentId
                    },
                });
            }
        }
    }


    const menuOptions = useMemo(
        () => [
            {
                id: "updateReceiptToJodo",
                actionIcon: <i className='ri-chat-upload-line d-inline-block fs-normal mt-1 text-muted'></i>,
                actionName: "Update receipt to JODO",
                onClickHndlr: updateReceiptToJodoHndlr,
            },
            {
                id: "viewDetails",
                actionIcon: <EyeSvg className="me-2 d-inline-block" fill="#878a99" />,
                actionName: "View Details",
                onClickHndlr: viewReceiptDetailsHndlr,
            }
        ], [getHostelStuLedgerDetailsResp]);

    const ledgerMenuOptions = useMemo(
        () => [
            {
                id: "delete",
                actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16 me-2"></i>,
                actionName: "Delete",
                onClickHndlr: deleteLedgerHndlr,
            },
        ], [getHostelStuLedgerDetailsResp]);

    const toggleViewDetailsModal = useCallback(() => {
        setViewReceiptModalState((prev: any) => ({
            ...prev,
            showModal: false
        }))
    }, [getHostelStuLedgerDetailsResp]);

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
        dispatch(updateErpToJodoReceiptAct(generateActionPayload('update_erpreceipt_tojodo', {
            receiptId
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


    const concessionMenuOptions = useMemo(
        () => [
            {
                id: "view",
                actionIcon: <HugeiconsIcon icon={DownloadSquare02Icon} className="me-2 text-muted" size={18} />,
                actionName: "Download Documents",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    const findData = studentConcessionList?.data?.find((item: any) => +item.id === +id);
                    if (findData) {
                        openViewDocumentModal(findData?.fileInfo)
                    }
                },
            },
        ],
        [studentConcessionList]
    );

    const FeeDetailsColumns = useMemo(() => generateFeeDetailsColumns(), []);
    const SchedulesColumns = useMemo(() => generateScheduledColumns(), []);
    const LedgerColumns = useMemo(() => generateLedgerColumns(ledgerMenuOptions), [getHostelStuLedgerDetailsResp]);
    const ReceiptColumns = useMemo(() => generateReceiptColumns(menuOptions), [feeReceiptsResp]);
    const ConcessionColumns = useMemo(() => generateConcessionColumns(concessionMenuOptions), [studentConcessionList]);
    const RefundColumns = useMemo(() => generateRefundsColumns(), []);

    const { ledgersDtos: LedgerList, studentDetailsDto: StudentDetails, feeSummeryDto: FeeSummaryDetails, feeDetailsDtos: feeDetails, schedulesDtos: scheduleDetails } = getHostelStuLedgerDetailsResp || {};
    // const { data: FeeSummaryDetails } = feeSummaryDetails || {};
    const { data: FeeReceiptData } = feeReceiptsResp || {};
    const { data: StudentList } = studentsListResp || {};
    const { data: ConcessionList } = studentConcessionList || {};
    const { data: RefundDetails } = feeRefundsResp || {};
    const { studentConcessions: StudentConcessions, tuitionFeeConcessions: TutionConcessions } = getStudentConcessionForFee || {};
    const { data: academicYearList } = academicYearListResp || {};
    return (
        <div className="page-content fee-summary">
            <div className="tw-w-full tw-mx-auto tw-px-3">
                <BreadCrumb title="Fee Summary > Fee Details" pageTitle="Hostel Fee" pageTitleUrl='/student-fee-ledger' />
                {/* <BackButtonText title="<< Back to Student Concessions List" /> */}
                <div className='tw-p-4 tw-border tw-border-b tw-bg-white'>

                    <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-12 tw-gap-3'>
                        <div className='tw-col-span-1 lg:tw-col-span-3'>
                            <AutoSearchInputUpdated
                                formgroupClassName="search-box"
                                name="studentId"
                                placeHolder="Search..."
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

                            ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                        </div>
                        <div className='tw-col-span-1 lg:tw-col-span-9 tw-ml-auto'>
                            <SelectInput
                                name="academicYearId"
                                value={selectedYear}
                                onChange={handlerChange}
                                menuItems={academicYearList || []}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                // inputClassName="tw-border-0"
                                formgroupClassName="tw-mb-0"
                            // isDisabled={true}
                            // defaultSelect="2022-23"
                            />
                        </div>
                    </div>
                </div>
                <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-2">
                    <div className="tw-col-span-1 lg:tw-col-span-3">
                        <div className='tw-bg-white tw-rounded-lg tw-shadow sticky-left-menucard'>
                            <div className='tw-p-4'>
                                <div className='tw-flex tw-flex-col tw-items-center tw-mb-3'>
                                    <div
                                        className={
                                            `tw-w-18 tw-h-18` +
                                            " tw-flex-shrink-0 tw-rounded-full tw-mr-2"
                                        }
                                    >
                                        <img
                                            src={StudentDetails?.fullImage ? `data:image/png;base64,${StudentDetails?.fullImage}` : DefaultStudentImage}
                                            className="tw-w-full tw-h-full tw-block tw-rounded-full"
                                            width={"72px"}
                                            height={"72px"}
                                        // onError={replaceBrokeImg}
                                        />
                                    </div>
                                    <p className='tw-text-base tw-m-0' style={{ fontFamily: "Poppins" }}>{StudentDetails?.studentName}</p>
                                    <span className='tw-px-3 tw-py-2' style={{ backgroundColor: "#F7B84B2D", borderRadius: "5px", color: "black" }}>
                                        ID : {StudentDetails?.studentCode}
                                    </span>
                                </div>
                                <div>
                                    <div className='tw-grid tw-grid-cols-12'>
                                        <div className='tw-col-span-5'>
                                            <p className='tw-whitespace-nowrap'>Hostel Status</p>
                                        </div>
                                        <div className='tw-col-span-7'>
                                            <p>
                                                <StatusLabel labelName={StudentDetails?.hostelStatus} type={StudentDetails?.hostelStatus} />
                                                &nbsp;&nbsp;  {StudentDetails?.hostelStatus?.toLowerCase() === "inactive" && `(${StudentDetails?.requestRaisedFrom})`}</p>
                                        </div>
                                    </div>
                                    <div className='tw-grid tw-grid-cols-12'>
                                        <div className='tw-col-span-5'>
                                            <p>Admission No.</p>
                                        </div>
                                        <div className='tw-col-span-7'>
                                            <p>{StudentDetails?.admissionNo}</p>
                                        </div>
                                    </div>
                                    <div className='tw-grid tw-grid-cols-12'>
                                        <div className='tw-col-span-5'>
                                            <p className='tw-whitespace-nowrap'>Class</p>
                                        </div>
                                        <div className='tw-col-span-7'>
                                            <p>{StudentDetails?.className}</p>
                                        </div>
                                    </div>
                                    <div className='tw-grid tw-grid-cols-12'>
                                        <div className='tw-col-span-5'>
                                            <p className='tw-whitespace-nowrap'>Section</p>
                                        </div>
                                        <div className='tw-col-span-7'>
                                            <p>{StudentDetails?.sectionName}</p>
                                        </div>
                                    </div>
                                    <div className='tw-grid tw-grid-cols-12'>
                                        <div className='tw-col-span-5'>
                                            <p className='tw-whitespace-nowrap'>Email</p>
                                        </div>
                                        <div className='tw-col-span-7'>
                                            <p>{StudentDetails?.email}</p>
                                        </div>
                                    </div>
                                    <div className='tw-grid tw-grid-cols-12'>
                                        <div className='tw-col-span-5'>
                                            <p className='tw-whitespace-nowrap'>Phone No.</p>
                                        </div>
                                        <div className='tw-col-span-7'>
                                            <p className='tw-text-blue-500'>{StudentDetails?.phoneNo}</p>
                                        </div>
                                    </div>
                                    <div className='tw-grid tw-grid-cols-12'>
                                        <div className='tw-col-span-5'>
                                            <p className='tw-whitespace-nowrap'>Parent Name</p>
                                        </div>
                                        <div className='tw-col-span-7'>
                                            <p>{StudentDetails?.parentName}</p>
                                        </div>
                                    </div>
                                    <div className='tw-grid tw-grid-cols-12'>
                                        <div className='tw-col-span-5'>
                                            <p className=''>Date Of Admission</p>
                                        </div>
                                        <div className='tw-col-span-7'>
                                            <p>{getDdMmYyyyFormat(StudentDetails?.admissionDate)}</p>
                                        </div>
                                    </div>

                                </div>
                                <div className='tw-mb-3'>
                                    <div className='tw-flex tw-items-center tw-my-4'>
                                        <hr className="tw-flex-grow tw-border-t tw-border-primary" />
                                        <span className='tw-text-center tw-whitespace-nowrap tw-mx-2'>Fee Collection</span>
                                        <hr className="tw-flex-grow tw-border-t tw-border-primary" /></div>
                                    <Button
                                        variant='primary'
                                        onClick={() => {
                                            if (StudentDetails) {
                                                const { curriculumId, classId, studentCode, studentId, studentName } = StudentDetails || {}

                                                history.push('/hostel-fee-receipt/create-fee-receipt', {
                                                    curriculumId, classId,
                                                    studentCode, studentId, studentName,
                                                    academicYearId: location.state.academicYearId
                                                })
                                            }
                                            else {
                                                toast.error('Sufficient Data is not there')
                                            }
                                        }}
                                    >
                                        <i className="ri-add-line tw-mr-2" />
                                        Collect Fee
                                    </Button>
                                    {/* <button
                                        className="btn btn-success w-100"
                                        // onClick={() => {
                                        //     if (StudentDetails) {
                                        //         const { curriculumId, classId } = StudentDetails.studentAcademicDetails,
                                        //             { studentCode, id, studentName } = StudentDetails.studentDetails;
                                        //         history.push('/fee-refunds/create-refund', {
                                        //             curriculumId, classId,
                                        //             studentCode, studentId: id, studentName,
                                        //             academicYearId: location.state.academicYearId
                                        //         })
                                        //     }
                                        //     else {
                                        //         toast.error('Sufficient Data is not there');
                                        //     }
                                        // }}
                                    >
                                        <i className="ri-add-line me-2" />
                                        Refund Fee
                                    </button> */}
                                </div>
                                <div className='tw-mb-5'>
                                    <div className='tw-flex tw-items-center tw-my-4'>
                                        <hr className="tw-flex-grow tw-border-t tw-border-primary" />
                                        <span className='tw-text-center tw-whitespace-nowrap tw-mx-2'>Concessions</span>
                                        <hr className="tw-flex-grow tw-border-t tw-border-primary" /></div>
                                    <button
                                        className="tw-bg-primary tw-text-white tw-border-0 tw-rounded tw-px-4 tw-py-2 tw-w-full tw-mb-4  tw-transition-colors"
                                        onClick={() => {
                                            if (StudentDetails) {
                                                history.push('/hostel-concession/create-concession', { StudentDetails: { ...StudentDetails, academicYearId: selectedYear }, fromComponent: "Fee Summary" })
                                            }
                                            else {
                                                toast.error('Sufficient Data is not there');
                                            }
                                        }}
                                    >
                                        <i className="ri-add-line tw-mr-2" />
                                        Concession
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='tw-col-span-1 lg:tw-col-span-9'>
                        <div className='tw-bg-white tw-rounded-lg tw-shadow'>
                            <div className='tw-p-4'>
                                <div className="tw-relative tw-inline-block tw-w-full tw-p-5 tw-border tw-border-gray-300 tw-rounded-md tw-mb-2.5 tw-mt-5">
                                    <p className='tw-text-sm tw-absolute tw--top-2.5 tw-px-2.5 tw-text-gray-700 tw-bg-white'>Fee Summary</p>
                                    <div>
                                        <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4'>
                                            <div className='tw-col-span-1'>
                                                <div className='tw-flex tw-text-sm'>
                                                    <p className='tw-w-1/2 tw-text-gray-500 tw-inline-block'>Total Fee :</p>
                                                    ₹ {FeeSummaryDetails && getDisplayAmountValue(FeeSummaryDetails?.totalFee)}</div>
                                            </div>
                                            <div className='tw-col-span-1'>
                                                <div className='tw-flex tw-text-sm'><p className='tw-w-1/2 tw-text-gray-500 tw-inline-block tw-pr-3'>Total Concession:</p>₹ {FeeSummaryDetails && getDisplayAmountValue(FeeSummaryDetails?.totalConcession)}</div>
                                            </div>
                                            <div className='tw-col-span-1'>
                                                <div className='tw-flex tw-text-sm'><p className='tw-w-1/2 tw-text-gray-500 tw-inline-block tw-pr-3'>Total Payable :</p>₹ {FeeSummaryDetails && getDisplayAmountValue(FeeSummaryDetails?.totalPayble)}</div>
                                            </div>
                                        </div>
                                        <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4'>
                                            <div className='tw-col-span-1'>
                                                <div className='tw-flex tw-text-sm'><p className='tw-w-1/2 tw-text-gray-500 tw-inline-block'>Paid Amount :</p>₹ {FeeSummaryDetails && getDisplayAmountValue(FeeSummaryDetails?.paidAmount)}</div>
                                            </div>
                                            <div className='tw-col-span-1'>
                                                <div className='tw-grid'>
                                                    <div className='tw-flex tw-text-sm'><p className='tw-w-1/2 tw-text-gray-500 tw-inline-block'>Total Outstanding <br /> Amount :</p>₹ {FeeSummaryDetails && getDisplayAmountValue(FeeSummaryDetails?.unpaidAmount)}</div>

                                                </div>
                                            </div>
                                            <div className='tw-col-span-1'>
                                                <div className='tw-grid'>
                                                    <div className='tw-flex tw-text-sm'><p className='tw-w-1/2 tw-text-gray-500 tw-inline-block'>Previous Balance :</p>₹ {FeeSummaryDetails && getDisplayAmountValue(FeeSummaryDetails?.previousBalance)}</div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4'>
                                            <div className='tw-col-span-1'>
                                                <div className='tw-flex tw-text-sm'><p className='tw-w-1/2 tw-text-gray-500 tw-inline-block'>Total Refund:</p>₹ {FeeSummaryDetails && getDisplayAmountValue(FeeSummaryDetails?.totalRefund)}</div>
                                            </div>
                                            <div className='tw-col-span-1'>
                                                <div className='tw-grid'>
                                                    <div className='tw-flex tw-text-sm'><p className='tw-w-1/2 tw-text-gray-500 tw-inline-block'>Balance on :<br /><span>({getDateMonthYearFormat(new Date())})</span></p>₹ {FeeSummaryDetails && getDisplayAmountValue(FeeSummaryDetails?.totalOutStanding)}</div>
                                                </div>
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
                                            <AccordionCardBody accordionId="1" className="tw-border-t-0 tw-rounded-b-md tw-p-0 tw-border-0" >
                                                <div>
                                                    <TableContainer
                                                        columns={FeeDetailsColumns || []}
                                                        data={feeDetails || []}
                                                        divClass="tw-overflow-x-auto tw-mb-1"
                                                        theadClass="tw-align-middle"
                                                    // thClass="tw-bg-gray-100"
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

                                            <AccordionCardBody accordionId="3" className="tw-border-t-0 tw-rounded-b-md">
                                                <div>
                                                    <TableContainer
                                                        columns={LedgerColumns || []}
                                                        data={LedgerList || []}
                                                        divClass="tw-overflow-x-auto tw-mb-3"
                                                        theadClass="tw-align-middle"
                                                    />
                                                </div>
                                            </AccordionCardBody>
                                        </AccordionCardItem>

                                        <AccordionCardItem>
                                            <AccordionCardHeader targetId="4" title="Receipts" />

                                            <AccordionCardBody accordionId="4" className="tw-border-t-0 tw-rounded-b-md">
                                                {/* <div className='tw-flex tw-justify-end tw-my-2'>
                                                    <button className="tw-bg-emerald-500 tw-text-white tw-border-0 tw-rounded tw-float-right tw-px-4 tw-py-2 hover:tw-bg-emerald-600 tw-transition-colors"
                                                        onClick={updatePaymentToErpHndlr}
                                                    >Update JODO payment to ERP</button>
                                                </div> */}
                                                <div>
                                                    <TableContainer
                                                        columns={ReceiptColumns || []}
                                                        data={FeeReceiptData || []}
                                                        divClass="tw-overflow-x-auto tw-mb-1"
                                                        theadClass="tw-align-middle"
                                                    />
                                                </div>
                                            </AccordionCardBody>
                                        </AccordionCardItem>
                                        <AccordionCardItem>
                                            <AccordionCardHeader targetId="5" title="Concessions" />

                                            <AccordionCardBody accordionId="5" className="tw-border-t-0 tw-rounded-b-md">
                                                <div>
                                                    <TableContainer
                                                        columns={ConcessionColumns || []}
                                                        data={studentConcessionList?.data || []}
                                                        divClass="tw-overflow-x-auto tw-mb-1"
                                                        theadClass="tw-align-middle"
                                                    />
                                                </div>
                                            </AccordionCardBody>
                                        </AccordionCardItem>
                                        <AccordionCardItem>
                                            <AccordionCardHeader targetId="6" title="Refunds" />

                                            <AccordionCardBody accordionId="6" className="tw-border-t-0 tw-rounded-b-md">
                                                <div>
                                                    <TableContainer
                                                        columns={RefundColumns || []}
                                                        data={RefundDetails || []}
                                                        divClass="tw-overflow-x-auto tw-mb-1"
                                                        theadClass="tw-align-middle"
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

            {/* <ModalContainerUpdated
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
            </ModalContainerUpdated> */}
            <ConfirmationModal
                id="delete-ledger-details"
                isOpen={deleteLedgerState.showModal}
                confirmMessage="Are you sure you want Delete Ledger ?"
                cancelHndlr={() => toggleDeleteLedgerModal()}
                confirmHndlr={deleteLedgerHndler}
                isDisble={showApiLoader}
                btnClassName='tw-bg-red-500 tw-text-white tw-border-0 tw-rounded tw-px-4 tw-py-2 hover:tw-bg-red-600 tw-transition-colors tw-text-sm'
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
        </div>
    )
}

export default StudentLedgerDetails
