import { shallowEqual } from "react-redux";
import { default as ApproveSvg } from "../../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

const SubmissionSuccessModal = ({ studentDetails, submitAssessmentResp, parentChildrensResp }) => {
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
        console.log("Not in fullscreen mode");
      }
    } catch (error) {
      console.log("Exit fullscreen failed:", error);
    }
  }

  function backToTest() {
    history.push("/student-assessments");
    exitFullScreen()
  }

  const currentChild = parentChildrensResp?.find(
    (child: any) => child.childId === studentDetails?.childId
  );

  const timefunction = (utcDateString?: string) => {
    if (!utcDateString) return "N/A";

    const safeDateString = utcDateString.length > 23 ? utcDateString.slice(0, 23) : utcDateString;

    const date = new Date(safeDateString + "Z"); // force UTC

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
      .format(date)
      .replace(",", " /");
  };

  return (
    <div className="row d-flex align-items-center justify-content-center tw-h-full">
      <div className="col-12 col-md-6 col-lg-4 col-xxl-4">
        <div className="card text-center overflow-hidden" style={{ margin: "0 auto" }} ref={containerRef}>
          <div className="card-body py-3 px-0">
            <div className="tw-flex tw-flex-col">
              <div className="tw-flex tw-flex-col fs-14 tw-items-center tw-justify-center tw-border-b px-3 py-2">
                <div className="tw-flex tw-mb-3 justify-content-center">
                  <ApproveSvg width="52px" height="52px" fill="#0ab39c" />
                </div>
                <h4 className="mb-1">Submission successful</h4>
                <p className="mb-0 text-muted fs-12">Your answers have been recorded.</p>
              </div>
              <div className="tw-grid tw-gap-y-1 p-3">
                <div className="row tw-items-center tw-mb-1">
                  <div className="col-5 tw-text-gray-500">Student</div>
                  <div className="col-1 tw-text-gray-500 tw-text-center">:</div>
                  <div className="col fs-14 tw-text-base tw-font-medium">{currentChild?.childName}</div>
                </div>

                <div className="row tw-items-center tw-mb-1">
                  <div className="col-5 tw-text-gray-500">Student ID</div>
                  <div className="col-1 tw-text-gray-500 tw-text-center">:</div>
                  <div className="col fs-14 tw-text-base tw-font-medium">{currentChild?.childCode}</div>
                </div>

                <div className="row tw-items-center tw-mb-1">
                  <div className="col-5 tw-text-gray-500">Class / Section</div>
                  <div className="col-1 tw-text-gray-500 tw-text-center">:</div>
                  <div className="col fs-14 tw-text-base tw-font-medium">
                    {currentChild?.className} {currentChild?.sectionName ? ` / ${currentChild.sectionName}` : ""}
                  </div>
                </div>

                <div className="row tw-items-center tw-mb-1">
                  <div className="col-5 tw-text-gray-500">Attempt ID</div>
                  <div className="col-1 tw-text-gray-500 tw-text-center">:</div>
                  <div className="col fs-14 tw-text-base tw-font-medium">{submitAssessmentResp?.attemptId}</div>
                </div>

                <div className="row tw-items-center tw-mb-1">
                  <div className="col-5 tw-text-gray-500">Submitted At</div>
                  <div className="col-1 tw-text-gray-500 tw-text-center">:</div>
                  <div className="col fs-14 tw-text-base tw-font-medium">
                    {timefunction(submitAssessmentResp?.submittedDate)}
                  </div>
                </div>

                <div className="row tw-items-center tw-mb-1">
                  <div className="col-5 tw-text-gray-500">Result publication</div>
                  <div className="col-1 tw-text-gray-500 tw-text-center">:</div>
                  <div className="col fs-14 tw-text-base tw-font-medium">
                    {submitAssessmentResp?.resultPublishStatus}
                  </div>
                </div>
              </div>

              <div className="p-3 tw-border-t">
                <div className="tw-flex tw-justify-center">
                  <button className="btn btn-success" onClick={backToTest}>
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubmissionSuccessModal;