import React, { useEffect, useMemo, useState } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import StudentRemarks from "../../CbseManagement/StudentRemarks";
import AoSelection from "./AoSelection";
import AoGradeEntry from "./AoGradeEntry";
import ProgressCard from "../../CbseManagement/ProgressCard";
import EYGradesEntry from "../../CbseManagement/EYGradesEntry";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getClassTeacherListAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";

const EarlyYearsManagement = () => {

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
      return "aoGradeEntry"
    }
    return "aoSelection";
    }, [loggedInUserRole]);
    

    
      useEffect(() => {
        if (loggedInUserRole === "TEACHER" && academicYearListResp?.data && academicYearListResp?.data?.length > 0 && userMeResp?.loggedInUserInformation?.id) {
          const yearId = academicYearListResp?.data?.find((year: any) => year.yearStatus?.toLowerCase() === "current")?.academicYearId;;
          const payload1 = { academicYearId: yearId, teacherId: userMeResp?.loggedInUserInformation?.id };
          dispatch(getClassTeacherListAct(generateActionPayload("get_classTeacher_list", undefined, payload1)));
        }
      }, [loggedInUserRole, academicYearListResp, userMeResp]);
  
  const [activeId, setActiveId] = useState<any>(initialActiveId);

  const MenuOptions = useMemo(() => {
  const options = [
    {
      id: "aoSelection",
      labelName: "Ao's Selection",
      customPadding: "0px 15px",
    },
    {
      id: "aoGradeEntry",
      labelName: "Ao's Grade Entry",
      customPadding: "0px 15px",
    },
    {
      id: "eYGradesEntry",
      labelName: "EY Grades Entry",
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
      let filtered = options.filter(option => option.id !== "aoSelection" &&  option.id !== "progressCard");

       if (!Array.isArray(getClassTeacherListResp) || getClassTeacherListResp.length === 0) {
        filtered = filtered.filter(option => option.id !== "eYGradesEntry" && option.id !== "studentRemarks");
      }
      return filtered;
    }else if (loggedInUserRole === "PA") {
      return options.filter(item => item.id === "aoGradeEntry" || item.id === "eYGradesEntry")
    }
    return options;
  }, [loggedInUserRole, getClassTeacherListResp]);

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "aoSelection":
        return AoSelection;
      case "aoGradeEntry":
        return AoGradeEntry;
      case "studentRemarks":
        return StudentRemarks;
        case "eYGradesEntry":
        return EYGradesEntry;
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
          <BreadCrumb title="Early Years Managment" pageTitle="Examination" />

          <div className="card mb-0">
            <div className="card-header pb-0">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Early Years Management
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

export default EarlyYearsManagement;
