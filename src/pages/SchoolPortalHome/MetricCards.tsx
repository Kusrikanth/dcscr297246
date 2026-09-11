import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  Task01Icon,
  UserCheck01Icon,
} from "@hugeicons-pro/core-stroke-standard";

interface IMetricCardsProps {
  pendingCount: number;
  mandatoryCount: number;
  acknowledgementCount: number;
  showPendingCard: boolean;
}

const MetricCards: React.FC<IMetricCardsProps> = ({
  pendingCount,
  mandatoryCount,
  acknowledgementCount,
  showPendingCard,
}) => {
  const metrics = [
    {
      id: "student-attendance",
      icon: UserCheck01Icon,
      iconClass: "tw-bg-teal-50 tw-text-teal-600",
      label: "Student attendance",
      value: "94.8%",
      helper: "2,361 of 2,490 present",
    },
    {
      id: "staff-attendance",
      icon: CheckmarkCircle02Icon,
      iconClass: "tw-bg-green-50 tw-text-green-600",
      label: "Staff attendance",
      value: "97.2%",
      helper: "174 of 179 present",
    },
    ...(showPendingCard
      ? [
          {
            id: "pending-actions",
            icon: Task01Icon,
            iconClass: "tw-bg-orange-50 tw-text-orange-600",
            label: "Pending actions",
            value: `${pendingCount}`,
            helper: `${mandatoryCount} approvals · ${acknowledgementCount} acknowledgements`,
          },
        ]
      : []),
    {
      id: "students-on-leave",
      icon: Clock01Icon,
      iconClass: "tw-bg-red-50 tw-text-red-600",
      label: "Students on leave",
      value: "32",
      helper: "8 requests awaiting review",
    },
  ];

  return (
    <React.Fragment>
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="tw-col-span-12 sm:tw-col-span-6 xl:tw-col-span-3"
        >
          <div className="tw-card tw-mb-0 tw-h-full">
            <div className="tw-card-body tw-flex tw-items-center tw-gap-3">
              <span
                className={`tw-flex tw-items-center tw-justify-center tw-rounded-md tw-w-11 tw-h-11 tw-flex-shrink-0 ${metric.iconClass}`}
              >
                <HugeiconsIcon icon={metric.icon} size={22} />
              </span>
              <div className="tw-min-w-0">
                <small className="tw-text-gray-500 tw-block">
                  {metric.label}
                </small>
                <strong className="tw-text-xl tw-block tw-leading-tight">
                  {metric.value}
                </strong>
                <p className="tw-text-xs tw-text-gray-500 tw-mb-0 tw-truncate">
                  {metric.helper}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </React.Fragment>
  );
};

export default React.memo(MetricCards);
