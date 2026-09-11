import React, { useEffect, useRef, useState, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { Row, Col, } from "reactstrap";
import { MultiSelect, TextInput, SelectInput, RadioInputContainer } from "../../../Components/Common";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

// Formik validation
import * as Yup from "yup";
import { Formik, FieldArray, useFormik, ArrayHelpers, FormikProvider } from "formik";

//Common Utility
import { generateUniqueNumber } from "../../../utility/commonutility";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    addFeeConcessionAct, updateFeeConcessionAct, getFeeCategoriesAct, getFeeParticularsAct

} from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

//Helper
import { modeOptions, getExperienceOptions } from "./helper";
import Button from "../../../Components/Common/Button";

interface IAddAcademicTermModel {
    concessionType: string,
    noOfTerms: string,
    feeDetails: { uniqueId: string, termTypeName: string, shortTypeName: string }[]
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

function getConcessionModalData(editData?: any): any {
    const { feeDetails } = editData || {},
        updatedFeeDetails: any = [],
        categoriesId: any = [];
    if (feeDetails) {
        updatedFeeDetails.push({
            uniqueId: `feeDetails-${feeDetails.deptId}-${feeDetails.feeParticularId}`,
            deptId: feeDetails?.deptId,
            categoryName: feeDetails?.feeInstituteName,
            feeParticularId: feeDetails?.feeParticularId,
            feeParticularName: feeDetails?.feeParticularName,
            curriculumShortName: feeDetails?.curriculumShortName,
            percValue: feeDetails?.percValue,
        });
        categoriesId.push(feeDetails?.deptId);
    }
    return {
        concessionType: editData?.concessionType || "EMPLOYEE",
        experience: editData?.experience || "",
        feeCategoriesId: categoriesId,
        mode: editData?.mode || "PERCENTAGE",
        feeDetails: updatedFeeDetails
    }
}


const validationSchema = Yup.object().shape({
    concessionType: Yup.string().required("Concession is required."),
    experience: Yup.string().required("Experience is required."),
    feeCategoriesId: Yup.array().min(1, "Fee category is required."),
    feeDetails: Yup.array().of(
        Yup.object().shape({
            deptId: Yup.string().required("Category required."),
            feeParticularId: Yup.string().required("Fee particular is required.").nullable(),
            percValue: Yup.number().typeError("Enter valid number.").lessThan(101, "Percentage value cannot be more that 100.").required("Percentage required."),
        })
    ),
});

const AddEditFeeConcession: React.FC<any> = (props) => {
    const [addFeeConcessionState, setAddFeeConcessionState] = useState<any>(() => getConcessionModalData());
    const [selectedFeeCategoryListState, setSelectedFeeCategoryListState] = useState<any>([]);
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const [addedFeeCategoryIdState, setAddedFeeCategoryIdState] = useState(0);

    const experienceOptions: any = useMemo(() => {
        return getExperienceOptions(20);
    }, []);
    const dispatch = useAppDispatch();
    const { feeCategoriesResp, feeParticularsResp, addFeeConcessionResp, updateFeeConcessionResp } = useAppSelector(({ instAcademics, masterFeeSettings, masterData }) => ({
        feeCategoriesResp: masterFeeSettings.feeCategoriesResp,
        feeParticularsResp: masterFeeSettings.feeParticularsResp,
        addFeeConcessionResp: masterFeeSettings.addFeeConcessionResp,
        updateFeeConcessionResp: masterFeeSettings.updateFeeConcessionResp,
        masterTermTypesResp: masterData.masterTermTypesResp,
    }), shallowEqual);

    // useEffect(() => {
    //     if (!masterAcademicTermsResp) {
    //         dispatch(getMasterAcademicTermAct(generateActionPayload("get_master_academic_terms")));
    //     }
    //     return () => addFeeConcessionForm.resetForm();
    // }, [masterAcademicTermsResp]);

    const addEditAcademicYearRespRef = useRef<any>({
        prevAddFeeConcessionResp: addFeeConcessionResp,
        prevFeeParticularsResp: feeParticularsResp,
        prevUpdateFeeConcessionResp: updateFeeConcessionResp
    });

    useEffect(() => {
        const { prevAddFeeConcessionResp, prevFeeParticularsResp, prevUpdateFeeConcessionResp } = addEditAcademicYearRespRef.current;
        if (addFeeConcessionResp && addFeeConcessionResp !== prevAddFeeConcessionResp) {
            props.toggle(true);
            toast.success("Fee concession added successfully.");
        }
        else if (feeParticularsResp && prevFeeParticularsResp !== feeParticularsResp) {
            const { data: feeNames } = feeParticularsResp,
                selectedFeeCategoryInfo = feeCategoriesResp?.feeCategoryVOList.find((item: any) =>
                    item.id === addedFeeCategoryIdState);
            if (selectedFeeCategoryInfo && Array.isArray(feeNames) && formikArrayHelpers.current) {
                for (let j = 0; j < feeNames.length; j++) {
                    if (feeNames[j].allowEmployeeConcession === "YES") {
                        formikArrayHelpers?.current.push({
                            uniqueId: `feeDetails-${selectedFeeCategoryInfo.id}-${j}`,
                            deptId: selectedFeeCategoryInfo.id || "",
                            categoryName: selectedFeeCategoryInfo.name || "",
                            feeParticularId: feeNames[j].id,
                            feeParticularName: feeNames[j].particularName,
                            curriculumShortName: feeNames[j].curriculumShortName,
                            percValue: "",
                        });
                    }
                }
            }
        }
        else if (updateFeeConcessionResp && updateFeeConcessionResp !== prevUpdateFeeConcessionResp) {
            props.toggle(true);
            toast.success("Fee concession updated successfully.")
        }
        addEditAcademicYearRespRef.current.prevAddFeeConcessionResp = addFeeConcessionResp;
        addEditAcademicYearRespRef.current.prevFeeParticularsResp = feeParticularsResp;
        addEditAcademicYearRespRef.current.prevUpdateFeeConcessionResp = updateFeeConcessionResp;
    }, [addFeeConcessionResp, feeParticularsResp, updateFeeConcessionResp]);

    useEffect(() => {
        const { instituteId } = props;
        if (instituteId) {
            const payload = { instituteId, pageNo: 0, pageSize: 100 };
            dispatch(getFeeCategoriesAct(generateActionPayload("get_fee_categories", undefined, payload)));
            // dispatch(getFeeParticularsAct(generateActionPayload("get_fee_particulars", undefined, payload)));
        }
    }, [props.instituteId]);

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
    //         { values } = addAcademicTermForm, { feeDetails } = values || {},
    //         termIndex = name.substring(name.indexOf(".") + 1, name.lastIndexOf(".")),
    //         numberKey = Number(termIndex);
    //     if (!isNaN(numberKey) && numberKey > -1) {
    //         const termData = feeDetails[numberKey],
    //             { name: shortCode } = masterAcademicTermsResp.find((item: any) => item.id === value) || {};
    //         Object.assign(termData, { masterTermId: value, shortTypeName });
    //         formikArrayHelpers.current?.replace(Number(termIndex), termData);
    //         if (Object.keys(addAcademicTermForm.touched).length > 0) {
    //             addAcademicTermForm.validateForm();
    //         }
    //     }
    // }

    function onChangeNoOfTermHndlr(event: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = event.target,
            { feeDetails } = addFeeConcessionForm.values;
        addFeeConcessionForm.setValues((prevState: any) => ({ ...prevState, [name]: value, feeDetails: [] }));
        if (Number(value) > 0 && formikArrayHelpers.current) {
            for (let i = 0; i < Number(value); i++) {
                formikArrayHelpers.current.push({
                    uniqueId: `feeDetails-${i}`, termTypeName: feeDetails[i]?.termTypeName || "",
                    shortTypeName: feeDetails[i]?.shortTypeName || ""
                });
            }
        }
        // addAcademicTermForm.setFielva(name, value);
        // addAcademicTermForm;

    }
    useEffect(() => {
        if (props.editModalData && feeCategoriesResp) {
            const { editModalData } = props,
                { feeDetails } = editModalData || {},
                { feeCategoryVOList } = feeCategoriesResp;
            if (feeDetails && Array.isArray(feeCategoryVOList)) {
                const filteredParticulars = feeCategoryVOList.filter(item => item.id === +(feeDetails?.deptId));
                setSelectedFeeCategoryListState(filteredParticulars);
            }
            setAddFeeConcessionState(getConcessionModalData(props.editModalData))
        }
    }, [props.editModalData, feeCategoriesResp])
    const addFeeConcessionForm = useFormik({
        enableReinitialize: true,
        initialValues: addFeeConcessionState,
        validationSchema,
        onSubmit: (values) => {
            if (props.feeConcessionId) {
                const { feeDetails } = values,
                    filteredTerms = feeDetails.map((item: any) => {
                        const { percValue } = item;
                        return ({ percValue })
                    }),
                    params = { feeConcessionId: props.feeConcessionId }, payload = filteredTerms[0];
                dispatch(updateFeeConcessionAct(generateActionPayload("update_fee_concession", params, payload)));
            } else {
                const { feeCategoriesId, feeDetails, ...payload } = values,
                    filterFeeDetails = feeDetails.map((item: any) => {
                        const { uniqueId, categoryName, feeParticularName, curriculumShortName, ...otherInfo } = item;
                        return otherInfo;
                    }),
                    params = {
                        instituteId: props.instituteId,
                        branchId: props.branchId
                    }
                payload.feeDetails = filterFeeDetails;
                dispatch(addFeeConcessionAct(generateActionPayload("add_fee_concession", params, payload)));
            }
        },
    });
    function onSelectFeeCategoryHndlr(selectItem: any) {
        setSelectedFeeCategoryListState(selectItem);
        if (selectItem.length > selectedFeeCategoryListState.length) {
            const selectedId = selectItem.map((item: any) => item.id);
            const prevSelectedId = selectedFeeCategoryListState.map((item: any) => item.id),
                addedItem = selectItem.find((item: any) => (!prevSelectedId.includes(item.id)));
            if (addedItem.id) {
                getFeeParticularApiCall(addedItem.id);
                setAddedFeeCategoryIdState(addedItem.id);
                addFeeConcessionForm.setValues((prevState: any) => ({
                    ...prevState,
                    feeCategoriesId: selectedId,
                }));
            }
        } else if (selectItem.length < selectedFeeCategoryListState.length) {
            const selectedId = selectItem.map((item: any) => item.id),
                removedItemId = selectedFeeCategoryListState.find((item: any) => (!selectedId.includes(item.id)));
            if (removedItemId.id) {
                const { feeDetails } = addFeeConcessionForm.values,
                    updatdFeeDetails = feeDetails.filter((item: any) => +item.deptId !== +removedItemId.id);
                addFeeConcessionForm.setValues((prevState: any) => ({
                    ...prevState,
                    feeCategoriesId: selectedId,
                    feeDetails: updatdFeeDetails
                }));
            }
        } else {
            addFeeConcessionForm.setValues((prevState: any) => ({
                ...prevState,
                feeCategoriesId: [], feeDetails: []
            }));
        }
    }

    function getFeeParticularApiCall(feeCategoryId: any) {
        const payload = { instituteId: props.instituteId, branchId: props.branchId, feeCategoryId, pageNo: 0, pageSize: 100 };
        dispatch(getFeeParticularsAct(generateActionPayload("get_fee_particulars", undefined, payload)));
    }

    return (
        <form id={props.formId} onSubmit={addFeeConcessionForm.handleSubmit}>
            <div className="tw-p-4">
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <div>
                        <TextInput
                            name="concessionType"
                            labelText="Concession Type"
                            value={addFeeConcessionForm.values.concessionType}
                            onChange={undefined}
                            isDisabled={true}
                        />
                    </div>

                    <div>
                        <SelectInput
                            name="experience"
                            labelText="Experience"
                            value={addFeeConcessionForm.values.experience}
                            onChange={addFeeConcessionForm.handleChange}
                            invalid={(addFeeConcessionForm.touched.experience && addFeeConcessionForm.errors.experience) ? true : false}
                            error={(addFeeConcessionForm.touched.experience && addFeeConcessionForm.errors.experience) ? addFeeConcessionForm.errors.experience : ""}
                            menuItems={experienceOptions}
                            isDisabled={props.feeConcessionId}
                            labelClass="required"
                            valueKey="id"
                            textKey="name"
                        />
                    </div>

                    <div className="tw-col-span-full">
                        <MultiSelect
                            name="feeCategoriesId"
                            labelText="Fee Category"
                            onChange={onSelectFeeCategoryHndlr}
                            value={selectedFeeCategoryListState}
                            menuItems={feeCategoriesResp?.feeCategoryVOList}
                            labelClass="required"
                            textKey="name"
                            valueKey="id"
                            isDisabled={props.feeConcessionId}
                            error={(addFeeConcessionForm.touched.feeCategoriesId && addFeeConcessionForm.errors.feeCategoriesId) ? addFeeConcessionForm.errors.feeCategoriesId : ""}
                        />
                    </div>

                    <div className="tw-col-span-full tw-border-b tw-border-gray-200 tw-pb-3">
                        <RadioInputContainer
                            name="mode"
                            labelText="Mode"
                            radioOptions={modeOptions}
                            inputContainerClassName="tw-mt-1"
                            value={addFeeConcessionForm.values.mode}
                            onChange={addFeeConcessionForm.handleChange}
                            isDisabled={true}
                        />
                    </div>
                </div>

                <div className="tw-mt-4">
                    <div className="tw-grid tw-grid-cols-12 tw-mb-2">
                        <div className="tw-col-span-3">
                            <h6 className="tw-font-semibold tw-text-sm tw-required">
                                Fee Categories <span className="tw-text-red-500">*</span>
                            </h6>
                        </div>
                        <div className="tw-col-span-3">
                            <h6 className="tw-font-semibold tw-text-sm tw-required">
                                Fee Particular <span className="tw-text-red-500">*</span>
                            </h6>
                        </div>
                        <div className="tw-col-span-3">
                            <h6 className="tw-font-semibold tw-text-sm tw-required">
                                Curriculum <span className="tw-text-red-500">*</span>
                            </h6>
                        </div>
                        <div className="tw-col-span-3">
                            <h6 className="tw-font-semibold tw-text-sm tw-required">
                                Percentage (%) <span className="tw-text-red-500">*</span>
                            </h6>
                        </div>
                    </div>

                    <FormikProvider value={addFeeConcessionForm}>
                        <FieldArray name="feeDetails">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }

                                return (
                                    <>
                                        {addFeeConcessionForm.values.feeDetails.length > 0 &&
                                        addFeeConcessionForm.values.feeDetails.map(
                                            (feeInfo: any, index: number) => {
                                                const inputFieldErrors: any =
                                                    Array.isArray(addFeeConcessionForm.errors.feeDetails) &&
                                                        addFeeConcessionForm.errors.feeDetails[index]
                                                        ? addFeeConcessionForm.errors.feeDetails[index]
                                                        : {};

                                                const inputFieldTouched =
                                                    Array.isArray(addFeeConcessionForm.touched.feeDetails) &&
                                                        addFeeConcessionForm.touched.feeDetails[index]
                                                        ? addFeeConcessionForm.touched.feeDetails[index]
                                                        : {};

                                                return (
                                                    <div
                                                        key={feeInfo.uniqueId}
                                                         id={feeInfo.uniqueId}
                                                        className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-3"
                                                    >
                                                        <div className="tw-col-span-3">
                                                            <TextInput
                                                                name={`feeDetails.${index}.categoryName`}
                                                                value={feeInfo.categoryName}
                                                                formgroupClassName="tw-mb-0"
                                                               invalid={(inputFieldTouched.deptId && inputFieldErrors.deptId) ? true : false}
                                                                    error={(inputFieldTouched.deptId && inputFieldErrors.deptId) ? inputFieldErrors.deptId : ""}
                                                                    // isDisabled={!addFeeConcessionForm.values.noOfTerms}
                                                                    isDisabled={true}
                                                            />
                                                        </div>

                                                        <div className="tw-col-span-3">
                                                            <TextInput
                                                                    name={`feeDetails.${index}.feeParticularId`}
                                                                    data-index={index}
                                                                    value={feeInfo.feeParticularName}
                                                                    onChange={addFeeConcessionForm.handleChange}
                                                                    invalid={(inputFieldTouched.feeParticularId && inputFieldErrors.feeParticularId) ? true : false}
                                                                    error={(inputFieldTouched.feeParticularId && inputFieldErrors.feeParticularId) ? inputFieldErrors.feeParticularId : ""}
                                                                    isDisabled={true}
                                                                />
                                                        </div>

                                                        <div className="tw-col-span-3">
                                                            <TextInput
                                                                name={`feeDetails.${index}.curriculumShortName`}
                                                                value={feeInfo.curriculumShortName}
                                                                isDisabled
                                                                invalid={
                                                                    inputFieldTouched.curriculumShortName &&
                                                                    inputFieldErrors.curriculumShortName
                                                                }
                                                                error={
                                                                    inputFieldErrors.curriculumShortName || ""
                                                                }
                                                            />
                                                        </div>

                                                        <div className="tw-col-span-3">
                                                            <div className="tw-flex tw-items-center">
                                                                <TextInput
                                                                    name={`feeDetails.${index}.percValue`}
                                                                    value={feeInfo.percValue}
                                                                    formgroupClassName="tw-mb-0"
                                                                    onChange={addFeeConcessionForm.handleChange}
                                                                    onBlur={addFeeConcessionForm.handleBlur}
                                                                    invalid={(inputFieldTouched.percValue && inputFieldErrors.percValue) ? true : false}
                                                                        error={(inputFieldTouched.percValue && inputFieldErrors.percValue) ? inputFieldErrors.percValue : ""}
                                                                    maxLength={10}
                                                                />
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
            </div>

            <div className="tw-border-t tw-border-gray-200 tw-p-4">
                <div className="tw-flex tw-justify-end tw-gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </form>

    )
}

export default AddEditFeeConcession;