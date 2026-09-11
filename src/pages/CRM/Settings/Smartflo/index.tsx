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
    copyToClipboard,
    secretPlaceholder,
    smartfloDepartments,
    smartfloNumbers,
} from "../helper";
import { withSettingsPage } from "../index";
import { toast } from "react-toastify";

const configurationGuide = [
    "Save credentials or token",
    "Test DID, IVR and user access",
    "Map branch DIDs and IVRs",
    "Map agents in User Management",
];

const savedConfiguration = {
    accountName: "Tata Smartflo",
    email: "crm@digitalcampus.in",
    defaultDid: "04044556677",
    defaultDepartmentId: "D-1",
    recordCalls: true,
    isConfigured: true,
    hasPassword: true,
    hasPermanentToken: false,
    webhookPath: "/api/smartflo/webhook",
};

const validationSchema = Yup.object().shape({
    accountName: Yup.string().trim().required("Account name is required"),

    email: Yup.string().trim().email("Enter a valid email address"),
});

const Smartflo = () => {
    const [isConfigured, setIsConfigured] = useState<boolean>(
        savedConfiguration.isConfigured,
    );
    const [stored, setStored] = useState({
        password: savedConfiguration.hasPassword,
        permanentToken: savedConfiguration.hasPermanentToken,
    });

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            accountName: savedConfiguration.accountName,
            email: savedConfiguration.email,
            password: "",
            permanentToken: "",
            defaultDid: savedConfiguration.defaultDid,
            defaultDepartmentId: savedConfiguration.defaultDepartmentId,
            recordCalls: savedConfiguration.recordCalls,
        },

        validationSchema,

        onSubmit: values => {
            const hasCredential =
                Boolean(values.permanentToken) ||
                stored.permanentToken ||
                (Boolean(values.email) && (Boolean(values.password) || stored.password));

            if (!hasCredential) {
                toast.error("Enter a login email and password, or a permanent access token");
                return;
            }

            setIsConfigured(true);
            setStored(current => ({
                password: current.password || Boolean(values.password),
                permanentToken:
                    current.permanentToken || Boolean(values.permanentToken),
            }));
            toast.success("Smartflo configuration saved");
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
                            <i className="ri-customer-service-2-line tw-text-lg"></i>
                        </span>

                        <div className="tw-min-w-0">
                            <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                                Account setup
                            </p>
                            <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                Credentials and tokens are encrypted and never returned to
                                the browser.
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
                                    name="email"
                                    labelText="Smartflo Login Email"
                                    helperText="Use with a password, or provide a permanent token instead"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={errorFor("email") ? true : false}
                                    error={errorFor("email")}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="password"
                                    inputType="password"
                                    labelText="Password"
                                    autoComplete="new-password"
                                    helperText="Creates a one-hour JWT token"
                                    placeHolder={secretPlaceholder(
                                        stored.password,
                                        "Smartflo password",
                                    )}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="permanentToken"
                                    inputType="password"
                                    labelText="Permanent Access Token"
                                    autoComplete="new-password"
                                    helperText="Optional alternative supplied by Tata support"
                                    placeHolder={secretPlaceholder(
                                        stored.permanentToken,
                                        "Optional permanent token",
                                    )}
                                    value={formik.values.permanentToken}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <SelectInput
                                    name="defaultDid"
                                    labelText="Default DID"
                                    defaultSelect="Select My Number"
                                    value={formik.values.defaultDid}
                                    onChange={formik.handleChange}
                                    menuItems={smartfloNumbers}
                                    valueKey="name"
                                    textKey="name"
                                />
                                <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                                    Fallback used when a branch has no Smartflo DID.
                                </p>
                            </div>

                            <div className="col-12 col-md-6">
                                <SelectInput
                                    name="defaultDepartmentId"
                                    labelText="Default Department"
                                    defaultSelect="No default department"
                                    value={formik.values.defaultDepartmentId}
                                    onChange={formik.handleChange}
                                    menuItems={smartfloDepartments}
                                    valueKey="id"
                                    textKey="name"
                                />
                                <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                                    Fallback routing department.
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
                                    Stores recording links returned by Tata. Provider-side
                                    recording must be enabled in Smartflo.
                                </p>
                            </div>
                        </div>

                        <div className="tw-mt-3 tw-flex tw-flex-wrap tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-3">
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={!isConfigured}
                                onClick={() =>
                                    toast.success("Smartflo connection is working")
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
                                Call-event webhook
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
                                Configure this public HTTPS URL in Smartflo to capture
                                outcomes, durations and recordings.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

const SmartfloPage = withSettingsPage(Smartflo, "Smartflo");

export default SmartfloPage;
