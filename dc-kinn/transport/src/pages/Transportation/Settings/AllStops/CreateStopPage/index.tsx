import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { ConfirmationModal, CustomSelect, ModalContainerUpdated, SelectInput, TextArea } from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import { default as IButton } from "../../../../../assets/imagesdps/I_Button_svg.svg?react";
import Map from "./Map";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { createAllStopsListAct, getRouteListAct, getRoutesALlStopsAct, getStopsByRouteidAct } from "../../../../../store/transportation/transportationaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import ShiftPosition from "./ShiftPosition";
import { useModal } from "../../../../../hooks/modalhook";
import { generateColumnsForFeeCollection } from "../../../../FrontDesk/Reports/FeeReports/helper";
import { renderOptionsRoute, renderValueRoute } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon, Target01Icon, Target03Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../../Components/Common/Button";

const initialValues: any = {
  routeId: "",
};

const CreateStopPage = () => {

  const history = useHistory()
  const location: any = useLocation()
  const dispatch = useAppDispatch()
  const { modalState: stopPositionModalState, closeModal: closeStopPositionModalHndlr,
    openModal: openPositionModalHandler
  } = useModal();

  const [selectedStops, setSelectedStops] = useState<any[]>([]);
  const [editingStopDetails, setEditingStopDetails] = useState({
    id: "",
    name: "",
  });

  const [mapSelectedInfoState, setMapSelectedInfoState] = useState({
    mapAddress: "",
    latitute: "",
    longitude: ""
  });

  const [confirmModal, setConfirmModal] = useState<any>({
    showModal: false,
    stopId: undefined,
  })

  const { routeRequestListResp, currentBranchIdResp: branchId,
    getRoutesALlStopsResp,
    currentInstIdResp: instituteId, showApiLoader, stopsByRouteIdResp, transportationErrorAct, createAllStopsResp }: any = useAppSelector(({ transportrequest, appData, globalData }) => ({
      routeRequestListResp: transportrequest.routeRequestListResp,
      stopsByRouteIdResp: transportrequest.stopsByRouteIdResp,
      transportationErrorAct: transportrequest.transportationErrorAct,
      createAllStopsResp: transportrequest.createAllStopsResp,
      getRoutesALlStopsResp: transportrequest.getRoutesALlStopsResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
    }), shallowEqual);

  const allStopsRespRef = React.useRef<any>({
    prevStopsByRouteIdResp: stopsByRouteIdResp,
    prevCreateAllStopsResp: createAllStopsResp,
    prevTransportationErrorAct: transportationErrorAct,
  });

  React.useEffect(() => {
    const { prevStopsByRouteIdResp, prevTransportationErrorAct, prevCreateAllStopsResp } = allStopsRespRef.current;
    if (stopsByRouteIdResp && prevStopsByRouteIdResp !== stopsByRouteIdResp) {
      if (stopsByRouteIdResp && stopsByRouteIdResp.length === 0) {
        toast.error("No Stops available for this route")
      }
      const newList = stopsByRouteIdResp.map((item: any) => ({
        ...item, isDeleted: false, stopId: item?.id
      })).sort((a: any, b: any) => Number(a.stopOrderSeq) - Number(b.stopOrderSeq));
      setSelectedStops(newList || [])
    } else if (transportationErrorAct && prevTransportationErrorAct !== transportationErrorAct) {
      const { details } = transportationErrorAct || {};
      toast.error(details)
    }
    else if (createAllStopsResp && prevCreateAllStopsResp !== createAllStopsResp) {
      toast.success(`Stops Created Successfully.`)
      history.push("/transportation-settings/all-stops")
    }
    allStopsRespRef.current.prevStopsByRouteIdResp = stopsByRouteIdResp;
    allStopsRespRef.current.prevCreateAllStopsResp = createAllStopsResp;
    allStopsRespRef.current.prevTransportationErrorAct = transportationErrorAct;

  }, [stopsByRouteIdResp, transportationErrorAct, createAllStopsResp]);

  const allStopsFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values) => { },
  });
  const getRoutesList = (value?: any) => {
    dispatch(getRoutesALlStopsAct(generateActionPayload("route_all_stops_list", { id: branchId, searchString: value || "" },)))

  }


  useEffect(() => {
    if (location.state?.routeId) {
      allStopsFilterForm.setFieldValue("routeId", location.state?.routeId)

      dispatch(getRouteListAct(generateActionPayload("get_route_details_list", undefined, { branchId, instituteId, pageNo: 0, pageSize: 1000, sortBy: "routeName", orderBy: "ASC", routeName: null })))

      dispatch(getStopsByRouteidAct(generateActionPayload("get_stop_byrouteid", {
        routeId: location.state?.routeId, branchId,
      })))
    } else {
      getRoutesList()
    }
  }, [location.state])


  const filterHndler = (event: any) => {
    allStopsFilterForm.handleChange(event)
  }

  const removeStopHandler = () => {
    const newList: any = selectedStops?.map((item: any) => {
      if (item.stopId === confirmModal.stopId) {
        return {
          ...item,
          isDeleted: true
        }
      } else {
        return item
      }
    })
    updateStopOrderSequenceHndlr(newList);
    // setSelectedStops(newList)
    toggleConfirmModal();
  }

  const createStopHndler = () => {
    let stopIndex = 0;
    const stopList: any = [];
    if (Array.isArray(selectedStops)) {
      for (let i = 0; i < selectedStops.length; i++) {
        const item: any = selectedStops[i];
        const existingStopId = stopsByRouteIdResp?.some((i: any) => i?.id === item?.stopId) ? item.stopId : null;
        if (item?.isDeleted && !existingStopId) {
          continue;
        }
        if (!item?.isDeleted) {
          stopIndex += 1;
        }
        stopList.push({
          stopId: existingStopId,
          stopName: item.stopName,
          latitude: item.latitude,
          longitude: item.longitude,
          isDeleted: item.isDeleted,
          stopOrderSeq: !item.isDeleted ? stopIndex : ""
        });
      }
    }
    const payload = {
      branchId, instituteId,
      routeId: allStopsFilterForm.values.routeId,
      stops: stopList
    }
    if (payload.routeId && payload.stops.length > 0) {
      dispatch(createAllStopsListAct(generateActionPayload("create_all_stops_list", undefined, payload)))
    }
  }

  const toggleConfirmModal = (stopId?: any) => {
    setConfirmModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      stopId: stopId || "",
    }));
  };

  function moveStopDownHandler(event: any) {
    const stopId = event.currentTarget.getAttribute("data-id");
    if (stopId) {
      const stopIndex = selectedStops.findIndex((item: any) => item?.stopId?.toString() === stopId);
      if (stopIndex < selectedStops.length - 1) {
        const stopInfo: any = selectedStops[stopIndex],
          belowStopInfo: any = selectedStops[stopIndex + 1],
          updatedStops: any = [...selectedStops];
        updatedStops[stopIndex] = { ...belowStopInfo, stopOrderSeq: stopInfo?.stopOrderSeq };
        updatedStops[stopIndex + 1] = { ...stopInfo, stopOrderSeq: belowStopInfo?.stopOrderSeq };
        setSelectedStops(updatedStops);
      }
    }
  }
  function moveStopUpHandler(event: any) {
    const stopId = event.currentTarget.getAttribute("data-id");
    if (stopId) {
      const stopIndex = selectedStops.findIndex((item: any) => item?.stopId?.toString() === stopId);
      if (stopIndex > 0) {
        const stopInfo: any = selectedStops[stopIndex],
          aboveStopInfo: any = selectedStops[stopIndex - 1],
          updatedStops: any = [...selectedStops];
        updatedStops[stopIndex] = { ...aboveStopInfo, stopOrderSeq: stopInfo?.stopOrderSeq };
        updatedStops[stopIndex - 1] = { ...stopInfo, stopOrderSeq: aboveStopInfo?.stopOrderSeq };
        setSelectedStops(updatedStops);
      }
    }
  }

  function moveParticularPosHandler(event: any) {
    const stopId = event.currentTarget.getAttribute("data-id");
    if (stopId) {
      openPositionModalHandler({
        stopId
      })
    }
  }

  function confirmUpdatePositionHandler(updatePos: any) {
    if (!isNaN(updatePos)) {
      const { modalData } = stopPositionModalState,
        { stopId } = modalData || {};
      const currentStopIndex = selectedStops.findIndex((item: any) => item?.stopId?.toString() === stopId);
      const updatedStopIndex = Number(+updatePos - 1);
      const updatedStops = [...selectedStops];
      let element = updatedStops.splice(currentStopIndex, 1)[0];
      updatedStops.splice(updatedStopIndex, 0, element);
      updateStopOrderSequenceHndlr(updatedStops);
      closeStopPositionModalHndlr();
    }
  }

  function updateStopOrderSequenceHndlr(updatedStops: any) {
    const stopList: any = [];
    let stopIndex = 0;
    if (Array.isArray(updatedStops)) {
      for (let i = 0; i < updatedStops.length; i++) {
        const item: any = updatedStops[i];
        if (!item?.isDeleted) {
          stopIndex += 1;
        }
        stopList.push({
          ...item,
          stopOrderSeq: !item.isDeleted ? stopIndex : ""
        });
      }
    }
    setSelectedStops(stopList);
  }

  function selectRouteHndlr(selectedOptions: any, config?: any) {
    const { name } = config;
    allStopsFilterForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));

  }

  const startEditingStop = (stop: any) => {
    setEditingStopDetails({ id: stop.stopId, name: stop.stopName })
  };

  const saveStopName = (stopId: string) => {
    const updatedStops = selectedStops.map((stop: any) => {
      if (stop.stopId === stopId) {
        return { ...stop, stopName: editingStopDetails.name };
      }
      return stop;
    });
    setSelectedStops(updatedStops);
    setEditingStopDetails({ id: "", name: "" })
  };

  const cancelEditingStop = () => {
    setEditingStopDetails({ id: "", name: "" })
  };

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Settings" pageTitle="Transportation" />

          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4">
            <div className="lg:tw-col-span-4">
              <div className="tw-bg-white tw-rounded-lg tw-shadow-[0px_3px_6px_#00000029]">
                <div className="tw-border-b tw-px-4 tw-py-3 tw-shadow-[0px_3px_6px_#A19E9E29]">
                  <h4 className="tw-text-base tw-font-semibold tw-text-[#070707]">
                    Create Stop
                  </h4>
                </div>

                <div className="tw-p-4">
                  <div className="tw-mb-4">
                    <CustomSelect
                      name="routeId"
                      labelText="Route Name"
                      containerClassName="tw-mb-3"
                      idKey="routeId"
                      labelClass="required"
                      value={allStopsFilterForm.values.routeId}
                      isDisabled={!!location?.state?.routeId}
                      renderValue={renderValueRoute}
                      renderOptions={renderOptionsRoute}
                      onChange={selectRouteHndlr}
                      searchKey="routeName"
                        options={(location?.state?.routeId ? routeRequestListResp?.data?.map((i: any) => ({ ...i, routeId: i.id })) : getRoutesALlStopsResp) || []}
                    />
                    <div className="tw-border-b tw-border-dashed tw-border-[#CFCFCF]" />
                  </div>

                  <div className="tw-flex tw-items-center tw-mb-3">
                    <span className="tw-text-sm tw-text-[#F38B75] tw-flex tw-items-center">
                      <IButton
                        fill="#F38B75"
                        className="tw-cursor-pointer tw-mr-2"
                        style={{ height: "22px" }}
                      />
                      Select the Stops from the Map
                    </span>
                  </div>

                  <div className="tw-flex tw-flex-col tw-gap-3 simplebar-content-wrapper tw-h-[390px]">
                    {selectedStops?.map((stop: any, index: any) => {
                      if (!stop?.isDeleted) {
                        return (
                          <div
                            key={index}
                            className="tw-px-4 tw-py-3 tw-rounded-lg tw-border tw-border-[#F0F0F0] tw-shadow-[0px_3px_6px_#A19E9E29]"
                          >
                            <div className="tw-flex tw-items-center tw-justify-between">
                              <div className="tw-text-[#495057] tw-font-semibold tw-text-sm">
                                {stop?.stopOrderSeq}. Stop Name
                              </div>

                              <div className="tw-flex tw-items-center tw-gap-2">
                                <HugeiconsIcon
                                  icon={PencilEdit01Icon}
                                  size={22}
                                  onClick={() => startEditingStop(stop)}
                                  className="tw-cursor-pointer tw-text-[#405189] hover:tw-text-[#405189]/80"
                                />

                                <i
                                  className="ri-focus-3-line tw-text-primary tw-text-xl tw-cursor-pointer"
                                  data-id={stop?.stopId}
                                  onClick={moveParticularPosHandler}
                                  title="Update Stop Position"
                                />
                                <i
                                  className="ri-arrow-up-circle-fill tw-text-primary tw-text-xl tw-cursor-pointer"
                                  data-id={stop?.stopId}
                                  onClick={moveStopUpHandler}
                                  title="Up"
                                />
                                <i
                                  className="ri-arrow-down-circle-fill tw-text-primary tw-text-xl tw-cursor-pointer"
                                  data-id={stop?.stopId}
                                  onClick={moveStopDownHandler}
                                  title="Down"
                                />
                                <i
                                  className="ri-delete-bin-5-fill tw-text-red-500 tw-text-xl tw-cursor-pointer"
                                  onClick={() =>
                                    toggleConfirmModal(stop?.stopId)
                                  }
                                />
                              </div>
                            </div>

                            {editingStopDetails.id === stop?.stopId ? (
                              <div className="tw-mt-2">
                                <TextArea
                                  name="name"
                                  value={editingStopDetails.name}
                                  onChange={(e) =>
                                    setEditingStopDetails({
                                      ...editingStopDetails,
                                      name: e.target.value,
                                    })
                                  }
                                  placeHolder="Enter stop name"
                                  inputClassName="tw-mb-2"
                                />

                                <div className="tw-flex tw-justify-end tw-gap-2">
                                  <Button
                                    type="button"
                                    onClick={cancelEditingStop}
                                    variant="secondary"
                                  >
                                    Cancel
                                  </Button>

                                  <Button
                                    type="button"
                                    onClick={() => saveStopName(stop.stopId)}
                                    disabled={!editingStopDetails.name.trim()}
                                    variant="primary"
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="tw-text-[#979A9C] tw-text-sm tw-mt-1">
                                {stop?.stopName}
                              </div>
                            )}

                            <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-mt-2">
                              <div>
                                <div className="tw-text-sm tw-font-semibold tw-text-[#495057]">
                                  Latitude
                                </div>
                                <div className="tw-text-sm tw-text-[#979A9C]">
                                  {stop?.latitude}
                                </div>
                              </div>

                              <div>
                                <div className="tw-text-sm tw-font-semibold tw-text-[#495057]">
                                  Longitude
                                </div>
                                <div className="tw-text-sm tw-text-[#979A9C]">
                                  {stop?.longitude}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                <div className="tw-flex tw-justify-end tw-gap-3 tw-p-4 tw-border-t">
                  <Button
                    onClick={() =>
                      history.push("/transportation-settings/all-stops")
                    }
                    variant="secondary"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={createStopHndler}
                    disabled={showApiLoader}
                    variant="primary"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
            <div className="lg:tw-col-span-8 tw-border tw-border-red-500 tw-rounded-lg">
              <Map
                branchId={branchId}
                selectedLocation={mapSelectedInfoState}
                setSelectedStops={setSelectedStops}
                selectedStops={selectedStops}
                routeId={allStopsFilterForm.values.routeId}
                showApiLoader={showApiLoader}
              />
            </div>

          </div>
        </div>
      </div>
      <ConfirmationModal
        id="remove-stops-confirmation-modal"
        isOpen={confirmModal.showModal}
        confirmMessage="This stop will be remove from the list of stops."
        cancelHndlr={() => toggleConfirmModal()}
        confirmHndlr={removeStopHandler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType='reject'
        btnClassName='btn w-sm btn-danger'
      />
      <ModalContainerUpdated
        id="shift-position"
        isOpen={stopPositionModalState.showModal}
        toggle={closeStopPositionModalHndlr}
        modalSize="md"
        modalTitle="Update Stop Position"
      >
        <ShiftPosition
          isOpen={stopPositionModalState.showModal}
          stopsList={selectedStops}
          closeModal={closeStopPositionModalHndlr}
          updatePositionHandler={confirmUpdatePositionHandler}
          stopInfo={stopPositionModalState?.modalData}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default CreateStopPage;
