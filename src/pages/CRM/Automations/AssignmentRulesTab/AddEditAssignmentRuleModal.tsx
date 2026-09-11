import { type MouseEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    MultiSelectCheckbox,
    TextInput,
} from "../../../../Components/Common";
import {
    leadMeta,
    type AssignmentRule,
    type MetaOption,
} from "../helper";

interface AddEditAssignmentRuleModalProps {
    data?: AssignmentRule;
    toggle: () => void;
    onSave: (rule: AssignmentRule, isEdit: boolean) => void;
}

const renderSelectedValues = (
    selectedItems: Array<MetaOption>,
    removeItemHandler: (event: MouseEvent<HTMLElement>) => void,
) => (
    <div className="tw-flex tw-flex-wrap tw-gap-1">
        {selectedItems.map(item => (
            <span
                key={item.id}
                className="badge badge-soft-primary tw-flex tw-items-center tw-gap-1"
            >
                {item.name}
                <i
                    data-id={item.id}
                    className="ri-close-line tw-cursor-pointer"
                    onClick={removeItemHandler}
                ></i>
            </span>
        ))}
    </div>
);

const renderOption = (item: MetaOption) => <span>{item.name}</span>;

const optionsForIds = (ids: Array<string>, options: Array<MetaOption>) =>
    options.filter(option => ids.includes(String(option.id)));

const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Enter a rule name"),

    branches: Yup.array().min(1, "Select at least one branch"),

    sources: Yup.array().min(1, "Select at least one source"),

    employees: Yup.array().min(
        1,
        "Select at least one user to assign leads to",
    ),
});

const AddEditAssignmentRuleModal = ({
    data,
    toggle,
    onSave,
}: AddEditAssignmentRuleModalProps) => {
    const isEdit = Boolean(data);

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            name: data?.name || "",
            branches: optionsForIds(
                data?.branchIds || [],
                leadMeta.branches,
            ),
            sources: optionsForIds(data?.sourceIds || [], leadMeta.sources),
            employees: optionsForIds(
                data?.employeeIds || [],
                leadMeta.employees,
            ),
        },

        validationSchema,

        onSubmit: values => {
            const payload: AssignmentRule = {
                id: data?.id || `r-${Date.now()}`,
                name: values.name.trim(),
                createdAt: data?.createdAt || new Date().toISOString(),
                branchIds: values.branches.map(item => String(item.id)),
                sourceIds: values.sources.map(item => String(item.id)),
                employeeIds: values.employees.map(item => String(item.id)),
                isActive: data?.isActive ?? true,
            };

            onSave(payload, isEdit);
            toggle();
        },
    });

    const multiSelectChangeHandler = (
        selectedOptions: Array<MetaOption>,
        meta: { name: string },
    ) => {
        formik.setFieldValue(meta.name, selectedOptions);
    };

    const errorFor = (field: "name" | "branches" | "sources" | "employees") =>
        formik.touched[field] && formik.errors[field]
            ? (formik.errors[field] as string)
            : "";

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            <div className="row">
                <div className="col-12">
                    <TextInput
                        name="name"
                        labelText="Rule Name"
                        placeHolder="e.g. Nacharam · Website leads"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        maxLength={120}
                        autoFocus
                        invalid={errorFor("name") ? true : false}
                        error={errorFor("name")}
                        labelClass="required"
                    />
                </div>

                <div className="col-12">
                    <MultiSelectCheckbox
                        name="branches"
                        idKey="id"
                        labelText="Branch"
                        value={formik.values.branches}
                        renderValue={renderSelectedValues}
                        renderOptions={renderOption}
                        onChange={multiSelectChangeHandler}
                        searchKey="name"
                        options={leadMeta.branches}
                        defaultSelect="Select branches"
                        invalid={errorFor("branches") ? true : false}
                        error={errorFor("branches")}
                        labelClass="required"
                    />
                </div>

                <div className="col-12">
                    <MultiSelectCheckbox
                        name="sources"
                        idKey="id"
                        labelText="Source"
                        value={formik.values.sources}
                        renderValue={renderSelectedValues}
                        renderOptions={renderOption}
                        onChange={multiSelectChangeHandler}
                        searchKey="name"
                        options={leadMeta.sources}
                        defaultSelect="Select sources"
                        invalid={errorFor("sources") ? true : false}
                        error={errorFor("sources")}
                        labelClass="required"
                    />
                </div>

                <div className="col-12">
                    <MultiSelectCheckbox
                        name="employees"
                        idKey="id"
                        labelText="Assign To Users"
                        value={formik.values.employees}
                        renderValue={renderSelectedValues}
                        renderOptions={renderOption}
                        onChange={multiSelectChangeHandler}
                        searchKey="name"
                        options={leadMeta.employees}
                        defaultSelect="Select counsellors"
                        invalid={errorFor("employees") ? true : false}
                        error={errorFor("employees")}
                        labelClass="required"
                    />
                </div>
            </div>

            <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                New leads matching every selected branch and source are shared
                out in turn between the selected counsellors.
            </p>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button type="submit" variant="primary">
                    {isEdit ? "Save Changes" : "Add Rule"}
                </Button>
            </div>
        </form>
    );
};

export default AddEditAssignmentRuleModal;
