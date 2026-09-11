import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { SelectInput, TextInput, OffCanvasContainer, ModalContainerUpdated, ConfirmationModal } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import FeeDetailsModal from "./FeeDetailsModal";
import {
  generateColumns, hasStateChanged, paymentModeOptions, receiptTypeOptions,
} from "./helper";
import { useHistory, useLocation } from "react-router-dom";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
// import {} from "react";
import EditFeeDetailsModal from "./EditFeeDetailsModal";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct,
  resetBrchClassAct,
  resetBrchCurriculumAct,
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";

import {
  exportFeeReceiptAct, getFeeReceiptsAct, sendEmailFeeReceiptAct,
  createCredentialsAct,
  createFeeReversalAct,
  setFeeReceiptsAct
} from "../../../store/fee/feecollections/feecollectionactions";
import AdvanceFilterModal from "./AdvanceFilterModal";
import FeeReversalModal from "./FeeReversalModal";
import { IBranchInfo } from "../../../store/mastersettings/branch/branchtypes";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock04Icon, EyeIcon, LockSync01Icon, Mail01Icon, PencilEdit02Icon, PrinterIcon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";

const initialValues: any = {
  studentName: "",
  receiptTypes: receiptTypeOptions,
  startDate: "",
  endDate: "",
  branchClassId: "",
  branchCurriculumId: "",
  academicYearId: "",
  branchId: "",
  studentTypes: [],
  paymentModes: [],
  feeDetails: [],
};

const FeeReceipts = () => {
  const history = useHistory();
  const location = useLocation();
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [count, setCount] = useState<any>(null);
  const [branchState, setBranchState] = useState<Array<IBranchInfo>>([]);
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
    useState<any>({
      showModal: false,
      receiptId: "",
    });
  const [sendEmailModal, setSendEmailModal] =
    useState<any>({
      showModal: false,
      receiptId: "",
    });
  const [createCredentialState, setCreateCredentialState] = useState({
    showModal: false,
    studentIds: []
  });
  const [feeReversalModalState, setFeeReversalModalState] = useState({
    showModal: false,
    receiptInfo: undefined
  })
  const [multiCheckActionState, setMultiCheckActionState] = useState(false);

  const [viewReceiptModalState, setViewReceiptModalState] =
    useState({
      showModal: false,
      receiptId: "",
      modalData: undefined
    });
  const [editFeeDetailsModalState, setEditFeeDetailsModalState] = useState<any>({
    showModal: false,
    feeReceiptId: "",
    modalData: undefined
  });

  const dispatch = useAppDispatch();
  const {
    branchClassResp,
    academicYearListResp, brchCurriculumResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    feeReceiptsResp, loggedInUserRole,
    branchListResp,
    feeCollectionErrorResp, showApiLoader, exportFeeReceiptResp, createCredentialsResp, sendEmailFeeReceiptResp, virtualRoleResp } =
    useAppSelector(({ appData, branchAcademics, feeCollections,
      instAcademics, globalData, branch }) => ({
        branchClassResp: branchAcademics.branchClassResp,
        brchSectionsResp: branchAcademics.brchSectionsResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        academicYearListResp: instAcademics.academicYearListResp,
        instAcademicErrorResp: instAcademics.instAcademicErrorResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        feeReceiptsResp: feeCollections.feeReceiptsResp,
        sendEmailFeeReceiptResp: feeCollections.sendEmailFeeReceiptResp,
        exportFeeReceiptResp: feeCollections.exportFeeReceiptResp,
        createCredentialsResp: feeCollections.createCredentialsResp,
        feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
        showApiLoader: globalData.showApiLoader,
        loggedInUserRole: appData.loggedInUserRole,
        branchListResp: branch.branchListResp,
        virtualRoleResp: appData.virtualRoleResp
      }), shallowEqual);

  const [filterState, setFilterState] = useState({ ...initialValues, branchId: (branchId ? branchId?.toString() : '') });
  const canViewBranchFilters = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;
  const canCreateAndUpdate = useMemo(() => {
    if (loggedInUserRole === 'INSTITUTE_ADMIN') {
      return !!virtualRoleResp;
    }
    return !(loggedInUserRole !== 'BRANCH_ADMIN' &&
      loggedInUserRole !== 'ACCOUNT' && loggedInUserRole !== 'ACCOUNT_HEAD')
  }, [loggedInUserRole, virtualRoleResp]);

  useEffect(() => {
    if (instituteId) {
      const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    }
  }, [instituteId]);

  useEffect(() => {

    return () => {
      dispatch(setFeeReceiptsAct(undefined));
    }
  }, [])

  function downloadExcelFile(blobStream: any) {

    const url = window.URL.createObjectURL(new Blob([(blobStream)]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Fee_Receipts.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const feeDetailsRespRef = useRef<any>({
    prevAcademicYearListResp: academicYearListResp,
    prevFeeCollectionErrorResp: feeCollectionErrorResp,
    prevExportFeeReceiptResp: exportFeeReceiptResp,
    prevCreateCredentialsResp: createCredentialsResp,
    prevSendEmailFeeReceiptResp: sendEmailFeeReceiptResp,
  });

  useEffect(() => {
    const { prevAcademicYearListResp, prevFeeCollectionErrorResp, prevExportFeeReceiptResp,
      prevSendEmailFeeReceiptResp, prevCreateFeeReversalResp, prevCreateCredentialsResp } = feeDetailsRespRef.current;
    if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
      if (Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
        let updatedBranchId = ""
        if (canViewBranchFilters) {
          updatedBranchId = ""
        } else {
          updatedBranchId = branchId
        }
        setFilterState((prevState: any) => ({ ...prevState, academicYearId, branchId: updatedBranchId }));
        getFeeReceiptApiCall({ academicYearId, branchId: updatedBranchId });
      }
    }
    else if (exportFeeReceiptResp && exportFeeReceiptResp !== prevExportFeeReceiptResp) {
      downloadExcelFile(exportFeeReceiptResp)
      toast.success("Fee Reciept Data Downloaded Successfully.")
      toggleExportConfirmationModal();
    }
    else if (sendEmailFeeReceiptResp && sendEmailFeeReceiptResp !== prevSendEmailFeeReceiptResp) {
      toast.success("Fee Reciept Sent to registered Email Successfully.")
      toggleSendEmailModal();
    } else if (createCredentialsResp && createCredentialsResp !== prevCreateCredentialsResp) {
      toast.success("Credetials created successfully.")
      closeCreateCredentialModalHandler();
      getFeeReceiptApiCall();
    }
    else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
      const { message }: any = feeCollectionErrorResp;
      toast.error(message || "Something went wrong.");
    }
    feeDetailsRespRef.current.prevAcademicYearListResp = academicYearListResp;
    feeDetailsRespRef.current.prevExportFeeReceiptResp = exportFeeReceiptResp;
    feeDetailsRespRef.current.prevSendEmailFeeReceiptResp = sendEmailFeeReceiptResp;
    feeDetailsRespRef.current.prevSendEmailFeeReceiptResp = createCredentialsResp;
    feeDetailsRespRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
  }, [academicYearListResp, feeCollectionErrorResp, exportFeeReceiptResp, sendEmailFeeReceiptResp,
    createCredentialsResp]);


  useEffect(() => {
    if (branchListResp) {
      setBranchState(branchListResp?.data.filter((branch) => branch.branchId != branchId))
    }
  }, [branchListResp])


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


  const toggleEditFeeDetailsModal = useCallback((apiCall?: boolean) => {
    setEditFeeDetailsModalState((prev: any) => ({
      ...prev,
      showModal: false
    }))
    if (typeof (apiCall) === "boolean" && apiCall) {
      getFeeReceiptApiCall();
    }
  }, [instituteId, feeReceiptsResp]);
  const toggleViewDetailsModal = useCallback(() => {
    setViewReceiptModalState((prev: any) => ({
      ...prev,
      showModal: false
    }))
  }, [feeReceiptsResp]);

  function editFeeDetailsModalHndlr(event: any) {
    const feeReceiptId = event.currentTarget.getAttribute("data-id"),
      modalData = feeReceiptsResp?.data?.find((item: any) => item.id === Number(feeReceiptId));
    if (modalData) {
      setEditFeeDetailsModalState((prev: any) => ({
        ...prev,
        feeReceiptId,
        showModal: true,
        modalData
      }))
    }
  }

  function viewReceiptDetailsHndlr(event: any) {
    const feeReceiptId = event.currentTarget.getAttribute("data-id"),
      modalData = feeReceiptsResp?.data?.find((item: any) => item.id === Number(feeReceiptId));
    if (modalData) {
      setViewReceiptModalState((prev: any) => ({
        ...prev,
        feeReceiptId,
        showModal: true,
        modalData
      }))
    }
  }

  function printReceiptHndlr(event: any) {
    const feeReceiptId = event.currentTarget.getAttribute("data-id");
    if (feeReceiptId)
      history.push(`/fee-receipts/preview-receipt/${feeReceiptId}`);
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

  function feeReversalHandler(event: any) {
    const feeReceiptId = event.currentTarget.getAttribute("data-id");
    const receiptInfo = feeReceiptsResp.data?.find((item: any) => item.id?.toString() === feeReceiptId) || {};
    setFeeReversalModalState(prevState => ({ ...prevState, showModal: true, receiptInfo: receiptInfo }));
  }
  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-mr-2 tw-text-gray-500" size={18} />,
        actionName: "Edit",
        onClickHndlr: editFeeDetailsModalHndlr
      },
      {
        id: "sendEmail",
        actionIcon: <HugeiconsIcon icon={Mail01Icon} className="tw-mr-2 tw-text-gray-500" size={18} />,
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
        actionIcon: <HugeiconsIcon icon={Clock04Icon} className="tw-mr-2 tw-text-gray-500" size={18} />,
        actionName: "Fee Reversal",
        onClickHndlr: feeReversalHandler,
      },
      {
        id: "print",
        actionIcon: <HugeiconsIcon icon={PrinterIcon} className="tw-mr-2 tw-text-gray-500" size={18} />,
        actionName: "Print",
        onClickHndlr: printReceiptHndlr,
      },
      {
        id: "create-credentials",
        actionIcon: <HugeiconsIcon icon={LockSync01Icon} className="tw-mr-2 tw-text-gray-500" size={18} />,
        actionName: "Send Credentials",
        onClickHndlr: createCrentialHandler,
      },
      {
        id: "viewDetails",
        actionIcon: <HugeiconsIcon icon={EyeIcon} className="tw-mr-2 tw-text-gray-500" size={18} />,
        actionName: "View Details",
        onClickHndlr: viewReceiptDetailsHndlr,
      },
    ], [feeReceiptsResp]);

  const newReceiptHndlr = () => {
    history.push("/fee-receipts/create-receipt");
  };

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === 'academicYearId') {
      if (value) {
        getFeeReceiptApiCall({ [name]: value, branchClassId: "", branchCurriculumId: "" });
        dispatch(resetBrchClassAct(undefined));
        setFilterState((prev: any) => ({ ...prev, [name]: value, branchCurriculumId: "", branchClassId: "" }));
        if (branchId || filterState.branchId) {
          getCurriculumApiCall({ branchId: canViewBranchFilters ? filterState.branchId : branchId, academicYearId: value, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" });
        }
      }
      else {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
      }
    }
    else if (name === "branchCurriculumId") {
      if (!value) {
        setFilterState((prev: any) => ({ ...prev, [name]: "", branchClassId: "" }));
        dispatch(resetBrchClassAct(undefined));
        dispatch(resetBrchCurriculumAct(undefined));
      } else {
        setFilterState((prev: any) => ({ ...prev, [name]: value, branchClassId: "" }));
        getFeeReceiptApiCall({ branchCurriculumId: value, branchClassId: null });
        getClassApiCall({ curriculumId: value, academicYearId: filterState.academicYearId });
      }
    }
    else if (name === "branchId") {
      if (value) {
        setFilterState((prev: any) => ({ ...prev, [name]: value, branchCurriculumId: "", branchClassId: "" }));
        getCurriculumApiCall({ branchId: value, academicYearId: filterState.academicYearId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" });
        getFeeReceiptApiCall({ [name]: value, branchClassId: null, branchCurriculumId: "" });
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
      }
    }
    else {
      setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
      getFeeReceiptApiCall({ [name]: value });
    }
    const stateChanged = hasStateChanged({ ...filterState, [name]: value, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange)
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
  }

  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: canViewBranchFilters ? filterState.branchId : branchId, academicYearId: filterState.academicYearId, curriculumId: filterState.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterState.academicYearId, branchId: canViewBranchFilters ? filterState.branchId : branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getFeeReceiptApiCall(otherProps?: any) {
    let filter = { ...filterState, ...otherProps };
    let payment: any = filter.paymentModes?.map((i: any) => i?.id);
    let feeDetails: any = filter.feeDetails?.map((i: any) => i?.id);

    let receipt: any = [];
    filter.receiptTypes.map((rct: any) => rct.selected === true && receipt.push(rct.id));
    const payload = { instituteId, ...filterState, ...otherProps, receiptTypes: receipt, paymentModes: payment?.length > 0 ? payment : [], feeDetails: feeDetails?.length ? feeDetails : [] }
    payload.studentTypes = ["EXISTING_STUDENT", "NEW_STUDENT"];

    const params = { ...pagination.current, orderBy: "", sortBy: "" };
    dispatch(getFeeReceiptsAct(generateActionPayload("get_fee_receipts", params, payload)));
  }

  function advanceFilterHndlr() {
    setAdvanceFilterState(prevState => ({ ...prevState, showModal: true }));
  }

  function closeAdvanceModalHndlr() {
    setAdvanceFilterState(prevState => ({ ...prevState, showModal: false }));
  }

  function advanceFilterCallbckHndlr(appliedFilters: any) {
    if (appliedFilters.branchCurriculumId) {
      getClassApiCall(appliedFilters.branchCurriculumId)
    }
    else {
      dispatch(resetBrchClassAct(undefined));
    }
    const stateChanged = hasStateChanged({ ...filterState, ...appliedFilters, academicYearId: "" });
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    setShowClearFilterState(stateChanged?.stateChange)
    getFeeReceiptApiCall({ ...appliedFilters })
    setFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
  }

  function paginationHndlr(paginationInfo: any) {
    pagination.current = paginationInfo;
    getFeeReceiptApiCall();
  }
  useEffect(() => {
    if (branchId && !canViewBranchFilters) {
      if (academicYearListResp) {
        const { academicYearId }: any = academicYearListResp?.data.find((item: any) => item.yearStatus === "CURRENT") || {};
        getCurriculumApiCall({ academicYearId })
      }
    }
  }, [branchId, canViewBranchFilters]);


  useEffect(() => {
    if (feeReceiptsResp) {
      setAdvanceFilterState((prev: any) => ({ ...prev, showModal: false }));
    }
  }, [feeReceiptsResp])

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      pagination.current = { ...pagination.current, pageNo: 0 }
      let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
      dispatch(resetBrchClassAct(undefined));
      setCount(null)

      setFilterState({ ...initialValues, academicYearId, branchId: branchId ? branchId?.toString() : "" });
      getFeeReceiptApiCall({ ...initialValues, academicYearId, branchId: branchId ? branchId?.toString() : "" })
      if (!canViewBranchFilters) {
        getCurriculumApiCall({ academicYearId, branchId: branchId ? branchId?.toString() : "" });
      }
      else {
        dispatch(resetBrchCurriculumAct(undefined));
      }
      setShowClearFilterState(false)
    }
  }

  const exportModalHndler = () => {
    let filter = { ...filterState };
    let payment: any = filter.paymentModes?.map((i: any) => i?.id);
    let feeDetails = filter.feeDetails?.map((i: any) => i?.id);

    let receipt: any = [];
    filter.receiptTypes.map((rct: any) => rct.selected === true && receipt.push(rct.id));
    const payload = { instituteId, ...filterState, receiptTypes: receipt, paymentModes: payment?.length > 0 ? payment : [], feeDetails: feeDetails?.length ? feeDetails : [], studentTypes: ["EXISTING_STUDENT", "NEW_STUDENT"] }

    const params = { ...pagination.current, orderBy: "", sortBy: "" };
    dispatch(exportFeeReceiptAct(generateActionPayload('export_fee_receipt', params, { ...payload }, {
      responseType: 'blob'
    })))
  }

  const sendEmailModalHndler = () => {
    dispatch(sendEmailFeeReceiptAct(generateActionPayload('send_email_fee_reciept', { receiptId: sendEmailModal.receiptId }, undefined)))
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


  function closeFeeReversalHandler(apiCall: any) {
    if (typeof apiCall === "boolean" && apiCall) {
      getFeeReceiptApiCall();
    }
    setFeeReversalModalState(prevState => ({ ...prevState, showModal: false }));
  }

  const feeReceiptColumns = useMemo(() => {
    const newColumns = generateColumns(menuOptions, viewReceiptDetailsHndlr);
    return newColumns.filter((item: any) => {
      if (item?.accessor === "actions") {
        return canCreateAndUpdate;
      } else if (item?.accessor === "branchName") {
        return canViewBranchFilters;
      }
      return true
    })
  }, [feeReceiptsResp, canCreateAndUpdate, canViewBranchFilters]);

  const { data: receiptList, pageNumber, totalPages, totalElements } = feeReceiptsResp || {};
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Fee Receipts" pageTitle="Fee" />

          <div className="tw-bg-white tw-rounded-md tw-shadow tw-mb-6">

            <div className="tw-p-4 tw-border-b">
              <div className="tw-flex tw-items-center">

                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Fee Receipts
                </h4>

                <div className="tw-ml-auto tw-flex tw-items-center tw-gap-2">
                  {canCreateAndUpdate && (
                    <Button
                      onClick={newReceiptHndlr}
                      variant="primary"
                    >
                      <i className="ri-add-line tw-mr-1" />
                      Create New
                    </Button>
                  )}

                  <Button
                    id="export-btn"
                    variant="exportBtn"
                    onClick={toggleExportConfirmationModal}
                  >
                    <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                  </Button>

                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </div>
              </div>
            </div>

            <div className="tw-p-4">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="search-box tw-relative">
                    <TextInput
                      name="studentName"
                      value={filterState.studentName}
                      onChange={onChangeFilterHndlr}
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search"
                      labelText="Search"
                      floatingLabel
                    />
                    <i className="ri-search-line search-icon" />
                  </div>
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={filterState.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearListResp?.data}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic Year"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                {canViewBranchFilters && (
                  <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                    <SelectInput
                      name="branchId"
                      value={filterState.branchId}
                      valueKey="branchId"
                      textKey="branchName"
                      menuItems={branchState}
                      onChange={onChangeFilterHndlr}
                      labelText="Branch Name"
                      floatingLabel
                      formgroupClassName="tw-mb-0"
                    />
                  </div>
                )}

                <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                  <SelectInput
                    name="branchCurriculumId"
                    value={filterState.branchCurriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={brchCurriculumResp?.data}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                  <SelectInput
                    name="branchClassId"
                    value={filterState.branchClassId}
                    onChange={onChangeFilterHndlr}
                    menuItems={branchClassResp?.content}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-6 xl:tw-col-span-1 tw-relative">
                  <div
                    onClick={advanceFilterHndlr}
                    className="tw-bg-gray-100 tw-p-2 tw-rounded-md tw-flex tw-items-center hover:tw-bg-gray-200 tw-cursor-pointer"
                  >
                    <FilterSvg height="18px" width="18px" />
                    <span className="tw-ml-2">Filters</span>
                  </div>

                  <span className="tw-absolute -tw-top-2 tw-right-6 tw-bg-teal-500 tw-text-white tw-text-xs tw-rounded-full tw-px-2">
                    {count}
                  </span>
                </div>

                {showClearFilterState && (
                  <div className="tw-col-span-auto tw-ml-auto tw-flex">
                    <Button
                      variant="wrong"
                      onClick={clearFilterHndlr}
                    >
                      Clear filter
                    </Button>
                  </div>
                )}

                {multiCheckActionState && (
                  <div className="tw-col-span-12">
                    <Button
                      onClick={createMultipleCredentials}
                      variant="primary"
                    >
                      Send Credentials
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <TableContainer
              columns={feeReceiptColumns || []}
              data={Array.isArray(receiptList) ? receiptList : []}
              tableClass="tw-mb-0"
              divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
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
        toggle={toggleEditFeeDetailsModal}
        modalTitle="Receipt Details"
        instituteId={"1"}
        instituteName={"Fee Details"}
        branchId={editFeeDetailsModalState.branchId}
        editBranchDetails={""}
      /> */}
      <ModalContainerUpdated
        id="add-specialfee-modal"
        isOpen={editFeeDetailsModalState.showModal}
        toggle={toggleEditFeeDetailsModal}
        modalTitle="Receipt Details"
        modalSize="lg"
      >
        <EditFeeDetailsModal
          toggle={toggleEditFeeDetailsModal}
          feeReceiptId={editFeeDetailsModalState.feeReceiptId}
          editFeeDetails={editFeeDetailsModalState.modalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="add-specialfee-modal"
        isOpen={viewReceiptModalState.showModal}
        toggle={toggleViewDetailsModal}
        modalTitle="Receipt Details"
        modalSize="xl"
      >
        <FeeDetailsModal
          toggle={toggleViewDetailsModal}
          feeReceiptId={editFeeDetailsModalState.feeReceiptId}
          modalTitle="Fee Details"
          receiptDetails={viewReceiptModalState.modalData}
          printReceiptHndlr={printReceiptHndlr}
          editFeeDetailsHndlr={editFeeDetailsModalHndlr}
        />
      </ModalContainerUpdated>

      <OffCanvasContainer
        isOpen={advanceFilterState.showModal}
        headerTitle="Fee Receipts Filters"
        closeHndlr={closeAdvanceModalHndlr}
        id="feereceipt-advance-filter"
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
        id="fee-reciepts-export-modal"
        isOpen={exportConfirmationModal.showModal}
        toggle={toggleExportConfirmationModal}
        modalTitle={'Export Fee Receipts Data'}
        modalSize="md"
      >
        <ExportModal
          isOpen={exportConfirmationModal.showModal}
          toggle={toggleExportConfirmationModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportModalHndler}
          feature="fee"
          subFeature={!canViewBranchFilters ? "fee_receipts" : ""}
          remarksText="Enter remarks to export fee receipts data?"
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
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      />
      <ConfirmationModal
        id="craete-credential-modal"
        isOpen={createCredentialState.showModal}
        confirmMessage="You want to create credetials for the selected student?"
        cancelHndlr={closeCreateCredentialModalHandler}
        confirmHndlr={confirmCreateCredentialHandler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      />
      <ModalContainerUpdated
        id="fee-reversal-modal"
        isOpen={feeReversalModalState.showModal}
        toggle={closeFeeReversalHandler}
        hideHeader={true}
        modalSize="md"
      >
        <FeeReversalModal
          toggle={closeFeeReversalHandler}
          isOpen={feeReversalModalState.showModal}
          receiptInfo={feeReversalModalState.receiptInfo}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default FeeReceipts;
