import { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../../Components/Common/UpdatedHorizontalTab";
import SubjectLevel from "./SubjectLevel";
import { TextInput } from "../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons-pro/core-stroke-standard";
import StudentLevel from "./StudentLevel";
import ModuleApplicable from "./ModuleApplicable";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const SkillFocusTags = () => {
  const [activeId, setActiveId] = useState<any>("subject-level");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "subject-level",
      labelName: "Subject level",
      customPadding: "0px 10px 6px 10px",
    },
    {
      id: "student-level",
      labelName: "Student level",
      customPadding: "0px 10px 6px 10px",
    },
    {
      id: "module-applicable",
      labelName: "Module Applicable",
      customPadding: "0px 10px 6px 10px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "subject-level":
        return SubjectLevel;
      case "student-level":
        return StudentLevel;
      case "module-applicable":
        return ModuleApplicable;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);

    return <TabComponent />;
  }, [activeId]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <h4 className="card-title mb-0 flex-grow-1">
              Skill Focus Tags / Id's
            </h4>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="row w-100 mx-auto">
            <div className="col-12 col-md-6 col-lg-4 px-3 pt-3 pb-2">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  formgroupClassName="mb-0"
                  labelText="Search"
                  placeHolder="Search"
                  value={""}
                  onChange={() => {}}
                  floatingLabel
                ></TextInput>
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={18}
                  className="search-icon"
                />
              </div>
            </div>
            <div className="col-12">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="pt-2 mb-0 overflow-auto text-nowrap"
              ></UpdatedHorizontalTab>
            </div>
          </div>
          <div>{activeComponent}</div>
        </div>
      </div>
    </>
  );
};

export default SkillFocusTags;
