import React, { useEffect, useState } from "react";
import { getAmountValueWithDecimal, getDisplayAmountValue } from "../../../../utility/commonutility";
import classNames from "classnames";
import { default as RupeeCircleSvgIcon } from "../../../../assets/imagesdps/rupee-circle.svg?react";
import { statusCardsList } from "./helper";

export default function StatusCard({ paymentModeAmount }: any) {
    const [paymentModeAmountState, setPaymentModeAmountState] = useState<any>(null);
    const [totalAmount, setTotalAmount] = useState(0);
    useEffect(() => {
        if (paymentModeAmount && typeof paymentModeAmount === 'object') {
        const paymentModeWithAmount = {
            upi: paymentModeAmount?.amountPaidByUPI || 0,
            card_payment: paymentModeAmount?.amountPaidByCard || 0,
            cash: paymentModeAmount?.amountPaidBy || 0,
            cheque: paymentModeAmount?.amountPaidByCheque || 0,
            online: paymentModeAmount?.amountPaidByOnline || 0,
            online_pg: paymentModeAmount?.amountPaidByOnlinePG || 0,
            total: paymentModeAmount?.totalAmount || 0
        };
        
        const calculatedTotalAmount = Object.values(paymentModeWithAmount).reduce((total, amount) => {
            total += isNaN(amount) ? 0 : amount;
            return total;
        }, 0);
         setPaymentModeAmountState(paymentModeWithAmount);
        setTotalAmount(calculatedTotalAmount);
     }
    }, [paymentModeAmount]);
    return (
        <div className="tw-grid tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4 tw-mb-4">
            <div className="tw-col-span-2 lg:tw-col-span-4 tw-mb-0">
                    <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-m-0">
                        Payment Mode Wise Collection 
                    </h4>
                </div>
            <div className="tw-col-span-1">
                <div className="tw-bg-white tw-shadow-sm tw-rounded-lg tw-mb-0">
                    <div className="tw-p-4">
                        <div className="tw-flex tw-items-center">
                            <div className={classNames(`tw-flex tw-justify-center tw-mr-2
                                payment-icon
                                tw-items-center tw-shrink-0 jodocred-icon`)}>
                                {/* <i className="ri-user-line text-primary fs-20px"></i> */}
                                <RupeeCircleSvgIcon className={classNames("payment-icon")} />
                            </div>
                            <div className="tw-flex tw-flex-col tw-grow tw-overflow-hidden">
                                <p className="tw-mb-1 tw-leading-tight tw-font-medium tw-text-gray-500 tw-truncate">
                                    Total Amount
                                </p>
                                <h5 className="tw-text-base tw-leading-none tw-mb-0 tw-font-[650] tw-text-[#495057]">
                                    ₹ {getDisplayAmountValue(totalAmount)}
                                </h5>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {statusCardsList.map((item) => (
                <div key={item.accessor} className="tw-col-span-1">
                    <div className="tw-bg-white tw-shadow-sm tw-rounded-lg tw-mb-0">
                        <div className="tw-p-4">
                            <div className="tw-flex tw-items-center">
                                <div className={classNames(`tw-flex tw-justify-center tw-mr-2
                                payment-icon
                                tw-items-center tw-shrink-0`, item?.iconClassName)}>
                                    {/* <i className="ri-user-line text-primary fs-20px"></i> */}
                                    <RupeeCircleSvgIcon className={classNames("payment-icon")} />
                                </div>
                                <div className="tw-flex tw-flex-col tw-grow tw-overflow-hidden">
                                    <p className="tw-mb-1 tw-leading-tight tw-font-medium tw-text-gray-500 tw-truncate">
                                        {item.statusName}
                                    </p>
                                    <h5 className="tw-text-base tw-leading-none tw-mb-0 tw-font-[650] tw-text-[#495057]">
                                        ₹ {getDisplayAmountValue(paymentModeAmountState?.[item.accessor])}
                                    </h5>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>))}
        </div>
    )
}