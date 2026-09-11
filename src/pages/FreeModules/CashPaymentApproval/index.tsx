import React, { useEffect, useMemo, useRef, useState } from 'react'
import TableContainer from '../../../Components/Common/TableContainer'
import { default as ApproveSvg } from "../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { generateColumns, statusItems } from './helper';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { ModalContainerUpdated, SelectInput, TextInput } from '../../../Components/Common';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../utility/reduxutility';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { toast } from 'react-toastify';
import { IPaginationState } from '../../../Components/Common/Pagination';
import { getInstAcademicYearAct } from '../../../store/mastersettings/instacademics/instacademicactions';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from '../../../store/branchsettings/branchacademics/branchacademicsactions';
import { approveFeeCashFormAct, getFeeCashPaymentsAct } from '../../../store/fee/feeapprovals/feeapprovalactions';
import { useFormik } from 'formik';
import { IAssignGroupOpenModal } from './assignGroupTypes';
import ConfirmationModal from './ConfirmationModal';
import { default as CrossSvg } from "../../../assets/imagesdps/academics/CrossSvg.svg?react";


const initialValues = {
    search: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    type: "",
    status:""
};

const CashPaymentApproval = () => {

    const dispatch = useAppDispatch();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const [confirmationModalState, setConfirmationModalState] =
    useState<IAssignGroupOpenModal>({
      showModal: false,
      branchId: "",
    });

    const [actionStatus , setActionStatus] = useState("")
    const [actionId , setActionId] = useState<any>(null)
    const [filterRef,setFilterRef]=useState({pageNo:0,pageSize:10});

    const [studentConcessionFilterState, setStudentConcessionFilterState] =
        useState(initialValues);
       
    const cashPaymenyApprovalForm = useFormik({
      enableReinitialize: true,
      initialValues: studentConcessionFilterState,
      onSubmit: (values:any) => {},
    });

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        ledgerDetails,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        feecashPaymentsResp,
        approveFeeCashPaymentResp
    } = useAppSelector(
        ({ classroomManagmentInfo, assignGroupInfo, instAcademics, branchAcademics ,feeApprovals , appData, feeConcession, feeCollections,admissionAvailabilityRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            ledgerDetails: feeCollections.ledgerDetails,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            feecashPaymentsResp : feeApprovals.feecashPaymentsResp,
            approveFeeCashPaymentResp:feeApprovals.approveFeeCashPaymentResp
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
        
        dispatch(getFeeCashPaymentsAct(generateActionPayload('get_fee_cash_payments', undefined, payload)))
    }

    const menuOptions = useMemo(
        () => [
            {
                id: "APPROVED",
                actionIcon: <ApproveSvg className="me-2 d-inline-block" fill="#707070" />, // Include your SVG icon component
                actionName: "APPROVE",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    setActionId(id)
                    setActionStatus("APPROVED")
                    toggleConfirmationModal();
                },
            },
            {
                id: "REJECTED",
                actionIcon: <CrossSvg className="me-2 d-inline-block" fill="red" />, // Include your SVG icon component
                actionName: "REJECT",
                onClickHndlr: (event: any) => {
                    
                    const id = event.currentTarget.getAttribute("data-id");
                    
                    setActionId(id)
                    setActionStatus("REJECTED")
                    toggleConfirmationModal();
                },
            },
        ],
        []
    );
       
        
    const getFeeCashPaymentsList = (otherProps?: any) => { 
        
        const params = { branchId: branchId,academicYearId :studentConcessionFilterState.academicYearId,curriculumId : studentConcessionFilterState.curriculumId,branchClassId:studentConcessionFilterState.classId ,...filterRef,...otherProps}
        if(params.academicYearId  ){

            dispatch(getFeeCashPaymentsAct(generateActionPayload('get_fee_cash_payments', undefined, params)))
        }
    }

      const toggleConfirmationModal = () => {
        setConfirmationModalState((prevState) => ({
          ...prevState,
          showModal: !prevState.showModal,
        }));
      };

      const statusChangingHandler = () => {
    dispatch(approveFeeCashFormAct(generateActionPayload('approve_fee_cash_payments', { actionId: actionId ,actionStatus : actionStatus})))
      }
       
      const EditStatusCashPaymentRef = useRef({
        prevApproveFeeCashPaymentResp: approveFeeCashPaymentResp
    })
    useEffect(() => {
        const { prevApproveFeeCashPaymentResp } = EditStatusCashPaymentRef.current;
        if (approveFeeCashPaymentResp && prevApproveFeeCashPaymentResp !== approveFeeCashPaymentResp) {
            toast.success('Status Change Successfully')
            setConfirmationModalState((prevState) => ({
                ...prevState,
                showModal: !prevState.showModal,
              }));
              getFeeCashPaymentsList()
        }
        EditStatusCashPaymentRef.current.prevApproveFeeCashPaymentResp = approveFeeCashPaymentResp;

    }, [approveFeeCashPaymentResp])

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
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
        cashPaymenyApprovalForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
        setStudentConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        getFeeCashPaymentsList({ academicYearId: yearId });
        const payload1 = { academicYearId: yearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));     
    }, [academicYearListResp]);


    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value, ...(name === 'academicYearId' ? { curriculumId: '', classId: '' } : {}), ...(name === 'curriculumId' ? { classId: '' } : {}), }));
        if (name === 'academicYearId') {
            if (value) {
                const payload = { branchId, academicYearId: value, sortBy: "curriculumName", orderBy: "asc", pageNo: 0, pageSize: 100, };
                dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
                dispatch(resetBrchClassAct(undefined));
            } else {
                dispatch(resetBrchCurriculumAct(undefined));
                dispatch(resetBrchClassAct(undefined));
            }
            FeeCashPaymentsList(undefined, { [name]: value });
        } else if (name === 'curriculumId' && value) {
            const payload = { branchId, academicYearId: studentConcessionFilterState.academicYearId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            FeeCashPaymentsList(undefined, { curriculumId: value });
        } else if (name === 'classId' && value) {
            FeeCashPaymentsList(undefined, { branchClassId: value });
        } else if (name === 'status') {
            FeeCashPaymentsList(undefined, { status: value });
        } else if (name === 'search') {
            FeeCashPaymentsList(undefined, {
                searchString: value,
                status: studentConcessionFilterState.status,
            });
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        
        setFilterRef((prev:any)=>({...prev,...paginationInfo}))
        getFeeCashPaymentsList(paginationInfo);
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { ledgers: LedgerList } = ledgerDetails || {};
    const { data: feeCashPaymentsList,totalPages,totalElements,pageNumber } = feecashPaymentsResp || {};


    const roleColumns = useMemo(() => generateColumns(menuOptions), []);
    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb title="Cash Payment Approval" pageTitle="Fee" />

                <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                    <div className="tw-border-b tw-px-4 tw-py-3">
                        <div className="tw-flex tw-items-center">
                            <div className="tw-flex-1">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Cash Payment Details
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="tw-p-4">
                        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4">
                            <div className="md:tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                                <div className="search-box tw-relative">
                                    <TextInput
                                        name="search"
                                        value={studentConcessionFilterState.search}
                                        onChange={filterHandler}
                                        inputClassName="tw-bg-gray-100"
                                        formgroupClassName="tw-mb-0"
                                        placeHolder="Search"
                                        labelText="Search"
                                        floatingLabel
                                    />
                                    <i className="ri-search-line search-icon"></i>
                                </div>
                            </div>

                            <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                <SelectInput
                                    name="academicYearId"
                                    value={studentConcessionFilterState.academicYearId}
                                    onChange={filterHandler}
                                    menuItems={academicYearList || []}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Academic Year"
                                    floatingLabel
                                />
                            </div>

                            <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                <SelectInput
                                    name="curriculumId"
                                    value={studentConcessionFilterState.curriculumId}
                                    onChange={filterHandler}
                                    menuItems={curriculumTypes || []}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Curriculum"
                                    floatingLabel
                                />
                            </div>

                            <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                <SelectInput
                                    name="classId"
                                    value={studentConcessionFilterState.classId}
                                    onChange={filterHandler}
                                    menuItems={classTypes || []}
                                    valueKey="id"
                                    textKey="className"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Class"
                                    floatingLabel
                                />
                            </div>

                            <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                                <SelectInput
                                    name="status"
                                    value={studentConcessionFilterState.status}
                                    onChange={filterHandler}
                                    menuItems={statusItems || []}
                                    valueKey="status"
                                    textKey="status"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Status"
                                    floatingLabel
                                />
                            </div>
                        </div>
                    </div>

                    <TableContainer
                        columns={roleColumns || []}
                        data={feeCashPaymentsList || []}
                        divClass="tw-overflow-x-auto tw-mb-3"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        showPagination={true}
                        totalPages={totalPages || 0}
                        totalRecords={totalElements || 0}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageNumber || 0}
                    />

                    <ModalContainerUpdated
                        id="export-cash-payment-approval"
                        isOpen={confirmationModalState.showModal}
                        toggle={toggleConfirmationModal}
                        modalSize="md"
                        hideHeader={true}
                    >
                        <ConfirmationModal
                            isOpen={confirmationModalState.showModal}
                            toggle={toggleConfirmationModal}
                            modalTitle=""
                            instituteId={instituteId}
                            instituteName="Assign Subjects"
                            branchId={branchId}
                            actionId={actionId}
                            editBranchDetails=""
                            submitHandler={statusChangingHandler}
                            actionStatus={actionStatus}
                        />
                    </ModalContainerUpdated>
                </div>
            </div>
        </div>
    )
}

export default CashPaymentApproval
