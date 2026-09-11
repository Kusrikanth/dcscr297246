import { useEffect } from "react";



function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: text,
            },
          ],
        },
      ],
    };
  }
};

export enum AttemptedQuestionStatus {
  NOT_ANSWERED = "NOT_ANSWERED",
  ANSWERED = "ANSWERED",
  NOT_VISITED = "NOT_VISITED",
  MARKED_FOR_REVIEW = "MARKED_FOR_REVIEW"
}

export const mapApiQuestions = (assessmentQuestions, attemptedQuestions) => {
  if (!assessmentQuestions || assessmentQuestions.length === 0) return [];
  const { assessmentQuestionAnswersDTOS } = attemptedQuestions || {},
    attemptedQuestionDics = {};
  if (Array.isArray(assessmentQuestionAnswersDTOS) && assessmentQuestionAnswersDTOS.length) {
    assessmentQuestionAnswersDTOS.forEach((question: any) => {
      if (question?.questionId) {
        attemptedQuestionDics[question?.questionId?.toString()] = { ...question };
      }
    });
  }

  return assessmentQuestions.map((q: any, index: number) => {
    const attemptedInfo = attemptedQuestionDics[q.questionId?.toString()],
      answeredStatus = attemptedInfo?.answerStatus;
    return ({
      questionId: q.questionId,
      questionOrder: q.questionOrder,
      questionStatus: AttemptedQuestionStatus[answeredStatus] || AttemptedQuestionStatus.NOT_VISITED,
      question: safeJsonParse(q.questionDescription),
      correctOption: q.questionBankOptionDTOS.find(opt => opt.isCorrectAnswer)?.order.toString() || null,
      answeredOption: attemptedInfo?.selectedOption ?? undefined,
      selectedOption: attemptedInfo?.selectedOption ?? undefined,
      points: q.marks,
      options: q.questionBankOptionDTOS.map((opt) => ({
        optionId: opt.optionId,
        optionValue: safeJsonParse(opt.optionText),
      })),
    })
  });
};

export const questions = [
  {
    questionId: 1,
    questionStatus: "active",
    question: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Solve for",
            },
            {
              type: "inlineMath",
              attrs: {
                latex: "\\space x^{\\space}\\space:\\space2x^2-5x^{}-3=0",
                evaluate: "no",
                display: "no",
              },
            },
          ],
        },
      ],
    },
    correctOption: "A",
    answeredOption: null,
    points: 1,
    options: [
      {
        optionId: "A",
        optionValue: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "inlineMath",
                  attrs: {
                    latex: "x = 3, x = -\\frac12",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        optionId: "B",
        optionValue: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "inlineMath",
                  attrs: {
                    latex: "x = -3, x = \\frac12",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        optionId: "C",
        optionValue: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "inlineMath",
                  attrs: {
                    latex: "x = \\frac32, x = -1",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        optionId: "D",
        optionValue: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "inlineMath",
                  attrs: {
                    latex: "x = 2, x = -\\frac32",
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
];

export function useDisableBackButton(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      alert("Back button is disabled during the assessment.");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled]);
}
