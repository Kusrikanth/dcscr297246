import React, {  useRef, useState, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import { TextInput } from "../../../Components/Common";
// Formik validation
import * as Yup from "yup";
import {  FieldArray, useFormik, ArrayHelpers, FormikProvider } from "formik";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";

//Common Utility
import { generateUniqueNumber } from "../../../utility/commonutility";

//Interface and Types
import { IAddCurriculumState } from "./curriculumtypes";
import { addInstCurriculumAct, updateInstCurriculumAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import Button from "../../../Components/Common/Button";

function getInitialState(editData?: any): any {
    const data: any = {
        uniqueId: generateUniqueNumber(),
        instituteCurriculumId: undefined,
        curriculumName: "",
        shortName: ""
    };
    if (editData) {
        const { curriculumName, instituteCurriculumId, shortName } = editData || {};
        data.uniqueId = instituteCurriculumId;
        data.instituteCurriculumId = instituteCurriculumId;
        data.curriculumName = curriculumName;
        data.shortName = shortName;
    }
    return { curriculums: [data] }
}

const validationSchema = Yup.object().shape({
    curriculums: Yup.array().of(
        Yup.object().shape({
            curriculumName: Yup.string().required("Name is required."),
            shortName: Yup.string().required("Short Name is required."),
        })
    ),
});

const AddEditCurriculum: React.FC<any> = (props) => {
    const [curriculumListState, setCurriculumListSate] = useState<IAddCurriculumState>(() => getInitialState());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const dispatch = useAppDispatch();
    const { addCurriculumResp, updateCurriculumResp,showApiLoader } = useAppSelector(({ instAcademics,globalData }) => ({
        addCurriculumResp: instAcademics.addCurriculumResp,
        updateCurriculumResp: instAcademics.updateCurriculumResp,
        showApiLoader:globalData.showApiLoader,
    }), shallowEqual);


    const addDepartmentRespRef = useRef<any>({
        prevAddCurriculumResp: addCurriculumResp,
        prevUpdateCurriculumResp: updateCurriculumResp
    });

    useEffect(() => {
        if (!props.isOpen) {
            addCurriculumForm.resetForm();
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (props.editCurriculumData) {
            setCurriculumListSate(getInitialState(props.editCurriculumData));
        } else {
            setCurriculumListSate(getInitialState());
        }
    }, [props.editCurriculumData]);

    useEffect(() => {
        const { prevAddCurriculumResp, prevUpdateCurriculumResp } = addDepartmentRespRef.current;
        if (addCurriculumResp && prevAddCurriculumResp !== addCurriculumResp) {
            props.toggle(true);
            toast.success("Curriculum added successfully.")
        } else if (updateCurriculumResp && prevUpdateCurriculumResp !== updateCurriculumResp) {
            props.toggle(true);
            toast.success("Curriculum updated successfully.")
        }
        addDepartmentRespRef.current.prevAddCurriculumResp = addCurriculumResp;
        addDepartmentRespRef.current.prevUpdateCurriculumResp = updateCurriculumResp;
    }, [addCurriculumResp, updateCurriculumResp]);

    function addNewCurriculumHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), curriculumName: "", shortName: "" });
        }
    }

    function removecurriculumHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }


    const addCurriculumForm = useFormik({
        enableReinitialize: true,
        initialValues: curriculumListState,
        validationSchema,
        onSubmit: (values) => {
            if (props.curriculumId) {
                const updateCurriculumPayload = values.curriculums[0];
                delete updateCurriculumPayload.uniqueId;
                dispatch(updateInstCurriculumAct(generateActionPayload("update_inst_curriculum", undefined, updateCurriculumPayload)));
            } else {
                const params = { instituteId: props.instituteId },
                    addCurriculumPayload = values.curriculums.map(item => ({ curriculumName: item.curriculumName, shortName: item.shortName }));
                dispatch(addInstCurriculumAct(generateActionPayload("add_inst_curriculum", params, addCurriculumPayload)));
            }
        },
    });

    return (

        <div className="tw-grid tw-grid-cols-12 tw-gap-y-4 tw-p-5">

            <div className="tw-col-span-12 tw-mb-3">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                    <div className="tw-col-span-6">
                        <div className="tw-flex tw-items-center">
                            <h6 className="tw-mb-0 tw-mr-2 tw-text-sm tw-font-medium">
                                Curriculum Name
                            </h6>

                            {!props.curriculumId && (
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

                    <div className="tw-col-span-6 tw-flex tw-items-center">
                        <h6 className="tw-mb-0 tw-text-sm tw-font-medium">
                            Short Name
                        </h6>
                    </div>

                </div>
            </div>

            <div className="tw-col-span-12">
                <FormikProvider value={addCurriculumForm}>
                    <FieldArray name="curriculums">
                        {(arrayHelpers: ArrayHelpers) => {
                            if (!formikArrayHelpers.current) {
                                formikArrayHelpers.current = arrayHelpers;
                            }

                            return (
                                <>
                                    {addCurriculumForm.values.curriculums.length > 0 &&
                                            addCurriculumForm.values.curriculums.map((curriculum: any, index: number) => {
                                                const inputFieldErrors: any = addCurriculumForm.errors.curriculums && addCurriculumForm.errors.curriculums[index] || {};
                                                const inputFieldTouched = addCurriculumForm.touched.curriculums && addCurriculumForm.touched.curriculums[index] || {};
                                                return (
                                                    <div
                                                        key={curriculum.uniqueId}
                                                        className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-3"
                                                    >
                                                        <div className="tw-col-span-6">
                                                            <TextInput
                                                                name={`curriculums[${index}].curriculumName`}
                                                                value={curriculum.curriculumName}
                                                                formgroupClassName="tw-mb-0"
                                                                onChange={addCurriculumForm.handleChange}
                                                                invalid={(inputFieldTouched.curriculumName && inputFieldErrors.curriculumName) ? true : false}
                                                                error={(inputFieldTouched.curriculumName && inputFieldErrors.curriculumName) ? inputFieldErrors.curriculumName : ""}
                                                            />
                                                        </div>

                                                        {/* Short Name + Delete */}
                                                        <div className="tw-col-span-6">
                                                            <div className="tw-flex tw-items-center tw-justify-between tw-gap-2">
                                                                <TextInput
                                                                    name={`curriculums[${index}].shortName`}
                                                                    inputClassName="tw-w-4/5"
                                                                    value={curriculum.shortName}
                                                                    formgroupClassName="tw-mb-0"
                                                                    onChange={addCurriculumForm.handleChange}
                                                                    invalid={(inputFieldTouched.shortName && inputFieldErrors.shortName) ? true : false}
                                                                    error={(inputFieldTouched.shortName && inputFieldErrors.shortName) ? inputFieldErrors.shortName : ""}
                                                                />

                                                                {index !== 0 && (
                                                                    <Button
                                                                        type="button"
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
                    type="button"
                    variant="secondary"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    onClick={(event: any) => addCurriculumForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    {props.curriculumId ? "Update" : "Submit"}
                </Button>

            </div>
        </div>
    )
}

export default React.memo(AddEditCurriculum);

