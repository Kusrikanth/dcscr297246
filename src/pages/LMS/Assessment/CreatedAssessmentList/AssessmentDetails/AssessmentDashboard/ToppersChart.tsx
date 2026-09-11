import React from "react";

type ToppersChartProps = {
  value: number;
  total: number;
  rank?: number;
};

const rankColorsMap: { [position: number]: string } = {
  1: "#0ab39c",
  2: "#405189",
  3: "#f7b84b",
  4: "#556ee6",
  5: "#f06548",
};

const ToppersChart: React.FC<ToppersChartProps> = ({
  value,
  total,
  rank,
}) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const progressColor = rankColorsMap[rank ?? 1] || "#0ab39c";

  return (
    <div className="tw-w-full tw-space-y-2">
      <div className="tw-flex tw-justify-between tw-items-center">
        <span className="tw-text-gray-500 tw-text-sm tw-font-medium">
          Score
        </span>
        <span className="tw-text-gray-500 tw-text-sm tw-font-medium">
          {percentage}%
        </span>
      </div>
      <div className="tw-w-full tw-h-3 tw-bg-gray-200 tw-rounded-full tw-overflow-hidden">
        <div
          className="tw-h-full tw-rounded-full tw-transition-all tw-duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: progressColor,
          }}
        />
      </div>
    </div>
  );
};

export default ToppersChart;
