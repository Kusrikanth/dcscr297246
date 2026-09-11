import React from "react";
import { UserDetails } from "../UserDetails";
import StudentFeeDetails from "./StudentFeeDetails";

interface PropsTypes {
  class?: string;
  parentName?: string;
  phoneNo?: string;
  section?: string;
  email?: string;
  admissionDate?: string;
  totalFeeYear?: string;
  totalConcession?: string;
  totalFeePaid?: string;
  totalAmountDue?: string;
}

export interface Props {
  StudentData: PropsTypes;
  linkHandler?: () => void;
  showLink?: boolean;
  linkTitle?: string;
}

const StudentDetails = ({
  StudentData,
  linkHandler,
  showLink,
  linkTitle,
}: Props) => {
  return (
    <div>
      <div className="card student_details_wrapper">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-lg-12 col-xl-6">
              <div className="row mb-3">
                <div className="col d-flex">
                  <div className="d-inline-block">
                    <UserDetails
                      displayName={"Lingam Prkruth"}
                      displayId={"NHS000001"}
                      size={"md"}
                      contentNotCenter={true}
                      paddingTop={"pt-2"}
                    />
                  </div>
                  {showLink && (
                    <div onClick={linkHandler}>
                      <p className="text-info pt-2 ps-3 fs-16 text-decoration-underline cursor-pointer">
                        {linkTitle}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="row gy-2">
                <div className="col-12 col-sm-3">
                  <div>
                    <h6 className="fs-14 text-gray fw-normal">Class : </h6>
                    <span className="fs-14 ms-1">{StudentData?.class}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-5">
                  <div>
                    <h6 className="fs-14 text-gray fw-normal">
                      Parent Name :{" "}
                    </h6>
                    <span className="fs-14 ms-1">
                      {StudentData?.parentName}
                    </span>
                  </div>
                </div>

                <div className="col-12 col-sm-4">
                  <div>
                    <h6 className="fs-14 text-gray fw-normal">Phone No : </h6>
                    <span className="fs-14 ms-1">{StudentData?.phoneNo}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-3">
                  <div>
                    <h6 className="fs-14 text-gray fw-normal">Section : </h6>
                    <span className="fs-14 ms-1">{StudentData?.section}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-5">
                  <div>
                    <h6 className="fs-14 text-gray fw-normal">Email : </h6>
                    <span className="fs-14 ms-1">{StudentData?.email}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-4">
                  <div>
                    <h6 className="fs-14 text-gray fw-normal">
                      Admission Date :{" "}
                    </h6>
                    <span className="fs-14 ms-1">
                      {StudentData?.admissionDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12 col-xl-6">
              <StudentFeeDetails StudentData={StudentData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
