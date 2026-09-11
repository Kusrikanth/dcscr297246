import React, { useMemo } from "react";
import TableContainer from "../../../Components/Common/TableContainer";
import { generateFeeDetailsModalColumns, generateOldCampusFeeDetailsColumns } from "./helper";
import Button from "../../../Components/Common/Button";
import { useAppDispatch } from "../../../hooks/storehook";
import { saveProcessStudentRefundAmountAct } from "../../../store/fee/feecollections/feecollectionactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { StatusLabel } from "../../../Components/Common";

const ViewLedgerModal = (props: any) => {

  const { modalData } = props;
  const dispatch = useAppDispatch();

  const oldCampusLedgerColumns = useMemo(() => generateOldCampusFeeDetailsColumns(), []);
  const newCampusLedgerColumns = useMemo(() => generateFeeDetailsModalColumns(), []);

  function submitLedgerHndlr() {
    const payload = {
      id: modalData?.id,
      approvedStatus: "APPROVED",
      remarks: modalData?.remarks,
    };
    dispatch(saveProcessStudentRefundAmountAct(generateActionPayload("save_process_student_refund_amount", undefined, payload)));
  }

  const oldLedgerList = Array.isArray(modalData?.refundStudentLedgerVOS) ? modalData.refundStudentLedgerVOS : [];
  const newLedgerList = Array.isArray(modalData?.refundCampusTransferStudentLedgers) ? modalData.refundCampusTransferStudentLedgers : [];

  return (
    <>
      <div className="tw-p-5">
        <div className="tw-grid tw-grid-cols-3 tw-gap-4 tw-mb-4">
          <div><b>Student Name : </b> {modalData?.newStudentName || "-"}</div>
          <div><b>Student Code : </b> {modalData?.newStudentCode || "-"}</div>
          <div><b>Phone : </b> {modalData?.phoneNo || "-"}</div>
          <div> <b>Email : </b> {modalData?.email || "-"}</div>
          <div><b>Total Refund Amount : </b> ₹ {modalData?.totalRefundAmount || "-"}</div>
          <div><b>Approved Status : </b>
            <StatusLabel
              type={modalData?.approvedStatus}
              labelName={modalData?.approvedStatus || "-"}
            />
          </div>
        </div>
        <div className="tw-w-full">
          <div className="tw-relative tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-pt-6 tw-px-4 tw-pb-4 tw-mt-5 tw-mb-3">
            <p className="tw-absolute tw--top-3 tw-left-4 tw-bg-white tw-px-3 tw-text-sm tw-text-gray-600">
              Ledger Details for {modalData?.oldBranchName} Campus
            </p>
            <TableContainer
              columns={oldCampusLedgerColumns}
              data={oldLedgerList}
              divClass="tw-overflow-x-auto"
              theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
            />
          </div>
        </div>
        <div className="tw-w-full">
          <div className="tw-relative tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-pt-6 tw-px-4 tw-pb-4 tw-mt-5">
            <p className="tw-absolute tw--top-3 tw-left-4 tw-bg-white tw-px-3 tw-text-sm tw-text-gray-600">
              Ledger Details for {modalData?.newBranchName} Campus
            </p>
            <TableContainer
              columns={newCampusLedgerColumns}
              data={newLedgerList}
              rowDataInfo={modalData}
              divClass="tw-overflow-x-auto"
              theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
            />
          </div>
        </div>
        {modalData?.approvedStatus === "PENDING" && (
          <div className="tw-w-full tw-flex tw-justify-center tw-pt-4">
            <Button
              type="button"
              onClick={submitLedgerHndlr}
              variant="primary"
            >
              Submit
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ViewLedgerModal;