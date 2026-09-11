import { useEffect, useRef, useState } from "react";
import { MultiSelectCheckbox, SelectInput, TextArea, TextInput } from "../../../../../Components/Common";
import UpdatedHorizontalTab from "../../../../../Components/Common/UpdatedHorizontalTab";
import { renderOptionsWeek, renderValueWeek } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
// import { saveInlineBuilderGridAct } from "../../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getWeeksListAct, saveSubjectCurriculumBuildAct } from "../../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { toast } from "react-toastify";


const teachingStatus = [
  { value: "1", label: "Approved" },
  { value: "2", label: "Draft" },
  { value: "3", label: "Pending" },
];

const assessmentTypeList = [
  { value: "1", label: "Approved" },
  { value: "2", label: "Draft" },
  { value: "3", label: "Pending" },
];

const initialValues = {
  chapterCode: "",
  chapterName: "",
  weeks: [],
  unitId: "",
  prerequisites: "",
  assessmentType: "",
  objectives: "",
  unitCode: "",
  unitName: "",
  term: "",
  weight: "",
  hours: "",
  status: "",
  chapterId: "",
  topicCode: "",
  topicName: "",
  sessions: "",
  minutesPerSession: "",
};

export const AdvanceFilterModal = ({ 
  activeIdMain, 
  closeHndlr, 
  rowData,
  subjectCurriculumId ,
  filterData
}: any) => {
  const dispatch = useAppDispatch();
  const [activeId, setActiveId] = useState("summary");
  const [advanceFilterState, setAdvanceFilterState] = useState<typeof initialValues>(initialValues);

  const {
    getCurriculumStructureResp,
    getWeeksListResp,
    getAcademicTermDetailsListResp,
    saveSubjectCurriculumBuildResp,
    lmsdigitalcurriculumErrorAct,
    currentBranchIdResp: branchId
  } = useAppSelector(
    ({ lmsdigitalcurriculum, lmsSettings, appData }) => ({
      getCurriculumStructureResp: lmsdigitalcurriculum.getCurriculumStructureResp,
      getWeeksListResp: lmsdigitalcurriculum.getWeeksListResp,
      getAcademicTermDetailsListResp: lmsSettings.getAcademicTermDetailsListResp,
      saveSubjectCurriculumBuildResp: lmsdigitalcurriculum.saveSubjectCurriculumBuildResp,
      lmsdigitalcurriculumErrorAct: lmsdigitalcurriculum.lmsdigitalcurriculumErrorAct,
      currentBranchIdResp: appData.currentBranchIdResp,

    }),
    shallowEqual
  );
  
  useEffect(() => {
    if (rowData) {
      const buildDTO = getCurriculumStructureResp?.subjectCurriculumBuildDTO;
      
      if (activeIdMain == "units") {
        
        const unit = buildDTO?.unitsBuild?.find((u: any) => u.unitId === rowData.unitId);
        if (unit) {
          setAdvanceFilterState({
            ...initialValues,
            unitCode: unit.unitNo || "",
            unitName: unit.unitName || "",
            term: unit.termId ? String(unit.termId) : "",
            weeks: unit.weeks || [],
            weight: unit.weightage || "",
            hours: unit.plannedTeachingHours ? String(unit.plannedTeachingHours) : "",
            status: "",
          });
        }
      } else if (activeIdMain === "chapters") {
        const unit = buildDTO?.unitsBuild?.find((u: any) => 
          u.chaptersBuild?.some((ch: any) => ch.chapterId === rowData.chapterId)
        );
        const chapter = unit?.chaptersBuild?.find((ch: any) => ch.chapterId === rowData.chapterId);
        
        if (chapter) {
          setAdvanceFilterState({
            ...initialValues,
            chapterCode: chapter.chapterNo || "",
            chapterName: chapter.chapterName || "",
            weeks: chapter.weeks || [],
            unitId: unit ? String(unit.unitId) : "",
            hours: chapter.plannedTeachingHours ? String(chapter.plannedTeachingHours) : "",
          });
        }
      } else if (activeIdMain === "topics") {
        let foundTopic: any = null;
        let foundChapter: any = null;
        let foundUnit: any = null;

        buildDTO?.unitsBuild?.forEach((u: any) => {
          u.chaptersBuild?.forEach((ch: any) => {
            const topic = ch.topicsBuild?.find((t: any) => t.topicId === rowData.topicId);
            if (topic) {
              foundTopic = topic;
              foundChapter = ch;
              foundUnit = u;
            }
          });
        });

        if (foundTopic) {
          setAdvanceFilterState({
            ...initialValues,
            topicCode: foundTopic.topicNo || "",
            topicName: foundTopic.topicName || "",
            weeks: foundTopic.weeks || [],
            unitId: foundUnit ? String(foundUnit.unitId) : "",
            chapterId: foundChapter ? String(foundChapter.chapterId) : "",
            sessions: foundTopic.totalSessions ? String(foundTopic.totalSessions) : "",
            minutesPerSession: foundTopic.minPerSession ? String(foundTopic.minPerSession) : "",
          });
        }
      }
    }
  }, [rowData, activeIdMain, getCurriculumStructureResp]);

  const MenuOptions = [
    { id: "summary", labelName: "Summary", customPadding: "" },
    { id: "pedagogy", labelName: "Pedagogy", customPadding: "" },
    { id: "analytics", labelName: "Analytics", customPadding: "" },
  ];

  const clickMenuHandler = (e: any) =>
    setActiveId(e.currentTarget.getAttribute("data-id"));

  const onChangeFilterHndlr = (e: any) => {
    const { name, value } = e.target;
    setAdvanceFilterState((prev) => ({
      ...prev,
      [name]: value,
    }));
    if(name == "term") {      
      setAdvanceFilterState((prev) => ({
        ...prev,
        [name]: value,
      }))
      if (filterData.academicYearId) {        
                const { academicYearId } = filterData;
                dispatch(getWeeksListAct(generateActionPayload("get_weeks_list", undefined, { branchId, academicYearId, termId: value })));
            }
    }
  };

  function selectWeekHandler(selectedOptions: any[], config: { name: string }) {
    const { name } = config;
    setAdvanceFilterState((prevState: any) => ({
      ...prevState,
      [name]: Array.isArray(selectedOptions) ? selectedOptions : []
    }));
  }

  const buildSavePayload = () => {
    const buildDTO = getCurriculumStructureResp?.subjectCurriculumBuildDTO;
    
    if (!buildDTO) return null;

    const updatedUnitsBuild = JSON.parse(JSON.stringify(buildDTO.unitsBuild));

    if (activeIdMain === "units") {
      
      const unitIndex = updatedUnitsBuild.findIndex((u: any) => +u.unitId === +rowData.unitId);
      
      if (unitIndex !== -1) {
        updatedUnitsBuild[unitIndex] = {
          ...updatedUnitsBuild[unitIndex],
          unitNo: advanceFilterState.unitCode,
          unitName: advanceFilterState.unitName,
          termId: advanceFilterState.term ? parseInt(advanceFilterState.term) : null,
          termName: getAcademicTermDetailsListResp?.find((t: any) => t.id === parseInt(advanceFilterState.term))?.termName || null,
          weeks: advanceFilterState.weeks,
          plannedTeachingHours: advanceFilterState.hours ? parseFloat(advanceFilterState.hours) : null,
          weightage: advanceFilterState.weight || null,
        };
      }
    } else if (activeIdMain === "chapters") {
      updatedUnitsBuild.forEach((unit: any) => {
        const chapterIndex = unit.chaptersBuild?.findIndex((ch: any) => ch.chapterId === rowData.chapterId);
        if (chapterIndex !== -1) {
          unit.chaptersBuild[chapterIndex] = {
            ...unit.chaptersBuild[chapterIndex],
            chapterNo: advanceFilterState.chapterCode,
            chapterName: advanceFilterState.chapterName,
            weeks: advanceFilterState.weeks,
            plannedTeachingHours: advanceFilterState.hours ? parseFloat(advanceFilterState.hours) : null,
          };
        }
      });
    } else if (activeIdMain === "topics") {
      updatedUnitsBuild.forEach((unit: any) => {
        unit.chaptersBuild?.forEach((chapter: any) => {
          const topicIndex = chapter.topicsBuild?.findIndex((t: any) => t.topicId === rowData.topicId);
          if (topicIndex !== -1) {
            chapter.topicsBuild[topicIndex] = {
              ...chapter.topicsBuild[topicIndex],
              topicNo: advanceFilterState.topicCode,
              topicName: advanceFilterState.topicName,
              weeks: advanceFilterState.weeks,
              totalSessions: advanceFilterState.sessions ? parseInt(advanceFilterState.sessions) : null,
              minPerSession: advanceFilterState.minutesPerSession ? parseInt(advanceFilterState.minutesPerSession) : null,
            };
          }
        });
      });
    }    

    return {
      unitsBuild: updatedUnitsBuild
    };
  };

  const handleSave = () => {
    
    const payload = buildSavePayload();    
    if (payload) {
      dispatch(saveSubjectCurriculumBuildAct(generateActionPayload("save_subject_curriculum_builder",{ subjectCurriculumId },payload)));
    }
  };

  const AnalyticsSection = () => {
    return (
      <div className="tw-space-y-6 tw-mt-2">
        <div>
          {activeIdMain === "units" && (
          <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700 tw-mb-1">
            <span>Hours Utilisation</span>
            <span className="tw-font-semibold">100%</span>
          </div>
          )}
          {activeIdMain === "chapters" && (
          <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700 tw-mb-1">
            <span>Hours vs Plan</span>
            <span className="tw-font-semibold">4h / 4h</span>
          </div>
          )}
          {activeIdMain === "topics" && (
          <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700 tw-mb-1">
            <span>Hours vs Plan</span>
            <span className="tw-font-semibold">4h / 4h</span>
          </div>
          )}
          <div className="tw-h-2 tw-rounded-full tw-bg-gray-200">
            <div className="tw-h-2 tw-rounded-full tw-bg-emerald-500" style={{ width: "100%" }}></div>
          </div>
        </div>
        <div>
          {activeIdMain === "units" && (
          <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700 tw-mb-1">
            <span>Weightage Assigned</span>
            <span className="tw-font-semibold">13% of 13%</span>
          </div>
          )}
          {activeIdMain === "chapters" && (
          <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700 tw-mb-1">
            <span>Topics Planned</span>
            <span className="tw-font-semibold">4 / 4</span>
          </div>
          )}
          {activeIdMain === "topics" && (
          <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700 tw-mb-1">
            <span>Topics Planned</span>
            <span className="tw-font-semibold">4 / 4</span>
          </div>
          )}
          <div className="tw-h-2 tw-rounded-full tw-bg-gray-200">
            <div className="tw-h-2 tw-rounded-full tw-bg-emerald-500" style={{ width: "100%" }}></div>
          </div>
        </div>
        <div>
          {activeIdMain === "units" && (
          <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700 tw-mb-1">
            <span>LO Coverage</span>
            <span className="tw-font-semibold">50%</span>
          </div>
          )}
          {activeIdMain === "chapters" && (
          <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700 tw-mb-1">
            <span>Assessment Mapping</span>
            <span className="tw-font-semibold">2 mappings</span>
          </div>
          )}
          {activeIdMain === "topics" && (
          <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700 tw-mb-1">
            <span>LO Coverage</span>
            <span className="tw-font-semibold">50%</span>
          </div>
          )}
          <div className="tw-h-2 tw-rounded-full tw-bg-gray-200">
            <div className="tw-h-2 tw-rounded-full tw-bg-amber-500" style={{ width: "45%" }}></div>
          </div>
        </div>

      </div>
    );
  };

  useEffect(() => {
  if (advanceFilterState.term && filterData?.academicYearId && branchId) {
    dispatch(
      getWeeksListAct(
        generateActionPayload("get_weeks_list", undefined, {
          branchId,
          academicYearId: filterData.academicYearId,
          termId: advanceFilterState.term
        })
      )
    );
  }
}, [advanceFilterState.term, filterData?.academicYearId, branchId]);


function onSearchMultiSelectHandlerWeek(searchText: string) {
  
}

  return (
    <>
      <div className="offcanvas-body">
        <div className="mb-3">
          <UpdatedHorizontalTab
            MenuOptions={MenuOptions}
            clickMenuHandler={clickMenuHandler}
            activeTabId={activeId}
            showBadge={false}
            horizontalClass="horizontal-menu-pill-tabs tw-w-fit"
          />
        </div>
        {activeIdMain === "units" && activeId === "summary" && (
          <>
            <TextInput
              name="unitCode"
              value={advanceFilterState.unitCode || ""}
              onChange={onChangeFilterHndlr}
              formgroupClassName="mb-3"
              placeholder="U1"
              labelText="Unit Code"
              isDisabled
            />
            <TextInput
              name="unitName"
              value={advanceFilterState.unitName || ""}
              onChange={onChangeFilterHndlr}
              formgroupClassName="mb-3"
              placeholder="Unit Name"
              labelText="Unit Name"
              isDisabled
            />
            <SelectInput
              name="term"
              value={advanceFilterState.term || ""}
              onChange={onChangeFilterHndlr}
              menuItems={getAcademicTermDetailsListResp || []}
              valueKey="id"
              textKey="termName"
              formgroupClassName="mb-3"
              labelText="Term"
            />
            <MultiSelectCheckbox
              name="weeks"
              labelText="Weeks"
              containerClassName="mb-3"
              idKey="weekName"
              value={advanceFilterState.weeks}
              renderValue={renderValueWeek}
              renderOptions={renderOptionsWeek}
              onChange={selectWeekHandler}
              onSearchHandler={onSearchMultiSelectHandlerWeek}
              options={getWeeksListResp?.weeksDetails || []}
            />
            <div className="tw-font-semibold tw-mb-2">Teaching Parameters :</div>
            <TextInput
              name="weight"
              value={advanceFilterState.weight || ""}
              onChange={onChangeFilterHndlr}
              formgroupClassName="mb-3"
              placeholder="13"
              labelText="Weightage (%)"
            />
            <TextInput
              name="hours"
              value={advanceFilterState.hours || ""}
              onChange={onChangeFilterHndlr}
              formgroupClassName="mb-3"
              placeholder="6"
              labelText="Planned Teaching Hours"
            />
            {/* <SelectInput
              name="status"
              value={advanceFilterState.status || ""}
              onChange={onChangeFilterHndlr}
              menuItems={teachingStatus}
              valueKey="value"
              textKey="label"
              formgroupClassName="mb-3"
              labelText="Status"
            /> */}
          </>
        )}
        
        {activeIdMain === "chapters" && activeId === "summary" && (
          <>
            <TextInput
              name="chapterCode"
              value={advanceFilterState.chapterCode}
              onChange={onChangeFilterHndlr}
              formgroupClassName="mb-3"
              labelText="Chapter Code"
              isDisabled
            />
            <TextInput
              name="chapterName"
              value={advanceFilterState.chapterName}
              onChange={onChangeFilterHndlr}
              formgroupClassName="mb-3"
              labelText="Chapter Name"
              isDisabled
            />
            <MultiSelectCheckbox
              name="weeks"
              labelText="Weeks"
              containerClassName="mb-3"
              idKey="weekName"
              value={advanceFilterState.weeks}
              renderValue={renderValueWeek}
              renderOptions={renderOptionsWeek}
              onChange={selectWeekHandler}
              onSearchHandler={onSearchMultiSelectHandlerWeek}
              options={getWeeksListResp?.weeksDetails || []}
            />
            <TextInput
              name="hours"
              value={advanceFilterState.hours || ""}
              onChange={onChangeFilterHndlr}
              formgroupClassName="mb-3"
              placeholder="4"
              labelText="Planned Teaching Hours"
            />
          </>
        )}
        
        {activeIdMain === "topics" && activeId === "summary" && (
          <>
            <TextInput
              name="topicCode"
              value={advanceFilterState.topicCode}
              onChange={onChangeFilterHndlr}
              formgroupClassName="mb-3"
              labelText="Topic Code"
              isDisabled
            />
            <TextInput
              name="topicName"
              value={advanceFilterState.topicName}
              onChange={onChangeFilterHndlr}
              formgroupClassName="mb-3"
              labelText="Topic Name"
              isDisabled
            />
            <MultiSelectCheckbox
              name="weeks"
              labelText="Weeks"
              containerClassName="mb-3"
              idKey="weekName"
              value={advanceFilterState.weeks}
              renderValue={renderValueWeek}
              renderOptions={renderOptionsWeek}
              onChange={selectWeekHandler}
              onSearchHandler={onSearchMultiSelectHandlerWeek}
              options={getWeeksListResp?.weeksDetails || []}
            />
            <TextInput
              name="sessions"
              value={advanceFilterState.sessions || ""}
              onChange={onChangeFilterHndlr}
              formgroupClassName="mb-3"
              placeholder="2"
              labelText="Total Sessions"
            />
            <TextInput
              name="minutesPerSession"
              value={advanceFilterState.minutesPerSession || ""}
              onChange={onChangeFilterHndlr}
              formgroupClassName="mb-3"
              placeholder="45"
              labelText="Minutes per Session"
            />
          </>
        )}
        
        {activeId === "pedagogy" && (
          <>
            <TextInput
              name="prerequisites"
              value={advanceFilterState.prerequisites}
              onChange={onChangeFilterHndlr}
              formgroupClassName="mb-3"
              placeholder="W1, W2"
              labelText="Prerequisites"
            />
            <SelectInput
              name="assessmentType"
              value={advanceFilterState.assessmentType}
              onChange={onChangeFilterHndlr}
              menuItems={assessmentTypeList}
              valueKey="value"
              textKey="label"
              formgroupClassName="mb-3"
              labelText="Assessment Type"
            />
            <TextArea
              name="objectives"
              value={advanceFilterState.objectives}
              onChange={onChangeFilterHndlr}
              formgroupClassName="mb-3"
              labelText="Objectives"
            />
          </>
        )}
        
        {activeId === "analytics" && <AnalyticsSection />}
      </div>
      
      <div className="border-top p-2 text-center">
        <div className="hstack gap-2 justify-content-end">
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-success"
          >
            Approve
          </button>
        </div>
      </div>
    </>
  );
};