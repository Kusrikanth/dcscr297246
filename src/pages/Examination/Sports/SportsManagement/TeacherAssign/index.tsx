import { useEffect, useMemo, useRef } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CancelCircleHalfDotIcon,
  Delete02Icon,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { useFormik } from "formik";
import {
  getSportsTeacherListAct,
  getSportsNamesAct,
  unassignSportsTeacherAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import {
  getBranchCurriculumAct,
  resetBrchCurriculumAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getIgseTermNameListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import AddSportsTeacherModal from "./AddSportsTeacherModal";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import { identifyStructFormat } from "ketcher-core";
import ViewAssignedSportsTeachersModal from "./ViewAssignedSportsTeachersModal";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  sportsId: "",
  termId: "",
};

const TeacherAssign = () => {
  const {
    openModal: openAddSportsTeacherModal,
    closeModal: closeAddMapSportsTeacherModal,
    modalState: addSportsTeacherModalState,
  } = useModal();
  const {
    openModal: openUnAssignSportsTeacherModal,
    closeModal: closeUnAssignMapSportsTeacherModal,
    modalState: deleteUnAssignSportsTeacherModalState,
  } = useModal();

  const {
    openModal: viewAssignedSportsTeachersOpenModal,
    closeModal: viewAssignedSportsTeachersCloseModal,
    modalState: viewAssignedSportsTeachersModalState,
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
    getSportsTeacherListResp,
    getExaminationSportsErrResp,
    getIgseTermNameListResp,
    getSportsNamesResp,
    saveSportsTeacherResp,
    editSportsTeacherResp,
    unAssignSportsTeacherResp,
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
      getSportsNamesResp: examinationSports.getSportsNamesResp,
      getSportsTeacherListResp: examinationSports.getSportsTeacherListResp,
      getExaminationSportsErrResp:
        examinationSports.getExaminationSportsErrResp,
      saveSportsTeacherResp: examinationSports.saveSportsTeacherResp,
      editSportsTeacherResp: examinationSports.editSportsTeacherResp,
      unAssignSportsTeacherResp: examinationSports.unAssignSportsTeacherResp,
    })
  );

  const sportsTeacherFormik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const menuOptions = useMemo(
    () => [
      {
        id: "reassign",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Change the sport teacher",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openAddSportsTeacherModal(id);
        },
      },
      // {
      //   id: "unassign",
      //   actionIcon: (
      //     <HugeiconsIcon
      //       icon={Delete02Icon}
      //       className="text-danger"
      //       size={18}
      //     />
      //   ),
      //   actionName: "Delete",
      //   onClickHndlr: (event: any) => {
      //     const id = event.currentTarget.getAttribute("data-id");
      //     openUnAssignSportsTeacherModal(id);
      //   },
      // },
    ],
    []
  );

  function fetchSportsTeacherList(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: sportsTeacherFormik.values.academicYearId,
      ...otherProps,
      ...paginationRef.current,
    };
    dispatch(
      getSportsTeacherListAct(
        generateActionPayload("get_sports_teacher_list", undefined, payload)
      )
    );
  }

  const sportMappingRef = useRef({
    prevSaveSportsTeacherResp: saveSportsTeacherResp,
    prevEditSportsTeacherResp: editSportsTeacherResp,
    prevGetExaminationSportsErrResp: getExaminationSportsErrResp,
    prevUnAssignSportsTeacherResp: unAssignSportsTeacherResp,
  });

  useEffect(() => {
    const {
      prevSaveSportsTeacherResp,
      prevEditSportsTeacherResp,
      prevGetExaminationSportsErrResp,
      prevUnAssignSportsTeacherResp,
    } = sportMappingRef.current;

    if (
      saveSportsTeacherResp &&
      saveSportsTeacherResp !== prevSaveSportsTeacherResp
    ) {
      toast.success("Sports Teacher Assigned successfully");
      fetchSportsTeacherList();
      closeAddMapSportsTeacherModal();
    } else if (
      editSportsTeacherResp &&
      editSportsTeacherResp !== prevEditSportsTeacherResp
    ) {
      toast.success("Sports Teacher Assigned successfully");
      fetchSportsTeacherList();
      closeAddMapSportsTeacherModal();
    } else if (
      getExaminationSportsErrResp &&
      getExaminationSportsErrResp !== prevGetExaminationSportsErrResp
    ) {
      const { details } = getExaminationSportsErrResp;
      toast.error(details || "Something went wrong");
    } else if (
      unAssignSportsTeacherResp &&
      unAssignSportsTeacherResp !== prevUnAssignSportsTeacherResp
    ) {
      toast.success("Sports Teacher Unassigned successfully");
      fetchSportsTeacherList();
      closeUnAssignMapSportsTeacherModal();
    }

    sportMappingRef.current.prevSaveSportsTeacherResp = saveSportsTeacherResp;
    sportMappingRef.current.prevEditSportsTeacherResp = editSportsTeacherResp;
    sportMappingRef.current.prevGetExaminationSportsErrResp =
      getExaminationSportsErrResp;
    sportMappingRef.current.prevUnAssignSportsTeacherResp =
      unAssignSportsTeacherResp;
  }, [
    saveSportsTeacherResp,
    editSportsTeacherResp,
    getExaminationSportsErrResp,
    unAssignSportsTeacherResp,
  ]);

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchSportsTeacherList(paginationInfo);
  }

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      academicYearId: sportsTeacherFormik.values.academicYearId,
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
      curriculumId: sportsTeacherFormik.values.curriculumId,
      ...otherProps,
    };

    dispatch(
      getIgseTermNameListAct(
        generateActionPayload("get_igse_term_name_list", undefined, payload)
      )
    );
  }

  function fetchSportsList(otherProps?: any) {
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

  function unAssignSportsTeacherModalConfirmHndlr() {
    const id = deleteUnAssignSportsTeacherModalState.modalData;
    if (id) {
      const selectedItem = getSportsTeacherListResp?.data.find(
        (item) => +item?.sportsId === +id
      );
      const payload = {
        id,
        teacherId: selectedItem.teacherId,
        isDeleted: true,
      };
      dispatch(
        unassignSportsTeacherAct(
          generateActionPayload("unassign_sports_teacher", undefined, payload)
        )
      );
    }
  }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;
    if (name === "academicYearId") {
      sportsTeacherFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: "",
        termId: "",
      }));

      if (value) {
        fetchCurriculumList({ academicYearId: value });
        fetchSportsTeacherList({ [name]: value });
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
      }
    } else if (name === "sportsId") {
      sportsTeacherFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchSportsTeacherList({ [name]: value });
    } else if (name === "curriculumId") {
      sportsTeacherFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        termId: "",
      }));

      if (value) {
        fetchTermList({ curriculumId: value });
        fetchSportsTeacherList({ [name]: value });
      } else {
        fetchSportsTeacherList({ [name]: value });
      }
    } else {
      sportsTeacherFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      fetchSportsTeacherList({ [name]: value });
    }
  }

  // useEffect(() => {
  //   const { data } = academicYearListResp || {};
  //   if (Array.isArray(data) && data.length > 0) {
  //     let { academicYearId } =
  //       data.find((year: any) => year.isAdmissionDefault) || {};
  //     if (academicYearId) {
  //       sportsTeacherFormik.setFieldValue("academicYearId", academicYearId);
  //       fetchCurriculumList({ academicYearId });
  //       fetchSportsTeacherList({ academicYearId });
  //     }
  //   }
  // }, [academicYearListResp]);

  useEffect(() => {
      const yearId =
        academicYearListResp &&
        academicYearListResp.data.find(
          (year: any) => year.yearStatus.toLowerCase() === "current"
        )?.academicYearId;
  
      sportsTeacherFormik.setFieldValue("academicYearId", yearId);
        fetchCurriculumList({ academicYearId:yearId });
        fetchSportsTeacherList({ academicYearId:yearId });
    }, [academicYearListResp]);

  useEffect(() => {
    if (branchId) {
      fetchSportsList();
    }
  }, [branchId]);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions, viewAssignedSportsTeachersOpenModal),
    [menuOptions]
  );

  const {
    data: sportsTeacherList,
    totalElements,
    totalPages,
    pageNumber,
  } = getSportsTeacherListResp || {};

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
                    Assign Teacher to Sports
                  </h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row px-3 g-3 pt-3">
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-3"
                      placeHolder="Search..."
                      value={sportsTeacherFormik.values.searchString}
                      onChange={filterHandler}
                      floatingLabel
                      labelText="Search"
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="academicYearId"
                    value={sportsTeacherFormik.values.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearListResp?.data}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
                  <SelectInput
                    name="sportsId"
                    value={sportsTeacherFormik.values.sportsId}
                    onChange={filterHandler}
                    menuItems={getSportsNamesResp?.data || []}
                    valueKey="id"
                    textKey="sportName"
                    labelText="Sports"
                    floatingLabel
                  />
                </div>
                {/* <div className="col-xs-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={sportsTeacherFormik.values.curriculumId}
                    onChange={filterHandler}
                    onBlur={sportsTeacherFormik.handleBlur}
                    menuItems={brchCurriculumResp?.data}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>
                <div className="col-xs-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="termId"
                    value={sportsTeacherFormik.values.termId}
                    onChange={filterHandler}
                    onBlur={sportsTeacherFormik.handleBlur}
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
                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => openAddSportsTeacherModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={tableColumns || []}
                data={Array.isArray(sportsTeacherList) ? sportsTeacherList : []}
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
              id="add-edit-map-sports-to-class-modal"
              isOpen={addSportsTeacherModalState.showModal}
              toggle={closeAddMapSportsTeacherModal}
              modalTitle={
                addSportsTeacherModalState.modalData
                  ? "Change Sports Teacher"
                  : "Add Sports Teacher"
              }
              modalSize="md"
            >
              <AddSportsTeacherModal
                toggle={() => closeAddMapSportsTeacherModal()}
                isOpen={addSportsTeacherModalState.showModal}
                editItemId={addSportsTeacherModalState.modalData}
              />
            </ModalContainerUpdated>

            <ConfirmationModal
              id="delete-map-sports-to-class-modal"
              isOpen={deleteUnAssignSportsTeacherModalState.showModal}
              confirmMessage="Are you sure you want to Delete this Sports Teacher?"
              cancelHndlr={closeUnAssignMapSportsTeacherModal}
              confirmHndlr={unAssignSportsTeacherModalConfirmHndlr}
              iconType="reject"
            />

            <ModalContainerUpdated
              id="view-assigned-sports-teachers-modal"
              isOpen={viewAssignedSportsTeachersModalState.showModal}
              toggle={viewAssignedSportsTeachersCloseModal}
              modalTitle="Assigned Sports Teachers"
              modalSize="md"
            >
              <ViewAssignedSportsTeachersModal
                isOpen={viewAssignedSportsTeachersModalState.showModal}
                itemId={viewAssignedSportsTeachersModalState.modalData}
              ></ViewAssignedSportsTeachersModal>
            </ModalContainerUpdated>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherAssign;
