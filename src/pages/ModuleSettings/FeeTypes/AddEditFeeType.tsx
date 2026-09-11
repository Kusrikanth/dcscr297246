import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { Row, Col, Label, Input, Button } from "reactstrap";
import { ModalContainer, DateInput, TextInput, SelectInput, PhoneInput } from "../../../Components/Common";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

// Formik validation
import * as Yup from "yup";
import { Formik, FieldArray, useFormik, Form, ArrayHelpers, FormikErrors, FormikProvider } from "formik";

//Common Utility
import { generateUniqueNumber } from "../../../utility/commonutility";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { addInstAcademicTermAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { getMasterTermTypesAct, getMasterAcademicTermAct } from "../../../store/masterdata/masterdataactions";
import { addFeeTypesAct, updateFeeTypeAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

//Interface & Types
import { IAcademicYearInfo, IAddAcademicYearModel } from "../../../store/mastersettings/instacademics/instacademictypes";
import { IAddAcademicTermProps, IAddEditAcademicTermRespRef } from "./academictermstypes";


interface IAddAcademicTermModel {
    feeTypeName: string,
    feeType: string,
    noOfTerms: string,
    terms: { uniqueId: string, termTypeName: string, shortTypeName: string }[]
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
    },
    { id: "7", name: "7" }, { id: "8", name: "8" }, { id: "9", name: "9" }, { id: "10", name: "10" },
    { id: "11", name: "11" }, { id: "12", name: "12" }
]
const feeTypes = [
    {
        id: "TERM",
        name: "Term"
    },
    {
        id: "MONTH",
        name: "Month"
    },
    {
        id: "ONETIME",
        name: "One Time"
    }
]

function getAddEditTermData(editData?: any): IAddAcademicTermModel {
    const { terms } = editData || {},
        updatedTermsList: any = [];
    if (Array.isArray(terms)) {
        for (let i = 0; i < terms.length; i++) {
            updatedTermsList.push({
                uniqueId: terms[i].id,
                termId: terms[i].id,
                termTypeName: terms[i].termTypeName,
                shortTypeName: terms[i].shortTypeName
            });
        }
    }
    return {
        feeTypeName: editData ? editData.feeTypeName : "",
        feeType: editData?.feeType || "",
        noOfTerms: editData ? "1" : "",
        terms: updatedTermsList
    }
}


const validationSchema = Yup.object().shape({
    feeTypeName: Yup.string().required("Fee term is required."),
    feeType: Yup.string().required("Fee type is required."),
    noOfTerms: Yup.string().required("Select number of terms."),
    terms: Yup.array().of(
        Yup.object().shape({
            termTypeName: Yup.string().required("Terms is required."),
            shortTypeName: Yup.string().required("Short Name is required.").nullable()
        })
    ),
});

const AddEditAcademicTerm: React.FC<any> = (props) => {

    const [addAcademicTermState, setAcademicTermState] = useState<IAddAcademicTermModel>(() => getAddEditTermData());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const dispatch = useAppDispatch();
    const { addFeeTypesResp, updateFeeTypeResp, masterAcademicTermsResp,
        masterTermTypesResp } = useAppSelector(({ instAcademics, masterFeeSettings, masterData }) => ({
            masterAcademicTermsResp: masterData.masterAcademicTermsResp,
            addFeeTypesResp: masterFeeSettings.addFeeTypesResp,
            updateFeeTypeResp: masterFeeSettings.updateFeeTypeResp,
            masterTermTypesResp: masterData.masterTermTypesResp,
        }), shallowEqual);

    // useEffect(() => {
    //     if (!masterAcademicTermsResp) {
    //         dispatch(getMasterAcademicTermAct(generateActionPayload("get_master_academic_terms")));
    //     }
    //     return () => addTermForm.resetForm();
    // }, [masterAcademicTermsResp]);

    const addEditAcademicYearRespRef = useRef<any>({
        prevAddFeeTypesResp: addFeeTypesResp,
        prevUpdateFeeTypeResp: updateFeeTypeResp
    });

    useEffect(() => {
        const { prevAddFeeTypesResp, prevUpdateFeeTypeResp } = addEditAcademicYearRespRef.current;
        if (addFeeTypesResp && addFeeTypesResp !== prevAddFeeTypesResp) {
            props.toggle(true);
            toast.success("Fee term added successfully.");
        }
        else if (updateFeeTypeResp && updateFeeTypeResp !== prevUpdateFeeTypeResp) {
            props.toggle({ pageNo: 0, sortBy: "" }, true);
            toast.success("Fee term updated successfully.")
        }
        addEditAcademicYearRespRef.current.prevAddFeeTypesResp = addFeeTypesResp;
        addEditAcademicYearRespRef.current.prevUpdateFeeTypeResp = updateFeeTypeResp;
    }, [addFeeTypesResp, updateFeeTypeResp]);

    function addNewTermHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), termTypeName: "", shortTypeName: "" });
        }
    }

    function removeTermHandler(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    // function onChangeTermHndlr(event: React.ChangeEvent<HTMLSelectElement>) {
    //     const { name, value } = event.target,
    //         { values } = addAcademicTermForm, { terms } = values || {},
    //         termIndex = name.substring(name.indexOf(".") + 1, name.lastIndexOf(".")),
    //         numberKey = Number(termIndex);
    //     if (!isNaN(numberKey) && numberKey > -1) {
    //         const termData = terms[numberKey],
    //             { name: shortCode } = masterAcademicTermsResp.find((item: any) => item.id === value) || {};
    //         Object.assign(termData, { masterTermId: value, shortTypeName });
    //         formikArrayHelpers.current?.replace(Number(termIndex), termData);
    //         if (Object.keys(addAcademicTermForm.touched).length > 0) {
    //             addAcademicTermForm.validateForm();
    //         }
    //     }
    // }

    function onChangeNoOfTermHndlr(event: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = event.target;
        addTermForm.setValues(prevState => ({ ...prevState, [name]: value, terms: [] }));
        updateTermsList(value);
        // addAcademicTermForm.setFielva(name, value);
        // addAcademicTermForm;

    }

    function updateTermsList(termsCount: any) {
        const { terms } = addTermForm.values;
        if (Number(termsCount) > 0 && formikArrayHelpers.current) {
            for (let i = 0; i < Number(termsCount); i++) {
                formikArrayHelpers.current.push({
                    uniqueId: `terms-${i}`, termTypeName: terms[i]?.termTypeName || "",
                    shortTypeName: terms[i]?.shortTypeName || ""
                });
            }
        }
    }
    function onchangeFeeTypeHndlr(event: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = event.target;
        addTermForm.setValues(prevState => ({ ...prevState, [name]: value, terms: [] }));
        if (value === "ONETIME") {
            addTermForm.setValues(prevState => ({ ...prevState, [name]: value, noOfTerms: "1", terms: [] }));
            updateTermsList(1);
        } else if (value === "MONTH") {
            addTermForm.setValues(prevState => ({ ...prevState, [name]: value, noOfTerms: "12", terms: [] }));
            updateTermsList(12);
        } else {
            addTermForm.setValues(prevState => ({ ...prevState, [name]: value, noOfTerms: "1", terms: [] }));
            updateTermsList(1);
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
            if (props.feeTypeId) {
                const { terms } = values,
                    filteredTerms = terms.map(item => {
                        const { uniqueId, ...otherInfo } = item;
                        return ({ ...otherInfo })
                    }),
                    params = { feeTypeId: props.feeTypeId }, payload = {
                        terms: filteredTerms
                    };
                dispatch(updateFeeTypeAct(generateActionPayload("update_fee_type", params, payload)));
            } else {
                const { feeTypeName, feeType, terms } = values,
                    filteredTerms = terms.map(item => ({ termTypeName: item.termTypeName, shortTypeName: item.shortTypeName })),
                    payload: any = {
                        instituteId: props.instituteId,
                        feeTypeName,
                        feeType,
                        noOfTerms: terms.length,
                        terms: filteredTerms
                    };
                dispatch(addFeeTypesAct(generateActionPayload("add_fee_type", undefined, payload)));
            }
        },
    });
    return (
        <form id={props.formId} onSubmit={addTermForm.handleSubmit}>
            <div className="tw-grid tw-grid-cols-12 tw-px-3 tw-gap-3">
                <div className="tw-col-span-6">
                    <TextInput
                        name="feeTypeName"
                        labelText="Fee Types"
                        value={addTermForm.values.feeTypeName}
                        onChange={addTermForm.handleChange}
                        invalid={(addTermForm.touched.feeTypeName && addTermForm.errors.feeTypeName) ? true : false}
                        error={(addTermForm.touched.feeTypeName && addTermForm.errors.feeTypeName) ? addTermForm.errors.feeTypeName : ""}
                        isDisabled={!!props.feeTypeId}
                    />
                </div>
                <div className="tw-col-span-6">
                    <SelectInput
                        name="feeType"
                        labelText="Fee Type"
                        value={addTermForm.values.feeType}
                        onChange={onchangeFeeTypeHndlr}
                        invalid={(addTermForm.touched.feeType && addTermForm.errors.feeType) ? true : false}
                        error={(addTermForm.touched.feeType && addTermForm.errors.feeType) ? addTermForm.errors.feeType : ""}
                        menuItems={feeTypes}
                        valueKey="id"
                        textKey="name"
                        isDisabled={!!props.editModalData}
                    />
                </div>
                <div className="tw-col-span-12 tw-border-b tw-border-gray-200">
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
                        isDisabled={!!props.editModalData || (addTermForm.values.feeType !== "TERM")}
                    />
                </div>
            </div>

            {/* <hr /> */}

            <div className="tw-grid tw-grid-cols-12 tw-px-3 tw-mt-3">
                <div className="tw-col-span-12 tw-mb-3">
                    <div className="tw-grid tw-grid-cols-12">
                        <div className="tw-col-span-6">
                            <div className="tw-flex tw-flex-row tw-items-center">
                                <h6 className="tw-mb-0 tw-mr-2 tw-text-base tw-font-semibold">Term Name</h6>
                                {/* <button 
              onClick={addNewTermHndlr} 
              className="tw-px-2 tw-py-1 tw-bg-transparent tw-text-blue-600 tw-border tw-border-blue-600 tw-rounded tw-text-sm hover:tw-bg-blue-50 tw-transition-colors"
            >
              <i className="ri-add-line tw-text-lg" />
            </button> */}
                            </div>
                        </div>
                        <div className="tw-col-span-6">
                            <h6 className="tw-mb-0 tw-text-base tw-font-semibold">Short Name</h6>
                        </div>
                    </div>
                </div>

                <div style={{ maxHeight: "200px", overflowY: "auto" }} className="tw-col-span-12">
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
                                                const inputFieldErrors: any = addTermForm.errors.terms && addTermForm?.errors?.terms[index] || {};
                                                const inputFieldTouched: any = addTermForm.touched.terms && addTermForm?.touched?.terms[index] || {};
                                                return (
                                                    <div key={term.uniqueId} className="tw-grid tw-grid-cols-12 tw-mb-3 tw-gap-3">
                                                        <div className="tw-col-span-6">
                                                            <TextInput
                                                                name={`terms.${index}.termTypeName`}
                                                                data-index={index}
                                                                value={term.termTypeName}
                                                                formgroupClassName="tw-mb-0"
                                                                onChange={addTermForm.handleChange}
                                                                invalid={(inputFieldTouched.termTypeName && inputFieldErrors.termTypeName) ? true : false}
                                                                error={(inputFieldTouched.termTypeName && inputFieldErrors.termTypeName) ? inputFieldErrors.termTypeName : ""}
                                                                isDisabled={!addTermForm.values.noOfTerms}
                                                            />
                                                        </div>
                                                        <div className="tw-col-span-6">
                                                            <div className="tw-flex tw-flex-row tw-items-center">
                                                                <TextInput
                                                                    name={`terms.${index}.shortTypeName`}
                                                                    // inputClassName="tw-w-4/5"
                                                                    value={term.shortTypeName}
                                                                    formgroupClassName="tw-mb-0"
                                                                    onChange={addTermForm.handleChange}
                                                                    invalid={(inputFieldTouched.shortTypeName && inputFieldErrors.shortTypeName) ? true : false}
                                                                    error={(inputFieldTouched.shortTypeName && inputFieldErrors.shortTypeName) ? inputFieldErrors.shortTypeName : ""}
                                                                    maxLength={10}
                                                                    isDisabled={!addTermForm.values.noOfTerms}
                                                                />
                                                                {/* {(index !== 0) && (
                              <button 
                                data-index={index} 
                                onClick={removeTermHandler} 
                                className="tw-px-2 tw-py-1 tw-bg-white tw-text-red-600 tw-border-0 tw-rounded-full hover:tw-bg-red-50 tw-transition-colors tw-ml-2"
                              >
                                <i className="ri-delete-bin-2-fill" />
                              </button>
                            )} */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </>
                                )
                            }}
                        </FieldArray>
                    </FormikProvider>
                </div>
            </div>
        </form>
    )
}

export default AddEditAcademicTerm;