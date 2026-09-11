import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { Card, CardBody, Col, Row, CardHeader } from "reactstrap";
import { IPaginationState } from "../../../Components/Common/Pagination";
import TableContainer from "../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import {
  getGroupStudentsList,
  getStreamById,
  removeStudentToGroup,
} from "../../../store/academic/assignGroup/assigngroupactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import AssignGroupModal from "./AssignGroupModal";
import { IAssignGroupOpenModal, IUpdateGroupRespRef } from "./assignGroupTypes";
import { generateColumns } from "./helper";
import { ConfirmationModal, TextInput } from "../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";

const filterData = {
  pageNo: 0,
  pageSize: 10,
  orderBy: "asc",
  sortBy: "",
  searchString: "",
}

const StudentData = (props: any) => {
  const dispatch = useAppDispatch();
  const [groupStudents, setGroupStudents] = useState<any>([]);
  const [deletedStudent, setDeletedStudent] = useState<any>();
  const [filterState, setFilterState] = useState<any>(filterData);
  const [addAssignGroupModalState, setAddAssignGroupModalState] =
    useState<IAssignGroupOpenModal>({
      showModal: false,
      branchId: "",
    });
  const [confirmationModalState, setConfirmationModalState] =
    useState<IAssignGroupOpenModal>({
      showModal: false,
      branchId: "",
    });

  const toggleAddAssignGroupModal = (apiCall?: any) => {
    setAddAssignGroupModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
    if (typeof (apiCall) === "boolean" && apiCall) {
      studentList();
    }
  };
  const toggleConfirmationModal = () => {
    setConfirmationModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const {
    groupStudentListResp,
    removeClassroomStudentsResp,
    updateClassroomStudentsResp,
    assignGroupErrorResp,
    streamByIdResp,
    showApiLoader,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId
  } = useAppSelector(
    ({ assignGroupInfo, appData, globalData }) => ({
      groupStudentListResp: assignGroupInfo.groupStudentListResp,
      removeClassroomStudentsResp: assignGroupInfo.removeClassroomStudentsResp,
      updateClassroomStudentsResp: assignGroupInfo.updateClassroomStudentsResp,
      assignGroupErrorResp: assignGroupInfo.assignGroupErrorResp,
      streamByIdResp: assignGroupInfo.streamByIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  const menuOptions = useMemo(
    () => [
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-mr-2 tw-text-red-500" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const studentId = event.currentTarget.getAttribute("data-id");
          setDeletedStudent(studentId);
          toggleConfirmationModal();
        },
      },
    ],
    [groupStudentListResp]
  );

  const curriculumColumns = useMemo(
    () => generateColumns(menuOptions),
    [groupStudentListResp]
  );

  const studentList = (otherProps?: any) => {
    if (streamByIdResp) {
      const payload = { ...filterState, classId: streamByIdResp.classId, curriculumId: streamByIdResp.curriculumId, academicYearId: props.optionalDetails.academicYearId, groupId: streamByIdResp.id, branchId: streamByIdResp.branchId, ...otherProps }
      dispatch(
        getGroupStudentsList(
          generateActionPayload("get_group_student_list", undefined, payload)
        )
      );
    }
  }

  useEffect(() => {
    if (props.menuId) {
      dispatch(getStreamById(generateActionPayload('get_stream_by_id', {
        stream_id: props.menuId
      })))
    }
  }, [props.menuId]);

  useEffect(() => {
    if (streamByIdResp) {
      // const payload={...filterState,classId:streamByIdResp.classId,curriculumId:streamByIdResp.curriculumId,academicYearId:props.optionalDetails.academicYearId,groupId:streamByIdResp.id,branchId:streamByIdResp.branchId}
      studentList()
    }
  }, [streamByIdResp])
  // useEffect(() => {

  //   setGroupStudents(groupStudentListResp.content);
  // }, [groupStudentListResp]);
  const updateGroupStudentRespRef = useRef<IUpdateGroupRespRef>({
    prevUpdateGroupStudentResp: updateClassroomStudentsResp,
    prevRemoveStudentRep: removeClassroomStudentsResp,
    prevAssignGroupErrorResp: assignGroupErrorResp,
  });

  useEffect(() => {
    const { prevUpdateGroupStudentResp, prevRemoveStudentRep, prevAssignGroupErrorResp } = updateGroupStudentRespRef.current;

    if (updateClassroomStudentsResp && updateClassroomStudentsResp !== prevUpdateGroupStudentResp) {
      // setDelTermsModalState(prevState => ({ ...prevState, showModal: false, termId: "" }));
      toggleAddAssignGroupModal(true);
      // getTermApicall(filterState);
      toast.success("Student Added successfully.")
    }
    else if (removeClassroomStudentsResp && removeClassroomStudentsResp !== prevRemoveStudentRep) {
      toast.success("Student Deleted successfully.")
      toggleConfirmationModal();
      studentList();
    }
    else if (assignGroupErrorResp && assignGroupErrorResp !== prevAssignGroupErrorResp) {
      const { details }: any = assignGroupErrorResp;
      toast.error(details);
    }
    updateGroupStudentRespRef.current.prevUpdateGroupStudentResp = updateClassroomStudentsResp;
    updateGroupStudentRespRef.current.prevRemoveStudentRep = removeClassroomStudentsResp;
    updateGroupStudentRespRef.current.prevAssignGroupErrorResp = assignGroupErrorResp;
  }, [updateClassroomStudentsResp, removeClassroomStudentsResp, assignGroupErrorResp]);

  const RemoveStudentHandler = () => {
    dispatch(
      removeStudentToGroup(
        generateActionPayload(
          "remove_student_from_group",
          {
            studentId: deletedStudent,
          }
        )
      )
    );
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    setFilterState((pre: any) => ({ ...pre, pageNo: paginationInfo.pageNo, pageSize: paginationInfo.pageSize }));
    studentList(paginationInfo);
  }

  const filterHndler = (event: any) => {
    setFilterState((pre: any) => ({ ...filterData, searchString: event.target.value }))
    studentList({ ...filterData, searchString: event.target.value, })
  }

  const { content: StudentList, totalElements, totalPages, pageable: pagination } = groupStudentListResp || {}

  return (
    <>
      <div className="tw-bg-white tw-shadow-sm tw-mb-6">
        <div className="tw-border-b tw-px-4 tw-py-3">
          <div className="tw-flex tw-items-center tw-justify-between">
            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
              Assigned Student
            </h4>
            <Button className="tw-flex tw-items-center" type="button" variant="primary" onClick={toggleAddAssignGroupModal}>
              <i className="ri-add-line tw-mr-1"></i>
              Assign
            </Button>
          </div>
        </div>
        <div className="tw-px-4 tw-py-4">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-center">
            <div className="tw-col-span-12 md:tw-col-span-4">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  value={filterState.searchString}
                  onChange={filterHndler}
                  formgroupClassName="tw-mb-0"
                  placeHolder="Search"
                  labelText="Search"
                  floatingLabel
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>
        </div>
        <TableContainer
          columns={curriculumColumns || []}
          data={StudentList || []}
          divClass="table-responsive tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
          showPagination={true}
          totalPages={totalPages}
          totalRecords={totalElements}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={
            groupStudentListResp?.pageable?.pageNumber
          }
          sortingHandler={() => { }}
        />
      </div>
      <AssignGroupModal
        isOpen={addAssignGroupModalState.showModal}
        toggle={toggleAddAssignGroupModal}
        modalTitle={
          props.menuId ? "Assign Groups" : "Assign Groups"
        }
        instituteId={instituteId}
        instituteName={"Assign Groups"}
        branchId={branchId}
        streamId={props.menuId}
        optionalDetails={props.optionalDetails}
      />
      <ConfirmationModal
        id="assign-grouo-remove-modal"
        isOpen={confirmationModalState.showModal}
        confirmMessage=" you want to delete a student !"
        cancelHndlr={toggleConfirmationModal}
        confirmHndlr={RemoveStudentHandler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType='reject'
      />
    </>
  );
};

export default StudentData;
