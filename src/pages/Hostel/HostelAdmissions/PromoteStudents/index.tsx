import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

import {
  generateColumns,
  hasStateChanged,
  promotionTypeOp,
} from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import PromoteStudentsModal from "./PromoteStudentsModal";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { exportPromoteStudentsAct, resetCurriculumStudentList } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { toast } from "react-toastify";
import { getHostelPromoteStuListAct } from "../../../../store/hostel/hostelrequest/hostelrequestactions";
import ShowPromotedStudent from "./ShowPromotedStudent";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../../utility/commonutility";
import Button from "../../../../Components/Common/Button";


const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  promotedBy: ""
};

const PromoteStudents = () => {
  const dispatch = useAppDispatch();
  const [promoteStudentFilterState, setPromoteStudentFilterState] = useState(initialValues);
  const [classWisePromotedStudent, setClasswisePromotedStudent] = useState([]);
  const [currentAcademicYearId, setCurrentAcademicYearId] = useState<string | undefined>("");
  const [showClearFilterState, setShowClearFilterState] = useState(false);

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const [exportExcel, setExportExcel] = useState({
    showModal: false,
    id: undefined
  })
  const [promoteStudentModalState, setPromoteStudentModalState] =
    useState({
      showModal: false,
      branchId: "",
    });
  const [showPromotedStudentModalState, setShowPromotedStudentModalState] =
    useState({
      showModal: false,
      branchId: "",
    });

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    promoteHigherClassStudents,
    classroomErrorResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    exportPromoteStudentsResp,
    getHostelPromoteStuListResp,
    saveHostelPromoteStuResp,
    hostelRequestErrorResp,
    classroomManagmentErrorResp
  } = useAppSelector(
    ({ classroomManagmentInfo, instAcademics, branchAcademics, appData, globalData, hostelRequest, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      promoteHigherClassStudents: classroomManagmentInfo.promoteHigherClassStudents,
      exportPromoteStudentsResp: classroomManagmentInfo.exportPromoteStudentsResp,
      classroomErrorResp: classroomManagmentInfo.classroomErrorResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getHostelPromoteStuListResp: hostelRequest.getHostelPromoteStuListResp,
      saveHostelPromoteStuResp: hostelRequest.saveHostelPromoteStuResp,
      hostelRequestErrorResp: hostelRequest.hostelRequestErrorResp,
      showApiLoader: globalData.showApiLoader,
      classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp
    }),
    shallowEqual
  );

  const PromoteStudentRef = useRef({
    prevSaveHostelPromoteStuResp: saveHostelPromoteStuResp,
    prevExportPromoteStudentsResp: exportPromoteStudentsResp,
    prevClassroomErrorResp: classroomErrorResp,
    prevHostelRequestErrorResp: hostelRequestErrorResp,
    prevClassroomManagmentErrorResp: classroomManagmentErrorResp
  })

  useEffect(() => {
    const { prevSaveHostelPromoteStuResp, prevClassroomErrorResp, prevExportPromoteStudentsResp, prevClassroomManagmentErrorResp, prevHostelRequestErrorResp } = PromoteStudentRef.current;
    if (saveHostelPromoteStuResp && saveHostelPromoteStuResp !== prevSaveHostelPromoteStuResp) {
      toast.success('Students Promoted Successfully.');
      togglePromoteStudentModal(true);
      getPromotedStudents()
    }
    if (exportPromoteStudentsResp && exportPromoteStudentsResp !== prevExportPromoteStudentsResp) {
      toast.success('Promote Students List Exported Successfully.');
      toggleExportExcelModal();
      downloadExcelFile(exportPromoteStudentsResp,'promoted_student_export_excel')
    }
    else if (classroomErrorResp && classroomErrorResp !== prevClassroomErrorResp) {
      const { details } = classroomErrorResp;
      toast.error(details)
    }
    else if (classroomManagmentErrorResp && classroomManagmentErrorResp !== prevClassroomManagmentErrorResp) {
      const { details } = classroomManagmentErrorResp;
      toast.error(details)
    }
    else if (hostelRequestErrorResp && hostelRequestErrorResp !== prevHostelRequestErrorResp) {
      const { details } = hostelRequestErrorResp;
      toast.error(details || "Something went wrong. Please try again.")
    }

    PromoteStudentRef.current.prevSaveHostelPromoteStuResp = saveHostelPromoteStuResp;
    PromoteStudentRef.current.prevExportPromoteStudentsResp = exportPromoteStudentsResp;
    PromoteStudentRef.current.prevClassroomErrorResp = classroomErrorResp;
    PromoteStudentRef.current.prevHostelRequestErrorResp = hostelRequestErrorResp;
    PromoteStudentRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;
  }, [saveHostelPromoteStuResp, classroomErrorResp, exportPromoteStudentsResp, classroomManagmentErrorResp, hostelRequestErrorResp])

  const togglePromoteStudentModal = (apiCall?: any) => {
    setPromoteStudentModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));

    if (typeof (apiCall) === "boolean" && apiCall) {
      getPromotedStudents();
    }
  };

  const toggleShowPromotedStudentModal = (event: any) => {
    const index = event.currentTarget.getAttribute("data-id");
    index && setClasswisePromotedStudent(promotedStudent[+index].studentDetailsDto)
    setShowPromotedStudentModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };


  const getPromotedStudents = (otherProps?: any) => {
    const params = { branchId,  ...promoteStudentFilterState, ...pagination.current, ...otherProps }
    if (params.academicYearId) {
      dispatch(getHostelPromoteStuListAct(generateActionPayload('get_hostel_promote_stu_list', undefined, params)))
    }
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: promoteStudentFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getClassApiCall(curriculumId: string) {
    const payload = {
      curriculumId, branchId,
      academicYearId : promoteStudentFilterState.academicYearId,
      pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }


  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    pagination.current = { ...pagination.current, pageNo: 0, pageSize: 10 }
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      setPromoteStudentFilterState((prev:any) => ({ ...prev, [name]: value , classId : "",curriculumId : "" }));
      getPromotedStudents({ [name]: value, classId: "" , curriculumId: "" });
    }
    else if (name === "curriculumId") {
        if (value) {
            getClassApiCall(value);
        }
        else {
            dispatch(resetBrchClassAct(undefined));
        }
        getPromotedStudents({ [name]: value, classId: "" });
        setPromoteStudentFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
    } else {
        setPromoteStudentFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getPromotedStudents({ [name]: value, });
    }

    const stateChanged = hasStateChanged({ ...promoteStudentFilterState, [name]: value, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange)
  }


  useEffect(() => {

    return () => {
      dispatch(resetCurriculumStudentList(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, [])

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setCurrentAcademicYearId(yearId);
    setPromoteStudentFilterState((prev: any) => ({ ...prev, academicYearId: yearId }));
    getPromotedStudents({ academicYearId: yearId })
    getCurriculumApiCall({ academicYearId : yearId });
  }, [academicYearListResp,branchId,instituteId])

  const roleColumns = useMemo(() => generateColumns(toggleShowPromotedStudentModal), [toggleShowPromotedStudentModal]);

  function paginationHndlr(paginationInfo: any) {
    pagination.current = paginationInfo
    getPromotedStudents(paginationInfo);
  }

  const toggleExportExcelModal = () => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const exportExcelHndler = () => {
    const payload = {
      ...promoteStudentFilterState
    }
    // dispatch(exportPromoteStudentsAct(generateActionPayload("export_promoted_student_list", undefined, { ...payload, branchId }, {
    //   responseType: 'blob'
    // })));
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      let {academicYearId = ''} = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
      dispatch(resetBrchClassAct(undefined));
      setPromoteStudentFilterState({ ...initialValues, academicYearId })
      getCurriculumApiCall({ academicYearId });
      getPromotedStudents({ ...initialValues, academicYearId, pageNo: 0, pageSize: 10 })
      setShowClearFilterState(false)
    }
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  const { data: promotedStudent, totalPages, totalElements, pageable } = getHostelPromoteStuListResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Promote Students List" pageTitle="Hostel" />

          <div className="tw-rounded-lg tw-bg-white tw-shadow">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3">
                <div className="xl:tw-w-1/3">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Promote Students List
                  </h4>
                </div>

                <div className="tw-ml-auto tw-flex tw-gap-2">
                  <Button
                    variant="info"
                    onClick={toggleExportExcelModal}
                  >
                    <i className="ri-add-line" />
                    <span>Export</span>
                  </Button>

                  <Button
                    variant="primary"
                    onClick={togglePromoteStudentModal}
                  >
                    <i className="ri-add-line" />
                    Promote Student
                  </Button>
                </div>
              </div>
            </div>

            <div className="tw-p-0">
              <div className="tw-px-4 tw-py-3">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                  <div className="xl:tw-col-span-2 tw-col-span-12">
                    <div className="tw-relative">
                      <TextInput
                        name="searchString"
                        value={promoteStudentFilterState.searchString}
                        onChange={filterHandler}
                        formgroupClassName="tw-mb-0"
                        labelText="Search"
                        placeHolder="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                    </div>
                  </div>

                  <div className="xl:tw-col-span-2 tw-col-span-12">
                    <SelectInput
                      name="academicYearId"
                      value={promoteStudentFilterState.academicYearId}
                      onChange={filterHandler}
                      menuItems={academicYearList || []}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      formgroupClassName="tw-mb-0"
                      labelText="Academic Year"
                      floatingLabel
                    />
                  </div>

                  <div className="xl:tw-col-span-2 tw-col-span-12">
                    <SelectInput
                      name="curriculumId"
                      value={promoteStudentFilterState.curriculumId}
                      onChange={filterHandler}
                      menuItems={curriculumTypes}
                      valueKey="branchCurriculumId"
                      textKey="curriculumName"
                      formgroupClassName="tw-mb-0"
                      labelText="Curriculum"
                      floatingLabel
                    />
                  </div>

                  <div className="xl:tw-col-span-2 tw-col-span-12">
                    <SelectInput
                      name="classId"
                      value={promoteStudentFilterState.classId}
                      onChange={filterHandler}
                      menuItems={classTypes}
                      valueKey="id"
                      textKey="shortName"
                      formgroupClassName="tw-mb-0"
                      labelText="Class"
                      floatingLabel
                    />
                  </div>

                  <div className="xl:tw-col-span-2 tw-col-span-12">
                    <SelectInput
                      name="promotedBy"
                      value={promoteStudentFilterState.promotedBy}
                      onChange={filterHandler}
                      menuItems={promotionTypeOp}
                      valueKey="promotedByType"
                      textKey="promotedBy"
                      formgroupClassName="tw-mb-0"
                      labelText="Promoted by"
                      floatingLabel
                    />
                  </div>

                  <div className="tw-col-auto tw-flex tw-justify-end">
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
              </div>

              <TableContainer
                columns={roleColumns || []}
                data={promotedStudent || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
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
        id="promote-students-modal"
        isOpen={promoteStudentModalState.showModal}
        toggle={togglePromoteStudentModal}
        modalTitle="Promote Students"
        modalSize="lg"
      >
        <PromoteStudentsModal
          isOpen={promoteStudentModalState.showModal}
          toggle={togglePromoteStudentModal}
          modalTitle="Promote Students"
          instituteId={instituteId}
          instituteName={"Promote Students"}
          branchId={promoteStudentModalState.branchId}
          editBranchDetails={""}
          currentAcademicYearId={currentAcademicYearId}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="show-students-modal"
        isOpen={showPromotedStudentModalState.showModal}
        toggle={toggleShowPromotedStudentModal}
        modalTitle="Promote Students"
        modalSize="md"
      >
        <ShowPromotedStudent
          isOpen={showPromotedStudentModalState.showModal}
          toggle={toggleShowPromotedStudentModal}
          modalTitle="Promoted Students"
          instituteId={instituteId}
          instituteName={"Students"}
          branchId={branchId}
          editBranchDetails={""}
          students={classWisePromotedStudent}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
                id="promote-students-export"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Hostel Promote Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="hostel"
                    subFeature="promote_students"
                    remarksText="Enter remarks to export hostel promote data?"
                />
            </ModalContainerUpdated>
    </>
  );
};

export default PromoteStudents;
