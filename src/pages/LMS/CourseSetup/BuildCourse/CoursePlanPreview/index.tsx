import { Cancel01Icon, Tick01Icon } from "@hugeicons-pro/core-solid-standard";
import { HugeiconsIcon } from "@hugeicons/react";

import SubmitFeedbackModal from "./SubmitFeedbackModal";
import { Progress } from "reactstrap";
import { Download04Icon } from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../../hooks/modalhook";
import { ModalContainerUpdated } from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";

const curriculumData = [
  {
    unitTitle: "Quadratic Equitations",
    borderColor: "tw-border-blue-300",
    bgColor: "tw-bg-blue-100",
    progressPercentage: 100,
    chapters: [
      {
        chapterTitle: "Introduction to Quadratics",
        progressPercentage: 100,
        topics: [
          {
            title: "Nature of Roots",
            LOs: "2",
            bloom: "Instand",
            weeks: "W1–W2",
          },
          {
            title: "Solving by Factorization",
            LOs: "3 AApply",
            weeks: "W3.3",
          },
        ],
      },
    ],
  },
  {
    unitTitle: "Applications",
    borderColor: "tw-border-green-300",
    bgColor: "tw-bg-green-100",
    progressPercentage: 50,
    chapters: [
      {
        chapterTitle: "Algebraic Expressions",
        progressPercentage: 50,
        topics: [
          {
            title: "Factor Theorem",
            LOs: "",
            bloom: "Bloom Understand",
            weeks: "W5–W6",
          },
          {
            title: "Remainder Theorem",
            LOs: "1 Apply",
            weeks: "W7",
          },
        ],
      },
    ],
  },
  {
    unitTitle: "Applications",
    borderColor: "tw-border-orange-300",
    bgColor: "tw-bg-orange-100",
    progressPercentage: 100,
    chapters: [
      {
        chapterTitle: "Word Problems",
        progressPercentage: 100,
        topics: [
          {
            title: "Word Problems",
            LOs: "z Analyze",
            weeks: "W4",
          },
        ],
      },
    ],
  },
  {
    unitTitle: "Functions and Graphs",
    borderColor: "tw-border-purple-300",
    bgColor: "tw-bg-purple-100",
    progressPercentage: 70,
    chapters: [
      {
        chapterTitle: "Linear Functions",
        progressPercentage: 80,
        topics: [
          {
            title: "Slope and Intercepts",
            LOs: "2 Understand",
            weeks: "W1–W2",
          },
          {
            title: "Graphing Linear Equations",
            LOs: "3 Apply",
            weeks: "W3",
          },
        ],
      },
      {
        chapterTitle: "Quadratic Functions",
        progressPercentage: 60,
        topics: [
          {
            title: "Vertex Form",
            LOs: "1 Analyze",
            weeks: "W4–W5",
          },
        ],
      },
    ],
  },
  {
    unitTitle: "Statistics and Probability",
    borderColor: "tw-border-pink-300",
    bgColor: "tw-bg-pink-100",
    progressPercentage: 30,
    chapters: [
      {
        chapterTitle: "Descriptive Statistics",
        progressPercentage: 40,
        topics: [
          {
            title: "Mean, Median, Mode",
            LOs: "2 Remember",
            weeks: "W1",
          },
          {
            title: "Standard Deviation",
            LOs: "1 Understand",
            weeks: "W2–W3",
          },
        ],
      },
      {
        chapterTitle: "Probability",
        progressPercentage: 20,
        topics: [
          {
            title: "Basic Probability Rules",
            LOs: "2 Apply",
            weeks: "W4",
          },
        ],
      },
    ],
  },
];

function CurriculumPlanCards() {
  return (
    <div className="tw-space-y-4">
      {curriculumData.map((unit, idx) => (
        <div
          key={idx}
          className={`tw-rounded tw-border tw-shadow tw-mb-4 tw-overflow-hidden ${unit.borderColor}`}
        >
          <div className={`tw-px-4 tw-py-3 ${unit.bgColor}`}>
            <div className="tw-font-semibold tw-text-lg tw-mb-0 tw-flex tw-items-center tw-justify-between">
              <div>
                {`Unit ${idx + 1}: `}
                {unit.unitTitle}
              </div>
              {/* <span>{unit?.progressPercentage}</span> */}
              <div className="tw-w-[128px] tw-flex tw-items-center">
                <Progress
                  value={unit?.progressPercentage}
                  className={`tw-me-2 tw-flex-1`}
                  color={
                    unit?.progressPercentage < 50
                      ? "danger"
                      : unit?.progressPercentage < 75
                      ? "warning"
                      : "success"
                  }
                />
                <span className="tw-text-xs">{`${unit?.progressPercentage}%`}</span>
              </div>
            </div>
          </div>
          <div className="tw-px-4 tw-py-3">
            {unit.chapters.map((chapter, cIdx) => (
              <div key={cIdx} className="ml-4">
                <div className="tw-font-medium tw-mb-2 tw-text-base tw-flex tw-items-center">
                  <div className="tw-me-2">
                    <span className="tw-me-2 tw-font-semibold">{`Chapter ${
                      cIdx + 1
                    }:`}</span>
                    {chapter.chapterTitle}
                  </div>
                  <span
                    className={`
                      tw-flex tw-items-center tw-justify-center tw-border tw-rounded-lg tw-text-xs tw-px-3 tw-py-0.5
                      ${
                        unit?.progressPercentage < 50
                          ? "tw-bg-red-100 tw-text-red-700 tw-border-red-300"
                          : unit?.progressPercentage < 75
                          ? "tw-bg-yellow-100 tw-text-yellow-700 tw-border-yellow-300"
                          : "tw-bg-green-100 tw-text-green-700 tw-border-green-300"
                      }
                    `}
                  >{`${unit?.progressPercentage}%`}</span>
                </div>
                <ul className="tw-list-disc tw-list-inside tw-ml-4">
                  {chapter.topics.map((topic, tIdx) => (
                    <li key={tIdx} className="tw-text-sm tw-mt-1">
                      <span className="tw-font-semibold">{topic.title}</span>{" "}
                      {topic.LOs && `| LOs: ${topic.LOs}`}{" "}
                      {topic.bloom && `| Bloom: ${topic.bloom}`}{" "}
                      {topic.weeks && `| Weeks: ${topic.weeks}`}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const CoursePlanPreview = () => {
  const {
    openModal: submitFeedbackOpenModal,
    closeModal: submitFeedbackCloseModal,
    modalState: submitFeedbackModalState,
  } = useModal();

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="LMS"></BreadCrumb>

          <div className="card">
            <div className="card-header tw-flex tw-items-center tw-justify-between">
              <div>
                <h4 className="card-title mb-0 tw-text-base">
                  Curriculum Plan Sumamry
                </h4>
                <p className="tw-mb-0">CSBE Class X - Mathematics</p>
              </div>
              <p className="tw-mb-0">
                <span className="tw-text-gray-500 tw-me-2">Status :</span>
                <span className="tw-mb-0 tw-text-orange-600">
                  Pending Approval
                </span>
              </p>
            </div>
            <div className="card-body">
              <CurriculumPlanCards></CurriculumPlanCards>
              <div className="tw-mt-12 tw-flex tw-gap-3 tw-justify-center">
                <button className="btn btn-outline-secondary" type="button">
                  <HugeiconsIcon icon={Download04Icon} className="me-2" />
                  Download
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => submitFeedbackOpenModal("reject-curriculum")}
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    className="me-2"
                  ></HugeiconsIcon>
                  Reject Curriculum
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={() => submitFeedbackOpenModal("approve-curriculum")}
                >
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    className="me-2"
                  ></HugeiconsIcon>
                  Approve Curriculum
                </button>
              </div>
            </div>
          </div>
          <ModalContainerUpdated
            id="submit-feedback-modal-container"
            isOpen={submitFeedbackModalState.showModal}
            toggle={submitFeedbackCloseModal}
            modalTitle={
              submitFeedbackModalState.modalData === "reject-curriculum"
                ? "Are you sure do you want to Reject Curriculum"
                : "Approve Curriculum"
            }
            modalSize="md"
          >
            <SubmitFeedbackModal></SubmitFeedbackModal>
          </ModalContainerUpdated>
        </div>
      </div>
    </>
  );
};

export default CoursePlanPreview;
