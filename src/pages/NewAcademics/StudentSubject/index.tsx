
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { useModal } from "../../../hooks/modalhook";
import { useEffect, useMemo, useRef, useState } from "react";
import { deleteChangeStudentSubjectsDetailsAct, getChangeStudentSubjectsByIdDetailsAct, getChangeStudentSubjectsDetailsAct } from "../../../store/examination/examinationmanagement/examinationmanagementactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateColumns, ignoredKeys } from "./helper";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import TableContainer from "../../../Components/Common/TableContainer";
import ChangeStudentModel from "./ChangeStudentModel";
import { useFilterState } from "../../../hooks/filterhook";
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteIconSvg } from "../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Button from "../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
};

const StudentSubject = () => {
  const dispatch = useAppDispatch();
  const { closeModal: closeStudentSubjectsSubjectsUploadModal, modalState: changeStudentSubjectsUploadState, openModal: openStudentSubjectsSubjectsUploadModal } = useModal();
  const [filterState, setFilterState] = useState(initialValues);
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()
  const { closeModal: closeDelStudentSubjectsSubjectsModal, modalState: deleteStudentSubjectsSubjectsState, openModal: openDelStudentSubjectsSubjectsModal } = useModal();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  });

  const changeStudentsSubjectsDetails = (otherProps?: any) => {
    let payload = {
      branchId,
      ...filterState,
      ...pagination.current,
      ...otherProps,
    };

    if (payload.academicYearId) {
      dispatch(getChangeStudentSubjectsDetailsAct(generateActionPayload("get_change_student_subjects", undefined, payload)));
    }
  };

  function delModalSubmitHndlr() {
    dispatch(deleteChangeStudentSubjectsDetailsAct(generateActionPayload("delete_change_student_subjects", { id: deleteStudentSubjectsSubjectsState.modalData })));
  }
  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    brchCurriculumResp,
    branchClassResp,
    showApiLoader,
    changeStudentSubjectsDetailsResp,
    saveChangeStudentSubjectsResp,
    updateChangeStudentSubjectsResp,
    deleteChangeStudentSubjectsResp,
    examinationManagementErrorResp
  } = useAppSelector(
    ({ instAcademics, branchAcademics, examinationManagement, appData, globalData, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      changeStudentSubjectsDetailsResp: examinationManagement.changeStudentSubjectsDetailsResp,
      saveChangeStudentSubjectsResp: examinationManagement.saveChangeStudentSubjectsResp,
      updateChangeStudentSubjectsResp: examinationManagement.updateChangeStudentSubjectsResp,
      deleteChangeStudentSubjectsResp: examinationManagement.deleteChangeStudentSubjectsResp,
      examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
    }),
    shallowEqual
  );

  const changeStudentSubjectsRef = useRef({
    prevSaveChangeStudentSubjectsResp: saveChangeStudentSubjectsResp,
    prevUpdateChangeStudentSubjectsResp: updateChangeStudentSubjectsResp,
    prevDeleteChangeStudentSubjectsResp: deleteChangeStudentSubjectsResp,
    prevExaminationManagementErrorResp: examinationManagementErrorResp,
  })

  useEffect(() => {
    const { prevSaveChangeStudentSubjectsResp, prevUpdateChangeStudentSubjectsResp, prevDeleteChangeStudentSubjectsResp, prevExaminationManagementErrorResp } = changeStudentSubjectsRef.current;
    if (saveChangeStudentSubjectsResp && prevSaveChangeStudentSubjectsResp !== saveChangeStudentSubjectsResp) {
      toast.success("Student Subjects added successfully.");
      closeStudentSubjectsSubjectsUploadModal()
      changeStudentsSubjectsDetails()
    }
    else if (updateChangeStudentSubjectsResp && prevUpdateChangeStudentSubjectsResp !== updateChangeStudentSubjectsResp) {
      toast.success("Student Subjects updated successfully.");
      closeStudentSubjectsSubjectsUploadModal()
      changeStudentsSubjectsDetails()
    }
    else if (deleteChangeStudentSubjectsResp && prevDeleteChangeStudentSubjectsResp !== deleteChangeStudentSubjectsResp) {
      toast.success("Student Subjects deleted successfully.");
      closeDelStudentSubjectsSubjectsModal()
      changeStudentsSubjectsDetails()
    }
    else if (examinationManagementErrorResp && prevExaminationManagementErrorResp !== examinationManagementErrorResp) {
      const { details } = examinationManagementErrorResp || {};
      toast.error(details || "Something went wrong.");
    }
    changeStudentSubjectsRef.current.prevDeleteChangeStudentSubjectsResp = deleteChangeStudentSubjectsResp;
    changeStudentSubjectsRef.current.prevUpdateChangeStudentSubjectsResp = updateChangeStudentSubjectsResp;
    changeStudentSubjectsRef.current.prevSaveChangeStudentSubjectsResp = saveChangeStudentSubjectsResp;
    changeStudentSubjectsRef.current.prevExaminationManagementErrorResp = examinationManagementErrorResp;
  }, [saveChangeStudentSubjectsResp, updateChangeStudentSubjectsResp, deleteChangeStudentSubjectsResp, examinationManagementErrorResp]);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    changeStudentsSubjectsDetails({ academicYearId: yearId })
    getCurriculumApiCall({ academicYearId: yearId })
  }, [academicYearListResp]);

  useEffect(() => {
    changeStudentsSubjectsDetails();
  }, []);

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <EditSvg color="#405189" />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(getChangeStudentSubjectsByIdDetailsAct(generateActionPayload("get_change_student_subjects_by_id", { id })));
          openStudentSubjectsSubjectsUploadModal(id);
        },

      },
      {
        id: "delete",
        actionIcon: <DeleteIconSvg className="tw-mr-2 tw-mb-1" fill="#f06548" />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDelStudentSubjectsSubjectsModal(id)
        },
      },
    ],
    [changeStudentSubjectsDetailsResp]
  );

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    changeStudentsSubjectsDetails(paginationInfo);
  }

  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: filterState?.academicYearId, curriculumId: filterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      setFilterState((prev: any) => ({ ...prev, [name]: value, classId: null, curriculumId: null }));
      changeStudentsSubjectsDetails({ [name]: value, classId: null, curriculumId: null });
    }
    else if (name === "curriculumId") {
      if (value) {
        getClassApiCall({ curriculumId: value, academicYearId: filterState.academicYearId });
      }
      else {
        dispatch(resetBrchClassAct(undefined));
      }
      changeStudentsSubjectsDetails({ [name]: value, classId: null });
      setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
    } else {
      setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
      changeStudentsSubjectsDetails({ [name]: value, });
    }
    advanceFilterChange({ keys: { ...filterState, [name]: value }, ignoredKeys })
  };

  function clearFilterHndlr() {
    pagination.current.pageNo = 0;
    setFilterState({ ...initialValues });
    changeStudentsSubjectsDetails({ ...initialValues });
    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys })
  }

  const columns = useMemo(() => generateColumns(menuOptions), [changeStudentSubjectsDetailsResp]);
  const { data: changeStudentSubjectsResp, totalElements, totalPages, pageable } = changeStudentSubjectsDetailsResp || {};
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="daily attendance" pageTitle="Academics" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">
            <div className="tw-border-b tw-px-4 tw-py-3 tw-flex tw-items-center tw-justify-between">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Change Student Subjects
              </h4>
              <Button
                type="button"
                variant="primary"
                onClick={() => openStudentSubjectsSubjectsUploadModal()}
              >
                <i className="ri-add-line"></i>
                Add New
              </Button>
            </div>
            <div className="tw-px-4 tw-py-4 tw-border-b">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-end">
                <div className="tw-col-span-12 md:tw-col-span-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-0"
                      labelText='Search'
                      placeHolder="Search"
                      value={filterState.searchString}
                      onChange={onChangeFilterHndlr}
                      floatingLabel
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="tw-col-span-12 md:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={filterState.academicYearId}
                    onChange={onChangeFilterHndlr}
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
                    value={filterState.curriculumId}
                    onChange={onChangeFilterHndlr}
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
                    name="classId"
                    value={filterState.classId}
                    onChange={onChangeFilterHndlr}
                    menuItems={classTypes || []}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="tw-mb-0"
                    labelText="Class"
                    floatingLabel
                  />
                </div>
                {showClearFilterState && (
                  <div className="tw-col-span-12 md:tw-col-span-2 tw-flex tw-justify-end">
                    <Button
                      type="button"
                      variant="wrong"
                      onClick={clearFilterHndlr}
                    >
                      Clear Filter
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="tw-p-0">
              <TableContainer
                columns={columns}
                data={Array.isArray(changeStudentSubjectsResp) ? changeStudentSubjectsResp : []}
                tableClass="tw-mb-0"
                divClass="tw-table-responsive tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber || 0}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-examination-StudentSubjects"
        isOpen={changeStudentSubjectsUploadState.showModal}
        toggle={() => closeStudentSubjectsSubjectsUploadModal()}
        modalTitle={changeStudentSubjectsUploadState.modalData ? "Edit change Student Subjects Details" : "Create Details"}
        modalSize="md"
      >
        <ChangeStudentModel
          id={changeStudentSubjectsUploadState.modalData}
          isOpen={false}
          toggle={() => closeStudentSubjectsSubjectsUploadModal()}
          modalTitle="Create Detail"
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-examination-StudentSubjects"
        isOpen={deleteStudentSubjectsSubjectsState.showModal}
        confirmMessage="Are you sure you want to delete this Student Subjects ?"
        cancelHndlr={closeDelStudentSubjectsSubjectsModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default StudentSubject;
