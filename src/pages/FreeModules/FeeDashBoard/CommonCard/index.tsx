import React, { useEffect, useState } from 'react';
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { Progress } from 'reactstrap';
import { cardStatData, convertedData } from './helper';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getFeeDashboardStatsAct, } from '../../../../store/fee/feereport/feereportactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { formatNumber } from '../helper';
import { SkeletonLoader } from '../../../../Components/Common';

const CommonCard = () => {

    const [cardData, setCardData] = useState<Array<any>>(cardStatData)
    const dispatch = useAppDispatch()

    const {
        academicYearListResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        getFeeDashboardStatsResp, } =
        useAppSelector(({ appData, instAcademics, feeReport }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            getFeeDashboardStatsResp: feeReport.getFeeDashboardStatsResp,
        }), shallowEqual);

    useEffect(() => {
        if (Array.isArray(academicYearListResp?.data)) {
            const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
            const payload = {
                branchId, academicYearId
            }
            dispatch(getFeeDashboardStatsAct(generateActionPayload("fee_dashboard_stats", undefined, payload)))
        }
    }, [academicYearListResp])

    useEffect(() => {
        if (getFeeDashboardStatsResp) {
            const findResp: Record<string, any> = {
                "totalFeeReceivable": "totalFeeDTO",
                "tuitionFee": "tuitionFeeDTO",
                "transportFee": "transportFeeDTO",
                "termFee": "termFeeDTO",
            }
            setCardData(cardData.map((item) => ({ ...item, ...convertedData(getFeeDashboardStatsResp[findResp[item?.keyName]]) })))
        }
    }, [getFeeDashboardStatsResp])

    return (
        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">
            {cardData.map((item: any, index: number) => (
                <div
                    key={item?.cardName + index}
                    className="tw-col-span-12 lg:tw-col-span-6 2xl:tw-col-span-3"
                >
                    <div className="tw-bg-white tw-rounded-md tw-shadow tw-w-full tw-inline-block common_card_wrapper">
                        <div className="tw-px-2 tw-py-4">
                            <div className="tw-flex tw-flex-col">

                                <div className="tw-w-full tw-mb-3">
                                    <div className="tw-flex tw-justify-between tw-items-start">
                                        <h4 className="tw-text-[15px] tw-whitespace-nowrap tw-font-normal">
                                            {item.cardName}
                                        </h4>

                                        <h4 className="tw-text-[16px] tw-font-bold tw-flex tw-items-baseline tw-w-[40%] tw-justify-end">
                                            {item?.totalAmt ? (
                                                <>
                                                    <RupeeSvg width="13px" height="13px" fill="#495057" />
                                                    <span className="tw-ml-1">
                                                        {formatNumber(+item?.totalAmt)}
                                                    </span>
                                                </>
                                            ) : (
                                                <SkeletonLoader width="100%" />
                                            )}
                                        </h4>
                                    </div>
                                </div>

                                <div className="tw-grid tw-grid-cols-2">
                                    <div className="tw-border-r tw-pr-2">
                                        <div className="tw-flex tw-justify-between tw-items-end tw-mb-1">
                                            <h6 className="tw-text-[14px] tw-text-muted tw-whitespace-nowrap tw-font-normal tw-mb-0 tw-mr-2">
                                                Collected
                                            </h6>
                                            <div className="tw-flex image_wrap">
                                                <img
                                                    src={item?.collctedIcon}
                                                    alt="icon"
                                                    className="tw-h-5 tw-w-5"
                                                />
                                            </div>
                                        </div>

                                        <div className="tw-flex tw-justify-between">
                                            {item?.collectedAmt ? (
                                                <span className="tw-text-[14px] tw-font-bold tw-text-green-600">
                                                    {formatNumber(+item?.collectedAmt)}
                                                </span>
                                            ) : (
                                                <SkeletonLoader />
                                            )}

                                            {item?.collectedPerc ? (
                                                <span className="tw-text-[14px] tw-font-bold tw-text-green-600">
                                                    {item?.collectedPerc}%
                                                </span>
                                            ) : (
                                                <SkeletonLoader />
                                            )}
                                        </div>

                                        {item?.collectedPerc ? (
                                            <Progress
                                                className="tw-my-2 tw-w-full"
                                                value={item?.collectedPerc}
                                                color="success"
                                            />
                                        ) : (
                                            <SkeletonLoader width="100%" />
                                        )}
                                    </div>

                                    <div className="tw-pl-2">
                                        <div className="tw-flex tw-justify-between tw-items-end tw-mb-1">
                                            <h6 className="tw-text-[14px] tw-text-muted tw-whitespace-nowrap tw-font-normal tw-mb-0 tw-mr-2">
                                                Due
                                            </h6>
                                            <div className="tw-flex image_wrap">
                                                <img
                                                    src={item?.dueIcon}
                                                    alt="icon"
                                                    className="tw-h-5 tw-w-5"
                                                />
                                            </div>
                                        </div>

                                        <div className="tw-flex tw-justify-between">
                                            {item?.dueAmt ? (
                                                <span className="tw-text-[14px] tw-font-bold tw-text-red-600">
                                                    {formatNumber(+item?.dueAmt)}
                                                </span>
                                            ) : (
                                                <SkeletonLoader />
                                            )}

                                            {item?.duePrec ? (
                                                <span className="tw-text-[14px] tw-font-bold tw-text-red-600">
                                                    {item?.duePrec}%
                                                </span>
                                            ) : (
                                                <SkeletonLoader />
                                            )}
                                        </div>

                                        {item?.duePrec ? (
                                            <Progress
                                                className="tw-my-2 tw-w-full"
                                                value={item?.duePrec}
                                                color="danger"
                                            />
                                        ) : (
                                            <SkeletonLoader width="100%" />
                                        )}
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

export default CommonCard;
