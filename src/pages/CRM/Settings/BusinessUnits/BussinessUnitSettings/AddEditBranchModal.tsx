import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    InputCheckbox,
    SelectInput,
    TextInput,
} from "../../../../../Components/Common";
import { crmUsers } from "../../Users/helper";
import {
    callerDeskDeskphones,
    callerDeskGroups,
    secretPlaceholder,
    smartfloDepartments,
    smartfloIvrs,
    smartfloNumbers,
} from "../../helper";
import {
    assignmentModeOptions,
    whatsappAccountOptions,
    type BusinessUnitConfig,
    type UnitBranch,
} from "../../businessunitconfig";

interface AddEditBranchModalProps {
    data?: UnitBranch;
    pipelines: BusinessUnitConfig["leadPipelines"];
    toggle: () => void;
    onSave: (branch: UnitBranch, isNew: boolean) => void;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Branch name is required"),

    jodoBaseUrl: Yup.string()
        .trim()
        .url("Enter a valid URL, e.g. https://ext.jodo.in")
        .required("API base URL is required"),
});

const AddEditBranchModal = ({
    data,
    pipelines,
    toggle,
    onSave,
}: AddEditBranchModalProps) => {
    const isEdit = Boolean(data);

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            name: data?.name || "",
            shortName: data?.shortName || "",
            isActive: data ? data.isActive : true,
            callerdeskDidNumber: data?.callerdeskDidNumber || "",
            callerdeskCallGroup: data?.callerdeskCallGroup || "",
            callerdeskInboundEnabled: data ? data.callerdeskInboundEnabled : true,
            callerdeskOutboundEnabled: data ? data.callerdeskOutboundEnabled : true,
            smartfloDidNumber: data?.smartfloDidNumber || "",
            smartfloIvrId: data?.smartfloIvrId || "",
            smartfloDepartmentId: data?.smartfloDepartmentId || "",
            smartfloInboundEnabled: data ? data.smartfloInboundEnabled : true,
            smartfloOutboundEnabled: data ? data.smartfloOutboundEnabled : true,
            jodoBaseUrl: data?.jodoBaseUrl || "https://ext.jodo.in",
            jodoCollectorCode: data?.jodoCollectorCode || "",
            jodoApiKey: "",
            jodoSecretKey: "",
            jodoAuthHeader: "",
            pipelineIds: data?.pipelineIds || [],
            whatsappAccountIds: data?.whatsappAccountIds || [],
            whatsappDefaultAccountId: data?.whatsappDefaultAccountId || "",
            whatsappAutoCreateLead: data
                ? data.whatsappAutoCreateLead
                : true,
            whatsappAssignmentMode:
                data?.whatsappAssignmentMode || "unassigned",
            whatsappOwnerEmployeeId: data?.whatsappOwnerEmployeeId || "",
            whatsappIntakeBranchId: data?.whatsappIntakeBranchId || "",
        },

        validationSchema,

        onSubmit: values => {
            const deskphone = callerDeskDeskphones.find(
                item => item.name === values.callerdeskDidNumber,
            );
            const smartfloNumber = smartfloNumbers.find(
                item => item.name === values.smartfloDidNumber,
            );
            const ivr = smartfloIvrs.find(
                item => item.id === values.smartfloIvrId,
            );

            onSave(
                {
                    id: data?.id || `branch-${Date.now()}`,
                    name: values.name.trim(),
                    shortName: values.shortName.trim(),
                    isActive: values.isActive,
                    callerdeskDidNumber: values.callerdeskDidNumber,
                    callerdeskDidId: deskphone?.id || "",
                    callerdeskCallGroup: values.callerdeskCallGroup,
                    callerdeskInboundEnabled: values.callerdeskInboundEnabled,
                    callerdeskOutboundEnabled: values.callerdeskOutboundEnabled,
                    smartfloDidNumber: values.smartfloDidNumber,
                    smartfloDidId: smartfloNumber?.id || "",
                    smartfloIvrId: values.smartfloIvrId,
                    smartfloIvrName: ivr?.name || "",
                    smartfloDepartmentId: values.smartfloDepartmentId,
                    smartfloInboundEnabled: values.smartfloInboundEnabled,
                    smartfloOutboundEnabled: values.smartfloOutboundEnabled,
                    jodoBaseUrl: values.jodoBaseUrl.trim(),
                    jodoCollectorCode: values.jodoCollectorCode.trim(),
                    hasJodoApiKey:
                        (data?.hasJodoApiKey || false) || Boolean(values.jodoApiKey),
                    hasJodoSecretKey:
                        (data?.hasJodoSecretKey || false) ||
                        Boolean(values.jodoSecretKey),
                    hasJodoAuthHeader:
                        (data?.hasJodoAuthHeader || false) ||
                        Boolean(values.jodoAuthHeader),
                    pipelineIds: values.pipelineIds,
                    whatsappAccountIds: values.whatsappAccountIds,
                    whatsappDefaultAccountId:
                        values.whatsappDefaultAccountId,
                    whatsappAutoCreateLead: values.whatsappAutoCreateLead,
                    whatsappAssignmentMode: values.whatsappAssignmentMode,
                    whatsappOwnerEmployeeId: values.whatsappOwnerEmployeeId,
                    whatsappIntakeBranchId: values.whatsappIntakeBranchId,
                },
                !isEdit,
            );

            toggle();
        },
    });

    const errorFor = (field: keyof typeof formik.values) =>
        formik.touched[field] && formik.errors[field]
            ? (formik.errors[field] as string)
            : "";

    const togglePipelineHandler = (pipelineId: string) =>
        formik.setFieldValue(
            "pipelineIds",
            formik.values.pipelineIds.includes(pipelineId)
                ? formik.values.pipelineIds.filter(
                    item => item !== pipelineId,
                )
                : [...formik.values.pipelineIds, pipelineId],
        );

    const toggleWhatsAppAccountHandler = (accountId: string) => {
        const isOn = formik.values.whatsappAccountIds.includes(accountId);
        const nextAccounts = isOn
            ? formik.values.whatsappAccountIds.filter(
                item => item !== accountId,
            )
            : [...formik.values.whatsappAccountIds, accountId];

        formik.setFieldValue("whatsappAccountIds", nextAccounts);

        if (
            isOn &&
            formik.values.whatsappDefaultAccountId === accountId
        ) {
            formik.setFieldValue(
                "whatsappDefaultAccountId",
                nextAccounts[0] || "",
            );
        }

        if (!isOn && !formik.values.whatsappDefaultAccountId) {
            formik.setFieldValue("whatsappDefaultAccountId", accountId);
        }
    };

    const defaultWhatsAppAccount = whatsappAccountOptions.find(
        account => account.id === formik.values.whatsappDefaultAccountId,
    );

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            <div className="tw-max-h-[65vh] tw-overflow-y-auto tw-pe-1">
                <p className="tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                    Branch
                </p>

                <div className="row">
                    <div className="col-12 col-md-6">
                        <TextInput
                            name="name"
                            labelText="Branch Name"
                            labelClass="required"
                            placeHolder="e.g. Nacharam"
                            maxLength={100}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("name") ? true : false}
                            error={errorFor("name")}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <TextInput
                            name="shortName"
                            labelText="Short Name / Code"
                            placeHolder="NACHARAM"
                            maxLength={40}
                            value={formik.values.shortName}
                            onChange={formik.handleChange}
                        />
                    </div>
                </div>

                <InputCheckbox
                    name="isActive"
                    labelName="Active branch"
                    value={formik.values.isActive}
                    onChange={formik.handleChange}
                />

                <p className="tw-mb-2 tw-mt-3 tw-text-sm tw-font-semibold tw-text-gray-800">
                    CallerDesk calling
                </p>

                <div className="row">
                    <div className="col-12 col-md-6">
                        <SelectInput
                            name="callerdeskDidNumber"
                            labelText="Branch DID"
                            defaultSelect="No DID assigned"
                            value={formik.values.callerdeskDidNumber}
                            onChange={formik.handleChange}
                            menuItems={callerDeskDeskphones.map(item => ({
                                id: item.name,
                                name: `${item.name} · DID ID ${item.id}`,
                            }))}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <SelectInput
                            name="callerdeskCallGroup"
                            labelText="Call Group"
                            defaultSelect="Use account default group"
                            value={formik.values.callerdeskCallGroup}
                            onChange={formik.handleChange}
                            menuItems={callerDeskGroups}
                            valueKey="name"
                            textKey="name"
                        />
                    </div>
                </div>

                <div className="tw-flex tw-flex-wrap tw-gap-4">
                    <InputCheckbox
                        name="callerdeskInboundEnabled"
                        labelName="Inbound calls"
                        value={formik.values.callerdeskInboundEnabled}
                        onChange={formik.handleChange}
                    />

                    <InputCheckbox
                        name="callerdeskOutboundEnabled"
                        labelName="Outbound calls"
                        value={formik.values.callerdeskOutboundEnabled}
                        onChange={formik.handleChange}
                    />
                </div>

                <p className="tw-mb-0 tw-mt-1 tw-text-xs tw-text-gray-500">
                    DID options load from the connected CallerDesk account. Calling and
                    webhook routing read these values directly from the branch.
                </p>

                <p className="tw-mb-2 tw-mt-3 tw-text-sm tw-font-semibold tw-text-gray-800">
                    Tata Smartflo calling
                </p>

                <div className="row">
                    <div className="col-12 col-md-4">
                        <SelectInput
                            name="smartfloDidNumber"
                            labelText="Smartflo DID"
                            defaultSelect="Use account default DID"
                            value={formik.values.smartfloDidNumber}
                            onChange={formik.handleChange}
                            menuItems={smartfloNumbers}
                            valueKey="name"
                            textKey="name"
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <SelectInput
                            name="smartfloIvrId"
                            labelText="Inbound IVR"
                            defaultSelect="Do not change Tata DID routing"
                            value={formik.values.smartfloIvrId}
                            onChange={formik.handleChange}
                            menuItems={smartfloIvrs}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <SelectInput
                            name="smartfloDepartmentId"
                            labelText="Smartflo Department"
                            defaultSelect="Use account default department"
                            value={formik.values.smartfloDepartmentId}
                            onChange={formik.handleChange}
                            menuItems={smartfloDepartments}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>
                </div>

                <div className="tw-flex tw-flex-wrap tw-gap-4">
                    <InputCheckbox
                        name="smartfloInboundEnabled"
                        labelName="Inbound calls"
                        value={formik.values.smartfloInboundEnabled}
                        onChange={formik.handleChange}
                    />

                    <InputCheckbox
                        name="smartfloOutboundEnabled"
                        labelName="Outbound calls"
                        value={formik.values.smartfloOutboundEnabled}
                        onChange={formik.handleChange}
                    />
                </div>

                <p className="tw-mb-0 tw-mt-1 tw-text-xs tw-text-gray-500">
                    Lead calls use this branch mapping before falling back to the
                    account default.
                </p>

                <p className="tw-mb-2 tw-mt-3 tw-text-sm tw-font-semibold tw-text-gray-800">
                    Jodo payment credentials
                </p>

                <div className="row">
                    <div className="col-12 col-md-6">
                        <TextInput
                            name="jodoBaseUrl"
                            labelText="API Base URL"
                            labelClass="required"
                            placeHolder="https://ext.jodo.in"
                            value={formik.values.jodoBaseUrl}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("jodoBaseUrl") ? true : false}
                            error={errorFor("jodoBaseUrl")}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <TextInput
                            name="jodoCollectorCode"
                            labelText="Collector Code"
                            placeHolder="NACHARAM"
                            value={formik.values.jodoCollectorCode}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <TextInput
                            name="jodoApiKey"
                            inputType="password"
                            labelText="API Key"
                            autoComplete="new-password"
                            placeHolder={secretPlaceholder(
                                data?.hasJodoApiKey,
                                "API key",
                            )}
                            value={formik.values.jodoApiKey}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <TextInput
                            name="jodoSecretKey"
                            inputType="password"
                            labelText="Secret Key"
                            autoComplete="new-password"
                            placeHolder={secretPlaceholder(
                                data?.hasJodoSecretKey,
                                "Secret key",
                            )}
                            value={formik.values.jodoSecretKey}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <TextInput
                            name="jodoAuthHeader"
                            inputType="password"
                            labelText="Authorization Header"
                            autoComplete="new-password"
                            placeHolder={secretPlaceholder(
                                data?.hasJodoAuthHeader,
                                "Basic ....==",
                            )}
                            value={formik.values.jodoAuthHeader}
                            onChange={formik.handleChange}
                        />
                    </div>
                </div>

                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                    Paste the Authorization header Jodo issued, or leave it blank to
                    derive one from the API key and secret. Keys are stored on the
                    branch and are never shown on a public form.
                </p>

                <p className="tw-mb-1 tw-mt-3 tw-text-sm tw-font-semibold tw-text-gray-800">
                    Pipeline visibility
                </p>

                {pipelines.length < 2 ? (
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        This business unit has one lead pipeline, so every branch
                        appears in it.
                    </p>
                ) : (
                    <>
                        <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                            {formik.values.pipelineIds.length
                                ? `This branch appears only in the ${formik.values.pipelineIds.length} pipeline${formik.values.pipelineIds.length === 1 ? "" : "s"} ticked below. Untick them all to show it everywhere again.`
                                : "This branch appears in every lead pipeline. Tick pipelines to show it only in those."}
                        </p>

                        <div className="tw-flex tw-flex-wrap tw-gap-4">
                            {pipelines.map(pipeline => (
                                <InputCheckbox
                                    key={pipeline.id}
                                    name={`pipeline-${pipeline.id}`}
                                    labelName={pipeline.displayName}
                                    value={formik.values.pipelineIds.includes(
                                        pipeline.id,
                                    )}
                                    onChange={() =>
                                        togglePipelineHandler(pipeline.id)
                                    }
                                    formgroupClassName="tw-mb-0"
                                />
                            ))}
                        </div>
                    </>
                )}

                <p className="tw-mb-1 tw-mt-3 tw-text-sm tw-font-semibold tw-text-gray-800">
                    WhatsApp settings
                </p>
                <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                    The connected numbers this branch sends from. The default is
                    the one a counsellor here gets preselected.
                </p>

                {whatsappAccountOptions.length ? (
                    <div className="tw-flex tw-flex-col tw-gap-2">
                        {whatsappAccountOptions.map(account => {
                            const isOn =
                                formik.values.whatsappAccountIds.includes(
                                    account.id,
                                );
                            const isDefault =
                                formik.values.whatsappDefaultAccountId ===
                                account.id;

                            return (
                                <div
                                    key={account.id}
                                    className="tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-rounded tw-border tw-border-gray-200 tw-px-3 tw-py-2"
                                >
                                    <InputCheckbox
                                        name={`whatsapp-${account.id}`}
                                        labelName={account.name}
                                        value={isOn}
                                        onChange={() =>
                                            toggleWhatsAppAccountHandler(
                                                account.id,
                                            )
                                        }
                                        formgroupClassName="tw-mb-0"
                                    />

                                    {isOn &&
                                        (isDefault ? (
                                            <span className="badge badge-soft-primary tw-ms-auto">
                                                Default
                                            </span>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="linkBtn"
                                                className="tw-ms-auto tw-p-0"
                                                onClick={() =>
                                                    formik.setFieldValue(
                                                        "whatsappDefaultAccountId",
                                                        account.id,
                                                    )
                                                }
                                            >
                                                Make default
                                            </Button>
                                        ))}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        No WhatsApp accounts are connected yet. Connect one under
                        Settings → Integrations, then choose it here.
                    </p>
                )}

                {defaultWhatsAppAccount && (
                    <>
                        <p className="tw-mb-2 tw-mt-3 tw-text-sm tw-font-semibold tw-text-gray-800">
                            When an unknown number messages{" "}
                            {defaultWhatsAppAccount.name}
                        </p>

                        <InputCheckbox
                            name="whatsappAutoCreateLead"
                            labelName="Create a lead automatically"
                            value={formik.values.whatsappAutoCreateLead}
                            onChange={formik.handleChange}
                        />

                        <div className="row">
                            <div className="col-12 col-md-6">
                                <SelectInput
                                    name="whatsappAssignmentMode"
                                    labelText="Leads Go To"
                                    value={
                                        formik.values.whatsappAssignmentMode
                                    }
                                    onChange={formik.handleChange}
                                    menuItems={assignmentModeOptions}
                                    valueKey="id"
                                    textKey="name"
                                    hideSelectOption
                                />
                            </div>

                            {formik.values.whatsappAssignmentMode ===
                                "fixed" && (
                                    <div className="col-12 col-md-6">
                                        <SelectInput
                                            name="whatsappOwnerEmployeeId"
                                            labelText="Counsellor"
                                            defaultSelect="Select a counsellor"
                                            value={
                                                formik.values
                                                    .whatsappOwnerEmployeeId
                                            }
                                            onChange={formik.handleChange}
                                            menuItems={crmUsers}
                                            valueKey="id"
                                            textKey="name"
                                        />
                                    </div>
                                )}
                        </div>

                        <InputCheckbox
                            name="whatsappIntakeBranchId"
                            labelName="Send these leads to this branch"
                            value={Boolean(
                                data?.id &&
                                formik.values.whatsappIntakeBranchId ===
                                data.id,
                            )}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                                formik.setFieldValue(
                                    "whatsappIntakeBranchId",
                                    event.target.checked
                                        ? data?.id || ""
                                        : "",
                                )
                            }
                        />

                        {!formik.values.whatsappIntakeBranchId && (
                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                No branch is fixed, so a lead lands wherever the
                                assignment rule sends it.
                            </p>
                        )}
                    </>
                )}

                {!isEdit && formik.values.whatsappAccountIds.length > 0 && (
                    <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                        Save the branch to set what happens when an unknown
                        number messages it.
                    </p>
                )}
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button type="submit" variant="primary">
                    {isEdit ? "Save Changes" : "Add Branch"}
                </Button>
            </div>
        </form>
    );
};

export default AddEditBranchModal;
