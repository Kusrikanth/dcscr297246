import { useEffect, useMemo, useRef, useState } from "react";
import { IPaginationState } from "../../../../../../Components/Common/Pagination";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { generateColumns, ignoredKeys } from "./helper";
import { useHistory } from "react-router-dom";
import { ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../../../Components/Common";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { getSectionList, resetSectionListAct } from "../../../../../../store/academic/classroomManagment/classroommanagmentactions";
import { useFilterState } from "../../../../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { default as FilterSvg } from "../../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon, PropertyAddIcon } from "@hugeicons-pro/core-stroke-standard";
import { getClassesByStageAct, getIgseTermNameListAct, getPreparatoryGradeEntryListAct } from "../../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { toast } from "react-toastify";
import CopyPreparatoryGradeEntryStudentDetailsModal from "./CopyPreparatoryGradeEntryStudentDetailsModal";
import { useModal } from "../../../../../../hooks/modalhook";
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

const PreparatoryGradeEntry = (props: any) => {
  const foundationStageFormik = useFormik({
    initialValues,
    onSubmit: () => { },
  });
  const [open, setOpen] = useState<boolean>(false);
  const { showClearFilterState, count, advanceFilterChange } = useFilterState();
  const { closeModal: closeCopyPreparatoryGradeEntryStudentDetailsModal, modalState: copyGradeEntryStudentDetailsState, openModal: openCopyPreparatoryGradeEntryStudentDetailsModal } = useModal();
  
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
    currentInstIdResp: instituteId,
    getClassesByStageResp,
    cbseExaminationErrorAct,
    getPreparatoryGradeEntryListResp,
    savePrepartoryParentCollectionResp,
    getIgseTermNameListResp,
    copyPreparatoryGradeEntryStudentDetailsResp
  } = useAppSelector(
    ({ appData, instAcademics, examinationSettings, examinationManagement }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getClassesByStageResp: examinationSettings.getClassesByStageResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
      getPreparatoryGradeEntryListResp: examinationSettings.getPreparatoryGradeEntryListResp,
      savePrepartoryParentCollectionResp: examinationSettings.savePrepartoryParentCollectionResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      copyPreparatoryGradeEntryStudentDetailsResp: examinationSettings.copyPreparatoryGradeEntryStudentDetailsResp,

    }),
    shallowEqual
  );

  const foundationStageRef = useRef({
      prevCbseExaminationErrorAct: cbseExaminationErrorAct,
      prevSavePrepartoryParentCollectionResp: savePrepartoryParentCollectionResp,
      prevCopyPreparatoryGradeEntryStudentDetailsResp: copyPreparatoryGradeEntryStudentDetailsResp
  });
  
    useEffect(() => {
      const { prevCbseExaminationErrorAct, prevSavePrepartoryParentCollectionResp, prevCopyPreparatoryGradeEntryStudentDetailsResp } = foundationStageRef.current;
  
      if (
        cbseExaminationErrorAct &&
        cbseExaminationErrorAct !== prevCbseExaminationErrorAct
      ) {
        const { details } = cbseExaminationErrorAct || {};
        toast.error(details || "Something went wrong");
      }
      else if (savePrepartoryParentCollectionResp && savePrepartoryParentCollectionResp !== prevSavePrepartoryParentCollectionResp) {
        toast.success("save parent collected status sucessfully")
        fetchStudentProfilesList()
      }
      else if (copyPreparatoryGradeEntryStudentDetailsResp && copyPreparatoryGradeEntryStudentDetailsResp !== prevCopyPreparatoryGradeEntryStudentDetailsResp) {
        toast.success("Details Copied successfully")
        closeCopyPreparatoryGradeEntryStudentDetailsModal();
        fetchStudentProfilesList()
      }
      foundationStageRef.current.prevCbseExaminationErrorAct = cbseExaminationErrorAct;
      foundationStageRef.current.prevSavePrepartoryParentCollectionResp = savePrepartoryParentCollectionResp;
      foundationStageRef.current.prevCopyPreparatoryGradeEntryStudentDetailsResp = copyPreparatoryGradeEntryStudentDetailsResp;
    }, [cbseExaminationErrorAct, savePrepartoryParentCollectionResp, copyPreparatoryGradeEntryStudentDetailsResp]);

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
          history.push("/preparatory-management/grade-entry", { studentId: id, termId: foundationStageFormik.values.termId,  termName: selectedTerm?.termName || "", academicYearId: foundationStageFormik.values.academicYearId });
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
          const data = getPreparatoryGradeEntryListResp?.content.find(
            (item: any) => +item.studentId === +id
          );
          const selectedTerm = getIgseTermNameListResp?.data?.find(
          (item: any) => +item.termId === +foundationStageFormik.values.termId
        );
          history.push("/preparatory-management/grade-entry",{
            studentId: id,
            entryId: data?.entryId,
            termId: foundationStageFormik.values.termId,
            termName: selectedTerm?.termName || "",
            academicYearId: foundationStageFormik.values.academicYearId,
          });
        },
      },
    ],
    [getPreparatoryGradeEntryListResp]
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

  useEffect(() => {
    if (Array.isArray(getClassesByStageResp) && getClassesByStageResp.length > 0 ) {
      const firstClass = getClassesByStageResp[0];
      const curriculumId = getClassesByStageResp.find((item: any) => +item.classId === +firstClass.classId)?.curriculumId;
      foundationStageFormik.setFieldValue("classId", firstClass.classId);
      foundationStageFormik.setFieldValue("curriculumId", firstClass.curriculumId);
      fetchSectionList({ branchClassId: firstClass.classId });
      fetchStudentProfilesList({ classId: firstClass.classId });
      examinationTermList(curriculumId);
    }
  }, [getClassesByStageResp]);

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

  const getCurriculumClassApiCall = (otherProps?: any) => {
    const payload = {
      branchId: branchId,
      academicYearId: foundationStageFormik.values.academicYearId,
      stageId: 2,
      ...otherProps,
    };
    dispatch(getClassesByStageAct(generateActionPayload("get_classes_by_stage", undefined, payload)));
  };

    function fetchStudentProfilesList(otherProps?: any) {
      const {
        searchString,
        academicYearId,
        curriculumId,
        classId,
        sectionId,
        termId,
        entryProcessStatus,
        entryStatus,
      } = foundationStageFormik.values;
      const payload = {
        branchId,
        searchString,
        academicYearId,
        curriculumId,
        classId,
        sectionId,
        termId,
        entryProcessStatus,
        entryStatus,
        ...otherProps,
        ...paginationRef.current,
      };
  
      if(payload.academicYearId){
  
        dispatch(
          getPreparatoryGradeEntryListAct(
            generateActionPayload(
              "get_preparatory_list",
              undefined,
              payload
            )
          )
        );
      }
    }

  useEffect(() => {
    if (Array.isArray(getIgseTermNameListResp?.data) && getIgseTermNameListResp?.data.length > 0) {
      const currentTerm = getIgseTermNameListResp?.data?.find((item: any) => item.isCurrent === true) || getIgseTermNameListResp.data[0];
      const termId = currentTerm?.termId?.toString() || "";
      foundationStageFormik.setFieldValue("termId", termId);
      fetchStudentProfilesList({ termId });
    }
  }, [getIgseTermNameListResp])

  useEffect(() => {
    props.setFilter(foundationStageFormik.values)
  }, [foundationStageFormik.values])

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;

    if (name === "searchString") {
      foundationStageFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchStudentProfilesList({ searchString: value });
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
        fetchStudentProfilesList({ sectionId: "" });
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

  const tableColumns = useMemo(() => generateColumns(menuOptions), [menuOptions]);
  const { data: academicYearList } = academicYearListResp || {};
  
  const {
    content : preparatoryGradeEntryList,
    totalElements,
    totalPages,
    pageable,
  } = getPreparatoryGradeEntryListResp || {};

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
                  onClick={() => openCopyPreparatoryGradeEntryStudentDetailsModal()}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
          <TableContainer
            columns={tableColumns || []}
            data={ preparatoryGradeEntryList || []}
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
        toggle={() => closeCopyPreparatoryGradeEntryStudentDetailsModal()}
        modalTitle="Copy Details"
        modalSize="lg"
      >
        <CopyPreparatoryGradeEntryStudentDetailsModal
          id={copyGradeEntryStudentDetailsState.modalData}
          isOpen={false}
          toggle={() => closeCopyPreparatoryGradeEntryStudentDetailsModal()}
          modalTitle="Copy Detail"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default PreparatoryGradeEntry;
