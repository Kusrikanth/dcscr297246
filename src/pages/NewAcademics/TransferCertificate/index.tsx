import React, { useState, useMemo, useEffect, useRef } from "react";
import { Card, CardBody, Col, Container, Row, CardHeader } from "reactstrap";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, SearchInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  TransferCertificateFilterhProps,
} from "./transferCertificateTypes";
import {
  advanceFilterKeys,
  generateColumns, statusTypes,
  SAMPLE_TC_REVERT_LEDGER_COUNT
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import OfflineTransferCertificateModal from "./OfflineTransferCertificateModal";
import CertificateIssuanceModal from "./CertificateIssuanceModal";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import CancelModal from "./CancelModal";
import { shallowEqual, useDispatch } from "react-redux";
import { cancelTcRequestRes, getTcRequestList, setTcRequestAct, setEmailNotification, setIssueTcRequest, setSMSNotification, exportTcListAct, getTcConsolidatedListAct, getCustomTcCertificateAct, getDepartMentApprovalAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";
import { getBranchClassAct, setBrchClassAct, getBranchCurriculumAct, resetBrchCurriculumAct, resetBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import ApprovalStatusModal from "./ApprovalStatusModal";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { downloadExcelFile, sanitizeUrlParams } from "../../../utility/commonutility";
import BonafideCumStudyCertiModal from "./BonafideCumStudyCertiModal";
import PreviewTcRequest from "./PreviewTcRequest";
import { useModal } from "../../../hooks/modalhook";
import PreviewTcConsolidated from "./PreviewTcConsolidated";
import {
  HugeiconsIcon
} from "@hugeicons/react";
import {
  CancelCircleIcon, Certificate01Icon, Mail01Icon, PencilEdit02Icon,
  PrinterStrokeStandard, PropertyViewIcon, TaskEdit01StrokeStandard, Upload03Icon
} from "@hugeicons-pro/core-stroke-standard";
import { searchInputOptions } from "../../Directory/StudentManagement/helper";
import DepartmentConfirmationModal from "./DepartmentConfirmationModal";
import Button from "../../../Components/Common/Button";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import TcAttendanceCheckModal from "./TcAttendanceCheckModal";
import TcRevertAuthModal from "./TcRevertAuthModal";
import {
  addRevertedTcRecord,
  getPreviousAcademicYear,
  useRevertedTcRecords,
} from "../../../utility/tcrevertutility";

const initialValues: TransferCertificateFilterhProps = {
  search: "",
  nameFilterType: "global",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  requestType: "",
  tcRequestStatus: "",
  tcApplicationStartDt: "",
  tcApplicationEndDt: "",
  sectionId: "",
  date: "",
};

const filterSearchOptions = searchInputOptions.slice(0, 4);

const TransferCertificate = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [searchTcState, setSearchTcState] = useState("global");
  const [transferCertificateFilterState, setTransferCertificateFilterState] =
    useState<TransferCertificateFilterhProps>(initialValues);

  const { closeModal: closeExportExcelModal, modalState: exportExcelState, openModal: openExportExcelModal } = useModal();
  const { modalState: digitalSignPreviewTcModalState, closeModal: closeDigitalSignPreviewTcHndlr,
    openModal: openDigitalSignPreviewTcHndlr
  } = useModal();
  const { modalState: tcConsolidated, closeModal: closeTcConsolidatedHndlr,
    openModal: openTcConsolidatedHndlr
  } = useModal();
  const { modalState: tcDepartmentApproval, closeModal: closeTcDepartmentApprovalHndlr,
    openModal: openTcDepartmentApprovalHndlr
  } = useModal();
  const { modalState: digitalSignedBonafideCumModalState, closeModal: closeDigitalSignBonafideCumModalHndlr,
    openModal: openDigitalSignBonafideCumModalHndlr
  } = useModal();
  const { modalState: tcAttendanceCheckState, closeModal: closeTcAttendanceCheckHndlr,
    openModal: openTcAttendanceCheckHndlr
  } = useModal();
  const { modalState: tcRevertAuthState, closeModal: closeTcRevertAuthHndlr,
    openModal: openTcRevertAuthHndlr
  } = useModal();
  const [
    offlineTransferCertificateModalState,
    setOfflineTransferCertificateModalState,
  ] = useState<any>({
    showModal: false,
    tcId: undefined,
  });
  const [certificateIssuaModalState, setCertificateIssuaModalState] =
    useState({
      showModal: false,
      tcId: "",
      mode: ""
    });
  const [cancelTCRequestModalState, setCancelTCRequestModalState] =
    useState<any>({
      showModal: false,
      tcId: "",
    });
  const [issueTCRequestModalState, setIssueTCRequestModalState] =
    useState<any>({
      showModal: false,
      tcId: "",
    });
  const [bonafideCumCertificateModalState, setBonafideCumCertificateModalState] =
    useState({
      showModal: false,
      tcId: "",
      digitalSigned: false
    });
  const [smsConfirmationModalState, setSmsConfirmationModalState] =
    useState<any>({
      showModal: false,
      tcId: "",
    });
  const [emailConfirmationModalState, setEmailConfirmationModalState] =
    useState<any>({
      showModal: false,
      tcId: "",
    });
  const [approvalStatusModalState, setApprovalStatusModalState] =
    useState<any>({
      showModal: false,
      tcId: "",
    });
  const [previewTcModalState, setPreviewTcModalState] =
    useState({
      showModal: false,
      tcId: "",
      digitalSigned: false,
      tcRequestStatus: ""
    });


  // const [paginationFilter, setPaginationFilter] = useState({ pageNo: 0, pageSize: 10 })
  const paginationRef = useRef<IPaginationState>({
    pageNo: 0,
    pageSize: 10
  })
  const { currentBranchIdResp: branchId, loggedInUserRole, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, tcRequestList, certificateIssuance, cancelTcRequest, loginUserDetailsResp, addTcReqRes, editTcReqRes, issueTcRequest, smsNotification, emailNotification, classroomManagmentErrorResp, exportTcListResp, showApiLoader, tcApprovalStatusList, getDepartMentApprovalResp }: any =
    useAppSelector(
      ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, globalData }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        loginUserDetailsResp: appData.loginUserDetailsResp,
        academicYearListResp: instAcademics.academicYearListResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
        tcRequestList: classroomManagmentInfo.tcRequestList,
        certificateIssuance: classroomManagmentInfo.certificateIssuance,
        cancelTcRequest: classroomManagmentInfo.cancelTcRequest,
        addTcReqRes: classroomManagmentInfo.addTcReqRes,
        editTcReqRes: classroomManagmentInfo.editTcReqRes,
        issueTcRequest: classroomManagmentInfo.issueTcRequest,
        smsNotification: classroomManagmentInfo.smsNotification,
        emailNotification: classroomManagmentInfo.emailNotification,
        classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
        exportTcListResp: classroomManagmentInfo.exportTcListResp,
        showApiLoader: globalData.showApiLoader,
        loggedInUserRole: appData.loggedInUserRole,
        tcApprovalStatusList: classroomManagmentInfo.tcApprovalStatusList,
        getDepartMentApprovalResp: classroomManagmentInfo.getDepartMentApprovalResp
      }),
      shallowEqual
    );

  const canCreateAndUpdate = useMemo(() => {
    return (loggedInUserRole !== 'PRINCIPAL'
      && loggedInUserRole !== 'VICE_PRINCIPAL' && loggedInUserRole !== 'HOD')
  }, [loggedInUserRole]);

  const revertedTcRecords = useRevertedTcRecords();

  const { selectedAcademicYearName, previousAcademicYear } = useMemo(() => {
    const academicYears = academicYearListResp?.data;
    const { academicYearId } = transferCertificateFilterState;
    const selectedYear = academicYears?.find((year: any) => `${year?.academicYearId}` === `${academicYearId}`);
    return {
      selectedAcademicYearName: selectedYear?.academicYearName || "",
      previousAcademicYear: getPreviousAcademicYear(academicYears, academicYearId),
    };
  }, [academicYearListResp, transferCertificateFilterState.academicYearId]);

  // A reverted request no longer belongs to the year it was raised in, so it is dropped from that
  // year's list and shown under the academic year it was reverted to.
  const displayedTcRequestList = useMemo(() => {
    const selectedYearId = `${transferCertificateFilterState.academicYearId}`;
    const revertedTcIds = revertedTcRecords.map((record) => `${record.tcId}`);
    const rowsForYear = (tcRequestList?.data || []).filter((row: any) => !revertedTcIds.includes(`${row.tcId}`));
    const revertedRowsForYear = revertedTcRecords
      .filter((record) => `${record.revertedAcademicYearId}` === selectedYearId)
      .map((record) => ({
        tcId: record.tcId,
        tcNumber: record.tcNumber,
        tcApplicationDate: record.tcApplicationDate,
        student: {
          studentId: record.studentId,
          studentName: record.studentName,
          studentCode: record.studentCode,
        },
        curriculumName: record.curriculumName,
        className: record.className,
        sectionName: record.sectionName,
        requestType: record.requestType,
        lastAttendanceDate: record.lastAttendanceDate,
        deptApprovedStatus: "PENDING",
        tcRequestStatus: "Yet to prepare",
        hostelExitStatus: false,
        cancelRemarks: record.revertRemarks,
        createdAt: record.revertedAt,
      }));
    return [...revertedRowsForYear, ...rowsForYear];
  }, [tcRequestList, revertedTcRecords, transferCertificateFilterState.academicYearId]);

  const getTcRequestListResponse = (otherProps?: any) => {
    const payload = {
      ...transferCertificateFilterState,
      ...otherProps
    }

    const { academicYearId } = payload;

    if (!academicYearId) {
      toast.error("Academic year is required.");
      return;
    }
    const params = {
      search: payload.search,
      nameFilterType: payload.nameFilterType,
      academicYearId: payload.academicYearId,
      branchId: branchId,
      curriculumId: payload.curriculumId,
      classId: payload.classId,
      requestType: payload.requestType,
      tcRequestStatus: payload.tcRequestStatus,
      tcApplicationStartDt: payload.tcApplicationStartDt,
      tcApplicationEndDt: payload.tcApplicationEndDt,
      sectionId: payload.sectionId,
      ...paginationRef.current
    }
    dispatch(getTcRequestList(generateActionPayload('tc_request_list', undefined, sanitizeUrlParams(params))))
  }

  const getTcConsolidatedResponse = (id: any) => {
    dispatch(getCustomTcCertificateAct(generateActionPayload('tc_custom_certi_preview', { digitalSign: true }, { instituteId, requestId: id, certificateType: "TC_CONSOLIDATED_VIEW" })))
  }

  const exportExcelHndler = () => {

    dispatch(exportTcListAct(generateActionPayload("export_tc_certificate_list", undefined, { ...transferCertificateFilterState, branchId, instituteId }, {
      responseType: 'blob'
    })));
  }

  const toggleOfflineTransferCertificateModal = (tcId?: any, apiCall?: any) => {
    if (typeof (apiCall) === "boolean" && apiCall) {
      getTcRequestListResponse();
    }
    setOfflineTransferCertificateModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      tcId: tcId
    }));
  };

  const toggleCertificateIssueModal = (tcId?: any, apiCall?: any) => {
    if (typeof (apiCall) === "boolean" && apiCall) {
      getTcRequestListResponse();
    }
    setCertificateIssuaModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      tcId: tcId
    }));
  };
  const togglePreviewCertiModal = (tcId?: any, apiCall?: any, tcRequestStatus?: any) => {
    if (typeof (apiCall) === "boolean" && apiCall) {
      getTcRequestListResponse();
    }
    setPreviewTcModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      tcId: tcId,
      tcRequestStatus: tcRequestStatus
    }));
  };
  const toggleCancelModal = (tcId?: any, apiCall?: any) => {
    if (typeof (apiCall) === "boolean" && apiCall) {
      getTcRequestListResponse();
    }
    setCancelTCRequestModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      tcId: tcId
    }));
  };
  const toggleIssueTcRequestModal = (tcId?: any, apiCall?: any) => {
    if (typeof (apiCall) === "boolean" && apiCall) {
      getTcRequestListResponse();
    }
    setIssueTCRequestModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      tcId: tcId
    }));
  };
  const toggleBonafideCumCertificateModal = (tcId?: any) => {
    setBonafideCumCertificateModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      tcId: tcId
    }))
  }
  const toggleSMSConfirmationModal = (tcId?: any) => {
    setSmsConfirmationModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      tcId: tcId
    }));
  };
  const toggleEmailConfirmationModal = (tcId?: any) => {
    setEmailConfirmationModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      tcId: tcId
    }));
  };
  const toggleApprovalStatusModal = (tcId?: any) => {
    setApprovalStatusModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      tcId: tcId
    }));
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: transferCertificateFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getClassApiCall(curriculumId: string) {
    const payload = { academicYearId: transferCertificateFilterState.academicYearId, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;

    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      const updatedState = { ...transferCertificateFilterState, [name]: value, classId: "", curriculumId: "" };
      setTransferCertificateFilterState(updatedState);
      getTcRequestListResponse(updatedState);
    }
    else if (name === "curriculumId") {
      if (value) {
        getClassApiCall(value);
      }
      else {
        dispatch(resetBrchClassAct(undefined));
      }
      const updatedState = { ...transferCertificateFilterState, [name]: value, classId: "" };
      setTransferCertificateFilterState(updatedState);
      getTcRequestListResponse(updatedState);
    } else {
      const updatedState = { ...transferCertificateFilterState, [name]: value };
      setTransferCertificateFilterState(updatedState);
      getTcRequestListResponse(updatedState);
    }
  }

  function onSearchHandler(name: string, value: any) {
    paginationRef.current.pageNo = 0;
    setTransferCertificateFilterState((prevState) => {
      const updatedState = {
        ...prevState,
        search: value,
      };
      getTcRequestListResponse(updatedState);
      return updatedState;
    });
  }

  function onChangeHandler(name: string, id: any, item: any) {
    setSearchTcState(id);
    paginationRef.current.pageNo = 0;

    setTransferCertificateFilterState((prevState) => {
      const updatedState = {
        ...prevState,
        nameFilterType: id,
        search: ""
      };
      getTcRequestListResponse(updatedState);
      return updatedState;
    });
  }


  function advanceFilterCallbckHndlr(appliedFilters: any) {
    //Reset Pagination
    paginationRef.current.pageNo = 0;
    setTransferCertificateFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    getTcRequestListResponse(appliedFilters)
  }
  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    getTcRequestListResponse();
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "email",
        actionIcon: <HugeiconsIcon icon={Mail01Icon} className="me-2 text-muted" size={18} />,
        actionName: "Email",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          toggleEmailConfirmationModal(id)
        },
      },
      {
        id: "print",
        actionIcon: <HugeiconsIcon icon={PrinterStrokeStandard} className="me-2 text-muted" size={18} />,
        actionName: "Bonafide Cum Study Certificate Print",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          openDigitalSignBonafideCumModalHndlr({ tcId: id });
        },
      },
      {
        id: "print tc",
        actionIcon: <HugeiconsIcon icon={PrinterStrokeStandard} className="me-2 text-muted" size={18} />,
        actionName: "Print TC",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          const tcRequestStatus = tcRequestList?.data?.find((item: any) => +item.tcId === +id)?.tcRequestStatus
          openDigitalSignPreviewTcHndlr({ tcId: id, tcRequestStatus: tcRequestStatus });
        },
      },
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
        actionName: "Edit Request",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          toggleOfflineTransferCertificateModal(id)
        },
      },
      {
        id: "issue",
        actionIcon: <HugeiconsIcon icon={Upload03Icon} className="me-2 text-muted" size={18} />,
        actionName: "Issue",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          toggleIssueTcRequestModal(id)
        },
      },
      {
        id: "prepareCertificate",
        actionIcon: <HugeiconsIcon icon={Certificate01Icon} className="me-2 text-muted" size={18} />,
        actionName: "Prepare Certificate",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          const tcRecord = displayedTcRequestList.find((item: any) => `${item.tcId}` === `${id}`);
          openTcAttendanceCheckHndlr({ tcId: id, tcRecord });
        },
      },
      {
        id: "editIssuanceCertificate",
        actionIcon: <HugeiconsIcon icon={TaskEdit01StrokeStandard} className="me-2 text-muted" size={18} />,
        actionName: "Edit Issuance Certificate",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          setCertificateIssuaModalState(prevState => ({
            ...prevState, showModal: true,
            tcId: id, mode: 'EDIT'
          }))
        },
      },
      {
        id: "cancel",
        actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="me-2 text-danger" size={18} />,
        actionName: "Cancel TC Request",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          toggleCancelModal(id)
        },
      },
      {
        id: "tcConsolidated",
        actionIcon: <HugeiconsIcon icon={PropertyViewIcon} className="me-2 text-muted" size={18} />,
        actionName: "TC Consolidated View Preview",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          getTcConsolidatedResponse(id)
          openTcConsolidatedHndlr();
        },
      },
      {
        id: "tcDepartmentApproval",
        actionIcon: <HugeiconsIcon icon={PropertyViewIcon} className="me-2 text-muted" size={18} />,
        actionName: "TC Department Approval Preview",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          openTcDepartmentApprovalHndlr(id);
        }
      }
    ],
    [tcRequestList, displayedTcRequestList]
  );

  const CancelHandler = (remarks?: string) => {
    let params = { tcRequestId: cancelTCRequestModalState.tcId }
    dispatch(cancelTcRequestRes(generateActionPayload('cancel_tc_request', params, { cancelRemarks: remarks })))
  }
  const IssueTcRequestConfirmation = () => {
    let params = { tcRequestId: issueTCRequestModalState.tcId, updatedBy: 65558 }
    dispatch(setIssueTcRequest(generateActionPayload('issue_tc_req', params)))
  }
  const SMSNotificationHandler = () => {
    let params = { tcRequestId: smsConfirmationModalState.tcId }
    let payload = ['SMS']
    dispatch(setSMSNotification(generateActionPayload('tc_request_notification', params, payload)))
  }
  const DepartmentApprovalHndler = () => {
    if (tcApprovalStatusList?.data.length > 0) {
      toast.warning("Department approval is already generated. Click on Preview to view it.");
    }
    else{
      dispatch(getDepartMentApprovalAct(generateActionPayload('department_tc_approval',{tcRequestId: tcDepartmentApproval.modalData },undefined)))
    }
  }
  function studentAttendedHndlr() {
    const { tcId } = tcAttendanceCheckState?.modalData || {};
    closeTcAttendanceCheckHndlr();
    setCertificateIssuaModalState(prevState => ({
      ...prevState, showModal: true,
      tcId: tcId, mode: 'ADD'
    }));
  }

  function studentNotAttendedHndlr() {
    if (!previousAcademicYear) {
      toast.error(`No academic year exists before ${selectedAcademicYearName}. This TC request cannot be reverted.`);
      return;
    }
    const { modalData } = tcAttendanceCheckState || {};
    closeTcAttendanceCheckHndlr();
    openTcRevertAuthHndlr(modalData);
  }

  function revertTcRequestHndlr({ remarks }: { remarks: string }) {
    const { tcRecord } = tcRevertAuthState?.modalData || {};
    const { academicYearId: revertedAcademicYearId, academicYearName: revertedAcademicYearName } = previousAcademicYear || {};
    // TODO: call the revert TC API here once it exists. It should delete the current academic year
    // ledgers and move the request back to the previous academic year.
    addRevertedTcRecord({
      tcId: `${tcRecord?.tcId}`,
      tcNumber: tcRecord?.tcNumber,
      studentId: tcRecord?.student?.studentId ?? tcRecord?.studentId,
      studentCode: tcRecord?.student?.studentCode,
      studentName: tcRecord?.student?.studentName,
      curriculumName: tcRecord?.curriculumName,
      className: tcRecord?.className,
      sectionName: tcRecord?.sectionName,
      requestType: tcRecord?.requestType,
      tcApplicationDate: tcRecord?.tcApplicationDate,
      lastAttendanceDate: tcRecord?.lastAttendanceDate,
      fromAcademicYearId: `${transferCertificateFilterState.academicYearId}`,
      fromAcademicYearName: selectedAcademicYearName,
      revertedAcademicYearId: `${revertedAcademicYearId}`,
      revertedAcademicYearName: revertedAcademicYearName,
      deletedLedgerCount: SAMPLE_TC_REVERT_LEDGER_COUNT,
      revertRemarks: remarks,
      revertedAt: new Date().toISOString(),
    });
    closeTcRevertAuthHndlr();
    toast.success(`${selectedAcademicYearName} ledgers deleted. TC request reverted to ${revertedAcademicYearName} and listed in Fee Approvals under ${revertedAcademicYearName}.`);
  }

  const EmailNotificationHandler = () => {
    let params = { tcRequestId: emailConfirmationModalState.tcId }
    let payload = ['EMAIL']
    dispatch(setEmailNotification(generateActionPayload('tc_request_notification', params, payload)))
  }

  useEffect(() => {

    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);

  useEffect(() => {
    if (academicYearListResp) {
      const { academicYearId = "" } = academicYearListResp && academicYearListResp.data.find(((year: any) => year.isAdmissionDefault)) || {}
      getCurriculumApiCall({ academicYearId });
      setTransferCertificateFilterState((prev: any) => ({ ...prev, academicYearId }))
      getTcRequestListResponse({ academicYearId });
    }
  }, [academicYearListResp]);


  useEffect(() => {
    if (tcRequestList) {
      setOpen(false);
    }
  }, [tcRequestList])

  const transferCertificateIssuanceRef = useRef({
    prevAddTcReqRes: addTcReqRes,
    prevEditTcReqRes: editTcReqRes,
    prevIssueTcRequest: issueTcRequest,
    prevCertificateIssuance: certificateIssuance,
    prevCancelTcRequest: cancelTcRequest,
    prevSmsNotification: smsNotification,
    prevEmailNotification: emailNotification,
    prevExportTcListResp: exportTcListResp,
    prevClassroomManagmentErrorResp: classroomManagmentErrorResp,
    prevGetDepartMentApprovalResp: getDepartMentApprovalResp
  })

  useEffect(() => {
    const { prevSmsNotification, prevEmailNotification, prevCertificateIssuance, prevCancelTcRequest, prevAddTcReqRes, prevEditTcReqRes, prevIssueTcRequest, prevExportTcListResp, prevClassroomManagmentErrorResp, prevGetDepartMentApprovalResp } = transferCertificateIssuanceRef.current;
    if (certificateIssuance && certificateIssuance !== prevCertificateIssuance) {
      toast.success('Certificate Issued Successfully.');
      toggleCertificateIssueModal(undefined, true);
    } else if (cancelTcRequest && cancelTcRequest !== prevCancelTcRequest) {
      toast.success('TC Request Cancelled Successfully.');
      toggleCancelModal(undefined, true);
    } else if (addTcReqRes && addTcReqRes !== prevAddTcReqRes) {
      toast.success('TC Request Added Successfully.');
      toggleOfflineTransferCertificateModal(undefined, true);
    } else if (editTcReqRes && editTcReqRes !== prevEditTcReqRes) {
      toast.success('TC Request Edited Successfully.');
      toggleOfflineTransferCertificateModal(undefined, true);
    } else if (issueTcRequest && issueTcRequest !== prevIssueTcRequest) {
      toast.success(issueTcRequest);
      toggleIssueTcRequestModal(undefined, true);
    } else if (smsNotification && smsNotification !== prevSmsNotification) {
      toast.success("Notification sent Successfully.");
      toggleSMSConfirmationModal();
    } else if (emailNotification && emailNotification !== prevEmailNotification) {
      toast.success("Notification sent Successfully.");
      toggleEmailConfirmationModal();
    } else if (exportTcListResp && exportTcListResp !== prevExportTcListResp) {
      toast.success("Tc Certificate Excel Downloaded Successfully.")
      downloadExcelFile(exportTcListResp, 'Tc_Certificate_Excel.xlsx')
      closeExportExcelModal();
    } else if (classroomManagmentErrorResp && classroomManagmentErrorResp !== prevClassroomManagmentErrorResp) {
      const { details } = classroomManagmentErrorResp || {};
      toast.error(details || "Something went wrong.");
    } else if (getDepartMentApprovalResp && getDepartMentApprovalResp !== prevGetDepartMentApprovalResp) {
      closeTcDepartmentApprovalHndlr();
      getTcRequestListResponse();
    }

    transferCertificateIssuanceRef.current.prevCertificateIssuance = certificateIssuance;
    transferCertificateIssuanceRef.current.prevSmsNotification = smsNotification;
    transferCertificateIssuanceRef.current.prevEmailNotification = emailNotification;
    transferCertificateIssuanceRef.current.prevCancelTcRequest = cancelTcRequest;
    transferCertificateIssuanceRef.current.prevAddTcReqRes = addTcReqRes;
    transferCertificateIssuanceRef.current.prevEditTcReqRes = editTcReqRes;
    transferCertificateIssuanceRef.current.prevIssueTcRequest = issueTcRequest;
    transferCertificateIssuanceRef.current.prevExportTcListResp = exportTcListResp;
    transferCertificateIssuanceRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;
    transferCertificateIssuanceRef.current.prevGetDepartMentApprovalResp = getDepartMentApprovalResp
  }, [certificateIssuance, cancelTcRequest, addTcReqRes, smsNotification, emailNotification, editTcReqRes, issueTcRequest, exportTcListResp, classroomManagmentErrorResp, getDepartMentApprovalResp])

  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }
  function withDigitalSignPreviewTcHndlr() {
    const { modalData } = digitalSignPreviewTcModalState,
      { tcId, tcRequestStatus } = modalData || {};
    if (tcId) {
      setPreviewTcModalState((prevState: any) => ({
        ...prevState,
        showModal: true,
        tcId: tcId,
        digitalSigned: true,
        tcRequestStatus: tcRequestStatus
      }));
      closeDigitalSignPreviewTcHndlr();
    }
  }
  function withoutDigitalSignPreviewTcHndlr() {
    const { modalData } = digitalSignPreviewTcModalState,
      { tcId, tcRequestStatus } = modalData || {};
    if (tcId) {
      setPreviewTcModalState((prevState: any) => ({
        ...prevState,
        showModal: true,
        tcId: tcId,
        digitalSigned: false,
        tcRequestStatus: tcRequestStatus
      }));
      closeDigitalSignPreviewTcHndlr();
    }
  }
  function withDigitalSignBonafideCumHndlr() {
    const { modalData } = digitalSignedBonafideCumModalState,
      { tcId } = modalData || {};
    if (tcId) {
      setBonafideCumCertificateModalState((prevState: any) => ({
        ...prevState,
        showModal: true,
        tcId: tcId,
        digitalSigned: true
      }))
      closeDigitalSignBonafideCumModalHndlr();
    }
  }
  function withoutDigitalSignBonafideCumHndlr() {
    const { modalData } = digitalSignedBonafideCumModalState,
      { tcId } = modalData || {};
    if (tcId) {
      setBonafideCumCertificateModalState((prevState: any) => ({
        ...prevState,
        showModal: true,
        tcId: tcId,
        digitalSigned: false
      }))
      closeDigitalSignBonafideCumModalHndlr();
    }
  }

  // FIXED: This logic now correctly determines when a filter has been applied.
  const { filterApplied, advanceFilterCount } = useMemo(() => {
    let tempFilterApplied = false;
    let tempAdvanceFilterCount = 0;
    const state = transferCertificateFilterState;

    for (const key in state) {
      const filterKey = key as keyof TransferCertificateFilterhProps;
      const filterValue = state[filterKey];

      if (filterValue) { // Check if the filter has any value
        // Condition for showing "Clear Filter" button
        if (filterKey !== 'academicYearId' && !(filterKey === 'nameFilterType' && filterValue === 'global')) {
          tempFilterApplied = true;
        }

        // Condition for counting "Advanced Filters" for the badge
        if (advanceFilterKeys.includes(filterKey)) {
          tempAdvanceFilterCount++;
        }
      }
    }
    return { filterApplied: tempFilterApplied, advanceFilterCount: tempAdvanceFilterCount };
  }, [transferCertificateFilterState]);

  function clearFilterHandler() {
    if (academicYearListResp) {
      let academicYearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId || "";
      dispatch(setBrchClassAct(undefined));
      setSearchTcState("global");
      const clearedState = { ...initialValues, academicYearId, curriculumId: "" };
      setTransferCertificateFilterState(clearedState);
      getTcRequestListResponse(clearedState);
      getCurriculumApiCall({ academicYearId });
    }
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { totalElements, totalPages, pageNumber } = tcRequestList || {};
  const { content: classTypes } = branchClassResp || {};
  const roleColumns = useMemo(() => {
    const columns = generateColumns(menuOptions, toggleApprovalStatusModal);
    if (!canCreateAndUpdate) {
      return columns.filter(item => item?.accessor !== "actions")
    }
    return columns;
  }, [canCreateAndUpdate, tcRequestList, displayedTcRequestList]);

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Transfer Certificate" pageTitle="Admissions" />

          <Card>
            <CardHeader>
              <div className="tw-grid tw-grid-cols-12 tw-items-center tw-gap-3">
                <div className="tw-col-span-12 md:tw-col-span-6">
                  <h4 className="tw-text-lg tw-mb-0 tw-flex-grow">
                    Transfer Certificate Issue Details
                  </h4>
                </div>
                <div className="tw-col-span-12 md:tw-col-span-6 tw-flex tw-justify-end tw-items-center tw-gap-2">
                  {canCreateAndUpdate && (
                    <Button
                      variant="primary"
                      onClick={() => toggleOfflineTransferCertificateModal(undefined, undefined)}
                    >
                      <i className="ri-add-line tw-mr-2" />
                      Add Request
                    </Button>
                  )}
                  <Button
                    variant="info"
                    onClick={() => openExportExcelModal()}
                  >
                    <div className="tw-flex tw-items-center tw-text-white">
                      <span>
                        <i className="ri-add-line tw-mr-1" />
                      </span>
                      <span>Export</span>
                    </div>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <div className="tw-p-0">
              <div className="tw-py-3 tw-px-3 tw-pb-0">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                  <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-3">
                    <SearchInput
                      hideDefaultSelect
                      name="search"
                      value={searchTcState}
                      menuItems={filterSearchOptions}
                      idKey="id"
                      labelName="Search With"
                      searchHandler={onSearchHandler}
                      onChange={onChangeHandler}
                      renderSelectedValue={(item: any) => item?.name}
                      renderOptions={(item: any) => item?.name}
                    />
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-2">
                    <SelectInput
                      name="academicYearId"
                      value={transferCertificateFilterState.academicYearId}
                      onChange={filterHandler}
                      menuItems={academicYearList || []}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      formgroupClassName="tw-mb-0"
                      labelText="Academic Year"
                      floatingLabel
                    />
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-2">
                    <SelectInput
                      name="curriculumId"
                      value={transferCertificateFilterState.curriculumId}
                      onChange={filterHandler}
                      menuItems={curriculumTypes}
                      valueKey="branchCurriculumId"
                      textKey="curriculumName"
                      formgroupClassName="tw-mb-0"
                      labelText="Curriculum"
                      floatingLabel
                    />
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-2">
                    <SelectInput
                      name="classId"
                      value={transferCertificateFilterState.classId}
                      onChange={filterHandler}
                      menuItems={classTypes || []}
                      valueKey="id"
                      textKey="shortName"
                      formgroupClassName="tw-mb-0"
                      labelText="Class"
                      floatingLabel
                    />
                  </div>
                  <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-2">
                    <SelectInput
                      name="tcRequestStatus"
                      value={transferCertificateFilterState.tcRequestStatus}
                      onChange={filterHandler}
                      menuItems={statusTypes}
                      valueKey="statusType"
                      textKey="statusName"
                      formgroupClassName="tw-mb-0"
                      labelText="Status"
                      floatingLabel
                    />
                  </div>

                  <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-1 tw-flex tw-items-center">
                    <div className="tw-relative">
                      <div
                        style={{
                          backgroundColor: "#F4F7FA",
                        }}
                        onClick={toggleAdvanceFilter}
                        className="tw-cursor-pointer tw-p-2 tw-btn tw-flex tw-rounded"
                      >
                        <FilterSvg height={"18px"} width={"18px"} />
                        <span className="tw-ml-2">Filters</span>
                      </div>
                      {advanceFilterCount > 0 && (
                        <span
                          className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-ml-1"
                          style={{
                            marginBottom: "18px",
                            position: "absolute",
                            top: "-9px",
                            right: "-4px",
                            background: "#0ab39c",
                            padding: "2px 6px",
                            fontSize: "12px",
                            color: "white",
                          }}
                        >
                          {advanceFilterCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="tw-col-span-12 tw-flex tw-justify-end tw-items-center tw-gap-2 ">
                     {filterApplied && (
                      <Button
                        type="button"
                        variant="wrong"
                        onClick={clearFilterHandler}
                      >
                        Clear filter
                      </Button>
                    )}
                  </div>
                </div>
                <OffCanvasContainer
                  isOpen={open}
                  headerTitle="Advance Filters"
                  closeHndlr={toggleAdvanceFilter}
                  id="transfer-certificate-advance-filter"
                >
                  <AdvanceFilterModal
                    getClassApiCall={getClassApiCall}
                    appliedFilter={transferCertificateFilterState}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                  />
                </OffCanvasContainer>
              </div>

              <TableContainer
                columns={roleColumns}
                data={displayedTcRequestList}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              />
            </div>
          </Card>
        </Container>
      </div>

      <ModalContainerUpdated
        id="offline-transfer-certificate-modal"
        isOpen={offlineTransferCertificateModalState.showModal}
        toggle={() => toggleOfflineTransferCertificateModal(undefined, undefined)}
        modalTitle="Offline Transfer Certificate Request"
        modalSize="lg"
      >
        <OfflineTransferCertificateModal
          isOpen={offlineTransferCertificateModalState.showModal}
          toggle={toggleOfflineTransferCertificateModal}
          modalTitle="Offline Transfer Certificate Request"
          instituteId={instituteId}
          instituteName={"Offline Transfer Certificate Request"}
          branchId={branchId}
          editBranchDetails={""}
          academicYearId={transferCertificateFilterState.academicYearId}
          tcId={offlineTransferCertificateModalState.tcId}
          requestType='OFFLINE'
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="certificate-insurance-modal"
        isOpen={certificateIssuaModalState.showModal}
        toggle={toggleCertificateIssueModal}
        modalTitle="Certificate Issuance"
        modalSize="lg"
      >
        <CertificateIssuanceModal
          isOpen={certificateIssuaModalState.showModal}
          toggle={toggleCertificateIssueModal}
          modalTitle="Certificate Issuance"
          instituteId={instituteId}
          instituteName={"Certificate Issuance"}
          branchId={branchId}
          mode={certificateIssuaModalState.mode}
          tcId={certificateIssuaModalState.tcId}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="bonafide-cum-study-certificate-modal"
        isOpen={bonafideCumCertificateModalState.showModal}
        toggle={toggleBonafideCumCertificateModal}
        modalTitle="Certificate Issuance"
        modalSize="xl"
      >

        <BonafideCumStudyCertiModal
          isOpen={bonafideCumCertificateModalState.showModal}
          toggle={toggleBonafideCumCertificateModal}
          modalTitle="Certificate Issuance"
          instituteId={instituteId}
          instituteName={"Certificate Issuance"}
          branchId={"1"}
          editBranchDetails={""}
          tcId={bonafideCumCertificateModalState.tcId}
          digitalSigned={bonafideCumCertificateModalState.digitalSigned}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="offline-preview-certificate-modal"
        isOpen={previewTcModalState.showModal}
        toggle={() => togglePreviewCertiModal(undefined, undefined, undefined)}
        modalTitle="Preview Certificate"
        modalSize="lg"
      >

        <PreviewTcRequest
          isOpen={previewTcModalState.showModal}
          toggle={togglePreviewCertiModal}
          modalTitle="Preview Certificate"
          instituteId={instituteId}
          instituteName={""}
          branchId={"1"}
          editBranchDetails={""}
          tcId={previewTcModalState.tcId}
          tcRequestStatus={previewTcModalState?.tcRequestStatus}
          digitalSigned={previewTcModalState.digitalSigned}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="offline-preview-certificate-modal"
        isOpen={tcConsolidated.showModal}
        toggle={closeTcConsolidatedHndlr}
        modalTitle="Preview TC Consolidated Certificate"
        modaClassName="print-modal"
      >

        <PreviewTcConsolidated
          isOpen={tcConsolidated.showModal}
          toggle={closeTcConsolidatedHndlr}
          modalTitle="Preview TC Consolidated Certificate"
          instituteId={instituteId}
          instituteName={""}
          branchId={"1"}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="issue-tc-request-modal"
        isOpen={issueTCRequestModalState.showModal}
        confirmMessage="Do you want to Issue Transfer Certificate Request ?"
        cancelHndlr={toggleIssueTcRequestModal}
        confirmHndlr={IssueTcRequestConfirmation}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      />
      <ModalContainerUpdated
        id="cancel-status-modal"
        isOpen={cancelTCRequestModalState.showModal}
        toggle={toggleCancelModal}
        headerClassName="bg-white"
        modalTitle=""
        hideHeader={true}
        modalSize="md"
      >

        <CancelModal
          isOpen={cancelTCRequestModalState.showModal}
          toggle={toggleCancelModal}
          modalTitle=""
          branchId={cancelTCRequestModalState.branchId}
          editBranchDetails={""}
          submitHandler={CancelHandler}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="approval-status-modal"
        isOpen={approvalStatusModalState.showModal}
        toggle={toggleApprovalStatusModal}
        modalTitle="Approval Status"
        modalSize="md"
      >

        <ApprovalStatusModal
          isOpen={approvalStatusModalState.showModal}
          toggle={toggleApprovalStatusModal}
          modalTitle="Approval Status"
          instituteId={instituteId}
          instituteName={""}
          branchId={branchId}
          editBranchDetails={""}
          tcId={approvalStatusModalState.tcId}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="department-approval-status-modal"
        isOpen={tcDepartmentApproval.showModal}
        toggle={closeTcDepartmentApprovalHndlr}
        modalTitle="Department Approval Status"
        modalSize="md"
      >
        <DepartmentConfirmationModal
          isOpen={tcDepartmentApproval.showModal}
          toggle={closeTcDepartmentApprovalHndlr}
          submitHandler={DepartmentApprovalHndler} 
          modalTitle="Department Approval Status"
          confirmationMessage="Do you want to Generate Department Approval ?"
          instituteId={instituteId}
          branchId={branchId}
          tcId={tcDepartmentApproval.modalData}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="sms-confirmation-modal"
        isOpen={smsConfirmationModalState.showModal}
        confirmMessage="Do you want to Send SMS Notification ?"
        cancelHndlr={toggleSMSConfirmationModal}
        confirmHndlr={SMSNotificationHandler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      />


      <ConfirmationModal
        id="digitally-signed-previewtc"
        isOpen={digitalSignPreviewTcModalState.showModal}
        iconType="approve"
        btnClassName="btn btn-success w-sm"
        confirmTitle="Confirmation"
        confirmMessage="Do you want the document to get digitally signed?"
        confirmHndlr={withDigitalSignPreviewTcHndlr}
        cancelHndlr={withoutDigitalSignPreviewTcHndlr}
        confirmBtnText="Yes"
        cancelBtnText="No"
      />

      <ConfirmationModal
        id="digitally-signed-boafidecum"
        isOpen={digitalSignedBonafideCumModalState.showModal}
        iconType="approve"
        btnClassName="btn btn-success w-sm"
        confirmTitle="Confirmation"
        confirmMessage="Do you want the document to get digitally signed?"
        confirmHndlr={withDigitalSignBonafideCumHndlr}
        cancelHndlr={withoutDigitalSignBonafideCumHndlr}
        confirmBtnText="Yes"
        cancelBtnText="No"
      />

      <ConfirmationModal
        id="email-confirmation-modal"
        isOpen={emailConfirmationModalState.showModal}
        confirmMessage="Do you want to Send Email Notification ?"
        cancelHndlr={toggleEmailConfirmationModal}
        confirmHndlr={EmailNotificationHandler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      />
      <ModalContainerUpdated
        id="tc-attendance-check-modal"
        isOpen={tcAttendanceCheckState.showModal}
        toggle={closeTcAttendanceCheckHndlr}
        modalTitle="Attendance Confirmation"
        modalSize="md"
      >
        <TcAttendanceCheckModal
          academicYearName={selectedAcademicYearName}
          previousAcademicYearName={previousAcademicYear?.academicYearName}
          studentName={tcAttendanceCheckState?.modalData?.tcRecord?.student?.studentName}
          studentCode={tcAttendanceCheckState?.modalData?.tcRecord?.student?.studentCode}
          className={tcAttendanceCheckState?.modalData?.tcRecord?.className}
          sectionName={tcAttendanceCheckState?.modalData?.tcRecord?.sectionName}
          attendedHndlr={studentAttendedHndlr}
          notAttendedHndlr={studentNotAttendedHndlr}
          closeHndlr={closeTcAttendanceCheckHndlr}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="tc-revert-auth-modal"
        isOpen={tcRevertAuthState.showModal}
        toggle={closeTcRevertAuthHndlr}
        modalTitle="Revert TC Request"
        modalSize="md"
      >
        <TcRevertAuthModal
          academicYearName={selectedAcademicYearName}
          previousAcademicYearName={previousAcademicYear?.academicYearName}
          studentName={tcRevertAuthState?.modalData?.tcRecord?.student?.studentName}
          studentCode={tcRevertAuthState?.modalData?.tcRecord?.student?.studentCode}
          ledgerCount={SAMPLE_TC_REVERT_LEDGER_COUNT}
          isDisabled={showApiLoader}
          submitHndlr={revertTcRequestHndlr}
          closeHndlr={closeTcRevertAuthHndlr}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="tc-certificate-export"
        isOpen={exportExcelState.showModal}
        toggle={closeExportExcelModal}
        modalTitle="Export Transfer Certificate"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcelState.showModal}
          toggle={closeExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="admission"
          subFeature="transfer_certificates"
          remarksText="Enter remarks to download the excel file?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default TransferCertificate;