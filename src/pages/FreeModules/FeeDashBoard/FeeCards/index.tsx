import React, { useEffect, useState } from 'react';
import coins from "../../../../assets/imagesdps/updatedDashboard/coins.svg";
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getFeeDashboardCollectionStatsAct } from '../../../../store/fee/feereport/feereportactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { staticCardData } from './helper';
import { formatNumber } from '../helper';
import { SkeletonLoader } from '../../../../Components/Common';

const FeeCards = () => {
    const dispatch = useAppDispatch();
    const [cardData, setCardData] = useState<any[]>(Object.entries(staticCardData).map(([key, value]: any, index: number) => ({ ...value, id: `${key}-${index}` })));

    const {
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        getFeeDashboardCollectionStatsResp } =
        useAppSelector(({ appData, instAcademics, feeReport }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            getFeeDashboardCollectionStatsResp: feeReport.getFeeDashboardCollectionStatsResp,
        }), shallowEqual)

    useEffect(() => {
        if (branchId) {
            dispatch(getFeeDashboardCollectionStatsAct(generateActionPayload("fee_dashboard_collection_stats", undefined, { branchId })))
        }
    }, [branchId])

    useEffect(() => {
        if (getFeeDashboardCollectionStatsResp) {
            const resultArr = Object.entries(getFeeDashboardCollectionStatsResp).map(([key, value]: [string, any], index: number) => {
                const percentageChange = value?.percentageChange || 0
                return {
                    id: `${key}-${index}`,
                    label: staticCardData[key]?.label || "",
                    img: staticCardData[key]?.img || coins,
                    bottomText: staticCardData[key]?.bottomText || "",
                    amount: formatNumber(value[staticCardData[key]?.amtKey]),
                    percentage: `${Math.abs(percentageChange.toFixed(2))}%`,
                    badgeColor: percentageChange >= 0 ? "emerald" : "red",
                    badge: percentageChange >= 0 ? "ri-arrow-up-s-fill" : "ri-arrow-down-s-fill",
                }
            })
            setCardData(resultArr)
        }
    }, [getFeeDashboardCollectionStatsResp])


    return (
        <div className="tw-grid tw-grid-cols-12 tw-gap-4 fee_cards">
            {cardData.map((item) => (
                <div
                    key={item?.id}
                    className="tw-col-span-12 md:tw-col-span-6 tw-flex tw-items-stretch"
                >
                    <div className="tw-bg-white tw-rounded-md tw-shadow tw-w-full">
                        <div className="tw-py-4 tw-px-2">
                            <div className="tw-flex tw-items-center tw-justify-center">
                                <div className="tw-grid tw-grid-cols-12 tw-w-full">

                                    <div className="tw-col-span-12">
                                        <div className="tw-flex tw-items-center">
                                            <p className="tw-font-semibold tw-text-[12px] tw-text-gray-500 tw-mb-1 tw-truncate">
                                                {item?.label}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="tw-col-span-12">
                                        <div className="tw-flex-grow tw-mt-2">
                                            {(item?.amount !== undefined && item?.amount !== null) ? (
                                                <h4 className="tw-mb-0">₹ {item?.amount}</h4>
                                            ) : (
                                                <SkeletonLoader height="22px" width="20%" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="tw-col-span-12 tw-flex tw-items-center tw-justify-between">
                                        {item?.percentage ? (
                                            <div className="tw-flex-shrink-0 tw-self-end tw-text-right">
                                                <span
                                                    className={`tw-inline-flex tw-items-center tw-rounded tw-px-2 tw-py-1 tw-text-xs
                        tw-bg-${item?.badgeColor}-50 tw-text-${item?.badgeColor}-600`}
                                                >
                                                    <i className={`tw-mr-1 ${item?.badge}`}></i>
                                                    {item?.percentage} %
                                                    <span className="tw-ml-1">vs {item?.bottomText}</span>
                                                </span>
                                            </div>
                                        ) : (
                                            <SkeletonLoader height="22px" />
                                        )}

                                        <div className="tw-flex-shrink-0">
                                            <span className="tw-text-blue-600 tw-text-3xl">
                                                <img
                                                    src={item?.img || coins}
                                                    alt="Employee Avatar"
                                                    className="tw-align-middle tw-h-[30px] tw-w-[30px]"
                                                />
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeeCards;
