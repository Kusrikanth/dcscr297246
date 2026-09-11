import React from "react";

const WelcomeBand: React.FC = () => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="tw-card tw-mb-0 !tw-overflow-visible">
      <div className="tw-card-body">
        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-center">
          <div className="tw-col-span-12 md:tw-col-span-8">
            <p className="tw-text-xs tw-text-gray-500 tw-mb-1">{today}</p>
            <h4 className="tw-card-title tw-text-lg">Good morning</h4>
            <p className="tw-card-subTitle !tw-mt-0">
              Here is what needs your attention today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(WelcomeBand);
