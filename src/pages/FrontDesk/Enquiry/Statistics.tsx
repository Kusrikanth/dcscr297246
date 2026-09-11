import React, { useEffect, useState } from "react";
import DetailsCard from "./DetailCard";

import BoysIcon from "../../../assets/imagesdps/directory/icons/boys_icon.svg";
import GirlsIcon from "../../../assets/imagesdps/directory/icons/girls_icon.svg";
import AdmissionIcon from "../../../assets/imagesdps/directory/icons/admission_icon.svg";

import InactiveStudent from "../../../assets/imagesdps/directory/icons/inactive-student.svg";

function Statistics({ statsInfo }: any) {
    const [categoryState, setCategoryState] = useState<any>({});
    // useEffect(() => {
    //     if (Array.isArray(statsInfo)) {
    //         const updateCategoryState = statsInfo.reduce((categoryInfo, item) => {
    //             const { categoryName } = item || {},
    //                 categoryKey = categoryName?.replace(/\s/g, "").toLowerCase();
    //             categoryInfo[categoryKey] = item;
    //             return categoryInfo;
    //         }, {});
    //         setCategoryState(updateCategoryState);
    //     } else {
    //         setCategoryState({});
    //     }
    // }, [statsInfo]);
    return (
        <div className="tw-grid tw-grid-cols-12 tw-gap-4 ">
            <DetailsCard
                cardTitle="Total Enquiries"
                cardCount={statsInfo?.totalEnquiresCount || 0}
                iconBgColor="bg-green-50"
                iconColor="text-green-600"
                percentageValue={statsInfo?.totalEnquiresCount?.vsPrevMonthPercent || "-"}
                comparisonText="vs. previous month"
                cardIcon={AdmissionIcon}
                increased
            />

            <DetailsCard
                cardTitle="Total Eligibles"
                cardCount={statsInfo?.totalEligibleCount || 0}
                iconBgColor="bg-cyan-50"
                iconColor="text-cyan-600"
                percentageValue={statsInfo?.totalEligibleCount?.vsPrevMonthPercent || "-"}
                comparisonText="vs. previous month"
                cardIcon={BoysIcon}
                increased
            />

            <DetailsCard
                cardTitle="Total Non Eligibles"
                cardCount={statsInfo?.totalNotEligibleCount || 0}
                iconBgColor="bg-yellow-50"
                iconColor="text-yellow-600"
                percentageValue={statsInfo?.totalNotEligibleCount?.vsPrevMonthPercent || "-"}
                comparisonText="vs. previous month"
                cardIcon={GirlsIcon}
                increased
            />

            <DetailsCard
                cardTitle="Total Admitted"
                cardCount={statsInfo?.totalAdmittedCount || 0}
                iconBgColor="bg-red-50"
                iconColor="text-red-600"
                percentageValue={statsInfo?.totalAdmittedCount?.vsPrevMonthPercent || "-"}
                comparisonText="vs. previous month"
                cardIcon={InactiveStudent}
                increased={false}
            />
        </div>
    )
}

export default React.memo(Statistics);