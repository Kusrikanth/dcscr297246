import React from "react";
import { SkeletonLoader } from "../../../../Components/Common";

export interface IDetailCard {
  bgColor: string;
  borderColor: string;
  cardTitle: string;
  cardCount: string;
  iconBgColor: string;
  iconColor: string;
  cardIcon: any;
  overlayColor?: string;
  overlayChildColor?: string;
}

export const DetailCard: React.FC<IDetailCard> = ({
  bgColor,
  borderColor,
  iconBgColor,
  cardTitle,
  cardCount,
  cardIcon,
}) => (
  <React.Fragment>
    <div className="tw-col-span-12 md:tw-col-span-6 2xl:tw-col-span-3 stats-detailed-card">
      <div
        className="
      tw-bg-white tw-mb-3 tw-px-0 tw-pb-2 tw-pt-3
      tw-rounded-xl tw-border detailed-card
    "
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
        }}
      >
        <div className="tw-mb-2 tw-px-3 tw-flex">
          <div className="tw-flex tw-items-center tw-justify-between">
            {/* Icon */}
            <div
              className="
            tw-flex tw-items-center tw-justify-center
            tw-me-3
          "
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: iconBgColor,
                borderRadius: "9999px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              {cardIcon}
            </div>
          </div>

          <div className="tw-flex tw-items-center tw-justify-between tw-flex-1">
            <h6 className="tw-mb-0 tw-flex tw-items-center tw-me-2 tw-pe-2 tw-text-base">
              {cardTitle}
            </h6>
            <h5 className="tw-mb-0 tw-ms-3 tw-font-bold tw-text-xl">
              {cardCount}
            </h5>
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
);

export default DetailCard;
