import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { SelectInput, TextInput, OffCanvasContainer, ModalContainerUpdated, ConfirmationModal } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
// import FeeDetailsModal from "./FeeDetailsModal";
import {
  generateColumns, hasStateChanged, 
} from "./helper";
import { useHistory } from "react-router-dom";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { default as EyeSvg } from "../../../../assets/imagesdps/academics/EyeSvg.svg?react";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
// import {} from "react";
import EditFeeDetailsModal from "./EditFeeDetailsModal";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
  getInstAcademicYearAct,
} from "../../../../store/mastersettings/instacademics/instacademicactions";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct,
  resetBrchClassAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";

import {
  getFeeReceiptsAct, sendEmailFeeReceiptAct,
  createCredentialsAct,
} from "../../../../store/fee/feecollections/feecollectionactions";
import AdvanceFilterModal from "./AdvanceFilterModal";
import FeeReversalModal from "./FeeReversalModal";
import FeeDetailsModal from "./FeeDetailsModal";
import { exportHostelFeeReceiptAct } from "../../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock04Icon, Mail01Icon, PencilEdit02Icon, PrinterIcon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
  searchString: "",
  startDate: "",
  endDate: "",
  paymentMode:null,
};

const HostelFeeReceipts = () => {
  const history = useHistory();
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [count, setCount] = useState<any>(null);
  const [filterState, setFilterState] = useState(initialValues);
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })
  const [advanceFilterState, setAdvanceFilterState] = useState({
    showModal: false,
    appliedFilter: undefined
  });
  const selectedLedgerRef = useRef<any>(null);

  const [exportConfirmationModal, setExportConfirmationModal] =
    useState({
      showModal: false,
      receiptId: "",
    });
  const [sendEmailModal, setSendEmailModal] =
    useState({
      showModal: false,
      receiptId: "",
    });
  const [createCredentialState, setCreateCredentialState] = useState({
    showModal: false,
    studentIds: []
  });
  const [hostelFeeReversalModalState, setHostelFeeReversalModalState] = useState({
    showModal: false,
    receiptInfo: {}
  })
  const [multiCheckActionState, setMultiCheckActionState] = useState(false);

  const [viewReceiptModalState, setViewReceiptModalState] =
    useState({
      showModal: false,
      receiptId: "",
      modalData: undefined
    });
  const [editHostelFeeDetailsModalState, setEditHostelFeeDetailsModalState] = useState({
    showModal: false,
    feeReceiptId: "",
    modalData: undefined
  });

  const dispatch = useAppDispatch();
  const {
    branchClassResp,
    academicYearListResp, brchCurriculumResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    feeReceiptsResp,
    feeCollectionErrorResp, showApiLoader, exportHostelFeeReceiptResp, createCredentialsResp, sendEmailFeeReceiptResp } =
    useAppSelector(({ appData, branchAcademics, feeCollections,
      instAcademics, globalData, hostelStuLedger }) => ({
        branchClassResp: branchAcademics.branchClassResp,
        brchSectionsResp: branchAcademics.brchSectionsResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        academicYearListResp: instAcademics.academicYearListResp,
        instAcademicErrorResp: instAcademics.instAcademicErrorResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        feeReceiptsResp: feeCollections.feeReceiptsResp,
        sendEmailFeeReceiptResp: feeCollections.sendEmailFeeReceiptResp,
        exportHostelFeeReceiptResp: hostelStuLedger.exportHostelFeeReceiptResp,
        createCredentialsResp: feeCollections.createCredentialsResp,
        feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
        showApiLoader: globalData.showApiLoader,
      }), shallowEqual);

  const hostelFeeReceiptRef = useRef({
    prevAcademicYearListResp: academicYearListResp,
    prevFeeCollectionErrorResp: feeCollectionErrorResp,
    prevexportHostelFeeReceiptResp: exportHostelFeeReceiptResp,
    prevCreateCredentialsResp: createCredentialsResp,
    prevSendEmailFeeReceiptResp: sendEmailFeeReceiptResp,
  });

  useEffect(() => {
    const { prevFeeCollectionErrorResp, prevexportHostelFeeReceiptResp,
      prevSendEmailFeeReceiptResp, prevCreateCredentialsResp } = hostelFeeReceiptRef.current;
    if (exportHostelFeeReceiptResp && exportHostelFeeReceiptResp !== prevexportHostelFeeReceiptResp) {
      downloadExcelFile(exportHostelFeeReceiptResp,'Hostel_Fee_Receipts')
      toast.success("Hostel Fee Reciept Data Downloaded Successfully.")
      toggleExportConfirmationModal();
    }
    else if (sendEmailFeeReceiptResp && sendEmailFeeReceiptResp !== prevSendEmailFeeReceiptResp) {
      toast.success("Fee Reciept Sent to registered Email Successfully.")
      toggleSendEmailModal();
    } else if (createCredentialsResp && createCredentialsResp !== prevCreateCredentialsResp) {
      toast.success("Credetials created successfully.")
      closeCreateCredentialModalHandler();
      getHostelFeeReceiptApiCall();
    }
    else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
      const { details }: any = feeCollectionErrorResp;
      toast.error(details || "Something went wrong.");
    }
    hostelFeeReceiptRef.current.prevAcademicYearListResp = academicYearListResp;
    hostelFeeReceiptRef.current.prevexportHostelFeeReceiptResp = exportHostelFeeReceiptResp;
    hostelFeeReceiptRef.current.prevSendEmailFeeReceiptResp = sendEmailFeeReceiptResp;
    hostelFeeReceiptRef.current.prevSendEmailFeeReceiptResp = createCredentialsResp;
    hostelFeeReceiptRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
  }, [academicYearListResp, feeCollectionErrorResp, exportHostelFeeReceiptResp, sendEmailFeeReceiptResp,
    createCredentialsResp]);

    useEffect(() => {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
      getHostelFeeReceiptApiCall({ academicYearId: yearId })
      getCurriculumApiCall({ academicYearId: yearId })
    }, [academicYearListResp,branchId,instituteId]);

  const toggleFeeDetailsModal = () => {
    setViewReceiptModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const toggleExportConfirmationModal = (id?: any) => {
    setExportConfirmationModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      receiptId: id || "",
    }));
  };
  const toggleSendEmailModal = (id?: any) => {
    setSendEmailModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      receiptId: id || "",
    }));
  };


  const toggleEditHostelFeeDetailsModal = useCallback((apiCall?: boolean) => {
    setEditHostelFeeDetailsModalState((prev: any) => ({
      ...prev,
      showModal: false
    }))
    if (typeof (apiCall) === "boolean" && apiCall) {
      getHostelFeeReceiptApiCall();
    }
  }, [instituteId, feeReceiptsResp]);

  const toggleViewDetailsModal = useCallback(() => {
    setViewReceiptModalState((prev: any) => ({
      ...prev,
      showModal: false
    }))
  }, [feeReceiptsResp]);

  function editHostelFeeDetailsModalHndlr(event: any) {
    const feeReceiptId = event.currentTarget.getAttribute("data-id"),
      modalData = feeReceiptsResp?.data?.find((item: any) => +item.feeReceiptId === +feeReceiptId);
    if (modalData) {
      setEditHostelFeeDetailsModalState((prev: any) => ({
        ...prev,
        feeReceiptId,
        showModal: true,
        modalData
      }))
    }
  }

  function viewReceiptDetailsHndlr(event: any) {
    const feeReceiptId = event.currentTarget.getAttribute("data-id"),
      modalData = feeReceiptsResp?.data?.find((item: any) => +item.feeReceiptId === Number(feeReceiptId));
    if (modalData) {
      setViewReceiptModalState((prev: any) => ({
        ...prev,
        feeReceiptId,
        showModal: true,
        modalData
      }))
    }
  }

  function printHostelFeeReceiptHndlr(event: any) {
    const feeReceiptId = event.currentTarget.getAttribute("data-id");
    if (feeReceiptId)
      history.push(`/hostel-fee-receipt/preview-receipt/${feeReceiptId}`);
  }

  function createCrentialHandler(event: any) {
    const feeReceiptId = event.currentTarget.getAttribute("data-id");
    if (feeReceiptId) {
      const { studentDetail } = feeReceiptsResp.data?.find((item: any) => item.id?.toString() === feeReceiptId) || {};
      if (studentDetail?.id) {
        setCreateCredentialState((prevState: any) => ({
          ...prevState,
          showModal: true,
          studentIds: [studentDetail.id]
        }))
      }
    }
  }

  function hostelFeeReversalHandler(event: any) {
    const feeReceiptId = event.currentTarget.getAttribute("data-id");
    const receiptInfo = feeReceiptsResp.data?.find((item: any) => +item.feeReceiptId === +feeReceiptId) || {};
    setHostelFeeReversalModalState(prevState => ({ ...prevState, showModal: true, receiptInfo: receiptInfo }));
  }
  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18}/>,
        actionName: "Edit",
        onClickHndlr: editHostelFeeDetailsModalHndlr
      },
      {
        id: "sendEmail",
        actionIcon: <HugeiconsIcon icon={Mail01Icon} className="me-2 text-muted" size={18}/>,
        actionName: "Send Email",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          if (id) {
            toggleSendEmailModal(id)
          }
        },
      },
      {
        id: "fee-reversal",
        actionIcon: <HugeiconsIcon icon={Clock04Icon} className="me-2 text-muted" size={18}/>,
        actionName: "Fee Reversal",
        onClickHndlr: hostelFeeReversalHandler,
      },
      {
        id: "print",
        actionIcon: <HugeiconsIcon icon={PrinterIcon} className="me-2 text-muted" size={18}/>,
        actionName: "Print",
        onClickHndlr: printHostelFeeReceiptHndlr,
      },
      // {
      //   id: "create-credentials",
      //   actionIcon: <HugeiconsIcon icon={LockSync01Icon} className="me-2 text-muted" size={18}/>,
      //   actionName: "Send Credentials",
      //   onClickHndlr: createCrentialHandler,
      // },
      // {
      //   id: "viewDetails",
      //   actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18}/>,
      //   actionName: "View Details",
      //   onClickHndlr: viewReceiptDetailsHndlr,
      // },
    ], [feeReceiptsResp]);

  const newHostelReceiptHndlr = () => {
    history.push("/hostel-fee-receipt/create-fee-receipt");
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getClassApiCall(curriculumId: string) {
    const payload = {
      curriculumId, branchId,academicYearId : filterState.academicYearId, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value })
      setFilterState((prev: any) => ({ ...prev, [name]: value, classId: "", curriculumId: "" }))
      getHostelFeeReceiptApiCall({ academicYearId: value, classId: "", curriculumId: "" })
      dispatch(resetBrchClassAct(undefined));
    }
    else if (name === 'curriculumId') {
      setFilterState((prev: any) => ({ ...prev, [name]: value,classId:"" }))
      getHostelFeeReceiptApiCall({ curriculumId: value, classId: "" })
      if (value) {
          getClassApiCall(value)
      }
      else {
          dispatch(resetBrchClassAct(undefined));
      }
    }
    else {
        setFilterState((prev: any) => ({ ...prev, [name]: value }))
        getHostelFeeReceiptApiCall({ [name]: value })
    }

    const stateChanged = hasStateChanged({ ...filterState, [name]: value, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange)
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
  }

  function getHostelFeeReceiptApiCall(otherProps?: any) {

    const { curriculumId,academicYearId,classId ,startDate ,endDate } = filterState || {}

    const payload = {
  sortBy: "createdAt",orderBy:"DESC",
  curriculumId,academicYearId,classId , branchId , startDate ,endDate,...pagination.current,...otherProps
    }

    dispatch(getFeeReceiptsAct(generateActionPayload("get_hostel_fee_receipts", undefined, payload)));
  }

  function advanceFilterHndlr() {
    setAdvanceFilterState(prevState => ({ ...prevState, showModal: true }));
  }

  function closeAdvanceModalHndlr() {
    setAdvanceFilterState(prevState => ({ ...prevState, showModal: false }));
  }

  function advanceFilterCallbckHndlr(appliedFilters: any) {
    setFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    const stateChanged = hasStateChanged({ ...filterState, ...appliedFilters, academicYearId: "" });
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    setShowClearFilterState(stateChanged?.stateChange)
    getHostelFeeReceiptApiCall(appliedFilters)
    dispatch(resetBrchClassAct(undefined));
  }

  function paginationHndlr(paginationInfo: any) {
    pagination.current = paginationInfo;
    getHostelFeeReceiptApiCall();
  }

  useEffect(() => {
    if (feeReceiptsResp) {
      setAdvanceFilterState((prev: any) => ({ ...prev, showModal: false }));
    }
  }, [feeReceiptsResp])

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      pagination.current = { ...pagination.current, pageNo: 0 }
      let { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
      dispatch(resetBrchClassAct(undefined));
      setCount(null)
      setFilterState({ ...initialValues, academicYearId })
      getHostelFeeReceiptApiCall({ ...initialValues, academicYearId })
      setShowClearFilterState(false)
      getCurriculumApiCall({ academicYearId })
    }
  }

  const exportExcelHndler = () => {

    dispatch(exportHostelFeeReceiptAct(generateActionPayload("export_hostel_fee_receipt", undefined, { ...filterState, branchId, instituteId }, {
        responseType: 'blob'
    })));
}

  const sendEmailModalHndler = () => {
    dispatch(sendEmailFeeReceiptAct(generateActionPayload('send_email_hostel_fee_reciept', { receiptId: sendEmailModal.receiptId }, undefined)))
  }

  function closeCreateCredentialModalHandler() {
    setCreateCredentialState((prevState: any) => ({ ...prevState, showModal: false, studentIds: null }))
  }

  function confirmCreateCredentialHandler() {
    const { studentIds } = createCredentialState;
    if (Array.isArray(studentIds) && studentIds.length > 0) {
      dispatch(createCredentialsAct(generateActionPayload('create_credentials', undefined, { studentIds })));
    } else {
      toast.error("Missing student id in the receipts.");
      closeCreateCredentialModalHandler();
    }
  }

  const selectedRowHandler = useCallback((row: any) => {
    selectedLedgerRef.current = row;
    if (Array.isArray(row)) {
      if (row.length === 0) {
        setMultiCheckActionState(false);
      } else {
        setMultiCheckActionState(true);
      }
    }
  }, [feeReceiptsResp]);

  function createMultipleCredentials() {
    const selectedStudents: any = selectedLedgerRef.current;
    if (Array.isArray(selectedStudents) && selectedStudents.length > 0) {
      const studentIds = selectedStudents.map(item => item?.studentDetail?.id);
      setCreateCredentialState((prevState: any) => ({
        ...prevState,
        showModal: true,
        studentIds
      }))
    }
  }


  function closeHostelFeeReversalHandler(apiCall: any) {
    if (typeof apiCall === "boolean" && apiCall) {
      getHostelFeeReceiptApiCall();
    }
    setHostelFeeReversalModalState(prevState => ({ ...prevState, showModal: false }));
  }

  const feeReceiptColumns = useMemo(() => generateColumns(menuOptions, viewReceiptDetailsHndlr), [feeReceiptsResp]),
    { data: receiptList, pageNumber, totalPages, totalElements } = feeReceiptsResp || {};
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Fee Receipts" pageTitle="Hostel" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-items-center">
                <div className="tw-col-span-1">
                  <h4 className="tw-text-lg tw-font-medium tw-mb-0 tw-flex-grow">Hostel Fee Receipts</h4>
                </div>
                <div className="tw-col-span-1 tw-flex tw-justify-end tw-gap-2">
                  <Button variant="primary" onClick={newHostelReceiptHndlr} >
                    <div className="tw-flex tw-items-center">
                      <span><i className="ri-add-line tw-mr-1" /></span>
                      <span> Create New</span>
                    </div>
                  </Button>
                  <Button variant="info" style={{ background: "#405189" }} onClick={() => toggleExportConfirmationModal()} >
                    <div className="tw-flex tw-items-center tw-text-white">
                      <span><i className="ri-add-line tw-mr-1" /></span>
                      <span>Export</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            <div className="tw-p-6">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-12 tw-gap-x-3 tw-gap-y-2">
                <div className="tw-col-span-1 lg:tw-col-span-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      value={filterState.searchString}
                      onChange={onChangeFilterHndlr}
                      formgroupClassName="tw-mb-0"
                      labelText="Search"
                      placeHolder="Search"
                      floatingLabel
                    />

                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>

                <div className="tw-col-span-1 lg:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={filterState.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearListResp?.data}
                    formgroupClassName="tw-mb-0"
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-1 lg:tw-col-span-2">
                  <SelectInput
                    name="curriculumId"
                    value={filterState.curriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={brchCurriculumResp?.data}
                    formgroupClassName="tw-mb-0"
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-1 lg:tw-col-span-2">
                  <SelectInput
                    name="classId"
                    value={filterState.classId}
                    onChange={onChangeFilterHndlr}
                    menuItems={branchClassResp?.content}
                    formgroupClassName="tw-mb-0"
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-1 lg:tw-col-span-2">
                  <div className="tw-flex">
                    <div className="tw-col-span-12 lg:tw-col-span-1 tw-relative">
                      <div
                        className="tw-flex tw-items-center tw-gap-2 tw-bg-[#F4F7FA] tw-p-2 tw-rounded tw-cursor-pointer"
                        style={{
                          backgroundColor: "#F4F7FA",
                        }}
                        onClick={advanceFilterHndlr}
                      >
                        <FilterSvg height={"18px"} width={"18px"} />
                        <span className='tw-ml-2'>Filters</span>
                      </div>
                      <span className="badge tw-align-middle rounded-pill ms-1 " style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "78px", background: "#0ab39c" }}>
                        {count}
                      </span>
                    </div>
                    {showClearFilterState && <Button type="button" onClick={clearFilterHndlr}
                      variant="wrong"
                    >Clear filter</Button>}
                  </div>
                </div>
                {multiCheckActionState && <div className="tw-col-span-1 lg:tw-col-span-12">
                  <Button
                    onClick={createMultipleCredentials}
                    variant="primary"
                  >
                    Send Credentials
                  </Button>
                </div>}
              </div>
            </div>

            <TableContainer
              columns={feeReceiptColumns || []}
              data={Array.isArray(receiptList) ? receiptList : []}
              tableClass="tw-mb-0"
              divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
              // showCheckbox={true}
              showPagination={true}
              totalPages={totalPages}
              totalRecords={totalElements}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageNumber}
              selectedRowHandler={selectedRowHandler}
            />
          </div>
        </div>
      </div>

      {/* <EditFeeDetailsModal
        isOpen={true}
        toggle={toggleEditHostelFeeDetailsModal}
        modalTitle="Receipt Details"
        instituteId={"1"}
        instituteName={"Fee Details"}
        branchId={editHostelFeeDetailsModalState.branchId}
        editBranchDetails={""}
      /> */}
      <ModalContainerUpdated
        id="add-specialfee-modal"
        isOpen={editHostelFeeDetailsModalState.showModal}
        toggle={toggleEditHostelFeeDetailsModal}
        modalTitle="Receipt Details"
        modalSize="lg"
      >
        <EditFeeDetailsModal
          toggle={toggleEditHostelFeeDetailsModal}
          feeReceiptId={editHostelFeeDetailsModalState.feeReceiptId}
          editFeeDetails={editHostelFeeDetailsModalState.modalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="hostel-fee-details-modal"
        isOpen={viewReceiptModalState.showModal}
        toggle={toggleViewDetailsModal}
        modalTitle="Receipt Details"
        modalSize="xl"
      >
        <FeeDetailsModal
          toggle={toggleViewDetailsModal}
          feeReceiptId={editHostelFeeDetailsModalState.feeReceiptId}
          modalTitle="Hostel Fee Details"
          receiptDetails={viewReceiptModalState.modalData}
          printReceiptHndlr={printHostelFeeReceiptHndlr}
          editFeeDetailsHndlr={editHostelFeeDetailsModalHndlr}
        />
      </ModalContainerUpdated>

      <OffCanvasContainer
        isOpen={advanceFilterState.showModal}
        headerTitle="Fee Receipts Filters"
        closeHndlr={closeAdvanceModalHndlr}
        id="hostel-fee-receipts-advance-filter"
      >
        <AdvanceFilterModal
          getClassApiCall={getClassApiCall}
          appliedFilter={filterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
          isOpen={advanceFilterState.showModal}
          toggle={closeAdvanceModalHndlr}
        />

      </OffCanvasContainer>
      <ModalContainerUpdated
                id="hostel-fee-reciepts-export-modal"
                isOpen={exportConfirmationModal.showModal}
                toggle={toggleExportConfirmationModal}
                modalTitle="Export Hostel Fee Reciepts Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportConfirmationModal.showModal}
                    toggle={toggleExportConfirmationModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="hostel"
                    subFeature="hostel_fee_receipts"
                    remarksText="Enter remarks to export hostel fee reciepts data?"
                />
            </ModalContainerUpdated>
      <ConfirmationModal
        id="fee-reciepts-send-email-modal"
        isOpen={sendEmailModal.showModal}
        confirmMessage="You want to Send an Email ?"
        cancelHndlr={() => toggleSendEmailModal()}
        confirmHndlr={sendEmailModalHndler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      />
      <ConfirmationModal
        id="craete-credential-modal"
        isOpen={createCredentialState.showModal}
        confirmMessage="You want to create credetials for the selected student?"
        cancelHndlr={closeCreateCredentialModalHandler}
        confirmHndlr={confirmCreateCredentialHandler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      />
      <ModalContainerUpdated
        id="fee-reversal-modal"
        isOpen={hostelFeeReversalModalState.showModal}
        toggle={closeHostelFeeReversalHandler}
        hideHeader={true}
        modalSize="md"
      >
        <FeeReversalModal
          toggle={closeHostelFeeReversalHandler}
          isOpen={hostelFeeReversalModalState.showModal}
          receiptInfo={{ branchId, ...hostelFeeReversalModalState.receiptInfo}}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default HostelFeeReceipts;
