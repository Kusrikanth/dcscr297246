import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  MinusSignIcon,
  Tick01Icon,
} from "@hugeicons-pro/core-stroke-standard";
import UpdatedHorizontalTab from "../../../../../../../../Components/Common/UpdatedHorizontalTab";
interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  count?: number;
  badgeClass?:string;
}

function QuestionList({ filteredQuestions, scrollToQuestion }) {
  return (
    <div className="tw-grid tw-gap-4 tw-w-full tw-mx-auto tw-w-[80%] [grid-template-columns:repeat(auto-fit,32px)] tw-justify-start">
      {filteredQuestions.map((qut, idx) => {
        let borderClass = "no-selected-opt";

        if (qut.chosenOptionId !== undefined && qut.chosenOptionId !== null) {
          borderClass =
            qut.chosenOptionId === qut.correctOptionId
              ? "correct-opt"
              : "wrong-opt";
        }

        return (
          <div
            key={qut.id}
            className="tw-flex tw-items-center tw-justify-center"
          >
            <div
              className={`tw-cursor-pointer tw-w-full tw-aspect-square tw-rounded-full tw-flex tw-items-center tw-justify-center ${
                borderClass === "correct-opt"
                  ? "tw-border-green-500 tw-border tw-bg-green-100 tw-text-green-700"
                  : borderClass === "wrong-opt"
                  ? "tw-border-red-500 tw-border tw-bg-red-100 tw-text-red-700"
                  : "tw-border tw-border-gray-400 tw-text-gray-700 tw-bg-gray-100"
              } tw-relative`}
              onClick={() => scrollToQuestion(qut.id)}
            >
              <span
                className={`tw-flex tw-items-center tw-justify-center tw-absolute tw-bottom-0 tw-right-0 tw-w-4 tw-h-4 tw-inline-block ${
                  borderClass === "correct-opt"
                    ? "tw-border-green-500 tw-border tw-bg-[#e7f1f5]"
                    : borderClass === "wrong-opt"
                    ? "tw-border-red-500 tw-border tw-bg-[#fef0ed]"
                    : "tw-border tw-border-gray-400 tw-bg-gray-50 tw-hidden"
                } tw-rounded-full tw-translate-x-[40%] tw-translate-y-[15%]`}
              >
                <HugeiconsIcon
                  icon={
                    borderClass === "correct-opt"
                      ? Tick01Icon
                      : borderClass === "wrong-opt"
                      ? Cancel01Icon
                      : MinusSignIcon
                  }
                  className={`${
                    borderClass === "correct-opt"
                      ? "text-success"
                      : borderClass === "wrong-opt"
                      ? "text-danger"
                      : ""
                  }`}
                  size={10}
                />
              </span>
              {qut.questionNo}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ResultQuestionsNav({ questions, scrollToQuestion }) {
  const [activeId, setActiveId] = useState<any>("all-questions");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "all-questions",
      labelName: "All",
      customPadding: "0px 10px 10px 10px",
      count: 30,
      badgeClass:"!tw-bg-slate-100 !tw-text-slate-500"
    },
    {
      id: "correct-questions",
      labelName: "Correct",
      customPadding: "0px 10px 10px 10px",
      count: 18,
      badgeClass:"!tw-bg-green-100 !tw-text-green-500"
    },
    {
      id: "incorrect-questions",
      labelName: "Incorrect",
      customPadding: "0px 10px 10px 10px",
      count: 7,
      badgeClass:"!tw-bg-red-100 !tw-text-red-500"
    },
    {
      id: "un-attempt",
      labelName: "Un Attempt",
      customPadding: "0px 10px 10px 10px",
      count: 5,
      badgeClass:"!tw-bg-gray-100 !tw-text-gray-500"
    },
  ];

  const filterQuestions = (questions, selectedId) => {
    switch (selectedId) {
      case "correct-questions":
        return questions.filter((q) => q.isCorrect === true);
      case "incorrect-questions":
        return questions.filter(
          (q) =>
            q.isCorrect === false &&
            q.chosenOptionId !== null &&
            q.chosenOptionId !== undefined
        );
      case "un-attempt":
        return questions.filter(
          (q) => q.chosenOptionId === null || q.chosenOptionId === undefined
        );
      case "all-questions":
      default:
        return questions;
    }
  };

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "all-questions":
        return QuestionList;
      case "correct-questions":
        return QuestionList;
      case "incorrect-questions":
        return QuestionList;
      case "un-attempt":
        return QuestionList;
    }
  }

  const filteredQuestions = filterQuestions(questions, activeId);

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return (
      <TabComponent
        filteredQuestions={filteredQuestions}
        scrollToQuestion={scrollToQuestion}
      />
    );
  }, [activeId]);

  return (
    <div className="card shadow-none border lg:!tw-sticky lg:!tw-top-8">
      <div className="card-header pb-0">
        <UpdatedHorizontalTab
          MenuOptions={MenuOptions}
          clickMenuHandler={clickMenuHandler}
          activeTabId={activeId}
          horizontalClass="overflow-auto text-nowrap"
          showBadge
        />
      </div>
      <div className="card-body">{activeComponent}</div>
    </div>
  );
}

export default ResultQuestionsNav;
