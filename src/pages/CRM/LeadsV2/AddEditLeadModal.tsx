import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type MouseEvent,
    type ReactNode,
} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import {
    Button,
    CustomSelect,
    DateInput,
    InputCheckbox,
    MultiSelectCheckbox,
    SelectInput,
    TextArea,
    TextInput,
} from "../../../Components/Common";
import {
    admissionTypesFor,
    campaignsForSource,
    classesFor,
    curriculaFor,
    employeesForBranch,
    formatDateTime,
    groupLeadFields,
    minimumFollowupTime,
    secondarySourcesOf,
    sourcesForChannel,
    stageRequiresFollowup,
    substagesForStage,
    toLocalInput,
} from "./helper";
import LeadHistoryModal from "./LeadHistoryModal";
import {
    currentUser,
    followupTypeOptions,
    leadMeta,
} from "./data";
import type {
    LeadField,
    LeadRecord,
    Option,
} from "./types";

export type LeadModalMode = "create" | "edit" | "view";

export interface LeadFormValues {
    studentId: string;
    studentName: string;
    phone: string;
    alternatePhone: string;
    email: string;
    parentName: string;
    city: string;
    academicYear: string;
    branchId: string;
    admissionTypeId: string;
    curriculumId: string;
    classId: string;
    channelId: string;
    sourceId: string;
    campaignId: string;
    stageId: string;
    substageId: string;
    ownerEmployeeId: string;
    nextFollowupAt: string;
    followupType: string;
    remarks: string;
    leadScore: string;
    customValues: Record<string, string>;
}

interface AddEditLeadModalProps {
    mode: LeadModalMode;
    initialTab?: string;
    lead?: LeadRecord;
    toggle: () => void;
    onSave: (
        values: LeadFormValues,
        mode: LeadModalMode,
    ) => void;
    onSwitchToEdit?: () => void;
    onMarkReEnquired?: () => void;
    onAddSecondarySource?: (source: {
        channelId: string;
        sourceId: string;
        campaignId: string;
    }) => void;
}

const emptyValues: LeadFormValues = {
    studentId: "",
    studentName: "",
    phone: "",
    alternatePhone: "",
    email: "",
    parentName: "",
    city: "",
    academicYear: "",
    branchId: "",
    admissionTypeId: "",
    curriculumId: "",
    classId: "",
    channelId: "",
    sourceId: "",
    campaignId: "",
    stageId: "",
    substageId: "",
    ownerEmployeeId: "",
    nextFollowupAt: "",
    followupType: "",
    remarks: "",
    leadScore: "50",
    customValues: {},
};

const PHONE_PATTERN = /^[6-9][0-9]{9}$/;
const PHONE_MESSAGE =
    "Enter a valid 10-digit mobile number starting with 6-9";

const createDefaults = (
    currentEmployeeId: string,
): LeadFormValues => {
    const defaults = leadMeta.manualLeadDefaults;

    const stageId = leadMeta.stages.some(
        item => String(item.id) === String(defaults.stageId),
    )
        ? String(defaults.stageId)
        : String(leadMeta.stages[0]?.id || "");

    const substageId = leadMeta.substages.some(
        item =>
            String(item.id) === String(defaults.substageId) &&
            String(item.stageId) === stageId,
    )
        ? String(defaults.substageId)
        : String(
            leadMeta.substages.find(
                item => String(item.stageId) === stageId,
            )?.id || "",
        );

    const channelId = leadMeta.channels.some(
        item => String(item.id) === String(defaults.channelId),
    )
        ? String(defaults.channelId)
        : "";

    const sourceId =
        channelId &&
            sourcesForChannel(leadMeta, channelId).some(
                item =>
                    String(item.id) === String(defaults.sourceId),
            )
            ? String(defaults.sourceId)
            : "";

    return {
        ...emptyValues,
        academicYear:
            leadMeta.academicYears[0]?.academicYear || "",
        branchId: String(leadMeta.branches[0]?.id || ""),
        channelId,
        sourceId,
        campaignId: sourceId
            ? String(defaults.campaignId || "")
            : "",
        stageId,
        substageId,
        ownerEmployeeId: currentEmployeeId,
    };
};

const leadToValues = (lead: LeadRecord): LeadFormValues => ({
    studentId: lead.studentId || "",
    studentName: lead.studentName || "",
    phone: lead.phone || "",
    alternatePhone: lead.alternatePhone || "",
    email: lead.email || "",
    parentName: lead.parentName || "",
    city: lead.city || "",
    academicYear: lead.academicYear || "",
    branchId: String(lead.branchId || ""),
    admissionTypeId: String(lead.admissionTypeId || ""),
    curriculumId: String(lead.curriculumId || ""),
    classId: String(lead.classId || ""),
    channelId: String(lead.channelId || ""),
    sourceId: String(lead.sourceId || ""),
    campaignId: String(lead.campaignId || ""),
    stageId: String(lead.stageId || ""),
    substageId: String(lead.substageId || ""),
    ownerEmployeeId: String(lead.ownerEmployeeId || ""),
    nextFollowupAt: toLocalInput(lead.nextFollowupAt),
    followupType: lead.followupType || "",
    remarks: lead.remarks || "",
    leadScore: String(lead.leadScore ?? ""),
    customValues: { ...(lead.customValues || {}) },
});

const FormSection = ({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) => (
    <div className="tw-relative tw-mb-6 tw-mt-4 tw-w-full tw-rounded-md tw-border tw-border-[#ced4da] tw-p-5">
        <p className="tw-absolute -tw-top-3 tw-bg-white tw-px-2 tw-text-[#495057]">
            {title}
        </p>
        {children}
    </div>
);

const requiredClass = (isRequired: boolean) =>
    isRequired ? "required" : "";

const AddEditLeadModal = ({
    mode,
    initialTab = "student",
    lead,
    toggle,
    onSave,
    onSwitchToEdit,
    onMarkReEnquired,
    onAddSecondarySource,
}: AddEditLeadModalProps) => {
    const isCreate = mode === "create";
    const isView = mode === "view";
    const isEdit = mode === "edit";

    const [activeTab, setActiveTab] =
        useState<string>(initialTab);

    const tabMenuOptions = [
        {
            id: "student",
            labelName: "Student & Contact",
            customPadding: "0px 10px 0px 10px",
        },
        {
            id: "source",
            labelName: "Source Details",
            customPadding: "0px 10px 0px 10px",
        },
        {
            id: "history",
            labelName: "History",
            customPadding: "0px 10px 0px 10px",
        },
        {
            id: "remarketing",
            labelName: "Remarketing",
            customPadding: "0px 10px 0px 10px",
        },
    ];

    const clickTabMenuHandler = (event: MouseEvent<HTMLElement>) => {
        const menuId = event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setActiveTab(menuId);
        }
    };
    const [secondarySource, setSecondarySource] = useState({
        channelId: "",
        sourceId: "",
        campaignId: "",
    });

    const currentEmployeeId = isCreate
        ? currentUser.employeeId
        : "";

    const secondarySourceHistory = lead
        ? secondarySourcesOf(lead)
        : [];

    const validationSchema = useMemo(() => {
        const required = (fieldKey: string) =>
            leadMeta.leadFields.find(
                field => field.fieldKey === fieldKey,
            )?.isRequired ?? false;

        return Yup.object().shape({
            studentName: Yup.string()
                .trim()
                .required("Student name is required"),

            phone: Yup.string()
                .trim()
                .required("Primary phone is required")
                .matches(PHONE_PATTERN, PHONE_MESSAGE),

            alternatePhone: Yup.string()
                .trim()
                .test(
                    "alternate-phone",
                    PHONE_MESSAGE,
                    value =>
                        !value || PHONE_PATTERN.test(value),
                ),

            email: Yup.string()
                .trim()
                .email("Enter a valid email address"),

            academicYear: Yup.string().required(
                "Academic year is required",
            ),

            branchId: Yup.string().required(
                "Branch is required",
            ),

            admissionTypeId: required("admission_type_id")
                ? Yup.string().required(
                    "Admission type is required",
                )
                : Yup.string(),

            curriculumId: Yup.string().required(
                "Curriculum is required",
            ),

            classId: Yup.string().required("Class is required"),

            channelId: isEdit
                ? Yup.string()
                : required("channel_id")
                    ? Yup.string().required("Channel is required")
                    : Yup.string(),

            sourceId: isEdit
                ? Yup.string()
                : required("source_id")
                    ? Yup.string().required("Source is required")
                    : Yup.string(),

            stageId: Yup.string().required("Stage is required"),

            substageId: Yup.string().required(
                "Sub-stage is required",
            ),

            nextFollowupAt: Yup.string().when(
                "stageId",
                (stageId: string, schema: Yup.StringSchema) =>
                    stageRequiresFollowup(leadMeta, stageId)
                        ? schema.required(
                            "Next follow-up is required for this stage",
                        )
                        : schema,
            ),

            followupType: Yup.string().when(
                "stageId",
                (stageId: string, schema: Yup.StringSchema) =>
                    stageRequiresFollowup(leadMeta, stageId)
                        ? schema.required(
                            "Follow-up type is required for this stage",
                        )
                        : schema,
            ),

            leadScore: Yup.number()
                .typeError("Lead score must be a number")
                .min(0, "Lead score cannot be below 0")
                .max(100, "Lead score cannot exceed 100")
                .nullable(),
        });
    }, [isEdit]);

    const formik = useFormik<LeadFormValues>({
        enableReinitialize: true,
        initialValues: lead
            ? leadToValues(lead)
            : createDefaults(currentEmployeeId),
        validationSchema,
        onSubmit: values => onSave(values, mode),
    });

    const { values, setValues, setFieldValue } = formik;

    const availableAdmissionTypes = useMemo(
        () =>
            admissionTypesFor(
                leadMeta,
                values.academicYear,
                values.branchId,
            ),
        [values.academicYear, values.branchId],
    );

    const availableCurricula = useMemo(
        () =>
            curriculaFor(
                leadMeta,
                values.academicYear,
                values.branchId,
                values.admissionTypeId,
            ),
        [
            values.academicYear,
            values.branchId,
            values.admissionTypeId,
        ],
    );

    const availableClasses = useMemo(
        () =>
            classesFor(
                leadMeta,
                values.academicYear,
                values.branchId,
                values.admissionTypeId,
                values.curriculumId,
            ),
        [
            values.academicYear,
            values.branchId,
            values.admissionTypeId,
            values.curriculumId,
        ],
    );

    const availableSources = useMemo(
        () => sourcesForChannel(leadMeta, values.channelId),
        [values.channelId],
    );

    const availableCampaigns = useMemo(
        () => campaignsForSource(leadMeta, values.sourceId),
        [values.sourceId],
    );

    const availableSubstages = useMemo(
        () => substagesForStage(leadMeta, values.stageId),
        [values.stageId],
    );

    const availableOwners = useMemo(
        () => employeesForBranch(leadMeta, values.branchId),
        [values.branchId],
    );

    const secondarySources = useMemo(
        () =>
            sourcesForChannel(
                leadMeta,
                secondarySource.channelId,
            ),
        [secondarySource.channelId],
    );

    const secondaryCampaigns = useMemo(
        () =>
            campaignsForSource(
                leadMeta,
                secondarySource.sourceId,
            ),
        [secondarySource.sourceId],
    );

    useEffect(() => {
        if (
            values.admissionTypeId &&
            !availableAdmissionTypes.some(
                item =>
                    String(item.id) ===
                    String(values.admissionTypeId),
            )
        ) {
            setValues(current => ({
                ...current,
                admissionTypeId: "",
                curriculumId: "",
                classId: "",
            }));
        }
    }, [availableAdmissionTypes, values.admissionTypeId, setValues]);

    useEffect(() => {
        if (
            values.curriculumId &&
            !availableCurricula.some(
                item =>
                    String(item.id) ===
                    String(values.curriculumId),
            )
        ) {
            setValues(current => ({
                ...current,
                curriculumId: "",
                classId: "",
            }));
        }
    }, [availableCurricula, values.curriculumId, setValues]);

    useEffect(() => {
        if (
            values.classId &&
            !availableClasses.some(
                item =>
                    String(item.id) === String(values.classId),
            )
        ) {
            setFieldValue("classId", "");
        }
    }, [availableClasses, values.classId, setFieldValue]);

    const followupRequired = stageRequiresFollowup(
        leadMeta,
        values.stageId,
    );

    useEffect(() => {
        if (
            !followupRequired &&
            (values.nextFollowupAt || values.followupType)
        ) {
            setValues(current => ({
                ...current,
                nextFollowupAt: "",
                followupType: "",
            }));
        }
    }, [
        followupRequired,
        values.nextFollowupAt,
        values.followupType,
        setValues,
    ]);

    const updateField = (name: string, value: string) => {
        const resets: Partial<LeadFormValues> = {};

        if (name === "academicYear" || name === "branchId") {
            Object.assign(resets, {
                admissionTypeId: "",
                curriculumId: "",
                classId: "",
            });
        }

        if (name === "branchId") {
            resets.ownerEmployeeId = "";
        }

        if (name === "admissionTypeId") {
            Object.assign(resets, {
                curriculumId: "",
                classId: "",
            });
        }

        if (name === "curriculumId") {
            resets.classId = "";
        }

        if (name === "channelId") {
            Object.assign(resets, {
                sourceId: "",
                campaignId: "",
            });
        }

        if (name === "sourceId") {
            resets.campaignId = "";
        }

        if (name === "stageId") {
            Object.assign(resets, {
                substageId: "",
                nextFollowupAt: "",
                followupType: "",
            });
        }

        setValues(current => ({
            ...current,
            ...resets,
            [name]: value,
        }));
    };

    const changeHandler = (
        event: ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        updateField(event.target.name, event.target.value);
    };

    const phoneChangeHandler = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        setFieldValue(
            event.target.name,
            event.target.value.replace(/\D/g, "").slice(0, 10),
        );
    };

    const customValueHandler = (
        fieldKey: string,
        value: string,
    ) => {
        setValues(current => ({
            ...current,
            customValues: {
                ...current.customValues,
                [fieldKey]: value,
            },
        }));
    };

    const errorOf = (name: keyof LeadFormValues) =>
        formik.touched[name] && formik.errors[name]
            ? (formik.errors[name] as string)
            : "";

    const invalidOf = (name: keyof LeadFormValues) =>
        Boolean(formik.touched[name] && formik.errors[name]);

    const asOptions = (
        list: Array<{ id: string; displayName?: string; name?: string }>,
    ): Option[] =>
        list.map(item => ({
            id: String(item.id),
            name: item.displayName || item.name || "",
        }));

    const optionsForField = (
        field: LeadField,
    ): Option[] | null => {
        switch (field.fieldKey) {
            case "academic_year":
                return leadMeta.academicYears.map(item => ({
                    id: item.academicYear,
                    name: item.displayName,
                }));
            case "branch_id":
                return asOptions(leadMeta.branches);
            case "admission_type_id":
                return asOptions(availableAdmissionTypes);
            case "curriculum_id":
                return asOptions(availableCurricula);
            case "class_id":
                return asOptions(availableClasses);
            case "channel_id":
                return leadMeta.channels.map(item => ({
                    id: item.id,
                    name: `${item.displayName} · ${item.category}`,
                }));
            case "source_id":
                return asOptions(availableSources);
            case "campaign_id":
                return asOptions(availableCampaigns);
            case "stage_id":
                return asOptions(leadMeta.stages);
            case "substage_id":
                return asOptions(availableSubstages);
            case "owner_employee_id":
                return availableOwners.map(item => ({
                    id: item.id,
                    name: `${item.name} · ${item.branchName}`,
                }));
            case "followup_type":
                return followupTypeOptions;
            default:
                return field.options
                    ? field.options.map(item => ({
                        id: item,
                        name: item,
                    }))
                    : null;
        }
    };

    const renderConfiguredField = (field: LeadField) => {
        const property = (
            {
                student_name: "studentName",
                name: "studentName",
                phone: "phone",
                primary_phone: "phone",
                alternate_phone: "alternatePhone",
                email: "email",
                parent_name: "parentName",
                city: "city",
                academic_year: "academicYear",
                branch_id: "branchId",
                admission_type_id: "admissionTypeId",
                curriculum_id: "curriculumId",
                class_id: "classId",
                channel_id: "channelId",
                source_id: "sourceId",
                campaign_id: "campaignId",
                stage_id: "stageId",
                substage_id: "substageId",
                owner_employee_id: "ownerEmployeeId",
                next_followup_at_utc: "nextFollowupAt",
                followup_type: "followupType",
                remarks: "remarks",
                lead_score: "leadScore",
            } as Record<string, keyof LeadFormValues>
        )[field.fieldKey];

        const value = property
            ? (values[property] as string)
            : values.customValues?.[field.fieldKey] || "";

        const isRequired = Boolean(field.isRequired);
        const columnClass =
            field.fieldType === "textarea"
                ? "col-12"
                : "col-12 col-md-6 col-lg-4";

        if (
            (field.fieldKey === "next_followup_at_utc" ||
                field.fieldKey === "followup_type") &&
            !followupRequired
        ) {
            return null;
        }

        const setValue = (next: string) => {
            if (property) {
                updateField(property, next);
            } else {
                customValueHandler(field.fieldKey, next);
            }
        };

        if (field.fieldKey === "class_id") {
            return (
                <div className={columnClass} key={field.id}>
                    <CustomSelect
                        name="classId"
                        idKey="id"
                        searchKey="name"
                        labelText={field.displayName}
                        labelClass={requiredClass(isRequired)}
                        value={value}
                        options={availableClasses.map(item => ({
                            id: String(item.id),
                            name: item.displayName,
                        }))}
                        defaultSelect={
                            availableClasses.length
                                ? "Search class…"
                                : "Select academic year, branch, admission type and curriculum first"
                        }
                        renderValue={(item?: Option) => item?.name || ""}
                        renderOptions={(item?: Option) => item?.name || ""}
                        onChange={(next: string) => {
                            setValue(next);
                            formik.setFieldTouched(
                                "classId",
                                true,
                                false,
                            );
                        }}
                        invalid={invalidOf("classId")}
                        error={errorOf("classId")}
                    />
                </div>
            );
        }

        const options = optionsForField(field);

        if (
            options &&
            (options.length ||
                ["single_select", "multi_select"].includes(
                    field.fieldType,
                ))
        ) {
            if (field.fieldType === "multi_select") {
                const selected = String(value || "")
                    .split(",")
                    .filter(Boolean)
                    .map(item => ({ id: item, name: item }));

                return (
                    <div className={columnClass} key={field.id}>
                        <MultiSelectCheckbox
                            name={field.fieldKey}
                            idKey="id"
                            searchKey="name"
                            labelText={field.displayName}
                            labelClass={requiredClass(isRequired)}
                            value={selected}
                            options={options}
                            renderValue={(items: Option[]) => (
                                <span>
                                    {items
                                        .map(item => item.name)
                                        .join(", ")}
                                </span>
                            )}
                            renderOptions={(item: Option) =>
                                item.name
                            }
                            onChange={(items: Option[]) =>
                                setValue(
                                    items
                                        .map(item => item.id)
                                        .join(","),
                                )
                            }
                        />
                    </div>
                );
            }

            const waitingForChannel =
                field.fieldKey === "source_id" &&
                !values.channelId;

            return (
                <div className={columnClass} key={field.id}>
                    <SelectInput
                        name={property || field.fieldKey}
                        labelText={field.displayName}
                        labelClass={requiredClass(isRequired)}
                        value={value}
                        onChange={(
                            event: ChangeEvent<HTMLSelectElement>,
                        ) => setValue(event.target.value)}
                        onBlur={formik.handleBlur}
                        menuItems={options}
                        valueKey="id"
                        textKey="name"
                        isDisabled={waitingForChannel}
                        defaultSelect={
                            waitingForChannel
                                ? "Select channel first"
                                : `${isRequired ? "Select" : "Not specified"} ${field.displayName.toLowerCase()}`
                        }
                        invalid={
                            property
                                ? invalidOf(property)
                                : false
                        }
                        error={
                            property ? errorOf(property) : ""
                        }
                    />
                </div>
            );
        }

        if (field.fieldType === "boolean") {
            return (
                <div className={columnClass} key={field.id}>
                    <InputCheckbox
                        name={field.fieldKey}
                        labelName={field.displayName}
                        value={value === "yes"}
                        onChange={(
                            event: ChangeEvent<HTMLInputElement>,
                        ) =>
                            setValue(
                                event.target.checked ? "yes" : "",
                            )
                        }
                        formgroupClassName="tw-mb-3 tw-mt-4"
                    />
                </div>
            );
        }

        if (field.fieldType === "textarea") {
            return (
                <div className={columnClass} key={field.id}>
                    <TextArea
                        name={property || field.fieldKey}
                        labelText={field.displayName}
                        labelClass={requiredClass(isRequired)}
                        placeHolder={field.placeholder}
                        value={value}
                        onChange={(
                            event: ChangeEvent<HTMLTextAreaElement>,
                        ) => setValue(event.target.value)}
                        onBlur={formik.handleBlur}
                    />
                </div>
            );
        }

        if (
            field.fieldType === "date" ||
            field.fieldType === "datetime"
        ) {
            return (
                <div className={columnClass} key={field.id}>
                    <DateInput
                        name={property || field.fieldKey}
                        labelText={field.displayName}
                        labelClass={requiredClass(isRequired)}
                        inputType={
                            field.fieldType === "datetime"
                                ? "datetime-local"
                                : "date"
                        }
                        minDate={
                            field.fieldKey ===
                                "next_followup_at_utc"
                                ? minimumFollowupTime()
                                : undefined
                        }
                        value={value}
                        onChange={(
                            event: ChangeEvent<HTMLInputElement>,
                        ) => setValue(event.target.value)}
                        onBlur={formik.handleBlur}
                        invalid={
                            property ? invalidOf(property) : false
                        }
                        error={property ? errorOf(property) : ""}
                    />
                </div>
            );
        }

        const isPhone = field.fieldType === "phone";

        return (
            <div className={columnClass} key={field.id}>
                <TextInput
                    name={property || field.fieldKey}
                    labelText={field.displayName}
                    labelClass={requiredClass(isRequired)}
                    placeHolder={field.placeholder}
                    inputType={
                        ["number", "decimal"].includes(
                            field.fieldType,
                        )
                            ? "number"
                            : "text"
                    }
                    maxLength={isPhone ? 10 : undefined}
                    value={value}
                    onChange={
                        isPhone
                            ? phoneChangeHandler
                            : (
                                event: ChangeEvent<HTMLInputElement>,
                            ) => setValue(event.target.value)
                    }
                    onBlur={formik.handleBlur}
                    invalid={
                        property ? invalidOf(property) : false
                    }
                    error={property ? errorOf(property) : ""}
                />
            </div>
        );
    };

    const secondaryChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setSecondarySource(current => ({
            ...current,
            ...(name === "channelId"
                ? { sourceId: "", campaignId: "" }
                : {}),
            ...(name === "sourceId" ? { campaignId: "" } : {}),
            [name]: value,
        }));
    };

    const addSecondarySourceHandler = () => {
        onAddSecondarySource?.(secondarySource);
        setSecondarySource({
            channelId: "",
            sourceId: "",
            campaignId: "",
        });
    };

    const canAddSecondarySource =
        Boolean(secondarySource.channelId) &&
        Boolean(secondarySource.sourceId) &&
        Boolean(secondarySource.campaignId);

    const configuredSections = useMemo(
        () => groupLeadFields(leadMeta.leadFields),
        [],
    );

    const lockedContactTitle =
        "Contact information cannot be edited";
    const lockedSourceTitle =
        "Primary source details cannot be edited";

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="tw-p-4"
        >
            {!isCreate && (
                <>
                    <div className="tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                        <div>
                            <span className="tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-400">
                                {lead?.leadId}
                            </span>
                            <h4 className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-900">
                                {isView
                                    ? lead?.studentName
                                    : `Edit ${lead?.studentName || "lead"}`}
                            </h4>
                        </div>

                        <UpdatedHorizontalTab
                            MenuOptions={tabMenuOptions}
                            clickMenuHandler={clickTabMenuHandler}
                            activeTabId={activeTab}
                            horizontalClass=""
                        />
                    </div>

                    {lead && lead.paymentAmount > 0 && (
                        <div className="tw-mb-3 tw-rounded-lg tw-border tw-border-emerald-200 tw-bg-emerald-50 tw-p-3 tw-text-emerald-800">
                            <strong>
                                Payment collected · ₹
                                {Number(
                                    lead.paymentAmount,
                                ).toLocaleString("en-IN")}
                            </strong>
                            {lead.paymentAt && (
                                <small className="tw-mt-1 tw-block">
                                    {formatDateTime(lead.paymentAt)}
                                </small>
                            )}
                        </div>
                    )}
                </>
            )}

            <fieldset disabled={isView}>
                {isCreate &&
                    (configuredSections.length ? (
                        configuredSections.map(section => (
                            <FormSection
                                key={section.title}
                                title={section.title}
                            >
                                <div className="row">
                                    {section.fields.map(
                                        renderConfiguredField,
                                    )}
                                </div>
                            </FormSection>
                        ))
                    ) : (
                        <FormSection title="Lead details">
                            <p className="tw-mb-0 tw-text-sm tw-text-danger">
                                Lead fields could not be loaded, so
                                this form is empty. Check that lead
                                fields are configured under Settings
                                → Business Units → Lead fields.
                            </p>
                        </FormSection>
                    ))}

                {!isCreate && activeTab === "student" && (
                    <FormSection title="Student and contact">
                        <div className="row">
                            <div className="col-12 col-md-6 col-lg-4">
                                <TextInput
                                    name="studentName"
                                    labelText="Student Name"
                                    labelClass="required"
                                    placeHolder="Enter student name"
                                    value={values.studentName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={invalidOf(
                                        "studentName",
                                    )}
                                    error={errorOf("studentName")}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <TextInput
                                    name="phone"
                                    labelText="Primary Phone"
                                    labelClass="required"
                                    placeHolder="10-digit mobile number"
                                    maxLength={10}
                                    value={values.phone}
                                    onChange={phoneChangeHandler}
                                    onBlur={formik.handleBlur}
                                    isDisabled={isEdit}
                                    helperText={
                                        isEdit
                                            ? lockedContactTitle
                                            : undefined
                                    }
                                    invalid={invalidOf("phone")}
                                    error={errorOf("phone")}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <TextInput
                                    name="alternatePhone"
                                    labelText="Alternate Phone"
                                    placeHolder="10-digit mobile number"
                                    maxLength={10}
                                    value={values.alternatePhone}
                                    onChange={phoneChangeHandler}
                                    onBlur={formik.handleBlur}
                                    invalid={invalidOf(
                                        "alternatePhone",
                                    )}
                                    error={errorOf(
                                        "alternatePhone",
                                    )}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <TextInput
                                    name="studentId"
                                    labelText="Student ID"
                                    placeHolder="Issued after admission"
                                    maxLength={60}
                                    value={values.studentId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={invalidOf("studentId")}
                                    error={errorOf("studentId")}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <TextInput
                                    name="email"
                                    labelText="Email"
                                    placeHolder="Enter email"
                                    value={values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    isDisabled={isEdit}
                                    invalid={invalidOf("email")}
                                    error={errorOf("email")}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <TextInput
                                    name="parentName"
                                    labelText="Parent Name"
                                    placeHolder="Enter parent name"
                                    value={values.parentName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <TextInput
                                    name="city"
                                    labelText="City"
                                    placeHolder="Enter city"
                                    value={values.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <SelectInput
                                    name="academicYear"
                                    labelText="Academic Year"
                                    labelClass="required"
                                    value={values.academicYear}
                                    onChange={changeHandler}
                                    onBlur={formik.handleBlur}
                                    menuItems={leadMeta.academicYears.map(
                                        item => ({
                                            id: item.academicYear,
                                            name: item.displayName,
                                        }),
                                    )}
                                    valueKey="id"
                                    textKey="name"
                                    defaultSelect="Select academic year"
                                    invalid={invalidOf(
                                        "academicYear",
                                    )}
                                    error={errorOf("academicYear")}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <SelectInput
                                    name="branchId"
                                    labelText="Branch"
                                    labelClass="required"
                                    value={values.branchId}
                                    onChange={changeHandler}
                                    onBlur={formik.handleBlur}
                                    menuItems={asOptions(
                                        leadMeta.branches,
                                    )}
                                    valueKey="id"
                                    textKey="name"
                                    isDisabled={isEdit}
                                    defaultSelect="Select branch"
                                    invalid={invalidOf("branchId")}
                                    error={errorOf("branchId")}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <SelectInput
                                    name="admissionTypeId"
                                    labelText="Admission Type"
                                    value={values.admissionTypeId}
                                    onChange={changeHandler}
                                    menuItems={asOptions(
                                        availableAdmissionTypes,
                                    )}
                                    valueKey="id"
                                    textKey="name"
                                    defaultSelect="Not specified"
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <SelectInput
                                    name="curriculumId"
                                    labelText="Curriculum"
                                    labelClass="required"
                                    value={values.curriculumId}
                                    onChange={changeHandler}
                                    onBlur={formik.handleBlur}
                                    menuItems={asOptions(
                                        availableCurricula,
                                    )}
                                    valueKey="id"
                                    textKey="name"
                                    defaultSelect="Select curriculum"
                                    invalid={invalidOf(
                                        "curriculumId",
                                    )}
                                    error={errorOf("curriculumId")}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <CustomSelect
                                    name="classId"
                                    idKey="id"
                                    searchKey="name"
                                    labelText="Class"
                                    labelClass="required"
                                    value={values.classId}
                                    options={availableClasses.map(
                                        item => ({
                                            id: String(item.id),
                                            name: item.displayName,
                                        }),
                                    )}
                                    defaultSelect={
                                        availableClasses.length
                                            ? "Search class…"
                                            : "No classes available for this combination"
                                    }
                                    renderValue={(item?: Option) =>
                                        item?.name || ""
                                    }
                                    renderOptions={(
                                        item?: Option,
                                    ) => item?.name || ""}
                                    onChange={(next: string) =>
                                        setFieldValue(
                                            "classId",
                                            next,
                                        )
                                    }
                                    isDisabled={isView}
                                    invalid={invalidOf("classId")}
                                    error={errorOf("classId")}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <SelectInput
                                    name="stageId"
                                    labelText="Stage"
                                    labelClass="required"
                                    value={values.stageId}
                                    onChange={changeHandler}
                                    onBlur={formik.handleBlur}
                                    menuItems={asOptions(
                                        leadMeta.stages,
                                    )}
                                    valueKey="id"
                                    textKey="name"
                                    defaultSelect="Select stage"
                                    invalid={invalidOf("stageId")}
                                    error={errorOf("stageId")}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <SelectInput
                                    name="substageId"
                                    labelText="Sub-stage"
                                    labelClass="required"
                                    value={values.substageId}
                                    onChange={changeHandler}
                                    onBlur={formik.handleBlur}
                                    menuItems={asOptions(
                                        availableSubstages,
                                    )}
                                    valueKey="id"
                                    textKey="name"
                                    defaultSelect="Select sub-stage"
                                    invalid={invalidOf(
                                        "substageId",
                                    )}
                                    error={errorOf("substageId")}
                                />
                            </div>

                            <div className="col-12 col-md-6 col-lg-4">
                                <SelectInput
                                    name="ownerEmployeeId"
                                    labelText="Lead Owner"
                                    value={values.ownerEmployeeId}
                                    onChange={changeHandler}
                                    menuItems={availableOwners.map(
                                        item => ({
                                            id: item.id,
                                            name: `${item.name} · ${item.branchName}`,
                                        }),
                                    )}
                                    valueKey="id"
                                    textKey="name"
                                    defaultSelect="Unassigned"
                                />
                            </div>

                            {followupRequired && (
                                <>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <DateInput
                                            name="nextFollowupAt"
                                            labelText="Next Follow-up"
                                            labelClass="required"
                                            inputType="datetime-local"
                                            minDate={minimumFollowupTime()}
                                            value={
                                                values.nextFollowupAt
                                            }
                                            onChange={
                                                formik.handleChange
                                            }
                                            onBlur={
                                                formik.handleBlur
                                            }
                                            invalid={invalidOf(
                                                "nextFollowupAt",
                                            )}
                                            error={errorOf(
                                                "nextFollowupAt",
                                            )}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-4">
                                        <SelectInput
                                            name="followupType"
                                            labelText="Follow-up Type"
                                            labelClass="required"
                                            value={
                                                values.followupType
                                            }
                                            onChange={
                                                formik.handleChange
                                            }
                                            onBlur={
                                                formik.handleBlur
                                            }
                                            menuItems={
                                                followupTypeOptions
                                            }
                                            valueKey="id"
                                            textKey="name"
                                            defaultSelect="Select follow-up type"
                                            invalid={invalidOf(
                                                "followupType",
                                            )}
                                            error={errorOf(
                                                "followupType",
                                            )}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="col-12 col-md-6 col-lg-4">
                                <TextInput
                                    name="leadScore"
                                    labelText="Lead Score"
                                    inputType="number"
                                    value={values.leadScore}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={invalidOf("leadScore")}
                                    error={errorOf("leadScore")}
                                />
                            </div>

                            <div className="col-12">
                                <TextArea
                                    name="remarks"
                                    labelText="Remarks"
                                    placeHolder="Enter remarks"
                                    value={values.remarks}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                        </div>
                    </FormSection>
                )}

                {!isCreate && activeTab === "source" && (
                    <>
                        <FormSection title="Primary source">
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-4">
                                    <SelectInput
                                        name="channelId"
                                        labelText="Channel"
                                        value={values.channelId}
                                        onChange={changeHandler}
                                        menuItems={leadMeta.channels.map(
                                            item => ({
                                                id: item.id,
                                                name: `${item.displayName} · ${item.category}`,
                                            }),
                                        )}
                                        valueKey="id"
                                        textKey="name"
                                        isDisabled={isEdit}
                                        defaultSelect="Select channel"
                                    />
                                </div>

                                <div className="col-12 col-md-6 col-lg-4">
                                    <SelectInput
                                        name="sourceId"
                                        labelText="Source"
                                        value={values.sourceId}
                                        onChange={changeHandler}
                                        menuItems={asOptions(
                                            availableSources,
                                        )}
                                        valueKey="id"
                                        textKey="name"
                                        isDisabled={isEdit}
                                        defaultSelect="Select source"
                                    />
                                </div>

                                <div className="col-12 col-md-6 col-lg-4">
                                    <SelectInput
                                        name="campaignId"
                                        labelText="Campaign"
                                        value={values.campaignId}
                                        onChange={changeHandler}
                                        menuItems={asOptions(
                                            availableCampaigns,
                                        )}
                                        valueKey="id"
                                        textKey="name"
                                        isDisabled={isEdit}
                                        defaultSelect="Select campaign"
                                    />
                                </div>

                                {isEdit && (
                                    <div className="col-12">
                                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                            {lockedSourceTitle}. Add
                                            a secondary source below
                                            instead.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </FormSection>

                        {isEdit && (
                            <FormSection title="Add secondary source">
                                <div className="row">
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <SelectInput
                                            name="channelId"
                                            labelText="Channel"
                                            labelClass="required"
                                            value={
                                                secondarySource.channelId
                                            }
                                            onChange={
                                                secondaryChangeHandler
                                            }
                                            menuItems={leadMeta.channels.map(
                                                item => ({
                                                    id: item.id,
                                                    name: `${item.displayName} · ${item.category}`,
                                                }),
                                            )}
                                            valueKey="id"
                                            textKey="name"
                                            defaultSelect="Select channel"
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-4">
                                        <SelectInput
                                            name="sourceId"
                                            labelText="Source"
                                            labelClass="required"
                                            value={
                                                secondarySource.sourceId
                                            }
                                            onChange={
                                                secondaryChangeHandler
                                            }
                                            menuItems={asOptions(
                                                secondarySources,
                                            )}
                                            valueKey="id"
                                            textKey="name"
                                            isDisabled={
                                                !secondarySource.channelId
                                            }
                                            defaultSelect={
                                                secondarySource.channelId
                                                    ? "Select source"
                                                    : "Select channel first"
                                            }
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-4">
                                        <SelectInput
                                            name="campaignId"
                                            labelText="Campaign"
                                            labelClass="required"
                                            value={
                                                secondarySource.campaignId
                                            }
                                            onChange={
                                                secondaryChangeHandler
                                            }
                                            menuItems={asOptions(
                                                secondaryCampaigns,
                                            )}
                                            valueKey="id"
                                            textKey="name"
                                            isDisabled={
                                                !secondarySource.sourceId
                                            }
                                            defaultSelect={
                                                secondarySource.sourceId
                                                    ? "Select campaign"
                                                    : "Select source first"
                                            }
                                        />
                                    </div>

                                    <div className="col-12 tw-flex tw-justify-end">
                                        <Button
                                            type="button"
                                            variant="hoverInfo"
                                            disabled={
                                                !canAddSecondarySource
                                            }
                                            onClick={
                                                addSecondarySourceHandler
                                            }
                                        >
                                            <i className="ri-add-fill"></i>
                                            Add source
                                        </Button>
                                    </div>
                                </div>
                            </FormSection>
                        )}

                        <FormSection title="Secondary sources">
                            {secondarySourceHistory.length ? (
                                <div className="tw-flex tw-flex-col tw-gap-2">
                                    {secondarySourceHistory.map(
                                        entry => (
                                            <div
                                                key={entry.id}
                                                className="tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-px-3 tw-py-2"
                                            >
                                                <span className="tw-text-sm tw-text-gray-700">
                                                    {[
                                                        entry.channel,
                                                        entry.source,
                                                        entry.campaign,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" · ")}
                                                </span>
                                                <small className="tw-ms-auto tw-text-xs tw-text-gray-500">
                                                    {[
                                                        entry.academicYear,
                                                        entry.addedBy,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" · ")}{" "}
                                                    ·{" "}
                                                    {formatDateTime(
                                                        entry.createdAt,
                                                    )}
                                                </small>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                    None. A source added after the
                                    first appears here.
                                </p>
                            )}
                        </FormSection>

                        {Boolean(lead?.formResponses?.length) && (
                            <FormSection title="Form responses">
                                <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                                    {[
                                        lead?.formName,
                                        lead?.formPageName,
                                    ]
                                        .filter(Boolean)
                                        .join(" · ")}
                                </p>

                                <div className="table-responsive">
                                    <table className="table table-sm align-middle mb-0">
                                        <thead className="table-light text-muted">
                                            <tr>
                                                <th>Question</th>
                                                <th>Answer</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {lead?.formResponses.map(
                                                (row, index) => (
                                                    <tr
                                                        key={`${row.question}-${index}`}
                                                    >
                                                        <td className="tw-text-sm tw-text-gray-700">
                                                            {row.question}
                                                        </td>
                                                        <td className="tw-text-sm tw-text-gray-800">
                                                            {row.answer || (
                                                                <em className="tw-text-gray-400">
                                                                    blank
                                                                </em>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </FormSection>
                        )}
                    </>
                )}
            </fieldset>

            {!isCreate && activeTab === "history" && lead && (
                <LeadHistoryModal lead={lead} />
            )}

            {!isCreate && activeTab === "remarketing" && (
                <FormSection title="Meta remarketing">
                    {lead?.audiences?.length ? (
                        <div className="table-responsive">
                            <table className="table table-sm align-middle mb-0">
                                <thead className="table-light text-muted">
                                    <tr>
                                        <th>Audience</th>
                                        <th>Meta audience ID</th>
                                        <th>Match keys</th>
                                        <th>Sync status</th>
                                        <th>Last synced</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {lead.audiences.map(row => (
                                        <tr key={row.audienceId}>
                                            <td>
                                                <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                    {row.name}
                                                </p>
                                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                    {row.audienceStatus}
                                                </p>
                                            </td>
                                            <td className="tw-font-mono tw-text-xs tw-text-gray-500">
                                                {row.metaAudienceId ||
                                                    "Not created at Meta"}
                                            </td>
                                            <td className="tw-text-xs tw-text-gray-700">
                                                {row.matchKeys || "—"}
                                            </td>
                                            <td className="tw-text-xs tw-text-gray-700">
                                                {row.syncStatus}
                                            </td>
                                            <td className="tw-whitespace-nowrap tw-text-xs tw-text-gray-500">
                                                {formatDateTime(
                                                    row.lastSyncedAt,
                                                ) || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                            This lead is not in any Meta
                            remarketing audience.
                        </p>
                    )}
                </FormSection>
            )}

            <div className="tw-mt-4 tw-flex tw-flex-wrap tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={toggle}
                >
                    Close
                </Button>

                {isView && (
                    <>
                        <Button
                            type="button"
                            variant="hoverInfo"
                            title="Mark this lead as a re-enquiry"
                            onClick={onMarkReEnquired}
                        >
                            Mark re-enquired
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={onSwitchToEdit}
                        >
                            <i className="ri-pencil-line"></i>
                            Edit lead
                        </Button>
                    </>
                )}

                {!isView && (
                    <Button
                        type="submit"
                        variant="primary"
                    >
                        {isEdit ? "Save changes" : "Create lead"}
                    </Button>
                )}
            </div>
        </form>
    );
};

export default AddEditLeadModal;
