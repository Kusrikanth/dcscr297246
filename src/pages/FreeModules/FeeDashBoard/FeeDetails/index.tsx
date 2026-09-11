import React from "react";
import { default as RepayRupeesSvg } from "../../../../assets/imagesdps/feeDashboard/RepayRupeesSvg.svg?react";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { default as ScholerSvg } from "../../../../assets/imagesdps/feeDashboard/ScholerSvg.svg?react";

const FeeDetails = () => {
  return (
    <div className="tw-card">
      <div className="tw-card-body tw-p-4">
        <div className="tw-grid tw-grid-cols-12 tw-gap-3">
          <div className="tw-col-span-12 md:tw-col-span-6 tw-flex tw-items-center">
            <span className="icon_span edu me-4">
              <ScholerSvg />
            </span>

            <div>
              <p className="tw-mb-2 tw-text-gray-500 tw-text-sm">Total Concession</p>
              <p
                className="tw-mb-0 tw-text-base tw-font-normal tw-flex tw-items-baseline"
                style={{
                  fontFamily: "Poppins",
                }}
              >
                <RupeeSvg width="8px" height="12px" fill={"#495057"} /> 32.89k
              </p>
            </div>
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6 tw-flex tw-items-center">
            <span className="icon_span repay me-4">
              <RepayRupeesSvg />
            </span>

            <div>
              <p className="tw-mb-2 tw-text-gray-500 tw-text-sm">Total Refunded</p>
              <p
                className="tw-mb-0 tw-text-base tw-font-normal tw-flex tw-items-baseline"
                style={{
                  fontFamily: "Poppins",
                }}
              >
                <RupeeSvg width="8px" height="12px" fill={"#495057"} /> 32.89k
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDetails;
