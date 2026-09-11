import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Button from "../../../Components/Common/Button";
import ActivityListPanel from "./ActivityListPanel";
import ParticipantsEditor from "./ParticipantsEditor";
import AddActivityModal from "./AddActivityModal";
import {
  IActivityParticipant,
  IApprovalActivity,
  starterActivities,
} from "./helper";

const ApprovalConfiguration: React.FC = () => {
  const [activities, setActivities] =
    useState<Array<IApprovalActivity>>(starterActivities);
  const [selectedId, setSelectedId] = useState(starterActivities[0].id);
  const [showAddModal, setShowAddModal] = useState(false);

  const selected =
    activities.find((activity) => activity.id === selectedId) || activities[0];

  const counts = useMemo(
    () => ({
      mandatory: selected.participants.filter(
        (item) => item.employeeId && item.role === "mandatory"
      ).length,
      acknowledgement: selected.participants.filter(
        (item) => item.employeeId && item.role === "acknowledgement"
      ).length,
    }),
    [selected]
  );

  function updateSelected(
    updater: (activity: IApprovalActivity) => IApprovalActivity
  ) {
    setActivities((prevState) =>
      prevState.map((activity) =>
        activity.id === selected.id ? updater(activity) : activity
      )
    );
  }

  function addParticipantHndlr() {
    updateSelected((activity) => ({
      ...activity,
      participants: [
        ...activity.participants,
        { employeeId: "", department: "", role: "mandatory" },
      ],
    }));
  }

  function changeParticipantHndlr(
    index: number,
    changes: Partial<IActivityParticipant>
  ) {
    updateSelected((activity) => ({
      ...activity,
      participants: activity.participants.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...changes } : item
      ),
    }));
  }

  function removeParticipantHndlr(index: number) {
    updateSelected((activity) => ({
      ...activity,
      participants: activity.participants.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  }

  function addActivityHndlr(name: string) {
    const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${activities.length + 1
      }`;
    setActivities((prevState) => [
      ...prevState,
      {
        id,
        name,
        description: "Custom approval workflow",
        active: true,
        participants: [],
      },
    ]);
    setSelectedId(id);
    setShowAddModal(false);
  }

  function saveConfigurationHndlr() {
    if (
      selected.participants.some(
        (item) => !item.employeeId || !item.department.trim()
      )
    ) {
      toast.warning(
        "Complete the employee and department fields before saving."
      );
    } else if (!counts.mandatory) {
      toast.warning("Add at least one mandatory approver before saving.");
    } else {
      toast.success(`${selected.name} configuration saved.`);
    }
  }

  return (
    <React.Fragment>

      <div className="">


        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3 tw-mb-3">
          <div className="tw-flex-grow tw-min-w-0">
            <h4 className="tw-card-title tw-text-lg">
              Approval Configuration
            </h4>
            <p className="tw-card-subTitle">
              Define who must approve or acknowledge each school activity.
            </p>
          </div>
          <Button variant="primary" onClick={saveConfigurationHndlr}>
            Save configuration
          </Button>
        </div>

        <div className="tw-grid tw-grid-cols-12 tw-gap-3">
          <div className="tw-col-span-12 xl:tw-col-span-3">
            <ActivityListPanel
              activities={activities}
              selectedId={selected.id}
              onSelect={setSelectedId}
              onAddActivity={() => setShowAddModal(true)}
            />
          </div>

          <div className="tw-col-span-12 xl:tw-col-span-9">
            <ParticipantsEditor
              activity={selected}
              onAddParticipant={addParticipantHndlr}
              onChangeParticipant={changeParticipantHndlr}
              onRemoveParticipant={removeParticipantHndlr}
            />
          </div>
        </div>

        {showAddModal && (
          <AddActivityModal
            isOpen
            toggle={() => setShowAddModal(false)}
            onCreate={addActivityHndlr}
          />
        )}
      </div>

    </React.Fragment>
  );
};

export default ApprovalConfiguration;
