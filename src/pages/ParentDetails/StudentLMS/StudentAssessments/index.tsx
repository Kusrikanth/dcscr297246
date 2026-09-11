import { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
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
import { default as BackToSchoolSVG } from "../../../../assets/imagesdps/lms/back-to-school.svg?react";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { default as RejectSvg } from "../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import StudentAssessmentCard from "./StudentAssessmentCard";
import { useFormik } from "formik";
import { getStudentAssessmentsListAct } from "../../../../store/lms/studentAssessment/studentAssessmentActions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { assessmentTypes } from "./helper";
import { getAssignedClassSubjectsList } from "../../../../store/academic/classSubjects/classsubjectsactions";
import { useHistory } from "react-router-dom";
import Pagination, { IPaginationState } from "../../../../Components/Common/Pagination";
import SubmissionSuccessModal from "../../../LMS/TestModule/StudentAssessment/Modals/SubmissionModal";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  count?: number;
}

const initialValues = {
  studentId: "",
  academicYearId: "",
  searchString: "",
  startDate: "",
  endDate: "",
  subjectId: "",
  assessmentType: "",
};

export const subjectIcons = [
  {
    subject: "Maths",
    bgColor: "#FDE68A",
    icon: <MathsSVG />,
  },
  {
    subject: "English",
    bgColor: "#BFDBFE",
    icon: <EnglishSVG />,
  },
  {
    subject: "Social",
    bgColor: "#FECACA",
    icon: <SocialSVG />,
  },
  {
    subject: "Physics",
    bgColor: "#A7F3D0",
    icon: <PhysicsSVG />,
  },
  {
    subject: "Economics",
    bgColor: "#DDD6FE",
    icon: <EconomicSVG />,
  },
  {
    subject: "Chemistry",
    bgColor: "#FDBA74",
    icon: <ChemistrySVG />,
  },
  {
    subject: "Biology",
    bgColor: "#FBCFE8",
    icon: <BiologySVG />,
  },
  {
    subject: "Filter",
    bgColor: "#E5E7EB",
    icon: <BiologySVG />,
  },
];

const StudentAssessments = () => {
  const [activeId, setActiveId] = useState<any>("allassessments");
  const [currentStudent, setCurrentStudent] = useState<any>(undefined);
  const [studentAssessmentFilters, setStudentAssessmentFilters] =
    useState(initialValues);

  const dispatch = useAppDispatch();
  const history = useHistory();

  function assessmentDetails() {
    history.push(`${/assessment-instructions/}`);
  }

   const pagination = useRef({
      pageNo: 0,
      pageSize: 10,
    });


  const {
    currentBranchIdResp: branchId,
    academicYearListResp,
    parentChildrensResp,
    currentStudentId,
    getStudentAssessmentsListResp,
    showApiLoader,
    assignedClassSubjectsListResp,
      studentAssessmentsErrorResp
  } = useAppSelector(
    ({
      appData,
      instAcademics,
      directoryStudent,
      studentAssessments,
      globalData,
      classSubjectsInfo,
    }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentStudentId: appData.currentStudentId,
      academicYearListResp: instAcademics.academicYearListResp,
      parentChildrensResp: directoryStudent.parentChildrensResp,
      assignedClassSubjectsListResp:
        classSubjectsInfo.assignedClassSubjectsListResp,
      getStudentAssessmentsListResp:
        studentAssessments.getStudentAssessmentsListResp,
      showApiLoader: globalData.showApiLoader,
      studentAssessmentsErrorResp: studentAssessments.studentAssessmentsErrorResp,
    }),
    shallowEqual
  );

  const evaluateManualRef = useRef({
    prevStudentAssessmentsListByIdErrorResp: studentAssessmentsErrorResp,
  });

  useEffect(() => {
    const { prevStudentAssessmentsListByIdErrorResp } = evaluateManualRef.current;
    if (studentAssessmentsErrorResp && prevStudentAssessmentsListByIdErrorResp !== studentAssessmentsErrorResp) {
      const { details } = studentAssessmentsErrorResp || {};
      toast.error(details || "Something went wrong");
    }
    evaluateManualRef.current.prevStudentAssessmentsListByIdErrorResp = studentAssessmentsErrorResp;
  }, [studentAssessmentsErrorResp,]);

  const { content: studentsAssessmentList, pageNumber, pageSize, totalElements, totalPages } = getStudentAssessmentsListResp || {}

  const statusCounts: any = useMemo(() => {
    if (!studentsAssessmentList?.length) return {};
    const counts = {
      allassessments: studentsAssessmentList.length,
      live: 0,
      completed: 0,
      scheduled: 0,
      missed: 0,
      draft: 0,
    };
    studentsAssessmentList.forEach((item) => {
      const status = item.assessmentStatus?.toLowerCase();
      switch (status) {
        case "live":
          counts.live += 1;
          break;
        case "completed":
          counts.completed += 1;
          break;
        case "scheduled":
          counts.scheduled += 1;
          break;
        case "missed":
          counts.missed += 1;
          break;
        default:
          counts.draft += 1;
          break;
      }
    });

    return counts || {};
  }, [getStudentAssessmentsListResp]);

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "allassessments",
      labelName: "All",
      customPadding: "0px 10px 6px 10px",
      count: statusCounts?.allassessments || 0,
    },
    {
      id: "live",
      labelName: "Live",
      customPadding: "0px 10px 6px 10px",
      count: statusCounts?.live || 0,
    },
    {
      id: "completed",
      labelName: "Completed",
      customPadding: "0px 10px 6px 10px",
      count: statusCounts?.completed || 0,
    },
    {
      id: "scheduled",
      labelName: "Scheduled",
      customPadding: "0px 10px 6px 10px",
      count: statusCounts?.scheduled || 0,
    },
    {
      id: "missed",
      labelName: "Missed",
      customPadding: "0px 10px 6px 10px",
      count: statusCounts?.missed || 0,
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const menuId = event.currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  function fetchStudentAssessmentsList(otherProps?: any) {
    const payload = {
      studentId: studentAssessmentFilters.studentId,
      academicYearId: studentAssessmentFilters.academicYearId,
      startDate: studentAssessmentFilters.startDate,
      endDate: studentAssessmentFilters.endDate,
      ...otherProps,
      ...pagination.current,
    };

    dispatch(
      getStudentAssessmentsListAct(
        generateActionPayload(
          "get_student_assessments_list",
          undefined,
          payload
        )
      )
    );
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
      pagination.current = paginationInfo
      fetchStudentAssessmentsList(paginationInfo);
    }

  const classSubjectListApicall = (otherProps?: any) => {
    const { academicYearId, classId, curriculumId } = currentStudent || {};
    const payload = {
      academicYearId: academicYearId,
      curriculumId: curriculumId,
      branchClassId: classId,
      ...otherProps,
      pageNo: 0,
      pageSize: 100,
    };
    if (academicYearId && classId && curriculumId) {
      dispatch(
        getAssignedClassSubjectsList(
          generateActionPayload(
            "get_assigned_class_subject_list",
            undefined,
            payload
          )
        )
      );
    }
  };

  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      const updatedFilters = {
        ...studentAssessmentFilters,
        startDate,
        endDate,
      };

      setStudentAssessmentFilters(updatedFilters);

      if (updatedFilters.studentId && updatedFilters.academicYearId) {
        fetchStudentAssessmentsList(updatedFilters);
      }
    }
  };

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    const updatedFilters = {
      ...studentAssessmentFilters,
      [name]: value,
    };

    setStudentAssessmentFilters(updatedFilters);
    if (updatedFilters.studentId && updatedFilters.academicYearId) {
      fetchStudentAssessmentsList(updatedFilters);
    }
  }

  useEffect(() => {
    if (academicYearListResp && parentChildrensResp && currentStudentId) {
      const yearId = academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

      const currentStudent = parentChildrensResp.find(
        (item: any) => +item.childId === +currentStudentId
      );

      if (yearId) {
        setStudentAssessmentFilters((prev: any) => ({
          ...prev,
          academicYearId: yearId,
        }));
      }

      if (currentStudent) {
        setCurrentStudent(currentStudent);

        setStudentAssessmentFilters((prev: any) => ({
          ...prev,
          studentId: currentStudent.childId,
        }));
      }

      if (yearId && currentStudent) {
        fetchStudentAssessmentsList({
          academicYearId: yearId,
          studentId: currentStudent.childId,
        });
      }
    }
  }, [academicYearListResp, parentChildrensResp, currentStudentId]);

  useEffect(() => {
    if (currentStudentId && currentStudent) {
      classSubjectListApicall();
    }
  }, [currentStudentId, currentStudent]);

const studentAssessmentsArr = useMemo(() => {
  const list = getStudentAssessmentsListResp?.content || [];
  if (!list.length) return [];

  return list.map((item: any) => {
    const subjectConfig = subjectIcons.find(
      (s) => s.subject.toLowerCase() === item.subjectName?.toLowerCase()
    );
    return {
      ...item,
      bgColor: subjectConfig?.bgColor || "#E5E7EB",
      icon: subjectConfig?.icon || <BackToSchoolSVG />,
    };
  });
}, [getStudentAssessmentsListResp]);

  const activeIdItems = useMemo(() => {
    if (activeId === "allassessments") {
      return studentAssessmentsArr;
    }

    const activeList = studentAssessmentsArr.filter(
      (item: any) => item.assessmentStatus.toLowerCase() === activeId
    );
    return activeList;
  }, [activeId, studentAssessmentsArr]);

  const clearFilters = () => {
    const updatedFilters = {
      ...studentAssessmentFilters,
      assessmentType: "",
      subjectId: "",
      startDate: "",
      endDate: "",
    };

    setStudentAssessmentFilters(updatedFilters);

    if (updatedFilters.studentId && updatedFilters.academicYearId) {
      fetchStudentAssessmentsList(updatedFilters);
    }
  };

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="LMS" title="LMS"></BreadCrumb>

          <div className="tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm">
            <div className="tw-px-5 tw-py-2 tw-border-b tw-border-gray-200">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-full lg:tw-w-1/3">
                  <h4 className="tw-text-base tw-font-semibold tw-m-0">My Assessments</h4>
                </div>
              </div>
            </div>

            <div className="tw-p-5 tw-pb-0">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-2">
                <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="tw-relative search-box">
                    <TextInput
                      name="searchString"
                      value={studentAssessmentFilters.searchString}
                      onChange={filterHandler}
                      labelText="Search"
                      floatingLabel
                      formgroupClassName="tw-mb-0"
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                  </div>
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="subjectId"
                    value={studentAssessmentFilters.subjectId}
                    onChange={filterHandler}
                    menuItems={assignedClassSubjectsListResp?.data || []}
                    valueKey="subjectId"
                    textKey="subjectName"
                    labelText="Subject"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="assessmentType"
                    value={studentAssessmentFilters.assessmentType}
                    onChange={filterHandler}
                    menuItems={assessmentTypes || []}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Assessment Type"
                    formgroupClassName="tw-mb-3"
                    inputClassName="tw-text-xs"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                  <CustomDatePicker
                    name="dateRange"
                    startDate={studentAssessmentFilters.startDate}
                    endDate={studentAssessmentFilters.endDate}
                    onChange={handleDateChange}
                    labelText="Date Range"
                    formgroupClassName="tw-mb-0"
                    portalId=""
                    floatingLabel
                    monthsShown={2}
                  />
                </div>
                <div className="tw-col-span-auto">
                  {(studentAssessmentFilters.subjectId ||
                    studentAssessmentFilters.assessmentType ||
                    (studentAssessmentFilters.startDate && studentAssessmentFilters.endDate)) && (
                      <Button
                        variant="wrong"
                        type="button"
                        onClick={clearFilters}
                      >
                        Clear Filter
                      </Button>
                    )}
                </div>
              </div>

              <div className="tw-flex tw-items-center tw-mb-3">
                <div className="tw-w-full lg:tw-w-auto">
                  <UpdatedHorizontalTab
                    MenuOptions={MenuOptions}
                    clickMenuHandler={clickMenuHandler}
                    activeTabId={activeId}
                    horizontalClass="horizontal-menu-updated-style"
                    showBadge={true}
                  />
                </div>
              </div>

              <StudentAssessmentsList
                activeIdItems={activeIdItems}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentAssessments;

const StudentAssessmentsList = ({
  activeIdItems,
  totalPages,
  totalRecords,
  callbackPaginationHndlr,
  currentPageNumber,
}) => {
  return (
    <>
      <div className="tw-grid tw-gap-5 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-mb-6">
        {activeIdItems.length > 0 ? (
          activeIdItems.map((item: any, idx) => (
            <StudentAssessmentCard
              key={item.id}
              getStudentAssessmentsListResp={item}
            />
          ))
        ) : (
          <div className="tw-flex tw-items-center tw-justify-center tw-min-h-[240px] tw-col-span-full">
            <div className="tw-flex tw-flex-col tw-justify-center tw-items-center">
              <div className="tw-mb-4">
                <RejectSvg
                  fill="#f06548"
                  width={"52px"}
                  height="52px"
                ></RejectSvg>
              </div>
              <p className="tw-mb-0 tw-text-lg tw-font-semibold">
                No Assessments found
              </p>
            </div>
          </div>
        )}
      </div>
      <div>
        <Pagination
          paginationContainerClass="mb-4"
          callbackPaginationHndlr={callbackPaginationHndlr}
          totalPages={totalPages}
          totalRecords={totalRecords || 0}
          currentPageNumber={currentPageNumber}
        />
      </div>
    </>
  );
};