import React from "react";

interface Props {
  studentInNumber: string;
  studentType: string;
  studentInPercentage: string;
  studentImage: any;
  studentImageBg: string;
}

const Attendance = ({
  studentInNumber,
  studentType,
  studentInPercentage,
  studentImage,
  studentImageBg,
}: Props) => {
  return (
    <>
      <div className="card attendance_card">
        <div className="card-body p-3">
          <div className="row align-items-start mb-3">
            <div className="col-6">
              <h4 className="card-title fs-13 mb-0 flex-grow-1 text-nowrap">
                Attendance
              </h4>
            </div>

            <div className="col-6">
              <div className="d-flex justify-content-end">
                <select className="sort_selection">
                  <option value="1">Today</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </select>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column">
              <h4 className="fw-normal fs-26 mb-1">{studentInNumber}</h4>
              <span className="fs-13 fw-normal text-muted mb-1">
                {studentType}
              </span>
              <span className="fs-10 fw-bold p-1 text-success attendance_in_percentage">
                {`${studentInPercentage} % of the Students`}
              </span>
            </div>

            <div
              className="on_trip_vehicle_bus"
              style={{ backgroundColor: `${studentImageBg}` }}
            >
              {studentImage}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attendance;
