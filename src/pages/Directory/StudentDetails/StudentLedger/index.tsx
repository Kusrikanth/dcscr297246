import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { shallowEqual, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useAppSelector } from '../../../../hooks/storehook';
import { IPaginationState } from '../../../../Components/Common/Pagination';
import { StudentLedgerData, generateColumns } from './helper';
import { SelectInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getFeeSummaryDetailsAct, getLedgerDetailsAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { getDisplayAmountValue } from '../../../../utility/commonutility';
import { getDateMonthYearFormat } from '../../../../utility/dateutility';
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle03StrokeStandard } from "@hugeicons-pro/core-stroke-standard";


const initialValues: any = {
    search: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    type: "",
    status:""
};

interface IStudentInfo {
    studentId: number;
    branchId: number;
    instituteId: number;
    academicYearId: string;
}

const StudentLedger = (props:IStudentInfo) => {


    const history = useHistory();
    const params= useParams<any>()
    const dispatch = useDispatch();

    const pagination: any = useRef<any>({
        pageNo: 0,
        pageSize: 10
    })

    const [addAssignGroupModalState, setAddAssignGroupModalState] =
    useState<any>({
      showModal: false,
      branchId: "",
    });
    const [confirmationModalState, setConfirmationModalState] =
    useState<any>({
      showModal: false,
      branchId: "",
    });

    const [actionStatus , setActionStatus] = useState<any>("")
    const [actionId , setActionId] = useState<any>(null)
    const [filterRef,setFilterRef]=useState({pageNo:0,pageSize:10});

    const [studentConcessionFilterState, setStudentConcessionFilterState] =
        useState<any>(initialValues);


       
    const cashPaymenyApprovalForm = useFormik({
      enableReinitialize: true,
      initialValues: studentConcessionFilterState,
      onSubmit: (values:any) => {},
    });

    const getFeeSummaryList = (studentId: any, academicYearId: any) => {
        let params1 = { branchId: branchId, searchString: "", academicYearId: academicYearId, studentId: studentId };
        dispatch(getFeeSummaryDetailsAct(generateActionPayload('fee_summary_list', undefined, params1)));
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        studentConcessionList,
        ledgerDetails,
        feeSummaryDetails,
        classroomManagmentErrorResp,
        panelMembersListResp,
        addPanelMemberResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        feecashPaymentsResp,
        approveFeeCashPaymentResp,
        getStudentByIdResp
    }: any = useAppSelector(
        ({ classroomManagmentInfo, directoryStudent, instAcademics, branchAcademics ,feeApprovals , appData, feeConcession, feeCollections,admissionAvailabilityRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            studentConcessionList: feeConcession.studentConcessionList,
            feeSummaryDetails: feeCollections.feeSummaryDetails,
            ledgerDetails: feeCollections.ledgerDetails,
            panelMembersListResp: admissionAvailabilityRequest.panelMembersListResp,
            classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
            addPanelMemberResp : admissionAvailabilityRequest.addPanelMemberResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            feecashPaymentsResp : feeApprovals.feecashPaymentsResp,
            approveFeeCashPaymentResp:feeApprovals.approveFeeCashPaymentResp,
            getStudentByIdResp:directoryStudent.getStudentByIdResp,
        }),
        shallowEqual
    );

    
    const FeeCashPaymentsList = (paramsProps?: any, otherProps?: any) => {
        const { academicYearId, curriculumId, classId, type } = studentConcessionFilterState;
        const params = { ...paramsProps, ...pagination.current }
        
        let payload = {
            // studentId: null,
            branchId,
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            branchClassId: classId,
            // studentName: null,
            // type: null,
            ...filterRef,
            ...otherProps
        };
        
        // dispatch(getFeeCashPaymentsAct(generateActionPayload('get_fee_cash_payments', undefined, payload)))
    }

    const menuOptions = useMemo(
        () => [
            {
                id: "APPROVED",
                actionIcon: <HugeiconsIcon icon={CheckmarkCircle03StrokeStandard} className="me-2 text-success" size={18} />, // Include your SVG icon component
                actionName: "APPROVE",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    setActionId(id)
                    // moveToNewStudentConcessionHandler(id);
                    setActionStatus("APPROVED")
                    // toggleConfirmationModal();
                },
            },
            {
                id: "REJECTED",
                actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="me-2 text-danger" size={18} />, // Include your SVG icon component
                actionName: "REJECT",
                onClickHndlr: (event: any) => {
                    
                    const id = event.currentTarget.getAttribute("data-id");
                    
                    setActionId(id)
                    // moveToNewStudentConcessionHandler(id);
                    setActionStatus("REJECTED")
                    // toggleConfirmationModal();
                },
            },
        ],
        []
    );
       
        
    const getStudentLedgerList = (otherProps?: any) => { 
        
        const params = { branchId: branchId,academicYearId :studentConcessionFilterState.academicYearId,curriculumId : studentConcessionFilterState.curriculumId,branchClassId:studentConcessionFilterState.classId ,...filterRef,...otherProps}
        if(params.academicYearId  ){

            // dispatch(getFeeCashPaymentsAct(generateActionPayload('get_fee_cash_payments', undefined, params)))
        }
    }
      const EditStatusCashPaymentRef = useRef({
        prevApproveFeeCashPaymentResp: approveFeeCashPaymentResp
    })
    useEffect(() => {
        const { prevApproveFeeCashPaymentResp } = EditStatusCashPaymentRef.current;
        if (approveFeeCashPaymentResp && prevApproveFeeCashPaymentResp !== approveFeeCashPaymentResp) {
            toast.success('Status Change Successfully')
            setConfirmationModalState((prevState:any) => ({
                ...prevState,
                showModal: !prevState.showModal,
              }));
              getStudentLedgerList()
        }
        EditStatusCashPaymentRef.current.prevApproveFeeCashPaymentResp = approveFeeCashPaymentResp;

    }, [approveFeeCashPaymentResp])

    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        // dispatch(
        //     getInstAcademicYearAct(
        //         generateActionPayload("get_inst_academic_year", undefined, payload)
        //     )
        // );
        const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        // dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        return () => {
            // dispatch(resetBrchCurriculumAct(undefined));
            // dispatch(resetBrchClassAct(undefined));
        }
    }, []);


    useEffect(() => {
        getFeeSummaryList(getStudentByIdResp?.studentDetails?.id, params?.academicYearId || "")
    }, []);

    useEffect(() => {
        // let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault).academicYearId
        // cashPaymenyApprovalForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
        setStudentConcessionFilterState((prev: any) => ({ ...prev, academicYearId: params?.academicYearId || "" }))
        // getStudentLedgerList({ academicYearId: yearId });
    }, []);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value }))
        let newpayload = {
            studentId: getStudentByIdResp?.studentDetails?.id,
            branchId: branchId,
            academicYearId: value,
            studentInfo: "studentInfo",
            allowStudentConcession: "",
            allowEmployeeConcession: "",
            allowRefund: "",
            feeType: [],
            // instituteDeptId: [1, 4],
            instituteDeptNames: ["ACADEMICS", "TRANSPORT"],
            paymentStatus: ""
        }
        dispatch(getLedgerDetailsAct(generateActionPayload('ledger_details', undefined, newpayload)));
        getFeeSummaryList(getStudentByIdResp?.studentDetails?.id, value || "")
     
    }

    

    function paginationHndlr(paginationInfo: IPaginationState) {
        
        setFilterRef((prev:any)=>({...prev,...paginationInfo}))
        getStudentLedgerList(paginationInfo);
    }

    const { data: academicYearList } = academicYearListResp || {};
    // const { data: StudentConcessionData, pageNumber, totalPages, totalElements } = studentConcessionList || {};
    // const { data: SectionList,totalPages,totalElements,pageNumber } = sectionListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { ledgers: LedgerList } = ledgerDetails || {};
    const { data: feeCashPaymentsList,totalPages,totalElements,pageNumber } = feecashPaymentsResp || {};
    const { data: FeeSummaryDetails } = feeSummaryDetails || {};
    


    const roleColumns = useMemo(() => generateColumns(menuOptions), []);
    return (
        <div className="">
            <div className=" tw-mx-auto tw-px-0">
                {/* <BreadCrumb title="Cash Payment Approval" pageTitle="Fee" /> */}

                <div className="tw-bg-white tw-shadow-md tw-rounded-lg">
                    <div className="tw-p-2">
                        {/* <form onSubmit={StudentConcessionFilterForm.handleSubmit}> */}
                        <div className="tw-flex tw-flex-wrap tw-gap-3">
                            <div className="tw-w-full tw-md:w-full tw-lg:w-1/2 tw-xl:w-1/4 tw-flex tw-items-center">
                                <div className="tw-flex tw-justify-center tw-items-center tw-mr-4">Academic Year :</div>
                                <SelectInput
                                    name="academicYearId"
                                    value={studentConcessionFilterState.academicYearId}
                                    onChange={filterHandler}
                                    menuItems={academicYearList || []}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    formgroupClassName="tw-mb-0"
                                    defaultSelect="Academic Year"
                                />
                            </div>
                        </div>
                        {/* </form> */}
                    </div>

                    <div className="tw-mx-2">
                        <div
                            className="tw-text-white tw-rounded-lg tw-py-4 tw-px-4 tw-flex tw-flex-wrap tw-items-center tw-justify-between"
                            style={{ background: "#3D3B56" }}
                        >
                            <div className="tw-flex-1 tw-text-left tw-mb-2 md:tw-mb-0">
                                Total Fee for Year : ₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].amountToPay)}
                            </div>

                            <div className="tw-flex-1 tw-text-left tw-mb-2 md:tw-mb-0">
                                Concession given : ₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].totalConcession)}
                            </div>

                            <div className="tw-flex-1 tw-text-left tw-mb-2 md:tw-mb-0">
                                Amount Paid : ₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].amountPaid)}
                            </div>

                            <div className="tw-flex-1 tw-text-left tw-mb-2 md:tw-mb-0">
                                Balance To Pay as on ({getDateMonthYearFormat(new Date())}) : ₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0]?.currentAmountToBePaid)}
                            </div>

                            {ledgerDetails?.basicDetails?.studentDetails?.parentEmployeeStatus && (
                                <div className="tw-flex-1 tw-text-left tw-mb-2 md:tw-mb-0">
                                    Parent is Staff : {ledgerDetails?.basicDetails?.studentDetails?.parentEmployeeStatus}
                                </div>
                            )}
                        </div>
                    </div>


                    <TableContainer
                        columns={roleColumns || []}
                        data={ledgerDetails?.ledgers || []}
                        divClass="tw-overflow-x-auto tw-mb-3"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    // showCheckbox={true}
                    // showPagination={true}
                    // totalPages={totalPages || 0}
                    // totalRecords={totalElements || 0 }
                    // callbackPaginationHndlr={paginationHndlr}
                    // currentPageNumber={pageNumber || 0}
                    />
                </div>
            </div>
        </div>
    )
}

export default StudentLedger
