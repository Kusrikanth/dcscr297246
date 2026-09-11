import React, { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../../../../Components/Common/UpdatedHorizontalTab";
import QuestionWiseSummary from "./QuestionWiseSummary";
import QuestionWiseDetails from "./QuestionWiseDetails";

interface IMenuOptions {
    id: string;
    labelName: string;
    customPadding: string;
    count?: number;
}

interface QuestionWiseAnalysisProps {
    getAssessmentQuestionSectionHeatMapResp: any;
    getStatsByAssessmentResp: any;
}

const QuestionWiseAnalysis: React.FC<QuestionWiseAnalysisProps> = ({
    getAssessmentQuestionSectionHeatMapResp,
    getStatsByAssessmentResp,
}) => {
    const [activeId, setActiveId] = useState<string>("summary");

    const MenuOptions: Array<IMenuOptions> = [
        {
            id: "summary",
            labelName: "Summary",
            customPadding: "0px 10px 6px 10px",
        },
        {
            id: "details",
            labelName: "Details",
            customPadding: "0px 10px 6px 10px",
        },
    ];

    function getActiveMenuComponent(menuId: string) {
        switch (menuId) {
            case "summary":
                return QuestionWiseSummary;
            case "details":
                return QuestionWiseDetails;
            default:
                return QuestionWiseSummary;
        }
    }

    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event;
        const menuId = currentTarget.getAttribute("data-id");
        if (menuId) setActiveId(menuId);
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeId);
        return (
            <TabComponent
                getAssessmentQuestionSectionHeatMapResp={getAssessmentQuestionSectionHeatMapResp}
                getStatsByAssessmentResp={getStatsByAssessmentResp}
            />
        );
    }, [activeId, getAssessmentQuestionSectionHeatMapResp, getStatsByAssessmentResp]);

    return (
        <div className="card h-100">
            <div className="card-header">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h4
                        className="card-title mb-0"
                        style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}
                    >
                        Question wise Analysis (Section Wise)
                    </h4>
                    <UpdatedHorizontalTab
                        MenuOptions={MenuOptions}
                        clickMenuHandler={clickMenuHandler}
                        activeTabId={activeId}
                        horizontalClass="horizontal-menu-updated-style"
                        showBadge={false}
                    />
                </div>
            </div>
            <div className="card-body p-0">{activeComponent}</div>
        </div>
    );
};

export default QuestionWiseAnalysis;
