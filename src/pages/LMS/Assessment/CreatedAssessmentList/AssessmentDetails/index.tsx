import { useEffect, useMemo, useState } from "react";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import { default as MathsSVG } from "../../../../../assets/imagesdps/lms/maths.svg?react";
import UpdatedHorizontalTab from "../../../../../Components/Common/UpdatedHorizontalTab";
import AssessmentDashboard from "./AssessmentDashboard";
import { Progress } from "reactstrap";
import AssessmentSubmissions from "./AssessmentSubmissions";
import AssessmentInfo from "./AssessmentInfo";
import AssginToClasses from "./AssginToClasses";
import FeedbackAndGrading from "./FeedbackAndGrading";
import StudentAssessmentResult from "./StudentAssessmenetResult";
import AssignClassesSection from "./AssignClassesSection";
import ModerationPanel from "./ModerationPanel";
import MonitorLiveAssessment from "./MonitorLiveAssessment";
import { Route, useHistory, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Comment01Icon,
  DashboardSquareEditIcon,
  SettingsError01Icon,
  Task01Icon,
} from "@hugeicons-pro/core-stroke-standard";
import ManageEvaluatorsWorkload from "./ModerationPanel/ManageEvaluatorsWorkload";
import AssessmentSettings from "./AssessmentSettings";
import LiveAssessmentMonitor from "./LiveAssessmentMonitor";
import EvaluteAndGrade from "../../EvaluteAndGrade";
import { getAssessmentCodeByIdAct } from "../../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getDateWithTimeFormat, getDdMmYyyyWithMonthNameFormat } from "../../../../../utility/dateutility";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  count?: number;
  Icon?: any;
}
interface LocationState {
  id: number | string;
}
const AssessmentDetails = (props: any) => {
  const location = useLocation<any>();
  const { id, activeId: initialActiveId } = location.state || {};
  const history = useHistory<any>();
  const [activeId, setActiveId] = useState<any>(initialActiveId || "dashboard");

  const dispatch = useAppDispatch();
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getAssessmentByIdResp
  } = useAppSelector(
    ({ lmsAssessment, appData, globalData, }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getAssessmentByIdResp: lmsAssessment.getAssessmentByIdResp,
    }),
    shallowEqual
  );
  <Route path="/feedback-grading" component={FeedbackAndGrading} />
  const MenuOptions = [
    {
      id: "dashboard",
      labelName: "Dashboard",
      customPadding: "0px 10px 6px 10px",
      count: 10,
      Icon: (
        <HugeiconsIcon
          icon={DashboardSquareEditIcon}
          size={18}
          className="me-2"
        />
      ),
    },
    {
      id: "feedbackAndGrading",
      labelName: "Result List",
      customPadding: "0px 10px 6px 10px",
      count: 2,
      Icon: <HugeiconsIcon icon={Comment01Icon} size={18} className="me-2" />,
    },
    {
      id: "evaluteAndGrade",
      labelName: "Evalute Grade Monitoring",
      customPadding: "0px 10px 6px 10px",
      count: 10,
      Icon: <HugeiconsIcon icon={Task01Icon} size={18} className="me-2" />,
    },
    {
      id: "settings",
      labelName: "Settings",
      customPadding: "0px 10px 6px 10px",
      count: 2,
      Icon: (
        <HugeiconsIcon icon={SettingsError01Icon} size={18} className="me-2" />
      ),
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "dashboard":
        return AssessmentDashboard;
      case "settings":
        return AssessmentSettings;
      case "submissions":
        return AssessmentSubmissions;
      case "evalutionTracker":
        return ManageEvaluatorsWorkload;
      case "assessmentInfo":
        return AssessmentInfo;
      case "assignToClasses":
        return AssginToClasses;
      case "reportsAndAnalytics":
        return StudentAssessmentResult;
      case "feedbackAndGrading":
        return FeedbackAndGrading;
      case "liveMonitoring":
        return LiveAssessmentMonitor;
      case "studentsAndSchedules":
        return AssignClassesSection;
      case "monitorLiveAssessments":
        return MonitorLiveAssessment;
      case "evaluteAndGrade":
        return EvaluteAndGrade;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return TabComponent ? (
      <TabComponent id={history.location.state?.id} getAssessmentByIdResp={getAssessmentByIdResp} />
    ) : null;
  }, [activeId, history.location.state, getAssessmentByIdResp]);

  function evaluteAndGrade() {
    history.push("/evalute-grade");
  }
  function liveAssessmentMonitor() {
    history.push("/assessment-list/live-assessment-monitor");
  }
  useEffect(() => {
    if (id) {
      dispatch(getAssessmentCodeByIdAct(generateActionPayload("get_assessment_by_id", { id: id }, {})));
    }
  }, [id]);
  const { studentCount = 0, evaluatedStudentCount = 0 } = getAssessmentByIdResp || {};

  const percentage = studentCount > 0
    ? Math.round((evaluatedStudentCount / studentCount) * 100)
    : 0;
  const utcStartDate = `${getAssessmentByIdResp?.startDate}`;

  const statusColors: Record<string, string> = {
    DRAFT: "tw-border-gray-400 tw-bg-gray-100 tw-text-gray-700",
    SCHEDULED: "tw-border-blue-500 tw-bg-blue-100 tw-text-blue-700",
    RESCHEDULED: "tw-border-yellow-500 tw-bg-yellow-100 tw-text-yellow-700",
    COMPLETED: "tw-border-green-500 tw-bg-green-100 tw-text-green-700",
    ARCHIVE: "tw-border-gray-500 tw-bg-gray-200 tw-text-gray-800",
    CANCELLED: "tw-border-red-500 tw-bg-red-100 tw-text-red-700",
    EVALUATED: "tw-border-indigo-500 tw-bg-indigo-100 tw-text-indigo-700",
    RESULTS_PUBLISHED: "tw-border-emerald-500 tw-bg-emerald-100 tw-text-emerald-700",
  };

  const dotColors: Record<string, string> = {
    DRAFT: "tw-bg-gray-500",
    SCHEDULED: "tw-bg-blue-500",
    RESCHEDULED: "tw-bg-yellow-500",
    COMPLETED: "tw-bg-green-600",
    ARCHIVE: "tw-bg-gray-700",
    CANCELLED: "tw-bg-red-500",
    EVALUATED: "tw-bg-indigo-500",
    RESULTS_PUBLISHED: "tw-bg-emerald-500",
  };

  const status = getAssessmentByIdResp?.assessmentStatus || "UNKNOWN";

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="LMS" title="LMS"></BreadCrumb>
          <div className="card mt-2 mx-n4 mb-n5">
            <div className="">
              <div className="card-body pb-0">
                <div className="row mb-3 tw-rounded mx-3 py-2">
                  <div className="col-md">
                    <div className="row align-items-center">
                      <div className="col-md-auto">
                        <div className="avatar-md mb-md-0 mb-4">
                          <div className="avatar-title bg-white rounded-circle">
                            <MathsSVG className="avatar-sm" />
                          </div>
                        </div>
                      </div>
                      <div className="col-md">
                        <h4 className="fw-semibold" id="ticket-title">
                          {getAssessmentByIdResp?.assessmentName}
                        </h4>
                        <div className="hstack gap-3 flex-wrap">
                          <div className="text-muted">
                            <i className="ri-book-open-line align-bottom me-1"></i>
                            <span id="ticket-subject">{getAssessmentByIdResp?.subjectName}</span>
                          </div>
                          <div className="vr"></div>
                          <div className="text-muted">
                            <i className="ri-file-list-3-line align-bottom me-1"></i>
                            <span id="ticket-mode">
                              {getAssessmentByIdResp?.assessmentType === "LIVE_WORKSHEET"
                                ? "Live Worksheet"
                                : getAssessmentByIdResp?.assessmentType}
                            </span>
                          </div>
                          <div className="vr"></div>
                          <div className="text-muted">
                            Create Date:{" "}
                            <span className="fw-medium" id="create-date">
                              {getDdMmYyyyWithMonthNameFormat(utcStartDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md">
                    <div className="d-flex align-items-center justify-content-end gap-3">
                      <div
                        className={`tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-py-2 tw-px-4 tw-text-xs tw-font-medium tw-border ${statusColors[status] || "tw-border-gray-300 tw-bg-gray-100 tw-text-gray-700"
                          }`}
                        id="ticket-status"
                      >
                        <span
                          className={`tw-inline-block tw-w-3 tw-h-3 tw-rounded-full ${dotColors[status] || "tw-bg-gray-500"
                            }`}
                        ></span>
                        <span>{status.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <UpdatedHorizontalTab
                      MenuOptions={MenuOptions}
                      clickMenuHandler={clickMenuHandler}
                      activeTabId={activeId}
                      horizontalClass="overflow-auto text-nowrap"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="!tw-mt-[68px]">
            <div className="p-0">{activeComponent}</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AssessmentDetails;