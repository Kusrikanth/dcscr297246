import { useMemo, useState, type MouseEvent } from "react";
import { useHistory, useParams } from "react-router-dom";

import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../../../Components/Common/UpdatedHorizontalTab";
import {
    Button,
    ConfirmationModal,
    ModalContainerUpdated,
    SelectInput,
} from "../../../../../Components/Common";
import { useModal } from "../../../../../hooks/modalhook";
import {
    settingsBusinessUnits,
} from "../../helper";
import {
    configForUnit,
    leadFieldCatalogue,
    type BusinessUnitConfig,
    type ConfigItem,
    type LeadField,
    type PipelineStage,
    type PipelineSubstage,
    type TrackerStatus,
    type UnitBranch,
} from "../../businessunitconfig";
import AddEditBranchModal from "./AddEditBranchModal";
import AdmissionClassConfig from "./AdmissionClassConfig";
import DatabaseTables from "./DatabaseTables";
import AddEditConfigItemModal from "./AddEditConfigItemModal";
import AddEditLeadFieldModal from "./AddEditLeadFieldModal";
import AddEditPipelineModal from "./AddEditPipelineModal";
import AddEditStageModal from "./AddEditStageModal";
import ConfigList, { type ConfigRow } from "./ConfigList";
import Configuration from "./Configuration";
import {
    configSections,
    type ConfigSection,
} from "./Configuration/helper";
import Overview from "./Overview";
import { toast } from "react-toastify";

type DialogKind =
    | "field"
    | "branch"
    | "leadPipeline"
    | "stage"
    | "substage"
    | "tracker"
    | "channelCategory"
    | "channel"
    | "source"
    | "campaignCategory"
    | "campaign"
    | "academicYear"
    | "admissionType"
    | "admissionClass"
    | "curriculum";

const BussinessUnitSettings = () => {
    const history = useHistory();
    const { businessUnitId } = useParams<{ businessUnitId?: string }>();

    const [unitId, setUnitId] = useState<string>(
        businessUnitId && settingsBusinessUnits.some(u => u.id === businessUnitId)
            ? businessUnitId
            : settingsBusinessUnits[0]?.id || "",
    );
    const [activeId, setActiveId] = useState<string>("overview");
    const [pipelineTab, setPipelineTab] = useState<string>("stages");
    const [activePipelineId, setActivePipelineId] = useState<string>("");
    const [config, setConfig] = useState<BusinessUnitConfig>(() =>
        configForUnit(unitId),
    );
    const [sections, setSections] =
        useState<Array<ConfigSection>>(configSections);

    const { openModal, closeModal, modalState } = useModal();
    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    const unit = useMemo(
        () => settingsBusinessUnits.find(item => item.id === unitId),
        [unitId],
    );

    const isSchool = unit?.compatibilityMode === "legacy_school";

    const unitChangeHandler = (nextUnitId: string) => {
        setUnitId(nextUnitId);
        setConfig(configForUnit(nextUnitId));
        setActiveId("overview");
        history.replace(`/business-units/${nextUnitId}`);
    };

    const menuOptions = useMemo(
        () =>
            [
                { id: "overview", labelName: "Overview" },
                { id: "branches", labelName: "Branches & Payments" },
                { id: "fields", labelName: "Lead Fields" },
                { id: "pipeline", labelName: "Lead Pipeline" },
                { id: "sources", labelName: "Source Configuration" },
                { id: "configuration", labelName: "Configuration" },
                isSchool
                    ? { id: "academic", labelName: "Academic Configuration" }
                    : null,
                { id: "tracker", labelName: "Tracker" },
                { id: "database", labelName: "Database Tables" },
            ]
                .filter(Boolean)
                .map(option => ({
                    ...(option as { id: string; labelName: string }),
                    customPadding: "0px 10px 0px 10px",
                })),
        [isSchool],
    );

    const clickMenuHandler = (event: MouseEvent<HTMLElement>) => {
        const menuId = event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setActiveId(menuId);
        }
    };

    const pipelineMenuOptions = useMemo(
        () => [
            {
                id: "stages",
                labelName: "Stages",
                customPadding: "0px 10px 0px 10px",
                count: config.pipelineStages.length,
            },
            {
                id: "substages",
                labelName: "Sub-stages",
                customPadding: "0px 10px 0px 10px",
                count: config.leadSubstages.length,
            },
        ],
        [config.pipelineStages.length, config.leadSubstages.length],
    );

    const clickPipelineMenuHandler = (event: MouseEvent<HTMLElement>) => {
        const menuId = event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setPipelineTab(menuId);
        }
    };

    const listKeyFor: Record<DialogKind, keyof BusinessUnitConfig> = {
        field: "fields",
        branch: "branches",
        leadPipeline: "leadPipelines",
        stage: "pipelineStages",
        substage: "leadSubstages",
        tracker: "trackerStatuses",
        channelCategory: "channelCategories",
        channel: "channels",
        source: "sources",
        campaignCategory: "campaignCategories",
        campaign: "campaigns",
        academicYear: "academicYears",
        admissionType: "admissionTypes",
        admissionClass: "admissionClasses",
        curriculum: "curriculums",
    };

    const saveHandler = (
        kind: DialogKind,
        record: Record<string, unknown>,
        isNew: boolean,
        successText: string,
    ) => {
        const key = listKeyFor[kind];

        setConfig(current => {
            const list = current[key] as unknown as Array<Record<string, unknown>>;

            return {
                ...current,
                [key]: isNew
                    ? [...list, record]
                    : list.map(item =>
                        item.id === record.id ? { ...item, ...record } : item,
                    ),
            };
        });

        toast.success(successText);
    };

    const deleteHandler = () => {
        const target = deleteModalState.modalData as
            | { kind: DialogKind; row: ConfigRow }
            | undefined;

        if (!target) {
            return;
        }

        const key = listKeyFor[target.kind];

        setConfig(current => ({
            ...current,
            [key]: (current[key] as Array<{ id: string }>).filter(
                item => item.id !== target.row.id,
            ),
        }));

        deleteCloseModal();
        toast.success(`${target.row.title} deleted`);
    };

    const activePipeline = useMemo(
        () =>
            config.leadPipelines.find(
                item => item.id === activePipelineId,
            ) ||
            config.leadPipelines.find(item => item.isDefault) ||
            config.leadPipelines[0],
        [config.leadPipelines, activePipelineId],
    );

    const pipelineStages = useMemo(
        () =>
            config.pipelineStages.filter(
                stage =>
                    !activePipeline ||
                    stage.pipelineId === activePipeline.id,
            ),
        [config.pipelineStages, activePipeline],
    );

    const pipelineSubstages = useMemo(
        () =>
            config.leadSubstages.filter(substage =>
                pipelineStages.some(
                    stage => stage.id === substage.stageId,
                ),
            ),
        [config.leadSubstages, pipelineStages],
    );

    const removePipelineHandler = () => {
        if (!activePipeline) {
            return;
        }

        setConfig(current => ({
            ...current,
            leadPipelines: current.leadPipelines.filter(
                item => item.id !== activePipeline.id,
            ),
        }));

        setActivePipelineId("");
        toast.success(`Pipeline "${activePipeline.displayName}" deleted`);
    };

    const moveStageHandler = (row: ConfigRow, direction: "up" | "down") => {
        setConfig(current => {
            const scoped = current.pipelineStages.filter(
                stage =>
                    !activePipeline || stage.pipelineId === activePipeline.id,
            );
            const index = scoped.findIndex(item => item.id === row.id);
            const target = direction === "up" ? index - 1 : index + 1;

            if (index < 0 || target < 0 || target >= scoped.length) {
                return current;
            }

            [scoped[index], scoped[target]] = [scoped[target], scoped[index]];

            const positions = new Map(
                scoped.map((stage, position) => [stage.id, position + 1]),
            );

            return {
                ...current,
                pipelineStages: current.pipelineStages.map(stage =>
                    positions.has(stage.id)
                        ? { ...stage, position: positions.get(stage.id) as number }
                        : stage,
                ),
            };
        });
    };

    const moveSubstageHandler = (row: ConfigRow, direction: "up" | "down") => {
        setConfig(current => {
            const moving = current.leadSubstages.find(
                item => item.id === row.id,
            );

            if (!moving) {
                return current;
            }

            const siblings = current.leadSubstages.filter(
                item => item.stageId === moving.stageId,
            );
            const index = siblings.findIndex(item => item.id === row.id);
            const target = direction === "up" ? index - 1 : index + 1;

            if (target < 0 || target >= siblings.length) {
                return current;
            }

            [siblings[index], siblings[target]] = [
                siblings[target],
                siblings[index],
            ];

            const positions = new Map(
                siblings.map((item, position) => [item.id, position + 1]),
            );

            return {
                ...current,
                leadSubstages: current.leadSubstages.map(item =>
                    positions.has(item.id)
                        ? { ...item, position: positions.get(item.id) as number }
                        : item,
                ),
            };
        });
    };

    const duplicateRuleSaveHandler = (fields: Array<string>) => {
        setConfig(current => ({ ...current, duplicateRule: fields }));
        toast.success("Duplicate lead rule saved");
    };

    const moveTrackerHandler = (row: ConfigRow, direction: "up" | "down") => {
        setConfig(current => {
            const list = [...current.trackerStatuses];
            const index = list.findIndex(item => item.id === row.id);
            const target = direction === "up" ? index - 1 : index + 1;

            if (index < 0 || target < 0 || target >= list.length) {
                return current;
            }

            [list[index], list[target]] = [list[target], list[index]];

            return {
                ...current,
                trackerStatuses: list.map((status, position) => ({
                    ...status,
                    position: position + 1,
                })),
            };
        });
    };

    const defaultsChangeHandler = (
        key: keyof BusinessUnitConfig["manualLeadDefaults"],
        value: string,
    ) => {
        setConfig(current => ({
            ...current,
            manualLeadDefaults: {
                ...current.manualLeadDefaults,
                [key]: value,
                ...(key === "stageId" ? { substageId: "" } : null),
                ...(key === "channelId" ? { sourceId: "" } : null),
            },
        }));
    };

    const admissionClassConfigChangeHandler = (
        rows: BusinessUnitConfig["admissionClassConfigs"],
    ) => setConfig(current => ({ ...current, admissionClassConfigs: rows }));

    const openDialog = (kind: DialogKind, record?: unknown) =>
        openModal({ kind, record });

    const confirmDelete = (kind: DialogKind, row: ConfigRow) =>
        deleteOpenModal({ kind, row });

    const fieldRows: Array<ConfigRow> = config.fields.map(field => ({
        id: field.id,
        title: field.displayName,
        subtitle: `${field.fieldType.replace(/_/g, " ")} · ${field.fieldKey}`,
        badges: [
            field.isSystem ? "System field" : "",
            field.isRequired ? "Lead form mandatory" : "",
            field.showInList ? "List column" : "",
            field.isFilterable ? "Filter" : "",
            field.isSearchable ? "Search" : "",
            field.useInReports ? "Reports" : "",
            field.isImportable
                ? field.isImportRequired
                    ? "Import required"
                    : "Import column"
                : "",
        ].filter(Boolean),
        canDelete: !field.isSystem,
    }));

    const branchRows: Array<ConfigRow> = config.branches.map(branch => ({
        id: branch.id,
        title: branch.name,
        subtitle: `${branch.shortName || "No short name"} · ${branch.hasJodoApiKey || branch.hasJodoAuthHeader
            ? "Payment credentials set"
            : "No payment credentials"
            }`,
        badges: [
            branch.callerdeskDidNumber
                ? `DID ${branch.callerdeskDidNumber}`
                : "No calling DID",
            branch.smartfloDidNumber
                ? `Smartflo ${branch.smartfloDidNumber}`
                : "No Smartflo DID",
            branch.jodoCollectorCode || "No collector code",
            branch.isActive ? "Active" : "Inactive",
        ],
    }));

    const stageRows: Array<ConfigRow> = pipelineStages.map(
        (stage, index) => ({
            id: stage.id,
            title: stage.displayName,
            subtitle: stage.requiresFollowup
                ? "Follow-up required"
                : "No required follow-up",
            badges: [
                `Position ${index + 1}`,
                stage.isActive ? "Active" : "Inactive",
                stage.isAdmissionStage ? "Admission stage" : "",
            ].filter(Boolean),
            color: stage.color,
            canMoveUp: index > 0,
            canMoveDown: index < pipelineStages.length - 1,
        }),
    );

    const substageRows: Array<ConfigRow> = pipelineSubstages.map(substage => {
        const siblings = pipelineSubstages.filter(
            item => item.stageId === substage.stageId,
        );
        const index = siblings.findIndex(item => item.id === substage.id);

        return {
            id: substage.id,
            title: substage.displayName,
            subtitle:
                pipelineStages.find(stage => stage.id === substage.stageId)
                    ?.displayName || "Unknown stage",
            badges: [
                `Position ${index + 1}`,
                substage.isActive ? "Active" : "Inactive",
            ],
            canMoveUp: index > 0,
            canMoveDown: index < siblings.length - 1,
        };
    });

    const trackerRows: Array<ConfigRow> = config.trackerStatuses.map(
        (status, index) => ({
            id: status.id,
            title: status.displayName,
            subtitle: status.stageType.replace(/_/g, " "),
            badges: [
                index === 0 ? "Default starting status" : `Order ${index + 1}`,
                status.isActive ? "Active" : "Inactive",
            ],
            color: status.color,
            canMoveUp: index > 0,
            canMoveDown: index < config.trackerStatuses.length - 1,
        }),
    );

    const itemRows = (items: Array<ConfigItem>, subtitle: string) =>
        items.map(item => ({
            id: item.id,
            title: item.displayName,
            subtitle,
            badges: [item.isActive ? "Active" : "Inactive"],
        }));

    const sourceRows: Array<ConfigRow> = config.sources.map(source => ({
        id: source.id,
        title: source.displayName,
        subtitle: `${config.channels.find(channel => channel.id === source.channelId)
            ?.displayName || "No channel"
            }${source.code ? ` · ${source.code}` : ""}`,
        badges: [source.isActive ? "Active" : "Inactive"],
    }));

    const categorisedRows = (
        items: Array<ConfigItem>,
        categories: Array<ConfigItem>,
        fallback: string,
    ): Array<ConfigRow> =>
        items.map(item => ({
            id: item.id,
            title: item.displayName,
            subtitle: `${categories.find(category => category.id === item.categoryId)
                ?.displayName || fallback
                }${item.code ? ` · ${item.code}` : ""}`,
            badges: [item.isActive ? "Active" : "Inactive"],
        }));

    const dialogKind: DialogKind | undefined = modalState.modalData?.kind;
    const dialogRecord = modalState.modalData?.record;

    const simpleDialogs: Partial<
        Record<DialogKind, { label: string; parentLabel?: string }>
    > = {
        channelCategory: { label: "Channel Category" },
        channel: { label: "Channel" },
        source: { label: "Source", parentLabel: "Channel" },
        campaignCategory: { label: "Campaign Category" },
        campaign: { label: "Campaign" },
        academicYear: { label: "Academic Year" },
        admissionType: { label: "Admission Type" },
        admissionClass: { label: "Admission Class" },
        curriculum: { label: "Curriculum" },
    };

    const dialogTitle = () => {
        if (!dialogKind) {
            return "";
        }

        const isEdit = Boolean(dialogRecord);

        if (dialogKind === "field") {
            return isEdit ? "Edit Lead Field" : "Add Lead Field";
        }

        if (dialogKind === "branch") {
            return isEdit ? "Edit Branch" : "Add Branch";
        }

        if (dialogKind === "leadPipeline") {
            return isEdit ? "Edit Lead Pipeline" : "Add Lead Pipeline";
        }

        if (dialogKind === "stage") {
            return isEdit ? "Edit Lead Stage" : "Add Lead Stage";
        }

        if (dialogKind === "substage") {
            return isEdit ? "Edit Sub-stage" : "Add Sub-stage";
        }

        if (dialogKind === "tracker") {
            return isEdit ? "Edit Tracker Status" : "Add Tracker Status";
        }

        const label = simpleDialogs[dialogKind]?.label || "Value";

        return isEdit ? `Edit ${label}` : `Add ${label}`;
    };

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb pageTitle="Business Unit Settings" />

                <div className="tw-card tw-mb-4">
                    <div className="tw-card-body">
                        <div className="row tw-items-end tw-gap-y-3">
                            <div className="col-12 col-md-6 col-xl-4">
                                <SelectInput
                                    name="unitId"
                                    labelText="Business Unit"
                                    hideSelectOption
                                    value={unitId}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLSelectElement>,
                                    ) => unitChangeHandler(event.target.value)}
                                    menuItems={settingsBusinessUnits}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                />
                            </div>

                            <div className="col-12 col-md-6 col-xl-8">
                                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2">
                                    <span className="tw-text-sm tw-text-gray-500">
                                        {unit?.industryType}
                                    </span>

                                    <Button
                                        type="button"
                                        variant="hoverInfo"
                                        onClick={() =>
                                            history.push("/business-units")
                                        }
                                    >
                                        <i className="ri-arrow-left-line tw-me-1"></i>
                                        Back to Business Units
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <UpdatedHorizontalTab
                    MenuOptions={menuOptions}
                    clickMenuHandler={clickMenuHandler}
                    activeTabId={activeId}
                    horizontalClass=""
                />

                <div className="tw-mt-3">
                    {activeId === "configuration" && (
                        <Configuration
                            pipelines={config.leadPipelines}
                            sections={sections}
                            onSectionsChange={setSections}
                        />
                    )}

                    {activeId === "overview" && (
                        <Overview
                            config={config}
                            unit={unit}
                            onSaveDuplicateRule={duplicateRuleSaveHandler}
                        />
                    )}

                    {activeId === "branches" && (
                        <ConfigList
                            title="Branches & online application payments"
                            description="Configure branch-wise calling routes and Jodo payment credentials. Amounts and paid-application stages are set on the payment or enquiry form."
                            actionLabel="Add Branch"
                            rows={branchRows}
                            emptyIcon="ri-bank-card-line"
                            onAdd={() => openDialog("branch")}
                            onEdit={row =>
                                openDialog(
                                    "branch",
                                    config.branches.find(item => item.id === row.id),
                                )
                            }
                            onDelete={row => confirmDelete("branch", row)}
                        />
                    )}

                    {activeId === "fields" && (
                        <ConfigList
                            title="Lead fields"
                            description="Configure forms, list columns, filters, search and import templates for this business unit."
                            actionLabel="Add Field"
                            rows={fieldRows}
                            onAdd={() => openDialog("field")}
                            onEdit={row =>
                                openDialog(
                                    "field",
                                    config.fields.find(item => item.id === row.id),
                                )
                            }
                            onDelete={row => confirmDelete("field", row)}
                        />
                    )}

                    {activeId === "pipeline" && (
                        <>
                            <div className="tw-card tw-mb-4">
                                <div className="tw-card-body">
                                    <div className="row tw-items-end">
                                        <div className="col-12 col-md-6 col-xl-4">
                                            <SelectInput
                                                name="activePipelineId"
                                                labelText="Pipeline"
                                                value={activePipeline?.id || ""}
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLSelectElement>,
                                                ) =>
                                                    setActivePipelineId(
                                                        event.target.value,
                                                    )
                                                }
                                                menuItems={config.leadPipelines.map(
                                                    item => ({
                                                        id: item.id,
                                                        name: `${item.displayName}${item.isDefault ? " (default)" : ""}${item.isActive ? "" : " · inactive"}`,
                                                    }),
                                                )}
                                                valueKey="id"
                                                textKey="name"
                                                hideSelectOption
                                                formgroupClassName="tw-mb-0"
                                            />
                                        </div>

                                        <div className="col-12 col-md-6 col-xl-8">
                                            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2">
                                                <Button
                                                    type="button"
                                                    variant="hoverInfo"
                                                    disabled={!activePipeline}
                                                    onClick={() =>
                                                        openDialog(
                                                            "leadPipeline",
                                                            activePipeline,
                                                        )
                                                    }
                                                >
                                                    Rename
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="wrong"
                                                    disabled={
                                                        !activePipeline ||
                                                        activePipeline.isDefault
                                                    }
                                                    title={
                                                        activePipeline?.isDefault
                                                            ? "The default pipeline cannot be deleted"
                                                            : undefined
                                                    }
                                                    onClick={
                                                        removePipelineHandler
                                                    }
                                                >
                                                    Delete
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    onClick={() =>
                                                        openDialog("leadPipeline")
                                                    }
                                                >
                                                    <i className="ri-add-line tw-me-1"></i>
                                                    Add Pipeline
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {activePipeline?.description && (
                                        <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                                            {activePipeline.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="tw-card tw-mb-4">
                                <div className="tw-card-body">
                                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                        Manual Add Lead defaults
                                    </p>
                                    <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                                        Preselected on new manual leads, and editable
                                        before saving.
                                    </p>

                                    <div className="row">
                                        <div className="col-12 col-md-6 col-xl-4">
                                            <SelectInput
                                                name="defaultStageId"
                                                labelText="Stage"
                                                defaultSelect="No default"
                                                value={
                                                    config.manualLeadDefaults.stageId
                                                }
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLSelectElement>,
                                                ) =>
                                                    defaultsChangeHandler(
                                                        "stageId",
                                                        event.target.value,
                                                    )
                                                }
                                                menuItems={config.pipelineStages.filter(
                                                    stage => stage.isActive,
                                                )}
                                                valueKey="id"
                                                textKey="displayName"
                                            />
                                        </div>

                                        <div className="col-12 col-md-6 col-xl-4">
                                            <SelectInput
                                                name="defaultSubstageId"
                                                labelText="Sub-stage"
                                                defaultSelect="No default"
                                                value={
                                                    config.manualLeadDefaults
                                                        .substageId
                                                }
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLSelectElement>,
                                                ) =>
                                                    defaultsChangeHandler(
                                                        "substageId",
                                                        event.target.value,
                                                    )
                                                }
                                                menuItems={config.leadSubstages.filter(
                                                    substage =>
                                                        substage.isActive &&
                                                        (!config.manualLeadDefaults
                                                            .stageId ||
                                                            substage.stageId ===
                                                            config
                                                                .manualLeadDefaults
                                                                .stageId),
                                                )}
                                                valueKey="id"
                                                textKey="displayName"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="tw-mb-3">
                                <UpdatedHorizontalTab
                                    MenuOptions={pipelineMenuOptions}
                                    clickMenuHandler={clickPipelineMenuHandler}
                                    activeTabId={pipelineTab}
                                    showBadge
                                    horizontalClass=""
                                />
                            </div>

                            {pipelineTab === "stages" ? (
                                <ConfigList
                                    title="Lead stages"
                                    description={`Stages in ${activePipeline?.displayName || "this pipeline"}, in the order leads move through them.`}
                                    actionLabel="Add Stage"
                                    rows={stageRows}
                                    onMove={moveStageHandler}
                                    onAdd={() => openDialog("stage")}
                                    onEdit={row =>
                                        openDialog(
                                            "stage",
                                            config.pipelineStages.find(
                                                item => item.id === row.id,
                                            ),
                                        )
                                    }
                                    onDelete={row => confirmDelete("stage", row)}
                                />
                            ) : (
                                <ConfigList
                                    title="Lead sub-stages"
                                    description={`Sub-stages under the stages of ${activePipeline?.displayName || "this pipeline"}. Each belongs to one parent stage.`}
                                    actionLabel="Add Sub-stage"
                                    rows={substageRows}
                                    onMove={moveSubstageHandler}
                                    onAdd={() => openDialog("substage")}
                                    onEdit={row =>
                                        openDialog(
                                            "substage",
                                            config.leadSubstages.find(
                                                item => item.id === row.id,
                                            ),
                                        )
                                    }
                                    onDelete={row => confirmDelete("substage", row)}
                                />
                            )}
                        </>
                    )}

                    {activeId === "sources" && (
                        <div className="tw-flex tw-flex-col tw-gap-4">
                            <div className="tw-card tw-mb-0">
                                <div className="tw-card-body">
                                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                        Manual Add Lead defaults
                                    </p>
                                    <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                                        Preselected in Add Lead, and still
                                        changeable before saving.
                                    </p>

                                    <div className="row">
                                        <div className="col-12 col-md-6 col-xl-4">
                                            <SelectInput
                                                name="defaultChannelId"
                                                labelText="Channel"
                                                defaultSelect="No default"
                                                value={
                                                    config.manualLeadDefaults
                                                        .channelId
                                                }
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLSelectElement>,
                                                ) =>
                                                    defaultsChangeHandler(
                                                        "channelId",
                                                        event.target.value,
                                                    )
                                                }
                                                menuItems={config.channels.filter(
                                                    channel => channel.isActive,
                                                )}
                                                valueKey="id"
                                                textKey="displayName"
                                            />
                                        </div>

                                        <div className="col-12 col-md-6 col-xl-4">
                                            <SelectInput
                                                name="defaultSourceId"
                                                labelText="Source"
                                                defaultSelect="No default"
                                                value={
                                                    config.manualLeadDefaults
                                                        .sourceId
                                                }
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLSelectElement>,
                                                ) =>
                                                    defaultsChangeHandler(
                                                        "sourceId",
                                                        event.target.value,
                                                    )
                                                }
                                                menuItems={config.sources.filter(
                                                    source =>
                                                        source.isActive &&
                                                        (!config
                                                            .manualLeadDefaults
                                                            .channelId ||
                                                            source.channelId ===
                                                            config
                                                                .manualLeadDefaults
                                                                .channelId),
                                                )}
                                                valueKey="id"
                                                textKey="displayName"
                                            />
                                        </div>

                                        <div className="col-12 col-md-6 col-xl-4">
                                            <SelectInput
                                                name="defaultCampaignId"
                                                labelText="Campaign"
                                                defaultSelect="No default"
                                                value={
                                                    config.manualLeadDefaults
                                                        .campaignId
                                                }
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLSelectElement>,
                                                ) =>
                                                    defaultsChangeHandler(
                                                        "campaignId",
                                                        event.target.value,
                                                    )
                                                }
                                                menuItems={config.campaigns.filter(
                                                    campaign =>
                                                        campaign.isActive,
                                                )}
                                                valueKey="id"
                                                textKey="displayName"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <ConfigList
                                title="Channel categories"
                                description="The broad grouping a channel belongs to."
                                actionLabel="Add Channel Category"
                                rows={itemRows(
                                    config.channelCategories,
                                    "Channel category",
                                )}
                                onAdd={() => openDialog("channelCategory")}
                                onEdit={row =>
                                    openDialog(
                                        "channelCategory",
                                        config.channelCategories.find(
                                            item => item.id === row.id,
                                        ),
                                    )
                                }
                                onDelete={row =>
                                    confirmDelete("channelCategory", row)
                                }
                            />

                            <ConfigList
                                title="Channels"
                                description="The broad routes an enquiry arrives through."
                                actionLabel="Add Channel"
                                rows={categorisedRows(
                                    config.channels,
                                    config.channelCategories,
                                    "No category",
                                )}
                                onAdd={() => openDialog("channel")}
                                onEdit={row => {
                                    const channel = config.channels.find(
                                        item => item.id === row.id,
                                    );

                                    openDialog(
                                        "channel",
                                        channel
                                            ? {
                                                ...channel,
                                                parentId: channel.categoryId,
                                            }
                                            : undefined,
                                    );
                                }}
                                onDelete={row => confirmDelete("channel", row)}
                            />

                            <ConfigList
                                title="Sources"
                                description="Where a lead came from, mapped to the channel it belongs to."
                                actionLabel="Add Source"
                                rows={sourceRows}
                                onAdd={() => openDialog("source")}
                                onEdit={row => {
                                    const source = config.sources.find(
                                        item => item.id === row.id,
                                    );

                                    openDialog(
                                        "source",
                                        source
                                            ? { ...source, parentId: source.channelId }
                                            : undefined,
                                    );
                                }}
                                onDelete={row => confirmDelete("source", row)}
                            />

                            <ConfigList
                                title="Campaign categories"
                                description="The broad grouping a campaign belongs to."
                                actionLabel="Add Campaign Category"
                                rows={itemRows(
                                    config.campaignCategories,
                                    "Campaign category",
                                )}
                                onAdd={() => openDialog("campaignCategory")}
                                onEdit={row =>
                                    openDialog(
                                        "campaignCategory",
                                        config.campaignCategories.find(
                                            item => item.id === row.id,
                                        ),
                                    )
                                }
                                onDelete={row =>
                                    confirmDelete("campaignCategory", row)
                                }
                            />

                            <ConfigList
                                title="Campaign names"
                                description="The marketing pushes a lead can be attributed to."
                                actionLabel="Add Campaign"
                                rows={categorisedRows(
                                    config.campaigns,
                                    config.campaignCategories,
                                    "No category",
                                )}
                                onAdd={() => openDialog("campaign")}
                                onEdit={row => {
                                    const campaign = config.campaigns.find(
                                        item => item.id === row.id,
                                    );

                                    openDialog(
                                        "campaign",
                                        campaign
                                            ? {
                                                ...campaign,
                                                parentId: campaign.categoryId,
                                            }
                                            : undefined,
                                    );
                                }}
                                onDelete={row => confirmDelete("campaign", row)}
                            />
                        </div>
                    )}

                    {activeId === "academic" && isSchool && (
                        <div className="tw-flex tw-flex-col tw-gap-4">
                            <ConfigList
                                title="Academic years"
                                description="The sessions leads and applications are raised against."
                                actionLabel="Add Academic Year"
                                rows={config.academicYears.map(year => ({
                                    id: year.academicYear,
                                    title: year.displayName,
                                    subtitle: year.academicYear,
                                    badges: [year.isActive ? "Active" : "Closed"],
                                }))}
                                onAdd={() => openDialog("academicYear")}
                                onEdit={row =>
                                    openDialog("academicYear", {
                                        id: row.id,
                                        displayName: row.title,
                                        isActive: row.badges.includes("Active"),
                                    })
                                }
                                onDelete={row => confirmDelete("academicYear", row)}
                            />

                            <ConfigList
                                title="Admission types"
                                description="How an admission is classified when it is granted."
                                actionLabel="Add Admission Type"
                                rows={itemRows(
                                    config.admissionTypes,
                                    "Admission type",
                                )}
                                onAdd={() => openDialog("admissionType")}
                                onEdit={row =>
                                    openDialog(
                                        "admissionType",
                                        config.admissionTypes.find(
                                            item => item.id === row.id,
                                        ),
                                    )
                                }
                                onDelete={row => confirmDelete("admissionType", row)}
                            />

                            <ConfigList
                                title="Admission classes"
                                description="The classes a lead can apply for."
                                actionLabel="Add Admission Class"
                                rows={itemRows(
                                    config.admissionClasses,
                                    "Admission class",
                                )}
                                onAdd={() => openDialog("admissionClass")}
                                onEdit={row =>
                                    openDialog(
                                        "admissionClass",
                                        config.admissionClasses.find(
                                            item => item.id === row.id,
                                        ),
                                    )
                                }
                                onDelete={row =>
                                    confirmDelete("admissionClass", row)
                                }
                            />

                            <ConfigList
                                title="Curriculums"
                                description="The boards this business unit teaches."
                                actionLabel="Add Curriculum"
                                rows={itemRows(config.curriculums, "Curriculum")}
                                onAdd={() => openDialog("curriculum")}
                                onEdit={row =>
                                    openDialog(
                                        "curriculum",
                                        config.curriculums.find(
                                            item => item.id === row.id,
                                        ),
                                    )
                                }
                                onDelete={row => confirmDelete("curriculum", row)}
                            />

                            <AdmissionClassConfig
                                config={config}
                                onChange={admissionClassConfigChangeHandler}
                            />
                        </div>
                    )}

                    {activeId === "tracker" && (
                        <ConfigList
                            title="Tracker statuses"
                            description="The progress statuses for MOM action items. New action items always start in the first status."
                            actionLabel="Add Status"
                            rows={trackerRows}
                            onAdd={() => openDialog("tracker")}
                            onEdit={row =>
                                openDialog(
                                    "tracker",
                                    config.trackerStatuses.find(
                                        item => item.id === row.id,
                                    ),
                                )
                            }
                            onDelete={row => confirmDelete("tracker", row)}
                            onMove={moveTrackerHandler}
                        />
                    )}

                    {activeId === "database" && (
                        <DatabaseTables
                            tables={config.databaseTables}
                            unit={unit}
                        />
                    )}
                </div>

                <ModalContainerUpdated
                    id="crm-settings-unit-config"
                    isOpen={modalState.showModal}
                    toggle={closeModal}
                    modalTitle={dialogTitle()}
                    modalSize={
                        dialogKind === "field" || dialogKind === "branch"
                            ? "lg"
                            : "md"
                    }
                >
                    {dialogKind === "field" && (
                        <AddEditLeadFieldModal
                            data={dialogRecord as LeadField | undefined}
                            catalogue={leadFieldCatalogue.filter(
                                entry =>
                                    !config.fields.some(
                                        field => field.fieldKey === entry.key,
                                    ),
                            )}
                            sections={sections}
                            toggle={closeModal}
                            onSave={(field, isNew) =>
                                saveHandler(
                                    "field",
                                    field as unknown as Record<string, unknown>,
                                    isNew,
                                    isNew ? "Lead field added" : "Lead field saved",
                                )
                            }
                        />
                    )}

                    {dialogKind === "branch" && (
                        <AddEditBranchModal
                            data={dialogRecord as UnitBranch | undefined}
                            pipelines={config.leadPipelines}
                            toggle={closeModal}
                            onSave={(branch, isNew) =>
                                saveHandler(
                                    "branch",
                                    branch as unknown as Record<string, unknown>,
                                    isNew,
                                    isNew ? "Branch added" : "Branch saved",
                                )
                            }
                        />
                    )}

                    {dialogKind === "leadPipeline" && (
                        <AddEditPipelineModal
                            data={
                                dialogRecord as
                                | BusinessUnitConfig["leadPipelines"][number]
                                | undefined
                            }
                            toggle={closeModal}
                            onSave={(pipeline, isNew) => {
                                saveHandler(
                                    "leadPipeline",
                                    pipeline as unknown as Record<
                                        string,
                                        unknown
                                    >,
                                    isNew,
                                    isNew
                                        ? "Lead pipeline added"
                                        : "Lead pipeline saved",
                                );

                                if (isNew) {
                                    setActivePipelineId(pipeline.id);
                                }
                            }}
                        />
                    )}

                    {dialogKind === "stage" && (
                        <AddEditStageModal
                            data={dialogRecord as PipelineStage | undefined}
                            itemLabel="Stage"
                            showFollowup
                            toggle={closeModal}
                            onSave={(stage, isNew) =>
                                saveHandler(
                                    "stage",
                                    {
                                        ...stage,
                                        pipelineId:
                                            (stage as PipelineStage)
                                                .pipelineId ||
                                            activePipeline?.id ||
                                            "",
                                        position:
                                            stage.position ||
                                            pipelineStages.length + 1,
                                    } as unknown as Record<string, unknown>,
                                    isNew,
                                    isNew ? "Lead stage added" : "Lead stage saved",
                                )
                            }
                        />
                    )}

                    {dialogKind === "tracker" && (
                        <AddEditStageModal
                            data={dialogRecord as TrackerStatus | undefined}
                            itemLabel="Status"
                            showStageType
                            toggle={closeModal}
                            onSave={(status, isNew) =>
                                saveHandler(
                                    "tracker",
                                    {
                                        ...status,
                                        position:
                                            status.position ||
                                            config.trackerStatuses.length + 1,
                                    } as unknown as Record<string, unknown>,
                                    isNew,
                                    isNew
                                        ? "Tracker status added"
                                        : "Tracker status saved",
                                )
                            }
                        />
                    )}

                    {dialogKind === "substage" && (
                        <AddEditConfigItemModal
                            data={
                                dialogRecord
                                    ? {
                                        ...(dialogRecord as PipelineSubstage),
                                        parentId: (dialogRecord as PipelineSubstage)
                                            .stageId,
                                    }
                                    : undefined
                            }
                            itemLabel="Sub-stage"
                            parentLabel="Parent Stage"
                            parentOptions={pipelineStages.map(stage => ({
                                id: stage.id,
                                name: stage.displayName,
                            }))}
                            toggle={closeModal}
                            onSave={(item, isNew) =>
                                saveHandler(
                                    "substage",
                                    {
                                        id: item.id,
                                        displayName: item.displayName,
                                        isActive: item.isActive,
                                        stageId: item.parentId,
                                        position:
                                            (dialogRecord as PipelineSubstage)
                                                ?.position ||
                                            config.leadSubstages.length + 1,
                                    },
                                    isNew,
                                    isNew ? "Sub-stage added" : "Sub-stage saved",
                                )
                            }
                        />
                    )}

                    {dialogKind === "channel" && (
                        <AddEditConfigItemModal
                            data={dialogRecord as ConfigItem & { parentId?: string }}
                            itemLabel="Channel"
                            parentLabel="Channel Category"
                            parentOptions={config.channelCategories.map(
                                category => ({
                                    id: category.id,
                                    name: category.displayName,
                                }),
                            )}
                            codeLabel="Channel Code"
                            codePlaceholder="DIGITAL"
                            toggle={closeModal}
                            onSave={(item, isNew) =>
                                saveHandler(
                                    "channel",
                                    {
                                        id: item.id,
                                        displayName: item.displayName,
                                        code: item.code,
                                        isActive: item.isActive,
                                        categoryId: item.parentId,
                                    },
                                    isNew,
                                    isNew ? "Channel added" : "Channel saved",
                                )
                            }
                        />
                    )}

                    {dialogKind === "campaign" && (
                        <AddEditConfigItemModal
                            data={dialogRecord as ConfigItem & { parentId?: string }}
                            itemLabel="Campaign"
                            parentLabel="Campaign Category"
                            parentOptions={config.campaignCategories.map(
                                category => ({
                                    id: category.id,
                                    name: category.displayName,
                                }),
                            )}
                            codeLabel="Campaign Code"
                            codePlaceholder="ADM2627"
                            toggle={closeModal}
                            onSave={(item, isNew) =>
                                saveHandler(
                                    "campaign",
                                    {
                                        id: item.id,
                                        displayName: item.displayName,
                                        code: item.code,
                                        isActive: item.isActive,
                                        categoryId: item.parentId,
                                    },
                                    isNew,
                                    isNew ? "Campaign added" : "Campaign saved",
                                )
                            }
                        />
                    )}

                    {dialogKind === "source" && (
                        <AddEditConfigItemModal
                            data={dialogRecord as ConfigItem & { parentId?: string }}
                            itemLabel="Source"
                            parentLabel="Channel"
                            codeLabel="Source Code"
                            codePlaceholder="WEBSITE"
                            parentOptions={config.channels.map(channel => ({
                                id: channel.id,
                                name: channel.displayName,
                            }))}
                            toggle={closeModal}
                            onSave={(item, isNew) =>
                                saveHandler(
                                    "source",
                                    {
                                        id: item.id,
                                        displayName: item.displayName,
                                        code: item.code,
                                        isActive: item.isActive,
                                        channelId: item.parentId,
                                    },
                                    isNew,
                                    isNew ? "Source added" : "Source saved",
                                )
                            }
                        />
                    )}

                    {dialogKind === "academicYear" && (
                        <AddEditConfigItemModal
                            data={dialogRecord as ConfigItem | undefined}
                            itemLabel="Academic Year"
                            codeLabel="Academic Year"
                            codePlaceholder="e.g. 2026-27"
                            toggle={closeModal}
                            onSave={(item, isNew) =>
                                saveHandler(
                                    "academicYear",
                                    {
                                        academicYear:
                                            item.code || item.displayName,
                                        displayName: item.displayName,
                                        isActive: item.isActive,
                                        id: item.code || item.displayName,
                                    },
                                    isNew,
                                    isNew
                                        ? "Academic year added"
                                        : "Academic year saved",
                                )
                            }
                        />
                    )}

                    {dialogKind &&
                        [
                            "channelCategory",
                            "campaignCategory",
                            "admissionType",
                            "admissionClass",
                            "curriculum",
                        ].includes(dialogKind) && (
                            <AddEditConfigItemModal
                                data={dialogRecord as ConfigItem | undefined}
                                itemLabel={
                                    simpleDialogs[dialogKind]?.label || "Value"
                                }
                                codeLabel={
                                    dialogKind === "admissionClass"
                                        ? undefined
                                        : `${simpleDialogs[dialogKind]?.label} Code`
                                }
                                showPosition={dialogKind === "curriculum"}
                                toggle={closeModal}
                                onSave={(item, isNew) =>
                                    saveHandler(
                                        dialogKind,
                                        item as unknown as Record<string, unknown>,
                                        isNew,
                                        isNew
                                            ? `${simpleDialogs[dialogKind]?.label} added`
                                            : `${simpleDialogs[dialogKind]?.label} saved`,
                                    )
                                }
                            />
                        )}
                </ModalContainerUpdated>

                <ConfirmationModal
                    id="crm-settings-unit-config-delete"
                    isOpen={deleteModalState.showModal}
                    iconType="reject"
                    confirmTitle="Delete this configuration?"
                    confirmMessage={`${deleteModalState.modalData?.row?.title} will be removed from ${unit?.name}.`}
                    noteMessage="It is only deleted when no lead or tracker record still uses it."
                    confirmBtnText="Delete"
                    confirmHndlr={deleteHandler}
                    cancelHndlr={deleteCloseModal}
                />
            </div>
        </div>
    );
};

export default BussinessUnitSettings;
