import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SelectInput, TextInput, ConfirmationModal, ModalContainerUpdated } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  HigherClassEligibilityFilterhProps,
  HigherClassModalType,
} from "./higherClassEligibilityTypes";
import {
  generateColumns,
  hasStateChanged,
  promotionStatusList,
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import HigherClassModal from "./HigherClassModal";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppSelector } from "../../../hooks/storehook";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { deletePromotionAct, exportHigherClassEligiAct, getHigherClassStudentList, removePromotionAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { sortRef } from "../academicsTypes";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import Button from "../../../Components/Common/Button";

const initialValues: HigherClassEligibilityFilterhProps = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  promotionStatus: "",
  // branchId:1,
  // instituteId:1,
  pageNo: 0,
  pageSize: 10,
  // sortBy: "createdAt",
  // orderBy: "asc"
};

const HigherClassEligibility = () => {
  const dispatch = useDispatch();
  const [
    higherClassEligibilityFilterState,
    setHigherClassEligibilityFilterState,
  ] = useState<HigherClassEligibilityFilterhProps>(initialValues);
  const [currentAcademicYearId, setCurrentAcademicYearId] = useState<any>("");
  const [revertPromotionModalState, setRevertPromotionModalState] = useState({
    showModal: false,
    studentId: undefined,
  });
  const [removePromotionModalState, setRemovePromotionModalState] = useState({
    showModal: false,
    higherClassId: undefined,
  });
  const [exportExcel, setExportExcel] = useState<any>({
    showModal: false,
    higherClassId: undefined
  })

  const [higherClassModalState, setHigherClassModalState] =
    useState<HigherClassModalType>({
      showModal: false,
      // branchId: "",
    });
  const [showClearFilterState, setShowClearFilterState] = useState(false);

  const toggleHigherClassModal = (apiApicall?: any) => {
    setHigherClassModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));

    if (typeof (apiApicall) === "boolean" && apiApicall) {
      getHigherClassEligibilityResp();
    }
  };

  function revertPromotionHndlr(event: any) {
    const higherClassId = event.currentTarget.getAttribute("data-id");
    let student = higherClassStudentListResp && higherClassStudentListResp.content.find((student: any) => student.id === +higherClassId);

    if (higherClassId) {
      setRevertPromotionModalState((prevState: any) => ({ ...prevState, showModal: true, studentId: student.studentId }));
    }
  }
  function removePromotionHndlr(event: any) {
    const higherClassId = event.currentTarget.getAttribute("data-id");
    if (higherClassId) {
      setRemovePromotionModalState((prevState: any) => ({ ...prevState, showModal: true, higherClassId }));
    }
  }
  const {
    higherClassStudentListResp,
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    assignHigherClassStudentListResp,
    removePromotionResp,
    deletePromotionResp,
    classroomManagmentErrorResp,
    showApiLoader,
    exportHigherClassEligiResp,
  }: any = useAppSelector(
    ({ classroomManagmentInfo, assignGroupInfo, instAcademics, branchAcademics, appData, globalData }) => ({

      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      higherClassStudentListResp: classroomManagmentInfo.higherClassStudentListResp,
      assignHigherClassStudentListResp: classroomManagmentInfo.assignHigherClassStudentListResp,
      removePromotionResp: classroomManagmentInfo.removePromotionResp,
      deletePromotionResp: classroomManagmentInfo.deletePromotionResp,
      exportHigherClassEligiResp: classroomManagmentInfo.exportHigherClassEligiResp,
      classroomManagmentErrorResp:
        classroomManagmentInfo.classroomManagmentErrorResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );
  const menuOptions = useMemo(
    () => [
      {
        id: "removePromotion",
        actionIcon: <span className="text-info text-decoration-underline">Remove Promotion</span>,
        actionName: "Remove Promotion",
        onClickHndlr: removePromotionHndlr,
      },
      {
        id: "revert",
        actionIcon: <span className="text-info text-decoration-underline">Revert</span>,
        actionName: "Revert",
        onClickHndlr: revertPromotionHndlr,
      },
    ],
    [higherClassStudentListResp]
  );

  const getHigherClassEligibilityResp = (otherProps?: any) => {
    let payload = { branchId: branchId, classId: higherClassEligibilityFilterState.classId, curriculumId: higherClassEligibilityFilterState.curriculumId, academicYearId: higherClassEligibilityFilterState.academicYearId, promotionStatus: higherClassEligibilityFilterState.promotionStatus, pageNo: higherClassEligibilityFilterState.pageNo, pageSize: higherClassEligibilityFilterState.pageSize, searchString: higherClassEligibilityFilterState.searchString, ...otherProps }
    if (payload.academicYearId) {
      dispatch(
        getHigherClassStudentList(
          generateActionPayload("get_higher_class_student_list", undefined, payload)
        )
      );
    }
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    setHigherClassEligibilityFilterState((pre: any) => ({ ...pre, pageNo: paginationInfo.pageNo, pageSize: paginationInfo.pageSize }));
    getHigherClassEligibilityResp(paginationInfo);
  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    // getHigherClassEligibilityResp({[name]:value})
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      getHigherClassEligibilityResp({academicYearId:value,classId : null,curriculumId:"",pageNo: 0, pageSize: 10})
      setHigherClassEligibilityFilterState((prev: any) => ({ ...prev, [name]: value, classId: null, curriculumId: "" }))
    }
    else if (name === 'curriculumId') {
      if (value) {
        getClassApiCall({curriculumId: value, academicYearId: higherClassEligibilityFilterState.academicYearId});
        setHigherClassEligibilityFilterState((prev: any) => ({ ...prev, [name]: value, classId: null }))
      }
      else {
        dispatch(resetBrchClassAct(undefined));
      }
      getHigherClassEligibilityResp({curriculumId:value,classId : null,pageNo: 0, pageSize: 10})
    }
    else if (name === "searchString" || name === 'classId' || name === 'promotionStatus') {
      getHigherClassEligibilityResp({ [name]: value, pageNo: 0, pageSize: 10 })
      setHigherClassEligibilityFilterState((prev: any) => ({ ...prev, [name]: value, pageNo: 0, pageSize: 10 }));
    }

    const stateChanged = hasStateChanged({ ...higherClassEligibilityFilterState, [name]: value, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange)

  }
  const sortByPrevRef = useRef<Array<sortRef>>([{
    id: "studentName",
    desc: false
  }])
  const sortingHandler = useCallback((sortBy: any) => {
    const sortByPrev = sortByPrevRef.current;
    if (sortBy && sortByPrev !== sortBy) {
      setHigherClassEligibilityFilterState((prev: any) => ({ ...prev, sortBy: sortBy[0]?.id, orderBy: sortBy[0]?.desc ? "desc" : "asc" }))
      getHigherClassEligibilityResp({ sortBy: sortBy[0]?.id, orderBy: sortBy[0]?.desc ? "desc" : "asc" })
    }
    sortByPrevRef.current = sortBy;
  }, [higherClassEligibilityFilterState])

  function downloadExcelFile(blobStream: any) {

    const url = window.URL.createObjectURL(new Blob([(blobStream)]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'academics_higher_class_eligibility.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  const higherClassEligibilityRef = useRef<any>({
    prevAssignHigherClassStudentListResp: assignHigherClassStudentListResp,
    prevRemovePromotionResp: removePromotionResp,
    prevDeletePromotionResp: deletePromotionResp,
    prevExportHigherClassEligiResp: exportHigherClassEligiResp,
    prevClassroomManagmentErrorResp: classroomManagmentErrorResp
  });

  useEffect(() => {
    const { prevAssignHigherClassStudentListResp, prevRemovePromotionResp, prevDeletePromotionResp, prevClassroomManagmentErrorResp, prevExportHigherClassEligiResp } = higherClassEligibilityRef.current;
    if (assignHigherClassStudentListResp && assignHigherClassStudentListResp !== prevAssignHigherClassStudentListResp) {
      toast.success('Student assigned successfully.');
      toggleHigherClassModal(true)
    }
    else if (removePromotionResp && prevRemovePromotionResp !== removePromotionResp) {
      toast.success('Promotion removed successfully.');
      removeModalCancelHndlr();
      getHigherClassEligibilityResp();
    }
    else if (deletePromotionResp && prevDeletePromotionResp !== deletePromotionResp) {

      toast.success('Promotion Deleted successfully.');
      revertModalCancelHndlr();
      getHigherClassEligibilityResp();
    }
    else if (exportHigherClassEligiResp && prevExportHigherClassEligiResp !== exportHigherClassEligiResp) {
      toast.success('Data Export Successfully.');
      toggleExportExcelModal()
      downloadExcelFile(exportHigherClassEligiResp)
    }
    if (classroomManagmentErrorResp && classroomManagmentErrorResp !== prevClassroomManagmentErrorResp) {
      const { details } = classroomManagmentErrorResp;
      toast.error(details);
    }

    higherClassEligibilityRef.current.prevAssignHigherClassStudentListResp = assignHigherClassStudentListResp;
    higherClassEligibilityRef.current.prevRemovePromotionResp = removePromotionResp;
    higherClassEligibilityRef.current.prevDeletePromotionResp = deletePromotionResp;
    higherClassEligibilityRef.current.prevExportHigherClassEligiResp = exportHigherClassEligiResp;
    higherClassEligibilityRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;

  }, [assignHigherClassStudentListResp, removePromotionResp, deletePromotionResp, classroomManagmentErrorResp, exportHigherClassEligiResp])
  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
    setCurrentAcademicYearId(yearId);
    setHigherClassEligibilityFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    getHigherClassEligibilityResp({ academicYearId: yearId })
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp])

  useEffect(() => {
    return () => {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
    }
}, []);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: higherClassEligibilityFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
}
const getClassApiCall = (otherProps?:any)=>{
    const payload = { branchId: branchId, academicYearId : higherClassEligibilityFilterState?.academicYearId, curriculumId: higherClassEligibilityFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
     dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function removeModalCancelHndlr() {
    setRemovePromotionModalState((prevState: any) => ({ ...prevState, showModal: false, higherClassId: undefined }));
  }

  function removeModalSubmitHndlr() {
    const { higherClassId } = removePromotionModalState;
    const { academicYearId } = higherClassEligibilityFilterState;
    const payload = {
      id: higherClassId,
      branchId,
      currentAcademicYearId: higherClassEligibilityFilterState.academicYearId
    };
    dispatch(removePromotionAct(generateActionPayload("revert_promotion", undefined, payload)));
  }
  function revertModalCancelHndlr() {
    setRevertPromotionModalState((prevState: any) => ({ ...prevState, showModal: false, studentId: undefined }));
  }

  function revertModalSubmitHndlr() {
    const { studentId } = revertPromotionModalState;
    const { academicYearId } = higherClassEligibilityFilterState;
    const apiParams = {
      studentId: studentId,
      academicYearId: academicYearId
    };
    dispatch(deletePromotionAct(generateActionPayload("delete_student", apiParams)));
  }



  const toggleExportExcelModal = (id?: any) => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      higherClassId: id || "",
    }));
  };

  const exportExcelHndler = () => {
    const { pageNo, pageSize, ...payloadWithoutPageInfo } = higherClassEligibilityFilterState;
    dispatch(exportHigherClassEligiAct(generateActionPayload("export_higher_class_student_list", undefined, { ...payloadWithoutPageInfo, branchId }, {
      responseType: 'blob'
    })));
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      let academicYearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      dispatch(resetBrchClassAct(undefined));
      setHigherClassEligibilityFilterState({ ...initialValues, academicYearId, pageNo: 0, pageSize: 10 })
      getHigherClassEligibilityResp({ ...initialValues, academicYearId })
      setShowClearFilterState(false)
      getCurriculumApiCall({ academicYearId });
    }
  }

  const roleColumns = useMemo(() => generateColumns(menuOptions), [higherClassStudentListResp]);

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};
  const { content: StudentList, totalPages, totalElements, pageable } = higherClassStudentListResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Higher Class Eligibility" pageTitle="Academics" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mt-2 tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Higher Class Eligibility
                </h4>
                <div className="tw-flex tw-gap-2">
                  <Button
                    type="button"
                    variant="info"
                    onClick={toggleExportExcelModal}
                  >
                    <i className="ri-add-line"></i>
                    Export
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={toggleHigherClassModal}
                  >
                    <i className="ri-add-line"></i>
                    Add New
                  </Button>
                </div>
              </div>
            </div>
            <div className="tw-border-b tw-px-4 tw-py-4">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-end">
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      value={higherClassEligibilityFilterState.searchString}
                      onChange={filterHandler}
                      // inputClassName="bg-light"
                      formgroupClassName="mb-0"
                      placeHolder="Search"
                      labelText="Search"
                      floatingLabel
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={higherClassEligibilityFilterState.academicYearId}
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
                    value={higherClassEligibilityFilterState.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes || []}
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
                    value={higherClassEligibilityFilterState.classId}
                    onChange={filterHandler}
                    menuItems={classTypes || []}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="tw-mb-0"
                    labelText="Class"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <SelectInput
                    name="promotionStatus"
                    value={higherClassEligibilityFilterState.promotionStatus}
                    onChange={filterHandler}
                    menuItems={promotionStatusList}
                    valueKey="id"
                    textKey="name"
                    formgroupClassName="tw-mb-0"
                    labelText="Promotion Status"
                    floatingLabel
                  />
                </div>
                {showClearFilterState && (
                  <div className="tw-col-span-12 md:tw-col-span-2 tw-flex tw-justify-end">
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
            <div className="tw-p-0">
              <TableContainer
                columns={roleColumns || []}
                data={StudentList || []}
                divClass="table-responsive tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber}
                sortingHandler={sortingHandler}
                manualSorting={true}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="higher-class-eligibility"
        isOpen={higherClassModalState.showModal}
        toggle={toggleHigherClassModal}
        modalTitle="Higher Class Eligibility"
        modalSize="xl"
      >
        <HigherClassModal
          isOpen={higherClassModalState.showModal}
          toggle={toggleHigherClassModal}
          modalTitle="Higher Class Eligibility"
          instituteId={instituteId}
          instituteName={"Higher Class Eligibility"}
          branchId={branchId}
          editBranchDetails={""}
          currentAcademicYearId={currentAcademicYearId}
          filterState={higherClassEligibilityFilterState}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="revert-promotion-moda"
        isOpen={removePromotionModalState.showModal}
        confirmMessage="Are you sure you want to Remove the promotion?"
        cancelHndlr={removeModalCancelHndlr}
        confirmHndlr={removeModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
      />
      <ConfirmationModal
        id="revert-promotion-moda"
        isOpen={revertPromotionModalState.showModal}
        confirmMessage="Are you sure you want to Revert the promotion?"
        cancelHndlr={revertModalCancelHndlr}
        confirmHndlr={revertModalSubmitHndlr}
      />
      <ModalContainerUpdated
        id="higherclass-eligibility-export"
        isOpen={exportExcel.showModal}
        toggle={toggleExportExcelModal}
        modalTitle="Export Higher Class Eligibility Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcel.showModal}
          toggle={toggleExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="academic"
          subFeature="higher_class_eligibility"
          remarksText="Enter remarks to export higher class eligibility data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default HigherClassEligibility;
