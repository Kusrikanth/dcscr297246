import React, { useMemo } from "react";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import {
  UserDetails,
} from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
// import StudentDetails from "../StudentLedger/StudentDetails";

import {
  StudentConcessionModalData,
  StudentConcessionModalProps,
} from "./tutionFeesConcessionTypes";

const ViewConcessions = (props: StudentConcessionModalProps) => {
  const data = [
    {
      header: "Class",
      value: "VII",
    },
    {
      header: "Section",
      value: "A",
    },
  ];
  const data1 = [
    {
      header: "Email",
      value: "Superadmin@gmail.com",
    },
    {
      header: "Phone No",
      value: "+91 9851236545",
    },
  ];

  function generateColumns() {
    return [
      {
        Header: "Academic Year",
        accessor: "academicYear",
      },
      {
        Header: "Fee Details",
        accessor: "feeDetails",
      },
      {
        Header: "Assigned Fee",
        accessor: "assignedFee",
        Cell: ({ row: { original } }: any) => {
          return (
            <div className="d-flex align-items-center">
              <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              <span>{original?.assignedFee}</span>
            </div>
          );
        },
      },
      {
        Header: "Concession Amount",
        accessor: "concessionAmount",
        Cell: ({ row: { original } }: any) => {
          return (
            <div className="d-flex align-items-center">
              <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              <span>{original?.concessionAmount}</span>
            </div>
          );
        },
      },
      {
        Header: "Concession Type",
        accessor: "concessionType",
      },
      {
        Header: "Amount to Pay",
        accessor: "amounttoPay",
        Cell: ({ row: { original } }: any) => {
          return (
            <div className="d-flex align-items-center">
              <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              <span>{original?.amounttoPay}</span>
            </div>
          );
        },
      },
      {
        Header: "Concession Remarks",
        accessor: "concessionRemarks",
      },
    ];
  }

  const StudentConcessionModalData: Array<StudentConcessionModalData> = [
    {
      id: 1,
      academicYear: "2022-23",
      feeDetails: "Term Tuition Fee - Term I",
      assignedFee: 46000,
      concessionAmount: 10000,
      concessionType: "Sibling",
      amounttoPay: 36000,
      concessionRemarks: "-",
    },
    {
      id: 2,
      academicYear: "2022-23",
      feeDetails: "Term Tuition Fee - Term I",
      assignedFee: 46000,
      concessionAmount: 10000,
      concessionType: "Sibling",
      amounttoPay: 36000,
      concessionRemarks: "-",
    },
    {
      id: 3,
      academicYear: "2022-23",
      feeDetails: "Term Tuition Fee - Term I",
      assignedFee: 46000,
      concessionAmount: 10000,
      concessionType: "Sibling",
      amounttoPay: 36000,
      concessionRemarks: "-",
    },
  ];
  const roleColumns = useMemo(() => generateColumns(), []);
  return (
    <>
    
        <div className="d-flex flex-column align-items-center">
          <div className="w-100 p-4">
            <div className="row">
              <div className="col-3">
                <div className="d-inline-block">
                  <UserDetails
                    displayName={"Lingam Prkruth"}
                    displayId={"NHS000001"}
                    size={"md"}
                    contentNotCenter={true}
                    paddingTop={"p-2"}
                    defaultImgType="student"
                  />
                </div>
              </div>
              {/* <div className="row"> */}
              <div className="col-2 p-2">
                {data &&
                  data.map((d, index) => {
                    return (
                      <div key={`viewconcession-${index}`} className="row">
                        <div className="col">
                          <h6>
                            <span className="fw-bold">{d.header}:</span>
                          </h6>
                        </div>
                        <div className="col">
                          <h6>
                            <span className="fw-bold text-muted">
                              {d.value}
                            </span>
                          </h6>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="col-6 p-2">
                {data1 &&
                  data1.map((d, index) => {
                    return (
                      <div key={`viewconcession-${index}`} className="row">
                        <div className="col-3">
                          <h6>
                            <span className="fw-bold">{d.header}:</span>
                          </h6>
                        </div>
                        <div className="col-auto">
                          <h6>
                            <span className="fw-bold text-muted">
                              {d.value}
                            </span>
                          </h6>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="w-100">
            <TableContainer
              columns={roleColumns || []}
              data={StudentConcessionModalData}
              divClass="table-responsive mb-1"
              theadClass="table-light text-muted align-middle"
            />
          </div>
        </div>
      
    </>
  );
};

export default ViewConcessions;
