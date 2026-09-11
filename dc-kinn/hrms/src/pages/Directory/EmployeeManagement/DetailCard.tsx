import React from "react";
import classnames from "classnames";
import TotalParentsIcon from "../../../assets/imagesdps/directory/icons/total_parents.svg";


export interface IDetailCard {
  bgColor: string;
  cardTitle: string;
  cardCount: string;
  iconBgColor: string;
  iconColor: string;
  cardIcon: any;
  leftSubText : string;
  rightSubText : string;
  leftSubCount?: number;
  rightSubCount?: number
}

export const DetailCard: React.FC<IDetailCard> = ({
  bgColor,
  cardTitle,
  cardCount,
  leftSubText,
  rightSubText,
  leftSubCount,
  rightSubCount,
  cardIcon
}) => (
  <React.Fragment>
    <div className="tw-col-span-12 md:tw-col-span-6 2xl:tw-col-span-3">
      <div
        className="tw-mb-3 tw-px-0 tw-pb-2 tw-pt-3 tw-rounded-xl"
        style={{ backgroundColor: bgColor }}
      >
        <div className="tw-mb-2 tw-px-3">
          <div
            className="tw-flex tw-items-center tw-justify-center tw-mb-3 tw-w-12 tw-h-12 tw-bg-white tw-rounded-full"
          >
            <img
              src={cardIcon}
              alt="card icon"
              className="tw-object-contain"
            />
          </div>

          <div className="tw-flex tw-items-center">
            <h6 className="tw-mb-0 tw-mr-2 tw-flex tw-items-center">
              {cardTitle}
            </h6>
            <h4 className="tw-mb-0">{cardCount}</h4>
          </div>
        </div>

        <div className="tw-px-2">
          <div
            className="tw-grid tw-grid-cols-2 tw-items-center tw-justify-center tw-w-full tw-mx-auto tw-py-2 tw-bg-white tw-rounded-lg"
          >
            <div
              className="tw-flex tw-items-center tw-justify-center"
              style={{ borderRight: `2px solid ${bgColor}` }}
            >
              <div className="tw-flex tw-items-center tw-justify-center tw-mr-1">
                <p className="tw-mb-0 tw-text-gray-500 tw-text-xs tw-truncate tw-whitespace-nowrap">
                  {leftSubText} :
                </p>
              </div>
              <div className="tw-text-sm">{leftSubCount}</div>
            </div>

            <div className="tw-flex tw-items-center tw-justify-center">
              <div className="tw-flex tw-items-center tw-justify-center tw-mr-1">
                <p className="tw-mb-0 tw-text-gray-500 tw-text-xs tw-truncate tw-whitespace-nowrap">
                  {rightSubText} :
                </p>
              </div>
              <div className="tw-text-sm">{rightSubCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
);

export default DetailCard;
