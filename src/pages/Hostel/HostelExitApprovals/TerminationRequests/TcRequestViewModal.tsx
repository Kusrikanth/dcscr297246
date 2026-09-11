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
import { getStudentLedgerTcAct, setStudentLedgerTcAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
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
          <div className="tw-flex tw-items-center">
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
          <div className="tw-flex tw-items-center">
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
          <div className="tw-flex tw-items-center">
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

  useEffect(() => {
    const { isOpen, branchId, studentId } = props;
    if (isOpen && studentId) {
      const payload = {
        branchId,
        academicYearId: ""
      }
      dispatch(getStudentLedgerTcAct(generateActionPayload('get_hostel_ledger_tc', {
        studentId: props.studentId,
      }, payload)))
    }
  }, [props.isOpen, props.studentId]);

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
      <div className="tw-p-0">
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-w-full tw-px-4 tw-py-2">
            <div className="tw-grid tw-grid-cols-12 tw-gap-2">
              <div className="tw-col-span-3">
                <div className="tw-inline-block">
                  <UserDetails
                    displayName={studentData?.studentName}
                    displayId={studentData?.studentCode}
                    imageUrl={studentData?.imageUrl}
                    size="md"
                    contentNotCenter={true}
                    paddingTop="p-2"
                    displayNameClass="fw-bold"
                    defaultImgType="student"
                  />
                </div>
              </div>
              <div className="tw-col-span-2 tw-p-2">
                <div className="tw-grid tw-grid-cols-2">
                  <h6 className="tw-font-semibold">Class:</h6>
                  <h6 className="tw-font-semibold tw-text-gray-500">
                    {studentData?.className || "-"}
                  </h6>
                </div>
                <div className="tw-grid tw-grid-cols-2">
                  <h6 className="tw-font-semibold">Section:</h6>
                  <h6 className="tw-font-semibold tw-text-gray-500">
                    {studentData?.sectionName || "-"}
                  </h6>
                </div>
              </div>
              <div className="tw-col-span-6 tw-p-2">
                <div className="tw-grid tw-grid-cols-[120px_auto]">
                  <h6 className="tw-font-semibold">Email:</h6>
                  <h6 className="tw-font-semibold tw-text-gray-500">
                    {studentData?.email || "-"}
                  </h6>
                </div>

                <div className="tw-grid tw-grid-cols-[120px_auto]">
                  <h6 className="tw-font-semibold">Phone No:</h6>
                  <h6 className="tw-font-semibold tw-text-gray-500">
                    {studentData?.phoneNo || "-"}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          {feeSummary && (
            <div className="tw-bg-[#405189] tw-w-full tw-flex tw-items-center tw-justify-center">
              <h5 className="tw-m-0 tw-py-2 tw-text-white tw-flex tw-items-baseline">
                Balance To Pay as on {todaysDate || "-"} (
                {studentData?.academicYearName || "-"}) :
                <span className="tw-ml-1 tw-flex tw-items-center">
                  <RupeeSvg width="13px" height="13px" fill="white" />
                  {getDisplayAmountValue(feeSummary?.amountToBePaidSum)}
                </span>
              </h5>
            </div>
          )}

          <div className="tw-w-full">
            {ledgerOfStudent.length > 0 && (
              <UncontrolledAccordionCard defaultOpen={["1"]}>
                {ledgerOfStudent.map((item, index) => (
                  <AccordionCardItem key={item.id}>
                    <AccordionCardHeader
                      targetId={(index + 1).toString()}
                      title={`Academic Year: ${item.headerTitle}`}
                    />
                    <AccordionCardBody
                      accordionId={(index + 1).toString()}
                      style={{
                        borderTop: "0px",
                        borderRadius: "0px 0px 5px 5px",
                        padding: "0px",
                        border: "0px",
                      }}
                    >
                      <TableContainer
                        columns={roleColumns || []}
                        data={item.tableData || []}
                        divClass="tw-overflow-x-auto tw-mb-1"
                        theadClass="tw-text-gray-500 tw-align-middle"
                      />
                    </AccordionCardBody>
                  </AccordionCardItem>
                ))}
              </UncontrolledAccordionCard>
            )}

            {ledgerOfStudent.length === 0 && (
              <NoDataComp helperText="No ledger details founds for this student." />
            )}
          </div>
        </div>
      </div>

      <div className="tw-flex tw-justify-end tw-gap-2 tw-px-4 tw-py-3">
        <Button
          type="button"
          variant="secondary"
          onClick={props.toggle}
        >
          Close
        </Button>
      </div>



    </>
  );
};

export default TcRequestsViewModal;
