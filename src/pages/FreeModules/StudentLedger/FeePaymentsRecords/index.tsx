import React, { useState } from "react";
import HorizontalTab from "../../../../Components/Common/HorizontalTab";

import Receipts from "./Receipts";
import { IMenuOptions } from "./FeePaymentsRecordsTypes";
import LedgerDetails from "./LedgerDetails";

const MenuOptions: Array<IMenuOptions> = [
  {
    id: "ledger-details",
    labelName: "Ledger Details",
  },
  {
    id: "receipts",
    labelName: "Receipts",
  },
];

const StudentAllDetails = () => {
  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "ledger-details":
        return LedgerDetails;
      case "receipts":
        return Receipts;
    }
  }

  return (
    <>
      <div className="card">
        <div className="card-body px-0">
          <HorizontalTab
            MenuOptions={MenuOptions}
            getActiveMenuComponent={(menuId: any) =>
              getActiveMenuComponent(menuId)
            }
            activeTabId="ledger-details"
            horizontalClass="ps-4"
          />
        </div>
      </div>
    </>
  );
};

export default StudentAllDetails;
