import React, { useMemo, useState } from "react";
import { ModalBody, ModalFooter } from "reactstrap";
import { ModalContainerUpdated, TextInput } from "../../../Components/Common";
import Button from "../../../Components/Common/Button";
import {
  approvalScreenCatalog,
  IApprovalScreen,
} from "../../../utility/approvalconfigutility";

interface IAddActivityModalProps {
  isOpen: boolean;
  toggle: () => void;
  /** Activities already configured — their screens show as added and cannot be re-added. */
  existingActivityIds: Array<string>;
  onAdd: (screens: Array<IApprovalScreen>, customName: string) => void;
}

const AddActivityModal: React.FC<IAddActivityModalProps> = ({
  isOpen,
  toggle,
  existingActivityIds,
  onAdd,
}) => {
  const [selectedIds, setSelectedIds] = useState<Array<string>>([]);
  const [customName, setCustomName] = useState("");
  const [searchString, setSearchString] = useState("");

  const screensByModule = useMemo(() => {
    const filteredScreens = approvalScreenCatalog.filter((screen) =>
      `${screen.name} ${screen.description} ${screen.module}`
        .toLowerCase()
        .includes(searchString.trim().toLowerCase())
    );
    return filteredScreens.reduce(
      (groups: Array<{ module: string; screens: Array<IApprovalScreen> }>, screen) => {
        const group = groups.find((item) => item.module === screen.module);
        if (group) {
          group.screens.push(screen);
        } else {
          groups.push({ module: screen.module, screens: [screen] });
        }
        return groups;
      },
      []
    );
  }, [searchString]);

  function toggleScreenHndlr(screenId: string) {
    setSelectedIds((prevState) =>
      prevState.includes(screenId)
        ? prevState.filter((id) => id !== screenId)
        : [...prevState, screenId]
    );
  }

  function submitHndlr() {
    const selectedScreens = approvalScreenCatalog.filter((screen) =>
      selectedIds.includes(screen.id)
    );
    if (!selectedScreens.length && !customName.trim()) return;
    onAdd(selectedScreens, customName.trim());
  }

  return (
    <ModalContainerUpdated
      id="ui-add-activity-modal"
      isOpen={isOpen}
      toggle={toggle}
      modalSize="lg"
      modalTitle="Add activity"
    >
      <ModalBody>
        <p className="tw-text-sm tw-text-gray-500 tw-mb-3">
          Pick the screens where approvals apply, then assign their approvers.
          Each screen only allows the employees configured for its activity to
          approve.
        </p>

        <div className="search-box tw-mb-3">
          <TextInput
            name="screenSearch"
            value={searchString}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearchString(event.target.value)
            }
            inputClassName="tw-bg-gray-100"
            formgroupClassName="tw-mb-0"
            placeHolder="Search screens or modules"
            maxLength={60}
          />
          <i className="ri-search-line search-icon" />
        </div>

        <div className="tw-max-h-80 tw-overflow-y-auto tw-border tw-rounded-md tw-divide-y">
          {screensByModule.length ? (
            screensByModule.map((group) => (
              <div key={group.module} className="tw-p-2">
                <div className="tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-400 tw-px-1 tw-mb-1">
                  {group.module}
                </div>
                <div className="tw-flex tw-flex-col tw-gap-1">
                  {group.screens.map((screen) => {
                    const alreadyAdded = existingActivityIds.includes(screen.id);
                    const checked = selectedIds.includes(screen.id);
                    return (
                      <label
                        key={screen.id}
                        htmlFor={`approval-screen-${screen.id}`}
                        className={`tw-flex tw-items-start tw-gap-2 tw-rounded-md tw-px-2 tw-py-1.5 tw-mb-0 ${
                          alreadyAdded
                            ? "tw-opacity-60"
                            : checked
                              ? "tw-bg-teal-50 tw-cursor-pointer"
                              : "hover:tw-bg-gray-50 tw-cursor-pointer"
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`approval-screen-${screen.id}`}
                          className="form-check-input tw-mt-1"
                          checked={alreadyAdded || checked}
                          disabled={alreadyAdded}
                          onChange={() => toggleScreenHndlr(screen.id)}
                        />
                        <span className="tw-flex tw-flex-col tw-min-w-0">
                          <span className="tw-flex tw-items-center tw-gap-2">
                            <span className="tw-font-medium">{screen.name}</span>
                            {alreadyAdded && (
                              <span className="badge bg-success-subtle text-success">
                                Added
                              </span>
                            )}
                          </span>
                          <small className="tw-text-gray-500 tw-truncate">
                            {screen.description}
                          </small>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="tw-p-4 tw-text-center tw-text-sm tw-text-gray-500">
              No screens match "{searchString}".
            </div>
          )}
        </div>

        <div className="tw-mt-3">
          <TextInput
            name="activityName"
            labelText="Or create a custom activity"
            value={customName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setCustomName(event.target.value)
            }
            placeHolder="Example: Refund request"
            formgroupClassName="tw-mb-0"
            maxLength={60}
          />
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={!selectedIds.length && !customName.trim()}
          onClick={submitHndlr}
        >
          {selectedIds.length > 1
            ? `Add ${selectedIds.length} activities`
            : "Add activity"}
        </Button>
      </ModalFooter>
    </ModalContainerUpdated>
  );
};

export default AddActivityModal;
