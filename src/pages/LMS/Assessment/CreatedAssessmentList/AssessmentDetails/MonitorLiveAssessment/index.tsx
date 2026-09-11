import { useMemo, useState } from "react";
import { TextInput } from "../../../../../../Components/Common";
import UpdatedHorizontalTab from "../../../../../../Components/Common/UpdatedHorizontalTab";
import StudentLive from "./StudentLive";
import IncidentLog from "./IncidentLog";
import StudentCards from "./StudentCards";
import ReadinessLogs from "./ReadinessLogs";
import { CustomDatePicker } from "../../../../../DashBoardBranchSummary/CustomDatePicker";

interface IMenuOptions {
    id: string;
    labelName: string;
    customPadding: string;
}
const MonitorLiveAssessment = () => {
    const [activeId, setActiveId] = useState<any>("readinessLogs");

    const MenuOptions: Array<IMenuOptions> = [
        {
            id: "readinessLogs",
            labelName: "Readiness Logs",
            customPadding: "0px 10px 10px 10px",
        },
        {
            id: "studentLive",
            labelName: "Student Live",
            customPadding: "0px 10px 10px 10px",
        },
        {
            id: "incidentLog",
            labelName: "Incident Log",
            customPadding: "0px 10px 10px 10px",
        }
    ];
    function getActiveMenuComponent(menuId: string) {
        switch (menuId) {
            case "readinessLogs":
                return ReadinessLogs
            case "studentLive":
                return StudentLive;
            case "incidentLog":
                return IncidentLog;
        }
    }

    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
            menuId = currentTarget.getAttribute("data-id");
        setActiveId(menuId);
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeId);
        return <TabComponent />;
    }, [activeId]);

    return (
        <>

            <StudentCards />
            <div className="row align-items-center px-3 mb-3">
                <div className="col-12 col-lg-auto px-0">
                    <UpdatedHorizontalTab
                        MenuOptions={MenuOptions}
                        clickMenuHandler={clickMenuHandler}
                        activeTabId={activeId}
                        horizontalClass="horizontal-menu-updated-style super-admin-tabs"
                    />
                </div>
            </div>
            <div className="card">
                <div className="card-body p-0">
                    <div className="row g-3 p-3">
                        <div className="col-12 col-lg-3">
                            <div className="search-box">
                                <TextInput
                                    name="searchString"
                                    placeHolder="Search"
                                    labelText="Search"
                                    floatingLabel
                                    value={""}
                                    onChange={() => { }}
                                    formgroupClassName="mb-0"
                                />
                                <i className="ri-search-line search-icon"></i>
                            </div>
                        </div>
                        <div className="col-12 col-lg-3">
                            <CustomDatePicker
                                          name="dateRange"
                                          startDate={""}
                                          endDate={""}
                                          onChange={() => {}}
                                          placeholder="Select a Date Range"
                                          monthsShown={2}
                                          formgroupClassName="mb-0"
                                          labelText='Date Range'
                                          floatingLabel
                                        />
                        </div>
                    </div>
                    {activeComponent}
                </div>
            </div>
        </>
    );
};

export default MonitorLiveAssessment;
