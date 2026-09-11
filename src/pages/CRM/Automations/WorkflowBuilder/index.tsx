import { useMemo, useState, type ChangeEvent } from "react";

import {
    Button,
    DateInput,
    InputCheckbox,
    TextInput,
    TimeInput,
} from "../../../../Components/Common";
import { whatsAppTemplates } from "../../WhatsApp/helper";
import ConditionRow, { type ConditionValue } from "./ConditionRow";
import ActionRow from "./ActionRow";
import {
    blankAction,
    blankCondition,
    currentSchedule,
    dateConditionFields,
    type AutomationAction,
    type AutomationCondition,
    type AutomationWorkflow,
} from "../helper";
import { toast } from "react-toastify";

interface WorkflowFormState {
    name: string;
    category: string;
    startDate: string;
    startTime: string;
    conditions: Array<AutomationCondition>;
    logic: string;
    actions: Array<AutomationAction>;
    noRecheckAfterDelay: boolean;
}

interface WorkflowBuilderProps {
    workflow?: AutomationWorkflow;
    onCancel: () => void;
    onSave: (form: WorkflowFormState, isEdit: boolean) => void;
}

const buildInitialForm = (
    workflow?: AutomationWorkflow,
): WorkflowFormState => {
    if (!workflow) {
        const schedule = currentSchedule();

        return {
            name: "",
            category: "attribute",
            startDate: schedule.startDate,
            startTime: schedule.startTime,
            conditions: [blankCondition()],
            logic: "and",
            actions: [blankAction()],
            noRecheckAfterDelay: false,
        };
    }

    const scheduled = workflow.startAt ? new Date(workflow.startAt) : null;
    const pad = (value: number) => String(value).padStart(2, "0");

    return {
        name: workflow.name,
        category: workflow.category,
        startDate: scheduled
            ? `${scheduled.getFullYear()}-${pad(scheduled.getMonth() + 1)}-${pad(scheduled.getDate())}`
            : "",
        startTime: scheduled
            ? `${pad(scheduled.getHours())}:${pad(scheduled.getMinutes())}`
            : "",
        conditions: workflow.definition.conditions.length
            ? workflow.definition.conditions.map(item => ({ ...item }))
            : [blankCondition()],
        logic: workflow.definition.logic || "and",
        actions: workflow.definition.actions.length
            ? workflow.definition.actions.map(item => ({
                ...blankAction(),
                ...item,
                templateParams: [...(item.templateParams || [])],
            }))
            : [blankAction()],
        noRecheckAfterDelay: Boolean(workflow.definition.noRecheckAfterDelay),
    };
};

const WorkflowBuilder = ({
    workflow,
    onCancel,
    onSave,
}: WorkflowBuilderProps) => {
    const isEdit = Boolean(workflow);
    const [activeStep, setActiveStep] = useState<string>("if");
    const [form, setForm] = useState<WorkflowFormState>(() =>
        buildInitialForm(workflow),
    );
    const conditionGroups = useMemo(
        () =>
            form.conditions.reduce<
                Array<{
                    condition: AutomationCondition;
                    index: number;
                    subgroups: Array<{
                        condition: AutomationCondition;
                        index: number;
                    }>;
                }>
            >((groups, condition, index) => {
                if (!condition.subgroup || !groups.length) {
                    groups.push({ condition, index, subgroups: [] });
                } else {
                    groups[groups.length - 1].subgroups.push({
                        condition,
                        index,
                    });
                }

                return groups;
            }, []),
        [form.conditions],
    );

    const changeConditionHandler = (
        index: number,
        key: string,
        value: ConditionValue,
    ) => {
        setForm(currentState => ({
            ...currentState,
            conditions: currentState.conditions.map((item, itemIndex) =>
                itemIndex === index
                    ? ({
                        ...item,
                        [key]: value,
                        ...(key === "field"
                            ? {
                                values: [],
                                operator: dateConditionFields.includes(
                                    String(value),
                                )
                                    ? "within_last"
                                    : "includes",
                            }
                            : null),
                    } as AutomationCondition)
                    : item,
            ),
        }));
    };

    const addSubgroupHandler = (parentIndex: number) => {
        setForm(currentState => {
            const next = [...currentState.conditions];
            let insertAt = parentIndex + 1;

            while (insertAt < next.length && next[insertAt].subgroup) {
                insertAt += 1;
            }

            next.splice(insertAt, 0, { ...blankCondition(), subgroup: true });

            return { ...currentState, conditions: next };
        });
    };

    const removeConditionHandler = (index: number) => {
        setForm(currentState => {
            const removingParent = !currentState.conditions[index]?.subgroup;
            const firstFollowingParent = currentState.conditions.findIndex(
                (candidate, candidateIndex) =>
                    candidateIndex > index && !candidate.subgroup,
            );

            return {
                ...currentState,
                conditions: currentState.conditions.filter(
                    (item, itemIndex) => {
                        if (itemIndex === index) {
                            return false;
                        }

                        if (!removingParent || itemIndex < index) {
                            return true;
                        }

                        return (
                            firstFollowingParent !== -1 &&
                            itemIndex >= firstFollowingParent
                        );
                    },
                ),
            };
        });
    };

    const changeActionHandler = (
        index: number,
        key: string,
        value: string,
    ) => {
        setForm(currentState => ({
            ...currentState,
            actions: currentState.actions.map((item, itemIndex) =>
                itemIndex === index
                    ? ({ ...item, [key]: value } as AutomationAction)
                    : item,
            ),
        }));
    };

    const changeActionTypeHandler = (index: number, type: string) => {
        setForm(currentState => ({
            ...currentState,
            actions: currentState.actions.map((item, itemIndex) =>
                itemIndex === index
                    ? { ...blankAction(), type, delay: item.delay }
                    : item,
            ),
        }));
    };

    const chooseAccountHandler = (index: number, integrationId: string) => {
        setForm(currentState => ({
            ...currentState,
            actions: currentState.actions.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                        ...item,
                        integrationId,
                        templateId: "",
                        templateName: "",
                        templateBody: "",
                        templateLanguage: "en",
                        templateParams: [],
                    }
                    : item,
            ),
        }));
    };

    const chooseTemplateHandler = (index: number, templateId: string) => {
        setForm(currentState => ({
            ...currentState,
            actions: currentState.actions.map((item, itemIndex) => {
                if (itemIndex !== index) {
                    return item;
                }

                const template = whatsAppTemplates.find(
                    candidate => candidate.id === templateId,
                );
                const body = template?.body || "";
                const placeholderIndexes = [
                    ...body.matchAll(/\{\{\s*(\d+)\s*\}\}/g),
                ].map(match => Number(match[1]));
                const parameterCount = Math.max(0, ...placeholderIndexes);

                return {
                    ...item,
                    templateId,
                    templateName: template?.templateName || "",
                    templateBody: body,
                    templateLanguage: template?.language || "en",
                    templateParams: Array.from(
                        { length: parameterCount },
                        () => "",
                    ),
                };
            }),
        }));
    };

    const changeParamHandler = (
        actionIndex: number,
        paramIndex: number,
        value: string,
    ) => {
        setForm(currentState => ({
            ...currentState,
            actions: currentState.actions.map((item, itemIndex) => {
                if (itemIndex !== actionIndex) {
                    return item;
                }

                const templateParams = [...item.templateParams];
                templateParams[paramIndex] = value;

                return { ...item, templateParams };
            }),
        }));
    };

    const removeActionHandler = (index: number) => {
        setForm(currentState => ({
            ...currentState,
            actions: currentState.actions.filter(
                (item, itemIndex) => itemIndex !== index,
            ),
        }));
    };

    const basicsChangeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setForm(currentState => ({ ...currentState, [name]: value }));
    };

    const saveHandler = () => {
        if (!form.name.trim() || !form.startDate || !form.startTime) {
            toast.error(
                "Enter the automation name, start date and start time",
            );
            return;
        }

        const incompleteAction = form.actions.find(action => {
            if (action.type === "update") {
                return !action.field || action.value === "";
            }

            if (action.type === "whatsapp") {
                return (
                    !action.integrationId ||
                    !action.templateId ||
                    action.templateParams.some(value => !String(value).trim())
                );
            }

            return true;
        });

        if (incompleteAction) {
            toast.error(
                incompleteAction.type === "whatsapp"
                    ? "Select a WhatsApp account, approved template, and all fixed parameter values"
                    : "Complete every THEN action before saving",
            );
            return;
        }

        onSave(form, isEdit);
    };

    const connector = (conditionIndex: number, label: string) => {
        const condition = form.conditions[conditionIndex];

        return (
            <div
                className="tw-my-2 tw-flex tw-items-center tw-gap-1"
                aria-label={label}
            >
                {["and", "or"].map(option => (
                    <Button
                        key={option}
                        type="button"
                        variant="secondary"
                        onClick={() =>
                            changeConditionHandler(
                                conditionIndex,
                                "joinWith",
                                option,
                            )
                        }
                        className={`!tw-px-2 !tw-py-0.5 !tw-text-[11px] tw-font-semibold tw-uppercase tw-border ${(condition?.joinWith === "or") === (option === "or")
                            ? "tw-border-[#1bb3a6] !tw-bg-[#d1f4f1] tw-text-[#0b6d63]"
                            : "tw-border-gray-200 !tw-bg-white tw-text-gray-500 hover:!tw-bg-gray-50"
                            }`}
                    >
                        {option}
                    </Button>
                ))}
            </div>
        );
    };

    return (
        <>
            <Button
                type="button"
                variant="linkBtn" className="tw-mb-2 tw-flex tw-items-center tw-gap-1 tw-px-0 tw-text-decoration-none"
                onClick={onCancel}
            >
                <i className="ri-arrow-left-line"></i>
                {isEdit
                    ? "Edit automation workflow"
                    : "Add automation workflow"}
            </Button>

            <div className="tw-card">
                <div className="tw-card-body">
                    <div className="row tw-gap-y-3">
                        <div className="col-12 col-xl-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setActiveStep("if")}
                                className={`tw-w-full !tw-flex-col !tw-items-start !tw-justify-start !tw-gap-0 !tw-p-3 tw-text-start tw-border ${activeStep === "if"
                                    ? "tw-border-[#1bb3a6] !tw-bg-[#d1f4f1]"
                                    : "tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                    }`}
                            >
                                <span className="tw-flex tw-items-center tw-gap-2">
                                    <i className="ri-filter-3-line tw-text-lg tw-text-[#0b6d63]"></i>
                                    <strong className="tw-text-sm tw-text-gray-800">
                                        IF
                                    </strong>
                                </span>
                                <span className="tw-mt-1 tw-block tw-text-xs tw-text-gray-500">
                                    Choose lead conditions
                                </span>
                                <span className="tw-mt-1 tw-block tw-text-xs tw-font-semibold tw-text-gray-700">
                                    {form.conditions.length} condition
                                    {form.conditions.length === 1 ? "" : "s"}{" "}
                                    applied
                                </span>
                            </Button>

                            <div className="tw-py-1 tw-text-center tw-text-gray-400">
                                <i className="ri-arrow-down-line"></i>
                            </div>

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setActiveStep("then")}
                                className={`tw-w-full !tw-flex-col !tw-items-start !tw-justify-start !tw-gap-0 !tw-p-3 tw-text-start tw-border ${activeStep === "then"
                                    ? "tw-border-[#1bb3a6] !tw-bg-[#d1f4f1]"
                                    : "tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                    }`}
                            >
                                <span className="tw-flex tw-items-center tw-gap-2">
                                    <i className="ri-flashlight-line tw-text-lg tw-text-[#0b6d63]"></i>
                                    <strong className="tw-text-sm tw-text-gray-800">
                                        THEN
                                    </strong>
                                </span>
                                <span className="tw-mt-1 tw-block tw-text-xs tw-text-gray-500">
                                    Add updates or communications
                                </span>
                                <span className="tw-mt-1 tw-block tw-text-xs tw-font-semibold tw-text-gray-700">
                                    {form.actions.length} action
                                    {form.actions.length === 1 ? "" : "s"}
                                </span>
                            </Button>
                        </div>

                        <div className="col-12 col-xl-9">
                            {activeStep === "if" ? (
                                <>
                                    <h6 className="tw-mb-3 tw-text-sm tw-font-semibold tw-uppercase tw-text-gray-500">
                                        Conditions
                                    </h6>

                                    {conditionGroups.map(
                                        (group, groupIndex) => (
                                            <div
                                                key={group.index}
                                                className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3"
                                            >
                                                <p className="tw-mb-2 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-500">
                                                    Condition {groupIndex + 1}
                                                </p>

                                                <ConditionRow
                                                    condition={group.condition}
                                                    index={group.index}
                                                    onChange={
                                                        changeConditionHandler
                                                    }
                                                    onRemove={
                                                        removeConditionHandler
                                                    }
                                                />

                                                {group.subgroups.map(
                                                    (entry, subIndex) => (
                                                        <div
                                                            key={entry.index}
                                                            className="tw-ps-4"
                                                        >
                                                            {connector(
                                                                subIndex === 0
                                                                    ? group.index
                                                                    : group
                                                                        .subgroups[
                                                                        subIndex - 1
                                                                    ].index,
                                                                `Connector in condition ${groupIndex + 1}`,
                                                            )}
                                                            <ConditionRow
                                                                condition={
                                                                    entry.condition
                                                                }
                                                                index={
                                                                    entry.index
                                                                }
                                                                onChange={
                                                                    changeConditionHandler
                                                                }
                                                                onRemove={
                                                                    removeConditionHandler
                                                                }
                                                            />
                                                        </div>
                                                    ),
                                                )}

                                                <Button
                                                    type="button"
                                                    variant="linkBtn" className="tw-mt-2 tw-px-0 tw-text-sm tw-text-decoration-none"
                                                    onClick={() =>
                                                        addSubgroupHandler(
                                                            group.index,
                                                        )
                                                    }
                                                >
                                                    <i className="ri-add-line tw-me-1"></i>
                                                    Add subgroup
                                                </Button>

                                                {groupIndex <
                                                    conditionGroups.length -
                                                    1 &&
                                                    connector(
                                                        group.subgroups.length
                                                            ? group.subgroups[
                                                                group
                                                                    .subgroups
                                                                    .length - 1
                                                            ].index
                                                            : group.index,
                                                        `Connector after condition ${groupIndex + 1}`,
                                                    )}
                                            </div>
                                        ),
                                    )}

                                    <Button
                                        type="button"
                                        variant="hoverInfo"
                                        onClick={() =>
                                            setForm(currentState => ({
                                                ...currentState,
                                                conditions: [
                                                    ...currentState.conditions,
                                                    blankCondition(),
                                                ],
                                            }))
                                        }
                                    >
                                        <i className="ri-add-line tw-me-1"></i>
                                        New condition
                                    </Button>

                                    <div className="tw-mt-3">
                                        <InputCheckbox
                                            name="noRecheckAfterDelay"
                                            value={form.noRecheckAfterDelay}
                                            labelName="Do not recheck the IF conditions when a time delay is selected in the THEN section"
                                            onChange={(
                                                event: ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setForm(currentState => ({
                                                    ...currentState,
                                                    noRecheckAfterDelay:
                                                        event.target.checked,
                                                }))
                                            }
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h6 className="tw-mb-3 tw-text-sm tw-font-semibold tw-uppercase tw-text-gray-500">
                                        Actions
                                    </h6>

                                    {form.actions.map((action, index) => (
                                        <ActionRow
                                            key={index}
                                            action={action}
                                            index={index}
                                            onChange={changeActionHandler}
                                            onChangeType={
                                                changeActionTypeHandler
                                            }
                                            onChooseAccount={
                                                chooseAccountHandler
                                            }
                                            onChooseTemplate={
                                                chooseTemplateHandler
                                            }
                                            onChangeParam={changeParamHandler}
                                            onRemove={removeActionHandler}
                                        />
                                    ))}

                                    {!form.actions.length && (
                                        <p className="tw-mb-3 tw-rounded tw-border tw-border-dashed tw-border-gray-300 tw-bg-gray-50 tw-p-3 tw-text-sm tw-text-gray-500">
                                            No actions added yet. Add at least
                                            one action before saving.
                                        </p>
                                    )}

                                    <Button
                                        type="button"
                                        variant="hoverInfo"
                                        onClick={() =>
                                            setForm(currentState => ({
                                                ...currentState,
                                                actions: [
                                                    ...currentState.actions,
                                                    blankAction(),
                                                ],
                                            }))
                                        }
                                    >
                                        <i className="ri-add-line tw-me-1"></i>
                                        Add action
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="tw-border-t tw-border-gray-200 tw-p-3">
                    <div className="row tw-items-end tw-gap-y-3">
                        <div className="col-12 col-md-6 col-xl-3">
                            <TextInput
                                name="name"
                                labelText="Automation Name"
                                placeHolder="Automation name"
                                value={form.name}
                                onChange={basicsChangeHandler}
                                maxLength={120}
                                formgroupClassName="tw-mb-0"
                                labelClass="required"
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-2">
                            <DateInput
                                name="startDate"
                                labelText="Start Date"
                                value={form.startDate}
                                onChange={basicsChangeHandler}
                                formgroupClassName="tw-mb-0"
                                labelClass="required"
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-2">
                            <TimeInput
                                name="startTime"
                                labelText="Start Time"
                                value={form.startTime}
                                onChange={basicsChangeHandler}
                                formgroupClassName="tw-mb-0"
                                labelClass="required"
                            />
                        </div>

                        <div className="col-12 col-xl-2">
                            <div className="tw-flex tw-justify-end tw-gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={saveHandler}
                                >
                                    <i className="ri-save-line"></i>
                                    {isEdit ? "Update Workflow" : "Save Workflow"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WorkflowBuilder;
export type { WorkflowFormState };
