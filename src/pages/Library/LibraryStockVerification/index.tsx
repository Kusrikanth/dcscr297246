import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import StockChecking from "./LibraryStockVerification";
import RelocateStock from "./RelocateStock";


const LibraryStock  = () => {
  
  const [activeId, setActiveId] = useState("stockChecking");

   const MenuOptions = [
    {
      id: "stockChecking",
      labelName: "Stock Verification",
      customPadding: "0px 15px",
    },
    {
      id: "relocateStock",
      labelName: "Relocate",
      customPadding: "0px 15px",
    },
    
  ];
  function getActiveMenuComponent(menuId: string) { 
    switch (menuId) {
      case "stockChecking":
        return StockChecking;
      case "relocateStock":
        return RelocateStock;
      default:
        return null; 
    }
  }
  function clickMenuHandler(event: { currentTarget: any; }) { 
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }
  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return (
      <TabComponent />
    );
  }, [activeId]);
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
            <div className="tw-grid tw-grid-cols-1">
              <div className="tw-col-span-1">
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  showBadge={true}
                  horizontalClass="tw-pt-2 tw-overflow-auto tw-whitespace-nowrap"
                />
                {activeComponent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryStock;
