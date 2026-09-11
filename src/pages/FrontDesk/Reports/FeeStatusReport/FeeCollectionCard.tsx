import React from "react";
import FeeTransportIcon from "../../../../assets/imagesdps/feeDashboard/fee-transport-icon.svg";
import FeeAcademicIcon from "../../../../assets/imagesdps/feeDashboard/fee-academic-icon.svg";
import { getDisplayAmountValue, getFeeAmountDisplayValue } from "../../../../utility/commonutility";

export default function FeeCollectionCard({ reportData }: any) {
    const tutionFeeData = reportData?.["FEE STRUCTURE"]?.[0] || {},
        transportFeeData = reportData?.["TRANSPORT FEE"]?.[0] || {};


    function getFeePercentage(feepaid: number, feetobepaid: number) {
        if (isNaN(feepaid) || isNaN(feetobepaid)) {
            return Number(0).toFixed(2);
        }
        return Math.round(Number(feepaid) / (Number(feepaid) + Number(feetobepaid)) * 100);
    }


    const tutionFeePaidPerc = getFeePercentage(tutionFeeData?.totalAmountPaid, tutionFeeData?.totalAmountToBePaid),
        tutionFeeToBePaidPerc = 100 - Number(tutionFeePaidPerc);

    const transportFeePaidPerc = getFeePercentage(transportFeeData?.totalAmountPaid, transportFeeData?.totalAmountToBePaid),
        transportFeeToBePaidPerc = 100 - Number(transportFeePaidPerc);

    return (
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4">

            <div>
                <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-3">
                    <div className="tw-p-4">
                        <div className="tw-flex tw-items-center">
                            <div className="tw-flex-shrink-0 tw-mr-3">
                                <img src={FeeAcademicIcon} className="tw-w-8 tw-h-8" />
                            </div>

                            <div className="tw-flex-grow">
                                <div className="tw-flex tw-justify-between tw-items-center tw-mb-1">
                                    <h6 className="tw-text-sm tw-text-gray-500 tw-mb-0">
                                        Total Tuition Fee Amount
                                    </h6>
                                    <p
                                        className="tw-font-bold tw-text-gray-800 tw-mb-0"
                                        title={`₹ ${getDisplayAmountValue(tutionFeeData?.totalNetAmount)}`}
                                    >
                                        ₹ {getFeeAmountDisplayValue(tutionFeeData?.totalNetAmount)}
                                    </p>
                                </div>

                                <div className="tw-flex tw-h-2 tw-rounded tw-overflow-hidden tw-mb-2 tw-bg-gray-200">
                                    <div
                                        className="tw-bg-green-500"
                                        title={`${tutionFeePaidPerc}%`}
                                        style={{ width: `${tutionFeePaidPerc}%` }}
                                    />
                                    <div
                                        className="tw-bg-red-500"
                                        title={`${tutionFeeToBePaidPerc}%`}
                                        style={{ width: `${tutionFeeToBePaidPerc}%` }}
                                    />
                                </div>

                                <div className="tw-flex tw-justify-between">
                                    <div className="tw-flex tw-items-center">
                                        <span className="tw-text-xs tw-text-gray-500 tw-mr-1">
                                            Fee Collected:
                                        </span>
                                        <span
                                            className="tw-text-green-600 tw-font-bold"
                                            title={`₹ ${getDisplayAmountValue(tutionFeeData?.totalAmountPaid)}`}
                                        >
                                            ₹ {getFeeAmountDisplayValue(tutionFeeData?.totalAmountPaid)}
                                        </span>
                                    </div>

                                    <div className="tw-flex tw-items-center">
                                        <span className="tw-text-xs tw-text-gray-500 tw-mr-1">
                                            Fee Due:
                                        </span>
                                        <span
                                            className="tw-text-red-600 tw-font-bold"
                                            title={`₹ ${getDisplayAmountValue(tutionFeeData?.totalAmountToBePaid)}`}
                                        >
                                            ₹ {getFeeAmountDisplayValue(tutionFeeData?.totalAmountToBePaid)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-3">
                    <div className="tw-p-4">
                        <div className="tw-flex tw-items-center">
                            <div className="tw-flex-shrink-0 tw-mr-3">
                                <img src={FeeTransportIcon} className="tw-w-8 tw-h-8" />
                            </div>

                            <div className="tw-flex-grow">
                                <div className="tw-flex tw-justify-between tw-items-center tw-mb-1">
                                    <h6 className="tw-text-sm tw-text-gray-500 tw-mb-0">
                                        Total Transportation Fee
                                    </h6>
                                    <p
                                        className="tw-font-bold tw-text-gray-800 tw-mb-0"
                                        title={`₹ ${getDisplayAmountValue(transportFeeData?.totalNetAmount)}`}
                                    >
                                        ₹ {getFeeAmountDisplayValue(transportFeeData?.totalNetAmount)}
                                    </p>
                                </div>

                                <div className="tw-flex tw-h-2 tw-rounded tw-overflow-hidden tw-mb-2 tw-bg-gray-200">
                                    <div
                                        className="tw-bg-green-500"
                                        title={`${transportFeePaidPerc}%`}
                                        style={{ width: `${transportFeePaidPerc}%` }}
                                    />
                                    <div
                                        className="tw-bg-red-500"
                                        title={`${transportFeeToBePaidPerc}%`}
                                        style={{ width: `${transportFeeToBePaidPerc}%` }}
                                    />
                                </div>

                                <div className="tw-flex tw-justify-between">
                                    <div className="tw-flex tw-items-center">
                                        <span className="tw-text-xs tw-text-gray-500 tw-mr-1">
                                            Fee Collected:
                                        </span>
                                        <span
                                            className="tw-text-green-600 tw-font-bold"
                                            title={`₹ ${getDisplayAmountValue(transportFeeData?.totalAmountPaid)}`}
                                        >
                                            ₹ {getFeeAmountDisplayValue(transportFeeData?.totalAmountPaid)}
                                        </span>
                                    </div>

                                    <div className="tw-flex tw-items-center">
                                        <span className="tw-text-xs tw-text-gray-500 tw-mr-1">
                                            Fee Due:
                                        </span>
                                        <span
                                            className="tw-text-red-600 tw-font-bold"
                                            title={`₹ ${getDisplayAmountValue(transportFeeData?.totalAmountToBePaid)}`}
                                        >
                                            ₹ {getFeeAmountDisplayValue(transportFeeData?.totalAmountToBePaid)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}