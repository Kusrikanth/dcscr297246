import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { SelectInput, TextInput, OffCanvasContainer, ModalContainerUpdated, ConfirmationModal } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  generateColumns, hasStateChanged, receiptTypeOptions,
} from "./helper";
import { useHistory } from "react-router-dom";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { default as PrintSvg } from "../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { default as EyeSvg } from "../../../assets/imagesdps/academics/EyeSvg.svg?react";
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
  setFeeReceiptsAct,
  getSpecialFeeReceiptAct
} from "../../../store/fee/feecollections/feecollectionactions";
import AdvanceFilterModal from "./AdvanceFilterModal";
import FeeDetailsModal from "./FeeDetailsModal";
import { useModal } from "../../../hooks/modalhook";
import FeeReversalModal from "./FeeReversalModal";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { getSpecialFeeCategoryListAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock04Icon, EyeIcon, Mail01Icon, PrinterIcon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";
const initialValues = {
  studentName: "",
  receiptTypes: receiptTypeOptions,
  startDate: "",
  endDate: "",
  branchClassId: "",
  branchCurriculumId: "",
  academicYearId: "",
  category: "",
  feeDetails: "",
  studentTypes: [],
  paymentModes: []
};

const FeeReceipts = () => {
  const history = useHistory();

  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [count, setCount] = useState<any>(null);
  const [filterState, setFilterState] = useState({
    studentName: "",
    receiptTypes: receiptTypeOptions,
    startDate: "",
    endDate: "",
    branchClassId: "",
    branchCurriculumId: "",
    academicYearId: "",
    studentTypes: [],
    paymentModes: []
  });
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })
  const [advanceFilterState, setAdvanceFilterState] = useState({
    showModal: false,
    appliedFilter: undefined
  });
  const selectedLedgerRef = useRef(null);

  const { closeModal: closeExportConfirmationModal, modalState: exportConfirmationModal, openModal: openExportConfirmationModal } = useModal();
  const { closeModal: closeSendEmailModal, modalState: sendEmailModalState, openModal: openSendEmailModal } = useModal();

  const [createCredentialState, setCreateCredentialState] = useState({
    showModal: false,
    studentIds: []
  });

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

  const { closeModal: closeFeeReversalHandler, modalState: feeReversalModalState, openModal: openFeeReversalModal } = useModal();

  const dispatch = useAppDispatch();

  const {
    branchClassResp, loggedInUserRole, virtualRoleResp,
    academicYearListResp, brchCurriculumResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    specialFeeReceiptsResp, getSpecialFeeCategoryListResp,
    feeCollectionErrorResp, showApiLoader, exportFeeReceiptResp, createCredentialsResp, sendEmailFeeReceiptResp, createFeeReversalResp, } =
    useAppSelector(({ appData, branchAcademics, feeCollections, masterFeeSettings,
      instAcademics, globalData }) => ({
        branchClassResp: branchAcademics.branchClassResp,
        brchSectionsResp: branchAcademics.brchSectionsResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        academicYearListResp: instAcademics.academicYearListResp,
        instAcademicErrorResp: instAcademics.instAcademicErrorResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        loggedInUserRole: appData.loggedInUserRole,
        virtualRoleResp: appData.virtualRoleResp,
        specialFeeReceiptsResp: feeCollections.specialFeeReceiptsResp,
        sendEmailFeeReceiptResp: feeCollections.sendEmailFeeReceiptResp,
        exportFeeReceiptResp: feeCollections.exportFeeReceiptResp,
        createCredentialsResp: feeCollections.createCredentialsResp,
        createFeeReversalResp: feeCollections.createFeeReversalResp,
        feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
        getSpecialFeeCategoryListResp: masterFeeSettings.getSpecialFeeCategoryListResp,
        showApiLoader: globalData.showApiLoader,
      }), shallowEqual);

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

  const specialFeeCategoryList = (otherProps?: any) => {

    let payload = {
      branchId,
    };
    dispatch(getSpecialFeeCategoryListAct(generateActionPayload("get_special_fee_category_list", undefined, payload)));
  };

  function downloadExcelFile(blobStream: any) {

    const url = window.URL.createObjectURL(new Blob([(blobStream)]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Fee_Receipts.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const feeDetailsRespRef = useRef({
    prevAcademicYearListResp: academicYearListResp,
    prevFeeCollectionErrorResp: feeCollectionErrorResp,
    prevExportFeeReceiptResp: exportFeeReceiptResp,
    prevCreateCredentialsResp: createCredentialsResp,
    prevSendEmailFeeReceiptResp: sendEmailFeeReceiptResp,
    prevCreateFeeReversalResp: createFeeReversalResp,
  });

  useEffect(() => {
    const { prevAcademicYearListResp, prevFeeCollectionErrorResp, prevExportFeeReceiptResp,
      prevSendEmailFeeReceiptResp, prevCreateCredentialsResp, prevCreateFeeReversalResp, } = feeDetailsRespRef.current;
    if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
      if (Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
        setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
        getFeeReceiptApiCall({ academicYearId });
        getCurriculumApiCall({ academicYearId: academicYearId })
        specialFeeCategoryList()
      }
    }
    else if (exportFeeReceiptResp && exportFeeReceiptResp !== prevExportFeeReceiptResp) {
      downloadExcelFile(exportFeeReceiptResp)
      toast.success("Fee Reciept Data Downloaded Successfully.")
      closeExportConfirmationModal();
    }
    else if (sendEmailFeeReceiptResp && sendEmailFeeReceiptResp !== prevSendEmailFeeReceiptResp) {
      toast.success("Fee Reciept Sent to registered Email Successfully.")
      closeSendEmailModal();
    } else if (createCredentialsResp && createCredentialsResp !== prevCreateCredentialsResp) {
      toast.success("Credetials created successfully.")
      closeCreateCredentialModalHandler();
      getFeeReceiptApiCall();
    }
    else if (createFeeReversalResp && prevCreateFeeReversalResp !== createFeeReversalResp) {
      toast.success("Fee reversal completed successfully.")
      closeFeeReversalHandler()
      getFeeReceiptApiCall()
    }
    else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
      const { message } = feeCollectionErrorResp || {};
      toast.error(message || "Something went wrong.");
    }
    feeDetailsRespRef.current.prevAcademicYearListResp = academicYearListResp;
    feeDetailsRespRef.current.prevExportFeeReceiptResp = exportFeeReceiptResp;
    feeDetailsRespRef.current.prevSendEmailFeeReceiptResp = sendEmailFeeReceiptResp;
    feeDetailsRespRef.current.prevSendEmailFeeReceiptResp = createCredentialsResp;
    feeDetailsRespRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
    feeDetailsRespRef.current.prevCreateFeeReversalResp = createFeeReversalResp
  }, [academicYearListResp, feeCollectionErrorResp, exportFeeReceiptResp, sendEmailFeeReceiptResp,
    createCredentialsResp, createFeeReversalResp]);

  // const toggleSendEmailModal = (id?: any) => {
  //   setSendEmailModal((prevState) => ({
  //     ...prevState,
  //     showModal: !prevState.showModal,
  //     receiptId: id || "",
  //   }));
  // };

  const toggleViewDetailsModal = useCallback(() => {
    setViewReceiptModalState((prev) => ({
      ...prev,
      showModal: false
    }))
  }, [specialFeeReceiptsResp]);

  function viewReceiptDetailsHndlr(event: any) {
    const feeReceiptId = event.currentTarget.getAttribute("data-id"),
      modalData = specialFeeReceiptsResp?.data?.find((item: any) => +item.id === Number(feeReceiptId));
    if (modalData) {
      setViewReceiptModalState((prev) => ({
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
      history.push(`/special-fee-reciepts/preview-receipt/${feeReceiptId}`);
  }

  function feeReversalHandler(event: any) {
    const feeReceiptId = event.currentTarget.getAttribute("data-id");
    const receiptInfo = specialFeeReceiptsResp.data?.find((item: any) => item.id?.toString() === feeReceiptId) || {};
    openFeeReversalModal(receiptInfo?.id)
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "sendEmail",
        actionIcon: <HugeiconsIcon icon={Mail01Icon} className="me-2 text-muted" size={18} />,
        actionName: "Send Email",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          if (id) {
            openSendEmailModal(id)
          }
        },
      },
      {
        id: "fee-reversal",
        actionIcon: <HugeiconsIcon icon={Clock04Icon} className="me-2 text-muted" size={18} />,
        actionName: "Fee Reversal",
        onClickHndlr: feeReversalHandler,
      },
      {
        id: "print",
        actionIcon: <HugeiconsIcon icon={PrinterIcon} className="me-2 text-muted" size={18} />,
        actionName: "Print",
        onClickHndlr: printReceiptHndlr,
      },
      {
        id: "viewDetails",
        actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
        actionName: "View Details",
        onClickHndlr: viewReceiptDetailsHndlr,
      },
    ], [specialFeeReceiptsResp]);

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if (name === 'academicYearId') {
      const updatedState = { ...filterState, [name]: value, branchCurriculumId: "", branchClassId: "", sectionId: "" };
      setFilterState(updatedState);
      if (value) {
        getCurriculumApiCall({ academicYearId: value });
        getFeeReceiptApiCall({ [name]: value, branchClassId: null, branchCurriculumId: "" });
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
      }
    } else if (name === "branchCurriculumId") {
      if (!value) {
        setFilterState((prev) => ({ ...prev, [name]: "" }));
        dispatch(resetBrchClassAct(undefined));
      } else {
        setFilterState((prev) => ({ ...prev, [name]: value, branchClassId: "" }));
        getFeeReceiptApiCall({ [name]: value, branchClassId: null });
        getClassApiCall({ curriculumId: value, academicYearId: filterState.academicYearId });
      }
    } else {
      setFilterState((prevState) => ({ ...prevState, [name]: value }));
      getFeeReceiptApiCall({ [name]: value });
    }
    const stateChanged = hasStateChanged({ ...filterState, [name]: value, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange);
    setCount(stateChanged?.count === 0 ? null : stateChanged?.count);
  }


  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: filterState.academicYearId, curriculumId: filterState.branchCurriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  function getFeeReceiptApiCall(otherProps?: any) {
    let filter = { ...filterState, ...otherProps };
    let payment: any = filter.paymentModes?.map((i: any) => i?.id);

    let receipt: any = [];
    filter.receiptTypes.map((rct: any) => rct.selected === true && receipt.push(rct.id));
    const payload = { instituteId, branchId, ...filterState, ...otherProps, receiptTypes: receipt, paymentModes: payment?.length > 0 ? payment : [], feeDetails: filter.feeDetails ? [filter.feeDetails] : [], studentTypes: ["SPECIAL_FEE", "GENERAL_FEE"] }

    const params = { ...pagination.current, orderBy: "", sortBy: "" };
    dispatch(getSpecialFeeReceiptAct(generateActionPayload("get_special_fee_receipts", params, payload)));
  }

  function advanceFilterHndlr() {
    setAdvanceFilterState(prevState => ({ ...prevState, showModal: true }));
  }

  function closeAdvanceModalHndlr() {
    setAdvanceFilterState(prevState => ({ ...prevState, showModal: false }));
  }

  function advanceFilterCallbckHndlr(appliedFilters: any) {
    setFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    if (appliedFilters.branchCurriculumId) {
      getClassApiCall(appliedFilters.branchCurriculumId)
    }
    else {
      dispatch(resetBrchClassAct(undefined));
    }
    const stateChanged = hasStateChanged({ ...filterState, ...appliedFilters, academicYearId: "" });
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    setShowClearFilterState(stateChanged?.stateChange)
    getFeeReceiptApiCall(appliedFilters)
  }

  function paginationHndlr(paginationInfo: any) {
    pagination.current = paginationInfo;
    getFeeReceiptApiCall();
  }

  useEffect(() => {
    if (specialFeeReceiptsResp) {
      setAdvanceFilterState((prev: any) => ({ ...prev, showModal: false }));
    }
  }, [specialFeeReceiptsResp])

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      pagination.current = { ...pagination.current, pageNo: 0 }
      let { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
      dispatch(resetBrchClassAct(undefined));
      setCount(null)
      setFilterState({ ...initialValues, academicYearId })
      getFeeReceiptApiCall({ ...initialValues, academicYearId })
      setShowClearFilterState(false)
      getCurriculumApiCall({ academicYearId });
    }
  }

  const exportModalHndler = (otherProps?: any) => {
    let filter = { ...filterState, ...otherProps };
    let payment: any = filter.paymentModes?.map((i: any) => i?.id);

    let receipt: any = [];
    filter.receiptTypes.map((rct: any) => rct.selected === true && receipt.push(rct.id));
    const payload = { instituteId, branchId, ...filterState, receiptTypes: receipt, paymentModes: payment?.length > 0 ? payment : [], feeDetails: filter.feeDetails ? [filter.feeDetails] : [], studentTypes: ["SPECIAL_FEE", "GENERAL_FEE"] }

    const params = { ...pagination.current, orderBy: "", sortBy: "" };
    dispatch(exportFeeReceiptAct(generateActionPayload('export_special_fee_receipts', params, { ...payload }, {
      responseType: 'blob'
    })))
  }

  const sendEmailModalHndler = () => {
    dispatch(sendEmailFeeReceiptAct(generateActionPayload('send_email_fee_reciept', { receiptId: sendEmailModalState.modalData }, undefined)))
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
  }, [specialFeeReceiptsResp]);

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

  const newReceiptHndlr = () => {
    history.push("/special-fee-reciepts/create-receipt");
  };

  const feeReceiptColumns = useMemo(() => {
    const newColumns = generateColumns(menuOptions, printReceiptHndlr, canCreateAndUpdate);
    return newColumns.filter((item: any) => {
      if (item?.accessor === "actions") {
        return canCreateAndUpdate;
      }
      return true
    })
  }, [specialFeeReceiptsResp, canCreateAndUpdate]),
    { data: receiptList, pageNumber, totalPages, totalElements } = specialFeeReceiptsResp || {};
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Fee Receipts" pageTitle="Fee" />

          <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                    Special Fee Receipts
                  </h4>
                </div>

                <div className="tw-ml-auto tw-flex tw-gap-2">
                  {canCreateAndUpdate && (
                    <Button
                      onClick={newReceiptHndlr}
                      variant="primary"
                    >
                      <div className="tw-flex tw-items-center">
                        <i className="ri-add-line tw-mr-1" />
                        <span>Create New</span>
                      </div>
                    </Button>
                  )}

                  <Button
                    onClick={openExportConfirmationModal}
                    variant="info"
                  >
                    <div className="tw-flex tw-items-center">
                      <i className="ri-add-line tw-mr-1" />
                      <span>Export</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            <div className="tw-px-4 tw-py-3">
              <div className="tw-grid tw-grid-cols-12 tw-gap-x-4 tw-gap-y-3">
                <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="search-box">
                    <TextInput
                      name="studentName"
                      value={filterState.studentName}
                      onChange={onChangeFilterHndlr}
                      formgroupClassName="tw-mb-0"
                      labelText="Search"
                      floatingLabel
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
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

                <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                  <SelectInput
                    name="branchCurriculumId"
                    value={filterState.branchCurriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={brchCurriculumResp?.data}
                    formgroupClassName="tw-mb-0"
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                  <SelectInput
                    name="branchClassId"
                    value={filterState.branchClassId}
                    onChange={onChangeFilterHndlr}
                    menuItems={branchClassResp?.content}
                    formgroupClassName="tw-mb-0"
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    floatingLabel
                  />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                  <div className="tw-flex">
                    <div className="tw-relative tw-mr-2">
                      <button
                        onClick={advanceFilterHndlr}
                        className="tw-flex tw-items-center tw-bg-gray-100 tw-p-2 tw-rounded"
                      >
                        <FilterSvg height="18px" width="18px" />
                        <span className="tw-ml-2">Filters</span>
                      </button>

                      <span
                        className="tw-absolute tw--top-2 tw-right-0 tw-bg-emerald-500 tw-text-white tw-text-xs tw-rounded-full tw-px-2"
                      >
                        {count}
                      </span>
                    </div>

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

                {multiCheckActionState && (
                  <div className="tw-col-span-12">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={createMultipleCredentials}
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
              divClass="tw-overflow-x-auto tw-mb-4"
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
        />
      </ModalContainerUpdated>

      <OffCanvasContainer
        isOpen={advanceFilterState.showModal}
        headerTitle="Fee Receipts Filters"
        closeHndlr={closeAdvanceModalHndlr}
        id="special-fee-receipt-advance-filter"
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
        id="special-fee-reciepts-export-modal"
        isOpen={exportConfirmationModal.showModal}
        toggle={closeExportConfirmationModal}
        modalTitle={'Export Special Fee Receipts Data'}
        modalSize="md"
      >
        <ExportModal
          isOpen={exportConfirmationModal.showModal}
          toggle={closeExportConfirmationModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportModalHndler}
          feature="fee"
          subFeature="fee_receipts"
          remarksText="Enter remarks to export special fee receipts data?"
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="fee-reciepts-send-email-modal"
        isOpen={sendEmailModalState.showModal}
        confirmMessage="You want to Send an Email ?"
        cancelHndlr={closeSendEmailModal}
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
        id="special-fee-reversal-modal"
        isOpen={feeReversalModalState.showModal}
        toggle={closeFeeReversalHandler}
        hideHeader={true}
        modalSize="md"
      >
        <FeeReversalModal
          toggle={closeFeeReversalHandler}
          isOpen={feeReversalModalState.showModal}
          receiptId={feeReversalModalState.modalData}
        />
      </ModalContainerUpdated>

    </>
  );
};

export default FeeReceipts;
