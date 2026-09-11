import { useEffect, useMemo, useRef, useState } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  OffCanvasContainer,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, ignoredKeys } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditSubAttributeSportsModal from "./AddEditSubAttributeSportsModal";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { useFormik } from "formik";
import {
  delSportsSubAttributeItemAct,
  getSportsSubAttributeByIdAct,
  getSportsSubAttributeListAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import {
  getBranchClassAct,
  getBranchCurriculumAct,
  resetBrchClassAct,
  resetBrchCurriculumAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getIgseTermNameListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { toast } from "react-toastify";
import { useFilterState } from "../../../../../hooks/filterhook";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";

import AdvanceFilterModal from "../AssignSportsToStudents/AdvanceFilterModal";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  termId: "",
  classId: "",
  sportId: "",
};

const SubAttributeSports = () => {
  const {
    openModal: openAddEditSubAttributeSportsModal,
    closeModal: closeAddEditSubAttributeSportsModal,
    modalState: addEditSubAttributeSportsModalState,
  } = useModal();

  const {
    openModal:openDelSubAttributeSportsModal,
    closeModal:closeDelSubAttributeSportsModal,
    modalState:delSubAttributeSportsModalState,
  } = useModal()

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
    getSportsSubAttributeListResp,
    brchCurriculumResp,
    getIgseTermNameListResp,
    saveSportsSubAttributeItemResp,
    delSportsSubAttributeItemResp,
    editSportsSubAttributeItemResp,
    getExaminationSportsErrResp,
    branchClassResp,
  } = useAppSelector(
    ({
      instAcademics,
      examinationSports,
      appData,
      branchAcademics,
      examinationSettings,
    }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,

      getSportsSubAttributeListResp:
        examinationSports.getSportsSubAttributeListResp,
      saveSportsSubAttributeItemResp:
        examinationSports.saveSportsSubAttributeItemResp,
      delSportsSubAttributeItemResp:
        examinationSports.delSportsSubAttributeItemResp,
      editSportsSubAttributeItemResp:
        examinationSports.editSportsSubAttributeItemResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      branchClassResp: branchAcademics.branchClassResp,

      getExaminationSportsErrResp:
        examinationSports.getExaminationSportsErrResp,
    })
  );

  const subAttributesFormik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const subArraibutesRef = useRef({
    prevSaveSportsSubAttributeItemResp: saveSportsSubAttributeItemResp,
    prevEditSportsSubAttributeItemResp: editSportsSubAttributeItemResp,
    prevGetExaminationSportsErrResp: getExaminationSportsErrResp,
    prevDelSportsSubAttributeItemResp:delSportsSubAttributeItemResp
  });

  useEffect(() => {
    const {
      prevSaveSportsSubAttributeItemResp,
      prevEditSportsSubAttributeItemResp,
      prevGetExaminationSportsErrResp,
      prevDelSportsSubAttributeItemResp
    } = subArraibutesRef.current;

    if (
      saveSportsSubAttributeItemResp &&
      saveSportsSubAttributeItemResp !== prevSaveSportsSubAttributeItemResp
    ) {
      toast.success("Sports Sub Attribute added successfully");
      closeAddEditSubAttributeSportsModal();
      fetchSubAttributesList();
    } else if (
      editSportsSubAttributeItemResp &&
      editSportsSubAttributeItemResp !== prevEditSportsSubAttributeItemResp
    ) {
      toast.success("Sports Sub Attribute updated successfully");
      closeAddEditSubAttributeSportsModal();
      fetchSubAttributesList();
    } else if(delSportsSubAttributeItemResp && delSportsSubAttributeItemResp !== prevDelSportsSubAttributeItemResp){
      toast.success("Sports Sub Attribute deleted successfully")
      closeDelSubAttributeSportsModal()
      fetchSubAttributesList();
    }
    else if (
      getExaminationSportsErrResp &&
      getExaminationSportsErrResp !== prevGetExaminationSportsErrResp
    ) {
      const { details } = getExaminationSportsErrResp;
      toast.error(details || "Something went wrong");
    }

    subArraibutesRef.current.prevSaveSportsSubAttributeItemResp =
      saveSportsSubAttributeItemResp;
    subArraibutesRef.current.prevEditSportsSubAttributeItemResp =
      editSportsSubAttributeItemResp;
    subArraibutesRef.current.prevDelSportsSubAttributeItemResp =
        delSportsSubAttributeItemResp;
    subArraibutesRef.current.prevGetExaminationSportsErrResp =
      getExaminationSportsErrResp;
    
  }, [
    saveSportsSubAttributeItemResp,
    editSportsSubAttributeItemResp,
    delSportsSubAttributeItemResp,
    getExaminationSportsErrResp
  ]);

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
          openAddEditSubAttributeSportsModal(id);
        },
      },
      {
        id:"delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger"
            size={18}
          />
        ),
        actionName:"Delete",
        onClickHndlr:(event:any) => {
          const id = event.currentTarget.getAttribute("data-id")
          openDelSubAttributeSportsModal(id)
        }
      }
    ],
    []
  );

  function fetchSubAttributesList(otherProps?: any) {
    const { academicYearId, curriculumId, termId, classId } =
      subAttributesFormik.values;
    const payload = {
      branchId,
      academicYearId,
      curriculumId,
      termId,
      classId,
      ...otherProps,
      ...paginationRef.current,
    };
    dispatch(
      getSportsSubAttributeListAct(
        generateActionPayload(
          "get_sports_sub_attribute_list",
          undefined,
          payload
        )
      )
    );
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchSubAttributesList(paginationInfo);
  }

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      academicYearId: subAttributesFormik.values.academicYearId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
      ...otherProps,
    };

    dispatch(
      getBranchCurriculumAct(
        generateActionPayload("get_brch_curriculum", undefined, payload)
      )
    );
  }

  function fetchTermList(otherProps?: any) {
    const payload = {
      branchId,
      curriculumId: subAttributesFormik.values.curriculumId,
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
      academicYearId: subAttributesFormik.values?.academicYearId,
      curriculumId: subAttributesFormik.values.curriculumId,
      termId: subAttributesFormik.values.termId,
      sortBy: "classSequence",
      orderBy: "asc",
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };
    dispatch(
      getBranchClassAct(
        generateActionPayload("get_brch_curriculum_class", undefined, payload)
      )
    );
  }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;
    if (name === "academicYearId") {
      subAttributesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: "",
        termId: "",
        classId: "",
      }));

      if (value) {
        fetchCurriculumList({ academicYearId: value });
        fetchSubAttributesList({ [name]: value });
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
        fetchSubAttributesList({ [name]: value });
      }
    } else if (name === "curriculumId") {
      subAttributesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        termId: "",
        classId: "",
      }));

      if (value) {
        // fetchTermList({ curriculumId: value });
        fetchClasssList({ curriculumId: value });
        fetchSubAttributesList({ [name]: value });
      } else {
        fetchSubAttributesList({ [name]: value });
        dispatch(resetBrchClassAct(undefined));
      }
    } else {
      subAttributesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchSubAttributesList({ [name]: value });
    }
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
    subAttributesFormik.setValues((prevState: any) => ({
      ...prevState,
      ...appliedFilters,
    }));
    fetchSubAttributesList(appliedFilters);
  }

  function clearFilterHndlr() {
    paginationRef.current.pageNo = 0;
    const { academicYearId } =
      academicYearListResp?.data?.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      ) || {};
    const curriculumId = subAttributesFormik.values.curriculumId;
    subAttributesFormik.setValues({
      ...initialValues,
      academicYearId: academicYearId || "",
      curriculumId: curriculumId || "",
    });
    fetchSubAttributesList({
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

    subAttributesFormik.setFieldValue("academicYearId", yearId);
    fetchCurriculumList({ academicYearId: yearId });
    fetchSubAttributesList({ academicYearId: yearId });
  }, [academicYearListResp]);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );

  const {
    data: sportsSubAttributesList,
    totalElements,
    totalPages,
    pageNumber,
  } = getSportsSubAttributeListResp || {};
  const { data: academicYearList } = academicYearListResp || {};
  const { content: classTypes } = branchClassResp || {};

  function delSubAttributeHnlr() {
    const uniqueId = delSubAttributeSportsModalState.modalData;
    if (!uniqueId || !sportsSubAttributesList?.length) return;

    const matchedItem = sportsSubAttributesList.find(
      (item: any) => +item?.uniqueId === +uniqueId
    );

    const {sportsClassId,id} = matchedItem || {}
    if (!sportsClassId && !id) return;

    dispatch(
      delSportsSubAttributeItemAct(
        generateActionPayload("del_sports_sub_attribute_item", {
          attributeId:id,
          sportsClassId,
        },undefined)
      )
    );
  }

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Sports Sub-Attributes
                  </h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row px-3 g-3 pt-3">
                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-3"
                      placeHolder="Search..."
                      value={subAttributesFormik.values.searchString}
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
                    value={subAttributesFormik.values.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                <div className="col-xs-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={subAttributesFormik.values.curriculumId}
                    onChange={filterHandler}
                    onBlur={subAttributesFormik.handleBlur}
                    menuItems={brchCurriculumResp?.data}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>
                {/* <div className="col-xs-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="termId"
                    value={subAttributesFormik.values.termId}
                    onChange={filterHandler}
                    onBlur={subAttributesFormik.handleBlur}
                    menuItems={
                      Array.isArray(getIgseTermNameListResp?.data)
                        ? getIgseTermNameListResp?.data
                        : []
                    }
                    valueKey="termId"
                    textKey="termName"
                    labelText="Term"
                    floatingLabel
                  />
                </div> */}
                {/* <div className="col-xs-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="classId"
                    value={subAttributesFormik.values.classId}
                    onChange={filterHandler}
                    menuItems={classTypes}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    floatingLabel
                    formgroupClassName="mb-0"
                  />
                </div> */}

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
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => openAddEditSubAttributeSportsModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={tableColumns || []}
                data={
                  Array.isArray(sportsSubAttributesList)
                    ? sportsSubAttributesList
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
          </div>

          <ModalContainerUpdated
            id="add-edit-sub-attribute-sports-modal"
            isOpen={addEditSubAttributeSportsModalState.showModal}
            toggle={closeAddEditSubAttributeSportsModal}
            modalTitle={
              addEditSubAttributeSportsModalState.modalData
                ? "Edit Sub Attribute Sports"
                : "Add Sub Attribute Sports"
            }
            modalSize="md"
          >
            <AddEditSubAttributeSportsModal
              isOpen={addEditSubAttributeSportsModalState.showModal}
              toggle={closeAddEditSubAttributeSportsModal}
              editItemId={addEditSubAttributeSportsModalState.modalData}
            />
          </ModalContainerUpdated>

          <OffCanvasContainer
            isOpen={open}
            headerTitle="Advance Filters"
            closeHndlr={toggleAdvanceFilter}
            id="advance-filter-book-issuance"
          >
            <AdvanceFilterModal
              appliedFilter={subAttributesFormik.values}
              applyFilterCallback={advanceFilterCallbckHndlr}
              toggleAdvanceFilter={toggleAdvanceFilter}
              isOpen={open}
            />
          </OffCanvasContainer>
        </div>
      </div>

      <ConfirmationModal
        id = "del-sub-attribute-sports-modal"
        isOpen={delSubAttributeSportsModalState.showModal}
        confirmMessage="Are you sure you want to delete this Sub Attribute?"
        cancelHndlr={closeDelSubAttributeSportsModal}
        confirmHndlr={delSubAttributeHnlr}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default SubAttributeSports;
