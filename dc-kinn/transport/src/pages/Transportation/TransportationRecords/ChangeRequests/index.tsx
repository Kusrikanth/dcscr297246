
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
import {  approveSubmittedTransportReqAct, deleteTransportReqAct, exportTransportNewReqAct, getChangeRequestListAct } from "../../../../store/transportation/TransportationRecords/transportationrecordsaction";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import RejectTransportReq from "../RejectTransportReq";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle03Icon, Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  status: "",
  transportRequestFor: "",
  transportRequestMode: "",
};

const ChangeRequests = () => {
  const [changeReqFilterState, setChangeReqFilterState] =
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
    getChangeRequestListResp,
    exportTransportNewReqResp,
    rejectTerminationReqResp,
    transportationRecordsErrorResp,
  } = useAppSelector(
    ({ globalData, instAcademics, appData, transportrecords }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getChangeRequestListResp: transportrecords.getChangeRequestListResp,
      transportationRecordsErrorResp: transportrecords.transportationRecordsErrorResp,
      exportTransportNewReqResp: transportrecords.exportTransportNewReqResp,
      rejectTerminationReqResp: transportrecords.rejectTerminationReqResp,
    }),
    shallowEqual
  );

  const changeRequestRespRef = useRef({
    prevExportTransportNewReqResp: exportTransportNewReqResp,
    prevRejectTerminationReqResp: rejectTerminationReqResp,
    prevTransportationRecordsErrorResp: transportationRecordsErrorResp,
  });

  useEffect(() => {
    const { prevExportTransportNewReqResp, prevTransportationRecordsErrorResp,prevRejectTerminationReqResp } = changeRequestRespRef.current;

    if (exportTransportNewReqResp && prevExportTransportNewReqResp !== exportTransportNewReqResp) {
      toast.success("Change Request List Exprorted successfully.");
      toggleExportExcelModal()
      downloadExcelFile(exportTransportNewReqResp,'Change_Request_List');
    }
    else if (transportationRecordsErrorResp && prevTransportationRecordsErrorResp !== transportationRecordsErrorResp) {
      const { details } = transportationRecordsErrorResp;
      toast.error(details || "Something went wrong. Please try again later.");
    }
    else if (rejectTerminationReqResp && prevRejectTerminationReqResp !== rejectTerminationReqResp) {
      toast.success("Termination Reqeust Rejected successfully.");
      toggleTermiantionReqRejectModal()
      getChangeRequestList();
    }
    changeRequestRespRef.current.prevExportTransportNewReqResp = exportTransportNewReqResp;
    changeRequestRespRef.current.prevTransportationRecordsErrorResp = transportationRecordsErrorResp;
    changeRequestRespRef.current.prevRejectTerminationReqResp = rejectTerminationReqResp;
  }, [ exportTransportNewReqResp, transportationRecordsErrorResp,rejectTerminationReqResp]);

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
          history.push(`/create-change-request/${requestId}`);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
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

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setChangeReqFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    getChangeRequestList({ academicYearId: yearId })
  }, [academicYearListResp,branchId,instituteId]);

  const getChangeRequestList = (otherProps?: any) => {
    const { academicYearId, searchString, status, transportRequestFor, transportRequestMode } = changeReqFilterState;
    let payload = {
      academicYearId: academicYearId,
      branchId,
      searchString,
      status,
      transportRequestFor,
      transportRequestMode,
      transportRequestType: "CHANGE_REQUEST",
      ...pagination.current,
      ...otherProps,

    };
    if (payload.academicYearId) {
      dispatch(getChangeRequestListAct(generateActionPayload('get_new_request_list', undefined, payload)))
    }
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setChangeReqFilterState((prev: any) => ({ ...prev, [name]: value }))
    pagination.current.pageNo = 0;
    getChangeRequestList({ [name]: value })

  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getChangeRequestList(paginationInfo)
  }
  const toggleTermiantionReqRejectModal = (requestId?: any) => {
    setRejectChangeReqState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      requestId: requestId || "",
    }));
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
    setNewReqDeleteState((prevState: any) => ({
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
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      requestId: id || "",
    }));
  };

  const exportModalHndler = () => {
    dispatch(exportTransportNewReqAct(generateActionPayload("export_new_transport_request", undefined, { ...changeReqFilterState, branchId, instituteId,transportRequestType: "CHANGE_REQUEST", }, {
      responseType: 'blob'
    })));
  }


  const { data: academicYearList } = academicYearListResp || {};
  const { totalElements, totalPages, pageble } = getChangeRequestListResp || {}

  const roleColumns = useMemo(() => generateColumns(menuOptions, toggleMapModal), []);

  return (
    <>
      <div className="tw-inline-block tw-w-full tw-mt-2">
        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-5 tw-py-2 tw-bg-white tw-rounded tw-shadow">
          <div className="tw-col-span-12 xl:tw-col-span-2">
            <div className="search-box">
              <TextInput
                name="searchString"
                value={changeReqFilterState.searchString}
                onChange={filterHandler}
                formgroupClassName="tw-mb-0"
                placeHolder="Search"
                labelText="Search"
                floatingLabel
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>

          <div className="tw-col-span-12 xl:tw-col-span-2">
            <SelectInput
              name="academicYearId"
              value={changeReqFilterState.academicYearId}
              onChange={filterHandler}
              menuItems={academicYearList || []}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              labelText="Academic Year"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-12 xl:tw-col-span-2">
            <SelectInput
              name="status"
              value={changeReqFilterState.status}
              onChange={filterHandler}
              menuItems={statusData}
              valueKey="id"
              textKey="name"
              formgroupClassName="tw-mb-0"
              labelText="Status"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-12 xl:tw-col-span-2">
            <SelectInput
              name="transportRequestFor"
              value={changeReqFilterState.transportRequestFor}
              onChange={filterHandler}
              menuItems={requestTypeData}
              valueKey="id"
              textKey="name"
              formgroupClassName="tw-mb-0"
              labelText="Request For"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-12 xl:tw-col-span-2">
            <SelectInput
              name="transportRequestMode"
              value={changeReqFilterState.transportRequestMode}
              onChange={filterHandler}
              menuItems={requestModeData}
              valueKey="id"
              textKey="name"
              formgroupClassName="tw-mb-0"
              labelText="Request Mode"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-12 xl:tw-col-span-2 tw-flex tw-items-end tw-justify-end">
            <Button
              variant="info"
              onClick={() => toggleExportExcelModal()}
            >
              <i className="ri-add-line tw-mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TableContainer
          columns={roleColumns || []}
          data={getChangeRequestListResp?.data || []}
          divClass="tw-overflow-x-auto tw-mb-1"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
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

      <ModalContainerUpdated
        id="termination-req-reject-modal"
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
      {/* <ModalContainerUpdated
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
      </ModalContainerUpdated> */}
      <ModalContainerUpdated
                id="export-change-request-modal"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Change Request Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportModalHndler}
                    feature="transportation"
                    subFeature="change_requests"
                    remarksText="Enter remarks to export change request data?"
                />
            </ModalContainerUpdated>
    </>
  );
};



export default ChangeRequests;
