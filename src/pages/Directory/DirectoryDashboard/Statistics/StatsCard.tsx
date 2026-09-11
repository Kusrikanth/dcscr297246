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
    <div className="tw-col-span-12 lg:tw-col-span-6 2xl:tw-col-span-3 stats-detailed-card">
      <div
        className="detailed-card tw-relative tw-mb-2 tw-px-0 tw-pb-2 tw-pt-3 tw-rounded-xl"
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

        <div className="tw-relative tw-z-10 tw-px-4">

          <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">

            <div className="tw-flex tw-items-center tw-gap-3">
              <div
              className="tw-flex tw-items-center tw-justify-center tw-mb-2 tw-rounded-full"
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#fff",
              }}
            >
                {cardIcon}
              </div>

              <h6 className="tw-text-sm tw-font-medium tw-text-gray-800">
                {cardTitle}
              </h6>
            </div>

            <h5 className="tw-text-base tw-font-semibold tw-mb-2">
              <span
                className="tw-text-blue-600 tw-cursor-pointer hover:tw-underline"
                onClick={openModal}
              >
                {cardCount}
              </span>
            </h5>
          </div>

          <div className="tw-bg-white tw-rounded-lg tw-grid tw-grid-cols-3 tw-divide-x tw-divide-gray-200 tw-py-3">

            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-2">
              {subCountOne ? (
                <span className="tw-text-sm tw-font-medium">
                  {subCountOne}
                </span>
              ) : (
                <SkeletonLoader width="30px" />
              )}

              {subTextOne ? (
                <span className="tw-text-xs tw-text-gray-500 tw-text-center tw-truncate tw-w-full">
                  {subTextOne}
                </span>
              ) : (
                <SkeletonLoader width="60px" />
              )}
            </div>

            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-2">
              {subCountTwo ? (
                <span className="tw-text-sm tw-font-medium">
                  {subCountTwo}
                </span>
              ) : (
                <SkeletonLoader width="30px" />
              )}

              {subTextTwo ? (
                <span className="tw-text-xs tw-text-gray-500 tw-text-center tw-truncate tw-w-full">
                  {subTextTwo}
                </span>
              ) : (
                <SkeletonLoader width="60px" />
              )}
            </div>

            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-2">
              {subCountThree ? (
                <span className="tw-text-sm tw-font-medium">
                  {subCountThree}
                </span>
              ) : (
                <SkeletonLoader width="30px" />
              )}

              {subTextThree ? (
                <span className="tw-text-xs tw-text-gray-500 tw-text-center tw-truncate tw-w-full">
                  {subTextThree}
                </span>
              ) : (
                <SkeletonLoader width="60px" />
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  </React.Fragment>
);

export default DetailCard;
