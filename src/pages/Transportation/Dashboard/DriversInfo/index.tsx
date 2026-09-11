import React from "react";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";

const Data = [
  {
    name: "Lingam Prkruth",
    vehicleNo: "022",
    route: "ROUTE012",
  },
];

const DriversInfo = () => {
  return (
    <>
      <div className="card drivers_info_card">
        <div className="card-header">
          <div className="row align-items-center">
            <h4 className="card-title mb-0 flex-grow-1">Drivers Info</h4>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="d-flex align-items-center border-bottom p-2">
            <div className="avatar-sm flex-shrink-0 avatar-shadow rounded-circle p-1 me-2">
              <img src={avatar1} className="img-fluid d-block rounded-circle" />
            </div>

            <div className="d-flex flex-column">
              <h4 className="fs-14 mb-0">Lingam Prkruth</h4>
              <span className="mb-0 text-muted fs-12">Vehicle No- 022</span>
              <span className="mb-0 text-muted fs-12">Route - ROUTE012</span>
            </div>
          </div>

          <div className="d-flex align-items-center border-bottom p-3">
            <div className="avatar-sm flex-shrink-0 avatar-shadow rounded-circle p-1 me-2">
              <img src={avatar1} className="img-fluid d-block rounded-circle" />
            </div>

            <div className="d-flex flex-column">
              <h4 className="fs-14 mb-0">Lingam Prkruth</h4>
              <span className="mb-0 text-muted fs-12">Vehicle No- 022</span>
              <span className="mb-0 text-muted fs-12">Route - ROUTE012</span>
            </div>
          </div>

          <div className="d-flex align-items-center border-bottom p-2">
            <div className="avatar-sm flex-shrink-0 avatar-shadow rounded-circle p-1 me-2">
              <img src={avatar1} className="img-fluid d-block rounded-circle" />
            </div>

            <div className="d-flex flex-column">
              <h4 className="fs-14 mb-0">Lingam Prkruth</h4>
              <span className="mb-0 text-muted fs-12">Vehicle No- 022</span>
              <span className="mb-0 text-muted fs-12">Route - ROUTE012</span>
            </div>
          </div>

          <div className="d-flex align-items-center border-bottom p-2">
            <div className="avatar-sm flex-shrink-0 avatar-shadow rounded-circle p-1 me-2">
              <img src={avatar1} className="img-fluid d-block rounded-circle" />
            </div>

            <div className="d-flex flex-column">
              <h4 className="fs-14 mb-0">Lingam Prkruth</h4>
              <span className="mb-0 text-muted fs-12">Vehicle No- 022</span>
              <span className="mb-0 text-muted fs-12">Route - ROUTE012</span>
            </div>
          </div>
        </div>

        <div className="p-2"></div>
      </div>
    </>
  );
};

export default DriversInfo;
