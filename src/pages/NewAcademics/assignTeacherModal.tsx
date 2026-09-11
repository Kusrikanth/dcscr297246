import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ModalContainerUpdated,
  TextInput,
  UserDetails,
} from "../../Components/Common";
import {
  IAssignClassroomProps,
  IRemoveAssignedTeacherModal,
  IUpdateSectionTeacherRepRef,
} from "./academicsTypes";
import { Col, Row } from "reactstrap";
import EmployeeImg from "../../assets/imagesdps/employee-default-img.png";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../utility/reduxutility";
import {
  updateClassroomTeacher,
} from "../../store/academic/classroomManagment/classroommanagmentactions";
import { getEmployeesListAct } from "../../store/directory/employeemanagement/employeemanagementactions";
import { toast } from "react-toastify";
import { getEmployeeCategoriesAct, getEmployeeStatusAct } from "../../store/masterdata/masterdataactions";
import ConfirmationModal from "./ConfirmationModal";
import { debounce, searhWithTextInList } from "../../utility/commonutility";
import Button from "../../Components/Common/Button";

interface searchInputProps {
  searchString: string
}
const initialValues: searchInputProps = {
  searchString: "",
};

const AssignTeacherModal = (props: IAssignClassroomProps) => {

  const [searchState, setSearchState] =
    useState<searchInputProps>(initialValues);
  const [orgTeacherList, setOrgTeacherList] = useState<any>([]);
  const [teacherList, setTeacherList] = useState<any>([]);
  const dispatch = useAppDispatch();
  const [confirmationModalState, setConfirmationModalState] =
    useState<IRemoveAssignedTeacherModal>({
      showModal: false,
      branchId: "",
    });
  const getEmployees = (otherProps?: any) => {
    let statusID = employeeStatusResp && employeeStatusResp.find((status: any) => status.empStatusName.toLowerCase() === 'active').id
    let categoryID = employeeCategoriesResp && employeeCategoriesResp.find((category: any) => category.categoryName.toLowerCase() === 'teachers').employeeCategoryId

    const params = { branchId: branchId, pageNo: 0, pageSize: 2000, status: statusID, employeeCategoryId: categoryID, ...otherProps }
    dispatch(getEmployeesListAct(generateActionPayload("get_employees", undefined, params)));
  }
  useEffect(() => {
    dispatch(getEmployeeStatusAct(generateActionPayload("get_employee_status")));
    dispatch(getEmployeeCategoriesAct(generateActionPayload("get_employee_categories")));
  }, [])
  useEffect(() => {
    if (props.isOpen) {
      getEmployees();
    }
    else {
      searchTeacherForm.resetForm();
    }
  }, [props.isOpen]);
  const searchTeacherForm = useFormik({
    enableReinitialize: true,
    initialValues: searchState,

    onSubmit: (values) => { },
  });

  const { updateClassroomTeacherResp, employeesListResp, employeeStatusResp, employeeCategoriesResp, currentBranchIdResp: branchId, currentInstIdResp: instituteId,showApiLoader } = useAppSelector(
    ({ classroomManagmentInfo, directoryEmployee, masterData, appData,globalData }) => ({
      updateClassroomTeacherResp: classroomManagmentInfo.updateClassroomTeacherResp,
      employeesListResp: directoryEmployee.employeesListResp,
      employeeStatusResp: masterData.employeeStatusResp,
      employeeCategoriesResp: masterData.employeeCategoriesResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader:globalData.showApiLoader,

    }),
    shallowEqual
  );
  useEffect(() => {
    let teacherList = employeesListResp && employeesListResp.data.filter((teacher: any) => teacher.categoryName === "TEACHERS")
    setOrgTeacherList(teacherList);
    const findIndex = teacherList?.findIndex((item: any) => +item.id === +props.sectionDetails?.sectionTeacherId)
    if(findIndex > -1){
      const foundTeacher = teacherList?.splice(findIndex, 1)[0];
      teacherList = teacherList?.filter((item: any) => +item.id !== +props.sectionDetails?.sectionTeacherId);
      teacherList?.unshift(foundTeacher);
    }
    setTeacherList(teacherList);
  }, [employeesListResp]);

  function search(event:any){
    
    let abc=searhWithTextInList(orgTeacherList,['employeeName','employeeCode'],event.target.value);
    setTeacherList(abc);
  }
  const debounceFun=useCallback(debounce(search, 1000),[orgTeacherList])
  const searchHandler = (event: any) => {
    searchTeacherForm.handleChange(event);
    debounceFun(event)
  }
  

  const AssignClassroomTeacher = (item: any, type: string) => {
    dispatch(
      updateClassroomTeacher(
        generateActionPayload(
          "update_classroom_teacher",
          undefined,
          {
            teacherId: type === "Add" ? item.id : null,
            sectionId: props.sectionDetails?.sectionId
          }
        )
      )
    );
  };
  const toggleConfirmationModal = () => {
    setConfirmationModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const RemoveStudentHandler = () => {
    dispatch(
      updateClassroomTeacher(
        generateActionPayload(
          "update_classroom_teacher",
          undefined,
          {
            teacherId: null,
            sectionId: props.sectionDetails?.sectionId
          }
        )
      )
    );
    // getEmployees();
  }
  const AssignTeacherRef = useRef<IUpdateSectionTeacherRepRef>({
    prevUpdateSectionTeacherResp: updateClassroomTeacherResp
  });

  useEffect(() => {

    const { prevUpdateSectionTeacherResp } =
      AssignTeacherRef.current;

    if (updateClassroomTeacherResp &&
      prevUpdateSectionTeacherResp !== updateClassroomTeacherResp) {
      toast.success(updateClassroomTeacherResp.data.teacherId ? "Teacher is Assigned" : "Teacher Removed Successfully");
      !updateClassroomTeacherResp.data.teacherId && toggleConfirmationModal();
      props.toggle({ sectionDetails: props.sectionDetails, apiCall: true, notoggle: updateClassroomTeacherResp.data.teacherId ? false : true });
    }
    AssignTeacherRef.current.prevUpdateSectionTeacherResp = updateClassroomTeacherResp;
  }, [updateClassroomTeacherResp]);

  return (
    <>
      <div className="tw-flex tw-flex-col tw-border-b">
        <div className="tw-px-4 tw-my-2">
          <div className="tw-bg-gray-100 tw-p-2 tw-rounded tw-flex tw-items-center tw-gap-6">

            <h5 className="tw-text-sm tw-m-0">
              <span className="tw-text-gray-500 tw-font-normal">
                Class :
              </span>{" "}
              <span className="tw-font-semibold">
                {props.sectionDetails?.className}
              </span>
            </h5>
            <h5 className="tw-text-sm tw-m-0">
              <span className="tw-text-gray-500 tw-font-normal">
                Section :
              </span>{" "}
              <span className="tw-font-semibold">
                {props.sectionDetails?.sectionName}
              </span>
            </h5>
          </div>
          <div className="tw-mt-4 search-box">
            <TextInput
              name="searchString"
              value={searchTeacherForm.values.searchString}
              onChange={searchHandler}
              formgroupClassName="tw-mb-1"
              placeHolder="Search Teacher"
              labelText="Search Teacher"
              floatingLabel
            />
            <i className="ri-search-line search-icon"></i>
          </div>
        </div>
        <div className="tw-flex tw-items-center tw-px-4 tw-mb-2 tw-gap-2">
          <h6 className="tw-font-bold tw-mb-0">
            Assign Teacher :
          </h6>
          {props.sectionDetails?.sectionTeacherThumbnailImage && (
            <div className="tw-w-8 tw-h-8 tw-rounded-full tw-overflow-hidden tw-shadow-sm">
              <img
                className="tw-w-full tw-h-full tw-object-cover"
                src={
                  props.sectionDetails?.sectionTeacherThumbnailImage
                    ? props.sectionDetails?.sectionTeacherThumbnailImage.s3URL
                    : EmployeeImg
                }
                alt="Teacher Avatar"
              />
            </div>
          )}
        </div>
      </div>
      <div className="tw-h-[50vh] tw-overflow-y-auto">
        {teacherList &&
          teacherList.map((item: any, index: number) => (
            <div
              key={index}
              className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-px-4 tw-border-b tw-border-gray-200"
            >
              <UserDetails
                imageUrl={
                  item?.base64Image
                    ? `data:image/png;base64,${item?.base64Image}`
                    : ""
                }
                displayName={item?.employeeName}
                displayId={item?.employeeCode}
                defaultImgType="employee"
                size="xs"
              />
              {item?.id === props?.sectionDetails?.sectionTeacherId ? (
                <div className="d-flex align-items-center">
                  <Button type="button" variant="warning" onClick={() => toggleConfirmationModal()}>
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <Button type="button" variant="secondary" onClick={() => AssignClassroomTeacher(item, "Add")}
                    disabled={!!props.sectionDetails.sectionTeacherId}>
                    Add
                  </Button>
                </div>
              )}
            </div>
          ))}
      </div>
      <ModalContainerUpdated
        id="assign-teacher-confirmation-modal"
        isOpen={confirmationModalState.showModal}
        toggle={toggleConfirmationModal}
        modalTitle=""
        hideHeader={true}
        modalSize="md"
      >
        <ConfirmationModal
          isOpen={confirmationModalState.showModal}
          toggle={toggleConfirmationModal}
          modalTitle=""
          instituteId={instituteId}
          instituteName={"Assign Subjects"}
          branchId={branchId}
          editBranchDetails={""}
          confirmationMessage={'you want to remove a teacher !'}
          submitHandler={RemoveStudentHandler}
          submitTxt={"Yes Remove"}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default AssignTeacherModal;
