
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import classnames from "classnames"
import { default as EditSvg } from "../../../assets/imagesdps/academics/EditSvg.svg?react";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { approvalStatus, generateColumns, leaveTypes } from "./helper";
import AddStudentLongLeaveModal from "./AddStudentLongLeaveModal";
import { deleteStuLongLeavesAct, getStuLongLeavesByIdAct, getStuLongLeavesListAct } from "../../../store/StudentAttendance/StudentLongLeaves/studentlongleavesaction";
import { useFilterState } from "../../../hooks/filterhook";
import { useModal } from "../../../hooks/modalhook";
import ApprovalModal from "./ApprovalModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle03Icon, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  startDate: "",
  sectionId: "",
  leaveType: "",
  approvalStatus: "",
};

const StudentConcessions = () => {
  const dispatch = useAppDispatch();
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const { advanceFilterChange, showClearFilterState } = useFilterState();
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const [addStuLongLeaveModal, setAddStuLongLeaveModal] = useState<any>({
    showModal: false,
    id: undefined,
  });
  const [stuLongLeavesFilterState, setStuLongLeavesFilterState] =
    useState(initialValues);
  const [delStuLongLeavesModal, setDelStuLongLeavesModal] = useState<any>({
    showModal: false,
    id: "",
  });
  const {
    modalState: approveModalState,
    closeModal: closeApproveModalHndlr,
    openModal: openApproveModalHndlr,
  } = useModal();

  const toggleAddStuLongLeaveModal = (id?: any) => {
    setAddStuLongLeaveModal((prev: any) => ({
      ...prev,
      showModal: !prev.showModal,
      id: id || "",
    }));
  };

  const getStudentLongLeavesApiCall = (otherProps?: any) => {
    const { academicYearId, curriculumId, classId, searchString } =
      stuLongLeavesFilterState;
    let payload = {
      academicYearId: academicYearId,
      curriculumId: curriculumId,
      instituteId: instituteId,
      branchId,
      classId,
      searchString,
      ...pagination.current,
      ...otherProps,
    };
    if (payload.academicYearId) {
      dispatch(
        getStuLongLeavesListAct(
          generateActionPayload("get_long_leave_list", undefined, payload)
        )
      );
    }
  };
  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getStuLongLeavesListResp,
    stuLongLeavesErrResp,
    saveStuLongLeavesResp,
    deleteStuLongLeavesResp,
    editStuLongLeavesResp,
    loggedInUserRole,
    currentStudentId,
    parentChildrensResp,
    userMeResp,
    approveStuLongLeavesResp,
  }: any = useAppSelector(
    ({
      globalData,
      instAcademics,
      branchAcademics,
      appData,
      studentLongLeaves,
      directoryStudent,
      login,
    }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getStuLongLeavesListResp: studentLongLeaves.getStuLongLeavesListResp,
      stuLongLeavesErrResp: studentLongLeaves.stuLongLeavesErrResp,
      saveStuLongLeavesResp: studentLongLeaves.saveStuLongLeavesResp,
      currentStudentId: appData.currentStudentId,
      parentChildrensResp: directoryStudent.parentChildrensResp,
      loggedInUserRole: appData.loggedInUserRole,
      userMeResp: login.userMeResp,
      editStuLongLeavesResp: studentLongLeaves.editStuLongLeavesResp,
      deleteStuLongLeavesResp: studentLongLeaves.deleteStuLongLeavesResp,
      approveStuLongLeavesResp: studentLongLeaves.approveStuLongLeavesResp,
    }),
    shallowEqual
  );

  const studentLongLeavesRef = useRef<any>({
    prevSaveStuLongLeavesResp: saveStuLongLeavesResp,
    prevStuLongLeavesErrResp: stuLongLeavesErrResp,
    prevEditStuLongLeavesResp: editStuLongLeavesResp,
    prevDeleteStuLongLeavesResp: deleteStuLongLeavesResp,
    prevApproveStuLongLeavesResp: approveStuLongLeavesResp,
  });

  useEffect(() => {
    const {
      prevSaveStuLongLeavesResp,
      prevEditStuLongLeavesResp,
      prevDeleteStuLongLeavesResp,
      prevStuLongLeavesErrResp,
      prevApproveStuLongLeavesResp,
    } = studentLongLeavesRef.current;
    if (
      saveStuLongLeavesResp &&
      saveStuLongLeavesResp !== prevSaveStuLongLeavesResp
    ) {
      toast.success("Student Long Leaves Details Added Successfully.");
      toggleAddStuLongLeaveModal();
      getStudentLongLeavesApiCall();
    } else if (
      editStuLongLeavesResp &&
      editStuLongLeavesResp !== prevEditStuLongLeavesResp
    ) {
      toast.success("Student Long Leaves Details Updated Successfully.");
      toggleAddStuLongLeaveModal();
      getStudentLongLeavesApiCall();
    } else if (
      deleteStuLongLeavesResp &&
      deleteStuLongLeavesResp !== prevDeleteStuLongLeavesResp
    ) {
      toast.success("Student Long Leaves Details Deleted Successfully.");
      getStudentLongLeavesApiCall();
      toggleDelStuLongLeaveModal();
    } else if (
      approveStuLongLeavesResp &&
      prevApproveStuLongLeavesResp !== approveStuLongLeavesResp
    ) {
      pagination.current.pageNo = 0;
      if (approveModalState.modalData.approvalStatus === "APPROVED") {
        toast.success("Long Leaves approved successfully.");
        getStudentLongLeavesApiCall();
        closeApproveModalHndlr();
      } else if (approveModalState.modalData.approvalStatus === "REJECTED") {
        toast.success("Long Leaves rejected successfully.");
        getStudentLongLeavesApiCall();
        closeApproveModalHndlr();
      } else if (approveModalState.modalData.approvalStatus === "CANCELLED") {
        toast.success("Long Leaves cancelled successfully.");
        getStudentLongLeavesApiCall();
        closeApproveModalHndlr();
      }
    } else if (
      stuLongLeavesErrResp &&
      stuLongLeavesErrResp !== prevStuLongLeavesErrResp
    ) {
      const { details } = stuLongLeavesErrResp || {};
      toast.error(details || "Something went wrong.");
    }
    studentLongLeavesRef.current.prevSaveStuLongLeavesResp =
      saveStuLongLeavesResp;
    studentLongLeavesRef.current.prevEditStuLongLeavesResp =
      editStuLongLeavesResp;
    studentLongLeavesRef.current.prevDeleteStuLongLeavesResp =
      deleteStuLongLeavesResp;
    studentLongLeavesRef.current.prevStuLongLeavesErrResp =
      stuLongLeavesErrResp;
    studentLongLeavesRef.current.prevApproveStuLongLeavesResp =
      approveStuLongLeavesResp;
  }, [
    saveStuLongLeavesResp,
    editStuLongLeavesResp,
    deleteStuLongLeavesResp,
    stuLongLeavesErrResp,
    approveStuLongLeavesResp,
  ]);

  const menuOptions = useMemo(() => {
    const actions = [
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
          toggleAddStuLongLeaveModal(id);
          dispatch(
            getStuLongLeavesByIdAct(
              generateActionPayload("get_long_leave_by_id", { id: id })
            )
          );
        },
      },
      // {
      //     id: "delete",
      //     actionIcon: <i className={classnames("ri-delete-bin-5-fill text-danger fs-16 me-2")}></i>,
      //     actionName: "Delete",
      //     onClickHndlr: (event: any) => {
      //         const id = event.currentTarget.getAttribute("data-id");
      //         toggleDelStuLongLeaveModal(id)
      //     },
      // },
      {
        id: "approve",
        actionIcon: (
          <HugeiconsIcon
            icon={CheckmarkCircle03Icon}
            className="me-2 text-success"
            size={18}
          />
        ),
        actionName: "Approve",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openApproveModalHndlr({ id, approvalStatus: "APPROVED" });
        },
      },
      {
        id: "reject",
        actionIcon: (
          <HugeiconsIcon
            icon={CancelCircleIcon}
            className="me-2 text-muted"
            size={18}
          />
        ),
        actionName: "Reject",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openApproveModalHndlr({ id, approvalStatus: "REJECTED" });
        },
      },
      {
        id: "cancel",
        actionIcon: (
          <HugeiconsIcon
            icon={CancelCircleIcon}
            className="me-2 text-danger"
            size={18}
          />
        ),
        actionName: "Cancel",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openApproveModalHndlr({ id, approvalStatus: "CANCELLED" });
        },
      },
    ];
    if (loggedInUserRole === "PARENT_ROLE") {
      return actions.filter(
        (item) => item.id !== "approve" && item.id !== "reject"
      );
    }
    return actions;
  }, [getStuLongLeavesListResp, loggedInUserRole]);

  useEffect(() => {
    if (academicYearListResp) {
      let yearId =
        academicYearListResp &&
        academicYearListResp.data.find(
          (year: any) => year.yearStatus.toLowerCase() === "current"
        )?.academicYearId;
      if (yearId && loggedInUserRole !== "PARENT_ROLE") {
        setStuLongLeavesFilterState((prev: any) => ({
          ...prev,
          academicYearId: yearId,
        }));
        getStudentLongLeavesApiCall({ academicYearId: yearId });
      }
      getCurriculumApiCall({ academicYearId: yearId });
    } else if (instituteId) {
      const payload = {
        instituteId: instituteId,
        pageNo: 0,
        pageSize: 100,
        sortBy: "academicYearName",
        orderBy: "desc",
      };
      dispatch(
        getInstAcademicYearAct(
          generateActionPayload("get_inst_academic_year", undefined, payload)
        )
      );
    }
  }, [branchId, instituteId, academicYearListResp]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = {
      academicYearId: stuLongLeavesFilterState.academicYearId,
      branchId: branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
      ...otherProps,
    };
    dispatch(
      getBranchCurriculumAct(
        generateActionPayload("get_brch_curriculum", undefined, payload1)
      )
    );
  };
  const getClassApiCall = (otherProps?: any) => {
    const payload = {
      branchId: branchId,
      academicYearId: stuLongLeavesFilterState?.academicYearId,
      curriculumId: stuLongLeavesFilterState?.curriculumId,
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
  };

  useEffect(() => {
    if (loggedInUserRole === "PARENT_ROLE") {
      const studentDetails: any = parentChildrensResp?.find(
        (i: any) => +i?.childId === +currentStudentId
      );
      setStuLongLeavesFilterState((prevState) => ({
        ...prevState,
        academicYearId: studentDetails?.academicYearId,
        searchString: studentDetails?.childCode,
        curriculumId: studentDetails?.curriculumId,
        classId: studentDetails?.classId,
        startDate: "",
        sectionId: studentDetails?.sectionId,
      }));
      getStudentLongLeavesApiCall({
        academicYearId: studentDetails?.academicYearId,
        searchString: studentDetails?.childCode,
        curriculumId: studentDetails?.curriculumId,
        classId: studentDetails?.classId,
        startDate: "",
        sectionId: studentDetails?.sectionId,
      });
      setStudentDetails(studentDetails);
    }
  }, [
    loggedInUserRole,
    instituteId,
    branchId,
    currentStudentId,
    parentChildrensResp,
  ]);

  useEffect(() => {}, [loggedInUserRole, academicYearListResp]);

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      setStuLongLeavesFilterState((prev: any) => ({
        ...prev,
        [name]: value,
        classId: null,
        curriculumId: "",
      }));
      getStudentLongLeavesApiCall({
        [name]: value,
        classId: null,
        curriculumId: "",
      });
    } else if (name === "curriculumId") {
      if (!value) {
        dispatch(resetBrchClassAct(undefined));
      } else {
        getClassApiCall({
          curriculumId: value,
          academicYearId: stuLongLeavesFilterState.academicYearId,
        });
        setStuLongLeavesFilterState((prev: any) => ({
          ...prev,
          [name]: value,
        }));
        getStudentLongLeavesApiCall({ [name]: value });
      }
    } else {
      setStuLongLeavesFilterState((prev: any) => ({ ...prev, [name]: value }));
      getStudentLongLeavesApiCall({ [name]: value });
    }
    advanceFilterChange({
      keys: { ...stuLongLeavesFilterState, [name]: value },
      ignoredKeys: [],
    });
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getStudentLongLeavesApiCall(paginationInfo);
  }

  const toggleDelStuLongLeaveModal = (id?: any) => {
    setDelStuLongLeavesModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  };

  const delStuLongLeaveConfirmHndler = () => {
    dispatch(
      deleteStuLongLeavesAct(
        generateActionPayload("delete_long_leaves", {
          id: delStuLongLeavesModal.id,
        })
      )
    );
  };
  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      pagination.current = { ...pagination.current, pageNo: 0 };
      let { academicYearId } =
        academicYearListResp?.data?.find(
          (year: any) => year?.yearStatus?.toLowerCase() === "current"
        ) || {};
      dispatch(resetBrchClassAct(undefined));
      setStuLongLeavesFilterState({ ...initialValues, academicYearId });
      getStudentLongLeavesApiCall({
        ...initialValues,
        academicYearId,
        branchId,
      });
      advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
    }
  };

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const {
    content: leavesList,
    totalElements,
    totalPages,
    pageble,
  } = getStuLongLeavesListResp || {};
  const { content: classTypes } = branchClassResp || {};
  const roleColumns = useMemo(
    () => generateColumns(menuOptions),
    [getStuLongLeavesListResp]
  );
  return (
    <>
      <div className="page-content">
                <div className="container-fluid">
          <BreadCrumb title="daily attendance" pageTitle="Student Attendance" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow">
            {/* Header */}
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Student Long Leaves
                </h4>

                <div className="tw-ml-auto">
                  <Button
                    variant="primary"
                    onClick={() => toggleAddStuLongLeaveModal()}
                  >
                    Add Leave
                  </Button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="tw-p-0">
              {loggedInUserRole !== "PARENT_ROLE" && (
                <div className="tw-px-4 tw-py-4">
                    <div
                      className="
      tw-grid tw-gap-3 tw-items-end
      tw-grid-cols-1
      sm:tw-grid-cols-2
      lg:tw-grid-cols-4
      xl:tw-grid-cols-6
    "
                    >
                      {/* Search */}
                      <div className="tw-relative search-box">
                        <TextInput
                          name="searchString"
                          value={stuLongLeavesFilterState.searchString}
                          onChange={filterHandler}
                          inputClassName="bg-soft-light"
                          formgroupClassName="tw-mb-0"
                          placeHolder="Search"
                          labelText="Search"
                          floatingLabel
                        />
                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2"></i>
                      </div>

                      {/* Academic Year */}
                      <SelectInput
                        name="academicYearId"
                        value={stuLongLeavesFilterState.academicYearId}
                        onChange={filterHandler}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        labelText="Academic Year"
                        floatingLabel
                      />

                      {/* Curriculum */}
                      <SelectInput
                        name="curriculumId"
                        value={stuLongLeavesFilterState.curriculumId}
                        onChange={filterHandler}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        formgroupClassName="tw-mb-0"
                        labelText="Curriculum"
                        floatingLabel
                      />

                      {/* Class */}
                      <SelectInput
                        name="classId"
                        value={stuLongLeavesFilterState.classId}
                        onChange={filterHandler}
                        menuItems={classTypes || []}
                        valueKey="id"
                        textKey="shortName"
                        formgroupClassName="tw-mb-0"
                        labelText="Class"
                        floatingLabel
                      />

                      {/* Leave Type */}
                      <SelectInput
                        name="leaveType"
                        value={stuLongLeavesFilterState.leaveType}
                        onChange={filterHandler}
                        menuItems={leaveTypes || []}
                        valueKey="id"
                        textKey="leaveType"
                        formgroupClassName="tw-mb-0"
                        labelText="Leave Type"
                        floatingLabel
                      />

                      {/* Approval Status */}
                      <SelectInput
                        name="approvalStatus"
                        value={stuLongLeavesFilterState.approvalStatus}
                        onChange={filterHandler}
                        menuItems={approvalStatus || []}
                        valueKey="id"
                        textKey="approvalStatus"
                        formgroupClassName="tw-mb-0"
                        labelText="Approval Status"
                        floatingLabel
                      />

                      {/* Clear Filter */}
                      {showClearFilterState && (
                        <div className="tw-col-span-full tw-flex tw-justify-end">
                          <Button
                            type="button"
                            variant="wrong"
                            onClick={clearFilterHndlr}
                          >
                            Clear filter
                          </Button>
                        </div>
                      )}
                    </div>
                </div>
              )}
              <TableContainer
                columns={roleColumns}
                data={Array.isArray(leavesList) ? leavesList : []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageble?.pageNumber || 0}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="student-long-leave-modal"
        isOpen={addStuLongLeaveModal.showModal}
        toggle={() => toggleAddStuLongLeaveModal()}
        modalTitle="Add Student Long Leave"
        modalSize="lg"
      >
        <AddStudentLongLeaveModal
          id={addStuLongLeaveModal?.id}
          toggle={() => toggleAddStuLongLeaveModal()}
          raisedBy={loggedInUserRole}
          studentDetails={studentDetails}
          academicYearId={stuLongLeavesFilterState?.academicYearId}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="student-long-leave-approval-modal"
        isOpen={approveModalState.showModal}
        toggle={closeApproveModalHndlr}
        modalSize="md"
        hideHeader
      >
        <ApprovalModal
          toggleModal={closeApproveModalHndlr}
          modalInfo={approveModalState.modalData}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-route-modal"
        isOpen={delStuLongLeavesModal.showModal}
        confirmMessage="You want to delete student long leave?"
        cancelHndlr={() => toggleDelStuLongLeaveModal()}
        confirmHndlr={delStuLongLeaveConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default StudentConcessions;
