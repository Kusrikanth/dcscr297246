import {
  HugeiconsIcon
} from "@hugeicons/react";
import {
  CheckmarkSquare03Icon, CheckmarkCircle03Icon, CancelCircleIcon,
  DatabaseIcon
} from "@hugeicons-pro/core-stroke-standard";

const cardList = [
  {
    cardTitle: "Total",
    cardCount: "500",
    iconBgColor: "rgba(64, 81, 137, 0.85)",
    iconBg: "rgba(64, 81, 137, 0.4)",
    cardIcon: <HugeiconsIcon icon={CheckmarkSquare03Icon}
      size={18} />,
  },
  {
    cardTitle: "Validation Passed",
    cardCount: "480",
    iconBgColor: "rgba(10, 179, 156, 0.85)",
    iconBg: "rgba(10, 179, 156, 0.4)",
    cardIcon: <HugeiconsIcon icon={CheckmarkCircle03Icon} size={18} />,
  },
  {
    cardTitle: "Validation Failed",
    cardCount: "20",
    iconBgColor: "rgba(240, 101, 72, 0.85)",
    iconBg: "rgba(240, 101, 72, 0.4)",
    cardIcon: <HugeiconsIcon icon={CancelCircleIcon} size={18} />,
  },
  {
    cardTitle: "Mandatory data missing",
    cardCount: "0",
    iconBgColor: "rgba(56, 62, 71, 0.85)",
    iconBg: "rgba(56, 62, 71, 0.4)",
    cardIcon: <HugeiconsIcon icon={DatabaseIcon} size={18} />,
  },
  {
    cardTitle: "Refence data Not Exists",
    cardCount: "0",
    iconBgColor: "rgba(247, 184, 75, 0.85)",
    iconBg: "rgba(247, 184, 75, 0.4)",
    cardIcon: <HugeiconsIcon icon={DatabaseIcon} size={18} />,
  },
];

const BulkUploadRepair = () => {
  return (
    <div className="bulk-upload-repair-container">
      <div className="status-card-container">
        {cardList.map((cardEle) => (
          <BulkUploadRepairCard
            cardEle={cardEle}
            key={cardEle.cardTitle}
          ></BulkUploadRepairCard>
        ))}
      </div>

      <div className="tw-my-5">
        <p className="tw-mb-0 tw-text-blue-500 tw-text-center">
          Data Validation Complete. You may now save and proceed.
        </p>
      </div>

      <div className="tw-flex tw-justify-end tw-mt-5">
        <button className="btn btn-outline-primary tw-px-4 tw-me-2">Previous</button>
        <button className="btn btn-success tw-px-4">Next</button>
      </div>
    </div>
  );
};

export default BulkUploadRepair;

const BulkUploadRepairCard = ({ cardEle }: any) => {
  return (
    <div className="card-container">
      <div
        className="card mb-0"
        style={{
          boxShadow: "none",
          border: `1px solid ${cardEle.iconBgColor}`,
        }}
      >
        <div className="card-body px-2">
          <div className="tw-flex tw-justify-between tw-items-center">
            <div className="overflow-hidden tw-me-1" style={{ width: "70%" }}>
              <h2 className="tw-mb-1 ff-secondary fw-semibold">
                <span className="counter-value">{cardEle.cardCount}</span>
              </h2>
              <p className="fw-medium tw-text-gray-500 tw-mb-0 text-truncate">
                {cardEle.cardTitle}
              </p>
            </div>

            <div
              className="icon-container rounded-circle"
              style={{ backgroundColor: `${cardEle.iconBg}` }}
            >
              <div className="avatar-xs tw-flex-shrink-0">
                <span
                  className="avatar-title tw-p-2 rounded-circle fs-4"
                  style={{ backgroundColor: `${cardEle.iconBgColor}` }}
                >
                  {cardEle.cardIcon}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
