import React, { useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import HorizontalTab from "../../../Components/Common/HorizontalTab";
import AssignModule from "./AssignModule";
import ManagePermission from "./ManagePermission";
// import CreatePasswordAccModal from "./CreatePasswordModal";
// import Employees from "./Employees";
// import CreateEmployeeAccModal from "./Employees/CreateEmployeeAccModal";
import {
  //   CreateEmployeeAccModalType,
  //   CreateParentAccModalType,
  //   CreatePasswordAccModalType,
  //   CreateStudentAccModalType,
  IMenuOptions,
} from "./ModulePermissionTypes";
// import Parent from "./Parent";
// import CreateParentAccModal from "./Parent/CreateParentAccModal";
// import Students from "./Students";
// import CreateStudentAccModal from "./Students/CreateStudentAccModal";

const ModulePermission = () => {
  const [menuID, setMenuId] = useState();
  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "assignModule",
      labelName: "Assign Modules",
      customPadding: "0px 10px",
    },
    {
      id: "managePermission",
      labelName: "Manage Permission",
      customPadding: "0px 10px",
    },
  ];
  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "assignModule":
        return AssignModule;
      case "managePermission":
        return ManagePermission;
    }
  }
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb
            title="Module Permission"
            pageTitle="User Management"
            // marginBottom={false}
            extraClass="tw-mb-0"
          />

          <div>
            {/* <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">Manage Users</h4>
                </div> */}
            {/* <div className="col-auto ms-auto">
                  <div className="d-flex">
                    <div className="d-flex">
                      <button
                        className="btn btn-success float-end d-flex align-items-center me-3"
                        onClick={() => {}}
                      >
                        <i className="ri-add-line me-2" />
                        Create User
                      </button>

                      <i className="ri-home-4-line fs-3" onClick={() => {}}></i>
                    </div>
                  </div>
                </div> */}
            {/* </div>
            </div> */}

            <HorizontalTab
              MenuOptions={MenuOptions}
              getActiveMenuComponent={(menuId: any) => {
                setMenuId(menuId);
                return getActiveMenuComponent(menuId);
              }}
              activeTabId="assignModule"
              showBadge={true}
              horizontalClass="py-3"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ModulePermission;
