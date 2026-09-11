import React, { useCallback, useMemo, useState } from "react";
import { Button } from "reactstrap";
import { shallowEqual } from "react-redux";

import { default as Export2Svg } from "../../../assets/imagesdps/academics/Exports2.svg?react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import HorizontalTab from "../../../Components/Common/HorizontalTab";
import ModifiedHorizontalTab from "../../../Components/Common/ModifiedHorizontalTab";
import { Tabs } from "../../../Components/Common";

// import Employees from "./Employees";
// import Parent from "./Parent";
// import Students from "./Students";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Types and Interface
import { ITabItem } from "../../../Components/Common/Tabs";
import StudentInfo from "./StudentInfo";
import EmployeeInfo from "./EmployeeInfo";
import FamilyInfo from "./FamilyInfo";

const LoginInfo = () => {

  const [showCreateModalState, setShowCreateModalState] = useState<boolean>(false);

  const { currentInstIdResp: instituteId, currentBranchIdResp: branchId } =
    useAppSelector(({ appData }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
    }), shallowEqual);


  const [menuId, setMenuId] = useState<string | null>("student-info");
  const menuOptions: Array<ITabItem> = [
    {
      tabId: "student-info",
      tabName: "Student Info",
    },
    {
      tabId: "employee-info",
      tabName: "Staff Info",
    },
    {
      tabId: "family-info",
      tabName: "Parent Info",
    },
  ];

  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "student-info":
        return StudentInfo;
      case "employee-info":
        return EmployeeInfo;
      case "family-info":
        return FamilyInfo;
    }
  }
  const createUserHndlr = () => {
    setShowCreateModalState(true);
  };

  const closeCreateUserHndlr = useCallback(() => {
    setShowCreateModalState(false);
  }, []);
  const activeComponent = useMemo(() => {
    const TabComponent: any = menuId && getActiveMenuComponent(menuId);
    return (
      <TabComponent
        instituteName={""}
        instituteId={instituteId}
        branchId={branchId}
        showCreateUserModal={showCreateModalState}
        closeModalHndlr={closeCreateUserHndlr}
      />
    );
  }, [menuId, instituteId, branchId, showCreateModalState, closeCreateUserHndlr]);
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Login Info" pageTitle="User Management" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Login Info
                </h4>
              </div>
              <div className="tw-ml-auto">
                <div className="tw-d-flex">
                  <div className="tw-d-flex">
                    {/* <button
                        className="btn btn-success float-end d-flex align-items-center"
                        onClick={createUserHndlr}
                      >
                        <i className="ri-add-line me-2" />
                        Create User
                      </button> */}
                    {/* <span
                        className="p-2 rounded-circle"
                        style={{ backgroundColor: "#DEEAF7" }}
                        onClick={toggleDeactivateAccModalStateModal}
                      >
                        <Export2Svg />
                      </span> */}
                    {/* <i
                        className="ri-home-4-line fs-3"
                        onClick={toggleCreatePasswordAccModalStateModal}
                      ></i> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-px-3 tw-mt-4">
              <Tabs
                activeTabId={menuId}
                tabChangeHndlr={(menuId: any) => {
                  setMenuId(menuId);
                  // getActiveMenuComponent(menuId);
                }}
                tabsList={menuOptions}
                navContainerClass="card-header-tabs nav-tabs"
              />
            </div>
            <div className="tw-d-flex tw-items-end">
              {/* <ModifiedHorizontalTab
                MenuOptions={MenuOptions}
                getActiveMenuId={(menuId: any) => {
                  setMenuId(menuId);
                  // getActiveMenuComponent(menuId);
                }}
                activeTabId={menuId}
                showBadge={true}
                horizontalClass="px-3 pt-2"
              // btnShow={true}
              /> */}
              {/* <div className="ms-auto pe-3">
                <Button className="botton botton-success btn-soft-success me-2" onClick={toggleCreatePasswordAccModalStateModal}>
                  Change Password
                </Button>
                <Button className="botton botton-error btn-soft-danger" onClick={toggleDeactivateAccModalStateModal}>
                  Deactive Account
                </Button>
              </div> */}
            </div>
            <div className="tw-pt-4">
              {activeComponent}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginInfo;
