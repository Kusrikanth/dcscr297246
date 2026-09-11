import { HugeiconsIcon } from "@hugeicons/react";
import { Time02Icon } from "@hugeicons-pro/core-stroke-standard";
import { useOneMinuteCountdown } from "../../../../utility/commonutility";
import { useEffect } from "react";

const FullScreenModal = ({ enterFullScreen, closeFullScreenModal }) => {
  const { timeLeft, formatted } = useOneMinuteCountdown(true, 15);
  useEffect(() => {
    if (timeLeft === 0) {
      closeFullScreenModal();

      const resumeHandler = async () => {
        await enterFullScreen();
        document.removeEventListener("click", resumeHandler);
        document.removeEventListener("keydown", resumeHandler);
      };

      document.addEventListener("click", resumeHandler);
      document.addEventListener("keydown", resumeHandler);
    }
  }, [timeLeft, closeFullScreenModal, enterFullScreen]);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.warn("Tab switched! Pausing assessment...");
      } else {

        const resumeHandler = async () => {
          await enterFullScreen();
          closeFullScreenModal();
          document.removeEventListener("click", resumeHandler);
          document.removeEventListener("keydown", resumeHandler);
        };

        document.addEventListener("click", resumeHandler);
        document.addEventListener("keydown", resumeHandler);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enterFullScreen, closeFullScreenModal]);

  return (
    <>
      <div className="modal-body p-0 pt-2">
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center pb-0 p-3">
          <div className="mb-3 text-center">
            <div className="tw-flex tw-mb-3 justify-content-center">
              <HugeiconsIcon icon={Time02Icon} size={40} className="me-2" />
            </div>
            <p className="mb-2 text-danger fw-medium">
              You must be in full screen mode to attempt the assessment.
            </p>
            {/* <p className="mb-0 text-muted">
              Your test will resume in{" "}
              <span className="fs-20">{formatted}</span>
            </p> */}
          </div>
        </div>
        <div className="px-3 pb-4 pt-0">
          <div className="tw-flex tw-justify-center">
            <button
              id="backToAssessmentBtn"
              className="btn btn-success"
              onClick={async () => {
                await enterFullScreen();
                closeFullScreenModal();
              }}
            >
              Back to Assessment
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default FullScreenModal;
