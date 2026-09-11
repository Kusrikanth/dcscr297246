import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { generateColumns } from "./helper";
import { useFormik } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { enableCCAvenueHandler, getDisplayAmountValue } from "../../../../utility/commonutility";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { TextInputGroup } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { getDateMonthYearFormat } from "../../../../utility/dateutility";
import { feeLedgersConcessionAct, feePaymentAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { createJodoOrder } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { getHostelPayfeeDetailsAct } from "../../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";
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
  totalOutstandingAmount: 0,
  fineAmount: 0,
  totalAmount: 0,
  concessionAmount: 0,
  concessionPercentage: 0,
  ledgerIds: [],
  academicLedgerIds: []
};

const PayFee = () => {
  const dispatch = useDispatch();
  const [allAcademicLedgerSelectedState, setAllAcademicLedgerSelectedState] = useState(false);
  const [academicLedgerState, setAcademicLedgerState] = useState<any>([]);
  const [transportLedgerState, setTransportLedgerState] = useState([]);
  const [jodoCredOptedState, setJodoCredOptedState] = useState(false);
  const [showTotalConcession, setShowTotalConcession] = useState(false);
  const [paymentInfoState, setPaymentInfoState] = useState({
    ccavenueUrl: "",
    payloadData: "",
    accessCode: "",
  });
  const paymentGatewayTypeRef = useRef('');
  const { currentInstIdResp: instituteId,
    createJodoOrderResp, currentStudentId, parentChildrensResp,
    feeLedgersConcessionResp, feeCollectionErrorResp,
    feePaymentResp, showApiLoader,
    getPaymentGatewaysBranchListResp,
    hostelPayfeeDetailsResp, }: any =
    useAppSelector(
      ({ appData, applicationSale, directoryStudent, globalData, instFeeSettings, hostelStuLedger, feeCollections }) => ({
        currentInstIdResp: appData.currentInstIdResp,
        hostelPayfeeDetailsResp: hostelStuLedger.hostelPayfeeDetailsResp,
        feeLedgersConcessionResp: feeCollections.feeLedgersConcessionResp,
        currentStudentId: appData.currentStudentId,
        showApiLoader: globalData.showApiLoader,
        createJodoOrderResp: applicationSale.createJodoOrderResp,
        parentChildrensResp: directoryStudent.parentChildrensResp,
        feePaymentResp: feeCollections.feePaymentResp,
        getPaymentGatewaysBranchListResp:
          instFeeSettings.getPaymentGatewaysBranchListResp,
        feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
      }),
      shallowEqual
    );

  const payFeeRespRef = useRef({
    prevCreateJodoOrderResp: createJodoOrderResp,
    prevFeePaymentResp: feePaymentResp,
    prevFeeLedgersConcessionResp: feeLedgersConcessionResp,
    prevFeeCollectionErrorResp: feeCollectionErrorResp
  });

  useEffect(() => {
    const { prevCreateJodoOrderResp, prevFeeLedgersConcessionResp,
      prevFeePaymentResp,
      prevFeeCollectionErrorResp } = payFeeRespRef.current;
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
        } else {
          toast.error("Something went wrong.");
        }
      }
    } else if (feeLedgersConcessionResp && prevFeeLedgersConcessionResp !== feeLedgersConcessionResp) {
      const { totalAmount } = payFeeForm.values;
      if (isNaN(totalAmount) || isNaN(feeLedgersConcessionResp?.concessionAmount)) {
        toast.error("Error in getting ledger information. Something went wrong.");
      } else if (Number(feeLedgersConcessionResp?.concessionAmount) > Number(totalAmount)) {
        toast.error("Error in getting ledger information. Something went wrong.");
      } else {
        if (Number(feeLedgersConcessionResp?.concessionAmount) > 0) {
          setShowTotalConcession(true);
        }
        payFeeForm.setValues(prevValue => ({
          ...prevValue,
          concessionAmount: feeLedgersConcessionResp?.concessionAmount,
          concessionPercentage: feeLedgersConcessionResp?.concessionPercentage,
        }));
      }
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
    } else if (feeCollectionErrorResp && prevFeeCollectionErrorResp !== feeCollectionErrorResp) {
      const { details } = feeCollectionErrorResp || {};
      toast.error(details || "Something went wrong.");
    }
    payFeeRespRef.current.prevCreateJodoOrderResp = createJodoOrderResp;
    payFeeRespRef.current.prevFeeLedgersConcessionResp = feeLedgersConcessionResp;
    payFeeRespRef.current.prevFeePaymentResp = feePaymentResp;
    payFeeRespRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
  }, [createJodoOrderResp, feeLedgersConcessionResp, feePaymentResp, feeCollectionErrorResp,
    parentChildrensResp, currentStudentId]);

  useEffect(() => {
    if (Array.isArray(hostelPayfeeDetailsResp) && hostelPayfeeDetailsResp.length > 0) {
      const academicFeeList = hostelPayfeeDetailsResp.filter((i: any) => (
        (i?.paymentStatus === "Unpaid" || i?.paymentStatus === "Partially paid")))
        .map((i: any, index: number) => {
          return { ...i, isEnabled: index === 0 ? true : false, isChecked: false };
        })
      const { totalAmount, hasConcession } = academicFeeList.reduce(
        (acc, item: any) => {
          acc.totalAmount += (+item?.balance || 0) + (+item?.fine || 0);

          if (!acc.hasConcession && +item?.totalConcession > 0) {
            acc.hasConcession = true;
          }

          return acc;
        },
        { totalAmount: 0, hasConcession: false }
      );
      setShowTotalConcession(hasConcession);
      setAcademicLedgerState(academicFeeList);
      payFeeForm.setValues(prevValue => ({
        ...prevValue,
        fineAmount: 0,
        totalAmount: 0,
        concessionAmount: 0,
        concessionPercentage: 0,
        ledgerIds: [],
        academicLedgerIds: [],
        totalOutstandingAmount: totalAmount,
      }), false);
      //Resetting the data
      setAllAcademicLedgerSelectedState(false);
      setPaymentInfoState({
        ccavenueUrl: "",
        payloadData: "",
        accessCode: "",
      });
    }
  }, [hostelPayfeeDetailsResp])

  const payFeeForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { academicLedgerIds } = values;
      const ledgersIdSelected: any = academicLedgerIds;
      const selectedLedgersDetail = hostelPayfeeDetailsResp.filter((item: any) => {
        return ledgersIdSelected.includes(item?.ledgerId)
      })
      if (selectedLedgersDetail?.[0]?.feeDetails === "CAUTION DEPOSIT FEE" && selectedLedgersDetail.length === 1) {
        const feeDetailsList = hostelPayfeeDetailsResp.filter((i: any) => (
          (i?.paymentStatus === "Unpaid" || i?.paymentStatus === "Partially paid")));
        if (!!feeDetailsList?.[1]) {
          toast.error(`Please pay ${feeDetailsList?.[1]?.feeDetails} also with CAUTION DEPOSIT FEE.`);
          return;
        }
      }

      const ledgerIds = selectedLedgersDetail.map((item: any) => ({
        ledgerId: item.ledgerId,
        feeAmount: item.amountToPay,
        fineAmount: item.fineAmount,
        concessionAmount: 0
      }));
      const studentDetails: any = parentChildrensResp?.find((i: any) => +i?.childId === +currentStudentId);
      const payload: any = {
        branchId: studentDetails?.childBranchId,
        academicYearId: studentDetails?.academicYearId,
        curriculumId: studentDetails?.curriculumId,
        classId: studentDetails?.classId,
        name: studentDetails?.childName,
        phone: studentDetails?.smsPriorityNo,
        email: studentDetails?.emailId,
        paymentType: "HOSTEL_FEE",
        identifier: studentDetails?.childCode,
        studentId: studentDetails?.childId,
        fineAmount: Number(values.fineAmount),
        concessionAmount: (+values.concessionAmount),
        actualAmount: Number(values.totalAmount),
        ledgerIds,
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

  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
  }, [instituteId]);

  const singleAcademicLedgerCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget,
      ledgerId = event.currentTarget.getAttribute("data-id"),
      ledgerRowIndex = academicLedgerState?.findIndex((item: any) => +item.ledgerId === Number(ledgerId));
    // let updateStudentState: any = [...academicLedgerState];

    if (ledgerRowIndex > -1 && Array.isArray(academicLedgerState)) {
      const updatedFeeDetails: any = academicLedgerState.map((item: any, index: number) => {
        if (ledgerRowIndex === index) {
          return ({ ...item, isChecked: checked });
        } else if (index === (ledgerRowIndex + 1) && checked) {
          return ({ ...item, isEnabled: true, isChecked: false });
        } else if (index > ledgerRowIndex && !checked) {
          return ({ ...item, isEnabled: false, isChecked: false });
        } else {
          return ({ ...item });
        }
      })
      setAllAcademicLedgerSelectedState(updatedFeeDetails.every((item: any) => item.isChecked));
      let payingAmount = 0, fineAmount = 0;
      updatedFeeDetails?.forEach((i: any) => {
        if (i?.isChecked) {
          payingAmount += (+i?.balance || 0)
          fineAmount += (+i?.fine || 0)
        }
      })
      const selectedLedgersIds = updatedFeeDetails?.filter((item: any) => item.isChecked).map((item: any) => item.ledgerId);
      payFeeForm.setValues((prev) => ({
        ...prev,
        academicLedgerIds: selectedLedgersIds,
        totalAmount: payingAmount,
        fineAmount,
        concessionAmount: 0,
        concessionPercentage: 0
      }))
      setAcademicLedgerState(updatedFeeDetails);
    }
  }, [academicLedgerState]);

  const allAcademicLedgerSelectHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget;
    if (Array.isArray(academicLedgerState) && academicLedgerState.length > 0) {
      const updatedFeeDetails: any = academicLedgerState.map((item: any, index: number) => {
        if (checked) {
          return ({ ...item, isEnabled: true, isChecked: true })
        } else {
          return ({ ...item, isEnabled: (index === 0) ? true : false, isChecked: false })
        }
      });
      setAcademicLedgerState(updatedFeeDetails);
      setAllAcademicLedgerSelectedState(checked);
      let payingAmount = 0, fineAmount = 0;
      updatedFeeDetails.forEach((i: any) => {
        if (i?.isChecked) {
          payingAmount += (+i?.balance || 0)
          fineAmount += (+i?.fine || 0)
        }
      })
      const selectedLedgersIds = updatedFeeDetails?.filter((item: any) => item.isChecked).map((item: any) => item.ledgerId);
      payFeeForm.setValues((prev: any) => ({
        ...prev,
        academicLedgerIds: selectedLedgersIds,
        totalAmount: payingAmount,
        fineAmount,
        concessionAmount: 0,
        concessionPercentage: "0"
      }))
    }
  }, [academicLedgerState]);

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


  const academicLedgerColumns = useMemo(() => {
    const columns = generateColumns(singleAcademicLedgerCheckHndlr, allAcademicLedgerSelectHndlr, allAcademicLedgerSelectedState, jodoCredOptedState);
    const hasConcession = academicLedgerState.some((item: any) => Number(item?.totalConcession) > 0)
    if (hasConcession) {
      return columns;
    }
    return columns.filter(item => item.accessor !== 'totalConcession');
  }, [academicLedgerState, transportLedgerState, allAcademicLedgerSelectedState, jodoCredOptedState]);
  const academicLedgerSelected = Array.isArray(payFeeForm.values.academicLedgerIds) ? (payFeeForm.values.academicLedgerIds.length === 0) : true;
  const enablePayNow = !academicLedgerSelected;
  const { totalAmount, fineAmount, concessionAmount } = payFeeForm.values;
  const amountToPay = Number(totalAmount) + Number(fineAmount) - Number(concessionAmount);
  const studentDetails: any = parentChildrensResp?.find((i: any) => +i?.childId === +currentStudentId);
  return (
    <>
      <div className="card-header">
        <div className="row">
          {jodoCredOptedState && <div className="col-12 mb-3">
            <div className="bg-primary px-3 py-2 text-white rounded">
              Cred/Flex payment has been opted for the student. Fees will be Auto paid as per schedule.
            </div>
          </div>}
          <div className="col-12">
            <h4 className="card-title mb-0 flex-grow-1">
              Academic Year - {studentDetails?.academicYearName} Outstanding Amount (as on {getDateMonthYearFormat(new Date())}) : {getDisplayAmountValue(payFeeForm.values.totalOutstandingAmount)}
            </h4>
          </div>

        </div>
      </div>
      <div className="card-body">
        <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px 16px 12px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "20px" }}>
          <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>
            Academics Fee</p>
          <TableContainer
            columns={academicLedgerColumns}
            data={academicLedgerState || []}
            divClass="table-responsive mb-0"
            theadClass="table-light text-muted align-middle"
            showPagination={false}
          />
        </div>
        {!jodoCredOptedState && <form onSubmit={payFeeForm.handleSubmit}>
          <div className="col-12 col-md-6 col-lg-5 ms-auto">
            <div className="row d-flex align-items-center mb-2">
              <div className="col p-0">
                <h6 className="m-0">Total Actual Amount</h6>
              </div>
              <div className="col">
                <TextInputGroup
                  name="totalAmount"
                  formgroupClassName="mb-0"
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

            <div className="row d-flex align-items-center mb-2">
              <div className="col p-0">
                <h6 className="m-0">Fine Amount</h6>
              </div>
              <div className="col">
                <TextInputGroup
                  name="fineAmount"
                  formgroupClassName="mb-0"
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
            {showTotalConcession && <>
              <div className="row d-flex align-items-center mb-2">
                <div className="col p-0">
                  <h6 className="m-0">Total Concession Amount</h6>
                </div>
                <div className="col">
                  <TextInputGroup
                    name="concessionAmount"
                    formgroupClassName="mb-0"
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
              <div className="row d-flex align-items-center mb-2">
                <div className="col p-0">
                  <h6 className="m-0">Concession Percentage</h6>
                </div>
                <div className="col">
                  <TextInputGroup
                    name="cocessionPercentage"
                    formgroupClassName="mb-0"
                    inputgroupClassName="input-group-sm"
                    inputClassName="form-control-sm"
                    inputGroupStart={true}
                    value={payFeeForm.values.concessionPercentage || "0"}
                    onChange={undefined}
                    isDisabled={true}
                  >
                    <span className="fw-bold">%</span>
                  </TextInputGroup>
                </div>
              </div>
            </>}
            <div className="row d-flex align-items-center mt-3 mb-2 pt-3" style={{ borderTop: "2px dashed #CFCFCF" }}>
              <div className="col p-0">
                <h6 className="m-0">Paying Amount</h6>
              </div>
              <div className="col">
                <TextInputGroup
                  name="payingAmount"
                  formgroupClassName={"mb-0"}
                  inputgroupClassName="input-group-sm"
                  inputClassName="form-control-sm"
                  value={getDisplayAmountValue(amountToPay)}
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
              className="btn btn-success d-flex align-items-center justify-content-center">
              Pay Through Jodo
            </button>}
            {isCcAvenueEnabled && <button
              type="button"
              onClick={handleCcAvenuePayment}
              data-id="ccAvenue"
              disabled={!enablePayNow || showApiLoader}
              className="btn btn-success d-flex align-items-center justify-content-center ">
              Pay Through Kotak
            </button>}
            {isEasyBuzzEnabled && <button
              type="button"
              onClick={easeBuzzPaymentHandler}
              data-id="eazeBuzz"
              disabled={!enablePayNow || showApiLoader}
              className="btn btn-success d-flex align-items-center justify-content-center ">
              Pay Through Easebuzz
            </button>}
          </div>
        </form>}
      </div>
      <form id="nonseamless" ref={paymentFormRef} method="post" name="redirect"
        action={paymentInfoState.ccavenueUrl}>
        <input type="hidden" id="encRequest" name="encRequest" value={paymentInfoState.payloadData} />
        <input type="hidden" name="access_code" id="access_code" value={paymentInfoState.accessCode} />
      </form>
    </>
  );
};

export default PayFee;
