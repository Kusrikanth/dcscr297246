import { useEffect, useState } from "react";
import { SkeletonLoader } from "../../../Components/Common";
import coins from "../../../assets/imagesdps/updatedDashboard/coins.svg";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { staticCardData } from "./helper";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getFeeDashboardCollectionStatsAct } from "../../../store/fee/feereport/feereportactions";
import { formatNumber } from "../../../utility/commonutility";

const FeeCollectionStatsList = (props: any) => {

  const dispatch = useAppDispatch();
  const [cardData, setCardData] = useState<any[]>(Object.entries(staticCardData).map(([key, value]: any, index: number) => ({ ...value, id: `${key}-${index}` })));
  const { branchIdState } = props;
  const {
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    getFeeDashboardCollectionStatsResp } =
    useAppSelector(({ appData, instAcademics, feeReport }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getFeeDashboardCollectionStatsResp: feeReport.getFeeDashboardCollectionStatsResp,
    }), shallowEqual)

  useEffect(() => {
    if (instituteId) {
      dispatch(getFeeDashboardCollectionStatsAct(generateActionPayload("fee_dashboard_collection_stats", undefined, { instituteId, branchId: branchIdState, ignorePreviousCollection: true })))
    }
  }, [branchIdState, instituteId])

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
          badgeColor: percentageChange >= 0 ? "success" : "danger",
          badge: percentageChange >= 0 ? "ri-arrow-up-s-fill" : "ri-arrow-down-s-fill",
        }
      })
      setCardData(resultArr)
    }
  }, [getFeeDashboardCollectionStatsResp])

  return (
    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6 tw-h-full">
      {cardData.map((item: any, index: number) => (
        <div
          key={item?.id}
          className={`tw-bg-white tw-shadow-md tw-p-5 tw-flex tw-flex-col tw-justify-center tw-rounded-2xl`}>
          <div className="tw-flex tw-flex-col tw-gap-4 tw-w-full">
            <div>
              <p
                title={item?.label}
                className="tw-font-semibold tw-text-[#878a99] tw-text-base tw-text-muted-foreground tw-truncate"
              >
                {item?.label}
              </p>
            </div>
            <div className="tw-flex tw-items-center tw-justify-between">
              <div className="tw-text-xl tw-font-bold tw-text-gray-800">
                {item?.amount !== undefined && item?.amount !== null ? (
                  <>₹ {item?.amount}</>
                ) : (
                  <SkeletonLoader height="22px" width="20%" />
                )}
              </div>
              <div className="tw-flex-shrink-0">
                <img
                  src={item?.img || coins}
                  className="tw-h-[30px] tw-w-[30px]"
                  alt="Icon"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeeCollectionStatsList;
