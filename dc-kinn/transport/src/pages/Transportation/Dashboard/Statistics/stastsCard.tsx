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
}) => (
  <React.Fragment>
    <div className="tw-col-span-12 lg:tw-col-span-6 2xl:tw-col-span-3 stats-detailed-card">
      <div
        className="detailed-card tw-relative tw-mb-3 tw-px-0 tw-pb-2 tw-pt-3 tw-rounded-xl"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="overlay-color"
          style={{ backgroundColor: overlayColor }}
        ></div>
        <div
          className="overlay-child"
          style={{ backgroundColor: overlayChildColor }}
        ></div>

        <div className="tw-relative tw-z-10 tw-px-3 tw-flex tw-justify-between tw-items-center">
          <div className="tw-flex tw-items-center tw-gap-2">
            <div
              className="tw-flex tw-items-center tw-justify-center tw-mb-3 tw-rounded-full"
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#fff",
              }}
            >
              {cardIcon}
            </div>

            <h6 className="tw-me-2 tw-flex tw-items-center">
              {cardTitle}
            </h6>
          </div>

          <div className="tw-flex tw-items-center tw-justify-between tw-z-10">
            <h4>{cardCount}</h4>
          </div>
        </div>

        <div className="tw-px-2">
          <div
            className="tw-relative tw-z-10 tw-grid tw-grid-cols-3 tw-items-center tw-w-full tw-mx-auto tw-py-2 tw-rounded-lg"
            style={{ backgroundColor: "#fff" }}
          >
            <div
              className="tw-flex tw-justify-center tw-items-center"
              style={{ borderRight: `2px solid ${bgColor}` }}
            >
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full">
                {subCountOne ? (
                  <span className="tw-text-sm">{subCountOne}</span>
                ) : (
                  <SkeletonLoader width="30px" />
                )}

                {subTextOne ? (
                  <span className="tw-text-xs tw-text-muted tw-truncate tw-w-full tw-text-center tw-text-gray-500">
                    {subTextOne}
                  </span>
                ) : (
                  <SkeletonLoader width="60px" />
                )}
              </div>
            </div>
            <div
              className="tw-flex tw-justify-center tw-items-center"
              style={{ borderRight: `2px solid ${bgColor}` }}
            >
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full">
                {subCountTwo ? (
                  <span className="tw-text-sm">{subCountTwo}</span>
                ) : (
                  <SkeletonLoader width="30px" />
                )}

                {subTextTwo ? (
                  <span className="tw-text-xs tw-text-muted tw-truncate tw-w-full tw-text-center tw-text-gray-500">
                    {subTextTwo}
                  </span>
                ) : (
                  <SkeletonLoader width="60px" />
                )}
              </div>
            </div>

            <div className="tw-flex tw-justify-center tw-items-center">
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full">
                {subCountThree ? (
                  <span className="tw-text-sm">{subCountThree}</span>
                ) : (
                  <SkeletonLoader width="30px" formgroupClassName="mb-0" />
                )}

                {subTextThree ? (
                  <span className="tw-text-xs tw-text-muted tw-truncate tw-w-full tw-text-center tw-text-gray-500">
                    {subTextThree}
                  </span>
                ) : (
                  <SkeletonLoader width="60px" formgroupClassName="mb-0" />
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
