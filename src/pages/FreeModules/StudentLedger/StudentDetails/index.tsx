import React from "react";
import { UserDetails } from "../../../../Components/Common";
import StudentFeeDetails from "../StudentFeeDetails";

const StudentDetails = () => {
  return (
    <>
      <div className="card">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-lg-12 col-xl-6">
              <div className="row mb-3">
                <div className="col">
                  <div className="d-inline-block">
                    <UserDetails
                      displayName={"Lingam Prkruth"}
                      displayId={"NHS000001"}
                      size={"md"}
                      contentNotCenter={true}
                      paddingTop={"pt-2"}
                    />
                  </div>
                </div>
              </div>

              <div className="row gy-2">
                <div className="col-12 col-sm-3">
                  <div className="d-flex align-items-baseline flex-wrap">
                    <h6 className="fs-16">Class : </h6>
                    <span className="fs-16 text-muted ms-1">VII</span>
                  </div>
                </div>

                <div className="col-12 col-sm-5">
                  <div className="d-flex align-items-baseline flex-wrap">
                    <h6 className="fs-16 text-muted">Parent Name : </h6>
                    <span className="fs-16 ms-1">L.Krishna</span>
                  </div>
                </div>

                <div className="col-12 col-sm-4">
                  <div className="d-flex align-items-baseline flex-wrap">
                    <h6 className="fs-16 text-muted">Phone No : </h6>
                    <span className="fs-16 ms-1">+91 9851236545</span>
                  </div>
                </div>

                <div className="col-12 col-sm-3">
                  <div className="d-flex align-items-baseline flex-wrap">
                    <h6 className="fs-16">Section : </h6>
                    <span className="fs-16 text-muted ms-1">VII A</span>
                  </div>
                </div>

                <div className="col-12 col-sm-5">
                  <div className="d-flex align-items-baseline flex-wrap">
                    <h6 className="fs-16 text-muted">Email : </h6>
                    <span className="fs-16 ms-1">superadmin@gmail.com</span>
                  </div>
                </div>

                <div className="col-12 col-sm-4">
                  <div className="d-flex align-items-baseline flex-wrap">
                    <h6 className="fs-16 text-muted">Admission Date : </h6>
                    <span className="fs-16 ms-1">02 April,2021</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12 col-xl-6">
              <StudentFeeDetails />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetails;
