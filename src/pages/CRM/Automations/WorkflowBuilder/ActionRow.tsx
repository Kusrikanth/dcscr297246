import { useMemo, type ChangeEvent } from "react";

import { Button, SelectInput, TextInput } from "../../../../Components/Common";
import {
    whatsAppAccounts,
    whatsAppTemplates,
} from "../../WhatsApp/helper";
import {
    actionDelayOptions,
    actionFieldOptions,
    actionTypeOptions,
    getFieldOptions,
    unconfigurableActionTypes,
    type AutomationAction,
} from "../helper";

interface ActionRowProps {
    action: AutomationAction;
    index: number;
    onChange: (index: number, key: string, value: string) => void;
    onChangeType: (index: number, type: string) => void;
    onChooseAccount: (index: number, integrationId: string) => void;
    onChooseTemplate: (index: number, templateId: string) => void;
    onChangeParam: (
        actionIndex: number,
        paramIndex: number,
        value: string,
    ) => void;
    onRemove: (index: number) => void;
}

const accountOptions = whatsAppAccounts
    .filter(item => item.hasCredentials)
    .map(item => ({ id: item.id, name: item.name }));

const ActionRow = ({
    action,
    index,
    onChange,
    onChangeType,
    onChooseAccount,
    onChooseTemplate,
    onChangeParam,
    onRemove,
}: ActionRowProps) => {
    const templateOptions = useMemo(() => {
        if (!action.integrationId) {
            return [];
        }

        return whatsAppTemplates
            .filter(
                item =>
                    item.integrationId === action.integrationId &&
                    item.status === "APPROVED",
            )
            .map(item => ({ id: item.id, name: item.templateName }));
    }, [action.integrationId]);

    const valueOptions = getFieldOptions(action.field);
    const isUnconfigurable = unconfigurableActionTypes.includes(action.type);

    const changeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        onChange(index, event.target.name, event.target.value);
    };

    return (
        <div className="tw-mb-2 tw-rounded tw-border tw-border-gray-200 tw-bg-white tw-p-2">
            <div className="tw-flex tw-flex-wrap tw-items-start tw-gap-2">
                <div className="tw-w-full sm:tw-w-48">
                    <SelectInput
                        name="type"
                        labelText="Action"
                        value={action.type}
                        onChange={(
                            event: ChangeEvent<HTMLSelectElement>,
                        ) => onChangeType(index, event.target.value)}
                        menuItems={actionTypeOptions}
                        valueKey="id"
                        textKey="name"
                        hideSelectOption
                        formgroupClassName="tw-mb-0"
                    />
                </div>

                {action.type === "update" && (
                    <>
                        <div className="tw-w-full sm:tw-w-44">
                            <SelectInput
                                name="field"
                                labelText="Field"
                                value={action.field}
                                onChange={changeHandler}
                                menuItems={actionFieldOptions}
                                valueKey="id"
                                textKey="name"
                                hideSelectOption
                                formgroupClassName="tw-mb-0"
                            />
                        </div>

                        <div className="tw-min-w-52 tw-flex-1">
                            {action.field === "score" ? (
                                <TextInput
                                    name="value"
                                    labelText="Lead score"
                                    inputType="number"
                                    placeHolder="0 – 100"
                                    value={action.value}
                                    onChange={changeHandler}
                                    formgroupClassName="tw-mb-0"
                                    invalid={
                                        action.value !== "" &&
                                        (Number(action.value) < 0 ||
                                            Number(action.value) > 100)
                                    }
                                    error={
                                        action.value !== "" &&
                                            (Number(action.value) < 0 ||
                                                Number(action.value) > 100)
                                            ? "Lead score must be between 0 and 100"
                                            : ""
                                    }
                                />
                            ) : (
                                <SelectInput
                                    name="value"
                                    labelText="Value"
                                    defaultSelect={`Select ${action.field}`}
                                    value={action.value}
                                    onChange={changeHandler}
                                    menuItems={valueOptions}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                />
                            )}
                        </div>
                    </>
                )}

                {action.type === "whatsapp" && (
                    <>
                        <div className="tw-w-full sm:tw-w-56">
                            <SelectInput
                                name="integrationId"
                                labelText="WhatsApp Account"
                                defaultSelect="Select WhatsApp account"
                                value={action.integrationId}
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ) => onChooseAccount(index, event.target.value)}
                                menuItems={accountOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                            />
                        </div>

                        <div className="tw-min-w-52 tw-flex-1">
                            <SelectInput
                                name="templateId"
                                labelText="Approved Template"
                                defaultSelect={
                                    !action.integrationId
                                        ? "Select an account first"
                                        : templateOptions.length
                                            ? "Select approved template"
                                            : "No approved templates"
                                }
                                value={action.templateId}
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ) => onChooseTemplate(index, event.target.value)}
                                menuItems={templateOptions}
                                valueKey="id"
                                textKey="name"
                                isDisabled={!templateOptions.length}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>
                    </>
                )}

                {isUnconfigurable && (
                    <div className="tw-flex tw-min-w-52 tw-flex-1 tw-items-end">
                        <p className="tw-mb-0 tw-w-full tw-rounded tw-border tw-border-dashed tw-border-gray-300 tw-bg-gray-50 tw-px-2 tw-py-2 tw-text-sm tw-text-gray-500">
                            Configuration for this action is not available yet
                        </p>
                    </div>
                )}

                <div className="tw-w-full sm:tw-w-40">
                    <SelectInput
                        name="delay"
                        labelText="Delay"
                        value={action.delay}
                        onChange={changeHandler}
                        menuItems={actionDelayOptions}
                        valueKey="id"
                        textKey="name"
                        hideSelectOption
                        formgroupClassName="tw-mb-0"
                    />
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50 tw-mt-4"
                    title="Remove action"
                    aria-label="Remove action"
                    onClick={() => onRemove(index)}
                >
                    <i className="ri-delete-bin-line tw-text-danger"></i>
                </Button>
            </div>

            {action.type === "whatsapp" && action.templateId && (
                <div className="tw-mt-2 tw-rounded tw-bg-gray-50 tw-p-2">
                    <p className="tw-mb-1 tw-text-[11px] tw-uppercase tw-text-gray-500">
                        Approved template content
                    </p>
                    <p className="tw-mb-0 tw-whitespace-pre-wrap tw-text-sm tw-text-gray-700">
                        {action.templateBody}
                    </p>

                    {action.templateParams.length > 0 && (
                        <div className="row tw-mt-2">
                            {action.templateParams.map((value, paramIndex) => (
                                <div
                                    className="col-12 col-md-6 col-xl-4"
                                    key={`param-${paramIndex}`}
                                >
                                    <TextInput
                                        name={`param-${index}-${paramIndex}`}
                                        labelText={`{{${paramIndex + 1}}} fixed value`}
                                        placeHolder={`Value for {{${paramIndex + 1}}}`}
                                        value={value}
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            onChangeParam(
                                                index,
                                                paramIndex,
                                                event.target.value,
                                            )
                                        }
                                        formgroupClassName="tw-mb-2"
                                        invalid={!value.trim()}
                                        error={
                                            !value.trim()
                                                ? "A fixed value is required"
                                                : ""
                                        }
                                        labelClass="required"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ActionRow;
