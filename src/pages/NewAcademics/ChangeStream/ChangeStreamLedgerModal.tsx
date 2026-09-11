import React, { useEffect, useMemo } from "react";
import TableContainer from "../../../Components/Common/TableContainer";
import { CampusTransferRequestModalProps } from "../CampusTransferRequests/CampusTransferRequestsTypes";
import {
  generateFeeDetailsModalColumns,
} from "./helper";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getLedgersOfDetainedOrPromotedAct, resetLedgersOfDetainedOrPromotedAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";


const ChangeStreamLedgerModal = (props: CampusTransferRequestModalProps) => {
  const dispatch = useDispatch();

  const {
    studentLedgersResp,
    ledgersOfDetainedOrPromotedResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId
  }: any = useAppSelector(
    ({ classroomManagmentInfo, feeCollections, assignGroupInfo, instAcademics, branchAcademics, appData }) => ({
      studentLedgersResp: feeCollections.studentLedgersResp,
      ledgersOfDetainedOrPromotedResp: classroomManagmentInfo.ledgersOfDetainedOrPromotedResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
    }),
    shallowEqual
  );

  // useEffect(() => {
  useEffect(() => {
    if (props.requestDetails) {
      const { studentId, academicYearId, classId, approvedStatus } = props.requestDetails,
        params = {
          academicYearId,
          studentId,
          classId
        };
        if(params.academicYearId&&params.studentId&&params.classId){
          dispatch(getLedgersOfDetainedOrPromotedAct(generateActionPayload('ledger_of_detention_promtion', params)))
        }
    }

  }, [props.requestDetails]);

  useEffect(()=>{
    if(!props.isOpen){
      dispatch(resetLedgersOfDetainedOrPromotedAct(undefined));
    }
  },[props.isOpen])
  // }, [props.requestDetails])

  const roleColumns = useMemo(() => generateFeeDetailsModalColumns(), []);

  const { basicDetails: StudentDetails } = studentLedgersResp || {}
  const { feeListDTOAcademics } = ledgersOfDetainedOrPromotedResp || {};
  return (
    <>
 
      <div className="tw-flex tw-flex-col tw-items-center">

        <div className="tw-w-full tw-p-5">

          {/* Top Grid Section */}
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">

            {/* Student Info */}
            <div className="tw-pt-3">

              <div className="tw-grid tw-grid-cols-12 tw-mb-2">
                <div className="tw-col-span-4">
                  <label className="tw-font-bold">Student Name:</label>
                </div>
                <div className="tw-col-span-8">
                  <span>{props?.requestDetails?.studentName || "-"}</span>
                </div>
              </div>

              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-4">
                  <label className="tw-font-bold">Student Code:</label>
                </div>
                <div className="tw-col-span-8">
                  <span>{props?.requestDetails?.studentCodeNum || "-"}</span>
                </div>
              </div>

            </div>

            {/* From Class */}
            <div className="tw-pt-3">
              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-4">
                  <label className="tw-font-bold">From Class:</label>
                </div>
                <div className="tw-col-span-8">
                  <span>{props?.requestDetails?.className || "-"}</span>
                </div>
              </div>
            </div>

            {/* To Class */}
            <div className="tw-pt-3">
              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-3">
                  <label className="tw-font-bold">To Class:</label>
                </div>
                <div className="tw-col-span-9">
                  <span>{props?.requestDetails?.newClassName || "-"}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Table Section */}
        <div className="tw-w-full">
          <TableContainer
            columns={roleColumns || []}
            data={feeListDTOAcademics || []}
            divClass="tw-overflow-x-auto tw-mb-1"
            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
          />
        </div>

      </div>
      
    </>
  );
};

export default ChangeStreamLedgerModal;
