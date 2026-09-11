import React, { useMemo, useState } from "react";
import { MathPreview, SelectInput } from "../../../../../../../Components/Common";
import { useFormik } from "formik";

interface QuestionAnalysisData {
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

interface StatsByAssessmentData {
  totalStudents?: number;
  averageAccuracy?: number;
  totalCorrect?: number;
  totalIncorrect?: number;
  participantCount?: number;
}

interface QuestionWiseDetailsProps {
  getAssessmentQuestionSectionHeatMapResp:
    | {
        getAssessmentQuestionSectionHeatMapResp: QuestionAnalysisData[];
      }
    | QuestionAnalysisData[];
  getStatsByAssessmentResp?: StatsByAssessmentData;
}

const initialValues = {
  sectionId: "All",
};

const QuestionWiseDetails: React.FC<QuestionWiseDetailsProps> = ({
  getAssessmentQuestionSectionHeatMapResp,
  getStatsByAssessmentResp,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);

  const data = Array.isArray(getAssessmentQuestionSectionHeatMapResp)
    ? getAssessmentQuestionSectionHeatMapResp
    : getAssessmentQuestionSectionHeatMapResp?.getAssessmentQuestionSectionHeatMapResp || [];

  // ✅ Extract unique sections and add "All" option
  const sectionList = useMemo(() => {
    const uniqueSections = Array.from(
      new Map(
        data.map((item) => [item.sectionId, { sectionId: item.sectionId, sectionName: item.sectionName }])
      ).values()
    );
    const sorted = uniqueSections.sort((a, b) => a.sectionName.localeCompare(b.sectionName));
    return [{ sectionId: "All", sectionName: "All Sections" }, ...sorted];
  }, [data]);

  // ✅ Filter data by selected section
  const filteredData = useMemo(() => {
    if (!selectedSectionId) return data;
    return data.filter((q) => q.sectionId === selectedSectionId);
  }, [data, selectedSectionId]);

  const participantCount = Math.max(
    ...filteredData.map((q) => (q.correctStudentsCount || 0) + (q.incorrectStudentsCount || 0)),
    getStatsByAssessmentResp?.participantCount ?? 0
  );

  let step = 1;
  if (participantCount > 10 && participantCount < 100) step = 10;
  else if (participantCount >= 100 && participantCount < 1000) step = 50;
  else if (participantCount >= 1000) step = 100;

  const maxStudentCount = Math.ceil(participantCount / step) * step || step;
  const scale = Array.from({ length: Math.floor(maxStudentCount / step) + 1 }, (_, i) => i * step);

  const addQuestionForm = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    addQuestionForm.setFieldValue("sectionId", value);
    if (value === "All") {
      setSelectedSectionId(null);
    } else {
      setSelectedSectionId(Number(value));
    }
  };

  return (
    <>
      <div className="row p-2">
        <div className="col-6 col-md-3 mt-2 ms-auto">
          <SelectInput
            name="sectionId"
            value={addQuestionForm.values.sectionId}
            onChange={handleSectionChange}
            valueKey="sectionId"
            textKey="sectionName"
            menuItems={sectionList}
            floatingLabel
            labelText="Section"
          />
        </div>
      </div>

      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {filteredData && filteredData.length > 0 ? (
          <>
            <div
              className="pt-0"
              style={{
                padding: "20px",
                paddingBottom: "0",
                flex: "1 1 auto",
                overflowY: "auto",
                maxHeight: "calc(380px - 140px)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {filteredData.map((question) => {
                  const correctCount = question.correctStudentsCount || 0;
                  const incorrectCount = question.incorrectStudentsCount || 0;
                  const totalForThisQuestion = correctCount + incorrectCount;
                  const correctPerc =
                    totalForThisQuestion > 0 ? (correctCount / totalForThisQuestion) * 100 : 0;
                  const incorrectPerc =
                    totalForThisQuestion > 0 ? (incorrectCount / totalForThisQuestion) * 100 : 0;

                  return (
                    <div
                      key={question.questionId}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "35% 65%",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          fontSize: "13px",
                          color: "#6B7280",
                          lineHeight: "1.4",
                          paddingRight: "8px",
                        }}
                      >
                        <span style={{ fontWeight: "500", color: "#4B5563", flexShrink: 0 }}>
                          Q{question.questionOrder}.{" "}
                        </span>
                        <MathPreview json={JSON?.parse(question.questionDescription)} />
                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: "18px",
                          backgroundColor: "#F3F4F6",
                          borderRadius: "4px",
                          overflow: "hidden",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          display: "flex",
                        }}
                      >
                        <div
                          style={{
                            width: `${correctPerc}%`,
                            backgroundColor: "#4DB8A8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: correctPerc > 15 ? "center" : "flex-start",
                            paddingLeft: correctPerc <= 15 ? "4px" : "0",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "600",
                            transition: "width 0.3s ease",
                          }}
                          title={`Correct: ${Math.round(correctPerc)}% (${correctCount} students)`}
                        >
                          {correctPerc > 5 && `${Math.round(correctPerc)}%`}
                        </div>
                        <div
                          style={{
                            width: `${incorrectPerc}%`,
                            backgroundColor: "#E8715C",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: incorrectPerc > 15 ? "center" : "flex-end",
                            paddingRight: incorrectPerc <= 15 ? "4px" : "0",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "600",
                            transition: "width 0.3s ease",
                          }}
                          title={`Incorrect: ${Math.round(incorrectPerc)}% (${incorrectCount} students)`}
                        >
                          {incorrectPerc > 5 && `${Math.round(incorrectPerc)}%`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scale Bar */}
            <div
              style={{
                padding: "0 20px 12px 20px",
                backgroundColor: "white",
                borderTop: "1px solid #E5E7EB",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "35% 65%",
                  gap: "12px",
                  paddingTop: "12px",
                }}
              >
                <div></div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "#9CA3AF",
                    fontWeight: "500",
                  }}
                >
                  {scale.map((num) => (
                    <span key={num}>{num}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "24px",
                padding: "16px 20px",
                backgroundColor: "white",
                borderTop: "1px solid #E5E7EB",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#4DB8A8",
                    borderRadius: "3px",
                  }}
                />
                <span style={{ fontSize: "13px", color: "#6B7280", fontWeight: "500" }}>
                  Correct
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#E8715C",
                    borderRadius: "3px",
                  }}
                />
                <span style={{ fontSize: "13px", color: "#6B7280", fontWeight: "500" }}>
                  Incorrect
                </span>
              </div>
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
              padding: "20px",
            }}
          >
            <p style={{ margin: 0 }}>No data available</p>
          </div>
        )}
      </div>
    </>
  );
};

export default QuestionWiseDetails;
