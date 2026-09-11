import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { generateColumns } from "./helper";
import { useFormik } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { enableCCAvenueHandler, getDisplayAmountValue } from "../../../../utility/commonutility";
import { TextInputGroup } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { getSpecialFeePayDetailsAct, feePaymentAct, setSpecialFeePayDetailsAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { createJodoOrder } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { getSpecialFeesLedgers } from "../FeeLedger/helper";
import { instituteCodeOptions, PaymentGatewayTypes } from "../../../../Components/constants/common";
import { getPaymentGatewaysBranchListAct } from "../../../../store/mastersettings/feesettings/feesettingsactions";

const validationSchema = Yup.object().shape({

  totalAmount: Yup.string().test("isCashAmountGreater", "Amount should not be zero. Selected atleast one ledger to pay.",
    (value: any, schema: any) => {
      const concessionAmount = schema.parent?.concessionAmount;
      if ((Number(value) - Number(concessionAmount)) <= 0) {
        return false;
      }
      return true;
    }),
});

const initialValues = {
  academicYearId: '',
  totalOutstandingAmount: 0,
  fineAmount: 0,
  totalAmount: 0,
  concessionAmount: 0,
  concessionPercentage: 0,
  ledgerIds: [],
  selectedSpecialFeeIds: []
};

const PayFee = ({ studentId, academicYearId }) => {
  const dispatch = useDispatch();
  const [allSpecialLedgerSelectedState, setAllSpecialFeeLedgerSelectedState] = useState(false);
  const [paymentInfoState, setPaymentInfoState] = useState({
    ccavenueUrl: "",
    payloadData: "",
    accessCode: "",
  });
  const paymentGatewayTypeRef = useRef('');
  const { currentInstIdResp: instituteId,
    academicYearListResp,
    createJodoOrderResp, currentStudentId, parentChildrensResp,
    feeLedgersConcessionResp, feeCollectionErrorResp,
    feePaymentResp, showApiLoader,
    getPaymentGatewaysBranchListResp,
    getSpecialFeePayDetailsResp, }: any =
    useAppSelector(
      ({ appData, instAcademics, applicationSale, instFeeSettings, directoryStudent, globalData, feeCollections }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        currentInstIdResp: appData.currentInstIdResp,
        feeLedgersConcessionResp: feeCollections.feeLedgersConcessionResp,
        currentStudentId: appData.currentStudentId,
        showApiLoader: globalData.showApiLoader,
        createJodoOrderResp: applicationSale.createJodoOrderResp,
        parentChildrensResp: directoryStudent.parentChildrensResp,
        getSpecialFeePayDetailsResp: feeCollections.getSpecialFeePayDetailsResp,
        getPaymentGatewaysBranchListResp:
          instFeeSettings.getPaymentGatewaysBranchListResp,
        feePaymentResp: feeCollections.feePaymentResp,
      }),
      shallowEqual
    );

  const payFeeRespRef = useRef({
    prevCreateJodoOrderResp: createJodoOrderResp,
    prevFeePaymentResp: feePaymentResp,
    prevFeeLedgersConcessionResp: feeLedgersConcessionResp,
  });
  const isCcAvenuPayment = useRef(false);

  useEffect(() => {
    const { prevCreateJodoOrderResp, prevFeeLedgersConcessionResp, prevFeePaymentResp } = payFeeRespRef.current;
    if (createJodoOrderResp && createJodoOrderResp !== prevCreateJodoOrderResp) {
      const { data } = createJodoOrderResp;
      if (paymentGatewayTypeRef.current === PaymentGatewayTypes.JODO) {
        if (data?.redirect_url) {
          window.location.assign(data?.redirect_url);
        } else {
          toast.error("Something went wrong.");
        }
        paymentGatewayTypeRef.current = '';
      } else {
        if (data?.order_id) {
          const { totalAmount, fineAmount, concessionAmount } = payFeeForm.values;
          const studentDetails: any = parentChildrensResp?.find((i: any) => +i?.childId === +currentStudentId);
          const paymentPayload = {
            orderRef: data?.order_id,
            branchId: studentDetails?.childBranchId,
            // amount: import.meta.env.VITE_ENVIRONMENT === "dev" ? "1.0" : Number(totalAmount) + Number(fineAmount) - Number(concessionAmount),
            amount: Number(totalAmount) + Number(fineAmount) - Number(concessionAmount),
            identifier: {
              type: "STUDENT_CODE",
              value: studentDetails?.childCode,
              studentId: studentDetails?.childId
            },
            mobileNumber: studentDetails?.smsPriorityNo,
            email: studentDetails?.emailId,
            studentName: studentDetails?.childName,
            pgName: paymentGatewayTypeRef.current,
            callbackUrl: `${window.location.origin}/paymentstatus/${studentDetails?.childBranchId}`,
            redirectUrl: window.location.href,
          }
          dispatch(feePaymentAct(generateActionPayload("ccavenue_fee_payment", undefined, paymentPayload)));
        }
        else {
          toast.error("Something went wrong.");
        }
      }
    } else if (feeLedgersConcessionResp && prevFeeLedgersConcessionResp !== feeLedgersConcessionResp) {
      const { totalAmount } = payFeeForm.values;
      if (isNaN(totalAmount) || isNaN(feeLedgersConcessionResp?.concessionAmount)) {
        toast.error("Error in getting ledger information. Something went wrong.");
        return;
      } else if (Number(feeLedgersConcessionResp?.concessionAmount) > Number(totalAmount)) {
        toast.error("Error in getting ledger information. Something went wrong.");
        return;
      }
      let amountValue = 0;
      amountValue = Number(totalAmount) - Number(feeLedgersConcessionResp?.concessionAmount);
      payFeeForm.setValues(prevValue => ({
        ...prevValue,
        concessionAmount: feeLedgersConcessionResp?.concessionAmount,
        concessionPercentage: feeLedgersConcessionResp?.concessionPercentage,
      }));
    } else if (feePaymentResp && prevFeePaymentResp !== feePaymentResp) {
      const { encRequest, accessCode, actionUrl } = feePaymentResp;
      if (paymentGatewayTypeRef.current === PaymentGatewayTypes.EASEBUZZ) {
        if (actionUrl) {
          window.location.assign(actionUrl);
        } else {
          toast.error("Something went wrong.");
        }
      } else if (paymentGatewayTypeRef.current === PaymentGatewayTypes.CCAVENUE) {
        setPaymentInfoState({
          ccavenueUrl: actionUrl,
          payloadData: encRequest,
          accessCode: accessCode,
        });
      }
      paymentGatewayTypeRef.current = '';
    }
    payFeeRespRef.current.prevCreateJodoOrderResp = createJodoOrderResp;
    payFeeRespRef.current.prevFeeLedgersConcessionResp = feeLedgersConcessionResp;
    payFeeRespRef.current.prevFeePaymentResp = feePaymentResp;
  }, [createJodoOrderResp, feeLedgersConcessionResp, feePaymentResp, feeCollectionErrorResp,
    parentChildrensResp, currentStudentId]);

  const [specialFeelistState, setSpecialFeelistState] = useState<Array<any>>([]);

  useEffect(() => {
    if (Array.isArray(getSpecialFeePayDetailsResp) && getSpecialFeePayDetailsResp.length > 0) {
      const specialFeeList = getSpecialFeesLedgers(getSpecialFeePayDetailsResp);
      const feeList = specialFeeList.filter(item =>
        item.paymentStatus?.toLowerCase() !== "paid").map((i: any, index: number) => {
          return { ...i, isChecked: false };
        })
      setSpecialFeelistState(feeList);
      const totalAmount = feeList.reduce((total: number, item: any) => {
        total = total + (+item?.balance || 0);
        return total;
      }, 0);
      payFeeForm.setValues(prevValue => ({
        ...prevValue,
        fineAmount: 0,
        totalAmount: 0,
        concessionAmount: 0,
        concessionPercentage: 0,
        ledgerIds: [],
        selectedSpecialFeeIds: [],
        totalOutstandingAmount: totalAmount,
      }), false);
      //Resetting the data
      setAllSpecialFeeLedgerSelectedState(false);
      setPaymentInfoState({
        ccavenueUrl: "",
        payloadData: "",
        accessCode: "",
      });
    }
  }, [getSpecialFeePayDetailsResp]);


  const payFeeForm = useFormik({
    initialValues: { ...initialValues, academicYearId },
    validationSchema,
    onSubmit: (values) => {
      const { selectedSpecialFeeIds } = values;
      const feeIdSelected: any = selectedSpecialFeeIds;
      const specialFeeIds = specialFeelistState.filter((item: any) => {
        return feeIdSelected.includes(item?.feeId)
      }).map((item: any) => ({
        ledgerId: undefined,
        specialFeeId: item.specialFeeId,
        academicYearId: item.academicYearId,
        specialFeeName: item.feeName,
        specialFeeTermId: item.feeType === "TERM" ? item.feeId : undefined,
        specialFeeMonthId: item.feeType === "MONTH" ? item.feeId : undefined,
        feeAmount: item.feeAmount,
        fineAmount: 0,
        concessionAmount: 0
      }));
      const studentDetails: any = parentChildrensResp?.find((i: any) => +i?.childId === +currentStudentId);
      const payload: any = {
        branchId: studentDetails?.childBranchId,
        academicYearId,
        curriculumId: studentDetails?.curriculumId,
        classId: studentDetails?.classId,
        name: studentDetails?.childName,
        phone: studentDetails?.smsPriorityNo,
        email: studentDetails?.emailId,
        paymentType: "SPECIAL_FEE",
        identifier: studentDetails?.childCode,
        studentId: studentDetails?.childId,
        fineAmount: Number(values.fineAmount),
        concessionAmount: (+values.concessionAmount),
        actualAmount: Number(values.totalAmount),
        specialFeeIds,
        details: [
          {
            component_type: "Payable Amount",
            // amount: import.meta.env.VITE_ENVIRONMENT === "dev" ? "1.0" : (Number(values.totalAmount) + Number(values.fineAmount) - Number(values.concessionAmount)),
            amount: Number(values.totalAmount) + Number(values.fineAmount) - Number(values.concessionAmount),
          }
        ],
        source: 'WEB',
        callback_url: `${import.meta.env.VITE_APPLICATION_URL}/feeledgersuccess/${studentDetails?.childId}`
      }
      if (paymentGatewayTypeRef.current === PaymentGatewayTypes.CCAVENUE) {
        payload.gateWayType = PaymentGatewayTypes.CCAVENUE;
      } else if (paymentGatewayTypeRef.current === PaymentGatewayTypes.EASEBUZZ) {
        payload.gateWayType = PaymentGatewayTypes.EASEBUZZ;
      } else {
        paymentGatewayTypeRef.current = PaymentGatewayTypes.JODO;
        payload.gateWayType = PaymentGatewayTypes.JODO;
      }
      dispatch(createJodoOrder(generateActionPayload("jodo_order_pay", undefined, payload)));
    },
  });
  function handleCcAvenuePayment() {
    paymentGatewayTypeRef.current = PaymentGatewayTypes.CCAVENUE;
    payFeeForm.handleSubmit();
  }

  function easeBuzzPaymentHandler() {
    paymentGatewayTypeRef.current = PaymentGatewayTypes.EASEBUZZ;
    payFeeForm.handleSubmit();
  }
  const singleSpecialFeeCheckboxHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget,
      feeId = event.currentTarget.getAttribute("data-id"),
      feeRowIndex = specialFeelistState?.findIndex((item: any) => +item.feeId === Number(feeId));
    if (feeRowIndex > -1 && Array.isArray(specialFeelistState)) {
      const updatedFeeDetails: any = specialFeelistState.map((item: any, index: number) => {
        if (feeRowIndex === index) {
          return ({ ...item, isChecked: checked });
        } else {
          return ({ ...item });
        }
      })
      setAllSpecialFeeLedgerSelectedState(updatedFeeDetails.every((item: any) => item.isChecked));
      let payingAmount = 0;
      updatedFeeDetails?.forEach((i: any) => {
        if (i?.isChecked) {
          payingAmount += (+i?.balance || 0)
        }
      })
      const selectedFeeIds = updatedFeeDetails?.filter((item: any) => item.isChecked).map((item: any) => item.feeId);
      payFeeForm.setValues((prev) => ({
        ...prev,
        selectedSpecialFeeIds: selectedFeeIds,
        totalAmount: payingAmount,
      }))
      setSpecialFeelistState(updatedFeeDetails);
    }
  }, [specialFeelistState]);

  const allSpecialFeeChecboxHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget;
    if (Array.isArray(specialFeelistState) && specialFeelistState.length > 0) {
      const updatedFeeDetails: any = specialFeelistState.map((item: any, index: number) => {
        if (checked) {
          return ({ ...item, isChecked: true })
        } else {
          return ({ ...item, isChecked: false })
        }
      });
      setSpecialFeelistState(updatedFeeDetails);
      setAllSpecialFeeLedgerSelectedState(checked);
      let payingAmount = 0;
      updatedFeeDetails.forEach((i: any) => {
        if (i?.isChecked) {
          payingAmount += (+i?.balance || 0)
        }
      })
      const selectedFeeIds = updatedFeeDetails?.filter((item: any) => item.isChecked).map((item: any) => item.feeId);
      payFeeForm.setValues((prev: any) => ({
        ...prev,
        selectedSpecialFeeIds: selectedFeeIds,
        totalAmount: payingAmount,
      }))
    }
  }, [specialFeelistState]);

  const paymentFormRef = useRef<any>(null);
  useEffect(() => {
    const { ccavenueUrl,
      payloadData,
      accessCode } = paymentInfoState;
    if (ccavenueUrl && payloadData && accessCode) {
      paymentFormRef?.current?.submit();
    }
  }, [paymentInfoState]);

  useEffect(() => {
    if (studentId && academicYearId) {
      dispatch(setSpecialFeePayDetailsAct(undefined));
      setSpecialFeelistState([]);
      payFeeForm.setValues(prevValue => ({
        ...prevValue,
        academicYearId,
        fineAmount: 0,
        totalAmount: 0,
        concessionAmount: 0,
        concessionPercentage: 0,
        ledgerIds: [],
        selectedSpecialFeeIds: [],
        totalOutstandingAmount: 0,
      }), false);

      let params = {
        studentId,
        academicYearId,
        isActive: 1,
      }
      dispatch(getSpecialFeePayDetailsAct(generateActionPayload('get_special_pay_fee_details', undefined, params)));
    }
  }, [studentId, academicYearId])

  useEffect(() => {
    if (Array.isArray(parentChildrensResp) && parentChildrensResp.length && currentStudentId) {
      const studentDetails: any = parentChildrensResp?.find((i: any) => +i?.childId === +currentStudentId);
      const payload = {
        instituteId: studentDetails?.instituteId,
        branchId: studentDetails?.childBranchId,
      };
      dispatch(getPaymentGatewaysBranchListAct(generateActionPayload("get_payment_gateways_branches_list", undefined, payload)));
    }
  }, [parentChildrensResp, currentStudentId]);

  const { isJodoEnabled, isCcAvenueEnabled, isEasyBuzzEnabled } = useMemo(() => {
    const pgs = getPaymentGatewaysBranchListResp?.[0]?.pgs ?? [];
    return {
      isJodoEnabled: pgs.some((pg: any) => pg.pgName === PaymentGatewayTypes.JODO),
      isCcAvenueEnabled: pgs.some((pg: any) => pg.pgName === PaymentGatewayTypes.CCAVENUE),
      isEasyBuzzEnabled: pgs.some((pg: any) => pg.pgName === PaymentGatewayTypes.EASEBUZZ),
    };
  }, [getPaymentGatewaysBranchListResp]);

  const academicLedgerColumns = useMemo(() => generateColumns(singleSpecialFeeCheckboxHndlr, allSpecialFeeChecboxHndlr, allSpecialLedgerSelectedState),
    [specialFeelistState, singleSpecialFeeCheckboxHndlr, allSpecialFeeChecboxHndlr]);
  const academicLedgerSelected = Array.isArray(payFeeForm.values.selectedSpecialFeeIds) ? (payFeeForm.values.selectedSpecialFeeIds.length === 0) : true;
  const enablePayNow = !academicLedgerSelected;
  const studentDetails: any = parentChildrensResp?.find((i: any) => +i?.childId === +currentStudentId);
  return (
    <>
      <>
        <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px 16px 12px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "20px" }}>
          <p className='tw-text-[15px]' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>
            Special Fee</p>
          <TableContainer
            columns={academicLedgerColumns}
            data={specialFeelistState}
            divClass="table-responsive tw-mb-0"
            theadClass="table-light tw-text-gray-500 tw-align-middle"
            showPagination={false}
          />
        </div>
        <form onSubmit={payFeeForm.handleSubmit}>
          <div className="tw-w-full md:tw-w-1/2 lg:tw-w-[41.666667%] tw-ml-auto">
            <div className="tw-flex tw-flex-wrap tw-items-center tw-mb-2">
              <div className="tw-grow tw-p-0">
                <h6 className="tw-m-0">Total Actual Amount</h6>
              </div>
              <div className="tw-grow">
                <TextInputGroup
                  name="totalAmount"
                  formgroupClassName="tw-mb-0"
                  inputgroupClassName="input-group-sm"
                  inputClassName="form-control-sm"
                  inputGroupStart={true}
                  value={getDisplayAmountValue(payFeeForm.values.totalAmount)}
                  onChange={undefined}
                  isDisabled={true}
                >
                  <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                </TextInputGroup>
              </div>
            </div>

            <div className="tw-flex tw-flex-wrap tw-items-center tw-mb-2">
              <div className="tw-grow tw-p-0">
                <h6 className="tw-m-0">Fine Amount</h6>
              </div>
              <div className="tw-grow">
                <TextInputGroup
                  name="fineAmount"
                  formgroupClassName="tw-mb-0"
                  inputgroupClassName="input-group-sm"
                  inputClassName="form-control-sm"
                  inputGroupStart={true}
                  value={getDisplayAmountValue(payFeeForm.values.fineAmount)}
                  onChange={undefined}
                  isDisabled={true}
                >
                  <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                </TextInputGroup>
              </div>
            </div>
            <div className="tw-flex tw-flex-wrap tw-items-center tw-mb-2">
              <div className="tw-grow tw-p-0">
                <h6 className="tw-m-0">Total Concession Amount</h6>
              </div>
              <div className="tw-grow">
                <TextInputGroup
                  name="concessionAmount"
                  formgroupClassName="tw-mb-0"
                  inputgroupClassName="input-group-sm"
                  inputClassName="form-control-sm"
                  inputGroupStart={true}
                  value={getDisplayAmountValue(payFeeForm.values.concessionAmount)}
                  onChange={undefined}
                  isDisabled={true}
                >
                  <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                </TextInputGroup>
              </div>
            </div>
            <div className="tw-flex tw-flex-wrap tw-items-center tw-mb-3 tw-pb-3" style={{ borderBottom: "2px dashed #CFCFCF" }}>
              <div className="tw-grow tw-p-0">
                <h6 className="tw-m-0">Concession Percentage</h6>
              </div>
              <div className="tw-grow">
                <TextInputGroup
                  name="cocessionPercentage"
                  formgroupClassName="tw-mb-0"
                  inputgroupClassName="input-group-sm"
                  inputClassName="form-control-sm"
                  inputGroupStart={true}
                  value={payFeeForm.values.concessionPercentage || "0"}
                  onChange={undefined}
                  isDisabled={true}
                >
                  <span className="tw-font-bold">%</span>
                </TextInputGroup>
              </div>
            </div>
            <div className="tw-flex tw-flex-wrap tw-items-center tw-mb-2">
              <div className="tw-grow tw-p-0">
                <h6 className="tw-m-0">Paying Amount</h6>
              </div>
              <div className="tw-grow">
                <TextInputGroup
                  name="payingAmount"
                  formgroupClassName={"tw-mb-0"}
                  inputgroupClassName="input-group-sm"
                  inputClassName="form-control-sm"
                  value={getDisplayAmountValue(Number(payFeeForm.values.totalAmount))}
                  onChange={undefined}
                  inputGroupStart={true}
                  isDisabled={true}
                  invalid={(payFeeForm.touched.totalAmount && payFeeForm.errors.totalAmount) ? true : false}
                  error={(payFeeForm.touched.totalAmount && payFeeForm.errors.totalAmount) ? payFeeForm.errors.totalAmount : ""}
                >
                  <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                </TextInputGroup>
              </div>
            </div>
          </div>
          <div className="tw-flex tw-gap-3 tw-items-center tw-justify-center tw-flex-wrap tw-mt-6">
            {isJodoEnabled && <button
              type="submit"
              disabled={!enablePayNow || showApiLoader}
              className="btn btn-success tw-flex tw-items-center tw-justify-center">
              Pay Through Jodo
            </button>}
            {isCcAvenueEnabled && <button
              type="button"
              onClick={handleCcAvenuePayment}
              data-id="ccAvenue"
              disabled={!enablePayNow || showApiLoader}
              className="btn btn-success tw-flex tw-items-center tw-justify-center ">
              Pay Through Kotak
            </button>}
            {isEasyBuzzEnabled && <button
              type="button"
              onClick={easeBuzzPaymentHandler}
              data-id="eazeBuzz"
              disabled={!enablePayNow || showApiLoader}
              className="btn btn-success tw-flex tw-items-center tw-justify-center ">
              Pay Through Easebuzz
            </button>}
          </div>
        </form>
      </>
      <form id="nonseamless" ref={paymentFormRef} method="post" name="redirect"
        action={paymentInfoState.ccavenueUrl}>
        <input type="hidden" id="encRequest" name="encRequest" value={paymentInfoState.payloadData} />
        <input type="hidden" name="access_code" id="access_code" value={paymentInfoState.accessCode} />
      </form>
    </>
  );
};

export default PayFee;
