import { useHistory, useLocation, useParams } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { default as MathsSVG } from "../../../assets/imagesdps/lms/maths.svg?react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon as CheckmarkCircle02SolidIcon } from "@hugeicons-pro/core-solid-standard";
import { InputCheckbox } from "../../../Components/Common";
import { Clock01Icon } from "@hugeicons-pro/core-stroke-standard";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import {
  getCurrentStatusOfAssessmentAct,
  getStartAssessmentDetailsAct,
  getStudentAssessmentsListByIdAct,
  restartAssessmentAct,
  validateStudentReadinessAct,
} from "../../../store/lms/studentAssessment/studentAssessmentActions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { formatMinutesToDuration } from "../../../utility/commonutility";
import { addMinutes, differenceInSeconds, format, isAfter, isBefore, isValid, subMinutes } from "date-fns";
import { getDateWithTimeFormat } from "../../../utility/dateutility";

declare global {
  interface Navigator {
    connection?: {
      downlink: number;
      effectiveType: string;
      onchange: (() => void) | null;
      rtt: number;
    };
  }
}

const AssessmentInstructions = () => {
  const history = useHistory();
  const [agree, setAgree] = useState(false);
  const [browserVersion, setBrowserVersion] = useState<string>("");
  const [screenSize, setScreenSize] = useState<string>("");
  const [mouseDetected, setMouseDetected] = useState<boolean>(false);
  const [keyboardDetected, setKeyboardDetected] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [networkSpeed, setNetworkSpeed] = useState<string>("Testing...");
  const [clientIpAddress, setClientIpAddress] = useState<string>("");

  const location = useLocation<any>();
  const { assessmentId } = location.state || {};
  const getBrowserNameAndVersion = () => {
    const ua = navigator.userAgent;
    let tem;
    let M =
      ua.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d.]+)/i
      ) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return "IE " + (tem[1] || "");
    }
    if (M[1] === "Chrome") {
      tem = ua.match(/\b(OPR|Edge|Edg)\/([\d.]+)/);
      if (tem != null)
        return tem.slice(1).join(" ").replace("OPR", "Opera").replace("Edg", "Edge");
    }
    M = M[2]
      ? [M[1], M[2]]
      : [navigator.appName, navigator.appVersion, "-?"];
    if ((tem = ua.match(/version\/([\d.]+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(" ");
  };

  async function enterFullScreen() {
    const docEl = document.documentElement;

    if (!document.fullscreenElement) {
      try {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if ((docEl as any).webkitRequestFullscreen) {
          await (docEl as any).webkitRequestFullscreen();
        } else if ((docEl as any).mozRequestFullScreen) {
          await (docEl as any).mozRequestFullScreen();
        } else if ((docEl as any).msRequestFullscreen) {
          await (docEl as any).msRequestFullscreen();
        }
      } catch (error) {
        console.error("Fullscreen request failed:", error);
      }
    }
  }

  async function getClientIpAddress() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.ip) {
        setClientIpAddress(data.ip);
      }
    } catch (error) {
      console.error("Failed to fetch IP address:", error);
      setClientIpAddress("Error fetching IP");
    }
  }

  const { getStudentAssessmentsListByIdResp, validateStudentReadinessResp, parentChildrensResp, currentStudentId, getCurrentStatusOfAssessmentResp, getStartAssessmentDetailsResp, restartAssessmentResp, studentAssessmentsQuestionsErrorResp } =
    useAppSelector(
      ({
        studentAssessments,
        directoryStudent,
        appData
      }) => ({
        getStudentAssessmentsListByIdResp:
          studentAssessments.getStudentAssessmentsListByIdResp,
        validateStudentReadinessResp:
          studentAssessments.validateStudentReadinessResp,
        getCurrentStatusOfAssessmentResp:
          studentAssessments.getCurrentStatusOfAssessmentResp,
        studentAssessmentsQuestionsErrorResp: studentAssessments.studentAssessmentsQuestionsErrorResp,
        parentChildrensResp: directoryStudent.parentChildrensResp,
        currentStudentId: appData.currentStudentId,
        getStartAssessmentDetailsResp: studentAssessments.getStartAssessmentDetailsResp,
        restartAssessmentResp: studentAssessments.restartAssessmentResp,
      }),
      shallowEqual
    );
  const StudentAAssessmentRef = useRef({
    prevstudentAssessmentsQuestionsErrorResp: studentAssessmentsQuestionsErrorResp,
    prevgetStartAssessmentDetailsResp: getStartAssessmentDetailsResp,
    prevRestartAssessmentResp: restartAssessmentResp,
  })

  const currentStudent = useMemo(() => {
    if (Array.isArray(parentChildrensResp) && parentChildrensResp.length && currentStudentId) {
      return parentChildrensResp.find((item: any) => item?.childId?.toString() === currentStudentId.toString())
    }
  }, [parentChildrensResp, currentStudentId]);

  useEffect(() => {
    const { prevstudentAssessmentsQuestionsErrorResp, prevgetStartAssessmentDetailsResp, prevRestartAssessmentResp } = StudentAAssessmentRef.current || {}
    if (studentAssessmentsQuestionsErrorResp && prevstudentAssessmentsQuestionsErrorResp !== studentAssessmentsQuestionsErrorResp) {
      const { details } = studentAssessmentsQuestionsErrorResp || {}
      toast.error(details || "Something went wrong")
    }
    else if (getStartAssessmentDetailsResp && prevgetStartAssessmentDetailsResp !== getStartAssessmentDetailsResp) {
      toast.success("Assessment Started")
      history.push({
        pathname: `/student-assessment`,
        state: {
          assessmentId,
          studentDetails: currentStudent,
          sessionId: getStartAssessmentDetailsResp.sessionId
        },
      })
    }
    else if (restartAssessmentResp && prevRestartAssessmentResp !== restartAssessmentResp) {
      toast.success("Assessment Restarted")
      history.push({
        pathname: `/student-assessment`,
        state: {
          assessmentId,
          studentDetails: currentStudent,
          attemptId: getCurrentStatusOfAssessmentResp.attemptId,
          sessionId: getCurrentStatusOfAssessmentResp.sessionId
        },
      })
    }
    StudentAAssessmentRef.current.prevstudentAssessmentsQuestionsErrorResp = studentAssessmentsQuestionsErrorResp;
    StudentAAssessmentRef.current.prevgetStartAssessmentDetailsResp = getStartAssessmentDetailsResp;
    StudentAAssessmentRef.current.prevRestartAssessmentResp = restartAssessmentResp;
  }, [currentStudent, studentAssessmentsQuestionsErrorResp, getStartAssessmentDetailsResp, restartAssessmentResp])

  const dispatch = useAppDispatch();

  const getStudentAssessmentsListById = () => {
    dispatch(
      getStudentAssessmentsListByIdAct(
        generateActionPayload("get_student_assessment_list_by_id", {
          assessmentId,
        })
      )
    );
  };

  const fetchCurrentStatusOfAssessmentAttempt = (otherProps?: any) => {
    const payload = {
      assessmentId,
      studentId: currentStudentId,
      ...otherProps
    }

    dispatch(getCurrentStatusOfAssessmentAct(generateActionPayload("get_current_status_of_assessment", undefined, payload)))
  }

  useEffect(() => {
    if (assessmentId && currentStudentId) {
      getStudentAssessmentsListById();
      fetchCurrentStatusOfAssessmentAttempt({ studentId: currentStudentId })
    }
  }, [assessmentId, currentStudentId])

  useEffect(() => {
    // Initial data fetch
    getClientIpAddress();

    // Get browser and screen info
    const browserInfo = getBrowserNameAndVersion();
    setBrowserVersion(browserInfo);

    const width = window.screen.width;
    const height = window.screen.height;
    setScreenSize(`${width}×${height} detected`);

    // Setup input device listeners
    const handleMouseMove = () => {
      setMouseDetected(true);
      window.removeEventListener("mousemove", handleMouseMove);
    };

    const handleKeyDown = () => {
      setKeyboardDetected(true);
      window.removeEventListener("keydown", handleKeyDown);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

    // Setup internet connectivity listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Get network speed estimate
    if (navigator.connection && navigator.connection.downlink) {
      const speed = navigator.connection.downlink; // Speed in Mbps
      let statusText = `${speed} Mbps`;
      if (speed >= 5) {
        statusText += " (Stable)";
      } else {
        statusText += " (Slow)";
      }
      setNetworkSpeed(statusText);
    } else {
      setNetworkSpeed("Not Supported");
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (
      currentStudent &&
      browserVersion &&
      screenSize &&
      networkSpeed !== "Testing..." &&
      clientIpAddress &&
      assessmentId
    ) {
      const browserParts = browserVersion.split(" ");
      const name = browserParts[0] || "N/A";
      const version = browserParts[1] || "N/A";

      const [widthStr, heightStr] = screenSize.replace(" detected", "").split("×");

      const speedMatch = networkSpeed.match(/[\d.]+/);
      const minSpeed = speedMatch ? speedMatch[0] : "0";

      const payload = {
        studentId: currentStudent.childId,
        networkMinSpeed: minSpeed,
        browserName: name,
        browserVersion: version,
        screenWidth: parseInt(widthStr, 10) || 0,
        screenHeight: parseInt(heightStr, 10) || 0,
        clientIpAddress: clientIpAddress,
      };

      dispatch(
        validateStudentReadinessAct(
          generateActionPayload(
            "validate_student_readiness",
            {
              assessmentId,
            },
            payload
          )
        )
      );
    }
  }, [
    currentStudent,
    browserVersion,
    screenSize,
    networkSpeed,
    clientIpAddress,
    dispatch,
    assessmentId
  ]);

  const getDeviceStatus = () => {
    if (mouseDetected && keyboardDetected) {
      return "Keyboard & Mouse Detected";
    }
    if (mouseDetected) {
      return "Mouse Detected";
    }
    if (keyboardDetected) {
      return "Keyboard Detected";
    }
    return "Awaiting Input...";
  };

  const getDeviceStatusClass = () => {
    if (mouseDetected && keyboardDetected) {
      return "text-success";
    }
    if (mouseDetected || keyboardDetected) {
      return "text-warning";
    }
    return "text-danger";
  };

  const startTest = () => {
    if (!assessmentId || !currentStudent?.childId) return;
    const params = {
      assessmentId: assessmentId,
      studentId: currentStudent.childId,
    }
    dispatch(getStartAssessmentDetailsAct(generateActionPayload("get_start_assessment_details", params)))
  };

  const resumeTest = () => {
    if (!assessmentId || !currentStudent?.childId) return;

    const params = {
      attemptId: getCurrentStatusOfAssessmentResp.attemptId,
    }
    dispatch(restartAssessmentAct(generateActionPayload("restart_assessment", params, undefined, {
      headers: {
        ExamSessionId: getCurrentStatusOfAssessmentResp.sessionId,
      }
    })))
  };

  const getNetworkSpeedIconClass = () => {
    if (!isOnline) {
      return "text-danger";
    }
    if (networkSpeed.includes("Stable")) {
      return "text-success";
    }
    if (networkSpeed.includes("Slow")) {
      return "text-warning";
    }
    return "text-muted";
  };

  const renderNetworkSpeedBadge = () => {
    const baseClasses = "tw-px-2 tw-py-1 tw-rounded tw-border tw-text-xs";

    if (!isOnline) {
      return (
        <span className={`${baseClasses} tw-bg-red-100 tw-text-red-600 tw-border-red-200`}>
          Unavailable
        </span>
      );
    }

    if (networkSpeed.includes("(Stable)")) {
      const speedValue = networkSpeed.replace(" (Stable)", "");
      return (
        <React.Fragment>
          <span className="me-2">{speedValue}</span>
          <span className={`${baseClasses} tw-bg-green-100 tw-text-green-600 tw-border-green-200`}>
            Stable
          </span>
        </React.Fragment>
      );
    }

    if (networkSpeed.includes("(Slow)")) {
      const speedValue = networkSpeed.replace(" (Slow)", "");
      return (
        <React.Fragment>
          <span className="me-2">{speedValue}</span>
          <span className={`${baseClasses} tw-bg-yellow-100 tw-text-yellow-600 tw-border-yellow-200`}>
            Slow
          </span>
        </React.Fragment>
      );
    }

    return (
      <span className={`${baseClasses} tw-bg-gray-100 tw-text-gray-600 tw-border-gray-200`}>
        {networkSpeed}
      </span>
    );
  };
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!getStudentAssessmentsListByIdResp?.startDate || !getStudentAssessmentsListByIdResp?.startTime) return;

    const startDateTimeUTC = new Date(
      `${getStudentAssessmentsListByIdResp.startDate}T${getStudentAssessmentsListByIdResp.startTime}Z`
    );

    const interval = setInterval(() => {
      const nowUTC = new Date();
      const diffSeconds = differenceInSeconds(startDateTimeUTC, nowUTC);
      setTimeLeft(diffSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [getStudentAssessmentsListByIdResp]);

  const startDateTimeBtn =
    getStudentAssessmentsListByIdResp?.startDate && getStudentAssessmentsListByIdResp?.startTime
      ? new Date(`${getStudentAssessmentsListByIdResp.startDate}T${getStudentAssessmentsListByIdResp.startTime}Z`)
      : null;

  const expiryDateTime =
    getStudentAssessmentsListByIdResp?.expiryDate && getStudentAssessmentsListByIdResp?.expiryTime
      ? new Date(`${getStudentAssessmentsListByIdResp.expiryDate}T${getStudentAssessmentsListByIdResp.expiryTime}Z`)
      : null;

  const effectiveGrace =
    getStudentAssessmentsListByIdResp?.gracePeriod && getStudentAssessmentsListByIdResp.gracePeriod > 0
      ? getStudentAssessmentsListByIdResp.gracePeriod
      : 5;

  const graceExpiryTime = expiryDateTime ? addMinutes(expiryDateTime, effectiveGrace) : null;

const { canStart, canResume, isExpired, hasStarted } = useMemo(() => {
  const normalizedStatus = getCurrentStatusOfAssessmentResp?.attemptStatus ?? "NOT_STARTED";
  const currentTime = new Date();

  let canStart = false;
  let canResume = false;
  let isExpired = false;
  let hasStarted = false;

  if (startDateTimeBtn && expiryDateTime) {
    const graceMinutes = getCurrentStatusOfAssessmentResp?.gracePeriod
      ? Number(getCurrentStatusOfAssessmentResp.gracePeriod)
      : 5;

    const startPlusGrace = addMinutes(startDateTimeBtn, graceMinutes);

    canStart = normalizedStatus === "NOT_STARTED" && isBefore(currentTime, expiryDateTime);
    hasStarted = normalizedStatus === "IN_PROGRESS" || isAfter(currentTime, startPlusGrace);

    canResume = normalizedStatus === "IN_PROGRESS" && isBefore(currentTime, expiryDateTime);
    isExpired = isAfter(currentTime, expiryDateTime);
  }

  return { canStart, canResume, isExpired, hasStarted };
}, [getCurrentStatusOfAssessmentResp?.attemptStatus, startDateTimeBtn, expiryDateTime]);

  const canShowStartButton = timeLeft !== null && timeLeft <= 7200 && timeLeft >= 0;
  const utcStartDate = `${getStudentAssessmentsListByIdResp?.startDate}T${getStudentAssessmentsListByIdResp?.startTime}Z`;
const utcStartDateTime = new Date(
  `${getStudentAssessmentsListByIdResp?.startDate}T${getStudentAssessmentsListByIdResp?.startTime}Z`
);

const [preStartCountdown, setPreStartCountdown] = useState<number | null>(null);

useEffect(() => {
  if (!utcStartDateTime) return;

  const calculateCountdown = () => {
    const now = new Date();
    const diffMs = utcStartDateTime.getTime() - now.getTime();
    const diffSec = Math.max(Math.floor(diffMs / 1000), 0);
    return diffSec > 0 ? diffSec : null;
  };

  setPreStartCountdown(calculateCountdown());

  const timer = setInterval(() => {
    const countdown = calculateCountdown();
    setPreStartCountdown(countdown);
    
    if (countdown === null || countdown === 0) {
      clearInterval(timer);
    }
  }, 1000);

  return () => clearInterval(timer);
}, [utcStartDateTime]);

const formatCountdown = (sec: number) => {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

  return (
    <div className="page-content lms-student-test-module-container">
      <div className="container-fluid">
        <BreadCrumb pageTitle="Student Assessment"></BreadCrumb>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex align-items-center">
                  <div className="avatar-md mb-md-0 mb-4 me-4">
                    <div className="avatar-title bg-white rounded-circle">
                      <MathsSVG className="avatar-sm" />
                    </div>
                  </div>
                  <div className="tw-flex tw-items-center">
                    <h4 className="mb-1 me-3">{getStudentAssessmentsListByIdResp?.assessmentName}</h4>
                    <span className="tw-px-2 tw-py-1 tw-bg-green-100 tw-text-green-600 tw-rounded tw-border tw-border-green-200 tw-text-xs">
                      {getStudentAssessmentsListByIdResp?.assessmentType}
                    </span>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="hstack gap-2 flex-wrap">
                    <div>
                      <span className="me-2 text-muted">Subject:</span>
                      <span>
                        {getStudentAssessmentsListByIdResp?.subjectName}
                      </span>
                    </div>

                    <div className="vr"></div>

                    <div>
                      <span className="me-2 text-muted">Class/Section:</span>
                      <span>
                        {getStudentAssessmentsListByIdResp?.className}
                      </span>
                    </div>
                    <div className="vr"></div>

                    <div>
                      <span className="me-2 text-muted">Exam Date & Time:</span>
                      <span>
                        {getDateWithTimeFormat(utcStartDate)}
                      </span>
                    </div>
                    <div className="vr"></div>

                    <div className="tw-flex tw-items-center">
                      <span className="me-2 text-muted">
                        <HugeiconsIcon
                          icon={Clock01Icon}
                          size={18}
                          className="me-2"
                        />
                        Duration:
                      </span>
                      <span>
                        {getStudentAssessmentsListByIdResp?.duration != null
                          ? (formatMinutesToDuration(getStudentAssessmentsListByIdResp.duration) || 0)
                          : 0}
                      </span>
                    </div>
                    <div className="vr"></div>
                    <div>
                      <span className="me-2 text-muted">Total Marks:</span>
                      <span>
                        {getStudentAssessmentsListByIdResp?.totalMarks ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body p-0">
                <div className="row w-100 mx-auto my-4">
                  <div className="col-12 col-lg-6 d-grid">
                    <div className="card border !tw-shadow-sm">
                      <div className="card-body">
                        <h4 className="tw-mb-3">Instructions for Student</h4>
                        <ol
                          className="tw-grid tw-gap-3"
                          style={{ listStyleType: "decimal" }}
                        >
                          <li>
                            The test will open in fullscreen mode. Do not exit
                            fullscreen or switch tabs/apps.
                          </li>
                          <li>
                            Do not reload or close the page — doing so will end
                            your exam session.
                          </li>
                          <li>
                            Right-click, copy-paste, and Dev Tools (F12/Inspect)
                            are disabled.
                          </li>
                          <li>
                            The timer is server-controlled — once started, it
                            will not pause until the exam ends.
                          </li>
                          <li>
                            Answers auto-save every few seconds and will be
                            auto-submitted when time ends.
                          </li>
                          <li>
                            If you disconnect, the test will resume
                            automatically when your connection is restored.
                          </li>
                          <li>
                            If you face issues (like screen freeze), do not
                            reload — continue, and inform your teacher after the
                            exam.
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 d-grid">
                    <div className="card border !tw-shadow-sm">
                      <div className="card-body">
                        <h4 className="tw-mb-3">System Readiness Checklist</h4>
                        <ul className="list-unstyled mb-0">
                          <li className="d-flex align-items-center py-2">
                            <div className="d-flex align-items-center gap-2 w-50">
                              <HugeiconsIcon
                                icon={CheckmarkCircle02SolidIcon}
                                size={18}
                                className={isOnline ? "text-success" : "text-danger"}
                              />
                              <span className="text-dark">
                                Internet Connectivity
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="mx-2">:</span>
                              <span
                                className={`tw-px-2 tw-py-1 tw-rounded tw-border tw-text-xs ${isOnline
                                  ? 'tw-bg-green-100 tw-text-green-600 tw-border-green-200'
                                  : 'tw-bg-red-100 tw-text-red-600 tw-border-red-200'
                                  }`}
                              >
                                {isOnline ? 'Connected' : 'Disconnected'}
                              </span>
                            </div>
                          </li>

                          <li className="d-flex align-items-center py-2">
                            <div className="d-flex align-items-center gap-2 w-50">
                              <HugeiconsIcon
                                icon={CheckmarkCircle02SolidIcon}
                                size={18}
                                className={browserVersion ? "text-success" : "text-danger"}
                              />
                              <span className="text-dark">Browser Version</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="mx-2">:</span>
                              <span>{browserVersion || "Not Detected"}</span>
                            </div>
                          </li>

                          <li className="d-flex align-items-center py-2">
                            <div className="d-flex align-items-center gap-2 w-50">
                              <HugeiconsIcon
                                icon={CheckmarkCircle02SolidIcon}
                                size={18}
                                className={screenSize ? "text-success" : "text-danger"}
                              />
                              <span className="text-dark">Screen Size</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="mx-2">:</span>
                              <span>{screenSize || "Not Detected"}</span>
                            </div>
                          </li>

                          <li className="d-flex align-items-center py-2">
                            <div className="d-flex align-items-center gap-2 w-50">
                              <HugeiconsIcon
                                icon={CheckmarkCircle02SolidIcon}
                                size={18}
                                className={getDeviceStatusClass()}
                              />
                              <span className="text-dark">
                                Keyboard/Mouse Active
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="mx-2">:</span>
                              <span>{getDeviceStatus()}</span>
                            </div>
                          </li>

                          <li className="d-flex align-items-center py-2">
                            <div className="d-flex align-items-center gap-2 w-50">
                              <HugeiconsIcon
                                icon={CheckmarkCircle02SolidIcon}
                                size={18}
                                className={getNetworkSpeedIconClass()}
                              />
                              <span className="text-dark">Network Speed</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="mx-2">:</span>
                              {renderNetworkSpeedBadge()}
                            </div>
                          </li>

                          <li className="d-flex align-items-center py-2">
                            <div className="d-flex align-items-center gap-2 w-50">
                              <HugeiconsIcon
                                icon={CheckmarkCircle02SolidIcon}
                                size={18}
                                className="text-muted"
                              />
                              <span className="text-dark">Audio Device</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="mx-2">:</span>
                              <span>Working</span>
                            </div>
                          </li>

                          <li className="d-flex align-items-center py-2">
                            <div className="d-flex align-items-center gap-2 w-50">
                              <HugeiconsIcon
                                icon={CheckmarkCircle02SolidIcon}
                                size={18}
                                className="text-muted"
                              />
                              <span className="text-dark">
                                Camera (optional)
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="mx-2">:</span>
                              <span>Not Required</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="mx-4">
                    {getStudentAssessmentsListByIdResp?.attemptStatus === "SUBMITTED" || getCurrentStatusOfAssessmentResp?.attemptStatus === "EVALUATED" || isExpired ? null : (
                      <div>
                        <InputCheckbox
                          name="instructionsConfim"
                          value={agree}
                          onChange={() => setAgree(!agree)}
                          formgroupClassName="mb-0"
                          isDisabled={(preStartCountdown !== null && preStartCountdown > 0)}
                          labelName="I have read and understood the above instructions"
                        />
                      </div>
                    )}
                  </div>

                </div>
              </div>
              <div className="card-footer">
                <div className="d-flex align-items-center justify-content-center">
                  {preStartCountdown !== null ? (
                    <p className="text-warning mt-2 fw-bold">
                      Assessment starts in {formatCountdown(preStartCountdown)}
                    </p>
                  ) : getCurrentStatusOfAssessmentResp?.attemptStatus === "SUBMITTED"  || getCurrentStatusOfAssessmentResp?.attemptStatus === "EVALUATED" ? (
                    <span className="text-success fw-semibold">Assessment already Submitted</span>
                  ) : canStart ? (
                    <button className="btn btn-success text-uppercase px-4 me-3" onClick={startTest}  disabled={!agree}>
                      Start Test
                    </button>
                  ) : canResume ? (
                    <button className="btn btn-success text-uppercase px-4" onClick={resumeTest}  disabled={!agree}>
                      Resume Test
                    </button>
                  ) : isExpired ? (
                    !getCurrentStatusOfAssessmentResp?.attemptStatus ||
                      getCurrentStatusOfAssessmentResp?.attemptStatus === "NOT_STARTED" ? (
                      <span className="text-warning fw-semibold">Cannot Attempt Now</span>
                    ) : (
                      <span className="text-warning fw-semibold">Not Submitted</span>
                    )
                  ) : hasStarted ? (
                    <span className="text-info fw-semibold">Assessment Already Started</span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentInstructions;
