import React from "react";
import DetailsCard from "./DetailCard";

import BoysIcon from "../../../assets/imagesdps/directory/icons/boys_icon.svg";
import GirlsIcon from "../../../assets/imagesdps/directory/icons/girls_icon.svg";
import AdmissionIcon from "../../../assets/imagesdps/directory/icons/admission_icon.svg";
import AdmissionCompletedIcon from "../../../assets/imagesdps/directory/icons/admission_completed.svg";

import InactiveStudent from "../../../assets/imagesdps/directory/icons/inactive-student.svg";

function Statistics({ statsInfo }: any) {
    
    return (
        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-5 tw-gap-3">
            <DetailsCard
                cardTitle="Total Applications Paid"
                cardCount={statsInfo?.paidApplicationSales?.total || 0}
                iconBgColor="tw-bg-green-100"
                iconColor="tw-text-green-600"
                percentageValue={statsInfo?.paidApplicationSales?.vsPrevMonthPercent || "-"}
                comparisonText="vs. previous month"
                cardIcon={AdmissionIcon}
                increased={!isNaN(statsInfo?.paidApplicationSales?.vsPrevMonthPercent)&&+statsInfo?.paidApplicationSales?.vsPrevMonthPercent>0}
            />
            <DetailsCard
                cardTitle="Completed Registrations"
                cardCount={statsInfo?.registrationsCompletedStats?.total || 0}
                iconBgColor="tw-bg-blue-100"
                iconColor="tw-text-blue-600"
                percentageValue={statsInfo?.registrationsCompletedStats?.vsPrevMonthPercent || "-"}
                comparisonText="vs. previous month"
                cardIcon={BoysIcon}
                increased={!isNaN(statsInfo?.registrationsCompletedStats?.vsPrevMonthPercent)&&+statsInfo?.registrationsCompletedStats?.vsPrevMonthPercent>0}
            />
            <DetailsCard
                cardTitle="Pending Registrations"
                cardCount={statsInfo?.registrationsPendingStats?.total || 0}
                iconBgColor="tw-bg-red-100"
                iconColor="tw-text-red-600"
                percentageValue={statsInfo?.registrationsPendingStats?.vsPrevMonthPercent || "-"}
                comparisonText="vs. previous month"
                cardIcon={InactiveStudent}
                increased={!isNaN(statsInfo?.registrationsPendingStats?.vsPrevMonthPercent)&&+statsInfo?.registrationsPendingStats?.vsPrevMonthPercent>0}
            />
            <DetailsCard
                cardTitle="Admission Process Completed"
                cardCount={statsInfo?.admissionProcessConfirmedStats?.total || 0}
                iconBgColor="tw-bg-green-100"
                iconColor="tw-text-yellow-600"
                percentageValue={statsInfo?.underEvalStats?.vsPrevMonthPercent || "-"}
                comparisonText="vs. previous month"
                cardIcon={AdmissionCompletedIcon}
                increased={!isNaN(statsInfo?.saleStats?.vsPrevMonthPercent)&&+statsInfo?.saleStats?.vsPrevMonthPercent>0}
            />
            <DetailsCard
                cardTitle="Admission Confirmed"
                cardCount={statsInfo?.admissionConfirmStats?.total || 0}
                iconBgColor="tw-bg-yellow-100"
                iconColor="tw-text-yellow-600"
                percentageValue={statsInfo?.underEvalStats?.vsPrevMonthPercent || "-"}
                comparisonText="vs. previous month"
                cardIcon={GirlsIcon}
                increased={!isNaN(statsInfo?.saleStats?.vsPrevMonthPercent)&&+statsInfo?.saleStats?.vsPrevMonthPercent>0}
            />
           
        </div>
    )
}

export default React.memo(Statistics);