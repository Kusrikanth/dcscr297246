import React, { useMemo, useEffect } from "react";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  generateFeeDetailsModalColumns,
} from "./helper";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { getLedgersOfDetainedOrPromotedAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";

const ChangeCurriculumLedgerModal = (
  props: any
) => {

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

  useEffect(() => {
    if (props.requestDetails) {
      const { studentId, toClassId, fromClassId, approvedStatus } = props.requestDetails,
        params = {
          academicYearId: props.academicYearId,
          studentId,
          classId: approvedStatus === "APPROVED" ? toClassId : fromClassId
        };
      if (params.academicYearId && params.studentId && params.classId) {
        dispatch(getLedgersOfDetainedOrPromotedAct(generateActionPayload('ledger_of_detention_promtion', params)))
      }
      else {
        // dispatch(resetLedgersOfDetainedOrPromotedAct(undefined));
      }
    }

  }, [props.requestDetails]);



  const roleColumns = useMemo(() => generateFeeDetailsModalColumns(), []);

  const { feeListDTOAcademics } = ledgersOfDetainedOrPromotedResp || {};
  return (
    <>

      <div className="tw-flex tw-flex-col tw-items-center">

        <div className="tw-w-full tw-px-4 tw-pb-3 tw-pt-1">

          {/* Top Grid (3 Columns) */}
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">

            {/* Column 1 */}
            <div className="tw-pt-3 tw-space-y-3">

              <div className="tw-grid tw-grid-cols-12 tw-items-center">
                <div className="tw-col-span-4">
                  <label className="tw-font-bold">Student Name:</label>
                </div>
                <div className="tw-col-span-8">
                  <span>{props?.requestDetails?.studentName || "-"}</span>
                </div>
              </div>

              <div className="tw-grid tw-grid-cols-12 tw-items-center">
                <div className="tw-col-span-4">
                  <label className="tw-font-bold">Student Code:</label>
                </div>
                <div className="tw-col-span-8">
                  <span>{props?.requestDetails?.studentCodeNum || "-"}</span>
                </div>
              </div>

            </div>

            {/* Column 2 */}
            <div className="tw-pt-3">
              <div className="tw-grid tw-grid-cols-12 tw-items-center">
                <div className="tw-col-span-4">
                  <label className="tw-font-bold">From Class:</label>
                </div>
                <div className="tw-col-span-8">
                  <span>{props?.requestDetails?.fromClassName || "-"}</span>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="tw-pt-3">
              <div className="tw-grid tw-grid-cols-12 tw-items-center">
                <div className="tw-col-span-3">
                  <label className="tw-font-bold">To Class:</label>
                </div>
                <div className="tw-col-span-9">
                  <span>{props?.requestDetails?.toClassName || "-"}</span>
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
            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
          />
        </div>
      </div>

    </>
  );
};

export default ChangeCurriculumLedgerModal;
