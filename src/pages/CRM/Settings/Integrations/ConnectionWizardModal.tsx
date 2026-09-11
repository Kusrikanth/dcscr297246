import { useMemo, useState, type ChangeEvent } from "react";
import { useHistory } from "react-router-dom";

import {
    Button,
    RadioInputContainer,
    TextInput,
} from "../../../../Components/Common";
import {
    integrationTypes,
    providerNameMap,
    wizardScreens,
    type Integration,
    type IntegrationType,
} from "./helper";

interface ConnectionWizardModalProps {
    presetType?: IntegrationType | null;
    toggle: () => void;
    onCreate: (integration: Integration) => void;
}

const ConnectionWizardModal = ({
    presetType,
    toggle,
    onCreate,
}: ConnectionWizardModalProps) => {
    const history = useHistory();

    const [integrationName, setIntegrationName] = useState<string>("");
    const [typeId, setTypeId] = useState<string>(presetType?.id || "");
    const [providerName, setProviderName] = useState<string>(
        presetType?.providers.length === 1 ? presetType.providers[0] : "",
    );
    const [error, setError] = useState<string>("");

    const steps = useMemo(
        () => (presetType ? [1, 3, 4] : [1, 2, 3, 4]),
        [presetType],
    );

    const [step, setStep] = useState<number>(steps[0]);

    const stepNumber = steps.indexOf(step) + 1;

    const selectedType = useMemo(
        () => integrationTypes.find(type => type.id === typeId),
        [typeId],
    );

    const nextHandler = () => {
        if (step === 1 && !integrationName.trim()) {
            setError("Enter a name for this integration");
            return;
        }

        if (step === 2 && !typeId) {
            setError("Select a service type");
            return;
        }

        if (step === 3 && !providerName) {
            setError("Select a provider");
            return;
        }

        setError("");
        setStep(steps[steps.indexOf(step) + 1] ?? step);
    };

    const createHandler = () => {
        if (!integrationName.trim() || !typeId || !providerName) {
            setError("Complete every step before creating the integration");
            return;
        }

        if (["callerdesk", "smartflo", "email"].includes(typeId)) {
            toggle();
            history.push(wizardScreens[typeId]);
            return;
        }

        onCreate({
            id: `integration-${Date.now()}`,
            integrationName: integrationName.trim(),
            providerName: providerNameMap[providerName] || providerName,
            status: "pending_auth",
            accountLabel: "",
            createdAt: new Date().toISOString(),
            lastSyncAt: "",
            recordsSynced: 0,
        });

        toggle();
    };

    return (
        <div className="tw-p-4">
            <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                Step {stepNumber} of {steps.length}
            </p>

            {error && (
                <div className="alert alert-danger tw-py-2">
                    <span className="tw-text-sm">{error}</span>
                </div>
            )}

            {step === 1 && (
                <TextInput
                    name="integrationName"
                    labelText="Integration Name"
                    labelClass="required"
                    placeHolder="e.g. Admissions Google Sheets"
                    maxLength={120}
                    autoFocus
                    helperText="A friendly name used to identify this connection."
                    value={integrationName}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setIntegrationName(event.target.value)
                    }
                />
            )}

            {step === 2 && (
                <>
                    <p className="tw-mb-2 tw-text-sm">
                        Select service type <span className="tw-text-danger">*</span>
                    </p>

                    <RadioInputContainer
                        name="integrationType"
                        radioOptions={integrationTypes.map(type => ({
                            id: type.id,
                            itemDisabled: !type.isAvailable,
                            name: (
                                <span className="tw-flex tw-items-center tw-gap-2">
                                    <span
                                        className="tw-grid tw-h-8 tw-w-8 tw-flex-shrink-0 tw-place-items-center tw-rounded tw-text-white"
                                        style={{ backgroundColor: type.accent }}
                                    >
                                        <i className={type.icon}></i>
                                    </span>
                                    {type.name}
                                </span>
                            ),
                            description: type.isAvailable
                                ? `${type.providers.length} provider${type.providers.length === 1 ? "" : "s"}`
                                : "Coming soon",
                        }))}
                        value={typeId}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            const selected = integrationTypes.find(
                                type => type.id === event.target.value,
                            );

                            if (selected) {
                                setTypeId(selected.id);
                                setProviderName(
                                    selected.providers.length === 1
                                        ? selected.providers[0]
                                        : "",
                                );
                            }
                        }}
                        inputContainerClassName="tw-flex-wrap tw-gap-3"
                    />
                </>
            )}

            {step === 3 && selectedType && (
                <>
                    <p className="tw-mb-2 tw-text-sm">
                        Select provider <span className="tw-text-danger">*</span>
                    </p>

                    <div className="tw-flex tw-flex-col tw-gap-2">
                        <RadioInputContainer
                            name="providerName"
                            radioOptions={selectedType.providers.map(provider => ({
                                id: provider,
                                name: (
                                    <span className="tw-text-sm tw-text-gray-800">
                                        {provider}
                                    </span>
                                ),
                            }))}
                            value={providerName}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                setProviderName(event.target.value)
                            }
                            inputContainerClassName="tw-flex-wrap tw-gap-3"
                        />
                    </div>
                </>
            )}

            {step === 4 && (
                <>
                    <p className="tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                        Ready to connect
                    </p>

                    <dl className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                        {[
                            { label: "Name", value: integrationName },
                            { label: "Type", value: selectedType?.name || "" },
                            { label: "Provider", value: providerName },
                        ].map(row => (
                            <div
                                key={row.label}
                                className="tw-flex tw-justify-between tw-gap-2 tw-py-0.5"
                            >
                                <dt className="tw-text-xs tw-text-gray-500">
                                    {row.label}
                                </dt>
                                <dd className="tw-mb-0 tw-text-sm tw-text-gray-800">
                                    {row.value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {typeId === "callerdesk"
                            ? "Next, enter the API credentials and map branch DIDs and CRM users."
                            : `Next, authorize ${providerName} to access your account.`}
                    </p>
                </>
            )}

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                {step < 4 ? (
                    <Button type="button" variant="primary" onClick={nextHandler}>
                        Next
                    </Button>
                ) : (
                    <Button type="button" variant="primary" onClick={createHandler}>
                        Create &amp; Authorize
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ConnectionWizardModal;
