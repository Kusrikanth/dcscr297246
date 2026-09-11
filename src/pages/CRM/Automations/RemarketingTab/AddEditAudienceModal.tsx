import { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    DateInput,
    SelectInput,
    TextInput,
} from "../../../../Components/Common";
import { leadMeta } from "../../LeadsV2/data";
import { settingsBranches } from "../../Settings/helper";
import { crmUsers } from "../../Settings/Users/helper";
import {
    admissionStatusOptions,
    emptyAudienceFilters,
    metaAdAccounts,
    metaOnlyOptions,
    syncIntervalOptions,
    syncTypeOptions,
    type RemarketingAudience,
} from "./helper";

interface AddEditAudienceModalProps {
    data?: RemarketingAudience;
    toggle: () => void;
    onSave: (audience: RemarketingAudience, isNew: boolean) => void;
}

const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Give the audience a name"),

    adAccountId: Yup.string().required("Choose a Meta ad account"),
});

const AddEditAudienceModal = ({
    data,
    toggle,
    onSave,
}: AddEditAudienceModalProps) => {
    const isEdit = Boolean(data);
    const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            name: data?.name || "",
            description: data?.description || "",
            adAccountId: data?.adAccountId || metaAdAccounts[0]?.id || "",
            syncType: data?.syncType || "manual",
            syncInterval: data?.syncInterval || "daily",
            excludeStageId: data?.excludeStageId || "",
            ...(data?.filters || emptyAudienceFilters),
        },

        validationSchema,

        onSubmit: values => {
            onSave(
                {
                    id: data?.id || `audience-${Date.now()}`,
                    name: values.name.trim(),
                    description: values.description.trim(),
                    adAccountId: values.adAccountId,
                    adAccountName:
                        metaAdAccounts.find(
                            account => account.id === values.adAccountId,
                        )?.name || "",
                    metaAudienceId: data?.metaAudienceId || "",
                    crmLeadCount: data?.crmLeadCount || 0,
                    syncedLeadCount: data?.syncedLeadCount || 0,
                    syncType: values.syncType,
                    syncInterval: values.syncInterval,
                    status: data?.status || "draft",
                    lastSyncAt: data?.lastSyncAt || "",
                    lastError: data?.lastError || "",
                    createdBy: data?.createdBy || "ARJUN",
                    createdAt: data?.createdAt || new Date().toISOString(),
                    filters: {
                        branchId: values.branchId,
                        stageId: values.stageId,
                        sourceId: values.sourceId,
                        classId: values.classId,
                        curriculumId: values.curriculumId,
                        campaignId: values.campaignId,
                        ownerEmployeeId: values.ownerEmployeeId,
                        academicYear: values.academicYear,
                        admissionStatus: values.admissionStatus,
                        city: values.city,
                        createdFrom: values.createdFrom,
                        createdTo: values.createdTo,
                        metaOnly: values.metaOnly,
                    },
                    excludeStageId: values.excludeStageId,
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

    const matchedLeads = useMemo(
        () =>
            dummyLeadPool.filter(
                lead =>
                    (!formik.values.branchId ||
                        lead.branchId === formik.values.branchId) &&
                    (!formik.values.stageId ||
                        lead.stageId === formik.values.stageId) &&
                    (!formik.values.city ||
                        lead.city
                            .toLowerCase()
                            .includes(formik.values.city.toLowerCase())) &&
                    (formik.values.metaOnly !== "yes" || lead.isFromMeta),
            ),
        [
            formik.values.branchId,
            formik.values.stageId,
            formik.values.city,
            formik.values.metaOnly,
        ],
    );

    const eligibleLeads = matchedLeads.filter(lead => lead.hasMatchKey);

    const conditions = [
        {
            name: "branchId",
            labelText: "Branch",
            options: settingsBranches,
        },
        {
            name: "stageId",
            labelText: "Lead Stage",
            options: leadMeta.stages.map(stage => ({
                id: stage.id,
                name: stage.displayName,
            })),
        },
        {
            name: "sourceId",
            labelText: "Lead Source",
            options: leadMeta.sources.map(source => ({
                id: source.id,
                name: source.displayName,
            })),
        },
        {
            name: "classId",
            labelText: "Class / Grade",
            options: leadMeta.classes.map(item => ({
                id: item.id,
                name: item.displayName,
            })),
        },
        {
            name: "curriculumId",
            labelText: "Curriculum",
            options: leadMeta.curricula.map(item => ({
                id: item.id,
                name: item.displayName,
            })),
        },
        {
            name: "campaignId",
            labelText: "Campaign",
            options: leadMeta.campaigns.map(item => ({
                id: item.id,
                name: item.displayName,
            })),
        },
        {
            name: "ownerEmployeeId",
            labelText: "Assigned User",
            options: crmUsers,
        },
        {
            name: "academicYear",
            labelText: "Academic Year",
            options: leadMeta.academicYears.map(item => ({
                id: item.academicYear,
                name: item.displayName,
            })),
        },
        {
            name: "admissionStatus",
            labelText: "Admission Status",
            options: admissionStatusOptions,
        },
    ];

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            <div className="tw-max-h-[65vh] tw-overflow-y-auto tw-pe-1">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <TextInput
                            name="name"
                            labelText="Audience Name"
                            labelClass="required"
                            placeHolder="e.g. Admissions 2026 – Interested leads"
                            maxLength={120}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("name") ? true : false}
                            error={errorFor("name")}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <SelectInput
                            name="adAccountId"
                            labelText="Meta Ad Account"
                            labelClass="required"
                            defaultSelect="Select ad account"
                            value={formik.values.adAccountId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            menuItems={metaAdAccounts}
                            valueKey="id"
                            textKey="name"
                            invalid={errorFor("adAccountId") ? true : false}
                            error={errorFor("adAccountId")}
                        />
                        {!metaAdAccounts.length && (
                            <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                                No ad accounts yet — use Discover Ad Accounts on
                                the Remarketing tab.
                            </p>
                        )}
                    </div>

                    <div className="col-12">
                        <TextInput
                            name="description"
                            labelText="Description"
                            placeHolder="What this audience is for"
                            maxLength={200}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />
                    </div>
                </div>

                <p className="tw-mb-2 tw-mt-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                    Lead filters
                </p>

                <div className="row">
                    {conditions.map(condition => (
                        <div
                            key={condition.name}
                            className="col-12 col-md-6 col-xl-4"
                        >
                            <SelectInput
                                name={condition.name}
                                labelText={condition.labelText}
                                defaultSelect="Any"
                                value={
                                    formik.values[
                                    condition.name as keyof typeof formik.values
                                    ] as string
                                }
                                onChange={formik.handleChange}
                                menuItems={condition.options}
                                valueKey="id"
                                textKey="name"
                            />
                        </div>
                    ))}

                    <div className="col-12 col-md-6 col-xl-4">
                        <TextInput
                            name="city"
                            labelText="City"
                            placeHolder="Any"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <SelectInput
                            name="metaOnly"
                            labelText="Meta Leads Only"
                            defaultSelect="All CRM leads"
                            value={formik.values.metaOnly}
                            onChange={formik.handleChange}
                            menuItems={metaOnlyOptions}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <DateInput
                            name="createdFrom"
                            labelText="Created From"
                            value={formik.values.createdFrom}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <DateInput
                            name="createdTo"
                            labelText="Created To"
                            value={formik.values.createdTo}
                            onChange={formik.handleChange}
                        />
                    </div>
                </div>

                <p className="tw-mb-2 tw-mt-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                    Exclude
                </p>

                <div className="row">
                    <div className="col-12 col-md-6 col-xl-4">
                        <SelectInput
                            name="excludeStageId"
                            labelText="Exclude Stage"
                            defaultSelect="Nothing excluded"
                            value={formik.values.excludeStageId}
                            onChange={formik.handleChange}
                            menuItems={leadMeta.stages.map(stage => ({
                                id: stage.id,
                                name: stage.displayName,
                            }))}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>
                </div>

                <p className="tw-mb-2 tw-mt-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                    Sync
                </p>

                <div className="row">
                    <div className="col-12 col-md-6 col-xl-4">
                        <SelectInput
                            name="syncType"
                            labelText="Sync Type"
                            value={formik.values.syncType}
                            onChange={formik.handleChange}
                            menuItems={syncTypeOptions}
                            valueKey="id"
                            textKey="name"
                            hideSelectOption
                        />
                    </div>

                    {formik.values.syncType === "automatic" && (
                        <div className="col-12 col-md-6 col-xl-4">
                            <SelectInput
                                name="syncInterval"
                                labelText="Frequency"
                                value={formik.values.syncInterval}
                                onChange={formik.handleChange}
                                menuItems={syncIntervalOptions}
                                valueKey="id"
                                textKey="name"
                                hideSelectOption
                            />
                        </div>
                    )}
                </div>

                <div className="tw-mt-2 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                    <div className="tw-min-w-0">
                        <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                            {formik.values.name || "Untitled audience"}
                        </p>
                        <p className="tw-mb-0 tw-text-xs tw-text-gray-600">
                            {matchedLeads.length} matching leads ·{" "}
                            {eligibleLeads.length} eligible for Meta
                        </p>
                        {matchedLeads.length !== eligibleLeads.length && (
                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                {matchedLeads.length - eligibleLeads.length} have
                                no email or phone, so Meta cannot match them.
                            </p>
                        )}
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsPreviewOpen(current => !current)}
                    >
                        <i className="ri-eye-line"></i>
                        Preview Leads
                    </Button>
                </div>

                {isPreviewOpen && (
                    <div className="tw-mt-2 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                        {matchedLeads.length ? (
                            matchedLeads.slice(0, 10).map(lead => (
                                <div
                                    key={lead.id}
                                    className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-border-b tw-border-gray-100 tw-py-1 last:tw-border-0"
                                >
                                    <span className="tw-text-sm tw-text-gray-800">
                                        {lead.name}
                                    </span>
                                    <span className="tw-text-xs tw-text-gray-500">
                                        {lead.matchKeys || "no match keys"}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                No leads match these conditions.
                            </p>
                        )}

                        {matchedLeads.length > 10 && (
                            <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                                Showing the first 10 of {matchedLeads.length}.
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button type="submit" variant="primary">
                    {isEdit ? "Save changes" : "Create audience"}
                </Button>
            </div>
        </form>
    );
};

const dummyLeadPool = [
    {
        id: "1",
        name: "Aarav Sharma",
        branchId: "2",
        stageId: "1",
        city: "Hyderabad",
        matchKeys: "phone, email",
        hasMatchKey: true,
        isFromMeta: true,
    },
    {
        id: "2",
        name: "Raj Malhotra",
        branchId: "2",
        stageId: "2",
        city: "Secunderabad",
        matchKeys: "phone",
        hasMatchKey: true,
        isFromMeta: true,
    },
    {
        id: "3",
        name: "Bowenpally Enquiry",
        branchId: "1",
        stageId: "4",
        city: "",
        matchKeys: "",
        hasMatchKey: false,
        isFromMeta: false,
    },
    {
        id: "4",
        name: "Rahul Kumar",
        branchId: "1",
        stageId: "3",
        city: "Hyderabad",
        matchKeys: "phone, email",
        hasMatchKey: true,
        isFromMeta: false,
    },
    {
        id: "5",
        name: "Ishita Verma",
        branchId: "1",
        stageId: "3",
        city: "Hyderabad",
        matchKeys: "email",
        hasMatchKey: true,
        isFromMeta: false,
    },
    {
        id: "6",
        name: "Meera Nair",
        branchId: "3",
        stageId: "6",
        city: "Warangal",
        matchKeys: "phone",
        hasMatchKey: true,
        isFromMeta: false,
    },
    {
        id: "7",
        name: "Nisha Reddy",
        branchId: "4",
        stageId: "5",
        city: "Hyderabad",
        matchKeys: "phone, email",
        hasMatchKey: true,
        isFromMeta: false,
    },
    {
        id: "8",
        name: "Kabir Anand",
        branchId: "1",
        stageId: "8",
        city: "Hyderabad",
        matchKeys: "",
        hasMatchKey: false,
        isFromMeta: false,
    },
];

export default AddEditAudienceModal;
