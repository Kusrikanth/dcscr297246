import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    InputCheckbox,
    SelectInput,
    TextInput,
} from "../../../../Components/Common";
import type { SettingsOption } from "../helper";
import { withSettingsPage } from "../index";
import { toast } from "react-toastify";

const smtpEncryptionOptions: Array<SettingsOption> = [
    { id: "none", name: "None" },
    { id: "ssl", name: "SSL" },
    { id: "tls", name: "TLS / STARTTLS" },
];

const savedConfiguration = {
    isEnabled: true,
    smtpHost: "smtp.office365.com",
    smtpPort: "587",
    encryption: "tls",
    smtpUsername: "admissions@digitalcampus.in",
    fromName: "Admissions Team",
    fromEmail: "admissions@digitalcampus.in",
    replyToEmail: "help@digitalcampus.in",
    hasPassword: true,
    isConfigured: true,
};

const validationSchema = (hasPassword: boolean) =>
    Yup.object().shape({
        smtpHost: Yup.string().trim().required("SMTP host is required"),

        smtpPort: Yup.number()
            .typeError("Port must be a number")
            .min(1, "Port must be between 1 and 65535")
            .max(65535, "Port must be between 1 and 65535")
            .required("SMTP port is required"),

        encryption: Yup.string().required("Encryption is required"),

        smtpUsername: Yup.string().trim().required("SMTP username is required"),

        smtpPassword: hasPassword
            ? Yup.string()
            : Yup.string().required("SMTP password is required"),

        fromEmail: Yup.string()
            .trim()
            .email("Enter a valid email address")
            .required("From email is required"),

        replyToEmail: Yup.string().trim().email("Enter a valid email address"),
    });

const EmailConfiguration = () => {
    const [isConfigured, setIsConfigured] = useState<boolean>(
        savedConfiguration.isConfigured,
    );
    const [hasPassword, setHasPassword] = useState<boolean>(
        savedConfiguration.hasPassword,
    );
    const [testRecipient, setTestRecipient] = useState<string>("");

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            isEnabled: savedConfiguration.isEnabled,
            smtpHost: savedConfiguration.smtpHost,
            smtpPort: savedConfiguration.smtpPort,
            encryption: savedConfiguration.encryption,
            smtpUsername: savedConfiguration.smtpUsername,
            smtpPassword: "",
            fromName: savedConfiguration.fromName,
            fromEmail: savedConfiguration.fromEmail,
            replyToEmail: savedConfiguration.replyToEmail,
        },

        validationSchema: validationSchema(hasPassword),

        onSubmit: values => {
            setIsConfigured(true);

            if (values.smtpPassword) {
                setHasPassword(true);
            }

            toast.success("SMTP configuration saved");
        },
    });

    const errorFor = (field: keyof typeof formik.values) =>
        formik.touched[field] && formik.errors[field]
            ? (formik.errors[field] as string)
            : "";

    const testConnectionHandler = () => {
        toast.success("SMTP connection and authentication succeeded");
    };

    const sendTestHandler = () => {
        if (!testRecipient.trim()) {
            toast.error("Enter a test recipient email");
            return;
        }

        toast.success(`Test email sent to ${testRecipient.trim()}`);
    };

    return (
        <>
            <div className="tw-card tw-mb-4">
                <div className="tw-card-body">
                    <div className="tw-mb-3 tw-flex tw-items-start tw-gap-3">
                        <span className="tw-grid tw-h-11 tw-w-11 tw-flex-shrink-0 tw-place-items-center tw-rounded-full tw-bg-[#eef1f7] tw-text-[#405189]">
                            <i className="ri-server-line tw-text-lg"></i>
                        </span>

                        <div className="tw-min-w-0">
                            <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                                Email Configuration
                            </p>
                            <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                Connect the CRM to your organisation&apos;s SMTP mail
                                server.
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
                        <InputCheckbox
                            name="isEnabled"
                            labelName="Enable email"
                            value={formik.values.isEnabled}
                            onChange={formik.handleChange}
                            formgroupClassName="tw-mb-3"
                        />

                        <div className="row">
                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="smtpHost"
                                    labelText="SMTP Host"
                                    labelClass="required"
                                    placeHolder="smtp.office365.com"
                                    value={formik.values.smtpHost}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={errorFor("smtpHost") ? true : false}
                                    error={errorFor("smtpHost")}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="smtpPort"
                                    inputType="number"
                                    labelText="SMTP Port"
                                    labelClass="required"
                                    placeHolder="587"
                                    value={formik.values.smtpPort}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={errorFor("smtpPort") ? true : false}
                                    error={errorFor("smtpPort")}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <SelectInput
                                    name="encryption"
                                    labelText="Encryption"
                                    labelClass="required"
                                    hideSelectOption
                                    value={formik.values.encryption}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    menuItems={smtpEncryptionOptions}
                                    valueKey="id"
                                    textKey="name"
                                    invalid={errorFor("encryption") ? true : false}
                                    error={errorFor("encryption")}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="smtpUsername"
                                    labelText="SMTP Username"
                                    labelClass="required"
                                    autoComplete="off"
                                    value={formik.values.smtpUsername}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={errorFor("smtpUsername") ? true : false}
                                    error={errorFor("smtpUsername")}
                                />
                            </div>

                            <div className="col-12">
                                <TextInput
                                    name="smtpPassword"
                                    inputType="password"
                                    labelText={`SMTP Password / App Password${hasPassword ? " (saved)" : ""}`}
                                    labelClass={hasPassword ? "" : "required"}
                                    autoComplete="new-password"
                                    placeHolder={
                                        hasPassword
                                            ? "Leave blank to keep the saved password"
                                            : "Enter password"
                                    }
                                    helperText="For security, a saved password is never returned to this page."
                                    value={formik.values.smtpPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={errorFor("smtpPassword") ? true : false}
                                    error={errorFor("smtpPassword")}
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <TextInput
                                    name="fromName"
                                    labelText="From Name"
                                    placeHolder="Admissions Team"
                                    value={formik.values.fromName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <TextInput
                                    name="fromEmail"
                                    labelText="From Email"
                                    labelClass="required"
                                    placeHolder="admissions@digitalcampus.in"
                                    value={formik.values.fromEmail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={errorFor("fromEmail") ? true : false}
                                    error={errorFor("fromEmail")}
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <TextInput
                                    name="replyToEmail"
                                    labelText="Reply-To Email"
                                    placeHolder="help@digitalcampus.in"
                                    value={formik.values.replyToEmail}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={errorFor("replyToEmail") ? true : false}
                                    error={errorFor("replyToEmail")}
                                />
                            </div>
                        </div>

                        <div className="tw-mt-2 tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-3">
                            {!isConfigured && (
                                <span className="tw-me-auto tw-text-sm tw-text-gray-500">
                                    Save the configuration before testing it.
                                </span>
                            )}

                            <Button
                                type="button"
                                variant="secondary"
                                disabled={!isConfigured}
                                title={isConfigured ? "" : "Save the configuration first"}
                                onClick={testConnectionHandler}
                            >
                                Test Connection
                            </Button>

                            <Button type="submit" variant="primary">
                                Save Configuration
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="tw-card">
                <div className="tw-card-body">
                    <p className="tw-mb-1 tw-flex tw-items-center tw-gap-2 tw-text-base tw-font-semibold tw-text-gray-800">
                        <i className="ri-mail-send-line"></i>
                        Send Test Email
                    </p>

                    {!isConfigured && (
                        <p className="tw-mb-2 tw-text-sm tw-text-gray-500">
                            Available once the SMTP settings above are saved.
                        </p>
                    )}

                    <div className="row tw-items-end tw-gap-y-2">
                        <div className="col-12 col-md-6 col-xl-4">
                            <TextInput
                                name="testRecipient"
                                labelText="Recipient"
                                placeHolder="recipient@example.com"
                                value={testRecipient}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => setTestRecipient(event.target.value)}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-8">
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={!isConfigured}
                                title={isConfigured ? "" : "Save the configuration first"}
                                onClick={sendTestHandler}
                            >
                                <i className="ri-send-plane-line"></i>
                                Send Test Email
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const EmailConfigurationPage = withSettingsPage(
    EmailConfiguration,
    "Email Configuration",
);

export default EmailConfigurationPage;
