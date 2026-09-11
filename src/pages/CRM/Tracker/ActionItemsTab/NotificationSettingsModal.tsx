import { useMemo, useState, type ChangeEvent } from "react";

import {
    Button,
    InputCheckbox,
    SelectInput,
} from "../../../../Components/Common";
import {
    whatsAppAccounts,
    whatsAppTemplates,
} from "../../WhatsApp/helper";

export interface TrackerNotificationSettings {
    isEnabled: boolean;
    integrationId: string;
    actionItemTemplate: string;
    approvalTemplate: string;
}

interface NotificationSettingsModalProps {
    settings: TrackerNotificationSettings;
    toggle: () => void;
    onSave: (settings: TrackerNotificationSettings) => void;
}

const accountOptions = whatsAppAccounts
    .filter(item => item.hasCredentials)
    .map(item => ({ id: item.id, name: item.name }));

const NotificationSettingsModal = ({
    settings,
    toggle,
    onSave,
}: NotificationSettingsModalProps) => {
    const [form, setForm] =
        useState<TrackerNotificationSettings>(settings);
    const [error, setError] = useState<string>("");

    const templateOptions = useMemo(() => {
        if (!form.integrationId) {
            return [];
        }

        return whatsAppTemplates
            .filter(
                template =>
                    template.integrationId === form.integrationId &&
                    template.status === "APPROVED",
            )
            .map(template => ({
                id: template.templateName,
                name: template.templateName,
            }));
    }, [form.integrationId]);

    const accountChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        setForm(currentState => ({
            ...currentState,
            integrationId: event.target.value,
            actionItemTemplate: "",
            approvalTemplate: "",
        }));
        setError("");
    };

    const saveHandler = () => {
        if (form.isEnabled && !form.integrationId) {
            setError("Select the WhatsApp account these messages send from");
            return;
        }

        onSave(form);
        toggle();
    };

    return (
        <div className="tw-p-4">
            <InputCheckbox
                name="isEnabled"
                value={form.isEnabled}
                labelName="Send a WhatsApp message when an action item is created"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setForm(currentState => ({
                        ...currentState,
                        isEnabled: event.target.checked,
                    }))
                }
                formgroupClassName="tw-mb-3"
            />

            {form.isEnabled && (
                <>
                    <SelectInput
                        name="integrationId"
                        labelText="WhatsApp Account"
                        defaultSelect="Select an account"
                        value={form.integrationId}
                        onChange={accountChangeHandler}
                        menuItems={accountOptions}
                        valueKey="id"
                        textKey="name"
                        invalid={error ? true : false}
                        error={error}
                        labelClass="required"
                    />

                    <SelectInput
                        name="actionItemTemplate"
                        labelText="Action Item Template — sent to the owner"
                        defaultSelect="Do not message the owner"
                        value={form.actionItemTemplate}
                        onChange={(
                            event: ChangeEvent<HTMLSelectElement>,
                        ) =>
                            setForm(currentState => ({
                                ...currentState,
                                actionItemTemplate: event.target.value,
                            }))
                        }
                        menuItems={templateOptions}
                        valueKey="id"
                        textKey="name"
                        isDisabled={!form.integrationId}
                    />

                    <SelectInput
                        name="approvalTemplate"
                        labelText="Approval Template — sent to each approver"
                        defaultSelect="Do not message approvers"
                        value={form.approvalTemplate}
                        onChange={(
                            event: ChangeEvent<HTMLSelectElement>,
                        ) =>
                            setForm(currentState => ({
                                ...currentState,
                                approvalTemplate: event.target.value,
                            }))
                        }
                        menuItems={templateOptions}
                        valueKey="id"
                        textKey="name"
                        isDisabled={!form.integrationId}
                    />

                    <p className="tw-mb-0 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-2 tw-text-xs tw-text-gray-600">
                        Both templates receive two variables:{" "}
                        <strong>{"{{1}}"}</strong> the action item text and{" "}
                        <strong>{"{{2}}"}</strong> the due date. Messages go to
                        the number on each person's account in User Management;
                        anyone without one is skipped.
                    </p>
                </>
            )}

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    onClick={saveHandler}
                >
                    <i className="ri-save-line"></i>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default NotificationSettingsModal;
