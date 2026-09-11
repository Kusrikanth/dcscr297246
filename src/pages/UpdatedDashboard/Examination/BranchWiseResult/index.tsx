import { useEffect, useMemo, useState } from "react";
import MarksRange from "./MarksRange";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import GradeWiseAnalysis from "./GradeWiseAnalysis";
import { SelectInput } from "../../../../Components/Common";
import { resultType } from "./helper";
import SubjectWiseAvgMarks from "./SubjectWiseAvgMarks";
import Below50PerMarksAnalysis from "./Below50PerMarksAnalysis";
import MarksAnalysis100Per from "./MarksAnalysis100Per";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const BranchWiseResultsAnlaysis = (props: any) => {
  const [activeId, setActiveId] = useState<any>("marks-range");

  const {
    instClassResp,
    getSubjectListForDashboardResp
  } =
    useAppSelector(({ instAcademics, examinationManagement }) => ({

      instClassResp: instAcademics.instClassResp,
      getSubjectListForDashboardResp: examinationManagement.getSubjectListForDashboardResp

    }), shallowEqual)

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "marks-range",
      labelName: "Marks Range",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "grade-wise-analysis",
      labelName: "Grade wise Analysis",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "subject-wise-avg-marks",
      labelName: "Subject wise Avg marks",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "below-50-per-marks-analysis",
      labelName: "Below 50% Marks Analysis",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "marks-analysis-100-per",
      labelName: "Centums",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "marks-range":
        return MarksRange;
      case "grade-wise-analysis":
        return GradeWiseAnalysis;
      case "subject-wise-avg-marks":
        return SubjectWiseAvgMarks
      case "below-50-per-marks-analysis":
        return Below50PerMarksAnalysis
      case "marks-analysis-100-per":
        return MarksAnalysis100Per
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);

    return <TabComponent data={props.data} ></TabComponent>;
  }, [activeId, props.data]);


  return (
    <>
      <div className="tw-grid">
        <div className="card !tw-rounded-2xl !tw-shadow-sm !tw-pb-0 !tw-mb-4">
          <div className="card-header !tw-py-2 !tw-rounded-t-2xl">
            <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-items-center tw-gap-3">
              <div className="lg:tw-col-span-4">
                <h4 className="card-title !tw-mb-0">
                  Branch wise Result Analysis
                </h4>
              </div>

              <div className="lg:tw-col-span-8 tw-flex tw-justify-start lg:tw-justify-end">
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  horizontalClass="tw-overflow-auto tw-whitespace-nowrap horizontal-menu-updated-style"
                ></UpdatedHorizontalTab>
              </div>
            </div>
          </div>
          <div className="tw-grid tw-grid-cols-12 tw-p-3 tw-gap-3">
            <div className="tw-col-span-12 sm:tw-col-span-6 md:tw-col-span-4 lg:tw-col-span-3">
              <SelectInput
                name="secondClassId"
                value={props.filterValues.secondClassId}
                onChange={props.setFilterValues}
                menuItems={instClassResp || []}
                valueKey="classSequence"
                textKey="classNames"
                labelText="Class"
                floatingLabel
                formgroupClassName="mb-0"
              />
            </div>
            <div className="tw-col-span-12 sm:tw-col-span-6 md:tw-col-span-4 lg:tw-col-span-3">
              <SelectInput
                name="secondExaminationId"
                value={props.filterValues.secondExaminationId}
                onChange={props.setFilterValues}
                menuItems={getSubjectListForDashboardResp || []}
                valueKey="examShortName"
                textKey="examShortName"
                labelText="Examination"
                floatingLabel
                formgroupClassName="mb-0"
              />
            </div>
          </div>
          <div className="card-body !tw-p-0">
            <div>{activeComponent}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BranchWiseResultsAnlaysis;
