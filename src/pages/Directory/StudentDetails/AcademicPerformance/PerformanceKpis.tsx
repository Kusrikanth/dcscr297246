import React from "react";
import { formatChange, toGrade } from "./helper";


const PerformanceKpis = ({
  academicYear,
  overall,
  improvement,
}:any) => {
  const kpis = [
    {
      id: "overall-percentage",
      label: "Overall percentage",
      value: `${overall}%`,
      helper: `${academicYear} aggregate`,
      valueClass: "",
    },
    {
      id: "overall-grade",
      label: "Overall grade",
      value: toGrade(overall),
      helper: "Consistent performance",
      valueClass: "",
    },
    {
      id: "class-rank",
      label: "Class rank",
      value: "6 / 42",
      helper: "Top 15% of class",
      valueClass: "",
    },
    {
      id: "improvement",
      label: "Improvement",
      value: improvement === null ? "—" : `${formatChange(improvement)}%`,
      helper:
        improvement === null
          ? "No previous year data"
          : "From previous year",
      valueClass:
        improvement === null
          ? ""
          : improvement > 0
          ? "tw-text-green-600"
          : improvement < 0
          ? "tw-text-red-600"
          : "",
    },
  ];

  return (
    <React.Fragment>
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="tw-col-span-12 sm:tw-col-span-6 xl:tw-col-span-3"
        >
          <div className="tw-card tw-mb-0 tw-h-full">
            <div className="tw-card-body">
              <small className="tw-text-gray-500 tw-block">{kpi.label}</small>
              <strong
                className={`tw-text-2xl tw-block tw-leading-tight ${kpi.valueClass}`}
              >
                {kpi.value}
              </strong>
              <small className="tw-text-gray-500">{kpi.helper}</small>
            </div>
          </div>
        </div>
      ))}
    </React.Fragment>
  );
};

export default React.memo(PerformanceKpis);
