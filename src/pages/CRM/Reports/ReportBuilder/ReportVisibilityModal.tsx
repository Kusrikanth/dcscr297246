import { useState } from "react";

import { Button,
    InputCheckbox } from "../../../../Components/Common";
import { currentCrmUser, savedReportUsers } from "../helper";

interface ReportVisibilityModalProps {
    toggle: () => void;
    selectedUserIds: Array<string>;
    onConfirm: (userIds: Array<string>) => void;
}

const ReportVisibilityModal = ({
    toggle,
    selectedUserIds,
    onConfirm,
}: ReportVisibilityModalProps) => {
    const creator = currentCrmUser();
    const [selected, setSelected] = useState<Array<string>>(selectedUserIds.map(String));

    function toggleUserHndlr(userId: string) {
        if (String(creator?.id) === userId) {
            return;
        }

        setSelected(current =>
            current.includes(userId)
                ? current.filter(item => item !== userId)
                : [...current, userId]
        );
    }

    return (
        <div className="tw-p-4">
            <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                Select who can view this report in the reports library. Everyone chosen sees the
                same live data, filtered by the report&apos;s own filters.
            </p>

            <div className="tw-mb-3 tw-max-h-72 tw-overflow-auto tw-rounded-lg tw-border tw-border-gray-200">
                {savedReportUsers.map(user => {
                    const isCreator = String(creator?.id) === String(user.id);
                    const checked = isCreator || selected.includes(String(user.id));

                    return (
                        <div
                            className="tw-flex tw-items-center tw-gap-3 tw-border-b tw-border-gray-100 tw-px-3 tw-py-2 last:tw-border-b-0"
                            key={user.id}
                        >
                            <InputCheckbox
                                name={`visibility-${user.id}`}
                                value={checked}
                                isDisabled={isCreator}
                                onChange={() => toggleUserHndlr(String(user.id))}
                                formgroupClassName="tw-mb-0"
                            />

                            <div className="tw-flex-1">
                                <div className="tw-text-sm tw-font-medium">{user.name}</div>
                                <div className="tw-text-xs tw-text-gray-500">
                                    {[user.email, user.role].filter(Boolean).join(" · ")}
                                </div>
                            </div>

                            {isCreator && (
                                <span className="tw-text-xs tw-font-semibold tw-text-[#405189]">
                                    Creator
                                </span>
                            )}
                        </div>
                    );
                })}

                {!savedReportUsers.length && (
                    <p className="tw-mb-0 tw-p-3 tw-text-sm tw-text-gray-500">
                        No users found. This report will be visible only to you.
                    </p>
                )}
            </div>

            <div className="tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    onClick={() =>
                        onConfirm([
                            ...new Set([
                                ...(creator?.id ? [String(creator.id)] : []),
                                ...selected,
                            ]),
                        ])
                    }
                >
                    Save Visibility
                </Button>
            </div>
        </div>
    );
};

export default ReportVisibilityModal;
