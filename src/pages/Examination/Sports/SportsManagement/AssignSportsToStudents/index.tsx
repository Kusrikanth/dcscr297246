import { useEffect, useMemo, useRef, useState } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  OffCanvasContainer,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, ignoredKeys } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../../hooks/modalhook";

import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { useFormik } from "formik";
import {
  getAssignSportsToStudentItemByIdAct,
  getAssignSportsToStudentsListAct,
  getSportsClassMappingByIdAct,
  getSportsClassMappingListAct,
  getSportsNamesAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import SubmissionSuccessModal from "../../../../LMS/TestModule/StudentAssessment/Modals/SubmissionModal";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import {
  getBranchClassAct,
  getBranchCurriculumAct,
  resetBrchClassAct,
  resetBrchCurriculumAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
  getIgseTermNameListAct,
  resetIgseTermNameListAct,
} from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import AssignSportsToStudentsModal from "./AssignSportsToStudentsModal";
import AssignedStudentsModal from "./AssignedStudentsModal";
import { useFilterState } from "../../../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { reSetSportsNamesAct } from "../../../../../store/examination/examinationSports/examinationSportsSlice";

const initialValues = {
  searchString: "",
  classId: "",
  academicYearId: "",
  curriculumId: "",
  termId: "",
  sportId: "",
  sportClassId: "",
};

const AssignSportsToStudents = () => {
  const {
    openModal: assignSportsToStudentsOpenModal,
    closeModal: assignSportsToStudentsCloseModal,
    modalState: assignSportsToStudentsModalState,
  } = useModal();
  const {
    openModal: assignedStudentsOpenModal,
    closeModal: assignedStudentsCloseModal,
    modalState: assignedStudentsModalState,
  } = useModal();
  const { showClearFilterState, count, advanceFilterChange } = useFilterState();
  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    brchCurriculumResp,
    getAssignSportsToStudentsListResp,

    saveAssignSportsToStudentsResp,
    editAssignSportsToStudentsResp,

    getExaminationSportsErrResp,
    getIgseTermNameListResp,
    getSportsNamesResp,
    loggedInUserRole,
    branchClassResp,
  } = useAppSelector(
    ({
      appData,
      instAcademics,
      examinationSports,
      branchAcademics,
      examinationSettings,
    }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      getAssignSportsToStudentsListResp:
        examinationSports.getAssignSportsToStudentsListResp,
      saveAssignSportsToStudentsResp:
        examinationSports.saveAssignSportsToStudentsResp,
      editAssignSportsToStudentsResp:
        examinationSports.editAssignSportsToStudentsResp,
      branchClassResp: branchAcademics.branchClassResp,
      getSportsNamesResp: examinationSports.getSportsNamesResp,
      loggedInUserRole: appData.loggedInUserRole,
      getExaminationSportsErrResp:
        examinationSports.editAssignSportsToStudentsResp,
    })
  );

  const assignSportsToStudentsFormik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(
            getAssignSportsToStudentItemByIdAct(
              generateActionPayload("get_assign_sports_to_student_item_by_id", {
                id: id,
              })
            )
          );
          assignSportsToStudentsOpenModal(id);
        },
      },
    ],
    []
  );

  function fetchAssignSportsToStudentsList(otherProps?: any) {
    const {
      searchString,
      academicYearId,
      curriculumId,
      termId,
      sportId,
      sportClassId,
    } = assignSportsToStudentsFormik.values;
    const payload = {
      branchId,
      searchString,
      academicYearId,
      curriculumId,
      termId,
      sportId,
      sportClassId,
      ...otherProps,
      ...paginationRef.current,
    };
    dispatch(
      getAssignSportsToStudentsListAct(
        generateActionPayload(
          "get_asssign_sports_to_students_list",
          undefined,
          payload
        )
      )
    );
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchAssignSportsToStudentsList(paginationInfo);
  }

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      academicYearId: assignSportsToStudentsFormik.values.academicYearId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
      ...otherProps,
    };
    if (loggedInUserRole === "TEACHER") {
      payload.progressCardType = "SPORTS";
    }
    dispatch(
      getBranchCurriculumAct(
        generateActionPayload("get_brch_curriculum", undefined, payload)
      )
    );
  }

  function fetchTermList(otherProps?: any) {
    const payload = {
      branchId,
      curriculumId: assignSportsToStudentsFormik.values.curriculumId,
      ...otherProps,
    };

    dispatch(
      getIgseTermNameListAct(
        generateActionPayload("get_igse_term_name_list", undefined, payload)
      )
    );
  }

  function fetchClasssList(otherProps?: any) {
    const payload = {
      branchId: branchId,
      academicYearId: assignSportsToStudentsFormik.values?.academicYearId,
      curriculumId: assignSportsToStudentsFormik.values.curriculumId,
      // termId: assignSportsToStudentsFormik.values.termId,
      sortBy: "classSequence",
      orderBy: "asc",
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };
    if (loggedInUserRole === "TEACHER") {
      payload.progressCardType = "SPORTS";
    }
    dispatch(
      getBranchClassAct(
        generateActionPayload("get_brch_curriculum_class", undefined, payload)
      )
    );
  }

  function fetchExaminationSportsNames(otherProps?: any) {
    const payload = {
      branchId,
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };

    dispatch(
      getSportsNamesAct(
        generateActionPayload("get_sports_names", undefined, payload)
      )
    );
  }

  const assignSportsToStudentsRef = useRef({
    prevSaveAssignSportsToStudentsResp: saveAssignSportsToStudentsResp,
    prevEditAssignSportsToStudentsResp: editAssignSportsToStudentsResp,
    prevGetExaminationSportsErrResp: getExaminationSportsErrResp,
  });

  useEffect(() => {
    const {
      prevSaveAssignSportsToStudentsResp,
      prevEditAssignSportsToStudentsResp,
      prevGetExaminationSportsErrResp,
    } = assignSportsToStudentsRef.current;

    if (
      saveAssignSportsToStudentsResp &&
      saveAssignSportsToStudentsResp !== prevSaveAssignSportsToStudentsResp
    ) {
      toast.success("Sports Assigned to Students Successfully");
      assignSportsToStudentsCloseModal();
      fetchAssignSportsToStudentsList();
    } else if (
      editAssignSportsToStudentsResp &&
      editAssignSportsToStudentsResp !== prevEditAssignSportsToStudentsResp
    ) {
      toast.success("Sports Assigned to Students Updated Successfully");
      assignSportsToStudentsCloseModal();
      fetchAssignSportsToStudentsList();
    } else if (
      getExaminationSportsErrResp &&
      getExaminationSportsErrResp !== prevGetExaminationSportsErrResp
    ) {
      const { details } = getExaminationSportsErrResp;
      toast.error(details || "Something went wrong");
    }
    assignSportsToStudentsRef.current.prevSaveAssignSportsToStudentsResp =
      saveAssignSportsToStudentsResp;
    assignSportsToStudentsRef.current.prevEditAssignSportsToStudentsResp =
      editAssignSportsToStudentsResp;
    assignSportsToStudentsRef.current.prevGetExaminationSportsErrResp =
      getExaminationSportsErrResp;
  }, [
    saveAssignSportsToStudentsResp,
    editAssignSportsToStudentsResp,
    getExaminationSportsErrResp,
  ]);

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;
    if (name === "academicYearId") {
      assignSportsToStudentsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: "",
        termId: "",
        classId: "",
        sportId: "",
      }));

      if (value) {
        fetchCurriculumList({ [name]: value });
        fetchAssignSportsToStudentsList({ [name]: value });
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
      }
    } else if (name === "curriculumId") {
      assignSportsToStudentsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        termId: "",
        classId: "",
        sportId: "",
      }));

      if (value) {
        fetchTermList({ curriculumId: value });
        fetchAssignSportsToStudentsList({ [name]: value });
        fetchClasssList({ curriculumId: value });
      } else {
        fetchAssignSportsToStudentsList({ [name]: value });
        dispatch(resetIgseTermNameListAct(undefined));
        dispatch(resetBrchClassAct(undefined));
        dispatch(reSetSportsNamesAct(undefined));
        dispatch(resetBrchClassAct(undefined));
      }
    }
    // else if (name === "sportId") {
    //   assignSportsToStudentsFormik.setValues((prev: any) => ({
    //     ...prev,
    //     [name]: value,
    //     termId: "",
    //     // classId: "",
    //   }));
    //   if (value) {
    //     fetchAssignSportsToStudentsList({ [name]: value });
    //   } else {
    //     fetchAssignSportsToStudentsList({ [name]: value });
    //   }
    // }
    else {
      assignSportsToStudentsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchAssignSportsToStudentsList({ [name]: value });
    }
    advanceFilterChange({
      keys: { ...assignSportsToStudentsFormik.values, [name]: value },
      ignoredKeys,
    });
  }

  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    paginationRef.current = { ...paginationRef.current, pageNo: 0 };
    advanceFilterChange({
      keys: { ...initialValues, ...appliedFilters },
      ignoredKeys,
    });
    assignSportsToStudentsFormik.setValues((prevState: any) => ({
      ...prevState,
      ...appliedFilters,
    }));
    fetchAssignSportsToStudentsList(appliedFilters);
  }

  function clearFilterHndlr() {
    paginationRef.current.pageNo = 0;
    const { academicYearId } =
      academicYearListResp?.data?.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      ) || {};
    const curriculumId = assignSportsToStudentsFormik.values.curriculumId;
    assignSportsToStudentsFormik.setValues({
      ...initialValues,
      academicYearId: academicYearId || "",
      curriculumId: curriculumId || "",
    });
    fetchAssignSportsToStudentsList({
      ...initialValues,
      academicYearId,
      curriculumId,
    });
    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys });
  }

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    assignSportsToStudentsFormik.setFieldValue("academicYearId", yearId);
    fetchAssignSportsToStudentsList({ academicYearId: yearId });
    fetchCurriculumList({ academicYearId: yearId });
    fetchExaminationSportsNames();
  }, [academicYearListResp]);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions, assignedStudentsOpenModal),
    [menuOptions]
  );

  const {
    data: assignSportsToStudentList,
    totalElements,
    totalPages,
    pageNumber,
  } = getAssignSportsToStudentsListResp || {};

  const { data: academicYearList } = academicYearListResp || {};

  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="">
        <div className="row px-3 g-3 p-3">
          <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
            <div className="search-box">
              <TextInput
                name="searchString"
                formgroupClassName="mb-0"
                placeHolder="Search..."
                value={assignSportsToStudentsFormik.values.searchString}
                onChange={filterHandler}
                floatingLabel
                labelText="Search"
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>
          <div className="col-xs-12 col-lg-3 col-xl-2">
            <SelectInput
              name="academicYearId"
              value={assignSportsToStudentsFormik.values.academicYearId}
              onChange={filterHandler}
              menuItems={academicYearList || []}
              valueKey="academicYearId"
              textKey="academicYearName"
              labelText="Academic year"
              floatingLabel
              formgroupClassName="mb-0"
            />
          </div>
          <div className="col-xs-12 col-lg-3 col-xl-2">
            <SelectInput
              name="curriculumId"
              value={assignSportsToStudentsFormik.values.curriculumId}
              onChange={filterHandler}
              menuItems={brchCurriculumResp?.data}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              labelText="Curriculum"
              floatingLabel
              formgroupClassName="mb-0"
            />
          </div>

          <div className="col-1 py-2 mt-2">
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
          <div className="col-auto ms-auto">
            <button
              className="btn btn-success d-flex align-items-center"
              onClick={() => assignSportsToStudentsOpenModal()}
            >
              <i className="ri-add-line me-2" />
              Add New
            </button>
          </div>
        </div>

        <TableContainer
          columns={tableColumns || []}
          data={
            Array.isArray(assignSportsToStudentList)
              ? assignSportsToStudentList
              : []
          }
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showCheckbox={false}
          showPagination={true}
          totalPages={totalPages || 0}
          totalRecords={totalElements || 0}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageNumber || 0}
        />
      </div>

      <ModalContainerUpdated
        id="assignSportsToStudentsModalState"
        isOpen={assignSportsToStudentsModalState.showModal}
        toggle={assignSportsToStudentsCloseModal}
        modalTitle={
          assignSportsToStudentsModalState.modalData
            ? "Edit Sports to students"
            : "Assign Sports to students"
        }
        modalSize="md"
      >
        <AssignSportsToStudentsModal
          toggle={assignSportsToStudentsCloseModal}
          isOpen={assignSportsToStudentsModalState.showModal}
          itemId={assignSportsToStudentsModalState.modalData}
        ></AssignSportsToStudentsModal>
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="assignedStudentsModal"
        isOpen={assignedStudentsModalState.showModal}
        toggle={assignedStudentsCloseModal}
        modalTitle="Assigned Students"
        modalSize="md"
      >
        <AssignedStudentsModal
          toggle={assignSportsToStudentsCloseModal}
          isOpen={assignedStudentsModalState.showModal}
          itemId={assignedStudentsModalState.modalData}
        ></AssignedStudentsModal>
      </ModalContainerUpdated>

      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-book-issuance"
      >
        <AdvanceFilterModal
          appliedFilter={assignSportsToStudentsFormik.values}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
    </>
  );
};

export default AssignSportsToStudents;
