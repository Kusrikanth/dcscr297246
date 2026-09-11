import React, { useState, useEffect, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { Label, Input } from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from "yup";
import {
    UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem,
    Collapse
} from "reactstrap";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";
//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    UploadImage,
    RadioInputContainer, UploadImageUpdated, TextInputWithRegex, MultiSelect, MemoizedSelectInput
} from "../../../../../../../Components/Common";
//helper
import { yesNoOptions, designationOptions, trueFalseOptions } from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import { uploadImageFileErrorHndlr } from "../../../../../../../utility/commonutility";

import {
    getRelationTypeAct
} from "../../../../../../../store/masterdata/masterdataactions";


// Old State
// export function getGuardianInitialState(initialState: any) {
//     return {
//         guardianName: initialState?.guardianName || "Guardian Name",
//         guardianDocumentType: initialState?.guardianDocumentType || "Aadhar",
//         guardianAadharNo: initialState?.guardianAadharNo || "24343232432",
//         guardianEmail: initialState?.guardianEmail || "guradina@gmail.com",
//         guardianPhoneNo: initialState?.guardianPhoneNo || "1234567890",
//         relationWithStudent: initialState?.relationWithStudent || "1",
//         guardianOccupationId: initialState?.guardianOccupationId || "1",
//         guardianDesignationId: initialState?.guardianDesignationId || "1",
//     }
// }


function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}

export function getGuardianInitialState(initialState?: any) {
    return {
        isGuardianPresent: initialState?.isGuardianPresent || "false",
        guardianName: initialState?.guardianName || "",
        guardianAadharNo: initialState?.guardianAadharNo || "",
        guardianEmail: initialState?.guardianEmail || "",
        guardianPhoneNo: initialState?.guardianPhoneNo || "",
        guardianQualificationId: initialState?.guardianQualificationId || "",
        guardianOccupationId: initialState?.guardianOccupationId || "",
        guardianNationalityId: initialState?.guardianNationalityId || "1",
        guardianDesignationId: initialState?.guardianDesignationId || "",
        relationWithStudent: initialState?.relationWithStudent || "",
        guardianContributeStakeHolder: initialState?.guardianContributeStakeHolder || [],
    }
}

const validationSchema = Yup.object().shape({
    // guardianName: Yup.string().required("Guardian name required."),
    // guardianAadharNo: Yup.string().matches(/^[0-9]{12,12}$/, 'Aadhar card number should be 12 digit.').required("Aadhar number required."),
    // guardianEmail: Yup.string().required('Email id required.').email("Enter valid email."),
    // guardianPhoneNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required."),
    // relationWithStudent: Yup.string().required("Select gender."),
    // guardianOccupationId: Yup.string().required("Select ouccupation id."),
    // guardianDesignationId: Yup.string().required("Destination id required."),
});

const initialValues = getGuardianInitialState();
export default function GuardianDetails({
    formId, occupationResp, designationListResp,
    qualificationsListResp, stakeHolderList, storeMultiFormDataCallback
}: any) {
    const [selectedStakeHolderListState, setSelectedFeeCategoryListState] = useState<any>([]);

    const { currentMultiFormKeys } = useContext<any>(StepperFormContext);
    const dispatch = useAppDispatch();
    const { relationTypeListResp } =
        useAppSelector(({ masterData, instAcademics }) => ({
            relationTypeListResp: masterData.relationTypeListResp
        }), shallowEqual);


    useEffect(() => {
        dispatch(getRelationTypeAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "RELATION", pageNo: 0, pageSize: 100 })));
    }, []);

    const guardianForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = { ...values };
            payload.guardianContributeStakeHolder = selectedStakeHolderListState.map((item: any) => item.stakeHolder);
            storeMultiFormDataCallback(formId, true, payload);
        }
    });
    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        guardianForm.setFieldValue(name, updateDate);
    }

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId))
            guardianForm.handleSubmit();
    }, [currentMultiFormKeys]);

    function hasGuardianHnldr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (value === "false") {
            guardianForm.resetForm({
                values: getGuardianInitialState(undefined)
            });
        } else {
            guardianForm.setFieldValue(name, value);
        }
    }


    function onSelectStakeHolderHndlr(selectItem: any) {
        setSelectedFeeCategoryListState(selectItem);
        if (selectItem.length > selectedStakeHolderListState.length) {
            const selectedId = selectItem.map((item: any) => item.id);
            const prevSelectedId = selectedStakeHolderListState.map((item: any) => item.id),
                addedItem = selectItem.find((item: any) => (!prevSelectedId.includes(item.id)));
            if (addedItem.id) {
                guardianForm.setValues((prevState: any) => ({
                    ...prevState,
                    guardianContributeStakeHolder: selectedId,
                }));
            }
        } else if (selectItem.length < selectedStakeHolderListState.length) {
            const selectedId = selectItem.map((item: any) => item.id),
                removedItemId = selectedStakeHolderListState.find((item: any) => (!selectedId.includes(item.id)));
            if (removedItemId.id) {
                guardianForm.setValues((prevState: any) => ({
                    ...prevState,
                    guardianContributeStakeHolder: selectedId,
                }));
            }
        } else {
            guardianForm.setValues((prevState: any) => ({
                ...prevState,
                guardianContributeStakeHolder: []
            }));
        }
    }
    return (
        <React.Fragment>
            <form id="student-info-form" onSubmit={guardianForm.handleSubmit}>
                <AccordionHeader tag="h4" targetId="guardian-info">
                    Guardian Info
                </AccordionHeader>
                <AccordionBody accordionId="guardian-info">
                    <div className="row">
                        <div className="col-4">
                            <RadioInputContainer
                                name="isGuardianPresent"
                                labelText="Guardian ?"
                                inputContainerClassName="mt-2"
                                radioOptions={trueFalseOptions}
                                value={guardianForm.values.isGuardianPresent}
                                onChange={hasGuardianHnldr}
                            />
                        </div>
                        <div className="col-4">
                            <TextInput
                                name="guardianName"
                                labelText="Name"
                                // formgroupClassName="mb-4"
                                value={guardianForm.values.guardianName}
                                onChange={guardianForm.handleChange}
                                onBlur={guardianForm.handleBlur}
                                invalid={(guardianForm.touched.guardianName && guardianForm.errors.guardianName) ? true : false}
                                error={(guardianForm.touched.guardianName && guardianForm.errors.guardianName) ? guardianForm.errors.guardianName : ""}
                                isDisabled={guardianForm.values.isGuardianPresent === "false"}
                            />
                        </div>
                        <div className="col-4">
                            <TextInputWithRegex
                                name="guardianAadharNo"
                                labelText="Aadhar Number"
                                // formgroupClassName="mb-4"
                                value={guardianForm.values.guardianAadharNo}
                                onChange={guardianForm.handleChange}
                                onBlur={guardianForm.handleBlur}
                                invalid={(guardianForm.touched.guardianAadharNo && guardianForm.errors.guardianAadharNo) ? true : false}
                                error={(guardianForm.touched.guardianAadharNo && guardianForm.errors.guardianAadharNo) ? guardianForm.errors.guardianAadharNo : ""}
                                isDisabled={guardianForm.values.isGuardianPresent === "false"}
                                maxLength={12}
                                allowedInputRegex="^[0-9]+$"
                            />
                        </div>
                        <div className="col-4">
                            <TextIconInput
                                name="guardianEmail"
                                labelText="Email ID"
                                value={guardianForm.values.guardianEmail}
                                onChange={guardianForm.handleChange}
                                onBlur={guardianForm.handleBlur}
                                invalid={(guardianForm.touched.guardianEmail && guardianForm.errors.guardianEmail) ? true : false}
                                error={(guardianForm.touched.guardianEmail && guardianForm.errors.guardianEmail) ? guardianForm.errors.guardianEmail : ""}
                                isDisabled={guardianForm.values.isGuardianPresent === "false"}
                            ><i className="ri-mail-unread-line"></i></TextIconInput>
                        </div>
                        <div className="col-4">
                            <PhoneInput
                                name="guardianPhoneNo"
                                labelText="Phone No."
                                value={guardianForm.values.guardianPhoneNo}
                                onChange={onChangePhoneInput}
                                onBlur={guardianForm.handleBlur}
                                invalid={(guardianForm.touched.guardianPhoneNo && guardianForm.errors.guardianPhoneNo) ? true : false}
                                error={(guardianForm.touched.guardianPhoneNo && guardianForm.errors.guardianPhoneNo) ? guardianForm.errors.guardianPhoneNo : ""}
                                isDisabled={guardianForm.values.isGuardianPresent === "false"}
                            />
                        </div>
                        <div className="col-4">
                            <MemoizedSelectInput
                                name="guardianQualificationId"
                                labelText="Qualification"
                                value={guardianForm.values.guardianQualificationId}
                                onChange={guardianForm.handleChange}
                                onBlur={guardianForm.handleBlur}
                                invalid={(guardianForm.touched.guardianQualificationId && guardianForm.errors.guardianQualificationId) ? true : false}
                                error={(guardianForm.touched.guardianQualificationId && guardianForm.errors.guardianQualificationId) ? guardianForm.errors.guardianQualificationId : ""}
                                menuItems={qualificationsListResp?.data}
                                valueKey="id"
                                textKey="qualification"
                            />
                        </div>
                        <div className="col-4">
                            <SelectInput
                                name="relationWithStudent"
                                labelText="Relation Type"
                                value={guardianForm.values.relationWithStudent}
                                onChange={guardianForm.handleChange}
                                onBlur={guardianForm.handleBlur}
                                invalid={(guardianForm.touched.relationWithStudent && guardianForm.errors.relationWithStudent) ? true : false}
                                error={(guardianForm.touched.relationWithStudent && guardianForm.errors.relationWithStudent) ? guardianForm.errors.relationWithStudent : ""}
                                menuItems={relationTypeListResp?.data}
                                valueKey="id"
                                textKey="relationType"
                                isDisabled={guardianForm.values.isGuardianPresent === "false"}
                            />
                        </div>
                        <div className="col-4">
                            <SelectInput
                                name="guardianOccupationId"
                                labelText="Occupation"
                                value={guardianForm.values.guardianOccupationId}
                                onChange={guardianForm.handleChange}
                                onBlur={guardianForm.handleBlur}
                                invalid={(guardianForm.touched.guardianOccupationId && guardianForm.errors.guardianOccupationId) ? true : false}
                                error={(guardianForm.touched.guardianOccupationId && guardianForm.errors.guardianOccupationId) ? guardianForm.errors.guardianOccupationId : ""}
                                menuItems={occupationResp?.data}
                                valueKey="occupationId"
                                textKey="occupationName"
                                isDisabled={guardianForm.values.isGuardianPresent === "false"}
                            />
                        </div>
                        <div className="col-4">
                            <MemoizedSelectInput
                                name="guardianDesignationId"
                                labelText="Designation"
                                value={guardianForm.values.guardianDesignationId}
                                onChange={guardianForm.handleChange}
                                onBlur={guardianForm.handleBlur}
                                invalid={(guardianForm.touched.guardianDesignationId && guardianForm.errors.guardianDesignationId) ? true : false}
                                error={(guardianForm.touched.guardianDesignationId && guardianForm.errors.guardianDesignationId) ? guardianForm.errors.guardianDesignationId : ""}
                                menuItems={designationListResp?.data}
                                valueKey="id"
                                textKey="designationName"
                                isDisabled={guardianForm.values.isGuardianPresent === "false"}
                            />

                        </div>
                        <div className="col-12">
                            <MultiSelect
                                name="contributeStakeHolder"
                                value={selectedStakeHolderListState}
                                onChange={onSelectStakeHolderHndlr}
                                menuItems={stakeHolderList?.data}
                                valueKey="id"
                                textKey="stakeHolder"
                                inputClassName="bg-soft-light"
                                labelText="Contribute Stake Holder"
                            />
                        </div>
                        {/* <div className="col-12">
                            <input type="submit" value="Father Info" />
                        </div> */}
                    </div>
                </AccordionBody>
            </form>
        </React.Fragment>

    )
}