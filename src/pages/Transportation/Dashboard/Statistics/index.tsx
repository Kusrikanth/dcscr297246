import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { DetailCard } from "./stastsCard";

import { generateActionPayload } from "../../../../utility/reduxutility";
import { getTransportDashboardStatsAct } from "../../../../store/transportation/transportationaction";
import { useEffect, useMemo } from "react";
import { transformApiResponseToCardData } from "./helper";


export default function TransportStatistics() {

   const dispatch = useAppDispatch();
    const transportDashboardStatsApiCall = ( otherProps?: any) => {
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};

      let payload = {
          branchId,
          instituteId,
          academicYearId,
          ...otherProps,
      };
    dispatch(getTransportDashboardStatsAct(generateActionPayload('transport_dashboard_stats', undefined, payload)))
  }
  


 const { currentBranchIdResp: branchId,currentInstIdResp: instituteId,
    academicYearListResp, getTransportDashboardStatsResp
  } = useAppSelector(
    ({ instAcademics, appData, transportrequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp:appData.currentBranchIdResp,
      currentInstIdResp:appData.currentInstIdResp,
      getTransportDashboardStatsResp: transportrequest.getTransportDashboardStatsResp

    }),
    shallowEqual
  );

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      transportDashboardStatsApiCall();
    }
  }, [academicYearListResp,branchId,instituteId,]);

  const cardData = useMemo(() => {
    if (getTransportDashboardStatsResp) {
      return transformApiResponseToCardData(getTransportDashboardStatsResp);
    }
    return [];
  }, [getTransportDashboardStatsResp])
  
  return (
    <>
      <div className="tw-grid tw-grid-cols-12 tw-gap-4 transports-statistics-container">
        {cardData?.map((item: any, index: number) => (
          <DetailCard
            key={index}
            cardTitle={item.cardTitle}
            cardCount={item.cardCount}
            iconBgColor={item.iconBgColor}
            iconColor={item.iconColor}
            cardIcon={item.cardIcon}
            bgColor={item.bgColor}
            subTextOne={item.subTextOne}
            subTextTwo={item.subTextTwo}
            subTextThree={item.subTextThree}
            subCountOne={item.subCountOne}
            subCountTwo={item.subCountTwo}
            subCountThree={item.subCountThree}
            overlayColor={item.overlayColor}
            overlayChildColor={item.overlayChildColor}
          />
        ))}
      </div>
    </>
  );
}
