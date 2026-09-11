import React, { useState, useEffect, useMemo } from "react";
import TableContainer from "../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getPaymentActiveListByIdAct } from "../../../store/fee/feecollections/feecollectionactions";
import { generateDetailsColumns } from "./helper";
import Button from "../../../Components/Common/Button";


const PaymentActiveDetailsModel = (props: any) => {
  const dispatch = useDispatch();

  const {
    currentBranchIdResp: branchId,
    academicYearListResp,
    currentInstIdResp: instituteId,
    paymentActiveDetailsByIdResp,
  }: any = useAppSelector(
    ({ instAcademics, appData, feeCollections, branchAcademics, classroomManagmentInfo }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      paymentActiveDetailsByIdResp: feeCollections.paymentActiveDetailsByIdResp,
      }),
    shallowEqual
  );
  
  useEffect(() => {
    if (props.id&&props.isOpen) {
      dispatch(getPaymentActiveListByIdAct(generateActionPayload("get_payment_active_details_by_id", { id: props.id })))
  }
}, [props.isOpen])

  const roleColumns = useMemo(() => generateDetailsColumns(), []);
  const tableData = paymentActiveDetailsByIdResp ? [paymentActiveDetailsByIdResp] : [];

  return (
    <>

      <div className="tw-flex tw-flex-col tw-items-center">

        <div className="tw-w-full">
          <TableContainer
            columns={roleColumns || []}
            data={tableData}
            divClass="tw-overflow-x-auto tw-mb-1"
            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
          />
        </div>

        <div className="tw-w-full">
          <div className="tw-px-4 tw-pt-4">
            <div className="tw-flex tw-justify-center tw-gap-3 tw-my-4">
              <Button
                onClick={props.toggle}
                variant="secondary"
              >
                Close
              </Button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default PaymentActiveDetailsModel;
