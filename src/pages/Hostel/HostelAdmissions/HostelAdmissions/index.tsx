import { useMemo, useState } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import HostelAdmission from "./HostelAdmission";
import HostelShortlistDetails from "./HostelShortlistDetails";
import HostelTermination from "./HostelTermination";
import { useHistory } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { setHostelAdmissionTabIdAct } from "../../../../store/global/globalslice";
import Button from "../../../../Components/Common/Button";

const HostelAdmissions = () => {

  const history = useHistory();
  const dispatch = useAppDispatch();
  
  const {
    hostelAdmissionTabId
  } = useAppSelector(
    ({ globalData, }) => ({
      hostelAdmissionTabId: globalData.hostelAdmissionTabId,
    }),
    shallowEqual
  );
  
  const [activeId, setActiveId] = useState(hostelAdmissionTabId || "hostelAdmissionsRequests");

  const MenuOptions = [
    {
      id: "hostelAdmissionsRequests",
      labelName: "Hostel Admissions Requests",
      customPadding: "0px 15px",
    },
    {
      id: "hostelShortlistDetails",
      labelName: "Hostel Shortlist Details",
      customPadding: "0px 15px",
    },
    {
      id: "hostelTerminationRequests",
      labelName: "Hostel Termination Requests",
      customPadding: "0px 15px",
    },
  ];
  function getActiveMenuComponent(menuId: any) {
    dispatch(setHostelAdmissionTabIdAct(menuId))
    switch (menuId) {
      case "hostelAdmissionsRequests":
        return HostelAdmission;
      case "hostelShortlistDetails":
        return HostelShortlistDetails;
      case "hostelTerminationRequests":
        return HostelTermination
      default:
        return null;
    }
  }
  function clickMenuHandler(event: any) {
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

  const moveCreateTerminationHndler = ()=>{
    history.push("/create-hostel-termination")
  }

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="CBSE Examination Managment" pageTitle="Hostel" />

          <div className="tw-bg-white tw-shadow tw-rounded-lg">
            <div className="tw-px-4 tw-py-3 tw-border-b tw-border-gray-200">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-1">
                    Hostel Admission
                  </h4>
                </div>
                { activeId === "hostelTerminationRequests" && <div className="tw-ml-auto tw-w-auto">
                  <Button
                    variant="primary"
                    onClick={moveCreateTerminationHndler}
                  >
                    <i className="ri-add-line tw-mr-2" />
                    Create Termination Req
                  </Button>
                </div>}
              </div>
            </div>
            <div className="tw-p-0">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-auto tw-whitespace-nowrap"
              />
              {activeComponent}
            </div>
          </div>
        </div>
      </div>
     
    </>
  );
};

export default HostelAdmissions;
