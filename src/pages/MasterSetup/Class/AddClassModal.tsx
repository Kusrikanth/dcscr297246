import React, { useRef, useState, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";

//Common Component
import { TextInput } from "../../../Components/Common";
// Formik validation
import * as Yup from "yup";
import { FieldArray, useFormik,  ArrayHelpers, FormikProvider } from "formik";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";

//Common Utility
import { generateUniqueNumber } from "../../../utility/commonutility";

//Interface and Types
import { IAddClassState } from "./classtypes";
import { addInstClassAct,  updateInstClassAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import Button from "../../../Components/Common/Button";

function getInitialState(editData?: any): any {
    const data = {
        uniqueId: generateUniqueNumber(),
        instituteClassId: "",
        className: "",
        classOrder: "",
        shortName: ""
    };
    if (editData) {
        const { className, classOrder, instituteClassId, shortName } = editData || {};
        data.uniqueId = instituteClassId;
        data.instituteClassId = instituteClassId;
        data.className = className;
        data.classOrder = classOrder;
        data.shortName = shortName;
    }
    return { classes: [data] }
}

const validationSchema = Yup.object().shape({
    classes: Yup.array().of(
        Yup.object().shape({
            className: Yup.string().required("Name is required.")
                .matches(/^[^-\s][a-zA-Z\s-]+$/, 'Only alphabet with space, - character are allowed.'),
            classOrder: Yup.number().typeError("Enter a valid number").required("Class order is required."),
            shortName: Yup.string().required("Code is required.")
                .matches(/^[^-\s][a-zA-Z\s-]+$/, 'Only alphabet with space, - character are allowed.'),

        })
    ),
});

const AddClassModal: React.FC<any> = (props) => {
    const [addClassState, setAddClassState] = useState<IAddClassState>(() => getInitialState());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const dispatch = useAppDispatch();
    const { addClassResp, updateClassResp,showApiLoader } = useAppSelector(({ instAcademics,globalData }) => ({
        addClassResp: instAcademics.addClassResp,
        updateClassResp: instAcademics.updateClassResp,
        showApiLoader:globalData.showApiLoader
    }), shallowEqual);


    const addClassRespRef = useRef<any>({
        prevAddClassResp: addClassResp,
        prevUpdateClassResp: updateClassResp
    });

    useEffect(() => {
        if (!props.isOpen) {
            addClassForm.resetForm();
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (props.editCurriculumData) {
            setAddClassState(getInitialState(props.editCurriculumData));
        } else {
            setAddClassState(getInitialState());
        }
    }, [props.editCurriculumData]);

    useEffect(() => {
        const { prevAddClassResp, prevUpdateClassResp } = addClassRespRef.current;
        if (addClassResp && prevAddClassResp !== addClassResp) {
            props.toggle(true);
            toast.success("Class added successfully.")
        } else if (updateClassResp && prevUpdateClassResp !== updateClassResp) {
            props.toggle(true);
            toast.success("Class updated successfully.")
        }
        addClassRespRef.current.prevAddClassResp = addClassResp;
        addClassRespRef.current.prevUpdateClassResp = updateClassResp;
    }, [addClassResp, updateClassResp]);

    function addNewCurriculumHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                uniqueId: generateUniqueNumber(), className: "",
                classOrder: "",
                shortName: ""
            });
        }
    }

    function removecurriculumHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }


    const addClassForm = useFormik({
        enableReinitialize: true,
        initialValues: addClassState,
        validationSchema,
        onSubmit: (values) => {
            if (props.classId) {
                const updateClassPayload = values.classes[0];
                delete updateClassPayload.uniqueId;
                dispatch(updateInstClassAct(generateActionPayload("update_inst_class", undefined, updateClassPayload)));
            } else {
                const addClassPayload = values.classes.map(item => ({
                    className: item.className, shortName: item.shortName,
                    classOrder: item.classOrder
                })),
                    params = { instituteId: props.instituteId };
                dispatch(addInstClassAct(generateActionPayload("add_inst_class", params, addClassPayload)));
            }
        },
    });

    return (

        <div className="tw-grid tw-grid-cols-12 tw-gap-y-4 tw-p-5">

            <div className="tw-col-span-12 tw-mb-3">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                    <div className="tw-col-span-5">
                        <div className="tw-flex tw-items-center">
                            <h6 className="tw-mb-0 tw-mr-2 tw-text-sm tw-font-medium">
                                Class Name
                            </h6>

                            {!props.classId && (
                                <Button
                                    variant="hoverInfo"
                                    className="!tw-p-0"
                                    onClick={addNewCurriculumHndlr}
                                >
                                    <i className="ri-add-line tw-text-lg" />
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="tw-col-span-7">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                            <div className="tw-col-span-6">
                                <h6 className="tw-mb-0 tw-text-sm tw-font-medium">
                                    Class Order
                                </h6>
                            </div>

                            <div className="tw-col-span-6">
                                <h6 className="tw-mb-0 tw-text-sm tw-font-medium">
                                    Short Name
                                </h6>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <div className="tw-col-span-12">
                <FormikProvider value={addClassForm}>
                    <FieldArray name="classes">
                        {(arrayHelpers: ArrayHelpers) => {
                            if (!formikArrayHelpers.current) {
                                formikArrayHelpers.current = arrayHelpers;
                            }

                            return (
                                <>
                                    {addClassForm.values.classes.length > 0 &&
                                            addClassForm.values.classes.map((curriculum: any, index: number) => {
                                                const inputFieldErrors: any = addClassForm.errors.classes && addClassForm.errors.classes[index] || {};
                                                const inputFieldTouched = addClassForm.touched.classes && addClassForm.touched.classes[index] || {};
                                                return (
                                                    <div
                                                        key={curriculum.uniqueId}
                                                        className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-3"
                                                    >
                                                        <div className="tw-col-span-5">
                                                            <TextInput
                                                                name={`classes[${index}].className`}
                                                                value={curriculum.className}
                                                                formgroupClassName="tw-mb-0"
                                                                onChange={addClassForm.handleChange}
                                                                invalid={(inputFieldTouched.className && inputFieldErrors.className) ? true : false}
                                                                error={(inputFieldTouched.className && inputFieldErrors.className) ? inputFieldErrors.className : ""}
                                                            />
                                                        </div>

                                                        <div className="tw-col-span-7">
                                                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                                                                <div className="tw-col-span-6">
                                                                    <TextInput
                                                                        name={`classes[${index}].classOrder`}
                                                                        value={curriculum.classOrder}
                                                                        formgroupClassName="tw-mb-0"
                                                                        onChange={addClassForm.handleChange}
                                                                        invalid={(inputFieldTouched.classOrder && inputFieldErrors.classOrder) ? true : false}
                                                                        error={(inputFieldTouched.classOrder && inputFieldErrors.classOrder) ? inputFieldErrors.classOrder : ""}
                                                                    />
                                                                </div>

                                                                <div className="tw-col-span-6">
                                                                    <div className="tw-flex tw-items-center tw-justify-between tw-gap-2">
                                                                        <TextInput
                                                                            name={`classes[${index}].shortName`}
                                                                            inputClassName="tw-w-4/5"
                                                                            value={curriculum.shortName}
                                                                            formgroupClassName="tw-mb-0"
                                                                            onChange={addClassForm.handleChange}
                                                                            invalid={(inputFieldTouched.shortName && inputFieldErrors.shortName) ? true : false}
                                                                            error={(inputFieldTouched.shortName && inputFieldErrors.shortName) ? inputFieldErrors.shortName : ""}
                                                                        />

                                                                        {index !== 0 && (
                                                                            <Button
                                                                                variant="wrong"
                                                                                data-id={curriculum.id}
                                                                                data-index={index}
                                                                                onClick={removecurriculumHndlr}
                                                                            >
                                                                                <i className="ri-delete-bin-2-fill" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}
                                </>
                            );
                        }}
                    </FieldArray>
                </FormikProvider>
            </div>

            <div className="tw-col-span-12 tw-flex tw-justify-end tw-gap-2 tw-mt-4 tw-mb-1">

                <Button
                variant="secondary"
                    type="button"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>

                <Button
                variant="primary"
                    type="button"
                    onClick={(event: any) => addClassForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    {props.classId ? "Update" : "Submit"}
                </Button>

            </div>
        </div>
    )
}

export default React.memo(AddClassModal);