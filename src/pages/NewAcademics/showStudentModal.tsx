import React, { useEffect, useRef, useState } from "react";
import {
  ModalContainer,
  ModalContainerUpdated,
  TextInput,
  UserDetails,
} from "../../Components/Common";
import {
  IAssignClassroomProps,
  ISectionStudentListRepRef,
  searchInputProps,
} from "./academicsTypes";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../utility/reduxutility";
import {
  getStudentListBySection,
  setRemoveStudentToSection,
} from "../../store/academic/classroomManagment/classroommanagmentactions";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";
import NoDataComp from "../../Components/Common/NoDataComp";
import { default as DeleteIconSvg } from "../../assets/imagesdps/academics/DeleteIconSvg.svg?react";

const initialValues: searchInputProps = {
  search: "",
};

const ShowStudentModal = (props: IAssignClassroomProps) => {
  const [searchState, setSearchState] =
    useState<searchInputProps>(initialValues);
  const [confirmationModalState, setConfirmationModalState] =
    useState<any>({
      showModal: false,
      studentId: "",
    });
  const [studentList, setStudentList] = useState<any>([]);
  const dispatch = useAppDispatch();
  const studentListBySection = (otherProps?: any) => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current").academicYearId
    dispatch(
      getStudentListBySection(
        generateActionPayload("get_student_list_by_section", undefined, {
          academicClassSectionId: props.sectionDetails?.sectionId, academicYearId: props.academicYearId || yearId, searchString: searchState.search, pageNo: 0, pageSize: 10000, ...otherProps
        })
      )
    );
  }
  useEffect(() => {
    if (props.isOpen) {
      studentListBySection();
    }
    else {
      setSearchState(prev => ({ ...prev, search: "" }))
    }
  }, [props.isOpen]);

  const { studentListBySectionResp, removeSectionStudentsResp, classroomManagmentErrorResp, academicYearListResp, currentBranchIdResp: branchId, currentInstIdResp: instituteId }: any =
    useAppSelector(
      ({ classroomManagmentInfo, instAcademics, appData }) => ({
        studentListBySectionResp:
          classroomManagmentInfo.studentListBySectionResp,
        removeSectionStudentsResp:
          classroomManagmentInfo.removeSectionStudentsResp,
        classroomManagmentErrorResp:
          classroomManagmentInfo.classroomManagmentErrorResp,
        academicYearListResp:
          instAcademics.academicYearListResp,
        currentBranchIdResp:
          appData.currentBranchIdResp,
        currentInstIdResp:
          appData.currentInstIdResp,

      }),
      shallowEqual
    );

  const RemoveStudent = (stu_id: string) => {
    setConfirmationModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      studentId: stu_id
    }));
  };
  const toggleConfirmationModal = () => {
    setConfirmationModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      studentId: undefined
    }));
  };
  const SectionStudentListRef = useRef<ISectionStudentListRepRef>({
    prevRemoveStudentResp: removeSectionStudentsResp,
    prevRemoveStudentErrorResp: classroomManagmentErrorResp
  });


  useEffect(() => {

    const { prevRemoveStudentResp, prevRemoveStudentErrorResp } =
      SectionStudentListRef.current;

    if (removeSectionStudentsResp &&
      prevRemoveStudentResp !== removeSectionStudentsResp) {
      toast.success('Student Removed successfully.');
      studentListBySection();
      toggleConfirmationModal();
    }
    else if (classroomManagmentErrorResp && prevRemoveStudentErrorResp !== classroomManagmentErrorResp) {
      let { details } = classroomManagmentErrorResp;
      toast.error(details);
    }
    SectionStudentListRef.current.prevRemoveStudentResp = removeSectionStudentsResp;
    SectionStudentListRef.current.prevRemoveStudentErrorResp = classroomManagmentErrorResp;
  }, [removeSectionStudentsResp, classroomManagmentErrorResp]);

  const searchHandler = (event: any) => {
    const { name, value } = event.target;
    setSearchState(prev => ({ ...prev, [name]: value }))
    studentListBySection({ searchString: event.target.value })
  }

  const RemoveStudentHandler = () => {
    let stdlist = studentList.filter(
      (std: any) => std.stu_id !== confirmationModalState.studentId && std
    );
    setStudentList(stdlist);

    dispatch(
      setRemoveStudentToSection(
        generateActionPayload(
          "delete_student_to_section", { academicClassSectionId: props.sectionDetails.sectionId, studentId: confirmationModalState.studentId }
        )
      )
    );
  }
  const { data: sectionList } = studentListBySectionResp || {}

  return (
    <>
  
      <div className="tw-flex tw-flex-col tw-border-b">
        <div className="tw-px-4 tw-mt-2">
          <div className="tw-bg-gray-100 tw-p-2 tw-flex tw-items-center tw-gap-6 tw-rounded">
            <div className="tw-text-sm">
              <span className="tw-text-gray-500 tw-font-normal">Class </span>
              <span className="tw-font-semibold">
                {props?.sectionDetails?.className}
              </span>
            </div>
            <div className="tw-text-sm">
              <span className="tw-text-gray-500 tw-font-normal">Section </span>
              <span className="tw-font-semibold">
                {props?.sectionDetails?.sectionName}
              </span>
            </div>
          </div>
        </div>
        <div className="tw-px-4 tw-my-3">
          <div className="search-box">
            <TextInput
              name="search"
              value={searchState.search}
              onChange={searchHandler}
              formgroupClassName="m-0"
              placeHolder="Search Student"
              labelText="Search Student"
              floatingLabel
            />
            <i className="ri-search-line search-icon"></i>
          </div>
        </div>
      </div>
      <div className="tw-h-[50vh] tw-overflow-y-auto">
        {sectionList &&
          sectionList[0]?.sectionStudents?.length > 0 ? (
          sectionList[0].sectionStudents.map((item: any, index: number) => (
            <div
              key={index}
              className="tw-flex tw-justify-between tw-items-center tw-py-2 tw-px-4 tw-border-b tw-border-gray-200"
            >
              <UserDetails
                imageUrl={item?.thumbnailImage?.s3URL}
                displayName={item?.studentName}
                displayId={item?.studentCodeNum}
                defaultImgType="student"
                size="xs"
              />

              <div
                onClick={() => RemoveStudent(item.studentId)}
                className="tw-cursor-pointer"
              >
                <DeleteIconSvg fill="#f06548" />
              </div>
            </div>
          ))
        ) : (
          <NoDataComp />
        )}
      </div>
      <ModalContainerUpdated
          id="show-student-modal"
          isOpen={confirmationModalState.showModal}
          toggle={toggleConfirmationModal}
          modalTitle="Students"
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
        confirmationMessage={'you want to remove a student !'}
        submitHandler={RemoveStudentHandler}
        submitTxt={"Yes Remove"}
      />
            </ModalContainerUpdated>
    </>
  );
};

export default ShowStudentModal;
