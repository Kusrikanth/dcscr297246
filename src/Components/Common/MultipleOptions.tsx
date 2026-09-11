import React, { useRef } from 'react';
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from 'formik';
import { InputCheckbox, RadioInputContainer, SelectInput, TextInput } from '.';
import { generateUniqueNumber } from '../../utility/commonutility';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard, DragDropIcon, MoveIcon, PlusSignIcon } from '@hugeicons-pro/core-stroke-standard';
import { DndContext, closestCenter, DragEndEvent, } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';

const initialValues: any = {
    category: "radio",
    selectedOptionId: null,
    selectMultiple: "",
    optionsRow: [
        {
            id: generateUniqueNumber(),
            optionText: "",
            optionMarks: ""
        }
    ]
};

const MultipleOptions = () => {
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const formik = useFormik({
        initialValues,
        onSubmit: () => { },
    });

    const physicsCategories = [
        { id: "radio", physicsIconsNames: "Single Choice Question" },
        { id: "checkBox", physicsIconsNames: "Multiple Choice Question" },
    ];

    const addSlabHandler = () => {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                id: generateUniqueNumber(),
                optionText: "",
                optionMarks: ""
            });
        }
    };

    const removeSlabHndlr = (event: React.MouseEvent<HTMLElement>) => {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined && rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        if (active.id !== over.id) {
            const oldIndex = formik.values.optionsRow.findIndex(item => item.id === active.id);
            const newIndex = formik.values.optionsRow.findIndex(item => item.id === over.id);
            const newOptionsRow = arrayMove(formik.values.optionsRow, oldIndex, newIndex);
            formik.setFieldValue("optionsRow", newOptionsRow);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="row align-items-center">
                    <div className="col-6">
                        <h4 className="card-title mb-0 flex-grow-1">Options</h4>
                    </div>
                </div>
            </div>

            <div className="card-body p-0">
                <div className="row px-3 g-3 pt-3">
                    <div className="col-lg-4">
                        <SelectInput
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            menuItems={physicsCategories}
                            valueKey="id"
                            textKey="physicsIconsNames"
                            formgroupClassName="mb-3"
                            labelText="Category"
                            floatingLabel
                        />
                    </div>
                    <div className="col-auto ms-auto">
                        <button onClick={addSlabHandler} type="button" className="btn btn-outline-primary btn-sm">
                            <HugeiconsIcon icon={PlusSignIcon} size={18} />  Add New Option
                        </button>
                    </div>
                </div>

                <div className="row">

                </div>

                <FormikProvider value={formik}>
                    <FieldArray name="optionsRow">
                        {(arrayHelpers: ArrayHelpers) => {
                            if (!formikArrayHelpers.current) {
                                formikArrayHelpers.current = arrayHelpers;
                            }

                            return (
                                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext
                                        items={formik.values.optionsRow.map((opt: any) => opt.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {formik.values.optionsRow.map((option: any, index: number) => {
                                            const isSelected =
                                                formik.values.category === "radio"
                                                    ? String(formik.values.selectedOptionId) === String(option.id)
                                                    : formik.values.category === "checkBox"
                                                        ? option.selectMultiple === true || option.selectMultiple === "true"
                                                        : false;

                                            console.log('isSelected', isSelected);

                                            return (
                                                <SortableItem key={option.id} id={option.id}>
                                                    {({ setNodeRef, style, listeners, attributes }) => (
                                                        <div ref={setNodeRef} style={style} className="mb-3 px-3 row align-items-center">
                                                            {formik.values.category === "radio" && (
                                                                <div className="col-1 ps-3 pe-2 d-flex align-items-center justify-content-between">
                                                                    <div {...listeners} {...attributes}>
                                                                        <HugeiconsIcon style={{ cursor: 'grab' }} icon={MoveIcon} size={22} color={"black"} />
                                                                    </div>
                                                                    <RadioInputContainer
                                                                        name="selectedOptionId"
                                                                        value={formik.values.selectedOptionId}
                                                                        radioOptions={[{ id: option.id, name: "" }]}
                                                                        onChange={(e) => {
                                                                            const selectedId = e.target.value;
                                                                            formik.setFieldValue("selectedOptionId", selectedId);

                                                                            formik.values.optionsRow.forEach((opt, idx) => {
                                                                                if (String(opt.id) !== selectedId) {
                                                                                    formik.setFieldValue(`optionsRow[${idx}].optionText`, "");
                                                                                    formik.setFieldValue(`optionsRow[${idx}].optionMarks`, "");
                                                                                }
                                                                            });
                                                                        }}
                                                                        formgroupClassName="mb-0 d-flex justify-content-center align-items-center"
                                                                    />

                                                                </div>
                                                            )}
                                                            {formik.values.category === "checkBox" && (
                                                                <div className="col-1 ps-4 pe-2 d-flex align-items-center justify-content-between">
                                                                    <div {...listeners} {...attributes}>
                                                                        <HugeiconsIcon style={{ cursor: 'grab' }} icon={MoveIcon} size={22} color={"black"} />
                                                                    </div>
                                                                    <InputCheckbox
                                                                        name={`optionsRow[${index}].selectMultiple`}
                                                                        formgroupClassName="form-check-green mb-1 mt-2"
                                                                        value={option.selectMultiple}
                                                                        onChange={(e) => {
                                                                            const checked = e.target.checked;
                                                                            formik.setFieldValue(`optionsRow[${index}].selectMultiple`, checked);

                                                                            if (!checked) {
                                                                                formik.setFieldValue(`optionsRow[${index}].optionText`, '');
                                                                                formik.setFieldValue(`optionsRow[${index}].optionMarks`, '');
                                                                            }
                                                                        }}
                                                                    />

                                                                </div>
                                                            )}

                                                            <div className="col-7 ps-0">
                                                                <TextInput
                                                                    name={`optionsRow[${index}].optionText`}
                                                                    value={option.optionText}
                                                                    formgroupClassName='mb-0'
                                                                    onChange={formik.handleChange}
                                                                    onBlur={formik.handleBlur}
                                                                    isDisabled={!isSelected}
                                                                />
                                                            </div>

                                                            <div className="col-4 ps-0">
                                                                <div className="hstack align-items-start">
                                                                    <TextInput
                                                                        name={`optionsRow[${index}].optionMarks`}
                                                                        value={option.optionMarks}
                                                                        formgroupClassName='mb-0'
                                                                        onChange={formik.handleChange}
                                                                        onBlur={formik.handleBlur}
                                                                        isDisabled={!isSelected}
                                                                    />
                                                                    {index !== 0 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (formikArrayHelpers.current) {
                                                                                    formikArrayHelpers.current.remove(index);
                                                                                }
                                                                            }}
                                                                            className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white ms-3"
                                                                        >
                                                                            <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </SortableItem>

                                            );
                                        })}

                                    </SortableContext>
                                </DndContext>
                            );
                        }}
                    </FieldArray>
                </FormikProvider>
            </div>
        </div>
    );
};

export default MultipleOptions;
