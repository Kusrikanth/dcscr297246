import React, { useEffect, useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import SubjectGradeWiseAnalysis from "./SubjectGradeWiseAnalysis";
import { useFormik } from "formik";
import { SelectInput } from "../../../../Components/Common";
import SubjectRangeWiseAnalysis from "./SubjectRangeWiseAnalysis";
import ExamWiseAnalysis from "./ExamWiseAnalysis";
import GradeWiseAnalysis from "./GradeWiseAnalysis";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const initialValues = {
  subject: "",
};

const GradewisePerformanceChart = (props: any) => {
  const [activeId, setActiveId] = useState<any>("subjectGradeWiseAnalysis");
  const [currentPageSizeState, setCurrentPageSizeState] = useState<any>(10);
  const filterStateForm = useFormik({
    initialValues,
    onSubmit: (values) => {},
  });
  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "subjectGradeWiseAnalysis",
      labelName: "Grade Wise",
      customPadding: "0px 5px 5px 5px",
    },
    // {
    //   id: "subjectRangeWiseAnalysis",
    //   labelName: "Range Wise",
    //   customPadding: "0px 5px 5px 5px",
    // },
    {
      id: "examWiseAnalysis",
      labelName: "Exam Wise",
      customPadding: "0px 5px 5px 5px",
    },
    // {
    //   id: "SectionWiseAnalysis",
    //   labelName: "Section Wise",
    //   customPadding: "0px 5px 5px 5px",
    // },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "subjectGradeWiseAnalysis":
        return GradeWiseAnalysis;
      // case "subjectRangeWiseAnalysis":
      //   return SubjectRangeWiseAnalysis;
      case "examWiseAnalysis":
        return ExamWiseAnalysis
      // case "SectionWiseAnalysis":
      //   return SectionWiseAnalysis

      default:
        return null;
    }
  }

  useEffect(() => {
    if(activeId === "subjectGradeWiseAnalysis"){
      filterStateForm.setFieldValue("subject", props?.data?.subjects[0]?.name);
    }
    else if(activeId === "examWiseAnalysis"){
      filterStateForm.setFieldValue("subject", props?.data?.examinationWise?.subjects[0]?.name);
    }
  }, [props.data, activeId]);

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    setCurrentPageSizeState(0);
    return (
      <TabComponent data={props?.data} filterStateForm={filterStateForm.values}/>
    );
  }, [activeId, props.data, filterStateForm.values]);

  return (
    <>
      <div className="upcoming_events library-dashboard tw-grid tw-h-full">
        <div className="card !tw-rounded-2xl !tw-shadow-sm">
          <div className="card-header !tw-py-3 !tw-rounded-t-2xl">
            <div className="tw-grid tw-grid-cols-2 tw-items-center tw-gap-4">
              <div className="tw-col-span-1">
                <h4 className="card-title !tw-mb-0">
                  Subject Analysis
                </h4>
              </div>
              {activeId === "subjectGradeWiseAnalysis" && <div className="tw-col-span-1">
                <SelectInput
                  name="subject"
                  value={filterStateForm.values.subject}
                  onChange={filterStateForm.handleChange}
                  menuItems={props?.data?.subjects}
                  valueKey="name"
                  textKey="name"
                  formgroupClassName="tw-mb-0"
                  labelText="Subject"
                  floatingLabel
                />
              </div>}
              {activeId === "examWiseAnalysis" && <div className="tw-col-span-1">
                <SelectInput
                  name="subject"
                  value={filterStateForm.values.subject}
                  onChange={filterStateForm.handleChange}
                  menuItems={props?.data?.examinationWise?.subjects}
                  valueKey="name"
                  textKey="name"
                  formgroupClassName="mb-0"
                  labelText="Subject"
                  floatingLabel
                />
              </div>}
            </div>
          </div>
          {/* Card Body */}
          <div className="card-body !tw-pb-0">
            <div className="!tw-p-0 tw-flex-grow">
            <div className="!tw-my-3 tw-flex tw-justify-center">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="horizontal-menu-updated-style"
              />
            </div>
            <div
              className="tw-mx-3 tw-h-[372px] tw-overflow-y-auto tw-overflow-x-hidden tw-z-[1]"
              style={{
                scrollbarWidth: "thin",
              }}
            >
              {activeComponent}
            </div>
          </div>

          </div>
          
        </div>
      </div>
    </>
  );
};

export default GradewisePerformanceChart;
