import React, { useEffect, useState } from "react";
import DetailsCard from "./DetailCard";

import BoysIcon from "../../../assets/imagesdps/directory/icons/boys_icon.svg";
import GirlsIcon from "../../../assets/imagesdps/directory/icons/girls_icon.svg";
import AdmissionIcon from "../../../assets/imagesdps/directory/icons/admission_icon.svg";

import InactiveStudent from "../../../assets/imagesdps/directory/icons/inactive-student.svg";

function Statistics({ statsInfo }: any) {
    const [categoryState, setCategoryState] = useState<any>({});
    useEffect(() => {
        if (Array.isArray(statsInfo)) {
            const updateCategoryState = statsInfo.reduce((categoryInfo, item) => {
                const { categoryName } = item || {},
                    categoryKey = categoryName?.replace(/\s/g, "").toLowerCase();
                categoryInfo[categoryKey] = item;
                return categoryInfo;
            }, {});
            setCategoryState(updateCategoryState);
        } else {
            setCategoryState({});
        }
    }, [statsInfo]);

    return (
        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-4">
            <DetailsCard
                cardTitle="Total Active Student"
                cardCount={categoryState?.activestudents?.studentCount || 0}
                iconBgColor="tw-bg-green-100"
                iconColor="tw-text-green-600"
                percentageValue={categoryState?.activestudents?.previousYearComparsion || "-"}
                comparisonText="vs. previous Academic Year"
                cardIcon={AdmissionIcon}
                increased={true}
            />

            <DetailsCard
                cardTitle="Active Boys"
                cardCount={categoryState?.activeboys?.studentCount || 0}
                iconBgColor="tw-bg-sky-100"
                iconColor="tw-text-sky-600"
                percentageValue={categoryState?.activeboys?.previousYearComparsion || "-"}
                comparisonText="vs. previous Academic Year"
                cardIcon={BoysIcon}
                increased={true}
            />

            <DetailsCard
                cardTitle="Active Girls"
                cardCount={categoryState?.activegirls?.studentCount || 0}
                iconBgColor="tw-bg-yellow-100"
                iconColor="tw-text-yellow-600"
                percentageValue={categoryState?.activegirls?.previousYearComparsion || "-"}
                comparisonText="vs. previous Academic Year"
                cardIcon={GirlsIcon}
                increased={true}
            />

            <DetailsCard
                cardTitle="In-Active Students"
                cardCount={categoryState?.["in-activestudents"]?.studentCount || 0}
                iconBgColor="tw-bg-red-100"
                iconColor="tw-text-red-600"
                percentageValue={categoryState?.["in-activestudents"]?.previousYearComparsion || "-"}
                comparisonText="vs. previous Academic Year"
                cardIcon={InactiveStudent}
                increased={false}
            />
        </div>
    )
}

export default React.memo(Statistics);