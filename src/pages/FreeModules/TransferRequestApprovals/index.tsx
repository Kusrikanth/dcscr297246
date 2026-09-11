import  { useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import HorizontalTab from "../../../Components/Common/HorizontalTab";
import TCApprovalList from "./TCApprovalList";
import {
  TransferRequestApprovalsOpenModal,
  IMenuOptions,
} from "./TransferRequestApprovalsTypes";
import TcRequests from "./TcRequests";
import { useLocation } from "react-router-dom";

const MenuOptions: Array<IMenuOptions> = [
  {
    id: "tcRequests",
    labelName: "TC Requests",
    customPadding: "0px 10px",
  },
  {
    id: "tcApprovalList",
    labelName: "TC Approval List",
    customPadding: "0px 10px",
  },
];

const TransferRequestApprovals = () => {

  const location = useLocation();

  // This component is used in Library Transfer Request Details and Fee Transfer Request Approvals pages; the condition below adapts the logic for each context.
 
  const deptName = (location.pathname.includes("library") ? 'LIBRARY' : 'ACCOUNTS')

  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "tcRequests":
        return TcRequests;
      case "tcApprovalList":
        return TCApprovalList;
    }
  }

  const [
    transferRequestApprovalsModalState,
    setTransferRequestApprovalsModalState,
  ] = useState<TransferRequestApprovalsOpenModal>({
    showModal: false,
    branchId: "",
  });

  const toggleTransferRequestApprovalsModal = () => {
    setTransferRequestApprovalsModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  return (
    <>
      <div className="page-content tw-free_payment_record_wrapper">
        <div className="tw-w-full tw-px-4">
          <BreadCrumb
            title="Transfer Request Approvals"
            pageTitle={deptName === "ACCOUNTS" ? "Fee" : "Library"}
          />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-5">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                    Transfer Request Details List
                  </h4>
                </div>
                
              </div>
            </div>

            <HorizontalTab
              MenuOptions={MenuOptions}
              getActiveMenuComponent={(menuId: any) =>
                getActiveMenuComponent(menuId)
              }
              showBadge={false}
              activeTabId="tcRequests"
              horizontalClass="tw-px-3 tw-pt-2"
            />
          </div>
        </div>
      </div>


    </>
  );
};

export default TransferRequestApprovals;
