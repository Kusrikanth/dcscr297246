import BreadCrumb from "../../../Components/Common/BreadCrumb";
import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { transformApiResponse } from "./helper";
import { useParams } from "react-router-dom";
import { generateActionPayload } from "../../../utility/reduxutility";
import { resetViewTimeTableAct, viewTimeTableAct, viewParentTimeTableAct, resetViewParentTimeTableAct } from "../../../store/academic/timetableManagment/timetableManagmentactions";
import { toast } from "react-toastify";
import Button from "../../../Components/Common/Button";

const TimeTable = () => {
  const params: any = useParams();
  const dispatch = useAppDispatch();

  const {
    viewTimeTableResp,
    currentBranchIdResp: branchId,
    getTimeTableErrResp,
    virtualRoleResp,
    loggedInUserRole,
    currentStudentId,
    parentChildrensResp,
    viewParentTimeTableResp
  } = useAppSelector(
    ({ timeTableManagement, appData, directoryStudent }) => ({
      viewTimeTableResp: timeTableManagement.viewTimeTableResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getTimeTableErrResp: timeTableManagement.getTimeTableErrResp,
      virtualRoleResp: appData.virtualRoleResp,
      loggedInUserRole: appData.loggedInUserRole,
      currentStudentId: appData.currentStudentId,
      parentChildrensResp: directoryStudent.parentChildrensResp,
      viewParentTimeTableResp: timeTableManagement.viewParentTimeTableResp

    }),
    shallowEqual
  );

  const newRequestRespRef = useRef({
    prevGetTimeTableErrResp: getTimeTableErrResp,
  });

  useEffect(() => {
    const { prevGetTimeTableErrResp } = newRequestRespRef.current;
    if (getTimeTableErrResp && prevGetTimeTableErrResp !== getTimeTableErrResp) {
      const { details } = getTimeTableErrResp;
      toast.error(details || "Something went wrong. Please try again later.");
    }

    newRequestRespRef.current.prevGetTimeTableErrResp = getTimeTableErrResp;
  }, [getTimeTableErrResp]);

  const showParentUI = loggedInUserRole === 'PARENT_ROLE' && !virtualRoleResp;
  const [timeTable, setTimeTable] = useState<any>([]);
  const uniquePeriods = timeTable[0]?.periods;

  useEffect(() => {
    if (viewTimeTableResp) {
      setTimeTable(transformApiResponse(viewTimeTableResp));
    }
    else if (viewParentTimeTableResp && showParentUI) {
      setTimeTable(transformApiResponse(viewParentTimeTableResp));
    }
    else {
      setTimeTable([]);
    }
  }, [viewTimeTableResp, viewParentTimeTableResp, showParentUI]);


  useEffect(() => {
    if (showParentUI) {
      const { academicYearId, curriculumId, classId, sectionId } = parentChildrensResp.find(item => item.childId?.toString() === currentStudentId?.toString())
      const payload = {
        academicYearId,
        curriculumId,
        classId,
        sectionId,
      }
      dispatch(viewParentTimeTableAct(generateActionPayload("view_parent_timetable", undefined, payload)));
    }
    else {
      dispatch(viewTimeTableAct(generateActionPayload("view_timetable", { id: params.id }, undefined)));
    }
    return () => {
      dispatch(resetViewTimeTableAct(undefined));
      dispatch(resetViewParentTimeTableAct(undefined));
    }
  }, [currentStudentId]);

  return (
    <>
      <div className={`${!showParentUI ? " page-content" : ""} `}>
        <div className="container-fluid">
          {!showParentUI && <BreadCrumb
            title="Academic Excelance"
            pageTitle="Time Table"
          ></BreadCrumb>}

          {timeTable.length > 0 ? (
            <div className="time-table-grid-container">
              <div className="tw-bg-white tw-rounded-lg tw-shadow">
                <div className="tw-p-4 tw-border-b">
                  <div className="tw-flex tw-items-center">
                    <div className="tw-w-8/12">
                      <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                        Time Table
                      </h4>
                      {viewTimeTableResp && (
                        <div className="tw-text-gray-500 tw-mt-2">
                          <span className="tw-mr-4">
                            <span className="tw-font-bold">Curriculum:</span>{" "}
                            {viewTimeTableResp.branchCurriculumName}
                          </span>
                          <span className="tw-mr-4">
                            <span className="tw-font-bold">Class:</span>{" "}
                            {viewTimeTableResp.branchClassName}
                          </span>
                          <span>
                            <span className="tw-font-bold">Section:</span>{" "}
                            {viewTimeTableResp.sectionName}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="tw-ml-auto">
                      <Button
                        id="export-btn"
                        variant="exportBtn"
                        onClick={() => { }}
                      >
                        <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                      </Button>
                      <UncontrolledTooltip placement="bottom" target="export-btn">
                        Export
                      </UncontrolledTooltip>
                    </div>
                  </div>
                </div>

                <div className="tw-p-4">
                  <div className="tw-flex tw-justify-center tw-overflow-x-auto">
                    <div
                      className="tw-grid tw-gap-2 tw-w-fit"
                      style={{
                        gridTemplateColumns: `repeat(${uniquePeriods?.length + 1
                          }, minmax(0,1fr))`,
                      }}
                    >
                      <div className="tw-flex tw-items-center tw-justify-center tw-font-bold tw-border tw-bg-gray-100 tw-rounded tw-p-2">
                        Days
                      </div>

                      {uniquePeriods?.map((period) => (
                        <div
                          key={period.periodId}
                          className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-font-bold tw-border tw-bg-gray-100 tw-rounded tw-p-2"
                        >
                          <p className="tw-mb-0">{period.periodName}</p>
                          <p className="tw-mb-0 tw-text-gray-500 tw-text-xs">
                            ({period.periodTime})
                          </p>
                        </div>
                      ))}

                      {timeTable.map((day, dayIndex) => (
                        <React.Fragment key={day.dayName}>
                          <div className="tw-flex tw-items-center tw-justify-center tw-font-bold tw-border tw-bg-gray-100 tw-rounded tw-p-2 tw-text-center">
                            {day.dayName}
                          </div>

                          {day.periods.map((period, periodIndex) => {
                            if (
                              period.periodSubjectName === "Lunch" ||
                              period.periodSubjectName === "Assembly" ||
                              period.type === "break"
                            ) {
                              if (dayIndex === 0) {
                                const cellColor =
                                  period.periodSubjectName === "Lunch"
                                    ? "#0EA5E91A"
                                    : period.periodSubjectName === "Assembly"
                                      ? "#10B9811A"
                                      : period.periodSubjectName === "Break"
                                        ? "#8B5CF61A"
                                        : "#0EA5E91A";

                                return (
                                  <div
                                    key={`${period.periodId}`}
                                    className="tw-flex tw-items-center tw-justify-center tw-border tw-rounded tw-text-center"
                                    style={{
                                      gridRow: `2 / ${timeTable.length + 2}`,
                                      gridColumn: `${periodIndex + 2}/${periodIndex + 3
                                        }`,
                                      writingMode: "vertical-lr",
                                      transform: "rotate(180deg)",
                                      backgroundColor: cellColor,
                                    }}
                                  >
                                    <h3 className="tw-mb-0 tw-font-semibold">
                                      {period.periodSubjectName}
                                    </h3>
                                  </div>
                                );
                              } else{
                                return <React.Fragment key={period.periodId} />
                              }
                            }

                            const isEmptyPeriod = period.periodSubjectName;

                            return isEmptyPeriod ? (
                              <div
                                key={`${period.periodId}`}
                                data-id={period.periodId}
                                className="tw-flex tw-items-center tw-justify-center tw-text-center tw-rounded tw-border tw-min-h-[70px]"
                                style={{
                                  borderLeft: `4px solid ${period.periodBorderColor}`,
                                  backgroundColor: `${period.periodBgColor}`,
                                }}
                              >
                                <div>
                                  <p
                                    className="tw-mb-1 tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap tw-max-w-[150px] tw-font-bold tw-px-2"
                                    style={{ color: period.periodTextColor }}
                                  >
                                    {period.periodSubjectName}
                                  </p>
                                  <p
                                    className="tw-mb-0 tw-text-sm tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap tw-max-w-[150px] tw-px-2"
                                    style={{ color: period.periodTextColor }}
                                  >
                                    {period.periodSubjectTeacher}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div
                                key={`${period.periodId}`}
                                className="tw-flex tw-items-center tw-justify-center tw-bg-gray-100 tw-rounded tw-border tw-min-h-[70px]"
                              />
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-flex tw-flex-col tw-items-center tw-justify-center">
              <div className="tw-text-center">
                <p className="tw-p-5 tw-mb-0">No time table found</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TimeTable;
