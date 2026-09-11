import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon as CheckmarkCircle02SolidIcon } from "@hugeicons-pro/core-solid-standard";

const StudentAssessmentMonitorModal = ({ toggle, data }) => {
  return (
    <div style={{ padding: "1.25rem" }}>
      <div className="row mb-4">
        <div className="col-12">
          <ul className="list-unstyled mb-0">
            <li className="d-flex align-items-center py-2">
              <div className="d-flex align-items-center gap-2 w-50">
                <HugeiconsIcon
                  icon={CheckmarkCircle02SolidIcon}
                  size={18}
                  className="text-success"
                />
                <span className="text-dark">Internet Connectivity</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="mx-2">:</span>
                <span className="text-success">Connected</span>
              </div>
            </li>

            <li className="d-flex align-items-center py-2">
              <div className="d-flex align-items-center gap-2 w-50">
                <HugeiconsIcon
                  icon={CheckmarkCircle02SolidIcon}
                  size={18}
                  className="text-success"
                />
                <span className="text-dark">Browser Version</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="mx-2">:</span>
                <span>{data?.browserAgent} {data?.browserVersion}</span>
              </div>
            </li>

            <li className="d-flex align-items-center py-2">
              <div className="d-flex align-items-center gap-2 w-50">
                <HugeiconsIcon
                  icon={CheckmarkCircle02SolidIcon}
                  size={18}
                  className="text-success"
                />
                <span className="text-dark">Screen Size</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="mx-2">:</span>
                <span>{data?.screenWidth} x {data?.screenHeight} </span>
              </div>
            </li>

            <li className="d-flex align-items-center py-2">
              <div className="d-flex align-items-center gap-2 w-50">
                <HugeiconsIcon
                  icon={CheckmarkCircle02SolidIcon}
                  size={18}
                  className="text-success"
                />
                <span className="text-dark">Keyboard/Mouse Active</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="mx-2">:</span>
                <span>Detected</span>
              </div>
            </li>

            <li className="d-flex align-items-center py-2">
              <div className="d-flex align-items-center gap-2 w-50">
                <HugeiconsIcon
                  icon={CheckmarkCircle02SolidIcon}
                  size={18}
                  className="text-muted"
                />
                <span className="text-dark">Network Speed</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="mx-2">:</span>
                <span>Stable (5 Mbps+)</span>
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
                <span className="text-dark">Camera (optional)</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="mx-2">:</span>
                <span>Not Required</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="d-flex ms-auto w-auto">
          <button className="btn btn-light me-3" onClick={toggle}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentAssessmentMonitorModal;
