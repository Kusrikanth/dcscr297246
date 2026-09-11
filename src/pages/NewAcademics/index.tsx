import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Card, CardBody, Col, Container, Row, CardHeader } from "reactstrap";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { generateColumns } from "./helper";

import TableContainer from "../../Components/Common/TableContainer";
import AssignClassroomModal from "./assignRoomModal";
import {
  academicsFilterhProps,
  IAcademicsModal,
  ISectionDetails,
  sortRef,
} from "./academicsTypes";
import AssignTeacherModal from "./assignTeacherModal";
import AddStudentModal from "./addStudentModal";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../Components/Common";
import {
  deleteSectionListAct,
  getSectionList,
  resetClassroomManagement,
  sectionListFilterAct,
} from "../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { shallowEqual } from "react-redux";
import ShowStudentModal from "./showStudentModal";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../store/branchsettings/branchacademics/branchacademicsactions";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IPaginationState } from "../../Components/Common/Pagination";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, DeleteIcon, ElearningExchangeIcon, EyeIcon, MeetingRoomIcon, PlusSignSquareIcon } from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../hooks/modalhook";
import ExportModal from "../Directory/StudentManagement/ExportModal";
const initialValues: academicsFilterhProps = {
  searchString: "",
  branchClassId: "",
  curriculumId: "",
  masterAcademicYearId: "",
  sectionId: "",
  pageNo: 0,
  pageSize: 10,
};

const NewAcademics = (props: any) => {

  const history = useHistory();
  const dispatch = useAppDispatch();
  const [academicsFilterState, setAcademicsFilterState] =
    useState<academicsFilterhProps>(initialValues);
  const [sectionDetails, setSectionDetails] = useState<any>({});
  const [selectedDropDownDetails, setSelectedDropDownDetails] = useState<any>({
    academicId: "",
    classId: "",
  });
  const [filterState, setFilterState] = useState({
    orderBy: "asc",
    sortBy: "sectionName"
  })
  const [assignClassModalState, setAssignClassModalState] =
    useState<IAcademicsModal>({
      showModal: false,
    });

  const [assignTeacherModalState, setAssignTeacherModalState] =
    useState<IAcademicsModal>({
      showModal: false,
    });

  const [addStudentModalState, setAddStudentModalState] =
    useState<IAcademicsModal>({
      showModal: false,
    });
  const [showStudentModalState, setShowStudentModalState] =
    useState<IAcademicsModal>({
      showModal: false,
    });

  const { closeModal: closeDeleteSectionModal, modalState: deleteSectionModalState, openModal: openDeleteSectionModal } = useModal();
    

  const getSectionListResp = (otherProps?: any) => {

    let payload = { branchClassId: academicsFilterState.branchClassId || null, masterAcademicYearId: academicsFilterState.masterAcademicYearId, pageNo: academicsFilterState.pageNo, searchString: academicsFilterState.searchString, pageSize: academicsFilterState.pageSize, sortBy: filterState.sortBy, orderBy: filterState.orderBy, ...otherProps }
    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
    }
  }
  const getSectionFilterListResp = (otherProps?: any) => {

    let payload = { branchClassId: academicsFilterState.branchClassId || null, masterAcademicYearId: academicsFilterState.masterAcademicYearId, pageNo: academicsFilterState.pageNo, pageSize: academicsFilterState.pageSize, sortBy: filterState.sortBy, orderBy: filterState.orderBy, ...otherProps }
    if (payload.branchClassId && payload.masterAcademicYearId && loggedInUserRole === "TEACHER") {
      dispatch(
        sectionListFilterAct(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
    }
  }

  const {
    sectionListResp,
    updateSectionStudentsResp,
    removeSectionStudentsResp,
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    classroomManagmentErrorResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    loggedInUserRole,
    sectionListFilterResp,
    showApiLoader,
    deleteSectionListResp,
  }: any = useAppSelector(
    ({ classroomManagmentInfo, instAcademics, branchAcademics, appData, globalData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      updateSectionStudentsResp:
        classroomManagmentInfo.updateSectionStudentsResp,
      removeSectionStudentsResp:
        classroomManagmentInfo.removeSectionStudentsResp,
      classroomManagmentErrorResp:
        classroomManagmentInfo.classroomManagmentErrorResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      loggedInUserRole: appData.loggedInUserRole,
      sectionListFilterResp: classroomManagmentInfo.sectionListFilterResp,
      showApiLoader: globalData.showApiLoader,
      deleteSectionListResp: classroomManagmentInfo.deleteSectionListResp,

    }),
    shallowEqual
  );

  const UpdateClassroomRef = useRef<any>({
    prevRemoveStudentResp: removeSectionStudentsResp,
    prevUpdateSectionStudentsResp: updateSectionStudentsResp,
    prevUpdateClassroomErrResp: classroomManagmentErrorResp,
    prevDeleteSectionListResp: deleteSectionListResp,
  });


  useEffect(() => {

    const { prevUpdateClassroomErrResp, prevUpdateSectionStudentsResp, prevRemoveStudentResp, prevDeleteSectionListResp } =
      UpdateClassroomRef.current;

    if (removeSectionStudentsResp && removeSectionStudentsResp !== prevRemoveStudentResp) {
      getSectionListResp();
    }
    else if (updateSectionStudentsResp && updateSectionStudentsResp !== prevUpdateSectionStudentsResp) {
      toast.success('Student Added Successfully')
      toggleAddStudentModal({ sectionDetails: sectionDetails });
      getSectionListResp();
    }
    else if (classroomManagmentErrorResp &&
      prevUpdateClassroomErrResp !== classroomManagmentErrorResp) {
      let { details } = classroomManagmentErrorResp || {};
      toast.error(details);
    }
    else if (deleteSectionListResp && deleteSectionListResp !== prevDeleteSectionListResp) {
      toast.success('Section Deleted Successfully')
      getSectionListResp();
      closeDeleteSectionModal()
    }
    UpdateClassroomRef.current.prevUpdateClassroomErrResp = classroomManagmentErrorResp;
    UpdateClassroomRef.current.prevRemoveStudentResp = removeSectionStudentsResp;
    UpdateClassroomRef.current.prevUpdateSectionStudentsResp = updateSectionStudentsResp;
    UpdateClassroomRef.current.prevDeleteSectionListResp = deleteSectionListResp;
  }, [classroomManagmentErrorResp, removeSectionStudentsResp, updateSectionStudentsResp, deleteSectionListResp]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: academicsFilterForm.values.masterAcademicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: academicsFilterForm.values.masterAcademicYearId, curriculumId: academicsFilterForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  useEffect(() => {
    return () => {
      dispatch(resetBrchClassAct(undefined))
      dispatch(resetClassroomManagement(undefined))
    }
  }, []);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setAcademicsFilterState((prev: any) => ({ ...prev, masterAcademicYearId: yearId }))
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp, branchId, instituteId]);
  
  useEffect(() => {
    const { data } = brchCurriculumResp || {};

    if (Array.isArray(data) && data.length > 0) {
      const payload = { branchId: branchId, curriculumId: data[0].branchCurriculumId, academicYearId: academicsFilterState.masterAcademicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      if (payload.academicYearId && payload.curriculumId) {
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
      setAcademicsFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
    }
  }, [brchCurriculumResp])
  
  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0) {
      setAcademicsFilterState((prev: any) => ({ ...prev, branchClassId: content[0].id }))
      getSectionListResp({ branchClassId: content[0].id });
      getSectionFilterListResp({ branchClassId: content[0].id });
    }
  }, [branchClassResp])
  useEffect(() => {
    updateSectionStudentsResp &&
      updateSectionStudentsResp.status === 200 &&
      setAddStudentModalState({
        ...addStudentModalState,
        showModal: false,
      });
  }, [updateSectionStudentsResp]);

  useEffect(() => {
    if (sectionDetails && sectionListResp) {
      sectionListResp.data.map((section: any) => {
        if (section.sectionId === sectionDetails.sectionId) {
          setSectionDetails(section)
        }
      })
    }
  }, [sectionListResp])

  const academicsFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: academicsFilterState,
    onSubmit: (values) => { },
  });

  const toggleAssignClassModal = useCallback(
    ({ sectionDetails, apiCall }: ISectionDetails) => {
      setSectionDetails(sectionDetails);

      setAssignClassModalState((prevState) => ({
        ...prevState,
        showModal: !prevState.showModal,
      }));

      if (apiCall) {
        getSectionListResp();
      }
    },
    [academicsFilterState]
  );

  const toggleAssignTeacherModal = useCallback(
    ({ sectionDetails, apiCall, notoggle }: ISectionDetails) => {
      setSectionDetails(sectionDetails);
      {
        !notoggle && setAssignTeacherModalState((prevState) => ({
          ...prevState,
          showModal: !prevState.showModal,
        }));
      }

      if (apiCall) {
        getSectionListResp();
      }
    },
    [academicsFilterState]
  );

  const toggleAddStudentModal = ({ sectionDetails, apiCall }: ISectionDetails) => {
    setSectionDetails(sectionDetails);
    setAddStudentModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };
  const toggleShowStudentModal = ({
    sectionDetails
  }: ISectionDetails) => {
    setSectionDetails(sectionDetails);
    setShowStudentModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const menuOptions = useMemo(
    () => [
      {
        id: "goTOSection",
        actionIcon: <HugeiconsIcon icon={EyeIcon} className="tw-mr-2 tw-inline-block" size={18} color="#878a99" />,
        actionName: "Go To Section",
        onClickHndlr: (event: any) => {
          const sectionId = event.currentTarget.getAttribute("data-id");

          moveToSectionDetailsHandler(sectionId);
        },
      },
      {
        id: "addStudent",
        actionIcon: <HugeiconsIcon icon={PlusSignSquareIcon} className="tw-mr-2" size={18} color="#878a99" />,
        actionName: "Add Students",
        onClickHndlr: (event: any) => {
          const sectionId = event.currentTarget.getAttribute("data-id");

          let details = sectionListResp && sectionListResp.data.find(
            (section: any) => section.sectionId === +sectionId
          );
          toggleAddStudentModal({
            sectionDetails: details
          });
        },
      },
      {
        id: "changeTeacher",
        actionIcon: <HugeiconsIcon icon={ElearningExchangeIcon} className="tw-mr-2" size={18} color="#878a99" />,
        actionName: "Change Class Teacher",
        onClickHndlr: (event: any) => {
          const sectionId = event.currentTarget.getAttribute("data-id");

          let details = sectionListResp && sectionListResp.data.find(
            (section: any) => section.sectionId === +sectionId
          );

          toggleAssignTeacherModal({
            sectionDetails: details
          });
        },
      },
      {
        id: "changeRoom",
        actionIcon: <HugeiconsIcon icon={MeetingRoomIcon} className="tw-mr-2" size={18} color="#878a99" />,
        actionName: "Change Room No.",
        onClickHndlr: (event: any) => {
          const sectionId = event.currentTarget.getAttribute("data-id");

          let details = sectionListResp && sectionListResp.data.find(
            (section: any) => section.sectionId === +sectionId
          );
          toggleAssignClassModal({
            sectionDetails: details
          });
        },
      },
      ...((loggedInUserRole === "INSTITUTE_ADMIN" || loggedInUserRole === "BRANCH_ADMIN")
        ? [{
          id: "delete",
          actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-mr-2 tw-text-red-500" size={18} />,
          actionName: "Delete",
          onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
            const id = event.currentTarget.getAttribute("data-id");
            openDeleteSectionModal(id)
          },
        }]
        : [])
    ],
    [sectionListResp, loggedInUserRole]
  );



  const moveToSectionDetailsHandler = (sectionId: string) => {
    history.push({
      pathname: "/section-management/section-detail",
      state: {
        sectionId: sectionId,
        academicYearId: academicsFilterForm.values.masterAcademicYearId,
      },
    });
  };

  const curriculumColumns = useMemo(
    () =>
      generateColumns(
        menuOptions,
        toggleAssignClassModal,
        toggleAssignTeacherModal,
        toggleShowStudentModal
      ),
    [sectionListResp]
  );

  function paginationHndlr(paginationInfo: IPaginationState) {
    setAcademicsFilterState((pre: any) => ({ ...pre, pageNo: paginationInfo.pageNo, pageSize: paginationInfo.pageSize }));
    getSectionListResp(paginationInfo);
  }
  const searchBarHandler = (event: any) => {
    academicsFilterForm.handleChange(event);
    setAcademicsFilterState((prev: any) => ({ ...prev, searchString: event.target.value }))
    getSectionListResp({ searchString: event.target.value })
  };
  const filterHandler = (event: any) => {
    academicsFilterForm.handleChange(event);
    const { name, value } = event.target;
    setAcademicsFilterState((prev: any) => {
      if (name === 'masterAcademicYearId') {
        return { ...prev, [name]: value, curriculumId: "", branchClassId: "" };
      }
      if (name === 'curriculumId') {
        return { ...prev, [name]: value, branchClassId: "" };
      }
      return { ...prev, [name]: value };
    });
    if (name === 'masterAcademicYearId') {
      getCurriculumApiCall({ academicYearId: value });
    } else if (name === 'curriculumId') {
      getClassApiCall({
        [name]: value,
        academicYearId: academicsFilterState.masterAcademicYearId,
      });
    } else if (name === 'branchClassId') {
      getSectionListResp({ branchClassId: value });
      getSectionFilterListResp({ branchClassId: value });
    } else {
      getSectionListResp({ [name]: value });
    }
  }

  const sortByPrevRef = useRef<Array<sortRef>>([{
    id: "termName",
    desc: false
  }])
  const sortingHandler = useCallback((sortBy: any) => {

    const sortByPrev = sortByPrevRef.current;
    setFilterState((prev: any) => ({ ...prev, sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" }))
    if (sortBy && sortByPrev !== sortBy) {
      getSectionListResp({ sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" })
    }
    sortByPrevRef.current = sortBy;
  }, [filterState])

  const deleteTemplateHandler = () => {
    dispatch(
      deleteSectionListAct(
        generateActionPayload("delete_section_list", { sectionId: deleteSectionModalState.modalData, academicYearId: academicsFilterState.masterAcademicYearId })
      )
    );
  };

  const { data: academicYearList } = academicYearListResp || {};
  const { data: SectionList, totalPages, totalElements, pageNumber } = sectionListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Classroom Management" pageTitle="Academics" />
          <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-flex-1">
                  Classroom Management
                </h4>
              </div>
            </div>
            <div className="tw-p-0">
              <div className="tw-px-4 tw-pt-4 tw-pb-3">
                <form onSubmit={academicsFilterForm.handleSubmit}>
                  <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                    <div className="tw-col-span-12 lg:tw-col-span-3">
                      <div className="search-box">
                        <TextInput
                          name="searchString"
                          value={academicsFilterForm.values.searchString}
                          onChange={searchBarHandler}
                          formgroupClassName="tw-mb-0"
                          placeHolder="Search"
                          labelText="Search"
                          floatingLabel
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </div>
                    <div className="tw-col-span-12 lg:tw-col-span-2">
                      <SelectInput
                        name="masterAcademicYearId"
                        value={academicsFilterForm.values.masterAcademicYearId}
                        onChange={filterHandler}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        labelText="Academic Year"
                        floatingLabel
                      />
                    </div>
                    <div className="tw-col-span-12 lg:tw-col-span-2">
                      <SelectInput
                        name="curriculumId"
                        value={academicsFilterForm.values.curriculumId}
                        onChange={filterHandler}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        formgroupClassName="tw-mb-0"
                        labelText="Curriculum"
                        floatingLabel
                      />
                    </div>
                    <div className="tw-col-span-12 lg:tw-col-span-2">
                      <SelectInput
                        name="branchClassId"
                        value={academicsFilterForm.values.branchClassId}
                        onChange={filterHandler}
                        menuItems={classTypes || []}
                        valueKey="id"
                        textKey="shortName"
                        formgroupClassName="tw-mb-0"
                        labelText="Class"
                        floatingLabel
                      />
                    </div>
                    {loggedInUserRole === "TEACHER" && (
                      <div className="tw-col-span-12 lg:tw-col-span-2">
                        <SelectInput
                          name="sectionId"
                          value={academicsFilterForm.values.sectionId}
                          onChange={filterHandler}
                          menuItems={sectionListFilterResp?.data || []}
                          valueKey="sectionId"
                          textKey="sectionName"
                          formgroupClassName="tw-mb-0"
                          labelText="Section"
                          floatingLabel
                        />
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <TableContainer
                columns={curriculumColumns || []}
                data={SectionList || []}
                divClass="table-responsive tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-muted tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
                sortingHandler={sortingHandler}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="assign-classroom-modal"
        isOpen={assignClassModalState.showModal}
        toggle={toggleAssignClassModal}
        modalTitle="Assign Class Room"
        modalSize="md"
      >
        <AssignClassroomModal
          isOpen={assignClassModalState.showModal}
          toggle={toggleAssignClassModal}
          modalTitle={"Assign Class Room"}
          sectionDetails={sectionDetails}
          instituteId={instituteId}
          instituteName={"Assign Class"}
          branchId={branchId}
          editBranchDetails={""}
          academicDetails={selectedDropDownDetails}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="assign-teacher-modal"
        isOpen={assignTeacherModalState.showModal}
        // toggle={toggleAssignTeacherModal}
        toggle={() => toggleAssignTeacherModal({ sectionDetails: sectionDetails })}
        modalTitle="Assign Class Teacher"
        modalSize="md"
      >
        <AssignTeacherModal
          isOpen={assignTeacherModalState.showModal}
          toggle={toggleAssignTeacherModal}
          modalTitle="Assign Class Teacher"
          instituteId={instituteId}
          instituteName={"Assign Teacher"}
          sectionDetails={sectionDetails}
          academicDetails={selectedDropDownDetails}
          branchId={branchId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="add-student-modal"
        isOpen={addStudentModalState.showModal}
        toggle={() => toggleAddStudentModal({ sectionDetails: sectionDetails })}
        modalTitle="Add Students"
        modalSize="md"
      >

        <AddStudentModal
          isOpen={addStudentModalState.showModal}
          toggle={toggleAddStudentModal}
          modalTitle="Add Students"
          instituteId={instituteId}
          academicYearId={academicsFilterState?.masterAcademicYearId}
          instituteName={"Add Students"}
          sectionDetails={sectionDetails}
          academicDetails={selectedDropDownDetails}
          branchId={branchId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="show-student-modal"
        isOpen={showStudentModalState.showModal}
        toggle={() => toggleShowStudentModal({ sectionDetails: props.sectionDetails })}
        modalTitle="Students"
        modalSize="md"
      >

        <ShowStudentModal
          isOpen={showStudentModalState.showModal}
          toggle={toggleShowStudentModal}
          modalTitle="Students"
          instituteId={instituteId}
          instituteName={"Students"}
          sectionDetails={sectionDetails}
          branchId={branchId}
          academicDetails={selectedDropDownDetails}
          editBranchDetails={""}
          academicYearId={academicsFilterForm.values.masterAcademicYearId}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="edelete-section-in-academics-modal"
        isOpen={deleteSectionModalState.showModal}
        toggle={closeDeleteSectionModal}
        modalTitle="Delete Section"
        modalSize="md"
      >
        <ExportModal
          isOpen={deleteSectionModalState.showModal}
          toggle={closeDeleteSectionModal}
          instituteId={instituteId}
          branchId={""}
          submitHndlr={deleteTemplateHandler}
          feature="academic"
          subFeature={"class_by_branch_status"}
          remarksText="Enter remarks to Delete Section?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default NewAcademics;
