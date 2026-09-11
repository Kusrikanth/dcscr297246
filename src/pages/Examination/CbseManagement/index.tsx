import React, { useEffect, useMemo, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import AdmitCard from "./AdmitCard";
import MarksEntry from "./MarksEntry";
import ProgressCard from "./ProgressCard";
import StudentRemarks from "./StudentRemarks";
import ExaminationSubjectDetails from "./ExaminationSubjectDetails";
import InternalSubjectsGradesEntry from "./InternalSubjectsGradesEntry";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getMasterCurriculumClassAct, getMastersCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getClassTeacherListAct } from "../../../store/examination/examinationmanagement/examinationmanagementactions";

const CbseManagement = () => {

  const dispatch = useAppDispatch();
  const { loggedInUserRole, getMasterCurriculumClassResp, getMasterCurriculumResp, currentBranchIdResp, userMeResp, academicYearListResp, getClassTeacherListResp } =
    useAppSelector(({ appData, branchAcademics, login, instAcademics, examinationManagement }) => ({
      loggedInUserRole: appData.loggedInUserRole,
      getMasterCurriculumClassResp: branchAcademics.getMasterCurriculumClassResp,
      getMasterCurriculumResp: branchAcademics.getMasterCurriculumResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      userMeResp: login.userMeResp,
      academicYearListResp: instAcademics.academicYearListResp,
      getClassTeacherListResp: examinationManagement.getClassTeacherListResp

    }), shallowEqual);

  const initialActiveId = useMemo(() => {
    if (loggedInUserRole === "TEACHER") {
      return "marksEntry"
    }
    return "examinationSubjects";
  }, [loggedInUserRole]);

  const [activeId, setActiveId] = useState<any>(initialActiveId);

  useEffect(() => {
    if (loggedInUserRole === "TEACHER" && academicYearListResp?.data && academicYearListResp?.data?.length > 0 && userMeResp?.loggedInUserInformation?.id) {
      const yearId = academicYearListResp?.data?.find((year: any) => year.yearStatus?.toLowerCase() === "current")?.academicYearId;;
      const payload1 = { academicYearId: yearId, teacherId: userMeResp?.loggedInUserInformation?.id };
      dispatch(getClassTeacherListAct(generateActionPayload("get_classTeacher_list", undefined, payload1)));
    }
  }, [loggedInUserRole, academicYearListResp, userMeResp]);

  useEffect(() => {
    if (loggedInUserRole === "TEACHER") {
      const payload1 = { branchId: currentBranchIdResp, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
      dispatch(getMastersCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
  }, [loggedInUserRole])

  useEffect(() => {
    if (getMasterCurriculumResp?.data?.length > 0 && loggedInUserRole === "TEACHER") {
      const curriculumId = getMasterCurriculumResp.data[0].branchCurriculumId;
      if (curriculumId) {
        const payload = { branchId: currentBranchIdResp, curriculumId: curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, };
        dispatch(getMasterCurriculumClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
    }
  }, [getMasterCurriculumResp, loggedInUserRole]);

  const MenuOptions = useMemo(() => {
    const options = [
      {
        id: "examinationSubjects",
        labelName: "Examination Subjects",
        customPadding: "0px 15px",
      },
      {
        id: "admitCard",
        labelName: "Admit Card",
        customPadding: "0px 15px",
      },
      {
        id: "marksEntry",
        labelName: "Marks Entry",
        customPadding: "0px 15px",
      },
      {
        id: "internalMarksEntry",
        labelName: "Internal Subjects Marks Entry",
        customPadding: "0px 15px",
      },
      {
        id: "studentRemarks",
        labelName: "Student Remarks",
        customPadding: "0px 15px",
      },
      {
        id: "progressCard",
        labelName: "Progress Card",
        customPadding: "0px 15px",
      },
    ];
    if (loggedInUserRole === "TEACHER") {

      const hasClassSequnceAbove13 = getMasterCurriculumClassResp?.content.some(
        (item) => item.classSequence > 13
      );
      let filtered = options.filter(
        (option) =>
          option.id !== "examinationSubjects" &&
          option.id !== "admitCard" &&
          option.id !== "progressCard" &&
          (hasClassSequnceAbove13 || option.id !== "internalMarksEntry")
      );

      if (!Array.isArray(getClassTeacherListResp) || getClassTeacherListResp.length === 0) {
        filtered = filtered.filter(option => option.id !== "studentRemarks");
      }
      return filtered;
    } else if (loggedInUserRole === "PA") {
      return options.filter(item => item.id !== "progressCard")
    }
    return options;
  }, [loggedInUserRole, getMasterCurriculumClassResp, getClassTeacherListResp]);

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "examinationSubjects":
        return ExaminationSubjectDetails;
      case "admitCard":
        return AdmitCard;
      case "marksEntry":
        return MarksEntry;
      case "internalMarksEntry":
        return InternalSubjectsGradesEntry;
      case "studentRemarks":
        return StudentRemarks;
      case "progressCard":
        return ProgressCard;
      default:
        return null;
    }
  }
  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }
  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return (
      <TabComponent />
    );
  }, [activeId]);
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="CBSE Examination Managment" pageTitle="Examination" />

          <div className="card mb-0">
            <div className="card-header pb-0">
              <div className="row align-items-center">
                <div className="col-12">
                  <h4 className="card-title mb-0 flex-grow-1">
                    CBSE Examination Management
                  </h4>
                </div>
              </div>
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="pt-2 mb-0 overflow-auto text-nowrap"
              />
            </div>
          </div>
          <div className="card-body p-0">
            {activeComponent}
          </div>
        </div>
      </div>
    </>
  );
};

export default CbseManagement;

