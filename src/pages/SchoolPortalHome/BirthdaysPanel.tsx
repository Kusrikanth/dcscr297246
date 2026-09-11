import React from "react";
import { toast } from "react-toastify";
import Button from "../../Components/Common/Button";
import { birthdays } from "./helper";

const BirthdaysPanel: React.FC = () => {
  return (
    <div className="tw-card tw-mb-0 tw-h-full">
      <div className="tw-card-header">
        <h4 className="tw-card-title">Birthdays today</h4>
        <p className="tw-card-subTitle">Send your wishes</p>
      </div>

      <div className="tw-card-body">
        <div className="tw-flex tw-flex-col tw-gap-3">
          {birthdays.map((person) => (
            <div key={person.name} className="tw-flex tw-items-center tw-gap-3">
              <span className="tw-flex tw-items-center tw-justify-center tw-rounded-full tw-w-9 tw-h-9 tw-flex-shrink-0 tw-bg-pink-50 tw-text-pink-600 tw-text-xs tw-font-semibold">
                {person.initials}
              </span>
              <div className="tw-flex-grow tw-min-w-0">
                <strong className="tw-text-sm tw-block">{person.name}</strong>
                <p className="tw-text-xs tw-text-gray-500 tw-mb-0">
                  {person.role}
                </p>
              </div>
              <Button
                variant="linkBtn"
                onClick={() => toast.success(`Wishes sent to ${person.name}.`)}
              >
                Wish
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(BirthdaysPanel);
