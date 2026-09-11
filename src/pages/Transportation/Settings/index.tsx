import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardBody, Col, Container, Input, Label, Row, Button, CardHeader } from "reactstrap";
import { shallowEqual } from "react-redux";
import classnames from "classnames";
import { useSelector } from "react-redux";

//Common Component
import BreadCrumb from "../../../Components/Common/BreadCrumb";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { useHistory } from "react-router-dom";
//Component
import RoutesTab from "./RoutesTab";
import AllStops from "./AllStops";
import Slabs from "./Slabs";
import CreateStopPage from "./CreateStopPage";
import VehiclesDetails from "./VehicleDetails";
import VehiclesType from "./VehicalsType";
import AssignEmployee from "./AssignEmployee";
import FeeConfigurationSetup from "./FeeConfigurationSetup";
//Images
// import DPSLogoSM from "../../assets/imagesdps/mastersetup/dps_logo.png";
import PGSLogoSM from "../../assets/imagesdps/mastersetup/pgs-logo.png";


//Helpers
// import { menuOptions } from "./helper";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstByIdAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import SlabsTerms from "./SlabsTerms";
import { default as BrchTransportationSvg } from "../../../assets/imagesdps/menuicon/branch-icon/transportation.svg?react";




function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
      case "fee-masters":
          return FeeConfigurationSetup;
      case "routeTabs":
          return RoutesTab;
          case "allStops":
            return AllStops;
      case "slabs":
          return Slabs;
      case "stop-schedules":
          return CreateStopPage;
      case "vehicleDetails":
          return VehiclesDetails;
      case "vehiclesType":
          return VehiclesType;
      case "assign-employee":
          return AssignEmployee;
      case "slabTerms":
          return SlabsTerms;
// const CreateStopPage = () => {
      
  }
}
const routes=[
    {
        id: "routeTabs",
        path:"/transportation-settings/routes-tab"
    },
    {
        id: "allStops",
        path:"/all-stops"
    },
    {
        id: "slabs",
        path:"/slabs"
    },
    {
        id: "stop-schedules",
        path:"/create-stop"
    }
]
const vehicle =[
    {
        id: "vehiclesType",
        path:"/vehicles-types"
    },
    {
        id: "vehicleDetails",
        path:"/vehicles-details"
    },
]

const routeEntry = [
    {
        id: "routeTabs",
        icon: <BrchTransportationSvg />,
        title: "Routes Details",
        info: "View and Update your school Vehicle Types",

    },
    {
        id: "allStops",
         icon: <BrchTransportationSvg />,
        title: "All Stops",
        info: "View and Update your Vehicle Registration Owner & Operation Details",
    },
    {
        id: "slabs",
         icon: <BrchTransportationSvg />,
        title: "Slabs",
        info: "View & Update Routes name and Route No.",
    },
    {
        id: "stop-schedules",
         icon: <BrchTransportationSvg />,
        title: "Stops Schedules",
        info: "View & Update Routes name and Route No.",
    }
]
const vehicles = [
    {
        id: "vehiclesType",
        icon: <BrchTransportationSvg />,
        title: "Vehicle Type",
        info: "View and Update your school Vehicle Types",
    },
    {
        id: "vehicleDetails",
        icon: <BrchTransportationSvg />,
        title: "Vehicle Details",
        info: "View and Update your school Vehicle Types",
    }
]
const usersMapping = [
    {
        id: "assign-employee",
        icon: <BrchTransportationSvg />,
        title: "Assign Employee",
        info: "map driver / attenders/ and transport heads to the vehicle",
    }
]

const transportFee = [
    {
        id: "slabTerms",
        icon: <BrchTransportationSvg />,
        title: "Slabs Terms",
        info: "View & Update Slabs and assign Term wise fee to Slabs.",
    }
]
const TransportSettings = () => {
  const [activeMenuState, setActiveMenuState] = useState<any>({
    menuId: "fee-masters",
    activeComponentId: "fee-masters",
});
const [backTabIdState, setBackTabIdState] = useState({
    tabId: "",
    backTitle: ""
});
const dispatch = useAppDispatch();
const { currentInstIdResp, instituteValue, instDetailsResp } = useAppSelector(({ appData, Layout, instituteInfo }) => ({
    instituteValue: Layout.instituteValue,
    instDetailsResp: instituteInfo.instDetailsResp,
    currentInstIdResp: appData.currentInstIdResp
}), shallowEqual);

function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
        menuId = currentTarget.getAttribute("data-id");
    setActiveMenuState((prevState: any) => ({
        ...prevState, menuId,
        activeComponentId: menuId
    }));
    setBackTabIdState({
        tabId: "",
        backTitle: ""
    });
}


const onClickSettingHndlr = useCallback((event: any) => {
    const tabId = event.currentTarget.getAttribute("data-id");
    if (tabId && activeMenuState.menuId) {
            setActiveMenuState((prevState: any) => ({
                ...prevState,
                activeComponentId: tabId
            }));
    }
}, [activeMenuState]);

const activeComponent = useMemo(() => {
    // if (currentInstIdResp) {
    const TabComponent: any = getActiveMenuComponent(activeMenuState.activeComponentId);
    if (TabComponent)
        return <TabComponent
            activeTabId={activeMenuState}
            instituteName={instDetailsResp?.instituteName}
            instituteId={currentInstIdResp}
            onClickSettingHndlr={onClickSettingHndlr}
        />
    // }
}, [activeMenuState, instDetailsResp, instituteValue, currentInstIdResp,
    onClickSettingHndlr,
    getActiveMenuComponent]);
    const history = useHistory();

    const Settingsroutes = (id:any) => {
        routes.filter((ele,idx)=>{
            if (ele.id==id) {
                history.push(ele.path);
            }
        })
    
      };
      const Settingsvehicle = (id:any) => {
        vehicle.filter((ele,idx)=>{
            if (ele.id==id) {
                history.push(ele.path);
            }
        })
    //     const studentId = event.currentTarget.getAttribute("data-id"),
    //     { academicYearId } = filterState;
    // if (studentId && academicYearId)
    //     history.push(`/student-management/edit-student/${studentId}/${academicYearId}`);
    };

return (
    <>
    <div className="page-content transportaion_dashboard_wrapper">
      <div className="container-fluid">
        <BreadCrumb title="Dashboard" pageTitle="Transportation" />

        <div className=" tw-ps-3">
            {/* <div className="card-body">
                <div className="row gx-2 module-settings-container mb-4">
                    <div className="col-12">
                        <h6 className="title">Route Entry</h6>
                    </div>
                    <div className="col-12">
                        <div className="row gx-3">

                                {routeEntry.map(item => (
                                    <div
                                //  onClickHndlr={()=>editStudentHndlr(item.id)}
                                onClick={()=>Settingsroutes(item.id)}
                                 data-id={item.id} key={item.id} className="col-12 col-lg-6 col-xl-3">
                                    <div className="px-3   setting-card-container">
                                        <div className="img-container">
                                            {item.icon}
                                        </div>
                                        <div className="d-flex flex-column">
                                                <h6 className="setting-title">{item.title}</h6>
                                            <div className="setting-info">
                                                {item.info}
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            ))}

                        </div>


                    </div>

                </div>
                <div className="row gx-2 module-settings-container mb-4">
                    <div className="col-12">
                        <h6 className="title">Vehicles</h6>
                    </div>
                    <div className="col-12">
                        <div className="row gx-3">

                                {vehicles.map(item => (
                               <div onClick={Settingsvehicle} data-id={item.id} key={item.id} className="col-12 col-lg-6 col-xl-3">
                                    <div className="px-3   setting-card-container">
                                        <div className="img-container">
                                            {item.icon}
                                        </div>
                                        <div className="d-flex flex-column">
                                                <h6 className="setting-title">{item.title}</h6>
                                            <div className="setting-info">
                                                {item.info}
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            ))}

                        </div>


                    </div>

                </div>
                <div className="row gx-2 module-settings-container mb-4">
                    <div className="col-12">
                        <h6 className="title">Users Mapping</h6>
                    </div>
                    <div className="col-12">
                        <div className="row gx-3">

                                {usersMapping.map(item => (
                                <div  data-id={item.id} key={item.id} className="col-12 col-lg-6 col-xl-3">
                                    <div className="px-3   setting-card-container">
                                        <div className="img-container">
                                        {item.icon}
                                        </div>
                                        <div className="d-flex flex-column">
                                                <h6 className="setting-title">{item.title}</h6>
                                            <div className="setting-info">
                                                {item.info}
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            ))}

                        </div>


                    </div>

                </div>
                <div className="row gx-2 module-settings-container ">
                    <div className="col-12">
                        <h6 className="title">Transport Fee</h6>
                    </div>
                    <div className="col-12">
                        <div className="row gx-3">

                                {transportFee.map(item => (
                               <div  data-id={item.id} key={item.id} className="col-12 col-lg-6 col-xl-3">
                                    <div className="px-3   setting-card-container">
                                        <div className="img-container">
                                        {item.icon}
                                        </div>
                                        <div className="d-flex flex-column">
                                                <h6 className="setting-title">{item.title}</h6>
                                            <div className="setting-info">
                                                {item.info}
                                            </div>
                                        </div>
                                    </div>
                            </div>
                            ))}

                        </div>


                    </div>
                </div>
            </div>
             */}

                        <div className="">
                            {activeComponent}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TransportSettings;
