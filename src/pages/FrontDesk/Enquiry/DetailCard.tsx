import React from "react";
import classnames from "classnames";

export interface IDetailCard {
    cardTitle: string,
    cardCount: string,
    iconBgColor: string,
    iconColor: string,
    percentageValue: string,
    comparisonText: string,
    cardIcon: any,
    increased: boolean,
}

export const DetailCard: React.FC<IDetailCard> = (props) => (
    <React.Fragment>
        <div className="tw-col-span-3">
            <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">
                <div className="tw-p-4">
                    <div className="tw-flex tw-justify-between tw-items-start">
                        {/* Left content */}
                        <div>
                            <p className="tw-text-sm tw-font-medium tw-text-gray-500 tw-mb-0">
                                {props.cardTitle}
                            </p>

                            <h2 className="tw-mt-2 tw-text-2xl tw-font-semibold tw-text-gray-900">
                                <span className="counter-value">
                                    {props.cardCount}
                                </span>
                            </h2>
                        </div>

                        {/* Icon */}
                        <div className="tw-flex-shrink-0">
                            <div className="tw-w-10 tw-h-10">
                                <span
                                    className={classnames(
                                        "tw-flex tw-items-center tw-justify-center tw-w-full tw-h-full tw-rounded-full tw-p-2",
                                        props.iconBgColor
                                    )}
                                >
                                    <img
                                        src={props.cardIcon}
                                        alt="card-icon"
                                        className="tw-h-full tw-w-full tw-object-contain"
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* <p className="mb-0 fs-13 text-muted"><span className={classnames("badge bg-light mb-0 ", (props.increased ? "text-success" : "text-danger"))}>
                        <i className={classnames("align-middle", (props.increased ? "ri-arrow-up-line" : "ri-arrow-down-line"))}></i> {props.percentageValue}%
                    </span>{props.comparisonText}</p> */}
                </div>
            </div>
        </div>
    </React.Fragment >
)


export default DetailCard;