import { useEffect, useMemo, useRef } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditMapSportsToClassModal from "./AddEditMapSportsToClassModal";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { useFormik } from "formik";
import {
  delSportsClassMappingAct,
  getSportsClassMappingByIdAct,
  getSportsClassMappingListAct,
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
import { getIgseTermNameListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  termId: "",
  classId: "",
};

const MapSportsToClass = () => {
  const {
    openModal: openAddEditMapSportsToClassModal,
    closeModal: closeAddEditMapSportsToClassModal,
    modalState: addEditMapSportsToClassModalState,
  } = useModal();
  const {
    openModal: openDeleteMapSportsToClassModal,
    closeModal: closeDeleteMapSportsToClassModal,
    modalState: deleteMapSportsToClassModalState,
  } = useModal();

  const dispatch = useAppDispatch();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    brchCurriculumResp,
    getSportsClassMappingListResp,
    saveSportsClassMappingItemResp,
    editSportsClassMappingItemResp,
    deleteSportsClassMappingResp,
    getExaminationSportsErrResp,
    branchClassResp,
    getIgseTermNameListResp,
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
      getSportsClassMappingListResp:
        examinationSports.getSportsClassMappingListResp,
      branchClassResp: branchAcademics.branchClassResp,

      saveSportsClassMappingItemResp:
        examinationSports.saveSportsClassMappingItemResp,
      editSportsClassMappingItemResp:
        examinationSports.editSportsClassMappingItemResp,
      deleteSportsClassMappingResp: examinationSports.deleteSportsClassMappingResp,
      getExaminationSportsErrResp:
        examinationSports.getExaminationSportsErrResp,
    })
  );

  const sportsClassMappingFormik = useFormik({
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
          openAddEditMapSportsToClassModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger"
            size={18}
          />
        ),
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDeleteMapSportsToClassModal(id);
        },
      },
    ],
    [getSportsClassMappingListResp]
  );

  function fetchSportsClassMappingList(otherProps?: any) {
    const { academicYearId, curriculumId, termId, classId } =
      sportsClassMappingFormik.values;
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
      getSportsClassMappingListAct(
        generateActionPayload(
          "get_sports_class_mapping_list",
          undefined,
          payload
        )
      )
    );
  }

  const sportMappingRef = useRef({
    prevSaveSportsClassMappingItemResp: saveSportsClassMappingItemResp,
    prevEditSportsClassMappingItemResp: editSportsClassMappingItemResp,
    prevDeleteSportsClassMappingResp: deleteSportsClassMappingResp,
    prevGetExaminationSportsErrResp: getExaminationSportsErrResp,
  });

  useEffect(() => {
    const {
      prevSaveSportsClassMappingItemResp,
      prevEditSportsClassMappingItemResp,
      prevDeleteSportsClassMappingResp,
      prevGetExaminationSportsErrResp,
    } = sportMappingRef.current;

    if (
      saveSportsClassMappingItemResp &&
      saveSportsClassMappingItemResp !== prevSaveSportsClassMappingItemResp
    ) {
      toast.success("Sports Mapped successfully");
      fetchSportsClassMappingList();
      closeAddEditMapSportsToClassModal();
    } else if (
      editSportsClassMappingItemResp &&
      editSportsClassMappingItemResp != prevEditSportsClassMappingItemResp
    ) {
      toast.success("Sports Mapping updated successfully");
      fetchSportsClassMappingList();
      closeAddEditMapSportsToClassModal();
    } else if (
      deleteSportsClassMappingResp &&
      deleteSportsClassMappingResp !== prevDeleteSportsClassMappingResp
    ) {
      toast.success("Sport Mapping deleted successfully");
      closeDeleteMapSportsToClassModal();
      fetchSportsClassMappingList();
    } else if (
      getExaminationSportsErrResp &&
      getExaminationSportsErrResp !== prevGetExaminationSportsErrResp
    ) {
      const { details } = getExaminationSportsErrResp;
      toast.error(details || "Something went wrong");
    }

    sportMappingRef.current.prevSaveSportsClassMappingItemResp =
      saveSportsClassMappingItemResp;
    sportMappingRef.current.prevEditSportsClassMappingItemResp =
      editSportsClassMappingItemResp;
    sportMappingRef.current.prevDeleteSportsClassMappingResp = deleteSportsClassMappingResp;
    sportMappingRef.current.prevGetExaminationSportsErrResp =
      getExaminationSportsErrResp;
  }, [
    saveSportsClassMappingItemResp,
    editSportsClassMappingItemResp,
    deleteSportsClassMappingResp,
    getExaminationSportsErrResp,
  ]);

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchSportsClassMappingList(paginationInfo);
  }

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      academicYearId: sportsClassMappingFormik.values.academicYearId,
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

  function delSportNameItemHndlr() {
    const uniqueId = Number(deleteMapSportsToClassModalState.modalData);
    const selectedRow = getSportsClassMappingListResp?.data?.find(
      (item: any) => item.uniqueId === uniqueId
    );
    if (!selectedRow) return;
    const payload = {
      academicYearId: selectedRow.academicYearId,
      branchId: branchId,
      curriculumId: selectedRow.curriculumId,
      termId: selectedRow.termId,
      sportId: selectedRow.sportsId,
    };

    dispatch(
      delSportsClassMappingAct(
        generateActionPayload("delete_sports_class_mapping_item", payload)
      )
    );
  }

  function fetchTermList(otherProps?: any) {
    const payload = {
      branchId,
      curriculumId: sportsClassMappingFormik.values.curriculumId,
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
      academicYearId: sportsClassMappingFormik.values?.academicYearId,
      curriculumId: sportsClassMappingFormik.values.curriculumId,
      termId: sportsClassMappingFormik.values.termId,
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
      sportsClassMappingFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: "",
        termId: "",
        classId: "",
      }));

      if (value) {
        fetchCurriculumList({ academicYearId: value });
        fetchSportsClassMappingList({ [name]: value });
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
      }
    } else if (name === "curriculumId") {
      sportsClassMappingFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        termId: "",
        classId: "",
      }));

      if (value) {
        // fetchTermList({ curriculumId: value });
        fetchClasssList({ curriculumId: value });
        fetchSportsClassMappingList({ [name]: value });
      } else {
        fetchSportsClassMappingList({ [name]: value });
        dispatch(resetBrchClassAct(undefined));
      }
    } else {
      sportsClassMappingFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchSportsClassMappingList({ [name]: value });
    }
  }

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    sportsClassMappingFormik.setFieldValue("academicYearId", yearId);
    fetchSportsClassMappingList({ academicYearId: yearId });
    fetchCurriculumList({ academicYearId: yearId });
  }, [academicYearListResp]);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions, getSportsClassMappingListResp]
  );

  const {
    data: sportsClassMappingList,
    totalElements,
    totalPages,
    pageNumber,
  } = getSportsClassMappingListResp || {};

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
                    Map Sports to Classes
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
                      value={sportsClassMappingFormik.values.searchString}
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
                    value={sportsClassMappingFormik.values.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic year"
                    floatingLabel
                  />
                </div>
                <div className="col-xs-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={sportsClassMappingFormik.values.curriculumId}
                    onChange={filterHandler}
                    onBlur={sportsClassMappingFormik.handleBlur}
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
                    value={sportsClassMappingFormik.values.termId}
                    onChange={filterHandler}
                    onBlur={sportsClassMappingFormik.handleBlur}
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
                <div className="col-xs-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="classId"
                    value={sportsClassMappingFormik.values.classId}
                    onChange={filterHandler}
                    menuItems={classTypes}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    floatingLabel
                    formgroupClassName="mb-0"
                  />
                </div>
                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => openAddEditMapSportsToClassModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={tableColumns || []}
                data={
                  Array.isArray(sportsClassMappingList)
                    ? sportsClassMappingList
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
        </div>
      </div>

      <ModalContainerUpdated
        id="add-edit-map-sports-to-class-modal"
        isOpen={addEditMapSportsToClassModalState.showModal}
        toggle={closeAddEditMapSportsToClassModal}
        modalTitle={
          addEditMapSportsToClassModalState.modalData
            ? "Edit Sports Class Mapping"
            : "Add Sports Class Mapping"
        }
        modalSize="md"
      >
        <AddEditMapSportsToClassModal
          toggle={() => closeAddEditMapSportsToClassModal()}
          itemId={addEditMapSportsToClassModalState.modalData}
          isOpen={addEditMapSportsToClassModalState.showModal}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-map-sports-to-class-modal"
        isOpen={deleteMapSportsToClassModalState.showModal}
        confirmMessage="Are you sure you want to delete this Sports Class Mapping?"
        cancelHndlr={closeDeleteMapSportsToClassModal}
        confirmHndlr={delSportNameItemHndlr}
        iconType="reject"
      />
    </>
  );
};

export default MapSportsToClass;
