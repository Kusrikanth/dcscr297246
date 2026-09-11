import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../Components/Common/Button";
import { feedItems } from "./helper";

const FeedPanel: React.FC = () => {
  return (
    <div className="tw-card tw-h-full">
      <div className="tw-card-header tw-flex tw-items-start tw-gap-3">
        <div className="tw-flex-grow tw-min-w-0">
          <h4 className="tw-card-title">School feed</h4>
          <p className="tw-card-subTitle">Latest notices and updates</p>
        </div>
        <div className="tw-flex-shrink-0">
          <Button
            variant="linkBtn"
            onClick={() => { }}
          >
            View all
          </Button>
        </div>
      </div>

      <div className="tw-card-body">
        <div className="tw-flex tw-flex-col tw-gap-3">
          {feedItems.map((item) => (
            <div key={item.title} className="tw-flex tw-items-start tw-gap-3">
              <span className="tw-flex tw-items-center tw-justify-center tw-rounded-md tw-w-9 tw-h-9 tw-flex-shrink-0 tw-bg-gray-100 tw-text-gray-600">
                <HugeiconsIcon icon={item.icon} size={18} />
              </span>
              <div className="tw-flex-grow tw-min-w-0">
                <strong className="tw-text-sm tw-block">{item.title}</strong>
                <p className="tw-text-xs tw-text-gray-500 tw-mb-0">
                  {item.meta}
                </p>
              </div>
              <span className="badge badge-soft-secondary tw-flex-shrink-0">
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(FeedPanel);
