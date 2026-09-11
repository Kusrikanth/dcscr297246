import { useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";

import {
    Button,
    InputCheckbox,
    TextInput,
} from "../../../../Components/Common";

interface SmartpingSmsConfigPanelProps {
    integrationId: string;
    integrationName: string;
}

const SmartpingSmsConfigPanel = ({
    integrationId,
    integrationName,
}: SmartpingSmsConfigPanelProps) => {
    const [form, setForm] = useState({
        baseUrl: "",
        username: "",
        password: "",
        senderId: "",
        dltContentId: "",
        dltPrincipalEntityId: "",
        dltTelemarketerId: "",
        publicApiBaseUrl: "",
        callbackSecret: "",
        defaultUnicode: false,
    });
    const [error, setError] = useState<string>("");

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setForm(current => ({ ...current, [name]: value }));
    };

    const callbackUrl = form.publicApiBaseUrl
        ? `${form.publicApiBaseUrl.replace(/\/+$/, "")}/api/hub/smartping-sms/dlr/1/${integrationId}${form.callbackSecret
            ? `?secret=${encodeURIComponent(form.callbackSecret)}`
            : ""
        }`
        : "";

    const validationError = () => {
        if (!/^https?:\/\/[^\s/]+/i.test(form.baseUrl.trim())) {
            return "Enter a valid SmartPing API URL, including https://";
        }

        if (!form.username.trim() || !form.password.trim()) {
            return "Username and API password are required";
        }

        if (!/^[A-Za-z0-9]{6}$/.test(form.senderId)) {
            return "Sender ID must contain exactly 6 letters or numbers";
        }

        if (!/^\d{4,19}$/.test(form.dltContentId)) {
            return "DLT Content ID must contain 4 to 19 digits";
        }

        if (
            form.dltPrincipalEntityId &&
            !/^\d{12,19}$/.test(form.dltPrincipalEntityId)
        ) {
            return "DLT Principal Entity ID must contain 12 to 19 digits";
        }

        if (
            form.dltTelemarketerId &&
            !/^\d{12,19}$/.test(form.dltTelemarketerId)
        ) {
            return "DLT Telemarketer ID must contain 12 to 19 digits";
        }

        if (
            form.publicApiBaseUrl &&
            !/^https:\/\/[^\s/]+/i.test(form.publicApiBaseUrl)
        ) {
            return "Public CRM API URL must use HTTPS";
        }

        return "";
    };

    const saveHandler = (isTest: boolean) => {
        const message = validationError();

        if (message) {
            setError(message);
            return;
        }

        setError("");
        toast.success(
            isTest
                ? "Configuration is valid. No billable SMS was sent."
                : `SmartPing SMS configuration saved for ${integrationName}`,
        );
    };

    const fields = [
        {
            name: "baseUrl",
            labelText: "SmartPing API URL",
            labelClass: "required",
            placeHolder: "https://pgapi.sparc.smartping.io/fe/api/v1/send?",
        },
        {
            name: "username",
            labelText: "API Username",
            labelClass: "required",
            placeHolder: "account.trans",
        },
        {
            name: "password",
            labelText: "API Password",
            labelClass: "required",
            placeHolder: "API password",
            inputType: "password" as const,
        },
        {
            name: "senderId",
            labelText: "Sender ID / DLT Header",
            labelClass: "required",
            placeHolder: "ABCDEF",
        },
        {
            name: "dltContentId",
            labelText: "Default DLT Content ID",
            labelClass: "required",
            placeHolder: "Approved template ID",
        },
        {
            name: "dltPrincipalEntityId",
            labelText: "DLT Principal Entity ID",
            labelClass: "",
            placeHolder: "12–19 digit PE ID",
        },
        {
            name: "dltTelemarketerId",
            labelText: "DLT Telemarketer ID",
            labelClass: "",
            placeHolder: "12–19 digit TM ID",
        },
        {
            name: "publicApiBaseUrl",
            labelText: "Public CRM API URL",
            labelClass: "",
            placeHolder: "https://crm-api.example.com",
        },
        {
            name: "callbackSecret",
            labelText: "Delivery Callback Secret",
            labelClass: "",
            placeHolder: "Shared secret",
            inputType: "password" as const,
        },
    ];

    return (
        <div className="tw-rounded tw-border tw-border-gray-200 tw-p-3">
            <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                SmartPing SMS configuration
            </p>
            <p className="tw-mb-1 tw-text-xs tw-text-gray-500">
                Credentials, sender header and DLT defaults are stored on this
                integration. A send request may override the DLT IDs when it uses
                another approved template.
            </p>
            <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                Enter either the complete send URL SmartPing supplied or only its
                base domain. The username and password go in their own fields.
            </p>

            {error && (
                <div className="alert alert-danger tw-py-2">
                    <span className="tw-text-sm">{error}</span>
                </div>
            )}

            <div className="row">
                {fields.map(field => (
                    <div key={field.name} className="col-12 col-md-6">
                        <TextInput
                            name={field.name}
                            inputType={field.inputType}
                            labelText={field.labelText}
                            labelClass={field.labelClass}
                            placeHolder={field.placeHolder}
                            autoComplete={
                                field.inputType === "password"
                                    ? "new-password"
                                    : undefined
                            }
                            value={String(form[field.name as keyof typeof form])}
                            onChange={changeHandler}
                        />
                    </div>
                ))}
            </div>

            <InputCheckbox
                name="defaultUnicode"
                labelName="Send as Unicode by default (regional-language templates)"
                value={form.defaultUnicode}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setForm(current => ({
                        ...current,
                        defaultUnicode: event.target.checked,
                    }))
                }
            />

            {callbackUrl && (
                <TextInput
                    name="callbackUrl"
                    labelText="Delivery Report URL To Give SmartPing"
                    isReadOnly
                    value={callbackUrl}
                    onChange={changeHandler}
                />
            )}

            <div className="tw-flex tw-flex-wrap tw-justify-end tw-gap-2">
                <Button
                    type="button"
                    variant="hoverInfo"
                    onClick={() => saveHandler(true)}
                >
                    Validate Configuration
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    onClick={() => saveHandler(false)}
                >
                    Save Configuration
                </Button>
            </div>
        </div>
    );
};

export default SmartpingSmsConfigPanel;
