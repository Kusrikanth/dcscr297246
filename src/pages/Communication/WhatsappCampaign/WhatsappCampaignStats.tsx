import React from "react";
import { SkeletonLoader } from "../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkBadge03Icon,
  Delete02StrokeStandard,
  EyeIcon,
  FilterIcon,
  PencilEdit02Icon,
  PieChartIcon,
  SentIcon,
} from "@hugeicons-pro/core-stroke-standard";

export const statsCardsData = [
  {
    bgColor: "#ebeedf",
    cardTitle: "Total Sent",
    cardCount: "256",
    cardIcon: SentIcon,
    overlayColor: "#C7D3B2",
    overlayChildColor: "#DDEABA",
  },
  {
    bgColor: "#F8EFE2",
    cardTitle: "Delivered",
    cardCount: "1198",
    cardIcon: CheckmarkBadge03Icon,
    overlayColor: "#D7C5A9",
    overlayChildColor: "#EDE0C8",
  },
  {
    bgColor: "#EFF7E2",
    cardTitle: "Read",
    cardCount: "1045",
    cardIcon: EyeIcon,
    overlayColor: "#C7D3B2",
    overlayChildColor: "#DDEABA",
  },
  {
    bgColor: "#E1E2F6",
    cardTitle: "Clicked CTA",
    cardCount: "1250",
    cardIcon: PieChartIcon,
    overlayColor: "#B0B2D4",
    overlayChildColor: "#CACBF0",
  },
];

const WhatsappCampaignStats = () => {
  return (
    <div className="row transports-statistics-container">
      {statsCardsData?.map((item: any, index: number) => (
        <DetailCard
          key={index}
          bgColor={item.bgColor}
          cardTitle={item.cardTitle}
          cardCount={item.cardCount}
          cardIcon={item.cardIcon}
          overlayColor={item.overlayColor}
          overlayChildColor={item.overlayChildColor}
        />
      ))}
    </div>
  );
};

export default WhatsappCampaignStats;

export interface IDetailCard {
  bgColor: string;
  cardTitle: string;
  cardCount: string;
  cardIcon: any;
  overlayColor?: string;
  overlayChildColor?: string;
}

export const DetailCard: React.FC<IDetailCard> = ({
  bgColor,
  cardTitle,
  cardCount,
  cardIcon,
  overlayColor,
  overlayChildColor,
}) => (
  <div className="col-12 col-lg-6 col-xxl-3 stats-detailed-card">
    <div
      className="card mb-3 px-0 pb-2 pt-3"
      style={{ backgroundColor: bgColor, borderRadius: "12px" }}
    >
      {!!overlayColor && (
        <div
          className="overlay-color !tw-top-[100%] !tw-left-0 !tw-rotate-180 !tw-translate-y-[-70%]"
          style={{
            backgroundColor: overlayColor,
          }}
        />
      )}
      {!!overlayChildColor && (
        <div
          className="overlay-child !tw-top-[100%] !tw-left-0 !tw-rotate-180 !tw-translate-y-[-70%]"
          style={{
            backgroundColor: overlayChildColor,
          }}
        />
      )}

      <div className="px-3 d-flex justify-content-between align-items-center tw-z-10">
        <div className="d-flex flex-column">
          {cardTitle ? (
            <h6 className="d-flex align-items-center tw-mb-2">{cardTitle}</h6>
          ) : (
            <SkeletonLoader width="120px" />
          )}
          <div
            className="d-flex align-item-center justify-content-between"
            style={{ zIndex: 10 }}
          >
            {cardCount ? <h4>{cardCount}</h4> : <SkeletonLoader width="40px" />}
          </div>
        </div>

        <div
          className="d-flex align-item-center justify-content-between"
          style={{ zIndex: 10 }}
        >
          <div
            className="d-flex align-items-center justify-content-center mb-3"
            style={{
              width: "48px",
              height: "48px",
            }}
          >
            <HugeiconsIcon icon={cardIcon} size={24}></HugeiconsIcon>
          </div>
        </div>
      </div>
    </div>
  </div>
);
