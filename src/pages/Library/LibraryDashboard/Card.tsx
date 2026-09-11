import React from "react";

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
  <>
    <div className="tw-col-span-12 md:tw-col-span-6 2xl:tw-col-span-3 tw-pr-1 stats-detailed-card">
      <div
        className="tw-relative tw-flex tw-flex-col tw-min-w-0 tw-break-words tw-mb-3 tw-px-0 tw-pb-2 tw-pt-3"
        style={{ backgroundColor: `${bgColor}`, borderRadius: "12px" }}
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
            <h6 className="tw-mr-2 tw-flex tw-items-center">{`${cardTitle} `}</h6>
          </div>
          <div className="tw-flex tw-items-center tw-justify-between" style={{ zIndex: 10 }}>
            <h4 className="">{cardCount}</h4>
          </div>
        </div>
        <div className="tw-px-2">
          <div
            className="stats-bar tw-grid tw-grid-cols-3 tw-justify-center tw-items-center tw-w-full tw-mx-auto tw-py-2"
            style={{ backgroundColor: "#fff", borderRadius: "8px" }}
          >
            <div
              className="tw-flex tw-justify-center tw-items-center stat-box"
              style={{ borderRight: `2px solid ${bgColor}` }}
            >
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full">
                <span className="tw-text-[14px] tw-inline-block">{subCountOne}</span>
                <span className="tw-mb-0 tw-text-[#6c757d] tw-text-[12px] tw-truncate tw-whitespace-nowrap tw-inline-block tw-w-full tw-text-center">
                  {subTextOne}
                </span>
              </div>
            </div>
            <div
              className="tw-flex tw-justify-center tw-items-center stat-box"
              style={{ borderRight: `2px solid ${bgColor}` }}
            >
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full">
                <span className="tw-text-[14px] tw-inline-block">{subCountTwo}</span>
                <span className="tw-mb-0 tw-text-[#6c757d] tw-text-[12px] tw-truncate tw-whitespace-nowrap tw-inline-block tw-w-full tw-text-center">
                  {subTextTwo}
                </span>
              </div>
            </div>
            <div className="tw-flex tw-justify-center tw-items-center stat-box">
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full">
                <span className="tw-text-[14px] tw-inline-block">{subCountThree}</span>
                <span className="tw-mb-0 tw-text-[#6c757d] tw-text-[12px] tw-truncate tw-whitespace-nowrap tw-inline-block tw-w-full tw-text-center">
                  {subTextThree}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default DetailCard;
