import { useEffect, useMemo, useRef, useState } from "react";
import { default as MathsSVG } from "../../../../assets/imagesdps/lms/maths.svg?react";
import { useModal } from "../../../../hooks/modalhook";
import { ModalContainerUpdated, MultiSelect, SelectInput, TextArea, TimeInput } from "../../../../Components/Common";
import { SlimStepper } from "../../../../Components/Common/SlimStepper";
import SubMenuMultiSelect from "../../../../Components/Common/SubMenuMultiSelect";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import CourseInfo from "./CourseInfo";
import AcademicStructure from "./AcademicStructure";
import ChapterMapping from "./ChapterMapping";
import courseConfigSettings from "./CourseConfigSettings";
import ReviewPublish from "./ReviewPublish";

const stepInfo = [
  {
    id: "course-info",
    title: "Course Info",
    iconImage: <></>,
  },
  {
    id: "academic-structure",
    title: "Academic Structure",
    iconImage: <></>,
  },
  {
    id: "chapterMapping",
    title: "Chapters Mapping",
    iconImage: <></>,
  },
  {
    id: "courseConfigSettings",
    title: "Course Config Settings",
    iconImage: <></>,
  },
  {
    id: "review&Publish",
    title: "Review & Publish",
    iconImage: <></>,
  },
];

function getActiveMenuComponent(menuId: any) {
  switch (menuId) {
    case "course-info":
      return CourseInfo;
    case "academic-structure":
      return AcademicStructure;
    case "chapterMapping":
      return ChapterMapping;
    case "courseConfigSettings":
      return courseConfigSettings;
    case "review&Publish":
      return ReviewPublish;
  }
}

const AddCourse = () => {
  const [activeStepId, setActiveStepId] = useState("course-info");

  function updateStepHndlr(stepId: any) {
    setActiveStepId(stepId);
    getActiveMenuComponent(stepId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeStepId);
    if (TabComponent) {
      return <TabComponent />;
    }
  }, [activeStepId]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="LMS" pageTitle="LMS" />
        <div className="row justify-content-center">
          <div className="col-xs-12 col-md-12 col-xxl-9">
            <div className="card">
              <div className="card-body p-4">
                <SlimStepper
                  activeStepId={activeStepId}
                  updateStepHndlr={updateStepHndlr}
                  stepsList={stepInfo || []}
                  containerClass="new-stepper-container horizontal-wizard-updated mb-4 px-3"
                ></SlimStepper>
                <div>
                  <div className="px-3">{activeComponent}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
