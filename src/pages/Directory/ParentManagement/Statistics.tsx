import React, { useEffect, useState } from "react";
import DetailsCard from "./DetailCard";

import InactiveParentIcon from "../../../assets/imagesdps/directory/icons/inactive_parents.svg";
import EliteParentIcon from "../../../assets/imagesdps/directory/icons/elite_parents.svg";
import IsEmployeeParentIcon from "../../../assets/imagesdps/directory/icons/is_employees_parents.svg";
import TotalParentsIcon from "../../../assets/imagesdps/directory/icons/total_parents.svg";


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
        <div className="tw-grid tw-grid-cols-4 tw-gap-3">
            <DetailsCard
                cardTitle="Total Parents"
                cardCount={categoryState?.totalparent?.parentCount || 0}
                iconBgColor="tw-bg-blue-50"
                cardIcon={TotalParentsIcon}
            />

            <DetailsCard
                cardTitle="Is Employee"
                cardCount={categoryState?.isemployee?.parentCount || 0}
                iconBgColor="tw-bg-yellow-50"
                cardIcon={IsEmployeeParentIcon}
            />

            <DetailsCard
                cardTitle="Elite Parents"
                cardCount={categoryState?.eliteparent?.parentCount || 0}
                iconBgColor="tw-bg-green-50"
                cardIcon={EliteParentIcon}
            />

            <DetailsCard
                cardTitle="Inactive"
                cardCount={categoryState?.inactive?.parentCount || 0}
                iconBgColor="tw-bg-red-50"
                cardIcon={InactiveParentIcon}
            />
        </div>
    )
}

export default React.memo(Statistics);