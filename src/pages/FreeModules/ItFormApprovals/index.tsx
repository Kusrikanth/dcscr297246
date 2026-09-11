import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import RequestedList from "./RequestedList";
import IssuedList from "./IssuedList";
import RejectedList from "./RejectedList";
import { IMenuOptions } from "./ItFormApprovalsTypes";
import { addNewOpenModal } from "../FeeName/feeNameTypes";
import ModifiedHorizontalTab from "../../../Components/Common/ModifiedHorizontalTab";
import AddRequestModal from "./RequestedList/AddRequestModal";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import { getRequestItFormCount } from "../../../store/fee/feeapprovals/feeapprovalactions";
import { ModalContainerUpdated } from "../../../Components/Common";
import Button from "../../../Components/Common/Button";

const ItFormApprovals = () => {
  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "requestedList":
        return RequestedList;
      case "issuedList":
        return IssuedList;
      case "rejectedList":
        return RejectedList;
    }
  }
  const [currentAcademicYearId, setCurrentAcademicYearId] = useState("");
  const [menuId, setMenuId] = useState<string | null>("requestedList");
  const [itFormCount, setITFormCount] = useState<any>({});

  const [addRequestModal, setAddRequestModal] =
    useState<addNewOpenModal>({
      showModal: false,
      branchId: "",
    });
  const dispatch = useAppDispatch();

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "requestedList",
      labelName: "Requested List",
      customPadding: "0px 10px",
      count: itFormCount?.pendingCount || 0
    },
    {
      id: "issuedList",
      labelName: "Issued List",
      customPadding: "0px 10px",
      count: itFormCount?.approvalCount || 0
    },
    {
      id: "rejectedList",
      labelName: "Rejected List",
      customPadding: "0px 10px",
      count: itFormCount?.rejectedCount || 0
    },
  ];

  const {
    currentInstIdResp: instituteId, currentBranchIdResp: branchId, requestITFormCountResp } =
    useAppSelector(({ appData, feeApprovals }) => ({
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        requestITFormCountResp: feeApprovals.requestITFormCountResp,
      }), shallowEqual);

  useEffect(() => {
    if (instituteId) {
      const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    }
  }, [instituteId]);

  useEffect(() => {
    setITFormCount(requestITFormCountResp);
  }, [requestITFormCountResp])

  useEffect(() => {
    if (branchId) {
      dispatch(getRequestItFormCount(generateActionPayload('get_itform_count', undefined, { branchId, academicYearId: currentAcademicYearId })));
    }
  }, [branchId, currentAcademicYearId]);


  const toggleAddRequestModal = () => {
    setAddRequestModal((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const activeComponent = useMemo(() => {
    const TabComponent: any = menuId && getActiveMenuComponent(menuId);
    return (
      menuId === "requestedList" ? <TabComponent
        instituteId={instituteId}
        branchId={branchId}
        toggleAddRequestModal={toggleAddRequestModal}
        setCurrentAcademicYearId={setCurrentAcademicYearId}
      /> : <TabComponent
        instituteId={instituteId}
        branchId={branchId}
        setCurrentAcademicYearId={setCurrentAcademicYearId}
      />
    );
  }, [menuId, instituteId, branchId, setCurrentAcademicYearId]);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="IT Form Approvals" pageTitle="Fee" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
            <div className="tw-p-3 tw-border-b">
              <div className="tw-flex tw-items-center tw-w-full">
                <div className="tw-flex tw-items-center tw-w-full">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    IT Form Issue Details
                  </h4>
                  {menuId === "requestedList" && (
                    <div className="tw-ml-auto">
                      <Button
                      variant="primary"
                        onClick={toggleAddRequestModal}
                      >
                        Add Request
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="tw-flex tw-items-end">
              <ModifiedHorizontalTab
                MenuOptions={MenuOptions}
                getActiveMenuId={(menuId: any) => setMenuId(menuId)}
                activeTabId={menuId}
                showBadge={true}
                horizontalClass="tw-px-3 tw-my-2"
              />
            </div>

            <div className="tw-mt-3">
              <div className="tw-w-full">{activeComponent}</div>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-itform-modal"
        isOpen={addRequestModal.showModal}
        toggle={toggleAddRequestModal}
        modalSize="lg"
        modalTitle="IT Form Request"
      >
        <AddRequestModal
          isOpen={addRequestModal.showModal}
          toggle={toggleAddRequestModal}
          modalTitle="IT Form Request"
          instituteId={"1"}
          instituteName={""}
          branchId={addRequestModal.branchId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default ItFormApprovals;
