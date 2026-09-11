import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { shallowEqual, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useAppSelector } from '../../../../hooks/storehook';
import { IPaginationState } from '../../../../Components/Common/Pagination';
import { StudentReportData, generateColumns } from './helper';
import { SelectInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getLedgerDetailsAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle03StrokeStandard } from "@hugeicons-pro/core-stroke-standard";


const initialValues: any = {
    search: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    type: "",
    status: ""
};

interface IStudentInfo {
    studentId: number;
    branchId: number;
    instituteId: number;
    academicYearId: string;
}

const StudentLedger = (props: IStudentInfo) => {


    const history = useHistory();
    const params = useParams<any>()
    const dispatch = useDispatch();


    const [confirmationModalState, setConfirmationModalState] =
        useState<any>({
            showModal: false,
            branchId: "",
        });

    const [studentConcessionFilterState, setStudentConcessionFilterState] =
        useState<any>(initialValues);

    const cashPaymenyApprovalForm = useFormik({
        enableReinitialize: true,
        initialValues: studentConcessionFilterState,
        onSubmit: (values: any) => { },
    });

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        approveFeeCashPaymentResp,
    }: any = useAppSelector(
        ({ classroomManagmentInfo, directoryStudent, instAcademics, branchAcademics, feeApprovals, appData, feeConcession, feeCollections, admissionAvailabilityRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            studentConcessionList: feeConcession.studentConcessionList,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            approveFeeCashPaymentResp: feeApprovals.approveFeeCashPaymentResp,
        }),
        shallowEqual
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "APPROVED",
                actionIcon: <HugeiconsIcon icon={CheckmarkCircle03StrokeStandard} className="me-2 text-success" size={18} />, // Include your SVG icon component
                actionName: "APPROVE",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");

                },
            },
        ],
        []
    );


    const EditStatusCashPaymentRef = useRef({
        prevApproveFeeCashPaymentResp: approveFeeCashPaymentResp
    })
    useEffect(() => {
        const { prevApproveFeeCashPaymentResp } = EditStatusCashPaymentRef.current;
        if (approveFeeCashPaymentResp && prevApproveFeeCashPaymentResp !== approveFeeCashPaymentResp) {
            toast.success('Status Change Successfully')
            setConfirmationModalState((prevState: any) => ({
                ...prevState,
                showModal: !prevState.showModal,
            }));

        }
        EditStatusCashPaymentRef.current.prevApproveFeeCashPaymentResp = approveFeeCashPaymentResp;

    }, [approveFeeCashPaymentResp])

    useEffect(() => {

        setStudentConcessionFilterState((prev: any) => ({ ...prev, academicYearId: params?.academicYearId || "" }))

    }, []);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value }))


    }

    function paginationHndlr(paginationInfo: IPaginationState) {


    }

    const { data: academicYearList } = academicYearListResp || {};

    const roleColumns = useMemo(() => generateColumns(menuOptions), []);
    return (
        <div className="">
            <div className="tw-mx-auto tw-px-0">
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

                    <TableContainer
                        columns={roleColumns || []}
                        data={StudentReportData || []}
                        divClass="tw-overflow-x-auto tw-mb-3"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    />

                </div>
            </div>
        </div>
    )
}

export default StudentLedger
