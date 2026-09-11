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
        <div className="tw-col-span-12 sm:tw-col-span-6 md:tw-col-span-3">
            <div className="tw-bg-white tw-rounded-lg tw-shadow">
                <div className="tw-p-4">
                    <div className="tw-flex tw-justify-between">
                        {/* Left content */}
                        <div>
                            <p className="tw-font-medium tw-text-gray-500 tw-mb-0">
                                {props.cardTitle}
                            </p>
                            <h2 className="tw-mt-2 tw-font-semibold tw-text-2xl">
                                <span>
                                    {props.cardCount}
                                </span>
                            </h2>
                        </div>

                        {/* Icon */}
                        <div className="tw-flex-shrink-0">
                            <div className="tw-h-10 tw-w-10 tw-flex tw-items-center tw-justify-center">
                                <span
                                    className={classnames(
                                        "tw-flex tw-items-center tw-justify-center tw-rounded-full tw-p-2 tw-text-lg",
                                        props.iconBgColor
                                    )}
                                >
                                    <img
                                        className="tw-h-full tw-w-full tw-object-contain"
                                        src={props.cardIcon}
                                        alt="icon"
                                    />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Footer text */}
                    <p className="tw-mt-2 tw-mb-0 tw-text-sm tw-text-gray-500">
                        <span
                            className={classnames(
                                "tw-inline-flex tw-items-center tw-bg-gray-100 tw-rounded tw-px-2 tw-py-0.5",
                                props.increased ? "tw-text-green-600" : "tw-text-red-600"
                            )}
                        >
                            <i
                                className={classnames(
                                    "tw-mr-1",
                                    props.increased ? "ri-arrow-up-line" : "ri-arrow-down-line"
                                )}
                            ></i>
                            {props.percentageValue}%
                        </span>
                        {props.comparisonText}
                    </p>
                </div>
            </div>
        </div>
    </React.Fragment >
)


export default DetailCard;