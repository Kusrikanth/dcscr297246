import { useMemo } from "react";
import { DetailCard } from "./stastsCard";
import { transformApiResponseToCardData } from "./helper";

export default function TransportStatistics(props: any) {

  const cardData = useMemo(() => {
      return transformApiResponseToCardData(props.getAttendanceDashboardResp?.attendanceSummary);
    }, [props.getAttendanceDashboardResp]);
    
  return (
    <>
      <div className="tw-grid tw-grid-cols-12 tw-gap-4 transports-statistics-container">
        {cardData?.map((card, index) => {
          return (
            <DetailCard
              key={index}
              cardTitle={card.cardTitle}
              cardCount={card.cardCount}
              iconBgColor={card.iconBgColor}
              iconColor={card.iconColor}
              cardIcon={card.cardIcon}
              bgColor={card.bgColor}
              borderColor={card.borderColor}
            />
          );
        })}
      </div>

    </>
  );
}
