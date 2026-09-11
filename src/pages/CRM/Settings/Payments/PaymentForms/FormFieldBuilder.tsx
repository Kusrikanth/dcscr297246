import type { ChangeEvent } from "react";
import {
    Button,
    InputCheckbox,
    SelectInput,
    TextInput,
} from "../../../../../Components/Common";
import {
    paymentFieldTypeOptions,
    typeTakesPlaceholder,
    type PaymentFormField,
} from "./helper";

interface FormFieldBuilderProps {
    fields: Array<PaymentFormField>;
    onChange: (fields: Array<PaymentFormField>) => void;
}

const blankField = (): PaymentFormField => ({
    id: `field-${Date.now()}`,
    name: "",
    label: "",
    fieldType: "text",
    placeholder: "",
    isRequired: false,
    options: [],
});

const FormFieldBuilder = ({ fields, onChange }: FormFieldBuilderProps) => {
    const patchField = (id: string, changes: Partial<PaymentFormField>) => {
        onChange(
            fields.map(field =>
                field.id === id ? { ...field, ...changes } : field,
            ),
        );
    };

    const optionChangeHandler = (
        id: string,
        index: number,
        value: string,
    ) => {
        const field = fields.find(item => item.id === id);

        if (!field) {
            return;
        }

        patchField(id, {
            options: field.options.map((option, optionIndex) =>
                optionIndex === index ? value : option,
            ),
        });
    };

    return (
        <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-p-3">
            <div className="tw-mb-2">
                <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                    Customer details form
                </p>
                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                    Add the fields to collect when someone pays.
                </p>
            </div>

            {fields.length === 0 ? (
                <p className="tw-mb-3 tw-rounded tw-border tw-border-dashed tw-border-gray-200 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                    No fields added yet. Add one to collect details with the payment.
                </p>
            ) : (
                fields.map(field => (
                    <div
                        key={field.id}
                        className="tw-mb-2 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3"
                    >
                        <div className="tw-mb-2 tw-flex tw-items-center tw-justify-between tw-gap-2">
                            <div className="tw-flex tw-min-w-0 tw-flex-wrap tw-items-center tw-gap-2">
                                <span className="tw-text-sm tw-font-medium tw-text-gray-800">
                                    {field.label || field.name || "Untitled field"}
                                </span>

                                <span className="badge badge-soft-secondary">
                                    {paymentFieldTypeOptions.find(
                                        option => option.id === field.fieldType,
                                    )?.name || field.fieldType}
                                </span>

                                {field.isRequired && (
                                    <span className="badge badge-soft-danger">
                                        Required
                                    </span>
                                )}
                            </div>

                            <Button
                                type="button"
                                variant="secondary"
                                className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                title="Remove field"
                                aria-label={`Remove ${field.label || "field"}`}
                                onClick={() =>
                                    onChange(fields.filter(item => item.id !== field.id))
                                }
                            >
                                <i className="ri-close-line"></i>
                            </Button>
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-4">
                                <TextInput
                                    name={`name-${field.id}`}
                                    labelText="Field Name"
                                    labelClass="required"
                                    placeHolder="e.g. studentName"
                                    value={field.name}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        patchField(field.id, {
                                            name: event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <TextInput
                                    name={`label-${field.id}`}
                                    labelText="Display Label"
                                    labelClass="required"
                                    placeHolder="e.g. Student Name"
                                    value={field.label}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        patchField(field.id, {
                                            label: event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <SelectInput
                                    name={`fieldType-${field.id}`}
                                    labelText="Field Type"
                                    labelClass="required"
                                    hideSelectOption
                                    value={field.fieldType}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLSelectElement>,
                                    ) =>
                                        patchField(field.id, {
                                            fieldType: event.target.value,
                                            options: [],
                                        })
                                    }
                                    menuItems={paymentFieldTypeOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            {typeTakesPlaceholder(field.fieldType) && (
                                <div className="col-12 col-md-8">
                                    <TextInput
                                        name={`placeholder-${field.id}`}
                                        labelText="Placeholder Text"
                                        placeHolder="e.g. Enter student name"
                                        value={field.placeholder}
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            patchField(field.id, {
                                                placeholder: event.target.value,
                                            })
                                        }
                                    />
                                </div>
                            )}

                            <div className="col-12 col-md-4 tw-flex tw-items-center">
                                <InputCheckbox
                                    name={`isRequired-${field.id}`}
                                    labelName="Required field"
                                    labelClassName="tw-text-sm tw-text-gray-700"
                                    formgroupClassName="tw-mb-3"
                                    value={field.isRequired}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        patchField(field.id, {
                                            isRequired: event.target.checked,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {field.fieldType === "select" && (
                            <div className="tw-rounded tw-border tw-border-gray-200 tw-bg-white tw-p-2">
                                <p className="tw-mb-1 tw-text-xs tw-font-medium tw-text-gray-700">
                                    Options <span className="tw-text-danger">*</span>
                                </p>

                                {field.options.map((option, index) => (
                                    <div
                                        key={index}
                                        className="tw-mb-1 tw-flex tw-items-center tw-gap-2"
                                    >
                                        <TextInput
                                            name={`${field.id}-option-${index}`}
                                            placeHolder={`Option ${index + 1}`}
                                            value={option}
                                            onChange={event =>
                                                optionChangeHandler(
                                                    field.id,
                                                    index,
                                                    event.target.value,
                                                )
                                            }
                                            inputClassName="form-control-sm"
                                            formgroupClassName="tw-mb-0 tw-flex-1"
                                        />

                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50 tw-flex-shrink-0"
                                            title="Remove option"
                                            aria-label={`Remove option ${index + 1}`}
                                            onClick={() =>
                                                patchField(field.id, {
                                                    options: field.options.filter(
                                                        (_, optionIndex) =>
                                                            optionIndex !== index,
                                                    ),
                                                })
                                            }
                                        >
                                            <i className="ri-close-line"></i>
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="hoverInfo" className="tw-mt-1"
                                    onClick={() =>
                                        patchField(field.id, {
                                            options: [...field.options, ""],
                                        })
                                    }
                                >
                                    <i className="ri-add-line tw-me-1"></i>
                                    Add Option
                                </Button>
                            </div>
                        )}
                    </div>
                ))
            )}

            <Button
                type="button"
                variant="hoverInfo"
                onClick={() => onChange([...fields, blankField()])}
            >
                <i className="ri-add-line tw-me-1"></i>
                Add Field
            </Button>
        </div>
    );
};

export default FormFieldBuilder;
