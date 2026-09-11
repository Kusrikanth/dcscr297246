import { useMemo, useState } from "react";
import {
  OffCanvasContainer,
  SelectInput,
  TextInput,
} from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";

import { default as MathsSVG } from "../../../../assets/imagesdps/lms/maths.svg?react";
import { default as EnglishSVG } from "../../../../assets/imagesdps/lms/english.svg?react";
import { default as SocialSVG } from "../../../../assets/imagesdps/lms/social.svg?react";
import { default as PhysicsSVG } from "../../../../assets/imagesdps/lms/physics.svg?react";
import { default as EconomicSVG } from "../../../../assets/imagesdps/lms/economic.svg?react";
import { default as ChemistrySVG } from "../../../../assets/imagesdps/lms/chemistry.svg?react";
import { default as BiologySVG } from "../../../../assets/imagesdps/lms/biology.svg?react";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";

import {
  AnalysisTextLinkIcon,
  Cancel01Icon,
  Download04Icon,
  SentIcon,
  UserAdd01Icon,
  ViewIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import AdminAssessmentCard from "./AdminAssessmentCard";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { useHistory, useLocation } from "react-router-dom";
import TeacherAssessmentCard from "./TeacherAssessmentCard";
import StudentAssessmentCard from "./StudentAssessmentCard";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  count?: number;
}

const assessementItems = [
  {
    id: 1,
    className: "Class 10",
    title: "Mathematics Weekly Assessment",
    subtitle: "Algebra Basics",
    questions: 5,
    createdAt: "Jan 31, 2025",
    endDate: "Feb 03, 2025",
    marks: 14,
    duration: "02:30 hrs.",
    statusLabel: "Scheduled",
    evaluationStatus: "Created",
    icon: <MathsSVG />,
    bgColor: "#10b3b733",
    testType: "Weekly Test",
    subjectName: "Mathematics",
  },
  {
    id: 2,
    className: "Class 10",
    title: "English Comprehension Test",
    subtitle: "Reading Comprehension",
    questions: 8,
    createdAt: "Feb 05, 2025",
    endDate: "Feb 07, 2025",
    marks: 15,
    duration: "01:45 hrs.",
    statusLabel: "Scheduled",
    evaluationStatus: "Pending",
    icon: <EnglishSVG />,
    bgColor: "#67c23a33",
    testType: "Worksheet",
    subjectName: "English",
  },
  {
    id: 3,
    className: "Class 10",
    title: "Social Science Ethics Quiz",
    subtitle: "Cyber Ethics",
    questions: 6,
    createdAt: "Mar 10, 2025",
    endDate: "Mar 12, 2025",
    marks: 12,
    duration: "01:30 hrs.",
    statusLabel: "Live",
    evaluationStatus: "Created",
    icon: <SocialSVG />,
    bgColor: "#f56c6c33",
    testType: "Objective Test",
    subjectName: "Social Science",
  },
  {
    id: 4,
    className: "Class 10",
    title: "Physics Logic Challenge",
    subtitle: "Logical Deduction",
    questions: 10,
    createdAt: "Mar 20, 2025",
    endDate: "Mar 22, 2025",
    marks: 20,
    duration: "01:45 hrs.",
    statusLabel: "Completed",
    evaluationStatus: "Graded",
    icon: <PhysicsSVG />,
    bgColor: "#f2994a33",
    testType: "Quiz",
    subjectName: "Physics",
  },
  {
    id: 5,
    className: "Class 10",
    title: "Economics Budget Planning Test",
    subtitle: "Household Budgeting",
    questions: 9,
    createdAt: "Apr 01, 2025",
    endDate: "Apr 03, 2025",
    marks: 16,
    duration: "01:40 hrs.",
    statusLabel: "Completed",
    evaluationStatus: "Not Graded",
    icon: <EconomicSVG />,
    bgColor: "#10b3b733",
    testType: "Homework",
    subjectName: "Economics",
  },
  {
    id: 6,
    className: "Class 10",
    title: "Chemistry Cybersecurity Basics Test",
    subtitle: "Cybersecurity Basics",
    questions: 8,
    createdAt: "May 01, 2025",
    endDate: "May 03, 2025",
    marks: 18,
    duration: "02:00 hrs.",
    statusLabel: "Completed",
    evaluationStatus: "Pending",
    icon: <ChemistrySVG />,
    bgColor: "#67c23a33",
    testType: "Weekly Test",
    subjectName: "Chemistry",
  },
  {
    id: 7,
    className: "Class 10",
    title: "Biology Innovation Quiz",
    subtitle: "Startup Innovation",
    questions: 11,
    createdAt: "Jun 10, 2025",
    endDate: "Jun 12, 2025",
    marks: 22,
    duration: "02:15 hrs.",
    statusLabel: "Completed",
    evaluationStatus: "In Progress",
    icon: <BiologySVG />,
    bgColor: "#f56c6c33",
    testType: "Quiz",
    subjectName: "Biology",
  },
  {
    id: 8,
    className: "Class 10",
    title: "Mathematics Practice Assessment",
    subtitle: "Algebra Basics",
    questions: 5,
    createdAt: "Jan 31, 2025",
    endDate: "Feb 03, 2025",
    marks: 14,
    duration: "02:30 hrs.",
    statusLabel: "Scheduled",
    evaluationStatus: "Created",
    icon: <MathsSVG />,
    bgColor: "#10b3b733",
    testType: "Weekly Test",
    subjectName: "Mathematics",
  },
];

const cardForList = {
  student: {
    actionsList: [
      { icon: SentIcon, title: "Feedback", id: "feedback" },
      { icon: AnalysisTextLinkIcon, title: "Analytics", id: "analytics" },
    ],
    buttonsList: [],
  },
  teacher: {
    actionsList: [
      { icon: Download04Icon, title: "Download", id: "download" },
      { icon: ViewIcon, title: "View", id: "view" },
      { icon: AnalysisTextLinkIcon, title: "Analytics", id: "analytics" },
    ],
    buttonsList: [],
  },

  admin: {
    actionsList: [
      { icon: UserAdd01Icon, title: "Assign Evaluator", id: "assignEvaluator" },
      { icon: ViewIcon, title: "View Live Dashboard", id: "view" },
      { icon: Cancel01Icon, title: "Cancel Exam", id: "cancelExam" },
    ],
  },
};

const CreatedAssessmentList = () => {
  const [activeId, setActiveId] = useState<any>("allassessments");
  const [open, setOpen] = useState<boolean>(false);
  const location = useLocation();

  const locationPath = location.pathname;

  const isTeacher = location.pathname === "/teacher-created-assessments";

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "allassessments",
      labelName: "All",
      customPadding: "0px 10px 6px 10px",
      count: 10,
    },
    {
      id: "live",
      labelName: "Live",
      customPadding: "0px 10px 6px 10px",
      count: 3,
    },
    {
      id: "completed",
      labelName: "Completed",
      customPadding: "0px 10px 6px 10px",
      count: 5,
    },
    {
      id: "scheduled",
      labelName: "Scheduled",
      customPadding: "0px 10px 6px 10px",
      count: 2,
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeIdItems = useMemo(() => {
    if (activeId === "allassessments") {
      return assessementItems;
    }

    const activeList = assessementItems.filter(
      (item) => item.statusLabel.toLowerCase() === activeId
    );
    return activeList;
  }, [activeId]);

  const { userDetails, userMeResp }: any = useAppSelector(
    ({ Profile, login }) => ({
      userDetails: Profile.userDetails,
      userMeResp: login.userMeResp,
    }),
    shallowEqual
  );

  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };

  const history = useHistory();

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="LMS" title="LMS"></BreadCrumb>

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-12 col-lg-4">
                  <h4 className="card-title mb-0">My Assessments</h4>
                </div>
                <div className="col-12 col-lg-auto ms-auto">
                  <UpdatedHorizontalTab
                    MenuOptions={MenuOptions}
                    clickMenuHandler={clickMenuHandler}
                    activeTabId={activeId}
                    horizontalClass="horizontal-menu-updated-style"
                    showBadge={true}
                  ></UpdatedHorizontalTab>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3 mb-5">
                <div className="col-12 col-lg-4 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      value={""}
                      onChange={() => {}}
                      labelText="Search"
                      floatingLabel
                      formgroupClassName="mb-0"
                    ></TextInput>
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumID"
                    value=""
                    onChange={() => {}}
                    menuItems={[]}
                    valueKey=""
                    textKey=""
                    labelText="Curriculum"
                    floatingLabel
                    formgroupClassName="mb-0"
                  ></SelectInput>
                </div>
                <div className="col-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="classId"
                    value=""
                    onChange={() => {}}
                    menuItems={[]}
                    valueKey=""
                    textKey=""
                    labelText="Class"
                    floatingLabel
                    formgroupClassName="mb-0"
                  ></SelectInput>
                </div>

                <div className="col-1">
                  <button
                    style={{ backgroundColor: "#F4F7FA" }}
                    onClick={toggleAdvanceFilter}
                    className="p-2 btn d-flex me-2"
                  >
                    <FilterSvg height={"18px"} width={"18px"} />
                    <span className="ms-2">Filters</span>
                  </button>
                </div>

                {isTeacher && (
                  <div className="col-auto ms-auto">
                    <div className="d-flex">
                      <button
                        className="btn btn-success float-end d-flex align-items-center"
                        onClick={() => history.push("/create-assessment")}
                      >
                        <i className="ri-add-line me-2"></i>
                        Add New
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="tw-grid tw-gap-5 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 2xl:tw-grid-cols-5">
                {locationPath === "/created-assessments"
                  ? activeIdItems.map((item, idx) => (
                      <AdminAssessmentCard
                        key={item.id}
                        assessment={item}
                        cardListItemsFor={cardForList["admin"]}
                      />
                    ))
                  : locationPath === "/teacher-created-assessments"
                  ? activeIdItems.map((item, idx) => (
                      <TeacherAssessmentCard
                        key={item.id}
                        assessment={item}
                        cardListItemsFor={cardForList["teacher"]}
                      />
                    ))
                  : activeIdItems.map((item, idx) => (
                      <StudentAssessmentCard
                        key={item.id}
                        assessment={item}
                        cardListItemsFor={cardForList["student"]}
                      />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-created-assessment-list"
      >
        <AdvanceFilterModal />
      </OffCanvasContainer>
    </>
  );
};

export default CreatedAssessmentList;
