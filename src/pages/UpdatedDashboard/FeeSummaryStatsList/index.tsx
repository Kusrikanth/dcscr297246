import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { Progress } from "reactstrap";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { SkeletonLoader } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { getFeeDashboardStatsAct } from "../../../store/fee/feereport/feereportactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { formatNumber } from "../../FreeModules/FeeDashBoard/helper";
import { cardStatData, convertedData } from "./helper";

const FeeSummaryStatsList = (props: any) => {
  const { branchIdState, academicYearId = "", studentStatus = "" } = props;
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
    if (academicYearId) {
      const payload = {
        instituteId, branchId: branchIdState, academicYearId, studentStatus
      }
      dispatch(getFeeDashboardStatsAct(generateActionPayload("fee_dashboard_stats", undefined, payload)))
    }
  }, [branchIdState, academicYearId, instituteId, studentStatus])

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
    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-4 tw-gap-6">
      {cardData.map((item: any, index: number) => (
        <div key={item?.cardName + index} className={`tw-bg-white tw-rounded-2xl tw-shadow-md tw-p-4 tw-flex tw-flex-col tw-justify-between`}>
          <div className="tw-flex tw-justify-between tw-items-start tw-mb-4">
            <h4 className="tw-text-base tw-font-normal tw-whitespace-nowrap">{item.cardName}</h4>
            <h4 className="tw-text-lg tw-font-bold tw-flex tw-items-baseline tw-justify-end">
              {item?.totalAmt ? (
                <>
                  <RupeeSvg width="13px" height="13px" fill="#495057" /> {formatNumber(+item?.totalAmt)}
                </>
              ) : (
                <SkeletonLoader width="100%" />
              )}
            </h4>
          </div>
          <div className="tw-grid tw-grid-cols-2 tw-gap-x-4">
            <div className="tw-border-r tw-pr-4">
              <div className="tw-flex tw-justify-between tw-items-end tw-mb-1">
                <h6 className="tw-text-sm tw-text-muted tw-font-normal tw-whitespace-nowrap">Collected</h6>
                <img src={item?.collctedIcon} alt="icon" className="tw-h-5 tw-w-5" />
              </div>
              <div className="tw-flex tw-justify-between">
                {item?.collectedAmt ? (
                  <span className="tw-text-sm tw-font-bold tw-text-green-600">{formatNumber(+item?.collectedAmt)}</span>
                ) : (
                  <SkeletonLoader />
                )}
                {item?.collectedPerc ? (
                  <span className="tw-text-sm tw-font-bold tw-text-green-600">{item?.collectedPerc}%</span>
                ) : (
                  <SkeletonLoader />
                )}
              </div>
              {item?.collectedPerc ? (
                <Progress className="tw-my-2 tw-w-full" value={item?.collectedPerc} color="success" />
              ) : (
                <SkeletonLoader width="100%" />
              )}
            </div>
            <div>
              <div className="tw-flex tw-justify-between tw-items-end tw-mb-1">
                <h6 className="tw-text-sm tw-text-muted tw-font-normal tw-whitespace-nowrap">Due</h6>
                <img src={item?.dueIcon} alt="icon" className="tw-h-5 tw-w-5" />
              </div>
              <div className="tw-flex tw-justify-between">
                {item?.dueAmt ? (
                  <span className="tw-text-sm tw-font-bold tw-text-red-600">{formatNumber(+item?.dueAmt)}</span>
                ) : (
                  <SkeletonLoader />
                )}
                {item?.duePrec ? (
                  <span className="tw-text-sm tw-font-bold tw-text-red-600">{item?.duePrec}%</span>
                ) : (
                  <SkeletonLoader />
                )}
              </div>
              {item?.duePrec ? (
                <Progress className="tw-my-2 tw-w-full" value={item?.duePrec} color="danger" />
              ) : (
                <SkeletonLoader width="100%" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeeSummaryStatsList;

