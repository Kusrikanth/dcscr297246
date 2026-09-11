import { useMemo, useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";

import {
    Button,
    SelectInput,
    StatusLabel,
    TextIconInput,
} from "../../../../Components/Common";
import {
    settingsBranches,
    settingsBusinessUnits,
} from "../../Settings/helper";
import {
    configForUnit,
} from "../../Settings/businessunitconfig";
import {
    branchNameFor,
    businessUnitNameFor,
    formMappedOptions,
    metaCrmFieldOptions,
    metaLeadForms,
    metaPages,
    metaRouting,
    type MetaLeadForm,
} from "../../Settings/MetaLeadAds/helper";

const emptyFilters = {
    searchString: "",
    pageId: "",
    status: "",
    mapped: "",
    businessUnitId: "",
};

const MetaLeadFormsTab = () => {
    const [forms, setForms] = useState<Array<MetaLeadForm>>(metaLeadForms);
    const [filters, setFilters] = useState(emptyFilters);

    const pageOptions = useMemo(
        () =>
            metaPages.map(page => ({
                id: page.pageId,
                name: page.pageName || page.pageId,
            })),
        [],
    );

    const statusOptions = useMemo(
        () =>
            [...new Set(metaLeadForms.map(form => form.formStatus))]
                .filter(Boolean)
                .map(status => ({ id: status, name: status })),
        [],
    );

    const visibleForms = useMemo(() => {
        const term = filters.searchString.trim().toLowerCase();

        return forms.filter(form => {
            const isMapped =
                Object.values(form.fieldMapping).filter(Boolean).length > 0;

            return (
                (!term ||
                    `${form.formName} ${form.formId}`
                        .toLowerCase()
                        .includes(term)) &&
                (!filters.pageId || form.pageId === filters.pageId) &&
                (!filters.status || form.formStatus === filters.status) &&
                (!filters.mapped ||
                    (filters.mapped === "yes") === isMapped) &&
                (!filters.businessUnitId ||
                    effectiveDestination(form).businessUnitId ===
                    filters.businessUnitId)
            );
        });
    }, [forms, filters]);

    const isFiltered = visibleForms.length !== forms.length;

    function effectiveDestination(form: MetaLeadForm) {
        const page = metaPages.find(item => item.pageId === form.pageId);

        const businessUnitId =
            form.businessUnitId ||
            page?.businessUnitId ||
            metaRouting.defaultBusinessUnitId;
        const branchId =
            form.branchId || page?.branchId || metaRouting.defaultBranchId;

        const source =
            form.businessUnitId || form.branchId
                ? "form"
                : page?.businessUnitId || page?.branchId
                    ? "page"
                    : "default";

        return { businessUnitId, branchId, source };
    }

    const stageOptionsFor = (form: MetaLeadForm) => {
        const unitId = effectiveDestination(form).businessUnitId;
        const config = configForUnit(unitId);

        return config.pipelineStages.map(stage => ({
            id: stage.id,
            name: `${config.leadPipelines.find(pipeline => pipeline.id === stage.pipelineId)?.displayName || "Pipeline"} · ${stage.displayName}`,
        }));
    };

    const substageOptionsFor = (form: MetaLeadForm) => {
        const unitId = effectiveDestination(form).businessUnitId;

        return configForUnit(unitId)
            .leadSubstages.filter(item => item.stageId === form.stageId)
            .map(item => ({ id: item.id, name: item.displayName }));
    };

    const filterChangeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setFilters(current => ({ ...current, [name]: value }));
    };

    const clearFiltersHandler = () => setFilters(emptyFilters);

    const formChangeHandler = (
        formId: string,
        changes: Partial<MetaLeadForm>,
        successText: string,
    ) => {
        setForms(current =>
            current.map(item =>
                item.formId === formId ? { ...item, ...changes } : item,
            ),
        );
        toast.success(successText);
    };

    const mappingChangeHandler = (
        formId: string,
        question: string,
        crmField: string,
    ) => {
        setForms(current =>
            current.map(item =>
                item.formId === formId
                    ? {
                        ...item,
                        fieldMapping: {
                            ...item.fieldMapping,
                            [question]: crmField,
                        },
                    }
                    : item,
            ),
        );
    };

    const syncFormsHandler = () =>
        toast.success(
            `${forms.length} form${forms.length === 1 ? "" : "s"} synced from ${metaPages.length} page${metaPages.length === 1 ? "" : "s"}`,
        );

    const exportHandler = () => {
    };

    return (
        <div className="tw-card">
            <div className="tw-card-body">
                <div className="tw-mb-1 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                    <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                        Meta lead forms ({forms.length})
                    </p>

                    <div className="tw-flex tw-flex-wrap tw-gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={!metaPages.length}
                            title={
                                metaPages.length
                                    ? "Fetch new forms and refresh their status from Meta"
                                    : "Connect a Facebook page first"
                            }
                            onClick={syncFormsHandler}
                        >
                            <i className="ri-refresh-line"></i>
                            Sync Forms From Meta
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            disabled={!forms.length}
                            title={
                                forms.length
                                    ? "Download this list as CSV"
                                    : "Nothing to export"
                            }
                            onClick={exportHandler}
                        >
                            <i className="ri-download-2-line"></i>
                            Export
                        </Button>
                    </div>
                </div>

                <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                    Send each form&apos;s leads to a business unit, pipeline stage
                    and branch, and check that its questions land on the right CRM
                    fields. <strong>Backfill</strong> pulls in leads submitted
                    before the form was connected.
                </p>

                <div className="row tw-items-end tw-gap-y-3">
                    <div className="col-12 col-md-6 col-xl-3">
                        <TextIconInput
                            formgroupClassName="search-box tw-mb-0"
                            name="searchString"
                            value={filters.searchString}
                            onChange={filterChangeHandler}
                            placeHolder="Search form name or ID…"
                        >
                            <i className="ri-search-line search-icon"></i>
                        </TextIconInput>
                    </div>

                    <div className="col-12 col-md-6 col-xl-2">
                        <SelectInput
                            name="pageId"
                            labelText="Page"
                            defaultSelect="All pages"
                            value={filters.pageId}
                            onChange={filterChangeHandler}
                            menuItems={pageOptions}
                            valueKey="id"
                            textKey="name"
                            formgroupClassName="tw-mb-0"
                            floatingLabel
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-2">
                        <SelectInput
                            name="status"
                            labelText="Status"
                            defaultSelect="Any status"
                            value={filters.status}
                            onChange={filterChangeHandler}
                            menuItems={statusOptions}
                            valueKey="id"
                            textKey="name"
                            formgroupClassName="tw-mb-0"
                            floatingLabel
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-2">
                        <SelectInput
                            name="mapped"
                            labelText="Mapping"
                            defaultSelect="Any"
                            value={filters.mapped}
                            onChange={filterChangeHandler}
                            menuItems={formMappedOptions}
                            valueKey="id"
                            textKey="name"
                            formgroupClassName="tw-mb-0"
                            floatingLabel
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-3">
                        <SelectInput
                            name="businessUnitId"
                            labelText="Business Unit"
                            defaultSelect="Any business unit"
                            value={filters.businessUnitId}
                            onChange={filterChangeHandler}
                            menuItems={settingsBusinessUnits}
                            valueKey="id"
                            textKey="name"
                            formgroupClassName="tw-mb-0"
                            floatingLabel
                        />
                    </div>
                </div>

                {isFiltered && (
                    <div className="tw-mt-3 tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-xs tw-text-gray-500">
                            {visibleForms.length} of {forms.length}
                        </span>

                        <Button
                            type="button"
                            variant="linkBtn"
                            className="tw-p-0"
                            title="Clear filters"
                            onClick={clearFiltersHandler}
                        >
                            Clear filters
                        </Button>
                    </div>
                )}

                {forms.length === 0 ? (
                    <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                        No forms yet. Sync forms from a connected page.
                    </p>
                ) : !visibleForms.length ? (
                    <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                        No forms match these filters.
                    </p>
                ) : (
                    <div className="tw-mt-3 tw-flex tw-flex-col tw-gap-3">
                        {visibleForms.map(form => {
                            const questions = form.questions.map(
                                question => question.key,
                            );
                            const extraMapped = Object.keys(
                                form.fieldMapping,
                            ).filter(key => !questions.includes(key));
                            const allQuestions = [
                                ...questions,
                                ...extraMapped,
                            ];
                            const mappedCount = Object.values(
                                form.fieldMapping,
                            ).filter(Boolean).length;
                            const destination = effectiveDestination(form);

                            return (
                                <div
                                    key={form.formId}
                                    className="tw-rounded tw-border tw-border-gray-200 tw-p-3"
                                >
                                    <div className="tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-3">
                                        <div className="tw-min-w-0">
                                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                {form.formName || form.formId}
                                            </p>
                                            <p className="tw-mb-0 tw-font-mono tw-text-xs tw-text-gray-500">
                                                Form {form.formId} · Page{" "}
                                                {form.pageId}
                                            </p>
                                        </div>

                                        <StatusLabel
                                            type={
                                                form.formStatus === "ACTIVE"
                                                    ? "active"
                                                    : "pending"
                                            }
                                            labelName={form.formStatus}
                                        />
                                    </div>

                                    <div className="row tw-mt-3 tw-items-end">
                                        <div className="col-12 col-md-6 col-xl-3">
                                            <SelectInput
                                                name={`unit-${form.formId}`}
                                                labelText="Business Unit"
                                                defaultSelect="Use default unit"
                                                value={form.businessUnitId}
                                                onChange={(
                                                    event: ChangeEvent<HTMLSelectElement>,
                                                ) =>
                                                    formChangeHandler(
                                                        form.formId,
                                                        {
                                                            businessUnitId:
                                                                event.target
                                                                    .value,
                                                            stageId: "",
                                                            substageId: "",
                                                        },
                                                        "Business unit updated",
                                                    )
                                                }
                                                menuItems={settingsBusinessUnits}
                                                valueKey="id"
                                                textKey="name"
                                            />
                                        </div>

                                        <div className="col-12 col-md-6 col-xl-3">
                                            <SelectInput
                                                name={`stage-${form.formId}`}
                                                labelText="Stage (Sets Pipeline)"
                                                defaultSelect="Use default stage"
                                                value={form.stageId}
                                                onChange={(
                                                    event: ChangeEvent<HTMLSelectElement>,
                                                ) =>
                                                    formChangeHandler(
                                                        form.formId,
                                                        {
                                                            stageId:
                                                                event.target
                                                                    .value,
                                                            substageId: "",
                                                        },
                                                        "Stage updated",
                                                    )
                                                }
                                                menuItems={stageOptionsFor(form)}
                                                valueKey="id"
                                                textKey="name"
                                            />
                                        </div>

                                        <div className="col-12 col-md-6 col-xl-3">
                                            <SelectInput
                                                name={`substage-${form.formId}`}
                                                labelText="Sub-stage"
                                                defaultSelect={
                                                    form.stageId
                                                        ? "Use default sub-stage"
                                                        : "Choose a stage first"
                                                }
                                                value={form.substageId}
                                                isDisabled={!form.stageId}
                                                onChange={(
                                                    event: ChangeEvent<HTMLSelectElement>,
                                                ) =>
                                                    formChangeHandler(
                                                        form.formId,
                                                        {
                                                            substageId:
                                                                event.target
                                                                    .value,
                                                        },
                                                        "Sub-stage updated",
                                                    )
                                                }
                                                menuItems={substageOptionsFor(
                                                    form,
                                                )}
                                                valueKey="id"
                                                textKey="name"
                                            />
                                        </div>

                                        <div className="col-12 col-md-6 col-xl-3">
                                            <SelectInput
                                                name={`branch-${form.formId}`}
                                                labelText="Branch"
                                                defaultSelect="Use default branch"
                                                value={form.branchId}
                                                onChange={(
                                                    event: ChangeEvent<HTMLSelectElement>,
                                                ) =>
                                                    formChangeHandler(
                                                        form.formId,
                                                        {
                                                            branchId:
                                                                event.target
                                                                    .value,
                                                        },
                                                        "Branch updated",
                                                    )
                                                }
                                                menuItems={settingsBranches}
                                                valueKey="id"
                                                textKey="name"
                                            />
                                        </div>
                                    </div>

                                    <div className="tw-flex tw-flex-wrap tw-justify-end">
                                        <Button
                                            type="button"
                                            variant="hoverInfo"
                                            onClick={() =>
                                                toast.success("Backfill finished: 42 fetched — 31 imported, 9 duplicate, 2 failed")
                                            }
                                        >
                                            <i className="ri-download-2-line tw-me-1"></i>
                                            Backfill
                                        </Button>
                                    </div>

                                    {allQuestions.length ? (
                                        <div className="tw-mt-3 tw-border-t tw-border-gray-200 tw-pt-3">
                                            <p className="tw-mb-2 tw-text-xs tw-font-semibold tw-text-gray-700">
                                                Form question → CRM field
                                                <span className="tw-ms-1 tw-font-normal tw-text-gray-500">
                                                    · {mappedCount} of{" "}
                                                    {allQuestions.length} mapped
                                                </span>
                                            </p>

                                            <div className="tw-grid tw-gap-2 md:tw-grid-cols-2">
                                                {allQuestions.map(question => {
                                                    const label =
                                                        form.questions.find(
                                                            item =>
                                                                item.key ===
                                                                question,
                                                        )?.label || question;

                                                    return (
                                                        <div
                                                            key={question}
                                                            className="tw-flex tw-items-center tw-gap-2"
                                                        >
                                                            <span
                                                                className="tw-flex-1 tw-truncate tw-text-xs tw-text-gray-700"
                                                                title={`${label} (${question})`}
                                                            >
                                                                {label}
                                                            </span>

                                                            <SelectInput
                                                                name={`${form.formId}-${question}`}
                                                                value={
                                                                    form
                                                                        .fieldMapping[
                                                                    question
                                                                    ] || ""
                                                                }
                                                                onChange={(
                                                                    event: ChangeEvent<HTMLSelectElement>,
                                                                ) =>
                                                                    mappingChangeHandler(
                                                                        form.formId,
                                                                        question,
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                menuItems={
                                                                    metaCrmFieldOptions
                                                                }
                                                                valueKey="id"
                                                                textKey="name"
                                                                hideSelectOption
                                                                inputClassName="form-select-sm"
                                                                formgroupClassName="tw-mb-0 tw-w-[170px]"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                                                Unmapped answers are still kept on
                                                the lead and shown under Source
                                                details — mapping only decides which
                                                ones also fill a CRM field.
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="tw-mb-0 tw-mt-3 tw-border-t tw-border-gray-200 tw-pt-3 tw-text-xs tw-text-gray-500">
                                            No questions known for this form yet —
                                            use <strong>Sync Forms From Meta</strong>{" "}
                                            to fetch them.
                                        </p>
                                    )}

                                    <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                                        Leads land in{" "}
                                        <strong className="tw-text-gray-700">
                                            {businessUnitNameFor(
                                                destination.businessUnitId,
                                            ) || "no business unit"}
                                        </strong>{" "}
                                        ·{" "}
                                        <strong className="tw-text-gray-700">
                                            {branchNameFor(destination.branchId) ||
                                                "no branch"}
                                        </strong>
                                        {destination.source === "page" &&
                                            " (inherited from the page)"}
                                        {destination.source === "default" &&
                                            " (the integration defaults)"}
                                        .
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetaLeadFormsTab;
