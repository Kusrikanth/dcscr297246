import React, { useState, useEffect, useRef } from "react";
import { useFormik, } from "formik";
import { DateInput, SelectInput, TextInput, TextInputGroup, TextInputWithRegex } from "../../../Components/Common";
import * as Yup from 'yup';
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { paymentModeType } from "./helper";
import { approveStuLIdCardAct, idCardAmountAct, payStuLIdCardAct } from "../../../store/academic/notreportingstudents/notreportingstudentsactions";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";

const initialValues = {
  transactionDate: "",
  transactionId: "",
  bankName: "",
  amount: "",
  paymentMode: "CASH",
  remarks: ""
};

const validationSchema = Yup.object().shape({
  transactionDate: Yup.string().when("paymentMode", {
    is: (mode: any) => mode === "CARD" || mode === "UPI",
    then: Yup.string().required("Transaction Date is required."),
    otherwise: Yup.string().notRequired(),
  }),
  transactionId: Yup.string().when("paymentMode", {
    is: (mode: any) => mode === "CARD" || mode === "UPI",
    then: Yup.string().required("Transaction ID is required."),
    otherwise: Yup.string().notRequired(),
  }),
  bankName: Yup.string().when("paymentMode", {
    is: (mode: any) => mode === "CARD" || mode === "UPI",
    then: Yup.string().required("Bank Name is required."),
    otherwise: Yup.string().notRequired(),
  }),
  amount: Yup.string().required("Amount is required."),
  paymentMode: Yup.string().required("Payment Mode is required."),
});

const PayNowModal = (props: any) => {

  const dispatch = useDispatch();
  const { modalData } = props;
  const {
    showApiLoader,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    getIdCardAmountResp
  } = useAppSelector(
    ({ globalData, appData, notReportingStu }) => ({
      showApiLoader: globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getIdCardAmountResp: notReportingStu.getIdCardAmountResp
    }),
    shallowEqual
  );
  const payNowDetailsForm = useFormik({

    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { bankName, transactionDate, transactionId, amount, paymentMode, remarks } = values || {};

      let payload;
      if (paymentMode === "CARD" || paymentMode === "UPI") {
        payload = {
          bankName,
          transactionDate,
          transactionState: "SUCCESS",
          transactionId,
          amount,
          idCardStatus: "PAY_NOW",
          paymentMode,
          remarks,
        };
      } else if (paymentMode === "CASH") {
        payload = {
          transactionState: "SUCCESS",
          amount,
          idCardStatus: "PAY_NOW",
          paymentMode,
          remarks,
        };
      }
      dispatch(payStuLIdCardAct(generateActionPayload("pay_stu_id_card", { idCadrNo: props?.modalData.idCadrNo }, payload)));
    }
  })
  useEffect(() => {
    if (getIdCardAmountResp?.length > 0) {
      const idCardSetting = getIdCardAmountResp.find((item: { settingKey: string; }) => item.settingKey === "ID_CARD");
      if (idCardSetting?.settingValue) {
        payNowDetailsForm.setFieldValue("amount", idCardSetting.settingValue);
      }
    }
  }, [getIdCardAmountResp]);

  useEffect(() => {
    dispatch(idCardAmountAct(generateActionPayload("get_id_card_amount", undefined, { instituteId, branchId, settingKey: "ID_CARD",  })));
  }, []);

  return (
    <>
      <form onSubmit={payNowDetailsForm.handleSubmit}>
        <div style={{ padding: "1.25rem" }}>
          <div className="row">
            <div className="col-xs-12 col-md-6">
              <SelectInput
                name="paymentMode"
                labelText="Payment Mode"
                labelClass="required"
                value={payNowDetailsForm.values.paymentMode}
                onChange={payNowDetailsForm.handleChange}
                menuItems={paymentModeType}
                valueKey="id"
                textKey="name"
                formgroupClassName="mb-3"
                onBlur={payNowDetailsForm.handleBlur}
                invalid={payNowDetailsForm.touched.paymentMode && payNowDetailsForm.errors.paymentMode ? true : false}
                error={payNowDetailsForm.touched.paymentMode && payNowDetailsForm.errors.paymentMode ? payNowDetailsForm.errors.paymentMode : ""}
              />
            </div>
            {(payNowDetailsForm.values.paymentMode === "CARD" ||
              payNowDetailsForm.values.paymentMode === "UPI") && (
                <>
                  <div className="col-xs-12 col-md-6">
                    <TextInput
                      name="transactionId"
                      labelText="Transaction Id"
                      labelClass="required"
                      value={payNowDetailsForm.values.transactionId}
                      onChange={payNowDetailsForm.handleChange}
                      onBlur={payNowDetailsForm.handleBlur}
                      invalid={payNowDetailsForm.touched.transactionId && payNowDetailsForm.errors.transactionId ? true : false}
                      error={payNowDetailsForm.touched.transactionId && payNowDetailsForm.errors.transactionId ? payNowDetailsForm.errors.transactionId : ""}
                    />
                  </div>
                  <div className="col-xs-12 col-md-6">
                    <DateInput
                      name="transactionDate"
                      labelText="Transaction Date"
                      formgroupClassName="mb-3"
                      labelClass="required"
                      value={payNowDetailsForm.values.transactionDate}
                      onChange={payNowDetailsForm.handleChange}
                      invalid={payNowDetailsForm.touched.transactionDate && payNowDetailsForm.errors.transactionDate ? true : false}
                      error={payNowDetailsForm.touched.transactionDate && payNowDetailsForm.errors.transactionDate ? payNowDetailsForm.errors.transactionDate : ""}
                    />
                  </div>
                  <div className="col-xs-12 col-md-6">
                    <TextInput
                      name="bankName"
                      labelText="Bank Name"
                      formgroupClassName="mb-0"
                      labelClass="required"
                      value={payNowDetailsForm.values.bankName}
                      onChange={payNowDetailsForm.handleChange}
                      invalid={payNowDetailsForm.touched.bankName && payNowDetailsForm.errors.bankName  ? true  : false}
                      error={payNowDetailsForm.touched.bankName && payNowDetailsForm.errors.bankName  ? payNowDetailsForm.errors.bankName  : ""}
                    />
                  </div>
                </>
              )}
            <div className="col-xs-12 col-md-6 ">
              <TextInputGroup
                name="amount"
                labelText="Amount"
                labelClass="required"
                inputGroupStart={true}
                isDisabled={true}
                value={payNowDetailsForm.values.amount}
                onChange={payNowDetailsForm.handleChange}
                onBlur={payNowDetailsForm.handleBlur}
                allowedInputRegex="^[0-9]{1,7}(\.[0-9]{1,2})?$"
              >
                <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              </TextInputGroup>
            </div>
            {(payNowDetailsForm.values.paymentMode === "CARD" ||
              payNowDetailsForm.values.paymentMode === "UPI") && (
                <>
                  <div className="col-xs-12 col-md-6 ">
                    <TextInput
                      name="remarks"
                      labelText="Remarks"
                      value={payNowDetailsForm.values.remarks}
                      onChange={payNowDetailsForm.handleChange}
                    />
                  </div>
                </>
              )}
            {(payNowDetailsForm.values.paymentMode === "CASH") && (
              <>
                <div className="col-12">
                  <TextInput
                    name="remarks"
                    labelText="Remarks"
                    value={payNowDetailsForm.values.remarks}
                    onChange={payNowDetailsForm.handleChange}
                  />
                </div>
              </>
            )}
          </div>
          <div className="hstack gap-2 justify-content-end mb-1">
            <button
              type="button"
              className={"btn btn-light"}
              onClick={props.toggle}
            >
              Cancel
            </button>

            <button type="submit"
              className={`btn btn-success`}
              onClick={(event: any) => { payNowDetailsForm.handleSubmit(event) }}
              disabled={showApiLoader}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PayNowModal;