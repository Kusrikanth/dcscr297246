import {
  HugeiconsIcon
} from "@hugeicons/react";
import {
  CheckmarkSquare03Icon,
  CheckmarkCircle03Icon, CancelCircleIcon
} from "@hugeicons-pro/core-stroke-standard";

const cardList = [
  {
    cardTitle: "Total",
    cardCount: "500",
    iconBgColor: "rgba(64, 81, 137, 0.85)",
    iconBg: "rgba(64, 81, 137, 0.4)",
    cardIcon: <HugeiconsIcon
      icon={CheckmarkSquare03Icon}
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
];

const BulkUploadImportStatsList = () => {
  return (
    <div className="tw-grid tw-grid-cols-12 tw-gap-3 bulk-upload-import-stats-list mb-5">
      {cardList.map((cardEle) => (
        <BulkUploadImportStatsCard
          cardEle={cardEle}
          key={cardEle.cardTitle}
        ></BulkUploadImportStatsCard>
      ))}
    </div>
  );
};

export default BulkUploadImportStatsList;

const BulkUploadImportStatsCard = ({ cardEle }: any) => {
  return (
    <div className="tw-col-span-12 md:tw-col-span-4">
      <div
        className="tw-bg-white tw-rounded-xl tw-border tw-p-4"
        style={{
          borderColor: cardEle.iconBgColor,
        }}
      >
        <div className="tw-flex tw-justify-between tw-items-center">

          <div className="tw-overflow-hidden tw-pr-2">
            <h2 className="tw-text-2xl tw-font-semibold tw-mb-1">
              <span>{cardEle.cardCount}</span>
            </h2>

            <p className="tw-text-sm tw-font-medium tw-text-gray-500 tw-mb-0 tw-truncate">
              {cardEle.cardTitle}
            </p>
          </div>

          <div
            className="tw-rounded-full tw-flex tw-items-center tw-justify-center tw-w-12 tw-h-12"
            style={{ backgroundColor: cardEle.iconBg }}
          >
            <div
              className="tw-rounded-full tw-flex tw-items-center tw-justify-center tw-w-9 tw-h-9 tw-text-lg"
              style={{ backgroundColor: cardEle.iconBgColor }}
            >
              {cardEle.cardIcon}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
