import React, { useState, useEffect, useMemo } from "react";
import DetailCard from "./Card";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { transformApiResponseToCardData } from "./helper";

function LibraryStats() {
   const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
      academicYearListResp, getLibraryDashboardDataResp, brchCardCurriculumResp
    } = useAppSelector(
      ({ instAcademics, appData, libraryBookCollection, applicationSale }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        getLibraryDashboardDataResp: libraryBookCollection.getLibraryDashboardDataResp,
        brchCardCurriculumResp: applicationSale.brchCardCurriculumResp,
      }),
      shallowEqual
    );

  const cardData = useMemo(() => {
    return transformApiResponseToCardData(getLibraryDashboardDataResp, brchCardCurriculumResp);
  }, [getLibraryDashboardDataResp, brchCardCurriculumResp]);
  
  return (

    <div className="tw-grid tw-grid-cols-12 tw-gap-4 transports-statistics-container tw-pe-0">
     {cardData?.map((card, index) => {
       return (
      <DetailCard
        key={index}
        cardTitle={card.cardTitle}
        cardCount={card.cardCount}
        iconBgColor="bg-soft-info"
        iconColor="text-info"
        cardIcon={card.icon}
        bgColor={card.bgColor}
        subTextOne={card.subTextOne}
        subTextTwo={card.subTextTwo}
        subTextThree={card.subTextThree}
        subCountOne={card.subCountOne}
        subCountTwo={card.subCountTwo}
        subCountThree={card.subCountThree}
        overlayColor={card.overlayColor}
        overlayChildColor={card.overlayChildColor}
      />
       )
     })

     }
    </div>
  )
}

export default LibraryStats;