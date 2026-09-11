import React from "react";
import classnames from "classnames";

export interface IDetailCard {
    cardTitle: string,
    cardCount: string,
    iconBgColor: string,
    cardIcon: any,
}

export const DetailCard: React.FC<IDetailCard> = (props) => (
    <React.Fragment>
        <div className="tw-w-full ">
            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-3">
                <div className="tw-p-4">
                    <div className="tw-flex tw-items-center tw-justify-between">

                        {/* Text Section */}
                        <div>
                            <p className="tw-text-sm tw-font-medium tw-text-gray-500 tw-mb-0">
                                {props.cardTitle}
                            </p>
                            <h2 className="tw-mt-2 tw-text-2xl tw-font-semibold tw-text-gray-800">
                                <span>
                                    {props.cardCount}
                                </span>
                            </h2>
                        </div>

                        {/* Icon Section */}
                        <div className="tw-flex-shrink-0">
                            <div className="tw-h-10 tw-w-10 tw-flex tw-items-center tw-justify-center">
                                <span
                                    className={`tw-flex tw-items-center tw-justify-center tw-h-10 tw-w-10 tw-rounded-full ${props.iconBgColor}`}
                                >
                                    <img
                                        src={props.cardIcon}
                                        className="tw-h-5 tw-w-5 tw-object-contain"
                                        alt=""
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