import React, { useEffect, useState } from "react";
import { getAmountValueWithDecimal, getDisplayAmountValue } from "../../../../utility/commonutility";
import { statusCardsList } from "./helper";
import classNames from "classnames";
import { default as RupeeCircleSvgIcon } from "../../../../assets/imagesdps/rupee-circle.svg?react";

export default function StatusCard({ paymentModeAmount }: any) {
    const [paymentModeAmountState, setPaymentModeAmountState] = useState<any>(null);
    const [totalAmount, setTotalAmount] = useState(0);
    useEffect(() => {
        if (Array.isArray(paymentModeAmount)) {
            const paymentModeWithAmount = paymentModeAmount.reduce((mode, item) => {
                const itemKey = item?.paymentMode?.toLowerCase();
                mode[itemKey] = item?.sumOfPaidAmounts;
                return mode;
            }, {});
            const totalAmount = paymentModeAmount.reduce((total, item) => {
                total += (isNaN(item?.sumOfPaidAmounts) ? 0 : item?.sumOfPaidAmounts);
                return total;
            }, 0);
            setPaymentModeAmountState(paymentModeWithAmount);
            setTotalAmount(totalAmount);
        }
    }, [paymentModeAmount]);
    return (
        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-3">
            <div className="tw-col-span-6 lg:tw-col-span-3">
                <div className="tw-bg-white tw-rounded tw-shadow-sm">
                    <div className="tw-p-4">
                        <div className="tw-flex">
                            <div
                                className={classNames(
                                    "tw-flex tw-items-center tw-justify-center tw-mr-2 tw-flex-shrink-0 payment-icon jodocred-icon"
                                )}
                            >
                                <RupeeCircleSvgIcon className="payment-icon" />
                            </div>

                            <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                                <p className="tw-text-sm tw-font-medium tw-text-gray-500 tw-truncate tw-mb-1">
                                    Total Amount
                                </p>
                                <h5
                                    className="tw-leading-none tw-mb-0"
                                    style={{ color: "#495057", fontWeight: 650 }}
                                >
                                    ₹ {getDisplayAmountValue(totalAmount)}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {statusCardsList.map((item) => (
                <div key={item.accessor} className="tw-col-span-6 lg:tw-col-span-3">
                    <div className="tw-bg-white tw-rounded tw-shadow-sm">
                        <div className="tw-p-4">
                            <div className="tw-flex">
                                <div
                                    className={classNames(
                                        "tw-flex tw-items-center tw-justify-center tw-mr-2 tw-flex-shrink-0 payment-icon",
                                        item?.iconClassName
                                    )}
                                >
                                    <RupeeCircleSvgIcon className="payment-icon" />
                                </div>

                                <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                                    <p className="tw-text-sm tw-font-medium tw-text-gray-500 tw-truncate tw-mb-1">
                                        {item.statusName}
                                    </p>
                                    <h5
                                        className="tw-leading-none tw-mb-0"
                                        style={{ color: "#495057", fontWeight: 650 }}
                                    >
                                        ₹{" "}
                                        {getDisplayAmountValue(
                                            paymentModeAmountState?.[item.accessor]
                                        )}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}