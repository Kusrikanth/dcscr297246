
import  {  useState } from "react";
import StudentRecords from "../StudentRecords"
import EmployeeRecords from "../EmployeeRecords";
import HorizontalTab from "../../../../Components/Common/HorizontalTab";

const MenuOptions: Array<any> = [

  {
    id: "studentRecords",
    labelName: "Student Records",
    customPadding: "0px 10px",
  },
  {
    id: "employeeRecords",
    labelName: "Employee Records",
    customPadding: "0px 10px",
  },
];

const AllTransportationRecords = () => {

  const [activeTabMenu, setActiveTabMenu] = useState<string | null>("studentRecords");

  function getActiveMenuComponent(menuId: string | null) {
    setActiveTabMenu(menuId);
    switch (menuId) {
      case "studentRecords":
        return StudentRecords;
      case "employeeRecords":
        return EmployeeRecords;
    }
  }

  return (
    <>
      <HorizontalTab
        MenuOptions={MenuOptions}
        getActiveMenuComponent={(menuId: any) =>
          getActiveMenuComponent(menuId)
        }
        activeTabId={activeTabMenu}
        // showBadge={true}
        horizontalClass="tw-px-3 tw-pt-2"
      />

    </>
  );
};

export default AllTransportationRecords;
