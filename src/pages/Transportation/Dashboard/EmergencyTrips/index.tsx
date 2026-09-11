import React from "react";
import { default as RedBigBus } from "../../../../assets/imagesdps/transportation/RedBigBus.svg?react";

const EmergencyTrips = () => {
  return (
    <>
      <div className="card emergency_trips_card">
        <div className="card-body p-4">
          <div className="row align-items-center mb-3">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">Emergency Trips</h4>
            </div>

            <div className="col-auto ms-auto">
              <select className="sort_selection">
                <option value="1">Today</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>

          <div className="d-inline-block w-100">
            <div className="d-flex align-items-center gap-4">
              <div className="emergency_bus_icon">
                <RedBigBus />
              </div>

              <div className="d-flex flex-column">
                <h4 className="fw-normal fs-26">00</h4>
                <span className="mb-0 text-muted fs-13">Vehicle ID</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmergencyTrips;
