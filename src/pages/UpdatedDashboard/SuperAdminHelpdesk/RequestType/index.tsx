import { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import RequestByTicketType from "./RequestByTicketType";
import RequestByDepartment from "./RequestByDepartment";
interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const RequestType = (props: any) => {
  const [activeId, setActiveId] = useState<any>("request-type");
  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "request-type",
      labelName: "Request Type",
      customPadding: "0px 10px 10px 10px",
    },
    {
      id: "tickets-By-Module",
      labelName: "Tickets By Module",
      customPadding: "0px 10px 10px 10px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "request-type":
        return RequestByTicketType;
      case "tickets-By-Module":
        return RequestByDepartment;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent data={props.data} />;
  }, [activeId, props.data]);

  return (
    <div className="card !tw-rounded-2xl !tw-shadow-sm">
      <div className="card-header !tw-py-2 !tw-rounded-t-2xl">
        <div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-items-center">
          <div className="tw-w-full lg:tw-w-auto">
            <h4 className="card-title !tw-mb-0">Request Type</h4>
          </div>
          <div className="tw-w-full lg:tw-w-auto lg:tw-ml-auto">
            <UpdatedHorizontalTab
              MenuOptions={MenuOptions}
              clickMenuHandler={clickMenuHandler}
              activeTabId={activeId}
              horizontalClass="horizontal-menu-updated-style"
            />
          </div>
        </div>
      </div>
      <div className="card-body !tw-p-0 !tw-pb-3 ">{activeComponent}</div>
    </div>
  );
};

export default RequestType;
