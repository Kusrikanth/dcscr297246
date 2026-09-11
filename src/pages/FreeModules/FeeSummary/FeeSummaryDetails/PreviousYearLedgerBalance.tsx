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
// import { tcRequestsTableData } from "./HostelExitRequests/TcRequestsTypes";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { nanoid } from "nanoid";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import NoDataComp from "../../../../Components/Common/NoDataComp";
import { getPrevYearBalanceLedgersAct } from "../../../../store/fee/feecollections/feecollectionactions";
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

const PreviousYearLedgerBalance = (props: any) => {
  const dispatch = useAppDispatch();
  const { showApiLoader, previousYearBalanceLedgersResp }: any =
    useAppSelector(
      ({ globalData, feeCollections }) => ({
        showApiLoader: globalData.showApiLoader,
        previousYearBalanceLedgersResp: feeCollections.previousYearBalanceLedgersResp,
      }), shallowEqual);


  useEffect(() => {
    const { studentData, academicYearId, branchId } = props,
      { id: studentId } = studentData || {};
    if (studentId) {
      const payload = {
        studentId,
        branchId,
        academicYearId
      }
      dispatch(getPrevYearBalanceLedgersAct(generateActionPayload('get_previous_ledger_balance', undefined, payload)))
    }
  }, [props.studentData, props.branchId, props.academicYearId]);

  // useEffect(() => {
  //   return () => {
  //     dispatch(setStudentLedgerTcAct(undefined));
  //   }
  // }, []);

  const ledgerOfStudent = useMemo(() => {
    const { studentLedgerForTerm, studentLedgerForMonth } = previousYearBalanceLedgersResp || {};
    if (Array.isArray(studentLedgerForTerm) || Array.isArray(studentLedgerForMonth)) {
      let allLedgers: any = [];
      if (Array.isArray(studentLedgerForMonth)) {
        allLedgers = allLedgers.concat([...studentLedgerForMonth]);
      }
      if (Array.isArray(studentLedgerForTerm)) {
        allLedgers = allLedgers.concat([...studentLedgerForTerm])
      }
      if (allLedgers.length > 0) {
        const ledgersByAcademicYear = allLedgers.reduce((obj: any, item: any) => {
          const { academicYearName } = item;
          if (obj[academicYearName]) {
            obj[academicYearName] = obj[academicYearName].concat([{ ...item }]);
          } else if (academicYearName) {
            obj[academicYearName] = [{ ...item }];
          }
          return obj;
        }, {});
        const academicYearList = Object.keys(ledgersByAcademicYear);
        const sortedYears = academicYearList.sort((a, b) => {
          let yearA = parseInt(a.split("-")?.[0]);
          let yearB = parseInt(b.split("-")?.[0]);
          return yearB - yearA;
        });
        return sortedYears.map(item => ({
          id: nanoid(),
          headerTitle: item,
          tableData: ledgersByAcademicYear?.[item]
        }))
      }
    }
    return [];
  }, [previousYearBalanceLedgersResp]);
  const roleColumns = useMemo(() => generateColumns(), []);
  const { studentData } = props || {};
  return (
    <>
      <div className="tw-p-0">
        <div className="tw-flex tw-flex-col tw-items-center">

          <div className="tw-w-full tw-px-4 tw-py-2">
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

              <div className="tw-col-span-3">
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

              <div className="tw-col-span-2 tw-p-2 tw-space-y-2">
                <div className="tw-grid tw-grid-cols-2">
                  <h6 className="tw-font-bold">Class:</h6>
                  <h6 className="tw-font-bold tw-text-gray-500">
                    {studentData?.className || "-"}
                  </h6>
                </div>

                <div className="tw-grid tw-grid-cols-2">
                  <h6 className="tw-font-bold">Section:</h6>
                  <h6 className="tw-font-bold tw-text-gray-500">
                    {studentData?.sectionName || "-"}
                  </h6>
                </div>
              </div>

              <div className="tw-col-span-6 tw-p-2 tw-space-y-2">
                <div className="tw-grid tw-grid-cols-[120px_auto]">
                  <h6 className="tw-font-bold">Email:</h6>
                  <h6 className="tw-font-bold tw-text-gray-500 break-all">
                    {studentData?.emailId || "-"}
                  </h6>
                </div>

                <div className="tw-grid tw-grid-cols-[120px_auto]">
                  <h6 className="tw-font-bold">Phone No:</h6>
                  <h6 className="tw-font-bold tw-text-gray-500">
                    {studentData?.contactNo || "-"}
                  </h6>
                </div>
              </div>

            </div>
          </div>

          <div className="tw-w-full tw-mt-2">
            {ledgerOfStudent.length > 0 ? (
              <UncontrolledAccordionCard defaultOpen={['1']}>
                {ledgerOfStudent.map((item, index) => (
                  <AccordionCardItem key={item.id}>
                    <AccordionCardHeader
                      targetId={(index + 1).toString()}
                      title={`Academic Year: ${item.headerTitle}`}
                    />

                    <AccordionCardBody
                      accordionId={(index + 1).toString()}
                      className="tw-p-0 tw-border-0"
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
            ) : (
              <NoDataComp helperText="No previous year ledger details found for this student." />
            )}
          </div>

        </div>
      </div>

      <div className="tw-flex tw-justify-end tw-gap-2 tw-p-3 tw-border-t">
        <Button
          variant="secondary"
          type="button"
          onClick={props.toggle}
        >
          Close
        </Button>
      </div>

    </>
  );
};

export default PreviousYearLedgerBalance;
