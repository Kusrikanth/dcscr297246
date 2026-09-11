import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { commonCardTypes } from './CommonCardTypes';
import { formatNumber } from './helper';


const CommonCard = (props: commonCardTypes) => {
    return (
        <div className="tw-inline-block tw-w-full tw-bg-white tw-rounded-xl tw-shadow-sm common_card_wrapper">
            <div className="tw-p-3">
                <div className="tw-flex tw-flex-col">

                    {/* Header */}
                    <div className="tw-inline-block tw-w-full tw-mb-3">
                        <div className="tw-flex tw-w-full tw-justify-between">
                            <h4 className="tw-text-[18px] tw-whitespace-nowrap tw-font-normal">
                                {props?.cardMainText}
                            </h4>

                            <h4 className="tw-text-[18px] tw-font-bold tw-flex tw-items-baseline">
                                {props.rupeeSvg && (
                                    <RupeeSvg width="13px" height="13px" fill="#495057" />
                                )}
                                {props?.cardMainText === "Total Fee Receivable"
                                    ? formatNumber(props?.cardMainAmount)
                                    : props?.cardMainAmount}
                            </h4>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="tw-grid tw-grid-cols-2">

                        {/* Left Section */}
                        <div className="tw-border-r tw-pr-3">
                            <div className="tw-flex tw-justify-between tw-items-end tw-mb-1">
                                <div className="tw-flex tw-flex-col">
                                    <h6 className="tw-text-[14px] tw-text-gray-500 tw-whitespace-nowrap tw-font-normal tw-mb-0">
                                        {props.cardLeftText}
                                    </h6>
                                </div>

                                <div className="tw-flex tw-flex-col">
                                    <div className="tw-flex image_wrap">
                                        <img
                                            src={props.cardLeftIcon}
                                            alt="img"
                                            className="tw-h-5 tw-w-5"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="tw-flex tw-justify-between">
                                <span className="tw-text-[16px] tw-font-bold">
                                    {props?.cardMainText === "Total Fee Receivable"
                                        ? formatNumber(props?.cardLeftAmount)
                                        : props?.cardLeftAmount}
                                </span>

                                <span className="tw-text-[16px] tw-font-bold tw-text-emerald-800">
                                    {props?.amountLeftPercentage}%
                                </span>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="tw-pl-3">
                            <div className="tw-flex tw-justify-between tw-items-end tw-mb-1">
                                <div className="tw-flex tw-flex-col">
                                    <h6 className="tw-text-[14px] tw-text-gray-500 tw-whitespace-nowrap tw-font-normal tw-mb-0">
                                        {props?.cardRightText}
                                    </h6>
                                </div>

                                <div className="tw-flex tw-flex-col">
                                    <div className="tw-flex image_wrap">
                                        <img
                                            src={props.cardRightIcon}
                                            alt="girl"
                                            className="tw-h-5 tw-w-5"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="tw-flex tw-justify-between">
                                <span className="tw-text-[16px] tw-font-bold">
                                    {props?.cardMainText === "Total Fee Receivable"
                                        ? formatNumber(props?.cardRightAmount)
                                        : props.cardRightAmount}
                                </span>

                                <span className="tw-text-[16px] tw-font-bold tw-text-gray-500">
                                    {props.amountRightPercentage}%
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommonCard
