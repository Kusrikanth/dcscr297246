import React from "react";
import { yearResults } from "./helper";

const YearComparisonCard: React.FC = () => {
  return (
    <div className="tw-card tw-mb-0 tw-h-full">
      <div className="tw-card-header">
        <h4 className="tw-card-title">Academic year comparison</h4>
        <p className="tw-card-subTitle">Progression across classes</p>
      </div>

      <div className="tw-card-body">
        <div className="tw-flex tw-flex-col tw-gap-3">
          {yearResults.map((item) => (
            <div key={item.year} className="tw-flex tw-items-center tw-gap-3">
              <div className="tw-w-24 tw-flex-shrink-0">
                <strong className="tw-text-sm tw-block">{item.year}</strong>
                <small className="tw-text-gray-500">{item.className}</small>
              </div>
              <div className="progress tw-flex-grow" style={{ height: "8px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${item.score}%`,
                    backgroundColor: "#1bb3a6",
                  }}
                  aria-valuenow={item.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <b className="tw-text-sm tw-flex-shrink-0">{item.score}%</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(YearComparisonCard);
