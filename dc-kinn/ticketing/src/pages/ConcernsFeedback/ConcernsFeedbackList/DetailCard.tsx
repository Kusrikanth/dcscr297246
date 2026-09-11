import React from "react";
import classnames from "classnames";

export interface IDetailCard {
    cardTitle: string,
    cardCount: string,
    iconBgColor: string,
    iconColor: string,
    cardIcon: any,
    increased: boolean,
}

export const DetailCard: React.FC<IDetailCard> = (props) => (
    <React.Fragment>
        <div className="tw-w-full ">
            <div className="tw-bg-white tw-rounded tw-shadow">
                <div className="tw-p-4">
                    <div className="tw-flex tw-justify-between tw-items-start">
                        <div className="tw-truncate">
                            <p
                                className="tw-font-medium tw-text-gray-500 tw-mb-0 tw-truncate"
                                title={props.cardTitle}
                            >
                                {props.cardTitle}
                            </p>
                            <h2 className="tw-mt-2 tw-font-semibold tw-text-2xl">
                                <span className="counter-value">
                                    {props.cardCount}
                                </span>
                            </h2>
                        </div>

                        <div className="tw-flex-shrink-0">
                            <span
                                style={{
                                    background: props.iconBgColor,
                                    height: "2.5rem",
                                    width: "2.5rem",
                                }}
                                className={classnames(
                                    "tw-flex tw-items-center tw-justify-center tw-rounded tw-p-2 tw-text-lg"
                                )}
                            >
                                <img
                                    className="tw-object-contain"
                                    style={{ height: "1.2rem", width: "1.2rem" }}
                                    src={props.cardIcon}
                                    alt=""
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment >
)


export default DetailCard;