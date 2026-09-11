import { useFormik } from "formik";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, MultiSelectCheckbox, OffCanvasContainer, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { MenuOptions, generateColumnsForFeedback, generateColumnsForStudent, hasStateChanged } from "./helper";

import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";

import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { toast } from "react-toastify";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { exportUnpaidListAct, getUnpaidFeedbackListAct, getUnpaidListStudentAct, resetUnpaidFeedbackListAct, resetUnpaidListAct, sendEmailSmsUnpaidListAct } from "../../../../store/fee/feereport/feereportactions";
import ModifiedHorizontalTab from "../../../../Components/Common/ModifiedHorizontalTab";
import FullEmployeeConcessionModal from "./FullEmployeeConcessionModal";
import ProtectConcessionModal from "./ProtectConcessionModal";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, Message01Icon, SentIcon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";


const initialValues = {
  stuSearchString: "",
  feedbackSearchString: "",
  academicYearId: "",
  curriculumId: "",
  classIds: null,
  admissionType: "",
  startDate: "",
  endDate: "",
};

function renderOptions(item: any) {
  return item?.shortName;
}

function renderValue(selectedItems: any) {
  if (Array.isArray(selectedItems)) {
    return (<div className="text-truncate">
      {
        selectedItems.map((item, index) => {
          return item?.shortName + (index !== (selectedItems.length - 1) ? ', ' : '')
        })
      }
    </div>)
  }
}

const UnpaidReport = () => {

  const dispatch = useDispatch()
  const [unpaidReportFilterState, setUnpaidReportFilterState] = useState(initialValues);
  const [open, setOpen] = useState<boolean>(false);
  const [stuNotiList, setStuNotiList] = useState<any>(null);
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
  const [menuId, setMenuId] = useState<string | null>("studentNotificaionDetails");
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [count, setCount] = useState<any>(null);
  const paginationStuRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const paginationFeedbackRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const [exportExcel, setExportExcel] = useState({
    showModal: false,
    id: undefined
  })
  const [fullConcessionModalState, setFullConcessionModalState] = useState({
    showModal: false,
  })
  const [protectConcessionModalState, setProtectConcessionModalState] = useState({
    showModal: false,
  })

  const [sendEmailModal, setSendEmailModal] =
    useState({
      showModal: false,
      id: "",
      name: "",
      type: "",
    });

  const { currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    getUnpaidListStudentResp,
    getUnpaidFeedbackListResp,
    sendEmailSmsUnpaidListResp,
    showApiLoader,
    fullEmployeeConcessionResp,
    feeReportErrorResp,
    exportUnpaidListResp,
  } = useAppSelector(({ appData, globalData, branchAcademics, instAcademics, feeReport }) => ({
    academicYearListResp: instAcademics.academicYearListResp,
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    brchCurriculumResp: branchAcademics.brchCurriculumResp,
    branchClassResp: branchAcademics.branchClassResp,
    showApiLoader: globalData.showApiLoader,
    getUnpaidListStudentResp: feeReport.getUnpaidListStudentResp,
    getUnpaidFeedbackListResp: feeReport.getUnpaidFeedbackListResp,
    sendEmailSmsUnpaidListResp: feeReport.sendEmailSmsUnpaidListResp,
    fullEmployeeConcessionResp: feeReport.fullEmployeeConcessionResp,
    feeReportErrorResp: feeReport.feeReportErrorResp,
    exportUnpaidListResp: feeReport.exportUnpaidListResp,

  }), shallowEqual);

  const UnpaidReportRef = useRef({
    prevSendEmailSmsUnpaidListResp: sendEmailSmsUnpaidListResp,
    prevGetUnpaidListStudentResp: getUnpaidListStudentResp,
    prevExportUnpaidListResp: exportUnpaidListResp,
    prevFullEmployeeConcessionResp: fullEmployeeConcessionResp,
    prevFeeReportErrorResp: feeReportErrorResp,

  })
  useEffect(() => {
    const { prevSendEmailSmsUnpaidListResp, prevGetUnpaidListStudentResp, prevExportUnpaidListResp, prevFullEmployeeConcessionResp, prevFeeReportErrorResp } = UnpaidReportRef.current;

    if (sendEmailSmsUnpaidListResp && prevSendEmailSmsUnpaidListResp !== sendEmailSmsUnpaidListResp) {
      if (sendEmailModal.name === "email") {
        toast.success("Email succussfully sent to your mail");
      } else if (sendEmailModal.name === "sms") {
        toast.success("SMS succussfully sent to your mobile number");
      } else {
        toast.success("Email & SMS succussfully sent to your mobile number and mail");
      }
      toggleSendEmailModal()
      getUnpaidDataList()
    }
    else if (getUnpaidListStudentResp && prevGetUnpaidListStudentResp !== getUnpaidListStudentResp) {
      setStuNotiList(getUnpaidListStudentResp?.content?.map((item: any) => ({
        ...item,
        isSelected: false
      })))
    } else if (exportUnpaidListResp && prevExportUnpaidListResp !== exportUnpaidListResp) {
      toast.success("Exported successfully");
      toggleExportExcelModal()
      downloadExcelFile(exportUnpaidListResp)
    }
    else if (fullEmployeeConcessionResp && prevFullEmployeeConcessionResp !== fullEmployeeConcessionResp) {
      toast.success("100% Employee Concession Created successfully");
      toggleFullConcessionModal()
    }
    else if (feeReportErrorResp && prevFeeReportErrorResp !== feeReportErrorResp) {
      const { details } = feeReportErrorResp || {}
      toast.error(details || "Something went wrong")
    }
    UnpaidReportRef.current.prevSendEmailSmsUnpaidListResp = sendEmailSmsUnpaidListResp;
    UnpaidReportRef.current.prevGetUnpaidListStudentResp = getUnpaidListStudentResp;
    UnpaidReportRef.current.prevExportUnpaidListResp = exportUnpaidListResp;
    UnpaidReportRef.current.prevFullEmployeeConcessionResp = fullEmployeeConcessionResp;
    UnpaidReportRef.current.prevFeeReportErrorResp = feeReportErrorResp;

  }, [sendEmailSmsUnpaidListResp, getUnpaidListStudentResp, exportUnpaidListResp, fullEmployeeConcessionResp, feeReportErrorResp])

  const unpaidReportFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: unpaidReportFilterState,
    onSubmit: (values) => {
      paginationStuRef.current.pageNo = 0;
      paginationFeedbackRef.current.pageNo = 0;
      const { academicYearId, curriculumId, endDate, startDate } = values || {};
      const payload = {
        academicYearId, curriculumId,
        classIds: values.classIds,
        endDate,
        startDate,
      }

      const stateChanged = hasStateChanged({ ...unpaidReportFilterState, ...values, academicYearId: "" });
      stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
      setShowClearFilterState(stateChanged?.stateChange)
      if (menuId === "studentNotificaionDetails") {
        getUnpaidDataList({ ...payload, stuSearchString: "" })
      } else {
        getUnpaidFeedbackList({ ...payload, feedbackSearchString: "" })
      }
    },
  });

  const toggleExportExcelModal = (id?: any) => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  };

  function downloadExcelFile(blobStream: any) {

    const url = window.URL.createObjectURL(new Blob([(blobStream)]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'AdmissionUnpaidReport.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const exportExcelHndler = () => {
    const payload: any = {
      branchId, instituteId, searchString: menuId === "studentNotificaionDetails" ? unpaidReportFilterState.stuSearchString : unpaidReportFilterState.feedbackSearchString, ...unpaidReportFilterState, ...paginationStuRef.current,
    }
    if (menuId === "studentNotificaionDetails") {
      payload.isFeedbackProvided = null
    } else {
      payload.isFeedbackProvided = true
    }
    const params = { ...payload }
    delete payload.feedbackSearchString;
    delete payload.stuSearchString;
    dispatch(exportUnpaidListAct(generateActionPayload("export_unpaid_list", undefined, { ...payload, searchString: params.stuSearchString, classIds: Array.isArray(payload.classIds) ? payload?.classIds?.map((item: any) => item.id)?.join(",") : "" }, {
      responseType: 'blob'
    })));
  }

  function getUnpaidDataList(otherProps?: any) {
    const payload = {
      branchId, instituteId, searchString: unpaidReportFilterState.stuSearchString, ...unpaidReportFilterState, ...paginationStuRef.current, ...otherProps,
    }
    const params = { ...payload }
    delete payload.feedbackSearchString;
    delete payload.stuSearchString;
    dispatch(getUnpaidListStudentAct(generateActionPayload("get_unpaid_list", undefined, { ...payload, searchString: params.stuSearchString, classIds: Array.isArray(payload.classIds) ? payload?.classIds?.map((item: any) => item.id)?.join(",") : "" })));
  }

  function getUnpaidFeedbackList(otherProps?: any) {
    const payload = {
      branchId, instituteId, searchString: unpaidReportFilterState.feedbackSearchString, ...unpaidReportFilterState, ...paginationFeedbackRef.current, ...otherProps, isFeedbackProvided: true,
    }
    const params = { ...payload }
    delete payload.stuSearchString;
    delete payload.feedbackSearchString;
    dispatch(getUnpaidFeedbackListAct(generateActionPayload("get_unpaid_list", undefined, { ...payload, searchString: params.feedbackSearchString, classIds: Array.isArray(payload.classIds) ? payload?.classIds?.map((item: any) => item.id)?.join(",") : "" })));
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "sendEmail",
        actionIcon: <HugeiconsIcon icon={Mail01Icon} className="me-2 text-muted" size={18} />,
        actionName: "Send Email",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleSendEmailModal(id, "email", "single");
        },
      },
      {
        id: "sendSms",
        actionIcon: <HugeiconsIcon icon={Message01Icon} className="me-2 text-muted" size={18} />,
        actionName: "Send SMS",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleSendEmailModal(id, "sms", "single");
        },
      },
      {
        id: "sendboth",
        actionIcon: <HugeiconsIcon icon={SentIcon} className="me-2 text-muted" size={18} />,
        actionName: "Send Email & SMS",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleSendEmailModal(id, "both", "single");
        },
      },

    ],
    [stuNotiList]
  );

  function paginationHndlr(paginationInfo: any) {
    paginationStuRef.current = paginationInfo;
    getUnpaidDataList(paginationInfo);
  }
  function paginationFeedbackHndlr(paginationInfo: any) {
    paginationFeedbackRef.current = paginationInfo;
    getUnpaidFeedbackList(paginationInfo);
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: unpaidReportFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const filterHndler = (event: any) => {
    const { name, value } = event.target
    setAllStudentSelectedState(false)
    paginationStuRef.current.pageNo = 0
    paginationFeedbackRef.current.pageNo = 0

    // filters 
    if (name === 'curriculumId') {
      setUnpaidReportFilterState((prevState: any) => ({ ...prevState, [name]: value, classIds: null }));
      if (!value) {
        dispatch(resetBrchClassAct(undefined));
      }
      else {
        getClassApiCall(value)
      }
    }
    else if (name === "academicYearId") {
      setUnpaidReportFilterState((prevState: any) => ({ ...prevState, [name]: value, curriculumId: "", classIds: null }));
      dispatch(resetBrchClassAct(undefined));
      getCurriculumApiCall({ academicYearId: value })
    } else {
      setUnpaidReportFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    }

    // menu id
    const getPayload = (name: string, value: any) => {
      if (name === "academicYearId") {
        return { [name]: value, curriculumId: "", classIds: null };
      } else if (name === "curriculumId") {
        return { [name]: value, classIds: null };
      }
      return { [name]: value };
    };

    const actionFunction = menuId === "studentNotificationDetails" ? getUnpaidDataList : getUnpaidFeedbackList;

    actionFunction(getPayload(name, value));

    const stateChanged = hasStateChanged({ ...unpaidReportFilterState, [name]: value, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange)
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
  }
  function onSelectOptionHandler(selectedOptions: any, config?: any) {
    const { name } = config;
    if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
      setUnpaidReportFilterState((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
    } else {
      setUnpaidReportFilterState((prevState: any) => ({ ...prevState, [name]: null }));
    }

    if (menuId === "studentNotificaionDetails") {
      getUnpaidDataList({ [name]: selectedOptions })
    } else {
      getUnpaidFeedbackList({ [name]: selectedOptions })
    }
  }

  useEffect(() => {

    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      dispatch(resetUnpaidListAct(undefined));
      dispatch(resetUnpaidFeedbackListAct(undefined));
    }
  }, []);

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let { academicYearId } = data.find((year: any) => year.isAdmissionDefault) || {};
      if (academicYearId) {
        getCurriculumApiCall({ academicYearId });
        setUnpaidReportFilterState((prev: any) => ({ ...prev, academicYearId }));
        getUnpaidDataList({ stuSearchString: "", academicYearId })
      }
    }
  }, [academicYearListResp]);

  function getClassApiCall(curriculumId: string) {
    // sortBy: "className", orderBy: "asc"
    const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, academicYearId: unpaidReportFilterState.academicYearId, branchId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const toggleAdvanceFilter = (event?: any) => {
    if (event) {
      event.preventDefault();
    }
    setOpen(prev => !prev);
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    paginationStuRef.current.pageNo = 0;
    paginationFeedbackRef.current.pageNo = 0;
    setUnpaidReportFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    const stateChanged = hasStateChanged({ ...unpaidReportFilterState, ...appliedFilters, academicYearId: "" });
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    setShowClearFilterState(stateChanged?.stateChange)
    setAllStudentSelectedState(false)
    if (menuId === "studentNotificaionDetails") {
      getUnpaidDataList(appliedFilters)
    } else {
      getUnpaidFeedbackList(appliedFilters)
    }
  }

  const searchHndler = (event: any) => {
    const { name, value } = event.target
    setUnpaidReportFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    if (name === "stuSearchString") {
      paginationStuRef.current.pageNo = 0
      getUnpaidDataList({ [name]: value })
    } else {
      paginationFeedbackRef.current.pageNo = 0
      getUnpaidFeedbackList({ [name]: value })
    }
  }

  const toggleSendEmailModal = (id?: any, name?: any, type?: any) => {
    setSendEmailModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
      name: name || "",
      type: type || "",
    }));
  };
  const toggleFullConcessionModal = () => {
    setFullConcessionModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };
  const toggleProtectConcessionModal = () => {
    setProtectConcessionModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };


  const sendEmailModalHndler = () => {
    const smsAndEmail = {
      isSms: (sendEmailModal.name === "sms" || sendEmailModal.name === "both") ? true : false,
      isMail: (sendEmailModal.name === "email" || sendEmailModal.name === "both") ? true : false,
    }
    if (sendEmailModal.type === "single") {
      const payload = {
        studentRegId: sendEmailModal.id || "", ...smsAndEmail
      }
      dispatch(sendEmailSmsUnpaidListAct(generateActionPayload('send_sms_email_unpaid_list', undefined, [payload])))
    } else {
      const payload = stuNotiList?.filter((i: any) => i?.isSelected === true)?.map((i: any) => ({
        studentRegId: i?.studentRegId || "", ...smsAndEmail
      }))
      dispatch(sendEmailSmsUnpaidListAct(generateActionPayload('send_sms_email_unpaid_list', undefined, payload)))
    }
  }

  const singleStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget,
      registrationNumber = event.currentTarget.getAttribute("data-id"),
      studentRowIndex = stuNotiList.findIndex((item: any) => +item.studentRegId === Number(registrationNumber));
    if (studentRowIndex > -1) {
      const studentDetails: any = stuNotiList[studentRowIndex];
      let updateStudentState: any = [...stuNotiList];
      updateStudentState.splice(studentRowIndex, 1, {
        ...studentDetails, isSelected: checked,
      });
      setStuNotiList(updateStudentState);
      const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
      setAllStudentSelectedState(isAllSelected);
    }
  }, [stuNotiList]);

  const allStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    let updateStudentState = [...stuNotiList];
    updateStudentState.forEach((item: any) => {
      item.isSelected = checked;
    });
    setStuNotiList(updateStudentState);
  }, [stuNotiList]);

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      paginationStuRef.current.pageNo = 0;
      paginationFeedbackRef.current.pageNo = 0;
      let { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
      dispatch(resetBrchClassAct(undefined));
      setCount(null)
      setUnpaidReportFilterState({ ...initialValues, academicYearId })
      if (menuId === "studentNotificaionDetails") {
        getUnpaidDataList({ ...initialValues, academicYearId })
      } else {
        getUnpaidFeedbackList({ ...initialValues, academicYearId })
      }
      setShowClearFilterState(false)
    }
  }

  useEffect(() => {
    if (menuId === "studentNotificaionDetails") {
      if (unpaidReportFilterState.academicYearId) {
        paginationStuRef.current.pageNo = 0
        getUnpaidDataList({ stuSearchString: "", feedbackSearchString: "" })
      }
    } else {
      paginationFeedbackRef.current.pageNo = 0
      getUnpaidFeedbackList({ stuSearchString: "", feedbackSearchString: "", })
    }
    setUnpaidReportFilterState((prevState: any) => ({ ...prevState, stuSearchString: "", feedbackSearchString: "", }));
  }, [menuId])

  const roleColumnsStudent = useMemo(() => generateColumnsForStudent(menuOptions, allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState), [stuNotiList]);
  const roleColumnsFeedback = useMemo(() => generateColumnsForFeedback(), []);

  const { data: academicYearList } = academicYearListResp || {};
  const { content: unpaidDataList, totalPages: stuTotalPages, totalElements: stuTotalElements, pageNumber: stuPageNumber } = getUnpaidListStudentResp || {};
  const { content: feedbackDataList, totalPages, totalElements, pageNumber } = getUnpaidFeedbackListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="page-content transportaion_dashboard_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Dashboard" pageTitle="Fee Report" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
            <div className="tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">Unpaid Report</h4>
            </div>
            <div className="tw-p-0">
              <div>
                <div className="tw-inline-block tw-w-full tw-mt-2">
                  <form className="tw-mb-3 tw-mt-2 tw-px-3">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                      <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                        <SelectInput
                          name="academicYearId"
                          value={unpaidReportFilterState.academicYearId}
                          onChange={filterHndler}
                          menuItems={academicYearList || []}
                          valueKey="academicYearId"
                          textKey="academicYearName"
                          formgroupClassName="tw-mb-0"
                          labelText="Academic Year"
                          floatingLabel
                        />
                      </div>
                      <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                        <SelectInput
                          name="curriculumId"
                          value={unpaidReportFilterState?.curriculumId}
                          onChange={filterHndler}
                          menuItems={curriculumTypes}
                          valueKey="branchCurriculumId"
                          textKey="curriculumName"
                          formgroupClassName="tw-mb-0"
                          labelText="Curriculum"
                          floatingLabel
                        />
                      </div>
                      <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                        <MultiSelectCheckbox
                          name="classIds"
                          idKey="id"
                          defaultSelect="Class"
                          value={unpaidReportFilterState?.classIds}
                          renderValue={renderValue}
                          renderOptions={renderOptions}
                          onChange={onSelectOptionHandler}
                          searchKey="shortName"
                          options={classTypes || []}
                        />
                      </div>
                      <div className="tw-col-span-1">
                        <div
                          style={{ backgroundColor: "#F4F7FA" }}
                          onClick={toggleAdvanceFilter}
                          className="tw-p-2 tw-flex tw-items-center tw-border tw-border-transparent tw-rounded tw-cursor-pointer"
                        >
                          <FilterSvg height={"18px"} width={"18px"} />
                          <span className="tw-ms-2 tw-ml-2">Filters</span>
                        </div>
                        <span
                          className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-text-white tw-text-xs tw-px-2 tw-py-0.5 tw-ml-1"
                          style={{
                            marginBottom: "18px",
                            position: "absolute",
                            top: "-9px",
                            left: "78px",
                            background: "#0ab39c",
                          }}
                        >
                          {count}
                        </span>
                      </div>
                      <div className="tw-col-span-auto tw-ml-auto">
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
                  </form>
                </div>
              </div>
            </div>
          </div>

          {getUnpaidListStudentResp && (
            <>
              <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                <div className="tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
                  <div style={{ marginBottom: "-25px", marginTop: "-15px" }}>
                    <ModifiedHorizontalTab
                      MenuOptions={MenuOptions}
                      getActiveMenuId={(menuId: any) => {
                        setMenuId(menuId);
                      }}
                      activeTabId={menuId}
                      horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-auto"
                      labelClass="tw-whitespace-nowrap"
                    />
                  </div>
                </div>
                <div className="tw-p-0">
                  {menuId === "studentNotificaionDetails" && (
                    <div className="tw-inline-block tw-w-full tw-mt-2">
                      <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-3">
                        <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-3">
                          <div className="tw-relative  tw-ml-3 tw-mt-2">
                            <div className="search-box">
                              <TextInput
                                name="stuSearchString"
                                value={unpaidReportFilterState.stuSearchString}
                                onChange={searchHndler}
                                inputClassName="tw-bg-gray-100"
                                formgroupClassName="tw-mb-0"
                                placeHolder="Search..."
                              />
                              <i className="ri-search-line tw-absolute tw-top-1/2 tw-left-3 -tw-translate-y-1/2 tw-text-gray-400"></i>
                            </div>
                          </div>
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-9 xl:tw-col-span-9 tw-flex tw-flex-wrap tw-items-center tw-justify-end unpaid-list-btn tw-mr-3">
                          {stuNotiList?.some((item: any) => item?.isSelected === true) && (
                            <>
                              <button
                                className="tw-border tw-border-gray-300 tw-rounded tw-mr-3 tw-mt-2 tw-px-4 tw-py-2 email-sms-btn tw-cursor-pointer"
                                onClick={() => toggleSendEmailModal("", "email", "multi")}
                              >
                                Send Email
                              </button>
                              <button
                                className="tw-border tw-border-gray-300 tw-rounded tw-mr-3 tw-mt-2 tw-px-4 tw-py-2 email-sms-btn tw-cursor-pointer"
                                onClick={() => toggleSendEmailModal("", "sms", "multi")}
                              >
                                Send SMS
                              </button>
                              <button
                                className="tw-border tw-border-gray-300 tw-rounded tw-mr-3 tw-mt-2 tw-px-4 tw-py-2 email-sms-btn tw-cursor-pointer"
                                onClick={() => toggleSendEmailModal("", "both", "multi")}
                              >
                                Send Email & SMS
                              </button>
                            </>
                          )}
                          <Button
                            className="tw-mr-3 tw-mt-2 tw-px-4 tw-py-2 tw-rounded tw-text-white tw-cursor-pointer"
                            style={{ background: "#5DA1C8", border: "none" }}
                            onClick={() => toggleProtectConcessionModal()}
                          >
                            100% Employee Concession
                          </Button>
                          <Button
                            variant="info"
                            className="tw-mt-2"
                            onClick={() => toggleExportExcelModal()}
                          >
                            Export
                          </Button>
                        </div>
                      </div>
                      <TableContainer
                        columns={roleColumnsStudent || []}
                        data={stuNotiList || []}
                        divClass="tw-overflow-x-auto tw-mb-1"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        showPagination={true}
                        totalPages={stuTotalPages || 0}
                        totalRecords={stuTotalElements || 0}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={stuPageNumber || 0}
                      />
                    </div>
                  )}

                  {menuId === "feedbackReport" && (
                    <div className="tw-inline-block tw-w-full tw-mt-2">
                      <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-3">
                        <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-3">
                          <div className="search-box tw-relative tw-ml-3 tw-mt-2">
                            <TextInput
                              name="feedbackSearchString"
                              value={unpaidReportFilterState.feedbackSearchString}
                              onChange={searchHndler}
                              inputClassName="tw-bg-gray-100"
                              formgroupClassName="tw-mb-0"
                              placeHolder="Search..."
                            />
                            <i className="ri-search-line tw-absolute tw-top-1/2 tw-left-3 tw--translate-y-1/2 tw-text-gray-400"></i>
                          </div>
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-9 xl:tw-col-span-9 tw-flex tw-items-center tw-justify-end tw-mr-3">
                          <Button
                            variant="info"
                            className="tw-mt-2"
                            onClick={() => toggleExportExcelModal()}
                          >
                            Export
                          </Button>
                        </div>
                      </div>
                      <TableContainer
                        columns={roleColumnsFeedback || []}
                        data={feedbackDataList || []}
                        divClass="tw-overflow-x-auto tw-mb-1"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        showPagination={true}
                        totalPages={totalPages || 0}
                        totalRecords={totalElements || 0}
                        callbackPaginationHndlr={paginationFeedbackHndlr}
                        currentPageNumber={pageNumber || 0}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="unpaid-report-advance-filter"
      >
        <AdvanceFilterModal
          getClassApiCall={getClassApiCall}
          appliedFilter={unpaidReportFilterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />

      </OffCanvasContainer>
      <ConfirmationModal
        id="unpaid-report-send-email-modal"
        isOpen={sendEmailModal.showModal}
        confirmMessage={sendEmailModal.name === "email" ? "You want to Send an Email ?" : sendEmailModal.name === "sms" ? "You want to Send an SMS ?" : "You want to Send an Email and SMS ?"}
        cancelHndlr={() => toggleSendEmailModal()}
        confirmHndlr={sendEmailModalHndler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      />
      {/* <ConfirmationModal
            id="unpaid-report-export"
            isOpen={exportExcel.showModal}
            confirmMessage="Are you sure you want Download excel file ?"
            cancelHndlr={()=>toggleExportExcelModal()}
            confirmHndlr={exportExcelHndler}
            isDisble={showApiLoader}
            showImgIcon={true}
            iconType='approve'
            btnClassName='btn w-sm btn-success'
        /> */}
      <ModalContainerUpdated
        id="unpaid-report-export"
        isOpen={exportExcel.showModal}
        toggle={toggleExportExcelModal}
        modalTitle={menuId === "studentNotificaionDetails" ? 'Export Student Notification Data' :
          'Export Feeback Report Data'}
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcel.showModal}
          toggle={toggleExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="admission"
          subFeature="unpaid_report"
          remarksText={menuId === "studentNotificaionDetails" ? 'Enter remarks to export student notification data?' :
            'Enter remarks to export feedback report data?'}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="exam-subject"
        isOpen={fullConcessionModalState.showModal}
        toggle={toggleFullConcessionModal}
        modalTitle="Create 100% Employee Concession"
        modalSize="md"
      >
        <FullEmployeeConcessionModal
          branchId={branchId}
          toggle={toggleFullConcessionModal}
          modalDetails={fullConcessionModalState}
          academicYearId={unpaidReportFilterState?.academicYearId}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="protect-full-concession-modal"
        isOpen={protectConcessionModalState.showModal}
        toggle={toggleProtectConcessionModal}
        modalTitle="Create 100% Employee Concession"
        modalSize="md"
      >
        <ProtectConcessionModal
          toggle={toggleProtectConcessionModal}
          submitHndlr={toggleFullConcessionModal}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default UnpaidReport;
