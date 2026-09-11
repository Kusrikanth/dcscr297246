import React, { useState, useEffect, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { Label, Input } from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from "yup";
import {
    UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem,
    Collapse
} from "reactstrap";
import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    UploadImage,
    RadioInputContainer, UploadImageUpdated, TextInputWithRegex,
    CustomSelect
} from "../../../../../Components/Common";
//helper
import { yesNoOptions, designationOptions, trueFalseOptions } from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { uploadImageFileErrorHndlr } from "../../../../../utility/commonutility";

import {
    getRelationTypeAct
} from "../../../../../store/masterdata/masterdataactions";


// Old State
// export function getGuardianInitialState(initialState: any) {
//     return {
//         guardianName: initialState?.guardianName || "Guardian Name",
//         guardianDocumentType: initialState?.guardianDocumentType || "Aadhar",
//         guardianDocumentNumber: initialState?.guardianDocumentNumber || "24343232432",
//         guardianEmailId: initialState?.guardianEmailId || "guradina@gmail.com",
//         guardianContactNo: initialState?.guardianContactNo || "1234567890",
//         guardianRelationTypeId: initialState?.guardianRelationTypeId || "1",
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

export function getGuardianInitialState(initialState: any) {
    return {
        isGuardianRequired: getTrueFalseOptions(initialState?.isGuardianRequired),
        guardianName: initialState?.guardianName || "",
        guardianDocumentType: initialState?.guardianDocumentType || "",
        guardianDocumentNumber: initialState?.guardianDocumentNumber || "",
        guardianEmailId: initialState?.guardianEmailId || "",
        guardianContactNo: initialState?.guardianContactNo || "",
        guardianRelationTypeId: initialState?.guardianRelationTypeId || "",
        guardianOccupationId: initialState?.guardianOccupationId || "",
        guardianDesignationId: initialState?.guardianDesignationId || "",
    }
}

const validationSchema = Yup.object().shape({
    guardianName: Yup.string().required("Guardian name required."),
    guardianDocumentNumber: Yup.string().matches(/^[0-9]{12,12}$/, 'Aadhar card number should be 12 digit.').required("Aadhar number required."),
    guardianEmailId: Yup.string().required('Email id required.').email("Enter valid email."),
    guardianContactNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required."),
    guardianRelationTypeId: Yup.string().required("Select gender."),
    guardianOccupationId: Yup.string().required("Select ouccupation id."),
    guardianDesignationId: Yup.string().required("Destination id required."),
});


export default function GuardianDetails({ occupationResp, designationListResp, qualificationsListResp }: any) {
    const [guardianImgFileState, setGuardianImgFileState] = useState<any>("");
    const [fileUploadErrorMessageState, setFileUploadErrorMessageState] = useState<string>("");
    const guardianImgFileRef = useRef<any>(null);

    const { currentMultiFormKeys, editStudentData, storeMultiFormData } = useContext<any>(StepperFormContext);
    const [guardianDetailState, setGuardianDetailState] = useState<any>(() => {
        const { fatherDetails } = editStudentData || {},
            { formData } = fatherDetails || {};
        return getGuardianInitialState(formData)
    });
    const dispatch = useAppDispatch();
    const { relationTypeListResp } =
        useAppSelector(({ masterData, instAcademics }) => ({
            relationTypeListResp: masterData.relationTypeListResp
        }), shallowEqual);


    useEffect(() => {
        dispatch(getRelationTypeAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "RELATION", pageNo: 0, pageSize: 100 })));
    }, []);

    const guardianForm = useFormik({
        enableReinitialize: true,
        initialValues: guardianDetailState,
        validationSchema,
        onSubmit: (values) => {
            const { guardianDetails } = editStudentData || {},
                { formData } = guardianDetails || {};
            const payload = {
                guardianImage: guardianImgFileRef.current,
                guardianImageBase64: guardianImgFileRef.current ? "" : formData?.guardianImageBase64,
                ...values
            }
            storeMultiFormData("guardianDetails", true, payload);
        },
    });
    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        guardianForm.setFieldValue(name, updateDate);
    }

    useEffect(() => {
        const { guardianDetails } = editStudentData || {},
            { formData } = guardianDetails || {};
        if (formData) {
            const { guardianImage, guardianImageBase64 } = formData;
            if (guardianImageBase64) {
                setGuardianImgFileState(`data:image/jpeg;base64, ${guardianImageBase64}`);
            } else if (guardianImage) {
                guardianImgFileRef.current = guardianImage;
                setGuardianImgFileState(URL.createObjectURL(guardianImage));
            }
            setGuardianDetailState(getGuardianInitialState(formData))
        }
    }, [editStudentData]);

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("guardianDetails"))
            submitHandler();
    }, [currentMultiFormKeys]);

    function submitHandler() {
        const { isGuardianRequired } = guardianForm.values;
        if (isGuardianRequired === "false") {
            storeMultiFormData("guardianDetails", true, null);
        } else {
            guardianForm.handleSubmit();
        }
    }

    function handleFileUploadHnlr(event: any) {
        const file = event.target.files[0];
        const uploadFileMessage = uploadImageFileErrorHndlr(file.size, file.type);
        if (uploadFileMessage && typeof (uploadFileMessage) === "string") {
            setFileUploadErrorMessageState(uploadFileMessage);
            return;
        }
        setFileUploadErrorMessageState("");
        guardianImgFileRef.current = event.target.files[0];
        setGuardianImgFileState(URL.createObjectURL(file));
    }

    function renderOccuptaionValueSection(selectedItem: any) {
        return selectedItem?.occupationName || "";
    }

    function renderOccuptaionOptions(item: any) {
        return item?.occupationName?.toString() || "";
    }

    function handleOccupationChange(selected: any, config: any) {
        const { name } = config;
        guardianForm.setFieldValue(name, selected);
    }

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
    return (
        <React.Fragment>
            <form id="student-info-form" onSubmit={guardianForm.handleSubmit}>
                <AccordionHeader tag="h4" targetId="guardian-info">
                    Guardian Info
                </AccordionHeader>
                <AccordionBody accordionId="guardian-info">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                        <div className="tw-col-span-4">
                                <UploadImageUpdated
                                    name="guardian-image"
                                    acceptFileFormat="image/jpg, image/png, image/jpeg"
                                    value={guardianImgFileState}
                                    onChange={handleFileUploadHnlr}
                                    isDisabled={guardianForm.values.isGuardianRequired === "false"}
                                    error={fileUploadErrorMessageState}
                                />
                            </div>

                        <div className="tw-col-span-8">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                                <div className="tw-col-span-6">
                                    <RadioInputContainer
                                        name="isGuardianRequired"
                                        labelText="Guardian ?"
                                        inputContainerClassName="tw-mt-2"
                                        radioOptions={trueFalseOptions}
                                        value={guardianForm.values.isGuardianRequired}
                                        onChange={hasGuardianHnldr}
                                    />
                                </div>
                                <div className="tw-col-span-6">
                                    <TextInput
                                        name="guardianName"
                                        labelText="Name"
                                        // formgroupClassName="mb-4"
                                        value={guardianForm.values.guardianName}
                                        onChange={guardianForm.handleChange}
                                        onBlur={guardianForm.handleBlur}
                                        labelClass="required"
                                        invalid={(guardianForm.touched.guardianName && guardianForm.errors.guardianName) ? true : false}
                                        error={(guardianForm.touched.guardianName && guardianForm.errors.guardianName) ? guardianForm.errors.guardianName : ""}
                                        isDisabled={guardianForm.values.isGuardianRequired === "false"}
                                    />
                                </div>
                                <div className="tw-col-span-6">
                                    <TextInputWithRegex
                                        name="guardianDocumentNumber"
                                        labelText="Aadhar Number"
                                        // formgroupClassName="mb-4"
                                        value={guardianForm.values.guardianDocumentNumber}
                                        onChange={guardianForm.handleChange}
                                        onBlur={guardianForm.handleBlur}
                                        invalid={(guardianForm.touched.guardianDocumentNumber && guardianForm.errors.guardianDocumentNumber) ? true : false}
                                        error={(guardianForm.touched.guardianDocumentNumber && guardianForm.errors.guardianDocumentNumber) ? guardianForm.errors.guardianDocumentNumber : ""}
                                        isDisabled={guardianForm.values.isGuardianRequired === "false"}
                                        maxLength={12}
                                        labelClass="required"
                                        allowedInputRegex="^[0-9]+$"
                                    />
                                </div>

                                <div className="tw-col-span-6">
                                    <TextIconInput
                                        name="guardianEmailId"
                                        labelText="Email ID"
                                        value={guardianForm.values.guardianEmailId}
                                        onChange={guardianForm.handleChange}
                                        onBlur={guardianForm.handleBlur}
                                        labelClass="required"
                                        invalid={(guardianForm.touched.guardianEmailId && guardianForm.errors.guardianEmailId) ? true : false}
                                        error={(guardianForm.touched.guardianEmailId && guardianForm.errors.guardianEmailId) ? guardianForm.errors.guardianEmailId : ""}
                                        isDisabled={guardianForm.values.isGuardianRequired === "false"}
                                    ><i className="ri-mail-unread-line"></i></TextIconInput>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                        <div className="tw-col-span-4">
                            <PhoneInput
                                name="guardianContactNo"
                                labelText="Phone No."
                                value={guardianForm.values.guardianContactNo}
                                onChange={onChangePhoneInput}
                                onBlur={guardianForm.handleBlur}
                                labelClass="required"
                                invalid={(guardianForm.touched.guardianContactNo && guardianForm.errors.guardianContactNo) ? true : false}
                                error={(guardianForm.touched.guardianContactNo && guardianForm.errors.guardianContactNo) ? guardianForm.errors.guardianContactNo : ""}
                                isDisabled={guardianForm.values.isGuardianRequired === "false"}
                            />
                        </div>
                        <div className="tw-col-span-4">
                            <SelectInput
                                name="guardianRelationTypeId"
                                labelText="Relation Type"
                                value={guardianForm.values.guardianRelationTypeId}
                                onChange={guardianForm.handleChange}
                                onBlur={guardianForm.handleBlur}
                                labelClass="required"
                                invalid={(guardianForm.touched.guardianRelationTypeId && guardianForm.errors.guardianRelationTypeId) ? true : false}
                                error={(guardianForm.touched.guardianRelationTypeId && guardianForm.errors.guardianRelationTypeId) ? guardianForm.errors.guardianRelationTypeId : ""}
                                menuItems={relationTypeListResp?.data}
                                valueKey="id"
                                textKey="relationType"
                                isDisabled={guardianForm.values.isGuardianRequired === "false"}
                            />
                        </div>
                        <div className="tw-col-span-4">
                            <CustomSelect
                                name="guardianOccupationId"
                                labelText="Occupation"
                                value={guardianForm.values.guardianOccupationId}
                                options={occupationResp?.data}
                                idKey="occupationId"
                                searchKey="occupationName"
                                renderValue={renderOccuptaionValueSection}
                                renderOptions={renderOccuptaionOptions}
                                onChange={handleOccupationChange}
                                labelClass="required"
                                defaultSelect="Select"
                                invalid={(guardianForm.touched.guardianOccupationId && guardianForm.errors.guardianOccupationId) ? true : false}
                                error={(guardianForm.touched.guardianOccupationId && guardianForm.errors.guardianOccupationId) ? guardianForm.errors.guardianOccupationId : ""}
                                isDisabled={guardianForm.values.isGuardianRequired === "false"}
                            />
                            {/* <TextInput
                                name="guardianOccupationId"
                                labelText="Occupation"
                                value={guardianForm.values.guardianOccupationId}
                                onChange={guardianForm.handleChange}
                                invalid={(guardianForm.touched.guardianOccupationId && guardianForm.errors.guardianOccupationId) ? true : false}
                                error={(guardianForm.touched.guardianOccupationId && guardianForm.errors.guardianOccupationId) ? guardianForm.errors.guardianOccupationId : ""}
                            /> */}
                        </div>
                        <div className="tw-col-span-4">
                            <TextInput
                                name="guardianDesignationId"
                                labelText="Designation"
                                value={guardianForm.values.guardianDesignationId}
                                onChange={guardianForm.handleChange}
                                onBlur={guardianForm.handleBlur}
                                labelClass="required"
                                invalid={(guardianForm.touched.guardianDesignationId && guardianForm.errors.guardianDesignationId) ? true : false}
                                error={(guardianForm.touched.guardianDesignationId && guardianForm.errors.guardianDesignationId) ? guardianForm.errors.guardianDesignationId : ""}
                                isDisabled={guardianForm.values.isGuardianRequired === "false"}
                            />
                            {/* <TextInput
                                name="guardianDesignationId"
                                labelText="Designation"
                                value={guardianForm.values.guardianDesignationId}
                                onChange={guardianForm.handleChange}
                                invalid={(guardianForm.touched.guardianDesignationId && guardianForm.errors.guardianDesignationId) ? true : false}
                                error={(guardianForm.touched.guardianDesignationId && guardianForm.errors.guardianDesignationId) ? guardianForm.errors.guardianDesignationId : ""}
                            /> */}
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