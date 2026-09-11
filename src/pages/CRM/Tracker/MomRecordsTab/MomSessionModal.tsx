import { useState, type ChangeEvent } from "react";

import {
    Button,
    DateInput,
    SelectInput,
    TextArea,
    TextInput,
} from "../../../../Components/Common";
import {
    addEstimateToNow,
    estimateUnitOptions,
    richTextHasContent,
    trackerUsers,
    type MomSession,
} from "../helper";

export interface MomDraftItem {
    key: string;
    title: string;
    ownerEmployeeId: string;
    estimatedValue: string;
    estimateUnit: string;
    dueAt: string;
    approverUserId: string;
}

export interface MomSessionDraft {
    notes: string;
    items: Array<MomDraftItem>;
}

interface MomSessionModalProps {
    session?: MomSession;
    toggle: () => void;
    onSave: (draft: MomSessionDraft, session?: MomSession) => void;
}

const employeeOptions = trackerUsers
    .filter(user => user.employeeId)
    .map(user => ({ id: user.employeeId, name: user.name }));

const approverOptions = trackerUsers.map(user => ({
    id: user.userId,
    name: `Approve: ${user.name}`,
}));

const createDraftItem = (index: number): MomDraftItem => ({
    key: `draft-${index}-${Math.round(performance.now() * 1000)}`,
    title: "",
    ownerEmployeeId: "",
    estimatedValue: "",
    estimateUnit: "hours",
    dueAt: "",
    approverUserId: "",
});

const MomSessionModal = ({
    session,
    toggle,
    onSave,
}: MomSessionModalProps) => {
    const [notes, setNotes] = useState<string>(session?.notes || "");
    const [items, setItems] = useState<Array<MomDraftItem>>([]);
    const [error, setError] = useState<string>("");

    const patchItem = (key: string, values: Partial<MomDraftItem>) => {
        setItems(currentItems =>
            currentItems.map(item =>
                item.key === key ? { ...item, ...values } : item,
            ),
        );
    };

    const updateEstimate = (
        key: string,
        value: string,
        unit: string,
    ) => {
        patchItem(key, {
            estimatedValue: value || "",
            estimateUnit: unit || "hours",
            dueAt: value ? addEstimateToNow(value, unit || "hours") : "",
        });
    };

    const saveHandler = () => {
        if (!richTextHasContent(notes)) {
            setError("Meeting notes are required to save a MOM session");
            return;
        }

        const filled = items.filter(item => item.title.trim());
        const missingEstimate = filled.find(
            item => !(Number(item.estimatedValue) > 0),
        );

        if (missingEstimate) {
            setError("Every action item needs an estimated duration");
            return;
        }

        setError("");
        onSave({ notes, items: filled }, session);
        toggle();
    };

    return (
        <div className="tw-p-4">
            {session && (
                <p className="tw-mb-3 tw-font-mono tw-text-xs tw-text-[#405189]">
                    {session.sessionNumber}
                </p>
            )}

            <TextArea
                name="momNotes"
                labelText="Meeting Notes"
                labelClass="required"
                value={notes}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setNotes(event.target.value)
                }
                placeHolder="Write the complete meeting discussion, decisions, observations, and notes here…"
                height="180px"
                maxLength={5000}
                showRemainingChars
            />

            <div className="tw-mt-4 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                <div>
                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                        Action Items{items.length > 0 && ` (${items.length})`}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        Optional — a session can be notes only.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="soft"
                    onClick={() =>
                        setItems(currentItems => [
                            ...currentItems,
                            createDraftItem(currentItems.length),
                        ])
                    }
                >
                    <i className="ri-add-line"></i>
                    Add item
                </Button>
            </div>

            {items.length > 0 && (
                <div className="tw-mt-2">
                    {items.map(item => (
                        <div
                            key={item.key}
                            className="tw-mb-2 tw-rounded tw-border tw-border-gray-200 tw-p-2"
                        >
                            <div className="row tw-items-end tw-gap-y-2">
                                <div className="col-12 col-xl-4">
                                    <TextInput
                                        name={`title-${item.key}`}
                                        labelText="Action Item"
                                        placeHolder="Action item"
                                        value={item.title}
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            patchItem(item.key, {
                                                title: event.target.value,
                                            })
                                        }
                                        maxLength={200}
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>

                                <div className="col-12 col-md-6 col-xl-2">
                                    <SelectInput
                                        name={`owner-${item.key}`}
                                        labelText="Owner"
                                        defaultSelect="Unassigned"
                                        value={item.ownerEmployeeId}
                                        onChange={(
                                            event: ChangeEvent<HTMLSelectElement>,
                                        ) =>
                                            patchItem(item.key, {
                                                ownerEmployeeId:
                                                    event.target.value,
                                            })
                                        }
                                        menuItems={employeeOptions}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>

                                <div className="col-6 col-md-3 col-xl-1">
                                    <TextInput
                                        name={`estimate-${item.key}`}
                                        labelText="Time"
                                        inputType="number"
                                        placeHolder="0"
                                        value={item.estimatedValue}
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            updateEstimate(
                                                item.key,
                                                event.target.value,
                                                item.estimateUnit,
                                            )
                                        }
                                        formgroupClassName="tw-mb-0"
                                        invalid={Boolean(
                                            item.title.trim() &&
                                            !(
                                                Number(item.estimatedValue) >
                                                0
                                            ),
                                        )}
                                    />
                                </div>

                                <div className="col-6 col-md-3 col-xl-2">
                                    <SelectInput
                                        name={`unit-${item.key}`}
                                        labelText="Unit"
                                        value={item.estimateUnit}
                                        onChange={(
                                            event: ChangeEvent<HTMLSelectElement>,
                                        ) =>
                                            updateEstimate(
                                                item.key,
                                                item.estimatedValue,
                                                event.target.value,
                                            )
                                        }
                                        menuItems={estimateUnitOptions}
                                        valueKey="id"
                                        textKey="name"
                                        hideSelectOption
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>

                                <div className="col-12 col-md-6 col-xl-2">
                                    <DateInput
                                        name={`due-${item.key}`}
                                        labelText="Deadline"
                                        inputType="datetime-local"
                                        value={item.dueAt}
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            patchItem(item.key, {
                                                dueAt: event.target.value,
                                            })
                                        }
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>

                                <div className="col-10 col-md-5 col-xl-2">
                                    <SelectInput
                                        name={`approver-${item.key}`}
                                        labelText="Approval"
                                        defaultSelect="No approval"
                                        value={item.approverUserId}
                                        onChange={(
                                            event: ChangeEvent<HTMLSelectElement>,
                                        ) =>
                                            patchItem(item.key, {
                                                approverUserId:
                                                    event.target.value,
                                            })
                                        }
                                        menuItems={approverOptions}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>

                                <div className="col-2 col-md-1">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                        aria-label="Remove action item"
                                        onClick={() =>
                                            setItems(currentItems =>
                                                currentItems.filter(
                                                    entry =>
                                                        entry.key !== item.key,
                                                ),
                                            )
                                        }
                                    >
                                        <i className="ri-delete-bin-line tw-text-danger"></i>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="alert alert-danger tw-mt-3 tw-mb-0">
                    {error}
                </div>
            )}

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button type="button" variant="primary" onClick={saveHandler}>
                    {session ? "Save to Session" : "Save MOM Session"}
                </Button>
            </div>
        </div>
    );
};

export default MomSessionModal;
