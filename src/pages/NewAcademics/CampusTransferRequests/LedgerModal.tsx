import React, { useEffect, useMemo, useRef, useState } from "react";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  generateFeeDetailsModalColumns, generateOldCampusFeeDetailsColumns
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
import { newCampusFeeLedgerAct, oldCampusFeeLedgerAct, submitNewCampusLedgersAct } from "../../../store/academic/academicRequest/academicrequestactions";
import { useFormik, setNestedObjectValues } from 'formik';
import * as Yup from "yup";
import { touchTableFieldOnBlur, validateOnChange, validateOnSubmit } from "../../../utility/validationutility";
import { getAmountValueWithDecimal, getDisplayAmountValue } from "../../../utility/commonutility";
import { isValid } from "date-fns";
import Button from "../../../Components/Common/Button";


const ledgerValidationSchema = Yup.array().of(
  Yup.object().shape({
    maxStudentConcession: Yup.number(),
    studentConcessionAmount: Yup.string().test("studentConcessionValidate", `Student concession provided should
     not be greater than amount to pay after giving other concessions.`,
      (value: any, schema: any) => {
        const maxStudentConcession = schema.parent.maxStudentConcession;
        if (Number(value) > Number(maxStudentConcession)) {
          return schema.createError({ message: `Student concession should not be greater than allocation concession ${getDisplayAmountValue(maxStudentConcession)}.` });
        }
        return true;
      })
  })
);

const LedgerModal = (props: any) => {
  const { campusInfo } = props;
  const dispatch = useDispatch();
  const { modalState: delLedgerModalState, closeModal: closeDelLedgerModalHndlr,
    openModal: openDelLedgerModalHndlr
  } = useModal();
  const [newCampusLedgerState, setNewCampusLedgerState] = useState<any>([]);
  const { showApiLoader, deleteLedgerDetailResp, oldCampusFeeLedgerResp, newCampusFeeLedgerResp,
    submitNewCampusLedgersResp,
    feeCollectionErrorResp }: any = useAppSelector(
      ({ feeCollections, academicRequest, globalData }) => ({
        showApiLoader: globalData.showApiLoader,
        oldCampusFeeLedgerResp: academicRequest.oldCampusFeeLedgerResp,
        newCampusFeeLedgerResp: academicRequest.newCampusFeeLedgerResp,
        submitNewCampusLedgersResp: academicRequest.submitNewCampusLedgersResp,
        deleteLedgerDetailResp: feeCollections.deleteLedgerDetailResp,
        feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
      }), shallowEqual);

  const respRef = useRef({
    prevNewCampusFeeLedgerResp: newCampusFeeLedgerResp,
    prevSubmitNewCampusLedgersResp: submitNewCampusLedgersResp,
  });

  useEffect(() => {
    const { prevNewCampusFeeLedgerResp, prevSubmitNewCampusLedgersResp } = respRef.current;
    if (newCampusFeeLedgerResp && newCampusFeeLedgerResp !== prevNewCampusFeeLedgerResp) {
      const { excessAmount, feeListDTOAcademics } = newCampusFeeLedgerResp;
      if (Array.isArray(feeListDTOAcademics)) {
        const updatedLedgers = feeListDTOAcademics.map((item, index) => {
          const { studentConcessionAmount, paymentStatus } = item;
          let maxStudentConcession = Number(studentConcessionAmount) || 0;
          return ({
            ...item,
            excessAmount: (index + 1 === feeListDTOAcademics.length) ? excessAmount : 0,
            isDisabled: maxStudentConcession <= 0 || paymentStatus === "PAID" || false,
            studentConcessionAmount: Number(studentConcessionAmount) <= 0 ? "0" : studentConcessionAmount,
            maxStudentConcession
          });
        });
        setNewCampusLedgerState(updatedLedgers);
      }
    } else if (submitNewCampusLedgersResp && prevSubmitNewCampusLedgersResp !== submitNewCampusLedgersResp) {
      toast.success("Ledger submitted successfully.");
      props.toggle(true);
    }
    respRef.current.prevNewCampusFeeLedgerResp = newCampusFeeLedgerResp;
    respRef.current.prevSubmitNewCampusLedgersResp = submitNewCampusLedgersResp;
  }, [newCampusFeeLedgerResp, submitNewCampusLedgersResp]);

  useEffect(() => {
    if (campusInfo) {
      getFeeLedgerApiCall();
      getOldCampusFeeLedgerApiCall();
    }
  }, [campusInfo]);


  function getOldCampusFeeLedgerApiCall() {
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
    dispatch(oldCampusFeeLedgerAct(generateActionPayload("get_pay_fee_details", undefined, payload)));
  }
  function getFeeLedgerApiCall() {
    if (campusInfo?.newStudentId) {
      const payload = {
        academicYearId: campusInfo.academicYearId,
        classId: campusInfo.currentClassId,
        newClassId: campusInfo.newClassId,
        studentId: campusInfo.studentId,
        newStudentId: campusInfo.newStudentId,
      }
      dispatch(newCampusFeeLedgerAct(generateActionPayload("newcampus_feeledgers", undefined, payload)));
      // dispatch(getPayFeeDetailsAct(generateActionPayload("get_pay_fee_details", undefined, payload)));
    }
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
            openDelLedgerModalHndlr(feeLedgerId);
          }
        },
      },
    ],
    []
  );

  const deleteLedgerHndler = () => {
    const { modalData } = delLedgerModalState;
    dispatch(deleteLedgerDetailAct(generateActionPayload("delete_ledger_details", { id: modalData })));
  }

  async function submitLedgerHndlr() {
    const updatedLedgers = [...newCampusLedgerState];
    const { items, isValid } = await validateOnSubmit(ledgerValidationSchema, updatedLedgers);
    const { excessAmount = 0 } = newCampusFeeLedgerResp;
    if (!isValid) {
      setNewCampusLedgerState(items);
      return;
    }
    const payload = newCampusLedgerState.map((item: any) => ({
      id: item.id,
      studentConcession: item.studentConcessionAmount
    }));
    dispatch(submitNewCampusLedgersAct(generateActionPayload("submit_newcampus_ledgers", {
      campusId: campusInfo?.id,
      excessAmount: excessAmount ? excessAmount : "0.0",
    }, payload)));
  }


  async function onChangeTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target,
      [indexKey, nameKey] = name.split(".");
    if (indexKey && nameKey) {
      var indexMatch = indexKey.match(/\[(.*?)\]/) || "",
        index = Number(Number(indexMatch[1]));
      if (!isNaN(index)) {
        const updatedLedgers = [...newCampusLedgerState];
        const { amountToPay, employeeConcessionAmount, tuitionFeeConcession, paidAmount } = updatedLedgers[index];
        let balanceAmount = (Number(amountToPay) || 0) - (Number(employeeConcessionAmount) || 0) -
          (Number(tuitionFeeConcession) || 0) - (Number(paidAmount) || 0) - (Number(value) || 0);
        const ledgerInfo = { ...newCampusLedgerState[index], [nameKey]: value, balanceAmount: balanceAmount < 0 ? 0 : balanceAmount };
        updatedLedgers.splice(index, 1, ledgerInfo);
        const { items } = await validateOnChange(ledgerValidationSchema, name, updatedLedgers);
        setNewCampusLedgerState(items);
      }
    }
  }


  async function onBlurTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target,
      [indexKey, nameKey] = name.split(".");
    if (indexKey && nameKey) {
      var indexMatch = indexKey.match(/\[(.*?)\]/) || "",
        index = Number(Number(indexMatch[1]));
      const updatedLedgers = [...newCampusLedgerState];
      const touchedLedgers = await touchTableFieldOnBlur(index, nameKey, updatedLedgers);
      setNewCampusLedgerState(touchedLedgers);
    }
  }

  const oldCampusLedgerColumns = useMemo(() => generateOldCampusFeeDetailsColumns(), [oldCampusFeeLedgerResp]);
  const newCampusLedgerColumns = useMemo(() => generateFeeDetailsModalColumns(menuOptions), [newCampusLedgerState]);
  const { ledgers: oldFeeLedgers } = oldCampusFeeLedgerResp || {};
  return (
    <>
      <div className="tw-flex tw-flex-col tw-items-center">

        {/* Student Info Section */}
        <div className="tw-w-full tw-pt-4 tw-pb-2 tw-px-6">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">

            {/* Column 1 */}
            <div className="tw-space-y-3">
              <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                <div className="tw-col-span-4">
                  <label className="tw-font-semibold">Student Name:</label>
                </div>
                <div className="tw-col-span-8">
                  <span>{campusInfo?.studentName || "-"}</span>
                </div>
              </div>

              <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                <div className="tw-col-span-4">
                  <label className="tw-font-semibold">Student Code:</label>
                </div>
                <div className="tw-col-span-8">
                  <span>{campusInfo?.newStudentCode || "-"}</span>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                <div className="tw-col-span-3">
                  <label className="tw-font-semibold">Email:</label>
                </div>
                <div className="tw-col-span-9">
                  <span>{campusInfo?.email || "-"}</span>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div>
              <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                <div className="tw-col-span-4">
                  <label className="tw-font-semibold">Phone Number:</label>
                </div>
                <div className="tw-col-span-8">
                  <span>{campusInfo?.phoneNo || "-"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Old Campus Ledger */}
        {!campusInfo?.isAcceptanceLedgerSubmit && (
          <div className="tw-w-full tw-px-6">
            <div className="tw-relative tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-pt-6 tw-px-4 tw-pb-4 tw-mt-5 tw-mb-3">

              <p className="tw-absolute tw--top-3 tw-left-4 tw-bg-white tw-px-3 tw-text-sm tw-text-gray-600">
                Ledger Details for {campusInfo?.currentCampusName} Campus
              </p>

              <TableContainer
                columns={oldCampusLedgerColumns}
                data={Array.isArray(oldFeeLedgers) ? oldFeeLedgers : []}
                divClass="tw-overflow-x-auto"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
              />
            </div>
          </div>
        )}

        {/* Note */}
        {!campusInfo?.newStudentId && (
          <div className="tw-w-full tw-px-6 tw-mt-4">
            <p className="tw-m-0">
              <b>Note:</b>
              <span className="tw-text-gray-500">
                &nbsp;Ledger for {campusInfo?.newCampusName} will generate once the campus transfer is approved.
              </span>
            </p>
          </div>
        )}

        {/* New Campus Ledger */}
        <div className="tw-w-full tw-px-6">
          <div className="tw-relative tw-w-full tw-border tw-border-gray-300 tw-rounded-md tw-pt-6 tw-px-4 tw-pb-4 tw-mt-5">

            <p className="tw-absolute tw--top-3 tw-left-4 tw-bg-white tw-px-3 tw-text-sm tw-text-gray-600">
              Ledger Details for {campusInfo?.newCampusName} Campus
            </p>

            <TableContainer
              columns={newCampusLedgerColumns}
              data={newCampusLedgerState}
              rowDataInfo={campusInfo}
              divClass="tw-overflow-x-auto"
              onChangeInputHndlr={onChangeTableHndlr}
              onBlurInputHndlr={onBlurTableHndlr}
              theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
            />
          </div>
        </div>

        {/* Submit Button */}
        {!campusInfo?.isAcceptanceLedgerSubmit && (
          <div className="tw-w-full tw-flex tw-justify-center tw-py-4">
            <Button
              type="submit"
              onClick={submitLedgerHndlr}
              disabled={showApiLoader}
              variant="primary"
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

export default LedgerModal;
