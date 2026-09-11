import { ArrayHelpers, FieldArray, FormikProvider } from "formik";
import { SelectInput, TextInput } from "../../../../../../Components/Common";
import { useEffect, useRef } from "react";
import { generateUniqueNumber } from "../../../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, DragDropVerticalIcon, MoveIcon, PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { DndContext, closestCenter, DragEndEvent, } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, } from '@dnd-kit/sortable';
import SortableItem from "./SortableItem";
import CustomTipTapEditor from "../../../../../../Components/Common/CustomTipTapEditor";
import { RadioInputContainer } from "./OptionsRadioInputContainer";
import { InputCheckboxUpdated } from "./OptionsInputCheckboxUpdated";
import { generateUniqueOptionId } from "./helper";
import * as Yup from "yup";

export const questionCreationValidationSchema = Yup.object().shape({
  questionDescription: Yup.mixed().test(
    "required-doc",
    "Description is required",
    (val) => {
      if (!val) return false;
      if (typeof val === "string") return val.trim().length > 0;
      if (typeof val === "object") {
        return !!val.content && val.content.length > 0;
      }
      return false;
    }
  ),
  optionsRow: Yup.array()
    .of(
      Yup.object().shape({
        optionText: Yup.mixed().test(
          "required-doc",
          "Option text is required",
          (val) => {
            if (!val) return false;
            if (typeof val === "string") return val.trim().length > 0;
            if (typeof val === "object") {
              return !!val.content && val.content.length > 0;
            }
            return false;
          }
        ),
        optionMarks: Yup.string().when("isCorrectAnswer", {
          is: true,
          then: (schema) => schema.required("Marks required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        isCorrectAnswer: Yup.boolean(),
      })
    )
    .test(
      "at-least-one-checked",
      "Please select at least one option",
      (options) => !!options?.some((opt) => opt.isCorrectAnswer)
    ),
});




const QuestionCreation = (props: any) => {

    const { parentForm, parentFormHelpers, activeMenuId } = props;
    const getCategoryByActiveMenuId = (activeMenuId: string) => {
        return activeMenuId === 'MCQ' ? 'checkbox' : 'radio';
    };


    const category =
        activeMenuId
            ? getCategoryByActiveMenuId(activeMenuId)
            : props.selectedCategory ||
            (parentForm?.values?.questionTypeShortName === "MCQ" ? "checkbox" : "radio");

    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    useEffect(() => {
        if (activeMenuId && parentFormHelpers) {
            const newCategory = getCategoryByActiveMenuId(activeMenuId);
            
            // Only reset if the category actually changed to avoid unnecessary updates
            if (parentForm.values.category !== newCategory) {
                const resetValues = {
                    // questionTitle: "",
                    questionDescription: "",
                    category: newCategory,
                    language: "",
                    sections: "",
                    selectedOptionId: "",
                    selectMultiple: "",
                    optionsRow: [
                        {
                            id: generateUniqueNumber(),
                            optionId: generateUniqueOptionId(),
                            optionText: "",
                            optionMarks: "",
                            order: 0,
                            isCorrectAnswer: false,
                            selectMultiple: false
                        }
                    ],
                };

                // parentFormHelpers.setFieldValue("questionTitle", resetValues.questionTitle);
                parentFormHelpers.setFieldValue("questionDescription", resetValues.questionDescription);
                parentFormHelpers.setFieldValue("selectedOptionId", resetValues.selectedOptionId);
                parentFormHelpers.setFieldValue("category", newCategory);
                parentFormHelpers.setFieldValue("optionsRow", resetValues.optionsRow);
                parentFormHelpers.setFieldValue("textSolution", "");
            }
        }
    }, [activeMenuId, parentFormHelpers, parentForm.values.category]);
    const onChangeQuillHndlr = (content: any) => {
        if (parentFormHelpers) {
            parentFormHelpers.setFieldValue("questionDescription", content);
        }
    };


    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;
        if (active.id !== over.id) {
            const oldIndex = parentForm.values.optionsRow.findIndex(item => item.id === active.id);
            const newIndex = parentForm.values.optionsRow.findIndex(item => item.id === over.id);
            const newOptionsRow = arrayMove(parentForm.values.optionsRow, oldIndex, newIndex);

            const updatedOptionsRow = newOptionsRow?.map((option: any, index: number) => ({
                ...option,
                order: index,
                isCorrectAnswer: option.isCorrectAnswer || false,
                selectMultiple: option.isCorrectAnswer || false // Ensure selectMultiple stays in sync
            }));

            if (parentFormHelpers) {
                parentFormHelpers.setFieldValue("optionsRow", updatedOptionsRow);
            }
        }
    };

    const addSlabHandler = () => {
        if (formikArrayHelpers.current) {
            const newOption = {
                id: generateUniqueNumber(),
                optionId: generateUniqueOptionId(), // Add unique option ID
                optionText: "",
                optionMarks: "",
                order: parentForm.values.optionsRow.length,
                isCorrectAnswer: false,
                selectMultiple: false
            };
            formikArrayHelpers.current.push(newOption);

            if (parentFormHelpers) {
                // Create new array to avoid mutation
                const newOptionsRow = [...parentForm.values.optionsRow, newOption];
                parentFormHelpers.setFieldValue("optionsRow", newOptionsRow);
            }
        }
    };


    useEffect(() => {
        if (props.selectedCategory && parentFormHelpers && parentForm.values.category !== props.selectedCategory) {
            parentFormHelpers.setFieldValue("category", props.selectedCategory);
        }
    }, [props.selectedCategory, parentFormHelpers, parentForm.values.category]);


    const totalMarks = parentForm.values.optionsRow.reduce((sum: number, option: any) => {
        const marks = parseFloat(option.optionMarks);
        return sum + (isNaN(marks) ? 0 : marks);
    }, 0);

    const currentCategory = activeMenuId ? getCategoryByActiveMenuId(activeMenuId) : parentForm.values.category;

    return (
        <>
            <div className='px-0'>
                <div className='row lms_radio'>
                    {/* <div className="col-4 d-flex align-items-center">
                        <h4 className="fs-12 mb-2 fw-normal">
                            Question Title (Optional)
                        </h4>
                    </div>
                    <div className="mb-3">
                        <TextInput
                            name="questionTitle"
                            value={parentForm.values.questionTitle}
                            onChange={(e: any) => {
                                if (parentFormHelpers) {
                                    parentFormHelpers.setFieldValue("questionTitle", e.target.value);
                                }
                            }}
                            formgroupClassName="mb-0"
                            placeHolder="Enter your question title"
                        />
                    </div> */}
                    <div className="col-4 d-flex align-items-center">
                        <h4 className="fs-12  fw-normal">
                            Question Description
                        </h4>
                    </div>
                    <div className='col-12 lms lms_tiptap_editor'>
                        <CustomTipTapEditor
                            name="questionDescription"
                            value={parentForm.values.questionDescription}
                            onChange={onChangeQuillHndlr}
                            placeHolder="Enter Your Question"
                            formgroupClassName="mt-0"
                            invalid={
                                parentForm.touched?.questionDescription &&
                                !!parentForm.errors?.questionDescription
                            }
                            error={
                                parentForm.touched?.questionDescription &&
                                    parentForm.errors?.questionDescription
                                    ? parentForm.errors.questionDescription
                                    : ""
                            }
                        />
                    </div>
                    <div className="col-auto d-flex align-items-center">
                        <h4 className="fs-12 mb-3 fw-normal">
                            Add your options and select correct answer
                        </h4>
                    </div>
                    <div className="col-auto ms-auto me-5 pe-5 my-1">
                        <h4 className="fs-12 mb-3 fw-normal">
                            Total Marks : <span className="text-muted">{totalMarks}</span>
                        </h4>

                    </div>
                    {props.parentForm?.errors?.optionsRow &&
                        typeof props.parentForm.errors.optionsRow === "string" && (
                            <div className="text-danger mb-2">
                                {props.parentForm.errors.optionsRow}
                            </div>
                        )}

                    <FormikProvider value={parentForm}>
                        <FieldArray name="optionsRow">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }
                                return (
                                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                        <SortableContext
                                            items={parentForm.values.optionsRow?.map((opt: any) => opt.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {parentForm.values.optionsRow?.map((option: any, index: number) => {
                                                const isSelected =
                                                    currentCategory === "radio"
                                                        ? String(parentForm.values.selectedOptionId) === String(option.id)
                                                        : currentCategory === "checkbox"
                                                            ? Boolean(option.selectMultiple) && Boolean(option.isCorrectAnswer)
                                                            : false;


                                                const inputFieldErrors: any =
                                                    props.parentForm?.errors?.optionsRow?.[index] || {};

                                                const inputFieldTouched: any =
                                                    props.parentForm?.touched?.optionsRow?.[index] || {};
                                                return (
                                                    <SortableItem key={option.id} id={option.id}>
                                                        {({ setNodeRef, style, listeners, attributes }) => (
                                                            <div ref={setNodeRef} style={{
                                                                ...style,
                                                                minHeight: '70px',
                                                                padding: '10px',
                                                            }} className="mb-2 row d-flex ps-2 gx-2 align-items-center">
                                                                <div className="ps-1 d-flex align-items-center ps-0" style={{ width: "7%", gap: "10px" }}>
                                                                    <div {...listeners} {...attributes}>
                                                                        <HugeiconsIcon style={{ cursor: 'grab' }} icon={DragDropVerticalIcon} size={18} color="black" />
                                                                    </div>

                                                                    {/* Conditionally render radio or checkbox based on activeMenuId */}
                                                                    {currentCategory === "radio" ? (
                                                                        <RadioInputContainer
                                                                            name="selectedOptionId"
                                                                            value={parentForm.values.selectedOptionId}
                                                                            radioOptions={[{ id: option.id, name: String.fromCharCode(65 + index) }]}
                                                                            radioClassName=""
                                                                            onChange={(e: any) => {
                                                                                const selectedId = e.target.value;

                                                                                // Update parent form directly
                                                                                if (parentFormHelpers) {
                                                                                    parentFormHelpers.setFieldValue("selectedOptionId", selectedId);
                                                                                    
                                                                                    // Update optionsRow to ensure only one is correct
                                                                                    const updatedOptionsRow = parentForm.values.optionsRow?.map((opt) => ({
                                                                                        ...opt,
                                                                                        isCorrectAnswer: String(opt.id) === selectedId,
                                                                                        selectMultiple: false
                                                                                    }));
                                                                                    parentFormHelpers.setFieldValue("optionsRow", updatedOptionsRow);
                                                                                }
                                                                            }}
                                                                            formgroupClassName="mt-1"
                                                                        />
                                                                    ) : (
                                                                        <InputCheckboxUpdated
                                                                            name={`optionsRow[${index}].isCorrectAnswer`}
                                                                            labelName={String.fromCharCode(65 + index)}
                                                                            formgroupClassName="form-check-green mb-0"
                                                                            value={Boolean(option.isCorrectAnswer)}

                                                                            onChange={(e) => {
                                                                                const checked = e.target.checked;
                                                                                if (parentFormHelpers) {
                                                                                    // Create new array to avoid mutation
                                                                                    const updatedOptionsRow = parentForm.values.optionsRow.map((opt, idx) => 
                                                                                        idx === index 
                                                                                            ? { ...opt, isCorrectAnswer: checked, selectMultiple: checked }
                                                                                            : opt
                                                                                    );
                                                                                    parentFormHelpers.setFieldValue("optionsRow", updatedOptionsRow);
                                                                                }
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                                <div className="col-9 flex-grow-1 questionPool">
                                                                    {/* <TextInput
                                                                        name={`optionsRow[${index}].optionText`}
                                                                        value={option.optionText}
                                                                        placeHolder={getOptionLabel(index)}
                                                                        formgroupClassName={`mb-0 rounded ${currentCategory === "radio"
                                                                            ? updatePriorityForm.values.selectedOptionId === String(option.id)
                                                                                ? "border-success border-1"
                                                                                : ""
                                                                            : option.selectMultiple
                                                                                ? "border-success border-1"
                                                                                : ""
                                                                            }`}
                                                                        onChange={updatePriorityForm.handleChange}
                                                                        onBlur={updatePriorityForm.handleBlur}
                                                                    /> */}
                                                                    <CustomTipTapEditor
                                                                        name={`optionsRow[${index}].optionText`}
                                                                        value={parentForm.values?.optionsRow[index]?.optionText}
                                                                        onChange={(value: any) => {
                                                                            if (parentFormHelpers) {
                                                                                // Create new array to avoid mutation
                                                                                const newOptionsRow = parentForm.values.optionsRow.map((opt, idx) => 
                                                                                    idx === index 
                                                                                        ? { ...opt, optionText: value }
                                                                                        : opt
                                                                                );
                                                                                parentFormHelpers.setFieldValue("optionsRow", newOptionsRow);
                                                                            }
                                                                        }}
                                                                        invalid={
                                                                            !!(
                                                                                props.parentForm.touched.optionsRow?.[index]?.optionText &&
                                                                                props.parentForm.errors.optionsRow?.[index]?.optionText
                                                                            )
                                                                        }
                                                                        error={
                                                                            props.parentForm.touched.optionsRow?.[index]?.optionText &&
                                                                                props.parentForm.errors.optionsRow?.[index]?.optionText
                                                                                ? props.parentForm.errors.optionsRow[index]?.optionText
                                                                                : ""
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="col-2 px-1">
                                                                    <div className="hstack mt-4">
                                                                         <TextInput
                                                                            name={`optionsRow[${index}].optionMarks`}
                                                                            value={option.optionMarks}
                                                                            inputClassName={`mb-0 w-50 me-2 rounded ${currentCategory === "radio"
                                                                                ? parentForm.values.selectedOptionId === String(option.id)
                                                                                    ? "border-success border-1"
                                                                                    : ""
                                                                                : option.selectMultiple
                                                                                    ? "border-success border-1"
                                                                                    : ""
                                                                                }`}
                                                                            onChange={(e: any) => {
                                                                                // Sync with parent form
                                                                                if (parentFormHelpers) {
                                                                                    // Create new array to avoid mutation
                                                                                    const newOptionsRow = parentForm.values.optionsRow.map((opt, idx) => 
                                                                                        idx === index 
                                                                                            ? { ...opt, optionMarks: e.target.value }
                                                                                            : opt
                                                                                    );
                                                                                    parentFormHelpers.setFieldValue("optionsRow", newOptionsRow);
                                                                                }
                                                                            }}
                                                                            invalid={
                                                                                inputFieldTouched.optionMarks && inputFieldErrors.optionMarks
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            error={
                                                                                inputFieldTouched.optionMarks && inputFieldErrors.optionMarks
                                                                                    ? inputFieldErrors.optionMarks
                                                                                    : ""
                                                                            }
                                                                           isDisabled={!option.isCorrectAnswer}
                                                                            placeHolder="00"
                                                                        />
                                                                        {index !== 0 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    formikArrayHelpers.current?.remove(index);
                                                                                    // Sync with parent form and update order
                                                                                    if (parentFormHelpers) {
                                                                                        const newOptionsRow = parentForm.values.optionsRow.filter((_: any, idx: number) => idx !== index);
                                                                                        // Update order for remaining options
                                                                                        const updatedOptionsRow = newOptionsRow?.map((option: any, idx: number) => ({
                                                                                            ...option,
                                                                                            order: idx,
                                                                                            isCorrectAnswer: option.isCorrectAnswer || false,
                                                                                            selectMultiple: option.isCorrectAnswer || false // Ensure selectMultiple stays in sync
                                                                                        }));
                                                                                        parentFormHelpers.setFieldValue("optionsRow", updatedOptionsRow);
                                                                                    }
                                                                                }}
                                                                                className="btn btn-sm btn-icon btn-light"
                                                                                style={{
                                                                                    height: '32px',
                                                                                    width: '32px',
                                                                                    borderRadius: '4px',
                                                                                    display: 'inline-flex',
                                                                                    justifyContent: 'center',
                                                                                    alignItems: 'center',
                                                                                    marginLeft: '8px',
                                                                                    border: '1px solid #e9ebec'
                                                                                }}
                                                                            >
                                                                                <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={12} />
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
                    <div className="col-auto my-1">
                        {parentForm.values.optionsRow.length < 4 && (
                            <button onClick={addSlabHandler} type="button" className="btn bg-primary btn-sm fs-12 text-light">
                                <span className="broder rounded"><HugeiconsIcon icon={PlusSignIcon} size={14} /></span>          Add New Option
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </>
    )
}

export default QuestionCreation