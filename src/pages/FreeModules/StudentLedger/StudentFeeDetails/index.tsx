import React from "react";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";

const StudentFeeDetails = () => {
  return (
    <>
      <div className="row border border-success h-100 px-4 pt-4 pb-3">
        <div className="col-12 col-sm-6">
          <div className="row mb-3">
            <div className="col">
              <h6>
                <span className="fw-bold text-muted fs-16">
                  Total Fee for Year:
                </span>
              </h6>
            </div>
            <div className="col">
              <h6 className="d-flex align-items-baseline">
                <RupeeSvg width="11px" height="11px" fill="#405189" />
                <span className="fw-bold fs-16 total_fee_year">
                  2,11,040.00
                </span>
              </h6>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col">
              <h6>
                <span className="fw-bold text-muted fs-16">
                  Total Concession:
                </span>
              </h6>
            </div>
            <div className="col">
              <h6 className="d-flex align-items-baseline">
                <RupeeSvg width="11px" height="11px" fill="#FFC132" />
                <span className="fw-bold fs-16 total_concession">00.00</span>
              </h6>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6">
          <div className="row mb-3">
            <div className="col p-0">
              <h6>
                <span className="fw-bold text-muted fs-16">
                  Total Fee Paid :
                </span>
              </h6>
            </div>
            <div className="col">
              <h6 className="d-flex align-items-baseline">
                <RupeeSvg width="11px" height="11px" fill="#0AB39C" />
                <span className="fw-bold fs-16 total_fee_paid">
                  1,20,080.00
                </span>
              </h6>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col p-0">
              <h6>
                <span className="fw-bold text-muted fs-16">
                  Total Amount Due as on:
                </span>
              </h6>

              <h6>
                <span className="fw-bold text-muted fs-16">
                  12-07-2022 (2022-23)
                </span>
              </h6>
            </div>
            <div className="col">
              <h6 className="d-flex align-items-baseline">
                <RupeeSvg width="11px" height="11px" fill="#F3644D" />
                <span className="fw-bold fs-16 balance_to_pay">11600.00</span>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentFeeDetails;
