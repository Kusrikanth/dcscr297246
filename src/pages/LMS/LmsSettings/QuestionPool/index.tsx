import React, { useMemo, useState } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { MenuOptions } from "./helper";
import classnames from "classnames";
import DifficultyLevels from "./DifficultyLevels";
import QuestionTypes from "./QuestionTypes";
import BloomTaxonomy from "./BloomTaxonomy";
import SkillFocusTags from "./SkillFocusTags";
import MarkingRules from "./MarkingRules";
import QuestionCodeFormat from "./QuestionCodeFormat";
import QuestionsNoFormat from "./QuestionsNoFormat";


function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
    case "question-code-format":
      return QuestionCodeFormat;
    case "difficulty-levels":
      return DifficultyLevels;
    case "questions-no-format":
      return QuestionsNoFormat;
    case "question-types":
      return QuestionTypes;
    case "bloom-taxonomy":
      return BloomTaxonomy;
    case "skill-focus-tags":
      return SkillFocusTags;
    case "marking-rules":
      return MarkingRules;
  }
}

const QuestionPool = () => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(
    "question-code-format"
  );

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveMenuId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeMenuId);
    return <TabComponent />;
  }, [activeMenuId]);

  return (
    <>
      <div className="page-content master-setup-wrapper">
        <div className="container-fluid">
          <BreadCrumb pageTitle="LMS"></BreadCrumb>
        </div>

        <div>
          <div className="row">
            <div className="col-12 col-lg-4 col-xl-3">
              <div className="card">
                <div className="card-body p-0">
                  <ul className="left-menu-section">
                    {MenuOptions.map((item: any) => (
                      <li
                        className={classnames("fs-6", {
                          active: item.id === activeMenuId,
                        })}
                        data-id={item.id}
                        key={item.id}
                        onClick={clickMenuHandler}
                      >
                        {item.labelName}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-8 col-xl-9">{activeComponent}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionPool;
