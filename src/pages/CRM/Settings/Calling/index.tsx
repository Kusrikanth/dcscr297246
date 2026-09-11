import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    InputCheckbox,
    SelectInput,
    TextInput,
} from "../../../../Components/Common";
import {
    callerDeskDeskphones,
    callerDeskGroups,
    copyToClipboard,
    secretPlaceholder,
} from "../helper";
import { withSettingsPage } from "../index";
import { toast } from "react-toastify";

const configurationGuide = [
    "Save API credentials",
    "Test connection",
    "Configure branch DIDs in Business Units",
    "Map members in User Management",
];

const savedConfiguration = {
    accountName: "CallerDesk",
    defaultDeskphone: "04023456789",
    defaultGroupName: "Admissions Desk",
    recordCalls: true,
    isConfigured: true,
    hasApiKey: true,
    hasApiSecret: true,
    hasIntegrationKey: true,
    webhookPath: "/api/callerdesk/webhook",
};

const validationSchema = Yup.object().shape({
    accountName: Yup.string().trim().required("Account name is required"),
});

const Calling = () => {
    const [isConfigured, setIsConfigured] = useState<boolean>(
        savedConfiguration.isConfigured,
    );
    const [stored, setStored] = useState({
        apiKey: savedConfiguration.hasApiKey,
        apiSecret: savedConfiguration.hasApiSecret,
        integrationKey: savedConfiguration.hasIntegrationKey,
    });

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            accountName: savedConfiguration.accountName,
            apiKey: "",
            apiSecret: "",
            integrationKey: "",
            defaultDeskphone: savedConfiguration.defaultDeskphone,
            defaultGroupName: savedConfiguration.defaultGroupName,
            recordCalls: savedConfiguration.recordCalls,
        },

        validationSchema,

        onSubmit: values => {
            setIsConfigured(true);
            setStored(current => ({
                apiKey: current.apiKey || Boolean(values.apiKey),
                apiSecret: current.apiSecret || Boolean(values.apiSecret),
                integrationKey:
                    current.integrationKey || Boolean(values.integrationKey),
            }));
            toast.success("CallerDesk configuration saved");
        },
    });

    const errorFor = (field: keyof typeof formik.values) =>
        formik.touched[field] && formik.errors[field]
            ? (formik.errors[field] as string)
            : "";

    const webhookUrl = `${window.location.origin}${savedConfiguration.webhookPath}`;

    return (
        <>
            <div className="tw-card tw-mb-4">
                <div className="tw-card-body">
                    <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3">
                        <span className="tw-text-sm tw-font-semibold tw-text-gray-800">
                            Configuration guide
                        </span>

                        {configurationGuide.map((step, index) => (
                            <span
                                key={step}
                                className="tw-inline-flex tw-items-center tw-gap-1.5 tw-text-xs tw-text-gray-600"
                            >
                                <span className="tw-grid tw-h-5 tw-w-5 tw-place-items-center tw-rounded-full tw-bg-[#eef1f7] tw-text-[11px] tw-font-semibold tw-text-[#405189]">
                                    {index + 1}
                                </span>
                                {step}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="tw-card">
                <div className="tw-card-body">
                    <div className="tw-mb-3 tw-flex tw-items-start tw-gap-3">
                        <span className="tw-grid tw-h-11 tw-w-11 tw-flex-shrink-0 tw-place-items-center tw-rounded-full tw-bg-[#eef1f7] tw-text-[#405189]">
                            <i className="ri-phone-line tw-text-lg"></i>
                        </span>

                        <div className="tw-min-w-0">
                            <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                                Account setup
                            </p>
                            <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                The authcode is encrypted and never returned to the
                                browser.
                            </p>
                        </div>

                        {isConfigured && (
                            <span className="badge badge-soft-success tw-ms-auto">
                                <i className="ri-checkbox-circle-line tw-me-1"></i>
                                Connected
                            </span>
                        )}
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="accountName"
                                    labelText="Account Name"
                                    labelClass="required"
                                    placeHolder="Friendly name used inside the CRM"
                                    helperText="Friendly name used inside the CRM"
                                    value={formik.values.accountName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={errorFor("accountName") ? true : false}
                                    error={errorFor("accountName")}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="apiKey"
                                    inputType="password"
                                    labelText="API Key / Authcode"
                                    autoComplete="new-password"
                                    helperText="API & Integration → API Key"
                                    placeHolder={secretPlaceholder(
                                        stored.apiKey,
                                        "Paste the CallerDesk API key",
                                    )}
                                    value={formik.values.apiKey}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="apiSecret"
                                    inputType="password"
                                    labelText="Secret Key"
                                    autoComplete="new-password"
                                    helperText="Used with the API key as Basic Auth"
                                    placeHolder={secretPlaceholder(
                                        stored.apiSecret,
                                        "Paste the CallerDesk secret key",
                                    )}
                                    value={formik.values.apiSecret}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="integrationKey"
                                    inputType="password"
                                    labelText="Integration Key"
                                    autoComplete="new-password"
                                    helperText="Shown beside the API and secret keys"
                                    placeHolder={secretPlaceholder(
                                        stored.integrationKey,
                                        "Paste the CallerDesk integration key",
                                    )}
                                    value={formik.values.integrationKey}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <SelectInput
                                    name="defaultDeskphone"
                                    labelText="Default Deskphone / DID"
                                    defaultSelect="Select from CallerDesk"
                                    value={formik.values.defaultDeskphone}
                                    onChange={formik.handleChange}
                                    menuItems={callerDeskDeskphones.map(item => ({
                                        id: item.name,
                                        name: `${item.name} · DID ID ${item.id}`,
                                    }))}
                                    valueKey="id"
                                    textKey="name"
                                />
                                <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                                    Fallback used when a branch has no DID of its own.
                                </p>
                            </div>

                            <div className="col-12 col-md-6">
                                <SelectInput
                                    name="defaultGroupName"
                                    labelText="Default Call Group"
                                    defaultSelect="No default group"
                                    value={formik.values.defaultGroupName}
                                    onChange={formik.handleChange}
                                    menuItems={callerDeskGroups}
                                    valueKey="name"
                                    textKey="name"
                                />
                                <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                                    Fallback routing group.
                                </p>
                            </div>

                            <div className="col-12">
                                <InputCheckbox
                                    name="recordCalls"
                                    labelName="Capture call recordings in the CRM"
                                    value={formik.values.recordCalls}
                                    onChange={formik.handleChange}
                                />
                                <p className="tw-mb-0 tw-ms-4 tw-text-xs tw-text-gray-500">
                                    Stores recording links returned by CallerDesk.
                                    Provider-side recording must be enabled in CallerDesk.
                                </p>
                            </div>
                        </div>

                        <div className="tw-mt-3 tw-flex tw-flex-wrap tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-3">
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={!isConfigured}
                                onClick={() =>
                                    toast.success("CallerDesk connection is working")
                                }
                            >
                                <i className="ri-pulse-line"></i>
                                Test Connection
                            </Button>

                            <Button type="submit" variant="primary">
                                Save Configuration
                            </Button>
                        </div>
                    </form>

                    {isConfigured && (
                        <div className="tw-mt-4 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                            <p className="tw-mb-1 tw-text-sm tw-font-medium tw-text-gray-800">
                                Outcome webhook
                            </p>

                            <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                                <code className="tw-break-all tw-text-xs tw-text-[#405189]">
                                    {webhookUrl}
                                </code>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                    title="Copy webhook URL"
                                    aria-label="Copy webhook URL"
                                    onClick={() => copyToClipboard(webhookUrl)}
                                >
                                    <i className="ri-file-copy-line"></i>
                                </Button>
                            </div>

                            <p className="tw-mb-0 tw-mt-1 tw-text-xs tw-text-gray-500">
                                Add this URL in CallerDesk to receive status, duration,
                                recordings, costs and call direction.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const CallingPage = withSettingsPage(Calling, "Calling");

export default CallingPage;
