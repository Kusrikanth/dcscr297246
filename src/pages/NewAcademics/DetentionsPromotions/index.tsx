import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { SelectInput, TextInput, ModalContainerUpdated, ConfirmationModal } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  DetectionPromotionFilterhProps,
  DetectionPromotionModalType,
} from "./DetectionPromotionTypes";
import {
  generateColumns, hasStateChanged,
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import DetectionPromotionModal from "./DetectionPromotionModal";
import DetecPromoApproModal from "./DetecPromoApproModal";
import ApproChangeCampusModal from "./ApproChangeCampusModal";
import RejectChangeCampusModal from "./RejectChangeCampusModal";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { resetCurriculumStudentList } from "../../../store/academic/classroomManagment/classroommanagmentslice";
import { exportDetentionPromotionAct, getDetentionPromotionStudentList } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { toast } from "react-toastify";
import ViewLedgersModal from "./ViewLedgers";
import { IPaginationState } from "../../../Components/Common/Pagination";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle03StrokeStandard, Notebook01StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";
const initialValues: DetectionPromotionFilterhProps = {
  studentName: "",
  academicYearId: "",
  curriculumId: "",
  fromClassId: "",
  pageNo: 0,
  pageSize: 10
};

const DetentionsPromotions = () => {
  const [detentionPromotionFilterState, setDetentionPromotionFilterState] =
    useState<DetectionPromotionFilterhProps>(initialValues);
  const dispatch = useDispatch();
  const [detectionPromotionModalState, setDetectionPromotionModalState] =
    useState<DetectionPromotionModalType>({
      showModal: false,
      branchId: "",
    });
  const [viewLedgerModalState, setViewLedgerModalState] =
    useState({
      showModal: false,
      detentionId: "",
      modalData: undefined
    });

  const [detecPromoApproModalState, setDetecPromoApproModalState] =
    useState<any>({
      showModal: false,
      requestType: "",
      studentDetails: undefined,

    });
  const [rejectChangeCampusModalState, setRejectChangeCampusModalState] =
    useState<any>({
      showModal: false,
      branchId: "",
      studentDetails: undefined
    });

  const [approChangeCampusModalState, setApproChangeCampusModalState] =
    useState<any>({
      showModal: false,
      branchId: "",
      studentDetails: undefined
    });

  const [exportExcel, setExportExcel] = useState<any>({
    showModal: false,
    id: undefined
  })
  const [showClearFilterState, setShowClearFilterState] = useState(false);

  const toggleDetectionPromotionModal = () => {
    setDetectionPromotionModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const toggleDetectPromoApproModal = (studentDetails?: any, reqType?: any) => {
    setDetecPromoApproModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      studentDetails: studentDetails,
      reqType: reqType
    }));
  };
  const toggleRejectChangeCampusModal = (studentDetails?: any) => {
    setRejectChangeCampusModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      studentDetails: studentDetails
    }));
  };

  const toggleApproChangeCampusModal = (studentDetails?: any) => {
    setApproChangeCampusModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      studentDetails: studentDetails
    }));
  };

  const getDetentionPromotionStudents = (otherProps?: any) => {

    const { academicYearId, curriculumId, fromClassId, studentName, pageNo, pageSize } = detentionPromotionFilterState;
    const params = { branchId, academicYearId: academicYearId, curriculumId: curriculumId, fromClassId: fromClassId, studentName: studentName, pageNo: pageNo, pageSize: pageSize, ...otherProps }
    if (params.academicYearId) {
      dispatch(getDetentionPromotionStudentList(generateActionPayload('promotion_detention_students', undefined, params)))
    }

  }

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, detentionPromotionStudends, setPromoteOrDetaineStudent, approvalPromotionDetentionReq, showApiLoader, exportDetentionPromotionResp, classroomManagmentErrorResp }: any =
    useAppSelector(
      ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, globalData }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        academicYearListResp: instAcademics.academicYearListResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
        detentionPromotionStudends: classroomManagmentInfo.detentionPromotionStudends,
        setPromoteOrDetaineStudent: classroomManagmentInfo.setPromoteOrDetaineStudent,
        approvalPromotionDetentionReq: classroomManagmentInfo.approvalPromotionDetentionReq,
        exportDetentionPromotionResp: classroomManagmentInfo.exportDetentionPromotionResp,
        showApiLoader: globalData.showApiLoader,
        classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
      }),
      shallowEqual
    );

  function viewStudentLedgerHndlr(event: any) {
    const detentionId = event.currentTarget.getAttribute("data-id"),
      modalData = detentionPromotionStudends?.content?.find((item: any) => item.studentId === Number(detentionId));
    // if (modalData) {
    setViewLedgerModalState((prev: any) => ({
      ...prev,
      detentionId,
      showModal: true,
      modalData: modalData
    }))
    // }
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "view",
        actionIcon: <HugeiconsIcon icon={Notebook01StrokeStandard} className="me-2 text-muted" size={18} />,
        actionName: "View Ledger",
        onClickHndlr: viewStudentLedgerHndlr
      },
      {
        id: "approve",
        actionIcon: <HugeiconsIcon icon={CheckmarkCircle03StrokeStandard} className="me-2 text-success" size={18} />,
        actionName: "Approve",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          let student = detentionPromotionStudends && detentionPromotionStudends.content.find((student: any) => student.studentId === +id)
          toggleDetectPromoApproModal(student, "Approve");
        },
      },
      {
        id: "reject",
        actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="me-2 text-danger" size={18} />,
        actionName: "Reject",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          let student = detentionPromotionStudends && detentionPromotionStudends.content.find((student: any) => student.studentId === +id)
          toggleDetectPromoApproModal(student, "Reject");
        },
      },
    ],
    [detentionPromotionStudends]
  );


  function downloadExcelFile(blobStream: any) {

    const url = window.URL.createObjectURL(new Blob([(blobStream)]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'academics_promotions_detentions_students.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const detentionPromotionRef = useRef<any>({
    prevSetPromoteOrDetaineStudent: setPromoteOrDetaineStudent,
    prevApprovalPromotionDetentionReq: approvalPromotionDetentionReq,
    prevExportDetentionPromotionResp: exportDetentionPromotionResp,
    prevClassroomManagmentErrorResp: classroomManagmentErrorResp,
  })

  useEffect(() => {
    const { prevSetPromoteOrDetaineStudent, prevApprovalPromotionDetentionReq, prevExportDetentionPromotionResp, prevClassroomManagmentErrorResp } = detentionPromotionRef.current;
    if (setPromoteOrDetaineStudent && setPromoteOrDetaineStudent !== prevSetPromoteOrDetaineStudent) {
      toast.success("Student Promoted Successfully.");
      toggleDetectionPromotionModal();
    }
    else if (exportDetentionPromotionResp && exportDetentionPromotionResp !== prevExportDetentionPromotionResp) {
      toast.success("Promotions and Detentions List Exported Successfully.");
      downloadExcelFile(exportDetentionPromotionResp)
      toggleExportExcelModal();
    }
    else if (approvalPromotionDetentionReq && approvalPromotionDetentionReq !== prevApprovalPromotionDetentionReq) {
      toast.success(`Student ${detecPromoApproModalState.reqType === "Approve" ? "Approved" : "Rejected"} Successfully.`);
      toggleDetectPromoApproModal();
      getDetentionPromotionStudents();
    }
    else if (classroomManagmentErrorResp && classroomManagmentErrorResp !== prevClassroomManagmentErrorResp) {
      const { details } = classroomManagmentErrorResp || {};
      toast.error(details);
    }

    detentionPromotionRef.current.prevSetPromoteOrDetaineStudent = setPromoteOrDetaineStudent;
    detentionPromotionRef.current.prevExportDetentionPromotionResp = exportDetentionPromotionResp;
    detentionPromotionRef.current.prevApprovalPromotionDetentionReq = approvalPromotionDetentionReq;
    detentionPromotionRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;
  }, [setPromoteOrDetaineStudent, approvalPromotionDetentionReq, exportDetentionPromotionResp, classroomManagmentErrorResp])


  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: detentionPromotionFilterState?.academicYearId, curriculumId: detentionPromotionFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: detentionPromotionFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  useEffect(() => {
    return () => {
      dispatch(resetCurriculumStudentList(undefined));
    }
  }, [])

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    setDetentionPromotionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    getDetentionPromotionStudents({ academicYearId: yearId })
    getCurriculumApiCall({ academicYearId: yearId })
  }, [academicYearListResp])

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    if (Array.isArray(data) && data.length > 0) {
      // const payload = { branchId: branchId, curriculumId: data[0].branchCurriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      // setDetentionPromotionFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
    }
  }, [brchCurriculumResp])
  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0) {
      // setDetentionPromotionFilterState((prev: any) => ({ ...prev, fromClassId: content[0].id }));
      // const payload = { branchId: branchId, academicYearId: promoteStudentFilterState.academicYearId, branchCurriculumId: promoteStudentFilterState.curriculumId, classId: content[0].classId, pageNo: 0, pageSize: 100 };
      // getDetentionPromotionStudents({ fromClassId: content[0].id })
    }
  }, [branchClassResp])

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      getDetentionPromotionStudents({ academicYearId: value, fromClassId: null, curriculumId: "" })
      setDetentionPromotionFilterState((prev: any) => ({ ...prev, [name]: value, fromClassId: null, curriculumId: "" }))
    }
    else if (name === "curriculumId") {
      if (!value) {
        dispatch(resetBrchClassAct(undefined));
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: detentionPromotionFilterState.academicYearId });
        setDetentionPromotionFilterState(prev => ({ ...prev, [name]: value }));
        getDetentionPromotionStudents({ [name]: value });

      }
    }
    else {
      getDetentionPromotionStudents({ [name]: value });
      setDetentionPromotionFilterState((prev: any) => ({ ...prev, [name]: value }))
    }
    const stateChanged = hasStateChanged({ ...detentionPromotionFilterState, [name]: value, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange)
  }

  const toggleViewLedgerModalHndlr = useCallback(() => {
    setViewLedgerModalState((prev: any) => ({
      ...prev,
      showModal: false,
      detentionId: undefined,
      modalData: undefined
    }))
  }, [detentionPromotionStudends]);

  const toggleExportExcelModal = () => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    setDetentionPromotionFilterState((pre: any) => ({ ...pre, pageNo: paginationInfo.pageNo, pageSize: paginationInfo.pageSize }));
    getDetentionPromotionStudents(paginationInfo);
  }

  const exportExcelHndler = () => {
    const { pageNo, pageSize, academicYearId, curriculumId, fromClassId, studentName, ...payloadWithoutPageInfo } = detentionPromotionFilterState;
    const payload = {
      academicYearId, curriculumId, classId: fromClassId, searchString: studentName,
    }
    dispatch(exportDetentionPromotionAct(generateActionPayload("export_detention_promotion_list", undefined, { ...payload, branchId }, {
      responseType: 'blob'
    })));
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      let academicYearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      dispatch(resetBrchClassAct(undefined));
      setDetentionPromotionFilterState({ ...initialValues, academicYearId, pageNo: 0, pageSize: 10 })
      getDetentionPromotionStudents({ ...initialValues, academicYearId, pageNo: 0, pageSize: 10 })
      setShowClearFilterState(false)
      getCurriculumApiCall({ academicYearId: academicYearId })
    }
  }


  const roleColumns = useMemo(() => generateColumns(menuOptions), [detentionPromotionStudends]);
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  const { content: studentList, totalPages, totalElements, pageable, } = detentionPromotionStudends || [];
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Detentions Or Promotions" pageTitle="Academics" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">
            <div className="tw-border-b tw-px-6 tw-py-4">
              <div className="tw-flex tw-flex-col md:tw-flex-row tw-items-start md:tw-items-center tw-justify-between tw-gap-4">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Detentions Or Promotions
                </h4>
                <div className="tw-flex tw-gap-3">
                  <Button
                    type="button"
                    variant="info"
                    className="tw-flex tw-items-center tw-gap-1"
                    onClick={toggleExportExcelModal}
                  >
                    <i className="ri-download-line tw-mr-2"></i>
                    Export
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="tw-flex tw-items-center tw-gap-1"
                    onClick={toggleDetectionPromotionModal}
                  >
                    <i className="ri-add-line tw-mr-2"></i>
                    Add Request
                  </Button>
                </div>
              </div>
            </div>
            <div className="tw-px-4 tw-py-4">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12 md:tw-col-span-3 search-box">
                  <TextInput
                    name="studentName"
                    value={detentionPromotionFilterState.studentName}
                    onChange={filterHandler}
                    // inputClassName="bg-light"
                    formgroupClassName="tw-mb-0"
                    placeHolder="Search"
                    labelText="Search"
                    floatingLabel
                  />
                  <i className="ri-search-line search-icon"></i>
                </div>
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={detentionPromotionFilterState.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-0"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <SelectInput
                    name="curriculumId"
                    value={detentionPromotionFilterState.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <SelectInput
                    name="fromClassId"
                    value={detentionPromotionFilterState.fromClassId}
                    onChange={filterHandler}
                    menuItems={classTypes}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="tw-mb-0"
                    labelText="Class"
                    floatingLabel
                  />
                </div>
                {showClearFilterState && (
                  <div className="tw-col-span-12 md:tw-col-span-3 tw-flex tw-justify-end tw-items-end">
                    <Button
                      type="button"
                      variant="wrong"
                      onClick={clearFilterHndlr}
                    >
                      Clear Filter
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="tw-mb-6">
              <TableContainer
                columns={roleColumns || []}
                data={studentList || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="detensions-or-promotions"
        isOpen={detectionPromotionModalState.showModal}
        toggle={toggleDetectionPromotionModal}
        modalTitle="Detentions Or Promotions"
        modalSize="md"
      >
        <DetectionPromotionModal
          isOpen={detectionPromotionModalState.showModal}
          toggle={toggleDetectionPromotionModal}
          modalTitle="Detections Or Promotions"
          instituteId={instituteId}
          instituteName={"Detections Or Promotions"}
          branchId={detectionPromotionModalState.branchId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="detensions-or-promotions-approve-modal"
        isOpen={detecPromoApproModalState.showModal}
        toggle={toggleDetectPromoApproModal}
        modalTitle="Detections Or Promotions Approvals"
        modalSize="md"
      >
        <DetecPromoApproModal
          isOpen={detecPromoApproModalState.showModal}
          toggle={toggleDetectPromoApproModal}
          modalTitle="Detections Or Promotions Approvals"
          instituteId={instituteId}
          instituteName={"Detections Or Promotions Approvals"}
          branchId={detecPromoApproModalState.branchId}
          // submitHandler={toggleApproChangeCampusModal}
          // cancelHandler={toggleRejectChangeCampusModal}
          editBranchDetails={""}
          studentDetails={detecPromoApproModalState.studentDetails}
          submitText={detecPromoApproModalState.reqType}
        />
      </ModalContainerUpdated>

      <ApproChangeCampusModal
        isOpen={approChangeCampusModalState.showModal}
        toggle={toggleApproChangeCampusModal}
        modalTitle=""
        instituteId={instituteId}
        instituteName={"Detections Or Promotions Approvals"}
        branchId={approChangeCampusModalState.branchId}
        editBranchDetails={""}
        studentDetails={approChangeCampusModalState.studentDetails}

      />
      <RejectChangeCampusModal
        isOpen={rejectChangeCampusModalState.showModal}
        toggle={toggleRejectChangeCampusModal}
        modalTitle=""
        instituteId={instituteId}
        instituteName={""}
        branchId={rejectChangeCampusModalState.branchId}
        editBranchDetails={""}
        studentDetails={rejectChangeCampusModalState.studentDetails}
      />

      <ModalContainerUpdated
        id="add-specialfee-modal"
        isOpen={viewLedgerModalState.showModal}
        toggle={toggleViewLedgerModalHndlr}
        modalTitle="Ledger Details"
        modalSize="xl"
      >
        <ViewLedgersModal
          toggle={toggleViewLedgerModalHndlr}
          detentionId={viewLedgerModalState.detentionId}
          ledgerDetails={viewLedgerModalState.modalData}
          dispatch={dispatch}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="detensions-or-promotions-export"
        isOpen={exportExcel.showModal}
        toggle={toggleExportExcelModal}
        modalTitle="Export Detention Or Promotion Students Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcel.showModal}
          toggle={toggleExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="academic"
          subFeature="detention_or_promotion"
          remarksText="Enter remarks to export detention or promotion students data?"
        />
      </ModalContainerUpdated>
      {/* <ToastContainer/> */}
    </>
  );
};

export default DetentionsPromotions;
