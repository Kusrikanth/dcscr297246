import { HugeiconsIcon } from "@hugeicons/react";
import { AnalysisTextLinkIcon, Download01Icon } from "@hugeicons-pro/core-stroke-standard";
import { useMemo, useState } from "react";
import ResultSummary from "./ResultSummary";
import QuestionWiseSummary from "./QuestionWiseSummary";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const InstantResults = (props: any) => {

  const [activeId, setActiveId] = useState<any>("result-summary");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "result-summary",
      labelName: "Result Summary",
      customPadding: "0px 6px 6px 6px",
    },
    {
      id: "question-wise-summary",
      labelName: "Question wise Summary",
      customPadding: "0px 6px 6px 6px",
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "result-summary":
        return ResultSummary;
      case "question-wise-summary":
        return QuestionWiseSummary;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent />;
  }, [activeId]);

  return (
    <div className="tw-pb-4">
      <div className="tw-w-full tw-px-4 tw-pt-6">
        <UpdatedHorizontalTab
          MenuOptions={MenuOptions}
          clickMenuHandler={clickMenuHandler}
          activeTabId={activeId}
          horizontalClass="tw-overflow-auto student-assessment-details"
        />
      </div>
      {activeComponent}
    </div>
  );
};

export default InstantResults;
