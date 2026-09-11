import React, { useState, useContext, useEffect, useMemo, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { Label, Input } from "reactstrap";
import * as Yup from "yup";
//Common Component
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
import GuardianDetail, { getGuardianInitialState } from "./GuardianDetail";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";

import FatherInfo, { getFatherInfoInitialState } from "./FatherInfo";
import MotherInfo, { getMotherInfoInitialState } from "./MotherInfo";
//Action Generator
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import {
    getOccupationAct, getQualificationAct, getDesignationsAct,
    setQualificationListAct,
    setDesignationsAct,
} from "../../../../../../store/masterdata/masterdataactions";
import { TABS_ACTIONS, StepperFormContext, stepInfo, trueFalseOptions } from "../helper";
import {
    getContributeStakeholderAct
} from "../../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import {
    updateParentDetailsAct, getParentDetailsByRegNoAct
} from "../../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { BrowseFile, RadioInputContainer, SelectInput, UploadFileInput } from "../../../../../../Components/Common";
import { setNestedObjectValues, useFormik } from "formik";
import { getTrueFalseOptions } from "../../../../../../utility/commonutility";
import { uploadFileErrorHndlr } from "./helper";
import Button from "../../../../../../Components/Common/Button";

export function getParentGuardianInitialState(initialState?: any) {
    return {
        isMotherSingleParent: getTrueFalseOptions(initialState?.isMotherSingleParent),
        singleParentType: initialState?.singleParentType || "",
        document: initialState?.document || "",
        originalFileName: initialState?.originalFileName || "",
        singleParentTypeReason: initialState?.singleParentTypeReason || "",
        parentDocUrl: initialState?.parentDocUrl || "",
    }
}

const validationSchema = Yup.object().shape({
    singleParentType: Yup.string().when('isMotherSingleParent', {
        is: (isMotherSingleParent: any) => isMotherSingleParent === "true",
        then: Yup.string()
            .required('Single parent type is required.')
    }),
    singleParentTypeReason: Yup.string().when('singleParentType', {
        is: (singleParentType: any) => singleParentType,
        then: Yup.string()
            .required('Parent Status is required.')
    }),
    document: Yup.string().when(['isMotherSingleParent', 'originalFileName'], {
        is: (isMotherSingleParent: any, originalFileName: any) => isMotherSingleParent === "true" && !originalFileName,
        then: Yup.string().required('Document is required.'),
    }),
});


const initialValues = getParentGuardianInitialState();
const ParentGuardian: React.FC<any> = ({ stepId }) => {
    const { isViewMode, tabsData, studentId, setTabsDataHandler,
        nextStepHndlr,
        submitCurrentFormCllbck } = useContext<any>(StepperFormContext);
    const dispatch = useAppDispatch();
    const parentGuradianForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            //We have custom implementation
        }
    })

    const currentStepMultiFormKeys = useMemo(() => {
        if (stepId) {
            const { multiFormKeys } = stepInfo.find(item => item.id === stepId) || {};
            const { singleParentType } = parentGuradianForm.values;
            if (Array.isArray(multiFormKeys)) {
                if (singleParentType === 'Father') {
                    return multiFormKeys.filter(item => item !== 'motherInfo')
                } else if (singleParentType === 'Mother') {
                    return multiFormKeys.filter(item => item !== 'fatherInfo')
                }
                return multiFormKeys;
            }
            return [];
        }
        return [];
    }, [stepId, parentGuradianForm.values]);

    const multiFormKeysToValidate = useRef(new Set(["singleParentTypeReason", "document"]));
    const childFormDataRef = useRef<any>({
        fatherInfo: {
            isValid: false,
            isDirty: false,
            formData: undefined,
        },
        motherInfo: {
            isValid: false,
            isDirty: false,
            formData: undefined
        },
        guardianInfo: {
            isValid: false,
            isDirty: false,
            formData: undefined
        },
        singleParentTypeReason: {
            isValid: false,
            isDirty: false,
            formData: undefined
        },
        document: {
            isValid: false,
            isDirty: false,
            formData: undefined
        }
    });
    const { showApiLoader, parentDetailsByRegNoResp, updateParentDetailsResp } = useAppSelector(({ masterData,
        globalData, admissionRegistration }) => ({
            showApiLoader: globalData.showApiLoader,
            parentDetailsByRegNoResp: admissionRegistration.parentDetailsByRegNoResp,
            updateParentDetailsResp: admissionRegistration.updateParentDetailsResp
        }), shallowEqual);

    const parentRespRef = useRef({
        prevUpdateParentDetailsResp: updateParentDetailsResp,
        prevParentDetailsByRegNoResp: parentDetailsByRegNoResp
    });

    useEffect(() => {
        if (studentId) {
            const params = { studentRegNo: studentId };
            dispatch(getParentDetailsByRegNoAct(generateActionPayload("get_parent_detailsbyid", params)));
        }
    }, [studentId]);


    useEffect(() => {
        if (tabsData[stepId]) {
            const formData = getParentGuardianInitialState(tabsData[stepId]);
            parentGuradianForm.resetForm({
                values: formData
            });
        }
    }, [tabsData, stepId]);

    useEffect(() => {
        const { prevUpdateParentDetailsResp, prevParentDetailsByRegNoResp } = parentRespRef.current;
        if (updateParentDetailsResp && prevUpdateParentDetailsResp !== updateParentDetailsResp) {
            toast.success("Parent details updated successfully.");
            nextStepHndlr(stepId, null);
        } else if (parentDetailsByRegNoResp && prevParentDetailsByRegNoResp !== parentDetailsByRegNoResp) {
            setTabsDataHandler(stepId, parentDetailsByRegNoResp);
        }
        parentRespRef.current.prevUpdateParentDetailsResp = updateParentDetailsResp;
        parentRespRef.current.prevParentDetailsByRegNoResp = parentDetailsByRegNoResp;
    }, [updateParentDetailsResp, parentDetailsByRegNoResp]);

    useEffect(() => {
        dispatch(getOccupationAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "occupation", pageSize: "5000" })));
    }, []);

    function submitParentDetailsApiCall() {
        const formDetails: any = { guardianInfo: childFormDataRef.current?.guardianInfo, fatherInfo: childFormDataRef.current?.fatherInfo, motherInfo: childFormDataRef.current?.motherInfo };
        const payload = Object.keys(formDetails).reduce((obj, item) => {
            Object.assign(obj, formDetails[item]?.formData);
            return obj
        }, {});
        const params = { studentId };
        const formData = new FormData();
        const { isMotherSingleParent, singleParentType, singleParentTypeReason } = parentGuradianForm.values || {}
        formData.append('requestPayload', JSON.stringify({ ...{ isMotherSingleParent, singleParentType, singleParentTypeReason }, ...payload }));
        if (parentGuradianForm.values.document) {
            formData.append('file', parentGuradianForm.values.document);
        }
        dispatch(updateParentDetailsAct(generateActionPayload("add_parent_details", params, formData)));
    }

    const storeMultiFormDataCallback = useCallback((multiFormKey: string, isValid: boolean, isDirty: boolean, formData: any) => {
        if (Array.isArray(currentStepMultiFormKeys) && childFormDataRef.current[multiFormKey]) {
            let allFormsValid: boolean = true, anyFormDirty = false;
            childFormDataRef.current[multiFormKey] = {
                isValid,
                isDirty,
                formData
            }
            if (parentGuradianForm.values.isMotherSingleParent === "false" || (childFormDataRef.current?.singleParentTypeReason && parentGuradianForm.values.singleParentTypeReason)) {
                childFormDataRef.current["singleParentTypeReason"].isValid = true;
                childFormDataRef.current["document"].isValid = true;
            }
            multiFormKeysToValidate.current.add(multiFormKey);
            if (multiFormKeysToValidate.current.size === currentStepMultiFormKeys.length) {
                for (let i = 0; i < currentStepMultiFormKeys.length; i++) {
                    if (!anyFormDirty && childFormDataRef.current[currentStepMultiFormKeys[i]].isDirty) {
                        anyFormDirty = true;
                    }
                    if (allFormsValid && !childFormDataRef.current[currentStepMultiFormKeys[i]].isValid) {
                        allFormsValid = false;
                        break;
                    }
                }
                if (parentGuradianForm.isValid) {
                    if (allFormsValid && anyFormDirty) {
                        submitParentDetailsApiCall();
                    } else if (!anyFormDirty) {
                        nextStepHndlr(stepId, null);
                    }
                } else {
                    parentGuradianForm.setTouched(setNestedObjectValues<any>(parentGuradianForm.errors, true));
                }
                multiFormKeysToValidate.current = new Set(["singleParentTypeReason", "document"]);
                for (let i = 0; i < currentStepMultiFormKeys.length; i++) {
                    childFormDataRef.current[currentStepMultiFormKeys[i]].isValid = false;
                    childFormDataRef.current[currentStepMultiFormKeys[i]].isDirty = false;
                }
            }
        }
    }, [currentStepMultiFormKeys, parentGuradianForm.values]);

    function previousBtnHndlr(e: any) {
        multiFormKeysToValidate.current = new Set(["singleParentTypeReason", "document"]);
        submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.PREVIOUS_TAB);
    }

    function submitHndlr(e: any) {
        parentGuradianForm.validateForm().then((errorKeys) => {
            if (Object.keys(errorKeys).length === 0) {
                multiFormKeysToValidate.current = new Set(["singleParentTypeReason", "document"]);
                submitCurrentFormCllbck(currentStepMultiFormKeys, TABS_ACTIONS.NEXT_TAB);
            } else {
                parentGuradianForm.setTouched(setNestedObjectValues<any>(errorKeys, true));
            }
        })
    }

    function onChangeSingleParentHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        parentGuradianForm.setValues((prevState: any) => ({
            ...prevState, [name]: value,
            singleParentType: "", singleParentTypeReason: "", originalFileName: "", document: "",
        }))
        setTabsDataHandler(stepId, {
            isMotherSingleParent: parentGuradianForm.values.isMotherSingleParent,
            [name]: value,
            singleParentType: "", singleParentTypeReason: "", originalFileName: "", document: "",
            ...getFatherInfoInitialState(),
            ...getMotherInfoInitialState()
        });
    }
    function onChangeParentStatusHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        parentGuradianForm.setValues((prevState: any) => ({
            ...prevState, [name]: value,
        }))
        if (value) {
            childFormDataRef.current["singleParentTypeReason"].isValid = true;
        }
        childFormDataRef.current["singleParentTypeReason"].isDirty = true;
        childFormDataRef.current["singleParentTypeReason"].formData = value
        setTabsDataHandler(stepId, {
            ...parentGuradianForm.values,
            [name]: value,
        });
    }

    function onChangeParentTypeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (value === 'Father') {
            childFormDataRef.current["motherInfo"].isValid = true;
            childFormDataRef.current["motherInfo"].isDirty = false;
            childFormDataRef.current["motherInfo"].formData = getMotherInfoInitialState();
            setTabsDataHandler(stepId, {
                ...parentGuradianForm.values,
                [name]: value,
                originalFileName: "", document: "", singleParentTypeReason: "",
                ...getMotherInfoInitialState()
            });
        } else if (value === 'Mother') {
            // childFormDataRef.current["fatherInfo"].isValid = true;
            childFormDataRef.current["fatherInfo"].isDirty = false;
            childFormDataRef.current["fatherInfo"].formData = getFatherInfoInitialState();
            setTabsDataHandler(stepId, {
                ...parentGuradianForm.values,
                originalFileName: "", document: "", singleParentTypeReason: "",
                [name]: value, ...getFatherInfoInitialState()
            });
        } else {
            setTabsDataHandler(stepId, {
                ...parentGuradianForm.values,
                [name]: value,
                originalFileName: "", document: "", singleParentTypeReason: "",
                ...getFatherInfoInitialState(),
                ...getFatherInfoInitialState()
            });
        }
        parentGuradianForm.setValues((prevState: any) => ({
            ...prevState, [name]: value,
        }))
    }

    function fileUploadHandler(event: any) {
        const { name } = event.target;
        const file = event.target.files[0];
        const errorMessage = uploadFileErrorHndlr(file.size, file.type);
        if (errorMessage) {
            parentGuradianForm.setFieldTouched(name, true, false);
            parentGuradianForm.setFieldValue(name, "", false);
            parentGuradianForm.setFieldError(name, errorMessage);
        } else {
            parentGuradianForm.setValues(prevValues => ({
                ...prevValues,
                originalFileName: file?.name,
                document: file
            }))
            if (file) {
                childFormDataRef.current["document"].isValid = true;
            }
            childFormDataRef.current["document"].isDirty = true;
            childFormDataRef.current["document"].formData = file;
            setTabsDataHandler(stepId, {
                ...parentGuradianForm.values,
                originalFileName: file?.name,
                document: file,
            });
        }
        event.target.value = '';
    }

    const { isMotherSingleParent, singleParentType } = parentGuradianForm.values;
    return (
        <div className="tw-flex tw-flex-wrap">
            <div className="tw-w-full">
                <div className="tw-px-3">
                    <div className="tw-flex tw-flex-wrap tw-gap-2">
                        <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4">
                            <RadioInputContainer
                                name="isMotherSingleParent"
                                labelText="Is Single Parent ?"
                                radioClassName="form-radio-green"
                                inputContainerClassName="tw-mt-2"
                                radioOptions={trueFalseOptions}
                                isDisabled={isViewMode}
                                value={parentGuradianForm.values.isMotherSingleParent}
                                onChange={onChangeSingleParentHandler}
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4">
                            <SelectInput
                                name="singleParentType"
                                labelText="If Yes Mention Below"
                                labelClass={isMotherSingleParent === "true" ? "required" : ""}
                                menuItems={[{
                                    id: "Father", name: "Father"
                                }, {
                                    id: "Mother", name: "Mother"
                                }]}
                                isDisabled={isViewMode || isMotherSingleParent === "false"}
                                value={parentGuradianForm.values.singleParentType}
                                onChange={onChangeParentTypeHndlr}
                                valueKey="id"
                                textKey="name"
                                invalid={(parentGuradianForm.touched.singleParentType && parentGuradianForm.errors.singleParentType) ? true : false}
                                error={(parentGuradianForm.touched.singleParentType && parentGuradianForm.errors.singleParentType) ? parentGuradianForm.errors.singleParentType : ""}
                            />
                        </div>
                        {parentGuradianForm.values.singleParentType && (
                            <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4">
                                <SelectInput
                                    name="singleParentTypeReason"
                                    labelText="Parent Status"
                                    labelClass={isMotherSingleParent === "true" ? "required" : ""}
                                    menuItems={[{
                                        id: "DIVORCED", name: "Divorce"
                                    }, {
                                        id: "WIDOW", name: "Widow"
                                    }]}
                                    isDisabled={isViewMode || isMotherSingleParent === "false"}
                                    value={parentGuradianForm.values.singleParentTypeReason}
                                    onChange={onChangeParentStatusHandler}
                                    valueKey="id"
                                    textKey="name"
                                    invalid={(parentGuradianForm.touched.singleParentTypeReason && parentGuradianForm.errors.singleParentTypeReason) ? true : false}
                                    error={(parentGuradianForm.touched.singleParentTypeReason && parentGuradianForm.errors.singleParentTypeReason) ? parentGuradianForm.errors.singleParentTypeReason : ""}
                                />
                            </div>
                        )}
                        {parentGuradianForm.values.singleParentType && (
                            <div className={!parentGuradianForm.values.parentDocUrl
                                ? `tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4`
                                : `tw-w-2/3 md:tw-w-1/3 lg:tw-w-1/4 2xl:tw-w-1/6`}>
                                <BrowseFile
                                    containerClassName="tw-mb-3"
                                    labelText="Upload File"
                                    labelClass="required"
                                    name="document"
                                    isDisabled={isViewMode || isMotherSingleParent === "false"}
                                    fileName={parentGuradianForm.values.originalFileName}
                                    onChangeFileHndlr={fileUploadHandler}
                                    invalid={(parentGuradianForm.touched.document && parentGuradianForm.errors.document) ? true : false}
                                    error={(parentGuradianForm.touched.document && parentGuradianForm.errors.document) ? String(parentGuradianForm.errors.document) : ""}
                                />
                            </div>
                        )}
                        {parentGuradianForm.values.parentDocUrl && singleParentType && (
                            <div className="tw-w-1/3 md:tw-w-1/6 lg:tw-w-[8.33%] 2xl:tw-w-[8.33%] tw-flex tw-items-center">
                                <Button
                                    onClick={() => window.open(parentGuradianForm.values.parentDocUrl, "_blank")}
                                    type="button"
                                    variant="info"
                                >
                                    Download
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="tw-w-full">
                <UncontrolledAccordion
                    defaultOpen={["fatherInfo", "motherInfo", "guardianInfo"]}
                    open={["fatherInfo", "motherInfo", "guardianInfo"]}
                    stayOpen>
                    {((isMotherSingleParent === 'true' && singleParentType === 'Father') ||
                        isMotherSingleParent === 'false')
                        && <AccordionItem>
                            <FatherInfo
                                isViewMode={isViewMode}
                                formId="fatherInfo"
                                stepId={stepId}
                                storeMultiFormDataCallback={storeMultiFormDataCallback}
                            />
                        </AccordionItem>}

                    {((isMotherSingleParent === 'true' && singleParentType === 'Mother') ||
                        isMotherSingleParent === 'false') &&
                        <AccordionItem>
                            <MotherInfo
                                isViewMode={isViewMode}
                                formId="motherInfo"
                                stepId={stepId}
                                storeMultiFormDataCallback={storeMultiFormDataCallback}
                            />
                        </AccordionItem>}
                    <AccordionItem>
                        <GuardianDetail
                            isViewMode={isViewMode}
                            formId="guardianInfo"
                            stepId={stepId}
                            storeMultiFormDataCallback={storeMultiFormDataCallback}
                        />
                    </AccordionItem>
                </UncontrolledAccordion>
            </div>

            {!isViewMode && (
                <div className="tw-text-end tw-mt-2 tw-ml-auto tw-flex">
                    <Button
                        disabled={showApiLoader}
                        type="button"
                        onClick={previousBtnHndlr}
                        variant="previous"
                        className="tw-mr-2"
                    >
                        Previous
                    </Button>
                    <Button
                        disabled={showApiLoader}
                        type="button"
                        onClick={submitHndlr}
                        variant="primary"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div >
    )
}

export default ParentGuardian;