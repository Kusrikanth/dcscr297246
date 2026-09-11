import React from "react";

interface Props {
  tripType: string;
  tripTypeValue: string;
  busImageBg: string;
  busImage: any;
}

const OnOffTripVehicle = ({
  tripType,
  tripTypeValue,
  busImage,
  busImageBg,
}: Props) => {
  return (
    <>
      <div className="card on_off_trip_vehicle_card">
        <div className="card-body p-3">
          <div className="row align-items-start mb-1">
            <div className="col-6">
              <h4 className="card-title fs-13 mb-0 flex-grow-1 text-nowrap">
                Vehicle Status
              </h4>
            </div>

            <div className="col-auto ms-auto">
              <div
                className="on_trip_vehicle_bus"
                style={{ backgroundColor: `${busImageBg}` }}
              >
                {busImage}
              </div>
            </div>
          </div>

          <div className="d-flex flex-column">
            <h4 className="fw-normal fs-26">{tripTypeValue}</h4>
            <span className="mb-0 text-muted fs-18">{tripType}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OnOffTripVehicle;
