import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { TextInput, SelectInput } from "../../../Components/Common";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

// Formik validation
import * as Yup from "yup";
import {  FieldArray, useFormik,ArrayHelpers, FormikProvider } from "formik";

//Common Utility
import { generateUniqueNumber } from "../../../utility/commonutility";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {  addInstTermAct, updateInstTermAct } from "../../../store/mastersettings/instacademics/instacademicactions";

//Interface & Types
import {  IAddEditAcademicTermRespRef } from "./academictermstypes";


interface IAddAcademicTermModel {
    termTypeId: string,
    noOfTerms: string,
    terms: { uniqueId: string, termName: string, shortName: string }[]
}

const numberOfTerms = [
    {
        id: "1",
        name: "1"
    }, {
        id: "2",
        name: "2"
    },
    {
        id: "3",
        name: "3"
    },
    {
        id: "4",
        name: "4"
    },
    {
        id: "5",
        name: "5"
    }
]

function getAddEditTermData(editData?: any): IAddAcademicTermModel {

    return {
        termTypeId: editData ? editData.masterTermTypeId : "",
        noOfTerms: editData ? "1" : "",
        terms: [{
            uniqueId: editData ? editData.instituteTermId : generateUniqueNumber(),
            termName: editData ? editData.termName : "",
            shortName: editData ? editData.shortName : ""
        }]
    }
}


const validationSchema = Yup.object().shape({
    termTypeId: Yup.string().required("Term type is required."),
    noOfTerms: Yup.string().required("Select number of terms."),
    terms: Yup.array().of(
        Yup.object().shape({
            termName: Yup.string().required("Terms is required."),
            shortName: Yup.string().required("Short Name is required.")
        })
    ),
});

const AddEditAcademicTerm: React.FC<any> = (props) => {

    const [addAcademicTermState, setAcademicTermState] = useState<IAddAcademicTermModel>(() => getAddEditTermData());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const dispatch = useAppDispatch();
    const { addTermResp, updateTermResp, masterAcademicTermsResp,
        masterTermTypesResp } = useAppSelector(({ instAcademics, masterData }) => ({
            updateTermResp: instAcademics.updateTermResp,
            addTermResp: instAcademics.addTermResp,
            masterAcademicTermsResp: masterData.masterAcademicTermsResp,
            masterTermTypesResp: masterData.masterTermTypesResp,
        }), shallowEqual);

    const addEditAcademicYearRespRef = useRef<IAddEditAcademicTermRespRef>({
        prevAddAcademicTermResp: addTermResp,
        prevUpdateAcademicTermResp: updateTermResp
    });

    useEffect(() => {
        const { prevAddAcademicTermResp, prevUpdateAcademicTermResp } = addEditAcademicYearRespRef.current;
        if (addTermResp && addTermResp !== prevAddAcademicTermResp) {
            props.toggle({ pageNo: 0, sortBy: "" }, true);
            toast.success("Term added successfully.");
        }
        else if (updateTermResp && updateTermResp !== prevUpdateAcademicTermResp) {
            props.toggle({ pageNo: 0, sortBy: "" }, true);
            toast.success("Term updated successfully.")
        }
        addEditAcademicYearRespRef.current.prevAddAcademicTermResp = addTermResp;
        addEditAcademicYearRespRef.current.prevUpdateAcademicTermResp = updateTermResp;
    }, [addTermResp, updateTermResp]);

    function addNewTermHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), termName: "", shortName: "" });
        }
    }

    function removeTermHandler(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    function onChangeNoOfTermHndlr(event: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = event.target,
            { terms } = addTermForm.values;
        addTermForm.setValues(prevState => ({ ...prevState, [name]: value, terms: [] }));
        if (Number(value) > 0 && formikArrayHelpers.current) {
            for (let i = 0; i < Number(value); i++) {
                formikArrayHelpers.current.push({
                    uniqueId: `terms-${i}`, termName: terms[i]?.termName || "",
                    shortName: terms[i]?.shortName || ""
                });
            }
        }

    }
    useEffect(() => {
        setAcademicTermState(getAddEditTermData(props.editModalData))
    }, [props.editModalData])
    const addTermForm = useFormik({
        enableReinitialize: true,
        initialValues: addAcademicTermState,
        validationSchema,
        onSubmit: (values) => {
            if (props.termId) {
                const payload = {
                    instituteTermId: values.terms[0].uniqueId,
                    termName: values.terms[0].termName,
                    shortName: values.terms[0].shortName
                }

                dispatch(updateInstTermAct(generateActionPayload("update_inst_term", undefined, payload)));
            } else {
                const { termTypeId, terms } = values,
                    filteredTerms = terms.map(item => ({ termName: item.termName, shortName: item.shortName })),
                    payload = filteredTerms;
                const apiParams = { instituteId: props.instituteId, masterTermTypeId: termTypeId }
                dispatch(addInstTermAct(generateActionPayload("add_inst_term", apiParams, payload)));
            }
        },
    });
    return (
        <form id={props.formId} onSubmit={addTermForm.handleSubmit}>

            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-px-3">

                <div className="tw-col-span-12">
                    <SelectInput
                        name="termTypeId"
                        labelText="Term Type"
                        value={addTermForm.values.termTypeId}
                        onChange={addTermForm.handleChange}
                        invalid={(addTermForm.touched.termTypeId && addTermForm.errors.termTypeId) ? true : false}
                        error={(addTermForm.touched.termTypeId && addTermForm.errors.termTypeId) ? addTermForm.errors.termTypeId : ""}
                        menuItems={masterTermTypesResp || []}
                        valueKey="masterTermTypeId"
                        textKey="masterTermTypeName"
                        defaultSelect="Term Type"
                        isDisabled={!!props.termId}
                    />
                </div>

                <div className="tw-col-span-12 tw-border-b tw-pb-4">
                    <SelectInput
                        name="noOfTerms"
                        labelText="No Of Terms"
                        value={addTermForm.values.noOfTerms}
                        onChange={onChangeNoOfTermHndlr}
                        invalid={(addTermForm.touched.noOfTerms && addTermForm.errors.noOfTerms) ? true : false}
                        error={(addTermForm.touched.noOfTerms && addTermForm.errors.noOfTerms) ? addTermForm.errors.noOfTerms : ""}
                        menuItems={numberOfTerms}
                        valueKey="id"
                        textKey="name"
                        defaultSelect="Select Number Of Term"
                        isDisabled={!!props.editModalData}
                    />
                </div>
            </div>

            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-px-3 tw-mt-3">

                <div className="tw-col-span-12 tw-mb-3">
                    <div className="tw-grid tw-grid-cols-12">

                        <div className="tw-col-span-6">
                            <div className="tw-flex tw-items-center">
                                <h6 className="tw-mb-0 tw-mr-2 tw-font-medium">
                                    Term Name
                                </h6>
                            </div>
                        </div>

                        <div className="tw-col-span-6">
                            <h6 className="tw-mb-0 tw-font-medium">
                                Short Name
                            </h6>
                        </div>

                    </div>
                </div>

                <div className="tw-col-span-12">
                    <FormikProvider value={addTermForm}>
                        <FieldArray name="terms">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }
                                return (
                                    <>
                                        {addTermForm.values.terms.length > 0 &&
                                            addTermForm.values.terms.map((term, index) => {

                                                const inputFieldErrors: any =
                                                    (addTermForm.errors.terms &&
                                                        addTermForm?.errors?.terms[index]) || {};

                                                const inputFieldTouched: any =
                                                    (addTermForm.touched.terms &&
                                                        addTermForm?.touched?.terms[index]) || {};

                                                return (
                                                    <div
                                                        key={term.uniqueId}
                                                        className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-3"
                                                    >
                                                        <div className="tw-col-span-12 md:tw-col-span-6">
                                                            <TextInput
                                                                name={`terms.${index}.termName`}
                                                                data-index={index}
                                                                value={term.termName}
                                                                formgroupClassName="tw-mb-0"
                                                                onChange={addTermForm.handleChange}
                                                                invalid={(inputFieldTouched.termName && inputFieldErrors.termName) ? true : false}
                                                                error={(inputFieldTouched.termName && inputFieldErrors.termName) ? inputFieldErrors.termName : ""}
                                                                isDisabled={!addTermForm.values.noOfTerms}
                                                            />
                                                        </div>

                                                        {/* Short Name */}
                                                        <div className="tw-col-span-12 md:tw-col-span-6">
                                                            <div className="tw-flex tw-items-center tw-gap-2">
                                                                <TextInput
                                                                    name={`terms.${index}.shortName`}
                                                                    value={term.shortName}
                                                                    formgroupClassName="tw-mb-0"
                                                                    onChange={addTermForm.handleChange}
                                                                    invalid={(inputFieldTouched.shortName && inputFieldErrors.shortName) ? true : false}
                                                                    error={(inputFieldTouched.shortName && inputFieldErrors.shortName) ? inputFieldErrors.shortName : ""}
                                                                    maxLength={10}
                                                                    isDisabled={!addTermForm.values.noOfTerms}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </>
                                );
                            }}
                        </FieldArray>
                    </FormikProvider>
                </div>
            </div>
        </form>
    )
}

export default AddEditAcademicTerm;