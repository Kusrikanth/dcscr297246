import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import ExaminationSubjectDetails from "../CbseManagement/ExaminationSubjectDetails";
import AdmitCard from "../CbseManagement/AdmitCard";
import StudentRemarks from "../CbseManagement/StudentRemarks";
import MarksEntry from "../CbseManagement/MarksEntry";
import AoGradeEntry from "../EarlyYears/Management/AoGradeEntry";
import EYGradesEntry from "../CbseManagement/EYGradesEntry";
import ProgressCard from "../CbseManagement/ProgressCard";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getClassTeacherListAct } from "../../../store/examination/examinationmanagement/examinationmanagementactions";
import { generateActionPayload } from "../../../utility/reduxutility";

const IgseManagement = () => {

  const dispatch = useAppDispatch();

  const { loggedInUserRole, userMeResp, academicYearListResp, getClassTeacherListResp } =
    useAppSelector(({ appData, login, instAcademics, examinationManagement }) => ({
      loggedInUserRole: appData.loggedInUserRole,
      userMeResp: login.userMeResp,
      academicYearListResp: instAcademics.academicYearListResp,
      getClassTeacherListResp: examinationManagement.getClassTeacherListResp
    }), shallowEqual);

  const initialActiveId = useMemo(() => {
    if (loggedInUserRole === "TEACHER" || loggedInUserRole === "PA") {
      return "marksEntry"
    }
    return "examinationSubject";
  }, [loggedInUserRole]);


  useEffect(() => {
    if (loggedInUserRole === "TEACHER" && academicYearListResp?.data && academicYearListResp?.data?.length > 0 && userMeResp?.loggedInUserInformation?.id) {
      const yearId = academicYearListResp?.data?.find((year) => year.yearStatus?.toLowerCase() === "current")?.academicYearId;;
      const payload1 = { academicYearId: yearId, teacherId: userMeResp?.loggedInUserInformation?.id };
      dispatch(getClassTeacherListAct(generateActionPayload("get_classTeacher_list", undefined, payload1)));
    }
  }, [loggedInUserRole, academicYearListResp, userMeResp]);


  const [activeId, setActiveId] = useState(initialActiveId);

  const MenuOptions = useMemo(() => {
    const options = [
      {
        id: "examinationSubject",
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
        labelName: "Term Wise Exam Marks Entry",
        customPadding: "0px 15px",
      },
      {
        id: "skillsEntry",
        labelName: "Term Wise Exam Skill Entry",
        customPadding: "0px 15px",
      },
      {
        id: "aoGradeEntry",
        labelName: " Ao Grade Entry",
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
      let filtered = options.filter(option => option.id !== "examinationSubject" && option.id !== "admitCard" && option.id !== "progressCard");
      if (!Array.isArray(getClassTeacherListResp) || getClassTeacherListResp.length === 0) {
        filtered = filtered.filter(option => option.id !== "studentRemarks" && option.id !== "skillsEntry");
      }
      return filtered;
    } else if (loggedInUserRole === "PA") {
      return options.filter(item => item.id === "marksEntry" || item.id === "skillsEntry"
        || item.id === "aoGradeEntry"
      )
    }
    return options;
  }, [loggedInUserRole, getClassTeacherListResp]);
  function getActiveMenuComponent(menuId) {
    switch (menuId) {
      case "examinationSubject":
        return ExaminationSubjectDetails;
      case "admitCard":
        return AdmitCard;
      case "studentRemarks":
        return StudentRemarks;
      case "marksEntry":
        return MarksEntry;
      case "skillsEntry":
        return EYGradesEntry;
      case "aoGradeEntry":
        return AoGradeEntry;
      case "progressCard":
        return ProgressCard;
      default:
        return null;
    }
  }
  function clickMenuHandler(event) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }
  const activeComponent = useMemo(() => {
    const TabComponent = getActiveMenuComponent(activeId);
    return (
      <TabComponent />
    );
  }, [activeId]);
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Igcse Examination Managment" pageTitle="Examination" />

          <div className="card mb-0">
            <div className="card-header pb-0">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Igcse Examination Management
                  </h4>
                </div>
              </div>
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="pt-2 overflow-auto text-nowrap"
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

export default IgseManagement;
