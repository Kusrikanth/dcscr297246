import React, { useEffect, useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroup02Icon, StudentsIcon } from "@hugeicons-pro/core-stroke-standard";
import MostAbsenteesLastMnth from "./MostAbsenteesLastMnth";
import TopPresentStudents from "./TopPresentStudents";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import Button from "../../../../Components/Common/Button";
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const AttendanceSummary = (props: any) => {
  const [activeId, setActiveId] = useState<string | null>("MostAbsenteesLastMnth");
  const [currentPageSizeState, setCurrentPageSizeState] = useState<any>(10);

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "MostAbsenteesLastMnth",
      labelName: "Class Attendance Summary",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={StudentsIcon}
          size={24}
          color={activeId === "MostAbsenteesLastMnth" ? "#0AB39C" : "#9599AD"}
          className="me-2"
        />
      ),
    },
    {
      id: "topPresentStudents",
      labelName: "Top 10 Students by Attandance",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={UserGroup02Icon}
          size={24}
          color={activeId === "topPresentStudents" ? "#0AB39C" : "#9599AD"}
          className="me-2"
        />
      ),
    },

  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "MostAbsenteesLastMnth":
        return MostAbsenteesLastMnth;
      case "topPresentStudents":
        return TopPresentStudents;
      default:
        return null;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId || "");
    return (
      <TabComponent getAttendanceDashboardResp={props.getAttendanceDashboardResp} />
    );
  }, [activeId, props.getAttendanceDashboardResp]);

  useEffect(() => {
    setCurrentPageSizeState(0);
  }, [activeId]);

  const handleDateChange = ({ startDate, endDate }: any) => {
    props.onAbsenteesDateChange({
      startDate,
      endDate,
    });
  };

  return (
    <>
      <div className="tw-bg-white tw-rounded-lg tw-shadow tw-overflow-hidden xl:tw-mb-0">
        <div className="tw-border-b tw-pb-0 tw-mt-3">
          <div className="tw-flex tw-items-center">
            <UpdatedHorizontalTab
              MenuOptions={MenuOptions}
              clickMenuHandler={clickMenuHandler}
              activeTabId={activeId}
              horizontalClass="tw-pl-0 tw-overflow-x-auto tw-whitespace-nowrap"
            />
          </div>
        </div>

        <div
          className="tw-w-full tw-mx-auto tw-p-0"
          style={{
            zIndex: "1",
            minHeight: "100px",
            maxHeight: "396px",
          }}
        >
          {activeId === "MostAbsenteesLastMnth" && (
            <div className="tw-flex tw-items-end tw-my-3 tw-px-3">
              <div className="tw-ml-auto tw-w-[300px]">
                <CustomDatePicker
                  name="dateRange"
                  startDate={props.filterState.absentesStartDate}
                  endDate={props.filterState.absentesEndDate}
                  onChange={handleDateChange}
                  placeholder="Select a date range"
                  monthsShown={2}
                  formgroupClassName="tw-mb-0"
                  labelText="Date Range"
                  floatingLabel
                />
              </div>

              <div className="tw-flex tw-items-end tw-ml-3">
                <Button
                  id="export-btn"
                  onClick={props.openExportModal}
                  variant="exportBtn"
                >
                  <img
                    src={ExportIcon}
                    className="tw-h-5 tw-w-5"
                    alt="export"
                  />
                </Button>

                <UncontrolledTooltip
                  placement="bottom"
                  target="export-btn"
                >
                  Export
                </UncontrolledTooltip>
              </div>
            </div>
          )}
          <div
            className="tw-overflow-y-auto"
            style={{
              maxHeight: "325px",
            }}
          >
            {activeComponent}
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceSummary;
