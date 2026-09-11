import React, { useCallback, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";

import { default as Export2Svg } from "../../../assets/imagesdps/academics/Exports2.svg?react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import HorizontalTab from "../../../Components/Common/HorizontalTab";
import ModifiedHorizontalTab from "../../../Components/Common/ModifiedHorizontalTab";
import { Tabs } from "../../../Components/Common";

import CreatePasswordAccModal from "./CreatePasswordModal";
import DeactivateModal from "./DeactivateModal";
import Employees from "./Employees";
import CreateEmployeeAccModal from "./Employees/CreateEmployeeAccModal";
import {
  CreateEmployeeAccModalType,
  CreateParentAccModalType,
  CreatePasswordAccModalType,
  CreateStudentAccModalType,
  IMenuOptions,
} from "./ManageUserTypes";
import Parent from "./Parent";
import CreateParentAccModal from "./Parent/CreateParentAccModal";
import Students from "./Students";
import CreateStudentAccModal from "./Students/CreateStudentAccModal";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Types and Interface
import { ITabItem } from "../../../Components/Common/Tabs";
import Button from "../../../Components/Common/Button";

const ManageUser = () => {
  const [createEmployeeAccModalState, setCreateEmployeeAccModalState] =
    useState<CreateEmployeeAccModalType>({
      showModal: false,
      branchId: "",
    });

  const [showCreateModalState, setShowCreateModalState] = useState<boolean>(false);

  const { currentInstIdResp: instituteId, currentBranchIdResp: branchId } =
    useAppSelector(({ appData }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
    }), shallowEqual);


  const toggleCreateEmployeeAccModalStateModal = () => {
    setCreateEmployeeAccModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };
  const [createParentAccModalState, setCreateParentAccModalState] =
    useState<CreateParentAccModalType>({
      showModal: false,
      branchId: "",
    });

  const toggleCreateParentAccModalStateModal = () => {
    setCreateParentAccModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };
  const [createStudentAccModalState, setCreateStudentAccModalState] =
    useState<CreateStudentAccModalType>({
      showModal: false,
      branchId: "",
    });

  const toggleCreateStudentAccModalStateModal = () => {
    setCreateStudentAccModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };
  const [menuId, setMenuId] = useState<string | null>("students");
  const menuOptions: Array<ITabItem> = [
    {
      tabId: "students",
      tabName: "Students",
    },
    {
      tabId: "parent",
      tabName: "Parent",
    },
    {
      tabId: "employees",
      tabName: "Employees",
    },
  ];
  const [createPasswordAccModalState, setCreatePasswordAccModalState] =
    useState<CreatePasswordAccModalType>({
      showModal: false,
      branchId: "",
    });
  const [deactivateAccModalState, setDeactivateAccModalState] =
    useState<CreatePasswordAccModalType>({
      showModal: false,
      branchId: "",
    });
  const toggleCreatePasswordAccModalStateModal = () => {
    setCreatePasswordAccModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };
  const toggleDeactivateAccModalStateModal = () => {
    setDeactivateAccModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };
  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "students":
        return Students;
      case "parent":
        return Parent;
      case "employees":
        return Employees;
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
          <BreadCrumb title="User List" pageTitle="User Management" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3 tw-mb-5">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  User List
                </h4>
                <Button
                  type="button"
                  variant="primary"
                  onClick={createUserHndlr}
                  className="tw-flex tw-items-center"
                >
                  <i className="ri-add-line tw-mr-2" />
                  Create User
                </Button>
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
            <div className="tw-px-3 tw-mt-3">
              <Tabs
                activeTabId={menuId}
                tabChangeHndlr={(menuId: any) => {
                  setMenuId(menuId);
                  // getActiveMenuComponent(menuId);
                }}
                tabsList={menuOptions}
                navContainerClass="card-header-tabs tw-border-b nav-tabs"
              />
            </div>
            <div className="tw-flex tw-items-end">

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
      {/* <CreatePasswordAccModal
        isOpen={createPasswordAccModalState.showModal}
        toggle={toggleCreatePasswordAccModalStateModal}
        modalTitle="Create Password"
        instituteId={"1"}
        instituteName={""}
        branchId={createPasswordAccModalState.branchId}
        editBranchDetails={""}
      /> */}

      {/* <CreateParentAccModal
        isOpen={createParentAccModalState.showModal}
        toggle={toggleCreateParentAccModalStateModal}
        modalTitle="Create Parent Account"
        instituteId={"1"}
        instituteName={"Create Parent Account"}
        branchId={createParentAccModalState.branchId}
        editBranchDetails={""}
      /> */}

      {/* <DeactivateModal
        isOpen={deactivateAccModalState.showModal}
        toggle={toggleDeactivateAccModalStateModal}
        modalTitle=""
        instituteId={"1"}
        instituteName={""}
        branchId={deactivateAccModalState.branchId}
        editBranchDetails={""}
      /> */}
    </>
  );
};

export default ManageUser;
