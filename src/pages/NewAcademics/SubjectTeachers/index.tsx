import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Card, CardBody, Col, Container, Row, CardHeader } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  SelectInput,
  TextInput,
  UserDetails,
} from "../../../Components/Common";
import {
  AssignSubjectModalType,
  ConfirmationModalType,
  SubjectTeacherFilterhProps,
} from "./subjectTeacherTypes";
import {
  generateColumns,
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import AssignSubjectModal from "./AssignSubjectModal";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  clearSubjectsOfTeacherTableData,
  deleteSubjectTeacher,
  getSubjectTeacherTableData,
} from "../../../store/academic/classTeacher/classteacheractions";
import { shallowEqual } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { getEmployeeCategoriesAct, getEmployeeStatusAct } from "../../../store/masterdata/masterdataactions";
import { getBranchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ConformationModal from "./ConformationModal";
import { debounce, searhWithTextInList } from "../../../utility/commonutility";
import { getTeacherList } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../hooks/modalhook";
import Button from "../../../Components/Common/Button";

const initialValues: SubjectTeacherFilterhProps = {
  searchString: "",
  masterAcademicYearId: "",
  curriculumId: "",
  activeTeacherId: ""
};

const SubjectTeachers = () => {
  const [subjectTeacherFilterState, setSubjectTeacherFilterState] =
    useState<SubjectTeacherFilterhProps>(initialValues);
  const { closeModal: closeDelGradeDistributionModal, modalState: delGradeDistributionModalState, openModal: openDelGradeDistributionModal } = useModal();
  const [orgTeacherList, setOrgTeacherList] = useState<any>([]);
  const [teacherList, setTeacherList] = useState<any>([]);
  const [filterState, setFilterState] = useState({
    pageNo: 0,
    pageSize: 10
  });
  const [deletedSubject, setDeletedSubject] = useState<any>();
  const [selectedDropDown, setSelectedDropDown] = useState({
    academicId: "",
  });
  const [subjectTeacherDetails, setSubjectTeacherDetails] = useState<any>([]);

  const { teacherListResp, employeesListResp, employeeStatusResp, employeeCategoriesResp, brchCurriculumResp, subjectTeacherTableData, deleteSubjectOfTeacherResp, assignSubjectToTeacherResp, updateAssignSubjectToTeacherResp, assignSubjectToTeacherErrorResp, academicYearListResp, currentBranchIdResp: branchId, currentInstIdResp: instituteId, showApiLoader } = useAppSelector(
    ({ classroomManagmentInfo, directoryEmployee, branchAcademics, classteacherInfo, instAcademics, masterData, appData, globalData }) => ({
      teacherListResp: classroomManagmentInfo.teacherListResp,
      employeesListResp: directoryEmployee.employeesListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      employeeStatusResp: masterData.employeeStatusResp,
      employeeCategoriesResp: masterData.employeeCategoriesResp,
      subjectTeacherTableData: classteacherInfo.subjectTeacherTableData,
      deleteSubjectOfTeacherResp: classteacherInfo.deleteSubjectOfTeacherResp,
      assignSubjectToTeacherResp: classteacherInfo.assignSubjectToTeacherResp,
      updateAssignSubjectToTeacherResp: classteacherInfo.updateAssignSubjectToTeacherResp,
      assignSubjectToTeacherErrorResp: classteacherInfo.assignSubjectToTeacherErrorResp,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,

    }),
    shallowEqual
  );

  const [assignSubjectModalState, setAssignSubjectModalState] =
    useState<AssignSubjectModalType>({
      showModal: false,
      editData: undefined
    });

  const getEmployees = (otherProps?: any) => {
    let statusID = employeeStatusResp && employeeStatusResp.find((status: any) => status.empStatusName.toLowerCase() === 'active').id
    let categoryID = employeeCategoriesResp && employeeCategoriesResp.find((category: any) => category.categoryName.toLowerCase() === 'teachers').employeeCategoryId
    let filterState = { ...subjectTeacherFilterState, ...otherProps }
    if (filterState.masterAcademicYearId && filterState.curriculumId) {
      const params = { branchId: branchId, pageNo: 0, pageSize: 2000, status: statusID, employeeCategoryId: categoryID, searchString: filterState.searchString, ...otherProps }
      dispatch(getTeacherList(generateActionPayload("get_employees", undefined, params)));
    }

  }
  const getSubjectListOfTeacher = (otherProps?: any) => {
    const { masterAcademicYearId, curriculumId } = subjectTeacherFilterState;
    if (masterAcademicYearId && curriculumId) {
      let params = { academicYearId: subjectTeacherFilterState.masterAcademicYearId, branchCurriculumId: subjectTeacherFilterState.curriculumId, teacherId: subjectTeacherFilterState.activeTeacherId, ...filterState, ...otherProps }
      dispatch(
        getSubjectTeacherTableData(
          generateActionPayload("get_subject_list_of_teacher", undefined, params)
        )
      )
    }
  }

  const toggleAssignSubjectModal = () => {
    setAssignSubjectModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      editData: undefined
    }));
  };

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-mr-2 tw-text-gray-500" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          const subjectdes = subjectTeacherTableData?.data.find((teacher: any) => teacher.id === +id) || {};
          setAssignSubjectModalState((prev) => ({ ...prev, showModal: true, editData: subjectdes, }));
        },
      },
         {
            id: "delete",
            actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-mr-2 tw-text-red-500" size={18} />,
            actionName: "Delete",
            onClickHndlr: (event: any) => {
                const id = Number(event.currentTarget.getAttribute("data-id"));
                const subjectDes = subjectTeacherTableData?.data.find(
                    (teacher: any) => teacher.id === id
                );
                if (subjectDes) {
                    openDelGradeDistributionModal(subjectDes);
                }
            }
        },
    ],
    [subjectTeacherTableData]
  );

  function delModalSubmitHndlr() {
    const deletedSubject = delGradeDistributionModalState.modalData;
    const params = {
      academicYearId: subjectTeacherFilterState.masterAcademicYearId,
      branchClassId: deletedSubject.classId,
      languageId: deletedSubject.languageId,
      subjectId: deletedSubject.branchClassSubjectId,
      teacherId: subjectTeacherFilterState.activeTeacherId,
    };
    dispatch(
      deleteSubjectTeacher(
        generateActionPayload(
          "delete_subject_of_teacher",
          params
        )
      )
    );
  }
  const curriculumColumns = useMemo(
    () => generateColumns(menuOptions),
    [subjectTeacherTableData]
  );
  const dispatch = useAppDispatch();

  const academicTitleChangeHandler = (academicId: string) => {
    setSelectedDropDown({ academicId: academicId });
    dispatch(
      getSubjectTeacherTableData(
        generateActionPayload("get_subject_list_of_teacher", {
          teacherId: "27505fab-0f03-497e-b1c1-dc02ea704593",
          academicId: academicId,
        })
      )
    );
  };

  const teacherHandler = (event: any) => {
    const id = event.currentTarget.getAttribute("data-id");
    setSubjectTeacherFilterState((prev: any) => ({ ...prev, activeTeacherId: id }));
    setSubjectTeacherDetails(teacherListResp.filter((teacher: any) => teacher.id === +id)[0])
    getSubjectListOfTeacher({ teacherId: id });
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: subjectTeacherFilterState.masterAcademicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    setSubjectTeacherFilterState((prev: any) => ({ ...prev, [name]: value }))
    if (name === "masterAcademicYearId") {
      getEmployees({ [name]: value });
      getCurriculumApiCall({ academicYearId: value });
    }
    else if (name === "curriculumId") {
      getEmployees({ [name]: value });
      dispatch(clearSubjectsOfTeacherTableData(undefined));
    }
    else if (name === "searchString") {
      getEmployees({ [name]: value });
    }

  }

  function search(event: any) {

    let abc = searhWithTextInList(orgTeacherList, ['employeeName', 'employeeCode'], event.target.value);
    setTeacherList(abc);
  }
  const debounceFun = useCallback(debounce(search, 1000), [orgTeacherList])
  const searchHandler = (event: any) => {
    const { name, value } = event.target;
    setSubjectTeacherFilterState(prev => ({ ...prev, [name]: value }))
    debounceFun(event)

  }

  const UpdateSubjectOfTeacherRespRef = useRef<any>({
    prevDeleteSubjectOfTeacherRep: deleteSubjectOfTeacherResp,
    prevAssignSubjectToTeacherResp: assignSubjectToTeacherResp,
    prevUpdateAssignedSubjectToTeacherResp: updateAssignSubjectToTeacherResp,
    prevAssignSubjectToTeacherErrorResp: assignSubjectToTeacherErrorResp,
  })

  useEffect(() => {
    const { prevDeleteSubjectOfTeacherRep, prevAssignSubjectToTeacherResp, prevUpdateAssignedSubjectToTeacherResp, prevAssignSubjectToTeacherErrorResp } = UpdateSubjectOfTeacherRespRef.current;
    if (deleteSubjectOfTeacherResp &&
      deleteSubjectOfTeacherResp !== prevDeleteSubjectOfTeacherRep) {
      toast.success("Subject Removed Successfully.");
      getSubjectListOfTeacher({ teacherId: subjectTeacherFilterState.activeTeacherId });
      closeDelGradeDistributionModal();
    }
    if (assignSubjectToTeacherResp &&
      assignSubjectToTeacherResp !== prevAssignSubjectToTeacherResp) {
      toast.success(`Subjects Added Successfully.`);
      toggleAssignSubjectModal();
      getSubjectListOfTeacher({ teacherId: subjectTeacherFilterState.activeTeacherId });
    }
    else if (updateAssignSubjectToTeacherResp && updateAssignSubjectToTeacherResp !== prevUpdateAssignedSubjectToTeacherResp) {
      toast.success('Subject Edited Successfully.');
      toggleAssignSubjectModal();
      getSubjectListOfTeacher({ teacherId: subjectTeacherFilterState.activeTeacherId })
    }
    else if (assignSubjectToTeacherErrorResp && assignSubjectToTeacherErrorResp !== prevAssignSubjectToTeacherErrorResp) {
      const { details } = assignSubjectToTeacherErrorResp || {};
      toast.error(details);
    }
    UpdateSubjectOfTeacherRespRef.current.prevDeleteSubjectOfTeacherRep = deleteSubjectOfTeacherResp;
    UpdateSubjectOfTeacherRespRef.current.prevUpdateAssignedSubjectToTeacherResp = updateAssignSubjectToTeacherResp;
    UpdateSubjectOfTeacherRespRef.current.prevAssignSubjectToTeacherResp = assignSubjectToTeacherResp;
    UpdateSubjectOfTeacherRespRef.current.prevAssignSubjectToTeacherErrorResp = assignSubjectToTeacherErrorResp;
  }, [deleteSubjectOfTeacherResp, assignSubjectToTeacherResp, assignSubjectToTeacherErrorResp, updateAssignSubjectToTeacherResp]);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    setSubjectTeacherFilterState((prev: any) => ({ ...prev, masterAcademicYearId: yearId }))
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp])

  useEffect(() => {
    if (Array.isArray(teacherListResp) && teacherListResp.length > 0) {
      setSubjectTeacherFilterState((prev: any) => ({ ...prev, activeTeacherId: teacherListResp[0].id }));
      getSubjectListOfTeacher({ teacherId: teacherListResp[0].id });
      setSubjectTeacherDetails(teacherListResp[0]);
      setOrgTeacherList(teacherListResp);
      setTeacherList(teacherListResp);
    }
  }, [teacherListResp])

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    const { data } = brchCurriculumResp || {};
    if (Array.isArray(data) && data.length > 0) {
      setSubjectTeacherFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
      getEmployees({ masterAcademicYearId: yearId, curriculumId: data[0].branchCurriculumId })
    }
  }, [brchCurriculumResp])

  useEffect(() => {
    dispatch(getEmployeeStatusAct(generateActionPayload("get_employee_status")));
    dispatch(getEmployeeCategoriesAct(generateActionPayload("get_employee_categories")));
  }, []);

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { data: subjectList, pageNumber, totalPages, totalElements } = subjectTeacherTableData || {}


  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Subject Teacher" pageTitle="Academics" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Subject Teachers
              </h4>
            </div>
            <div className="tw-p-4">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-end">
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <SelectInput
                    name="masterAcademicYearId"
                    value={subjectTeacherFilterState.masterAcademicYearId}
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
                    value={subjectTeacherFilterState.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="tw-grid tw-grid-cols-12 tw-gap-6 tw-mb-5">
            <div className="tw-col-span-12 lg:tw-col-span-4">
              <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">
                <div className="tw-border-b tw-px-4 tw-py-3">
                  <h4 className="tw-mb-0 tw-text-base tw-font-semibold">
                    Teacher Name
                  </h4>
                </div>
                <div className="search-box tw-p-2">
                  <TextInput
                    name="searchString"
                    value={subjectTeacherFilterState.searchString}
                    onChange={searchHandler}
                    formgroupClassName="mb-0"
                    placeHolder="Search..."
                  />
                  <i className="ri-search-line search-icon"></i>
                </div>
                <div className="tw-max-h-[50vh] tw-overflow-y-auto">
                  <ul className="tw-m-0 tw-p-0">
                    {teacherList?.map((item: any, index: number) => (
                      <li
                        key={index}
                        data-id={item.id}
                        onClick={teacherHandler}
                        className={`
                tw-flex tw-items-center tw-px-3 tw-py-3 tw-border-b 
                tw-cursor-pointer tw-transition
                ${subjectTeacherFilterState.activeTeacherId == item.id
                            ? "tw-bg-blue-50"
                            : "hover:tw-bg-gray-50"
                          }
              `}
                      >
                        <UserDetails
                          imageUrl={item?.base64Image}
                          displayName={item?.employeeName}
                          displayId={item?.employeeCode}
                          defaultImgType="employee"
                          size="xs"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="tw-col-span-12 lg:tw-col-span-8">
              <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">
                <div className="tw-border-b tw-px-4 tw-py-3 tw-flex tw-items-center tw-justify-between">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Subjects & Classes
                  </h4>
                  <Button
                    type="button"
                    variant="primary"
                    className="tw-flex tw-items-center"
                    onClick={toggleAssignSubjectModal}
                  >
                    <i className="ri-add-line tw-mr-2"></i>
                    Assign Subjects
                  </Button>
                </div>
                <div>
                  <TableContainer
                    columns={curriculumColumns || []}
                    data={subjectList || []}
                    divClass="tw-table-responsive"
                    theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="assign-subjects-modal"
        isOpen={assignSubjectModalState.showModal}
        toggle={toggleAssignSubjectModal}
        modalTitle="Assign Subjects"
        modalSize="lg"
      >

        <AssignSubjectModal
          isOpen={assignSubjectModalState.showModal}
          toggle={toggleAssignSubjectModal}
          modalTitle="Assign Subjects"
          instituteId={instituteId}
          instituteName={"Assign Subjects"}
          branchId={branchId}
          academicDetails={selectedDropDown}
          editBranchDetails={""}
          teacherData={subjectTeacherDetails}
          filterState={subjectTeacherFilterState}
          editData={assignSubjectModalState.editData}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-grade-distribution"
        isOpen={delGradeDistributionModalState.showModal}
        confirmMessage="Are you sure you want to delete a subject !"
        cancelHndlr={closeDelGradeDistributionModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default SubjectTeachers;
