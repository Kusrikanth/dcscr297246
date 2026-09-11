import { useMemo, useState } from "react";
import AdmissionSummaryBarView from "./AdmissionSummaryGraph";
import AdmissionSummaryTableView from "./AdmissionSummaryTable";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const AdmissionSummary = ({ branchId , curriculumId , academicYearId }: any) => {
  const [activeId, setActiveId] = useState<any>("admission-summary-bar-view");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "admission-summary-bar-view",
      labelName: "Chart",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "admission-summary-table-view",
      labelName: "Table",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "admission-summary-bar-view":
        return AdmissionSummaryBarView;
      case "admission-summary-table-view":
        return AdmissionSummaryTableView;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);

    return <TabComponent branchId={branchId} academicYearId={academicYearId} curriculumId={curriculumId}></TabComponent>;
  }, [activeId,branchId,academicYearId,curriculumId]);

  return (
    <>
      <div className="tw-grid">
        <div className="card !tw-rounded-2xl !tw-pb-0">
          <div className="card-header !tw-py-2 !tw-rounded-t-2xl">
            <div className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-py-2">
              <div className="">
                <h4 className="card-title !tw-mb-0">
                  Admission Summary
                </h4>
              </div>

              {/* <div className="col-12 col-lg-auto ms-auto">
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  horizontalClass="overflow-auto text-nowrap justify-content-end horizontal-menu-updated-style"
                ></UpdatedHorizontalTab>
              </div> */}
              <div className="">
                <div className="tw-flex tw-gap-3">
                  <button
                    id="export-btn"
                    className="btn btn-icon !tw-rounded-full !tw-bg-sky-100 tw-sky-600 !tw-p-2"
                  >
                    <img src={ExportIcon} className="img-fluid tw-h-full tw-max-w-full" />
                    <UncontrolledTooltip placement="bottom" target="export-btn">
                      Export
                    </UncontrolledTooltip>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card-body !tw-p-0">{activeComponent}</div>
        </div>
      </div>
    </>
  );
};

export default AdmissionSummary;
