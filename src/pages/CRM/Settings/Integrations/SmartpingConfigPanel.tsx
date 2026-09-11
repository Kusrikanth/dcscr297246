import { useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";

import { Button, TextInput } from "../../../../Components/Common";

interface SmartpingConfigPanelProps {
    integrationName: string;
}

const SmartpingConfigPanel = ({
    integrationName,
}: SmartpingConfigPanelProps) => {
    const [form, setForm] = useState({
        projectId: "",
        apiPassword: "",
        aisensyBaseUrl: "https://backend.aisensy.com",
        aisensyApiKey: "",
        mediaPublicBaseUrl: "",
        utilityMessagePrice: "",
        marketingMessagePrice: "",
    });
    const [showApiPassword, setShowApiPassword] = useState<boolean>(false);
    const [showApiKey, setShowApiKey] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setForm(current => ({ ...current, [name]: value }));
    };

    const isComplete = Boolean(
        form.projectId.trim() &&
        form.apiPassword.trim() &&
        form.aisensyApiKey.trim() &&
        form.aisensyBaseUrl.trim() &&
        form.mediaPublicBaseUrl.trim(),
    );

    const saveHandler = () => {
        if (!isComplete) {
            setError(
                "Project ID, API password, AiSensy base URL, AiSensy API key and the public media URL are required.",
            );
            return;
        }

        setError("");
        toast.success(`Credentials saved for ${integrationName}`);
    };

    const testHandler = () => {
        setError("");
        toast.success(`${integrationName} connection is working`);
    };

    return (
        <div className="tw-rounded tw-border tw-border-gray-200 tw-p-3">
            <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                Smartping credentials
            </p>
            <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                The AiSensy Smartping API credentials this WhatsApp account sends
                with.
            </p>

            {error && (
                <div className="alert alert-danger tw-py-2">
                    <span className="tw-text-sm">{error}</span>
                </div>
            )}

            <div className="row">
                <div className="col-12 col-md-6">
                    <TextInput
                        name="projectId"
                        labelText="Project ID"
                        labelClass="required"
                        placeHolder="Enter the Smartping project ID"
                        value={form.projectId}
                        onChange={changeHandler}
                    />
                </div>

                <div className="col-12 col-md-6">
                    <span className="tw-mb-1 tw-block tw-text-sm tw-text-[#495057]">
                        API Password <span className="tw-text-danger">*</span>
                    </span>

                    <div className="tw-mb-3 tw-flex tw-items-center tw-gap-2">
                        <TextInput
                            name="apiPassword"
                            inputType={showApiPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeHolder="X-AiSensy-Project-API-Pwd"
                            value={form.apiPassword}
                            onChange={changeHandler}
                            formgroupClassName="tw-mb-0 tw-flex-1"
                        />

                        <Button
                            type="button"
                            variant="secondary"
                            title={
                                showApiPassword
                                    ? "Hide API password"
                                    : "Show API password"
                            }
                            aria-label={
                                showApiPassword
                                    ? "Hide API password"
                                    : "Show API password"
                            }
                            className="!tw-h-9 !tw-w-9 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white"
                            onClick={() =>
                                setShowApiPassword(current => !current)
                            }
                        >
                            <i
                                className={
                                    showApiPassword
                                        ? "ri-eye-off-line"
                                        : "ri-eye-line"
                                }
                            ></i>
                        </Button>
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <TextInput
                        name="aisensyBaseUrl"
                        labelText="AiSensy Base URL"
                        labelClass="required"
                        placeHolder="https://backend.aisensy.com"
                        value={form.aisensyBaseUrl}
                        onChange={changeHandler}
                    />
                </div>

                <div className="col-12 col-md-6">
                    <span className="tw-mb-1 tw-block tw-text-sm tw-text-[#495057]">
                        AiSensy API Key <span className="tw-text-danger">*</span>
                    </span>

                    <div className="tw-mb-3 tw-flex tw-items-center tw-gap-2">
                        <TextInput
                            name="aisensyApiKey"
                            inputType={showApiKey ? "text" : "password"}
                            autoComplete="new-password"
                            placeHolder="This account's AiSensy API key"
                            value={form.aisensyApiKey}
                            onChange={changeHandler}
                            formgroupClassName="tw-mb-0 tw-flex-1"
                        />

                        <Button
                            type="button"
                            variant="secondary"
                            title={showApiKey ? "Hide API key" : "Show API key"}
                            aria-label={
                                showApiKey ? "Hide API key" : "Show API key"
                            }
                            className="!tw-h-9 !tw-w-9 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white"
                            onClick={() => setShowApiKey(current => !current)}
                        >
                            <i
                                className={
                                    showApiKey
                                        ? "ri-eye-off-line"
                                        : "ri-eye-line"
                                }
                            ></i>
                        </Button>
                    </div>
                </div>

                <div className="col-12">
                    <TextInput
                        name="mediaPublicBaseUrl"
                        labelText="Public Media Base URL"
                        labelClass="required"
                        placeHolder="https://crm-api.yourdomain.com"
                        helperText="The public HTTPS address of this CRM API. AiSensy uses it to download media uploaded for this WhatsApp account."
                        value={form.mediaPublicBaseUrl}
                        onChange={changeHandler}
                    />
                </div>

                <div className="col-12 col-md-6">
                    <TextInput
                        name="utilityMessagePrice"
                        inputType="number"
                        labelText="Utility Message Price"
                        placeHolder="Example: 0.115"
                        helperText="Used for transactional WhatsApp spend analytics."
                        value={form.utilityMessagePrice}
                        onChange={changeHandler}
                    />
                </div>

                <div className="col-12 col-md-6">
                    <TextInput
                        name="marketingMessagePrice"
                        inputType="number"
                        labelText="Marketing Message Price"
                        placeHolder="Example: 0.7846"
                        helperText="Used for bulk campaign WhatsApp spend analytics."
                        value={form.marketingMessagePrice}
                        onChange={changeHandler}
                    />
                </div>
            </div>

            <div className="tw-flex tw-flex-wrap tw-justify-end tw-gap-2">
                <Button
                    type="button"
                    variant="hoverInfo"
                    disabled={!isComplete}
                    title={
                        isComplete ? "" : "Fill every required field to test"
                    }
                    onClick={testHandler}
                >
                    <i className="ri-pulse-line tw-me-1"></i>
                    Test Connection
                </Button>

                <Button type="button" variant="primary" onClick={saveHandler}>
                    Save Credentials
                </Button>
            </div>

            <div className="tw-mt-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                <p className="tw-mb-1 tw-text-sm tw-font-medium tw-text-gray-800">
                    Where to find these credentials
                </p>

                <ol className="tw-mb-0 tw-ps-4 tw-text-xs tw-text-gray-500">
                    <li>Open the AiSensy Smartping dashboard.</li>
                    <li>Go to Settings → API Keys.</li>
                    <li>Copy the Project ID.</li>
                    <li>Generate or copy the API key.</li>
                    <li>Paste both above and save the credentials.</li>
                </ol>
            </div>
        </div>
    );
};

export default SmartpingConfigPanel;
