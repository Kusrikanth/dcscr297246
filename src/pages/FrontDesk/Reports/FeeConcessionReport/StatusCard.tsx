import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import bgImg from "./cardimg.svg";
import classNames from "classnames";
import { default as RupeeCircleSvgIcon } from "../../../../assets/imagesdps/rupee-circle.svg?react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserMultiple02Icon } from '@hugeicons-pro/core-stroke-standard';


export default function StatusCard({ concessionData, reportData }: any) {

    const {
        totalActualAmount = 0,
        totalConcessionAmount = 0,
        concessionEligibleStudentCount = 0,
        getTotalConcessionPercentage = 0,
    } = concessionData?.concessionDetails ?? {};

    return (
        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 fee-payment-reports stats-card-types-container tw-gap-4 tw-mb-3">

            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-relative tw-overflow-hidden">
                <div className="tw-absolute tw-inset-0">
                    <img src={bgImg} alt="bg-image" />
                </div>
                <div className="tw-p-4 tw-relative tw-z-10">
                    <div className="tw-flex tw-items-center">
                        <div className="tw-flex tw-justify-center tw-items-center tw-shrink-0 tw-me-4 payment-icon jodocred-icon">
                            <RupeeCircleSvgIcon className="payment-icon" />
                        </div>
                        <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                            <p className="tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-500 tw-truncate" title="ACTUAL FEE">
                                ACTUAL FEE
                            </p>
                            <h5 className="tw-text-lg tw-font-semibold tw-text-gray-900">
                                ₹ {totalActualAmount ? totalActualAmount.toLocaleString() : "0"}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-relative tw-overflow-hidden">
                <div className="tw-absolute tw-inset-0">
                    <img src={bgImg} alt="bg-image"  />
                </div>
                <div className="tw-p-4 tw-relative tw-z-10">
                    <div className="tw-flex tw-items-center">
                        <div className="tw-flex tw-justify-center tw-items-center tw-shrink-0 tw-me-4 payment-icon cash-icon">
                            <RupeeCircleSvgIcon className="payment-icon" />
                        </div>
                        <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                            <span className="tw-text-gray-500 tw-mb-2 tw-text-sm" title="CONCESSION">
                                CONCESSION
                            </span>
                            <h5 className="tw-text-lg tw-font-semibold tw-text-gray-900">
                                ₹ {totalConcessionAmount ? Math.trunc(totalConcessionAmount).toLocaleString() : "0"}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-relative tw-overflow-hidden">
                <div className="tw-absolute tw-inset-0">
                    <img src={bgImg} alt="bg-image"  />
                </div>
                <div className="tw-p-4 tw-relative tw-z-10">
                    <div className="tw-flex tw-items-center">
                        <div className="tw-flex tw-justify-center tw-items-center tw-shrink-0 tw-me-4 payment-icon online-icon">
                            <RupeeCircleSvgIcon className="payment-icon" />
                        </div>
                        <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                            <span className="tw-text-gray-500 tw-mb-2 tw-text-sm" title="CONCESSION %">
                                CONCESSION %
                            </span>
                            <h5 className="tw-text-lg tw-font-semibold tw-text-gray-900">
                                {getTotalConcessionPercentage ? getTotalConcessionPercentage.toFixed(2) : "0.00"} %
                            </h5>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-relative tw-overflow-hidden">
                <div className="tw-absolute tw-inset-0">
                    <img src={bgImg} alt="bg-image"  />
                </div>
                <div className="tw-p-4 tw-relative tw-z-10">
                    <div className="tw-flex tw-items-center">
                        <div className="tw-flex tw-justify-center tw-items-center tw-shrink-0 tw-me-4 payment-icon jodoflex-icon">
                            <HugeiconsIcon icon={UserMultiple02Icon} className="payment-icon" />
                        </div>
                        <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                            <p
                                className="tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-500 tw-truncate"
                                title="STUDENTS BENEFITTED THROUGH CONCESSION"
                            >
                                STUDENTS BENEFITTED THROUGH CONCESSION
                            </p>
                            <h5 className="tw-text-lg tw-font-semibold tw-text-gray-900">
                                {concessionEligibleStudentCount || "0"}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
