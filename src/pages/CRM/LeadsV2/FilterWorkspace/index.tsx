import {
    useMemo,
    useState,
    type ChangeEvent,
    type MouseEvent,
} from "react";

import {
    Button,
    InputCheckbox,
    SelectInput,
    TextIconInput,
    TextInput,
} from "../../../../Components/Common";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import {
    channelCategoryOptions,
    contactAvailabilityOptions,
    isReferredOptions,
    leadEntryPathOptions,
    leadMeta,
    marketingDeliveryStatusOptions,
    paymentStatusOptions,
    studentIdStatusOptions,
    touchStatusOptions,
    whatsappResponseOptions,
    yesNoOptions,
} from "../data";
import { emptyAdvancedFilters } from "../helper";
import type {
    AdvancedFilters,
    Option,
    SavedView,
} from "../types";
import FilterMultiSelect from "./FilterMultiSelect";

interface FilterWorkspaceProps {
    mode: "filter" | "funnel";
    initialFilters: AdvancedFilters;
    savedViews: SavedView[];
    showReferredFilter: boolean;
    toggle: () => void;
    onApply: (filters: AdvancedFilters) => void;
    onSave: (
        name: string,
        type: "filter" | "funnel",
        filters: AdvancedFilters,
    ) => void;
}

const sections = [
    { id: "lead", labelName: "Lead details" },
    { id: "academic", labelName: "Academic details" },
    { id: "communication", labelName: "Communication details" },
    { id: "marketing", labelName: "Marketing campaigns" },
    { id: "date", labelName: "Date filters" },
    { id: "range", labelName: "Range filters" },
];

const dateRangeFields: Array<{
    id: string;
    labelName: string;
    fromKey: keyof AdvancedFilters;
    toKey: keyof AdvancedFilters;
}> = [
        {
            id: "added",
            labelName: "Added",
            fromKey: "addedFrom",
            toKey: "addedTo",
        },
        {
            id: "updated",
            labelName: "Updated",
            fromKey: "updatedFrom",
            toKey: "updatedTo",
        },
        {
            id: "referred",
            labelName: "Referred",
            fromKey: "referredFrom",
            toKey: "referredTo",
        },
        {
            id: "next-follow-up",
            labelName: "Next Follow-up",
            fromKey: "nextFollowupFrom",
            toKey: "nextFollowupTo",
        },
        {
            id: "re-enquired",
            labelName: "Re-Enquired",
            fromKey: "reEnquiredFrom",
            toKey: "reEnquiredTo",
        },
    ];

const asOptions = (
    list: Array<{
        id: string;
        displayName?: string;
        name?: string;
    }>,
): Option[] =>
    list.map(item => ({
        id: String(item.id),
        name: item.displayName || item.name || "",
    }));

const FilterWorkspace = ({
    mode,
    initialFilters,
    savedViews,
    showReferredFilter,
    toggle,
    onApply,
    onSave,
}: FilterWorkspaceProps) => {
    const [filters, setFilters] =
        useState<AdvancedFilters>(initialFilters);
    const [activeSection, setActiveSection] =
        useState<string>("lead");
    const [fieldSearch, setFieldSearch] =
        useState<string>("");
    const [savedViewId, setSavedViewId] =
        useState<string>("");
    const [name, setName] = useState<string>("");
    const [nameError, setNameError] = useState<string>("");

    const setMulti = (key: string, ids: string[]) => {
        setFilters(current => ({
            ...current,
            [key]: ids,
            ...(key === "stage" ? { substageId: [] } : {}),
            ...(key === "channelCategory"
                ? { channelId: [] }
                : {}),
            ...(key === "campaignCategory"
                ? { campaignId: [] }
                : {}),
            ...(key === "branchId"
                ? { ownerEmployeeId: [] }
                : {}),
        }));
    };

    const setValue = (
        key: keyof AdvancedFilters,
        value: string,
    ) => {
        setFilters(current => ({
            ...current,
            [key]: value,
        }));
    };

    const setRange = (
        fromKey: keyof AdvancedFilters,
        toKey: keyof AdvancedFilters,
        dates: { startDate: string; endDate: string },
    ) => {
        setFilters(current => ({
            ...current,
            [fromKey]: dates.startDate || "",
            [toKey]: dates.endDate || "",
        }));
    };

    const isVisible = (label: string) =>
        !fieldSearch ||
        label
            .toLowerCase()
            .includes(fieldSearch.trim().toLowerCase());

    const activeFilterCount = useMemo(
        () =>
            Object.entries(filters).filter(([, value]) =>
                Array.isArray(value)
                    ? value.length > 0
                    : typeof value === "boolean"
                        ? value
                        : Boolean(value),
            ).length,
        [filters],
    );

    const substageOptions = useMemo(
        () =>
            asOptions(
                leadMeta.substages.filter(
                    item =>
                        !filters.stage.length ||
                        filters.stage.includes(
                            String(item.stageId),
                        ),
                ),
            ),
        [filters.stage],
    );

    const channelOptions = useMemo(
        () =>
            leadMeta.channels
                .filter(
                    item =>
                        !filters.channelCategory.length ||
                        filters.channelCategory.includes(
                            item.category,
                        ),
                )
                .map(item => ({
                    id: item.id,
                    name: item.displayName,
                })),
        [filters.channelCategory],
    );

    const campaignOptions = useMemo(
        () =>
            leadMeta.campaigns
                .filter(
                    item =>
                        !filters.campaignCategory.length ||
                        filters.campaignCategory.includes(
                            item.category,
                        ),
                )
                .map(item => ({
                    id: item.id,
                    name: item.displayName,
                })),
        [filters.campaignCategory],
    );

    const counsellorOptions = useMemo(
        () =>
            leadMeta.employees
                .filter(
                    item =>
                        !filters.branchId.length ||
                        filters.branchId.includes(
                            String(item.branchId),
                        ),
                )
                .map(item => ({
                    id: item.id,
                    name: `${item.name} · ${item.branchName}`,
                })),
        [filters.branchId],
    );

    const campaignCategoryOptions = useMemo(
        () =>
            [
                ...new Set(
                    leadMeta.campaigns.map(
                        item => item.category,
                    ),
                ),
            ].map(item => ({ id: item, name: item })),
        [],
    );

    const savedViewOptions = useMemo(
        () =>
            savedViews
                .filter(item => item.type === mode)
                .map(item => ({
                    id: item.id,
                    name: item.name,
                })),
        [savedViews, mode],
    );

    const loadSavedViewHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        const nextId = event.target.value;

        setSavedViewId(nextId);

        const view = savedViews.find(
            item => String(item.id) === String(nextId),
        );

        if (view) {
            setFilters(view.filters);
            setName(view.name);
        }
    };

    const sectionClickHandler = (
        event: MouseEvent<HTMLElement>,
    ) => {
        const sectionId =
            event.currentTarget.getAttribute("data-id");

        if (sectionId) {
            setActiveSection(sectionId);
        }
    };

    const resetHandler = () => {
        setFilters(emptyAdvancedFilters);
        setSavedViewId("");
        setName("");
        setNameError("");
    };

    const saveHandler = (type: "filter" | "funnel") => {
        if (!name.trim()) {
            setNameError("Enter a name before saving");
            return;
        }

        setNameError("");
        onSave(name.trim(), type, filters);
    };

    const gridClass =
        "tw-grid tw-grid-cols-1 tw-gap-x-6 tw-gap-y-4 xl:tw-grid-cols-2";

    return (
        <div className="tw-flex tw-h-[78vh] tw-flex-col tw-bg-white">
            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3 tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                <div>
                    <h5 className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-900">
                        {mode === "funnel"
                            ? "Create lead view"
                            : "Filter leads"}
                    </h5>
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                        {activeFilterCount} filter
                        {activeFilterCount === 1 ? "" : "s"} set
                    </p>
                </div>

                <div className="tw-w-full md:tw-w-[320px]">
                    <SelectInput
                        name="savedViewId"
                        labelText={
                            mode === "funnel"
                                ? "Load saved view"
                                : "Load saved filter"
                        }
                        value={savedViewId}
                        onChange={loadSavedViewHandler}
                        menuItems={savedViewOptions}
                        valueKey="id"
                        textKey="name"
                        defaultSelect={
                            mode === "funnel"
                                ? "Select a saved view"
                                : "Select a saved filter"
                        }
                        formgroupClassName="tw-mb-0"
                        floatingLabel
                    />
                </div>
            </div>

            <div className="tw-flex tw-flex-1 tw-gap-3 tw-overflow-hidden tw-bg-gray-50 tw-p-3">
                <div className="tw-w-1/3 tw-flex-shrink-0 lg:tw-w-1/4">
                    <div className="tw-rounded-lg tw-bg-white tw-shadow">
                        <ul className="tw-m-0 tw-list-none tw-p-0">
                            {sections.map(section => (
                                <li
                                    key={section.id}
                                    data-id={section.id}
                                    onClick={sectionClickHandler}
                                    className={`tw-cursor-pointer tw-border-b tw-border-gray-100 tw-px-4 tw-py-2 ${section.id === activeSection
                                        ? "tw-bg-[#4051891a] tw-font-medium tw-text-[#405189]"
                                        : "hover:tw-bg-gray-50"
                                        }`}
                                >
                                    {section.labelName}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="tw-w-2/3 tw-overflow-y-auto lg:tw-w-3/4">
                    <div className="tw-mb-4">
                        <TextIconInput
                            name="fieldSearch"
                            formgroupClassName="search-box tw-mb-0"
                            value={fieldSearch}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ) =>
                                setFieldSearch(
                                    event.target.value,
                                )
                            }
                            placeHolder="Search filter fields"
                        >
                            <i className="ri-search-line search-icon"></i>
                        </TextIconInput>
                    </div>

                    {activeSection === "lead" && (
                        <div className={gridClass}>
                            {isVisible("Touch status") && (
                                <FilterMultiSelect
                                    name="touchStatus"
                                    labelText="Touch status"
                                    value={filters.touchStatus}
                                    options={touchStatusOptions}
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible("Lead added via") && (
                                <FilterMultiSelect
                                    name="leadEntryPath"
                                    labelText="Lead added via"
                                    value={filters.leadEntryPath}
                                    options={
                                        leadEntryPathOptions
                                    }
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible("Branch") && (
                                <FilterMultiSelect
                                    name="branchId"
                                    labelText="Branch"
                                    value={filters.branchId}
                                    options={asOptions(
                                        leadMeta.branches,
                                    )}
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible("Current stage") && (
                                <FilterMultiSelect
                                    name="stage"
                                    labelText="Current stage"
                                    value={filters.stage}
                                    options={asOptions(
                                        leadMeta.stages,
                                    )}
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible("Sub-stage") && (
                                <FilterMultiSelect
                                    name="substageId"
                                    labelText="Sub-stage"
                                    value={filters.substageId}
                                    options={substageOptions}
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible("Lead source") && (
                                <FilterMultiSelect
                                    name="sourceId"
                                    labelText="Lead source"
                                    value={filters.sourceId}
                                    options={asOptions(
                                        leadMeta.sources,
                                    )}
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible(
                                "Counsellor referred to",
                            ) && (
                                    <FilterMultiSelect
                                        name="ownerEmployeeId"
                                        labelText="Counsellor referred to"
                                        value={
                                            filters.ownerEmployeeId
                                        }
                                        options={
                                            counsellorOptions
                                        }
                                        onChange={setMulti}
                                    />
                                )}
                            {isVisible("Campaign category") && (
                                <FilterMultiSelect
                                    name="campaignCategory"
                                    labelText="Campaign category"
                                    value={
                                        filters.campaignCategory
                                    }
                                    options={
                                        campaignCategoryOptions
                                    }
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible("Campaign name") && (
                                <FilterMultiSelect
                                    name="campaignId"
                                    labelText="Campaign name"
                                    value={filters.campaignId}
                                    options={campaignOptions}
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible("Channel category") && (
                                <FilterMultiSelect
                                    name="channelCategory"
                                    labelText="Channel category"
                                    value={
                                        filters.channelCategory
                                    }
                                    options={
                                        channelCategoryOptions
                                    }
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible("Channel") && (
                                <FilterMultiSelect
                                    name="channelId"
                                    labelText="Channel"
                                    value={filters.channelId}
                                    options={channelOptions}
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible("Payment status") && (
                                <FilterMultiSelect
                                    name="paymentStatus"
                                    labelText="Payment status"
                                    value={filters.paymentStatus}
                                    options={
                                        paymentStatusOptions
                                    }
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible(
                                "Student ID generated",
                            ) && (
                                    <FilterMultiSelect
                                        name="studentIdStatus"
                                        labelText="Student ID generated"
                                        value={
                                            filters.studentIdStatus
                                        }
                                        options={
                                            studentIdStatusOptions
                                        }
                                        onChange={setMulti}
                                    />
                                )}
                            {isVisible("Pending follow-ups") && (
                                <div className="tw-pt-2">
                                    <InputCheckbox
                                        name="pendingFollowupsOnly"
                                        labelName="Pending follow-ups due through today"
                                        value={
                                            filters.pendingFollowupsOnly
                                        }
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            setFilters(current => ({
                                                ...current,
                                                pendingFollowupsOnly:
                                                    event.target.checked,
                                            }))
                                        }
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === "academic" && (
                        <div className={gridClass}>
                            {isVisible("Class") && (
                                <FilterMultiSelect
                                    name="classId"
                                    labelText="Class"
                                    value={filters.classId}
                                    options={asOptions(
                                        leadMeta.classes,
                                    )}
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible("Curriculum") && (
                                <FilterMultiSelect
                                    name="curriculumId"
                                    labelText="Curriculum"
                                    value={filters.curriculumId}
                                    options={asOptions(
                                        leadMeta.curricula,
                                    )}
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible("Admission type") && (
                                <FilterMultiSelect
                                    name="admissionTypeId"
                                    labelText="Admission type"
                                    value={
                                        filters.admissionTypeId
                                    }
                                    options={asOptions(
                                        leadMeta.admissionTypes,
                                    )}
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible("Referred from") && (
                                <FilterMultiSelect
                                    name="referredByEmployeeId"
                                    labelText="Referred from"
                                    value={
                                        filters.referredByEmployeeId
                                    }
                                    options={leadMeta.employees.map(
                                        item => ({
                                            id: item.id,
                                            name: `${item.name} · ${item.branchName}`,
                                        }),
                                    )}
                                    onChange={setMulti}
                                />
                            )}
                        </div>
                    )}

                    {activeSection === "communication" && (
                        <div className={gridClass}>
                            {isVisible("Student name") && (
                                <TextInput
                                    name="studentName"
                                    labelText="Student name"
                                    placeHolder="Search student name"
                                    value={filters.studentName}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        setValue(
                                            "studentName",
                                            event.target.value,
                                        )
                                    }
                                    formgroupClassName="tw-mb-0"
                                />
                            )}
                            {isVisible("Primary phone") && (
                                <TextInput
                                    name="primaryPhone"
                                    labelText="Primary phone"
                                    placeHolder="Search primary phone"
                                    maxLength={10}
                                    value={filters.primaryPhone}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        setValue(
                                            "primaryPhone",
                                            event.target.value.replace(
                                                /\D/g,
                                                "",
                                            ),
                                        )
                                    }
                                    formgroupClassName="tw-mb-0"
                                />
                            )}
                            {isVisible("Alternate phone") && (
                                <TextInput
                                    name="alternatePhone"
                                    labelText="Alternate phone"
                                    placeHolder="Search alternate phone"
                                    maxLength={10}
                                    value={
                                        filters.alternatePhone
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        setValue(
                                            "alternatePhone",
                                            event.target.value.replace(
                                                /\D/g,
                                                "",
                                            ),
                                        )
                                    }
                                    formgroupClassName="tw-mb-0"
                                />
                            )}
                            {isVisible("Email") && (
                                <TextInput
                                    name="email"
                                    labelText="Email"
                                    placeHolder="Search email"
                                    value={filters.email}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        setValue(
                                            "email",
                                            event.target.value,
                                        )
                                    }
                                    formgroupClassName="tw-mb-0"
                                />
                            )}
                            {isVisible("Parent name") && (
                                <TextInput
                                    name="parentName"
                                    labelText="Parent name"
                                    placeHolder="Search parent name"
                                    value={filters.parentName}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        setValue(
                                            "parentName",
                                            event.target.value,
                                        )
                                    }
                                    formgroupClassName="tw-mb-0"
                                />
                            )}
                            {isVisible(
                                "Contact availability",
                            ) && (
                                    <FilterMultiSelect
                                        name="contactAvailability"
                                        labelText="Contact availability"
                                        value={
                                            filters.contactAvailability
                                        }
                                        options={
                                            contactAvailabilityOptions
                                        }
                                        onChange={setMulti}
                                    />
                                )}
                            {isVisible("Parent") && (
                                <FilterMultiSelect
                                    name="isParent"
                                    labelText="Parent"
                                    value={filters.isParent}
                                    options={yesNoOptions}
                                    onChange={setMulti}
                                />
                            )}
                            {isVisible(
                                "Looking for admission",
                            ) && (
                                    <FilterMultiSelect
                                        name="lookingForAdmission"
                                        labelText="Looking for admission"
                                        value={
                                            filters.lookingForAdmission
                                        }
                                        options={yesNoOptions}
                                        onChange={setMulti}
                                    />
                                )}
                            {isVisible("WhatsApp response") && (
                                <FilterMultiSelect
                                    name="whatsappResponse"
                                    labelText="WhatsApp response"
                                    value={
                                        filters.whatsappResponse
                                    }
                                    options={
                                        whatsappResponseOptions
                                    }
                                    onChange={setMulti}
                                />
                            )}
                        </div>
                    )}

                    {activeSection === "marketing" && (
                        <>
                            <div className="tw-mb-4 tw-rounded tw-border tw-border-gray-200 tw-bg-white tw-p-3">
                                <p className="tw-mb-1 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-500">
                                    WhatsApp campaigns
                                </p>
                                <p className="tw-mb-0 tw-text-sm tw-text-gray-600">
                                    Find leads by bulk campaign
                                    and delivery outcome. Campaign
                                    filters work together with all
                                    lead, academic and date
                                    filters.
                                </p>
                            </div>

                            <div className={gridClass}>
                                {isVisible(
                                    "Bulk marketing campaign",
                                ) && (
                                        <FilterMultiSelect
                                            name="marketingCampaignId"
                                            labelText="Bulk marketing campaign"
                                            value={
                                                filters.marketingCampaignId
                                            }
                                            options={asOptions(
                                                leadMeta.marketingCampaigns,
                                            )}
                                            onChange={setMulti}
                                        />
                                    )}
                                {isVisible(
                                    "WhatsApp delivery status",
                                ) && (
                                        <FilterMultiSelect
                                            name="marketingDeliveryStatus"
                                            labelText="WhatsApp delivery status"
                                            value={
                                                filters.marketingDeliveryStatus
                                            }
                                            options={
                                                marketingDeliveryStatusOptions
                                            }
                                            onChange={setMulti}
                                        />
                                    )}
                            </div>
                        </>
                    )}

                    {activeSection === "date" && (
                        <div className={gridClass}>
                            {dateRangeFields
                                .filter(field =>
                                    isVisible(field.labelName),
                                )
                                .map(field => {
                                    const portalId = `leads-v2-${field.id}-date-filter`;

                                    return (
                                        <div key={field.id}>
                                            <CustomDatePicker
                                                name={field.id}
                                                labelText={
                                                    field.labelName
                                                }
                                                startDate={
                                                    filters[
                                                    field
                                                        .fromKey
                                                    ] as string
                                                }
                                                endDate={
                                                    filters[
                                                    field.toKey
                                                    ] as string
                                                }
                                                onChange={(dates: {
                                                    startDate: string;
                                                    endDate: string;
                                                }) =>
                                                    setRange(
                                                        field.fromKey,
                                                        field.toKey,
                                                        dates,
                                                    )
                                                }
                                                placeholder={`Select ${field.labelName.toLowerCase()} range`}
                                                monthsShown={2}
                                                formgroupClassName="tw-mb-0"
                                                portalId={
                                                    portalId
                                                }
                                                floatingLabel
                                            />
                                            <div
                                                id={portalId}
                                            ></div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}

                    {activeSection === "range" && (
                        <div className={gridClass}>
                            {showReferredFilter &&
                                isVisible("Is referred") && (
                                    <SelectInput
                                        name="isReferred"
                                        labelText="Is referred"
                                        value={filters.isReferred}
                                        onChange={(
                                            event: ChangeEvent<HTMLSelectElement>,
                                        ) =>
                                            setValue(
                                                "isReferred",
                                                event.target
                                                    .value,
                                            )
                                        }
                                        menuItems={
                                            isReferredOptions
                                        }
                                        valueKey="id"
                                        textKey="name"
                                        hideSelectOption
                                        formgroupClassName="tw-mb-0"
                                    />
                                )}
                            {isVisible("Minimum lead score") && (
                                <TextInput
                                    name="scoreMin"
                                    labelText="Minimum lead score"
                                    inputType="number"
                                    placeHolder="Enter minimum lead score"
                                    value={filters.scoreMin}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        setValue(
                                            "scoreMin",
                                            event.target.value,
                                        )
                                    }
                                    formgroupClassName="tw-mb-0"
                                />
                            )}
                            {isVisible("Maximum lead score") && (
                                <TextInput
                                    name="scoreMax"
                                    labelText="Maximum lead score"
                                    inputType="number"
                                    placeHolder="Enter maximum lead score"
                                    value={filters.scoreMax}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        setValue(
                                            "scoreMax",
                                            event.target.value,
                                        )
                                    }
                                    formgroupClassName="tw-mb-0"
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-3 tw-border-t tw-border-gray-200 tw-bg-white tw-px-4 tw-py-3">
                <div className="tw-w-full md:tw-w-[320px]">
                    <TextInput
                        name="viewName"
                        value={name}
                        onChange={(
                            event: ChangeEvent<HTMLInputElement>,
                        ) => {
                            setName(event.target.value);

                            if (event.target.value.trim()) {
                                setNameError("");
                            }
                        }}
                        placeHolder="Name this filter or view"
                        formgroupClassName="tw-mb-0"
                        invalid={Boolean(nameError)}
                        error={nameError}
                    />
                </div>

                <div className="tw-flex tw-flex-wrap tw-gap-2">
                    <Button
                        type="button"
                        variant="hoverInfo"
                        onClick={resetHandler}
                    >
                        <i className="ri-reset-left-line"></i>
                        Reset
                    </Button>
                    <Button
                        type="button"
                        variant="hoverInfo"
                        onClick={() => saveHandler("filter")}
                    >
                        <i className="ri-save-3-line"></i>
                        Save filter
                    </Button>
                    <Button
                        type="button"
                        variant="hoverInfo"
                        onClick={() => saveHandler("funnel")}
                    >
                        <i className="ri-filter-3-line"></i>
                        Save view
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={toggle}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => onApply(filters)}
                    >
                        Apply filter
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FilterWorkspace;
