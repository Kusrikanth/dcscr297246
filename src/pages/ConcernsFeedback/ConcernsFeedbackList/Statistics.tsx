import React from "react";
import DetailsCard from "./DetailCard";
import ConcernFeedbackIcon from "../../../assets/imagesdps/directory/icons/concern_feedback.svg";


function Statistics({ statsInfo }: any) {


    return (
        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-6 tw-gap-3 tw-mb-4">
            <DetailsCard
                cardTitle="Total Tickets"
                cardCount={statsInfo?.total || 0}
                iconBgColor="#3366FF"
                iconColor="text-success"
                cardIcon={ConcernFeedbackIcon}
                increased={true}
            />

            <DetailsCard
                cardTitle="Academic Tickets"
                cardCount={statsInfo?.academicComplaints || 0}
                iconBgColor="#F7C537"
                iconColor="text-info"
                cardIcon={ConcernFeedbackIcon}
                increased={true}
            />

            <DetailsCard
                cardTitle="Non - Academic Tickets"
                cardCount={statsInfo?.nonAcademicComplaints || 0}
                iconBgColor="#94ABE0"
                iconColor="text-warning"
                cardIcon={ConcernFeedbackIcon}
                increased={true}
            />

            <DetailsCard
                cardTitle="Open"
                cardCount={statsInfo?.openComplaints || 0}
                iconBgColor="#D2D5DC"
                iconColor="text-daner"
                cardIcon={ConcernFeedbackIcon}
                increased={false}
            />

            <DetailsCard
                cardTitle="In-Progress"
                cardCount={statsInfo?.inProgressComplaints || 0}
                iconBgColor="#F75513"
                iconColor="text-daner"
                cardIcon={ConcernFeedbackIcon}
                increased={false}
            />

            <DetailsCard
                cardTitle="Closed Tickets"
                cardCount={statsInfo?.closedComplaints || 0}
                iconBgColor="#00CFA5"
                iconColor="text-daner"
                cardIcon={ConcernFeedbackIcon}
                increased={false}
            />
        </div>
    )
}

export default React.memo(Statistics);