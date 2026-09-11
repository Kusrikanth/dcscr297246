import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Accordion,
} from "reactstrap";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Tick01Icon } from "@hugeicons-pro/core-stroke-standard";
import ResultQuestionsNav from "../ResultQuestionsNav";
import { useRef, useState } from "react";


const questions = [
  {
    questionNo: 1,
    id: "qut-16",
    questionId: "QUT83915421",
    text: "What is the value of 5³?",
    type: "Multiple Choice",
    icon: "bi bi-check2-circle",
    status: "Correct",
    isCorrect: true,
    pointsEarned: 1,
    pointsTotal: 1,
    chosenOptionId: 3,
    correctOptionId: 3,
    options: [
      { id: 1, text: "15", optionTextId: "a" },
      { id: 2, text: "25", optionTextId: "b" },
      { id: 3, text: "125", optionTextId: "c" },
      { id: 4, text: "100", optionTextId: "d" },
    ],
    solution: "5³ = 5 × 5 × 5 = 125",
  },
  {
    questionNo: 2,
    id: "qut-17",
    questionId: "QUT82935412",
    text: "Solve: 4x - 5 = 11",
    type: "Fill in the Blanks",
    icon: "bi bi-pencil",
    status: "Incorrect",
    isCorrect: false,
    pointsEarned: 0,
    pointsTotal: 1,
    chosenOptionId: 2,
    correctOptionId: 3,
    options: [
      { id: 1, text: "2", optionTextId: "a" },
      { id: 2, text: "3", optionTextId: "b" },
      { id: 3, text: "4", optionTextId: "c" },
      { id: 4, text: "5", optionTextId: "d" },
    ],
    solution: "4x - 5 = 11 ⇒ 4x = 16 ⇒ x = 4",
  },
  {
    questionNo: 3,
    id: "qut-18",
    questionId: "QUT72581934",
    text: "What is the area of a rectangle with length 8 cm and width 3 cm?",
    type: "Short Answer",
    icon: "bi bi-pencil-square",
    status: "Correct",
    isCorrect: true,
    pointsEarned: 1,
    pointsTotal: 1,
    chosenOptionId: 4,
    correctOptionId: 4,
    options: [
      { id: 1, text: "11 cm²", optionTextId: "a" },
      { id: 2, text: "20 cm²", optionTextId: "b" },
      { id: 3, text: "22 cm²", optionTextId: "c" },
      { id: 4, text: "24 cm²", optionTextId: "d" },
    ],
    solution: "Area = length × width = 8 × 3 = 24 cm²",
  },
  {
    questionNo: 4,
    id: "qut-19",
    questionId: "QUT61395287",
    text: "Which of the following is a linear equation?",
    type: "Multiple Choice",
    icon: "bi bi-check2-circle",
    status: "NotAnswered",
    isCorrect: false,
    pointsEarned: 1,
    pointsTotal: 1,
    chosenOptionId: null,
    correctOptionId: 1,
    options: [
      { id: 1, text: "2x + 3 = 7", optionTextId: "a" },
      { id: 2, text: "x² + 1 = 5", optionTextId: "b" },
      { id: 3, text: "x³ = 9", optionTextId: "c" },
      { id: 4, text: "√x = 3", optionTextId: "d" },
    ],
    solution:
      "A linear equation is in the form ax + b = c. So, 2x + 3 = 7 is linear.",
  },
  {
    questionNo: 5,
    id: "qut-20",
    questionId: "QUT72843169",
    text: "True or False: π is a rational number.",
    type: "True/False",
    icon: "bi bi-toggle-off",
    status: "Correct",
    isCorrect: true,
    pointsEarned: 1,
    pointsTotal: 1,
    chosenOptionId: 1,
    correctOptionId: 1,
    options: [
      { id: 1, text: "False", optionTextId: "a" },
      { id: 2, text: "True", optionTextId: "b" },
    ],
    solution:
      "π is irrational, meaning it cannot be expressed as a ratio of two integers.",
  },
  {
    questionNo: 6,
    id: "qut-21",
    questionId: "QUT86543921",
    text: "What is the cube root of 64?",
    type: "Multiple Choice",
    icon: "bi bi-check2-circle",
    status: "Incorrect",
    isCorrect: false,
    pointsEarned: 0,
    pointsTotal: 1,
    chosenOptionId: 2,
    correctOptionId: 1,
    options: [
      { id: 1, text: "4", optionTextId: "a" },
      { id: 2, text: "5", optionTextId: "b" },
      { id: 3, text: "6", optionTextId: "c" },
      { id: 4, text: "8", optionTextId: "d" },
    ],
    solution: "4³ = 64, so the cube root of 64 is 4.",
  },
  {
    questionNo: 7,
    id: "qut-22",
    questionId: "QUT71649285",
    text: "If the perimeter of a square is 36 cm, what is the length of one side?",
    type: "Short Answer",
    icon: "bi bi-pencil-square",
    status: "NotAnswered",
    isCorrect: false,
    pointsEarned: 1,
    pointsTotal: 1,
    chosenOptionId: null,
    correctOptionId: 3,
    options: [
      { id: 1, text: "5 cm", optionTextId: "a" },
      { id: 2, text: "7 cm", optionTextId: "b" },
      { id: 3, text: "9 cm", optionTextId: "c" },
      { id: 4, text: "12 cm", optionTextId: "d" },
    ],
    solution: "Perimeter = 4 × side ⇒ 36 = 4 × side ⇒ side = 9 cm",
  },
  {
    questionNo: 8,
    id: "qut-23",
    questionId: "QUT82914357",
    text: "Which number is both a square and a cube?",
    type: "Multiple Choice",
    icon: "bi bi-check2-circle",
    status: "Correct",
    isCorrect: true,
    pointsEarned: 1,
    pointsTotal: 1,
    chosenOptionId: 4,
    correctOptionId: 4,
    options: [
      { id: 1, text: "16", optionTextId: "a" },
      { id: 2, text: "9", optionTextId: "b" },
      { id: 3, text: "64", optionTextId: "c" },
      { id: 4, text: "1", optionTextId: "d" },
    ],
    solution: "1² = 1 and 1³ = 1, so it is both square and cube.",
  },
  {
    questionNo: 9,
    id: "qut-24",
    questionId: "QUT90837461",
    text: "Solve for x: x/4 = 3",
    type: "Fill in the Blanks",
    icon: "bi bi-pencil",
    status: "Correct",
    isCorrect: true,
    pointsEarned: 1,
    pointsTotal: 1,
    chosenOptionId: 2,
    correctOptionId: 2,
    options: [
      { id: 1, text: "10", optionTextId: "a" },
      { id: 2, text: "12", optionTextId: "b" },
      { id: 3, text: "16", optionTextId: "c" },
      { id: 4, text: "8", optionTextId: "d" },
    ],
    solution: "x = 3 × 4 = 12",
  },
  {
    questionNo: 10,
    id: "qut-25",
    questionId: "QUT73912845",
    text: "True or False: Every parallelogram is a rectangle.",
    type: "True/False",
    icon: "bi bi-toggle-off",
    status: "Incorrect",
    isCorrect: false,
    pointsEarned: 0,
    pointsTotal: 1,
    chosenOptionId: 2,
    correctOptionId: 1,
    options: [
      { id: 1, text: "False", optionTextId: "a" },
      { id: 2, text: "True", optionTextId: "b" },
    ],
    solution:
      "Every rectangle is a parallelogram, but not all parallelograms are rectangles.",
  },
  {
    questionNo: 11,
    id: "qut-26",
    questionId: "QUT68192547",
    text: "What is the HCF of 36 and 60?",
    type: "Multiple Choice",
    icon: "bi bi-check2-circle",
    status: "Correct",
    isCorrect: true,
    pointsEarned: 1,
    pointsTotal: 1,
    chosenOptionId: 3,
    correctOptionId: 3,
    options: [
      { id: 1, text: "6", optionTextId: "a" },
      { id: 2, text: "12", optionTextId: "b" },
      { id: 3, text: "18", optionTextId: "c" },
      { id: 4, text: "24", optionTextId: "d" },
    ],
    solution: "HCF of 36 and 60 is 12",
  },
  {
    questionNo: 12,
    id: "qut-27",
    questionId: "QUT67192438",
    text: "What is 25% of 80?",
    type: "Short Answer",
    icon: "bi bi-pencil-square",
    status: "Correct",
    isCorrect: true,
    pointsEarned: 1,
    pointsTotal: 1,
    chosenOptionId: 1,
    correctOptionId: 1,
    options: [
      { id: 1, text: "20", optionTextId: "a" },
      { id: 2, text: "15", optionTextId: "b" },
      { id: 3, text: "25", optionTextId: "c" },
      { id: 4, text: "18", optionTextId: "d" },
    ],
    solution: "25% of 80 = (25/100) × 80 = 20",
  },
  {
    questionNo: 13,
    id: "qut-28",
    questionId: "QUT79821564",
    text: "Simplify: (3x + 4x)",
    type: "Fill in the Blanks",
    icon: "bi bi-pencil",
    status: "Correct",
    isCorrect: true,
    pointsEarned: 1,
    pointsTotal: 1,
    chosenOptionId: 2,
    correctOptionId: 2,
    options: [
      { id: 1, text: "6x", optionTextId: "a" },
      { id: 2, text: "7x", optionTextId: "b" },
      { id: 3, text: "8x", optionTextId: "c" },
      { id: 4, text: "5x", optionTextId: "d" },
    ],
    solution: "3x + 4x = 7x",
  },
  {
    questionNo: 14,
    id: "qut-29",
    questionId: "QUT85172694",
    text: "Which of the following is a prime number?",
    type: "Multiple Choice",
    icon: "bi bi-check2-circle",
    status: "Correct",
    isCorrect: true,
    pointsEarned: 1,
    pointsTotal: 1,
    chosenOptionId: 2,
    correctOptionId: 2,
    options: [
      { id: 1, text: "9", optionTextId: "a" },
      { id: 2, text: "13", optionTextId: "b" },
      { id: 3, text: "21", optionTextId: "c" },
      { id: 4, text: "15", optionTextId: "d" },
    ],
    solution: "13 is a prime number.",
  },
  {
    questionNo: 15,
    id: "qut-30",
    questionId: "QUT71528396",
    text: "True or False: A rhombus has all sides equal.",
    type: "True/False",
    icon: "bi bi-toggle-on",
    status: "Correct",
    isCorrect: true,
    pointsEarned: 1,
    pointsTotal: 1,
    chosenOptionId: 2,
    correctOptionId: 2,
    options: [
      { id: 1, text: "False", optionTextId: "a" },
      { id: 2, text: "True", optionTextId: "b" },
    ],
    solution: "Yes, a rhombus has all sides equal.",
  },
];

const SolutionAnalysis = () => {
  const [openQuestionId, setOpenQuestionId] = useState<string>(
    questions[0]?.id
  );
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleAccordion = (id: string) => {
    setOpenQuestionId((prev) => (prev === id ? "" : id));
  };

  const scrollToQuestion = (id: string) => {
    setOpenQuestionId(id);
    questionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="row w-100 mx-auto px-0 ">
      <div className="col-12 col-lg-8 ps-0">
        <div className="assessmenet-result">
          <div className="bg-white rounded shadow card">
            <div className="card-body">
              <div className="">
                <Accordion
                  open={openQuestionId}
                  toggle={toggleAccordion}
                  stayOpen
                >
                  {questions.map((q, index) => (
                    <AccordionItem key={q.id}>
                      <AccordionHeader targetId={q.id}>
                        <div
                          className="d-flex justify-content-between align-items-center w-100 pe-4"
                          ref={(ele) => (questionRefs.current[q.id] = ele)}
                        >
                          <div>
                            <p className="mb-0 fs-12">
                              Questions :{` ${index + 1} / ${questions.length}`}
                            </p>
                          </div>
                        </div>
                      </AccordionHeader>
                      <AccordionBody accordionId={q.id} className="p-0">
                        <div className="row w-100 mx-auto p-2 pb-0 d-flex align-items-center justify-content-between">
                          <div className="col-12 col-xl-6">
                            <div className="d-flex">
                              <p className="mb-0 text-muted fs-12">
                                {q.questionId}
                              </p>
                            </div>
                          </div>
                          <div className="col-12 col-xl-auto">
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <p className="mb-0 fs-12">
                                  <span className="text-muted me-2">
                                    Chosen Option :
                                  </span>
                                  <span className="fw-semibold">
                                    {q.chosenOptionId}
                                  </span>
                                </p>
                              </div>
                              <div className="d-flex align-items-center">
                                <p className="mb-0 fs-12 me-2">
                                  <span className="text-muted me-2">
                                    Points :
                                  </span>
                                  <span className="fw-semibold">
                                    {q.pointsEarned} / {q.pointsTotal}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rounded p-3">
                          <p className="mb-2">
                            <strong>Q{index + 1}.</strong> {q.text}
                          </p>
                          <div className="mb-3 row w-100 mx-auto d-flex gy-2">
                            {q.options.map((option) => {
                              const isSelected = option.id === q.chosenOptionId;
                              const isCorrect = option.id === q.correctOptionId;

                              const borderClass = isSelected
                                ? isCorrect
                                  ? "correct-opt"
                                  : "wrong-opt"
                                : isCorrect && q.status === "Incorrect"
                                ? "correct-opt"
                                : "no-selected-opt";

                              return (
                                <div
                                  className={`col-12 rounded p-2 fs-12 d-flex align-items-center mb-2 ${
                                    borderClass === "correct-opt"
                                      ? "tw-bg-[rgba(10,179,156,0.15)] border-success border-2"
                                      : borderClass === "wrong-opt"
                                      ? "tw-bg-[rgba(240,101,72,0.15)] border-danger border-2"
                                      : "border-2"
                                  }`}
                                  key={option.id}
                                >
                                  <span
                                    className={`tw-rounded-full tw-me-2 tw-p-1 tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center ${
                                      borderClass === "correct-opt"
                                        ? "bg-success text-white"
                                        : borderClass === "wrong-opt"
                                        ? "bg-danger text-white"
                                        : "border"
                                    }`}
                                  >
                                    {option.optionTextId.toUpperCase()}
                                  </span>
                                  <span>{option.text}</span>
                                  {(borderClass === "correct-opt" ||
                                    borderClass === "wrong-opt") && (
                                    <span
                                      className={`tw-w-6 tw-h-6 tw-rounded-full tw-bg-green-500 tw-ms-auto tw-me-3 tw-flex tw-items-center tw-justify-center ${
                                        borderClass === "correct-opt"
                                          ? "bg-success text-white"
                                          : borderClass === "wrong-opt"
                                          ? "bg-danger text-white"
                                          : "border"
                                      }`}
                                    >
                                      <HugeiconsIcon
                                        icon={
                                          borderClass === "correct-opt"
                                            ? Tick01Icon
                                            : Cancel01Icon
                                        }
                                        className=""
                                        size={14}
                                      />
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="fs-12 tw-bg-[#fef7d7] p-2 rounded tw-border-[1.6px] tw-border-dashed">
                            <p className="fw-semibold mb-1">Solution:</p>
                            <p className="mb-0">{q.solution}</p>
                          </div>
                        </div>
                      </AccordionBody>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-4 pe-0">
        <ResultQuestionsNav
          questions={questions}
          scrollToQuestion={scrollToQuestion}
        ></ResultQuestionsNav>
      </div>
    </div>
  );
};

export default SolutionAnalysis;
