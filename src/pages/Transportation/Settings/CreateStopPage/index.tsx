
import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { ConfirmationModal, CustomSelect, ModalContainerUpdated, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, hasStateChanged, renderOptionsRoute, renderValueRoute } from "./helper";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import StopPageModal from "./StopPageModal";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsslice";
import { getRouteListAct, getStopScheduleListAct, updateTimeStopScheduleAct } from "../../../../store/transportation/transportationaction";
import { toast } from "react-toastify";
import { convertTo12HourFormat } from "../../../../utility/dateutility";
import { useModal } from "../../../../hooks/modalhook";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  routeId: "",
};

const CreateStopPage = () => {

  const dispatch = useAppDispatch()

  const { modalState: slabsModal, closeModal: closeSlabsModalHndlr,
    openModal: openSlabsModalHndlr
  } = useModal();
  const [showClearFilterState, setShowClearFilterState] = useState(false);

  const [updateStatusModal, setUpdateStatusModal] = useState<any>({
    showModal: false,
    stopId: "",
    modalData: "",
  })

  const [stopSechduleList, setStopSechduleList] = useState<any[]>([])

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const [allStopsFilterState, setAllStopsFilterState] = useState(initialValues);

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getStopScheduleListResp,
    routeRequestListResp,
    updateTimeStopScheduleResp,
    transportationErrorAct,
  } = useAppSelector(
    ({ globalData, instAcademics, appData, transportrequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getStopScheduleListResp: transportrequest.getStopScheduleListResp,
      routeRequestListResp: transportrequest.routeRequestListResp,
      updateTimeStopScheduleResp: transportrequest.updateTimeStopScheduleResp,
      transportationErrorAct: transportrequest.transportationErrorAct,
    }),
    shallowEqual
  );

  const stopSechduleRef = useRef({
    prevUpdateTimeStopScheduleResp: updateTimeStopScheduleResp,
    prevGetStopScheduleListResp: getStopScheduleListResp,
    prevTransportationErrorAct: transportationErrorAct,
  });

  useEffect(() => {
    const { prevUpdateTimeStopScheduleResp, prevGetStopScheduleListResp, prevTransportationErrorAct } = stopSechduleRef.current;
    if (transportationErrorAct && prevTransportationErrorAct !== transportationErrorAct) {
      const { details } = transportationErrorAct || {};
      toast.error(details || "Something went wrong.");
    }
    else if (updateTimeStopScheduleResp && prevUpdateTimeStopScheduleResp !== updateTimeStopScheduleResp) {
      toast.success("Stop Schedule Updated Sucessfully");
      pagination.current.pageNo = 0
      closeSlabsModalHndlr()
      getStopScheduleList();
    }
    else if (getStopScheduleListResp && prevGetStopScheduleListResp !== getStopScheduleListResp) {
      // setStopSechduleList(getStopScheduleListResp?.data?.map((i:any)=>({...i,pickUpTime : convertTo24HourFormat(i?.pickUpTime),dropTime : convertTo24HourFormat(i?.dropTime) , isEdit: false})) || [])
      setStopSechduleList(getStopScheduleListResp?.data || [])
    }
    stopSechduleRef.current.prevUpdateTimeStopScheduleResp = updateTimeStopScheduleResp;
    stopSechduleRef.current.prevGetStopScheduleListResp = getStopScheduleListResp;
    stopSechduleRef.current.prevTransportationErrorAct = transportationErrorAct;

  }, [updateTimeStopScheduleResp, getStopScheduleListResp, transportationErrorAct]);

  const toggleUpdateStatusModal = (stopId?: any, modalData?: any) => {
    setUpdateStatusModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      stopId: stopId || "",
      modalData: modalData || "",
    }));
  };

  const menuOptions = useMemo((): IOptionsHrtl[] => ([
    {
      id: "edit",
      actionIcon: <EditSvg className="me-2 d-inline-block" fill="#405189" />,
      actionName: "Edit",
      onClickHndlr: (event: any) => {
        const stopId = event.currentTarget.getAttribute("data-id");
        const findData = stopSechduleList?.find((i: any) => +i.stopId === +stopId);
        openSlabsModalHndlr({ stopId, findData });
      },
    },
    //   {
    //     id: "save",
    //     actionIcon: <AllowSvg className="me-2 d-inline-block" fill="#405189" style={{ width: "20px", height: "20px" }}/>,
    //     actionName: "Save",
    //     onClickHndlr: (event: any) => {
    //         const stopId = event.currentTarget.getAttribute("data-id");
    //         const modalData = stopSechduleList?.find((i: any) => +i.stopId === +stopId);
    //         if(modalData?.pickUpTime && modalData?.dropTime){
    //           toggleUpdateStatusModal(stopId,modalData)
    //         }else{
    //           toast.warning("Please enter time before updating")
    //         }
    //     },
    // },
  ]), [stopSechduleList]);

  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setAllStopsFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))

    dispatch(getRouteListAct(generateActionPayload("get_route_details_list", undefined, { branchId, instituteId, pageNo: 0, pageSize: 200, sortBy: "routeName", orderBy: "ASC" })))

    getStopScheduleList({ academicYearId: yearId })
  }, [academicYearListResp, branchId, instituteId]);

  const getStopScheduleList = (otherProps?: any) => {
    let payload = {
      ...allStopsFilterState,
      ...pagination.current,
      ...otherProps,

    };
    dispatch(getStopScheduleListAct(generateActionPayload('get_stop_schedule_list', undefined, payload)))
  }

  const roleColumns = useMemo(() => generateColumns(menuOptions), [stopSechduleList]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0
    setAllStopsFilterState((prev: any) => ({ ...prev, [name]: value }))
    getStopScheduleList({ [name]: value })
    const stateChanged = hasStateChanged({ ...initialValues, [name]: value });
    setShowClearFilterState(stateChanged?.stateChange)
  }

  function paginationHndlr(paginationInfo: any) {
    pagination.current = paginationInfo;
    getStopScheduleList();
  }

  const onChangeInputHndlr = (event: any, stopId: any, name: any) => {
    const newData = stopSechduleList?.map((item: any) => {
      if (+item?.stopId === +stopId) {
        return {
          ...item,
          [name]: event.target.value
        }
      } else {
        return item
      }
    })
    setStopSechduleList(newData || [])
  }

  const updateStatusModalHndler = () => {
    const payload = {
      pickUpTime: convertTo12HourFormat(updateStatusModal?.modalData?.pickUpTime),
      dropTime: convertTo12HourFormat(updateStatusModal?.modalData?.dropTime)
    }

    dispatch(updateTimeStopScheduleAct(generateActionPayload('update_time_stop_schedule', { id: updateStatusModal?.stopId }, payload)))
  }

  function selectRouteHndlr(selectedOptions: any, config?: any) {
    const { name } = config;
    pagination.current.pageNo = 0
    getStopScheduleList({ [name]: selectedOptions })
    setAllStopsFilterState((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
    const stateChanged = hasStateChanged({ ...initialValues, [name]: selectedOptions });
    setShowClearFilterState(stateChanged?.stateChange)
  }

  const clearFilterHndlr = () => {

    pagination.current = { ...pagination.current, pageNo: 0 }
    dispatch(resetBrchClassAct(undefined));
    setAllStopsFilterState({ ...initialValues })
    getStopScheduleList({ ...initialValues })
    setShowClearFilterState(false)
  }

  const { totalElements, totalPages, pageNumber } = getStopScheduleListResp || {}

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Transport Concession" pageTitle="Transportation" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Stops Schedules
                </h4>
                <Button
                  variant="primary"
                  onClick={() => openSlabsModalHndlr()}
                >
                  <i className="ri-add-line" />
                  Add New
                </Button>
              </div>
            </div>
            <div className="tw-p-4">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4 tw-items-end">
                <div>
                  <div className="search-box tw-relative">
                    <TextInput
                      name="searchString"
                      value={allStopsFilterState.searchString}
                      onChange={handleChange}
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search"
                      labelText="Search"
                      floatingLabel
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-2 tw-text-gray-400" />
                  </div>
                </div>
                <div>
                  <CustomSelect
                    name="routeId"
                    containerClassName="tw-mb-0"
                    idKey="id"
                    defaultSelect="Route"
                    value={allStopsFilterState.routeId}
                    renderValue={renderValueRoute}
                    renderOptions={renderOptionsRoute}
                    onChange={selectRouteHndlr}
                    searchKey="routeName"
                    options={routeRequestListResp?.data || []}
                  />
                </div>
                <div className="tw-flex tw-justify-end md:tw-col-span-2">
                  {showClearFilterState && (
                    <Button
                      type="button"
                      variant="wrong"
                      onClick={clearFilterHndlr}
                    >
                      Clear filter
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <TableContainer
              columns={roleColumns || []}
              data={stopSechduleList || []}
              divClass="tw-overflow-x-auto tw-mb-1"
              theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
              onChangeInputHndlr={onChangeInputHndlr}
              showPagination={true}
              totalRecords={totalElements || 0}
              callbackPaginationHndlr={paginationHndlr}
              totalPages={totalPages || 0}
              currentPageNumber={pageNumber || 0}
            />
          </div>
        </div>
        <ModalContainerUpdated
          id="add-edit-create-stop-details"
          isOpen={slabsModal.showModal}
          toggle={closeSlabsModalHndlr}
          modalTitle="Create Stops Schedules"
          modalSize="lg"
        >
          <StopPageModal
            isOpen={slabsModal.showModal}
            toggle={closeSlabsModalHndlr}
            showApiLoader={showApiLoader}
            modalTitle="Update Stops Schedules"
          />
        </ModalContainerUpdated>
      </div>
      <ConfirmationModal
        id="update-status-stop-schedule-form-modal"
        isOpen={updateStatusModal.showModal}
        confirmMessage="Are you sure you want Update Time Slot ?"
        cancelHndlr={() => toggleUpdateStatusModal()}
        confirmHndlr={updateStatusModalHndler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      />
    </>
  );
};

export default CreateStopPage;
