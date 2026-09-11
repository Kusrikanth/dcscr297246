
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  generateColumns,
  requestModeData,
  requestTypeData,
  statusData,
} from "./helper";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { getNewRequestListAct, approveSubmittedTransportReqAct, deleteTransportReqAct, exportTransportNewReqAct } from "../../../../store/transportation/TransportationRecords/transportationrecordsaction";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import LocationSelectorModal from "./LocationSelectorModal";
import { getRouteListAct, getSlabsListAct } from "../../../../store/transportation/transportationaction";
import RejectTransportReq from "../RejectTransportReq";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle03Icon, Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  status: "",
  transportRequestFor: "",
  transportRequestMode: "",
};

const NewRequests = () => {
  const [newRequestsFilterState, setNewRequestsFilterState] =
    useState(initialValues);
  const [approveModalState, setApproveModalState] = useState({
    showModal: false,
    requestId: ""
  })
  const [newReqDeleteState, setNewReqDeleteState] = useState({
    showModal: false,
    requestId: ""
  })
  const [exportExcel, setExportExcel] = useState({
    showModal: false,
    requestId: undefined
  })
  const [mapModalState, setMapModalState] = useState({
    showModal: false,
    longitude: undefined,
    latitude: undefined,
    data: undefined,
  })
  const [rejectChangeReqState, setRejectChangeReqState] = useState({
    showModal: false,
    requestId: ""
  })
  const history = useHistory();

  const dispatch = useAppDispatch()

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    approveSubmittedTransportResp,
    getNewRequestListResp,
    exportTransportNewReqResp,
    transportationRecordsErrorResp,
    deleteTransportReqResp,
    rejectTerminationReqResp,
  } = useAppSelector(
    ({ globalData, instAcademics, appData, transportrecords }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      approveSubmittedTransportResp: transportrecords.approveSubmittedTransportResp,
      deleteTransportReqResp: transportrecords.deleteTransportReqResp,
      getNewRequestListResp: transportrecords.getNewRequestListResp,
      transportationRecordsErrorResp: transportrecords.transportationRecordsErrorResp,
      exportTransportNewReqResp: transportrecords.exportTransportNewReqResp,
      rejectTerminationReqResp: transportrecords.rejectTerminationReqResp,
    }),
    shallowEqual
  );

  const newRequestRespRef = useRef({
    prevApproveSubmittedTransportResp: approveSubmittedTransportResp,
    prevExportTransportNewReqResp: exportTransportNewReqResp,
    prevDeleteTransportReqResp: deleteTransportReqResp,
    prevRejectTerminationReqResp: rejectTerminationReqResp,
    prevTransportationRecordsErrorResp: transportationRecordsErrorResp,
  });

  useEffect(() => {
    const { prevApproveSubmittedTransportResp, prevDeleteTransportReqResp, prevExportTransportNewReqResp,prevRejectTerminationReqResp, prevTransportationRecordsErrorResp } = newRequestRespRef.current;
    if (approveSubmittedTransportResp && prevApproveSubmittedTransportResp !== approveSubmittedTransportResp) {
      toast.success("Transport request approved successfully.");
      cancelApproveModalHandler();
      getNewRequestList();
    }
    else if (deleteTransportReqResp && prevDeleteTransportReqResp !== deleteTransportReqResp) {
      toast.success("Transport request deleted successfully.");
      toggleDeleteReqModal()
      getNewRequestList();
    }
    else if (exportTransportNewReqResp && prevExportTransportNewReqResp !== exportTransportNewReqResp) {
      toast.success("New Request List Exprorted successfully.");
      toggleExportExcelModal()
      downloadExcelFile(exportTransportNewReqResp,'new_transport_requests');
    }
    else if (transportationRecordsErrorResp && prevTransportationRecordsErrorResp !== transportationRecordsErrorResp) {
      const { details } = transportationRecordsErrorResp;
      toast.error(details || "Something went wrong. Please try again later.");
    }
    else if (rejectTerminationReqResp && prevRejectTerminationReqResp !== rejectTerminationReqResp) {
      toast.success("Termination Reqeust Rejected successfully.");
      toggleTermiantionReqRejectModal()
      getNewRequestList();
    }
    newRequestRespRef.current.prevApproveSubmittedTransportResp = approveSubmittedTransportResp;
    newRequestRespRef.current.prevDeleteTransportReqResp = deleteTransportReqResp;
    newRequestRespRef.current.prevExportTransportNewReqResp = exportTransportNewReqResp;
    newRequestRespRef.current.prevRejectTerminationReqResp = rejectTerminationReqResp;
    newRequestRespRef.current.prevTransportationRecordsErrorResp = transportationRecordsErrorResp;
  }, [approveSubmittedTransportResp, deleteTransportReqResp, exportTransportNewReqResp,rejectTerminationReqResp, transportationRecordsErrorResp]);

  const deleteTransportReqHndlr = (event:any)=>{
    const requestId = event.currentTarget.getAttribute("data-id");
    if(requestId){
      setRejectChangeReqState({showModal:true,requestId})
    }
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "approve",
        actionIcon: <HugeiconsIcon icon={CheckmarkCircle03Icon} className="me-2 text-success" size={18} />,
        actionName: "Approve",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const requestId = event.currentTarget.getAttribute("data-id");
          history.push(`/create-new-request/${requestId}`);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const requestId = event.currentTarget.getAttribute("data-id");
          if (requestId) {
            toggleDeleteReqModal(requestId)
          }
        },
      },
      {
        id: "reject",
        actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="me-2 text-danger" size={18} />,
        actionName: "Reject",
        onClickHndlr: deleteTransportReqHndlr
      }
    ],
    []
  );

  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );
    const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);

  function getSlabsList() {
    dispatch(getSlabsListAct(generateActionPayload("get_slabs_list", undefined, { slabName: null, branchId, instituteId })));
  }

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setNewRequestsFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    getNewRequestList({ academicYearId: yearId })
    getSlabsList()
    dispatch(getRouteListAct(generateActionPayload("get_route_details_list", undefined, { branchId, instituteId, pageNo: 0, pageSize: 200, sortBy: "routeName", orderBy: "ASC" })))
  }, [academicYearListResp,branchId,instituteId]);

  const getNewRequestList = (otherProps?: any) => {
    const { academicYearId, searchString, status, transportRequestFor, transportRequestMode } = newRequestsFilterState;
    let payload = {
      academicYearId: academicYearId,
      branchId,
      searchString,
      status,
      transportRequestFor,
      transportRequestMode,
      transportRequestType: "NEW_REQUEST",
      ...pagination.current,
      ...otherProps,

    };
    if (payload.academicYearId) {
      dispatch(getNewRequestListAct(generateActionPayload('get_new_request_list', undefined, payload)))
    }
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewRequestsFilterState((prev: any) => ({ ...prev, [name]: value }))
    pagination.current.pageNo = 0;
    getNewRequestList({ [name]: value })

  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getNewRequestList(paginationInfo)
  }


  function cancelApproveModalHandler() {
    setApproveModalState(prevState => ({ ...prevState, showModal: false }));
  }

  function confirmApprovalModalHandler() {
    const { requestId } = approveModalState;
    dispatch(approveSubmittedTransportReqAct(generateActionPayload('approve_submitted_request',
      { requestId })))
  }

  const toggleMapModal = (latitude?: any, longitude?: any, data?: any) => {
    setMapModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      longitude: longitude || "",
      latitude: latitude || "",
      data: data || "",
    }));
  }

  const toggleDeleteReqModal = (requestId?: any) => {
    setNewReqDeleteState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      requestId: requestId || "",
    }));
  }

  const deleteReqHndler = () => {
    const { requestId } = newReqDeleteState;
    if (requestId) {
      dispatch(deleteTransportReqAct(generateActionPayload('delete_transport_request', { requestId })))
    }
  }

  const toggleExportExcelModal = (id?: any) => {
    setExportExcel((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      requestId: id || "",
    }));
  };

  const exportModalHndler = () => {
    dispatch(exportTransportNewReqAct(generateActionPayload("export_new_transport_request", undefined, { ...newRequestsFilterState, branchId, instituteId,transportRequestType: "NEW_REQUEST", }, {
      responseType: 'blob'
    })));
  }

  const toggleTermiantionReqRejectModal = (requestId?: any) => {
    setRejectChangeReqState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      requestId: requestId || "",
    }));
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { totalElements, totalPages, pageble } = getNewRequestListResp || {}

  const roleColumns = useMemo(() => generateColumns(menuOptions, toggleMapModal), []);

  return (
    <>
      <div className="tw-inline-block tw-w-full tw-mt-2">

        <div className="tw-p-4 tw-grid tw-grid-cols-1 xl:tw-grid-cols-12 tw-gap-3">

          <div className="xl:tw-col-span-2">
            <div className="search-box">
              <TextInput
                name="searchString"
                value={newRequestsFilterState.searchString}
                onChange={filterHandler}
                formgroupClassName="mb-0"
                placeHolder="Search"
                labelText="Search"
                floatingLabel
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>

          <div className="xl:tw-col-span-2">
            <SelectInput
              name="academicYearId"
              value={newRequestsFilterState.academicYearId}
              onChange={filterHandler}
              menuItems={academicYearList || []}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="mb-0"
              labelText="Academic Year"
              floatingLabel
            />
          </div>

          <div className="xl:tw-col-span-2">
            <SelectInput
              name="status"
              value={newRequestsFilterState.status}
              onChange={filterHandler}
              menuItems={statusData}
              valueKey="id"
              textKey="name"
              formgroupClassName="mb-0"
              labelText="Status"
              floatingLabel
            />
          </div>

          <div className="xl:tw-col-span-2">
            <SelectInput
              name="transportRequestFor"
              value={newRequestsFilterState.transportRequestFor}
              onChange={filterHandler}
              menuItems={requestTypeData}
              valueKey="id"
              textKey="name"
              formgroupClassName="mb-0"
              labelText="Request For"
              floatingLabel
            />
          </div>

          <div className="xl:tw-col-span-2">
            <SelectInput
              name="transportRequestMode"
              value={newRequestsFilterState.transportRequestMode}
              onChange={filterHandler}
              menuItems={requestModeData}
              valueKey="id"
              textKey="name"
              formgroupClassName="mb-0"
              labelText="Request Mode"
              floatingLabel
            />
          </div>

          <div className="xl:tw-col-span-2 tw-flex tw-justify-end tw-items-start">
            <Button
              onClick={() => toggleExportExcelModal()}
              className="tw-flex tw-items-center tw-px-4 tw-py-2 tw-rounded-md !tw-bg-[#405189] tw-text-white tw-shadow-sm hover:tw-opacity-90"
            >
              <i className="ri-add-line tw-me-2" />
              Export
            </Button>
          </div>
        </div>

        <TableContainer
          columns={roleColumns || []}
          data={getNewRequestListResp?.data || []}
          divClass="tw-overflow-x-auto tw-mb-1"
          theadClass="tw-bg-gray-50 tw-text-muted tw-align-middle"
          showPagination={true}
          totalPages={totalPages || 0}
          totalRecords={totalElements || 0}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageble?.pageNumber || 0}
        />
      </div>


      <ConfirmationModal
        id="newrequest-confirmation-modal"
        isOpen={approveModalState.showModal}
        confirmMessage="You want to approve this transport request."
        cancelHndlr={cancelApproveModalHandler}
        confirmHndlr={confirmApprovalModalHandler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      />
      <ConfirmationModal
        id="newrequest-delete-modal"
        isOpen={newReqDeleteState.showModal}
        confirmMessage="You want to delete this transport request."
        cancelHndlr={() => toggleDeleteReqModal()}
        confirmHndlr={deleteReqHndler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType='reject'
        btnClassName='btn w-sm btn-danger'
      />
      <ModalContainerUpdated
        id="google-map-pop-up"
        isOpen={mapModalState.showModal}
        toggle={() => toggleMapModal()}
        modalSize="lg"
        modalTitle="Google Map"
      >
        <LocationSelectorModal
          isOpen={mapModalState.showModal}
          toggle={() => toggleMapModal()}
          modalTitle=""
          latitude={mapModalState?.latitude}
          longitude={mapModalState?.longitude}
          showApiLoader={showApiLoader}
          modalData={mapModalState.data}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
                id="export-new-request-modal"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export New Request Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportModalHndler}
                    feature="transportation"
                    subFeature="new_requests"
                    remarksText="Enter remarks to export new request data?"
                />
            </ModalContainerUpdated>
      <ModalContainerUpdated
        id="new-req-reject-modal"
        isOpen={rejectChangeReqState.showModal}
        toggle={() => toggleTermiantionReqRejectModal()}
        modalSize="md"
        modalTitle=""
        hideHeader={true}
      >
        <RejectTransportReq
          isOpen={rejectChangeReqState.showModal}
          toggle={() => toggleTermiantionReqRejectModal()}
          showApiLoader={showApiLoader}
          requestId={rejectChangeReqState.requestId}
        />
      </ModalContainerUpdated>
    </>
  );
};



export default NewRequests;
