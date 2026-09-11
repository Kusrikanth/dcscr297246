import React, { useEffect } from "react";
import FeeReceived from "../../../assets/imagesdps/feeDashboard/FeeReceived.png";
import FeeOnline from "../../../assets/imagesdps/feeDashboard/FeeOnline.png";
import FeeCheques from "../../../assets/imagesdps/feeDashboard/FeeCheques.png";
import FeeCash from "../../../assets/imagesdps/feeDashboard/FeeCash.png";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import FundFlow from "./FundFlow";
import PaymentMode from "./PaymentMode";
import FeeCards from "./FeeCards";
import CommonCard from "./CommonCard";
import FeeCollection from "./FeeCollection";
import FeeArea from "./FeeAreaChart";
import ConcessionType from "./ConcessionType";
import TransationSummary from "./TransationSummary";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import FeeSummaryTables from "./FeeSummaryTables";
import JodoFlexCredCount from "./JodoFlexCredCount";

const Data = [
  {
    label: "FEE RECEIVED",
    imgUrl: FeeReceived,
    price: "51,245.00",
  },
  {
    label: "CASH",
    imgUrl: FeeCash,
    price: "32.89k",
  },
  {
    label: "CHEQUES",
    imgUrl: FeeCheques,
    price: "1,596.5",
  },
  {
    label: "DD",
    imgUrl: FeeCheques,
    price: "2,659",
  },
  {
    label: "ONLINE",
    imgUrl: FeeOnline,
    price: "2,659",
  },
];

const FeeDashBoard = () => {

  const {
    feeReportErrorResp  } =
    useAppSelector(({ feeReport }) => ({
      feeReportErrorResp: feeReport.feeReportErrorResp,
    }), shallowEqual);

    const feeDashboardRef = React.useRef({
      prevFeeReportErrorResp : feeReportErrorResp,
    });

    useEffect(() => {
      const { prevFeeReportErrorResp } = feeDashboardRef.current;

      if (feeReportErrorResp && prevFeeReportErrorResp !== feeReportErrorResp) {
          const { details } = feeReportErrorResp || {}
          toast.error(details || "Something went wrong");
      }

      feeDashboardRef.current.prevFeeReportErrorResp = feeReportErrorResp;
    }, [feeReportErrorResp])
    
  return (
    <>
      <div className="page-content fee-dashboard-wrapper">
        <div className="tw-mx-auto tw-px-4">
          <BreadCrumb title="Dashboard" pageTitle="Fee" />
          <div>
            <CommonCard />
            <JodoFlexCredCount />

            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
              <div className="tw-col-span-12 xl:tw-col-span-6 tw-grid">
                <FeeCards />
              </div>

              <div className="tw-col-span-12 xl:tw-col-span-6 tw-grid">
                <FeeCollection />
              </div>

              <div className="tw-col-span-12">
                <TransationSummary />
              </div>

              <div className="tw-col-span-12 xl:tw-col-span-6 tw-mb-4">
                <PaymentMode />
              </div>

              <div className="tw-col-span-12 xl:tw-col-span-6 tw-mb-4">
                <ConcessionType />
              </div>

              <div className="tw-col-span-12">
                <FundFlow />
              </div>

              <div className="tw-col-span-12">
                <FeeSummaryTables />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeeDashBoard;
