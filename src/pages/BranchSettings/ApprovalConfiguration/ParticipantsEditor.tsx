import React, { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import TableContainer from "../../../Components/Common/TableContainer";
import Button from "../../../Components/Common/Button";
import {
  approvalEmployees,
  generateParticipantColumns,
  IActivityParticipant,
  IApprovalActivity,
} from "./helper";

interface IParticipantsEditorProps {
  activity: IApprovalActivity;
  onAddParticipant: () => void;
  onChangeParticipant: (
    index: number,
    changes: Partial<IActivityParticipant>
  ) => void;
  onRemoveParticipant: (index: number) => void;
}

const ParticipantsEditor: React.FC<IParticipantsEditorProps> = ({
  activity,
  onAddParticipant,
  onChangeParticipant,
  onRemoveParticipant,
}) => {
  const participantColumns = useMemo(
    () =>
      generateParticipantColumns({
        participants: activity.participants,
        onChangeParticipant,
        onRemoveParticipant,
      }),
    [activity.participants, onChangeParticipant, onRemoveParticipant]
  );

  return (
    <div className="tw-card tw-mb-0 tw-h-full !tw-overflow-visible">
      <div className="tw-card-header tw-flex tw-items-start tw-gap-3">
        <div className="tw-flex-grow tw-min-w-0">
          <h4 className="tw-card-title">{activity.name}</h4>
          <p className="tw-card-subTitle">{activity.description}</p>
        </div>
        <div className="tw-flex-shrink-0">
          <Button
            variant="hoverInfo"
            onClick={onAddParticipant}
            disabled={activity.participants.length === approvalEmployees.length}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            <span>Add person</span>
          </Button>
        </div>
      </div>

      <TableContainer
        columns={participantColumns}
        data={activity.participants}
        divClass="tw-overflow-x-auto"
        tableClass="tw-w-full tw-whitespace-nowrap align-middle"
        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
      />
    </div>
  );
};

export default ParticipantsEditor;
