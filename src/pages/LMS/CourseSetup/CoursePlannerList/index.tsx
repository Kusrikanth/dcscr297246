import {
  Book02Icon,
  Calendar03Icon,
  CheckListIcon,
  Copy01Icon,
  Delete02Icon,
  Download04Icon,
  Edit03Icon,
  File01Icon,
  Folder01Icon,
  GridViewIcon,
  LeftToRightListBulletIcon,
  PlusSignIcon,
  Setup02Icon,
  Time02Icon,
  Upload04Icon,
  User02Icon,
  ViewIcon,
} from "@hugeicons-pro/core-stroke-standard";
import {
  DropDownToggle,
  OffCanvasContainer,
  SelectInput,
  TextInput,
  UserDetails,
} from "../../../../Components/Common";

import { HugeiconsIcon } from "@hugeicons/react";
import { Progress } from "reactstrap";
import { useHistory } from "react-router-dom";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useEffect, useMemo, useRef, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import classnames from "classnames";
import { MoreActions } from "../../../../Components/Common/MenuOptions";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useFilterState } from "../../../../hooks/filterhook";
import { AdvanceFilterModal } from "./AdvanceFilterModal";
import CoursePlannerTableView from "./CoursePlannerTableView";
import CourseDirectorStats from "./CourseDirectorStats";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const coursePlannerData = [
  {
    courseId: "MATH10-2526",
    courseTitle: "CBSE Class 10 – Mathematics",
    courseSubject: "Mathematics",
    courseAcademicYear: "2025-2026",
    sections: ["A", "B", "C", "D", "E", "F"],
    noOfUnits: null,
    noOfWeeks: null,
    noOfSessions: null,
    mappedPer: 98,
    resourse: 2,
    createdBy: { name: "PMS – Alwal", role: "" },
    createdOn: null,
    courseStatus: "Published",
    teachers: 2,
    students: 320,
  },
  {
    courseId: "MATH10-2526-SEC2",
    courseTitle: "CBSE Class 10 – Mathematics",
    courseSubject: "Mathematics",
    courseAcademicYear: "2025-2026",
    sections: ["G", "H"],
    noOfUnits: null,
    noOfWeeks: null,
    noOfSessions: null,
    mappedPer: 75,
    resourse: 2,
    createdBy: { name: "PMS – Alwal", role: "" },
    createdOn: null,
    courseStatus: "Pending",
    teachers: 2,
    students: 310,
  },
  {
    courseId: "SCI10-2526",
    courseTitle: "CBSE Class 10 – Science",
    courseSubject: "Science",
    courseAcademicYear: "2025-2026",
    sections: ["A", "B", "C"],
    noOfUnits: null,
    noOfWeeks: null,
    noOfSessions: null,
    mappedPer: 88,
    resourse: 2,
    createdBy: { name: "PMS – AS Rao Nagar", role: "" },
    createdOn: null,
    courseStatus: "In Setup",
    teachers: 2,
    students: 300,
  },
  {
    courseId: "PHY10-2526",
    courseTitle: "CBSE Class 10 – Physics",
    courseSubject: "Physics",
    courseAcademicYear: "2025-2026",
    sections: ["A", "B"],
    noOfUnits: null,
    noOfWeeks: null,
    noOfSessions: null,
    mappedPer: 82,
    resourse: 1,
    createdBy: { name: "DPS – Nacharam", role: "" },
    createdOn: null,
    courseStatus: "In Review",
    teachers: 1,
    students: 160,
  },
  {
    courseId: "CHE10-2526",
    courseTitle: "CBSE Class 10 – Chemistry",
    courseSubject: "Chemistry",
    courseAcademicYear: "2025-2026",
    sections: ["A"],
    noOfUnits: null,
    noOfWeeks: null,
    noOfSessions: null,
    mappedPer: 34,
    resourse: 1,
    createdBy: { name: "PMS – Alwal", role: "" },
    createdOn: null,
    courseStatus: "Draft",
    teachers: 1,
    students: 140,
  },
];

const SUBJECT_ICON: Record<string, string> = {
  Maths: "📐",
  Mathematics: "📐",
  Science: "🔬",
  Physics: "🔭",
  Chemistry: "⚗️",
  Biology: "🧬",
  English: "📖",
  Hindi: "📝",
  "Social Science": "🌐",
  Social: "🌐",
  History: "🏛️",
  Geography: "🌍",
  Civics: "⚖️",
  Economics: "💹",
  "Computer Science": "💻",
  IT: "💻",
  Arts: "🎨",
  "Physical Education": "⚽",
};

const CoursePlannerItem = ({ courseItem }) => {
  const {
    courseTitle,
    courseStatus,
    courseSubject,
    courseAcademicYear,
    sections,
    noOfUnits,
    noOfWeeks,
    noOfSessions,
    mappedPer,
    resourse,
    createdBy,
    createdOn,
    borderColor,
    courseId,
    teachers,
    students,
  } = courseItem;

  // published,insetup, pending, review, draft, archived,
  const statusColors = {
    published: {
      textColor: "tw-text-green-500",
      bgColor: "green-500",
      label: "tw-text-green-500 tw-border-green-200 tw-bg-green-50",
      borderColor: "green-500",
    },
    insetup: {
      textColor: "tw-text-rose-500",
      bgColor: "rose-500",
      borderColor: "rose-500",
      label: "tw-text-rose-500 tw-border-rose-200 tw-bg-rose-50",
    },
    inreview: {
      textColor: "tw-text-indigo-500",
      bgColor: "indigo-500",
      borderColor: "indigo-500",
      label: "tw-text-indigo-500 tw-border-indigo-200 tw-bg-indigo-50",
    },
    pending: {
      textColor: "tw-text-amber-500",
      bgColor: "amber-500",
      label: "tw-text-amber-500 tw-border-amber-200 tw-bg-amber-50",
      borderColor: "amber-500",
    },
    draft: {
      textColor: "tw-text-slate-500",
      bgColor: "slate-500",
      label: "tw-text-slate-500 tw-border-slate-200 tw-bg-slate-50",
      borderColor: "slate-500 tw-border-dashed",
    },
    archived: {
      textColor: "tw-text-gray-500",
      bgColor: "gray-500",
      label: "tw-text-gray-500 tw-border-gray-200 tw-bg-gray-50",
      borderColor: "gray-500",
    },
  };

  const history = useHistory();

  function handleCoursePlanPreview() {
    history.push("/course-plan-preview");
  }

  function moveToPlannerPreview() {
    history.push(`/build-course-directory`);
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={Edit03Icon}
            className="me-2 text-muted"
            size={18}
          />
        ),
        actionName: "Edit",
      },
      {
        id: "clone",
        actionIcon: (
          <HugeiconsIcon
            icon={Copy01Icon}
            className="me-2 text-secondary"
            size={18}
          />
        ),
        actionName: "Clone",
      },
      {
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02Icon}
            className="me-2 text-danger"
            size={18}
          />
        ),
        actionName: "Delete",
      },
    ],
    []
  );

  const normalizedSubject = courseSubject?.trim();
  const iconSubject = SUBJECT_ICON[normalizedSubject] || "📘";

  console.log(
    statusColors[courseStatus.toLowerCase().replace(/\s+/g, "")]?.bgColor
  );

  return (
    <div
      className={`tw-rounded-xl tw-bg-white mb-0 tw-border tw-shadow tw-border-t-[6px]  tw-border-${
        statusColors[courseStatus.toLowerCase().replace(/\s+/g, "")]?.bgColor
      }`}
      style={{ borderTopStyle: "solid" }}
    >
      <div className="tw-p-4">
        <div className="tw-mb-5 tw-flex tw-items-center">
          <div className="tw-me-4">
            <span className="tw-text-xl">{iconSubject}</span>
          </div>
          <div className="tw-flex-1 tw-min-w-0">
            <div className="tw-flex tw-justify-between tw-items-center tw-gap-4">
              <p className={`tw-font-bold tw-mb-0 tw-truncate tw-text-base`}>
                {courseTitle}
              </p>
              <div className="tw-flex tw-items-center tw-shrink-0">
                <MoreActions
                  actionOptions={menuOptions}
                  rowId={courseItem.courseId}
                  isHorizontal
                />
              </div>
            </div>

            <div className="tw-flex tw-items-center tw-gap-2 tw-flex-wrap">
              <p
                className={`tw-text-[10px] tw-rounded-md tw-px-1 tw-py-[1px] tw-border tw-me-1 tw-flex tw-items-center ${
                  statusColors[courseStatus.toLowerCase().replace(/\s+/g, "")]
                    ?.label
                } tw-mb-0`}
              >
                <span
                  className={`tw-w-[6px] tw-h-[6px] tw-rounded-full tw-inline-block tw-me-1 tw-bg-${
                    statusColors[courseStatus.toLowerCase().replace(/\s+/g, "")]
                      ?.bgColor
                  } `}
                ></span>
                {courseStatus}
              </p>
              <div className="tw-text-xs tw-text-gray-500 tw-flex tw-items-center">
                <span>{courseSubject}</span>
                <span
                  className="
                    tw-ms-4 tw-relative
                    before:tw-content-['']
                    before:tw-w-[4px]
                    before:tw-h-[4px]
                    before:tw-rounded-full
                    before:tw-bg-gray-500
                    before:tw-absolute
                    before:tw-top-1/2
                    before:tw-translate-x-[-8px]
                    before:tw-translate-y-[-50%]
                  "
                >
                  X
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-flex tw-items-center tw-mb-2">
          <span className="tw-text-gray-500 tw-me-1">Course code: </span>
          <span className="tw-font-semibold">{courseId}</span>
        </div>
        <div className="tw-flex tw-flex-wrap tw-gap-4 tw-text-sm tw-text-gray-700 tw-border-gray-200 tw-mb-3">
          <div className="tw-flex tw-items-center">
            <span className="tw-text-gray-500 tw-me-1">Class: </span>
            <span className="tw-font-semibold">X</span>
          </div>

          <div className="tw-flex tw-items-center">
            <span className="tw-text-gray-500 tw-me-1">Teachers:</span>
            <span className="tw-font-semibold">{teachers}</span>
          </div>

          <div className="tw-flex tw-items-center">
            <span className="tw-text-gray-500 tw-me-1">students: </span>
            <span className="tw-font-semibold">{students}</span>
          </div>
        </div>
        <div className="tw-flex tw-items-center tw-gap-1 tw-mb-4 tw-flex-wrap">
          {sections.map((item) => (
            <div
              key={item}
              className={`tw-rounded-xl tw-px-2 tw-py-[1px] tw-border tw-me-1 tw-flex tw-items-center ${
                statusColors[courseStatus.toLowerCase().replace(/\s+/g, "")]
                  ?.label
              }`}
            >
              <span
                className={`tw-w-[6px] tw-h-[6px] tw-rounded-full tw-inline-block tw-me-1 tw-bg-${
                  statusColors[courseStatus.toLowerCase().replace(/\s+/g, "")]
                    ?.bgColor
                } `}
              ></span>
              {item}
            </div>
          ))}
        </div>

        <div className="">
          <div className="tw-flex tw-items-center tw-mb-1">
            <span className="tw-me-1 tw-font-semibold">Setup Progress :</span>
            <span className="tw-font-semibold">{mappedPer} %</span>
          </div>
          <div className="tw-mb-4 tw-flex tw-items-center">
            <div className="tw-flex-1 tw-me-4">
              <Progress
                value={mappedPer}
                // barClassName={
                //   mappedPer <= 50
                //     ? "!tw-bg-rose-500"
                //     : mappedPer <= 75
                //     ? "!tw-bg-amber-500"
                //     : "!tw-bg-green-500"
                // }
                barClassName={`!tw-bg-${
                  statusColors[courseStatus.toLowerCase().replace(/\s+/g, "")]
                    ?.bgColor
                }`}
              />
            </div>
            {/* <p className="tw-mb-0">{`${mappedPer} %`}</p> */}
          </div>
        </div>

        <div className="tw-flex tw-gap-x-3 tw-gap-y-1 tw-mb-2 tw-flex-wrap">
          <div className="tw-flex tw-items-center d-none">
            {/* <HugeiconsIcon icon={Time02Icon} size={18} className="tw-me-2" /> */}
            <span className="tw-font-semibold tw-me-1">Resources :</span>
            <span>20</span>
          </div>
          <div className="tw-flex tw-items-center">
            {/* <HugeiconsIcon icon={Time02Icon} size={18} className="tw-me-2" /> */}
            <span className="tw-font-semibold tw-me-1">Admin :</span>
            <span>Mr.Ramesh</span>
          </div>
          <div className="tw-flex tw-items-center">
            {/* <HugeiconsIcon icon={Time02Icon} size={18} className="tw-me-2" /> */}
            <span className="tw-font-semibold tw-me-1">Updated :</span>
            <span>30 Jul 2025</span>
          </div>
        </div>

        <div className="tw-flex tw-items-center tw-gap-2 tw-border-t tw-pt-2 tw-justify-center">
          <button
            className="btn btn-sm btn-success rounded-pill"
            // onClick={moveToPlannerPreview}
          >
            View Course
          </button>
        </div>
      </div>
    </div>
  );
};

const CoursePlannerList = () => {
  const [activeId, setActiveId] = useState("all");
  const [coursePlannerList, setCoursePlannerList] = useState(coursePlannerData);
  const [coursePlannerView, setCoursePlannerView] = useState({
    isGridMode: true,
  });

  const history = useHistory();

  const { showClearFilterState, count, advanceFilterChange } = useFilterState();
  const [open, setOpen] = useState<boolean>(false);
  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };

  const MenuOptions = [
    {
      id: "all",
      labelName: "All",
      customPadding: "",
      count: 10,
    },
    {
      id: "published",
      labelName: "Published",
      customPadding: "",
      count: 2,
    },
    {
      id: "inProgress",
      labelName: "In Setup",
      customPadding: "",
      count: 5,
    },
    {
      id: "pending",
      labelName: "Pending",
      customPadding: "",
      count: 2,
    },
    {
      id: "inReview",
      labelName: "In Review",
      customPadding: "",
      count: 2,
    },
    {
      id: "draft",
      labelName: "Draft",
      customPadding: "",
      count: 2,
    },
    {
      id: "archived",
      labelName: "Archived",
      customPadding: "",
      count: 3,
    },
  ];

  function clickMenuHandler(event: any) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeList = useMemo(() => {
    if (activeId === "all") return coursePlannerList;
    return coursePlannerList.filter((item) => item.courseStatus === activeId);
  }, [activeId, coursePlannerList]);

  function handleCoursePlannerView(event: React.MouseEvent<HTMLElement>) {
    const viewMode = event.currentTarget.getAttribute("data-view");
    setCoursePlannerView((prev) => ({
      ...prev,
      isGridMode: viewMode === "grid",
    }));
  }

  function courseDirectorySetUpHandler() {
    history.push(`/course-directory-setup`);
  }

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="LMS"></BreadCrumb>

          <CourseDirectorStats></CourseDirectorStats>

          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-12 col-lg-6">
                  <h4 className="mb-0 card-title">Courses Directory</h4>
                  <p className="tw-text-xs tw-mb-0 tw-text-gray-500">
                    View and manage your curriculum courses by filters or
                    explore section-wise plan.
                  </p>
                </div>
                <div className="col-auto ms-auto">
                  <div className="tw-flex tw-items-center tw-gap-3">
                    <button
                      className="btn btn-success"
                      onClick={courseDirectorySetUpHandler}
                    >
                      <HugeiconsIcon
                        icon={PlusSignIcon}
                        size={18}
                        className="me-2"
                      />
                      Create Course
                    </button>
                    <button className="btn btn-outline-warning">
                      <HugeiconsIcon
                        icon={Download04Icon}
                        size={18}
                        className="me-2"
                      />
                      Import
                    </button>
                    <button className="btn btn-outline-secondary">
                      <HugeiconsIcon
                        icon={Upload04Icon}
                        size={18}
                        className="me-2"
                      />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3 tw-mb-6">
                <div className="col-12 col-md-6 col-lg-4 col-xl-3">
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
                <div className="col-12 col-md-6 col-lg-4 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={""}
                    onChange={() => {}}
                    menuItems={[]}
                    valueKey=""
                    textKey=""
                    labelText="Currciulum"
                    floatingLabel
                    formgroupClassName="mb-0"
                  ></SelectInput>
                </div>
                <div className="col-12 col-md-6 col-lg-4 col-xl-2">
                  <SelectInput
                    name="classId"
                    value={""}
                    onChange={() => {}}
                    menuItems={[]}
                    valueKey=""
                    textKey=""
                    labelText="Class"
                    floatingLabel
                    formgroupClassName="mb-0"
                  ></SelectInput>
                </div>
                <div className="col-12 col-md-6 col-lg-4 col-xl-2 ">
                  <SelectInput
                    name="subject"
                    value={""}
                    onChange={() => {}}
                    menuItems={[]}
                    valueKey=""
                    textKey=""
                    labelText="Subject"
                    formgroupClassName="mb-0"
                    floatingLabel
                  ></SelectInput>
                </div>
                <div className="col-12 col-md-6 col-lg-4 col-xl-2 ">
                  <SelectInput
                    name="admin"
                    value={""}
                    onChange={() => {}}
                    menuItems={[]}
                    valueKey=""
                    textKey=""
                    labelText="Admin"
                    formgroupClassName="mb-0"
                    floatingLabel
                  ></SelectInput>
                </div>

                <div className="col-1 d-none">
                  <button
                    style={{ backgroundColor: "#F4F7FA" }}
                    onClick={toggleAdvanceFilter}
                    className="p-2 btn d-flex me-2"
                  >
                    <FilterSvg height={"18px"} width={"18px"} />
                    <span className="ms-2">Filters</span>
                  </button>
                  <span
                    className="badge align-middle rounded-pill ms-1 "
                    style={{
                      marginBottom: "18px",
                      position: "absolute",
                      top: "-9px",
                      left: "78px",
                      background: "#0ab39c",
                    }}
                  >
                    {count}
                  </span>
                </div>
              </div>

              <div className="tw-flex tw-justify-between">
                <div className="">
                  <UpdatedHorizontalTab
                    MenuOptions={MenuOptions}
                    clickMenuHandler={clickMenuHandler}
                    activeTabId={activeId}
                    showBadge={true}
                    horizontalClass="horizontal-menu-pill-tabs tw-w-fit"
                  />
                </div>
                <div className="list-grid-nav hstack gap-1">
                  <button
                    data-view="grid"
                    className={classnames(
                      "btn btn-soft-info nav-link btn-icon fs-14 filter-button",
                      { active: coursePlannerView.isGridMode }
                    )}
                    onClick={handleCoursePlannerView}
                  >
                    <HugeiconsIcon icon={GridViewIcon} size={18} />
                  </button>
                  <button
                    data-view="list"
                    className={classnames(
                      "btn btn-soft-info nav-link btn-icon fs-14 filter-button",
                      { active: !coursePlannerView.isGridMode }
                    )}
                    onClick={handleCoursePlannerView}
                  >
                    <HugeiconsIcon icon={LeftToRightListBulletIcon} size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {coursePlannerView?.isGridMode ? (
            <CoursePlannerGridView></CoursePlannerGridView>
          ) : (
            <CoursePlannerTableView></CoursePlannerTableView>
          )}
        </div>
        <FancyDropdown></FancyDropdown>
      </div>

      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-course-directory-list"
      >
        <AdvanceFilterModal></AdvanceFilterModal>
      </OffCanvasContainer>
    </>
  );
};

export default CoursePlannerList;

function FancyDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const history = useHistory();

  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function courseDirectorySetUpHandler() {
    history.push(`/course-directory-setup`);
  }

  return (
    <div
      className="tw-fixed tw-bottom-6 tw-right-[48px] tw-z-50"
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className="tw-w-12 tw-h-12 tw-bg-purple-500 tw-text-white tw-text-2xl tw-rounded-full tw-flex tw-items-center tw-justify-center tw-shadow-md"
      >
        +
      </button>

      {open && (
        <>
          <div className="tw-absolute tw-bottom-16 tw-right-[0px] tw-translate-x-[8%] tw-w-64 tw-bg-white tw-rounded-lg tw-border tw-z-50">
            <div className="tw-p-2 tw-space-y-1">
              <button
                className="tw-flex tw-items-start tw-gap-3 tw-w-full tw-p-3 tw-rounded-lg hover:tw-bg-gray-100 tw-text-left"
                onClick={courseDirectorySetUpHandler}
              >
                <div className="tw-text-pink-500 tw-text-xl"></div>
                <div>
                  <div className="tw-font-semibold tw-text-gray-800">
                    Create Course
                  </div>
                  <div className="tw-text-xs tw-text-gray-500">
                    Create content with articles
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="tw-absolute tw-bottom-[3.25rem] tw-left-1/2 -tw-translate-x-[8px] tw-top-0 -tw-translate-y-[22px] tw-z-50">
            <div className="tw-w-3 tw-h-3 tw-bg-white tw-rotate-45 tw-border tw-border-l-0 tw-border-t-0 tw-border-l tw-border-t tw-border-gray-200" />
          </div>
        </>
      )}
    </div>
  );
}

function CoursePlannerGridView() {
  return (
    <div
      className={`tw-grid tw-gap-4 tw-mb-6 
                ? "tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-3 2xl:tw-grid-cols-4`}
    >
      {coursePlannerData.map((courseItem) => (
        <CoursePlannerItem
          courseItem={courseItem}
          key={courseItem.courseTitle}
        ></CoursePlannerItem>
      ))}
    </div>
  );
}
