import { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button, SelectInput, TextInput } from "../../../../Components/Common";
import { secretPlaceholder, settingsBranches } from "../helper";
import { toast } from "react-toastify";

export const jodoDefaultBaseUrl = "https://ext.jodo.in";

interface JodoBranchConfig {
    collectorCode: string;
    baseUrl: string;
    hasApiKey: boolean;
    hasSecretKey: boolean;
    hasAuthHeader: boolean;
}

const blankConfig: JodoBranchConfig = {
    collectorCode: "",
    baseUrl: jodoDefaultBaseUrl,
    hasApiKey: false,
    hasSecretKey: false,
    hasAuthHeader: false,
};

const savedConfigs: Record<string, JodoBranchConfig> = {
    "1": {
        collectorCode: "NACHARAM",
        baseUrl: jodoDefaultBaseUrl,
        hasApiKey: true,
        hasSecretKey: true,
        hasAuthHeader: true,
    },
    "2": {
        collectorCode: "KOMPALLY",
        baseUrl: jodoDefaultBaseUrl,
        hasApiKey: true,
        hasSecretKey: true,
        hasAuthHeader: false,
    },
    "3": {
        collectorCode: "",
        baseUrl: "https://uat.jodo.in",
        hasApiKey: true,
        hasSecretKey: false,
        hasAuthHeader: false,
    },
};

const validationSchema = Yup.object().shape({
    baseUrl: Yup.string()
        .trim()
        .url("Enter a valid URL, e.g. https://ext.jodo.in")
        .required("API base URL is required"),
});

const BranchSettings = () => {
    const [branchId, setBranchId] = useState<string>(
        settingsBranches[0]?.id || "",
    );
    const [configs, setConfigs] =
        useState<Record<string, JodoBranchConfig>>(savedConfigs);

    const stored = useMemo(
        () => configs[branchId] || blankConfig,
        [branchId, configs],
    );

    const selectedBranch = useMemo(
        () => settingsBranches.find(branch => branch.id === branchId),
        [branchId],
    );

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            apiKey: "",
            secretKey: "",
            authHeader: "",
            baseUrl: stored.baseUrl || jodoDefaultBaseUrl,
            collectorCode: stored.collectorCode,
        },

        validationSchema,

        onSubmit: values => {
            setConfigs(current => ({
                ...current,
                [branchId]: {
                    collectorCode: values.collectorCode.trim(),
                    baseUrl: values.baseUrl.trim(),
                    hasApiKey: stored.hasApiKey || Boolean(values.apiKey),
                    hasSecretKey: stored.hasSecretKey || Boolean(values.secretKey),
                    hasAuthHeader: stored.hasAuthHeader || Boolean(values.authHeader),
                },
            }));

            toast.success(`Jodo payment configuration saved for ${selectedBranch?.name}`);
        },
    });

    const errorFor = (field: keyof typeof formik.values) =>
        formik.touched[field] && formik.errors[field]
            ? (formik.errors[field] as string)
            : "";

    const hasCredentials =
        Boolean(formik.values.authHeader) ||
        stored.hasAuthHeader ||
        ((Boolean(formik.values.apiKey) || stored.hasApiKey) &&
            (Boolean(formik.values.secretKey) || stored.hasSecretKey));

    return (
        <>
            <div className="tw-card tw-mb-4">
                <div className="tw-card-body">
                    <div className="row tw-items-end tw-gap-y-3">
                        <div className="col-12 col-md-6 col-xl-4">
                            <SelectInput
                                name="branchId"
                                labelText="Branch"
                                hideSelectOption
                                value={branchId}
                                onChange={(
                                    event: React.ChangeEvent<HTMLSelectElement>,
                                ) => setBranchId(event.target.value)}
                                menuItems={settingsBranches}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-8">
                            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2">
                                <span
                                    className={`badge ${hasCredentials
                                        ? "badge-soft-success"
                                        : "badge-soft-warning"
                                        }`}
                                >
                                    {hasCredentials
                                        ? "Payment credentials set"
                                        : "No payment credentials"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tw-card">
                <div className="tw-card-body">
                    <div className="alert alert-info tw-flex tw-items-start tw-gap-2">
                        <i className="ri-information-line tw-mt-0.5"></i>
                        <span>
                            Get these credentials from your Jodo dashboard at{" "}
                            <strong>https://dashboard.jodo.in</strong>. They are stored
                            against{" "}
                            <strong>{selectedBranch?.name || "this branch"}</strong> and
                            are never shown on a public form.
                        </span>
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="apiKey"
                                    inputType="password"
                                    labelText="API Key"
                                    autoComplete="new-password"
                                    placeHolder={secretPlaceholder(
                                        stored.hasApiKey,
                                        "Enter your Jodo API key",
                                    )}
                                    value={formik.values.apiKey}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="secretKey"
                                    inputType="password"
                                    labelText="Secret Key"
                                    autoComplete="new-password"
                                    placeHolder={secretPlaceholder(
                                        stored.hasSecretKey,
                                        "Enter your Jodo secret key",
                                    )}
                                    value={formik.values.secretKey}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="baseUrl"
                                    labelText="API Base URL"
                                    labelClass="required"
                                    placeHolder={jodoDefaultBaseUrl}
                                    helperText="Live is https://ext.jodo.in. Point a branch at the UAT host to test against it."
                                    value={formik.values.baseUrl}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={errorFor("baseUrl") ? true : false}
                                    error={errorFor("baseUrl")}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="authHeader"
                                    inputType="password"
                                    labelText="Authorization Header"
                                    autoComplete="new-password"
                                    helperText="Paste the value Jodo issued. Leave blank to derive it from the API key and secret."
                                    placeHolder={secretPlaceholder(
                                        stored.hasAuthHeader,
                                        "Basic ....==",
                                    )}
                                    value={formik.values.authHeader}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="collectorCode"
                                    labelText="Collector Code"
                                    placeHolder="Optional collector code (if required by Jodo)"
                                    value={formik.values.collectorCode}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>

                        <div className="tw-mt-2 tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-3">
                            {!hasCredentials && (
                                <span className="tw-me-auto tw-text-sm tw-text-gray-500">
                                    Enter an Authorization header, or both the API key and
                                    secret.
                                </span>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={!hasCredentials}
                            >
                                Save Configuration
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default BranchSettings;
