import { useEffect, useMemo, useRef, useState } from "react";
import { HorizontalWizard } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { timeTableSettingsStepList } from "./helper";
import TimeTableDetails from "./TimeTableDetails";
import AssignPeriodWiseSubject from "./AssignPeriodWiseSubject";
import AssignTeacher from "./AssignTeacher";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getWeeksAct } from "../../../store/academic/timetableManagment/timetableManagmentactions";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

function getActiveMenuComponent(menuId: any) {
  switch (menuId) {
    case "time-table-details":
      return TimeTableDetails;
    case "assign-period-wise-subject":
      return AssignPeriodWiseSubject;
    case "assign-teacher":
      return AssignTeacher;
  }
}

const TimeTableSettings = () => {
  const dispatch = useAppDispatch();
    const history = useHistory();
  
  const [activeStepId, setActiveStepId] = useState("time-table-details");
  const [timeTableDetails, setTimeTableDetails] = useState<any>({
      timeTableInfo :undefined,
      assignPeriodWiseInfo :undefined,
    })

  const getWeeksDays = (otherProps?: any) => {
    dispatch(getWeeksAct(generateActionPayload("get_weeks", undefined, undefined)));
  }

  const {
    getSubjectsTeacherResp,
    currentBranchIdResp: branchId,
    saveTimetableResp,
          getTimeTableErrResp,
    
      } = useAppSelector(
        ({ timeTableManagement, appData }) => ({
          getSubjectsTeacherResp: timeTableManagement.getSubjectsTeacherResp,
          currentBranchIdResp: appData.currentBranchIdResp,
          saveTimetableResp: timeTableManagement.saveTimetableResp,
            getTimeTableErrResp : timeTableManagement.getTimeTableErrResp
        }),
        shallowEqual
      );

      
        const newRequestRespRef = useRef({
          prevGetTimeTableErrResp: getTimeTableErrResp,
          prevSaveTimetableResp: saveTimetableResp,
        });
      
        useEffect(() => {
          const { prevGetTimeTableErrResp, prevSaveTimetableResp } = newRequestRespRef.current;
      
          if (saveTimetableResp && prevSaveTimetableResp !== saveTimetableResp) {
            toast.success("Time table saved successfully.");
            history.push("/time-table");
          }
          else if (getTimeTableErrResp && prevGetTimeTableErrResp !== getTimeTableErrResp) {
            const { details } = getTimeTableErrResp;
            toast.error(details || "Something went wrong. Please try again later.");
          }
      
          newRequestRespRef.current.prevSaveTimetableResp = saveTimetableResp;
          newRequestRespRef.current.prevGetTimeTableErrResp = getTimeTableErrResp;
        }, [saveTimetableResp, getTimeTableErrResp]);
  function updateStepHndlr(stepId: any, values?:any, name?:any) {
    if (values) {      
      setTimeTableDetails((prev:any)=>({...prev,[name]:values}))
      setActiveStepId(stepId);
      getActiveMenuComponent(stepId);
    }
  }
  useEffect(() => {
    getWeeksDays();
  },[])

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeStepId);
    if (TabComponent) {
      return <TabComponent 
      updateStepHndlr={updateStepHndlr}
      timeTableDetails={timeTableDetails}

      />;
    }
  }, [activeStepId, timeTableDetails, updateStepHndlr]);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid time-table-settigns">
          <BreadCrumb
            title="Time Table Management"
            pageTitle="Time Table Management"
          ></BreadCrumb>

          <div className="tw-flex tw-justify-center tw-mb-4">
            <div className="tw-w-full">
              <div className="tw-bg-white tw-rounded-lg tw-shadow">
                <div className="tw-px-4 tw-py-3 tw-border-b">
                  <div className="tw-flex tw-items-center">
                    <div className="tw-w-1/2">
                      <h4 className="tw-text-base tw-font-semibold tw-m-0 tw-flex-grow">
                        Create Time Table
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="tw-p-4">
                  <HorizontalWizard
                    updateStepHndlr={updateStepHndlr}
                    stepsList={timeTableSettingsStepList}
                    activeStepId={activeStepId}
                    containerClass="new-stepper-container horizontal-wizard-updated tw-mb-4 tw-px-2"
                  ></HorizontalWizard>

                  <div>{activeComponent}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeTableSettings;
