import React, { useEffect, useRef, useState, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { MultiSelect, TextInput, SelectInput, RadioInputContainer } from "../../../Components/Common";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

// Formik validation
import * as Yup from "yup";
import { FieldArray, useFormik, ArrayHelpers, FormikProvider } from "formik";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getFeeCategoriesAct, getFeeParticularsAct,addTransportFeeConcessionAct,updateTransportFeeConcessionAct

} from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

//Helper
import { modeOptions, getExperienceOptions } from "./helper";
import Button from "../../../Components/Common/Button";

function getConcessionModalData(editData?: any): any {
    const { transportDetails } = editData || {},
        updatedFeeDetails: any = [],
        categoriesId: any = [];
    if (transportDetails) {
        updatedFeeDetails.push({
            uniqueId: `transportDetails-${transportDetails.deptId}-${transportDetails.feeParticularId}`,
            deptId: transportDetails?.deptId,
            categoryName: transportDetails?.feeInstituteName,
            feeParticularId: transportDetails?.feeParticularId,
            feeParticularName: transportDetails?.feeParticularName,
            percValue: transportDetails?.percValue,
        });
        categoriesId.push(transportDetails?.deptId);
    }
    return {
        concessionType: editData?.concessionType || "EMPLOYEE",
        experience: editData?.experience || "",
        feeCategoriesId: categoriesId,
        mode: editData?.mode || "PERCENTAGE",
        transportDetails: updatedFeeDetails
    }
}


const validationSchema = Yup.object().shape({
    concessionType: Yup.string().required("Concession is required."),
    experience: Yup.string().required("Experience is required."),
    feeCategoriesId: Yup.array().min(1, "Fee category is required."),
    transportDetails: Yup.array().of(
        Yup.object().shape({
            deptId: Yup.string().required("Category required."),
            feeParticularId: Yup.string().required("Fee particular is required.").nullable(),
            percValue: Yup.number().typeError("Enter valid number.").lessThan(101, "Percentage value cannot be more that 100.").required("Percentage required."),
        })
    ),
});

const AddTransportFeeConcession: React.FC<any> = (props) => {
    const [addFeeConcessionState, setAddFeeConcessionState] = useState<any>(() => getConcessionModalData());
    const [selectedFeeCategoryListState, setSelectedFeeCategoryListState] = useState<any>([]);
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const [addedFeeCategoryIdState, setAddedFeeCategoryIdState] = useState(0);

    const experienceOptions: any = useMemo(() => {
        return getExperienceOptions(20);
    }, []);
    const dispatch = useAppDispatch();
    const { feeCategoriesResp, feeParticularsResp, addTransportFeeConcessionResp, updateTransportFeeConcessionResp , showApiLoader } = useAppSelector(({ globalData, masterFeeSettings, masterData }) => ({
        feeCategoriesResp: masterFeeSettings.feeCategoriesResp,
        feeParticularsResp: masterFeeSettings.feeParticularsResp,
        addTransportFeeConcessionResp: masterFeeSettings.addTransportFeeConcessionResp,
        updateTransportFeeConcessionResp: masterFeeSettings.updateTransportFeeConcessionResp,
        masterTermTypesResp: masterData.masterTermTypesResp,
        showApiLoader : globalData.showApiLoader,
    }), shallowEqual);

    const addEditAcademicYearRespRef = useRef({
        prevAddTransportFeeConcessionResp: addTransportFeeConcessionResp,
        prevFeeParticularsResp: feeParticularsResp,
        prevUpdateTransportFeeConcessionResp: updateTransportFeeConcessionResp
    });

    useEffect(() => {
        const { prevAddTransportFeeConcessionResp, prevFeeParticularsResp, prevUpdateTransportFeeConcessionResp } = addEditAcademicYearRespRef.current;
        if (addTransportFeeConcessionResp && addTransportFeeConcessionResp !== prevAddTransportFeeConcessionResp) {
            props.toggle(true);
            toast.success("Transport Fee concession added successfully.");
        }
        else if (feeParticularsResp && prevFeeParticularsResp !== feeParticularsResp) {
            const { data: feeNames } = feeParticularsResp,
                selectedFeeCategoryInfo = feeCategoriesResp?.feeCategoryVOList.find((item: any) =>
                    item.id === addedFeeCategoryIdState);
            if (selectedFeeCategoryInfo && Array.isArray(feeNames) && formikArrayHelpers.current) {
                for (let j = 0; j < feeNames.length; j++) {
                    if (feeNames[j].allowEmployeeConcession === "YES") {
                        formikArrayHelpers?.current.push({
                            uniqueId: `transportDetails-${selectedFeeCategoryInfo.id}-${j}`,
                            deptId: selectedFeeCategoryInfo.id || "",
                            categoryName: selectedFeeCategoryInfo.name || "",
                            feeParticularId: feeNames[j].feeTypeId,
                            feeParticularName: feeNames[j].particularName,
                            percValue: "",
                        });
                    }
                }
            }

        }
        else if (updateTransportFeeConcessionResp && updateTransportFeeConcessionResp !== prevUpdateTransportFeeConcessionResp) {
            props.toggle(true);
            toast.success("Transport Fee concession updated successfully.")
        }
        addEditAcademicYearRespRef.current.prevAddTransportFeeConcessionResp = addTransportFeeConcessionResp;
        addEditAcademicYearRespRef.current.prevFeeParticularsResp = feeParticularsResp;
        addEditAcademicYearRespRef.current.prevUpdateTransportFeeConcessionResp = updateTransportFeeConcessionResp;
    }, [addTransportFeeConcessionResp, feeParticularsResp, updateTransportFeeConcessionResp]);

    useEffect(() => {
        const { instituteId } = props;
        if (instituteId) {
            const payload = { instituteId, pageNo: 0, pageSize: 100 };
            dispatch(getFeeCategoriesAct(generateActionPayload("get_fee_categories", undefined, payload)));
        }
    }, [props.instituteId]);

    useEffect(() => {
        if (props.editModalData && feeCategoriesResp) {
            const { editModalData } = props,
                { transportDetails } = editModalData || {},
                { feeCategoryVOList } = feeCategoriesResp;
            if (transportDetails && Array.isArray(feeCategoryVOList)) {
                const filteredParticulars = feeCategoryVOList.filter(item => item.id === +(transportDetails?.deptId));
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
                const { transportDetails } = values,
                    filteredTerms = transportDetails.map((item: any) => {
                        const { percValue } = item;
                        return ({ percValue })
                    }),
                    params = { feeConcessionId: props.feeConcessionId }, payload = filteredTerms[0];
                dispatch(updateTransportFeeConcessionAct(generateActionPayload("update_transport_fee_concession", params, payload)));
            } else {
                const { feeCategoriesId, transportDetails, ...payload } = values,
                    filterFeeDetails = transportDetails.map((item: any) => {
                        const { uniqueId, categoryName, feeParticularName, ...otherInfo } = item;
                        return otherInfo;
                    }),
                    params = {
                        instituteId: props.instituteId,
                        branchId: props.branchId
                    }
                payload.transportDetails = filterFeeDetails;
                dispatch(addTransportFeeConcessionAct(generateActionPayload("add_transport_fee_concession", params, payload)));
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
                const { transportDetails } = addFeeConcessionForm.values,
                    updatdFeeDetails = transportDetails.filter((item: any) => +item.deptId !== +removedItemId.id);
                addFeeConcessionForm.setValues((prevState: any) => ({
                    ...prevState,
                    feeCategoriesId: selectedId,
                    transportDetails: updatdFeeDetails
                }));
            }
        } else {
            addFeeConcessionForm.setValues((prevState: any) => ({
                ...prevState,
                feeCategoriesId: [], transportDetails: []
            }));
        }
    }

    function getFeeParticularApiCall(feeCategoryId: any) {
        const payload = { instituteId: props.instituteId, branchId: props.branchId, feeCategoryId, pageNo: 0, pageSize: 100 };
        dispatch(getFeeParticularsAct(generateActionPayload("get_fee_particulars", undefined, payload)));
    }

    return (
        <form
            id={props.formId}
            onSubmit={addFeeConcessionForm.handleSubmit}
            className="tw-flex tw-flex-col tw-h-full"
        >
            <div className="tw-flex-1 tw-overflow-y-auto tw-p-6">

                <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <TextInput
                            name="concessionType"
                            labelText="Concession Type"
                            value={addFeeConcessionForm.values.concessionType}
                            onChange={undefined}
                            isDisabled={true}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6">
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

                    <div className="tw-col-span-12">
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

                    <div className="tw-col-span-12 tw-border-b tw-border-gray-200 tw-pb-4">
                        <RadioInputContainer
                            name="mode"
                            labelText="Mode"
                            radioOptions={modeOptions}
                            inputContainerClassName="tw-mt-2"
                            value={addFeeConcessionForm.values.mode}
                            onChange={addFeeConcessionForm.handleChange}
                            isDisabled={true}
                        />
                    </div>
                </div>

                <div className="tw-mt-6">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-2">
                        <div className="tw-col-span-12 md:tw-col-span-4">
                            <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700">
                                Fee Categories <span className="tw-text-red-500">*</span>
                            </h6>
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-4">
                            <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700">
                                Fee Particular <span className="tw-text-red-500">*</span>
                            </h6>
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-4">
                            <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700">
                                Percentage (%) <span className="tw-text-red-500">*</span>
                            </h6>
                        </div>
                    </div>

                    <FormikProvider value={addFeeConcessionForm}>
                        <FieldArray name="transportDetails">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }

                                return (
                                    <>
                                        {addFeeConcessionForm.values.transportDetails.length > 0 &&
                                                addFeeConcessionForm.values.transportDetails.map((feeInfo: any, index: any) => {
                                                    const inputFieldErrors: any = Array.isArray(addFeeConcessionForm.errors.transportDetails) && addFeeConcessionForm?.errors?.transportDetails[index] || {};
                                                    const inputFieldTouched: any = Array.isArray(addFeeConcessionForm.touched.transportDetails) && addFeeConcessionForm?.touched?.transportDetails[index] || {};
                                                    return (
                                                        <div
                                                            key={feeInfo.uniqueId}
                                                            id={feeInfo.uniqueId}
                                                            className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4"
                                                        >
                                                            <div className="tw-col-span-12 md:tw-col-span-4">
                                                                <TextInput
                                                                    name={`transportDetails.${index}.categoryName`}
                                                                    data-index={index}
                                                                    value={feeInfo.categoryName}
                                                                    formgroupClassName="tw-mb-0"
                                                                    onChange={undefined}
                                                                    invalid={(inputFieldTouched.deptId && inputFieldErrors.deptId) ? true : false}
                                                                    error={(inputFieldTouched.deptId && inputFieldErrors.deptId) ? inputFieldErrors.deptId : ""}
                                                                    isDisabled={true}
                                                                />
                                                            </div>

                                                            <div className="tw-col-span-12 md:tw-col-span-4">
                                                                <TextInput
                                                                    name={`transportDetails.${index}.feeParticularId`}
                                                                    data-index={index}
                                                                    value={feeInfo.feeParticularName}
                                                                    onChange={addFeeConcessionForm.handleChange}
                                                                    invalid={(inputFieldTouched.feeParticularId && inputFieldErrors.feeParticularId) ? true : false}
                                                                    error={(inputFieldTouched.feeParticularId && inputFieldErrors.feeParticularId) ? inputFieldErrors.feeParticularId : ""}
                                                                    isDisabled={true}
                                                                />
                                                            </div>

                                                            <div className="tw-col-span-12 md:tw-col-span-4">
                                                                <TextInput
                                                                    name={`transportDetails.${index}.percValue`}
                                                                    value={feeInfo.percValue}
                                                                    formgroupClassName="tw-mb-0"
                                                                    onChange={addFeeConcessionForm.handleChange}
                                                                    onBlur={addFeeConcessionForm.handleBlur}
                                                                    invalid={(inputFieldTouched.percValue && typeof inputFieldErrors === 'object' && inputFieldErrors.percValue) ? true : false}
                                                                        error={(inputFieldTouched.percValue && typeof inputFieldErrors === 'object' && inputFieldErrors.percValue) ? inputFieldErrors.percValue : ""}
                                                                        maxLength={10}
                                                                    />
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

            <div className="tw-border-t tw-border-gray-200 tw-p-4 tw-flex tw-justify-end tw-gap-3">
                <Button
                    type="button"
                    onClick={props.toggle}
                    variant="secondary"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={showApiLoader}
                    variant="primary"
                >
                    Submit
                </Button>
            </div>
        </form>

    )
}

export default AddTransportFeeConcession;