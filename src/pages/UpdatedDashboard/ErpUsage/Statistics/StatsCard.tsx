import React from "react";
import { SkeletonLoader } from "../../../../Components/Common";

export interface IDetailCard {
  bgColor: string;
  cardTitle: string;
  cardCount: string;
  iconBgColor: string;
  iconColor: string;
  cardIcon: any;
  subTextOne: string;
  subTextTwo: string;
  subTextThree: string;
  subCountOne: string;
  subCountTwo: string;
  subCountThree: string;
  overlayColor?: string;
  overlayChildColor?: string;
  openModal?: any;
}

export const DetailCard: React.FC<IDetailCard> = ({
  bgColor,
  cardTitle,
  cardCount,
  subTextOne,
  subTextTwo,
  subTextThree,
  subCountOne,
  subCountTwo,
  subCountThree,
  cardIcon,
  overlayColor,
  overlayChildColor,
  openModal,
}) => (
  <React.Fragment>
    <div className="tw-col-span-12 lg:tw-col-span-6 2xl:tw-col-span-4 stats-detailed-card">
      <div
        className="detailed-card card tw-mb-3 tw-px-0 tw-pb-2 tw-pt-3 !tw-rounded-xl"
        style={{ backgroundColor: `${bgColor}` }}
      >
        <div
          className="overlay-color"
          style={{ backgroundColor: `${overlayColor}` }}
        ></div>
        <div
          className="overlay-child"
          style={{
            backgroundColor: `${overlayChildColor}`,
          }}
        ></div>
        <div className="tw-px-3 tw-flex tw-justify-between tw-items-center">
          <div className="tw-flex tw-items-center tw-gap-2">
            <div
              className="tw-flex tw-items-center tw-justify-center tw-mb-3"
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#fff",
                borderRadius: "50%",
              }}
            >
              {cardIcon}
            </div>
            <h6 className="tw-me-2 tw-flex tw-items-center">{`${cardTitle} `}</h6>
          </div>
          <div
            className="tw-flex tw-items-center tw-justify-between" style={{ zIndex: "10" }}
          >
            <h5 className="tw-mb-0 tw-font-semibold">
              <span className="tw-text-info tw-cursor-pointer" onClick={openModal}>
                {cardCount}
              </span>
            </h5>
          </div>
        </div>
        <div className="tw-px-2">
          <div
            className="stats-bar tw-grid tw-grid-cols-3 tw-items-center tw-w-full tw-mx-auto tw-py-2 tw-bg-white tw-rounded-lg"
            style={{ backgroundColor: "#fff", borderRadius: "8px" }}
          >
            <div
              className="tw-flex tw-justify-center tw-items-center stat-box"
              style={{ borderRight: `2px solid ${bgColor}` }}
            >
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full">
                {subCountOne ? (
                  <span className="fs-14 tw-inline-block">{subCountOne}</span>
                ) : (
                  <SkeletonLoader width="30px" />
                )}
                {subTextOne ? (
                  <span className="tw-mb-0 tw-text-muted-foreground fs-12 tw-truncate tw-overflow-hidden tw-whitespace-nowrap tw-inline-block tw-w-full tw-text-center">
                    {subTextOne}
                  </span>
                ) : (
                  <SkeletonLoader width="60px" />
                )}
              </div>
            </div>
            <div
              className="tw-flex tw-justify-center tw-items-center stat-box"
              style={{ borderRight: `2px solid ${bgColor}` }}
            >
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full">
                {subCountTwo ? (
                  <span className="fs-14 tw-inline-block">{subCountTwo}</span>
                ) : (
                  <SkeletonLoader width="30px" />
                )}
                {subTextTwo ? (
                  <span className="tw-mb-0 tw-text-muted-foreground fs-12 tw-truncate tw-overflow-hidden tw-whitespace-nowrap tw-inline-block tw-w-full tw-text-center">
                    {subTextTwo}
                  </span>
                ) : (
                  <SkeletonLoader width="60px" />
                )}
              </div>
            </div>
            <div className="tw-flex tw-justify-center tw-items-center stat-box">
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full">
                {subCountThree ? (
                  <span className="fs-14 tw-inline-block">{subCountThree}</span>
                ) : (
                  <SkeletonLoader width="30px" formgroupClassName="tw-mb-0 !tw-mt-0" />
                )}
                {subTextThree ? (
                  <span className="tw-mb-0 tw-text-gray-500 tw-text-xs tw-truncate tw-overflow-hidden tw-text-nowrap tw-inline-block tw-w-full tw-text-center">
                    {subTextThree}
                  </span>
                ) : (
                  <SkeletonLoader width="60px" formgroupClassName="tw-mb-0 !tw-mt-0" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
);

export default DetailCard;
