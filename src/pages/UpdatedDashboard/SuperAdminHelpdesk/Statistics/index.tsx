import {
  Ticket01Icon,
  Ticket02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { transformComplaintStatsToCards } from "./helper";

const StatsCard = ({ card }) => {
  return (
    <div className="card-container">
      <div className="card !tw-rounded-2xl !tw-shadow-sm !tw-p-4 super-admin-stats-card">
        <div
          className="status-icon-container diamond"
          style={{ background: `${card.bgColor}` }}
        >
          <div
            className="status-icon diamond"
            style={{ background: `${card.iconBgColor}` }}
          >
            <HugeiconsIcon icon={Ticket02Icon} className="icon" size={18} />
          </div>
        </div>
        <div className="status-text">
          <h4 className="tw-mb-0">{card.count}</h4>
          <p className="tw-mb-0">{card.label}</p>
        </div>
      </div>
    </div>
  );
};

const HelpdeskStatistics = (props: any) => {
  const cardData = useMemo(() => transformComplaintStatsToCards(props.data), [props.data]);  
  return (
    <div className="super-admin-stats status-card-container">
      {cardData.map((card) => (
        <StatsCard card={card} key={card.label} />
      ))}
    </div>
  );
};

export default HelpdeskStatistics;
