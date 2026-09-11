import React, { useEffect, useMemo, useRef } from "react";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import {
  UserDetails,
} from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import UncontrolledAccordionCard from '../../../../Components/Common/UncontrolledAccordionCard';
import AccordionCardItem from '../../../../Components/Common/AccordionCardItem';
import AccordionCardHeader from '../../../../Components/Common/AccordionCardHeader';
import AccordionCardBody from '../../../../Components/Common/AccordionCardBody';
import {
  TransferRequestApprovalsModals2DataProps,
  TransferRequestApprovalsModals2Props,
} from "../TransferRequestApprovalsTypes";
import { getStudentLedgerTcAct, setStudentLedgerTcAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
// import { tcRequestsTableData } from "./HostelExitRequests/TcRequestsTypes";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { nanoid } from "nanoid";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import NoDataComp from "../../../../Components/Common/NoDataComp";
import Button from "../../../../Components/Common/Button";
function generateColumns() {
  return [
    {
      Header: "Academic Year",
      accessor: "academicYearName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Fee Details",
      accessor: "feeDetails",
      disableSortBy: true,
    },
    {
      Header: "Amount to Pay",
      accessor: "amountToPay",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{getDisplayAmountValue(original?.amountToPay)}</span>
          </div>
        );
      },
    },
    {
      Header: "Paid Amount",
      accessor: "amountPaid",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{getDisplayAmountValue(original?.amountPaid)}</span>
          </div>
        );
      },
    },
    {
      Header: "Balance Amount",
      accessor: "amountToBePaid",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{getDisplayAmountValue(original?.amountToBePaid)}</span>
          </div>
        );
      },
    },
  ];
}

const TcRequestsViewModal = (props: any) => {
  const dispatch = useAppDispatch();
  const { showApiLoader, studentLedgerTcResp }: any =
    useAppSelector(
      ({ globalData, classroomManagmentInfo }) => ({
        showApiLoader: globalData.showApiLoader,
        studentLedgerTcResp: classroomManagmentInfo.studentLedgerTcResp,
      }), shallowEqual);
  // const viewModalRespRef = useRef({
  //   prevStudentLedgerTcResp: studentLedgerTcResp
  // })

  // useEffect(() => {
  //   const {} = 
  // }, [studentLedgerTcResp]);


  useEffect(() => {
    const { isOpen, branchId, studentId } = props;
    if (isOpen && studentId) {
      const payload = {
        branchId,
        academicYearId: ""
      }
      dispatch(getStudentLedgerTcAct(generateActionPayload('student_ledger_tc', {
        studentId: props.studentId,
      }, payload)))
    }
  }, [props.isOpen, props.studentId,props.branchId]);

  useEffect(() => {
    return () => {
      dispatch(setStudentLedgerTcAct(undefined));
    }
  }, []);

  const ledgerOfStudent = useMemo(() => {
    const { academicYearWiseLedgers } = studentLedgerTcResp || {};
    if (academicYearWiseLedgers && typeof academicYearWiseLedgers === "object" && !Array.isArray(academicYearWiseLedgers)) {
      const academicYearList = Object.keys(academicYearWiseLedgers);
      const sortedYears = academicYearList.sort((a, b) => {
        let yearA = parseInt(a.split("-")?.[0]);
        let yearB = parseInt(b.split("-")?.[0]);
        return yearB - yearA;
      });
      return sortedYears.map(item => ({
        id: nanoid(),
        headerTitle: item,
        tableData: academicYearWiseLedgers?.[item]
      }))
    }
    return [];
  }, [studentLedgerTcResp]);

  const roleColumns = useMemo(() => generateColumns(), [studentLedgerTcResp]);
  const { studentData, todaysDate, feeSummary } = studentLedgerTcResp || {};
  return (
    <>
      <div className="tw-modal-body tw-p-0">
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-w-full tw-px-4 tw-py-2">
            <div className="tw-flex tw-flex-wrap">
              <div className="tw-w-3/12 tw-px-2">
                <div className="tw-inline-block">
                  <UserDetails
                    displayName={studentData?.studentName}
                    displayId={studentData?.studentCode}
                    imageUrl={studentData?.imageUrl}
                    size={"md"}
                    contentNotCenter={true}
                    paddingTop={"p-2"}
                    displayNameClass="tw-font-bold"
                    defaultImgType="student"
                  />
                </div>
              </div>

              <div className="tw-w-2/12 tw-p-2">
                <div className="tw-flex tw-mb-1">
                  <div className="tw-flex-1">
                    <h6 className="tw-font-bold">Class:</h6>
                  </div>
                  <div className="tw-flex-1">
                    <h6 className="tw-font-bold tw-text-gray-500">
                      {studentData?.className || "-"}
                    </h6>
                  </div>
                </div>
                <div className="tw-flex">
                  <div className="tw-flex-1">
                    <h6 className="tw-font-bold">Section:</h6>
                  </div>
                  <div className="tw-flex-1">
                    <h6 className="tw-font-bold tw-text-gray-500">
                      {studentData?.sectionName || "-"}
                    </h6>
                  </div>
                </div>
              </div>

              <div className="tw-w-6/12 tw-p-2">
                <div className="tw-flex tw-mb-1">
                  <div className="tw-w-3/12">
                    <h6 className="tw-font-bold">Email:</h6>
                  </div>
                  <div className="tw-flex-1">
                    <h6 className="tw-font-bold tw-text-gray-500">
                      {studentData?.email || "-"}
                    </h6>
                  </div>
                </div>
                <div className="tw-flex">
                  <div className="tw-w-3/12">
                    <h6 className="tw-font-bold">Phone No:</h6>
                  </div>
                  <div className="tw-flex-1">
                    <h6 className="tw-font-bold tw-text-gray-500">
                      {studentData?.phoneNo || "-"}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {feeSummary && (
            <div className="tw-bg-blue-600 tw-w-full tw-flex tw-items-center tw-justify-center">
              <h5 className="tw-m-0 tw-py-2 tw-text-white tw-flex tw-items-baseline tw-text-base">
                Balance To Pay as on {todaysDate || "-"} (
                {studentData?.academicYearName || "-"}) :&nbsp;
                <RupeeSvg width="13px" height="13px" fill="white" />
                {getDisplayAmountValue(feeSummary?.amountToBePaidSum)}
              </h5>
            </div>
          )}

          <div className="tw-w-full tw-mt-2">
            {ledgerOfStudent.length > 0 ? (
              <UncontrolledAccordionCard defaultOpen={["1"]}>
                {ledgerOfStudent.map((item, index) => (
                  <AccordionCardItem key={item.id}>
                    <AccordionCardHeader
                      targetId={(index + 1)?.toString()}
                      title={`Academic Year: ${item.headerTitle}`}
                    />
                    <AccordionCardBody
                      accordionId={(index + 1)?.toString()}
                      className="tw-border-0 tw-rounded-b-md tw-p-0"
                    >
                      <TableContainer
                        columns={roleColumns || []}
                        data={item.tableData || []}
                        divClass="tw-overflow-x-auto tw-mb-3"
                        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                      />
                    </AccordionCardBody>
                  </AccordionCardItem>
                ))}
              </UncontrolledAccordionCard>
            ) : (
              <NoDataComp helperText="No ledger details found for this student." />
            )}
          </div>
        </div>

        <div className="tw-modal-footer">
          <div className="tw-flex tw-gap-2 tw-justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={props.toggle}
            >
              Close
            </Button>
          </div>
        </div>
      </div>



    </>
  );
};

export default TcRequestsViewModal;
