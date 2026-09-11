import { HugeiconsIcon } from "@hugeicons/react";
import { UserMultiple02Icon } from "@hugeicons-pro/core-stroke-standard";
import bgImg from "../../../../assets/imagesdps/updatedDashboard/cardimg.svg";
import { useMemo } from "react";
import { transformExamStatsToCards } from "./helper";

const CardTypeOne = ({ card }: any) => {
  return (
    <div className="type-one-card card !tw-flex !tw-flex-row !tw-items-center !tw-justify-between !tw-p-3 !tw-rounded-2xl !tw-shadow-sm !tw-relative !tw-overflow-hidden">
      <div className="bg-image !tw-absolute !tw-top-0 !tw-right-0 !tw-h-full">
        <img src={bgImg} alt="bg-image" className="!tw-h-full !tw-w-auto" />
      </div>
      <div className="tw-flex tw-items-center tw-py-1" style={{ width: "55%" }}>
        <div
          className="icon-container tw-flex tw-flex-shrink-0 tw-items-center tw-justify-center tw-rounded-lg tw-mr-2"
          style={{ backgroundColor: card.cardIconBgColor }}
        >
          <HugeiconsIcon
            icon={UserMultiple02Icon}
            size={22}
            className="tw-text-white"
          />
        </div>
        <p className="!tw-mb-0 !tw-text-sm card-title tw-font-semibold">{card.cardTitle}</p>
      </div>
      <div>
        <p className="tw-mb-0 tw-text-right tw-font-semibold tw-text-[14px] xl:tw-text-[16px]">{card.cardCount}</p>
      </div>
    </div>
  );
};

const StatsCardTypes = (props: any) => {
  const cardsListOne = useMemo(() => transformExamStatsToCards(props.data), [props.data]);

  return (
    <div className="stats-card-types-container">
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-4 tw-gap-6">
        {cardsListOne?.map((card) => (
          <div key={card.cardTitle}>
            <CardTypeOne card={card}></CardTypeOne>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCardTypes;