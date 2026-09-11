import {
  PencilIcon,
  ClockIcon,
  PlayIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";

export const analyticsList = [
  {
    id: "total",
    label: "Total",
    value: "12",
    icon: PencilIcon,
    bgColor: "#E3F2FD",
    textColor: "#0D47A1",
  },
  {
    id: "published",
    label: "Published",
    value: "5",
    icon: ClockIcon,
    bgColor: "#E8F5E9",
    textColor: "#1B5E20",
  },
  {
    id: "inReview",
    label: "In Review",
    value: "18",
    icon: ClockIcon,
    bgColor: "#FCE4EC",
    textColor: "#AD1457",
  },
  {
    id: "inSetup",
    label: "In Setup",
    value: "8",
    icon: PlayIcon,
    bgColor: "#EDE7F6",
    textColor: "#4527A0",
  },
];

const CourseDirectorStats = () => {
  return (
    <div className="row g-3 mb-4">
      {analyticsList.map((item) => {
        return (
          <div className="col-12 col-md-6 col-lg-3">
            <div
              className="card mb-0 tw-justify-self-stretch"
              style={{
                backgroundColor: `${item.bgColor}`,
              }}
            >
              <div className="card-body py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="tw-text-[22px] fw-semibold mb-0">
                    {item.value}
                  </p>
                  <div
                    className="bg-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "38px",
                      height: "38px",
                      border: `0.4px solid ${item.textColor}`,
                    }}
                  >
                    <HugeiconsIcon icon={item.icon} className="" size={22} />
                  </div>
                </div>
                <div className="w-100 text-truncate">
                  <p
                    className="mb-0 text-truncate w-100"
                    style={{ color: `${item.textColor}` }}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CourseDirectorStats;
