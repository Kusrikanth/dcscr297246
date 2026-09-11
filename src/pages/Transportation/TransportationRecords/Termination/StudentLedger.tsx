import React, { useMemo } from "react";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import {
  ModalContainer,
  StatusLabel,
  TextIconInput,
  UserDetails,
} from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";

import {
  StudentLedgerModalData,
  StudentLedgerModalProps,
} from "./TerminationTypes";

const StudentLedgerModal = (props: StudentLedgerModalProps) => {
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
        Header: "Fee Name",
        accessor: "feeName",
      },
      {
        Header: "Amount to Pay",
        accessor: "amounttoPay",
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
        Header: "Amount Paid",
        accessor: "amountPaid",
        Cell: ({ row: { original } }: any) => {
          return (
            <div className="tw-flex tw-items-center">
              <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              <span>{original?.amountPaid}</span>
            </div>
          );
        },
      },
      {
        Header: "Balance Amount",
        accessor: "balanceAmount",
        Cell: ({ row: { original } }: any) => {
          return (
            <div className="tw-flex tw-items-center">
              <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              <span>{original?.balanceAmount}</span>
            </div>
          );
        },
      },
      {
        Header: "Concession",
        accessor: "concession",
        Cell: ({ row: { original } }: any) => {
          return (
            <div className="tw-flex tw-items-center">
              <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              <span>{original?.concession}</span>
            </div>
          );
        },
      },
      {
        Header: "Route",
        accessor: "route",
      },
      {
        Header: "Stop",
        accessor: "stop",
      },
      {
        Header: "Slab",
        accessor: "slab",
      },
    ];
  }

  const StudentLedgerModalData: Array<StudentLedgerModalData> = [
    {
      id: 1,
      feeName: "Transport Fee - Term I",
      amounttoPay: 9400,
      amountPaid: 9400,
      balanceAmount: 0,
      concession: 0,
      route: "Route 1",
      stop: "May Flower Heights",
      slab: "Slab 1",
    },
    {
      id: 2,
      feeName: "Transport Fee - Term II",
      amounttoPay: 9400,
      amountPaid: 9400,
      balanceAmount: 0,
      concession: 0,
      route: "Route 1",
      stop: "May Flower Heights",
      slab: "Slab 2",
    },
    {
      id: 3,
      feeName: "Transport Fee - Term III",
      amounttoPay: 9400,
      amountPaid: 9400,
      balanceAmount: 0,
      concession: 0,
      route: "Route 1",
      stop: "May Flower Heights",
      slab: "Slab 3",
    },
  ];
  const roleColumns = useMemo(() => generateColumns(), []);
  return (
    <>
      <ModalContainer
        id="change-stream-confirm-modal"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={""}
        cancelHndlr={props.toggle}
        modalSize={"xl"}
        hideFooter={true}
        modalBodyClass={"p-0"}
        modalHeaderClass={"bg-soft-light p-3"}
      >
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-w-full tw-p-4">
            <div className="tw-grid tw-grid-cols-12">
              <div className="tw-col-span-3">
                <div className="tw-inline-block">
                  <UserDetails
                    displayName={"Lingam Prkruth"}
                    displayId={"NHS000001"}
                    size={"md"}
                    contentNotCenter={true}
                    paddingTop={"tw-p-2"}
                  />
                </div>
              </div>
              {/* <div className="row"> */}
              <div className="tw-col-span-2 tw-p-2">
                {data &&
                  data.map((d) => {
                    return (
                      <>
                        <div className="tw-grid tw-grid-cols-2">
                          <div className="tw-col-span-1">
                            <h6>
                              <span className="tw-font-bold">{d.header}:</span>
                            </h6>
                          </div>
                          <div className="tw-col-span-1">
                            <h6>
                              <span className="tw-font-bold tw-text-gray-500">
                                {d.value}
                              </span>
                            </h6>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
              <div className="tw-col-span-6 tw-p-2">
                {data1 &&
                  data1.map((d) => {
                    return (
                      <>
                        <div className="tw-grid tw-grid-cols-2">
                          <div className="tw-col-span-3">
                            <h6>
                              <span className="tw-font-bold">{d.header}:</span>
                            </h6>
                          </div>
                          <div className="tw-col-span-9">
                            <h6>
                              <span className="tw-font-bold tw-text-gray-500">
                                {d.value}
                              </span>
                            </h6>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="tw-w-full">
            <TableContainer
              columns={roleColumns || []}
              data={StudentLedgerModalData}
              divClass="table-responsive tw-mb-1"
              theadClass="table-light text-muted align-middle"
            />
          </div>
        </div>
      </ModalContainer>
    </>
  );
};

export default StudentLedgerModal;
