import { useMemo, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import All from "./All";
import Matched from "./Matched";
import Unmatched from "./Unmatched";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { DateInput } from "../../../Components/Common";
import { setPaymentReconciliationTabIdAct } from "../../../store/global/globalslice";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";

const formatDefaultDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const today = new Date();

const initialValues = {
  date_from: formatDefaultDate(yesterday),
  date_to: formatDefaultDate(today),
};

const PaymentReconciliation = () => {

  const history = useHistory();
  const dispatch = useAppDispatch();
  const [filterState, setFilterState] = useState(initialValues);

  const {
    paymentReconciliationTabId
  } = useAppSelector(
    ({ globalData, }) => ({
      paymentReconciliationTabId: globalData.paymentReconciliationTabId,
    }),
    shallowEqual
  );


  const [activeId, setActiveId] = useState(paymentReconciliationTabId || "all");

  const MenuOptions = [
    {
      id: "all",
      labelName: "All",
      customPadding: "0px 15px",
    },
    {
      id: "matched",
      labelName: "Matched",
      customPadding: "0px 15px",
    },
    {
      id: "unmatched",
      labelName: "Unmatched",
      customPadding: "0px 15px",
    },
  ];
  function getActiveMenuComponent(menuId: any) {
    dispatch(setPaymentReconciliationTabIdAct(menuId))
    switch (menuId) {
      case "all":
        return All;
      case "matched":
        return Matched;
      case "unmatched":
        return Unmatched;
      default:
        return null;
    }
  }
  function clickMenuHandler(event: any) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilterState((prev: any) => ({ ...prev, [name]: value }));

  };

  const ActiveComponent = getActiveMenuComponent(activeId);

  const handleDateChange = ({ startDate, endDate }:any)=>{
    if(startDate && endDate){
      setFilterState((prev:any) => ({ ...prev, date_from:startDate, date_to:endDate }));
    }
}

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="CBSE Examination Managment" pageTitle="Fee" />

          <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-mt-4">

            <div className="tw-border-b tw-px-6 tw-py-4">
              <div className="tw-flex tw-items-center tw-justify-between">

                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Payment Reconciliation
                  </h4>
                </div>
              </div>
            </div>

            <div className="tw-p-0">

              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-x-auto tw-whitespace-nowrap"
              />

              <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-p-6">

                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-3">
                  <CustomDatePicker
                    name="dateRange"
                    startDate={filterState.date_from}
                    endDate={filterState.date_to}
                    onChange={handleDateChange}
                    placeholder="Select a Date Range"
                    monthsShown={2}
                    formgroupClassName="tw-mb-0"
                    labelText="Date Range"
                    placement="bottom-start"
                  />
                </div>
              </div>
              {ActiveComponent && (
                <ActiveComponent filterState={filterState} />
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default PaymentReconciliation;
