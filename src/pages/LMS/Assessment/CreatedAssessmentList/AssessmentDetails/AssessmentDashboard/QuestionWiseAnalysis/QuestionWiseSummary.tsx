import React from "react";

interface HeatmapItem {
  sectionId: number;
  sectionName: string;
  questionId: number;
  questionOrder: number;
  correctPercentage: number;
  correctStudentsCount: number;
  incorrectStudentsCount: number;
  questionTitle: string | null;
  questionDescription: string;
}

interface QuestionWiseSummaryProps {
  getAssessmentQuestionSectionHeatMapResp:
  | {
    getAssessmentQuestionSectionHeatMapResp: HeatmapItem[];
  }
  | HeatmapItem[];
  getStatsByAssessmentResp?: any;
}

const QuestionWiseSummary: React.FC<QuestionWiseSummaryProps> = ({
  getAssessmentQuestionSectionHeatMapResp,
}) => {
  // Handle both nested and direct array formats
  const data = Array.isArray(getAssessmentQuestionSectionHeatMapResp)
    ? getAssessmentQuestionSectionHeatMapResp
    : getAssessmentQuestionSectionHeatMapResp?.getAssessmentQuestionSectionHeatMapResp || [];

  const transformDataForGrid = (): {
    sections: string[];
    questions: number[];
    gridData: Record<string, Record<number, number>>;
  } => {
    if (!data || data.length === 0) {
      return { sections: [], questions: [], gridData: {} };
    }

    const sections: string[] = Array.from(
      new Set(data.map((item) => item.sectionName))
    ).sort((a, b) => a.localeCompare(b));

    const questions: number[] = Array.from(
      new Set(data.map((item) => item.questionOrder))
    ).sort((a, b) => a - b);

    const gridData: Record<string, Record<number, number>> = {};

    data.forEach((item) => {
      if (!gridData[item.sectionName]) {
        gridData[item.sectionName] = {};
      }
      gridData[item.sectionName][item.questionOrder] =
        item.correctPercentage != null
          ? Math.round(item.correctPercentage * 10) / 10
          : 0;
    });

    return { sections, questions, gridData };
  };

  const getColor = (percentage: number): string => {
    if (percentage === 0 || percentage < 25) return "#F8D7DA";
    if (percentage >= 25 && percentage < 50) return "#FFF3CD";
    if (percentage >= 50 && percentage < 75) return "#DBEAFE";
    if (percentage >= 75 && percentage <= 100) return "#D1FAE5";
    return "#F3F4F6";
  };

  const getTextColor = (percentage: number): string => {
    if (percentage === 0 || percentage < 25) return "#991B1B";
    if (percentage >= 25 && percentage < 50) return "#92400E";
    if (percentage >= 50 && percentage < 75) return "#1E40AF";
    if (percentage >= 75 && percentage <= 100) return "#059669";
    return "#111827";
  };

  const legendRanges = [
    { label: "0 – 24%", color: getColor(10), textColor: getTextColor(10) },
    { label: "25 – 49%", color: getColor(30), textColor: getTextColor(30) },
    { label: "50 – 74%", color: getColor(60), textColor: getTextColor(60) },
    { label: "75 – 100%", color: getColor(90), textColor: getTextColor(90) },
  ];

  const { sections, questions, gridData } = transformDataForGrid();

  const getSectionLabel = (sectionName?: string | null): string => {
    if (!sectionName) return "-";
    return sectionName.split("-")[1] || sectionName;
  };

  return (
    <div style={{ padding: "20px" }}>
      {sections.length > 0 && questions.length > 0 ? (
        <>
          <div
            style={{
              overflowX: questions.length > 10 ? "auto" : "visible",
              overflowY: sections.length > 5 ? "auto" : "visible",
              maxHeight: sections.length > 5 ? "400px" : "auto",
            }}
          >
            {/* Header Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `60px repeat(${questions.length}, 1fr)`,
                gap: "4px",
                marginBottom: "4px",
                minWidth:
                  questions.length > 10
                    ? `${60 + questions.length * 60}px`
                    : "auto",
              }}
            >
              <div></div>
              {questions.map((q) => (
                <div
                  key={q}
                  style={{
                    textAlign: "center",
                    fontSize: "12px",
                    color: "#6c757d",
                    fontWeight: "500",
                    padding: "8px 0",
                  }}
                >
                  Q{q}
                </div>
              ))}
            </div>

            {/* Grid Body */}
            {sections.map((section) => (
              <div
                key={section}
                style={{
                  display: "grid",
                  gridTemplateColumns: `60px repeat(${questions.length}, 1fr)`,
                  gap: "4px",
                  marginBottom: "4px",
                  minWidth:
                    questions.length > 10
                      ? `${60 + questions.length * 60}px`
                      : "auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#495057",
                  }}
                >
                  {getSectionLabel(section)}
                </div>
                {questions.map((q) => {
                  const percentage = gridData[section]?.[q] ?? 0;
                  const color = getColor(percentage);
                  const textColor = getTextColor(percentage);
                  return (
                    <div
                      key={`${section}-${q}`}
                      style={{
                        backgroundColor: color,
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "36px",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: textColor,
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                      title={`Section: ${section}, Question: ${q}, Correct: ${percentage}%`}
                    >
                      {percentage}%
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "20px",
              paddingTop: "16px",
              borderTop: "1px solid #E5E7EB",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#6c757d",
                fontWeight: 500,
              }}
            >
              Legend:
            </span>

            {legendRanges.map((range, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: "12px",
                  backgroundColor: range.color,
                  fontSize: "12px",
                  fontWeight: 600,
                  color: range.textColor,
                  padding: "4px 12px",
                }}
              >
                {range.label}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
            color: "#6c757d",
          }}
        >
          <p style={{ margin: 0 }}>No data available for Heatmap</p>
        </div>
      )}
    </div>
  );
};

export default QuestionWiseSummary;