import React, { useEffect, useMemo, useRef } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { useFormik } from "formik";
import {
  getBranchClassAct,
  getBranchCurriculumAct,
  getBrchStreamGroupsAct,
  resetBrchClassAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  SelectInput,
} from "../../../../Components/Common";
import {
  delOptionalSubjectItemAct,
  getOptionalSubjectItemByIdAct,
  getOptionalSubjectsListAct,
} from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import {
  resetOptionalSubjectsListAct,
} from "../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityslice";
import { useModal } from "../../../../hooks/modalhook";
import AddEditNewOptionalSubjectModal from "./AddEditNewOptionalSubjectModal";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
  groupId: "",
};

const OptionalSubjects = () => {
  const {
    openModal: addEditNewOptionalSubjectOpenModal,
    closeModal: addEditNewOptionalSubjectCloseModal,
    modalState: addEditNewOptionalSubjectModalState,
  } = useModal();
  const {
    openModal: delSportsNameOpenModal,
    closeModal: delSportsNameCloseModal,
    modalState: delSportsNameModalState,
  } = useModal();

  const optionalSubjectsFormik = useFormik({
    initialValues,
    onSubmit: () => { },
  });
  const dispatch = useAppDispatch();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    brchCurriculumResp,
    branchClassResp,
    academicYearListResp,
    brchStreamGroupsResp,
    getOptionalSubjectsListResp,
    saveOptionalSubjectItemsResp,
    editOptionalSubjectItemResp,
    delOptionalSubjectItemResp,
    academicAvailabilityErrorResp,

  } = useAppSelector(
    ({
      appData,
      branchAcademics,
      instAcademics,
      admissionAvailabilityRequest,
    }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchStreamGroupsResp: branchAcademics.brchStreamGroupsResp,
      getOptionalSubjectsListResp:
        admissionAvailabilityRequest.getOptionalSubjectsListResp,
      saveOptionalSubjectItemsResp:
        admissionAvailabilityRequest.saveOptionalSubjectItemsResp,
      editOptionalSubjectItemResp:
        admissionAvailabilityRequest.editOptionalSubjectItemResp,
      delOptionalSubjectItemResp:
        admissionAvailabilityRequest.delOptionalSubjectItemResp,
      academicAvailabilityErrorResp:
        admissionAvailabilityRequest.academicAvailabilityErrorResp,
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
            className="me-2 text-muted"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          addEditNewOptionalSubjectOpenModal(id);
          dispatch(
            getOptionalSubjectItemByIdAct(
              generateActionPayload("get_optional_subject_item_by_id", {
                id: id,
              })
            )
          );
        },
      },
      {
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="me-2 text-danger"
            size={18}
          />
        ),
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          delSportsNameOpenModal(id);
        }
      },
    ],
    []
  );

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: optionalSubjectsFormik.values.academicYearId,
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

  function fetchClassList(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: optionalSubjectsFormik.values.academicYearId,
      curriculumId: optionalSubjectsFormik.values.curriculumId,
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

  function fetchStreamGroupList(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: optionalSubjectsFormik.values.academicYearId,
      curriculumId: optionalSubjectsFormik.values.curriculumId,
      classId: optionalSubjectsFormik.values.classId,
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };
    dispatch(
      getBrchStreamGroupsAct(
        generateActionPayload("get_stream_groups", undefined, payload)
      )
    );
  }

  function fetchOptionalSubjectsList(otherProps?: any) {
    const { curriculumId, classId, groupId } = optionalSubjectsFormik.values;
    const payload = {
      instituteId,
      classId: classId,
      groupId: groupId,
      ...otherProps,
      ...paginationRef.current,
    };
    dispatch(
      getOptionalSubjectsListAct(
        generateActionPayload("get_optional_subjects_list", undefined, payload)
      )
    );
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchOptionalSubjectsList(paginationInfo);
  }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;
    if (name === "curriculumId") {
      optionalSubjectsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        classId: "",
        groupId: "",
      }));
      if (value) {
        fetchClassList({ curriculumId: value });
      } else {
        dispatch(resetBrchClassAct(undefined));
        dispatch(resetOptionalSubjectsListAct(undefined));
      }
    } else if (name === "classId") {
      optionalSubjectsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        groupId: "",
      }));
      if (value) {
        fetchStreamGroupList({ classId: value });
      } else {
        dispatch(resetOptionalSubjectsListAct(undefined));
      }
    } else if (name === "groupId") {
      optionalSubjectsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      if (value) {
        fetchOptionalSubjectsList({ groupId: value });
      } else {
        dispatch(resetOptionalSubjectsListAct(undefined));
      }
    } else {
      optionalSubjectsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  const optionalSubjectRef = useRef({
    prevSaveOptionalSubjectItemsResp: saveOptionalSubjectItemsResp,
    prevEditOptionalSubjectItemResp: editOptionalSubjectItemResp,
    prevDelOptionalSubjectItemResp: delOptionalSubjectItemResp,
    prevAcademicAvailabilityErrorResp: academicAvailabilityErrorResp,
  });

  useEffect(() => {
    const {
      prevSaveOptionalSubjectItemsResp,
      prevEditOptionalSubjectItemResp,
      prevDelOptionalSubjectItemResp,
      prevAcademicAvailabilityErrorResp,
    } = optionalSubjectRef.current;

    if (
      saveOptionalSubjectItemsResp &&
      saveOptionalSubjectItemsResp !== prevSaveOptionalSubjectItemsResp
    ) {
      toast.success("Optional Subject added successfully");
      addEditNewOptionalSubjectCloseModal();
      fetchOptionalSubjectsList();
    }
    else if (
      editOptionalSubjectItemResp &&
      editOptionalSubjectItemResp !== prevEditOptionalSubjectItemResp
    ) {
      toast.success("Optional Subject updated successfully");
      addEditNewOptionalSubjectCloseModal();
      fetchOptionalSubjectsList();
    }
    else if (
      delOptionalSubjectItemResp &&
      delOptionalSubjectItemResp !== prevDelOptionalSubjectItemResp
    ) {
      toast.success("Optional Subject deleted successfully");
      fetchOptionalSubjectsList();
      delSportsNameCloseModal();
    }
    optionalSubjectRef.current.prevSaveOptionalSubjectItemsResp = saveOptionalSubjectItemsResp;
    optionalSubjectRef.current.prevEditOptionalSubjectItemResp = editOptionalSubjectItemResp;
    optionalSubjectRef.current.prevDelOptionalSubjectItemResp = delOptionalSubjectItemResp;
  }, [
    saveOptionalSubjectItemsResp,
    editOptionalSubjectItemResp,
    delOptionalSubjectItemResp,
    academicAvailabilityErrorResp,
  ]);

  useEffect(() => {
    if (academicYearListResp) {
      let yearId =
        academicYearListResp &&
        academicYearListResp.data.find(
          (year: any) => year.yearStatus.toLowerCase() === "current"
        )?.academicYearId;
      optionalSubjectsFormik.setValues((prev: any) => ({
        ...prev,
        academicYearId: yearId,
      }));
      fetchCurriculumList({ academicYearId: yearId });
    }
  }, [academicYearListResp]);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};

    if (
      Array.isArray(data) &&
      data.length > 0 &&
      optionalSubjectsFormik.values.academicYearId
    ) {
      const firstCurriculum = data.find(
        (item: any) => item.shortName === "CBSE"
      );
      optionalSubjectsFormik.setValues((prev) => ({
        ...prev,
        curriculumId: firstCurriculum.branchCurriculumId,
      }));
      fetchClassList({ curriculumId: firstCurriculum.branchCurriculumId });
    }
  }, [brchCurriculumResp]);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: streamGroup } = brchStreamGroupsResp || {};
  const {
    content: optionalSubjectResList,
    pageable,
    totalPages,
    totalElements,
  } = getOptionalSubjectsListResp || {};

  useEffect(() => {
    if (Array.isArray(branchClassResp?.content) && branchClassResp.content.length > 0) {
      const firstClass = branchClassResp.content.find((item: any) => item?.classSequence >= 14);

      if (firstClass) {
        optionalSubjectsFormik.setFieldValue("classId", firstClass.id);
        fetchStreamGroupList({ classId: firstClass.id });
      }
    }
  }, [branchClassResp]);

  useEffect(() => {
    if (Array.isArray(streamGroup) && streamGroup.length > 0) {
      optionalSubjectsFormik.setFieldValue("groupId", streamGroup[0].id);
      fetchOptionalSubjectsList({ groupId: streamGroup[0].id });
    }
    dispatch(resetOptionalSubjectsListAct(undefined));
  }, [streamGroup]);

  function delSportNameItemHndlr() {
    dispatch(delOptionalSubjectItemAct(generateActionPayload("del_optional_subject_item", { id: delSportsNameModalState.modalData })));
  }

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">

          <BreadCrumb pageTitle="Optional Subjects" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-200">

            {/* Header */}
            <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3 tw-border-b tw-border-gray-200">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Optional Subjects
              </h4>

              <Button
              variant="primary"
                onClick={() => addEditNewOptionalSubjectOpenModal()}
              >
                <i className="ri-add-line tw-mr-2" />
                Add New
              </Button>
            </div>

            {/* Body */}
            <div className="tw-p-0">

              {/* Filters Section */}
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-6 tw-gap-3 tw-p-4">

                <div className="tw-col-span-1">
                  <SelectInput
                    name="curriculumId"
                    value={optionalSubjectsFormik.values.curriculumId}
                    onChange={filterHandler}
                    menuItems={
                      curriculumTypes?.filter((item: any) => item.branchCurriculumId !== 18) || []
                    }
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    labelText="Curriculum"
                    floatingLabel
                    labelClass="required"
                  />
                </div>

                <div className="tw-col-span-1">
                  <SelectInput
                    name="classId"
                    value={optionalSubjectsFormik.values.classId}
                    onChange={filterHandler}
                    menuItems={
                      branchClassResp?.content?.filter((item: any) => item?.classSequence >= 14) || []
                    }
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="tw-mb-0"
                    labelText="Class"
                    floatingLabel
                    labelClass="required"
                  />
                </div>

                <div className="tw-col-span-1">
                  <SelectInput
                    name="groupId"
                    value={optionalSubjectsFormik.values.groupId}
                    onChange={filterHandler}
                    menuItems={streamGroup || []}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="tw-mb-0"
                    labelText="Group"
                    floatingLabel
                    labelClass="required"
                  />
                </div>

              </div>

              {/* Table */}
              <TableContainer
                columns={tableColumns || []}
                data={optionalSubjectResList || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                currentPageNumber={pageable?.pageNumber}
                callbackPaginationHndlr={paginationHndlr}
              />

            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-edit-newoptional-subject"
        isOpen={addEditNewOptionalSubjectModalState.showModal}
        toggle={addEditNewOptionalSubjectCloseModal}
        modalTitle={
          addEditNewOptionalSubjectModalState.modalData
            ? "Edit Optional Subject"
            : "Add Optional Subjects"
        }
        modalSize="lg"
      >
        <AddEditNewOptionalSubjectModal
          toggle={addEditNewOptionalSubjectCloseModal}
          editId={addEditNewOptionalSubjectModalState.modalData}
        ></AddEditNewOptionalSubjectModal>
      </ModalContainerUpdated>
      <ConfirmationModal
        id="del-sports-name-modal"
        isOpen={delSportsNameModalState.showModal}
        confirmMessage="Are you sure you want to delete this activity?"
        cancelHndlr={delSportsNameCloseModal}
        confirmHndlr={delSportNameItemHndlr}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default OptionalSubjects;
