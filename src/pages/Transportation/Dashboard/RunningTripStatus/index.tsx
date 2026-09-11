import React from "react";
import { Progress } from "reactstrap";
import { default as BusWithMap } from "../../../../assets/imagesdps/transportation/BusWithMap.svg?react";

const RunningTripStatus = () => {
  return (
    <div className="d-flex flex-column mb-4">
      <div className="d-inline-block w-100 running_trip_text_warp px-3 pt-3">
        <div className="row align-items-start">
          <div className="col-6">
            <h4 className="card-title mb-0 flex-grow-1 fs-15 fw-normal">
              Running Trip Status
            </h4>
          </div>

          <div className="col-auto ms-auto">
            <div className="d-inline-block">
              <BusWithMap />
            </div>
          </div>
        </div>
      </div>

      <div className="d-inline-block w-100 p-3 running_trip_progress_warp">
        <div className="d-flex flex-column mb-2">
          <h5 className="fs-15 mb-0">On Time</h5>

          <div className="d-flex gap-3">
            <Progress
              className="my-2 w-100"
              value="50"
              color="success"
              // style={{ width: "100%" }}
            ></Progress>

            <div className="d-flex gap-2 running_progress_value_text_wrap">
              <span className="fs-15">10</span>
              <span className="fs-15">/</span>
              <span className="text-success fs-15">20</span>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column">
          <h5 className="fs-15 mb-0">Delay</h5>

          <div className="d-flex gap-3">
            <Progress
              className="my-2 w-100"
              value="50"
              color="danger"
              // style={{ width: "100%" }}
            ></Progress>

            <div className="d-flex gap-2 running_progress_value_text_wrap">
              <span className="fs-15">10</span>
              <span className="fs-15">/</span>
              <span className="text-success fs-15">20</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunningTripStatus;
