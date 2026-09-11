import React, { useContext, useEffect, useState, useRef } from "react";
import { shallowEqual } from "react-redux";
import { ArrayHelpers, FormikProvider, useFormik } from "formik";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { StepperFormContext } from "../helper";
import { TextInput, TextArea, CustomTooltip, SelectInput } from "../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { CircleArrowRight01Icon, Target01Icon, StarIcon, FavouriteIcon, PaintBoardIcon, ArrowLeft01Icon, ArrowRight01Icon, Delete02StrokeStandard, ViewIcon, SmileIcon, Sad01Icon, NeutralIcon, CircleArrowLeft01Icon, PlayCircle02Icon, TaskDone02Icon, TeachingIcon, Home03Icon, PlusSignIcon, Cancel01Icon, Mortarboard02Icon, UserMultiple03Icon } from "@hugeicons-pro/core-stroke-standard";
import { InputCheckbox } from "../../../../../Components/Common/InputCheckbox";
import { rubricLevels, DomainData, ActivityData, RubricLevel, transformApiDataToDomainData, transformToApiPayload, transformSavedDataToDomainData, helpOptions } from "./helper";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
  getDomainDetailsStudentAct, getGeneralInformationByIdAct, saveDomainStudentDetailsAct, updateDomainDetailsStudentAct
} from "../../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { toast } from "react-toastify";

type RubricSectionProps = {
  activityIndex: number;
  sectionType: "awareness" | "sensitivity" | "creativity";
  icon: any;
  iconColor: string;
  title: string;
  isViewMode: boolean;
  currentLevel: RubricLevel["level"];
  notesValue: string;
  rubricData: any[];
  onChangeLevel: (level: RubricLevel["level"], notes: string) => void;
  onChangeNotes: (notes: string) => void;
};

const getInitialValues = (domainData?: any, apiDomainsData?: any[], savedDomainsData?: any[], currentIndex?: number) => {
  if (domainData) {
    return domainData;
  }

  if (apiDomainsData && apiDomainsData.length > 0 && currentIndex !== undefined) {
    const freshDomainData = getDefaultInitialValues(apiDomainsData, currentIndex);
    if (savedDomainsData && savedDomainsData.length > 0) {
      const savedDomainMatch = savedDomainsData.find(
        savedDomain => savedDomain?.domainId === freshDomainData.id
      );

      if (savedDomainMatch) {
        const transformedSavedData = transformSavedDataToDomainData([savedDomainMatch]);
        const savedDomainData = transformedSavedData[0];

        if (savedDomainData && savedDomainData.id === freshDomainData.id) {
          return {
            ...freshDomainData,
            studentDomainId: savedDomainData.studentDomainId,

            curriculumGoals: freshDomainData.curriculumGoals?.map(goal => ({
              ...goal,
              selected: savedDomainData.curriculumGoals?.find(savedGoal => savedGoal.id === goal.id)?.selected || goal.selected
            })) || [],

            competencies: freshDomainData.competencies?.map(comp => ({
              ...comp,
              selected: savedDomainData.competencies?.find(savedComp => savedComp.id === comp.id)?.selected || comp.selected
            })) || [],

            activities: savedDomainData.activities || freshDomainData.activities
          };
        }
      }
    }

    return freshDomainData;
  }

  return getDefaultInitialValues();
};
const AssessmentQuestions = ({
  likedWorkValue,
  foundEasyValue,
  onLikedWorkChange,
  onFoundEasyChange,
  isViewMode,
  prefix,
}: {
  likedWorkValue: string;
  foundEasyValue: string;
  onLikedWorkChange: (value: string) => void;
  onFoundEasyChange: (value: string) => void;
  isViewMode: boolean;
  prefix: string;
}) => {
  const options = [
    { value: "yes", icon: SmileIcon, label: "Yes" },
    { value: "no", icon: Sad01Icon, label: "No" },
    { value: "dont_know", icon: NeutralIcon, label: "I don't know" },
  ];

  const QuestionComponent = ({
    question,
    value,
    onChange,
    questionPrefix,
  }: {
    question: string;
    value: string;
    onChange: (value: string) => void;
    questionPrefix: string;
  }) => {
    const getBorderColor = (optionValue: string, isSelected: boolean) => {
      if (!isSelected) return "tw-border-gray-300";

      switch (optionValue) {
        case "yes":
          return "tw-border-green-500 tw-bg-green-100";
        case "no":
          return "tw-border-red-500 tw-bg-red-200";
        case "dont_know":
          return "tw-border-yellow-500 tw-bg-yellow-100";
        default:
          return "tw-border-blue-500 tw-bg-blue-100";
      }
    };

    const getTextColor = (optionValue: string) => {
      switch (optionValue) {
        case "yes":
          return "tw-text-green-600";
        case "no":
          return "tw-text-red-600";
        case "dont_know":
          return "tw-text-yellow-600";
        default:
          return "tw-text-blue-600";
      }
    };

    const getIconColor = (optionValue: string, isSelected: boolean) => {
      if (!isSelected) return "tw-text-gray-500";
      switch (optionValue) {
        case "yes":
          return "tw-text-green-600";
        case "no":
          return "tw-text-red-600";
        case "dont_know":
          return "tw-text-yellow-600";
        default:
          return "tw-text-blue-600";
      }
    };

    return (
      <div className="tw-w-[100%]">
        <label className="tw-block tw-font-bold tw-mb-2">{question}</label>
        <div className="tw-flex tw-gap-3 tw-mt-2">
          {options.map((option) => (
            <div key={option.value} className="tw-text-center">
              <div
                className={`tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border-2 ${getBorderColor(
                  option.value,
                  value === option.value
                )}`}
                style={{
                  width: "34px",
                  height: "34px",
                  cursor: isViewMode ? "default" : "pointer",
                }}
                onClick={() => !isViewMode && onChange(option.value)}
                data-tooltip-id={`${questionPrefix}-${option.value}`}
              >
                <HugeiconsIcon
                  icon={option.icon}
                  size={24}
                  className={getIconColor(option.value, value === option.value)}
                />
              </div>
              {value === option.value && (
                <div
                  className={`tw-mt-1 tw-text-sm ${getTextColor(
                    option.value
                  )} tw-font-bold`}
                >
                  {option.label}
                </div>
              )}
              <CustomTooltip
                id={`${questionPrefix}-${option.value}`}
                content={option.label}
                placement="bottom"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="!tw-flex !tw-gap-4 mb-4 !tw-justify-between">
      <QuestionComponent
        question="I liked doing this work"
        value={likedWorkValue}
        onChange={onLikedWorkChange}
        questionPrefix={`${prefix}-liked`}
      />

      <div className="tw-border-r-4 tw-border-gray-300 tw-rounded-full"></div>

      <QuestionComponent
        question="I found this work easy"
        value={foundEasyValue}
        onChange={onFoundEasyChange}
        questionPrefix={`${prefix}-easy`}
      />
    </div>
  );
};
const getDefaultInitialValues = (apiDomainsData?: any[], currentIndex?: number) => {
  if (apiDomainsData && apiDomainsData.length > 0 && currentIndex !== undefined) {
    const transformedData = transformApiDataToDomainData(apiDomainsData);
    const domainDataWithDefaults = transformedData[currentIndex] || {};
    if (domainDataWithDefaults.curriculumGoals && domainDataWithDefaults.curriculumGoals.length > 0) {
      domainDataWithDefaults.curriculumGoals[0].selected = true;
    }
    return domainDataWithDefaults;
  }

  return {
    id: 0,
    name: "",
    domainIndex: "",
    curriculumGoals: [],
    competencies: [],
    activities: [],
    assessmentActivity: {
      description: "",
      activityId: "",
      questions: []
    }
  };
};

const createEmptyActivity = (): ActivityData => ({
  activityId: "",
  questions: [
    {
      id: +generateUniqueNumber(),
      question: "",
      answer: "",
    },
  ],
  assessmentRubric: {
    awareness: { level: "stream", notes: "" },
    sensitivity: { level: "stream", notes: "" },
    creativity: { level: "stream", notes: "" },
  },
  teacherFeedback: {
    proficiencyLevel: "stream",
    notes: "",
  },
  selfAssessment: {
    likedWork: "dont_know",
    foundEasy: "dont_know",
    neededHelp: [],
  },
  peerAssessment: {
    likedWork: "dont_know",
    foundEasy: "dont_know",
    neededHelp: [],
  },
  parentObservation: {
    homeResources: [
      { id: "books_magazines", name: "Books/Magazines", selected: false },
      { id: "newspapers", name: "Newspapers", selected: false },
      { id: "toys_games_sports", name: "Toys/Games/Sports", selected: false },
      { id: "phone_computer", name: "Phone/Computer", selected: false },
      { id: "internet", name: "Internet", selected: false },
      { id: "public_broadcast_system", name: "Public Broadcast System", selected: false },
      { id: "resources_for_cwsn", name: "Resources for CWSN", selected: false },
    ],
    notes: "",
    parentOvservationOthers: "",
  },
});
const DomainAssessment = (props: any) => {
  const { stepId, entryId } = props;
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const {
    nextStepHndlr,
    submitCurrentFormCllbck,
    setTabsDataHandler,
    isViewMode,
  } = useContext(StepperFormContext);

  const dispatch = useAppDispatch();

  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);
  const [transformedDomainData, setTransformedDomainData] = useState<DomainData[]>([]);
  const [domainUserData, setDomainUserData] = useState<{ [key: number]: DomainData }>({});
  const [savedDomainsData, setSavedDomainsData] = useState<any[]>([]);
  const [activeActivityTab, setActiveActivityTab] = useState<number>(0);

  const { showApiLoader, getDomainDetailsStudentResp, saveGeneralInformationResp, getGeneralInformationByIdResp } = useAppSelector(
    ({ globalData, examinationManagement }) => ({
      showApiLoader: globalData.showApiLoader,
      getDomainDetailsStudentResp: examinationManagement.getDomainDetailsStudentResp,
      saveGeneralInformationResp: examinationManagement.saveGeneralInformationResp,
      getGeneralInformationByIdResp: examinationManagement.getGeneralInformationByIdResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (getGeneralInformationByIdResp?.studentDomains && Array.isArray(getGeneralInformationByIdResp.studentDomains)) {
      setSavedDomainsData(getGeneralInformationByIdResp.studentDomains);
    }
  }, [getGeneralInformationByIdResp]);

  useEffect(() => {
    if (getDomainDetailsStudentResp && Array.isArray(getDomainDetailsStudentResp)) {
      const transformed = transformApiDataToDomainData(getDomainDetailsStudentResp);
      setTransformedDomainData(transformed);
    }
  }, [getDomainDetailsStudentResp]);

  const getCurrentDomainData = () => {
    const domainId = transformedDomainData[currentDomainIndex]?.id;

    const ensureOneActivity = (data: DomainData) => ({
      ...data,
      activities: data.activities && data.activities.length > 0 ? data.activities : [createEmptyActivity()],
    });

    if (domainId && domainUserData[domainId]) {
      return ensureOneActivity(domainUserData[domainId]);
    }

    if (transformedDomainData.length > 0) {
      const freshData = getInitialValues(
        undefined,
        getDomainDetailsStudentResp,
        savedDomainsData,
        currentDomainIndex
      );
      return ensureOneActivity(freshData);
    }

    return ensureOneActivity(getInitialValues());
  };

  const getFilteredCompetencies = (domainData: DomainData) => {
    const selectedGoalIds = domainData.curriculumGoals
      ?.filter(goal => goal.selected)
      ?.map(goal => goal.id) || [];

    if (selectedGoalIds.length === 0) {
      return [];
    }

    return domainData.competencies?.filter(comp =>
      selectedGoalIds.includes(comp.goalId)
    ) || domainData.competencies || [];
  };

  const domainAssessmentForm = useFormik({
    initialValues: getCurrentDomainData(),
    onSubmit: (values: DomainData) => { },
  });

  useEffect(() => {
    if (transformedDomainData.length > 0 || savedDomainsData.length > 0) {
      const currentData = getCurrentDomainData();
      domainAssessmentForm.resetForm({
        values: currentData,
      });
      setActiveActivityTab(0);
    }
  }, [currentDomainIndex, transformedDomainData, savedDomainsData]);

  const handleInputChange = (field: string, value: any) => {
    domainAssessmentForm.setFieldValue(field, value);
    const updatedData = { ...domainAssessmentForm.values, [field]: value };

    const domainId = transformedDomainData[currentDomainIndex]?.id;
    if (domainId) {
      setDomainUserData(prev => ({
        ...prev,
        [domainId]: updatedData
      }));
    }

    setTabsDataHandler(stepId, updatedData);
  };

  const handleDomainChange = (direction: "prev" | "next") => {
    const currentDomainId = transformedDomainData[currentDomainIndex]?.id;
    if (currentDomainId) {
      setDomainUserData(prev => ({
        ...prev,
        [currentDomainId]: domainAssessmentForm.values
      }));
    }

    let newIndex = currentDomainIndex;

    if (direction === "prev" && currentDomainIndex > 0) {
      newIndex = currentDomainIndex - 1;
    } else if (direction === "next" && currentDomainIndex < transformedDomainData.length - 1) {
      newIndex = currentDomainIndex + 1;
    } else {
      return;
    }

    setCurrentDomainIndex(newIndex);
  };

  const handleCurriculumGoalChange = (goalId: string) => {
    const updatedGoals = domainAssessmentForm.values.curriculumGoals.map((goal) =>
      goal.id === goalId ? { ...goal, selected: !goal.selected } : goal
    );

    const updatedCompetencies = domainAssessmentForm.values.competencies.map(comp => ({
      ...comp,
      selected: false
    }));

    const updatedData = {
      ...domainAssessmentForm.values,
      curriculumGoals: updatedGoals,
      competencies: updatedCompetencies
    };

    domainAssessmentForm.setValues(updatedData);

    const domainId = transformedDomainData[currentDomainIndex]?.id;
    if (domainId) {
      setDomainUserData(prev => ({
        ...prev,
        [domainId]: updatedData
      }));
    }

    setTabsDataHandler(stepId, updatedData);
  };

  const handleCompetencyChange = (competencyId: string) => {
    const updatedCompetencies = domainAssessmentForm.values.competencies.map((competency) =>
      competency.id === competencyId
        ? { ...competency, selected: !competency.selected }
        : competency
    );
    handleInputChange("competencies", updatedCompetencies);
  };

  const handleAddActivity = () => {
    const activities = domainAssessmentForm.values.activities || [];

    const available = Array.isArray(domainAssessmentForm.values.assessmentActivity?.description)
      ? domainAssessmentForm.values.assessmentActivity.description
      : [];

    const maxAllowed = Math.max(1, available.length);

    if (activities.length >= maxAllowed) {
      toast.error(`You can add maximum ${maxAllowed} activities.`);
      return;
    }

    const updatedActivities = [...activities, createEmptyActivity()];
    handleInputChange("activities", updatedActivities);
    setActiveActivityTab(updatedActivities.length - 1);
  };

  const handleRemoveActivity = (activityIndex: number) => {
    const updatedActivities = domainAssessmentForm.values.activities.filter((_, idx) => idx !== activityIndex);
    handleInputChange("activities", updatedActivities);

    if (activeActivityTab >= updatedActivities.length) {
      setActiveActivityTab(Math.max(0, updatedActivities.length - 1));
    }
  };

  const handleActivitySelection = (activityIndex: number, selectedActivityId: string) => {
    const currentActivities = domainAssessmentForm.values.activities || [];

    const isDuplicate = currentActivities.some((activity, idx) =>
      idx !== activityIndex && activity.activityId === selectedActivityId
    );

    if (isDuplicate) {
      toast.error("This activity is already added. Please select a different activity.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const activityDescriptions = Array.isArray(domainAssessmentForm.values.assessmentActivity?.description)
      ? domainAssessmentForm.values.assessmentActivity.description
      : [];

    const selectedActivity = activityDescriptions.find(
      activity => activity.activityId.toString() === selectedActivityId.toString()
    );

    type AssessmentQuestion = { id: number; question: string; answer: string };
    let prefillQuestions: AssessmentQuestion[] = [];

    if (selectedActivity && selectedActivity.questions && Array.isArray(selectedActivity.questions)) {
      prefillQuestions = selectedActivity.questions.map((questionText: string): AssessmentQuestion => ({
        id: +generateUniqueNumber(),
        question: questionText.trim(),
        answer: ""
      }));
    } else {
      prefillQuestions = [{
        id: +generateUniqueNumber(),
        question: "",
        answer: ""
      } as AssessmentQuestion];
    }

    const updatedActivities = [...currentActivities];
    updatedActivities[activityIndex] = {
      ...updatedActivities[activityIndex],
      activityId: selectedActivityId.toString(),
      questions: prefillQuestions
    };

    handleInputChange("activities", updatedActivities);
  };

  const updateActivityField = (activityIndex: number, field: string, value: any) => {
    const updatedActivities = [...(domainAssessmentForm.values.activities || [])];
    updatedActivities[activityIndex] = {
      ...updatedActivities[activityIndex],
      [field]: value
    };
    handleInputChange("activities", updatedActivities);
  };

  const addQuestion = (activityIndex: number) => {
    const newQuestion = {
      id: +generateUniqueNumber(),
      question: "",
      answer: "",
    };
    const currentActivities = [...(domainAssessmentForm.values.activities || [])];
    const updatedQuestions = [
      ...(currentActivities[activityIndex]?.questions || []),
      newQuestion,
    ];
    updateActivityField(activityIndex, 'questions', updatedQuestions);
  };

  const handleRubricChange = (
    activityIndex: number,
    section: "awareness" | "sensitivity" | "creativity",
    level: RubricLevel['level'],
    notes: string
  ) => {
    const currentActivities = [...(domainAssessmentForm.values.activities || [])];
    const updatedRubric = {
      ...currentActivities[activityIndex].assessmentRubric,
      [section]: { level, notes },
    };
    updateActivityField(activityIndex, 'assessmentRubric', updatedRubric);
  };

    const handleHomeResourceChange = (activityIndex: number, resourceId: string) => {
    const currentActivities = [...(domainAssessmentForm.values.activities || [])];
    const updatedResources = currentActivities[activityIndex].parentObservation.homeResources.map(
      (resource) =>
        resource.id === resourceId
          ? { ...resource, selected: !resource.selected }
          : resource
    );
    updateActivityField(activityIndex, 'parentObservation', {
      ...currentActivities[activityIndex].parentObservation,
      homeResources: updatedResources,
    });
  };
  
  const validateForm = () => {
    return true;
  };

  const getAllDomainsData = () => {
    const currentDomainId = transformedDomainData[currentDomainIndex]?.id;

    const updatedDomainUserData = currentDomainId ? {
      ...domainUserData,
      [currentDomainId]: domainAssessmentForm.values
    } : domainUserData;

    const allDomainsData = transformedDomainData.map(domain => {
      const savedData = updatedDomainUserData[domain.id];

      const savedDomainInfo = savedDomainsData.find(savedDomain =>
        savedDomain.domain?.domainId === domain.id
      );

      let domainData;
      if (savedData) {
        domainData = savedData;
      } else {
        domainData = getInitialValues(undefined, getDomainDetailsStudentResp, savedDomainsData,
          transformedDomainData.findIndex(d => d.id === domain.id)
        );
      }

      if (savedDomainInfo?.studentDomainId) {
        domainData.studentDomainId = savedDomainInfo.studentDomainId;
      }

      return domainData;
    });

    return allDomainsData;
  };

  const saveStudentSurroundings = () => {
    if (validateForm()) {
      const allDomainsData = getAllDomainsData();

      const payload = transformToApiPayload(allDomainsData);

      if (getGeneralInformationByIdResp?.studentDomains?.length > 0) {
        dispatch(updateDomainDetailsStudentAct(generateActionPayload("save_student_domain_details", { id: saveGeneralInformationResp?.data || entryId }, payload)));
      } else {
        dispatch(saveDomainStudentDetailsAct(generateActionPayload("save_student_domain_details", { id: saveGeneralInformationResp?.data || entryId }, payload)));
      }
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      saveStudentSurroundings();
      submitCurrentFormCllbck([], "NEXT_TAB");
      nextStepHndlr(stepId, domainAssessmentForm.values);
    }
  };

  const handleNextDomain = () => {
    if (currentDomainIndex === transformedDomainData.length - 1) {
      handleNext();
    } else {
      handleDomainChange("next");
    }
  };

  const domainDetailsKeyRef = useRef<string>("");

  useEffect(() => {
    const academicYearId = getGeneralInformationByIdResp?.academicYearId;
    const branchId = getGeneralInformationByIdResp?.branchId;
    const curriculumId = getGeneralInformationByIdResp?.curriculumId;
    const classId = getGeneralInformationByIdResp?.classId;
    if (!academicYearId || !branchId || !curriculumId || !classId) return;
    const key = `${academicYearId}-${branchId}-${curriculumId}-${classId}`;
    if (domainDetailsKeyRef.current === key) return;
    domainDetailsKeyRef.current = key;

    dispatch(
      getDomainDetailsStudentAct(
        generateActionPayload("get_domain_details_students", undefined, {
          academicYearId,
          branchId,
          curriculumId,
          classId,
        })
      )
    );
  }, [getGeneralInformationByIdResp?.academicYearId, getGeneralInformationByIdResp?.branchId, getGeneralInformationByIdResp?.curriculumId, getGeneralInformationByIdResp?.classId]);

  useEffect(() => {
    const id = saveGeneralInformationResp?.data || entryId;
    if (!id) return;

    dispatch(
      getGeneralInformationByIdAct(
        generateActionPayload("get_general_information_by_id", { id }, undefined)
      )
    );
  }, [saveGeneralInformationResp?.data, entryId]);

  const handlePrevious = () => {
    dispatch(getGeneralInformationByIdAct(generateActionPayload("get_general_information_by_id", { id: saveGeneralInformationResp?.data || entryId }, undefined)));
    submitCurrentFormCllbck([], "PREVIOUS_TAB");
    nextStepHndlr(stepId, domainAssessmentForm.values);
  };

  if (!transformedDomainData.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        {showApiLoader ? (
          <div>Loading domains...</div>
        ) : (
          <div>No domains available</div>
        )}
      </div>
    );
  }

  const filteredCompetencies = getFilteredCompetencies(domainAssessmentForm.values);

  const getActivityRubricData = (
    activityIndex: number,
    rubricType: "awareness" | "sensitivity" | "creativity"
  ) => {
    const currentDomain = getDomainDetailsStudentResp?.find(
      (domain) => domain.domainId === domainAssessmentForm.values.id
    );

    const selectedActivityId = domainAssessmentForm.values.activities?.[activityIndex]?.activityId;
    if (!selectedActivityId) return [];

    const selectedActivity = currentDomain?.activities?.find(
      (activity) => activity.id?.toString() === selectedActivityId?.toString()
    );

    const raw = selectedActivity?.assessmentRubric?.[rubricType];
    return Array.isArray(raw) ? raw : [];
  };

  const normalizeRubricId = (val: any): RubricLevel["level"] => {
    const s = String(val ?? "").trim().toLowerCase();
    if (s === "stream" || s === "mountain" || s === "sky") return s as RubricLevel["level"];
    return "stream";
  };

  const RubricSection = React.memo(function RubricSection(props: RubricSectionProps) {
    const {
      activityIndex,
      sectionType,
      icon,
      iconColor,
      title,
      isViewMode,
      currentLevel,
      notesValue,
      rubricData,
      onChangeLevel,
      onChangeNotes,
    } = props;

    const hasActivityRubrics = Array.isArray(rubricData) && rubricData.length > 0;

    const handleRubricSelection = (rawId: any) => {
      if (isViewMode) return;

      const selectedLevel = normalizeRubricId(rawId);

      let descriptionText = "";
      if (hasActivityRubrics) {
        const selectedRubric = rubricData.find(
          (r: any) => normalizeRubricId(r?.type ?? r?.id ?? r?.level) === selectedLevel
        );
        descriptionText = selectedRubric?.description || "";
      }
      if (!descriptionText) {
        descriptionText = rubricLevels.find((l) => l.id === selectedLevel)?.description || "";
      }
      onChangeLevel(selectedLevel, descriptionText);
    };

    return (
      <div className="col-md-12 mb-3">
        <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5">
          <div className="d-flex align-items-center mb-3">
            <HugeiconsIcon icon={icon} size={24} className="me-2" style={{ color: iconColor }} />
            <h6 className="mb-0 fw-bold">{title}</h6>
          </div>

          <div className="d-flex flex-row gap-2 mb-3">
            {(hasActivityRubrics ? rubricData : rubricLevels).map((item: any) => {
              const rawId = hasActivityRubrics ? (item?.type ?? item?.id ?? item?.level) : item?.id;
              const id = normalizeRubricId(rawId);

              const levelMeta = rubricLevels.find((l) => l.id === id);
              const isSelected = currentLevel === id;

              const label = hasActivityRubrics
                ? (item?.title || item?.name || levelMeta?.name || id)
                : (item?.name || id);

              const desc = item?.description || levelMeta?.description || "";

              return (
                <div
                  key={`${sectionType}-${id}`}
                  className={`flex-fill p-3 border !tw-rounded-lg cursor-pointer ${isSelected && levelMeta
                    ? `${levelMeta.borderColor} ${levelMeta.backgroundColor}`
                    : "border-light"
                    }`}
                  onClick={() => handleRubricSelection(id)}
                  style={{ cursor: isViewMode ? "default" : "pointer" }}
                >

                  <div className={`fw-bold ${isSelected && levelMeta ? levelMeta.textColor : ""}`}>
                    {label}
                  </div>
                  {!!desc && <div className="small text-muted">{desc}</div>}
                </div>
              );
            })}
          </div>

          <TextArea
            name={`activity-${activityIndex}-${sectionType}.notes`}
            value={notesValue}
            onChange={(e) => onChangeNotes(e.target.value)}
            placeHolder="Enter assessment notes..."
            isDisabled={isViewMode}
            formgroupClassName="mb-0"
          />
        </div>
      </div>
    );
  });

  const currentActivities = domainAssessmentForm.values.activities || [];
  const activityIndex = activeActivityTab;
  const activity = currentActivities[activityIndex];
  const availableActivities = Array.isArray(domainAssessmentForm.values.assessmentActivity?.description)
    ? domainAssessmentForm.values.assessmentActivity.description
    : [];

  const maxActivitiesAllowed = Math.max(1, availableActivities.length);
  const canAddMoreActivities = currentActivities.length < maxActivitiesAllowed;
  const activities = domainAssessmentForm.values.activities || [];
  const awarenessRubrics = getActivityRubricData(activityIndex, "awareness");
  const sensitivityRubrics = getActivityRubricData(activityIndex, "sensitivity");
  const creativityRubrics = getActivityRubricData(activityIndex, "creativity");
  const activeTabId = String(activeActivityTab);
  const currentRubric = activities?.[activityIndex]?.assessmentRubric;

  return (
    <div>
      <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
        <h3 className="tw-mb-0 tw-text-lg tw-font-semibold text-primary">
          {domainAssessmentForm.values.domainIndex ? `${domainAssessmentForm.values.domainIndex}. ` : ''}
          Domain: {domainAssessmentForm.values.name || `Domain ${currentDomainIndex + 1}`}
        </h3>

        <div className="tw-flex tw-items-center tw-gap-2">
          <button
            onClick={() => handleDomainChange("prev")}
            disabled={currentDomainIndex === 0}
            className="tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-full tw-border tw-border-gray-300 tw-text-gray-600 hover:tw-bg-gray-100 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-300"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          </button>
          <div className="tw-flex tw-items-center tw-justify-center tw-px-4 tw-py-1 tw-rounded-full tw-bg-blue-50 tw-text-blue-700 tw-font-medium tw-text-sm tw-border tw-border-blue-200">
            {currentDomainIndex + 1}/{transformedDomainData.length}
          </div>
          <button
            onClick={() => handleDomainChange("next")}
            disabled={currentDomainIndex === transformedDomainData.length - 1}
            className="tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-full tw-border tw-border-gray-300 tw-text-gray-600 hover:tw-bg-gray-100 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-300"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </button>
        </div>
      </div>

      <UncontrolledAccordion
        open="curriculum-goals"
        defaultOpen={["curriculum-goals", "competencies"]}
        stayOpen
      >
        <AccordionItem>
          <AccordionHeader tag="h5" targetId="curriculum-goals">
            <div className="d-flex align-items-center">
              <HugeiconsIcon
                icon={Target01Icon}
                size={24}
                className="me-2"
                style={{ color: "#0ab39c" }}
              />
              <div>
                <div className="fw-bold">Curricular Goals</div>
                <small className="text-muted">
                  Select relevant curricular goals for this domain
                </small>
              </div>
            </div>
          </AccordionHeader>
          <AccordionBody accordionId="curriculum-goals">
            <div className="d-flex flex-wrap gap-2">
              {domainAssessmentForm.values.curriculumGoals?.map((goal) => (
                <button
                  key={goal.id}
                  className={`btn ${goal.selected
                    ? "!tw-bg-[#0ab39c]/20 !tw-text-[#0ab39c] !tw-text-sm !tw-font-semibold !tw-rounded-full !tw-py-2 !tw-px-4 !tw-border !tw-border-[#0ab39c]"
                    : "tw-bg-white !tw-text-sm tw-text-gray-600 tw-border !tw-border-gray-300 !tw-rounded-full !tw-py-2 !tw-px-4"
                    } btn-sm`}
                  onClick={() => handleCurriculumGoalChange(goal.id)}
                  disabled={isViewMode}
                >
                  {goal.goalIndex ? `${goal.goalIndex}. ` : ''}{goal.title}
                </button>
              )) || <div className="text-muted">No curricular goals available</div>}
            </div>
          </AccordionBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader tag="h5" targetId="competencies">
            <div className="d-flex align-items-center">
              <HugeiconsIcon
                icon={StarIcon}
                size={24}
                className="me-2"
                style={{ color: "#D97705" }}
              />
              <div>
                <div className="fw-bold">Competency/Competencies</div>
                <small className="text-muted">
                  Specific competencies derived from selected curricular goals
                </small>
              </div>
            </div>
          </AccordionHeader>
          <AccordionBody accordionId="competencies">
            {domainAssessmentForm.values.curriculumGoals?.some(goal => goal.selected) ? (
              <div className="row">
                {filteredCompetencies.map((competency) => (
                  <div key={competency.id} className="col-md-6 mb-2">
                    <InputCheckbox
                      name={`competency-${competency.id}`}
                      labelName={`${competency.competencyIndex ? `${competency.competencyIndex}. ` : ''}${competency.title}`}
                      value={competency.selected}
                      onChange={() => handleCompetencyChange(competency.id)}
                      isDisabled={isViewMode}
                    />
                  </div>
                ))}
                {filteredCompetencies.length === 0 && (
                  <div className="text-muted">No competencies available for selected goals</div>
                )}
              </div>
            ) : (
              <div className="text-muted">Please select curricular goals first to see related competencies</div>
            )}
          </AccordionBody>
        </AccordionItem>
      </UncontrolledAccordion>
      <div className="tw-my-4 tw-flex tw-flex-col tw-items-end tw-gap-1">
        <button
          type="button"
          className="btn btn-primary tw-flex tw-items-center"
          onClick={handleAddActivity}
          disabled={isViewMode || !canAddMoreActivities}
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} className="me-2" />
          Add Activity
        </button>

        {!canAddMoreActivities && (
          <p className="text-muted tw-mb-0 tw-text-sm">
            Max {maxActivitiesAllowed} activities allowed
          </p>
        )}
      </div>
      {currentActivities.length > 0 && (
        <div className="tw-mb-4">
          <Nav
            tabs
            className="tw-border-b tw-border-gray-200 tw-flex tw-flex-nowrap tw-overflow-x-auto"
          >
            {currentActivities.map((_, index) => {
              const tabId = String(index);
              const isActive = tabId === activeTabId;

              return (
                <NavItem key={index} className="tw-whitespace-nowrap">
                  <NavLink
                    active={isActive}
                    aria-selected={isActive}
                    className={`tw-cursor-pointer tw-px-4 tw-py-2 tw-relative tw-transition
            ${isActive
                        ? "tw-border-b-2 tw-border-blue-500 tw-text-blue-600 tw-font-semibold"
                        : "tw-text-gray-600 hover:tw-text-gray-800"
                      }`}
                    onClick={() => setActiveActivityTab(index)}
                  >
                    Activity {index + 1}

                    {!isViewMode && currentActivities.length > 1 && (
                      <button
                        type="button"
                        className="tw-ml-2 tw-text-red-500 hover:tw-text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveActivity(index);
                        }}
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={14} />
                      </button>
                    )}
                  </NavLink>
                </NavItem>
              );
            })}
          </Nav>
          <TabContent activeTab={activeTabId} className="tw-mt-4">
            {activity && (
              <TabPane key={activeTabId} tabId={activeTabId}>
                <UncontrolledAccordion
                  defaultOpen={[
                    `activity-${activityIndex}-assessment`,
                    `activity-${activityIndex}-rubric`,
                    `activity-${activityIndex}-feedback`,
                    `activity-${activityIndex}-parent`,
                  ]}
                  stayOpen
                >
                  <AccordionItem>
                    <AccordionHeader tag="h5" targetId={`activity-${activityIndex}-assessment`}>
                      <div className="d-flex align-items-center">
                        <HugeiconsIcon icon={PlayCircle02Icon} size={24} className="me-2" style={{ color: "#21C55E" }} />
                        <div>
                          <div className="fw-bold">Assessment Activity</div>
                          <small className="text-muted">Select and add game for assessment activity</small>
                        </div>
                      </div>
                    </AccordionHeader>
                    <AccordionBody accordionId={`activity-${activityIndex}-assessment`}>
                      <div className="mb-3">
                        <SelectInput
                          name={`activity-${activityIndex}-type`}
                          value={activity.activityId || ""}
                          menuItems={
                            Array.isArray(domainAssessmentForm.values.assessmentActivity?.description)
                              ? domainAssessmentForm.values.assessmentActivity.description
                              : []
                          }
                          textKey="title"
                          valueKey="activityId"
                          labelText="Select Activity"
                          onChange={(e) => handleActivitySelection(activityIndex, e.target.value)}
                          isDisabled={isViewMode}
                        />
                      </div>
                      {activity.activityId && (
                        <>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6>Assessment Questions</h6>
                            <button
                              type="button"
                              className="!tw-bg-[#5DA1C8] !tw-text-white !tw-text-sm btn-sm !tw-rounded-lg !tw-px-6 !tw-py-2"
                              onClick={() => addQuestion(activityIndex)}
                              disabled={isViewMode}
                            >
                              <HugeiconsIcon icon={PlusSignIcon} size={14} className="me-2" style={{ color: "#ffffff" }} />
                              Add Q&A
                            </button>
                          </div>
                          <FormikProvider value={domainAssessmentForm}>
                            {activity.questions?.map((question: any, questionIndex: number) => (
                              <div key={`question-${activityIndex}-${questionIndex}-${question.id}`} className="mb-3">
                                <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5 position-relative">
                                  {questionIndex !== 0 && (
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white position-absolute"
                                      onClick={() => {
                                        const updatedQuestions = activity.questions.filter((_: any, idx: number) => idx !== questionIndex);
                                        updateActivityField(activityIndex, "questions", updatedQuestions);
                                      }}
                                      disabled={isViewMode}
                                      style={{ top: "5px", right: "10px", zIndex: 1 }}
                                    >
                                      <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />
                                    </button>
                                  )}
                                  <div className="mb-3">
                                    <label className="form-label fw-bold">
                                      {questionIndex === 0 ? "1. Question" : `${questionIndex + 1}. Question`}
                                    </label>
                                    <TextInput
                                      name={`activity-${activityIndex}-question-${questionIndex}`}
                                      value={question.question}
                                      onChange={(e) => {
                                        const updatedQuestions = [...activity.questions];
                                        updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], question: e.target.value };
                                        updateActivityField(activityIndex, "questions", updatedQuestions);
                                      }}
                                      placeHolder="Enter question"
                                      isDisabled={isViewMode}
                                      formgroupClassName="mb-0"
                                      maxLength={500}
                                    />
                                  </div>
                                  <div>
                                    <label className="form-label fw-bold">Answer</label>
                                    <TextArea
                                      name={`activity-${activityIndex}-answer-${questionIndex}`}
                                      value={question.answer}
                                      onChange={(e) => {
                                        const updatedQuestions = [...activity.questions];
                                        updatedQuestions[questionIndex] = { ...updatedQuestions[questionIndex], answer: e.target.value };
                                        updateActivityField(activityIndex, "questions", updatedQuestions);
                                      }}
                                      placeHolder="Enter answer"
                                      isDisabled={isViewMode}
                                      formgroupClassName="mb-0"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </FormikProvider>
                        </>
                      )}
                    </AccordionBody>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionHeader tag="h5" targetId={`activity-${activityIndex}-rubric`}>
                      <div className="d-flex align-items-center">
                        <HugeiconsIcon icon={TaskDone02Icon} size={24} className="me-2" style={{ color: "#9333EA" }} />
                        <div>
                          <div className="fw-bold">Assessment Rubric</div>
                          <small className="text-muted">Evaluate understanding using three levels of proficiency</small>
                        </div>
                      </div>
                    </AccordionHeader>

                    <AccordionBody accordionId={`activity-${activityIndex}-rubric`}>
                      <div className="column">
                        <RubricSection
                          activityIndex={activityIndex}
                          sectionType="awareness"
                          icon={ViewIcon}
                          iconColor="#5DA1C8"
                          title="Awareness"
                          isViewMode={!!isViewMode}
                          rubricData={awarenessRubrics}
                          currentLevel={currentRubric?.awareness?.level || "stream"}
                          notesValue={currentRubric?.awareness?.notes || ""}
                          onChangeLevel={(level, notes) => handleRubricChange(activityIndex, "awareness", level, notes)}
                          onChangeNotes={(notes) =>
                            handleRubricChange(
                              activityIndex,
                              "awareness",
                              currentRubric?.awareness?.level || "stream",
                              notes
                            )
                          }
                        />

                        <RubricSection
                          activityIndex={activityIndex}
                          sectionType="sensitivity"
                          icon={FavouriteIcon}
                          iconColor="#EF4444"
                          title="Sensitivity"
                          isViewMode={!!isViewMode}
                          rubricData={sensitivityRubrics}
                          currentLevel={currentRubric?.sensitivity?.level || "stream"}
                          notesValue={currentRubric?.sensitivity?.notes || ""}
                          onChangeLevel={(level, notes) => handleRubricChange(activityIndex, "sensitivity", level, notes)}
                          onChangeNotes={(notes) =>
                            handleRubricChange(
                              activityIndex,
                              "sensitivity",
                              currentRubric?.sensitivity?.level || "stream",
                              notes
                            )
                          }
                        />

                        <RubricSection
                          activityIndex={activityIndex}
                          sectionType="creativity"
                          icon={PaintBoardIcon}
                          iconColor="#F59E0B"
                          title="Creativity"
                          isViewMode={!!isViewMode}
                          rubricData={creativityRubrics}
                          currentLevel={currentRubric?.creativity?.level || "stream"}
                          notesValue={currentRubric?.creativity?.notes || ""}
                          onChangeLevel={(level, notes) => handleRubricChange(activityIndex, "creativity", level, notes)}
                          onChangeNotes={(notes) =>
                            handleRubricChange(
                              activityIndex,
                              "creativity",
                              currentRubric?.creativity?.level || "stream",
                              notes
                            )
                          }
                        />
                      </div>
                    </AccordionBody>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionHeader tag="h5" targetId={`activity-${activityIndex}-feedback`}>
                      <div className="d-flex align-items-center">
                        <HugeiconsIcon icon={TeachingIcon} size={24} className="me-2 text-primary" />
                        <div>
                          <div className="fw-bold">Teacher's Feedback</div>
                          <small className="text-muted">Comprehensive assessment observations</small>
                        </div>
                      </div>
                    </AccordionHeader>

                    <AccordionBody accordionId={`activity-${activityIndex}-feedback`}>
                      <div className="column">
                        <div className="col-md-12 mb-3">
                          <TextInput
                            name={`activity-${activityIndex}-teacherNotes`}
                            labelText="Observational Notes"
                            value={activity.teacherFeedback?.notes || ""}
                            onChange={(e) => {
                              updateActivityField(activityIndex, 'teacherFeedback', {
                                ...activity.teacherFeedback,
                                notes: e.target.value
                              });
                            }}
                            isDisabled={isViewMode}
                            maxLength={500}
                          />
                        </div>

                        <div className="col-md-12 mb-3">
                          <div className="border !tw-rounded-lg p-3 !tw-bg-blue-50">
                            <div className="d-flex align-items-center mb-3">
                              <HugeiconsIcon
                                icon={Mortarboard02Icon}
                                size={24}
                                className="me-2 text-success"
                              />
                              <h6 className="mb-0 fw-bold">Self Assessment</h6>
                            </div>

                            <div className="row">
                              <div className="col-12 col-lg-7 mb-3 mb-lg-0">
                                <AssessmentQuestions
                                  likedWorkValue={activity.selfAssessment?.likedWork || 'dont_know'}
                                  foundEasyValue={activity.selfAssessment?.foundEasy || 'dont_know'}
                                  onLikedWorkChange={(value) =>
                                    updateActivityField(activityIndex, 'selfAssessment', {
                                      ...activity.selfAssessment,
                                      likedWork: value
                                    })
                                  }
                                  onFoundEasyChange={(value) =>
                                    updateActivityField(activityIndex, 'selfAssessment', {
                                      ...activity.selfAssessment,
                                      foundEasy: value
                                    })
                                  }
                                  isViewMode={isViewMode}
                                  prefix={`self-${activityIndex}`}
                                />
                              </div>

                              <div className="col-12 col-lg-5">
                                <div className="!tw-flex !tw-gap-4 mb-4">
                                  <div className="tw-border-r-4 tw-border-gray-300 tw-rounded-full"></div>
                                  <div className="mb-0">
                                    <label className="form-label fw-bold">
                                      To do this work, I needed. (Can choose one or more)
                                    </label>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                      {helpOptions.map((option) => (
                                        <button
                                          key={option.id}
                                          className={`btn ${activity.selfAssessment?.neededHelp?.includes(option.id)
                                            ? "!tw-bg-[#0ab39c]/20 !tw-text-[#0ab39c] !tw-text-sm !tw-font-semibold !tw-rounded-full !tw-py-2 !tw-px-4 !tw-border !tw-border-[#0ab39c]"
                                            : "tw-bg-white !tw-text-sm tw-text-gray-600 tw-border !tw-border-gray-300 !tw-rounded-full !tw-py-2 !tw-px-4"
                                            } btn-sm`}
                                          onClick={() => {
                                            const currentNeededHelp = activity.selfAssessment?.neededHelp || [];
                                            const updatedHelp = currentNeededHelp.includes(option.id)
                                              ? currentNeededHelp.filter((h) => h !== option.id)
                                              : [...currentNeededHelp, option.id];
                                            updateActivityField(activityIndex, 'selfAssessment', {
                                              ...activity.selfAssessment,
                                              neededHelp: updatedHelp
                                            });
                                          }}
                                          disabled={isViewMode}
                                        >
                                          {option.name}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-12 mb-0">
                          <div className="border !tw-rounded-lg p-3 !tw-bg-red-50">
                            <div className="d-flex align-items-center mb-3">
                              <HugeiconsIcon
                                icon={UserMultiple03Icon}
                                size={24}
                                className="me-2 text-warning"
                              />
                              <h6 className="mb-0 fw-bold">Peer Assessment</h6>
                            </div>

                            <div className="row">
                              <div className="col-12 col-lg-7 mb-3 mb-lg-0">
                                <AssessmentQuestions
                                  likedWorkValue={activity.peerAssessment?.likedWork || 'dont_know'}
                                  foundEasyValue={activity.peerAssessment?.foundEasy || 'dont_know'}
                                  onLikedWorkChange={(value) =>
                                    updateActivityField(activityIndex, 'peerAssessment', {
                                      ...activity.peerAssessment,
                                      likedWork: value
                                    })
                                  }
                                  onFoundEasyChange={(value) =>
                                    updateActivityField(activityIndex, 'peerAssessment', {
                                      ...activity.peerAssessment,
                                      foundEasy: value
                                    })
                                  }
                                  isViewMode={isViewMode}
                                  prefix={`peer-${activityIndex}`}
                                />
                              </div>

                              <div className="col-12 col-lg-5">
                                <div className="!tw-flex !tw-gap-4 mb-4">
                                  <div className="tw-border-r-4 tw-border-gray-300 tw-rounded-full"></div>
                                  <div className="mb-0">
                                    <label className="form-label fw-bold">
                                      To do this work, I needed. (Can choose one or more)
                                    </label>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                      {helpOptions.map((option) => (
                                        <button
                                          key={option.id}
                                          className={`btn ${activity.peerAssessment?.neededHelp?.includes(option.id)
                                            ? "!tw-bg-[#0ab39c]/20 !tw-text-[#0ab39c] !tw-text-sm !tw-font-semibold !tw-rounded-full !tw-py-2 !tw-px-4 !tw-border !tw-border-[#0ab39c]"
                                            : "tw-bg-white !tw-text-sm tw-text-gray-600 tw-border !tw-border-gray-300 !tw-rounded-full !tw-py-2 !tw-px-4"
                                            } btn-sm`}
                                          onClick={() => {
                                            const currentNeededHelp = activity.peerAssessment?.neededHelp || [];
                                            const updatedHelp = currentNeededHelp.includes(option.id)
                                              ? currentNeededHelp.filter((h) => h !== option.id)
                                              : [...currentNeededHelp, option.id];
                                            updateActivityField(activityIndex, 'peerAssessment', {
                                              ...activity.peerAssessment,
                                              neededHelp: updatedHelp
                                            });
                                          }}
                                          disabled={isViewMode}
                                        >
                                          {option.name}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionBody>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionHeader tag="h5" targetId={`activity-${activityIndex}-parent`}>
                      <div className="d-flex align-items-center">
                        <HugeiconsIcon icon={Home03Icon} size={24} className="me-2" style={{ color: "#17A34A" }} />
                        <div>
                          <div className="fw-bold">Parent Observation</div>
                          <small className="text-muted">Home environment and parent feedback</small>
                        </div>
                      </div>
                    </AccordionHeader>
                    <AccordionBody accordionId={`activity-${activityIndex}-parent`}>
                      <div className="mb-3">
                        <label className="form-label !tw-font-bold !tw-text-base !tw-text-gray-700 !tw-mb-4">
                          Available Home Learning Resources
                        </label>
                        <div className="row">
                          {activity.parentObservation?.homeResources?.map((resource) => (
                            <div key={resource.id} className="col-md-3 mb-2">
                              <InputCheckbox
                                name={`activity-${activityIndex}-resource-${resource.id}`}
                                labelName={resource.name}
                                value={resource.selected}
                                onChange={() => handleHomeResourceChange(activityIndex, resource.id)}
                                isDisabled={isViewMode}
                              />
                            </div>
                          )) || <div className="text-muted">No resources available</div>}
                        </div>
                      </div>
                      <TextInput
                        name={`activity-${activityIndex}-parentOvservationOthers`}
                        labelText="Any other (Specify)"
                        value={activity.parentObservation?.parentOvservationOthers || ""}
                        onChange={(e) => {
                          updateActivityField(activityIndex, 'parentObservation', {
                            ...activity.parentObservation,
                            parentOvservationOthers: e.target.value
                          });
                        }}
                        isDisabled={isViewMode}
                        maxLength={50}
                      />
                      <TextInput
                        name={`activity-${activityIndex}-parentNotes`}
                        labelText="Comments / Remarks"
                        value={activity.parentObservation?.notes || ""}
                        onChange={(e) => {
                          updateActivityField(activityIndex, 'parentObservation', {
                            ...activity.parentObservation,
                            notes: e.target.value
                          });
                        }}
                        isDisabled={isViewMode}
                        maxLength={500}
                      />
                    </AccordionBody>
                  </AccordionItem>
                </UncontrolledAccordion>
              </TabPane>
            )}
          </TabContent>
        </div>
      )}

      {!isViewMode && (
        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-between">
            <div>
              <button
                type="button"
                color="outline-secondary"
                className="me-2"
                onClick={() => handleDomainChange("prev")}
                disabled={currentDomainIndex === 0}
              >
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  size={16}
                  className="me-1"
                />
                Previous Domain
              </button>
              <button
                type="button"
                className="btn btn-outline-primary fs-12 px-3"
                onClick={handlePrevious}
                disabled={stepId === "generalInformation"}
              >
                <HugeiconsIcon
                  icon={CircleArrowLeft01Icon}
                  size={20}
                  color="currentColor"
                  className="!tw-mr-1"
                />
                Previous Step
              </button>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleNextDomain}
              >
                {currentDomainIndex === transformedDomainData.length - 1 ? "Next Step" : "Next Domain"}{" "}
                <HugeiconsIcon
                  icon={CircleArrowRight01Icon}
                  size={20}
                  color="currentColor"
                  className="!tw-ml-1"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainAssessment;