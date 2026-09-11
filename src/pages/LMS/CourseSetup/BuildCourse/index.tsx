import { useState } from "react";
import { Collapse } from "reactstrap";
import { default as MathsSVG } from "../../../../assets/imagesdps/lms/maths.svg?react";

import {
  ArrowLeft02Icon,
  MinusSignIcon,
  PlusSignIcon,
  SettingDone01Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";

// import CoursePlanningSetup from "./CoursePlanningSetup";
// import CurriculumEditor from "./CoursePlanningSetup/MyCourseSetup";
// import ChartPercentage from "./ChartPercentage";
// import CurriculumPlanSummary from "./CoursePlanningSetup/MyCourseSetup/CurriculumPlanSummary";
// import CourseMeteDataModal from "./CoursePlanningSetup/MyCourseSetup/CurriculumPlanSummary/CourseMeteDataModal";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { OffCanvasContainer } from "../../../../Components/Common";
import ChartPercentage from "../../CourseManagement/AddCourseManagement/ManageCourse/ChartPercentage";
import CourseMeteDataModal from "./CourseMeteDataModal";
import { TreeNode } from "./TreeNode";
import { IFeature, ITreeContextValue } from "./TreeNode/types";
import { TreeNodeContextProvider } from "./TreeNode/helper";
import CurriculumEditor from "./CurriculumEditor";
import { useHistory } from "react-router-dom";

const curriculumData: IFeature[] = [
  {
    id: "1",
    code: "1",
    type: "Unit",
    description: "Number Systems",
    permissions: [],
    hours: 3,
    progressStatus: "completed",
    subFeatures: [
      {
        id: "1.1",
        code: "1.1",
        type: "Chapter",
        description: "Real Numbers",
        permissions: [],
        subFeatures: [
          {
            id: "1.1.1",
            code: "1.1.1",
            type: "Topic",
            description: "Euclid's Division Lemma",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "1.1.2",
            code: "1.1.2",
            type: "Topic",
            description: "Fundamental Theorem of Arithmetic",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "1.1.3",
            code: "1.1.3",
            type: "Topic",
            description: "Revisiting Irrational Numbers",
            permissions: [],
            subFeatures: [
              {
                id: "1.1.2.1",
                code: "1.1.2.1",
                type: "Session",
                description: "Fundamental Session",
                permissions: [],
                subFeatures: [],
              },
            ],
          },
          {
            id: "1.1.4",
            code: "1.1.4",
            type: "Topic",
            description: "Decimal Expansions",
            permissions: [],
            subFeatures: [
              {
                id: "1.1.2.1",
                code: "1.1.2.1",
                type: "Session",
                description: "Fundamental Session",
                permissions: [],
                subFeatures: [],
              },
              {
                id: "1.1.2.2",
                code: "1.1.2.2",
                type: "Session",
                description: "Fundamental Session 2",
                permissions: [],
                subFeatures: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "2",
    code: "2",
    type: "Unit",
    description: "Algebra",
    permissions: [],
    hours: 5,
    progressStatus: "inProgress",
    subFeatures: [
      {
        id: "2.1",
        code: "2.1",
        type: "Chapter",
        description: "Polynomials",
        permissions: [],
        subFeatures: [
          {
            id: "2.1.1",
            code: "2.1.1",
            type: "Topic",
            description: "Degree and Terms",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "2.1.2",
            code: "2.1.2",
            type: "Topic",
            description: "Zeros of Polynomials",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "2.1.3",
            code: "2.1.3",
            type: "Topic",
            description: "Relationship between Zeros & Coefficients",
            permissions: [],
            subFeatures: [],
          },
        ],
      },
      {
        id: "2.2",
        code: "2.2",
        type: "Chapter",
        description: "Pair of Linear Equations",
        permissions: [],
        subFeatures: [
          {
            id: "2.2.1",
            code: "2.2.1",
            type: "Topic",
            description: "Graphical Method",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "2.2.2",
            code: "2.2.2",
            type: "Topic",
            description: "Substitution Method",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "2.2.3",
            code: "2.2.3",
            type: "Topic",
            description: "Elimination Method",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "2.2.4",
            code: "2.2.4",
            type: "Topic",
            description: "Cross Multiplication Method",
            permissions: [],
            subFeatures: [],
          },
        ],
      },
      {
        id: "2.3",
        code: "2.3",
        type: "Chapter",
        description: "Quadratic Equations",
        permissions: [],
        subFeatures: [
          {
            id: "2.3.1",
            code: "2.3.1",
            type: "Topic",
            description: "Standard Form of Quadratic Eqn",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "2.3.2",
            code: "2.3.2",
            type: "Topic",
            description: "Factorization Method",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "2.3.3",
            code: "2.3.3",
            type: "Topic",
            description: "Completing the Square",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "2.3.4",
            code: "2.3.4",
            type: "Topic",
            description: "Quadratic Formula",
            permissions: [],
            subFeatures: [],
          },
        ],
      },
      {
        id: "2.4",
        code: "2.4",
        type: "Chapter",
        description: "Arithmetic Progressions",
        permissions: [],
        subFeatures: [
          {
            id: "2.4.1",
            code: "2.4.1",
            type: "Topic",
            description: "nth Term of AP",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "2.4.2",
            code: "2.4.2",
            type: "Topic",
            description: "Sum of First n Terms",
            permissions: [],
            subFeatures: [],
          },
        ],
      },
    ],
  },
  {
    id: "3",
    code: "3",
    type: "Unit",
    description: "Coordinate Geometry",
    permissions: [],
    hours: 7,
    progressStatus: "notCompleted",
    subFeatures: [
      {
        id: "3.1",
        code: "3.1",
        type: "Chapter",
        description: "Coordinate Geometry",
        permissions: [],
        subFeatures: [
          {
            id: "3.1.1",
            code: "3.1.1",
            type: "Topic",
            description: "Distance Formula",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "3.1.2",
            code: "3.1.2",
            type: "Topic",
            description: "Section Formula",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "3.1.3",
            code: "3.1.3",
            type: "Topic",
            description: "Area of Triangle",
            permissions: [],
            subFeatures: [],
          },
        ],
      },
    ],
  },
  {
    id: "4",
    code: "4",
    type: "Unit",
    description: "Geometry",
    permissions: [],
    hours: 9,
    progressStatus: "notCompleted",
    subFeatures: [
      {
        id: "4.1",
        code: "4.1",
        type: "Chapter",
        description: "Triangles",
        permissions: [],
        subFeatures: [
          {
            id: "4.1.1",
            code: "4.1.1",
            type: "Topic",
            description: "Similar Triangles",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "4.1.2",
            code: "4.1.2",
            type: "Topic",
            description: "Pythagoras Theorem",
            permissions: [],
            subFeatures: [],
          },
        ],
      },
      {
        id: "4.2",
        code: "4.2",
        type: "Chapter",
        description: "Circles",
        permissions: [],
        subFeatures: [
          {
            id: "4.2.1",
            code: "4.2.1",
            type: "Topic",
            description: "Tangent to a Circle",
            permissions: [],
            subFeatures: [],
          },
        ],
      },
      {
        id: "4.3",
        code: "4.3",
        type: "Chapter",
        description: "Constructions",
        permissions: [],
        subFeatures: [
          {
            id: "4.3.1",
            code: "4.3.1",
            type: "Topic",
            description: "Division of a Line Segment",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "4.3.2",
            code: "4.3.2",
            type: "Topic",
            description: "Construction of Tangents",
            permissions: [],
            subFeatures: [],
          },
        ],
      },
    ],
  },
  {
    id: "5",
    code: "5",
    type: "Unit",
    description: "Trigonometry",
    permissions: [],
    hours: 5,
    progressStatus: "notCompleted",
    subFeatures: [
      {
        id: "5.1",
        code: "5.1",
        type: "Chapter",
        description: "Introduction to Trigonometry",
        permissions: [],
        subFeatures: [
          {
            id: "5.1.1",
            code: "5.1.1",
            type: "Topic",
            description: "Trigonometric Ratios",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "5.1.2",
            code: "5.1.2",
            type: "Topic",
            description: "Trigonometric Values for Special Angles",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "5.1.3",
            code: "5.1.3",
            type: "Topic",
            description: "Complementary Angles",
            permissions: [],
            subFeatures: [],
          },
        ],
      },
      {
        id: "5.2",
        code: "5.2",
        type: "Chapter",
        description: "Trigonometric Identities",
        permissions: [],
        subFeatures: [
          {
            id: "5.2.1",
            code: "5.2.1",
            type: "Topic",
            description: "Proving Identities",
            permissions: [],
            subFeatures: [],
          },
        ],
      },
    ],
  },
  {
    id: "6",
    code: "6",
    type: "Unit",
    description: "Mensuration",
    permissions: [],
    hours: 7,
    progressStatus: "notCompleted",
    subFeatures: [
      {
        id: "6.1",
        code: "6.1",
        type: "Chapter",
        description: "Areas Related to Circles",
        permissions: [],
        subFeatures: [
          {
            id: "6.1.1",
            code: "6.1.1",
            type: "Topic",
            description: "Sector and Segment",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "6.1.2",
            code: "6.1.2",
            type: "Topic",
            description: "Area Calculations",
            permissions: [],
            subFeatures: [],
          },
        ],
      },
      {
        id: "6.2",
        code: "6.2",
        type: "Chapter",
        description: "Surface Areas and Volumes",
        permissions: [],
        subFeatures: [
          {
            id: "6.2.1",
            code: "6.2.1",
            type: "Topic",
            description: "Surface Area of Cone, Sphere, Cylinder",
            permissions: [],
            subFeatures: [],
          },
          {
            id: "6.2.2",
            code: "6.2.2",
            type: "Topic",
            description: "Volume Calculations",
            permissions: [],
            subFeatures: [],
          },
        ],
      },
    ],
  },
];

const BuildCoursePlanner = () => {
  const [isCourseOpen, setIsCourseOpen] = useState(true);
  const [expandCollapseState, setExpandCollapseState] =
    useState<ITreeContextValue>({
      action: "",
      ids: [],
    });

  const [openOffcan, setOpenOffcan] = useState(false);

  const [treeNodeData, setTreeNodeData] = useState<IFeature[]>(curriculumData);

  function expandCollapseHndlr(
    action: "COLLAPSE" | "EXPAND_ALL" | "COLLAPSE_ALL",
    ids: string[]
  ) {
    setExpandCollapseState((prevState) => ({ ...prevState, action, ids }));
  }

  function handleTreeNodeData(newData) {
    setTreeNodeData((prevData) => [...prevData, ...newData]);
  }

  function toggleOpenOffCan() {
    setOpenOffcan((prev) => !prev);
  }

  const history = useHistory();

  function moveToPlannerList() {
    history.push(`/course-directory`);
  }

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="LMS"></BreadCrumb>

          <div className="tw-flex tw-justify-end tw-mb-3">
            <button
              className="text-info tw-flex tw-items-center"
              onClick={moveToPlannerList}
            >
              <HugeiconsIcon
                icon={ArrowLeft02Icon}
                className="tw-me-2"
                size={18}
              />
              Back to Courses
            </button>
          </div>
          <div className="card tw-bg-gradient-to-r tw-from-blue-100 tw-to-purple-100">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between px-2 tw-mb-3">
                <div className="d-flex w-25 align-items-center">
                  <div className="flex-shrink-0 bg-light p-1 me-3 bg-gradient rounded shadow-lg d-flex justify-content-center align-items-center">
                    <MathsSVG
                      width={"50px"}
                      height={"50px"}
                      style={{ padding: "5px" }}
                    />
                  </div>
                  <div className="">
                    <h5 className="fs-14 d-flex text-nowrap mb-1">
                      CBSE X Maths
                    </h5>
                    <div className="text-dark fs-11 badge bg-secondary text-white fw-medium me-2 px-2 py-1 rounded-pill">
                      CB0010X
                    </div>
                  </div>
                </div>
                <div>
                  <p className="mb-0">
                    <span className="tw-me-2">Course Meta Data</span>
                    <HugeiconsIcon
                      icon={SettingDone01Icon}
                      className="tw-cursor-pointer"
                      size={18}
                      onClick={toggleOpenOffCan}
                    />
                  </p>
                </div>
              </div>
              <div className="tw-flex tw-justify-between tw-items-center">
                <div className="tw-flex tw-items-center">
                  <p className="mb-0 me-4">Curriculum Setup Status</p>
                  <ChartPercentage seriesData={75} />
                </div>
                <div className="tw-border tw-border-gray-700 tw-rounded tw-py-2 tw-px-6 tw-flex tw-gap-4">
                  <p className="mb-0">Units : 0/10</p>
                  <p className="mb-0">Chapters : 1/12</p>
                  <p className="mb-0">Topics : 4/45</p>
                  <p className="mb-0">Sessions : 6/36</p>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-1 2xl:tw-grid-cols-[298px_1fr] tw-gap-3">
            <div className="card tw-py-2 2xl:tw-h-[562px]">
              <div className="card-body  tw-h-full tw-overflow-y-auto  tw-overflow-x-hidden custom-scrollbar tw-flex tw-flex-col tw-justify-between pb-0">
                <div className="">
                  <Collapse isOpen={isCourseOpen}>
                    <TreeNodeContextProvider.Provider
                      value={{
                        value: expandCollapseState,
                        toggle: expandCollapseHndlr,
                      }}
                    >
                      {treeNodeData.map((item, idx) => (
                        <TreeNode
                          key={item.id}
                          level={1}
                          parentFeatureId=""
                          parentsInfo={[]}
                          description={item.description}
                          subFeatures={item.subFeatures}
                          type={item.type}
                          id={item.id}
                          hours={item.hours}
                          code={item.code}
                          nodeIndex={idx}
                          progressStatus={item.progressStatus}
                        />
                      ))}
                    </TreeNodeContextProvider.Provider>
                  </Collapse>
                </div>

                <div className="tw-flex tw-items-center tw-flex-col tw-background-white tw-py-2">
                  <p className="tw-mb-0 tw-text-gray-500">DCMY1001</p>
                  <p className="tw-mb-0 text-warning">Ver 1.0</p>
                </div>
              </div>
            </div>
            <div className="tw-w-full tw-overflow-hidden">
              <CurriculumEditor></CurriculumEditor>
              {/* <CurriculumPlanSummary></CurriculumPlanSummary> */}
            </div>
          </div>
        </div>
      </div>

      <OffCanvasContainer
        isOpen={openOffcan}
        headerTitle="Course Mete Data"
        closeHndlr={toggleOpenOffCan}
        id="course-mete-data"
      >
        <CourseMeteDataModal></CourseMeteDataModal>
      </OffCanvasContainer>
    </>
  );
};

export default BuildCoursePlanner;
