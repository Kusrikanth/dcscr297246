import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";


import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";

import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getSiblingVerificationListRecordsCount } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { toast } from "react-toastify";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsslice";
import TransportationDetails from "./TransportationDetails";
import TransportationRequests from "./TransportationRequest";
import { ModalContainerUpdated } from "../../../../Components/Common";
import AddTransportationModal from "./AddTransportationModal";
import { getTransportRequestAct } from "../../../../store/transportation/transportationaction";
import Button from "../../../../Components/Common/Button";


const TransferRequestApprovals = () => {

  const [activeId, setActiveId] = useState<any>("transportationDetails");

  const dispatch = useDispatch()
  const [addRequestModal, setAddRequestModal] =
    useState<any>({
      showModal: false,
      branchId: "",
    });


  const {
    userMeResp,
    currentStudentId,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    transportationErrorAct,
    getTransportRequestResp,
    showApiLoader,
    parentChildrensResp
  }: any = useAppSelector(
    ({ login, globalData, directoryStudent, appData, transportrequest }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      currentStudentId: appData.currentStudentId,
      userMeResp: login.userMeResp,
      parentChildrensResp: directoryStudent.parentChildrensResp,
      getTransportRequestResp: transportrequest.getTransportRequestResp,
      transportationErrorAct: transportrequest.transportationErrorAct
    }), shallowEqual);
  const { loggedInUserInformation } = userMeResp || {};

  const transportRef = useRef<any>({
    prevParentChildrensResp: parentChildrensResp,
    prevTransportationErrorAct: transportationErrorAct
  });

  useEffect(() => {
    const { prevTransportationErrorAct } = transportRef.current;
    if (transportationErrorAct && prevTransportationErrorAct !== transportationErrorAct) {
      const { message, details } = transportationErrorAct;
      toast.error(message || details || "Something went wrong.");
    }
    transportRef.current.prevTransportationErrorAct = transportationErrorAct;
  }, [transportationErrorAct]);

  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);

  const selectedChild = useMemo(() => {
    if (Array.isArray(parentChildrensResp) && parentChildrensResp.length > 0) {
      return parentChildrensResp.find(item => item.childId?.toString() === currentStudentId?.toString());
    }
    return null;
  }, [parentChildrensResp, currentStudentId]);

  const toggleAddRequestModal = (apiCall?: any) => {
    if (typeof apiCall === "boolean" && apiCall) {
      if (activeId === "transportationDetails") {
        const payload = {
          academicYearId: selectedChild?.academicYearId,
          branchId: selectedChild?.childBranchId, branchCurriculumId: selectedChild?.curriculumId, classId: selectedChild?.classId,
          searchString: selectedChild?.childCode,
          status: 'ACCEPTED,REJECTED,SUBMITTED'
        }
        dispatch(getTransportRequestAct(generateActionPayload("get_transport_request", undefined, payload)));
      } else {
        const payload = {
          academicYearId: selectedChild?.academicYearId,
          branchId: selectedChild?.childBranchId, branchCurriculumId: selectedChild?.curriculumId, classId: selectedChild?.classId,
          searchString: selectedChild?.childCode,
          status: 'PENDING'
        }
        dispatch(getTransportRequestAct(generateActionPayload("get_transport_request", undefined, payload)));
      }
    }
    setAddRequestModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const MenuOptions: Array<any> = [
    {
      id: "transportationDetails",
      labelName: "Transportation Details",
      customPadding: "0px 10px",
    },
    {
      id: "transportationRequests",
      labelName: "Transportation Requests",
      customPadding: "0px 10px",
    },
  ];

  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "transportationDetails":
        return TransportationDetails;
      case "transportationRequests":
        return TransportationRequests;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }


  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return (
      <TabComponent
        childInfo={selectedChild}
        branchId={selectedChild?.childBranchId}
        instituteId={instituteId}
        loggedInUserInfo={loggedInUserInformation}
      />
    );
  }, [activeId, branchId, instituteId, selectedChild, loggedInUserInformation]);

  const latestRequestStatus = useMemo(() => {
    const { data } = getTransportRequestResp || {};
    if (Array.isArray(data) && data.length > 0) {
      return data[0]?.transportRequestStatus;
    }
    return ""
  }, [getTransportRequestResp]);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Transfer Request Approvals" pageTitle="Transport" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow">

            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-w-full">

                <div className="tw-flex-1">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    School Transportation Details
                  </h4>
                </div>

                {activeId === "transportationRequests" && (
                  <div className="tw-ml-auto">
                    <div className="tw-flex">
                      <Button
                        variant="primary"
                        onClick={() => toggleAddRequestModal()}
                        disabled={latestRequestStatus === "PENDING" || showApiLoader}
                      >
                        <i className="ri-add-line tw-mr-2" />
                        Transportation Requests
                      </Button>
                    </div>
                  </div>
                )}

              </div>
            </div>
            <div className="tw-p-0">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="tw-px-3 tw-pt-2"
              />
              {activeComponent}
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="create-transportrequest-modal"
        isOpen={addRequestModal.showModal}
        toggle={toggleAddRequestModal}
        modalSize="lg"
        modalTitle="Create Transport Request"
      >
        <AddTransportationModal
          isOpen={addRequestModal.showModal}
          toggle={toggleAddRequestModal}
          branchId={branchId}
          childInfo={selectedChild}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default TransferRequestApprovals;
