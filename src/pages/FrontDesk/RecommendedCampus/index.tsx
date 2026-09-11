import { useEffect, useMemo, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getInstBranchesAct } from "../../../store/mastersettings/branch/branchactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import CurrentBranchToOtherBranch from "./CurrentBranchToOtherBranch";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const RecommendedCampus = () => {
  const [activeId, setActiveId] = useState<any>(
    "other-branch-to-current-branch"
  );

  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp,
    branchListResp,
  }: any = useAppSelector(
    ({ appData, branch }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      branchListResp: branch.branchListResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (currentInstIdResp) {
      const payload = {
        pageSize: 100,
        pageNo: 0,
        instituteId: currentInstIdResp,
      };
      dispatch(
        getInstBranchesAct(
          generateActionPayload("get_inst_branches", undefined, payload, {
            hideLoader: true,
          })
        )
      );
    }
  }, [currentInstIdResp]);

  const currentBranch = useMemo(() => {
    if (branchListResp && branchListResp.data.length > 0) {
      return (
        branchListResp.data.find((item) => +item.branchId === +branchId) || {}
      );
    }
  }, [currentInstIdResp, branchId, branchListResp]);

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "other-branch-to-current-branch",
      labelName: `Other Branch to ${
        currentBranch?.branchName ? currentBranch?.branchName : "Current branch"
      }`,
      customPadding: "0px 10px 4px 10px",
    },
    {
      id: "current-branch-to-other-branch",
      labelName: `${
        currentBranch?.branchName ? currentBranch?.branchName : "Current branch"
      } to Other Branch`,
      customPadding: "0px 10px 4px 10px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "other-branch-to-current-branch":
        return CurrentBranchToOtherBranch;
      case "current-branch-to-other-branch":
        return CurrentBranchToOtherBranch
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const menuId = event.currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent activeId={activeId} />;
  }, [activeId]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb
          title="Recommended Campus"
          pageTitle="Recommended Campus"
        />

        <div className="tw-bg-white tw-rounded-lg tw-shadow">

          <div className="tw-border-b tw-px-6 tw-py-3">
            <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 !tw-mb-0">
              Recommended Campus
            </h4>
          </div>

          <div className="tw-p-0">
            <div className="tw-grid tw-grid-cols-1">

              <div className="tw-col-span-1">
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  horizontalClass=""
                />
              </div>

              <div className="tw-col-span-1">
                {activeComponent}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default RecommendedCampus;
