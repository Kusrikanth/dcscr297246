import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { DateInput, SelectInput, TextArea, TextInput, TextInputGroup } from "../../../../Components/Common";
import {
  createFeeAdmissionWithdrawalAct,
  getAdmissionWithdrawalByidAct,
} from '../../../../store/FrontDesk/AdmissionSettings/admissionsettingaction';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { paymentType } from "./helper";
import { getMasterBanksAct, getMasterTrustAct } from "../../../../store/masterdata/masterdataactions";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";

function getApprovalModalState(withdrawalDetails?: any) {
  return ({
    academicYearId: withdrawalDetails?.academicYearId || "",
    branchCurriculumId: withdrawalDetails?.curriculumId || "",
    branchClassId: withdrawalDetails?.classId || "",
    studentId: withdrawalDetails?.studentId || "",
    voucherNo: withdrawalDetails?.voucherNo || "",
    paymentMode: withdrawalDetails?.paymentMode || "CASH",
    amountReturned: withdrawalDetails?.amountReturned || "",
    chequeName: withdrawalDetails?.chequeName || "",
    chequeNo: withdrawalDetails?.chequeNo || "",
    chequeDate: withdrawalDetails?.chequeDate || "",
    chequeAmount: withdrawalDetails?.chequeAmount || "",
    chequeBankName: withdrawalDetails?.chequeBankName || "",
    remarks: withdrawalDetails?.remarks || "",
  })
}

const validationSchema = Yup.object().shape({
  paymentMode: Yup.string().required("Payment mode is required."),
  amountReturned: Yup.string().when('paymentMode', {
    is: (item: any) => item === "CASH",
    then: Yup.string().required("Amount returned is required.")
  }),
  chequeName: Yup.string().when('paymentMode', {
    is: (item: any) => item === "CHEQUE",
    then: Yup.string().required("Cheque name is required.")
  }),
  chequeNo: Yup.string().when('paymentMode', {
    is: (item: any) => item === "CHEQUE",
    then: Yup.string().required("Cheque number is required.")
  }),
  chequeDate: Yup.string().when('paymentMode', {
    is: (item: any) => item === "CHEQUE",
    then: Yup.string().required("Cheque date is required.")
  }),
  chequeBankName: Yup.string().when('paymentMode', {
    is: (item: any) => item === "CHEQUE",
    then: Yup.string().required("Cheque  bank name is required.")
  }),
  remarks: Yup.string().when('paymentMode', {
    is: (item: any) => item === "CHEQUE",
    then: Yup.string().required("Remarks is required.")
  })
});

const initialState = getApprovalModalState();
const AdmissionWithdrawalApprovalModal = ({ isOpen,
  admissionWithdrawalId, toggleModal, branchId, instituteId }: any) => {
  const dispatch = useDispatch(),
    {
      showApiLoader, masterBanksResp, masterTrustResp, admissionWithdrawalByIdResp,
      createFeeAdmissionWithdrawalResp
    }: any = useAppSelector(
      ({ globalData, masterData,
        admissionSettingRequest
      }) => ({
        showApiLoader: globalData.showApiLoader,
        masterBanksResp: masterData.masterBanksResp,
        masterTrustResp: masterData.masterTrustResp,
        admissionWithdrawalByIdResp: admissionSettingRequest.admissionWithdrawalByIdResp,
        createFeeAdmissionWithdrawalResp: admissionSettingRequest.createFeeAdmissionWithdrawalResp,
      }),

      shallowEqual
    );
  const addAdmissionWithRespRef = useRef({
    prevAdmissionWithdrawalByIdResp: admissionWithdrawalByIdResp,
    prevCreateFeeAdmissionWithdrawalResp: createFeeAdmissionWithdrawalResp
  });

  useEffect(() => {
    const { prevAdmissionWithdrawalByIdResp, prevCreateFeeAdmissionWithdrawalResp } = addAdmissionWithRespRef.current;
    if (admissionWithdrawalByIdResp && admissionWithdrawalByIdResp !== prevAdmissionWithdrawalByIdResp) {
      const { academicYearId, studentId, studentCode, curriculumId, studentName } = admissionWithdrawalByIdResp,
        formData = getApprovalModalState(admissionWithdrawalByIdResp);
      approvalForm.resetForm({
        values: formData
      })
    } else if (createFeeAdmissionWithdrawalResp && createFeeAdmissionWithdrawalResp !== prevCreateFeeAdmissionWithdrawalResp) {
      toast.success("Admission withdrawal approved successfully.");
      toggleModal(true);
    }
    addAdmissionWithRespRef.current.prevAdmissionWithdrawalByIdResp = admissionWithdrawalByIdResp;
    addAdmissionWithRespRef.current.prevCreateFeeAdmissionWithdrawalResp = createFeeAdmissionWithdrawalResp;
  }, [admissionWithdrawalByIdResp, createFeeAdmissionWithdrawalResp]);


  useEffect(() => {
    if (admissionWithdrawalId && isOpen) {
      const params = { admissionWithdrawalId: admissionWithdrawalId };
      dispatch(getAdmissionWithdrawalByidAct(generateActionPayload("get_admission_withdrawal_byid", undefined, params)));
    }
  }, [admissionWithdrawalId, isOpen]);

  useEffect(() => {
    const bankApiPayload = { pageNo: 0, pageSize: 100, sortBy: 'bankName', orderBy: 'ASC' };
    dispatch(getMasterBanksAct(generateActionPayload("get_bank_details", undefined, bankApiPayload)));
    dispatch(getMasterTrustAct(generateActionPayload("get_master_trust")));
  }, []);

  const approvalForm = useFormik({
    initialValues: initialState,
    validationSchema,
    onSubmit: (values) => {
      const payload = { ...values, branchId, instituteId };
      dispatch(createFeeAdmissionWithdrawalAct(generateActionPayload('create_fee_admissionwithdrawal', {
        admissionWithdrawalId
      }, payload)));
    },
  })

  function onChangePaymentModeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if (value === "CHEQUE") {
      const accountPayeeName = Array.isArray(masterTrustResp) ? masterTrustResp[0]?.trustName : "";
      approvalForm.setValues(prevValues => ({
        ...prevValues, amountReturned: "",
        chequeName: accountPayeeName
      }));
    } else if (value === "CASH") {
      approvalForm.setValues(prevValues => ({
        ...prevValues, chequeAmount: "",
        chequeBankName: "", chequeName: "", chequeNo: "", chequeDate: ""
      }));
    }
    approvalForm.setFieldValue(name, value);
  }

  function onBlurAmountHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    approvalForm.setValues((prevState: any) => ({
      ...prevState,
      [name]: value ? getAmountValueWithDecimal(value) : "",
    }));
    approvalForm.handleBlur(event);
  }


  return (
    <form onSubmit={approvalForm.handleSubmit}>
      <div className=" tw-p-0">
        <div className="tw-border-b tw-px-3 tw-py-3">
          <div className="tw-flex tw-flex-wrap tw-mb-2">
            <div className="tw-w-1/3 tw-px-2">
              <span className="tw-text-gray-500">Student ID :</span>
              <p>{admissionWithdrawalByIdResp?.studentCode || "-"}</p>
            </div>
            <div className="tw-w-1/3 tw-px-2">
              <span className="tw-text-gray-500">Student Name</span>
              <p>{admissionWithdrawalByIdResp?.studentName || "-"}</p>
            </div>
            <div className="tw-w-1/3 tw-px-2">
              <span className="tw-text-gray-500">Academic Year</span>
              <p>{admissionWithdrawalByIdResp?.academicYearName || "-"}</p>
            </div>
          </div>
          <div className="tw-flex tw-flex-wrap tw-mb-2">
            <div className="tw-w-1/3 tw-px-2">
              <span className="tw-text-gray-500">Curriculum</span>
              <p>{admissionWithdrawalByIdResp?.curriculumName || "-"}</p>
            </div>
            <div className="tw-w-1/3 tw-px-2">
              <span className="tw-text-gray-500">Receipt No</span>
              <p>{admissionWithdrawalByIdResp?.receiptNo || "-"}</p>
            </div>
            <div className="tw-w-1/3 tw-px-2">
              <span className="tw-text-gray-500">Voucher No</span>
              <p>{admissionWithdrawalByIdResp?.voucherNo || "-"}</p>
            </div>
          </div>
          <div className="tw-flex tw-flex-wrap tw-mb-2">
            <div className="tw-w-1/3 tw-px-2">
              <span className="tw-text-gray-500">Class</span>
              <p>{admissionWithdrawalByIdResp?.className || "-"}</p>
            </div>
            <div className="tw-w-2/3 tw-px-2">
              <span className="tw-text-gray-500">Reason</span>
              <p>{admissionWithdrawalByIdResp?.reason || "-"}</p>
            </div>
          </div>
        </div>

        <div className="tw-px-3 tw-py-3">
          <div className="tw-flex tw-flex-wrap tw-gap-3">
            <div className="tw-w-1/2">
              <SelectInput
                name="paymentMode"
                hideSelectOption={true}
                value={approvalForm.values.paymentMode}
                onChange={onChangePaymentModeHandler}
                onBlur={approvalForm.handleBlur}
                menuItems={paymentType}
                valueKey="id"
                textKey="name"
                labelText="Pay Mode"
                invalid={
                  approvalForm.touched.paymentMode && approvalForm.errors.paymentMode
                    ? true
                    : false
                }
                error={
                  approvalForm.touched.paymentMode && approvalForm.errors.paymentMode
                    ? approvalForm.errors.paymentMode
                    : ""
                }
              />
            </div>

            {approvalForm.values.paymentMode === "CASH" && (
              <div className="tw-w-1/2">
                <TextInputGroup
                  name="amountReturned"
                  labelText="Amount to be Refunded"
                  allowedInputRegex="^[0-9]+\.?[0-9]*$"
                  inputGroupStart={true}
                  value={approvalForm.values.amountReturned}
                  onChange={approvalForm.handleChange}
                  onBlur={onBlurAmountHndlr}
                  placeHolder="0.00"
                  invalid={
                    approvalForm.touched.amountReturned &&
                      approvalForm.errors.amountReturned
                      ? true
                      : false
                  }
                  error={
                    approvalForm.touched.amountReturned &&
                      approvalForm.errors.amountReturned
                      ? approvalForm.errors.amountReturned
                      : ""
                  }
                >
                  <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                </TextInputGroup>
              </div>
            )}

            {approvalForm.values.paymentMode === "CHEQUE" && (
              <>
                <div className="tw-w-1/2">
                  <TextInputGroup
                    name="chequeAmount"
                    labelText="Cheque Amount"
                    allowedInputRegex="^[0-9]+\.?[0-9]*$"
                    inputGroupStart={true}
                    value={approvalForm.values.chequeAmount}
                    onChange={approvalForm.handleChange}
                    onBlur={onBlurAmountHndlr}
                    placeHolder="0.00"
                    invalid={
                      approvalForm.touched.chequeAmount &&
                        approvalForm.errors.chequeAmount
                        ? true
                        : false
                    }
                    error={
                      approvalForm.touched.chequeAmount &&
                        approvalForm.errors.chequeAmount
                        ? approvalForm.errors.chequeAmount
                        : ""
                    }
                  >
                    <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                  </TextInputGroup>
                </div>
                <div className="tw-w-1/2">
                  <TextInput
                    name="chequeNo"
                    labelText="Cheque No"
                    value={approvalForm.values.chequeNo}
                    onChange={approvalForm.handleChange}
                    onBlur={approvalForm.handleBlur}
                    invalid={
                      approvalForm.touched.chequeNo && approvalForm.errors.chequeNo
                        ? true
                        : false
                    }
                    error={
                      approvalForm.touched.chequeNo && approvalForm.errors.chequeNo
                        ? approvalForm.errors.chequeNo
                        : ""
                    }
                  />
                </div>
                <div className="tw-w-1/2">
                  <TextInput
                    name="chequeName"
                    labelText="In The Name of"
                    value={approvalForm.values.chequeName}
                    onChange={approvalForm.handleChange}
                    onBlur={approvalForm.handleBlur}
                    invalid={
                      approvalForm.touched.chequeName &&
                        approvalForm.errors.chequeName
                        ? true
                        : false
                    }
                    error={
                      approvalForm.touched.chequeName &&
                        approvalForm.errors.chequeName
                        ? approvalForm.errors.chequeName
                        : ""
                    }
                  />
                </div>
                <div className="tw-w-1/2">
                  <SelectInput
                    name="chequeBankName"
                    formgroupClassName="tw-mb-3"
                    labelText="Bank Name"
                    value={approvalForm.values.chequeBankName}
                    onChange={approvalForm.handleChange}
                    onBlur={approvalForm.handleBlur}
                    menuItems={masterBanksResp?.data}
                    valueKey="bankName"
                    textKey="bankName"
                    invalid={
                      approvalForm.touched.chequeBankName &&
                        approvalForm.errors.chequeBankName
                        ? true
                        : false
                    }
                    error={
                      approvalForm.touched.chequeBankName &&
                        approvalForm.errors.chequeBankName
                        ? approvalForm.errors.chequeBankName
                        : ""
                    }
                  />
                </div>
                <div className="tw-w-1/2">
                  <DateInput
                    name="chequeDate"
                    value={approvalForm.values.chequeDate}
                    onChange={approvalForm.handleChange}
                    onBlur={approvalForm.handleBlur}
                    labelText="Cheque Date"
                    invalid={
                      approvalForm.touched.chequeDate &&
                        approvalForm.errors.chequeDate
                        ? true
                        : false
                    }
                    error={
                      approvalForm.touched.chequeDate &&
                        approvalForm.errors.chequeDate
                        ? approvalForm.errors.chequeDate
                        : ""
                    }
                  />
                </div>
              </>
            )}

            <div className="tw-w-full">
              <TextArea
                name="remarks"
                value={approvalForm.values.remarks}
                onChange={approvalForm.handleChange}
                formgroupClassName="tw-mb-0"
                labelText="Remarks"
                invalid={
                  approvalForm.touched.remarks && approvalForm.errors.remarks
                    ? true
                    : false
                }
                error={
                  approvalForm.touched.remarks && approvalForm.errors.remarks
                    ? approvalForm.errors.remarks
                    : ""
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className=" tw-shadow-t tw-p-3">
        <div className="tw-flex tw-gap-2 tw-justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={toggleModal}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AdmissionWithdrawalApprovalModal;
