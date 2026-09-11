import React, { useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import HorizontalTab from "../../../Components/Common/HorizontalTab";
import TCApprovalList from "./TCApprovalList";
import {
  LibraryTCRequestOpenModal,
  IMenuOptions,
} from "./LibraryTCRequestTpes";
import TcRequests from "./TcRequests";

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

const LibraryTCRequest = () => {
  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "tcRequests":
        return TcRequests;
      case "tcApprovalList":
        return TCApprovalList;
    }
  }

  const [
    LibraryTCRequestModalState,
    setLibraryTCRequestModalState,
  ] = useState<LibraryTCRequestOpenModal>({
    showModal: false,
    branchId: "",
  });

  const toggleLibraryTCRequestModal = () => {
    setLibraryTCRequestModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Transfer Request Approvals" pageTitle="Fee" />

          <div className="tw-relative tw-flex tw-flex-col tw-min-w-0 tw-break-words tw-bg-white tw-bg-clip-border tw-border tw-border-solid tw-border-black/10 tw-rounded">
            <div className="tw-p-[1rem_1rem] tw-mb-0 tw-bg-transparent tw-border-b tw-border-solid tw-border-black/10">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-mb-0 tw-flex-grow tw-text-[16px] tw-font-semibold tw-text-[#495057]">
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

export default LibraryTCRequest;
