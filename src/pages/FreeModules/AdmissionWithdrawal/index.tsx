import React, { useState, useMemo } from "react";
import classnames from "classnames";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import HorizontalTab from "../../../Components/Common/HorizontalTab";
import AdmissionWithdrawalApproval from "./AdmissionWithdrawalApproval";
import {
  TransferRequestApprovalsOpenModal,
  IMenuOptions,
} from "./TransferRequestApprovalsTypes";
import AdmissionWithdrawalRequests from "./AdmissionWithdrawalRequests";


const tabMenuOptions: Array<any> = [
  {
    id: "admission-wtihdrawal-request",
    labelName: "Admission Withdrawal Requests",
    customPadding: "0px 10px",
    labelCount: 0,
  },
  {
    id: "admission-wtihdrawal-approval",
    labelName: "Admission Withdrawal Approval",
    customPadding: "0px 10px",
    labelCount: 0
  },
  
];

function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
    case "admission-wtihdrawal-request":
      return AdmissionWithdrawalRequests;
    case "admission-wtihdrawal-approval":
      return AdmissionWithdrawalApproval;
  }
}

const AdmissionWithdrawal = () => {
  const [activeTabId, setActiveMenuId] = useState<string | null>("admission-wtihdrawal-request");


  const [
    transferRequestApprovalsModalState,
    setTransferRequestApprovalsModalState,
  ] = useState<TransferRequestApprovalsOpenModal>({
    showModal: false,
    branchId: "",
  });

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveMenuId(menuId);
  }



  const toggleTransferRequestApprovalsModal = () => {
    setTransferRequestApprovalsModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeTabId);
    return <TabComponent />
  }, [activeTabId]);


  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="tw-w-full tw-px-4">
          <BreadCrumb title="Transfer Request Approvals" pageTitle="Fee" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                    Admission Withdrawal Requests
                  </h4>
                </div>
              </div>
            </div>

            <div className="tw-p-0">
              <div className="tw-flex tw-items-center horizontal_tab_wrapper  tw-mb-2 tw-px-3 tw-py-1">
                {tabMenuOptions.map((item: any) => (
                  <div
                    data-id={item.id}
                    onClick={clickMenuHandler}
                    className={`tab_name_wrapper ${classnames({
                      active: item.id === activeTabId,
                    })}`}
                    key={item.id}
                    style={{ padding: `${item?.customPadding || "0px 26px"}` }}
                  >
                    <span className="tw-mr-2 tw-cursor-pointer">{item.labelName}</span>
                    {item.labelCount > 0 && (
                      <span className="tw-bg-red-100 tw-text-red-600 tw-rounded-full tw-px-2 tw-py-0.5 tw-text-xs tw-font-medium">
                        {item.labelCount}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {activeComponent}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdmissionWithdrawal;
