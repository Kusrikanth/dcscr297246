import React, { useState, useEffect } from "react";
import DetailsCard from "./DetailCard";

import EmployeeCountIcon from "../../../assets/imagesdps/directory/icons/employeeCount.svg";
import EmployeeAttadance from "../../../assets/imagesdps/directory/icons/new-employee.svg";
import BirthdayIcon from "../../../assets/imagesdps/directory/icons/birth-day.svg";
import NewEmployeeIcon from "../../../assets/imagesdps/directory/icons/employee-attadance.svg"

function Statistics({ statsInfo }: any) {
    const [categoryState, setCategoryState] = useState<any>({});
    useEffect(() => {
        if (Array.isArray(statsInfo)) {
            const updateCategoryState = statsInfo.reduce((categoryInfo, item) => {
                const { name } = item || {},
                    categoryKey = name?.replace(/\s/g, "").toLowerCase();
                categoryInfo[categoryKey] = item;
                return categoryInfo;
            }, {});
            setCategoryState(updateCategoryState);
        }
    }, [statsInfo]);
    return (
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <DetailsCard
                cardTitle="Employee Count"
                cardCount={categoryState?.employeecount?.employeeCount}
                iconBgColor="tw-bg-blue-100"
                iconColor="tw-text-blue-600"
                cardIcon={EmployeeCountIcon}
                bgColor="#E1E2F6"
                leftSubText="Teaching"
                rightSubText="Non Teaching"
                leftSubCount={categoryState?.teachingstaff?.employeeCount}
                rightSubCount={categoryState?.nonteachingstaff?.employeeCount}
            />

            <DetailsCard
                cardTitle="Active Employees"
                cardCount={categoryState?.employeecount?.employeeCount}
                iconBgColor="tw-bg-yellow-100"
                iconColor="tw-text-yellow-600"
                cardIcon={EmployeeAttadance}
                bgColor="#F8EFE2"
                leftSubText="Male"
                rightSubText="Female"
                leftSubCount={categoryState?.maleemployee?.employeeCount}
                rightSubCount={categoryState?.femaleemployee?.employeeCount}
            />

            <DetailsCard
                cardTitle="Employment Status"
                cardCount={categoryState?.employeestatus?.employeeCount}
                iconBgColor="tw-bg-green-100"
                iconColor="tw-text-green-600"
                cardIcon={NewEmployeeIcon}
                bgColor="#EFF7E2"
                leftSubText="New Joinees"
                rightSubText="Resigned"
                leftSubCount={categoryState?.newlyjoinedemployee?.employeeCount}
                rightSubCount={categoryState?.resignedemployee?.employeeCount}
            />

            <DetailsCard
                cardTitle="Today's Celebration"
                cardCount={categoryState?.todaycelebration?.employeeCount}
                iconBgColor="tw-bg-red-100"
                iconColor="tw-text-red-600"
                cardIcon={BirthdayIcon}
                bgColor="#EBEEDF"
                leftSubText="Birthdays"
                rightSubText="Anniversary"
                leftSubCount={categoryState?.todaybirthdays?.employeeCount}
                rightSubCount={categoryState?.todayanniversary?.employeeCount}
            />
        </div>
    )
}

export default React.memo(Statistics);