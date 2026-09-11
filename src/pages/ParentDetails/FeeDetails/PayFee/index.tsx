import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  generateColumns, generateTransportationColumns, validateLedgersForPayment
} from "./helper";
import { useFormik } from "formik";
import * as Yup from "yup";
import { shallowEqual, useDispatch } from "react-redux";

import { toast } from "react-toastify";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { TextInputGroup } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { getDateMonthYearFormat } from "../../../../utility/dateutility";
import { feeLedgersConcessionAct, feePaymentAct, getPayFeeDetailsAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { createJodoOrder } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { setFeeLedgersConcessionAct } from "../../../../store/fee/feecollections/feecollectionsslice";
import { instituteCodeOptions, PaymentGatewayTypes } from "../../../../Components/constants/common";
import { getPaymentGatewaysBranchListAct } from "../../../../store/mastersettings/feesettings/feesettingsactions";
import Button from "../../../../Components/Common/Button";

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
  academicLedgerIds: [],
  transportLedgerIds: []
};

const PayFee = () => {
  const dispatch = useDispatch();
  const [allAcademicLedgerSelectedState, setAllAcademicLedgerSelectedState] = useState(false);
  const [allTransportLedgerSelectedState, setAllTransportLedgerSelectedState] = useState(false);
  const [academicLedgerState, setAcademicLedgerState] = useState([]);
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
    feeLedgersConcessionResp,
    feePaymentResp, showApiLoader,
    getPaymentGatewaysBranchListResp,
    getPayFeeDetailsResp }: any =
    useAppSelector(
      ({ appData, applicationSale, instFeeSettings, directoryStudent, globalData, feeCollections }) => ({
        currentInstIdResp: appData.currentInstIdResp,
        getPayFeeDetailsResp: feeCollections.getPayFeeDetailsResp,
        feeLedgersConcessionResp: feeCollections.feeLedgersConcessionResp,
        currentStudentId: appData.currentStudentId,
        showApiLoader: globalData.showApiLoader,
        createJodoOrderResp: applicationSale.createJodoOrderResp,
        parentChildrensResp: directoryStudent.parentChildrensResp,
        getPaymentGatewaysBranchListResp:
          instFeeSettings.getPaymentGatewaysBranchListResp,
        feePaymentResp: feeCollections.feePaymentResp,
      }),
      shallowEqual
    );

  const payFeeRespRef = useRef({
    prevFeePaymentResp: feePaymentResp,
    prevCreateJodoOrderResp: createJodoOrderResp,
    prevFeeLedgersConcessionResp: feeLedgersConcessionResp,
  });

  useEffect(() => {
    const { prevCreateJodoOrderResp, prevFeeLedgersConcessionResp,
      prevFeePaymentResp } = payFeeRespRef.current;
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
            // amount: import.meta.env.VITE_ENVIRONMENT === "dev" ? "1.0" : (Number(totalAmount) + Number(fineAmount) - Number(concessionAmount)),
            amount: Number(totalAmount) + Number(fineAmount) - Number(concessionAmount),
            identifier: {
              type: "STUDENT_CODE",
              value: studentDetails?.childCode,
              studentId: studentDetails?.childId
            },
            mobileNumber: studentDetails?.smsPriorityNo,
            email: studentDetails?.emailId,
            studentName: studentDetails?.childName?.trim(),
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
    }
    payFeeRespRef.current.prevCreateJodoOrderResp = createJodoOrderResp;
    payFeeRespRef.current.prevFeeLedgersConcessionResp = feeLedgersConcessionResp;
    payFeeRespRef.current.prevFeePaymentResp = feePaymentResp;
  }, [createJodoOrderResp, feeLedgersConcessionResp,
    feePaymentResp,
    parentChildrensResp, currentStudentId]);

  useEffect(() => {
    if (getPayFeeDetailsResp) {
      const { jodoOptedStatus } = getPayFeeDetailsResp,
        isJodoCredOpted = jodoOptedStatus === "CRED_OPTED" || jodoOptedStatus === "FLEX_OPTED";
      const academicFeeList = getPayFeeDetailsResp?.ledgers?.filter((i: any) => (
        !i?.feeDetails.includes("TRANSPORT") &&
        (i?.paymentStatus === "Unpaid" || i?.paymentStatus === "Partially paid")))
        .map((i: any, index: number) => {
          return { ...i, isEnabled: (index === 0 && !isJodoCredOpted) ? true : false, isChecked: false };
        });
      const transportFeeList = getPayFeeDetailsResp?.ledgers?.filter((i: any) => (
        i?.feeDetails.includes("TRANSPORT") &&
        (i?.paymentStatus === "Unpaid" || i?.paymentStatus === "Partially paid")))
        .map((i: any, index: number) => {
          return { ...i, isEnabled: (index === 0 && !isJodoCredOpted) ? true : false, isChecked: false };
        });
      const { totalAmount, hasConcession } = [...academicFeeList, ...transportFeeList].reduce(
        (acc, item: any) => {
          const amount = (+item?.amountToBePaid || 0) + (+item?.fineAmount || 0);
          acc.totalAmount += amount;

          if (!acc.hasConcession && +item?.totalConcession > 0) {
            acc.hasConcession = true;
          }

          return acc;
        },
        { totalAmount: 0, hasConcession: false }
      );
      setShowTotalConcession(hasConcession);
      setAcademicLedgerState(academicFeeList);
      setTransportLedgerState(transportFeeList);
      payFeeForm.setValues(prevValue => ({
        ...prevValue,
        fineAmount: 0,
        totalAmount: 0,
        concessionAmount: 0,
        concessionPercentage: 0,
        ledgerIds: [],
        academicLedgerIds: [],
        transportLedgerIds: [],
        totalOutstandingAmount: totalAmount,
      }), false);
      setJodoCredOptedState(isJodoCredOpted);
      // Resetting state
      setAllAcademicLedgerSelectedState(false);
      setAllTransportLedgerSelectedState(false);
      setPaymentInfoState({
        ccavenueUrl: "",
        payloadData: "",
        accessCode: "",
      });
    }
  }, [getPayFeeDetailsResp])

  const payFeeForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { academicLedgerIds, transportLedgerIds } = values;
      const ledgersIdSelected: any = [...academicLedgerIds, ...transportLedgerIds];
      const { ledgers } = getPayFeeDetailsResp;
      // const { isValid, message } = validateLedgersForPayment(ledgers, academicLedgerIds, transportLedgerIds);
      // if (!isValid) {
      //   toast.error(`Select ${message} to proceed for payment.`);
      //   return;
      // }
      const ledgerIds = ledgers.filter((item: any) => {
        return ledgersIdSelected.includes(item?.id)
      }).map((item: any) => ({
        ledgerId: item.id,
        feeAmount: item.amountToPay,
        fineAmount: item.fineAmount,
        concessionAmount: 0
      }));
      // let paymentType = "";
      // if (academicLedgerIds.length > 0 && transportLedgerIds.length > 0) {
      //   paymentType = "ACADEMIC_FEE_TRANSPORTATION_FEE";
      // } else if (academicLedgerIds.length > 0) {
      //   paymentType = "ACADEMIC_FEE";
      // } else if (transportLedgerIds.length > 0) {
      //   paymentType = "TRANSPORT_FEE";
      // }
      // if (!paymentType) {
      //   toast.error("Payment type is required.");
      //   return;
      // }
      const studentDetails: any = parentChildrensResp?.find((i: any) => +i?.childId === +currentStudentId);
      const payload: any = {
        branchId: studentDetails?.childBranchId,
        academicYearId: studentDetails?.academicYearId,
        curriculumId: studentDetails?.curriculumId,
        classId: studentDetails?.classId,
        name: studentDetails?.childName,
        phone: studentDetails?.smsPriorityNo,
        email: studentDetails?.emailId,
        paymentType: "ACADEMIC_FEE",
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
            // fineAmount: Number(values.fineAmount),
            // concessionAmount: (+values.concessionAmount),
            // amount: import.meta.env.VITE_ENVIRONMENT === "dev" ? "1.0" : (+values.payingAmount)
            // totalActualAmount: Number(values.totalAmount) + Number(values.fineAmount) - Number(values.concessionAmount)
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
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );

    return () => {
      dispatch(setFeeLedgersConcessionAct(undefined));
    }
  }, []);

  const checkAndApplyFullConcession = (updatedAcademic: any[], updatedTransport: any[]) => {
    const hasAcademic = updatedAcademic.length > 0;
    const hasTransport = updatedTransport.length > 0;

    const academicAllChecked =
      hasAcademic && updatedAcademic.every((item) => item.isChecked);

    const transportAllChecked =
      hasTransport && updatedTransport.every((item) => item.isChecked);

    let shouldApplyConcession = false;
    if (hasAcademic && !hasTransport && academicAllChecked) {
      shouldApplyConcession = true;
    }
    if (hasAcademic && hasTransport && academicAllChecked && transportAllChecked) {
      shouldApplyConcession = true;
    }
    if (shouldApplyConcession) {
      const allLedgerIds = [
        ...updatedAcademic.map((i) => i.id),
        ...updatedTransport.map((i) => i.id),
      ];

      dispatch(
        feeLedgersConcessionAct(
          generateActionPayload("feeledger_concession", undefined, {
            isFullConcessionApply: true,
            ledgerIds: allLedgerIds,
          })
        )
      );
    } else {
      setShowTotalConcession(false);

      payFeeForm.setFieldValue("concessionAmount", 0);
      payFeeForm.setFieldValue("concessionPercentage", 0);
    }
  };

  const singleAcademicLedgerCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget,
      id = event.currentTarget.getAttribute("data-id"),
      ledgerRowIndex = academicLedgerState?.findIndex((item: any) => +item.id === Number(id));
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
      [...updatedFeeDetails, ...transportLedgerState]?.forEach((i: any) => {
        if (i?.isChecked) {
          payingAmount += (+i?.amountToBePaid || 0)
          fineAmount += (+i?.fineAmount || 0)
        }
      })
      const selectedLedgersIds = updatedFeeDetails?.filter((item: any) => item.isChecked).map((item: any) => item.id);
      // if (updatedFeeDetails?.every((item: any) => item.isChecked)) {
      //   const payload = { isFullConcessionApply: true, ledgerIds: selectedLedgersIds };
      //   dispatch(feeLedgersConcessionAct(generateActionPayload("feeledger_concession", undefined, payload)));
      // }
      payFeeForm.setValues((prev) => ({
        ...prev,
        academicLedgerIds: selectedLedgersIds,
        totalAmount: payingAmount,
        fineAmount,
        concessionAmount: 0,
        concessionPercentage: 0
      }))
      setAcademicLedgerState(updatedFeeDetails);
      checkAndApplyFullConcession(updatedFeeDetails, transportLedgerState);
    }
  }, [academicLedgerState, transportLedgerState]);

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
      checkAndApplyFullConcession(updatedFeeDetails, transportLedgerState);
      setAllAcademicLedgerSelectedState(checked);
      let payingAmount = 0, fineAmount = 0;
      [...updatedFeeDetails, ...transportLedgerState]?.forEach((i: any) => {
        if (i?.isChecked) {
          payingAmount += (+i?.amountToBePaid || 0)
          fineAmount += (+i?.fineAmount || 0)
        }
      })
      const selectedLedgersIds = updatedFeeDetails?.filter((item: any) => item.isChecked).map((item: any) => item.id);
      // if (checked && selectedLedgersIds.length > 0) {
      //   const payload = { isFullConcessionApply: true, ledgerIds: selectedLedgersIds };
      //   dispatch(feeLedgersConcessionAct(generateActionPayload("feeledger_concession", undefined, payload)));
      // }
      payFeeForm.setValues((prev: any) => ({
        ...prev,
        academicLedgerIds: selectedLedgersIds,
        totalAmount: payingAmount,
        fineAmount,
        concessionAmount: 0,
        concessionPercentage: "0"
      }))
    }
  }, [academicLedgerState, transportLedgerState]);

  const singleTransportLedgerCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget,
      id = event.currentTarget.getAttribute("data-id"),
      ledgerRowIndex = transportLedgerState?.findIndex((item: any) => +item.id === Number(id));

    if (ledgerRowIndex > -1 && Array.isArray(transportLedgerState)) {
      const updatedFeeDetails: any = transportLedgerState.map((item: any, index: number) => {
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
      setAllTransportLedgerSelectedState(updatedFeeDetails.every((item: any) => item.isChecked));
      let payingAmount = 0, fineAmount = 0;
      [...updatedFeeDetails, ...academicLedgerState]?.forEach((i: any) => {
        if (i?.isChecked) {
          payingAmount += (+i?.amountToBePaid || 0)
          fineAmount += (+i?.fineAmount || 0)
        }
      })
      const selectedLedgersIds = updatedFeeDetails?.filter((item: any) => item.isChecked).map((item: any) => item.id);
      payFeeForm.setValues((prev) => ({
        ...prev,
        transportLedgerIds: selectedLedgersIds,
        totalAmount: payingAmount,
        fineAmount,
      }))
      setTransportLedgerState(updatedFeeDetails);
      checkAndApplyFullConcession(academicLedgerState, updatedFeeDetails);
    }
  }, [transportLedgerState, academicLedgerState]);

  const allTransportLedgerSelectHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget;
    if (Array.isArray(transportLedgerState) && transportLedgerState.length > 0) {
      const updatedFeeDetails: any = transportLedgerState.map((item: any, index: number) => {
        if (checked) {
          return ({ ...item, isEnabled: true, isChecked: true })
        } else {
          return ({ ...item, isEnabled: (index === 0) ? true : false, isChecked: false })
        }
      });
      setTransportLedgerState(updatedFeeDetails);
      checkAndApplyFullConcession(academicLedgerState, updatedFeeDetails);
      setAllTransportLedgerSelectedState(checked);
      let payingAmount = 0, fineAmount = 0;
      [...updatedFeeDetails, ...academicLedgerState]?.forEach((i: any) => {
        if (i?.isChecked) {
          payingAmount += (+i?.amountToBePaid || 0)
          fineAmount += (+i?.fineAmount || 0)
        }
      })
      const selectedLedgersIds = updatedFeeDetails?.filter((item: any) => item.isChecked).map((item: any) => item.id);
      payFeeForm.setValues((prev: any) => ({
        ...prev,
        transportLedgerIds: selectedLedgersIds,
        totalAmount: payingAmount,
        fineAmount,
        concessionAmount: 0,
        concessionPercentage: 0,
      }))
    }
  }, [transportLedgerState, academicLedgerState]);

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
    const columns = generateColumns(singleAcademicLedgerCheckHndlr, allAcademicLedgerSelectHndlr, allAcademicLedgerSelectedState, jodoCredOptedState)
    const hasConcession = academicLedgerState.some((item: any) => Number(item?.totalConcession) > 0)
    if (hasConcession) {
      return columns;
    }
    return columns.filter(item => item.accessor !== 'totalConcession');
  }, [academicLedgerState, transportLedgerState, allAcademicLedgerSelectedState, jodoCredOptedState]);
  const transportLedgerColumns = useMemo(() => {
    const columns = generateTransportationColumns(singleTransportLedgerCheckHndlr, allTransportLedgerSelectHndlr, allTransportLedgerSelectedState, jodoCredOptedState);
    const hasConcession = transportLedgerState.some((item: any) => Number(item?.totalConcession) > 0);
    if (hasConcession) {
      return columns;
    }
    return columns.filter(item => item.accessor !== 'concession');
  }, [transportLedgerState, academicLedgerState, allTransportLedgerSelectedState, jodoCredOptedState]);
  const academicLedgerSelected = Array.isArray(payFeeForm.values.academicLedgerIds) ? (payFeeForm.values.academicLedgerIds.length === 0) : true;
  const transportLedgerSelected = Array.isArray(payFeeForm.values.transportLedgerIds) ? (payFeeForm.values.transportLedgerIds.length === 0) : true;
  const enablePayNow = !academicLedgerSelected || !transportLedgerSelected;
  const { totalAmount, fineAmount, concessionAmount } = payFeeForm.values;
  const amountToPay = Number(totalAmount) + Number(fineAmount) - Number(concessionAmount);
  const studentDetails: any = parentChildrensResp?.find((i: any) => +i?.childId === +currentStudentId);
  return (
    <>
      <div className="tw-border-b tw-px-4 tw-py-3">
        <div className="tw-grid tw-grid-cols-1 tw-gap-3">

          {jodoCredOptedState && (
            <div className="tw-col-span-1">
              <div className="tw-bg-blue-600 tw-px-3 tw-py-2 tw-text-white tw-rounded-md">
                Cred/Flex payment has been opted for the student. Fees will be Auto paid as per schedule.
              </div>
            </div>
          )}

          <div className="tw-col-span-1">
            <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
              Academic Year - {studentDetails?.academicYearName} Outstanding Amount (as on{" "}
              {getDateMonthYearFormat(new Date())}) :{" "}
              {getDisplayAmountValue(payFeeForm.values.totalOutstandingAmount)}
            </h4>
          </div>

        </div>
      </div>
      <div className="tw-p-4">

        {academicLedgerState.length > 0 && (
          <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px 16px 12px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "20px" }}>
            <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>
              Academics Fee
            </p>

            <TableContainer
              columns={academicLedgerColumns}
              data={academicLedgerState}
              divClass="tw-overflow-x-auto tw-mb-0"
              theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
              showPagination={false}
            />
          </div>
        )}

        {transportLedgerState.length > 0 && (
          <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px 16px 12px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "20px" }}>
            <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>
              Transportation Fee
            </p>

            <TableContainer
              columns={transportLedgerColumns}
              data={transportLedgerState || []}
              divClass="tw-overflow-x-auto tw-mb-0"
              theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
              showPagination={false}
            />
          </div>
        )}

        {!jodoCredOptedState && (
          <form onSubmit={payFeeForm.handleSubmit}>

            <div className="tw-w-full md:tw-w-1/2 lg:tw-w-5/12 tw-ml-auto">

              <div className="tw-flex tw-items-center tw-mb-2">
                <div className="tw-flex-1 tw-p-0">
                  <h6 className="tw-m-0">Total Actual Amount</h6>
                </div>
                <div className="tw-flex-1">
                  <TextInputGroup
                    name="totalAmount"
                    formgroupClassName="tw-mb-0"
                    inputgroupClassName="tw-text-sm"
                    inputClassName="tw-text-sm"
                    inputGroupStart={true}
                    value={getDisplayAmountValue(payFeeForm.values.totalAmount)}
                    onChange={undefined}
                    isDisabled={true}
                  >
                    <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                  </TextInputGroup>
                </div>
              </div>

              <div className="tw-flex tw-items-center tw-mb-2">
                <div className="tw-flex-1 tw-p-0">
                  <h6 className="tw-m-0">Fine Amount</h6>
                </div>
                <div className="tw-flex-1">
                  <TextInputGroup
                    name="fineAmount"
                    formgroupClassName="tw-mb-0"
                    inputgroupClassName="tw-text-sm"
                    inputClassName="tw-text-sm"
                    inputGroupStart={true}
                    value={getDisplayAmountValue(payFeeForm.values.fineAmount)}
                    onChange={undefined}
                    isDisabled={true}
                  >
                    <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                  </TextInputGroup>
                </div>
              </div>

              {showTotalConcession && (
                <>
                  <div className="tw-flex tw-items-center tw-mb-2">
                    <div className="tw-flex-1 tw-p-0">
                      <h6 className="tw-m-0">Total Concession Amount</h6>
                    </div>
                    <div className="tw-flex-1">
                      <TextInputGroup
                        name="concessionAmount"
                        formgroupClassName="tw-mb-0"
                        inputgroupClassName="tw-text-sm"
                        inputClassName="tw-text-sm"
                        inputGroupStart={true}
                        value={getDisplayAmountValue(payFeeForm.values.concessionAmount)}
                        onChange={undefined}
                        isDisabled={true}
                      >
                        <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                      </TextInputGroup>
                    </div>
                  </div>

                  <div className="tw-flex tw-items-center tw-mb-2">
                    <div className="tw-flex-1 tw-p-0">
                      <h6 className="tw-m-0">Concession Percentage</h6>
                    </div>
                    <div className="tw-flex-1">
                      <TextInputGroup
                        name="cocessionPercentage"
                        formgroupClassName="tw-mb-0"
                        inputgroupClassName="tw-text-sm"
                        inputClassName="tw-text-sm"
                        inputGroupStart={true}
                        value={payFeeForm.values.concessionPercentage || "0"}
                        onChange={undefined}
                        isDisabled={true}
                      >
                        <span className="tw-font-bold">%</span>
                      </TextInputGroup>
                    </div>
                  </div>
                </>
              )}

              <div className="tw-flex tw-items-center tw-mt-3 tw-mb-2 tw-pt-3 tw-border-t-2 tw-border-dashed tw-border-gray-300">
                <div className="tw-flex-1 tw-p-0">
                  <h6 className="tw-m-0">Paying Amount</h6>
                </div>
                <div className="tw-flex-1">
                  <TextInputGroup
                    name="payingAmount"
                    formgroupClassName="tw-mb-0"
                    inputgroupClassName="tw-text-sm"
                    inputClassName="tw-text-sm"
                    value={getDisplayAmountValue(amountToPay)}
                    onChange={undefined}
                    inputGroupStart={true}
                    isDisabled={true}
                    invalid={
                      payFeeForm.touched.totalAmount &&
                        payFeeForm.errors.totalAmount
                        ? true
                        : false
                    }
                    error={
                      payFeeForm.touched.totalAmount &&
                        payFeeForm.errors.totalAmount
                        ? payFeeForm.errors.totalAmount
                        : ""
                    }
                  >
                    <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                  </TextInputGroup>
                </div>
              </div>
            </div>

            <div className="tw-flex tw-gap-3 tw-items-center tw-justify-center tw-flex-wrap tw-mt-6">

              {isJodoEnabled && (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!enablePayNow || showApiLoader}
                >
                  Pay Through Jodo
                </Button>
              )}

              {isCcAvenueEnabled && (
                <Button
                  type="button"
                  onClick={handleCcAvenuePayment}
                  data-id="ccAvenue"
                  variant="primary"
                  disabled={!enablePayNow || showApiLoader}
                >
                  Pay Through Kotak
                </Button>
              )}

              {isEasyBuzzEnabled && (
                <Button
                  type="button"
                  onClick={easeBuzzPaymentHandler}
                  data-id="eazeBuzz"
                  variant="primary"
                  disabled={!enablePayNow || showApiLoader}
                >
                  Pay Through Easebuzz
                </Button>
              )}

            </div>
          </form>
        )}
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
