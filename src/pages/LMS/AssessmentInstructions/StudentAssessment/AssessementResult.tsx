import congrates from "../../../../assets/imagesdps/lms/congrates.png";
import Confetti from "react-confetti";
import ResultChart from "./ResultChart";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { AttemptedQuestionStatus } from "./helper";
import { getAssessmentDuration, getDateWithTimeFormat, getDdMmYyyyFormatFromString } from "../../../../utility/dateutility";

const resultDetails = [
  {
    label: "Time spent",
    value: "01:15:32",
  },
  {
    label: "Date submitted",
    value: "05/07/2025",
  },
];

const AssessementResult = ({ assessmentDetails, questionsList }) => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const containerRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    if (containerRef.current) {
      const { offsetHeight, offsetWidth } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);
  const correct = 7;
  const wrong = 5;
  const notAttempted = 3;

  async function exitFullScreen() {
    try {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      } else {
        console.error("Not in fullscreen mode");
      }
    } catch (error) {
      console.error("Exit fullscreen failed:", error);
    }
  }

  function backToTest() {
    history.push("/student-assessments");
    exitFullScreen()
  }

  const {
    answeredCount,
    notAnsweredCount,
    totalQuestions
  } = useMemo(() => {
    const counts = questionsList.reduce(
      (acc, q) => {
        if (
          (q.questionStatus === AttemptedQuestionStatus.ANSWERED) ||
          (q.questionStatus === AttemptedQuestionStatus.MARKED_FOR_REVIEW && q.answeredOption)
        ) {
          acc.answeredCount++;
        } else {
          acc.notAnsweredCount++;
        }
        return acc;
      },
      {
        answeredCount: 0,
        notAnsweredCount: 0,
      }
    );
    return ({
      ...counts, totalQuestions: questionsList.length
    })
  }, [questionsList]);


  const utcStartDate = `${assessmentDetails?.startDate}T${assessmentDetails?.startTime}Z`,
    utcEndDate = `${assessmentDetails?.expiryDate}T${assessmentDetails?.expiryTime}Z`;

  const readableDuration = useMemo(() => {
    if (!utcStartDate || !utcEndDate) {
      return '-'
    }
    const { days, hours, minutes, seconds } = getAssessmentDuration(utcStartDate, utcEndDate) || {};
    const parts: string[] = [];
    if (days) parts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours) parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
    if (minutes) parts.push(`${minutes} min`);
    if (seconds) parts.push(`${seconds} sec`);

    return parts.join(" ") || "-";
  }, [utcStartDate, utcEndDate]);

  return (
    <div className="row d-flex align-items-center justify-content-center tw-h-full">
      <div className="col-12 col-md-6 col-lg-4 col-xxl-3">
        <div
          className="card text-center overflow-hidden"
          style={{ margin: "0 auto" }}
          ref={containerRef}
        >
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            gravity={0.1}
            initialVelocityX={2}
            initialVelocityY={2}
            numberOfPieces={100}
            opacity={1}
            wind={0}
            recycle={false}
          ></Confetti>
          <div className="card-header">
            <div className="mb-2">
              <img
                src={congrates}
                alt="congrates-img"
                style={{ width: "42px", height: "42px" }}
              ></img>
            </div>
            <h4 className="mb-0 card-title">Submitted Successfully!</h4>
          </div>

          <div className="card-body p-3">
            <div className="d-flex justify-content-center mb-2">
              <div style={{ width: "180px", height: "180px" }}>
                <ResultChart
                  answeredCount={answeredCount}
                  notAnsweredCount={notAnsweredCount}
                  totalQuestions={totalQuestions}
                />
              </div>
            </div>

            <div className="text-start px-2 mb-3">
              <div className="d-flex justify-content-between">
                <p className="mb-0">
                  <span className="me-2">Total :</span>
                  <span className="text-primary">{totalQuestions}</span>
                </p>
                <p className="mb-0">
                  <span className="me-2">Attempted :</span>
                  <span className="text-success">{answeredCount}</span>
                </p>
                <p className="mb-0">
                  <span className="me-2">Not Attempt :</span>
                  <span className="text-danger">{notAnsweredCount}</span>
                </p>
              </div>
            </div>

            <div className="px-2 row">
              <p className="mb-0 col-6 text-end px-2">Assessment :</p>
              <p className="fw-semibold col-6 text-start px-2">
                {assessmentDetails?.assessmentName}
              </p>
            </div>
            <div className="px-2 row">
              <p className="mb-0 col-6 text-end px-2">Attempted Date :</p>
              <p className="fw-semibold col-6 text-start px-2">
                {getDateWithTimeFormat(utcStartDate)}
              </p>
            </div>
            <div className="px-2 row">
              <p className="mb-0 col-6 text-end px-2">Duration :</p>
              <p className="fw-semibold col-6 text-start px-2">
                {readableDuration}
              </p>
            </div>

            <button
              className="btn btn-outline-secondary fw-semibold px-4"
              onClick={backToTest}
            >
              Return Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessementResult;
