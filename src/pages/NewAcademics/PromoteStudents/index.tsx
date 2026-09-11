import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  PromoteStudentFilterhProps,
  PromoteStudentModalType,
} from "./promoteStudentTypes";
import {
  generateColumns,
  hasStateChanged,
  promotionTypeOp,
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import PromoteStudentsModal from "./PromoteStudentsModal";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { exportPromoteStudentsAct, getPromotedStudentList, resetCurriculumStudentList } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { toast } from "react-toastify";
import ShowPromotedStudent from "./ShowPromotedStudent";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import Button from "../../../Components/Common/Button";

const initialValues: PromoteStudentFilterhProps = {
  studentName: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  promotedBy: ""
};

const PromoteStudents = () => {
  const dispatch = useDispatch();
  const [promoteStudentFilterState, setPromoteStudentFilterState] = useState<PromoteStudentFilterhProps>(initialValues);
  const [classWisePromotedStudent, setClasswisePromotedStudent] = useState([]);
  const [currentAcademicYearId, setCurrentAcademicYearId] = useState("");
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [filterState, setFilterState] = useState({
    pageNo: 0,
    pageSize: 10
  })
  const [exportExcel, setExportExcel] = useState<any>({
    showModal: false,
    id: undefined
  })
  const [promoteStudentModalState, setPromoteStudentModalState] =
    useState<PromoteStudentModalType>({
      showModal: false,
      branchId: "",
    });
  const [showPromotedStudentModalState, setShowPromotedStudentModalState] =
    useState<PromoteStudentModalType>({
      showModal: false,
      branchId: "",
    });

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    promotedStudentList,
    promoteHigherClassStudents,
    classroomErrorResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    exportPromoteStudentsResp,
    classroomManagmentErrorResp
  }: any = useAppSelector(
    ({ classroomManagmentInfo, instAcademics, branchAcademics, appData, globalData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      promotedStudentList: classroomManagmentInfo.promotedStudentList,
      promoteHigherClassStudents: classroomManagmentInfo.promoteHigherClassStudents,
      exportPromoteStudentsResp: classroomManagmentInfo.exportPromoteStudentsResp,
      classroomErrorResp: classroomManagmentInfo.classroomErrorResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp
    }),
    shallowEqual
  );

  const PromoteStudentRef = useRef({
    prevPromoteHigherClassStudents: promoteHigherClassStudents,
    prevExportPromoteStudentsResp: exportPromoteStudentsResp,
    prevClassroomErrorResp: classroomErrorResp,
    prevClassroomManagmentErrorResp: classroomManagmentErrorResp
  })


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
    index && setClasswisePromotedStudent(promotedStudent[+index].studentDetailDTOList)
    setShowPromotedStudentModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };


  const getPromotedStudents = (otherProps?: any) => {
    const params = { branchId, academicYearId: promoteStudentFilterState.academicYearId, curriculumId: promoteStudentFilterState.curriculumId, classId: promoteStudentFilterState.classId, promotedBy: promoteStudentFilterState.promotedBy, studentName: promoteStudentFilterState.studentName, ...filterState, ...otherProps }
    if (params.academicYearId) {
      dispatch(getPromotedStudentList(generateActionPayload('promoted_student_list', undefined, params)))
    }
  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
       getCurriculumApiCall({ academicYearId: value });
       dispatch(resetBrchClassAct(undefined));
       getPromotedStudents({ academicYearId: value,classId: null,curriculumId:"", pageNo: 0, pageSize: 10 });
       setPromoteStudentFilterState((prev: any) => ({ ...prev, [name]: value, classId: null, curriculumId: "" }))
      }
    else if (name === "curriculumId") {
      if (!value) {
        dispatch(resetBrchClassAct(undefined));
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: promoteStudentFilterState.academicYearId });
        setPromoteStudentFilterState(prev => ({ ...prev, [name]: value }));
        getPromotedStudents({ [name]: value });
      }
    }
    else{
      getPromotedStudents({ [name]: value });
      setPromoteStudentFilterState((prev: any) => ({ ...prev, [name]: value }))
    }
    const stateChanged = hasStateChanged({ ...promoteStudentFilterState, [name]: value, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange)
  }
  const getClassApiCall = (otherProps?:any)=>{
    const payload = { branchId: branchId, academicYearId : promoteStudentFilterState?.academicYearId, curriculumId: promoteStudentFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
     dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
}

const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: promoteStudentFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
}

  useEffect(() => {
    return () => {
      dispatch(resetCurriculumStudentList(undefined));
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }
  }, [])
  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    setCurrentAcademicYearId(yearId);
    setPromoteStudentFilterState((prev: any) => ({ ...prev, academicYearId: yearId }));
    getPromotedStudents({ academicYearId: yearId })
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp])


  function downloadExcelFile(blobStream: any) {

    const url = window.URL.createObjectURL(new Blob([(blobStream)]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'promoted_student_export_excel.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  useEffect(() => {
    const { prevPromoteHigherClassStudents, prevClassroomErrorResp, prevExportPromoteStudentsResp, prevClassroomManagmentErrorResp } = PromoteStudentRef.current;
    if (promoteHigherClassStudents && promoteHigherClassStudents !== prevPromoteHigherClassStudents) {
      toast.success('Students Promoted Successfully.');
      togglePromoteStudentModal(true);
    }
    if (exportPromoteStudentsResp && exportPromoteStudentsResp !== prevExportPromoteStudentsResp) {
      toast.success('Promote Students List Exported Successfully.');
      toggleExportExcelModal();
      downloadExcelFile(exportPromoteStudentsResp)
    }
    else if (classroomErrorResp && classroomErrorResp !== prevClassroomErrorResp) {
      const { details } = classroomErrorResp;
      toast.error(details)
    }
    else if (classroomManagmentErrorResp && classroomManagmentErrorResp !== prevClassroomManagmentErrorResp) {
      const { details } = classroomManagmentErrorResp;
      toast.error(details)
    }

    PromoteStudentRef.current.prevPromoteHigherClassStudents = promoteHigherClassStudents;
    PromoteStudentRef.current.prevExportPromoteStudentsResp = exportPromoteStudentsResp;
    PromoteStudentRef.current.prevClassroomErrorResp = classroomErrorResp;
    PromoteStudentRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;
  }, [promoteHigherClassStudents, classroomErrorResp, exportPromoteStudentsResp, classroomManagmentErrorResp])
  const roleColumns = useMemo(() => generateColumns(toggleShowPromotedStudentModal), [toggleShowPromotedStudentModal]);

  function paginationHndlr(paginationInfo: any) {
    setFilterState(paginationInfo)
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
    dispatch(exportPromoteStudentsAct(generateActionPayload("export_promoted_student_list", undefined, { ...payload, branchId }, {
      responseType: 'blob'
    })));
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      let academicYearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      dispatch(resetBrchClassAct(undefined));
      setPromoteStudentFilterState({ ...initialValues, academicYearId })
      getPromotedStudents({ ...initialValues, academicYearId, pageNo: 0, pageSize: 10 })
      setShowClearFilterState(false)
      getCurriculumApiCall({ academicYearId: academicYearId })
    }
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  const { content: promotedStudent, totalPages, totalElements, pageable } = promotedStudentList || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Promote Students List" pageTitle="Academics" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-5">
            <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-4 tw-border-b">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Promote Students List
              </h4>
              <div className="tw-flex tw-gap-3">
                <Button
                  type="button"
                  variant="info"
                  onClick={toggleExportExcelModal}
                >
                  <i className="ri-add-line tw-mr-1"></i>
                  Export
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={togglePromoteStudentModal}
                >
                  <i className="ri-add-line tw-mr-2"></i>
                  Promote Student
                </Button>
              </div>
            </div>
            <div className="tw-px-4 tw-py-4">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12 md:tw-col-span-2 search-box">
                  <TextInput
                    name="studentName"
                    value={promoteStudentFilterState.studentName}
                    onChange={filterHandler}
                    formgroupClassName="mb-0"
                    placeHolder="Search"
                    labelText="Search"
                    floatingLabel
                  />
                  <i className="ri-search-line search-icon"></i>
                </div>
                <div className="tw-col-span-12 md:tw-col-span-2">
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
                <div className="tw-col-span-12 md:tw-col-span-2">
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
                <div className="tw-col-span-12 md:tw-col-span-2">
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
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <SelectInput
                    name="promotedBy"
                    value={promoteStudentFilterState.promotedBy}
                    onChange={filterHandler}
                    menuItems={promotionTypeOp}
                    valueKey="promotedByType"
                    textKey="promotedBy"
                    formgroupClassName="tw-mb-0"
                    labelText="Promoted By"
                    floatingLabel
                  />
                </div>
                {showClearFilterState && (
                  <div className="tw-col-span-12 md:tw-col-span-2 tw-flex tw-justify-end tw-items-end">
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
            <div className="tw-px-0 tw-pb-4">
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
          instituteId={"1"}
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
        modalTitle="Export Promote Students Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcel.showModal}
          toggle={toggleExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="academic"
          subFeature="promote_students"
          remarksText="Enter remarks to export promote students data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default PromoteStudents;
