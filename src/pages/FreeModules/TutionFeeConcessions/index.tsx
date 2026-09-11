
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteSvg } from "../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { ConfirmationModal, DropDownToggle, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  generateColumns,
} from "./helper";
import { TutionFeeConcessionFilterhProps } from "./tutionFeeConcessionsTypes";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { deleteFeeConcessionListAct, exportTutionFeeConcessionAct, getTutionFeeConcessionListAct } from "../../../store/fee/feeconcessions/feeconcessionactions";
import { toast } from "react-toastify";
import { default as EyeSvg } from "../../../assets/imagesdps/academics/EyeSvg.svg?react";
import ViewDocumentModal from "./ViewDocumentModal";
import UploadExcelModal from "./UploadExcelModal";
import ExportModal from "../../Directory/StudentManagement/ExportModal";

const initialValues: TutionFeeConcessionFilterhProps = {
  studentName: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  dateRange: "",
};

const TutionFeeConcessions = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  const [tutionFeeConcessionFilterState, setTutionFeeConcessionFilterState] =
    useState<TutionFeeConcessionFilterhProps>(initialValues);

  const [delFeeConceState, setDelFeeConceState] = useState<any>({
    showModal: false,
    concessionId: ""
  })
  const [viewDocumentModal, setViewDocumentModal] =
    useState<any>({
      showModal: false,
      data: null,
    });
  const [bulkUploadStateModal, setBulkUploadStateModal] =
    useState<any>({
      showModal: false,
    });

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,

  })
  const sorting = useRef({
    orderBy: "",
    sortBy: ""
  })

  const [exportConfirmationModal, setExportConfirmationModal] =
    useState<any>({
      showModal: false,
    });

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    tutionFeeConcessionList,
    feeSummaryList,
    classroomManagmentErrorResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    bulkUploadConcessionResp,
    downloadStaticHealthResp,
    exportTutionFeeConcessionResp,
    deleteFeeConcessionListResp,
  }: any = useAppSelector(
    ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, appData, feeCollections, feeConcession }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      tutionFeeConcessionList: feeConcession.tutionFeeConcessionList,
      bulkUploadConcessionResp: feeConcession.bulkUploadConcessionResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      deleteFeeConcessionListResp: feeConcession.deleteFeeConcessionListResp,
      exportTutionFeeConcessionResp: feeConcession.exportTutionFeeConcessionResp,
      downloadStaticHealthResp: classroomManagmentInfo.downloadStaticHealthResp,
    }),
    shallowEqual
  );

  const tutionFeeConcessionRef = useRef<any>({
    prevDeleteFeeConcessionListResp: deleteFeeConcessionListResp,
    prevBulkUploadConcessionResp: bulkUploadConcessionResp,
    prevDownloadStaticHealthResp: downloadStaticHealthResp,
    prevExportTutionFeeConcessionResp: exportTutionFeeConcessionResp,
    // prevSendNotifiChangeStuDetailResp: sendNotifiChangeStuDetailResp,
  });

  useEffect(() => {
    const { prevDeleteFeeConcessionListResp, prevDownloadStaticHealthResp, prevBulkUploadConcessionResp, prevExportTutionFeeConcessionResp } = tutionFeeConcessionRef.current;

    if (deleteFeeConcessionListResp && deleteFeeConcessionListResp !== prevDeleteFeeConcessionListResp) {
      toast.success("Tution Fee Concession Deleted Successfully.");
      toggleDelConcessionModal();
      TutionFeeConcessionList();
    }
    else if (bulkUploadConcessionResp && bulkUploadConcessionResp !== prevBulkUploadConcessionResp) {
      toast.success("Bulk Concession Added Successfully.");
      toggleBulkUploadModal();
      TutionFeeConcessionList();
    }
    else if (exportTutionFeeConcessionResp && exportTutionFeeConcessionResp !== prevExportTutionFeeConcessionResp) {
      downloadExcelFile(exportTutionFeeConcessionResp)
      toast.success("Tution Fee Concession List Downloaded Successfully.")
      toggleExportConfirmationModal();
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
      }
      else {
        toast.error('Download url for health form is not found.');
      }
    }
    // if (sendNotifiChangeStuDetailResp && sendNotifiChangeStuDetailResp !== prevSendNotifiChangeStuDetailResp) {
    //     toast.success("Notification Sent Successfully.");
    //     toggleSendNotificationModal();
    // }
    tutionFeeConcessionRef.current.prevDeleteFeeConcessionListResp = deleteFeeConcessionListResp;
    tutionFeeConcessionRef.current.prevDownloadStaticHealthResp = downloadStaticHealthResp
    tutionFeeConcessionRef.current.prevBulkUploadConcessionResp = bulkUploadConcessionResp
    tutionFeeConcessionRef.current.prevExportTutionFeeConcessionResp = exportTutionFeeConcessionResp
    // tutionFeeConcessionRef.current.prevSendNotifiChangeStuDetailResp = sendNotifiChangeStuDetailResp;
  }, [deleteFeeConcessionListResp, downloadStaticHealthResp, bulkUploadConcessionResp, exportTutionFeeConcessionResp]);

  function downloadExcelFile(blobStream: any) {

    const url = window.URL.createObjectURL(new Blob([(blobStream)]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Tution_Fee_Concession_List.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <EditSvg className="me-2 d-inline-block" color="#878A99" />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          toggleFeeDetailsModal(id);
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
          const findData = tutionFeeConcessionList?.data?.find((item: any) => +item.id === +id);
          if (findData) {
            toggleViewDocumentModal(findData?.fileInfo)
          }
        },
      },
    ],
    [tutionFeeConcessionList]
  );

  const toggleDelConcessionModal = useCallback((concessionId?: any) => {
    setDelFeeConceState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      concessionId: concessionId || "",
    }));
  }, []);

  const toggleBulkUploadModal = () => {
    setBulkUploadStateModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
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

  function delModalSubmitHndlr() {
    const { concessionId } = delFeeConceState;
    dispatch(deleteFeeConcessionListAct(generateActionPayload("delete_tutuion_fee_concession", { concessionId: concessionId })));
  }

  const toggleFeeDetailsModal = (concessionId?: any) => {
    history.push("/tution-fee-concessions/create-concession", { concessionId: concessionId, fromComponent: "Tution Fee Concession" });
  };
  const TutionFeeConcessionList = (otherProps?: any) => {
    let payload = { branchId: branchId, studentName: tutionFeeConcessionFilterState.studentName, studentId: "", academicYearId: tutionFeeConcessionFilterState.academicYearId, curriculumId: tutionFeeConcessionFilterState.curriculumId, classId: tutionFeeConcessionFilterState.classId, ...otherProps };
    let params = { ...pagination.current, ...sorting.current }
    dispatch(getTutionFeeConcessionListAct(generateActionPayload('tution_fee_concession', params, payload)))
  }

  const roleColumns = useMemo(() => generateColumns(menuOptions), [tutionFeeConcessionList]);

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
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT").academicYearId
    // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
    setTutionFeeConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }));
    TutionFeeConcessionList({ academicYearId: yearId })
  }, [academicYearListResp]);

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    setTutionFeeConcessionFilterState((prev: any) => ({ ...prev, [name]: value }));
    if (name === 'curriculumId') {
      if (value) {
        const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        // FeeSummaryList({[name]:value})
        TutionFeeConcessionList({ [name]: value })
      }
      else {
        dispatch(resetBrchClassAct(undefined));
        // setStudentConcessionFilterState((prev:any)=>({...prev,classId:""}))
        TutionFeeConcessionList({ [name]: value, classId: "" })
      }
    }
    else {
      TutionFeeConcessionList({ [name]: value })
    }
  }

  const dropDownOption = useMemo(() => [
    {
      id: "create-bulk-concession",
      actionName: "Create Bulk Concession",
      actionIcon: <i className="ri-file-upload-line me-2"></i>,
      onClickHndlr: (event: any) => {
        toggleBulkUploadModal()
      }
    },
    {
      id: "create-single-concession",
      actionName: "Create Single Concession",
      actionIcon: <i className="ri-add-line me-2" />,
      onClickHndlr: (event: any) => {
        toggleFeeDetailsModal()
      }
    },
  ], [])

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    TutionFeeConcessionList(paginationInfo)
  }

  const exportModalHndler = () => {
    let payload = {
      ...tutionFeeConcessionFilterState,
      branchId: branchId,
    };
    dispatch(exportTutionFeeConcessionAct(generateActionPayload('export_tution_fee_concession', undefined, { ...payload }, {
      responseType: 'blob'
    })))
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  const { data: ConcessionList, totalPages, pageNumber, totalElements } = tutionFeeConcessionList || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Tution Fee Concessions" pageTitle="Fee" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Tution Fee Concessions Details
                  </h4>
                </div>
                <div className="col-auto ms-auto">
                  <div className="d-flex">
                    <DropDownToggle
                      id="tution-concession-dropdown"
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
              {/* <form onSubmit={TutionFeeConcessionFilterForm.handleSubmit}> */}
              <div className="row g-3">
                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="studentName"
                      value={tutionFeeConcessionFilterState.studentName}
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
                    value={tutionFeeConcessionFilterState.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    defaultSelect="Academic Year"
                    // inputClassName="bg-light"
                    formgroupClassName="mb-0"
                  />
                </div>

                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={tutionFeeConcessionFilterState.curriculumId}
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
                    value={tutionFeeConcessionFilterState.classId}
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
                    <TextInput
                      name="dateRange"
                      value={TutionFeeConcessionFilterForm.values.dateRange}
                      onChange={TutionFeeConcessionFilterForm.handleChange}
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
              data={ConcessionList || []}
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
        id="delete-tution-fee-concession-modal"
        isOpen={delFeeConceState.showModal}
        confirmMessage="Are you sure you want to delete this Concession ?"
        cancelHndlr={toggleDelConcessionModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
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
        id="bulk-upload-modal"
        isOpen={bulkUploadStateModal.showModal}
        toggle={() => toggleBulkUploadModal()}
        modalTitle="Bulk Upload Modal"
        // headerClassName="bg-white"
        modalSize="md"
      >
        <UploadExcelModal
          toggle={() => toggleBulkUploadModal()}
          academicYearId={tutionFeeConcessionFilterState.academicYearId}
        />
      </ModalContainerUpdated>
      {/* <ConfirmationModal
        id="tution-fee-concession-export-modal"
        isOpen={exportConfirmationModal.showModal}
        confirmMessage="You want to Download ?"
        cancelHndlr={() => toggleExportConfirmationModal()}
        confirmHndlr={exportModalHndler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      /> */}
      <ModalContainerUpdated
        id="tution-fee-concession-export-modal"
        isOpen={exportConfirmationModal.showModal}
        toggle={toggleExportConfirmationModal}
        modalTitle="Export Tution Fee Concession Data"
        modalSize="md">
        <ExportModal
          isOpen={exportConfirmationModal.showModal}
          toggle={toggleExportConfirmationModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportModalHndler}
          feature="fee"
          subFeature="tution_fee_concession"
          remarksText="Enter remarks to export tution fee concession data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default TutionFeeConcessions;
