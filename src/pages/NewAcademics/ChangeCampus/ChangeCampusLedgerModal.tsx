import React, { useEffect, useMemo, useRef, useState } from "react";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  generateFeeDetailsModalColumns,
} from "./helper";
import { shallowEqual, useDispatch } from "react-redux";
import { getLedgersOfDetainedOrPromotedAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";
import { deleteLedgerDetailAct, getPayFeeDetailsAct } from "../../../store/fee/feecollections/feecollectionactions";
import { toast } from "react-toastify";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { ConfirmationModal } from "../../../Components/Common";
import { useModal } from "../../../hooks/modalhook";
import {
  submitOldCampusLedgersAct
} from "../../../store/academic/academicRequest/academicrequestactions";
import Button from "../../../Components/Common/Button";

const ChangeCampusLedgerModal = (props: any) => {
  const { campusInfo } = props;
  const dispatch = useDispatch();
  const { modalState: delLedgerModalState, closeModal: closeDelLedgerModalHndlr,
    openModal: openDelLedgerModalHndlr
  } = useModal();
  const [ledgersState, setLedgersState] = useState<any>([]);
  const { showApiLoader, deleteLedgerDetailResp, getPayFeeDetailsResp,
    submitOldCampusLedgersResp,
    feeCollectionErrorResp }: any = useAppSelector(
      ({ feeCollections, academicRequest, globalData }) => ({
        showApiLoader: globalData.showApiLoader,
        getPayFeeDetailsResp: feeCollections.getPayFeeDetailsResp,
        submitOldCampusLedgersResp: academicRequest.submitOldCampusLedgersResp,
        deleteLedgerDetailResp: feeCollections.deleteLedgerDetailResp,
        feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
      }), shallowEqual);

  const respRef = useRef({
    prevGetPayFeeDetailsResp: getPayFeeDetailsResp,
    prevSubmitOldCampusLedgersResp: submitOldCampusLedgersResp,
    prevDeleteLedgerDetailResp: deleteLedgerDetailResp,
    prevFeeCollectionErrorResp: feeCollectionErrorResp
  });

  useEffect(() => {
    const { prevGetPayFeeDetailsResp, prevSubmitOldCampusLedgersResp, prevDeleteLedgerDetailResp, prevFeeCollectionErrorResp } = respRef.current;
    if (getPayFeeDetailsResp && prevGetPayFeeDetailsResp !== getPayFeeDetailsResp) {
      const { ledgers } = getPayFeeDetailsResp;
      if (Array.isArray(ledgers)) {
        setLedgersState(ledgers.map((item: any) => ({ ...item, isDeleted: false })))
      }
    } else if (submitOldCampusLedgersResp && prevSubmitOldCampusLedgersResp !== submitOldCampusLedgersResp) {
      toast.success("Ledgers updated successfully.");
      props.toggle(true);
    }
    else if (deleteLedgerDetailResp && deleteLedgerDetailResp !== prevDeleteLedgerDetailResp) {
      toast.success("Selected Ledger Deleted Successfully.");
      closeDelLedgerModalHndlr();
      getFeeLedgerApiCall();
    } else if (feeCollectionErrorResp && prevFeeCollectionErrorResp !== feeCollectionErrorResp) {
      const { details } = feeCollectionErrorResp || {};
      toast.error(details || "Something went wrong.");
    }
    respRef.current.prevGetPayFeeDetailsResp = getPayFeeDetailsResp;
    respRef.current.prevSubmitOldCampusLedgersResp = submitOldCampusLedgersResp;
    respRef.current.prevDeleteLedgerDetailResp = deleteLedgerDetailResp;
    respRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
  }, [getPayFeeDetailsResp, submitOldCampusLedgersResp, campusInfo, deleteLedgerDetailResp, feeCollectionErrorResp]);

  useEffect(() => {
    if (campusInfo) {
      getFeeLedgerApiCall();
    }
  }, [campusInfo]);

  function getFeeLedgerApiCall() {
    const payload = {
      studentId: campusInfo?.studentId,
      branchId: campusInfo?.currentCampusId,
      academicYearId: campusInfo?.academicYearId,
      studentInfo: "",
      allowStudentConcession: "",
      allowEmployeeConcession: "",
      allowRefund: "",
      feeType: [],
      // instituteDeptId: [1],
      instituteDeptNames: ["ACADEMICS"],
      paymentStatus: "",
      ledgerId: "",
    }
    dispatch(getPayFeeDetailsAct(generateActionPayload("get_pay_fee_details", undefined, payload)));
  }

  const menuOptions = useMemo(
    (): IOptionsHrtl[] => [
      {
        id: "delete",
        actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const feeLedgerId = event.currentTarget.getAttribute("data-id");
          if (feeLedgerId) {
            setLedgersState(ledgersState.map((item: any) => {
              if (item?.id?.toString() === feeLedgerId?.toString()) {
                return ({ ...item, isDeleted: true })
              }
              return item;
            }))
          }
        },
      },
    ],
    [ledgersState]
  );

  const deleteLedgerHndler = () => {
    const { modalData } = delLedgerModalState;
    dispatch(deleteLedgerDetailAct(generateActionPayload("del_fee_ledgers_changecampus", { ids: modalData })));
  }

  function resetDeleteHndlr(event: any) {
    const feeLedgerId = event.currentTarget.getAttribute("data-id");
    if (feeLedgerId) {
      setLedgersState(ledgersState.map((item: any) => {
        if (item?.id?.toString() === feeLedgerId?.toString()) {
          return ({ ...item, isDeleted: false })
        }
        return item;
      }))
    }
  }

  function submitLedgerHndlr() {
    const deletedLedgersIds = ledgersState?.filter((item: any) => item.isDeleted).map((item: any) => item.id);
    dispatch(submitOldCampusLedgersAct(generateActionPayload("submit_oldcampus_ledgers", {
      campusId: campusInfo?.id,
      ledgerIds: deletedLedgersIds.join(",")
    })));

  }

  const roleColumns = useMemo(() => {
    const columns = generateFeeDetailsModalColumns(menuOptions, resetDeleteHndlr);
    if (campusInfo?.isLedgersSubmitted) {
      return columns.filter(item => item.accessor !== "actions");
    }
    return columns;
  }, [campusInfo, ledgersState]);
  
  return (
    <>
      <div className="tw-flex tw-flex-col tw-items-center">

        <div className="tw-w-full tw-p-6">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">

            {/* Column 1 */}
            <div className="tw-space-y-3">

              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-4">
                  <label className="tw-font-bold">Student Name:</label>
                </div>
                <div className="tw-col-span-8">
                  <span>{campusInfo?.studentName || "-"}</span>
                </div>
              </div>

              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-4">
                  <label className="tw-font-bold">Student Code:</label>
                </div>
                <div className="tw-col-span-8">
                  <span>{campusInfo?.studentCode || "-"}</span>
                </div>
              </div>

            </div>

            {/* Column 2 */}
            <div className="tw-space-y-3">

              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-5">
                  <label className="tw-font-bold">From Curriculum:</label>
                </div>
                <div className="tw-col-span-7">
                  <span>{campusInfo?.currentCurriculumName || "-"}</span>
                </div>
              </div>

              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-5">
                  <label className="tw-font-bold">From Class:</label>
                </div>
                <div className="tw-col-span-7">
                  <span>{campusInfo?.currentClassName || "-"}</span>
                </div>
              </div>

            </div>

            {/* Column 3 */}
            <div className="tw-space-y-3">

              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-5">
                  <label className="tw-font-bold">To Curriculum:</label>
                </div>
                <div className="tw-col-span-7">
                  <span>{campusInfo?.newCurriculumName || "-"}</span>
                </div>
              </div>

              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-5">
                  <label className="tw-font-bold">To Class:</label>
                </div>
                <div className="tw-col-span-7">
                  <span>{campusInfo?.newClassName || "-"}</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Table Section */}
        <div className="tw-w-full tw-overflow-x-auto">
          <TableContainer
            columns={roleColumns || []}
            data={Array.isArray(ledgersState) ? ledgersState : []}
            divClass="tw-min-w-full"
            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
          />
        </div>

        {/* Submit Button */}
        {!campusInfo?.isLedgersSubmitted && (
          <div className="tw-w-full tw-flex tw-justify-center tw-py-4">
            <Button
              type="submit"
              variant="primary"
              onClick={submitLedgerHndlr}
              disabled={showApiLoader}
            >
              Submit
            </Button>
          </div>
        )}

      </div>


      <ConfirmationModal
        id="delete-ledger-details"
        isOpen={delLedgerModalState.showModal}
        confirmMessage="Are you sure you want Delete Ledger ?"
        cancelHndlr={closeDelLedgerModalHndlr}
        confirmHndlr={deleteLedgerHndler}
        isDisble={showApiLoader}
        btnClassName='btn w-sm btn-danger'
        showImgIcon={true}
        iconType="reject"
      />
    </>
  );
};

export default ChangeCampusLedgerModal;
