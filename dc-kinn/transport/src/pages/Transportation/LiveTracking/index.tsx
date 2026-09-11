import { useFormik } from "formik";
import React, { useCallback, useMemo, useState } from "react";
import { MoreActions, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  LiveTrackingFilterType,
  LiveTrackingTypeModal,
} from "./LiveTrackingTypes";
import { default as ReloadSvg } from "../../../assets/imagesdps/transportation/ReloadSvg.svg?react";
import AccordionCard from "../../../Components/Common/AccordionCard";
import AccordionCardItem from "../../../Components/Common/AccordionCardItem";
import AccordionCardBody from "../../../Components/Common/AccordionCardBody";
import UpdateAccordionCardHeader from "../../../Components/Common/UpdateAccordionCardHeader";
import { Checkbox } from "../../../Components/Common/Checkbox";
import { default as StepperBusSvg } from "../../../assets/imagesdps/transportation/SteperBus.svg?react";
import { default as HistorySvg } from "../../../assets/imagesdps/transportation/HistorySvg.svg?react";
import { default as EyeSvg } from "../../../assets/imagesdps/academics/EyeSvg.svg?react";
import { default as LocationSvg } from "../../../assets/imagesdps/transportation/LocationSvg.svg?react";
import LiveTrackingModal from "./LiveTrackingModal";
import AllocateAnotherVehicleModal from "./AllocateAnotherVehicleModal";

const initialValues: LiveTrackingFilterType = {
  search: "",
};

const LiveTracking = () => {
  const [open, setOpen] = useState<Array<string>>([]);
  const [liveTrackingFilterState, setLiveTrackingFilterState] =
    useState<LiveTrackingFilterType>(initialValues);

  const LiveTrackingFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: liveTrackingFilterState,
    onSubmit: (values) => {},
  });
  const [liveTrackingModalState, setLiveTrackingModalState] =
    useState<LiveTrackingTypeModal>({
      showModal: false,
      branchId: "",
    });
  const [showHistoryModalState, setShowHistoryModalState] =
    useState<LiveTrackingTypeModal>({
      showModal: false,
      branchId: "",
    });

  const [
    allocateAnotherVehicleModalState,
    setAllocateAnotherVehicleModalState,
  ] = useState<LiveTrackingTypeModal>({
    showModal: false,
    branchId: "",
  });
  const toggleLiveTrackingModal = useCallback(() => {
    setLiveTrackingModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  }, []);
  const toggleShowHistoryModal = useCallback(() => {
    setShowHistoryModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  }, []);

  const toggleAllocateAnotherVehicleModal = useCallback(() => {
    setAllocateAnotherVehicleModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  }, []);

  const toggleHandler = (accordionItem: any) => {
    if (open.includes(accordionItem)) {
      let a = open.filter((o) => o !== accordionItem);
      setOpen(a);
    } else {
      setOpen([...open, accordionItem]);
    }
  };
  const menuOptions = useMemo(
    () => [
      {
        id: "showHistory",
        actionIcon: <HistorySvg className="tw-mr-2 tw-inline-block" />,
        actionName: "Show History",
        onClick: () => toggleShowHistoryModal(),
      },
      {
        id: "followTrip",
        actionIcon: <EyeSvg className="tw-mr-2 tw-inline-block" fill="#878a99"/>,
        actionName: "Follow Trip",
        onClick: () => {
          toggleLiveTrackingModal();
        },
      },
      {
        id: "allocateVehicle",
        actionIcon: (
          <StepperBusSvg className="tw-mr-2 tw-inline-block" fill="#8C8C8C" />
        ),
        actionName: "Allocate Vehicle",
        onClick: () => {
          toggleAllocateAnotherVehicleModal();
        },
      },
    ],
    []
  );
  const Routes = [
    {
      routeHeader: "ROUTE2012",
      routes: [
        {
          vehicleNo: "002",
          location: "Janapriya ..",
          checked: false,
        },
        {
          vehicleNo: "002",
          location: "Janapriya ..",
          checked: false,
        },
        {
          vehicleNo: "002",
          location: "Janapriya ..",
          checked: false,
        },
      ],
    },
    {
      routeHeader: "ROUTE2011",
      routes: [
        {
          vehicleNo: "002",
          location: "Janapriya ..",
          checked: false,
        },
        {
          vehicleNo: "002",
          location: "Janapriya ..",
          checked: false,
        },
      ],
    },
  ];
  // const [Routes, setRoutes] = useState(routes);
  // const checkedBoxHandler = (e: any, title: string) => {
  //   let routes = Routes.filter((r) => r.routeHeader === title)[0].routes.map(
  //     (route) => {route.checked = e.target.checked}
  //   );

  // };
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Live Tracking" pageTitle="Transportation" />

          <div className="tw-flex tw-flex-wrap tw-gap-6 live_tracking_wraper">

            <div className="tw-w-full lg:tw-w-4/12">
              <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-200">

                <div className="tw-bg-gray-100 tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                  <div className="tw-flex tw-items-center">
                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-0">
                      Live Tracking
                    </h4>
                  </div>
                </div>

                <div className="tw-p-0">

                  <div className="tw-flex tw-gap-4 tw-p-4">

                    <div className="tw-w-1/2">
                      <div className="tw-flex tw-flex-col tw-w-full tw-p-3 tw-bg-green-100 tw-rounded tw-items-center">
                        <h6 className="tw-text-base tw-text-green-600 tw-font-semibold">
                          20
                        </h6>
                        <span className="tw-text-base tw-text-green-600">
                          On Trip
                        </span>
                      </div>
                    </div>

                    <div className="tw-w-1/2">
                      <div className="tw-flex tw-flex-col tw-w-full tw-p-3 tw-bg-red-100 tw-rounded tw-items-center">
                        <h6 className="tw-text-base tw-text-red-600 tw-font-semibold">
                          00
                        </h6>
                        <span className="tw-text-base tw-text-red-600">
                          Off Trip
                        </span>
                      </div>
                    </div>

                  </div>

                  <div className="tw-flex tw-items-center tw-gap-3 tw-px-4 tw-mb-4">

                    <div className="tw-relative search-box tw-w-full">
                      <TextInput
                        name="search"
                        value={LiveTrackingFilterForm.values.search}
                        onChange={LiveTrackingFilterForm.handleChange}
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>

                    <div className="tw-flex tw-items-center tw-justify-center tw-cursor-pointer">
                      <ReloadSvg width={"25px"} height={"25px"} />
                    </div>

                  </div>

                  <div className="tw-flex tw-bg-gray-100 tw-mt-4 tw-mb-3 tw-w-full tw-py-2 tw-pl-4">

                    <div className="tw-w-6/12 tw-text-sm tw-font-bold">
                      <span>Vehicle No</span>
                    </div>

                    <div className="tw-w-4/12 tw-text-sm tw-font-bold">
                      <span className="tw-whitespace-nowrap">
                        Current Stop
                      </span>
                    </div>

                    <div className="tw-w-2/12"></div>

                  </div>

                  {Routes.map((route, index) => (
                    <div key={index} className="tw-w-full">

                      <AccordionCard
                        open={
                          open.includes(route.routeHeader)
                            ? route.routeHeader
                            : ""
                        }
                        toggleHandler={(accordionItem: any) => {
                          toggleHandler(accordionItem);
                        }}
                        accrodionClass="tw-p-0 tw-rounded-none"
                      >
                        <AccordionCardItem>
                          <UpdateAccordionCardHeader
                            targetId={route.routeHeader}
                            title={route.routeHeader}
                            showCheckbox={true}
                            titleClass={"tw-ml-2 tw-text-gray-500 tw-font-bold"}
                            extraDetails={{
                              totalRoutes: route.routes.length,
                            }}
                          />

                          <AccordionCardBody
                            accordionId={route.routeHeader}
                          >
                            {route.routes.map((r, i) => (
                              <div
                                key={i}
                                className="tw-flex tw-items-center tw-py-2 tw-border-b tw-border-gray-200"
                              >

                                <div className="tw-flex tw-items-center tw-w-6/12">
                                  <Checkbox
                                    checked={r.checked}
                                    onChange={(e: any) =>
                                      (Routes[index].routes[i].checked = true)
                                    }
                                  />
                                  <span className="tw-pl-2 tw-text-sm">
                                    <StepperBusSvg
                                      width={"12px"}
                                      height={"14px"}
                                      fill={"#8C8C8C"}
                                      className={"tw-mr-1"}
                                    />
                                    {r.vehicleNo}
                                  </span>
                                </div>

                                <div className="tw-flex tw-items-center tw-w-4/12">
                                  <LocationSvg
                                    width={"12px"}
                                    height={"15px"}
                                    className={"tw-mr-1"}
                                  />
                                  <span className="tw-whitespace-nowrap">
                                    {r.location}
                                  </span>
                                </div>
                                <div className="tw-w-2/12">
                                  <MoreActions
                                    actionOptions={menuOptions}
                                    isHorizontal={true}
                                  />
                                </div>

                              </div>
                            ))}
                          </AccordionCardBody>

                        </AccordionCardItem>
                      </AccordionCard>

                    </div>
                  ))}

                </div>
              </div>
            </div>

            <div className="tw-w-full lg:tw-w-8/12">
            </div>

          </div>
        </div>
      </div>
      <LiveTrackingModal
        isOpen={liveTrackingModalState.showModal}
        toggle={toggleLiveTrackingModal}
        modalTitle={"Live Tracking"}
        instituteId={"1"}
        instituteName={"Live Tracking"}
        branchId={liveTrackingModalState.branchId}
        editBranchDetails={""}
      />
      <LiveTrackingModal
        isOpen={showHistoryModalState.showModal}
        toggle={toggleShowHistoryModal}
        modalTitle={"Bus History"}
        instituteId={"1"}
        instituteName={""}
        branchId={showHistoryModalState.branchId}
        editBranchDetails={""}
      />

      <AllocateAnotherVehicleModal
        isOpen={allocateAnotherVehicleModalState.showModal}
        toggle={toggleAllocateAnotherVehicleModal}
        modalTitle={"Allocate Another Vehicle"}
        instituteId={"1"}
        instituteName={"Allocate Another Vehicle"}
        branchId={allocateAnotherVehicleModalState.branchId}
        editBranchDetails={""}
      />
    </>
  );
};

export default LiveTracking;
