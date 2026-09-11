import { HugeiconsIcon } from "@hugeicons/react";
import { UserMultiple02Icon } from "@hugeicons-pro/core-stroke-standard";
import bgImg from "./cardimg.svg";

const CardTypeOne = ({ card }: any) => {
  return (
    <div className="type-one-card card d-flex flex-row align-items-center justify-content-between p-3">
          <div className="bg-image">
            <img src={bgImg} alt="bg-image"></img>
          </div>
          <div className="d-flex align-items-center py-1" style={{ width: "55%" }}>
            <div
              className="icon-container d-flex align-items-center justify-content-center rounded me-2 flex-shrink-0"
              style={{ backgroundColor: card.cardIconBgColor }}
            >
              <HugeiconsIcon icon={UserMultiple02Icon}
                size={22}
                className="text-white"
              />
            </div>
            <p className="mb-0 fs-12 card-title fw-semibold">{card.cardTitle}</p>
          </div>
          <div>
            <p className="mb-0 tw-text-right tw-font-semibold tw-text-[14px] xl:tw-text-[16px]">{card.cardCount}</p>
          </div>
        </div>
  );
};

export default CardTypeOne;
