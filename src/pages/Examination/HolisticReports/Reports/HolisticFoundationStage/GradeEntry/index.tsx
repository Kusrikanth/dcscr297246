import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IPaginationState } from "../../../../../../Components/Common/Pagination";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import {
  generateColumns,
  ignoredKeys,
} from "./helper";
import { useHistory } from "react-router-dom";
import {
  ModalContainerUpdated,
  OffCanvasContainer,
  SelectInput,
  TextInput,
} from "../../../../../../Components/Common";
import { useFormik } from "formik";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import {
  getSectionList,
  resetSectionListAct,
} from "../../../../../../store/academic/classroomManagment/classroommanagmentactions";
import { getFoundationStudentsProfilesListAct } from "../../../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { debounce } from "../../../../../../utility/commonutility";
import { useFilterState } from "../../../../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { default as FilterSvg } from "../../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PencilEdit02Icon,
  PropertyAddIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { getClassesByStageAct, getIgseTermNameListAct } from "../../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { useModal } from "../../../../../../hooks/modalhook";
import CopyGradeEntryStudentDetailsModal from "./CopyGradeEntryStudentDetailsModal";
import Button from "../../../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  entryProcessStatus: "",
  entryStatus: "",
  termId: "",
};

const GradeEntry = (props: any) => {
  const foundationStageFormik = useFormik({
    initialValues,
    onSubmit: () => { },
  });
  const [open, setOpen] = useState<boolean>(false);
  const { showClearFilterState, count, advanceFilterChange } = useFilterState();
  const { closeModal: closeCopyGradeEntryStudentDetailsModal, modalState: copyGradeEntryStudentDetailsState, openModal: openCopyGradeEntryStudentDetailsModal } = useModal();
  
  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };

  const history = useHistory();
  const dispatch = useAppDispatch();

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    getFoundationStudentsProfilesResp,
    examinationManagementErrorResp,
    saveParentCollectedStatusResp,
    currentInstIdResp: instituteId,
    getClassesByStageResp,
    getIgseTermNameListResp,
    copyFoundationStageGradeEntryStudentDetailsResp,

  } = useAppSelector(
    ({
      appData,
      instAcademics,
      examinationManagement,
      examinationSettings,
    }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getFoundationStudentsProfilesResp:
        examinationManagement.getFoundationStudentsProfilesResp,
      examinationManagementErrorResp:
        examinationManagement.examinationManagementErrorResp,
      saveParentCollectedStatusResp: examinationManagement.saveParentCollectedStatusResp,
      getClassesByStageResp: examinationSettings.getClassesByStageResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      copyFoundationStageGradeEntryStudentDetailsResp: examinationManagement.copyFoundationStageGradeEntryStudentDetailsResp,


    }),
    shallowEqual
  );

  const menuOptions = useMemo(
    () => [
      {
        id: "initiate",
        actionIcon: (
          <HugeiconsIcon
            icon={PropertyAddIcon}
            className="me-2 text-success"
            size={18}
          />
        ),
        actionName: "Initiate",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          const selectedTerm = getIgseTermNameListResp?.data?.find(
          (item: any) => +item.termId === +foundationStageFormik.values.termId
        );
          history.push("/holistic-management/add-holistic", { studentId: id, termId: foundationStageFormik.values.termId,  termName: selectedTerm?.termName || "", academicYearId: foundationStageFormik.values.academicYearId });
        },
      },
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="me-2 text-primary"
            size={18}
          />
        ),
        actionName: "Edit Request",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          const data = getFoundationStudentsProfilesResp.content.find(
            (item: any) => +item.studentId === +id
          );
          const selectedTerm = getIgseTermNameListResp?.data?.find(
          (item: any) => +item.termId === +foundationStageFormik.values.termId
        );
          history.push("/holistic-management/add-holistic", {
            studentId: id,
            entryId: data?.entryId,
            termId: foundationStageFormik.values.termId,
             termName: selectedTerm?.termName || "",
             academicYearId: foundationStageFormik.values.academicYearId,
          });
        },
      },
    ],
    [getFoundationStudentsProfilesResp]
  );

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    foundationStageFormik.setFieldValue("academicYearId", yearId);
    getCurriculumClassApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);

    useEffect(()=>{
      props.setFilter(foundationStageFormik.values)
    },[foundationStageFormik.values])
  

  useEffect(() => {
    if (
      Array.isArray(getClassesByStageResp) &&
      getClassesByStageResp.length > 0 
    ) {
      const firstClass = getClassesByStageResp[0];      

      foundationStageFormik.setFieldValue("classId", firstClass.classId);
      foundationStageFormik.setFieldValue("curriculumId", firstClass.curriculumId);
      const curriculumId = getClassesByStageResp.find((item: any) => +item.classId === +firstClass.classId)?.curriculumId;


      fetchSectionList({ branchClassId: firstClass.classId });
      fetchStudentProfilesList({ classId: firstClass.classId });
      examinationTermList(curriculumId);
    }
  }, [getClassesByStageResp]);

  useEffect(() => {
    if(
      Array.isArray(getIgseTermNameListResp?.data) &&
      getIgseTermNameListResp?.data.length > 0
    ){
      const currentTerm = getIgseTermNameListResp?.data?.find((item: any) => item.isCurrent === true) || getIgseTermNameListResp.data[0];
      const termId = currentTerm?.termId?.toString() || "";
      foundationStageFormik.setFieldValue("termId", termId);
      fetchStudentProfilesList({ termId });
    }
  },[getIgseTermNameListResp])

  function fetchSectionList(otherProps?: any) {
    let payload = {
      masterAcademicYearId: foundationStageFormik.values.academicYearId,
      curriculumId: foundationStageFormik.values.curriculumId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "sectionName",
      orderBy: "asc",
      ...otherProps,
    };

    if(payload.masterAcademicYearId ){
      dispatch(
        getSectionList(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
      
    }
  }

  function fetchStudentProfilesList(otherProps?: any) {
    const {
      searchString,
      academicYearId,
      curriculumId,
      classId,
      sectionId,
      entryProcessStatus,
      entryStatus,
      termId
    } = foundationStageFormik.values;
    const payload = {
      branchId,
      searchString,
      academicYearId,
      curriculumId,
      classId,
      sectionId,
      entryProcessStatus,
      entryStatus,
      termId,
      ...otherProps,
      ...paginationRef.current,
    };

    if(payload.academicYearId){

      dispatch(
        getFoundationStudentsProfilesListAct(
          generateActionPayload(
            "get_foundation_students_profiles_list",
            undefined,
            payload
          )
        )
      );
    }
  }

  const getCurriculumClassApiCall = (otherProps?: any) => {
    const payload = {
      branchId: branchId,
      academicYearId: foundationStageFormik.values.academicYearId,
      stageId: 1,
      ...otherProps,
    };

    dispatch(getClassesByStageAct(generateActionPayload("get_classes_by_stage", undefined, payload)));
  };

  function search(value: string) {
    fetchStudentProfilesList({
      ...foundationStageFormik.values,
      searchString: value,
    });
  }

  const debounceFun = useCallback(debounce(search, 200), [
    getFoundationStudentsProfilesResp,
  ]);

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;

    if (name === "searchString") {
      foundationStageFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      debounceFun(value);
    } else if (name === "classId") {
      const curriculumId = getClassesByStageResp.find((item: any) => +item.classId === +value)?.curriculumId;
      foundationStageFormik.setFieldValue("classId", value);
      foundationStageFormik.setFieldValue("sectionId", "");
      foundationStageFormik.setFieldValue("curriculumId", curriculumId);

      if (value) {
        fetchSectionList({ branchClassId: value });
        fetchStudentProfilesList({ classId: value });
        examinationTermList(curriculumId);
      } else {
        dispatch(resetSectionListAct(undefined));
        fetchStudentProfilesList({ classId: "" });
      }
    } else if (name === "sectionId") {
      foundationStageFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));

      if (value) {
        fetchStudentProfilesList({ sectionId: value });
      } else {
        fetchStudentProfilesList({ [name]: value });
      }
    } else if (name === "academicYearId") {
      foundationStageFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: "",
        classId: "",
        sectionId: "",
      }));
      getCurriculumClassApiCall({ academicYearId: value });
    }

    else {
      foundationStageFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchStudentProfilesList({ [name]: value });
    }
  }

  const foundationStageRef = useRef({
    prevExaminationManagementErrorResp: examinationManagementErrorResp,
    prevSaveParentCollectedStatusResp: saveParentCollectedStatusResp,
    prevCopyFoundationStageGradeEntryStudentDetailsResp: copyFoundationStageGradeEntryStudentDetailsResp
  });

  useEffect(() => {
    const { prevExaminationManagementErrorResp, prevSaveParentCollectedStatusResp, prevCopyFoundationStageGradeEntryStudentDetailsResp } = foundationStageRef.current;

    if (
      examinationManagementErrorResp &&
      examinationManagementErrorResp !== prevExaminationManagementErrorResp
    ) {
      const { details } = examinationManagementErrorResp || {};
      toast.error(details || "Something went wrong");
    }
    else if (saveParentCollectedStatusResp && saveParentCollectedStatusResp !== prevSaveParentCollectedStatusResp) {
      toast.success("save parent collected status sucessfully")
      fetchStudentProfilesList()
    }
    else if (copyFoundationStageGradeEntryStudentDetailsResp && copyFoundationStageGradeEntryStudentDetailsResp !== prevCopyFoundationStageGradeEntryStudentDetailsResp) {
      toast.success("Details Copied successfully")
      closeCopyGradeEntryStudentDetailsModal();
      fetchStudentProfilesList()
    }

    foundationStageRef.current.prevExaminationManagementErrorResp = examinationManagementErrorResp;
    foundationStageRef.current.prevSaveParentCollectedStatusResp = saveParentCollectedStatusResp;
    foundationStageRef.current.prevCopyFoundationStageGradeEntryStudentDetailsResp = copyFoundationStageGradeEntryStudentDetailsResp;
  }, [examinationManagementErrorResp, saveParentCollectedStatusResp, copyFoundationStageGradeEntryStudentDetailsResp]);

  function clearFilterHndlr() {
    paginationRef.current.pageNo = 0;
    const { academicYearId } =
      academicYearListResp?.data?.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      ) || {};
    const curriculumId = foundationStageFormik.values.curriculumId;
    const classId = foundationStageFormik.values.classId;
    foundationStageFormik.setValues({
      ...initialValues,
      academicYearId: academicYearId || "",
      curriculumId: curriculumId || "",
      classId: classId || "",
    });
    getCurriculumClassApiCall({ academicYearId });
    fetchStudentProfilesList({
      ...initialValues,
      academicYearId,
      curriculumId,
      classId,
    });

    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    paginationRef.current = { ...paginationRef.current, pageNo: 0 };
    advanceFilterChange({
      keys: { ...initialValues, ...appliedFilters },
      ignoredKeys,
    });
    foundationStageFormik.setValues((prevState: any) => ({
      ...prevState,
      ...appliedFilters,
    }));
    fetchStudentProfilesList(appliedFilters);
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchStudentProfilesList(paginationInfo);
  }
  const examinationTermList = (curriculumId: string) => {
    if (curriculumId) {
      let payload = {
        branchId,
        curriculumId,
      };
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
    }
  };

  const tableColumns = useMemo(() => generateColumns(menuOptions), [getFoundationStudentsProfilesResp, menuOptions]);

  const {
    content: foundationStudentsProfilesList,
    totalElements,
    totalPages,
    pageable,
  } = getFoundationStudentsProfilesResp || {};
  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="card mb-0">
        <div className="card-body p-0">
          <div className="bg-light m-3 pt-1 rounded">
            <div className="row p-3 g-3 examination">
              <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                <div className="search-box">
                  <TextInput
                    name="searchString"
                    formgroupClassName="mb-0"
                    placeHolder="Search"
                    value={foundationStageFormik.values.searchString}
                    onChange={filterHandler}
                    labelText="Search"
                    floatingLabel
                    inputClassName="bg-light"
                  ></TextInput>
                  <i className="ri-search-line search-icon"></i>
                </div>
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="academicYearId"
                  value={foundationStageFormik.values.academicYearId}
                  onChange={filterHandler}
                  menuItems={academicYearList || []}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  labelText="Academic Year"
                  floatingLabel
                  inputClassName="bg-light"
                  formgroupClassName="mb-0"
                  labelClass="required"
                />
              </div>
              <div className="col-xs-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="classId"
                  value={foundationStageFormik.values.classId}
                  onChange={filterHandler}
                  menuItems={getClassesByStageResp}
                  valueKey="classId"
                  textKey="className"
                  formgroupClassName="mb-0"
                  labelText="Curriculum Class"
                  floatingLabel
                  inputClassName="bg-light"
                  labelClass="required"
                />
              </div>
              <div className="col-xs-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="termId"
                  value={foundationStageFormik.values?.termId}
                  onChange={filterHandler}
                  menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                  valueKey="termId"
                  textKey="termName"
                  formgroupClassName="w-100"
                  labelText='Term Name'
                  inputClassName="bg-light"
                  floatingLabel
                  labelClass="required"
                />
              </div>

              <div className="col-1">
                <button
                  style={{
                    backgroundColor: "#F4F7FA",
                    border: "1px solid #ced4da",
                  }}
                  onClick={toggleAdvanceFilter}
                  className="p-2 btn d-flex"
                >
                  <FilterSvg height={"18px"} width={"18px"} />
                  <span className="ms-2">Filters</span>
                </button>
                <span
                  className="badge align-middle rounded-pill ms-1 "
                  style={{
                    marginBottom: "18px",
                    position: "absolute",
                    top: "-9px",
                    left: "78px",
                    background: "#0ab39c",
                  }}
                >
                  {count}
                </span>
              </div>
              {showClearFilterState && (
                <div className="col-auto d-flex align-items-center py-2 mt-2">
                  <button
                    type="button"
                    onClick={clearFilterHndlr}
                    className="btn btn-sm btn-ghost-danger"
                  >
                    Clear filter
                  </button>
                </div>
              )}
              <div className="col-auto tw-flex tw-justify-end tw-ml-auto tw-gap-2">
                <Button
                  type="button"
                  variant='info'
                  onClick={() => openCopyGradeEntryStudentDetailsModal()}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
          <TableContainer
            columns={tableColumns || []}
            data={
              Array.isArray(foundationStudentsProfilesList)
                ? foundationStudentsProfilesList
                : []
            }
            tableClass="mb-0"
            divClass="table-responsive mb-3"
            theadClass="table-light text-muted align-middle"
            showPagination={true}
            totalPages={totalPages || 0}
            totalRecords={totalElements || 0}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageable?.pageNumber || 0}
          />
        </div>
      </div>

      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-book-issuance"
      >
        <AdvanceFilterModal
          appliedFilter={foundationStageFormik.values}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
      <ModalContainerUpdated
        id="add-examination"
        isOpen={copyGradeEntryStudentDetailsState.showModal}
        toggle={() => closeCopyGradeEntryStudentDetailsModal()}
        modalTitle="Copy Details"
        modalSize="lg"
      >
        <CopyGradeEntryStudentDetailsModal
          id={copyGradeEntryStudentDetailsState.modalData}
          isOpen={false}
          toggle={() => closeCopyGradeEntryStudentDetailsModal()}
          modalTitle="Copy Detail"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default GradeEntry;
