import { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import OpenTicketsByRequestType from "./OpenTicketsByRequestType";
import TicketsOverview from "./TicketsOverview";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const TicketsSummary = (props: any) => {
  const [activeId, setActiveId] = useState<any>("open-tickets");
  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "open-tickets",
      labelName: "Open Tickets",
      customPadding: "0px 10px 10px 10px",
    },
    {
      id: "tickets-overview",
      labelName: "Tickets Overview",
      customPadding: "0px 10px 10px 10px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "open-tickets":
        return OpenTicketsByRequestType;
      case "tickets-overview":
        return TicketsOverview;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent data={props.data} stats={props.stats} />;
  }, [activeId, props.data, props.stats]);

  return (
    <div className="card !tw-rounded-2xl !tw-shadow-sm">
      <div className="card-header !tw-py-2 !tw-rounded-t-2xl">
        <div className="tw-grid tw-grid-cols-12 tw-gap-y-3 tw-items-center tw-justify-between">
          <div className="tw-col-span-12 lg:tw-col-span-4">
            <h4 className="card-title !tw-mb-0">Tickets Summary</h4>
          </div>
          <div className="tw-col-span-12 lg:tw-col-span-8 tw-ml-auto">
            <UpdatedHorizontalTab
              MenuOptions={MenuOptions}
              clickMenuHandler={clickMenuHandler}
              activeTabId={activeId}
              horizontalClass="horizontal-menu-updated-style"
            />
          </div>
        </div>
      </div>
      <div className="card-body tw-flex tw-justify-center tw-items-center">{activeComponent}</div>
    </div>
  );
};

export default TicketsSummary;
