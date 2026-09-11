
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, DropDownToggle, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  generateColumns, concessionType
} from "./helper";
import { useHistory } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { deleteStuConcessionListV2Act, exportStuConcessionV2Act, getStuConcessionListV2Act } from "../../../store/fee/feeconcessions/feeconcessionactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { toast } from "react-toastify";
import { default as EyeSvg } from "../../../assets/imagesdps/academics/EyeSvg.svg?react";
import { downloadExcelFile } from "../../../utility/commonutility";
import { useModal } from "../../../hooks/modalhook";
import UploadExcelModal from "./UploadExcelModal";
import ViewDocumentModal from "./ViewDocumentModal";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { UncontrolledTooltip } from "reactstrap";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02StrokeStandard, EyeIcon, FileUploadIcon, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { getFeeConcessionTypeListAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import Button from "../../../Components/Common/Button";
const initialValues = {
  studentName: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  concessionType: "",
};

const StudentConcessionV2 = () => {
  const history = useHistory();

  const { closeModal: closeDelStuConceModal, modalState: delStuConceModalState, openModal: openDelStuConceModal } = useModal()
  const { closeModal: closeExportConfirmationModal, modalState: exportConfirmationModalState, openModal: openExportConfirmationModal } = useModal()
  const { closeModal: closeBulkUploadModal, modalState: bulkUploadModalState, openModal: openBulkUploadModal } = useModal()
  const { closeModal: closeViewDocumentModal, modalState: viewDocumentModalState, openModal: openViewDocumentModal } = useModal()

  const dispatch = useAppDispatch();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const moveToNewStudentConcessionHandler = (id?: any) => {
    history.push("/academic-concessions/create-concession", { id: id, fromComponent: 'Student Concession' });
  };

  const studentConcessionList = (otherProps?: any) => {

    let payload = {
      studentId: null,
      ...studentConcessionFilterState,
      branchId: branchId,
      ...otherProps
    };
    if (payload.academicYearId) {
      if (!payload.concessionType) {
        delete payload.concessionType;
      }
      dispatch(getStuConcessionListV2Act(generateActionPayload('stu_concession_list_v2', { ...pagination.current }, payload)))
    }
  }


  function getFeeConcessionTypeApiCall(otherProps?: any) {
    const payload = {
      branchId,
      pageNo: 0,
      pageSize: 200
    };
    dispatch(getFeeConcessionTypeListAct(generateActionPayload("get_fee_concession_type", undefined, payload)));
  }

  const [studentConcessionFilterState, setStudentConcessionFilterState] = useState(initialValues);

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    getStuConcessionListV2Resp,
    feeConcessionErrorState,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    deleteStuConcessionListV2Resp,
    downloadStaticHealthResp,
    bulkUploadConcessionResp,
    exportStuConcessionV2Resp,
    bulkUploadConcessionV2Resp,
    showApiLoader,
    loggedInUserRole,
    blukUploadConcessionErrorV2Resp,
    getFeeConcessionTypeListResp
  } = useAppSelector(
    ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, appData, feeConcession, masterFeeSettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getStuConcessionListV2Resp: feeConcession.getStuConcessionListV2Resp,
      bulkUploadConcessionResp: feeConcession.bulkUploadConcessionResp,
      feeConcessionErrorState: feeConcession.feeConcessionErrorState,
      deleteStuConcessionListV2Resp: feeConcession.deleteStuConcessionListV2Resp,
      exportStuConcessionV2Resp: feeConcession.exportStuConcessionV2Resp,
      bulkUploadConcessionV2Resp: feeConcession.bulkUploadConcessionV2Resp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      loggedInUserRole: appData.loggedInUserRole,
      showApiLoader: globalData.showApiLoader,
      downloadStaticHealthResp: classroomManagmentInfo.downloadStaticHealthResp,
      blukUploadConcessionErrorV2Resp: feeConcession.blukUploadConcessionErrorV2Resp,
      getFeeConcessionTypeListResp: masterFeeSettings.getFeeConcessionTypeListResp,

    }),
    shallowEqual
  );

  const canCreateAndUpdate = useMemo(() => {
    return (loggedInUserRole !== 'HR')
  }, [loggedInUserRole]);


  const menuOptions = useMemo(
    () => {
      const menus = [
        {
          id: "edit",
          actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
          actionName: "Edit",
          onClickHndlr: (event: any) => {
            const id = event.currentTarget.getAttribute("data-id");

            moveToNewStudentConcessionHandler(id);
          },
        },
        {
          id: "delete",
          actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
          actionName: "Delete",
          onClickHndlr: (event: any) => {
            const concessionId = event.currentTarget.getAttribute('data-id');
            openDelStuConceModal(concessionId);
          },
        },
        {
          id: "view",
          actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
          actionName: "View Documents",
          onClickHndlr: (event: any) => {
            const id = event.currentTarget.getAttribute("data-id");
            const findData = getStuConcessionListV2Resp?.data?.find((item: any) => +item.id === +id);
            if (findData) {
              openViewDocumentModal(findData?.fileInfo)
            }
          },
        },
      ]
      if (canCreateAndUpdate) {
        return menus;
      }
      return menus.filter(item => item.id !== 'edit' && item.id !== 'delete')
    },
    [getStuConcessionListV2Resp, canCreateAndUpdate]
  );

  const dropDownOption = useMemo(() => [
    {
      id: "create-bulk-concession",
      actionName: "Create Bulk Concession",
      actionIcon: <HugeiconsIcon icon={FileUploadIcon} className="me-2 text-muted" size={16} />,
      onClickHndlr: () => {
        openBulkUploadModal()
      }
    },
    {
      id: "create-single-concession",
      actionName: "Create Single Concession",
      actionIcon: <HugeiconsIcon icon={Add01Icon} className="me-2 text-muted" size={16} />,
      onClickHndlr: () => {
        moveToNewStudentConcessionHandler()
      }
    },
  ], [])

  useEffect(() => {
    getFeeConcessionTypeApiCall();
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setStudentConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    studentConcessionList({ academicYearId: yearId })
    getCurriculumApiCall({ academicYearId: yearId })
  }, [academicYearListResp]);

  const StudentConcessionRef = useRef({
    prevFeeConcessionErrorState: feeConcessionErrorState,
    prevDeleteStuConcessionListV2Resp: deleteStuConcessionListV2Resp,
    prevBulkUploadConcessionResp: bulkUploadConcessionResp,
    prevDownloadStaticHealthResp: downloadStaticHealthResp,
    prevExportStuConcessionV2Resp: exportStuConcessionV2Resp,
    prevBulkUploadConcessionV2Resp: bulkUploadConcessionV2Resp,
    prevBlukUploadConcessionErrorV2Resp: blukUploadConcessionErrorV2Resp
  })

  useEffect(() => {
    const { prevFeeConcessionErrorState, prevDeleteStuConcessionListV2Resp, prevDownloadStaticHealthResp, prevBulkUploadConcessionResp, prevExportStuConcessionV2Resp, prevBulkUploadConcessionV2Resp, prevBlukUploadConcessionErrorV2Resp } = StudentConcessionRef.current || {};
    if (feeConcessionErrorState && feeConcessionErrorState !== prevFeeConcessionErrorState) {
      const { details } = feeConcessionErrorState || {}
      toast.error(details);
    }
    else if (blukUploadConcessionErrorV2Resp && blukUploadConcessionErrorV2Resp !== prevBlukUploadConcessionErrorV2Resp) {
      const { details } = blukUploadConcessionErrorV2Resp || {}
      toast.error(details);
    }
    else if (deleteStuConcessionListV2Resp && deleteStuConcessionListV2Resp !== prevDeleteStuConcessionListV2Resp) {
      toast.success("Academic Concession Deleted Successfully.");
      closeDelStuConceModal();
      studentConcessionList();
    }
    else if (bulkUploadConcessionResp && bulkUploadConcessionResp !== prevBulkUploadConcessionResp) {
      toast.success("Bulk Concession Added Successfully.");
      closeBulkUploadModal();
      studentConcessionList();
    }
    else if (downloadStaticHealthResp && downloadStaticHealthResp !== prevDownloadStaticHealthResp) {
      const { systemFile } = downloadStaticHealthResp,
        { s3URL } = systemFile || {};
      if (s3URL) {
        const url = s3URL || ""
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'concession_template.xlsx');
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        toast.error('Download url for health form is not found.');
      }
    }
    else if (bulkUploadConcessionV2Resp && bulkUploadConcessionV2Resp !== prevBulkUploadConcessionV2Resp) {
      toast.success("Bulk Concession Added Successfully.");
      closeBulkUploadModal();
      studentConcessionList();
    }
    else if (exportStuConcessionV2Resp && exportStuConcessionV2Resp !== prevExportStuConcessionV2Resp) {
      downloadExcelFile(exportStuConcessionV2Resp, "Academic_Concession_List")
      toast.success("Academic Concession List Downloaded Successfully.")
      closeExportConfirmationModal();
    }

    StudentConcessionRef.current.prevFeeConcessionErrorState = feeConcessionErrorState;
    StudentConcessionRef.current.prevDeleteStuConcessionListV2Resp = deleteStuConcessionListV2Resp;
    StudentConcessionRef.current.prevDownloadStaticHealthResp = downloadStaticHealthResp
    StudentConcessionRef.current.prevBulkUploadConcessionResp = bulkUploadConcessionResp
    StudentConcessionRef.current.prevExportStuConcessionV2Resp = exportStuConcessionV2Resp
    StudentConcessionRef.current.prevBulkUploadConcessionV2Resp = bulkUploadConcessionV2Resp,
      StudentConcessionRef.current.prevBlukUploadConcessionErrorV2Resp = blukUploadConcessionErrorV2Resp
  }, [feeConcessionErrorState, deleteStuConcessionListV2Resp, downloadStaticHealthResp, bulkUploadConcessionResp, bulkUploadConcessionV2Resp, exportStuConcessionV2Resp, blukUploadConcessionErrorV2Resp])

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === 'academicYearId') {
      setStudentConcessionFilterState((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: "",
        classId: ""
      }));
      studentConcessionList({ [name]: value, curriculumId: "", classId: "" });
      if (value) {
        getCurriculumApiCall({ academicYearId: value });
        dispatch(resetBrchClassAct(undefined));
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
      }
    }
    else if (name === 'curriculumId') {
      setStudentConcessionFilterState((prev: any) => ({
        ...prev,
        [name]: value,
        classId: "",
      }));
      studentConcessionList({ curriculumId: value, classId: "" });
      if (value) {
        const payload = { academicYearId: studentConcessionFilterState.academicYearId, branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      } else {
        dispatch(resetBrchClassAct(undefined));
      }
    }
    else if (name === "academicYearId") {
      if (value) {
        studentConcessionList({ academicYearId: value });
        setStudentConcessionFilterState((prev: any) => ({
          ...prev,
          [name]: value
        }));
      } else {
        dispatch(resetBrchClassAct(undefined));
        setStudentConcessionFilterState((prev: any) => ({
          ...prev,
          classId: "",
          curriculumId: ""
        }));
      }
    }
    else {
      setStudentConcessionFilterState((prev: any) => ({
        ...prev,
        [name]: value
      }));
      studentConcessionList({ [name]: value });
    }


  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: studentConcessionFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function delModalSubmitHndlr() {
    const { modalData } = delStuConceModalState;
    dispatch(deleteStuConcessionListV2Act(generateActionPayload("delete_stu_concession_v2", { concessionId: modalData })));
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    studentConcessionList()
  }

  const exportModalHndler = () => {
    let payload = {
      ...studentConcessionFilterState,
      branchId: branchId,
    };
    dispatch(exportStuConcessionV2Act(generateActionPayload('export_stu_concession_v2', undefined, { ...payload }, {
      responseType: 'blob'
    })))
  }

  const roleColumns = useMemo(() => generateColumns(menuOptions), [getStuConcessionListV2Resp]);

  const { data: academicYearList } = academicYearListResp || {};
  const { data: StudentConcessionData, pageNumber, totalPages, totalElements } = getStuConcessionListV2Resp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Student Concessions" pageTitle="Fee" pageTitleName="Academic Concession" />

          <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Academic Concessions Details
                </h4>

                <div className="tw-flex tw-items-center tw-gap-2">
                  {canCreateAndUpdate && <DropDownToggle
                    id="student-concession-dropdown"
                    menuOptions={dropDownOption}
                    btnName="Add New"
                  />}

                  <Button
                    id="export-btn"
                    onClick={openExportConfirmationModal}
                    variant="exportBtn"
                  >
                    <img src={ExportIcon} className="tw-h-full tw-w-full" />
                  </Button>

                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </div>
              </div>
            </div>

            <div className="tw-p-4">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="search-box">
                    <TextInput
                      name="studentName"
                      value={studentConcessionFilterState.studentName}
                      onChange={filterHandler}
                      inputClassName="tw-bg-gray-100"
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search"
                      labelText="Search"
                      floatingLabel
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={studentConcessionFilterState.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic Year"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="curriculumId"
                    value={studentConcessionFilterState.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="classId"
                    value={studentConcessionFilterState.classId}
                    onChange={filterHandler}
                    menuItems={classTypes || []}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="concessionType"
                    value={studentConcessionFilterState.concessionType}
                    onChange={filterHandler}
                    menuItems={getFeeConcessionTypeListResp?.data || []}
                    valueKey="concessionTypeName"
                    textKey="concessionTypeName"
                    labelText="Concession Type"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>
              </div>
            </div>

            <TableContainer
              columns={roleColumns || []}
              data={StudentConcessionData || []}
              divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
              showPagination
              totalPages={totalPages}
              totalRecords={totalElements}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageNumber}
            />
          </div>
        </div>
      </div>
      <ConfirmationModal
        id="delete-slabs-list-modal"
        isOpen={delStuConceModalState.showModal}
        confirmMessage="Are you sure you want to delete this Concession ?"
        cancelHndlr={closeDelStuConceModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
      <ModalContainerUpdated
        id="bulk-upload-modal"
        isOpen={bulkUploadModalState.showModal}
        toggle={closeBulkUploadModal}
        modalTitle="Bulk Upload Modal"
        modalSize="md"
      >
        <UploadExcelModal
          toggle={closeBulkUploadModal}
          academicYearId={studentConcessionFilterState.academicYearId}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="view-document-modal"
        isOpen={viewDocumentModalState.showModal}
        toggle={closeViewDocumentModal}
        modalTitle="Documnets"
        modalSize="md"
      >
        <ViewDocumentModal
          toggle={closeViewDocumentModal}
          data={viewDocumentModalState.modalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="student-concession-export-modal"
        isOpen={exportConfirmationModalState.showModal}
        toggle={closeExportConfirmationModal}
        modalTitle="Export Academic Concession Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportConfirmationModalState.showModal}
          toggle={closeExportConfirmationModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportModalHndler}
          feature="fee"
          subFeature="fee_concession"
          remarksText="Enter remarks to export students concession data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default StudentConcessionV2;
