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
        <div className="tw-w-full">
            <div className="tw-bg-white tw-rounded tw-shadow tw-mb-0">
                <div className="tw-p-4">
                    <div className="tw-flex tw-justify-between">
                        <div className="tw-overflow-hidden tw-mr-1">
                            <p
                                title={props.cardTitle}
                                className="tw-font-medium tw-text-gray-500 tw-mb-0 tw-truncate"
                            >
                                {props.cardTitle}
                            </p>

                            <h2 className="tw-mt-2 tw-font-semibold tw-text-2xl">
                                <span>
                                    {props.cardCount}
                                </span>
                            </h2>
                        </div>

                        <div>
                            <div className="tw-w-10 tw-h-10 tw-flex-shrink-0">
                                <span
                                    className={classnames(
                                        "tw-flex tw-items-center tw-justify-center tw-p-2 tw-rounded-full tw-text-lg",
                                        props.iconBgColor
                                    )}
                                >
                                    <img
                                        className="tw-w-full tw-h-full tw-object-contain"
                                        src={props.cardIcon}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment >
)


export default DetailCard;