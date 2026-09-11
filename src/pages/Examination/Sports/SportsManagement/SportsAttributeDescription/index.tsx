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
import AddEditSportsAttributeDescriptionModal from "./AddEditSportsAttributeDescriptionModal";
import ViewSportDescriptionModal from "./ViewSportDescriptionModal";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import { delSportsDiscriptionsItemsAct, getSportsDiscriptionsListAct } from "../../../../../store/examination/examinationSports/examinationSportsActions";
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
  mainAttributeId: "",
  sportsClassId: "",
  sportsId: "",
  termId: "",
  classId: "",
};

const SportsAttributeDescription = () => {
  const {
    openModal: openAddEditSportsAttributeModal,
    closeModal: closeAddEditSportsAttributeModal,
    modalState: addEditSportsAttributeModalState,
  } = useModal();
  const {
    openModal: viewSportDescriptionOpenModal,
    closeModal: viewSportDescriptionCloseModal,
    modalState: viewSportDescriptionModalState,
  } = useModal();
  const {
    openModal: openDelSportsAttributeModal,
    closeModal: closeDelSportsAttributeModal,
    modalState: delSportsAttributeModalState,
  } = useModal()

  const { showClearFilterState, count, advanceFilterChange } = useFilterState();
  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const sportsAttributeDescriptionFormik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {},
  });

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchSportsDiscriptionsList(paginationInfo);
  }
  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    brchCurriculumResp,
    getSportsDiscriptionsListResp,
    saveSportsDiscriptionsListResp,
    delSportsDiscriptionsItemResp,
    getExaminationSportsErrResp,
    getIgseTermNameListResp,
    branchClassResp,
  } = useAppSelector(
    ({
      examinationSports,
      instAcademics,
      appData,
      branchAcademics,
      examinationSettings,
    }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,

      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      getSportsDiscriptionsListResp:
        examinationSports.getSportsDiscriptionsListResp,
      saveSportsDiscriptionsListResp:
        examinationSports.saveSportsDiscriptionsListResp,
      delSportsDiscriptionsItemResp:
        examinationSports.delSportsDiscriptionsItemResp,
      getExaminationSportsErrResp:
        examinationSports.getExaminationSportsErrResp,
    }),
    shallowEqual
  );

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
          openAddEditSportsAttributeModal(id);
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
          openDelSportsAttributeModal(id)
        }
      }
    ],
    []
  );

  function fetchSportsDiscriptionsList(otherProps?: any) {
    const { academicYearId, curriculumId, termId, classId } =
      sportsAttributeDescriptionFormik.values;

    const payload = {
      branchId,
      academicYearId: academicYearId,
      curriculumId,
      termId,
      classId,
      ...otherProps,
      ...paginationRef.current,
    };
    dispatch(
      getSportsDiscriptionsListAct(
        generateActionPayload(
          "get_sports_discriptions_list",
          undefined,
          payload
        )
      )
    );
  }

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      academicYearId: sportsAttributeDescriptionFormik.values.academicYearId,
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
      curriculumId: sportsAttributeDescriptionFormik.values.curriculumId,
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
      academicYearId: sportsAttributeDescriptionFormik.values?.academicYearId,
      curriculumId: sportsAttributeDescriptionFormik.values.curriculumId,
      termId: sportsAttributeDescriptionFormik.values.termId,
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

  const sportsDiscriptionsRef = useRef({
    prevSaveSportsDiscriptionsListResp: saveSportsDiscriptionsListResp,
    prevDelSportsDiscriptionsItemResp:delSportsDiscriptionsItemResp,
    prevGetExaminationSportsErrResp: getExaminationSportsErrResp,
  });

  useEffect(() => {
    const {
      prevSaveSportsDiscriptionsListResp,
      prevDelSportsDiscriptionsItemResp,
      prevGetExaminationSportsErrResp
    } = sportsDiscriptionsRef.current;
    if (
      saveSportsDiscriptionsListResp &&
      saveSportsDiscriptionsListResp !== prevSaveSportsDiscriptionsListResp
    ) {
      toast.success("Sports Discriptions added successfully");
      fetchSportsDiscriptionsList();
      closeAddEditSportsAttributeModal();
    } else if(delSportsDiscriptionsItemResp && delSportsDiscriptionsItemResp !== prevDelSportsDiscriptionsItemResp){
      toast.success("Sports Discription deleted successfully");
      fetchSportsDiscriptionsList();
      closeDelSportsAttributeModal()
    } else if (
      getExaminationSportsErrResp &&
      getExaminationSportsErrResp !== prevGetExaminationSportsErrResp
    ) {
      const { details } = getExaminationSportsErrResp;
      toast.error(details || "Something went wrong");
    }
    sportsDiscriptionsRef.current.prevSaveSportsDiscriptionsListResp =
      saveSportsDiscriptionsListResp;
    sportsDiscriptionsRef.current.prevDelSportsDiscriptionsItemResp =
      delSportsDiscriptionsItemResp;
    sportsDiscriptionsRef.current.prevGetExaminationSportsErrResp =
      getExaminationSportsErrResp;
  }, [saveSportsDiscriptionsListResp,delSportsDiscriptionsItemResp, getExaminationSportsErrResp]);

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;
    if (name === "academicYearId") {
      sportsAttributeDescriptionFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: "",
        termId: "",
        classId: "",
      }));

      if (value) {
        fetchCurriculumList({ academicYearId: value });
        fetchSportsDiscriptionsList({ [name]: value });
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
      }
    } else if (name === "curriculumId") {
      sportsAttributeDescriptionFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        termId: "",
        classId: "",
      }));

      if (value) {
        // fetchTermList({ curriculumId: value });
        fetchClasssList({ curriculumId: value });
        fetchSportsDiscriptionsList({ [name]: value });
      } else {
        fetchSportsDiscriptionsList({ [name]: value });
        dispatch(resetBrchClassAct(undefined));
      }
    } else {
      sportsAttributeDescriptionFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchSportsDiscriptionsList({ [name]: value });
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
    sportsAttributeDescriptionFormik.setValues((prevState: any) => ({
      ...prevState,
      ...appliedFilters,
    }));
    fetchSportsDiscriptionsList(appliedFilters);
  }

  function clearFilterHndlr() {
    paginationRef.current.pageNo = 0;
    const { academicYearId } =
      academicYearListResp?.data?.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      ) || {};
    const curriculumId = sportsAttributeDescriptionFormik.values.curriculumId;
    sportsAttributeDescriptionFormik.setValues({
      ...initialValues,
      academicYearId: academicYearId || "",
      curriculumId: curriculumId || "",
    });
    fetchSportsDiscriptionsList({
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
    sportsAttributeDescriptionFormik.setFieldValue("academicYearId", yearId);
    fetchSportsDiscriptionsList({ academicYearId: yearId });
    fetchCurriculumList({ academicYearId: yearId });
  }, []);

  const {
    content: sportsDiscriptionsList,
    totalElements,
    totalPages,
    pageNumber,
  } = getSportsDiscriptionsListResp || {};
  
  function delSubAttributeHnlr() {
      const uniqueId = delSportsAttributeModalState.modalData;
      if (!uniqueId || !sportsDiscriptionsList?.length) return;
  
      const matchedItem = sportsDiscriptionsList.find(
        (item: any) => +item?.uniqueId === +uniqueId
      );
  
      const {sportsClassId,mainAttributeId} = matchedItem || {}
      if (!sportsClassId && !mainAttributeId) return;
  
      dispatch(
        delSportsDiscriptionsItemsAct(
          generateActionPayload("del_sports_discriptions_items", {
            mainAttributeId:mainAttributeId,
            sportsClassId,
          },undefined)
        )
      );
    }

  function getViewSportsDescriptionSubAttributeIdHandlr(event: any, id: any) {
    const itemId = event.currentTarget.getAttribute("data-id");

    const descriptionItemData = getSportsDiscriptionsListResp?.content
      ?.find((item) => +item?.uniqueId === +itemId)
      ?.subAttributes?.find((iteam) => +iteam.subAttributeId === +id);

    viewSportDescriptionOpenModal(descriptionItemData);
  }

  const tableColumns = useMemo(
    () =>
      generateColumns(
        menuOptions,
        getViewSportsDescriptionSubAttributeIdHandlr
      ),
    [menuOptions, getViewSportsDescriptionSubAttributeIdHandlr]
  );

  const { data: academicYearList } = academicYearListResp || {};
  const { content: classTypes } = branchClassResp || {};
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
                    Sports Descriptions
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
                      value={
                        sportsAttributeDescriptionFormik.values.searchString
                      }
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
                    value={
                      sportsAttributeDescriptionFormik.values.academicYearId
                    }
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
                    value={sportsAttributeDescriptionFormik.values.curriculumId}
                    onChange={filterHandler}
                    onBlur={sportsAttributeDescriptionFormik.handleBlur}
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
                    value={sportsAttributeDescriptionFormik.values.termId}
                    onChange={filterHandler}
                    onBlur={sportsAttributeDescriptionFormik.handleBlur}
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
                    value={sportsAttributeDescriptionFormik.values.classId}
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
                    onClick={() => openAddEditSportsAttributeModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={tableColumns || []}
                data={
                  Array.isArray(sportsDiscriptionsList)
                    ? sportsDiscriptionsList
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
            id="add-edit-sports-attribute-modal"
            isOpen={addEditSportsAttributeModalState.showModal}
            toggle={closeAddEditSportsAttributeModal}
            modalTitle={
              addEditSportsAttributeModalState.modalData
                ? "Edit Sports Description"
                : "Add Sports Description"
            }
            modalSize="lg"
          >
            <AddEditSportsAttributeDescriptionModal
              isOpen={addEditSportsAttributeModalState.showModal}
              toggle={closeAddEditSportsAttributeModal}
              editItemId={addEditSportsAttributeModalState.modalData}
            />
          </ModalContainerUpdated>

          <ModalContainerUpdated
            id="view-sports-description"
            isOpen={viewSportDescriptionModalState.showModal}
            toggle={viewSportDescriptionCloseModal}
            modalTitle={
              viewSportDescriptionModalState?.modalData
                ? `${viewSportDescriptionModalState?.modalData?.subAttributeName} Description`
                : "View Sports Description"
            }
            modalSize="md"
          >
            <ViewSportDescriptionModal
              isOpen={viewSportDescriptionModalState.showModal}
              toggle={viewSportDescriptionCloseModal}
              data={viewSportDescriptionModalState.modalData}
            />
          </ModalContainerUpdated>

          <OffCanvasContainer
            isOpen={open}
            headerTitle="Advance Filters"
            closeHndlr={toggleAdvanceFilter}
            id="advance-filter-book-issuance"
          >
            <AdvanceFilterModal
              appliedFilter={sportsAttributeDescriptionFormik.values}
              applyFilterCallback={advanceFilterCallbckHndlr}
              toggleAdvanceFilter={toggleAdvanceFilter}
              isOpen={open}
            />
          </OffCanvasContainer>
        </div>
      </div>

      <ConfirmationModal
        id="del-sports-attribute-modal"
        isOpen={delSportsAttributeModalState.showModal}
        confirmMessage="Are you sure you want to delete this delete this Sports Description?"
        cancelHndlr={closeDelSportsAttributeModal}
        confirmHndlr={delSubAttributeHnlr}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default SportsAttributeDescription;
