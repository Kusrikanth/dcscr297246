import { useFormik } from "formik";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { ConfirmationModal, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { GenerateColumns } from "./helper";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteSvg } from "../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { useHistory } from "react-router-dom";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deleteAllStopsListAct, getAllStopsListAct, getStopsByRouteAct } from "../../../../store/transportation/transportationaction";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const AllStops = () => {
  const history = useHistory();
  const dispatch = useAppDispatch()

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedStop, setSelectedStop] = useState<any>(null);

  const paginationDetailRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });

  const [delAllStopModalState, setDelAllStopModalState] = useState<any>({
    showModal: false,
    routeId: ""
  })

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getAllStopsListResp,
    showApiLoader,
    deleteAllStopsListResp,
    getStopsByRouteResp,
    transportationErrorAct,
  } = useAppSelector(
    ({ appData, transportrequest, globalData }) => ({
      showApiLoader: globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getAllStopsListResp: transportrequest.getAllStopsListResp,
      deleteAllStopsListResp: transportrequest.deleteAllStopsListResp,
      getStopsByRouteResp: transportrequest.getStopsByRouteResp,
      transportationErrorAct: transportrequest.transportationErrorAct,
    }),
    shallowEqual
  );

  const allStopsRespRef = useRef({
    prevDeleteAllStopsListResp: deleteAllStopsListResp,
    prevTransportationErrorAct: transportationErrorAct,
  });

  useEffect(() => {
    const { prevDeleteAllStopsListResp, prevTransportationErrorAct } = allStopsRespRef.current;
    if (deleteAllStopsListResp && prevDeleteAllStopsListResp !== deleteAllStopsListResp) {
      delModalCancelHndlr()
      getAllStopsList()
      toast.success("Selected Stop Deleted successfully.");
    } else if (transportationErrorAct && prevTransportationErrorAct !== transportationErrorAct) {
      const { details } = transportationErrorAct || {};
      toast.error(details)
    }
    allStopsRespRef.current.prevDeleteAllStopsListResp = deleteAllStopsListResp;
    allStopsRespRef.current.prevTransportationErrorAct = transportationErrorAct;

  }, [deleteAllStopsListResp, transportationErrorAct]);

  const AllStopsFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      routeCode: "",
    },
    onSubmit: (values) => { },
  });


  function getAllStopsList(otherProps?: any) {
    const { pageNo, pageSize } = paginationDetailRef.current;
    dispatch(getAllStopsListAct(generateActionPayload("get_all_stops_list", undefined, { branchId, instituteId, pageNo, pageSize, routeCode: AllStopsFilterForm.values.routeCode, ...otherProps })))
  }

  useEffect(() => {
    if (branchId) {
      getAllStopsList();
    }
  }, [branchId, instituteId])

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const routeId = event.currentTarget.getAttribute("data-id");
          if (routeId) {
            history.push("/transportation-settings/all-stops/create-stop", { routeId })
          }
        },
      },
    ],
    []
  );

  const noOfStopsList = (routeId: any) => {
    dispatch(getStopsByRouteAct(generateActionPayload("get_stops_by_routeid", { branchId, routeId })))
  }

  const roleColumns = useMemo(
    () =>
      GenerateColumns({
        actionList: menuOptions,
        popoverOpen,
        setPopoverOpen,
        selectedStop,
        setSelectedStop,
      }),
    [menuOptions, popoverOpen, selectedStop, getStopsByRouteResp]
  );

  const moveToCreateStopPageHandler = () => {
    history.push("/transportation-settings/all-stops/create-stop");
  };

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getAllStopsList();
  }

  const filterHndler = (event: any) => {
    const { name, value } = event.target;
    paginationDetailRef.current.pageNo = 0
    AllStopsFilterForm.handleChange(event);
    getAllStopsList({ [name]: value })
  }

  function delModalCancelHndlr() {
    setDelAllStopModalState((prevState: any) => ({ ...prevState, showModal: false, routeId: "" }));
  }

  function delModalSubmitHndlr() {
    const { routeId } = delAllStopModalState;
    dispatch(deleteAllStopsListAct(generateActionPayload("delete_all_stops_list", { id: routeId })));
  }

  const { totalElements, totalPages, pageNumber } = getAllStopsListResp || {}

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Transport Concession" pageTitle="Transportation" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                  All Stops
                </h4>
                <div className="lg:tw-col-span-8 xl:tw-col-span-9 tw-flex tw-justify-end">
                  <div className="tw-flex tw-gap-3">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={moveToCreateStopPageHandler}
                    >
                      <i className="ri-add-line" />
                      Add New
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-p-4">
              <form onSubmit={AllStopsFilterForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4 tw-items-end">
                  <div className="lg:tw-col-span-4 xl:tw-col-span-3">
                    <div>
                      <div className="search-box tw-relative">
                        <TextInput
                          name="routeCode"
                          value={AllStopsFilterForm.values.routeCode}
                          onChange={filterHndler}
                          formgroupClassName="tw-mb-0"
                          placeHolder="Search"
                          labelText="Search"
                          floatingLabel
                        />
                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-2 tw-text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <TableContainer
              columns={roleColumns || []}
              data={getAllStopsListResp?.data || []}
              divClass="tw-overflow-x-auto tw-mb-1"
              theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
              showPagination={true}
              onChangeInputHndlr={noOfStopsList}
              rowDataInfo={getStopsByRouteResp}
              totalPages={totalPages || 0}
              totalRecords={totalElements || 0}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageNumber || 0}
            />
          </div>
        </div>
      </div>
      <ConfirmationModal
        id="delete-all-stops-modal"
        isOpen={delAllStopModalState.showModal}
        confirmMessage=" you want to delete this Stop ?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default AllStops;
