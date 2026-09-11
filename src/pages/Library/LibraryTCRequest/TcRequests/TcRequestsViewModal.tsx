import React, { useMemo } from "react";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import {
  UserDetails,
} from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  LibraryTCRequestModals2DataProps,
  LibraryTCRequestModals2Props,
} from "../LibraryTCRequestTpes";

const TcRequestsViewModal = (props: LibraryTCRequestModals2Props) => {
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
      value: "mailto:superadmin@gmail.com",
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
        disableSortBy:true,
      },
      {
        Header: "Class",
        accessor: "class",
        disableSortBy:true,
      },
      {
        Header: "Fee Details",
        accessor: "feeDetails",
        disableSortBy:true,
      },
      {
        Header: "Amount to Pay",
        accessor: "amounttoPay",
        disableSortBy:true,
        Cell: ({ row: { original } }: any) => {
          return (
            <div className="tw-flex tw-items-center">
              <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              <span>{original?.amounttoPay}</span>
            </div>
          );
        },
      },
      {
        Header: "Paid Amount",
        accessor: "paidAmount",
        disableSortBy:true,
        Cell: ({ row: { original } }: any) => {
          return (
            <div className="tw-flex tw-items-center">
              <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              <span>{original?.amounttoPay}</span>
            </div>
          );
        },
      },
      {
        Header: "Balance Amount",
        accessor: "balanceAmount",
        disableSortBy:true,
        Cell: ({ row: { original } }: any) => {
          return (
            <div className="tw-flex tw-items-center">
              <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              <span>{original?.amounttoPay}</span>
            </div>
          );
        },
      },
    ];
  }

  const HostelExitApprovalsModal2Data: Array<LibraryTCRequestModals2DataProps> =
    [
      {
        id: 1,
        academicYear: "2016-17",
        class: "II",
        feeDetails: "Tuition Fee1",
        amounttoPay: "46000.00",
        paidAmount: "46000.00",
        balanceAmount: "00.00",
      },
      {
        id: 2,
        academicYear: "2016-17",
        class: "II",
        feeDetails: "Tuition Fee2",
        amounttoPay: "46000.00",
        paidAmount: "46000.00",
        balanceAmount: "00.00",
      },
      {
        id: 3,
        academicYear: "2016-17",
        class: "II",
        feeDetails: "Tuition Fee3",
        amounttoPay: "46000.00",
        paidAmount: "46000.00",
        balanceAmount: "00.00",
      },
      {
        id: 4,
        academicYear: "2016-17",
        class: "II",
        feeDetails: "Tuition Fee4",
        amounttoPay: "46000.00",
        paidAmount: "46000.00",
        balanceAmount: "00.00",
      },
      {
        id: 5,
        academicYear: "2016-17",
        class: "II",
        feeDetails: "Tuition Fee5",
        amounttoPay: "46000.00",
        paidAmount: "46000.00",
        balanceAmount: "00.00",
      },
      {
        id: 6,
        academicYear: "2016-17",
        class: "II",
        feeDetails: "Tuition Fee6",
        amounttoPay: "46000.00",
        paidAmount: "46000.00",
        balanceAmount: "00.00",
      },
      {
        id: 7,
        academicYear: "2016-17",
        class: "II",
        feeDetails: "Tuition Fee7",
        amounttoPay: "46000.00",
        paidAmount: "46000.00",
        balanceAmount: "00.00",
      },
      {
        id: 8,
        academicYear: "2016-17",
        class: "II",
        feeDetails: "Tuition Fee8",
        amounttoPay: "46000.00",
        paidAmount: "46000.00",
        balanceAmount: "00.00",
      },
      {
        id: 9,
        academicYear: "2016-17",
        class: "II",
        feeDetails: "Tuition Fee9",
        amounttoPay: "46000.00",
        paidAmount: "46000.00",
        balanceAmount: "00.00",
      },
      {
        id: 10,
        academicYear: "2016-17",
        class: "II",
        feeDetails: "Tuition Fee10",
        amounttoPay: "46000.00",
        paidAmount: "46000.00",
        balanceAmount: "00.00",
      },
    ];
  const roleColumns = useMemo(() => generateColumns(), []);
  return (
    <>

        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-w-full tw-p-4">
            <div className="tw-flex tw-flex-wrap">
              <div className="tw-w-1/4">
                <div className="tw-inline-block">
                  <UserDetails
                    displayName={"Lingam Prkruth"}
                    displayId={"NHS000001"}
                    size={"md"}
                    contentNotCenter={true}
                    paddingTop={"tw-p-2"}
                    displayNameClass="tw-font-bold"
                  />
                </div>
              </div>

              <div className="tw-w-1/6 tw-p-2">
                {data &&
                  data.map((d, index) => {
                    return (
                      <React.Fragment key={index}>
                        <div className="tw-flex tw-flex-wrap">
                          <div className="tw-flex-1">
                            <h6 className="tw-mb-0">
                              <span className="tw-font-bold">{d.header}:</span>
                            </h6>
                          </div>
                          <div className="tw-flex-1">
                            <h6 className="tw-mb-0">
                              <span className="tw-font-bold tw-text-[#6c757d]">
                                {d.value}
                              </span>
                            </h6>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
              </div>
              <div className="tw-w-1/2 tw-p-2">
                {data1 &&
                  data1.map((d, index) => {
                    return (
                      <React.Fragment key={index}>
                        <div className="tw-flex tw-flex-wrap">
                          <div className="tw-w-1/4">
                            <h6 className="tw-mb-0">
                              <span className="tw-font-bold">{d.header}:</span>
                            </h6>
                          </div>
                          <div className="tw-w-auto">
                            <h6 className="tw-mb-0">
                              <span className="tw-font-bold tw-text-[#6c757d]">
                                {d.value}
                              </span>
                            </h6>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="tw-bg-[#1bb3a6] tw-w-full tw-flex tw-items-center tw-justify-center">
            <h5 className="tw-m-0 tw-pt-3 tw-pb-3 tw-text-white tw-text-[18px] tw-flex tw-items-baseline">
              Balance To Pay as on 12-07-2022 (2022-23) :
              <RupeeSvg width="13px" height="13px" fill="white" /> 11600.00
            </h5>
          </div>
          <div className="tw-w-full">
            <TableContainer
              columns={roleColumns || []}
              data={HostelExitApprovalsModal2Data}
              divClass="table-responsive tw-mb-1"
              theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
            />
          </div>
        </div>

    </>
  );
};

export default TcRequestsViewModal;
