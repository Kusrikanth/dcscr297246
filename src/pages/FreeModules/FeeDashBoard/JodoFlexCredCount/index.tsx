import React, { useEffect, useState } from 'react';
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { Progress } from 'reactstrap';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getFeeDashboardJodoPaymentModeStatusStatsAct } from '../../../../store/fee/feereport/feereportactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { formatNumber } from '../helper';
import coins from "../../../../assets/imagesdps/updatedDashboard/due.svg";
import money from "../../../../assets/imagesdps/updatedDashboard/fee.svg";
import teaching from "../../../../assets/imagesdps/updatedDashboard/teaching.svg";

const JodoFlexCredCount = () => {

    const [cardData, setCardData] = useState<Array<any>>([]);
    const dispatch = useAppDispatch()

    const {
        academicYearListResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        getFeeDashboardJodoPaymentModeStatusStatsResp, getFeeDashboardStatsResp } =
        useAppSelector(({ appData, instAcademics, feeReport }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            getFeeDashboardJodoPaymentModeStatusStatsResp: feeReport.getFeeDashboardJodoPaymentModeStatusStatsResp,
            getFeeDashboardStatsResp: feeReport.getFeeDashboardStatsResp,
        }), shallowEqual);

    useEffect(() => {
        if (Array.isArray(academicYearListResp?.data)) {
            const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
            const payload = {
                branchId, academicYearId
            }
            dispatch(getFeeDashboardJodoPaymentModeStatusStatsAct(generateActionPayload("fee_dashboard_jodo_payment_mode_status_stats", undefined, payload)))
        }
    }, [academicYearListResp])

    useEffect(() => {
        if (getFeeDashboardJodoPaymentModeStatusStatsResp) {
            const { stats, cred, flex } = getFeeDashboardJodoPaymentModeStatusStatsResp;
            const credStudents = stats?.credOptedStudents || 0;
            const flexStudents = stats?.flexOptedStudents || 0;
            const totalStudents = stats?.totalStudents || 0;
            const credReceivable = cred?.totalFeeReceivable || 0;
            const flexReceivable = flex?.totalFeeReceivable || 0;
            const totalReceivable = credReceivable + flexReceivable;
            const credDuePerc = Number(cred?.percentageOfDue || 0).toFixed(2);
            const flexDuePerc = Number(flex?.percentageOfDue || 0).toFixed(2);
            const totalRevenue =
                (cred?.totalFeeReceivable || 0) +
                (flex?.totalFeeReceivable || 0);
            const totalFeeReceivable =
                getFeeDashboardStatsResp?.totalFeeDTO?.totalFeeReceivable || 0;
            const data = [
                {
                    cardName: "Total Students Count",
                    totalValue: totalStudents,
                    isAmount: false,
                    showPercentage: true,
                    leftTitle: "Cred",
                    leftValue: credStudents,
                    leftPercentage: totalStudents
                        ? Number((credStudents / totalStudents) * 100).toFixed(2)
                        : "0.00",
                    leftIcon: coins,
                    rightTitle: "Flex",
                    rightValue: flexStudents,
                    rightPercentage: totalStudents
                        ? Number((flexStudents / totalStudents) * 100).toFixed(2)
                        : "0.00",
                    rightIcon: teaching,
                },
                {
                    cardName: "Total Revenue [Cred + Flex]",
                    totalValue:
                        (cred?.totalFeeReceivable || 0) +
                        (flex?.totalFeeReceivable || 0),
                    isAmount: true,
                    showPercentage: true,
                    leftTitle: "Cred Revenue",
                    leftValue: cred?.totalFeeReceivable || 0,
                    leftPercentage:
                        totalFeeReceivable
                            ? (
                                ((cred?.totalFeeReceivable || 0) /
                                    totalFeeReceivable) *
                                100
                            ).toFixed(2)
                            : "0.00",
                    leftIcon: money,
                    rightTitle: "Flex Revenue",
                    rightValue: flex?.totalFeeReceivable || 0,
                    rightPercentage:
                        totalFeeReceivable
                            ? (
                                ((flex?.totalFeeReceivable || 0) /
                                    totalFeeReceivable) *
                                100
                            ).toFixed(2)
                            : "0.00",
                    rightIcon: money,
                },
                {
                    cardName: "Total Cred/Flex Paid",
                    totalValue:
                        (cred?.amountCollected || 0) +
                        (flex?.amountCollected || 0),

                    isAmount: true,
                    showPercentage: true,
                    leftTitle: "Cred Paid",
                    leftValue: cred?.amountCollected || 0,
                    leftPercentage:
                        cred?.totalFeeReceivable
                            ? Number(
                                (
                                    ((cred?.amountCollected || 0) /
                                        cred?.totalFeeReceivable) *
                                    100
                                )
                            ).toFixed(2)
                            : "0.00",
                    leftIcon: money,
                    rightTitle: "Flex Paid",
                    rightValue: flex?.amountCollected || 0,
                    rightPercentage:
                        flex?.totalFeeReceivable
                            ? Number(
                                (
                                    ((flex?.amountCollected || 0) /
                                        flex?.totalFeeReceivable) *
                                    100
                                )
                            ).toFixed(2)
                            : "0.00",

                    rightIcon: money,
                },
                {
                    cardName: "Due Amount",
                    totalValue: (cred?.dueAmount || 0) + (flex?.dueAmount || 0),
                    isAmount: true,
                    showPercentage: true,
                    leftTitle: "Cred Due",
                    leftValue: cred?.dueAmount || 0,
                    leftPercentage: credDuePerc,
                    leftIcon: money,
                    rightTitle: "Flex Due",
                    rightValue: flex?.dueAmount || 0,
                    rightPercentage: flexDuePerc,
                    rightIcon: money,
                },
            ];

            setCardData(data);
        }
    }, [getFeeDashboardJodoPaymentModeStatusStatsResp]);

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
                                            {item.isAmount ? (
                                                <>
                                                    <RupeeSvg
                                                        width="13px"
                                                        height="13px"
                                                        fill="#495057"
                                                    />
                                                    <span className="tw-ml-1">
                                                        {formatNumber(+item?.totalValue)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span>{item?.totalValue}</span>
                                            )}
                                        </h4>
                                    </div>
                                </div>
                                <div className="tw-grid tw-grid-cols-2">
                                    <div className="tw-border-r tw-pr-2">
                                        <div className="tw-flex tw-justify-between tw-items-end tw-mb-1">
                                            <h6 className="tw-text-[14px] tw-text-muted tw-whitespace-nowrap tw-font-normal tw-mb-0 tw-mr-2">
                                                {item.leftTitle}
                                            </h6>
                                            <div className="tw-flex image_wrap">
                                                <img
                                                    src={item?.leftIcon}
                                                    alt="icon"
                                                    className="tw-h-5 tw-w-5"
                                                />
                                            </div>
                                        </div>
                                        <div className="tw-flex tw-justify-between">
                                            <span className="tw-text-[14px] tw-font-bold tw-text-green-600">
                                                {item.isAmount ? (
                                                    formatNumber(+item?.leftValue)
                                                ) : (
                                                    item?.leftValue
                                                )}
                                            </span>
                                            {item.showPercentage && (
                                                <span className="tw-text-[14px] tw-font-bold tw-text-green-600">
                                                    {item?.leftPercentage}%
                                                </span>
                                            )}
                                        </div>
                                        {item.showPercentage && (
                                            <Progress
                                                className="tw-my-2 tw-w-full"
                                                value={item?.leftPercentage}
                                                color="success"
                                            />
                                        )}
                                    </div>
                                    <div className="tw-pl-2">
                                        <div className="tw-flex tw-justify-between tw-items-end tw-mb-1">
                                            <h6 className="tw-text-[14px] tw-text-muted tw-whitespace-nowrap tw-font-normal tw-mb-0 tw-mr-2">
                                                {item.rightTitle}
                                            </h6>
                                            <div className="tw-flex image_wrap">
                                                <img
                                                    src={item?.rightIcon}
                                                    alt="icon"
                                                    className="tw-h-5 tw-w-5"
                                                />
                                            </div>
                                        </div>
                                        <div className="tw-flex tw-justify-between">
                                            <span className="tw-text-[14px] tw-font-bold tw-text-[#405189]">
                                                {item.isAmount ? (
                                                    formatNumber(+item?.rightValue)
                                                ) : (
                                                    item?.rightValue
                                                )}
                                            </span>
                                            {item.showPercentage && (
                                                <span className="tw-text-[14px] tw-font-bold tw-text-[#405189]">
                                                    {item?.rightPercentage}%
                                                </span>
                                            )}
                                        </div>
                                        {item.showPercentage && (
                                            <Progress
                                                className="tw-my-2 tw-w-full"
                                                value={item?.rightPercentage}
                                                color="primary"
                                            />
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

export default JodoFlexCredCount;
