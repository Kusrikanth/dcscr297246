import React, { useMemo, useState } from "react";
import PerformanceFilters from "./PerformanceFilters";
import PerformanceKpis from "./PerformanceKpis";
import PerformanceTrendChart from "./PerformanceTrendChart";
import YearComparisonCard from "./YearComparisonCard";
import ExamSubjectHeatmap from "./ExamSubjectHeatmap";
import ClassComparisonCard from "./ClassComparisonCard";
import SubjectWisePerformance from "./SubjectWisePerformance";
import ExaminationPerformance from "./ExaminationPerformance";
import {
  academicYearsList,
  examColumns,
  subjectResults,
  subjectYearRows,
  yearAverage,
  yearImprovement,
} from "./helper";



const initialFilterState = {
  academicYear:"",
  subject: "",
  exam: "",
};

const AcademicPerformance = () => {
  const [filterState, setFilterState] = useState({
    ...initialFilterState,
  });

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilterState((prevState) => ({ ...prevState, [name]: value }));
  }

  const visibleSubjects = useMemo(
    () =>
      filterState.subject === "All Subjects"
        ? subjectResults
        : subjectResults.filter((row) => row.subject === filterState.subject),
    [filterState.subject]
  );

  const visibleExams = useMemo(
    () =>
      filterState.exam === "All Exams"
        ? examColumns
        : examColumns.filter((item) => item.label === filterState.exam),
    [filterState.exam]
  );

  const visibleYearRows = useMemo(
    () =>
      filterState.subject === "All Subjects"
        ? subjectYearRows
        : subjectYearRows.filter((row) => row.subject === filterState.subject),
    [filterState.subject]
  );

  const overall = useMemo(
    () => yearAverage(filterState.academicYear),
    [filterState.academicYear]
  );

  const improvement = useMemo(
    () => yearImprovement(filterState.academicYear),
    [filterState.academicYear]
  );

  return (
    <>
      <PerformanceFilters
        filterState={filterState}
        onChange={onChangeFilterHndlr}
      />

      <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-4">
        <PerformanceKpis
          academicYear={filterState.academicYear}
          overall={overall}
          improvement={improvement}
        />

        <div className="tw-col-span-12 xl:tw-col-span-6">
          <div className="tw-card tw-mb-0 tw-h-full">
            <div className="tw-card-header">
              <h4 className="tw-card-title">
                Overall academic performance
              </h4>
              <p className="tw-card-subTitle">
                Year-on-year aggregate against class average
              </p>
            </div>
            <div className="tw-card-body">
              <PerformanceTrendChart />
            </div>
          </div>
        </div>

        <div className="tw-col-span-12 xl:tw-col-span-6">
          <YearComparisonCard />
        </div>

        <div className="tw-col-span-12 xl:tw-col-span-6">
          <ExamSubjectHeatmap
            subjects={visibleSubjects}
            exams={visibleExams}
          />
        </div>

        <div className="tw-col-span-12 xl:tw-col-span-6">
          <ClassComparisonCard subjects={visibleSubjects} />
        </div>
      </div>

      <SubjectWisePerformance subjects={visibleYearRows} />

      <ExaminationPerformance
        academicYear={filterState.academicYear}
        subjects={visibleYearRows}
        exams={visibleExams}
      />
    </>
  );
};

export default AcademicPerformance;
