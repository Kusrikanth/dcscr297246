
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
import {  approveSubmittedTransportReqAct, exportTransportNewReqAct, getTerminationListAct } from "../../../../store/transportation/TransportationRecords/transportationrecordsaction";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import RejectTransportReq from "../RejectTransportReq";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { CheckmarkCircle03Icon, Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  status: "",
  transportRequestFor: "",
  transportRequestMode: "",
};

const TerminationRequests = () => {
  const [terminationReqFilterState, setTerminationReqFilterState] =
    useState(initialValues);
  const [approveModalState, setApproveModalState] = useState({
    showModal: false,
    requestId: ""
  })
  const [terminationReqRejectState, setTerminationReqRejectState] = useState({
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
  const history = useHistory();

  const dispatch = useAppDispatch();

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
    getTerminationListResp,
    exportTransportNewReqResp,
    transportationRecordsErrorResp,
    rejectTerminationReqResp,
    deleteTransportReqResp,
  } = useAppSelector(
    ({ globalData, instAcademics, appData, transportrecords }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      approveSubmittedTransportResp: transportrecords.approveSubmittedTransportResp,
      deleteTransportReqResp: transportrecords.deleteTransportReqResp,
      getTerminationListResp: transportrecords.getTerminationListResp,
      transportationRecordsErrorResp: transportrecords.transportationRecordsErrorResp,
      exportTransportNewReqResp: transportrecords.exportTransportNewReqResp,
      rejectTerminationReqResp: transportrecords.rejectTerminationReqResp,
    }),
    shallowEqual
  );

  const terminationRequestRespRef = useRef({
    prevExportTransportNewReqResp: exportTransportNewReqResp,
    prevRejectTerminationReqResp: rejectTerminationReqResp,
    prevTransportationRecordsErrorResp: transportationRecordsErrorResp,
  });

  useEffect(() => {
    const { prevExportTransportNewReqResp, prevTransportationRecordsErrorResp,prevRejectTerminationReqResp } = terminationRequestRespRef.current;

     if (exportTransportNewReqResp && prevExportTransportNewReqResp !== exportTransportNewReqResp) {
      toast.success("Termination List Exprorted successfully.");
      toggleExportExcelModal()
      downloadExcelFile(exportTransportNewReqResp,'termination_requests');
    }
    else if (transportationRecordsErrorResp && prevTransportationRecordsErrorResp !== transportationRecordsErrorResp) {
      const { details } = transportationRecordsErrorResp;
      toast.error(details || "Something went wrong. Please try again later.");
    }
    else if (rejectTerminationReqResp && prevRejectTerminationReqResp !== rejectTerminationReqResp) {
      toast.success("Termination Reqeust Rejected successfully.");
      toggleTermiantionReqRejectModal()
      getTerminationRequestList();
    }
    
    terminationRequestRespRef.current.prevExportTransportNewReqResp = exportTransportNewReqResp;
    terminationRequestRespRef.current.prevTransportationRecordsErrorResp = transportationRecordsErrorResp;
    terminationRequestRespRef.current.prevRejectTerminationReqResp = rejectTerminationReqResp;
  }, [ exportTransportNewReqResp, transportationRecordsErrorResp,rejectTerminationReqResp]);

  const deleteTerminationReqHndlr = (event:any)=>{
    const requestId = event.currentTarget.getAttribute("data-id");
    if(requestId){
      setTerminationReqRejectState({showModal:true,requestId})
    }
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "approve",
        actionIcon: <HugeiconsIcon icon={CheckmarkCircle03Icon} className="me-2 text-success" size={18} />,
        actionName: "Approve",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const requestId = event.currentTarget.getAttribute("data-id") || "";
          const findData = getTerminationListResp?.data?.find((data: any) => +data.requestId === +requestId);
          if(findData?.studentId && requestId){
            history.push(`/create-termination-request`,{studentData : findData});
          }
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
        actionName: "Reject",
        onClickHndlr: deleteTerminationReqHndlr
      }
    ],
    [getTerminationListResp]
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
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setTerminationReqFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    getTerminationRequestList({ academicYearId: yearId })
  }, [academicYearListResp,branchId,instituteId]);

  const getTerminationRequestList = (otherProps?: any) => {
    const { academicYearId, searchString, status, transportRequestFor, transportRequestMode } = terminationReqFilterState;
    let payload = {
      academicYearId: academicYearId,
      branchId,
      searchString,
      status,
      transportRequestFor,
      transportRequestMode,
      transportRequestType: "TERMINATION_REQUEST",
      ...pagination.current,
      ...otherProps,

    };
    if (payload.academicYearId) {
      dispatch(getTerminationListAct(generateActionPayload('get_new_request_list', undefined, payload)))
    }
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTerminationReqFilterState((prev: any) => ({ ...prev, [name]: value }))
    pagination.current.pageNo = 0;
    getTerminationRequestList({ [name]: value })

  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getTerminationRequestList(paginationInfo)
  }


  function cancelApproveModalHandler() {
    setApproveModalState(prevState => ({ ...prevState, showModal: false }));
  }

  function confirmApprovalModalHandler() {
    const { requestId } = approveModalState;
    dispatch(approveSubmittedTransportReqAct(generateActionPayload('approve_submitted_request',{ requestId })))
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

  const toggleTermiantionReqRejectModal = (requestId?: any) => {
    setTerminationReqRejectState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      requestId: requestId || "",
    }));
  }

  const toggleExportExcelModal = (id?: any) => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      requestId: id || "",
    }));
  };

  const exportModalHndler = () => {
    dispatch(exportTransportNewReqAct(generateActionPayload("export_new_transport_request", undefined, { ...terminationReqFilterState, branchId, instituteId,transportRequestType: "TERMINATION_REQUEST", }, {
      responseType: 'blob'
    })));
  }


  const { data: academicYearList } = academicYearListResp || {};
  const { totalElements, totalPages, pageble } = getTerminationListResp || {}

  const roleColumns = useMemo(() => generateColumns(menuOptions, toggleMapModal), [getTerminationListResp]);

  return (
    <>
      <div className="tw-inline-block tw-w-full tw-mt-2">
        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-py-2">
          <div className="tw-col-span-12 xl:tw-col-span-2">
            <div className="search-box">
              <TextInput
                name="searchString"
                value={terminationReqFilterState.searchString}
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
              value={terminationReqFilterState.academicYearId}
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
              value={terminationReqFilterState.status}
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
              value={terminationReqFilterState.transportRequestFor}
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
              value={terminationReqFilterState.transportRequestMode}
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
              <i className="ri-add-line"></i>
              Export
            </Button>
          </div>
        </div>

        <div className="tw-overflow-x-auto tw-mb-1">
          <TableContainer
            columns={roleColumns || []}
            data={getTerminationListResp?.data || []}
            divClass="tw-w-full"
            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
            showPagination={true}
            totalPages={totalPages || 0}
            totalRecords={totalElements || 0}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageble?.pageNumber || 0}
          />
        </div>
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
        isOpen={terminationReqRejectState.showModal}
        toggle={() => toggleTermiantionReqRejectModal()}
        modalSize="md"
        modalTitle=""
        hideHeader={true}
      >
        <RejectTransportReq
          isOpen={terminationReqRejectState.showModal}
          toggle={() => toggleTermiantionReqRejectModal()}
          showApiLoader={showApiLoader}
          requestId={terminationReqRejectState.requestId}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
                id="export-termination-modal"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Termination Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportModalHndler}
                    feature="transportation"
                    subFeature="termination"
                    remarksText="Enter remarks to export termination data?"
                />
            </ModalContainerUpdated>
    </>
  );
};



export default TerminationRequests;
