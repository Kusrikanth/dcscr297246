
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, DropDownToggle, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  generateColumns,
} from "./helper";
import { StudentConcessionFilterhProps } from "./studentConcessionsTypes";
import { useHistory } from "react-router-dom";
import { default as DeleteSvg } from "../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { deleteStuConcessionListAct, exportStuConcessionAct, getStudentConcessionListAct } from "../../../store/fee/feeconcessions/feeconcessionactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { downloadStaticHealthFormAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import UploadExcelModal from "./UploadExcelModal";
import { default as EyeSvg } from "../../../assets/imagesdps/academics/EyeSvg.svg?react";
import ViewDocumentModal from "./ViewDocumentModal";
import ExportModal from "../../Directory/StudentManagement/ExportModal";

const initialValues: StudentConcessionFilterhProps = {
  studentName: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  type: "",
};

const StudentConcessions = () => {
  const history = useHistory();

  const [delStuConceState, setDelStuConceState] = useState<any>({
    showModal: false,
    concessionId: ""
  })

  const dispatch = useDispatch();

  const pagination: any = useRef<any>({
    pageNo: 0,
    pageSize: 10
  })

  const [bulkUploadStateModal, setBulkUploadStateModal] =
    useState<any>({
      showModal: false,
      id: null,
    });
  const [viewDocumentModal, setViewDocumentModal] =
    useState<any>({
      showModal: false,
      data: null,
    });
  const [exportConfirmationModal, setExportConfirmationModal] =
    useState<any>({
      showModal: false,
    });

  const moveToNewStudentConcessionHandler = (id?: any) => {
    history.push("/student-concessions/create-concession", { id: id, fromComponent: 'Student Concession' });
  };

  const StudentConcessionList = (paramsProps?: any, otherProps?: any) => {
    const { academicYearId, curriculumId, classId, type, studentName } = studentConcessionFilterState;
    const params = { ...paramsProps, ...pagination.current }
    let payload = {
      studentId: null,
      academicYearId: academicYearId,
      curriculumId: curriculumId,
      classId: classId,
      studentName: studentName,
      // concessionType: "ACADEMIC",
      branchId: branchId,
      ...otherProps
    };
    if (payload.academicYearId) {
      dispatch(getStudentConcessionListAct(generateActionPayload('student_concession_list', params, payload)))
    }
  }

  const [studentConcessionFilterState, setStudentConcessionFilterState] =
    useState<StudentConcessionFilterhProps>(initialValues);

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    studentConcessionList,
    classroomManagmentErrorResp,
    feeConcessionErrorState,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    deleteStuConcessionListResp,
    downloadStaticHealthResp,
    bulkUploadConcessionResp,
    exportStuConcessionResp,
    showApiLoader,
  }: any = useAppSelector(
    ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, appData, feeConcession, feeCollections }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      studentConcessionList: feeConcession.studentConcessionList,
      bulkUploadConcessionResp: feeConcession.bulkUploadConcessionResp,
      feeConcessionErrorState: feeConcession.feeConcessionErrorState,
      deleteStuConcessionListResp: feeConcession.deleteStuConcessionListResp,
      exportStuConcessionResp: feeConcession.exportStuConcessionResp,
      classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      downloadStaticHealthResp: classroomManagmentInfo.downloadStaticHealthResp,
    }),
    shallowEqual
  );

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <EditSvg className="me-2 d-inline-block" color="#878A99" />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");

          moveToNewStudentConcessionHandler(id);
        },
      },
      {
        id: "delete",
        actionIcon: <DeleteSvg className="d-inline-block me-2" />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const concessionId = event.currentTarget.getAttribute('data-id');
          toggleDelConcessionModal(concessionId);
        },
      },
      {
        id: "view",
        actionIcon: <EyeSvg className="d-inline-block me-2" />,
        actionName: "View Documents",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          const findData = studentConcessionList?.data?.find((item: any) => +item.id === +id);
          if (findData) {
            toggleViewDocumentModal(findData?.fileInfo)
          }
        },
      },
    ],
    [studentConcessionList]
  );

  const dropDownOption = useMemo(() => [
    {
      id: "create-bulk-concession",
      actionName: "Create Bulk Concession",
      actionIcon: <i className="ri-file-upload-line me-2" />,
      onClickHndlr: (event: any) => {
        toggleBulkUploadModal()
      }
    },
    {
      id: "create-single-concession",
      actionName: "Create Single Concession",
      actionIcon: <i className="ri-add-line me-2" />,
      onClickHndlr: (event: any) => {
        moveToNewStudentConcessionHandler()
      }
    },
  ], [])

  const roleColumns = useMemo(() => generateColumns(menuOptions), [studentConcessionList]);

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
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
    setStudentConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    StudentConcessionList(undefined, { academicYearId: yearId })
  }, [academicYearListResp]);

  function downloadExcelFile(blobStream: any) {

    const url = window.URL.createObjectURL(new Blob([(blobStream)]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Student_Concession_List.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const StudentConcessionRef = useRef({
    prevFeeConcessionErrorState: feeConcessionErrorState,
    prevDeleteStuConcessionListResp: deleteStuConcessionListResp,
    prevBulkUploadConcessionResp: bulkUploadConcessionResp,
    prevDownloadStaticHealthResp: downloadStaticHealthResp,
    prevExportStuConcessionResp: exportStuConcessionResp,
  })

  useEffect(() => {
    const { prevFeeConcessionErrorState, prevDeleteStuConcessionListResp, prevDownloadStaticHealthResp, prevBulkUploadConcessionResp, prevExportStuConcessionResp } = StudentConcessionRef.current || {};
    if (feeConcessionErrorState && feeConcessionErrorState !== prevFeeConcessionErrorState) {
      const { details } = feeConcessionErrorState || {}
      toast.error(details);
    }
    else if (deleteStuConcessionListResp && deleteStuConcessionListResp !== prevDeleteStuConcessionListResp) {
      toast.success("Student Concession Deleted Successfully.");
      toggleDelConcessionModal();
      StudentConcessionList();
    }
    else if (bulkUploadConcessionResp && bulkUploadConcessionResp !== prevBulkUploadConcessionResp) {
      toast.success("Bulk Concession Added Successfully.");
      toggleBulkUploadModal();
      StudentConcessionList();
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
    } else if (exportStuConcessionResp && exportStuConcessionResp !== prevExportStuConcessionResp) {
      downloadExcelFile(exportStuConcessionResp)
      toast.success("Student Concession List Downloaded Successfully.")
      toggleExportConfirmationModal();
    }

    StudentConcessionRef.current.prevFeeConcessionErrorState = feeConcessionErrorState;
    StudentConcessionRef.current.prevDeleteStuConcessionListResp = deleteStuConcessionListResp;
    StudentConcessionRef.current.prevDownloadStaticHealthResp = downloadStaticHealthResp
    StudentConcessionRef.current.prevBulkUploadConcessionResp = bulkUploadConcessionResp
    StudentConcessionRef.current.prevExportStuConcessionResp = exportStuConcessionResp
  }, [feeConcessionErrorState, deleteStuConcessionListResp, downloadStaticHealthResp, bulkUploadConcessionResp, exportStuConcessionResp])

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    setStudentConcessionFilterState((prev: any) => ({ ...prev, [name]: value }))
    if (name === 'curriculumId') {
      if (value === "") {
        dispatch(resetBrchClassAct(undefined));
        setStudentConcessionFilterState((prev: any) => ({ ...prev, classId: "" }))
      }
      else {
        const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
    }
    StudentConcessionList(undefined, { [name]: value })
  }

  const toggleDelConcessionModal = useCallback((concessionId?: any) => {
    setDelStuConceState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      concessionId: concessionId || "",
    }));
  }, []);

  function delModalSubmitHndlr() {
    const { concessionId } = delStuConceState;
    dispatch(deleteStuConcessionListAct(generateActionPayload("delete_student_concession", { concessionId: concessionId })));
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    StudentConcessionList(paginationInfo)
    // getSectionListResp(paginationInfo);
  }

  const exportModalHndler = () => {
    let payload = {
      ...studentConcessionFilterState,
      branchId: branchId,
    };
    dispatch(exportStuConcessionAct(generateActionPayload('export_stu_concession', undefined, { ...payload }, {
      responseType: 'blob'
    })))
  }

  const downloadHealthForm = () => {

    const payload = {
      formType: "CONCESSION_BULK_UPLOAD",
    }
    dispatch(downloadStaticHealthFormAct(generateActionPayload("download_static_health_form", undefined, payload)));
  }

  const toggleBulkUploadModal = (id?: any) => {
    setBulkUploadStateModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || null,
    }));
  };
  const toggleViewDocumentModal = (data?: any) => {
    setViewDocumentModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      data: data || null,
    }));
  };
  const toggleExportConfirmationModal = () => {
    setExportConfirmationModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const { data: academicYearList } = academicYearListResp || {};
  const { data: StudentConcessionData, pageNumber, totalPages, totalElements } = studentConcessionList || {};
  // const { data: SectionList,totalPages,totalElements,pageNumber } = sectionListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Student Concessions" pageTitle="Fee" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Student Concessions Details
                  </h4>
                </div>
                <div className="col-auto ms-auto d-flex">
                  <div className="d-flex">
                    <DropDownToggle
                      id="student-concession-dropdown"
                      menuOptions={dropDownOption}
                      btnName="Add New"
                      dropDownClassName="me-2"
                    />
                    <button className="btn btn-3 ms-2" style={{ background: "#405189", border: "none" }} onClick={() => toggleExportConfirmationModal()} >
                      <div className="d-flex align-items-center text-white">
                        <span><i className="ri-add-line me-1" /></span>
                        <span>Export</span>
                      </div>
                    </button>
                  </div>

                </div>
              </div>
            </div>

            <div className="card-body">
              {/* <form onSubmit={StudentConcessionFilterForm.handleSubmit}> */}
              <div className="row g-3">
                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="studentName"
                      value={studentConcessionFilterState.studentName}
                      onChange={filterHandler}
                      inputClassName="bg-soft-light"
                      formgroupClassName="mb-0"
                      placeHolder="Search..."
                    />

                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>

                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="academicYearId"
                    value={studentConcessionFilterState.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    // inputClassName="border-0"
                    formgroupClassName="mb-0"
                  // isDisabled={true}
                  />
                </div>

                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={studentConcessionFilterState.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    defaultSelect="Curriculum"
                    // inputClassName="bg-light border-0"
                    formgroupClassName="mb-0"
                  />
                </div>

                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2 col-xxl-1">
                  <SelectInput
                    name="classId"
                    value={studentConcessionFilterState.classId}
                    onChange={filterHandler}
                    menuItems={classTypes || []}
                    valueKey="id"
                    textKey="shortName"
                    defaultSelect="Class"
                    // inputClassName="bg-light border-0"
                    formgroupClassName="mb-0"
                  />
                </div>
                {/* <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                    <SelectInput
                      name="type"
                      value={studentConcessionFilterState.type}
                      onChange={filterHandler}
                      menuItems={TermData}
                      valueKey="value"
                      textKey="type"
                      // inputClassName="bg-light border-0"
                      formgroupClassName="mb-0"
                      defaultSelect="Type"
                    />
                  </div> */}

                {/* <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                    <TextInput
                      name="dateRange"
                      value={StudentConcessionFilterForm.values.dateRange}
                      onChange={StudentConcessionFilterForm.handleChange}
                      inputClassName="bg-light border-0"
                      formgroupClassName="mb-0"
                      placeHolder="Select date range"
                    />
                  </div> */}

                {/* <div className="col-auto ms-auto">
                    <button
                      className="btn button-info float-end d-flex align-items-center"
                      //   onClick={moveToNewFeeReceiptHandler}
                    >
                      Apply Fillters
                    </button>
                  </div> */}
              </div>
              {/* </form> */}
            </div>

            <TableContainer
              columns={roleColumns || []}
              data={StudentConcessionData || []}
              divClass="table-responsive mb-3"
              theadClass="table-light text-muted align-middle"
              // showCheckbox={true}
              showPagination={true}
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
        isOpen={delStuConceState.showModal}
        confirmMessage="Are you sure you want to delete this Concession ?"
        cancelHndlr={toggleDelConcessionModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
      <ModalContainerUpdated
        id="bulk-upload-modal"
        isOpen={bulkUploadStateModal.showModal}
        toggle={() => toggleBulkUploadModal()}
        modalTitle="Bulk Upload Modal"
        // headerClassName="bg-white"
        modalSize="md"
      >
        <UploadExcelModal
          toggle={() => toggleBulkUploadModal()}
          academicYearId={studentConcessionFilterState.academicYearId}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="view-document-modal"
        isOpen={viewDocumentModal.showModal}
        toggle={() => toggleViewDocumentModal()}
        modalTitle="Documnets"
        // headerClassName="bg-white"
        modalSize="md"
      >
        <ViewDocumentModal
          toggle={() => toggleViewDocumentModal()}
          data={viewDocumentModal.data}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="student-concession-export-modal"
        isOpen={exportConfirmationModal.showModal}
        toggle={toggleExportConfirmationModal}
        modalTitle="Export Student Concession Data"
        modalSize="md">
        <ExportModal
          isOpen={exportConfirmationModal.showModal}
          toggle={toggleExportConfirmationModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportModalHndler}
          feature="fee"
          subFeature="student_concession"
          remarksText="Enter remarks to export student concession data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default StudentConcessions;
