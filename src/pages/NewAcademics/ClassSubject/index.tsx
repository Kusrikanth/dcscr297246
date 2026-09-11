import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Container,
} from "reactstrap";
import classnames from "classnames";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import BookmarkCard from "../../../Components/Common/BookmarkCard";
import {
  generateColumns,
  subjectType,
} from "./helper";
import { ModalContainerUpdated, MoreActions, SelectInput, TextInput } from "../../../Components/Common";
import {
  academicDetails,
  addClassSubjectOpenModal,
  classSubjectCardData,
  classSubjectFilterhProps,
  classSubjetcTabSwitchState,
} from "./classSubjectTypes";
import TableContainer from "../../../Components/Common/TableContainer";
import ClassSubjectModal from "./ClassSubjectModal";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import {
  delteClassSubjectsList,
  getAssignedClassSubjectsList,
} from "../../../store/academic/classSubjects/classsubjectsactions";
import {
  getClassDetails,
} from "../../../store/academic/assignGroup/assigngroupactions";
import { default as BlueBookIcon } from "../../../assets/imagesdps/academics/BlueBookIcon.svg?react";
import { default as SkyBlueBookIcon } from "../../../assets/imagesdps/academics/SkyBlueBookIcon.svg?react";
import { default as GreenBookIcon } from "../../../assets/imagesdps/academics/GreenBookIcon.svg?react";
import { default as PinkBookIcon } from "../../../assets/imagesdps/academics/PinkBookIcon.svg?react";
import { default as YellowBook } from "../../../assets/imagesdps/academics/YellowBook.svg?react";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from "./ConfirmationModal";
import NoDataComp from "../../../Components/Common/NoDataComp";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../hooks/modalhook";
import AssignTeacherModal from "./AssignTeacherModal";
import { getEmployeeCategoriesAct, getEmployeeStatusAct } from "../../../store/masterdata/masterdataactions";
import { debounce } from "../../../utility/commonutility";
import Button from "../../../Components/Common/Button";


const initialValues: classSubjectFilterhProps = {
  academicYearId: "",
  branchClassId: "",
  curriculumId: "",
  subjectName: "",
  subjectType: "",
};
const filterData = {
  pageNo: 0,
  pageSize: 100,
  sortBy: 'subjectName',
  orderBy: 'asc'
}

const ClassSubjects = () => {
  const [branchState, setBranchState] = useState<classSubjetcTabSwitchState>({
    isListMode: true,
  });
  const [deletedSubjectId, setDeletedSubjectId] = useState();
  const [selectedClass, setSelectedClass] = useState('');
  const [academicDetails, setAcademicDetails] = useState<academicDetails>({
    academicId: "",
    branchClassId: "",
  });
  const {openModal: openClassSubjectModalHnldr, closeModal: closeClassSubjectModalHnldr, modalState: classSubjectModalState} = useModal()
  const [filterState, setFilterState] = useState<any>(filterData);
  // const [classSubjectTableList, setClassSubjectTableList] = useState<
  //   Array<classSubjectTableData>
  // >([]);
  const [classSubjectList, setClassSubjectList] = useState<
    Array<classSubjectCardData>
  >([]);
  const [academicDropDown, setAcademicDropDown] = useState<
    Array<{ academicTitle: string; id: string }>
  >([]);
  const [classDropDown, setClassDropDown] = useState<
    Array<{ classTitle: string; id: string }>
  >([]);

  const {
    assignedClassSubjectsListResp,
    updateAcademicSubjectsListResp,
    deleteClassSubjectsListResp,
    classSubjectErrorResp,
    academicDetailsResp,
    classDetailsResp,
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    saveSubjectTeacherResp,
    loggedInUserRole
  } = useAppSelector(
    ({ classSubjectsInfo, assignGroupInfo, appData, instAcademics, branchAcademics, globalData }) => ({
      assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
      updateAcademicSubjectsListResp: classSubjectsInfo.updateAcademicSubjectsListResp,
      deleteClassSubjectsListResp:
        classSubjectsInfo.deleteClassSubjectsListResp,
      classSubjectErrorResp:
        classSubjectsInfo.classSubjectErrorResp,
      academicDetailsResp: assignGroupInfo.academicDetailsResp,
      classDetailsResp: assignGroupInfo.classDetailsResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      showApiLoader: globalData.showApiLoader,
      saveSubjectTeacherResp: classSubjectsInfo.saveSubjectTeacherResp,
      loggedInUserRole: appData.loggedInUserRole,

    }),
    shallowEqual
  );
  const [addSubjectModalState, setAddSubjectModalState] =
    useState<addClassSubjectOpenModal>({
      showModal: false,
      branchId: "",
    });
  const [confirmationModalState, setConfirmationModalState] =
    useState<addClassSubjectOpenModal>({
      showModal: false,
      branchId: "",
    });
  const [classSubjectFilterState, setClassSubjectFilterState] =
    useState<classSubjectFilterhProps>(initialValues);

  const toggleAddSubjectModal = () => {
    setAddSubjectModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };
  const toggleConfirmationModal = () => {
    setConfirmationModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  // const ClassSubjectFilterForm = useFormik({
  //   enableReinitialize: true,
  //   initialValues: classSubjectFilterState,
  //   onSubmit: (values) => {},
  // });

  function branchViewHandler(event: React.MouseEvent<HTMLElement>) {
    const viewMode = event.currentTarget.getAttribute("data-view");
    setBranchState((prevState) => ({
      ...prevState,
      isListMode: viewMode === "list",
    }));
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-mr-2 tw-text-red-500" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          let subjectId = event.currentTarget.getAttribute("data-id");
          setDeletedSubjectId(subjectId);
          toggleConfirmationModal();
          // let deletedData = classSubjectList.filter(
          //   (subject: any) => subject.id !== subjectId
          // );
          // let subjectIds = deletedData.map((sub) => sub.id);
          // dispatch(
          //   delteClassSubjectsList(
          //     generateActionPayload(
          //       "delete_class_subject_list",
          //       {
          //         subjectId:subjectId,
          //         branchClassId:classSubjectFilterState.branchClassId
          //       }
          //     )
          //   )
          // );
        },
      },
    ],
    [classSubjectList]
  );
  const actionOptions = useMemo(
    () => [
      {
        id: "delete",
        actionIcon: <i className="tw-text-red-600 ri-delete-bin-5-fill tw-text-base tw-mr-2"></i>,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          let subjectId = event.currentTarget.getAttribute("data-id");
          setDeletedSubjectId(subjectId);
          toggleConfirmationModal();
        },
      },
    ],
    [classSubjectList]
  );

  const RemoveSubejctHandler = () => {

    dispatch(
      delteClassSubjectsList(
        generateActionPayload(
          "delete_class_subject_list",
          {
            subjectId: deletedSubjectId,
            academicYearId: classSubjectFilterState.academicYearId,
            branchClassId: classSubjectFilterState.branchClassId,
            curriculumId: classSubjectFilterState.curriculumId
          }
        )
      )
    );
  }
  const classSubjectColumns = useMemo(
    () => generateColumns(menuOptions,openClassSubjectModalHnldr),
    [menuOptions]
  );
  const dispatch = useAppDispatch();

  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: classSubjectFilterState?.academicYearId, curriculumId: classSubjectFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: classSubjectFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  useEffect(() => {
    let arr: Array<classSubjectCardData> = [];
    // let arr2: Array<classSubjectCardData> = [];
    let colors = [
      { component: <YellowBook />, color: "#fff3d3", bookColor: "#e4a90a" },
      { component: <BlueBookIcon />, color: "#D3E0FF", bookColor: "#0242d9" },
      { component: <SkyBlueBookIcon />, color: "#D8EDF9", bookColor: "#007ee6" },
      { component: <PinkBookIcon />, color: "#FDE3DE", bookColor: "#be1d5c" },
      { component: <GreenBookIcon />, color: "#DDF6E9", bookColor: "#0ab39c" },
    ];
    classSubjects &&
      classSubjects.map((subject: any) => {
        let Book = colors[Math.floor(Math.random() * 5)];
        arr.push({
          id: subject.subjectId,
          cardName: subject.subjectName,
          subName: subject.subjectType,
          image: Book.component,
          color: Book.color,
          shortName: subject.shortCode,
          bookColor: Book.bookColor
        });
        // subject.assignedToClass &&
        //   arr2.push({
        //     id: subject.subjectId,
        //     cardName: subject.subjectName,
        //     subName: subject.subjectType,
        //     image: Book.component,
        //     color: Book.color,
        //   });
      });
    setClassSubjectList(arr);
    // setClassSubjectList(arr2);
  }, [assignedClassSubjectsListResp]);
  // useEffect(() => {
  //   let arr =
  //     academicDetailsResp &&
  //     academicDetailsResp.map((academic: any) => {
  //       return {
  //         academicTitle: `${academic?.academicYear?.name} ${academic?.branchCurriculum?.name}`,
  //         id: academic?.id,
  //       };
  //     });
  //   setAcademicDropDown(arr);
  // }, [academicDetailsResp]);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
    setClassSubjectFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    getCurriculumApiCall({ academicYearId: yearId })
  }, [academicYearListResp])

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    if (Array.isArray(data) && data.length > 0 && classSubjectFilterState.academicYearId) {
      const payload = { branchId, curriculumId: data[0].branchCurriculumId, academicYearId: classSubjectFilterState.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      setClassSubjectFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }));
    }
  }, [brchCurriculumResp, classSubjectFilterState.academicYearId]);

  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0) {
      setClassSubjectFilterState((prev: any) => ({ ...prev, branchClassId: content[0].id }));
      classSubjectListApicall({ branchClassId: content[0].id });
      setSelectedClass(content[0]?.className);
    }
  }, [branchClassResp])

  const classSubjectListApicall = (otherProps?: any) => {
    const { academicYearId, branchClassId, curriculumId } = classSubjectFilterState;
    const payload = { academicYearId: academicYearId, curriculumId: curriculumId, branchClassId: branchClassId, ...filterState, ...otherProps, isDropdownRequest: false }
    if (payload.academicYearId && payload.branchClassId) {
      dispatch(
        getAssignedClassSubjectsList(
          generateActionPayload("get_assigned_class_subject_list", undefined, payload)
        )
      );
    }
  }
  const UpdateSubjectListRespRef = useRef<any>({
    prevDeleteSubjectListRep: deleteClassSubjectsListResp,
    prevUpdateSubjectListRep: updateAcademicSubjectsListResp,
    prevClassSubjectErrorResp: classSubjectErrorResp,
    prevSaveSubjectTeacherResp: saveSubjectTeacherResp
  })

  useEffect(() => {

    const { prevDeleteSubjectListRep, prevUpdateSubjectListRep, prevClassSubjectErrorResp, prevSaveSubjectTeacherResp } = UpdateSubjectListRespRef.current;
    if (deleteClassSubjectsListResp && deleteClassSubjectsListResp !== prevDeleteSubjectListRep) {
      toast.success('Class Subject Deleted Successfully.');
      classSubjectListApicall();
      toggleConfirmationModal();
    }
    else if (updateAcademicSubjectsListResp && updateAcademicSubjectsListResp !== prevUpdateSubjectListRep) {
      toast.success('Class Subject Added Successfully.');
      toggleAddSubjectModal();
      classSubjectListApicall();
    }
    else if (classSubjectErrorResp && classSubjectErrorResp !== prevClassSubjectErrorResp) {
      const { details } = classSubjectErrorResp
      toast.error(details);
    }
    else if (saveSubjectTeacherResp && saveSubjectTeacherResp !== prevSaveSubjectTeacherResp) {
      toast.success('Subject Teacher Assigned Successfully.');
      classSubjectListApicall();
      closeClassSubjectModalHnldr();
    }
    // deleteClassSubjectsListResp &&
    // deleteClassSubjectsListResp.status == 200 &&
    //   setAddSubjectModalState((prevState) => ({
    //     ...prevState,
    //     showModal: false,
    //   }));
    // updateAcademicSubjectsListResp &&
    //   updateAcademicSubjectsListResp.status == 200 &&
    //   dispatch(
    //     getClassSubjectsList(
    //       generateActionPayload("get_class_subject_list", {
    //         classId: academicDetails.branchClassId,
    //         academicId: academicDetails.academicId,
    //       })
    //     )
    //   );
    UpdateSubjectListRespRef.current.prevDeleteSubjectListRep = deleteClassSubjectsListResp;
    UpdateSubjectListRespRef.current.prevUpdateSubjectListRep = updateAcademicSubjectsListResp;
    UpdateSubjectListRespRef.current.prevClassSubjectErrorResp = classSubjectErrorResp;
    UpdateSubjectListRespRef.current.prevSaveSubjectTeacherResp = saveSubjectTeacherResp;
  }, [deleteClassSubjectsListResp, classSubjectErrorResp, updateAcademicSubjectsListResp, saveSubjectTeacherResp]);
  useEffect(() => {
    let arr =
      classDetailsResp &&
      classDetailsResp.map((cls: any) => {
        return {
          classTitle: `${cls?.branchClass?.instituteClassEntity?.name}`,
          id: cls?.id,
        };
      });
    setClassDropDown(arr);
  }, [classDetailsResp]);

  useEffect(() => {
    dispatch(getEmployeeStatusAct(generateActionPayload("get_employee_status")));
    dispatch(getEmployeeCategoriesAct(generateActionPayload("get_employee_categories")));
  }, []);

  const filterHandler = (event: any) => {
    // ClassSubjectFilterForm.handleChange(event);
    const { name, value } = event.target;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      setClassSubjectFilterState(prev => ({ ...prev, [name]: value, branchClassId: "", curriculumId: "" }))
    }
    else if (name === "curriculumId") {
      if (!value) {
        dispatch(resetBrchClassAct(undefined))
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: classSubjectFilterState.academicYearId });
        setClassSubjectFilterState(prev => ({ ...prev, [name]: value, branchClassId: "" }))
      }
    }
    else if (name === "branchClassId") {
      const selected = classTypes.find((cls: any) => +cls.id === +value);
      setSelectedClass(selected?.className);
      classSubjectListApicall({ [name]: value });
      setClassSubjectFilterState(prev => ({ ...prev, [name]: value, }))
    }
    else if (name === "subjectName"){
      setClassSubjectFilterState(prev => ({ ...prev, [name]: value, }))
      debounceFun(value);
    }
    else {
      classSubjectListApicall({ [name]: value });
      setClassSubjectFilterState(prev => ({ ...prev, [name]: value, }))
    }
  }
 function search(value: string) {
      classSubjectListApicall({ ...classSubjectFilterState, subjectName: value });
  }
  const debounceFun = useCallback(debounce(search, 200), [classSubjectList]);
  

  const academicTitleChangeHandler = (academicTitle: string) => {
    let academic = academicDropDown.find(
      (menu) => menu.academicTitle === academicTitle
    );

    dispatch(
      getClassDetails(
        generateActionPayload("get_class_details", {
          academicId: academic?.id,
        })
      )
    );
  };
  function paginationHndlr(paginationInfo: IPaginationState) {
    setFilterState((prev: any) => ({ ...prev, ...paginationInfo }));
    classSubjectListApicall(paginationInfo);
  }
  const sortingHandler = useCallback((sortBy: any) => {

    // const sortByPrev = sortByPrevRef.current;
    if (sortBy.length > 0) {
      setFilterState((prev: any) => ({ ...prev, sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" }))
      classSubjectListApicall({ sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" })
    }
    // sortByPrevRef.current = sortBy;
  }, [classSubjectFilterState])

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};
  const { data: classSubjects, pageNumber, totalElements, totalPages } = assignedClassSubjectsListResp || {}
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Subject Management" pageTitle="Academics" />
          <div className="tw-p-0 tw-mb-6">
            <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mt-2">
              <div className="tw-border-b tw-px-4 tw-py-3">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Class Subjects
                </h4>
              </div>
              <div className="tw-border-b tw-px-4 tw-py-4">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-end">
                  {loggedInUserRole === "TEACHER" && (
                    <div className="tw-col-span-12 md:tw-col-span-2 tw-relative search-box">
                      <TextInput
                        name="subjectName"
                        value={classSubjectFilterState.subjectName}
                        onChange={filterHandler}
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search"
                        labelText="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-2 tw-text-gray-400"></i>
                    </div>
                  )}
                  <div className="tw-col-span-12 md:tw-col-span-2">
                    <SelectInput
                      name="academicYearId"
                      value={classSubjectFilterState.academicYearId}
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
                      value={classSubjectFilterState.curriculumId}
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
                      name="branchClassId"
                      value={classSubjectFilterState.branchClassId}
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
                    <div className="tw-col-span-12 md:tw-col-span-2">
                      <SelectInput
                        name="subjectType"
                        value={classSubjectFilterState.subjectType}
                        onChange={filterHandler}
                        menuItems={subjectType || []}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        labelText="Subject Type"
                        floatingLabel
                      />
                    </div>
                  )}
                  <div className={`tw-grid tw-grid-flow-col tw-auto-cols-max tw-gap-2 tw-items-center tw-justify-end tw-ms-auto ${loggedInUserRole === "TEACHER" ? "tw-col-span-12 md:tw-col-span-2" : "tw-col-span-12 md:tw-col-span-6"}`}>
                    <Button type="button" data-view="list" variant={branchState.isListMode ? "info" : "secondary"} onClick={branchViewHandler}>
                     <i className="ri-list-unordered"></i>
                    </Button>
                    <Button type="button" data-view="card" variant={!branchState.isListMode ? "info" : "secondary"} onClick={branchViewHandler}>
                     <i className="ri-grid-fill"></i>
                    </Button>
                    <Button className="tw-flex tw-items-center" type="button" variant="primary" onClick={toggleAddSubjectModal}>
                      <i className="ri-add-line tw-mr-1"></i>
                      Add Subject
                    </Button>
                  </div>
                </div>
              </div>
              {branchState.isListMode && (
                <div className="tw-p-0">
                  <TableContainer
                    columns={classSubjectColumns}
                    data={classSubjectList || []}
                    divClass="table-responsive tw-mb-3"
                    theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                    showPagination={false}
                    totalPages={totalPages}
                    totalRecords={totalElements}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={pageNumber}
                    manualSorting={true}
                    sortingHandler={sortingHandler}
                  />
                </div>
              )}
            </div>
            {!branchState.isListMode && (
              <>
                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mt-5">
                  {classSubjectList && classSubjectList.length > 0 ? (
                    classSubjectList.map((item, index) => (
                      <div
                        key={index}
                        className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-3"
                      >
                        <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-4 tw-flex tw-justify-between tw-items-center">
                          <div className="tw-flex tw-items-center tw-gap-4">
                            <div
                              className="tw-w-14 tw-h-14 tw-rounded-lg tw-flex tw-items-center tw-justify-center"
                              style={{ backgroundColor: item?.color }}
                            >
                              {item?.image}
                            </div>
                            <div className="tw-flex tw-flex-col">
                              <span className=" tw-text-gray-800">
                                {item?.cardName}
                              </span>
                              <span className="tw-text-sm tw-text-gray-500">
                                {item?.subName}
                              </span>
                            </div>
                          </div>
                          <MoreActions actionOptions={actionOptions} rowId={item?.id?.toString()} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <NoDataComp />
                  )}

                </div>
              </>
            )}
          </div>
        </Container>
      </div>
      <ModalContainerUpdated
        id="add-subjects-modal"
        isOpen={addSubjectModalState.showModal}
        toggle={toggleAddSubjectModal}
        modalTitle={"Add Subjects"}
        modalSize="lg"
      >
        <ClassSubjectModal
          isOpen={addSubjectModalState.showModal}
          toggle={toggleAddSubjectModal}
          instituteId={"1"}
          instituteName={"Add Subjects"}
          branchId={branchId}
          academicDetails={{ ...classSubjectFilterState, className: selectedClass }}
          classSubjectList={classSubjectList}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="assign-subjects-modal"
        isOpen={classSubjectModalState.showModal}
        toggle={closeClassSubjectModalHnldr}
        modalTitle={"Assign Subjects"}
        modalSize="lg"
        >
        <AssignTeacherModal
          isOpen={classSubjectModalState.showModal}
          toggle={closeClassSubjectModalHnldr}
          modalData={classSubjectModalState.modalData}
          academicYearId={classSubjectFilterState.academicYearId}
          curriculumId={classSubjectFilterState.curriculumId}
          branchClassId={classSubjectFilterState.branchClassId}
        />

      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="delete-subjects-modal"
        isOpen={confirmationModalState.showModal}
        toggle={toggleConfirmationModal}
        hideHeader={true}
        // modalTitle={"Add Subjects"}
        modalSize="md"
      >

        <ConfirmationModal
          isOpen={confirmationModalState.showModal}
          toggle={toggleConfirmationModal}
          modalTitle=""
          showApiLoader={showApiLoader}
          instituteId={instituteId}
          instituteName={"Assign Subjects"}
          branchId={branchId}
          editBranchDetails={""}
          submitHandler={RemoveSubejctHandler}
        />
      </ModalContainerUpdated>
      {/* <ToastContainer /> */}
    </>
  );
};

export default ClassSubjects;
