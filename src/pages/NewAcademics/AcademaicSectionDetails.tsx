import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Container } from "reactstrap";
import { useLocation } from "react-router-dom";
import BackButtonText from "../../Components/Common/BackButtonText";
import BreadCrumb from "../../Components/Common/BreadCrumb";
//Images
import ClassSvg from "../../assets/imagesdps/academics/ClassImg.svg";
import { ModalContainerUpdated, UserDetails } from "../../Components/Common";
import HorizontalTab from "../../Components/Common/HorizontalTab";
import { IAcademicsModal, IMenuOptions, IRemoveAssignedTeacherModal, ISectionDetails, IUpdateSectionTeacherRepRef } from "./academicsTypes";

import StudentsTab from "./StudentsTab";
import SubjectsTab from "./SubjectsTab";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { getSectionDetailsById, updateClassroomTeacher } from "../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import AssignTeacherModal from "./assignTeacherModal";

export const MenuOptions: Array<IMenuOptions> = [
  {
    id: "students",
    labelName: "Students",
  },
  {
    id: "subjects",
    labelName: "Subjects",
  },
];

function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
    case "students":
      return StudentsTab;
    case "subjects":
      return SubjectsTab;
  }
}

const AcademaicSectionDetails = () => {
  const location = useLocation<any>();
  const { sectionDetailsByIdResp, updateClassroomTeacherResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId } = useAppSelector(
    ({ classroomManagmentInfo, appData }) => ({
      sectionDetailsByIdResp: classroomManagmentInfo.sectionDetailsByIdResp,
      updateClassroomTeacherResp: classroomManagmentInfo.updateClassroomTeacherResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
    }),
    shallowEqual
  );
  const [assignTeacherModalState, setAssignTeacherModalState] =
    useState<IAcademicsModal>({
      showModal: false,
    });


  const toggleAssignTeacherModal = useCallback(
    ({ apiCall, notoggle }: ISectionDetails) => {
      {!notoggle&&setAssignTeacherModalState((prevState) => ({
        ...prevState,
        showModal: !prevState.showModal,
      }));}

      if (apiCall) {
        dispatch(getSectionDetailsById(generateActionPayload("get_section_details_by_id", { id: location.state ? location.state.sectionId : "" })));
      }
    },
    []
  );


  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getSectionDetailsById(
        generateActionPayload("get_section_details_by_id", {
          id: location.state
            ? location.state.sectionId
            : "",
        })
      )
    );
  }, []);
  return (<>
    <div className="page-content academic_section_details_wrapper">
      <Container fluid>
        <BreadCrumb title="Classroom Management" pageTitle="Academics" />
        <BackButtonText title="<< Back to Class Management" link="/section-management" />

        <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-px-6 tw-py-5 tw-mb-1">
          <div className="tw-flex tw-items-center">
            <div className="tw-flex tw-items-center tw-gap-5">
              <div className="tw-bg-[#F8F9FA] tw-rounded-lg tw-p-3 tw-shadow-sm">
                <img
                  src={ClassSvg}
                  alt="Class"
                  className="tw-w-12 tw-h-12 tw-object-contain"
                />
              </div>
              <div className="center">
                <h5 className="tw-mb-0">
                  {sectionDetailsByIdResp?.className}
                </h5>
                <p className="tw-text-sm tw-mt-1 tw-mb-0">
                  <span className="tw-text-[#495057] tw-font-bold">
                    Section Name:
                  </span>
                  <span className="tw-ml-1">
                    {sectionDetailsByIdResp?.sectionName}
                  </span>
                </p>
              </div>
              <div className="tw-h-8 tw-w-[6px] tw-bg-[#808080] tw-rounded-xl tw-mx-4"></div>
              <div className="tw-text-[#495057] tw-font-bold">
                Class Teacher:
              </div>
              {sectionDetailsByIdResp?.sectionTeacherId && (
                <div className="tw-flex tw-items-center tw-gap-3">
                  <UserDetails
                    imageUrl={
                      sectionDetailsByIdResp?.sectionTeacherThumbnailImage?.s3URL
                    }
                    size="sm"
                    displayName={sectionDetailsByIdResp?.sectionTeacherName || ""}
                    displayId={sectionDetailsByIdResp?.sectionTeacherCode || ""}
                    defaultImgType="employee"
                  />
                  <button
                    onClick={() =>
                      toggleAssignTeacherModal(sectionDetailsByIdResp)
                    }
                    className="tw-text-gray-500 hover:tw-text-blue-600 tw-transition"
                  >
                    <i className="ri-pencil-fill"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <HorizontalTab
          MenuOptions={MenuOptions}
          getActiveMenuComponent={(menuId: any) =>
            getActiveMenuComponent(menuId)
          }
          activeTabId="students"
          optionalDetails={sectionDetailsByIdResp}
        />
           <ModalContainerUpdated
          id="assign-teacher-modal"
          isOpen={assignTeacherModalState.showModal}
          toggle={toggleAssignTeacherModal}
          modalTitle="Assign Class Teacher"
          modalSize="md"
            > 
        <AssignTeacherModal
          isOpen={assignTeacherModalState.showModal}
          toggle={toggleAssignTeacherModal}
          modalTitle="Assign Class Teacher"
          instituteId={instituteId}
          instituteName={"Assign Teacher"}
          sectionDetails={sectionDetailsByIdResp}
          // academicDetails={selectedDropDownDetails}
          // assignedTeacher={}
          branchId={branchId}
          editBranchDetails={""}
        />
            </ModalContainerUpdated>
      </Container>
    </div>
    {/* <ToastContainer /> */}
  </>
  );
};

export default AcademaicSectionDetails;
