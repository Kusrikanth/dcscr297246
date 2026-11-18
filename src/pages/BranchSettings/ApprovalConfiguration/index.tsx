import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { shallowEqual } from "react-redux";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";
import { TextInput } from "../../../Components/Common";
import ParticipantsEditor from "./ParticipantsEditor";
import AddActivityModal from "./AddActivityModal";
import ClassScopeModal from "./ClassScopeModal";
import TcRetentionPromptModal from "./TcRetentionPromptModal";
import { useAppSelector } from "../../../hooks/storehook";
import {
  createActivityFromScreen,
  getApprovalActivities,
  getApprovalEmployeeOptions,
  getApprovalScreenModule,
  IApplicableClass,
  IApprovalScreen,
  saveApprovalActivities,
  TC_REQUEST_ACTIVITY_ID,
} from "../../../utility/approvalconfigutility";
import { IActivityParticipant, IApprovalActivity } from "./helper";

const ApprovalConfiguration: React.FC = () => {
  const [activities, setActivities] = useState<Array<IApprovalActivity>>(
    getApprovalActivities
  );
  // Activities render as collapsed module groups; only the expanded activity
  // shows its participants editor, so the list stays out of the way.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Array<string>>([]);
  const [searchString, setSearchString] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [classScopeIndex, setClassScopeIndex] = useState<number | null>(null);
  const [showRetentionPrompt, setShowRetentionPrompt] = useState(false);

  const { userMeResp } = useAppSelector(
    ({ login }) => ({
      userMeResp: login.userMeResp,
    }),
    shallowEqual
  );

  const employeeOptions = useMemo(
    () => getApprovalEmployeeOptions(userMeResp),
    [userMeResp]
  );

  const selected = activities.find((activity) => activity.id === selectedId);

  const activityGroups = useMemo(() => {
    const filteredActivities = activities.filter((activity) =>
      activity.name.toLowerCase().includes(searchString.trim().toLowerCase())
    );
    return filteredActivities.reduce(
      (
        groups: Array<{ module: string; activities: Array<IApprovalActivity> }>,
        activity
      ) => {
        const module = getApprovalScreenModule(activity.id);
        const group = groups.find((item) => item.module === module);
        if (group) {
          group.activities.push(activity);
        } else {
          groups.push({ module, activities: [activity] });
        }
        return groups;
      },
      []
    );
  }, [activities, searchString]);

  function toggleModuleHndlr(module: string) {
    setExpandedModules((prevState) =>
      prevState.includes(module)
        ? prevState.filter((item) => item !== module)
        : [...prevState, module]
    );
  }

  function toggleActivityHndlr(activityId: string) {
    setSelectedId((prevState) => (prevState === activityId ? null : activityId));
  }

  function updateSelected(
    updater: (activity: IApprovalActivity) => IApprovalActivity
  ) {
    if (!selected) return;
    setActivities((prevState) =>
      prevState.map((activity) =>
        activity.id === selected.id ? updater(activity) : activity
      )
    );
  }

  function addParticipantHndlr() {
    // Adding a person to the TC Request approvals first asks whether the TC
    // retention form is enabled for them (defaults to no).
    if (selected?.id === TC_REQUEST_ACTIVITY_ID) {
      setShowRetentionPrompt(true);
    } else {
      confirmAddParticipantHndlr();
    }
  }

  function confirmAddParticipantHndlr(tcRetentionFormEnabled?: boolean) {
    updateSelected((activity) => ({
      ...activity,
      participants: [
        ...activity.participants,
        {
          employeeId: "",
          employeeName: "",
          department: "",
          role: "mandatory" as const,
          ...(tcRetentionFormEnabled !== undefined
            ? { tcRetentionFormEnabled }
            : {}),
        },
      ],
    }));
    setShowRetentionPrompt(false);
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

  function moveParticipantHndlr(index: number, direction: "up" | "down") {
    updateSelected((activity) => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= activity.participants.length) {
        return activity;
      }
      const participants = [...activity.participants];
      [participants[index], participants[targetIndex]] = [
        participants[targetIndex],
        participants[index],
      ];
      return { ...activity, participants };
    });
  }

  function removeParticipantHndlr(index: number) {
    updateSelected((activity) => ({
      ...activity,
      participants: activity.participants.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  }

  function addActivitiesHndlr(
    screens: Array<IApprovalScreen>,
    customName: string
  ) {
    const existingIds = activities.map((activity) => activity.id);
    const newActivities = screens
      .filter((screen) => !existingIds.includes(screen.id))
      .map(createActivityFromScreen);
    if (customName) {
      newActivities.push({
        id: `${customName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${activities.length + 1
          }`,
        name: customName,
        description: "Custom approval workflow",
        active: true,
        participants: [],
      });
    }
    if (newActivities.length) {
      setActivities((prevState) => [...prevState, ...newActivities]);
      setSelectedId(newActivities[0].id);
      const newModules = newActivities.map((activity) =>
        getApprovalScreenModule(activity.id)
      );
      setExpandedModules((prevState) => [
        ...prevState,
        ...newModules.filter((module) => !prevState.includes(module)),
      ]);
    }
    setShowAddModal(false);
  }

  function saveConfigurationHndlr() {
    const incompleteActivity = activities.find((activity) =>
      activity.participants.some(
        (item) => !item.employeeId || !item.department.trim()
      )
    );
    const noMandatoryActivity = activities.find(
      (activity) =>
        activity.participants.length &&
        !activity.participants.some(
          (item) => item.employeeId && item.role === "mandatory"
        )
    );
    if (incompleteActivity) {
      toast.warning(
        `Complete the employee and department fields for "${incompleteActivity.name}" before saving.`
      );
    } else if (noMandatoryActivity) {
      toast.warning(
        `Add at least one mandatory approver for "${noMandatoryActivity.name}" before saving.`
      );
    } else {
      saveApprovalActivities(activities);
      toast.success("Approval configuration saved.");
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
              Approval screens such as Transfer Request Approvals only allow
              the employees configured here to approve.
            </p>
          </div>
          <div className="search-box">
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
          <Button variant="hoverInfo" onClick={() => setShowAddModal(true)}>
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            <span>Add activity</span>
          </Button>
          <Button variant="primary" onClick={saveConfigurationHndlr}>
            Save configuration
          </Button>
        </div>

        <div className="tw-flex tw-flex-col tw-gap-2">
          {activityGroups.length ? (
            activityGroups.map((group) => {
              const moduleExpanded = expandedModules.includes(group.module);
              return (
                <div
                  key={group.module}
                  className="tw-bg-white tw-border tw-rounded-lg tw-overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleModuleHndlr(group.module)}
                    className="tw-w-full tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2.5 tw-text-start hover:tw-bg-gray-50"
                  >
                    <i
                      className={`${
                        moduleExpanded
                          ? "ri-arrow-down-s-line"
                          : "ri-arrow-right-s-line"
                      } tw-text-lg tw-text-gray-500`}
                    />
                    <span className="tw-font-semibold">{group.module}</span>
                    <span className="badge bg-light text-muted">
                      {group.activities.length}{" "}
                      {group.activities.length === 1 ? "activity" : "activities"}
                    </span>
                  </button>

                  {moduleExpanded && (
                    <div className="tw-border-t tw-divide-y">
                      {group.activities.map((activity) => {
                        const activityExpanded = activity.id === selectedId;
                        const mandatory = activity.participants.filter(
                          (item) => item.employeeId && item.role === "mandatory"
                        ).length;
                        const acknowledgement = activity.participants.filter(
                          (item) =>
                            item.employeeId && item.role === "acknowledgement"
                        ).length;
                        return (
                          <div key={activity.id}>
                            <button
                              type="button"
                              onClick={() => toggleActivityHndlr(activity.id)}
                              className={`tw-w-full tw-flex tw-items-center tw-gap-2 tw-ps-6 tw-pe-3 tw-py-2 tw-text-start ${
                                activityExpanded
                                  ? "tw-bg-teal-50"
                                  : "hover:tw-bg-gray-50"
                              }`}
                            >
                              <i
                                className={`${
                                  activityExpanded
                                    ? "ri-arrow-down-s-line"
                                    : "ri-arrow-right-s-line"
                                } tw-text-lg tw-text-gray-500`}
                              />
                              <span className="tw-flex tw-flex-col tw-min-w-0 tw-flex-grow">
                                <span className="tw-font-medium">
                                  {activity.name}
                                </span>
                                <small className="tw-text-gray-500 tw-truncate">
                                  {activity.description}
                                </small>
                              </span>
                              <span className="badge bg-warning-subtle text-warning">
                                {mandatory} mandatory
                              </span>
                              <span className="badge bg-light text-muted">
                                {acknowledgement} acknowledgement
                              </span>
                            </button>

                            {activityExpanded && (
                              <div className="tw-border-t tw-bg-gray-50 tw-p-3">
                                <ParticipantsEditor
                                  activity={activity}
                                  employees={employeeOptions}
                                  onAddParticipant={addParticipantHndlr}
                                  onChangeParticipant={changeParticipantHndlr}
                                  onRemoveParticipant={removeParticipantHndlr}
                                  onEditClassScope={setClassScopeIndex}
                                  onMoveParticipant={moveParticipantHndlr}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="tw-bg-white tw-border tw-rounded-lg tw-p-4 tw-text-center tw-text-sm tw-text-gray-500">
              No activities match "{searchString}".
            </div>
          )}
        </div>

        {showAddModal && (
          <AddActivityModal
            isOpen
            toggle={() => setShowAddModal(false)}
            existingActivityIds={activities.map((activity) => activity.id)}
            onAdd={addActivitiesHndlr}
          />
        )}

        {showRetentionPrompt && (
          <TcRetentionPromptModal
            isOpen
            toggle={() => setShowRetentionPrompt(false)}
            onConfirm={confirmAddParticipantHndlr}
          />
        )}

        {classScopeIndex !== null && selected && (
          <ClassScopeModal
            isOpen
            toggle={() => setClassScopeIndex(null)}
            participantName={
              selected.participants[classScopeIndex]?.employeeName || ""
            }
            applicableClasses={
              selected.participants[classScopeIndex]?.applicableClasses || []
            }
            onSave={(applicableClasses: Array<IApplicableClass>) => {
              changeParticipantHndlr(classScopeIndex, { applicableClasses });
              setClassScopeIndex(null);
            }}
          />
        )}
      </div>

    </React.Fragment>
  );
};

export default ApprovalConfiguration;
