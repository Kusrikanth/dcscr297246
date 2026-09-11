import React, { useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import HorizontalTab from "../../../Components/Common/HorizontalTab";
import {
  IMenuOptions,
  UploadNewRequestsModalType,
} from "./TransportationRecordsTypes";
import AllRecords from "./AllRecords";
import StudentRecords from "./StudentRecords"
import EmployeeRecords from "./EmployeeRecords";
import ChangeRequests from "./ChangeRequests";
import UploadNewRequestsModal from "./UploadNewRequestsModal";
import Termination from "./Termination";
import { useHistory } from "react-router-dom";
import NewRequests from "./NewRequests";
import { Button, ModalContainerUpdated } from "../../../Components/Common";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { setTransportationTabIdAct } from "../../../store/global/globalslice";

const MenuOptions: Array<IMenuOptions> = [
  {
    id: "allStudents",
    labelName: "All Records",
    customPadding: "0px 10px",
  },
  // {
  //   id: "studentRecords",
  //   labelName: "Student Records",
  //   customPadding: "0px 10px",
  // },
  // {
  //   id: "employeeRecords",
  //   labelName: "Employee Records",
  //   customPadding: "0px 10px",
  // },
  {
    id: "newRequests",
    labelName: "New Requests",
    customPadding: "0px 10px",
  },
  {
    id: "changeRequests",
    labelName: "Change Requests",
    customPadding: "0px 10px",
  },
  {
    id: "termination",
    labelName: "Termination",
    customPadding: "0px 10px",
  },
];

const TransportationRecords = () => {
  const history = useHistory();

  const dispatch = useDispatch();
  const {
    transportationTabId
  } = useAppSelector(
    ({ globalData, }) => ({
      transportationTabId: globalData.transportationTabId,
    }),
    shallowEqual
  );

  const [activeTabMenu, setActiveTabMenu] = useState<string | null>(transportationTabId || "allStudents");
  function getActiveMenuComponent(menuId: string | null) {
    setActiveTabMenu(menuId);
    switch (menuId) {
      case "allStudents":
        return AllRecords;
      case "newRequests":
        return NewRequests;
      case "changeRequests":
        return ChangeRequests;
      case "termination":
        return Termination;
    }
  }

  const [uploadNewRequestsModalState, setUploadNewRequestsModalState] =
    useState<UploadNewRequestsModalType>({
      showModal: false,
      branchId: "",
    });

  const toggleUploadNewRequestsModal = () => {
    setUploadNewRequestsModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const moveToNewRequestHandler = (activeTabId: string | null) => {
    dispatch(setTransportationTabIdAct(activeTabId));
    switch (activeTabId) {
      case "changeRequests":
        history.push("/create-change-request");
        break;
      case "termination":
        history.push("/create-termination-request");
        break;
      case "newRequests":
        history.push("/create-new-request");
        break;
    }
  };
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb
            title="Transportation Records"
            pageTitle="Transportation"
          />

          <div className="card">
            <div className="card-header">
              <div className="tw-flex tw-items-center tw-justify-between">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Transportation Records
                  </h4>
                </div>

                <div className="tw-flex tw-items-center">
                  {activeTabMenu !== "allStudents" && (
                    <Button
                      onClick={() => moveToNewRequestHandler(activeTabMenu)}
                      variant="primary"
                    >
                      <i className="ri-add-line" />
                      Create New
                    </Button>
                  )}

                  {/*
            <span
              className="tw-ml-2 tw-flex tw-items-center tw-justify-center tw-p-2 tw-rounded-full tw-bg-[#DEEAF7] tw-cursor-pointer"
              onClick={toggleUploadNewRequestsModal}
            >
              <ImportSvg />
            </span>
            */}
                </div>
              </div>
            </div>

            <HorizontalTab
              MenuOptions={MenuOptions}
              getActiveMenuComponent={(menuId: any) =>
                getActiveMenuComponent(menuId)
              }
              activeTabId={activeTabMenu}
              horizontalClass="tw-px-3 tw-pt-2"
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="upload-new-request-modal"
        isOpen={uploadNewRequestsModalState.showModal}
        toggle={toggleUploadNewRequestsModal}
        modalTitle={"Upload New Requests"}
        modalSize="lg"
      >
        <UploadNewRequestsModal
          isOpen={uploadNewRequestsModalState.showModal}
          toggle={toggleUploadNewRequestsModal}
          modalTitle={"Upload New Requests"}
          instituteId={"1"}
          instituteName={"Upload New Requests"}
          branchId={uploadNewRequestsModalState.branchId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default TransportationRecords;
