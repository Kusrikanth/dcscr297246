import React from "react";
import { Props } from "..";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";

const StudentFeeDetails = ({ StudentData }: Props) => {
  return (
    <>
      <div className="row border border-success h-100 px-4 py-3">
        <div className="col-12 col-sm-1"></div>
        <div className="col-12 col-sm-6 pt-4">
          <div className="row mb-3">
            <div className="col">
              <h6>
                <span className="fw-normal fs-14 text-gray">
                  Total Fee for Year:
                </span>
              </h6>
              <h6 className="d-flex align-items-baseline">
                <RupeeSvg width="11px" height="11px" fill="#405189" />
                <span className="fs-14 total_fee_year">
                  {StudentData?.totalFeeYear}
                </span>
              </h6>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <h6>
                <span className="fw-normal fs-14 text-gray">
                  Total Concession:
                </span>
              </h6>
              <h6 className="d-flex align-items-baseline">
                <RupeeSvg width="11px" height="11px" fill="#FFC132" />
                <span className="fw-bold fs-14 total_concession">
                  {StudentData?.totalConcession}
                </span>
              </h6>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-4 pt-4">
          <div className="row mb-3">
            <div className="col p-0">
              <h6>
                <span className="fw-normal fs-14 text-gray">
                  Total Fee Paid :
                </span>
              </h6>
              <h6 className="d-flex align-items-baseline">
                <RupeeSvg width="11px" height="11px" fill="#0AB39C" />
                <span className="fs-14 total_fee_paid">
                  {StudentData?.totalFeePaid}
                </span>
              </h6>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col p-0">
              <h6>
                <span className="fw-normal fs-14 text-gray">
                  Total Amount Due:
                </span>
              </h6>
              <h6 className="d-flex align-items-baseline">
                <RupeeSvg width="11px" height="11px" fill="#F3644D" />
                <span className="fw-bold fs-14 balance_to_pay">
                  {StudentData?.totalAmountDue}
                </span>
              </h6>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-1"></div>
      </div>
    </>
  );
};

export default StudentFeeDetails;
