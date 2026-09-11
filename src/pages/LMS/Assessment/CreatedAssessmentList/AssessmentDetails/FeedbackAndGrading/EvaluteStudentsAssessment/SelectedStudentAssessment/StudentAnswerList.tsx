import { useState } from "react";

import classnames from "classnames";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CancelCircleIcon,
  MinusSignIcon,
  Tick01Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { TextInput } from "../../../../../../../../Components/Common";

const optionStyles = {
  correctOption: "tw-border-[#86EFAC] tw-bg-[#DCFCE7] tw-font-semibold",
  wrongOptions: "tw-border-[#E5E7EB] tw-text-gray-500",
};

const studentAnswers = [
  {
    className: "10th",
    questionId: "q1",
    questionNo: "1",
    questionTypeId: "mcq",
    questionType: "Multiple Choice",
    question:
      "Which planet is often referred to as the 'Red Planet' due to its reddish appearance caused by iron oxide on its surface?",
    questionPoints: "5",
    givenMarks: "",
    options: [
      {
        id: "opt1",
        optionValue: "Earth",
        choosenOption: "",
        correctOption: false,
      },
      {
        id: "opt2",
        optionValue: "Mars",
        choosenOption: "",
        correctOption: true,
      },
      {
        id: "opt3",
        optionValue: "Venus",
        choosenOption: "",
        correctOption: false,
      },
      {
        id: "opt4",
        optionValue: "Jupiter",
        choosenOption: "",
        correctOption: false,
      },
    ],
  },
  {
    className: "10th",
    questionId: "q2",
    questionNo: "2",
    questionTypeId: "short",
    questionType: "Short Answer",
    question:
      "Explain in brief who William Shakespeare was and his contribution to English literature.",
    questionPoints: "5",
    givenMarks: "",
    answer:
      "William Shakespeare was an English playwright and poet widely regarded as the greatest writer in the English language. He authored iconic plays such as 'Romeo and Juliet', 'Hamlet', and 'Macbeth', significantly influencing English drama and poetry.",
    options: [],
  },
  {
    className: "10th",
    questionId: "q3",
    questionNo: "3",
    questionTypeId: "mcq",
    questionType: "Multiple Choice",
    question:
      "What is the official capital city of Australia, chosen to resolve rivalry between Sydney and Melbourne?",
    questionPoints: "5",
    givenMarks: "",
    options: [
      {
        id: "opt1",
        optionValue: "Sydney",
        choosenOption: "",
        correctOption: false,
      },
      {
        id: "opt2",
        optionValue: "Canberra",
        choosenOption: "",
        correctOption: true,
      },
      {
        id: "opt3",
        optionValue: "Melbourne",
        choosenOption: "",
        correctOption: false,
      },
      {
        id: "opt4",
        optionValue: "Brisbane",
        choosenOption: "",
        correctOption: false,
      },
    ],
  },
  {
    className: "10th",
    questionId: "q4",
    questionNo: "4",
    questionTypeId: "short",
    questionType: "Short Answer",
    question:
      "Calculate and explain the square root of 64 and its significance in mathematics.",
    questionPoints: "3",
    givenMarks: "",
    answer:
      "The square root of 64 is 8, because 8 multiplied by itself gives 64. Square roots are important in solving quadratic equations and are fundamental in geometry and algebra.",
    options: [],
  },
  {
    className: "10th",
    questionId: "q5",
    questionNo: "5",
    questionTypeId: "mcq",
    questionType: "Multiple Choice",
    question:
      "Which gas is primarily absorbed by plants from the atmosphere for the process of photosynthesis?",
    questionPoints: "5",
    givenMarks: "",
    options: [
      {
        id: "opt1",
        optionValue: "Oxygen",
        choosenOption: "",
        correctOption: false,
      },
      {
        id: "opt2",
        optionValue: "Carbon Dioxide",
        choosenOption: "",
        correctOption: true,
      },
      {
        id: "opt3",
        optionValue: "Nitrogen",
        choosenOption: "",
        correctOption: false,
      },
      {
        id: "opt4",
        optionValue: "Hydrogen",
        choosenOption: "",
        correctOption: false,
      },
    ],
  },
  {
    className: "10th",
    questionId: "q6",
    questionNo: "6",
    questionTypeId: "short",
    questionType: "Short Answer",
    question:
      "Describe the chemical formula of water and explain the meaning of each component.",
    questionPoints: "2",
    givenMarks: "",
    answer:
      "The chemical formula of water is H₂O, which indicates that each water molecule is composed of two hydrogen atoms bonded to one oxygen atom. This composition gives water its unique physical and chemical properties.",
    options: [],
  },
  {
    className: "10th",
    questionId: "q7",
    questionNo: "7",
    questionTypeId: "mcq",
    questionType: "Multiple Choice",
    question:
      "Which of the following is considered the largest mammal currently living on Earth?",
    questionPoints: "4",
    givenMarks: "",
    options: [
      {
        id: "opt1",
        optionValue: "Elephant",
        choosenOption: "",
        correctOption: false,
      },
      {
        id: "opt2",
        optionValue: "Blue Whale",
        choosenOption: "",
        correctOption: true,
      },
      {
        id: "opt3",
        optionValue: "Hippopotamus",
        choosenOption: "",
        correctOption: false,
      },
      {
        id: "opt4",
        optionValue: "Giraffe",
        choosenOption: "",
        correctOption: false,
      },
    ],
  },
  {
    className: "10th",
    questionId: "q8",
    questionNo: "8",
    questionTypeId: "short",
    questionType: "Short Answer",
    question:
      "Name the continent in which the Amazon Rainforest is located and describe its ecological importance.",
    questionPoints: "4",
    givenMarks: "",
    answer:
      "The Amazon Rainforest is located in South America. It plays a critical role in regulating the Earth’s oxygen and carbon cycles and is home to millions of species, making it a key area for biodiversity.",
    options: [],
  },
  {
    className: "10th",
    questionId: "q9",
    questionNo: "9",
    questionTypeId: "mcq",
    questionType: "Multiple Choice",
    question:
      "Which device is specifically used to measure temperature accurately in both clinical and laboratory settings?",
    questionPoints: "3",
    givenMarks: "",
    options: [
      {
        id: "opt1",
        optionValue: "Thermometer",
        choosenOption: "",
        correctOption: true,
      },
      {
        id: "opt2",
        optionValue: "Barometer",
        choosenOption: "",
        correctOption: false,
      },
      {
        id: "opt3",
        optionValue: "Hygrometer",
        choosenOption: "",
        correctOption: false,
      },
      {
        id: "opt4",
        optionValue: "Anemometer",
        choosenOption: "",
        correctOption: false,
      },
    ],
  },
  {
    className: "10th",
    questionId: "q10",
    questionNo: "10",
    questionTypeId: "short",
    questionType: "Short Answer",
    question:
      "State the freezing point of water in Celsius and explain why this point is significant in physical sciences.",
    questionPoints: "2",
    givenMarks: "",
    answer:
      "Water freezes at 0°C. This is a standard reference point in temperature measurement and is critical in understanding phase changes and thermodynamic principles.",
    options: [],
  },
];

const StudentAnswerItem = ({ questionItem, markNow }) => {
  const [marks, setMarks] = useState("");
  const {
    questionId,
    questionNo,
    questionType,
    question,
    questionPoints,
    givenMarks,
    options,
    questionTypeId,
    answer,
  } = questionItem;

  return (
    <div className="card shadow-none border mb-2">
      <div className="card-body">
        <div className="tw-flex tw-gap-x-3 tw-items-center tw-mb-3">
          <div className="tw-text-[#405189] tw-bg-[#E8EDFE] tw-font-medium tw-px-2 tw-py-1 tw-text-base tw-rounded tw-flex tw-items-center tw-justify-center">
            {`Question ${questionNo}`}
          </div>
          <div className="tw-text-[#4B5563] tw-bg-[#F3F4F6] tw-px-2 tw-py-1 tw-rounded tw-flex tw-items-center tw-justify-center tw-font-medium">
            {questionType}
          </div>
        </div>
        <div className="tw-flex tw-items-end tw-justify-between tw-gap-x-12 tw-mb-3">
          <p className="tw-mb-0 tw-font-semibold tw-text-lg">{question}</p>
          <div className="tw-shrink-0 tw-flex tw-items-center tw-gap-x-2">
            <div>
              {markNow ? (
                <TextInput
                  name={`question-marks-${questionId}`}
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  formgroupClassName="mb-0 tw-w-[62px]"
                  inputClassName="px-2 fs-16"
                ></TextInput>
              ) : (
                <span>0</span>
              )}
            </div>
            <div className="tw-flex tw-items-center tw-text-gray-500 tw-font-semibold">
              <span className="tw-me-1 tw-text-xl">/</span>
              <span>{questionPoints} Marks</span>
            </div>
          </div>
        </div>
        <div className="tw-mb-4">
          {questionTypeId === "short" ? (
            <div className="tw-border tw-rounded tw-p-3 tw-h-[72px] tw-overflow-y-scroll">
              {answer}
            </div>
          ) : (
            <div className="tw-grid tw-gap-y-3">
              {options.map((option, idx) => (
                <div
                  className={classnames(
                    `tw-border tw-rounded tw-px-3.5 tw-py-2.5 tw-font-semibold ${
                      option.correctOption
                        ? "tw-border-[#86EFAC] tw-bg-[#DCFCE7]"
                        : "tw-border-[#E5E7EB] tw-text-gray-500"
                    }`
                  )}
                  key={option.id}
                >
                  <span className="tw-me-2">{`${String.fromCharCode(
                    65 + idx
                  )})`}</span>
                  {option.optionValue}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="tw-flex tw-gap-x-3">
          <button className="tw-flex tw-items-center tw-justify-center tw-text-base tw-px-3 tw-py-1 tw-rounded tw-text-[#16A34A] tw-bg-[#DCFCE7]">
            <HugeiconsIcon icon={Tick01Icon} className="tw-me-2" size={18} />{" "}
            Correct
          </button>
          <button className="tw-flex tw-items-center tw-justify-center tw-text-base tw-px-3 tw-py-1 tw-rounded tw-text-[#A61B1B] tw-bg-[#FEE2E2]">
            <HugeiconsIcon icon={Cancel01Icon} className="tw-me-2" size={16} />{" "}
            Incorrect
          </button>
          <button className="tw-flex tw-items-center tw-justify-center tw-text-base tw-px-3 tw-py-1 tw-rounded tw-text-[#954D0E] tw-bg-[#FEF9C3]">
            <HugeiconsIcon icon={MinusSignIcon} className="tw-me-2" size={18} />{" "}
            Partial
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentAnswerList = ({ markNow }) => {
  return (
    <div>
      {studentAnswers.map((item) => (
        <StudentAnswerItem
          key={item.questionId}
          questionItem={item}
          markNow={markNow}
        ></StudentAnswerItem>
      ))}
    </div>
  );
};

export default StudentAnswerList;
