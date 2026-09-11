import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { TextInput } from "../../../Components/Common";
import NoDataComp from "../../../Components/Common/NoDataComp";
import Button from "../../../Components/Common/Button";
import { IApprovalActivity } from "./helper";

interface IActivityListPanelProps {
  activities: Array<IApprovalActivity>;
  selectedId: string;
  onSelect: (id: string) => void;
  onAddActivity: () => void;
}

const ActivityListPanel: React.FC<IActivityListPanelProps> = ({
  activities,
  selectedId,
  onSelect,
  onAddActivity,
}) => {
  const [searchString, setSearchString] = useState("");

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchString.toLowerCase())
  );

  return (
    <div className="tw-card tw-mb-0 tw-h-full">
      <div className="tw-card-header tw-flex tw-items-start tw-gap-3">
        <div className="tw-flex-grow tw-min-w-0">
          <h4 className="tw-card-title">Activities</h4>
          <p className="tw-card-subTitle">{activities.length} configured</p>
        </div>
        <div className="tw-flex-shrink-0">
          <Button
            variant="primary"
            onClick={onAddActivity}
            title="Add activity"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
          </Button>
        </div>
      </div>

      <div className="tw-card-body">
        <div className="search-box tw-mb-3">
        <TextInput
          name="activitySearch"
          value={searchString}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSearchString(event.target.value)
          }
          inputClassName="tw-bg-gray-100"
          formgroupClassName="tw-mb-0"
          placeHolder="Search activities"
          maxLength={60}
        />
        <i className="ri-search-line search-icon" />
      </div>

      <div className="tw-flex tw-flex-col tw-gap-2">
        {filteredActivities.length ? (
          filteredActivities.map((activity) => {
            const mandatory = activity.participants.filter(
              (item) => item.role === "mandatory"
            ).length;
            const optional = activity.participants.length - mandatory;

            return (
              <button
                type="button"
                key={activity.id}
                onClick={() => onSelect(activity.id)}
                className={`tw-border tw-rounded-md tw-px-3 tw-py-2 tw-text-start ${
                  activity.id === selectedId
                    ? "tw-border-[#1bb3a6] tw-bg-teal-50"
                    : "hover:tw-bg-gray-50"
                }`}
              >
                <strong className="tw-text-sm tw-block">{activity.name}</strong>
                <small className="tw-text-gray-500">
                  {mandatory} approver{mandatory !== 1 ? "s" : ""}
                  {optional ? ` · ${optional} acknowledgement` : ""}
                </small>
              </button>
            );
          })
        ) : (
          <NoDataComp
            title="No activities found"
            helperText="Clear the search to see every configured activity."
          />
        )}
      </div>
      </div>
    </div>
  );
};

export default ActivityListPanel;
